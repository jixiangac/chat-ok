/**
 * 每日数据重置工具
 * 
 * 功能：
 * 1. 重置任务的今日进度
 * 2. 推进任务周期到正确日期
 * 3. 执行完整的每日重置流程
 */

import dayjs from 'dayjs';
import type { Task, TodayProgress, CycleAdvanceLog } from '../types';
import { getCurrentDate } from './dateTracker';

/**
 * 周期更新信息
 */
export interface CycleUpdateInfo {
  newCycle: number;
  cycleAdvanced: boolean;
  cyclesSkipped: number;
}

/**
 * 每日重置结果
 */
export interface DailyResetResult {
  updatedTasks: Task[];
  resetCount: number;
  cycleAdvancedCount: number;
  cycleAdvanceLogs: Array<{
    taskId: string;
    taskTitle: string;
    oldCycle: number;
    newCycle: number;
    cyclesSkipped: number;
  }>;
}

/**
 * 重置单个任务的今日进度
 * @param task 任务对象
 * @returns 重置后的任务对象
 */
export function resetTodayProgress(task: Task): Task {
  const defaultTodayProgress: TodayProgress = {
    canCheckIn: true,
    todayCount: 0,
    todayValue: 0,
    isCompleted: false,
    dailyTarget: task.todayProgress?.dailyTarget,
    lastUpdatedAt: getCurrentDate(),
  };

  return {
    ...task,
    todayProgress: defaultTodayProgress,
  };
}

/**
 * 判断是否需要推进周期
 * @param task 任务对象
 * @param targetDate 目标日期 YYYY-MM-DD
 * @returns 是否需要推进周期
 */
export function shouldAdvanceCycle(task: Task, targetDate: string): boolean {
  const { time, cycle } = task;
  const startDate = dayjs(time.startDate);
  const target = dayjs(targetDate);
  
  // 如果目标日期在开始日期之前，不需要推进
  if (target.isBefore(startDate)) {
    return false;
  }
  
  // 计算从开始日期到目标日期经过的天数
  const daysPassed = target.diff(startDate, 'day');
  
  // 计算应该在第几个周期
  const expectedCycle = Math.floor(daysPassed / cycle.cycleDays) + 1;
  
  // 如果期望周期大于当前周期，需要推进
  return expectedCycle > cycle.currentCycle;
}

/**
 * 计算新的周期信息
 * @param task 任务对象
 * @param targetDate 目标日期 YYYY-MM-DD
 * @returns 周期更新信息
 */
export function calculateNewCycle(task: Task, targetDate: string): CycleUpdateInfo {
  const { time, cycle } = task;
  const startDate = dayjs(time.startDate);
  const target = dayjs(targetDate);
  
  // 如果目标日期在开始日期之前，不推进
  if (target.isBefore(startDate)) {
    return {
      newCycle: cycle.currentCycle,
      cycleAdvanced: false,
      cyclesSkipped: 0,
    };
  }
  
  // 计算从开始日期到目标日期经过的天数
  const daysPassed = target.diff(startDate, 'day');
  
  // 计算应该在第几个周期
  const expectedCycle = Math.floor(daysPassed / cycle.cycleDays) + 1;
  
  // 限制在总周期数内
  const newCycle = Math.min(expectedCycle, cycle.totalCycles);
  
  // 计算跳过的周期数
  const cyclesSkipped = Math.max(0, newCycle - cycle.currentCycle);
  
  return {
    newCycle,
    cycleAdvanced: newCycle > cycle.currentCycle,
    cyclesSkipped,
  };
}

/**
 * 推进任务周期
 * @param task 任务对象
 * @param targetDate 目标日期 YYYY-MM-DD
 * @returns 更新后的任务对象
 */
export function advanceTaskCycle(task: Task, targetDate: string): Task {
  const cycleInfo = calculateNewCycle(task, targetDate);
  
  if (!cycleInfo.cycleAdvanced) {
    return task;
  }
  
  const oldCycle = task.cycle.currentCycle;
  const newCycle = cycleInfo.newCycle;
  
  // 创建周期推进日志
  const cycleAdvanceLog: CycleAdvanceLog = {
    id: `cycle_advance_${Date.now()}`,
    date: targetDate,
    timestamp: Date.now(),
    type: 'CYCLE_ADVANCE',
    cycleNumber: newCycle,
    completionRate: task.progress?.cyclePercentage ?? 0,
    note: cycleInfo.cyclesSkipped > 1 
      ? `跳过 ${cycleInfo.cyclesSkipped - 1} 个周期` 
      : undefined,
  };
  
  // 更新任务
  return {
    ...task,
    cycle: {
      ...task.cycle,
      currentCycle: newCycle,
    },
    progress: {
      ...task.progress,
      // 重置周期进度
      cyclePercentage: 0,
      cycleAchieved: 0,
      cycleRemaining: task.progress?.cycleTargetValue as number ?? 0,
      lastUpdatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
    activities: [...task.activities, cycleAdvanceLog],
  };
}

/**
 * 执行完整的每日重置
 * @param tasks 任务列表
 * @param targetDate 目标日期 YYYY-MM-DD（默认为当前日期）
 * @returns 重置结果
 */
export function performDailyReset(
  tasks: Task[], 
  targetDate?: string
): DailyResetResult {
  const date = targetDate || getCurrentDate();
  const updatedTasks: Task[] = [];
  let resetCount = 0;
  let cycleAdvancedCount = 0;
  const cycleAdvanceLogs: DailyResetResult['cycleAdvanceLogs'] = [];
  
  for (const task of tasks) {
    let updatedTask = task;
    
    // 跳过已完成或已归档的任务
    if (task.status === 'COMPLETED' || task.status === 'ARCHIVED' || task.status === 'ARCHIVED_HISTORY') {
      updatedTasks.push(task);
      continue;
    }
    
    // 1. 重置今日进度
    if (task.todayProgress) {
      updatedTask = resetTodayProgress(updatedTask);
      resetCount++;
    }
    
    // 2. 检查并推进周期
    if (shouldAdvanceCycle(updatedTask, date)) {
      const oldCycle = updatedTask.cycle.currentCycle;
      updatedTask = advanceTaskCycle(updatedTask, date);
      const newCycle = updatedTask.cycle.currentCycle;
      
      if (newCycle > oldCycle) {
        cycleAdvancedCount++;
        cycleAdvanceLogs.push({
          taskId: task.id,
          taskTitle: task.title,
          oldCycle,
          newCycle,
          cyclesSkipped: newCycle - oldCycle,
        });
      }
    }
    
    updatedTasks.push(updatedTask);
  }
  
  return {
    updatedTasks,
    resetCount,
    cycleAdvancedCount,
    cycleAdvanceLogs,
  };
}

/**
 * 检查任务是否需要重置今日进度
 * @param task 任务对象
 * @param currentDate 当前日期 YYYY-MM-DD
 * @returns 是否需要重置
 */
export function needsProgressReset(task: Task, currentDate: string): boolean {
  if (!task.todayProgress?.lastUpdatedAt) {
    return false;
  }
  
  const lastUpdateDate = task.todayProgress.lastUpdatedAt.split(' ')[0];
  return lastUpdateDate !== currentDate;
}
