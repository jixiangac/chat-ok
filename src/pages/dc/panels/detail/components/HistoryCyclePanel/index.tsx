import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import type { Task, CycleAdvanceLog } from '../../../../types';
import styles from '../../../../css/HistoryCyclePanel.module.css';

interface HistoryCyclePanelProps {
  goal: Task;
}

interface CycleSummary {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  completionRate: number;
  completedValue: number | string;
  targetValue: number | string;
  actualValue?: number | string;
  /** 周期结算值（已结束周期） */
  settlementValue?: number;
  /** 是否有欠款（实际未完成目标） */
  hasDebt?: boolean;
  /** 是否通过补偿完成 */
  completedByCompensation?: boolean;
  unit: string;
  isCurrent: boolean;
  isFuture: boolean;
  showInProgressBadge: boolean;
}

export default function HistoryCyclePanel({ goal }: HistoryCyclePanelProps) {
  const cycleSummaries = useMemo(() => {
    const summaries: CycleSummary[] = [];
    const { cycle, time, numericConfig, checklistConfig, checkInConfig, progress } = goal;
    const { cycleDays, totalCycles, currentCycle } = cycle;
    const startDate = time.startDate;
    
    const start = dayjs(startDate);
    const today = dayjs();
    
    // 判断计划是否已结束
    const isPlanEnded = goal.isPlanEnded || goal.status === 'ARCHIVED' || goal.status === 'COMPLETED';
    
    // 从 activities 中提取周期快照
    const cycleSnapshots = goal.activities
      .filter((a): a is CycleAdvanceLog => a.type === 'CYCLE_ADVANCE')
      .map((a, index) => ({
        cycleNumber: a.cycleNumber || index + 1,
        completionRate: a.completionRate || 0,
        settlementValue: a.settlementValue,
        planTargetValue: a.planTargetValue,
        hasDebt: a.hasDebt,
        completedByCompensation: a.completedByCompensation
      }));
    
    const snapshotCount = cycleSnapshots.length;
    
    // 模拟的当前周期
    const simulatedCurrentCycleNumber = isPlanEnded ? 0 : currentCycle;
    
    // 计算每个周期的数据
    for (let i = 1; i <= totalCycles; i++) {
      const cycleStart = start.add((i - 1) * cycleDays, 'day');
      const cycleEnd = cycleStart.add(cycleDays - 1, 'day');
      
      let completionRate = 0;
      let completedValue: number | string = 0;
      let targetValue: number | string = 0;
      let actualValue: number | string | undefined = undefined;
      let settlementValue: number | undefined = undefined;
      let hasDebt: boolean | undefined = undefined;
      let completedByCompensation: boolean | undefined = undefined;
      let unit = '';
      
      // 查找该周期的快照
      const snapshot = cycleSnapshots.find(s => s.cycleNumber === i);
      
      if (numericConfig) {
        const { startValue, targetValue: finalTarget, direction, currentValue, perCycleTarget } = numericConfig;
        const changePerCycle = perCycleTarget || (Math.abs(finalTarget - startValue) / totalCycles);
        
        // 计算该周期结束时的目标值
        let cycleTargetValue: number;
        if (direction === 'DECREASE') {
          cycleTargetValue = startValue - (changePerCycle * i);
          cycleTargetValue = Math.max(cycleTargetValue, finalTarget);
        } else {
          cycleTargetValue = startValue + (changePerCycle * i);
          cycleTargetValue = Math.min(cycleTargetValue, finalTarget);
        }
        
        if (snapshot) {
          // 使用快照数据
          completionRate = snapshot.completionRate;
          settlementValue = snapshot.settlementValue;
          completedByCompensation = snapshot.completedByCompensation;
          actualValue = snapshot.settlementValue ?? currentValue;
          
          // 重新计算 hasDebt：结算值达到周期目标就算完成
          if (settlementValue !== undefined) {
            const reachedCycleTarget = direction === 'DECREASE'
              ? settlementValue <= cycleTargetValue
              : settlementValue >= cycleTargetValue;
            hasDebt = !reachedCycleTarget;
          } else {
            hasDebt = snapshot.hasDebt;
          }
        } else if (i > simulatedCurrentCycleNumber) {
          // 未来周期
          completionRate = 0;
        } else if (i === currentCycle) {
          // 当前周期，使用预计算的进度
          completionRate = progress.cyclePercentage;
        }
        
        targetValue = cycleTargetValue.toFixed(1);
        unit = numericConfig.unit;
      } else if (checklistConfig) {
        const perCycleTarget = checklistConfig.perCycleTarget || 1;
        const completedItems = checklistConfig.items?.filter(item => 
          item.cycle === i && item.status === 'COMPLETED'
        ).length || 0;
        
        completedValue = completedItems;
        targetValue = perCycleTarget;
        unit = '项';
        
        if (snapshot) {
          completionRate = snapshot.completionRate;
        } else {
          completionRate = perCycleTarget > 0 ? Math.min(100, Math.round((completedItems / perCycleTarget) * 100)) : 0;
        }
      } else if (checkInConfig) {
        // 打卡型：从 records 中计算该周期的打卡次数
        const cycleCheckIns = (checkInConfig.records || []).filter(r => {
          const rDate = dayjs(r.date);
          return rDate.isAfter(cycleStart.subtract(1, 'day')) && 
                 rDate.isBefore(cycleEnd.add(1, 'day')) &&
                 r.checked;
        }).length;
        
        const perCycleTarget = checkInConfig.perCycleTarget || 3;
        completedValue = cycleCheckIns;
        targetValue = perCycleTarget;
        unit = '次';
        
        if (snapshot) {
          completionRate = snapshot.completionRate;
        } else {
          completionRate = perCycleTarget > 0 ? Math.min(100, Math.round((cycleCheckIns / perCycleTarget) * 100)) : 0;
        }
      }
      
      const isCurrentCycle = i === currentCycle;
      
      summaries.push({
        cycleNumber: i,
        startDate: cycleStart.format('YYYY-MM-DD'),
        endDate: cycleEnd.format('YYYY-MM-DD'),
        completionRate,
        completedValue,
        targetValue,
        actualValue,
        settlementValue,
        hasDebt,
        completedByCompensation,
        unit,
        isCurrent: isCurrentCycle,
        isFuture: !isPlanEnded && i > simulatedCurrentCycleNumber,
        showInProgressBadge: !isPlanEnded && isCurrentCycle
      });
    }
    
    return summaries;
  }, [goal]);
  
  if (cycleSummaries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <img 
            src="https://img.alicdn.com/imgextra/i4/O1CN01dw7CSD25FE0pPf85P_!!6000000007496-2-tps-1056-992.png" 
            alt="暂无数据" 
            className={styles.emptyIcon}
          />
          <div className={styles.emptyHint}>暂无历史周期</div>
        </div>
      </div>
    );
  }
  
  // 找到当前周期的索引
  const currentCycleIndex = cycleSummaries.findIndex(c => c.isCurrent);
  const cyclesBeforeCurrent = currentCycleIndex > 0 ? currentCycleIndex : 0;
  const needCollapse = cyclesBeforeCurrent > 2;
  const [isExpanded, setIsExpanded] = useState(false);
  const hiddenCount = needCollapse && !isExpanded ? cyclesBeforeCurrent - 2 : 0;
  
  const displayCycles = useMemo(() => {
    if (!needCollapse || isExpanded) {
      return cycleSummaries;
    }
    const twoBeforeCurrent = cycleSummaries.slice(currentCycleIndex - 2, currentCycleIndex);
    const currentAndAfter = cycleSummaries.slice(currentCycleIndex);
    return [...twoBeforeCurrent, ...currentAndAfter];
  }, [cycleSummaries, needCollapse, isExpanded, currentCycleIndex]);
  
  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {needCollapse && !isExpanded && (
          <button 
            key="expand-btn"
            className={styles.expandButton}
            onClick={() => setIsExpanded(true)}
          >
            显示更早周期（{hiddenCount}个）
          </button>
        )}
        {displayCycles.map((cycle) => (
          <div 
            key={cycle.cycleNumber} 
            className={`${styles.cycleItem} ${cycle.isCurrent ? styles.currentCycle : styles.pastCycle} ${cycle.isFuture ? styles.futureCycle : ''} ${cycle.hasDebt ? styles.hasDebt : ''}`}
          >
            <div 
              className={styles.progressOverlay}
              style={{ width: `${cycle.completionRate}%` }}
            />
            
            <div className={styles.cycleContent}>
              <div className={styles.cycleInfo}>
                <div className={styles.cycleTitle}>
                  <span>第{cycle.cycleNumber}周期</span>
                  {cycle.showInProgressBadge && <span className={styles.currentBadge}>进行中</span>}
                  {!cycle.completedByCompensation && cycle.hasDebt && !cycle.isCurrent && cycle.completionRate < 100 && <span className={styles.debtBadge}>未达成</span>}
                  {cycle.completedByCompensation && <span className={styles.compensationBadge}>二次完成</span>}
                </div>
                <div className={styles.cycleDate}>
                  <Calendar size={12} />
                  <span>{dayjs(cycle.startDate).format('MM/DD')} - {dayjs(cycle.endDate).format('MM/DD')}</span>
                </div>
              </div>
              <div className={styles.cycleRight}>
                <div className={styles.cycleData}>
                  {cycle.settlementValue !== undefined 
                    ? `结算: ${cycle.settlementValue}${cycle.unit} / 目标: ${cycle.targetValue}${cycle.unit}`
                    : cycle.actualValue !== undefined 
                      ? `${cycle.actualValue}${cycle.unit} / ${cycle.targetValue}${cycle.unit}`
                      : `目标: ${cycle.targetValue}${cycle.unit}`
                  }
                </div>
                <div className={styles.cycleRate}>
                  {cycle.completionRate}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
