/**
 * 二楼下拉指示器组件
 * 显示下拉进度和阶段提示
 */

import { memo, useMemo } from 'react';
import styles from './styles.module.css';

export interface SecondFloorIndicatorProps {
  /** 下拉进度 (0-1) */
  progress: number;
  /** 当前阶段 */
  stage: 'idle' | 'first' | 'second';
  /** 是否正在下拉 */
  isPulling: boolean;
  /** 第一阶段提示 */
  firstHint?: string;
  /** 第二阶段提示 */
  secondHint?: string;
  /** 触发后提示 */
  triggeredHint?: string;
}

function SecondFloorIndicatorComponent({
  progress,
  stage,
  isPulling,
  firstHint = '松开刷新',
  secondHint = '查看等级修为',
  triggeredHint = '松开打开界面',
}: SecondFloorIndicatorProps) {
  // 不显示条件
  if (!isPulling && progress === 0) {
    return null;
  }

  // 计算显示的文字
  const displayHint = useMemo(() => {
    if (stage === 'second') {
      return triggeredHint;
    }
    if (stage === 'first') {
      return firstHint;
    }
    return secondHint;
  }, [stage, firstHint, secondHint, triggeredHint]);

  // 计算副标题
  const subHint = useMemo(() => {
    if (stage === 'idle') {
      return '继续下拉查看修为';
    }
    if (stage === 'first') {
      return '继续下拉查看修为';
    }
    return '';
  }, [stage]);

  // 图标旋转角度
  const iconRotation = useMemo(() => {
    if (stage === 'second') {
      return 180;
    }
    return progress * 180;
  }, [progress, stage]);

  return (
    <div 
      className={styles.container}
      style={{
        opacity: Math.min(1, progress * 1.5),
      }}
    >
      <div className={`${styles.indicator} ${stage === 'second' ? styles.triggered : ''}`}>
        {/* 图标区域 */}
        <div className={styles.iconWrapper}>
          {/* 进度环 */}
          <svg viewBox="0 0 40 40" className={styles.progressRing}>
            {/* 背景圆 */}
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="rgba(55, 53, 47, 0.1)"
              strokeWidth="2"
            />
            {/* 进度圆 */}
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke={stage === 'second' ? '#FFFFFF' : 'rgb(145, 175, 145)'}
              strokeWidth="2"
              strokeDasharray={`${progress * 113} 113`}
              strokeLinecap="round"
              className={styles.progressCircle}
            />
          </svg>
          {/* 箭头图标 */}
          <div 
            className={styles.arrowIcon}
            style={{ transform: `rotate(${iconRotation}deg)` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 文字区域 */}
        <div className={styles.textWrapper}>
          <span className={`${styles.mainHint} ${stage === 'second' ? styles.triggered : ''}`}>
            {displayHint}
          </span>
          {subHint && (
            <span className={styles.subHint}>
              {subHint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const SecondFloorIndicator = memo(SecondFloorIndicatorComponent);
export default SecondFloorIndicator;


