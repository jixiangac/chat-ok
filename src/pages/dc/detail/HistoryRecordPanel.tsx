import { useMemo } from 'react';
import dayjs from 'dayjs';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { GoalDetail } from './types';
import styles from '../css/HistoryRecordPanel.module.css';

interface HistoryRecordPanelProps {
  goal: GoalDetail;
}

export default function HistoryRecordPanel({ goal }: HistoryRecordPanelProps) {
  const history = goal.history || [];
  const config = goal.numericConfig;
  const isDecrease = config?.direction === 'DECREASE';
  
  // 按日期排序（降序）
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [history]);
  
  if (sortedHistory.length === 0) {
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
  
  return (
    <div className={styles.container}>
      
      <div className={styles.listContainer}>
        {sortedHistory.map((record, index) => {
          const changeValue = record.change || 0;
          const isPositive = isDecrease ? changeValue < 0 : changeValue > 0;
          
          return (
            <div key={`${record.date}-${index}`} className={styles.recordItem}>
              <div className={styles.recordContent}>
                <div className={styles.recordValue}>
                  {record.value}{config?.unit || ''}
                </div>
                <div className={`${styles.recordChange} ${isPositive ? styles.positive : styles.negative}`}>
                  {changeValue > 0 ? '+' : ''}{changeValue}
                  {changeValue > 0 ? <TrendingUp size={14} style={{ marginLeft: 4 }} /> : <TrendingDown size={14} style={{ marginLeft: 4 }} />}
                </div>
              </div>
              <div className={styles.recordFooter}>
                {record.note && (
                  <div className={styles.recordNote}>{record.note}</div>
                )}
                <div className={styles.recordDate}>
                  {dayjs(record.date).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
