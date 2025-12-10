import type { CurrentCyclePanelProps } from './types';
import styles from '../css/CurrentCyclePanel.module.css';

export default function CurrentCyclePanel({ cycle }: CurrentCyclePanelProps) {
  const isCompleted = cycle.checkInCount >= cycle.requiredCheckIns;
  const progress = (cycle.checkInCount / cycle.requiredCheckIns) * 100;
  const remaining = cycle.requiredCheckIns - cycle.checkInCount;
  
  return (
    <div className={styles.container}>
      {/* 主要进度区域 - 核心信息突出 */}
      <div className={styles.heroSection}>
        <div className={styles.heroNumber}>
          {cycle.checkInCount}
          <span className={styles.heroUnit}>/{cycle.requiredCheckIns}</span>
        </div>
        <div className={styles.heroLabel}>本周期打卡次数</div>
        
        {/* 进度条 */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {isCompleted ? (
          <div className={styles.completedBadge}>
            <span className={styles.checkIcon}>✓</span>
            已完成
          </div>
        ) : (
          <div className={styles.remainingHint}>
            还需 <strong>{remaining}</strong> 次完成本周期
          </div>
        )}
      </div>
      
      {/* 次要信息 - 两列布局 */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{cycle.remainingDays}</div>
          <div className={styles.statLabel}>剩余天数</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{Math.round(progress)}%</div>
          <div className={styles.statLabel}>完成进度</div>
        </div>
      </div>
      
      {/* 周期时间 - 辅助信息 */}
      <div className={styles.timeRange}>
        <span className={styles.timeIcon}>📅</span>
        <span>{cycle.startDate} ~ {cycle.endDate}</span>
      </div>
    </div>
  );
}
