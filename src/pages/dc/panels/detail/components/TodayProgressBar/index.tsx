import { useMemo } from 'react';
import styles from './styles.module.css';
import { getCurrentDate } from '../../../../utils';
import dayjs from 'dayjs';

export interface TodayProgressBarProps {
  /** 今日进度百分比 (0-100) */
  progress: number;
  /** 当前值 */
  currentValue: number;
  /** 目标值 */
  targetValue: number;
  /** 单位 */
  unit?: string;
  /** 是否已完成 */
  isCompleted?: boolean;
  /** 显示模式 */
  showLabel?: boolean;
  /** 任务级调试日期偏移量 */
  debugDayOffset?: number;
}

/**
 * 奶油风今日进度条 - Soft UI Evolution 风格
 * 位于咖啡杯下方，展示今日进度
 */
export default function TodayProgressBar({
  progress,
  currentValue,
  targetValue,
  unit = '次',
  isCompleted = false,
  showLabel = true,
  debugDayOffset
}: TodayProgressBarProps) {
  // 限制进度在 0-100 之间
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // 进度条填充宽度
  const fillWidth = useMemo(() => {
    return `${clampedProgress}%`;
  }, [clampedProgress]);

  // 获取今日日期（考虑调试偏移量）
  const todayDate = useMemo(() => {
    // 使用模拟任务对象来获取正确的日期
    const simulatedTask = debugDayOffset ? { debugDayOffset } : undefined;
    return dayjs(getCurrentDate(simulatedTask)).format('M月D日');
  }, [debugDayOffset]);

  return (
    <div className={styles.container}>
      {showLabel && (
        <div className={styles.labelRow}>
          <span className={styles.label}>今日进度 · {todayDate}</span>
          <span className={styles.value}>
            {currentValue}/{targetValue} {unit}
          </span>
        </div>
      )}
      
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${isCompleted ? styles.completed : ''}`}
          style={{ width: fillWidth }}
        >
          {/* 波浪效果 */}
          <svg 
            className={styles.wave} 
            viewBox="0 0 20 24" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,12 Q5,8 10,12 T20,12 L20,24 L0,24 Z" 
              fill="currentColor"
            />
          </svg>
          
          {/* 奶油滴落效果 */}
          {clampedProgress > 10 && (
            <div className={styles.dripContainer}>
              <div className={styles.drip} />
            </div>
          )}
        </div>
      </div>
      
      {/* 完成状态 */}
      {isCompleted && (
        <div className={styles.completedBadge}>
          <span className={styles.completedIcon}>☕</span>
          <span className={styles.completedText}>今日目标已达成</span>
        </div>
      )}
    </div>
  );
}

export { TodayProgressBar };

