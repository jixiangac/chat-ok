import { memo, useMemo } from 'react';
import styles from './styles.module.css';

interface CircleProgressProps {
  /** 进度值 0-100 */
  progress: number;
  /** 圆环大小 */
  size?: number;
  /** 圆环粗细 */
  strokeWidth?: number;
  /** 渐变起始颜色 */
  startColor?: string;
  /** 渐变结束颜色 */
  endColor?: string;
  /** 背景圆环颜色 */
  backgroundColor?: string;
  /** 是否显示中心文字 */
  showValue?: boolean;
  /** 自定义中心内容 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/**
 * 圆形进度组件
 * 使用 memo 优化渲染性能
 */
function CircleProgressComponent({
  progress,
  size = 80,
  strokeWidth = 8,
  startColor = '#6366f1',
  endColor = '#8b5cf6',
  backgroundColor = '#e5e7eb',
  showValue = true,
  children,
  className
}: CircleProgressProps) {
  // 使用 useMemo 缓存计算结果
  const { radius, circumference, strokeDasharray, gradientId } = useMemo(() => {
    const r = (100 - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const dashArray = `${(clampedProgress / 100) * c} ${c}`;
    const id = `circleGradient_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      radius: r,
      circumference: c,
      strokeDasharray: dashArray,
      gradientId: id
    };
  }, [progress, strokeWidth]);

  return (
    <div 
      className={`${styles.container} ${className || ''}`}
      style={{ width: size, height: size }}
    >
      <svg className={styles.svg} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        {/* 背景圆环 */}
        <circle
          className={styles.background}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* 进度圆环 */}
        <circle
          className={styles.progress}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* 中心内容 */}
      <div className={styles.center}>
        {children || (showValue && <span className={styles.value}>{Math.round(progress)}%</span>)}
      </div>
    </div>
  );
}

// 使用 memo 包装，只在 props 变化时重新渲染
export const CircleProgress = memo(CircleProgressComponent);
export default CircleProgress;
