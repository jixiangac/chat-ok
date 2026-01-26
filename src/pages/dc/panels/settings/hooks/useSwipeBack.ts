/**
 * 手势返回 Hook
 * 支持从左边缘向右滑动返回上一页
 */

import { useRef, useCallback, useEffect } from 'react';

export interface UseSwipeBackOptions {
  /** 返回回调 */
  onBack: () => void;
  /** 触发返回的滑动距离阈值（默认 100px） */
  threshold?: number;
  /** 左边缘检测宽度（默认 50px） */
  edgeWidth?: number;
  /** 是否启用手势（默认 true） */
  enabled?: boolean;
}

export interface UseSwipeBackReturn {
  /** 绑定到页面容器的 ref */
  pageRef: React.RefObject<HTMLDivElement | null>;
  /** 手动绑定事件的回调（用于动态 ref 场景） */
  bindEvents: (element: HTMLDivElement | null) => void;
}

/**
 * 手势返回 Hook
 * 只响应从左边缘（< edgeWidth）开始的滑动，避免与系统手势冲突
 */
export function useSwipeBack({
  onBack,
  threshold = 100,
  edgeWidth = 50,
  enabled = true,
}: UseSwipeBackOptions): UseSwipeBackReturn {
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      // 只响应从左边缘开始的滑动
      if (touch.clientX < edgeWidth) {
        startX.current = touch.clientX;
        startY.current = touch.clientY;
        isDragging.current = true;
        isHorizontalSwipe.current = null;
      }
    },
    [enabled, edgeWidth]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current || !enabled) return;

      const touch = e.touches[0];
      currentX.current = touch.clientX;
      const deltaX = currentX.current - startX.current;
      const deltaY = touch.clientY - startY.current;

      // 判断是否为水平滑动（首次移动时判断）
      if (isHorizontalSwipe.current === null) {
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
          isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
        }
      }

      // 只处理水平向右滑动
      if (isHorizontalSwipe.current && deltaX > 0 && pageRef.current) {
        // 阻止默认行为，防止页面滚动
        e.preventDefault();
        // 实时更新页面位置，提供拖拽反馈
        pageRef.current.style.transform = `translateX(${deltaX}px)`;
        pageRef.current.style.transition = 'none';
      }
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || !enabled) return;

    const deltaX = currentX.current - startX.current;

    if (pageRef.current) {
      // 恢复过渡动画
      pageRef.current.style.transition = 'transform 0.3s ease-out';

      if (isHorizontalSwipe.current && deltaX > threshold) {
        // 触发返回 - 先完成滑出动画
        pageRef.current.style.transform = 'translateX(100%)';
        setTimeout(onBack, 300);
      } else {
        // 回弹
        pageRef.current.style.transform = 'translateX(0)';
      }
    }

    // 重置状态
    isDragging.current = false;
    isHorizontalSwipe.current = null;
    startX.current = 0;
    startY.current = 0;
    currentX.current = 0;
  }, [enabled, threshold, onBack]);

  // 用于追踪当前绑定的元素，支持动态绑定
  const boundElement = useRef<HTMLDivElement | null>(null);

  // 手动绑定事件的方法（用于动态 ref 场景）
  const bindEvents = useCallback((element: HTMLDivElement | null) => {
    // 清理旧的绑定
    if (boundElement.current) {
      boundElement.current.removeEventListener('touchstart', handleTouchStart);
      boundElement.current.removeEventListener('touchmove', handleTouchMove);
      boundElement.current.removeEventListener('touchend', handleTouchEnd);
      boundElement.current.removeEventListener('touchcancel', handleTouchEnd);
      boundElement.current = null;
    }

    // 绑定新元素
    if (element && enabled) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchcancel', handleTouchEnd);
      boundElement.current = element;
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  // 当 enabled 状态改变时，重新绑定事件
  useEffect(() => {
    if (boundElement.current) {
      bindEvents(boundElement.current);
    }
  }, [enabled, bindEvents]);

  useEffect(() => {
    const element = pageRef.current;
    if (!element || !enabled) return;

    // 使用 passive: false 以便能够阻止默认行为
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  // 组件卸载时清理动态绑定
  useEffect(() => {
    return () => {
      if (boundElement.current) {
        boundElement.current.removeEventListener('touchstart', handleTouchStart);
        boundElement.current.removeEventListener('touchmove', handleTouchMove);
        boundElement.current.removeEventListener('touchend', handleTouchEnd);
        boundElement.current.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pageRef, bindEvents };
}

export default useSwipeBack;

