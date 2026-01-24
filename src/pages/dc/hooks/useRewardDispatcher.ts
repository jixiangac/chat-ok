/**
 * 奖励发放 Hook
 * 统一处理打卡、周期完成、一日清单完成等场景的奖励发放
 */

import { useCallback, useState } from 'react';
import { useCultivation } from '../contexts';
import { useRewardQueue } from './useRewardQueue';
import { 
  calculateDailyPointsCap, 
  distributeCheckInPoints,
  calculateCycleCompleteBonus,
  calculateDailyViewCompleteReward,
  calculateArchiveReward,
} from '../utils/spiritJadeCalculator';
import { isTaskTodayMustComplete } from '../utils/todayMustCompleteStorage';
import { hasCycleRewardClaimed, markCycleRewardClaimed } from '../utils/cycleRewardStorage';
import { hasTodayDailyCompleteRewardClaimed, markTodayDailyCompleteRewardClaimed } from '../utils/dailyCompleteRewardStorage';
import type { Task, TaskType, CheckInUnit } from '../types';
import type { RewardItem } from '../types/spiritJade';

interface CheckInRewardParams {
  task: Task;
  completionRatio: number; // 0-1，本次打卡的完成比例
}

interface CycleCompleteParams {
  task: Task;
  cycleNumber: number;
}

interface DailyCompleteParams {
  taskCount: number;
}

interface ArchiveRewardParams {
  task: Task;
  completionRate: number; // 0-1，总完成率
}

interface UseRewardDispatcherReturn {
  /** 当前显示的奖励 */
  rewards: RewardItem[];
  /** 是否显示奖励 */
  isVisible: boolean;
  /** 发放打卡奖励 */
  dispatchCheckInReward: (params: CheckInRewardParams) => RewardItem | null;
  /** 发放周期完成奖励 */
  dispatchCycleCompleteReward: (params: CycleCompleteParams) => RewardItem | null;
  /** 发放一日清单完成奖励 */
  dispatchDailyCompleteReward: (params: DailyCompleteParams) => RewardItem | null;
  /** 发放归档奖励 */
  dispatchArchiveReward: (params: ArchiveRewardParams) => RewardItem | null;
  /** 批量发放奖励（合并显示） */
  dispatchRewards: (rewards: RewardItem[]) => void;
  /** 关闭奖励显示 */
  closeReward: () => void;
}

/**
 * 奖励发放 Hook
 */
export function useRewardDispatcher(): UseRewardDispatcherReturn {
  const { addPoints, addSpiritJade } = useCultivation();
  const { rewards, isVisible, addReward, addRewards, close } = useRewardQueue();

  // 发放打卡奖励
  const dispatchCheckInReward = useCallback((params: CheckInRewardParams): RewardItem | null => {
    const { task, completionRatio } = params;
    
    if (completionRatio <= 0) return null;

    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;
    const isTodayMustComplete = isTaskTodayMustComplete(task.id);

    // 计算每日上限
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);
    
    // 计算积分分配（使用新结构）
    const pointsResult = distributeCheckInPoints(completionRatio, dailyCap, isTodayMustComplete);

    // 发放奖励（使用最终总计）
    const reward = addPoints({
      spiritJade: pointsResult.total.spiritJade,
      cultivation: pointsResult.total.cultivation,
      source: 'CHECK_IN',
      taskId: task.id,
      taskTitle: task.title,
      description: `任务「${task.title}」打卡`,
    });

    // 添加到显示队列
    addReward(reward);

    return reward;
  }, [addPoints, addReward]);

  // 发放周期完成奖励
  const dispatchCycleCompleteReward = useCallback((params: CycleCompleteParams): RewardItem | null => {
    const { task, cycleNumber } = params;
    
    // 检查是否已领取过该周期的奖励
    if (hasCycleRewardClaimed(task.id, cycleNumber)) {
      return null;
    }
    
    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;

    // 计算每日上限作为基准
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);
    
    // 计算周期完成奖励
    const bonus = calculateCycleCompleteBonus(dailyCap);

    // 发放奖励
    const reward = addPoints({
      spiritJade: bonus.spiritJade,
      cultivation: bonus.cultivation,
      source: 'CYCLE_COMPLETE',
      taskId: task.id,
      taskTitle: task.title,
      description: `周期${cycleNumber}完成100%`,
    });

    // 标记已领取
    markCycleRewardClaimed(task.id, cycleNumber);

    // 添加到显示队列
    addReward(reward);

    return reward;
  }, [addPoints, addReward]);

  // 发放一日清单完成奖励
  const dispatchDailyCompleteReward = useCallback((params: DailyCompleteParams): RewardItem | null => {
    const { taskCount } = params;

    // 至少需要3个任务才能获得奖励
    if (taskCount < 3) {
      return null;
    }

    // 检查今日是否已领取
    if (hasTodayDailyCompleteRewardClaimed()) {
      return null;
    }

    // 计算一日清单完成奖励
    const bonus = calculateDailyViewCompleteReward(taskCount);

    // 发放奖励
    const reward = addPoints({
      spiritJade: bonus.spiritJade,
      cultivation: bonus.cultivation,
      source: 'DAILY_COMPLETE',
      description: `一日清单完成100%（${taskCount}个任务）`,
    });

    // 标记今日已领取
    markTodayDailyCompleteRewardClaimed();

    // 添加到显示队列
    addReward(reward);

    return reward;
  }, [addPoints, addReward]);

  // 发放归档奖励
  const dispatchArchiveReward = useCallback((params: ArchiveRewardParams): RewardItem | null => {
    const { task, completionRate } = params;
    
    // 完成率低于30%不发放
    if (completionRate < 0.3) return null;

    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;

    // 计算每日上限作为基准
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);
    
    // 计算归档奖励
    const points = calculateArchiveReward(dailyCap, completionRate);

    // 发放奖励
    const reward = addPoints({
      spiritJade: points.spiritJade,
      cultivation: points.cultivation,
      source: 'ARCHIVE',
      taskId: task.id,
      taskTitle: task.title,
      description: `归档「${task.title}」（完成率${Math.round(completionRate * 100)}%）`,
    });

    // 添加到显示队列
    addReward(reward);

    return reward;
  }, [addPoints, addReward]);

  // 批量发放奖励
  const dispatchRewards = useCallback((rewardsToDispatch: RewardItem[]) => {
    if (rewardsToDispatch.length === 0) return;
    addRewards(rewardsToDispatch);
  }, [addRewards]);

  return {
    rewards,
    isVisible,
    dispatchCheckInReward,
    dispatchCycleCompleteReward,
    dispatchDailyCompleteReward,
    dispatchArchiveReward,
    dispatchRewards,
    closeReward: close,
  };
}

export default useRewardDispatcher;
