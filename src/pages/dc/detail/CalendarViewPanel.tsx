import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { CheckCircle, Circle, Calendar, Info, Clock, Hash } from 'lucide-react';
import type { GoalDetail, CheckIn } from './types';
import type { CheckInUnit } from '../types';
import { getSimulatedToday } from './hooks';
import styles from '../css/CalendarViewPanel.module.css';

interface CalendarViewPanelProps {
  goal: GoalDetail;
}

export default function CalendarViewPanel({ goal }: CalendarViewPanelProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const checkIns = goal.checkIns || [];
  const config = goal.checkInConfig;
  const unit: CheckInUnit = config?.unit || 'TIMES';
  const valueUnit = config?.valueUnit || '个';
  
  // 获取模拟的"今天"日期
  const simulatedToday = getSimulatedToday(goal);
  
  // 获取当前月份的日历数据
  const calendarData = useMemo(() => {
    const today = dayjs(simulatedToday);
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const startDay = startOfMonth.day(); // 0-6, 0是周日
    const daysInMonth = today.daysInMonth();
    
    // 创建日历格子
    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isToday: boolean }> = [];
    
    // 填充月初空白
    for (let i = 0; i < startDay; i++) {
      const prevDate = startOfMonth.subtract(startDay - i, 'day');
      days.push({
        date: prevDate.format('YYYY-MM-DD'),
        day: prevDate.date(),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // 填充当月日期
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = startOfMonth.add(i - 1, 'day');
      days.push({
        date: currentDate.format('YYYY-MM-DD'),
        day: i,
        isCurrentMonth: true,
        isToday: currentDate.isSame(today, 'day')
      });
    }
    
    return {
      month: today.format('M月'),
      year: today.format('YYYY'),
      days
    };
  }, [simulatedToday]);
  
  // 按日期分组打卡记录
  const checkInsByDate = useMemo(() => {
    const map = new Map<string, CheckIn[]>();
    checkIns.forEach(c => {
      const existing = map.get(c.date) || [];
      existing.push(c);
      map.set(c.date, existing);
    });
    return map;
  }, [checkIns]);
  
  // 获取某天的打卡汇总
  const getDaySummary = (date: string) => {
    const dayCheckIns = checkInsByDate.get(date) || [];
    if (dayCheckIns.length === 0) return null;
    
    const totalValue = dayCheckIns.reduce((sum, c) => sum + (c.value || 1), 0);
    return {
      count: dayCheckIns.length,
      totalValue,
      entries: dayCheckIns
    };
  };
  
  // 获取选中日期的打卡详情
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    return getDaySummary(selectedDate);
  }, [selectedDate, checkInsByDate]);
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 格式化显示值
  const formatValue = (value: number) => {
    if (unit === 'TIMES') return `${value}次`;
    if (unit === 'DURATION') return `${value}分钟`;
    return `${value}${valueUnit}`;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calendar size={16} className={styles.headerIcon} />
        <span className={styles.headerTitle}>{calendarData.month}打卡日历</span>
      </div>
      
      <div className={styles.calendar}>
        {/* 星期头 */}
        <div className={styles.weekHeader}>
          {weekDays.map(day => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>
        
        {/* 日期格子 */}
        <div className={styles.daysGrid}>
          {calendarData.days.map((day, index) => {
            const daySummary = getDaySummary(day.date);
            const isChecked = !!daySummary;
            const isSelected = selectedDate === day.date;
            
            return (
              <div
                key={index}
                className={`
                  ${styles.dayCell}
                  ${!day.isCurrentMonth ? styles.otherMonth : ''}
                  ${day.isToday ? styles.today : ''}
                  ${isSelected ? styles.selected : ''}
                `}
                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
              >
                <span className={styles.dayNumber}>{day.day}</span>
                {day.isCurrentMonth && isChecked && (
                  <span className={styles.dayValue}>
                    {unit === 'TIMES' ? (
                      <CheckCircle size={12} color="#000" />
                    ) : (
                      <span className={styles.valueText}>
                        {daySummary.totalValue}
                      </span>
                    )}
                  </span>
                )}
                {day.isCurrentMonth && !isChecked && (
                  <span className={styles.dayValue}>
                    <Circle size={12} color="#e5e5e5" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className={styles.hint}>
        <Info size={14} className={styles.hintIcon} />
        <span>点击日期查看详情</span>
      </div>
      
      {/* 选中日期详情 */}
      {selectedDate && (
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            {dayjs(selectedDate).format('MM/DD')} 详情
          </div>
          {selectedDayData ? (
            <div className={styles.detailContent}>
              <div className={styles.detailSummary}>
                {unit === 'TIMES' ? (
                  <>
                    <CheckCircle size={16} color="#000" />
                    <span>打卡 {selectedDayData.count} 次</span>
                  </>
                ) : unit === 'DURATION' ? (
                  <>
                    <Clock size={16} color="#000" />
                    <span>累计 {selectedDayData.totalValue} 分钟</span>
                  </>
                ) : (
                  <>
                    <Hash size={16} color="#000" />
                    <span>累计 {selectedDayData.totalValue} {valueUnit}</span>
                  </>
                )}
              </div>
              
              {/* 每次打卡记录 */}
              <div className={styles.detailEntries}>
                {selectedDayData.entries.map((entry, idx) => (
                  <div key={entry.id} className={styles.entryItem}>
                    <span className={styles.entryTime}>
                      {dayjs(entry.timestamp).format('HH:mm')}
                    </span>
                    {unit !== 'TIMES' && entry.value && (
                      <span className={styles.entryValue}>
                        +{entry.value}{unit === 'DURATION' ? '分钟' : valueUnit}
                      </span>
                    )}
                    {entry.note && (
                      <span className={styles.entryNote}>{entry.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.detailContent}>
              <div className={styles.detailEmpty}>该日期未打卡</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
