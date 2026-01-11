import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Check, Clock, Hash, Calendar, TrendingUp } from 'lucide-react';
import type { GoalDetail } from '../../types';
import type { CheckInUnit } from '../../../../types';
import styles from './styles.module.css';

interface CheckInHistoryPanelProps {
  goal: GoalDetail;
}

interface CycleData {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  targetValue: number;
  actualValue: number;
  completionRate: number;
  isCurrentCycle: boolean;
  isPastCycle: boolean;
}

export default function CheckInHistoryPanel({ goal }: CheckInHistoryPanelProps) {
  const config = goal.checkInConfig;
  const unit: CheckInUnit = config?.unit || 'TIMES';
  const valueUnit = config?.valueUnit || '个';
  const checkIns = goal.checkIns || [];
  
  // 计算每个周期的数据
  const cyclesData = useMemo(() => {
    const { startDate, cycleDays, totalCycles, cycleSnapshots } = goal;
    if (!startDate || !cycleDays || !totalCycles) return [];
    
    const start = dayjs(startDate);
    const today = dayjs();
    const cycles: CycleData[] = [];
    
    // 获取周期目标
    let cycleTarget = 0;
    if (unit === 'TIMES') {
      cycleTarget = config?.cycleTargetTimes || config?.perCycleTarget || cycleDays;
    } else if (unit === 'DURATION') {
      cycleTarget = config?.cycleTargetMinutes || config?.perCycleTarget || (cycleDays * 15);
    } else {
      cycleTarget = config?.cycleTargetValue || config?.perCycleTarget || 0;
    }
    
    // 考虑debug跳过的周期数
    const snapshotCount = cycleSnapshots?.length || 0;
    // 基于时间的实际周期
    const elapsedDays = Math.floor(today.diff(start, 'day'));
    const realCycleNumber = Math.floor(elapsedDays / cycleDays) + 1;
    // 当前周期 = max(基于时间的周期, 快照数+1)
    const currentCycleNumber = Math.min(Math.max(realCycleNumber, snapshotCount + 1), totalCycles);
    
    for (let i = 0; i < totalCycles; i++) {
      const cycleNumber = i + 1;
      const cycleStart = start.add(i * cycleDays, 'day');
      const cycleEnd = cycleStart.add(cycleDays - 1, 'day');
      const cycleStartStr = cycleStart.format('YYYY-MM-DD');
      const cycleEndStr = cycleEnd.format('YYYY-MM-DD');
      
      // 获取该周期的打卡记录
      const cycleCheckIns = checkIns.filter(c => {
        return c.date >= cycleStartStr && c.date <= cycleEndStr;
      });
      
      // 计算实际值
      let actualValue = 0;
      if (unit === 'TIMES') {
        actualValue = cycleCheckIns.length;
      } else {
        actualValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
      }
      
      // 计算完成率
      const completionRate = cycleTarget > 0 
        ? Math.min(100, Math.round((actualValue / cycleTarget) * 100))
        : 0;
      
      // 判断是否是当前周期或过去周期（考虑debug跳过的周期）
      const isCurrentCycle = cycleNumber === currentCycleNumber;
      const isPastCycle = cycleNumber < currentCycleNumber;
      
      cycles.push({
        cycleNumber,
        startDate: cycleStartStr,
        endDate: cycleEndStr,
        targetValue: cycleTarget,
        actualValue,
        completionRate,
        isCurrentCycle,
        isPastCycle
      });
    }
    
    return cycles;
  }, [goal, checkIns, config, unit]);
  
  // 计算总体统计
  const totalStats = useMemo(() => {
    const completedCycles = cyclesData.filter(c => c.isPastCycle && c.completionRate >= 100).length;
    const totalValue = cyclesData.reduce((sum, c) => sum + c.actualValue, 0);
    const avgCompletionRate = cyclesData.filter(c => c.isPastCycle).length > 0
      ? Math.round(cyclesData.filter(c => c.isPastCycle).reduce((sum, c) => sum + c.completionRate, 0) / cyclesData.filter(c => c.isPastCycle).length)
      : 0;
    
    return {
      completedCycles,
      totalValue,
      avgCompletionRate
    };
  }, [cyclesData]);
  
  // 格式化值显示
  const formatValue = (value: number) => {
    if (unit === 'TIMES') return `${value}次`;
    if (unit === 'DURATION') return `${value}分钟`;
    return `${value}${valueUnit}`;
  };
  
  // 找到当前周期的索引
  const currentCycleIndex = cyclesData.findIndex(c => c.isCurrentCycle);
  // 当前周期前面的周期数量
  const cyclesBeforeCurrent = currentCycleIndex > 0 ? currentCycleIndex : 0;
  // 是否需要折叠（当前周期前超过2个）
  const needCollapse = cyclesBeforeCurrent > 2;
  // 折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
  // 隐藏的周期数量（保留当前周期前临近的2个，隐藏更早的）
  const hiddenCount = needCollapse && !isExpanded ? cyclesBeforeCurrent - 2 : 0;
  
  // 计算要显示的周期
  const displayCycles = useMemo(() => {
    if (!needCollapse || isExpanded) {
      return cyclesData;
    }
    // 显示当前周期前临近的2个 + 当前及之后的周期（隐藏更早的周期）
    const twoBeforeCurrent = cyclesData.slice(currentCycleIndex - 2, currentCycleIndex);
    const currentAndAfter = cyclesData.slice(currentCycleIndex);
    return [...twoBeforeCurrent, ...currentAndAfter];
  }, [cyclesData, needCollapse, isExpanded, currentCycleIndex]);
  
  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {/* 在列表最前面显示"显示更早周期"按钮 */}
        {needCollapse && !isExpanded && (
          <button 
            className={styles.expandButton}
            onClick={() => setIsExpanded(true)}
          >
            显示更早周期（{hiddenCount}个）
          </button>
        )}
        {displayCycles.map(cycle => (
          <div 
            key={cycle.cycleNumber} 
            className={`${styles.cycleItem} ${cycle.isCurrentCycle ? styles.currentCycle : styles.pastCycle} ${!cycle.isPastCycle && !cycle.isCurrentCycle ? styles.futureCycle : ''}`}
          >
            {/* 进度条背景层 */}
            <div 
              className={styles.progressOverlay}
              style={{ width: `${cycle.completionRate}%` }}
            />
            
            {/* 内容层 */}
            <div className={styles.cycleContent}>
              <div className={styles.cycleInfo}>
                <div className={styles.cycleTitle}>
                  <span>第{cycle.cycleNumber}周期</span>
                  {cycle.isCurrentCycle && <span className={styles.currentBadge}>进行中</span>}
                </div>
                <div className={styles.cycleDate}>
                  <Calendar size={12} />
                  <span>{dayjs(cycle.startDate).format('MM/DD')} - {dayjs(cycle.endDate).format('MM/DD')}</span>
                </div>
              </div>
              <div className={styles.cycleRight}>
                <div className={styles.cycleData}>
                  {formatValue(cycle.actualValue)} / {formatValue(cycle.targetValue)}
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


