import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import type { Task, CheckInUnit, CycleAdvanceLog } from '../../../../types';
import styles from './styles.module.css';

interface CheckInHistoryPanelProps {
  goal: Task;
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
  const records = config?.records || [];
  
  // 计算每个周期的数据
  const cyclesData = useMemo(() => {
    const { cycle, time } = goal;
    const { cycleDays, totalCycles, currentCycle } = cycle;
    const startDate = time.startDate;
    
    if (!startDate || !cycleDays || !totalCycles) return [];
    
    const start = dayjs(startDate);
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
    
    for (let i = 0; i < totalCycles; i++) {
      const cycleNumber = i + 1;
      const cycleStart = start.add(i * cycleDays, 'day');
      const cycleEnd = cycleStart.add(cycleDays - 1, 'day');
      const cycleStartStr = cycleStart.format('YYYY-MM-DD');
      const cycleEndStr = cycleEnd.format('YYYY-MM-DD');
      
      // 获取该周期的打卡记录
      const cycleRecords = records.filter(r => {
        return r.date >= cycleStartStr && r.date <= cycleEndStr && r.checked;
      });
      
      // 计算实际值
      let actualValue = 0;
      if (unit === 'TIMES') {
        actualValue = cycleRecords.length;
      } else {
        actualValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      }
      
      // 计算完成率
      const completionRate = cycleTarget > 0 
        ? Math.min(100, Math.round((actualValue / cycleTarget) * 100))
        : 0;
      
      // 判断是否是当前周期或过去周期
      const isCurrentCycle = cycleNumber === currentCycle;
      const isPastCycle = cycleNumber < currentCycle;
      
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
  }, [goal, records, config, unit]);
  
  // 格式化值显示
  const formatValue = (value: number) => {
    if (unit === 'TIMES') return `${value}次`;
    if (unit === 'DURATION') return `${value}分钟`;
    return `${value}${valueUnit}`;
  };
  
  // 找到当前周期的索引
  const currentCycleIndex = cyclesData.findIndex(c => c.isCurrentCycle);
  const cyclesBeforeCurrent = currentCycleIndex > 0 ? currentCycleIndex : 0;
  const needCollapse = cyclesBeforeCurrent > 2;
  const [isExpanded, setIsExpanded] = useState(false);
  const hiddenCount = needCollapse && !isExpanded ? cyclesBeforeCurrent - 2 : 0;
  
  const displayCycles = useMemo(() => {
    if (!needCollapse || isExpanded) {
      return cyclesData;
    }
    const twoBeforeCurrent = cyclesData.slice(currentCycleIndex - 2, currentCycleIndex);
    const currentAndAfter = cyclesData.slice(currentCycleIndex);
    return [...twoBeforeCurrent, ...currentAndAfter];
  }, [cyclesData, needCollapse, isExpanded, currentCycleIndex]);
  
  if (cyclesData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyHint}>暂无历史周期</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
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
            <div 
              className={styles.progressOverlay}
              style={{ width: `${cycle.completionRate}%` }}
            />
            
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
