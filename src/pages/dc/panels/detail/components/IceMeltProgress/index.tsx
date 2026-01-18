import { useMemo, useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface IceMeltProgressProps {
  /** 周期进度百分比 (0-100) - 进度越高，冰块融化越多 */
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
}

/**
 * 冰块融化组件 - Glassmorphism 风格
 * 用于 NUMERIC 减少型任务的周期进度展示
 * 进度越高，冰块越小，融化水越多
 */
export default function IceMeltProgress({
  progress,
  currentValue,
  targetValue,
  unit = '',
  animate = false,
  size = 'medium'
}: IceMeltProgressProps) {
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

  // 冰块大小（进度越高，冰块越小）
  const iceScale = Math.max(0.3, 1 - displayProgress * 0.007);
  
  // 融化水高度（进度越高，水越多）
  const waterLevel = Math.min(40, displayProgress * 0.4);

  // 裂纹数量（进度越高，裂纹越多）
  const crackCount = Math.min(5, Math.floor(displayProgress / 20));

  // 生成裂纹路径
  const cracks = useMemo(() => {
    return Array.from({ length: crackCount }, (_, i) => ({
      id: i,
      path: generateCrackPath(i),
      delay: i * 0.1
    }));
  }, [crackCount]);

  const sizeClass = styles[size] || styles.medium;

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      {/* 冰块区域 */}
      <div className={styles.iceWrapper}>
        {/* 冰块主体 */}
        <div 
          className={`${styles.ice} ${isAnimating ? styles.animating : ''}`}
          style={{ transform: `scale(${iceScale})` }}
        >
          {/* 冰块内部纹理 */}
          <div className={styles.iceTexture} />
          
          {/* 裂纹 */}
          <svg className={styles.cracks} viewBox="0 0 100 100" preserveAspectRatio="none">
            {cracks.map(crack => (
              <path
                key={crack.id}
                d={crack.path}
                className={styles.crack}
                style={{ animationDelay: `${crack.delay}s` }}
              />
            ))}
          </svg>

          {/* 高光 */}
          <div className={styles.iceHighlight} />
        </div>

        {/* 水滴滴落 */}
        {displayProgress > 20 && (
          <div className={styles.dropContainer}>
            <div className={styles.drop} />
            <div className={`${styles.drop} ${styles.drop2}`} />
          </div>
        )}
      </div>

      {/* 融化水 */}
      <div className={styles.waterPool}>
        <div 
          className={styles.water}
          style={{ height: `${waterLevel}px` }}
        >
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={styles.waterWave}>
            <path 
              d="M0,5 Q12.5,2 25,5 T50,5 T75,5 T100,5 L100,10 L0,10 Z" 
              fill="var(--water-blue-light, #B8E0FF)"
            />
          </svg>
        </div>
      </div>

      {/* 进度文字 */}
      <div className={styles.progressText}>
        <span className={styles.currentValue}>{currentValue}</span>
        <span className={styles.separator}>→</span>
        <span className={styles.targetValue}>{targetValue}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  );
}

// 生成裂纹路径
function generateCrackPath(index: number): string {
  const startX = 30 + (index * 15) % 40;
  const startY = 20 + (index * 10) % 30;
  const midX = startX + (index % 2 === 0 ? 10 : -10);
  const midY = startY + 20;
  const endX = midX + (index % 2 === 0 ? -5 : 5);
  const endY = midY + 15;
  
  return `M${startX},${startY} L${midX},${midY} L${endX},${endY}`;
}

export { IceMeltProgress };
