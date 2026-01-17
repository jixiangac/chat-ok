/**
 * 一日清单任务筛选器
 * 
 * 核心功能：
 * 1. 根据5条规则筛选今日应显示的任务
 * 2. 智能分配周期N次任务的显示日期
 * 3. 支持缓存以保持全天一致性
 * 
 * 筛选规则（优先级从高到低）：
 * 1. ✅ 今日必须完成的任务
 * 2. ✅ 有每日打卡目标的任务
 * 3. ❌ 排除：周期内已完成100%的任务
 * 4. 🎯 智能显示：周期内需完成N次的任务
 * 5. ❌ 排除：总目标已完成的任务
 */

import type { Task, CheckInConfig } from '../types';
import { getTodayMustCompleteTaskIds } from './todayMustCompleteStorage';
import { getCurrentCycle } from '../panels/detail/hooks/dateUtils';
import { calculateCheckInProgress } from './progressCalculator';

/**
 * 主筛选函数 - 筛选今日应显示的任务
 * @param tasks 所有任务列表
 * @returns 筛选后的任务列表
 */
export function filterDailyViewTasks(tasks: Task[]): Task[] {
  // 1. 获取今日必须完成的任务ID
  const mustCompleteIds = getTodayMustCompleteTaskIds();
  
  const result: Task[] = [];
  
  // 2. 主线任务必须包含（未完成的）
  const mainlineTasks = tasks.filter(task => 
    task.type === 'mainline' && 
    task.status !== 'COMPLETED' && 
    task.status !== 'ARCHIVED' &&
    (task.progress?.totalPercentage ?? 0) < 100
  );
  result.push(...mainlineTasks);
  
  // 3. 筛选支线任务（CHECK_IN 和 NUMERIC 类型）
  const sidelineTasks = tasks.filter(task => 
    task.type !== 'mainline' && 
    (task.category === 'CHECK_IN' || task.category === 'NUMERIC')
  );
  
  // 4. 应用筛选规则
  const filteredSidelineTasks = sidelineTasks.filter(task => {
    // 规则1: 今日必须完成 - 最高优先级
    if (mustCompleteIds.includes(task.id)) {
      return true;
    }
    
    // 获取进度信息
    const cyclePercentage = task.progress?.cyclePercentage ?? 0;
    const totalPercentage = task.progress?.totalPercentage ?? 0;
    const status = task.status;
    
    // 规则5: 排除总目标已完成
    if (status === 'COMPLETED' || status === 'ARCHIVED' || totalPercentage >= 100) {
      return false;
    }
    
    // 规则3: 排除周期内已完成100% - 直接使用存储的进度值
    if (cyclePercentage >= 100) {
      return false;
    }
    
    // NUMERIC 类型任务：直接显示（有每日目标 perDayAverage）
    if (task.category === 'NUMERIC' && task.numericConfig) {
      return true;
    }
    
    // CHECK_IN 类型任务的筛选逻辑
    const config = task.checkInConfig;
    if (!config) return false;
    
    // 规则2: 有每日打卡目标
    if (hasDailyTarget(config)) {
      return true;
    }
    
    // 规则4: 智能显示周期N次任务
    if (isCycleNTimesTask(config)) {
      return shouldShowCycleNTimesTask(task);
    }
    
    return false;
  });
  
  result.push(...filteredSidelineTasks);
  
  return result;
}

/**
 * 检查是否有每日目标
 * @param config 打卡配置
 * @returns 是否有每日目标
 */
function hasDailyTarget(config: CheckInConfig): boolean {
  return (
    (config.unit === 'TIMES' && (config.dailyMaxTimes || 0) > 0) ||
    (config.unit === 'DURATION' && (config.dailyTargetMinutes || 0) > 0) ||
    (config.unit === 'QUANTITY' && (config.dailyTargetValue || 0) > 0)
  );
}

/**
 * 检查是否为周期N次任务
 * 判断标准：有周期目标次数，但没有每日目标次数
 * @param config 打卡配置
 * @returns 是否为周期N次任务
 */
function isCycleNTimesTask(config: CheckInConfig): boolean {
  return (
    config.unit === 'TIMES' &&
    (config.cycleTargetTimes || 0) > 0 &&
    !(config.dailyMaxTimes && config.dailyMaxTimes > 0)
  );
}

/**
 * 智能判断周期N次任务是否应该显示
 * 
 * 逻辑：
 * 1. 已完成目标次数 -> 不显示
 * 2. 完成率<50% 且 快临期(时间进度>70%) -> 高优先级显示
 * 3. 剩余次数 >= 剩余天数 -> 必须显示
 * 4. 其他情况 -> 基于概率智能分配
 * 
 * @param task 任务对象
 * @returns 是否应该显示
 */
function shouldShowCycleNTimesTask(task: Task): boolean {
  const config = task.checkInConfig;
  if (!config) return false;
  
  try {
    // 获取周期信息
    const cycleInfo = getCurrentCycle(task as any);
    const targetTimes = config.cycleTargetTimes || config.perCycleTarget || 0;
    const completedTimes = cycleInfo.checkInCount;
    
    // 已完成目标次数，不显示
    if (completedTimes >= targetTimes) {
      return false;
    }
    
    // 计算完成率和时间进度
    const completionRate = targetTimes > 0 ? (completedTimes / targetTimes) * 100 : 0;
    const cycleDays = task.cycle.cycleDays;
    const remainingDays = cycleInfo.remainingDays;
    const timeProgress = cycleDays > 0 ? ((cycleDays - remainingDays) / cycleDays) * 100 : 0;
    
    // 完成率低于50% 且 快临期（时间进度>70%）
    if (completionRate < 50 && timeProgress > 70) {
      return true; // 高优先级显示
    }
    
    // 其他情况：智能分配
    const remainingTimes = targetTimes - completedTimes;
    
    // 如果剩余次数 >= 剩余天数，今天必须显示
    if (remainingTimes >= remainingDays) {
      return true;
    }
    
    // 否则，使用伪随机算法均匀分配
    return shouldShowByProbability(task.id, remainingTimes, remainingDays);
  } catch (error) {
    console.error('计算周期N次任务显示状态失败:', error);
    return false;
  }
}

/**
 * 基于概率的伪随机分配（确保每天结果一致）
 * 
 * 算法：
 * 1. 使用任务ID + 当前日期生成稳定的哈希值
 * 2. 计算显示概率 = 剩余次数 / 剩余天数
 * 3. 根据哈希值和概率决定是否显示
 * 
 * @param taskId 任务ID
 * @param remainingTimes 剩余需完成次数
 * @param remainingDays 剩余天数
 * @returns 是否应该显示
 */
function shouldShowByProbability(
  taskId: string,
  remainingTimes: number,
  remainingDays: number
): boolean {
  if (remainingDays <= 0) return true;
  
  // 生成稳定的伪随机数（基于任务ID和日期）
  const today = new Date().toISOString().split('T')[0];
  const seed = hashCode(taskId + today);
  
  // 计算显示概率
  const probability = remainingTimes / remainingDays;
  
  // 根据概率决定是否显示
  return (seed % 100) < (probability * 100);
}

/**
 * 简单哈希函数
 * 用于生成稳定的伪随机数
 * 
 * @param str 输入字符串
 * @returns 哈希值
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}



