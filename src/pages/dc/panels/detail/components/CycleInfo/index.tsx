import { Calendar } from 'lucide-react';
import styles from './styles.module.css';
import { formatDisplayNumber } from '../../../../utils';

export interface CycleInfoProps {
  /** 当前周期 */
  currentCycle: number;
  /** 总周期数 */
  totalCycles: number;
  /** 剩余天数 */
  remainingDays: number;
  /** 周期开始日期 */
  startDate: string;
  /** 周期结束日期 */
  endDate: string;
  /** 周期天数 */
  cycleDays?: number;
  /** 当前是第几天 */
  currentDay?: number;
  /** 完成率（百分比） */
  completionRate?: number;
  /** 周期已完成数量（用于日期行显示） */
  cycleAchieved?: number;
  /** 周期目标数量（用于日期行显示） */
  cycleTarget?: number;
}

/**
 * 周期信息展示组件
 * 显示当前周期/总周期、进度、完成率等信息
 */
export default function CycleInfo({
  currentCycle,
  totalCycles,
  remainingDays,
  startDate,
  endDate,
  cycleDays = 7,
  currentDay = 1,
  completionRate = 0,
  cycleAchieved,
  cycleTarget
}: CycleInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.label}>周期</span>
          <span className={styles.value}>
            <strong>{currentCycle}</strong>
            <span className={styles.separator}>/</span>
            <span className={styles.total}>{totalCycles}</span>
          </span>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.infoItem}>
          <span className={styles.label}>进度</span>
          <span className={styles.value}>
            <strong>{currentDay}</strong>
            <span className={styles.separator}>/</span>
            <span className={styles.total}>{cycleDays}天</span>
          </span>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.infoItem}>
          <span className={styles.label}>完成率</span>
          <span className={styles.value}>
            <strong>{Math.round(completionRate)}</strong>
            <span className={styles.total}>%</span>
          </span>
        </div>
      </div>
      
      <div className={styles.dateRange}>
        <div className={styles.dateLeft}>
          <Calendar size={14} className={styles.icon} />
          <span>{startDate} - {endDate}</span>
        </div>
        {cycleAchieved !== undefined && cycleTarget !== undefined && (
          <div className={styles.cycleProgress}>
            <span className={styles.cycleValue}>{formatDisplayNumber(cycleAchieved)}</span>
            <span className={styles.cycleSeparator}>/</span>
            <span className={styles.cycleTotal}>{formatDisplayNumber(cycleTarget)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { CycleInfo };


