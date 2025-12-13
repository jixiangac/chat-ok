// 目标卡片组件 - Notion风格
import React, { useState } from 'react';
import { TripGoal } from './types';
import GoalDetailModal from './GoalDetailModal';

export interface GoalRecord {
  image?: string;
  note: string;
}

interface GoalCardProps {
  goal: TripGoal;
  isExpired?: boolean;  // 日程是否已过期
  record?: GoalRecord;  // 目标记录
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSaveRecord?: (record: GoalRecord) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isExpired = false,
  record,
  onComplete,
  onEdit,
  onDelete,
  onSaveRecord
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const isCompleted = goal.status === 'completed';
  
  // 判断是否为未完成的过期目标
  const isFailed = isExpired && !isCompleted;
  
  // 获取状态颜色
  const getStatusColor = () => {
    if (isCompleted) return '#333';
    if (isFailed) return '#e74c3c';
    return 'transparent';
  };
  
  const getBorderColor = () => {
    if (isCompleted) return 'none';
    if (isFailed) return '2px solid #e74c3c';
    return '2px solid #ddd';
  };

  const handleCardClick = () => {
    setShowDetailModal(true);
  };

  const handleSaveRecord = (newRecord: GoalRecord) => {
    onSaveRecord?.(newRecord);
  };

  return (
    <>
    <div 
      style={{
        backgroundColor: isFailed ? '#fef5f5' : 'white',
        borderRadius: '12px',
        padding: '12px 16px',
        border: isFailed ? '1px solid #fde2e2' : '1px solid #f0f0f0',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
        position: 'relative',
        opacity: isFailed ? 0.85 : 1
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        {/* 状态图标 */}
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: getBorderColor(),
            backgroundColor: getStatusColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            cursor: (isCompleted || isExpired) ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isCompleted && !isExpired) onComplete();
          }}
        >
          {isCompleted && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {isFailed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 时间和内容 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: goal.location || goal.note || isFailed ? '6px' : 0
          }}>
            <span style={{
              fontSize: '13px',
              color: isFailed ? '#e74c3c' : '#999',
              fontFamily: 'monospace'
            }}>
              {goal.time}
            </span>
            <span style={{
              fontSize: '15px',
              color: isCompleted ? '#999' : (isFailed ? '#c0392b' : '#333'),
              textDecoration: (isCompleted || isFailed) ? 'line-through' : 'none'
            }}>
              {goal.content}
            </span>
            {isFailed && (
              <span style={{
                fontSize: '11px',
                color: '#e74c3c',
                backgroundColor: '#fde2e2',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '500'
              }}>
                未完成
              </span>
            )}
          </div>

          {/* 地点和备注 */}
          {(goal.location || goal.note) && (
            <div style={{
              fontSize: '13px',
              color: isFailed ? '#c0392b' : '#888',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {goal.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {goal.location}
                </span>
              )}
              {goal.note && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  {goal.note}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 操作按钮 - hover时显示，过期日程不显示编辑按钮 */}
        {isHovered && !isExpired && (
          <div style={{
            display: 'flex',
            gap: '4px',
            flexShrink: 0
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="编辑"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="删除"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>

    {/* 目标详情弹窗 */}
    {showDetailModal && (
      <GoalDetailModal
        goal={goal}
        record={record}
        onClose={() => setShowDetailModal(false)}
        onSave={handleSaveRecord}
      />
    )}
    </>
  );
};

export default GoalCard;
