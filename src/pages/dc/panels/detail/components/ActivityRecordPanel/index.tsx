import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check, Clock, Hash, TrendingUp, TrendingDown } from 'lucide-react';
import type { Task, ValueUpdateLog } from '../../../../types';
import styles from './styles.module.css';

interface ActivityRecordPanelProps {
  goal: Task;
}

/**
 * 变动记录面板
 * 显示任务的所有变动记录（打卡记录或数值变动记录）
 */
export default function ActivityRecordPanel({ goal }: ActivityRecordPanelProps) {
  const category = goal.category;
  
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
      if (record.checked && record.entries) {
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
  }, [goal.checkInConfig?.records, category]);
  
  // 数值类型：从 activities 中提取数值更新记录
  const numericRecords = useMemo(() => {
    if (category !== 'NUMERIC') return [];
    
    return goal.activities
      .filter((a): a is ValueUpdateLog => a.type === 'UPDATE_VALUE')
      .map(a => ({
        id: a.id,
        date: a.date,
        timestamp: a.timestamp,
        value: a.newValue,
        change: a.delta,
        note: a.note
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.activities, category]);
  
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
            src="https://img.alicdn.com/imgextra/i4/O1CN01dw7CSD25FE0pPf85P_!!6000000007496-2-tps-1056-992.png" 
            alt="暂无数据" 
            className={styles.emptyIcon}
          />
          <div className={styles.emptyHint}>暂无变动记录</div>
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
            <div key={record.id || index} className={styles.recordItem}>
              <div className={styles.recordIcon}>
                {unit === 'DURATION' ? <Clock size={16} /> : 
                 unit === 'QUANTITY' ? <Hash size={16} /> : 
                 <Check size={16} />}
              </div>
              <div className={styles.recordContent}>
                <div className={styles.recordMain}>
                  <span className={styles.recordValue}>
                    +{formatValue(record.value)}
                  </span>
                  <span className={styles.recordTime}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </span>
                </div>
                {record.note && (
                  <div className={styles.recordNote}>{record.note}</div>
                )}
                <div className={styles.recordDate}>
                  {dayjs(record.date).format('YYYY年M月D日')}
                </div>
              </div>
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
            <div key={record.id || index} className={styles.recordItem}>
              <div className={`${styles.recordIcon} ${isPositive ? styles.positive : styles.negative}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
              <div className={styles.recordContent}>
                <div className={styles.recordMain}>
                  <span className={styles.recordValue}>
                    {record.value?.toLocaleString()}{numericConfig?.unit || ''}
                  </span>
                  <span className={`${styles.recordChange} ${isPositive ? styles.positive : styles.negative}`}>
                    {changeValue > 0 ? '+' : ''}{changeValue.toLocaleString()}
                  </span>
                </div>
                {record.note && (
                  <div className={styles.recordNote}>{record.note}</div>
                )}
                <div className={styles.recordDate}>
                  {dayjs(record.timestamp).format('YYYY年M月D日 HH:mm')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ActivityRecordPanel };

