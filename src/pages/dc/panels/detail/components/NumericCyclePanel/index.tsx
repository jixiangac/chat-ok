import { memo } from 'react';
import dayjs from 'dayjs';
import { BarChart3, ArrowRight, Calendar, Check } from 'lucide-react';
import type { Task } from '../../../../types';
import type { CurrentCycleInfo } from '../../types';
import { getSimulatedToday } from '../../hooks';
import { formatDisplayNumber } from '../../../../utils';
import styles from './styles.module.css';

interface NumericCyclePanelProps {
  goal: Task;
  cycle: CurrentCycleInfo;
  onRecordData: () => void;
}

function NumericCyclePanelComponent({ 
  goal, 
  cycle,
  onRecordData 
}: NumericCyclePanelProps) {
  const config = goal.numericConfig;
  const progress = goal.progress;
  const debtDisplay = goal.debtDisplay;

  console.log(cycle,'cycle')
  
  // 获取模拟的"今日"日期
  const effectiveToday = getSimulatedToday(goal as any);
  
  if (!config) {
    return <div className={styles.container}>数值配置缺失</div>;
  }
  
  const isDecrease = config.direction === 'DECREASE';
  
  // 直接使用预计算的进度信息
  const cycleStartValue = typeof progress.cycleStartValue === 'number' 
    ? progress.cycleStartValue 
    : parseFloat(progress.cycleStartValue as string) || config.startValue;
  // cycleTargetValue 可能已经是补偿后的值，需要区分
  const displayTargetValue = typeof progress.cycleTargetValue === 'number' 
    ? progress.cycleTargetValue 
    : parseFloat(progress.cycleTargetValue as string) || config.targetValue;
  const compensationTargetValue = progress.compensationTargetValue;
  const cycleAchieved = progress.cycleAchieved;
  const cycleRemaining = progress.cycleRemaining;
  const cycleProgress = progress.cyclePercentage;
  const totalProgress = progress.totalPercentage;
  
  // 判断是否有补偿目标
  const hasCompensation = compensationTargetValue !== undefined;
  // 如果有补偿目标，cycleTargetValue 是原始值，compensationTargetValue 是实际目标
  // 如果没有补偿目标，cycleTargetValue 就是实际目标
  const originalCycleTarget = displayTargetValue;
  const actualTargetValue = hasCompensation ? compensationTargetValue : displayTargetValue;
  // 使用预计算的欠账显示信息
  const showDebt = debtDisplay?.showDebt ?? false;
  const debtTarget = debtDisplay?.debtTarget;
  const debtProgress = debtDisplay?.debtProgress ?? cycleProgress;
  const debtBgColor = debtDisplay?.bgColor ?? 'rgba(246, 239, 239, 0.6)';
  const debtProgressColor = debtDisplay?.progressColor ?? 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)';
  
  // 计算"还需"值：如果有补偿目标，用补偿目标计算；否则用原始周期目标
  const displayCycleRemaining = hasCompensation
    ? (isDecrease 
        ? Math.max(0, Math.round((config.currentValue - actualTargetValue) * 10) / 10)
        : Math.max(0, Math.round((actualTargetValue - config.currentValue) * 10) / 10))
    : cycleRemaining;
  
  // 如果计划已结束，显示总结视图（参考 CycleInfo 样式）
  if (goal.isPlanEnded) {
    const originalStart = config.originalStartValue ?? config.startValue;
    const isSuccess = isDecrease 
      ? config.currentValue <= config.targetValue
      : config.currentValue >= config.targetValue;
    
    // 计算总变化量
    const totalChange = Math.abs(config.currentValue - originalStart);
    
    return (
      <div className={styles.summaryWrapper}>
        {/* 主信息行 - 参考 CycleInfo 样式 */}
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.label}>周期</span>
            <span className={styles.value}>
              <strong>{goal.cycle.currentCycle}</strong>
              <span className={styles.separator}>/</span>
              <span className={styles.total}>{goal.cycle.totalCycles}</span>
            </span>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.infoItem}>
            <span className={styles.label}>完成率</span>
            <span className={styles.value}>
              <strong>{totalProgress}</strong>
              <span className={styles.total}>%</span>
            </span>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.infoItem}>
            <span className={styles.label}>状态</span>
            <span className={styles.value}>
              <strong className={isSuccess ? styles.successText : styles.warningText}>
                {isSuccess ? '达成' : '未达成'}
              </strong>
            </span>
          </div>
        </div>
        
        {/* 日期行 */}
        <div className={styles.dateRange}>
          <div className={styles.dateLeft}>
            <Calendar size={14} className={styles.icon} />
            <span>{dayjs(goal.time.startDate).format('YYYY-MM-DD')} - {dayjs(goal.time.endDate).format('YYYY-MM-DD')}</span>
          </div>
          <div className={styles.resultValue}>
            <span className={styles.resultCurrent}>{formatDisplayNumber(config.currentValue)}</span>
            <span className={styles.resultSeparator}>/</span>
            <span className={styles.resultTarget}>{formatDisplayNumber(config.targetValue)}{config.unit}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.cycleCard}>
        <div className={styles.cycleCardHeader}>
          <BarChart3 size={16} className={styles.cycleCardIcon} />
          <span className={styles.cycleCardTitle}>本周期目标</span>
        </div>
        
        <div className={styles.targetRange}>
          <span className={styles.targetValue}>{formatDisplayNumber(cycleStartValue)}{config.unit}</span>
          <ArrowRight size={16} className={styles.targetArrow} />
          <span className={styles.targetValue}>
            {formatDisplayNumber(actualTargetValue)}{config.unit}
            {hasCompensation && (
              <span style={{ marginLeft: '8px', fontSize: '0.85em', fontWeight: '400', color: '#999' }}>
                (原目标: {formatDisplayNumber(originalCycleTarget)}{config.unit})
              </span>
            )}
          </span>
        </div>
        
        <div className={styles.progressBar} style={showDebt ? { backgroundColor: debtBgColor } : {}}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${Math.min(showDebt ? debtProgress : cycleProgress, 100)}%`,
              background: showDebt ? debtProgressColor : undefined
            }}
          />
        </div>
        
        <div className={styles.dateInfo}>
          <span className={styles.currentDate}>
            <Calendar size={14} />
            {dayjs(effectiveToday).format('M月D日')}
          </span>
          <span className={styles.cycleDayProgress}>
            第 <strong>{Math.max(1, dayjs(effectiveToday).diff(dayjs(cycle.startDate), 'day') + 1)}</strong> / {goal.cycle.cycleDays} 天
          </span>
        </div>
        
        <div className={styles.progressStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>已{isDecrease ? '减' : '增'}</span>
            <span className={styles.statValue}>{formatDisplayNumber(cycleAchieved)}{config.unit}</span>
          </div>
          {/* 今日进度 */}
          <div className={styles.todayProgress}>
            <span className={styles.todayLabel}>今日</span>
            <span className={styles.todayValue}>
              {formatDisplayNumber(goal.todayProgress?.todayValue ?? 0)}/{formatDisplayNumber(config.perDayAverage || 0)}{config.unit}
            </span>
            {goal.todayProgress?.isCompleted && (
              <Check size={14} className={styles.todayCheck} />
            )}
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>还需</span>
            <span className={styles.statValue}>
              {formatDisplayNumber(displayCycleRemaining)}{config.unit}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.gridItem}>
          <div className={styles.gridValue}>{formatDisplayNumber(config.currentValue)}{config.unit}</div>
          <div className={styles.gridLabel}>当前{isDecrease ? '数值' : '数值'}</div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.gridValue}>{showDebt ? debtProgress : cycleProgress}%</div>
          <div className={styles.gridLabel}>周期完成率</div>
        </div>
      </div>
      
      <div className={styles.timeRange}>
        <Calendar size={14} className={styles.timeIcon} />
        <span>本周期: {cycle.startDate} - {cycle.endDate}</span>
      </div>
    </div>
  );
}

export const NumericCyclePanel = memo(NumericCyclePanelComponent);
export default NumericCyclePanel;
