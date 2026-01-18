import { useMemo, useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface CoffeeCupProgressProps {
  /** 周期进度百分比 (0-100) */
  progress: number;
  /** 当前值 */
  currentValue: number;
  /** 目标值 */
  targetValue: number;
  /** 单位 */
  unit?: string;
  /** 是否显示动画（打卡成功时触发） */
  animate?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
}

/**
 * 咖啡杯进度组件 - Neumorphism 风格
 * 用于 CHECK_IN 类型任务的周期进度展示
 */
export default function CoffeeCupProgress({
  progress,
  currentValue,
  targetValue,
  unit = '次',
  animate = false,
  size = 'medium'
}: CoffeeCupProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isAnimating, setIsAnimating] = useState(false);

  // 进度变化时触发动画
  useEffect(() => {
    if (animate && progress !== displayProgress) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
        setIsAnimating(false);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animate]);

  // 根据进度计算咖啡颜色
  const coffeeColor = useMemo(() => {
    if (displayProgress <= 30) return 'var(--coffee-light)';
    if (displayProgress <= 70) return 'var(--coffee-medium)';
    return 'var(--coffee-dark)';
  }, [displayProgress]);

  // 是否显示蒸汽（进度 > 30%）
  const showSteam = displayProgress > 30;

  // 水位高度（最小 5%，最大 85%）
  const waterLevel = Math.max(5, Math.min(85, displayProgress * 0.85));

  const sizeClass = styles[size] || styles.medium;

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      {/* 蒸汽动画 */}
      {showSteam && (
        <div className={styles.steamContainer}>
          <div className={`${styles.steam} ${styles.steam1}`} />
          <div className={`${styles.steam} ${styles.steam2}`} />
          <div className={`${styles.steam} ${styles.steam3}`} />
        </div>
      )}

      {/* 咖啡杯主体 */}
      <div className={styles.cupWrapper}>
        {/* 杯身 */}
        <div className={styles.cup}>
          {/* 咖啡液体 */}
          <div 
            className={`${styles.coffee} ${isAnimating ? styles.animating : ''}`}
            style={{ 
              height: `${waterLevel}%`,
              background: `linear-gradient(180deg, ${coffeeColor} 0%, ${coffeeColor} 90%, var(--coffee-dark) 100%)`
            }}
          >
            {/* 泡沫层 */}
            <div className={styles.foam}>
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={styles.foamWave}>
                <path 
                  d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5 L100,10 L0,10 Z" 
                  fill="var(--coffee-foam)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 杯把手 */}
        <div className={styles.handle} />

        {/* 杯底盘 */}
        <div className={styles.saucer} />
      </div>

      {/* 进度文字 */}
      <div className={styles.progressText}>
        <span className={styles.currentValue}>{currentValue}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.targetValue}>{targetValue}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  );
}

export { CoffeeCupProgress };
