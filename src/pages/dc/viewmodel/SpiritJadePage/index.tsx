/**
 * 灵玉明细全屏页面
 * 使用与设置子页面一致的全屏右滑布局风格
 */

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import dayjs from 'dayjs';
import type { PointsHistory, PointsRecord } from '../../types/spiritJade';
import styles from './styles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

// 头图配置
const JADE_HEADER_IMAGE = 'https://gw.alicdn.com/imgextra/i1/O1CN01LsnTAj1dRldJrOYsX_!!6000000003733-2-tps-1080-836.png';
const JADE_HEADER_BACKGROUND = 'linear-gradient(135deg, #F0E6D8 0%, #E8DCD0 100%)';

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

interface SpiritJadePageProps {
  visible: boolean;
  onClose: () => void;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  pointsHistory: PointsHistory;
}

const SpiritJadePage: React.FC<SpiritJadePageProps> = ({
  visible,
  onClose,
  balance,
  totalEarned,
  totalSpent,
  pointsHistory,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 手势返回状态
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // 处理显示/隐藏动画
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      setIsExiting(false);
    }
  }, [visible]);

  // 处理关闭
  const handleClose = useCallback((skipAnimation?: boolean) => {
    if (skipAnimation) {
      setIsVisible(false);
      onClose();
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        onClose();
      }, 400);
    }
  }, [onClose]);

  // 手势返回支持
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    // 只有从左边缘开始的滑动才触发
    if (touch.clientX < 50) {
      setTouchStartX(touch.clientX);
      setTouchCurrentX(touch.clientX);
      setIsSwiping(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const touch = e.touches[0];
    setTouchCurrentX(touch.clientX);
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    const distance = touchCurrentX - touchStartX;
    if (distance > 100) {
      // 滑动距离超过阈值，触发关闭
      handleClose(true);
    }
    setIsSwiping(false);
    setTouchStartX(0);
    setTouchCurrentX(0);
  }, [isSwiping, touchCurrentX, touchStartX, handleClose]);

  // 计算滑动时的位移
  const swipeOffset = isSwiping ? Math.max(0, touchCurrentX - touchStartX) : 0;

  // 将历史记录按时间倒序排列
  const sortedRecords = useMemo(() => {
    const allRecords: PointsRecord[] = [];
    Object.values(pointsHistory).forEach(weekRecords => {
      allRecords.push(...weekRecords);
    });
    return allRecords.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [pointsHistory]);

  // 只显示涉及灵玉变动的记录
  const jadeRecords = useMemo(() => {
    return sortedRecords.filter(record => record.spiritJade !== 0);
  }, [sortedRecords]);

  if (!isVisible) return null;

  const pageStyle: React.CSSProperties = {
    transform: isSwiping
      ? `translateX(${swipeOffset}px)`
      : isExiting
        ? 'translateX(100%)'
        : 'translateX(0)',
    transition: isSwiping ? 'none' : 'transform 0.4s ease-out',
  };

  return createPortal(
    <div
      ref={containerRef}
      className={`${styles.page} ${isExiting ? styles.exiting : styles.visible}`}
      style={pageStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 头图区域 */}
      <div className={styles.headerImage} style={{ background: JADE_HEADER_BACKGROUND }}>
        <button className={styles.backButton} onClick={() => handleClose()}>
          <ChevronLeft size={24} />
        </button>
        <img
          src={JADE_HEADER_IMAGE}
          alt="灵玉明细"
          className={styles.headerImg}
        />
      </div>

      {/* 标题区域 */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>灵玉明细</h2>
        <p className={styles.description}>查看灵玉收支记录</p>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
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
              <span className={styles.statValueEarn}>+{totalEarned}</span>
            </div>
            <div className={styles.statItem}>
              <TrendingDown size={14} className={styles.statIconSpend} />
              <span className={styles.statLabel}>累计消耗</span>
              <span className={styles.statValueSpend}>-{totalSpent}</span>
            </div>
          </div>
        </div>

        {/* 变动记录列表 */}
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

export default SpiritJadePage;
