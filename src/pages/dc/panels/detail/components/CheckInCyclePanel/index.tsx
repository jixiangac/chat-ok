import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check, Calendar, Clock, Hash, PartyPopper, ChartNoAxesCombined } from 'lucide-react';
import type { Task, CheckInUnit } from '../../../../types';
import type { CurrentCycleInfo } from '../../types';
import { getSimulatedToday } from '../../hooks';
import styles from '../../../../css/CheckInCyclePanel.module.css';

interface CheckInCyclePanelProps {
  goal: Task;
  cycle: CurrentCycleInfo;
}

export default function CheckInCyclePanel({ 
  goal, 
  cycle 
}: CheckInCyclePanelProps) {
  const config = goal.checkInConfig;
  const unit: CheckInUnit = config?.unit || 'TIMES';
  
  // 获取模拟的"今日"日期
  const effectiveToday = getSimulatedToday(goal as any);
  
  // 从 records 中获取今日打卡记录
  const todayRecord = useMemo(() => {
    if (!config?.records) return null;
    return config.records.find(r => r.date === effectiveToday && r.checked);
  }, [config?.records, effectiveToday]);
  
  const todayEntries = todayRecord?.entries || [];
  
  // 获取本周期打卡数据
  const cycleRecords = useMemo(() => {
    if (!config?.records) return [];
    
    const effectiveCycleStart = effectiveToday < cycle.startDate ? effectiveToday : cycle.startDate;
    const effectiveCycleEnd = effectiveToday > cycle.endDate ? effectiveToday : cycle.endDate;
    
    return config.records.filter(r => {
      return r.date >= effectiveCycleStart && r.date <= effectiveCycleEnd && r.checked;
    });
  }, [config?.records, cycle.startDate, cycle.endDate, effectiveToday]);
  
  // 根据打卡类型计算进度
  // 直接使用 goal.progress 中已经计算好的数据，避免重复计算
  const progressData = useMemo(() => {
    const progress = goal.progress;
    const todayCount = todayEntries.length;
    const todayValue = todayRecord?.totalValue || 0;
    
    // 周期进度直接使用 progress 中的数据
    const cycleValue = progress.cycleAchieved || 0;
    const cycleTarget = progress.cycleTargetValue || config?.perCycleTarget || cycle.requiredCheckIns;
    const cycleProgress = progress.cyclePercentage || 0;
    const remaining = progress.cycleRemaining || 0;
    
    if (unit === 'TIMES') {
      const dailyMax = config?.dailyMaxTimes || 1;
      const todayCompleted = todayCount >= dailyMax;
      const cycleCompleted = cycleProgress >= 100;
      
      return {
        cycleValue,
        cycleTarget,
        cycleUnit: '次',
        todayValue: todayCount,
        todayTarget: dailyMax,
        todayUnit: '次',
        todayCompleted,
        cycleCompleted,
        progress: cycleProgress,
        remaining
      };
    } else if (unit === 'DURATION') {
      const dailyTarget = config?.dailyTargetMinutes || 15;
      const todayCompleted = todayValue >= dailyTarget;
      const cycleCompleted = cycleProgress >= 100;
      
      return {
        cycleValue,
        cycleTarget,
        cycleUnit: '分钟',
        todayValue,
        todayTarget: dailyTarget,
        todayUnit: '分钟',
        todayCompleted,
        cycleCompleted,
        progress: cycleProgress,
        remaining
      };
    } else {
      // QUANTITY 类型：数值型打卡
      const valueUnit = config?.valueUnit || '个';
      
      // 计算每日目标：优先使用 dailyTargetValue，否则使用 cycleTarget / cycleDays
      let dailyTarget = config?.dailyTargetValue || 0;
      if (dailyTarget === 0 && (cycleTarget as number) > 0) {
        const cycleDays = goal.cycle?.cycleDays || 7;
        dailyTarget = Math.ceil((cycleTarget as number) / cycleDays);
      }
      
      const todayCompleted = dailyTarget > 0 && todayValue >= dailyTarget;
      const cycleCompleted = cycleProgress >= 100;
      
      return {
        cycleValue,
        cycleTarget,
        cycleUnit: valueUnit,
        todayValue,
        todayTarget: dailyTarget,
        todayUnit: valueUnit,
        todayCompleted,
        cycleCompleted,
        progress: cycleProgress,
        remaining
      };
    }
  }, [unit, config, goal.progress, todayRecord, todayEntries, cycle.requiredCheckIns, goal.cycle?.cycleDays]);
  
  // 计算累计打卡
  // 直接使用 records 中 entries 的总数量
  const totalCheckIns = useMemo(() => {
    if (!config?.records) return 0;
    return config.records
      .filter(r => r.checked)
      .reduce((sum, r) => sum + (r.entries?.length || 1), 0);
  }, [config?.records]);
  
  // 根据打卡类型计算累计值
  const totalAccumulatedValue = useMemo(() => {
    if (unit === 'TIMES') {
      return totalCheckIns;
    }
    return (config?.records || []).reduce((sum, r) => sum + (r.totalValue || 0), 0);
  }, [config?.records, unit, totalCheckIns]);
  
  const getAccumulatedUnit = () => {
    if (unit === 'TIMES') return '次';
    if (unit === 'DURATION') return '分钟';
    return config?.valueUnit || '个';
  };
  
  // 判断计划是否已结束
  const planEndInfo = useMemo(() => {
    // 直接使用预计算的 isPlanEnded
    const isPlanEnded = goal.isPlanEnded || goal.status === 'ARCHIVED' || goal.status === 'COMPLETED';
    
    if (!isPlanEnded) {
      return { isPlanEnded: false };
    }
    
    // 直接使用 task 数据中已有的字段
    const totalCheckInsCount = config?.records?.filter(r => r.checked).length || 0;
    const averageCompletionRate = Math.round(goal.progress.totalPercentage);
    const isSuccess = goal.progress.totalPercentage >= 100;
    
    return {
      isPlanEnded: true,
      planStartDate: goal.time.startDate,
      planEndDate: goal.time.endDate,
      totalCycles: goal.cycle.totalCycles,
      completedCycles: goal.cycle.currentCycle,
      totalCheckInsCount,
      averageCompletionRate,
      isSuccess
    };
  }, [goal, config]);
  
  const getTypeInfo = () => {
    switch (unit) {
      case 'DURATION':
        return { icon: <Clock size={16} />, label: '时长型打卡' };
      case 'QUANTITY':
        return { icon: <Hash size={16} />, label: '数值型打卡' };
      default:
        return { icon: <Check size={16} />, label: '次数型打卡' };
    }
  };
  
  const typeInfo = getTypeInfo();
  
  // 如果计划已结束，显示总结视图
  if (planEndInfo.isPlanEnded) {
    const { 
      planStartDate, planEndDate, totalCycles, completedCycles, 
      totalCheckInsCount, averageCompletionRate, isSuccess
    } = planEndInfo;
    
    // 计算累计值
    const totalValue = (config?.records || []).reduce((sum, r) => sum + (r.totalValue || 0), 0);
    
    return (
      <div className={styles.container}>
        <div className={styles.summaryContainer}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryIcon}>{isSuccess ? <PartyPopper size={24} /> : <ChartNoAxesCombined size={24} />}</span>
            <span className={styles.summaryTitle}>计划已完成</span>
          </div>
          
          <div className={styles.summaryPeriod}>
            {dayjs(planStartDate).format('YYYY/MM/DD')} - {dayjs(planEndDate).format('YYYY/MM/DD')}
          </div>
          
          <div className={styles.comparisonCards}>
            <div className={styles.comparisonCard}>
              <div className={styles.cardLabel}>{unit === 'TIMES' ? '累计打卡' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
              <div className={styles.cardValue}>
                {unit === 'TIMES' 
                  ? `${totalCheckInsCount}次` 
                  : unit === 'DURATION' 
                    ? `${totalValue}分钟`
                    : `${totalValue}${config?.valueUnit || '个'}`
                }
              </div>
              <div className={styles.cardHint}>
                {typeInfo.label}
              </div>
            </div>
            
            <div className={`${styles.comparisonCard} ${isSuccess ? styles.successCard : styles.normalCard}`}>
              <div className={styles.cardLabel}>平均完成率</div>
              <div className={styles.cardValue}>
                {averageCompletionRate}%
              </div>
              <div className={styles.cardHint}>
                目标: 100%
              </div>
            </div>
          </div>
          
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{completedCycles}/{totalCycles}</div>
              <div className={styles.statLabel}>完成周期</div>
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
      <div className={styles.heroSection}>
        <div className={styles.heroNumber}>
          {progressData.cycleValue}
          <span className={styles.heroUnit}>/{progressData.cycleTarget} {progressData.cycleUnit}</span>
        </div>
        <div className={styles.heroLabel}>本周期{unit === 'TIMES' ? '打卡次数' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min(progressData.progress, 100)}%` }}
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
        
        <div className={styles.todayRow}>
          <span className={styles.todayLabel}>今日</span>
          <span className={styles.todayValue}>{progressData.todayValue}/{progressData.todayTarget}{progressData.todayUnit}</span>
          {progressData.todayCompleted && <Check size={14} className={styles.todayCheck} />}
          {todayEntries.length > 0 && (
            <span className={styles.todayTimes}>
              {todayEntries.slice(-2).map((entry, idx) => (
                <span key={entry.id}>
                  {idx > 0 && ' '}
                  {entry.time}
                </span>
              ))}
              {todayEntries.length > 2 && ` +${todayEntries.length - 2}`}
            </span>
          )}
        </div>
      </div>
      
      {/* <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalAccumulatedValue}{getAccumulatedUnit()}</div>
          <div className={styles.statLabel}>{unit === 'TIMES' ? '累计打卡' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
        </div>
      </div> */}
      
      <div className={styles.timeRange}>
        <Calendar size={14} className={styles.timeIcon} />
        <span>本周期: {cycle.startDate} - {cycle.endDate}</span>
      </div>
    </div>
  );
}


