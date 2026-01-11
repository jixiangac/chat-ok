// 行程卡片组件
import React, { useState } from 'react';
import { Trip } from '../../types';
import { calculateTripStats } from '../../storage';
import { formatDate } from '../../utils';
import styles from './styles.module.css';

interface TripCardProps {
  trip: Trip;
  onSelect: () => void;
  onDelete: () => void;
  onShowDetail: () => void;
}

// 图标组件
const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onDelete, onShowDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const stats = calculateTripStats(trip);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个行程吗？')) {
      onDelete();
    }
  };

  const statusIconClasses = [
    styles.statusIcon,
    trip.isCompleted ? styles.statusIconCompleted : styles.statusIconPending,
  ].join(' ');

  const nameClasses = [styles.name, trip.isCompleted && styles.nameCompleted].filter(Boolean).join(' ');

  return (
    <div
      className={styles.card}
      onClick={onShowDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardContent}>
        {/* 完成状态 */}
        <div className={statusIconClasses}>{trip.isCompleted && <CheckIcon />}</div>

        {/* 行程信息 */}
        <div className={styles.info}>
          <div className={nameClasses}>{trip.name}</div>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <CalendarIcon />
              {formatDate(trip.startDate)}
            </span>
            <span>{trip.totalDays}天</span>
            <span>
              {stats.completedGoals}/{stats.totalGoals}
            </span>
          </div>
        </div>

        {/* 删除按钮 */}
        {isHovered && (
          <button className={styles.deleteBtn} onClick={handleDeleteClick}>
            <DeleteIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;
