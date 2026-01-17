/**
 * 一日清单任务筛选器
 * 
 * 核心功能：
 * 1. 根据规则筛选今日应显示的任务
 * 2. 智能分配周期N次任务的显示日期
 * 3. 支持缓存以保持全天一致性
 * 4. 动态控制时间充裕任务的显示数量
 * 
 * 筛选规则：
 * 排除规则：
 * - 已完成、归档的任务
 * - 总进度≥100%的任务
 * - 当前周期进度≥100%的任务
 * 
 * 必显示规则：
 * - 主线任务
 * - 每日打卡任务（有 dailyTarget）
 * - 快临期任务（剩余≤30%周期时间）
 * - 今日必须完成的任务
 * 
 * 动态显示规则：
 * - 时间充裕任务数量控制
 * - 加权概率选择（完成率越低权重越高）
 */

import dayjs from 'dayjs';
import type { Task, CheckInConfig } from '../types';
import { getTodayMustCompleteTaskIds } from './todayMustCompleteStorage';
import { getCurrentCycle } from '../panels/detail/hooks/dateUtils';
import { calculateCheckInProgress } from './progressCalculator';
import { getCurrentDate } from './dateTracker';

/**
 * 主筛选函数 - 筛选今日应显示的任务
 * @param tasks 所有任务列表
 * @returns 筛选后的任务列表
 */
