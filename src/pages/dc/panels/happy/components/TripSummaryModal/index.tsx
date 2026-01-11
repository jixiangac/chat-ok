// 行程总结弹窗组件
import React, { useState } from 'react';
import { Trip } from '../../types';
import { calculateTripStats } from '../../storage';
import styles from './styles.module.css';

interface TripSummaryModalProps {
  visible: boolean;
  trip: Trip | null;
  onClose: () => void;
  onComplete: (comment?: string) => void;
}

const TripSummaryModal: React.FC<TripSummaryModalProps> = ({ visible, trip, onClose, onComplete }) => {
  const [comment, setComment] = useState('');

  if (!visible || !trip) return null;

  const stats = calculateTripStats(trip);

  // 计算结束日期
  const startDate = new Date(trip.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + trip.totalDays - 1);

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDayValueClass = (rate: number) => {
    if (rate === 100) return styles.dayValuePerfect;
    if (rate >= 80) return styles.dayValueGood;
    return '';
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>🏝️ 旅行总结 - {trip.name}</h2>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* 基本信息 */}
          <div className={styles.infoBox}>
            <div className={styles.infoItem}>
              <span>📅</span>
              <span>
                旅行时间：{formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span>📍</span>
              <span>旅行天数：{trip.totalDays} 天</span>
            </div>
          </div>

          {/* 完成情况 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📊 完成情况</h3>
            <div className={styles.sectionContent}>
              <div className={styles.statItem}>
                总目标：<span className={styles.statValue}>{stats.totalGoals}</span> 个
              </div>
              <div className={styles.statItem}>
                已完成：<span className={styles.statValue}>{stats.completedGoals}</span> 个
              </div>
              <div className={styles.statItem}>
                完成率：<span className={`${styles.statValue} ${styles.statValueSuccess}`}>{stats.completionRate}%</span>
              </div>
            </div>
          </div>

          {/* 每日完成率 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📈 每日完成率</h3>
            <div className={styles.dailyRates}>
              {stats.dailyRates.map((day, index) => (
                <div key={index} className={styles.dayRate}>
                  <div className={styles.dayLabel}>{day.label}</div>
                  <div className={`${styles.dayValue} ${getDayValueClass(day.rate)}`}>{day.rate}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 获得奖励 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🎁 获得奖励</h3>
            <div className={styles.rewardsBox}>
              <div className={styles.rewardItem}>
                · 旅行积分：<span className={styles.rewardPoints}>+{trip.totalPoints} 分</span>
              </div>
              {stats.completionRate === 100 && (
                <div className={styles.rewardItem}>
                  · 解锁徽章：<span className={styles.rewardBadge}>「完美旅程」🌟</span>
                </div>
              )}
            </div>
          </div>

          {/* 旅行感言 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💭 旅行感言（可选）</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="记录这次旅行的美好回忆..."
              rows={3}
              className={styles.textarea}
            />
          </div>

          {/* 提交按钮 */}
          <button onClick={() => onComplete(comment.trim() || undefined)} className={styles.submitBtn}>
            完成，存入历史
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripSummaryModal;
