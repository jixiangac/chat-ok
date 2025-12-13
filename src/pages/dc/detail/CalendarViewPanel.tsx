import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { CheckCircle, Circle, Calendar, Info } from 'lucide-react';
import type { GoalDetail, CheckIn } from './types';
import styles from '../css/CalendarViewPanel.module.css';

interface CalendarViewPanelProps {
  goal: GoalDetail;
}

export default function CalendarViewPanel({ goal }: CalendarViewPanelProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const checkIns = goal.checkIns || [];
  
  // 获取当前月份的日历数据
  const calendarData = useMemo(() => {
    const today = dayjs();
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
  }, []);
  
  // 检查某天是否打卡
  const checkInDates = useMemo(() => {
    return new Set(checkIns.map(c => c.date));
  }, [checkIns]);
  
  // 获取选中日期的打卡详情
  const selectedCheckIn = useMemo(() => {
    if (!selectedDate) return null;
    return checkIns.find(c => c.date === selectedDate);
  }, [selectedDate, checkIns]);
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
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
            const isChecked = checkInDates.has(day.date);
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
                {day.isCurrentMonth && (
                  <span className={`${styles.checkMark} ${isChecked ? styles.checked : ''}`}>
                    {isChecked ? <CheckCircle size={12} color="#4ade80" /> : <Circle size={12} color="#e5e5e5" />}
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
          {selectedCheckIn ? (
            <div className={styles.detailContent}>
              <div className={styles.detailStatus}>
                <CheckCircle size={16} color="#4ade80" />
                <span>已打卡 {dayjs(selectedCheckIn.timestamp).format('HH:mm')}</span>
              </div>
              {selectedCheckIn.note && (
                <div className={styles.detailNote}>
                  备注: {selectedCheckIn.note}
                </div>
              )}
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
