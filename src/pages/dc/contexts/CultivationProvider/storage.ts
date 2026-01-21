/**
 * 修仙数据存储工具
 */

import type { CultivationData, CultivationHistory } from '../../types/cultivation';
import type { SpiritJadeData, PointsHistory, DailyCompleteRewardState } from '../../types/spiritJade';
import { INITIAL_CULTIVATION_DATA } from '../../types/cultivation';
import { INITIAL_SPIRIT_JADE } from '../../constants/spiritJade';

const STORAGE_KEY = 'dc_cultivation_data';
const HISTORY_STORAGE_KEY = 'dc_cultivation_history';
const SPIRIT_JADE_STORAGE_KEY = 'dc_spirit_jade_data';
const POINTS_HISTORY_STORAGE_KEY = 'dc_points_history';
const DAILY_COMPLETE_REWARD_KEY = 'dc_daily_complete_reward';
const MAX_HISTORY_WEEKS = 12; // 保留最近12周的历史记录

/**
 * 加载修仙数据
 */
export function loadCultivationData(): CultivationData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合并默认值，确保新字段有默认值
      return {
        ...INITIAL_CULTIVATION_DATA,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load cultivation data:', error);
  }
  return { ...INITIAL_CULTIVATION_DATA };
}

/**
 * 保存修仙数据
 */
export function saveCultivationData(data: CultivationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save cultivation data:', error);
  }
}

/**
 * 加载修为历史记录
 */
export function loadCultivationHistory(): CultivationHistory {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cultivation history:', error);
  }
  return {};
}

/**
 * 保存修为历史记录
 */
export function saveCultivationHistory(history: CultivationHistory): void {
  try {
    // 清理旧数据，只保留最近的周
    const cleanedHistory = cleanOldHistory(history);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(cleanedHistory));
  } catch (error) {
    console.error('Failed to save cultivation history:', error);
  }
}

/**
 * 清理旧的历史记录（通用版）
 */
function cleanOldHistoryGeneric<T extends Record<string, any[]>>(history: T): T {
  const weekKeys = Object.keys(history).sort().reverse();
  
  if (weekKeys.length <= MAX_HISTORY_WEEKS) {
    return history;
  }
  
  const keysToKeep = weekKeys.slice(0, MAX_HISTORY_WEEKS);
  const cleanedHistory = {} as T;
  
  for (const key of keysToKeep) {
    (cleanedHistory as any)[key] = history[key];
  }
  
  return cleanedHistory;
}

/**
 * 清理旧的历史记录（修为历史）
 */
function cleanOldHistory(history: CultivationHistory): CultivationHistory {
  return cleanOldHistoryGeneric(history);
}

/**
 * 清除所有修仙数据
 */
export function clearCultivationData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cultivation data:', error);
  }
}

/**
 * 导出修仙数据
 */
export function exportCultivationData(): string {
  const data = loadCultivationData();
  const history = loadCultivationHistory();
  
  return JSON.stringify({
    data,
    history,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  }, null, 2);
}

/**
 * 导入修仙数据
 */
export function importCultivationData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.data || typeof parsed.data !== 'object') {
      console.error('Invalid cultivation data format');
      return false;
    }
    
    // 验证必要字段
    const requiredFields = ['realm', 'currentExp', 'totalExpGained'];
    for (const field of requiredFields) {
      if (!(field in parsed.data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    saveCultivationData(parsed.data);
    
    if (parsed.history && typeof parsed.history === 'object') {
      saveCultivationHistory(parsed.history);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import cultivation data:', error);
    return false;
  }
}

// ============ 灵玉数据存储 ============

/** 灵玉数据初始值 */
export const INITIAL_SPIRIT_JADE_DATA: SpiritJadeData = {
  balance: INITIAL_SPIRIT_JADE,
  totalEarned: 0,
  totalSpent: 0,
  lastUpdatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

/**
 * 加载灵玉数据
 */
export function loadSpiritJadeData(): SpiritJadeData {
  try {
    const stored = localStorage.getItem(SPIRIT_JADE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...INITIAL_SPIRIT_JADE_DATA,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load spirit jade data:', error);
  }
  return { ...INITIAL_SPIRIT_JADE_DATA };
}

/**
 * 保存灵玉数据
 */
export function saveSpiritJadeData(data: SpiritJadeData): void {
  try {
    localStorage.setItem(SPIRIT_JADE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save spirit jade data:', error);
  }
}

/**
 * 加载积分历史记录
 */
export function loadPointsHistory(): PointsHistory {
  try {
    const stored = localStorage.getItem(POINTS_HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load points history:', error);
  }
  return {};
}

/**
 * 保存积分历史记录
 */
export function savePointsHistory(history: PointsHistory): void {
  try {
    const cleanedHistory = cleanOldHistoryGeneric(history);
    localStorage.setItem(POINTS_HISTORY_STORAGE_KEY, JSON.stringify(cleanedHistory));
  } catch (error) {
    console.error('Failed to save points history:', error);
  }
}

/**
 * 加载一日清单完成奖励状态
 */
export function loadDailyCompleteRewardState(): DailyCompleteRewardState | null {
  try {
    const stored = localStorage.getItem(DAILY_COMPLETE_REWARD_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load daily complete reward state:', error);
  }
  return null;
}

/**
 * 保存一日清单完成奖励状态
 */
export function saveDailyCompleteRewardState(state: DailyCompleteRewardState): void {
  try {
    localStorage.setItem(DAILY_COMPLETE_REWARD_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save daily complete reward state:', error);
  }
}

/**
 * 检查今日是否已领取清单完成奖励
 */
export function hasTodayClaimedDailyCompleteReward(today: string): boolean {
  const state = loadDailyCompleteRewardState();
  return state?.date === today && state?.rewarded === true;
}

/**
 * 标记今日已领取清单完成奖励
 */
export function markDailyCompleteRewardClaimed(today: string): void {
  saveDailyCompleteRewardState({
    date: today,
    rewarded: true,
    rewardedAt: new Date().toISOString(),
  });
}

/**
 * 清除灵玉相关数据
 */
export function clearSpiritJadeData(): void {
  try {
    localStorage.removeItem(SPIRIT_JADE_STORAGE_KEY);
    localStorage.removeItem(POINTS_HISTORY_STORAGE_KEY);
    localStorage.removeItem(DAILY_COMPLETE_REWARD_KEY);
  } catch (error) {
    console.error('Failed to clear spirit jade data:', error);
  }
}
