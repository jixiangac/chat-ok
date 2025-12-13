import { useMemo } from 'react';
import { BarChart3, ArrowRight, Calendar } from 'lucide-react';
import type { GoalDetail, CurrentCycleInfo } from './types';
import styles from '../css/NumericCyclePanel.module.css';

// 千分位格式化
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

interface NumericCyclePanelProps {
  goal: GoalDetail;
  cycle: CurrentCycleInfo;
  onRecordData: () => void;
}

export default function NumericCyclePanel({ 
  goal, 
  cycle,
  onRecordData 
}: NumericCyclePanelProps) {
  const config = goal.numericConfig;
  
  if (!config) {
    return <div className={styles.container}>数值配置缺失</div>;
  }
  
  const isDecrease = config.direction === 'DECREASE';
  // 使用原始起始值计算总目标进度
  const originalStart = config.originalStartValue ?? config.startValue;
  const totalChange = Math.abs(config.targetValue - originalStart);
  
  // 根据方向计算有效变化量（基于原始起始值）
  // 减少目标：只有减少的部分才算完成，增加了则为0
  // 增加目标：只有增加的部分才算完成，减少了则为0
  const rawChange = config.currentValue - originalStart;
  const effectiveChange = isDecrease 
    ? Math.max(0, -rawChange)  // 减少目标：负变化才有效
    : Math.max(0, rawChange);   // 增加目标：正变化才有效
  const totalProgress = totalChange > 0 ? Math.round((effectiveChange / totalChange) * 100) : 0;
  
  // 计算本周期目标 - 基于周期数和总目标
  const cycleData = useMemo(() => {
    const totalCycles = goal.totalCycles || 1;
    const perCycleTarget = config.perCycleTarget || (totalChange / totalCycles);
    
    // 本周期起始值
    // 优先从cycleSnapshots中获取上一周期的结算值
    const cycleSnapshots = goal.cycleSnapshots || [];
    let cycleStartValue = config.startValue;
    
    // 如果有快照数据，使用上一周期的结算值作为本周期起始值
    if (cycleSnapshots.length > 0) {
      const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
      if (lastSnapshot.actualValue !== undefined) {
        cycleStartValue = lastSnapshot.actualValue;
      }
    } else {
      // 没有快照时，从历史记录获取周期开始时的值
      const history = goal.history || [];
      const cycleStartDate = new Date(cycle.startDate);
      
      for (let i = history.length - 1; i >= 0; i--) {
        const recordDate = new Date(history[i].date);
        if (recordDate < cycleStartDate && history[i].value !== undefined) {
          cycleStartValue = history[i].value as number;
          break;
        }
      }
      
      // 如果是第一个周期，使用配置的起始值
      if (cycle.cycleNumber === 1) {
        cycleStartValue = config.startValue;
      }
    }
    
    // 本周期目标值
    let cycleTargetValue = isDecrease 
      ? cycleStartValue - perCycleTarget 
      : cycleStartValue + perCycleTarget;
    
    // 确保目标值不超过原始最终目标值
    // 减少方向：不能低于最终目标值
    // 增加方向：不能高于最终目标值
    if (isDecrease) {
      cycleTargetValue = Math.max(cycleTargetValue, config.targetValue);
    } else {
      cycleTargetValue = Math.min(cycleTargetValue, config.targetValue);
    }
    
    // 本周期已完成 - 根据方向计算有效变化量
    // 减少目标：只有减少的部分才算完成，增加了则为0
    // 增加目标：只有增加的部分才算完成，减少了则为0
    const rawCycleChange = config.currentValue - cycleStartValue;
    const cycleAchieved = isDecrease 
      ? Math.max(0, -rawCycleChange)  // 减少目标：负变化才有效
      : Math.max(0, rawCycleChange);   // 增加目标：正变化才有效
    
    // 本周期还需 - 基于当前值与目标值的差距
    // 减少方向：如果当前值已经 <= 目标值，则还需为0
    // 增加方向：如果当前值已经 >= 目标值，则还需为0
    let cycleRemaining: number;
    if (isDecrease) {
      cycleRemaining = Math.max(0, config.currentValue - cycleTargetValue);
    } else {
      cycleRemaining = Math.max(0, cycleTargetValue - config.currentValue);
    }
    
    // 本周期进度
    const cycleProgress = perCycleTarget > 0 
      ? Math.min(Math.round((cycleAchieved / perCycleTarget) * 100), 100) 
      : 0;
    
    return {
      cycleStartValue: Math.round(cycleStartValue * 10) / 10,
      cycleTargetValue: Math.round(cycleTargetValue * 10) / 10,
      cycleAchieved: Math.round(cycleAchieved * 10) / 10,
      cycleRemaining: Math.round(cycleRemaining * 10) / 10,
      cycleProgress
    };
  }, [config, goal.history, goal.totalCycles, goal.cycleSnapshots, cycle, isDecrease, totalChange]);
  
  const { cycleStartValue, cycleTargetValue, cycleAchieved, cycleRemaining, cycleProgress } = cycleData;
  
  return (
    <div className={styles.container}>
      {/* 本周期目标卡片 */}
      <div className={styles.cycleCard}>
        <div className={styles.cycleCardHeader}>
          <BarChart3 size={16} className={styles.cycleCardIcon} />
          <span className={styles.cycleCardTitle}>本周期目标</span>
        </div>
        
        <div className={styles.targetRange}>
          <span className={styles.targetValue}>{formatNumber(cycleStartValue)}{config.unit}</span>
          <ArrowRight size={16} className={styles.targetArrow} />
          <span className={styles.targetValue}>{formatNumber(cycleTargetValue)}{config.unit}</span>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min(cycleProgress, 100)}%` }}
          />
        </div>
        
        <div className={styles.progressStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>已{isDecrease ? '减' : '增'}</span>
            <span className={styles.statValue}>{formatNumber(cycleAchieved)}{config.unit}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>还需</span>
            <span className={styles.statValue}>{formatNumber(cycleRemaining)}{config.unit}</span>
          </div>
        </div>
      </div>
      
      {/* 数据概览 */}
      <div className={styles.statsGrid}>
        <div className={styles.gridItem}>
          <div className={styles.gridValue}>{formatNumber(config.currentValue)}{config.unit}</div>
          <div className={styles.gridLabel}>当前{isDecrease ? '体重' : '数值'}</div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.gridValue}>{cycleProgress}%</div>
          <div className={styles.gridLabel}>周期完成率</div>
        </div>
      </div>
      
      {/* 周期时间 */}
      <div className={styles.timeRange}>
        <Calendar size={14} className={styles.timeIcon} />
        <span>本周期: {cycle.startDate} - {cycle.endDate}</span>
      </div>
    </div>
  );
}
