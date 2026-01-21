/**
 * 一日清单完成奖励状态存储
 * 追踪每日是否已领取一日清单100%完成奖励
 */

import dayjs from 'dayjs';

const STORAGE_KEY = 'dc_daily_complete_reward';

interface DailyCompleteRewardData {
  /** 最后领取日期 (YYYY-MM-DD) */
  lastRewardedDate: string | null;
}

/**
 * 加载一日清单完成奖励数据
 */
function loadData(): DailyCompleteRewardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('加载一日清单完成奖励数据失败:', e);
  }
  return { lastRewardedDate: null };
}

/**
 * 保存一日清单完成奖励数据
 */
function saveData(data: DailyCompleteRewardData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存一日清单完成奖励数据失败:', e);
  }
}

/**
 * 检查今日是否已领取一日清单完成奖励
 */
export function hasTodayDailyCompleteRewardClaimed(): boolean {
  const data = loadData();
  const today = dayjs().format('YYYY-MM-DD');
  return data.lastRewardedDate === today;
}

/**
 * 标记今日已领取一日清单完成奖励
 */
export function markTodayDailyCompleteRewardClaimed(): void {
  const today = dayjs().format('YYYY-MM-DD');
  saveData({ lastRewardedDate: today });
}

/**
 * 清除一日清单完成奖励记录（测试用）
 */
export function clearDailyCompleteReward(): void {
  localStorage.removeItem(STORAGE_KEY);
}
