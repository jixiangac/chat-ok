import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check, Calendar, Flame, Clock, Hash, PartyPopper, ChartNoAxesCombined } from 'lucide-react';
import type { GoalDetail, CurrentCycleInfo } from './types';
import type { CheckInUnit } from '../types';
import { getSimulatedToday } from './hooks';
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
  const unit: CheckInUnit = config?.unit || 'TIMES';
  
  // 获取模拟的"今日"日期
  const effectiveToday = getSimulatedToday(goal);
  
  const todayCheckIns = useMemo(() => {
    // 使用有效的"今日"日期来过滤打卡记录
    return (goal.checkIns || []).filter(c => c.date === effectiveToday);
  }, [goal.checkIns, effectiveToday]);
  
  // 获取本周期打卡数据（扩展周期日期范围以包含模拟日期的打卡）
  const cycleCheckIns = useMemo(() => {
    // 扩展周期范围：起始日期取较小值，结束日期取较大值
    // 这样无论模拟日期在周期之前还是之后，都能正确统计
    const effectiveCycleStart = effectiveToday < cycle.startDate ? effectiveToday : cycle.startDate;
    const effectiveCycleEnd = effectiveToday > cycle.endDate ? effectiveToday : cycle.endDate;
    
    return (goal.checkIns || []).filter(c => {
      return c.date >= effectiveCycleStart && c.date <= effectiveCycleEnd;
    });
  }, [goal.checkIns, cycle.startDate, cycle.endDate, effectiveToday]);
  
  // 根据打卡类型计算进度
  const progressData = useMemo(() => {
    if (unit === 'TIMES') {
      // 次数型
      const dailyMax = config?.dailyMaxTimes || 1;
      const cycleTarget = config?.cycleTargetTimes || config?.perCycleTarget || (cycle.requiredCheckIns);
      const cycleCount = cycleCheckIns.length;
      const todayCount = todayCheckIns.length;
      const todayCompleted = todayCount >= dailyMax;
      const cycleCompleted = cycleCount >= cycleTarget;
      
      return {
        cycleValue: cycleCount,
        cycleTarget,
        cycleUnit: '次',
        todayValue: todayCount,
        todayTarget: dailyMax,
        todayUnit: '次',
        todayCompleted,
        cycleCompleted,
        progress: cycleTarget > 0 ? (cycleCount / cycleTarget) * 100 : 0,
        remaining: Math.max(0, cycleTarget - cycleCount)
      };
    } else if (unit === 'DURATION') {
      // 时长型
      const dailyTarget = config?.dailyTargetMinutes || 15;
      const cycleTarget = config?.cycleTargetMinutes || config?.perCycleTarget || (dailyTarget * 10);
      const cycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
      const todayValue = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
      const todayCompleted = todayValue >= dailyTarget;
      const cycleCompleted = cycleValue >= cycleTarget;
      
      return {
        cycleValue,
        cycleTarget,
        cycleUnit: '分钟',
        todayValue,
        todayTarget: dailyTarget,
        todayUnit: '分钟',
        todayCompleted,
        cycleCompleted,
        progress: cycleTarget > 0 ? (cycleValue / cycleTarget) * 100 : 0,
        remaining: Math.max(0, cycleTarget - cycleValue)
      };
    } else {
      // 数值型
      const dailyTarget = config?.dailyTargetValue || 0;
      const cycleTarget = config?.cycleTargetValue || config?.perCycleTarget || 0;
      const valueUnit = config?.valueUnit || '个';
      const cycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
      const todayValue = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
      const todayCompleted = dailyTarget > 0 && todayValue >= dailyTarget;
      const cycleCompleted = cycleTarget > 0 && cycleValue >= cycleTarget;
      
      return {
        cycleValue,
        cycleTarget,
        cycleUnit: valueUnit,
        todayValue,
        todayTarget: dailyTarget,
        todayUnit: valueUnit,
        todayCompleted,
        cycleCompleted,
        progress: cycleTarget > 0 ? (cycleValue / cycleTarget) * 100 : 0,
        remaining: Math.max(0, cycleTarget - cycleValue)
      };
    }
  }, [unit, config, cycleCheckIns, todayCheckIns, cycle.requiredCheckIns]);
  
  // 计算连续打卡和累计打卡
  const currentStreak = config?.currentStreak || 0;
  const totalCheckIns = goal.checkIns?.length || 0;
  
  // 根据打卡类型计算累计值（时长型累计分钟数，数值型累计数值）
  const totalAccumulatedValue = useMemo(() => {
    if (unit === 'TIMES') {
      return totalCheckIns;
    }
    return (goal.checkIns || []).reduce((sum, c) => sum + (c.value || 0), 0);
  }, [goal.checkIns, unit, totalCheckIns]);
  
  // 获取累计值的单位
  const getAccumulatedUnit = () => {
    if (unit === 'TIMES') return '次';
    if (unit === 'DURATION') return '分钟';
    return config?.valueUnit || '个';
  };
  
  // 判断计划是否已结束
  const planEndInfo = useMemo(() => {
    const { cycleDays, totalCycles, startDate, cycleSnapshots, status } = goal;
    const start = dayjs(startDate);
    // 使用模拟的"今天"日期
    const today = dayjs(effectiveToday);
    
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
    
    // 计算总体完成率（所有周期的平均完成率）
    const allCompletionRates = cycleSnapshots?.map(s => s.completionRate) || [];
    const averageCompletionRate = allCompletionRates.length > 0 
      ? Math.round(allCompletionRates.reduce((a, b) => a + b, 0) / allCompletionRates.length)
      : 0;
    
    // 计算总打卡次数
    const totalCheckInsCount = goal.checkIns?.length || 0;
    
    // 判断是否达成目标（平均完成率 >= 100%）
    const isSuccess = averageCompletionRate >= 100;
    
    return {
      isPlanEnded: true,
      planStartDate: start.format('YYYY-MM-DD'),
      planEndDate: planEndDate.format('YYYY-MM-DD'),
      totalCycles,
      completedCycles: cycleSnapshots?.length || 0,
      totalCheckInsCount,
      averageCompletionRate,
      isSuccess,
      currentStreak: config?.currentStreak || 0,
      longestStreak: config?.longestStreak || config?.currentStreak || 0
    };
  }, [goal, config, effectiveToday]);
  
  // 获取打卡类型图标和标签
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
      totalCheckInsCount, averageCompletionRate, isSuccess, longestStreak 
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
            {/* 打卡统计 */}
            <div className={styles.comparisonCard}>
              <div className={styles.cardLabel}>{unit === 'TIMES' ? '累计打卡' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
              <div className={styles.cardValue}>
                {unit === 'TIMES' 
                  ? `${totalCheckInsCount}次` 
                  : unit === 'DURATION' 
                    ? `${(goal.checkIns || []).reduce((sum, c) => sum + (c.value || 0), 0)}分钟`
                    : `${(goal.checkIns || []).reduce((sum, c) => sum + (c.value || 0), 0)}${config?.valueUnit || '个'}`
                }
              </div>
              <div className={styles.cardHint}>
                {typeInfo.label}
              </div>
            </div>
            
            {/* 最终结果 */}
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
          
          {/* 统计数据 */}
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{completedCycles}/{totalCycles}</div>
              <div className={styles.statLabel}>完成周期</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{longestStreak}天</div>
              <div className={styles.statLabel}>最长连续</div>
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
      {/* 打卡类型标签 */}
      {/* <div className={styles.typeTag}>
        {typeInfo.icon}
        <span>{typeInfo.label}</span>
      </div> */}
      
      {/* 主要进度区域 */}
      <div className={styles.heroSection}>
        <div className={styles.heroNumber}>
          {progressData.cycleValue}
          <span className={styles.heroUnit}>/{progressData.cycleTarget} {progressData.cycleUnit}</span>
        </div>
        <div className={styles.heroLabel}>本周期{unit === 'TIMES' ? '打卡次数' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
        
        {/* 进度条 */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min(progressData.progress, 100)}%` }}
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
        
        {/* 今日打卡 - 融入主区块 */}
        <div className={styles.todayRow}>
          <span className={styles.todayLabel}>今日</span>
          <span className={styles.todayValue}>{progressData.todayValue}/{progressData.todayTarget}{progressData.todayUnit}</span>
          {progressData.todayCompleted && <Check size={14} className={styles.todayCheck} />}
          {todayCheckIns.length > 0 && (
            <span className={styles.todayTimes}>
              {todayCheckIns.slice(-2).map((entry, idx) => (
                <span key={entry.id}>
                  {idx > 0 && ' '}
                  {new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              ))}
              {todayCheckIns.length > 2 && ` +${todayCheckIns.length - 2}`}
            </span>
          )}
        </div>
        
        {/* {progressData.cycleCompleted ? (
          <div className={styles.completedBadge}>
            <Check size={14} className={styles.checkIcon} />
            本周期已完成
          </div>
        ) : !progressData.todayCompleted && (
          <div className={styles.remainingHint}>
            还需 <strong>{progressData.remaining}</strong> {progressData.cycleUnit}完成本周期
          </div>
        )} */}
      </div>
      
      {/* 数据统计 - 两列布局 */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{currentStreak}天</div>
          <div className={styles.statLabel}>连续打卡</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalAccumulatedValue}{getAccumulatedUnit()}</div>
          <div className={styles.statLabel}>{unit === 'TIMES' ? '累计打卡' : unit === 'DURATION' ? '累计时长' : '累计数值'}</div>
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
