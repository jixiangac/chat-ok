// 行程总结弹窗组件
import React, { useState } from 'react';
import { Trip } from './types';
import { calculateTripStats } from './storage';

interface TripSummaryModalProps {
  visible: boolean;
  trip: Trip | null;
  onClose: () => void;
  onComplete: (comment?: string) => void;
}

const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
  visible,
  trip,
  onClose,
  onComplete
}) => {
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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '400px',
          maxHeight: '85vh',
          overflow: 'auto',
          animation: 'scaleIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#E8F4F8'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏝️ 旅行总结 - {trip.name}
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* 基本信息 */}
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span>📅</span>
              <span style={{ color: '#666' }}>
                旅行时间：{formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📍</span>
              <span style={{ color: '#666' }}>
                旅行天数：{trip.totalDays} 天
              </span>
            </div>
          </div>

          {/* 完成情况 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📊 完成情况
            </h3>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                总目标：<strong>{stats.totalGoals}</strong> 个
              </div>
              <div style={{ marginBottom: '8px' }}>
                已完成：<strong>{stats.completedGoals}</strong> 个
              </div>
              <div>
                完成率：<strong style={{ color: '#4CAF50' }}>{stats.completionRate}%</strong>
              </div>
            </div>
          </div>

          {/* 每日完成率 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📈 每日完成率
            </h3>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px'
            }}>
              {stats.dailyRates.map((day, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    minWidth: '48px'
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '4px'
                  }}>
                    {day.label}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: day.rate === 100 ? '#4CAF50' : (day.rate >= 80 ? '#FF9800' : '#666')
                  }}>
                    {day.rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 获得奖励 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🎁 获得奖励
            </h3>
            <div style={{
              padding: '16px',
              backgroundColor: '#FFF8E1',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                · 旅行积分：<strong style={{ color: '#FF9800' }}>+{trip.totalPoints} 分</strong>
              </div>
              {stats.completionRate === 100 && (
                <div>
                  · 解锁徽章：<strong style={{ color: '#9C27B0' }}>「完美旅程」🌟</strong>
                </div>
              )}
            </div>
          </div>

          {/* 旅行感言 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              💭 旅行感言（可选）
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="记录这次旅行的美好回忆..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 按钮 */}
          <button
            onClick={() => onComplete(comment.trim() || undefined)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#4A90A4',
              color: 'white',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d7a8c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90A4'}
          >
            完成，存入历史
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TripSummaryModal;
