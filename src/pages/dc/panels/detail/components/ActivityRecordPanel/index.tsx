import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check, Clock, Hash, TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrentDate } from '../../../../utils';
import type { Task, ValueUpdateLog } from '../../../../types';
import styles from './styles.module.css';

interface ActivityRecordPanelProps {
  goal: Task;
  /** 是否只显示今天的记录 */
  todayOnly?: boolean;
}

/**
 * 变动记录面板
 * 显示任务的所有变动记录（打卡记录或数值变动记录）
 */
export default function ActivityRecordPanel({ goal, todayOnly = false }: ActivityRecordPanelProps) {
  const category = goal.category;
  const today = getCurrentDate(goal);
  
  // 打卡类型：从 checkInConfig.records 中提取所有打卡记录
  const checkInRecords = useMemo(() => {
    if (category !== 'CHECK_IN') return [];
    
    const records = goal.checkInConfig?.records || [];
    const allEntries: Array<{
      id: string;
      date: string;
      time: string;
      timestamp: number;
      value: number;
      note?: string;
    }> = [];
    
    records.forEach(record => {
      // 如果只显示今天的记录，过滤掉非今天的
      if (todayOnly && record.date !== today) return;
      
      // 只要有 entries 就显示，不需要 checked 为 true
      if (record.entries && record.entries.length > 0) {
        record.entries.forEach(entry => {
          allEntries.push({
            id: entry.id,
            date: record.date,
            time: entry.time,
            timestamp: dayjs(`${record.date} ${entry.time}`).valueOf(),
            value: entry.value || 1,
            note: entry.note
          });
        });
      }
    });
    
    // 按时间戳降序排序
    return allEntries.sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.checkInConfig?.records, category, todayOnly, today]);
  
  // 数值类型：从 activities 中提取数值更新记录
  const numericRecords = useMemo(() => {
    if (category !== 'NUMERIC') return [];
    
    let activities = goal.activities
      .filter((a): a is ValueUpdateLog => a.type === 'UPDATE_VALUE');
    console.log(activities, goal, todayOnly,today,'activities')
    // 如果只显示今天的记录，过滤掉非今天的
    if (todayOnly) {
      activities = activities.filter(a => dayjs(a.date).format('YYYY-MM-DD') === today);
    }
    
    return activities
      .map(a => ({
        id: a.id,
        date: a.date,
        timestamp: a.timestamp,
        value: a.newValue,
        change: a.delta,
        note: a.note
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.activities, category, todayOnly, today]);
  
  const config = goal.checkInConfig;
  const numericConfig = goal.numericConfig;
  const unit = config?.unit || 'TIMES';
  const valueUnit = config?.valueUnit || '个';
  const isDecrease = numericConfig?.direction === 'DECREASE';
  
  // 格式化值显示
  const formatValue = (value: number) => {
    if (unit === 'TIMES') return `${value}次`;
    if (unit === 'DURATION') return `${value}分钟`;
    return `${value}${valueUnit}`;
  };
  
  // 空状态
  const isEmpty = category === 'CHECK_IN' ? checkInRecords.length === 0 : numericRecords.length === 0;
  
  if (isEmpty) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <img 
            src="https://img.alicdn.com/imgextra/i2/O1CN01MyXN5T1zlO9AGpYij_!!6000000006754-2-tps-1080-1014.png" 
            alt="暂无数据" 
            className={styles.emptyIcon}
          />
          <div className={styles.emptyHint}>
            {todayOnly ? '今日暂无记录' : '暂无变动记录'}
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染打卡记录
  if (category === 'CHECK_IN') {
    return (
      <div className={styles.container}>
        <div className={styles.listContainer}>
          {checkInRecords.map((record, index) => (
            <div key={record.id || index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {unit === 'DURATION' ? <Clock size={18} /> : 
                   unit === 'QUANTITY' ? <Hash size={18} /> : 
                   <Check size={18} />}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>
                    {unit === 'DURATION' ? '时长记录' : 
                     unit === 'QUANTITY' ? '数量记录' : 
                     '打卡记录'}
                  </div>
                  <div className={styles.cardSubtitle}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.cardValue}>
                    +{formatValue(record.value)}
                  </div>
                  <div className={styles.cardTag}>
                    {unit === 'DURATION' ? '时长' : 
                     unit === 'QUANTITY' ? '数量' : 
                     '次数'}
                  </div>
                </div>
              </div>
              {record.note && (
                <div className={styles.cardNote}>{record.note}</div>
              )}
              {!todayOnly && (
                <div className={styles.cardFooter}>
                  记录于 {dayjs(record.date).format('YYYY-MM-DD')} ({dayjs(record.date).format('ddd')})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // 渲染数值记录
  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {numericRecords.map((record, index) => {
          const changeValue = record.change || 0;
          const isPositive = isDecrease ? changeValue < 0 : changeValue > 0;
          
          return (
            <div key={record.id || index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${isPositive ? styles.positive : styles.negative}`}>
                  {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>
                    {isPositive ? (isDecrease ? '减少' : '增加') : (isDecrease ? '增加' : '减少')}记录
                  </div>
                  <div className={styles.cardSubtitle}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={`${styles.cardValue} ${isPositive ? styles.positive : styles.negative}`}>
                    {record.value?.toLocaleString()}{numericConfig?.unit || ''}
                  </div>
                  <div className={styles.cardTag}>
                    {changeValue > 0 ? '+' : ''}{changeValue.toLocaleString()}
                  </div>
                </div>
              </div>
              {record.note && (
                <div className={styles.cardNote}>{record.note}</div>
              )}
              {!todayOnly && (
                <div className={styles.cardFooter}>
                  记录于 {dayjs(record.timestamp).format('YYYY-MM-DD (ddd)')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ActivityRecordPanel };



