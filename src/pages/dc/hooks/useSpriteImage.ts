import { useState, useCallback } from 'react';
import { SPRITE_IMAGES, MEMORIAL_SPRITE_IMAGES, VACATION_SPRITE_IMAGES, getCurrentTimeSlot } from '../constants';
import { useUIState, type TabKey } from '../contexts';

/**
 * 小精灵图片管理 Hook
 * 根据时间段或 activeTab 显示不同的小精灵图片，支持随机切换
 * 
 * @param overrideTab - 可选的覆盖 tab，如果不提供则使用全局 activeTab
 *   - 'normal': 使用时间段图片
 *   - 'memorial': 使用纪念日专属图片
 *   - 'vacation': 使用度假模式专属图片
 */
export function useSpriteImage(overrideTab?: TabKey) {
  const { activeTab } = useUIState();
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(-1);
  
  // 使用传入的 tab 或全局 activeTab
  const currentTab = overrideTab || activeTab;

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
        const timeSlot = getCurrentTimeSlot();
        return SPRITE_IMAGES[timeSlot];
    }
  }, [currentTab]);

  /**
   * 获取当前显示的小精灵图片
   */
  const getCurrentSpriteImage = useCallback(() => {
    const images = getImagesList();
    if (!images || images.length === 0) {
      // 如果没有图片，返回空字符串或默认图片
      return '';
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    const lastIndex = currentSpriteIndex === -1 ? randomIndex : currentSpriteIndex;
    return images[lastIndex % images.length];
  }, [getImagesList, currentSpriteIndex]);

  /**
   * 随机切换小精灵图片
   */
  const randomizeSpriteImage = useCallback(() => {
    const images = getImagesList();
    if (!images || images.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentSpriteIndex(randomIndex);
  }, [getImagesList]);

  return {
    getCurrentSpriteImage,
    randomizeSpriteImage,
    currentSpriteIndex
  };
}
