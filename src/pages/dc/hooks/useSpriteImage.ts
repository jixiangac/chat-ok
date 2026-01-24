import { useState, useCallback, useMemo } from 'react';
import { SPRITE_IMAGES, MEMORIAL_SPRITE_IMAGES, VACATION_SPRITE_IMAGES, getCurrentTimeSlot } from '../constants';
import { useUIState, type TabKey } from '../contexts';

// 存储 key
const SPRITE_CACHE_KEY = 'dc_sprite_image_cache';

/**
 * 生成当天时段的缓存 key
 * 格式: YYYY-MM-DD_timeSlot_tab
 */
function getCacheKey(timeSlot: string, tab: TabKey): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${today}_${timeSlot}_${tab}`;
}

/**
 * 从缓存中获取已保存的随机索引
 */
function getCachedIndex(cacheKey: string): number | null {
  try {
    const stored = localStorage.getItem(SPRITE_CACHE_KEY);
    if (stored) {
      const cache = JSON.parse(stored) as Record<string, { index: number; date: string }>;
      const entry = cache[cacheKey];
      if (entry) {
        // 检查是否是今天的缓存
        const today = new Date().toISOString().split('T')[0];
        if (entry.date === today) {
          return entry.index;
        }
      }
    }
  } catch (e) {
    console.error('Failed to get sprite cache:', e);
  }
  return null;
}

/**
 * 保存随机索引到缓存
 */
function setCachedIndex(cacheKey: string, index: number): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(SPRITE_CACHE_KEY);
    let cache: Record<string, { index: number; date: string }> = {};

    if (stored) {
      cache = JSON.parse(stored);
      // 清理过期的缓存（非今天的）
      Object.keys(cache).forEach(key => {
        if (cache[key].date !== today) {
          delete cache[key];
        }
      });
    }

    cache[cacheKey] = { index, date: today };
    localStorage.setItem(SPRITE_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to set sprite cache:', e);
  }
}

/**
 * 小精灵图片管理 Hook
 * 根据时间段或 activeTab 显示不同的小精灵图片，支持随机切换
 * 同一天同一时段的图片会固定不变
 *
 * @param overrideTab - 可选的覆盖 tab，如果不提供则使用全局 activeTab
 *   - 'normal': 使用时间段图片
 *   - 'memorial': 使用纪念日专属图片
 *   - 'vacation': 使用度假模式专属图片
 */
export function useSpriteImage(overrideTab?: TabKey) {
  const { activeTab } = useUIState();
  const [manualIndex, setManualIndex] = useState<number | null>(null);

  // 使用传入的 tab 或全局 activeTab
  const currentTab = overrideTab || activeTab;

  // 获取当前时段
  const timeSlot = useMemo(() => getCurrentTimeSlot(), []);

  // 生成缓存 key
  const cacheKey = useMemo(() => getCacheKey(timeSlot, currentTab), [timeSlot, currentTab]);

  /**
   * 获取当前模式的图片列表
   */
  const getImagesList = useCallback(() => {
    switch (currentTab) {
      case 'memorial':
        return MEMORIAL_SPRITE_IMAGES;
      case 'vacation':
        return VACATION_SPRITE_IMAGES;
      case 'normal':
      case 'home':
      default:
        return SPRITE_IMAGES[timeSlot];
    }
  }, [currentTab, timeSlot]);

  /**
   * 获取或创建固定的随机索引
   */
  const getStableIndex = useCallback((images: string[]): number => {
    // 如果用户手动切换过，使用手动索引
    if (manualIndex !== null) {
      return manualIndex % images.length;
    }

    // 尝试从缓存获取
    const cachedIndex = getCachedIndex(cacheKey);
    if (cachedIndex !== null && cachedIndex < images.length) {
      return cachedIndex;
    }

    // 生成新的随机索引并缓存
    const randomIndex = Math.floor(Math.random() * images.length);
    setCachedIndex(cacheKey, randomIndex);
    return randomIndex;
  }, [cacheKey, manualIndex]);

  /**
   * 获取当前显示的小精灵图片
   */
  const getCurrentSpriteImage = useCallback(() => {
    const images = getImagesList();
    if (!images || images.length === 0) {
      return '';
    }
    const index = getStableIndex(images);
    return images[index];
  }, [getImagesList, getStableIndex]);

  /**
   * 随机切换小精灵图片（手动切换，会覆盖缓存）
   */
  const randomizeSpriteImage = useCallback(() => {
    const images = getImagesList();
    if (!images || images.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    setManualIndex(randomIndex);
    setCachedIndex(cacheKey, randomIndex);
  }, [getImagesList, cacheKey]);

  return {
    getCurrentSpriteImage,
    randomizeSpriteImage,
    currentSpriteIndex: manualIndex ?? getCachedIndex(cacheKey) ?? 0
  };
}
