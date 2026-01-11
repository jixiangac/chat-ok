// 行程列表组件 - Notion风格
import React, { useState } from 'react';
import { Trip } from './types';
import { calculateTripStats } from './storage';
import TripDetailModal from './TripDetailModal';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onCreateTrip: () => void;
}

interface TripCardProps {
  trip: Trip;
  onSelect: () => void;
  onDelete: () => void;
  onShowDetail: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onDelete, onShowDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const stats = calculateTripStats(trip);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onClick={onShowDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* 完成状态 */}
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          border: trip.isCompleted ? 'none' : '2px solid #ddd',
          backgroundColor: trip.isCompleted ? '#333' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {trip.isCompleted && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>

        {/* 行程信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px',
            color: trip.isCompleted ? '#999' : '#333',
            textDecoration: trip.isCompleted ? 'line-through' : 'none',
            marginBottom: '4px'
          }}>
            {trip.name}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#888',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formatDate(trip.startDate)}
            </span>
            <span>{trip.totalDays}天</span>
            <span>{stats.completedGoals}/{stats.totalGoals}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('确定要删除这个行程吗？')) {
                onDelete();
              }
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
              transition: 'background-color 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const TripList: React.FC<TripListProps> = ({
  trips,
  onSelectTrip,
  onDeleteTrip,
  onCreateTrip
}) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleShowDetail = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleCloseDetail = () => {
    setSelectedTrip(null);
  };

  const handleEnterTrip = () => {
    if (selectedTrip) {
      onSelectTrip(selectedTrip.id);
      setSelectedTrip(null);
    }
  };

  return (
    <div>
      {/* 标题 */}
      <div style={{ padding: '0 8px', marginBottom: '8px' }}>
        <h2 style={{
          fontSize: '12px',
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
          fontWeight: 'normal'
        }}>我的行程</h2>
      </div>

      {/* 行程列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {trips.map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            onSelect={() => onSelectTrip(trip.id)}
            onDelete={() => onDeleteTrip(trip.id)}
            onShowDetail={() => handleShowDetail(trip)}
          />
        ))}

        {/* 创建新行程按钮 */}
        <div
          onClick={onCreateTrip}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid #f0f0f0',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <div style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span style={{ fontSize: '14px', color: '#999' }}>
            创建新行程
          </span>
        </div>

        {/* 空状态提示 */}
        {trips.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#999',
            fontSize: '14px'
          }}>
            点击上方创建你的第一个旅行行程
          </div>
        )}
      </div>

      {/* 行程详情弹窗 */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={handleCloseDetail}
          onEnterTrip={handleEnterTrip}
        />
      )}
    </div>
  );
};

export default TripList;
