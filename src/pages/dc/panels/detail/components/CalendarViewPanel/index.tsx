import { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CheckCircle, Circle, Calendar, Info, Clock, Hash, TrendingUp, TrendingDown } from 'lucide-react';
import type { Task, CheckInUnit, CheckInEntry, ValueUpdateLog } from '../../../../types';
import { getSimulatedToday } from '../../hooks';
import styles from '../../../../css/CalendarViewPanel.module.css';

interface CalendarViewPanelProps {
  goal: Task;
}

export default function CalendarViewPanel({ goal }: CalendarViewPanelProps) {
  // 获取模拟的"今天"日期
  const simulatedToday = getSimulatedToday(goal as any);
  const config = goal.checkInConfig;
  const records = config?.records || [];
  const unit: CheckInUnit | undefined = config?.unit;
  const valueUnit = config?.valueUnit || '个';
  
  // 判断是否为数值型任务
  const isNumericTask = goal.category === 'NUMERIC';
  
  // 默认选中今天
  const [selectedDate, setSelectedDate] = useState<string | null>(simulatedToday);
  
  // 当 simulatedToday 变化时，更新选中日期
  useEffect(() => {
    setSelectedDate(simulatedToday);
  }, [simulatedToday]);
  
  // 数字精度处理函数
  const formatNumberPrecision = (num: number): string => {
    const absNum = Math.abs(num);
    if (absNum >= 1000) return Math.round(num).toString();
    if (absNum >= 100) return (Math.round(num * 10) / 10).toString();
    return (Math.round(num * 100) / 100).toString();
  };
  
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
  
  // 按日期分组数值型任务的活动记录
  const numericRecordsByDate = useMemo(() => {
    if (!isNumericTask) return new Map();
    
    const map = new Map<string, { entries: ValueUpdateLog[]; totalDelta: number }>();
    const valueUpdateLogs = goal.activities.filter(
      (log): log is ValueUpdateLog => log.type === 'UPDATE_VALUE'
    );
    
    valueUpdateLogs.forEach(log => {
      // 将 ISO 格式日期转换为 YYYY-MM-DD 格式
      const dateKey = dayjs(log.date).format('YYYY-MM-DD');
      const existing = map.get(dateKey) || { entries: [], totalDelta: 0 };
      existing.entries.push(log);
      existing.totalDelta += log.delta;
      map.set(dateKey, existing);
    });

    console.log(map,'map')
    
    return map;
  }, [isNumericTask, goal.activities]);
  
  // 按日期分组打卡记录
  const recordsByDate = useMemo(() => {
    const map = new Map<string, { entries: CheckInEntry[]; totalValue: number }>();
    records.forEach(r => {
      if (r.checked && r.entries) {
        map.set(r.date, {
          entries: r.entries,
          totalValue: r.totalValue || r.entries.reduce((sum, e) => sum + (e.value || 1), 0)
        });
      }
    });
    return map;
  }, [records]);
  
  // 获取某天的数值型任务汇总
  const getNumericDaySummary = (date: string) => {
    const dayData = numericRecordsByDate.get(date);
    if (!dayData) return null;
    return {
      count: dayData.entries.length,
      totalDelta: dayData.totalDelta,
      entries: dayData.entries
    };
  };
  
  // 获取某天的打卡汇总
  const getDaySummary = (date: string) => {
    const dayData = recordsByDate.get(date);
    if (!dayData) return null;
    
    return {
      count: dayData.entries.length,
      totalValue: dayData.totalValue,
      entries: dayData.entries
    };
  };
  
  // 获取选中日期的打卡详情
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return { checkIn: null, numeric: null };
    return {
      checkIn: getDaySummary(selectedDate),
      numeric: getNumericDaySummary(selectedDate)
    };
  }, [selectedDate, recordsByDate]);
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 数值型任务的单位和方向
  const numericUnit = goal.numericConfig?.unit || '';
  const numericDirection = goal.numericConfig?.direction || 'INCREASE';
  
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
        <span className={styles.headerTitle}>{calendarData.month}{isNumericTask ? '记录' : '打卡'}日历</span>
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
            const numericSummary = isNumericTask ? getNumericDaySummary(day.date) : null;
            const checkInSummary = !isNumericTask ? getDaySummary(day.date) : null;
            const daySummary = numericSummary || checkInSummary;
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
                    {isNumericTask && numericSummary ? (
                      // 数值型任务显示变化量
                      <span className={styles.valueText}>
                        {numericSummary.totalDelta > 0 ? '+' : ''}
                        {formatNumberPrecision(numericSummary.totalDelta)}
                      </span>
                    ) : unit === 'TIMES' ? (
                      // 打卡次数型显示勾选
                      <CheckCircle size={12} color="#000" />
                    ) : checkInSummary ? (
                      // 打卡时长/数量型显示累计值
                      <span className={styles.valueText}>
                        {checkInSummary.totalValue}
                      </span>
                    ) : null}
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
          {(selectedDayData.checkIn || selectedDayData.numeric) ? (
            <div className={styles.detailContent}>
              <div className={styles.detailSummary}>
                {isNumericTask && selectedDayData.numeric ? (
                  // 数值型任务汇总
                  <>
                    {numericDirection === 'INCREASE' ? (
                      <TrendingUp size={16} color="#000" />
                    ) : (
                      <TrendingDown size={16} color="#000" />
                    )}
                    <span>
                      {selectedDayData.numeric.totalDelta > 0 ? '+' : ''}
                      {formatNumberPrecision(selectedDayData.numeric.totalDelta)} {numericUnit}
                      （{selectedDayData.numeric.count}次记录）
                    </span>
                  </>
                ) : selectedDayData.checkIn && unit === 'TIMES' ? (
                  <>
                    <CheckCircle size={16} color="#000" />
                    <span>打卡 {selectedDayData.checkIn.count} 次</span>
                  </>
                ) : selectedDayData.checkIn && unit === 'DURATION' ? (
                  <>
                    <Clock size={16} color="#000" />
                    <span>累计 {selectedDayData.checkIn.totalValue} 分钟</span>
                  </>
                ) : selectedDayData.checkIn ? (
                  <>
                    <Hash size={16} color="#000" />
                    <span>累计 {selectedDayData.checkIn.totalValue} {valueUnit}</span>
                  </>
                ) : null}
              </div>
              
              {/* 每次打卡记录 */}
              <div className={styles.detailEntries}>
                {isNumericTask && selectedDayData.numeric ? (
                  // 数值型任务的每次记录（倒序显示，最新的在前）
                  [...selectedDayData.numeric.entries].reverse().map((entry, index) => (
                    <div key={entry.id} className={styles.entryItem}>
                      <span className={styles.entryTime}>
                        {/* 使用 date 字段显示时间，它包含完整的时间信息 */}
                        {dayjs(entry.date).format('HH:mm')}
                      </span>
                      <span className={styles.entryValue}>
                        {formatNumberPrecision(entry.oldValue)} → {formatNumberPrecision(entry.newValue)}
                        <span style={{ 
                          color: entry.delta > 0 ? '#22c55e' : entry.delta < 0 ? '#ef4444' : '#666',
                          marginLeft: 4
                        }}>
                          ({entry.delta > 0 ? '+' : ''}{formatNumberPrecision(entry.delta)})
                        </span>
                      </span>
                      {entry.note && (
                        <span className={styles.entryNote}>{entry.note}</span>
                      )}
                    </div>
                  ))
                ) : selectedDayData.checkIn ? (
                  // 打卡型任务的每次记录
                  selectedDayData.checkIn.entries.map((entry) => (
                    <div key={entry.id} className={styles.entryItem}>
                      <span className={styles.entryTime}>
                        {entry.time}
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
                  ))
                ) : null}
              </div>
            </div>
          ) : (
            <div className={styles.detailContent}>
              <div className={styles.detailEmpty}>该日期无{isNumericTask ? '记录' : '打卡'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}








