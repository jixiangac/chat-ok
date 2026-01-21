/**
 * 奖励队列管理 Hook
 * 用于管理和合并显示多个奖励
 * 支持在短时间内触发的多个奖励合并为一次显示
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { RewardItem } from '../types/spiritJade';

/** 奖励队列配置 */
interface RewardQueueConfig {
  /** 合并窗口时间（毫秒），在此时间内的奖励会被合并 */
  mergeWindow?: number;
  /** 默认显示时长（毫秒） */
  defaultDuration?: number;
}

/** Hook 返回值 */
interface UseRewardQueueReturn {
  /** 当前显示的奖励列表 */
  rewards: RewardItem[];
  /** 是否正在显示 */
  isVisible: boolean;
  /** 添加奖励到队列 */
  addReward: (reward: RewardItem) => void;
  /** 添加多个奖励 */
  addRewards: (rewards: RewardItem[]) => void;
  /** 关闭当前显示 */
  close: () => void;
  /** 清空队列 */
  clear: () => void;
}

/**
 * 奖励队列管理 Hook
 * @param config 配置项
 * @returns 队列状态和操作方法
 */
export function useRewardQueue(config: RewardQueueConfig = {}): UseRewardQueueReturn {
  const {
    mergeWindow = 500, // 默认 500ms 内的奖励会被合并
    defaultDuration = 2000,
  } = config;

  // 当前显示的奖励
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  // 是否正在显示
  const [isVisible, setIsVisible] = useState(false);
  
  // 待处理队列
  const pendingRewardsRef = useRef<RewardItem[]>([]);
  // 合并定时器
  const mergeTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 显示定时器
  const displayTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 是否正在处理中
  const isProcessingRef = useRef(false);

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (mergeTimerRef.current) {
      clearTimeout(mergeTimerRef.current);
      mergeTimerRef.current = null;
    }
    if (displayTimerRef.current) {
      clearTimeout(displayTimerRef.current);
      displayTimerRef.current = null;
    }
  }, []);

  // 显示奖励
  const showRewards = useCallback((rewardsToShow: RewardItem[]) => {
    if (rewardsToShow.length === 0) return;

    setRewards(rewardsToShow);
    setIsVisible(true);
    isProcessingRef.current = true;

    // 计算显示时长
    const duration = rewardsToShow.length > 1 ? 3000 : defaultDuration;

    // 设置自动关闭
    displayTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      isProcessingRef.current = false;
      
      // 检查是否有待处理的奖励
      if (pendingRewardsRef.current.length > 0) {
        const pending = [...pendingRewardsRef.current];
        pendingRewardsRef.current = [];
        showRewards(pending);
      }
    }, duration);
  }, [defaultDuration]);

  // 处理待处理队列
  const processPendingRewards = useCallback(() => {
    if (pendingRewardsRef.current.length === 0) return;

    // 如果正在显示，稍后处理
    if (isProcessingRef.current) return;

    const pending = [...pendingRewardsRef.current];
    pendingRewardsRef.current = [];
    showRewards(pending);
  }, [showRewards]);

  // 添加单个奖励
  const addReward = useCallback((reward: RewardItem) => {
    // 添加到待处理队列
    pendingRewardsRef.current.push(reward);

    // 清除之前的合并定时器
    if (mergeTimerRef.current) {
      clearTimeout(mergeTimerRef.current);
    }

    // 设置新的合并定时器
    mergeTimerRef.current = setTimeout(() => {
      processPendingRewards();
    }, mergeWindow);
  }, [mergeWindow, processPendingRewards]);

  // 添加多个奖励
  const addRewards = useCallback((newRewards: RewardItem[]) => {
    if (newRewards.length === 0) return;

    // 添加到待处理队列
    pendingRewardsRef.current.push(...newRewards);

    // 清除之前的合并定时器
    if (mergeTimerRef.current) {
      clearTimeout(mergeTimerRef.current);
    }

    // 设置新的合并定时器
    mergeTimerRef.current = setTimeout(() => {
      processPendingRewards();
    }, mergeWindow);
  }, [mergeWindow, processPendingRewards]);

  // 关闭当前显示
  const close = useCallback(() => {
    clearTimers();
    setIsVisible(false);
    isProcessingRef.current = false;
    
    // 延迟处理待处理队列
    setTimeout(() => {
      processPendingRewards();
    }, 100);
  }, [clearTimers, processPendingRewards]);

  // 清空队列
  const clear = useCallback(() => {
    clearTimers();
    pendingRewardsRef.current = [];
    setRewards([]);
    setIsVisible(false);
    isProcessingRef.current = false;
  }, [clearTimers]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    rewards,
    isVisible,
    addReward,
    addRewards,
    close,
    clear,
  };
}

export default useRewardQueue;
