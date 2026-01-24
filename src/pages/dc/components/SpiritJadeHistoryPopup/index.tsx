/**
 * 灵玉历史记录弹窗
 * 展示灵玉的获取和消耗历史
 */

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import dayjs from 'dayjs';
import type { PointsHistory, PointsRecord } from '../../types/spiritJade';
import styles from './styles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

// 来源名称映射
const SOURCE_LABELS: Record<string, string> = {
  CHECK_IN: '任务打卡',
  CYCLE_COMPLETE: '周期完成奖励',
  DAILY_COMPLETE: '一日清单完成',
  ARCHIVE: '归档总结',
  CREATE_TASK: '创建任务',
  REFRESH_DAILY: '刷新一日清单',
  AI_CHAT: 'AI 对话',
};

interface SpiritJadeHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  pointsHistory: PointsHistory;
}

const SpiritJadeHistoryPopup: React.FC<SpiritJadeHistoryPopupProps> = ({
  visible,
  onClose,
  balance,
  totalEarned,
  totalSpent,
  pointsHistory,
}) => {
  // 将历史记录按时间倒序排列
  const sortedRecords = useMemo(() => {
    const allRecords: PointsRecord[] = [];
    Object.values(pointsHistory).forEach(weekRecords => {
      allRecords.push(...weekRecords);
    });
    // 按时间倒序排列
    return allRecords.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [pointsHistory]);

  // 只显示涉及灵玉变动的记录
  const jadeRecords = useMemo(() => {
    return sortedRecords.filter(record => record.spiritJade !== 0);
  }, [sortedRecords]);

  if (!visible) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
          <h2 className={styles.title}>灵玉明细</h2>
          <div className={styles.placeholder} />
        </div>

        {/* 余额概览 */}
        <div className={styles.overview}>
          <div className={styles.balanceSection}>
            <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.balanceIcon} />
            <span className={styles.balanceValue}>{balance}</span>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <TrendingUp size={14} className={styles.statIconEarn} />
              <span className={styles.statLabel}>累计获得</span>
              <span className={styles.statValue}>+{totalEarned}</span>
            </div>
            <div className={styles.statItem}>
              <TrendingDown size={14} className={styles.statIconSpend} />
              <span className={styles.statLabel}>累计消耗</span>
              <span className={styles.statValue}>-{totalSpent}</span>
            </div>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className={styles.historySection}>
          <div className={styles.sectionTitle}>变动记录</div>
          {jadeRecords.length > 0 ? (
            <div className={styles.historyList}>
              {jadeRecords.map(record => (
                <div key={record.id} className={styles.historyItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemTitle}>
                      {SOURCE_LABELS[record.source] || record.source}
                    </div>
                    <div className={styles.itemDesc}>
                      {record.description || record.taskTitle || '-'}
                    </div>
                    <div className={styles.itemTime}>
                      {dayjs(record.timestamp).format('MM-DD HH:mm')}
                    </div>
                  </div>
                  <div className={`${styles.itemAmount} ${record.spiritJade > 0 ? styles.earn : styles.spend}`}>
                    {record.spiritJade > 0 ? '+' : ''}{record.spiritJade}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>暂无记录</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SpiritJadeHistoryPopup;
