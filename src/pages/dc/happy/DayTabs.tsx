// 日程切换栏组件 - Notion风格
import React from 'react';
import { TripSchedule } from './types';

interface DayTabsProps {
  schedules: TripSchedule[];
  currentScheduleId: string;
  onSelectSchedule: (scheduleId: string) => void;
}

// 判断日程是否已过期
const isScheduleExpired = (schedule: TripSchedule): boolean => {
  if (!schedule.date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduleDate = new Date(schedule.date);
  const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
  return scheduleDateOnly < today;
};

// 判断日程是否有未完成的目标（用于过期日程）
const hasFailedGoals = (schedule: TripSchedule): boolean => {
  if (!isScheduleExpired(schedule)) return false;
  return schedule.goals.some(g => g.status !== 'completed');
};

const DayTabs: React.FC<DayTabsProps> = ({
  schedules,
  currentScheduleId,
  onSelectSchedule
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      padding: '8px 0',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {schedules.map(schedule => {
        const isActive = schedule.id === currentScheduleId;
        const isExpired = isScheduleExpired(schedule);
        const hasFailed = hasFailedGoals(schedule);
        const isAllCompleted = schedule.goals.length > 0 && schedule.goals.every(g => g.status === 'completed');
        
        // 确定状态图标和颜色
        const getStatusIcon = () => {
          if (isAllCompleted) {
            return (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            );
          }
          if (hasFailed) {
            return (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            );
          }
          return null;
        };

        const getTextColor = () => {
          if (isActive) return '#333';
          if (hasFailed) return '#c0392b';
          if (isExpired) return '#999';
          return '#666';
        };
        
        return (
          <button
            key={schedule.id}
            onClick={() => onSelectSchedule(schedule.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isActive ? (hasFailed ? '#fef5f5' : '#f0f0f0') : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              opacity: isExpired && !isActive ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = hasFailed ? '#fef5f5' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {getStatusIcon()}
            <span style={{
              fontSize: '14px',
              fontWeight: isActive ? '500' : '400',
              color: getTextColor(),
              textDecoration: isExpired && !isAllCompleted ? 'none' : 'none'
            }}>
              {schedule.label}
            </span>
          </button>
        );
      })}
      
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DayTabs;
