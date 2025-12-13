import { Check, Calendar, Flame } from 'lucide-react';
import type { GoalDetail, CurrentCycleInfo } from './types';
import styles from '../css/CheckInCyclePanel.module.css';

interface CheckInCyclePanelProps {
  goal: GoalDetail;
  cycle: CurrentCycleInfo;
}

export default function CheckInCyclePanel({ 
  goal, 
  cycle 
}: CheckInCyclePanelProps) {
  const config = goal.checkInConfig;
  const isCompleted = cycle.checkInCount >= cycle.requiredCheckIns;
  const progress = (cycle.checkInCount / cycle.requiredCheckIns) * 100;
  const remaining = cycle.requiredCheckIns - cycle.checkInCount;
  
  // 计算连续打卡和累计打卡
  const currentStreak = config?.currentStreak || 0;
  const totalCheckIns = goal.checkIns?.length || 0;
  
  // 判断今日是否已打卡
  const today = new Date().toISOString().split('T')[0];
  const todayCheckedIn = goal.checkIns?.some(c => c.date === today) || false;
  
  return (
    <div className={styles.container}>
      {/* 主要进度区域 */}
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
            <Check size={14} className={styles.checkIcon} />
            已完成
          </div>
        ) : todayCheckedIn ? (
          <div className={styles.todayBadge}>
            <Check size={14} className={styles.checkIcon} />
            今日已打卡
          </div>
        ) : (
          <div className={styles.remainingHint}>
            还需 <strong>{remaining}</strong> 次完成本周期
          </div>
        )}
      </div>
      
      {/* 数据统计 - 两列布局 */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{currentStreak}天</div>
          <div className={styles.statLabel}>连续打卡</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalCheckIns}次</div>
          <div className={styles.statLabel}>累计打卡</div>
        </div>
      </div>
      
      {/* 连续打卡记录 */}
      {currentStreak > 0 && (
        <div className={styles.streakBanner}>
          <Flame size={16} className={styles.streakIcon} />
          <span>连续打卡记录: {currentStreak}天</span>
        </div>
      )}
      
      {/* 周期时间 */}
      <div className={styles.timeRange}>
        <Calendar size={14} className={styles.timeIcon} />
        <span>本周期: {cycle.startDate} - {cycle.endDate}</span>
      </div>
    </div>
  );
}
