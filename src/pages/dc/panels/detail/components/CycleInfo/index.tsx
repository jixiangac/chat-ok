import { Calendar, Clock } from 'lucide-react';
import styles from './styles.module.css';

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
}

/**
 * 周期信息展示组件
 * 显示当前周期/总周期、剩余天数等信息
 */
export default function CycleInfo({
  currentCycle,
  totalCycles,
  remainingDays,
  startDate,
  endDate,
  cycleDays = 7,
  currentDay = 1
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
          <span className={styles.label}>剩余</span>
          <span className={styles.value}>
            <strong>{remainingDays}</strong>
            <span className={styles.total}>天</span>
          </span>
        </div>
      </div>
      
      <div className={styles.dateRange}>
        <Calendar size={14} className={styles.icon} />
        <span>{startDate} - {endDate}</span>
      </div>
    </div>
  );
}

export { CycleInfo };
