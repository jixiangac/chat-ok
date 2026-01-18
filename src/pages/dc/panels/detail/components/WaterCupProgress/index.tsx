import React, { useEffect, useState, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from './styles.module.css';
import { formatDisplayNumber } from '../../../../utils';
import { RiveWatering, CoffeeCupSvg } from '../../../../riv';

export interface WaterCupProgressProps {
  /** 周期进度百分比 (0-100) */
  progress: number;
  /** 当前值 */
  currentValue: number;
  /** 目标值 */
  targetValue: number;
  /** 单位 */
  unit?: string;
  /** 是否显示动画 */
  animate?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 杯身颜色 */
  cupColor?: string;
  /** 液体颜色 */
  liquidColor?: string;
  /** 目标方向：INCREASE 增加型，DECREASE 减少型 */
  direction?: 'INCREASE' | 'DECREASE';
  /** 起始值（用于计算进度） */
  startValue?: number;
}

/**
 * 咖啡杯进度组件 - 极简扁平风格
 * 参考设计：宽矮的 U 形马克杯，实心填充，无描边
 * 
 * 特点：
 * - 可爱的咖啡杯 + 液体填充
 * - 流畅的液位上升动画（从下往上）
 * - 液体波动效果（Apple Music 风格）
 * - 完成时触发撒花庆祝效果
 * - 显示当日记录和进度信息
 */
export default function WaterCupProgress({
  progress,
  currentValue,
  targetValue,
  unit = '',
  animate = true,
  size = 'medium',
  cupColor = '#F5E6E0',
  liquidColor = '#C4A08A',
  direction = 'INCREASE',
  startValue = 0
}: WaterCupProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevProgressRef = useRef(progress);

  // 进度变化时触发动画
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
        if (isInitialRender) {
          setIsInitialRender(false);
        }
      }, isInitialRender ? 100 : 50);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
      setIsInitialRender(false);
    }
  }, [progress, animate, isInitialRender]);

  // 完成时触发撒花效果
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const wasNotComplete = prevProgressRef.current < 100;
    const isNowComplete = progress >= 100;
    
    if (wasNotComplete && isNowComplete && !hasTriggeredConfetti) {
      timer = setTimeout(() => {
        triggerConfetti();
        setHasTriggeredConfetti(true);
      }, 300);
    }
    
    prevProgressRef.current = progress;
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [progress, hasTriggeredConfetti]);

  // 撒花效果
  const triggerConfetti = () => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: ['#C4A08A', '#F5E6E0', '#D4A574', '#FFD93D', '#6BCB77'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      shapes: ['circle', 'square'],
    });
  };

  // 液体高度百分比 - 根据方向、起始值、当前值和目标值计算实际比例
  const liquidHeight = useMemo(() => {
    // 如果传入了有效的 progress，直接使用
    if (displayProgress > 0) {
      return Math.max(0, Math.min(100, displayProgress));
    }
    
    // 根据方向计算进度
    // 进度 = (实际变化量 / 目标变化量) * 100
    const isDecrease = direction === 'DECREASE';
    
    if (isDecrease) {
      // 减少型：起始值 -> 目标值（目标值 < 起始值）
      // 分母：起始值 - 目标值（需要减少的总量）
      // 分子：起始值 - 当前值（已经减少的量）
      const totalChange = startValue - targetValue;
      if (totalChange <= 0) return 100; // 目标已达成或无效
      const actualChange = startValue - currentValue;
      const ratio = (actualChange / totalChange) * 100;
      return Math.max(0, Math.min(100, ratio));
    } else {
      // 增加型：起始值 -> 目标值（目标值 > 起始值）
      // 分母：目标值 - 起始值（需要增加的总量）
      // 分子：当前值 - 起始值（已经增加的量）
      const totalChange = targetValue - startValue;
      if (totalChange <= 0) return 100; // 目标已达成或无效
      const actualChange = currentValue - startValue;
      const ratio = (actualChange / totalChange) * 100;
      return Math.max(0, Math.min(100, ratio));
    }
  }, [displayProgress, currentValue, targetValue, direction, startValue]);
    
  // 计算剩余差值
  const remaining = useMemo(() => {
    return Math.abs(targetValue - currentValue);
  }, [targetValue, currentValue]);

  // 判断是否已达成目标 - 根据方向判断
  const isGoalReached = useMemo(() => {
    const isDecrease = direction === 'DECREASE';
    if (isDecrease) {
      // 减少型：当前值 <= 目标值 表示达成
      return currentValue <= targetValue;
    } else {
      // 增加型：当前值 >= 目标值 表示达成
      return currentValue >= targetValue;
    }
  }, [currentValue, targetValue, direction]);

  const sizeClass = styles[size] || styles.medium;

  return (
    <div ref={containerRef} className={`${styles.container} ${sizeClass}`}>
      {/* 咖啡杯 SVG - 极简扁平风格 */}
      <div className={styles.cupContainer}>
        {/* <RiveWatering progress={displayProgress} /> */}
        <CoffeeCupSvg
          liquidHeight={liquidHeight}
          cupColor={cupColor}
          liquidColor={liquidColor}
          isInitialRender={isInitialRender}
          className={styles.cupSvg}
          liquidClassName={styles.liquid}
          waveOverlayClassName={styles.waveOverlay}
          fluidOverlayClassName={styles.fluidOverlay}
          energyGlowClassName={styles.energyGlow}
        />
      </div>

      {/* 进度信息 */}
      <div className={styles.progressInfo}>
        {/* 主进度数字 */}
        <div className={styles.mainValue}>{formatDisplayNumber(currentValue)}</div>
        
        {/* 目标和差值 */}
        <div className={styles.subInfo}>
          /{formatDisplayNumber(targetValue)} {unit}
          {isGoalReached 
            ? `，已达成目标` 
            : `，还差 ${formatDisplayNumber(remaining)} ${unit}`
          }
        </div>
      </div>
    </div>
  );
}

export { WaterCupProgress };
