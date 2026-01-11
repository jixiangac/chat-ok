// 目标卡片组件
import React, { useState } from 'react';
import { TripGoal } from '../../types';
import styles from './styles.module.css';

export interface GoalRecord {
  image?: string;
  note: string;
}

interface GoalCardProps {
  goal: TripGoal;
  isExpired?: boolean;
  record?: GoalRecord;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSaveRecord?: (record: GoalRecord) => void;
  onClick?: () => void;
}

// 图标组件
const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FailIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LocationIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NoteIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const EditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isExpired = false,
  onComplete,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = goal.status === 'completed';
  const isFailed = isExpired && !isCompleted;
  const hasMeta = goal.location || goal.note;

  // 处理卡片点击
  const handleCardClick = () => {
    onClick?.();
  };

  // 处理状态图标点击
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted && !isExpired) {
      onComplete();
    }
  };

  // 处理编辑点击
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  // 处理删除点击
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  // 构建卡片类名
  const cardClasses = [styles.card, isFailed && styles.cardFailed].filter(Boolean).join(' ');

  // 构建状态图标类名
  const statusIconClasses = [
    styles.statusIcon,
    isCompleted && styles.statusIconCompleted,
    isFailed && styles.statusIconFailed,
    !isCompleted && !isFailed && styles.statusIconPending,
  ]
    .filter(Boolean)
    .join(' ');

  // 构建标题类名
  const titleClasses = [
    styles.title,
    isCompleted && styles.titleCompleted,
    isFailed && styles.titleFailed,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.content}>
        {/* 状态图标 */}
        <div className={statusIconClasses} onClick={handleStatusClick}>
          {isCompleted && <CheckIcon />}
          {isFailed && <FailIcon />}
        </div>

        {/* 内容区域 */}
        <div className={styles.info}>
          {/* 时间和内容 */}
          <div className={`${styles.header} ${hasMeta || isFailed ? styles.headerWithMeta : ''}`}>
            <span className={`${styles.time} ${isFailed ? styles.timeFailed : ''}`}>{goal.time}</span>
            <span className={titleClasses}>{goal.content}</span>
            {isFailed && <span className={styles.failedBadge}>未完成</span>}
          </div>

          {/* 地点和备注 */}
          {hasMeta && (
            <div className={`${styles.meta} ${isFailed ? styles.metaFailed : ''}`}>
              {goal.location && (
                <span className={styles.metaItem}>
                  <LocationIcon />
                  {goal.location}
                </span>
              )}
              {goal.note && (
                <span className={styles.metaItem}>
                  <NoteIcon />
                  {goal.note}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {isHovered && !isExpired && (
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={handleEditClick} title="编辑">
              <EditIcon />
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={handleDeleteClick} title="删除">
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