export function filterDailyViewTasks(tasks: Task[]): Task[] {
  // 1. 获取今日必须完成的任务ID
  const mustCompleteIds = getTodayMustCompleteTaskIds();
  
  const currentDate = getCurrentDate();
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
  
  // 4. 暂存周期N次任务
  const pendingCycleNTimesTasks: Task[] = [];
  
  // 5. 应用筛选规则
  const filteredSidelineTasks = sidelineTasks.filter(task => {

    if ( task?.isPlanEnded ) {
      return false;
    }

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
    
    // 规则2: 有每日打卡目标（TIMES类型需要cycleDays等于cycleTargetTimes才算每日打卡）
    if (hasDailyTargetWithCycle(config, task.cycle?.cycleDays)) {
      return true;
    }
    
    // 规则4: 周期N次任务先暂存，后续根据数量动态选择
    if (isCycleNTimesTask(config)) {
      const cycleNTimesResult = getCycleNTimesTaskDisplayType(task);
      if (cycleNTimesResult === 'mandatory') {
        return true; // 快临期或剩余次数>=剩余天数，必须显示
      } else if (cycleNTimesResult === 'flexible') {
        pendingCycleNTimesTasks.push(task); // 时间充裕，暂存待动态选择
      }
      return false;
    }
    
    return false;
  });
  
  result.push(...filteredSidelineTasks);

  // 6. 根据已筛选任务数量，从暂存的周期N次任务中选择
  const cycleNTimesLimit = calculateFlexibleTaskLimit(result.length);
  const selectedCycleNTimesTasks = selectFlexibleTasks(pendingCycleNTimesTasks, cycleNTimesLimit, currentDate);
  result.push(...selectedCycleNTimesTasks);
  
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
 * 检查是否有每日目标（考虑周期天数）
 * 对于TIMES类型：只有当cycleDays等于cycleTargetTimes时才算每日打卡
 * @param config 打卡配置
 * @param cycleDays 周期天数
 * @returns 是否有每日目标
 */
function hasDailyTargetWithCycle(config: CheckInConfig, cycleDays?: number): boolean {
  // TIMES类型：cycleDays等于cycleTargetTimes才算每日打卡
  if (config.unit === 'TIMES') {
    const cycleTargetTimes = config.cycleTargetTimes || 0;
    return cycleDays !== undefined && cycleDays === cycleTargetTimes;
  }
  return (
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
    config.unit === 'TIMES'
  );
}

/**
 * 判断周期N次任务的显示类型
 * 
 * @param task 任务对象
 * @returns 'mandatory' - 必须显示（快临期或剩余次数>=剩余天数）
 *          'flexible' - 时间充裕，可动态选择
 *          'hide' - 不显示（已完成目标次数）
 */
function getCycleNTimesTaskDisplayType(task: Task): 'mandatory' | 'flexible' | 'hide' {
  const config = task.checkInConfig;
  if (!config) return 'hide';
  
  try {
    // 获取周期信息
    const cycleInfo = getCurrentCycle(task as any);
    const targetTimes = config.cycleTargetTimes || config.perCycleTarget || 0;
    const completedTimes = cycleInfo.checkInCount;
    
    // 已完成目标次数，不显示
    if (completedTimes >= targetTimes) {
      return 'hide';
    }
    
    // 计算完成率和时间进度
    const completionRate = targetTimes > 0 ? (completedTimes / targetTimes) * 100 : 0;
    const cycleDays = task.cycle.cycleDays;
    const remainingDays = cycleInfo.remainingDays;
    const timeProgress = cycleDays > 0 ? ((cycleDays - remainingDays) / cycleDays) * 100 : 0;
    
    // 快临期（时间进度>70%）且完成率低于50% -> 必须显示
    if (completionRate < 50 && timeProgress > 70) {
      return 'mandatory';
    }
    
    // 剩余次数 >= 剩余天数 -> 必须显示
    const remainingTimes = targetTimes - completedTimes;
    if (remainingTimes >= remainingDays) {
      return 'mandatory';
    }
    
    // 其他情况：时间充裕，可动态选择
    return 'flexible';
  } catch (error) {
    console.error('计算周期N次任务显示类型失败:', error);
    return 'hide';
  }
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
  const today = getCurrentDate();
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

// ========== 新增：快临期判断和动态数量控制 ==========

/**
 * 判断任务是否快临期
 * 快临期定义：剩余时间 ≤ 30% 周期时间
 * 
 * @param task 任务对象
 * @returns 是否快临期
 */
export function isNearDeadline(task: Task): boolean {
  const { cycle, time } = task;
  const today = dayjs(getCurrentDate());
  const startDate = dayjs(time.startDate);
  
  // 计算当前周期的起始日期
  const cycleStartDate = startDate.add(
    (cycle.currentCycle - 1) * cycle.cycleDays, 
    'day'
  );
  
  // 计算当前周期的结束日期
  const cycleEndDate = cycleStartDate.add(cycle.cycleDays, 'day');
  
  // 计算剩余天数
  const remainingDays = cycleEndDate.diff(today, 'day');
  
  // 剩余天数 <= 30% 周期时间
  return remainingDays <= cycle.cycleDays * 0.3;
}

/**
 * 判断任务是否有每日目标
 * 
 * @param task 任务对象
 * @returns 是否有每日目标
 */
export function hasDailyTargetTask(task: Task): boolean {
  // NUMERIC 类型任务有每日目标
  if (task.category === 'NUMERIC' && task.numericConfig?.perDayAverage) {
    return true;
  }
  
  // CHECK_IN 类型任务检查配置
  if (task.category === 'CHECK_IN' && task.checkInConfig) {
    return hasDailyTarget(task.checkInConfig);
  }
  
  return false;
}

/**
 * 计算时间充裕任务的显示数量限制
 * 
 * 规则：
 * - 必显示任务 ≤ 3个 → 最多显示 3 个时间充裕任务
 * - 必显示任务 4-5个 → 最多显示 2 个时间充裕任务
 * - 必显示任务 ≥ 6个 → 最多显示 1 个时间充裕任务
 * 
 * @param mandatoryCount 必显示任务数量
 * @returns 时间充裕任务数量限制
 */
export function calculateFlexibleTaskLimit(mandatoryCount: number): number {
  if (mandatoryCount <= 3) return 3;
  if (mandatoryCount <= 5) return 2;
  return 1;
}

/**
 * 使用加权概率选择时间充裕任务
 * 
 * 算法：
 * 1. 计算每个任务的权重（完成率越低权重越高）
 * 2. 使用稳定的伪随机选择
 * 3. 确保每天结果一致
 * 
 * @param tasks 时间充裕任务列表
 * @param limit 选择数量限制
 * @param date 当前日期（用于生成稳定的随机数）
 * @returns 选中的任务列表
 */
export function selectFlexibleTasks(
  tasks: Task[], 
  limit: number, 
  date?: string
): Task[] {
  if (tasks.length <= limit) return tasks;
  
  const currentDate = date || getCurrentDate();
  
  // 计算每个任务的权重（完成率越低权重越高）
  const weighted = tasks.map(task => {
    const completionRate = task.progress?.cyclePercentage ?? 0;
    // 权重 = 100 - 完成率，最小为1
    const weight = Math.max(1, 100 - completionRate);
    return { task, weight };
  });
  
  // 使用稳定的伪随机选择
  const selected: Task[] = [];
  const remaining = [...weighted];
  
  while (selected.length < limit && remaining.length > 0) {
    // 计算总权重
    const totalWeight = remaining.reduce((sum, w) => sum + w.weight, 0);
    
    // 生成稳定的随机数
    const seed = hashCode(currentDate + selected.length.toString());
    const random = (seed % 1000) / 1000 * totalWeight;
    
    // 选择任务
    let cumulative = 0;
    for (let i = 0; i < remaining.length; i++) {
      cumulative += remaining[i].weight;
      if (cumulative >= random) {
        selected.push(remaining[i].task);
        remaining.splice(i, 1);
        break;
      }
    }
  }
  
  return selected;
}

/**
 * 增强版筛选函数 - 支持动态数量控制
 * 
 * @param tasks 所有任务列表
 * @returns 筛选后的任务列表
 */
export function filterDailyViewTasksEnhanced(tasks: Task[]): Task[] {
  const mustCompleteIds = getTodayMustCompleteTaskIds();
  const currentDate = getCurrentDate();
  
  // 分类任务
  const mandatoryTasks: Task[] = [];  // 必显示任务
  const flexibleTasks: Task[] = [];   // 时间充裕任务
  
  for (const task of tasks) {
    // 排除规则
    if (task.status === 'COMPLETED' || task.status === 'ARCHIVED' || task.status === 'ARCHIVED_HISTORY') {
      continue;
    }
    if ((task.progress?.totalPercentage ?? 0) >= 100) {
      continue;
    }
    if ((task.progress?.cyclePercentage ?? 0) >= 100) {
      continue;
    }
    
    // 主线任务 - 必显示
    if (task.type === 'mainline') {
      mandatoryTasks.push(task);
      continue;
    }
    
    // 今日必须完成 - 必显示
    if (mustCompleteIds.includes(task.id)) {
      mandatoryTasks.push(task);
      continue;
    }
    
    // 有每日目标 - 必显示
    if (hasDailyTargetTask(task)) {
      mandatoryTasks.push(task);
      continue;
    }
    
    // 快临期 - 必显示
    if (isNearDeadline(task)) {
      mandatoryTasks.push(task);
      continue;
    }
    
    // 周期N次任务的智能判断
    if (task.category === 'CHECK_IN' && task.checkInConfig && isCycleNTimesTask(task.checkInConfig)) {
      if (shouldShowCycleNTimesTask(task)) {
        mandatoryTasks.push(task);
        continue;
      }
    }
    
    // 其他任务归类为时间充裕任务
    flexibleTasks.push(task);
  }
  
  // 计算时间充裕任务的显示数量
  const flexibleLimit = calculateFlexibleTaskLimit(mandatoryTasks.length);
  
  // 选择时间充裕任务
  const selectedFlexible = selectFlexibleTasks(flexibleTasks, flexibleLimit, currentDate);
  
  // 合并结果
  return [...mandatoryTasks, ...selectedFlexible];
}



