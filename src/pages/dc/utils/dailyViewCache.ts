/**
 * 一日清单缓存管理
 * 
 * 功能：
 * 1. 缓存每日筛选结果
 * 2. 自动清理过期缓存
 * 3. 确保全天结果一致
 */

import { getCurrentDate } from './dateTracker';

interface DailyViewCache {
  date: string; // YYYY-MM-DD
  taskIds: string[];
  generatedAt: string;
}

const CACHE_KEY = 'dc_daily_view_cache';

/**
 * 获取缓存的任务ID列表
 * @returns 缓存的任务ID列表，如果缓存不存在或已过期则返回null
 */
export function getCachedDailyTaskIds(): string[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: DailyViewCache = JSON.parse(cached);
    const today = getCurrentDate();
    
    // 检查是否为今天的缓存
    if (data.date === today) {
      return data.taskIds;
    }
    
    // 过期缓存，清理
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('读取一日清单缓存失败:', error);
    return null;
  }
}

/**
 * 保存任务ID列表到缓存
 * @param taskIds 要缓存的任务ID列表
 */
export function saveDailyTaskIdsCache(taskIds: string[]): void {
  try {
    const today = getCurrentDate();
    const cache: DailyViewCache = {
      date: today,
      taskIds,
      generatedAt: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('保存一日清单缓存失败:', error);
  }
}

/**
 * 清理缓存
 */
export function clearDailyViewCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('清理一日清单缓存失败:', error);
  }
}
