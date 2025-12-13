import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { GoalDetail } from './types';
import styles from '../css/HistoryCyclePanel.module.css';

interface HistoryCyclePanelProps {
  goal: GoalDetail;
}

interface CycleSummary {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  completionRate: number;
  completedValue: number | string;
  targetValue: number | string;
  actualValue?: number | string; // 结算值
  unit: string;
  isCurrent: boolean;
}

export default function HistoryCyclePanel({ goal }: HistoryCyclePanelProps) {
  const cycleSummaries = useMemo(() => {
    const summaries: CycleSummary[] = [];
    const { cycleDays, totalCycles, startDate, numericConfig, checklistConfig, checkInConfig, minCheckInsPerCycle, history, cycleSnapshots } = goal;
    
    const start = dayjs(startDate);
    const today = dayjs();
    
    // 计算实际的当前周期（基于时间）
    const daysSinceStart = today.diff(start, 'day');
    const realCurrentCycleNumber = Math.floor(daysSinceStart / cycleDays) + 1;
    
    // 已保存快照的周期数（debug模拟跳过的周期）
    const snapshotCount = cycleSnapshots?.length || 0;
    
    // 模拟的当前周期 = 实际当前周期 + 已跳过的周期数
    // 但不能超过总周期数
    const simulatedCurrentCycleNumber = Math.min(realCurrentCycleNumber + snapshotCount, totalCycles);
    
    // 先添加过去周期的快照数据（这些数据不会改变）
    if (cycleSnapshots && cycleSnapshots.length > 0) {
      for (const snapshot of cycleSnapshots) {
        summaries.push({
          cycleNumber: snapshot.cycleNumber,
          startDate: snapshot.startDate,
          endDate: snapshot.endDate,
          completionRate: snapshot.completionRate,
          completedValue: 0,
          targetValue: snapshot.targetValue,
          actualValue: snapshot.actualValue, // 结算值
          unit: snapshot.unit,
          isCurrent: false
        });
      }
    }
    
    // 计算剩余周期数（总周期数 - 已快照的周期数）
    const remainingCycles = totalCycles - snapshotCount;
    
    // 计算当前和未来周期的数据（从快照后的第一个周期开始）
    for (let i = 1; i <= remainingCycles; i++) {
      // 实际的周期编号
      const actualCycleNumber = snapshotCount + i;
      // 周期的日期范围（基于原始startDate计算）
      const cycleStart = start.add((actualCycleNumber - 1) * cycleDays, 'day');
      const cycleEnd = cycleStart.add(cycleDays - 1, 'day');
      
      let completionRate = 0;
      let completedValue: number | string = 0;
      let targetValue: number | string = 0;
      let unit = '';
      
      if (numericConfig) {
        // 数值型：计算该周期结束时应达到的目标总值
        // numericConfig.startValue 是当前计划的起始值（进入新周期后会更新为当前值）
        const { startValue, targetValue: finalTarget, direction, currentValue } = numericConfig;
        const totalChange = Math.abs(finalTarget - startValue);
        // 使用剩余周期数来计算每周期变化量
        const changePerCycle = remainingCycles > 0 ? totalChange / remainingCycles : 0;
        
        // 计算该周期结束时的目标值（i 是相对于剩余周期的索引）
        let cycleTargetValue: number;
        if (direction === 'DECREASE') {
          cycleTargetValue = startValue - (changePerCycle * i);
          // 确保目标值不低于原始最终目标值
          cycleTargetValue = Math.max(cycleTargetValue, finalTarget);
        } else {
          cycleTargetValue = startValue + (changePerCycle * i);
          // 确保目标值不高于原始最终目标值
          cycleTargetValue = Math.min(cycleTargetValue, finalTarget);
        }
        
        // 判断是否是未来周期（基于模拟的当前周期编号）
        if (actualCycleNumber > simulatedCurrentCycleNumber) {
          completionRate = 0;
        } else {
          // 计算完成率：基于当前值与该周期目标值的比较
          const targetChangeForCycle = Math.abs(cycleTargetValue - startValue);
          const actualChangeFromStart = direction === 'DECREASE' 
            ? startValue - currentValue 
            : currentValue - startValue;
          
          if (targetChangeForCycle > 0) {
            completionRate = Math.min(100, Math.max(0, Math.round((actualChangeFromStart / targetChangeForCycle) * 100)));
          } else {
            completionRate = 0;
          }
        }
        
        targetValue = cycleTargetValue.toFixed(1);
        unit = numericConfig.unit;
      } else if (checklistConfig) {
        // 清单型：计算该周期完成的项目数
        const perCycleTarget = checklistConfig.perCycleTarget || 1;
        const completedItems = checklistConfig.items?.filter(item => 
          item.cycle === i && item.status === 'COMPLETED'
        ).length || 0;
        
        completedValue = completedItems;
        targetValue = perCycleTarget;
        unit = '项';
        completionRate = perCycleTarget > 0 ? Math.min(100, Math.round((completedItems / perCycleTarget) * 100)) : 0;
      } else {
        // 打卡型：计算该周期的打卡次数
        const cycleCheckIns = (goal.checkIns || []).filter(c => {
          const cDate = dayjs(c.date);
          return cDate.isAfter(cycleStart.subtract(1, 'day')) && cDate.isBefore(cycleEnd.add(1, 'day'));
        }).length;
        
        completedValue = cycleCheckIns;
        targetValue = minCheckInsPerCycle;
        unit = '次';
        completionRate = minCheckInsPerCycle > 0 ? Math.min(100, Math.round((cycleCheckIns / minCheckInsPerCycle) * 100)) : 0;
      }
      
      summaries.push({
        cycleNumber: actualCycleNumber,
        startDate: cycleStart.format('YYYY-MM-DD'),
        endDate: cycleEnd.format('YYYY-MM-DD'),
        completionRate,
        completedValue,
        targetValue,
        unit,
        isCurrent: actualCycleNumber === simulatedCurrentCycleNumber
      });
    }
    
    // 按周期正序排列（第一周期在前）
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
          {/* <div className={styles.emptyText}>暂无历史周期</div> */}
          <div className={styles.emptyHint}>暂无历史周期</div>
        </div>
      </div>
    );
  }
  
  // 找到当前周期的索引
  const currentCycleIndex = cycleSummaries.findIndex(c => c.isCurrent);
  // 当前周期前面的周期数量
  const cyclesBeforeCurrent = currentCycleIndex > 0 ? currentCycleIndex : 0;
  // 是否需要折叠（当前周期前超过4个）
  const needCollapse = cyclesBeforeCurrent > 4;
  // 折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
  // 隐藏的周期数量（保留前2个，隐藏中间的）
  const hiddenCount = needCollapse && !isExpanded ? cyclesBeforeCurrent - 2 : 0;
  
  // 计算要显示的周期
  const displayCycles = useMemo(() => {
    if (!needCollapse || isExpanded) {
      return cycleSummaries;
    }
    // 显示前2个 + 当前及之后的周期
    const firstTwo = cycleSummaries.slice(0, 2);
    const currentAndAfter = cycleSummaries.slice(currentCycleIndex);
    return [...firstTwo, ...currentAndAfter];
  }, [cycleSummaries, needCollapse, isExpanded, currentCycleIndex]);
  
  return (
    <div className={styles.container}>
      
      <div className={styles.listContainer}>
        {displayCycles.map((cycle, index) => (
          <>
            {/* 在前2个之后、当前周期之前显示"显示前面全部"按钮 */}
            {needCollapse && !isExpanded && index === 2 && (
              <button 
                key="expand-btn"
                className={styles.expandButton}
                onClick={() => setIsExpanded(true)}
              >
                显示前面全部（{hiddenCount}个周期）
              </button>
            )}
            <div key={cycle.cycleNumber} className={`${styles.cycleItem} ${cycle.isCurrent ? styles.currentCycle : styles.pastCycle}`}>
              {/* 进度条背景层 */}
              <div 
                className={styles.progressOverlay}
                style={{ width: `${cycle.completionRate}%` }}
              />
              
              {/* 内容层 */}
              <div className={styles.cycleContent}>
                <div className={styles.cycleInfo}>
                  <div className={styles.cycleDate}>
                    {dayjs(cycle.startDate).format('MM/DD')} - {dayjs(cycle.endDate).format('MM/DD')}
                  </div>
                  <div className={styles.cycleData}>
                    目标: {cycle.targetValue}{cycle.unit}
                    {cycle.actualValue !== undefined && (
                      <span className={styles.actualValue}> / 结算: {cycle.actualValue}{cycle.unit}</span>
                    )}
                  </div>
                </div>
                <div className={styles.cycleRate}>
                  {cycle.completionRate}%
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
