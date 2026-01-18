import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
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
  /** 咖啡颜色（默认棕色） */
  coffeeColor?: string;
  /** 背景颜色（未填充部分） */
  backgroundColor?: string;
}

/**
 * 咖啡杯进度组件 - Neumorphism 风格
 * 用于 CHECK_IN 类型任务的周期进度展示
 * 
 * 特点：
 * - 可爱的咖啡杯 + 咖啡液体填充
 * - 流畅的液位上升动画
 * - 完成时触发撒花庆祝效果
 * - 显示当日记录和进度信息
 */
export default function CoffeeCupProgress({
  progress,
  currentValue,
  targetValue,
  unit = '次',
  animate = false,
  size = 'medium',
  coffeeColor: customCoffeeColor,
  backgroundColor = '#F5F5F0'
}: CoffeeCupProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
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

    // 标记初始渲染完成
    if (isInitialRender) {
      setIsInitialRender(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [progress, animate, displayProgress, isInitialRender]);

  // 波动动画
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // 根据进度计算咖啡颜色
  const computedCoffeeColor = useMemo(() => {
    if (customCoffeeColor) return customCoffeeColor;
    if (displayProgress <= 30) return 'var(--coffee-light, #D4A574)';
    if (displayProgress <= 70) return 'var(--coffee-medium, #A0522D)';
    return 'var(--coffee-dark, #6F4E37)';
  }, [displayProgress, customCoffeeColor]);

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
      colors: ['#D4A574', '#A0522D', '#6F4E37', '#FFD93D', '#6BCB77'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      shapes: ['circle', 'square'],
    });
  };

  // 是否显示蒸汽（进度 > 30%）
  const showSteam = displayProgress > 30;

  // 水位高度 - 按比例计算（最小 5%，最大 90%）
  const waterLevel = useMemo(() => {
    // 确保进度在 0-100 范围内
    const clampedProgress = Math.max(0, Math.min(100, displayProgress));
    // 按比例映射到 5%-90% 的高度范围
    return 5 + (clampedProgress / 100) * 85;
  }, [displayProgress]);

  // 生成流体渐变色
  const fluidGradient = useMemo(() => {
    const baseColor = computedCoffeeColor;
    const phase = wavePhase * (Math.PI / 180);
    const shift = Math.sin(phase) * 10;
    return `linear-gradient(${180 + shift}deg, ${baseColor} 0%, color-mix(in srgb, ${baseColor} 80%, #8B4513) 50%, color-mix(in srgb, ${baseColor} 60%, #3E2723) 100%)`;
  }, [computedCoffeeColor, wavePhase]);

  // 计算差值
  const remaining = useMemo(() => {
    return Math.max(0, targetValue - currentValue);
  }, [targetValue, currentValue]);

  // 是否已完成
  const isCompleted = displayProgress >= 100;

  const sizeClass = styles[size] || styles.medium;

  return (
    <div ref={containerRef} className={`${styles.container} ${sizeClass}`}>
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
          <motion.div
            className={`${styles.coffee} ${isAnimating ? styles.animating : ''}`}
            initial={{ height: isInitialRender ? '0%' : `${waterLevel}%` }}
            animate={{ height: `${waterLevel}%` }}
            transition={{
              duration: isInitialRender ? 1.2 : 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              background: fluidGradient
            }}
          >
            {/* 流体波动层 */}
            <div className={styles.fluidWaves}>
              <svg 
                viewBox="0 0 100 20" 
                preserveAspectRatio="none" 
                className={styles.wave1}
              >
                <path 
                  d={`M0,10 Q${12.5 + Math.sin(wavePhase * 0.05) * 5},${5 + Math.sin(wavePhase * 0.03) * 3} 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z`}
                  fill="rgba(255,255,255,0.15)"
                />
              </svg>
              <svg 
                viewBox="0 0 100 20" 
                preserveAspectRatio="none" 
                className={styles.wave2}
              >
                <path 
                  d={`M0,12 Q${15 + Math.cos(wavePhase * 0.04) * 4},${6 + Math.cos(wavePhase * 0.025) * 4} 30,12 T60,12 T90,12 T100,12 L100,20 L0,20 Z`}
                  fill="rgba(255,255,255,0.1)"
                />
              </svg>
            </div>
            
            {/* 能量光晕效果 */}
            <div className={styles.energyGlow} />
            
            {/* 泡沫层 */}
            <div className={styles.foam}>
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={styles.foamWave}>
                <path 
                  d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5 L100,10 L0,10 Z" 
                  fill="var(--coffee-foam, #F5DEB3)"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* 杯把手 */}
        <div className={styles.handle} />

        {/* 杯底盘 */}
        <div className={styles.saucer} />
      </div>

      {/* 进度信息 */}
      <div className={styles.progressInfo}>
        {/* 主进度数字 */}
        <div className={styles.mainValue}>{currentValue}</div>
        
        {/* 目标和差值 */}
        <div className={styles.subInfo}>
          /{targetValue} {unit}，还差 {remaining} {unit}
        </div>
      </div>
    </div>
  );
}

export { CoffeeCupProgress };


