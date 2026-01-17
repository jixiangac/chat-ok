/**
 * 下拉触发 Hook
 * 用于实现下拉超过阈值后触发特定操作（如显示修炼面板）
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface UsePullToRevealOptions {
  /** 触发阈值（像素） */
  threshold?: number;
  /** 最大下拉距离（像素） */
  maxPull?: number;
  /** 是否启用 */
  enabled?: boolean;
  /** 触发回调 */
  onReveal?: () => void;
  /** 下拉进度回调 */
  onProgress?: (progress: number) => void;
}

export interface UsePullToRevealReturn {
  /** 绑定到容器的 props */
  containerProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  /** 当前下拉距离 */
  pullDistance: number;
  /** 下拉进度 (0-1) */
  progress: number;
  /** 是否正在下拉 */
  isPulling: boolean;
  /** 是否已触发 */
  isTriggered: boolean;
  /** 重置状态 */
  reset: () => void;
}

export function usePullToReveal(options: UsePullToRevealOptions = {}): UsePullToRevealReturn {
  const {
    threshold = 120,
    maxPull = 200,
    enabled = true,
    onReveal,
    onProgress,
  } = options;

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);
  const isAtTop = useRef(true);

  // 计算进度
  const progress = Math.min(1, pullDistance / threshold);

  // 检查是否在顶部
  const checkIsAtTop = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return true;
    
    // 向上查找可滚动的父元素
    let current: HTMLElement | null = element;
    while (current) {
      if (current.scrollTop > 0) {
        return false;
      }
      current = current.parentElement;
    }
    return true;
  }, []);

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isTriggered) return;

    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;
    
    // 检查是否在顶部
    isAtTop.current = checkIsAtTop(e.target as HTMLElement);
    
    if (isAtTop.current) {
      setIsPulling(true);
    }
  }, [enabled, isTriggered, checkIsAtTop]);

  // 触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isPulling || isTriggered) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;
    
    const deltaY = currentY.current - startY.current;
    
    // 只处理向下拉动
    if (deltaY > 0 && isAtTop.current) {
      // 使用阻尼效果，拉得越远阻力越大
      const dampedDistance = Math.min(maxPull, deltaY * 0.5);
      setPullDistance(dampedDistance);
      
      // 触发进度回调
      const currentProgress = Math.min(1, dampedDistance / threshold);
      onProgress?.(currentProgress);
      
      // 注意：不再调用 preventDefault()，因为 React 的触摸事件是 passive 的
      // 如果需要阻止滚动，应该使用 CSS: touch-action: none 或 overscroll-behavior: contain
    } else {
      setPullDistance(0);
    }
  }, [enabled, isPulling, isTriggered, threshold, maxPull, onProgress]);

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!enabled || !isPulling) return;

    setIsPulling(false);

    // 检查是否超过阈值
    if (pullDistance >= threshold && !isTriggered) {
      setIsTriggered(true);
      onReveal?.();
    }

    // 重置下拉距离
    setPullDistance(0);
    onProgress?.(0);
  }, [enabled, isPulling, pullDistance, threshold, isTriggered, onReveal, onProgress]);

  // 重置状态
  const reset = useCallback(() => {
    setPullDistance(0);
    setIsPulling(false);
    setIsTriggered(false);
  }, []);

  // 当 isTriggered 变为 false 时重置
  useEffect(() => {
    if (!isTriggered) {
      setPullDistance(0);
    }
  }, [isTriggered]);

  return {
    containerProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    pullDistance,
    progress,
    isPulling,
    isTriggered,
    reset,
  };
}

export default usePullToReveal;
