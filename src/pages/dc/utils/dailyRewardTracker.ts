/**
 * 每日奖励追踪器
 * 用于追踪每个任务每日已获得的奖励，实现每日上限检查
 */

import dayjs from 'dayjs';

// 存储键
const STORAGE_KEY = 'dc_daily_reward_tracker';

// 每日奖励追踪数据结构
export interface DailyRewardTracker {
  date: string;  // YYYY-MM-DD
  taskRewards: {
    [taskId: string]: {
      spiritJade: number;
      cultivation: number;
    };
  };
}

/**
 * 获取今日的日期字符串
 */
function getTodayDateStr(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 获取当前的追踪数据
 * 如果日期不是今天，自动重置
 */
export function getDailyRewardTracker(): DailyRewardTracker {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { date: getTodayDateStr(), taskRewards: {} };
    }

    const data: DailyRewardTracker = JSON.parse(stored);

    // 检查日期是否是今天，不是则重置
    if (data.date !== getTodayDateStr()) {
      const newData = { date: getTodayDateStr(), taskRewards: {} };
      saveDailyRewardTracker(newData);
      return newData;
    }

    return data;
  } catch (error) {
    console.error('Failed to load daily reward tracker:', error);
    return { date: getTodayDateStr(), taskRewards: {} };
  }
}

/**
 * 保存追踪数据
 */
function saveDailyRewardTracker(data: DailyRewardTracker): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save daily reward tracker:', error);
  }
}

/**
 * 获取指定任务今日已获得的奖励
 */
export function getTodayTaskReward(taskId: string): { spiritJade: number; cultivation: number } {
  const tracker = getDailyRewardTracker();
  return tracker.taskRewards[taskId] || { spiritJade: 0, cultivation: 0 };
}

/**
 * 添加今日任务奖励（累计）
 */
export function addTodayTaskReward(
  taskId: string,
  spiritJade: number,
  cultivation: number
): void {
  const tracker = getDailyRewardTracker();

  const existing = tracker.taskRewards[taskId] || { spiritJade: 0, cultivation: 0 };
  tracker.taskRewards[taskId] = {
    spiritJade: existing.spiritJade + spiritJade,
    cultivation: existing.cultivation + cultivation,
  };

  saveDailyRewardTracker(tracker);
}

/**
 * 计算在上限内可发放的奖励
 * @param taskId 任务ID
 * @param requestedJade 请求发放的灵玉
 * @param requestedCultivation 请求发放的修为
 * @param dailyCapJade 每日灵玉上限
 * @param dailyCapCultivation 每日修为上限
 * @returns 实际可发放的奖励，以及是否达到上限
 */
export function calculateAllowedReward(
  taskId: string,
  requestedJade: number,
  requestedCultivation: number,
  dailyCapJade: number,
  dailyCapCultivation: number
): {
  allowedJade: number;
  allowedCultivation: number;
  reachedJadeCap: boolean;
  reachedCultivationCap: boolean;
  alreadyAtCap: boolean;
} {
  const todayReward = getTodayTaskReward(taskId);

  // 计算剩余可发放额度
  const remainingJade = Math.max(0, dailyCapJade - todayReward.spiritJade);
  const remainingCultivation = Math.max(0, dailyCapCultivation - todayReward.cultivation);

  // 是否已经达到上限
  const alreadyAtCap = remainingJade === 0 && remainingCultivation === 0;

  // 计算实际可发放的奖励（取请求值和剩余额度的较小值）
  const allowedJade = Math.min(requestedJade, remainingJade);
  const allowedCultivation = Math.min(requestedCultivation, remainingCultivation);

  // 判断是否达到上限
  const reachedJadeCap = allowedJade < requestedJade || remainingJade === 0;
  const reachedCultivationCap = allowedCultivation < requestedCultivation || remainingCultivation === 0;

  return {
    allowedJade,
    allowedCultivation,
    reachedJadeCap,
    reachedCultivationCap,
    alreadyAtCap,
  };
}

/**
 * 获取任务今日剩余可获得的奖励
 */
export function getTodayRemainingReward(
  taskId: string,
  dailyCapJade: number,
  dailyCapCultivation: number
): { spiritJade: number; cultivation: number } {
  const todayReward = getTodayTaskReward(taskId);

  return {
    spiritJade: Math.max(0, dailyCapJade - todayReward.spiritJade),
    cultivation: Math.max(0, dailyCapCultivation - todayReward.cultivation),
  };
}
