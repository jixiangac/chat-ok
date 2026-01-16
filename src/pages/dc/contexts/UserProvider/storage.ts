/**
 * UserProvider 存储逻辑
 */

import type { UserData } from './types';
import { defaultUserData } from './types';

const STORAGE_KEY = 'dc_user_data';

/**
 * 从 localStorage 加载用户数据
 */
export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合并默认数据，确保新增字段有默认值
      return {
        profile: { ...defaultUserData.profile, ...parsed.profile },
        level: { ...defaultUserData.level, ...parsed.level },
        todayMustComplete: { ...defaultUserData.todayMustComplete, ...parsed.todayMustComplete },
        dailyChecklist: { ...defaultUserData.dailyChecklist, ...parsed.dailyChecklist },
        stats: { ...defaultUserData.stats, ...parsed.stats },
      };
    }
    return defaultUserData;
  } catch (error) {
    console.error('Failed to load user data from localStorage:', error);
    return defaultUserData;
  }
};

/**
 * 保存用户数据到 localStorage
 */
export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

/**
 * 清除用户数据
 */
export const clearUserData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user data from localStorage:', error);
  }
};

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * 检查日期是否是今天
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDateString();
};

/**
 * 检查日期是否是昨天
 */
export const isYesterday = (dateString: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
};
