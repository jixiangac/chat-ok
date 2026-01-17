/**
 * 下拉进入二楼 Hook
 * 实现类似淘宝二楼的交互效果：
 * 1. 下拉时整个界面跟随下移
 * 2. 超过阈值后松开进入二楼
 * 3. 支持上滑手势关闭
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface UsePullToSecondFloorOptions {
  /** 第一阶段阈值（显示松开刷新） */
  firstThreshold?: number;
  /** 第二阶段阈值（进入二楼） */
  secondThreshold?: number;
  /** 最大下拉距离 */
  maxPull?: number;
  /** 是否启用 */
  enabled?: boolean;
  /** 进入二楼回调 */
  onEnterSecondFloor?: () => void;
  /** 离开二楼回调 */
  onLeaveSecondFloor?: () => void;
  /** 下拉进度回调 */
  onProgress?: (progress: number, stage: 'idle' | 'first' | 'second') => void;
}

export interface UsePullToSecondFloorReturn {
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
  /** 当前阶段 */
  stage: 'idle' | 'first' | 'second';
  /** 是否正在下拉 */
  isPulling: boolean;
  /** 是否在二楼 */
  isInSecondFloor: boolean;
  /** 进入二楼 */
  enterSecondFloor: () => void;
  /** 离开二楼 */
  leaveSecondFloor: () => void;
  /** 重置状态 */
  reset: () => void;
}

export function usePullToSecondFloor(options: UsePullToSecondFloorOptions = {}): UsePullToSecondFloorReturn {
  const {
    firstThreshold = 80,
    secondThreshold = 150,
    maxPull = 250,
    enabled = true,
    onEnterSecondFloor,
    onLeaveSecondFloor,
    onProgress,
  } = options;

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isInSecondFloor, setIsInSecondFloor] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);
  const isAtTop = useRef(true);
  const animationRef = useRef<number | null>(null);

  // 计算当前阶段
  const stage: 'idle' | 'first' | 'second' = 
    pullDistance >= secondThreshold ? 'second' :
    pullDistance >= firstThreshold ? 'first' : 'idle';

  // 计算进度 (0-1)
  const progress = Math.min(1, pullDistance / secondThreshold);

  // 检查是否在顶部
  const checkIsAtTop = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return true;
    
    let current: HTMLElement | null = element;
    while (current) {
      if (current.scrollTop > 0) {
        return false;
      }
      current = current.parentElement;
    }
    return true;
  }, []);

  // 平滑动画到目标值
  const animateTo = useCallback((targetValue: number, duration: number = 300) => {
    const startValue = pullDistance;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // 使用 easeOutCubic 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeProgress;
      
      setPullDistance(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [pullDistance]);

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isInSecondFloor) return;

    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;
    
    isAtTop.current = checkIsAtTop(e.target as HTMLElement);
    
    if (isAtTop.current) {
      setIsPulling(true);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [enabled, isInSecondFloor, checkIsAtTop]);

  // 触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isPulling || isInSecondFloor) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;
    
    const deltaY = currentY.current - startY.current;
    
    if (deltaY > 0 && isAtTop.current) {
      // 使用阻尼效果
      const dampedDistance = Math.min(maxPull, deltaY * 0.6);
      setPullDistance(dampedDistance);
      
      // 计算当前阶段
      const currentStage: 'idle' | 'first' | 'second' = 
        dampedDistance >= secondThreshold ? 'second' :
        dampedDistance >= firstThreshold ? 'first' : 'idle';
      
      onProgress?.(Math.min(1, dampedDistance / secondThreshold), currentStage);
    } else {
      setPullDistance(0);
    }
  }, [enabled, isPulling, isInSecondFloor, firstThreshold, secondThreshold, maxPull, onProgress]);

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!enabled || !isPulling) return;

    setIsPulling(false);

    // 检查是否超过第二阶段阈值
    if (pullDistance >= secondThreshold && !isInSecondFloor) {
      setIsInSecondFloor(true);
      onEnterSecondFloor?.();
      // 动画到完全展开状态
      animateTo(0, 300);
    } else {
      // 回弹到初始位置
      animateTo(0, 300);
    }
    
    onProgress?.(0, 'idle');
  }, [enabled, isPulling, pullDistance, secondThreshold, isInSecondFloor, onEnterSecondFloor, onProgress, animateTo]);

  // 进入二楼
  const enterSecondFloor = useCallback(() => {
    setIsInSecondFloor(true);
    onEnterSecondFloor?.();
  }, [onEnterSecondFloor]);

  // 离开二楼
  const leaveSecondFloor = useCallback(() => {
    setIsInSecondFloor(false);
    onLeaveSecondFloor?.();
  }, [onLeaveSecondFloor]);

  // 重置状态
  const reset = useCallback(() => {
    setPullDistance(0);
    setIsPulling(false);
    setIsInSecondFloor(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    containerProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    pullDistance,
    progress,
    stage,
    isPulling,
    isInSecondFloor,
    enterSecondFloor,
    leaveSecondFloor,
    reset,
  };
}

export default usePullToSecondFloor;
