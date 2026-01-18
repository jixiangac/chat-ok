import React, { useMemo } from 'react';
import { Trophy, Calendar, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import type { Task, Category } from '../../../../types';
import { formatDisplayNumber } from '../../../../utils';
import styles from './styles.module.css';

export interface PlanEndedSummaryProps {
  task: Task;
}

/**
 * 计划结束总结组件
 * 在任务计划结束后显示归档总结信息
 */
export default function PlanEndedSummary({ task }: PlanEndedSummaryProps) {
  const { category, cycle, time, progress, numericConfig, checkInConfig } = task;

  // 计算总天数
  const totalDays = useMemo(() => {
    const start = dayjs(time.startDate);
    const end = dayjs(time.endDate);
    return end.diff(start, 'day') + 1;
  }, [time]);

  // 计算实际完成的周期数
  const completedCycles = cycle.currentCycle;

  // 获取总进度
  const totalPercentage = progress.totalPercentage || 0;

  // 根据任务类型获取统计数据
  const stats = useMemo(() => {
    if (category === 'NUMERIC' && numericConfig) {
      const { startValue, currentValue, targetValue, unit, direction } = numericConfig;
      const originalStart = numericConfig.originalStartValue ?? startValue;
      
      // 计算总变化量
      const totalChange = Math.abs(currentValue - originalStart);
      const targetChange = Math.abs(targetValue - originalStart);
      
      return {
        type: 'NUMERIC' as const,
        startValue: originalStart,
        currentValue,
        targetValue,
        totalChange,
        targetChange,
        unit,
        direction,
        isAchieved: direction === 'INCREASE' 
          ? currentValue >= targetValue 
          : currentValue <= targetValue
      };
    } else if (category === 'CHECK_IN' && checkInConfig) {
      const { unit, records = [] } = checkInConfig;
      
      // 统计总打卡次数
      const totalCheckIns = records.filter(r => r.checked).length;
      
      // 统计总值（时长或数量）
      const totalValue = records.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      
      // 计算目标值
      let targetValue = 0;
      let valueUnit = '次';
      
      if (unit === 'TIMES') {
        targetValue = (checkInConfig.cycleTargetTimes || checkInConfig.perCycleTarget || 0) * cycle.totalCycles;
        valueUnit = '次';
      } else if (unit === 'DURATION') {
        targetValue = (checkInConfig.cycleTargetMinutes || checkInConfig.perCycleTarget || 0) * cycle.totalCycles;
        valueUnit = '分钟';
      } else if (unit === 'QUANTITY') {
        targetValue = (checkInConfig.cycleTargetValue || checkInConfig.perCycleTarget || 0) * cycle.totalCycles;
        valueUnit = checkInConfig.valueUnit || '个';
      }
      
      return {
        type: 'CHECK_IN' as const,
        totalCheckIns,
        totalValue,
        targetValue,
        unit,
        valueUnit,
        currentStreak: checkInConfig.currentStreak || 0,
        longestStreak: checkInConfig.longestStreak || 0,
        isAchieved: totalPercentage >= 100
      };
    }
    
    return null;
  }, [category, numericConfig, checkInConfig, cycle.totalCycles, totalPercentage]);

  // 获取成就等级
  const achievementLevel = useMemo(() => {
    if (totalPercentage >= 100) return { level: '完美达成', emoji: '🏆', color: '#FFD700' };
    if (totalPercentage >= 80) return { level: '优秀完成', emoji: '🌟', color: '#4CAF50' };
    if (totalPercentage >= 60) return { level: '良好完成', emoji: '👍', color: '#2196F3' };
    if (totalPercentage >= 40) return { level: '继续加油', emoji: '💪', color: '#FF9800' };
    return { level: '未完成', emoji: '📝', color: '#9E9E9E' };
  }, [totalPercentage]);

  return (
    <div className={styles.container}>
      {/* 成就徽章 */}
      <div className={styles.achievementBadge} style={{ backgroundColor: achievementLevel.color }}>
        <span className={styles.achievementEmoji}>{achievementLevel.emoji}</span>
        <span className={styles.achievementLevel}>{achievementLevel.level}</span>
      </div>

      {/* 总进度 */}
      <div className={styles.progressSection}>
        <div className={styles.progressCircle}>
          <svg viewBox="0 0 100 100" className={styles.progressSvg}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={achievementLevel.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${totalPercentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className={styles.progressText}>
            <span className={styles.progressValue}>{Math.round(totalPercentage)}%</span>
            <span className={styles.progressLabel}>总进度</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Calendar size={20} color="#666" />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalDays}</span>
            <span className={styles.statLabel}>总天数</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <Target size={20} color="#666" />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{completedCycles}/{cycle.totalCycles}</span>
            <span className={styles.statLabel}>完成周期</span>
          </div>
        </div>

        {stats?.type === 'NUMERIC' && (
          <>
            <div className={styles.statCard}>
              <TrendingUp size={20} color="#666" />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {formatDisplayNumber(stats.totalChange)} {stats.unit}
                </span>
                <span className={styles.statLabel}>
                  {stats.direction === 'INCREASE' ? '累计增加' : '累计减少'}
                </span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <CheckCircle size={20} color={stats.isAchieved ? '#4CAF50' : '#666'} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {formatDisplayNumber(stats.currentValue)} {stats.unit}
                </span>
                <span className={styles.statLabel}>最终值</span>
              </div>
            </div>
          </>
        )}

        {stats?.type === 'CHECK_IN' && (
          <>
            <div className={styles.statCard}>
              <CheckCircle size={20} color="#666" />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.totalCheckIns}</span>
                <span className={styles.statLabel}>打卡天数</span>
              </div>
            </div>
            
            {stats.unit !== 'TIMES' && (
              <div className={styles.statCard}>
                <Clock size={20} color="#666" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {formatDisplayNumber(stats.totalValue)} {stats.valueUnit}
                  </span>
                  <span className={styles.statLabel}>累计{stats.unit === 'DURATION' ? '时长' : '数量'}</span>
                </div>
              </div>
            )}
            
            {stats.longestStreak > 0 && (
              <div className={styles.statCard}>
                <Trophy size={20} color="#FFD700" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{stats.longestStreak}天</span>
                  <span className={styles.statLabel}>最长连续</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 时间范围 */}
      <div className={styles.timeRange}>
        <span className={styles.timeLabel}>计划周期</span>
        <span className={styles.timeValue}>
          {dayjs(time.startDate).format('YYYY.MM.DD')} - {dayjs(time.endDate).format('YYYY.MM.DD')}
        </span>
      </div>
    </div>
  );
}

export { PlanEndedSummary };
