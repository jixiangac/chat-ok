/**
 * 下拉指示器组件
 * 显示下拉进度和提示文字
 */

import { memo, useMemo } from 'react';
import styles from './styles.module.css';

export interface PullIndicatorProps {
  /** 下拉进度 (0-1) */
  progress: number;
  /** 是否正在下拉 */
  isPulling: boolean;
  /** 是否已触发 */
  isTriggered: boolean;
  /** 提示文字 */
  hint?: string;
  /** 触发后的文字 */
  triggeredHint?: string;
}

function PullIndicatorComponent({
  progress,
  isPulling,
  isTriggered,
  hint = '下拉进入修炼',
  triggeredHint = '松开进入修炼',
}: PullIndicatorProps) {
  // 不显示条件
  if (!isPulling && progress === 0) {
    return null;
  }

  // 计算样式
  const indicatorStyle = useMemo(() => ({
    opacity: Math.min(1, progress * 2),
    transform: `translateY(${Math.min(60, progress * 80)}px) scale(${0.8 + progress * 0.2})`,
  }), [progress]);

  // 图标旋转角度
  const iconRotation = useMemo(() => progress * 180, [progress]);

  // 显示的文字
  const displayHint = progress >= 1 ? triggeredHint : hint;

  return (
    <div className={styles.container} style={indicatorStyle}>
      <div className={styles.indicator}>
        {/* 圆形进度 */}
        <div className={styles.progressRing}>
          <svg viewBox="0 0 36 36" className={styles.progressSvg}>
            {/* 背景圆 */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="2"
            />
            {/* 进度圆 */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray={`${progress * 100} 100`}
              strokeLinecap="round"
              className={styles.progressCircle}
            />
          </svg>
          {/* 箭头图标 */}
          <div 
            className={styles.arrowIcon}
            style={{ transform: `rotate(${iconRotation}deg)` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* 提示文字 */}
        <span className={`${styles.hint} ${progress >= 1 ? styles.triggered : ''}`}>
          {displayHint}
        </span>
      </div>
    </div>
  );
}

export const PullIndicator = memo(PullIndicatorComponent);
export default PullIndicator;
