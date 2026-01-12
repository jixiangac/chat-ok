import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { Task } from '../types';
import { calculateRemainingDays } from '../utils/mainlineTaskHelper';
import { getTodayCheckInStatusForTask } from '../panels/detail/hooks';
import { getTodayMustCompleteTaskIds } from '../utils/todayMustCompleteStorage';

/**
 * 任务排序 Hook
 * 对支线任务进行排序，优先显示需要关注的任务
 */
export function useTaskSort(tasks: Task[], todayMustCompleteTaskIds?: string[]) {
  // 获取今日必须完成的任务ID列表
  const mustCompleteIds = useMemo(() => {
    return todayMustCompleteTaskIds ?? getTodayMustCompleteTaskIds();
  }, [todayMustCompleteTaskIds]);

  /**
   * 检查任务今日是否已完成打卡
   */
  const isTodayCompleted = (task: Task) => {
    const status = getTodayCheckInStatusForTask(task);
    return status.isCompleted;
  };

  /**
   * 检查任务当前周期是否已完成目标
   */
  const isCycleCompleted = (task: Task) => {
    const mainlineTask = task.mainlineTask;
    if (!mainlineTask) return false;
    if (mainlineTask.progress?.currentCyclePercentage >= 100) return true;
    if (mainlineTask.checkInConfig) {
      const config = mainlineTask.checkInConfig;
      const records = config.records || [];
      const startDate = task.startDate;
      const cycleDays = task.cycleDays || 7;
      const currentCycle = mainlineTask.cycleConfig?.currentCycle || 1;
      if (startDate) {
        const cycleStartDate = dayjs(startDate).add((currentCycle - 1) * cycleDays, 'day');
        const cycleEndDate = cycleStartDate.add(cycleDays, 'day');
        const cycleRecords = records.filter(r => {
          const recordDate = dayjs(r.date);
          return recordDate.isAfter(cycleStartDate.subtract(1, 'day')) && 
                 recordDate.isBefore(cycleEndDate) && r.checked;
        });
        if (config.unit === 'TIMES') {
          const target = config.cycleTargetTimes || config.perCycleTarget || cycleDays;
          if (cycleRecords.length >= target) return true;
        } else if (config.unit === 'DURATION') {
          const totalMinutes = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
          const target = config.cycleTargetMinutes || (config.perCycleTarget * (config.dailyTargetMinutes || 15));
          if (totalMinutes >= target) return true;
        } else if (config.unit === 'QUANTITY') {
          const totalValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
          const target = config.cycleTargetValue || config.perCycleTarget;
          if (totalValue >= target) return true;
        }
      }
    }
    return false;
  };

  /**
   * 获取周期完成率
   */
  const getCycleProgress = (task: Task): number => {
    return task.mainlineTask?.progress?.currentCyclePercentage || 0;
  };

  /**
   * 过滤掉已归档的任务
   */
  const activeTasks = useMemo(() => {
    return tasks.filter(t => (t as any).status !== 'archived');
  }, [tasks]);

  /**
   * 检查是否有主线或支线任务（排除已归档）
   */
  const hasMainOrSubTasks = useMemo(() => {
    return activeTasks.some(t => t.type === 'mainline' || t.type === 'sidelineA' || t.type === 'sidelineB');
  }, [activeTasks]);

  /**
   * 检查是否已有主线任务（排除已归档）
   */
  const hasMainlineTask = useMemo(() => {
    return activeTasks.some(t => t.type === 'mainline');
  }, [activeTasks]);

  /**
   * 获取主线任务列表
   */
  const mainlineTasks = useMemo(() => {
    return activeTasks.filter(t => t.type === 'mainline');
  }, [activeTasks]);

  /**
   * 获取支线任务（排除已归档），并按完成状态排序
   * 排序规则：
   * 0. 今日必须完成的任务置顶（未完成的在前）
   * 1. 今日未完成优先（周期快到期且完成率低的更前）
   * 2. 本周期未完成次之（周期快到期的更前）
   * 3. 今日已完成、周期已完成的排最后
   */
  const sidelineTasks = useMemo(() => {
    return activeTasks
      .filter(t => t.type === 'sidelineA' || t.type === 'sidelineB')
      .sort((a, b) => {
        const aTodayCompleted = isTodayCompleted(a);
        const bTodayCompleted = isTodayCompleted(b);
        const aCycleCompleted = isCycleCompleted(a);
        const bCycleCompleted = isCycleCompleted(b);
        const aIsMustComplete = mustCompleteIds.includes(a.id);
        const bIsMustComplete = mustCompleteIds.includes(b.id);
        
        // 0. 今日必须完成的任务置顶
        if (aIsMustComplete && !bIsMustComplete) return -1;
        if (!aIsMustComplete && bIsMustComplete) return 1;
        
        // 如果都是今日必须完成，按完成状态排序（未完成的在前）
        if (aIsMustComplete && bIsMustComplete) {
          if (!aTodayCompleted && bTodayCompleted) return -1;
          if (aTodayCompleted && !bTodayCompleted) return 1;
          // 都未完成或都已完成，保持原顺序
          return 0;
        }
        
        // 1. 今日未完成 vs 今日已完成
        if (!aTodayCompleted && bTodayCompleted) return -1;
        if (aTodayCompleted && !bTodayCompleted) return 1;
        
        // 2. 如果都是今日未完成
        if (!aTodayCompleted && !bTodayCompleted) {
          // 周期未完成 vs 周期已完成
          if (!aCycleCompleted && bCycleCompleted) return -1;
          if (aCycleCompleted && !bCycleCompleted) return 1;
          
          // 都是周期未完成，按剩余天数排序（快到期的前面）
          if (!aCycleCompleted && !bCycleCompleted) {
            const aRemainingDays = calculateRemainingDays(a);
            const bRemainingDays = calculateRemainingDays(b);
            if (aRemainingDays !== bRemainingDays) {
              return aRemainingDays - bRemainingDays;
            }
            // 剩余天数相同，周期完成率低的前面
            const aCycleProgress = getCycleProgress(a);
            const bCycleProgress = getCycleProgress(b);
            return aCycleProgress - bCycleProgress;
          }
        }
        
        // 3. 如果都是今日已完成
        if (aTodayCompleted && bTodayCompleted) {
          // 周期未完成 vs 周期已完成
          if (!aCycleCompleted && bCycleCompleted) return -1;
          if (aCycleCompleted && !bCycleCompleted) return 1;
          
          // 都是周期未完成，按剩余天数排序
          if (!aCycleCompleted && !bCycleCompleted) {
            const aRemainingDays = calculateRemainingDays(a);
            const bRemainingDays = calculateRemainingDays(b);
            return aRemainingDays - bRemainingDays;
          }
        }
        
        return 0;
      });
  }, [activeTasks, mustCompleteIds]);

  /**
   * 显示的支线任务（前3个）
   */
  const displayedSidelineTasks = useMemo(() => {
    return sidelineTasks.slice(0, 3);
  }, [sidelineTasks]);

  return {
    activeTasks,
    hasMainOrSubTasks,
    hasMainlineTask,
    mainlineTasks,
    sidelineTasks,
    displayedSidelineTasks,
    isTodayCompleted,
    isCycleCompleted,
    getCycleProgress
  };
}


