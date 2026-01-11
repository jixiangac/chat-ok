/**
 * 纪念日数据存储工具
 */

import type { Memorial, DateDisplayFormat } from './types';

// 存储键
const MEMORIALS_STORAGE_KEY = 'dc_memorials';
const DATE_FORMAT_STORAGE_KEY = 'dc_memorial_date_format';

/**
 * 从 localStorage 加载纪念日列表
 */
export function loadMemorials(): Memorial[] {
  try {
    const stored = localStorage.getItem(MEMORIALS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Memorial[];
  } catch (error) {
    console.error('Failed to load memorials:', error);
    return [];
  }
}

/**
 * 保存纪念日列表到 localStorage
 */
export function saveMemorials(memorials: Memorial[]): void {
  try {
    localStorage.setItem(MEMORIALS_STORAGE_KEY, JSON.stringify(memorials));
  } catch (error) {
    console.error('Failed to save memorials:', error);
  }
}

/**
 * 从 localStorage 加载日期显示格式偏好
 */
export function loadDateFormat(): DateDisplayFormat {
  try {
    const stored = localStorage.getItem(DATE_FORMAT_STORAGE_KEY);
    if (stored && ['days', 'monthsDays', 'yearsMonthsDays'].includes(stored)) {
      return stored as DateDisplayFormat;
    }
    return 'days';
  } catch (error) {
    console.error('Failed to load date format:', error);
    return 'days';
  }
}

/**
 * 保存日期显示格式偏好到 localStorage
 */
export function saveDateFormat(format: DateDisplayFormat): void {
  try {
    localStorage.setItem(DATE_FORMAT_STORAGE_KEY, format);
  } catch (error) {
    console.error('Failed to save date format:', error);
  }
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `memorial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
