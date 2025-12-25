import { useMemo } from 'react';
import dayjs from 'dayjs';
import { BarChart3, ArrowRight, Calendar, PartyPopper, ChartNoAxesCombined } from 'lucide-react';
import type { GoalDetail, CurrentCycleInfo } from './types';
import { getSimulatedToday } from './hooks';
import type { PreviousCycleDebtSnapshot } from '../types';
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
  
  // 获取模拟的"今日"日期
  const effectiveToday = getSimulatedToday(goal);
  
  if (!config) {
    return <div className={styles.container}>数值配置缺失</div>;
  }
  
  const isDecrease = config.direction === 'DECREASE';
  
  // 判断计划是否已结束
  const planEndInfo = useMemo(() => {
    const { cycleDays, totalCycles, startDate, cycleSnapshots, status } = goal;
    const start = dayjs(startDate);
    const today = dayjs();
    
    // 计算计划结束日期
    const planEndDate = start.add(totalCycles * cycleDays - 1, 'day');
    // 判断计划是否结束：基于时间 或 基于status 或 基于cycleSnapshots数量
    const isPlanEndedByTime = today.isAfter(planEndDate);
    const isPlanEndedByStatus = status === 'completed' || status === 'archived';
    const isPlanEndedBySnapshots = (cycleSnapshots?.length || 0) >= totalCycles;
    const isPlanEnded = isPlanEndedByTime || isPlanEndedByStatus || isPlanEndedBySnapshots;
    
    if (!isPlanEnded) {
      return { isPlanEnded: false };
    }
    
    // 获取最后一个周期的结算数据
    const lastSnapshot = cycleSnapshots && cycleSnapshots.length > 0 
      ? cycleSnapshots[cycleSnapshots.length - 1] 
      : null;
    
    // 计算初始计划数据
    const originalStart = config.originalStartValue ?? config.startValue;
    
    // 最终结果
    const finalActualValue = lastSnapshot ? lastSnapshot.actualValue : config.currentValue;
    
    // 计算总体完成率（所有周期的平均完成率）
    const allCompletionRates = cycleSnapshots?.map(s => s.completionRate) || [];
    const averageCompletionRate = allCompletionRates.length > 0 
      ? Math.round(allCompletionRates.reduce((a, b) => a + b, 0) / allCompletionRates.length)
      : 0;
    
    // 判断是否达成目标
    const isSuccess = isDecrease 
      ? finalActualValue <= config.targetValue
      : finalActualValue >= config.targetValue;
    
    return {
      isPlanEnded: true,
      planStartDate: start.format('YYYY-MM-DD'),
      planEndDate: planEndDate.format('YYYY-MM-DD'),
      totalCycles,
      completedCycles: cycleSnapshots?.length || 0,
      originalStartValue: originalStart,
      targetValue: config.targetValue,
      finalActualValue,
      averageCompletionRate,
      isSuccess,
      unit: config.unit
    };
  }, [goal, config, isDecrease]);
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
  
  // 获取已保存的欠账快照
  const savedDebtSnapshot = (goal as any).previousCycleDebtSnapshot as PreviousCycleDebtSnapshot | undefined;
  
  // 判断是否有欠账快照数据（需要有 debtCycleSnapshot 且周期编号匹配）
  const hasDebtSnapshot = savedDebtSnapshot?.debtCycleSnapshot !== undefined && savedDebtSnapshot?.currentCycleNumber === cycle.cycleNumber;
  
  // 获取欠账显示的配色（使用快照中保存的配色）
  const debtColors = useMemo(() => {
    if (hasDebtSnapshot && savedDebtSnapshot?.bgColor && savedDebtSnapshot?.progressColor) {
      return { bgColor: savedDebtSnapshot.bgColor, progressColor: savedDebtSnapshot.progressColor };
    }
    return { bgColor: 'rgba(246, 239, 239, 0.6)', progressColor: 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)' };
  }, [hasDebtSnapshot, savedDebtSnapshot]);
  
  // 检查上一周期是否有欠账
  const previousCycleDebtInfo = useMemo(() => {
    // 如果有已保存的快照且有 debtCycleSnapshot，直接使用
    if (hasDebtSnapshot && savedDebtSnapshot) {
      return { hasPreviousCycleDebt: true, previousCycleTarget: savedDebtSnapshot.targetValue, showDebt: true, useSavedSnapshot: true };
    }
    
    // 否则实时计算
    const cycleSnapshots = goal.cycleSnapshots || [];
    const cycleDays = goal.cycleDays || 7;
    
    if (cycleSnapshots.length === 0) {
      return { hasPreviousCycleDebt: false, previousCycleTarget: undefined, showDebt: false };
    }
    
    const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
    
    // 检查上一周期是否完成（completionRate < 100）
    const currentValue = config.currentValue;
    
    if (lastSnapshot.completionRate !== undefined && lastSnapshot.completionRate < 100) {
      // 获取上一周期目标值
      if (lastSnapshot.targetValue !== undefined) {
        const lastTarget = Math.round(lastSnapshot.targetValue * 100) / 100;
        
        // 检查当前值是否已达到上一周期目标
        let reachedLastTarget = false;
        if (isDecrease) {
          reachedLastTarget = currentValue <= lastTarget;
        } else {
          reachedLastTarget = currentValue >= lastTarget;
        }
        
        if (!reachedLastTarget) {
          // 当前值未达到上一周期目标，显示上一周期欠账
          // 计算剩余天数
          const today = dayjs(getSimulatedToday(goal));
          const cycleEnd = dayjs(cycle.endDate);
          const remainingDays = cycleEnd.diff(today, 'day');
          
          return { hasPreviousCycleDebt: true, previousCycleTarget: lastTarget, showDebt: false, remainingDays, cycleDays, useSavedSnapshot: false };
        } else if (cycleSnapshots.length > 1) {
          // 当前值已达到上一周期目标，检查上上周期
          const prevPrevSnapshot = cycleSnapshots[cycleSnapshots.length - 2];
          if (prevPrevSnapshot.completionRate !== undefined && prevPrevSnapshot.completionRate < 100) {
            if (prevPrevSnapshot.targetValue !== undefined) {
              const prevPrevTarget = Math.round(prevPrevSnapshot.targetValue * 100) / 100;
              
              // 检查当前值是否已达到上上周期目标
              let reachedPrevPrevTarget = false;
              if (isDecrease) {
                reachedPrevPrevTarget = currentValue <= prevPrevTarget;
              } else {
                reachedPrevPrevTarget = currentValue >= prevPrevTarget;
              }
              
              if (!reachedPrevPrevTarget) {
                // 当前值未达到上上周期目标，显示上上周期欠账
                const today = dayjs(getSimulatedToday(goal));
                const cycleEnd = dayjs(cycle.endDate);
                const remainingDays = cycleEnd.diff(today, 'day');
                
                return { hasPreviousCycleDebt: true, previousCycleTarget: prevPrevTarget, showDebt: false, remainingDays, cycleDays, useSavedSnapshot: false };
              }
            }
          }
        }
      }
    }
    
    return { hasPreviousCycleDebt: false, previousCycleTarget: undefined, showDebt: false };
  }, [goal.cycleSnapshots, goal.cycleDays, config.currentValue, isDecrease, cycle.endDate, goal, hasDebtSnapshot, savedDebtSnapshot]);
  
  // 获取显示用的欠账目标值
  const displayDebtTarget = useMemo(() => {
    if (hasDebtSnapshot && savedDebtSnapshot) {
      return savedDebtSnapshot.targetValue;
    }
    return previousCycleDebtInfo.previousCycleTarget;
  }, [hasDebtSnapshot, savedDebtSnapshot, previousCycleDebtInfo.previousCycleTarget]);
  
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
      cycleProgress,
      perCycleTarget
    };
  }, [config, goal.history, goal.totalCycles, goal.cycleSnapshots, cycle, isDecrease, totalChange]);
  
  const { cycleStartValue, cycleTargetValue, cycleAchieved, cycleRemaining, cycleProgress, perCycleTarget } = cycleData;
  
  // 判断是否显示上一周期欠账
  const showPreviousCycleDebt = useMemo(() => {
    // 如果有已保存的快照且有 debtCycleSnapshot，直接显示
    if (hasDebtSnapshot) {
      return true;
    }
    
    if (!previousCycleDebtInfo.hasPreviousCycleDebt) return false;
    
    const { remainingDays, cycleDays } = previousCycleDebtInfo;
    if (remainingDays === undefined || cycleDays === undefined) return false;
    
    // 如果当期已完成（>=100%）且剩余时间 > 1/2 周期，显示上一周期欠账
    return cycleProgress >= 100 && remainingDays > cycleDays / 2;
  }, [previousCycleDebtInfo, cycleProgress, hasDebtSnapshot]);
  
  // 计算包含欠账的进度
  const displayProgress = useMemo(() => {
    if (!showPreviousCycleDebt) return cycleProgress;
    
    // 欠账模式下，进度基于从起始值到欠账目标值的变化量来计算
    if (displayDebtTarget === undefined) return cycleProgress;
    
    // 计算从起始值到欠账目标值需要的变化量
    const targetChange = Math.abs(displayDebtTarget - cycleStartValue);
    if (targetChange <= 0) return 100;
    
    // 计算实际变化量
    const rawCycleChange = config.currentValue - cycleStartValue;
    const effectiveCycleChange = isDecrease ? Math.max(0, -rawCycleChange) : Math.max(0, rawCycleChange);
    
    return Math.min(100, Math.round((effectiveCycleChange / targetChange) * 100));
  }, [showPreviousCycleDebt, config.currentValue, cycleStartValue, isDecrease, cycleProgress, displayDebtTarget]);
  
  // 欠账模式下使用副本中的起始值和目标值
  const displayCycleStart = useMemo(() => {
    if (showPreviousCycleDebt && savedDebtSnapshot?.debtCycleSnapshot?.startValue !== undefined) {
      return savedDebtSnapshot.debtCycleSnapshot.startValue;
    }
    return cycleStartValue;
  }, [showPreviousCycleDebt, savedDebtSnapshot, cycleStartValue]);
  
  const displayCycleTarget = useMemo(() => {
    if (showPreviousCycleDebt && displayDebtTarget !== undefined) {
      return displayDebtTarget;
    }
    return cycleTargetValue;
  }, [showPreviousCycleDebt, displayDebtTarget, cycleTargetValue]);
  
  // 欠账模式下重新计算"还需"值（基于欠账目标）
  const displayCycleRemaining = useMemo(() => {
    if (showPreviousCycleDebt && displayDebtTarget !== undefined) {
      // 使用欠账目标值计算还需
      if (isDecrease) {
        return Math.max(0, Math.round((config.currentValue - displayDebtTarget) * 10) / 10);
      } else {
        return Math.max(0, Math.round((displayDebtTarget - config.currentValue) * 10) / 10);
      }
    }
    return cycleRemaining;
  }, [showPreviousCycleDebt, displayDebtTarget, config.currentValue, isDecrease, cycleRemaining]);
  
  // 如果计划已结束，显示总结视图
  if (planEndInfo.isPlanEnded) {
    const { 
      planStartDate, planEndDate, totalCycles, completedCycles, 
      originalStartValue, targetValue, finalActualValue, 
      averageCompletionRate, isSuccess, unit 
    } = planEndInfo;
    
    return (
      <div className={styles.container}>
        <div className={styles.summaryContainer}>
          {/* 总结标题 */}
          <div className={styles.summaryHeader}>
            <span className={styles.summaryIcon}>{isSuccess ? <PartyPopper size={24} /> : <ChartNoAxesCombined size={24} />}</span>
            <span className={styles.summaryTitle}>计划已完成</span>
          </div>
          
          {/* 时间范围 */}
          <div className={styles.summaryPeriod}>
            {dayjs(planStartDate).format('YYYY/MM/DD')} - {dayjs(planEndDate).format('YYYY/MM/DD')}
          </div>
          
          {/* 对比卡片 */}
          <div className={styles.comparisonCards}>
            {/* 初始计划 */}
            <div className={styles.comparisonCard}>
              <div className={styles.cardLabel}>初始计划</div>
              <div className={styles.cardValue}>
                {originalStartValue} → {targetValue}{unit}
              </div>
              <div className={styles.cardHint}>
                {isDecrease ? '减少' : '增加'}目标
              </div>
            </div>
            
            {/* 最终结果 */}
            <div className={`${styles.comparisonCard} ${isSuccess ? styles.successCard : styles.normalCard}`}>
              <div className={styles.cardLabel}>最终结算</div>
              <div className={styles.cardValue}>
                {finalActualValue}{unit}
              </div>
              <div className={styles.cardHint}>
                目标: {targetValue}{unit}
              </div>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{completedCycles}/{totalCycles}</div>
              <div className={styles.statLabel}>完成周期</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{averageCompletionRate}%</div>
              <div className={styles.statLabel}>平均完成率</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{isSuccess ? '达成' : '未达成'}</div>
              <div className={styles.statLabel}>目标状态</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
          <span className={styles.targetValue}>
            {formatNumber(cycleTargetValue)}{config.unit}
            {showPreviousCycleDebt && displayDebtTarget !== undefined && (
              <span style={{ marginLeft: '8px', fontSize: '0.85em', fontWeight: '500' }}>
                ({formatNumber(displayDebtTarget)}{config.unit})
              </span>
            )}
          </span>
        </div>
        
        <div className={styles.progressBar} style={showPreviousCycleDebt ? { backgroundColor: debtColors.bgColor } : {}}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${Math.min(showPreviousCycleDebt ? displayProgress : cycleProgress, 100)}%`,
              background: showPreviousCycleDebt ? debtColors.progressColor : undefined
            }}
          />
        </div>
        
        {/* 当前日期和周期进度 */}
        <div className={styles.dateInfo}>
          <span className={styles.currentDate}>
            <Calendar size={14} />
            {dayjs(effectiveToday).format('M月D日')}
          </span>
          <span className={styles.cycleDayProgress}>
            第 <strong>{Math.max(1, dayjs(effectiveToday).diff(dayjs(cycle.startDate), 'day') + 1)}</strong> / {goal.cycleDays} 天
          </span>
        </div>
        
        <div className={styles.progressStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>已{isDecrease ? '减' : '增'}</span>
            <span className={styles.statValue}>{formatNumber(cycleAchieved)}{config.unit}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>还需</span>
            <span className={styles.statValue}>
              {formatNumber(cycleRemaining)}{config.unit}
              {showPreviousCycleDebt && displayCycleRemaining !== cycleRemaining && (
                <span style={{ fontSize: '0.85em', fontWeight: '400', marginLeft: '4px' }}>({formatNumber(displayCycleRemaining)}{config.unit})</span>
              )}
            </span>
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
          <div className={styles.gridValue}>{showPreviousCycleDebt ? displayProgress : cycleProgress}%</div>
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














