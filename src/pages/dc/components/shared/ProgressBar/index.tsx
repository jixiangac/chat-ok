import { memo, useMemo } from 'react';
import styles from './styles.module.css';

interface ProgressBarProps {
  /** 进度值 0-100 */
  progress: number;
  /** 高度 */
  height?: number;
  /** 进度条颜色或渐变 */
  color?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示动画 */
  animated?: boolean;
  /** 是否显示条纹 */
  striped?: boolean;
  /** 圆角大小 */
  borderRadius?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 进度条组件
 * 使用 memo 优化渲染性能
 */
function ProgressBarComponent({
  progress,
  height = 8,
  color = 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
  backgroundColor = '#e5e7eb',
  animated = false,
  striped = false,
  borderRadius,
  className
}: ProgressBarProps) {
  // 使用 useMemo 缓存样式计算
  const progressStyle = useMemo(() => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    return {
      width: `${clampedProgress}%`,
      background: color,
      borderRadius: borderRadius ?? height / 2
    };
  }, [progress, color, borderRadius, height]);

  const containerStyle = useMemo(() => ({
    height,
    backgroundColor,
    borderRadius: borderRadius ?? height / 2
  }), [height, backgroundColor, borderRadius]);

  const classNames = [
    styles.container,
    className
  ].filter(Boolean).join(' ');

  const progressClassNames = [
    styles.progress,
    animated && styles.animated,
    striped && styles.striped
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={containerStyle}>
      <div 
        className={progressClassNames}
        style={progressStyle}
      />
    </div>
  );
}

// 使用 memo 包装，只在 props 变化时重新渲染
export const ProgressBar = memo(ProgressBarComponent);
export default ProgressBar;
