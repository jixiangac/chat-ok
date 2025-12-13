import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check } from 'lucide-react';
import type { CheckInRecordPanelProps } from './types';
import styles from '../css/CheckInRecordPanel.module.css';

export default function CheckInRecordPanel({ 
  records, 
  cycleStartDate, 
  cycleEndDate 
}: CheckInRecordPanelProps) {
  // 按日期分组
  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof records> = {};
    
    records.forEach(record => {
      const date = record.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    
    return groups;
  }, [records]);
  
  // 排序日期（降序）
  const sortedDates = useMemo(() => {
    return Object.keys(groupedRecords).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedRecords]);
  
  // 空状态
  if (records.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <img 
            src="https://img.alicdn.com/imgextra/i4/O1CN01dw7CSD25FE0pPf85P_!!6000000007496-2-tps-1056-992.png"
            alt="暂无记录"
            className={styles.emptyImage}
          />
          <div className={styles.emptyText}>暂无打卡记录</div>
          <div className={styles.emptyHint}>
            完成打卡后，记录将显示在这里
          </div>
        </div>
      </div>
    );
  }
  
  // 计算总次数
  const totalCount = records.length;
  
  return (
    <div className={styles.container}>
      {/* 日期标题 */}
      <div className={styles.dateTitle}>
        <div className={styles.dateTitleLeft}>
          <span className={styles.dateText}>{dayjs(sortedDates[0]).format('M月D日')}</span>
          <span className={styles.weekDay}>{dayjs(sortedDates[0]).format('ddd')}</span>
        </div>
        <div className={styles.dateTitleRight}>
          {totalCount}次
        </div>
      </div>
      
      {/* 记录列表 */}
      {sortedDates.map((date) => (
        <div key={date} className={styles.dateGroup}>
          {groupedRecords[date].map((record) => (
            <div key={record.id} className={styles.recordItem}>
              {/* 左侧时间线 */}
              <div className={styles.timelineCol}>
                <div className={styles.dot} />
                <div className={styles.line} />
              </div>
              
              {/* 中间内容 */}
              <div className={styles.contentCol}>
                {/* 时间行 */}
                <div className={styles.timeRow}>
                  <span className={styles.timeText}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </span>
                  <span className={styles.duration}>+1次</span>
                </div>
                
                {/* 卡片 */}
                <div className={styles.card}>
                  <div className={styles.cardTitle}>
                    <Check size={14} style={{ marginRight: 4 }} /> 打卡成功
                  </div>
                  {record.note && (
                    <div className={styles.cardNote}>
                      {record.note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
