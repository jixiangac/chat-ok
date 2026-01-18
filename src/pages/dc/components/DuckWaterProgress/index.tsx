import { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DUCK_PATH } from './DuckSilhouette';
import WaterWave from './WaterWave';
import styles from './styles.module.css';
import { formatDisplayNumber } from '../../utils';

export interface DuckWaterProgressProps {
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
  /** 水波颜色（默认天蓝色） */
  waterColor?: string;
  /** 背景颜色（未填充部分） */
  backgroundColor?: string;
}

/**
 * 鸭子水波进度组件
 * 参考喝水打卡应用的设计风格
 * 
 * 特点：
 * - 可爱的鸭子剪影 + 水波填充
 * - 流畅的水位上升动画
 * - 完成时触发撒花庆祝效果
 */
export default function DuckWaterProgress({
  progress,
  currentValue,
  targetValue,
  unit = 'ml',
  animate = false,
  size = 'medium',
  waterColor = '#4FC3F7',
  backgroundColor = '#E3EEF3'
}: DuckWaterProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevProgressRef = useRef(progress);

  // 进度变化时触发动画
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (animate && progress !== displayProgress) {
      setIsAnimating(true);
      timer = setTimeout(() => {
        setDisplayProgress(progress);
        setIsAnimating(false);
      }, 50);
    } else {
      setDisplayProgress(progress);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [progress, animate, displayProgress]);

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
      colors: ['#4FC3F7', '#FFD93D', '#6BCB77', '#FF6B6B', '#4D96FF'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      shapes: ['circle', 'square'],
    });
  };

  // 水位高度（最小 5%，最大 95%）
  const waterLevel = useMemo(() => {
    return Math.max(5, Math.min(95, displayProgress * 0.95));
  }, [displayProgress]);

  // 计算差值
  const remaining = useMemo(() => {
    return Math.max(0, targetValue - currentValue);
  }, [targetValue, currentValue]);

  // 是否已完成
  const isCompleted = displayProgress >= 100;

  const sizeClass = styles[size] || styles.medium;

  return (
    <div ref={containerRef} className={`${styles.container} ${sizeClass}`}>
      {/* 鸭子容器 */}
      <div className={styles.duckWrapper}>
        {/* 鸭子 SVG - 背景 + 水波填充 */}
        <svg 
          viewBox="0 0 280 320" 
          className={styles.duckSvg}
        >
          <defs>
            {/* 鸭子形状的 clipPath */}
            <clipPath id="duck-water-clip">
              <path d={DUCK_PATH} />
            </clipPath>
          </defs>
          
          {/* 鸭子背景（浅蓝灰色） */}
          <path d={DUCK_PATH} fill={backgroundColor} />
          
          {/* 水波填充层（使用 clipPath 裁剪） */}
          <g clipPath="url(#duck-water-clip)">
            <motion.g
              initial={{ y: 320 - (prevProgressRef.current / 100) * 280 }}
              animate={{ y: 320 - (waterLevel / 100) * 280 }}
              transition={{ 
                duration: 0.5, 
                ease: 'easeOut' 
              }}
            >
              {/* 水波背景 */}
              <rect 
                x="0" 
                y="0" 
                width="280" 
                height="320" 
                fill={waterColor} 
              />
              {/* 波浪效果 */}
              <motion.g
                animate={{ x: [0, -50, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <path
                  d="M-50,-5 Q-25,-12 0,-5 T50,-5 T100,-5 T150,-5 T200,-5 T250,-5 T300,-5 T350,-5"
                  fill="none"
                  stroke={waterColor}
                  strokeWidth="15"
                  opacity="0.8"
                />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </div>

      {/* 进度信息 */}
      <div className={styles.progressInfo}>
        {/* 主进度数字 */}
        <div className={styles.mainValue}>{formatDisplayNumber(currentValue)}</div>
        
        {/* 目标和差值 */}
        <div className={styles.subInfo}>
          /{formatDisplayNumber(targetValue)} {unit}，还差 {formatDisplayNumber(remaining)} {unit}
        </div>
      </div>
    </div>
  );
}

export { DuckWaterProgress };
export { DuckSilhouette } from './DuckSilhouette';
export { WaterWave } from './WaterWave';
