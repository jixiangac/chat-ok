import { useState, useCallback } from 'react';
import { SPRITE_IMAGES, getCurrentTimeSlot } from '../constants';

/**
 * 小精灵图片管理 Hook
 * 根据时间段显示不同的小精灵图片，支持随机切换
 */
export function useSpriteImage() {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(-1);

  /**
   * 获取当前时间段的图片列表
   */
  const getImagesList = useCallback(() => {
    const timeSlot = getCurrentTimeSlot();
    return SPRITE_IMAGES[timeSlot];
  }, []);

  /**
   * 获取当前显示的小精灵图片
   */
  const getCurrentSpriteImage = useCallback(() => {
    const images = getImagesList();
    const randomIndex = Math.floor(Math.random() * images.length);
    const lastIndex = currentSpriteIndex === -1 ? randomIndex : currentSpriteIndex;
    return images[lastIndex % images.length];
  }, [getImagesList, currentSpriteIndex]);

  /**
   * 随机切换小精灵图片
   */
  const randomizeSpriteImage = useCallback(() => {
    const images = getImagesList();
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentSpriteIndex(randomIndex);
  }, [getImagesList]);

  return {
    getCurrentSpriteImage,
    randomizeSpriteImage,
    currentSpriteIndex
  };
}
