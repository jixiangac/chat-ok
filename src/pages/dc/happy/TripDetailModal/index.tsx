// 行程详情弹窗组件 - Notion风格
import React from 'react';
import dayjs from 'dayjs';
import { Trip } from '../types';
import { calculateTripStats } from '../storage';
import './styles.css';

interface TripDetailModalProps {
  trip: Trip;
  onClose: () => void;
  onEnterTrip: () => void;
}

const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  onClose,
  onEnterTrip
}) => {
  const stats = calculateTripStats(trip);
  
  // 格式化日期为 "6月5日" 格式
  const formatDateCN = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // 格式化日期为 "June 5" 格式
  const formatDateEN = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // 计算结束日期
  const getEndDate = () => {
    return dayjs(trip.startDate).add(trip.totalDays - 1, 'day').format('YYYY-MM-DD');
  };

  // 获取第一个日程的开始时间
  const getStartTime = () => {
    const daySchedules = trip.schedules.filter(s => s.type === 'day');
    if (daySchedules.length === 0 || daySchedules[0].goals.length === 0) {
      return '08:00';
    }
    return daySchedules[0].goals[0].time;
  };

  // 获取最后一个日程的结束时间
  const getEndTime = () => {
    const daySchedules = trip.schedules.filter(s => s.type === 'day');
    if (daySchedules.length === 0) return '18:00';
    const lastSchedule = daySchedules[daySchedules.length - 1];
    if (lastSchedule.goals.length === 0) return '18:00';
    return lastSchedule.goals[lastSchedule.goals.length - 1].time;
  };

  const endDate = getEndDate();
  const startTime = getStartTime();
  const endTime = getEndTime();

  // 计算完成率圆环
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = stats.completionRate / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="trip-detail-overlay" onClick={onClose}>
      <div className="trip-detail-modal" onClick={e => e.stopPropagation()}>
        {/* 头部区域 */}
        <div className="trip-detail-header">
          <div className="trip-detail-header-placeholder">
            <svg className="trip-detail-header-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="trip-detail-content">
          {/* 路线信息 */}
          <div className="trip-detail-route">
            {/* 出发地 */}
            <div className="trip-detail-route-point">
              <div className="trip-detail-route-city">{trip.name.split('→')[0] || trip.name}</div>
              <div className="trip-detail-route-date">
                {formatDateEN(trip.startDate)}, {startTime}
              </div>
            </div>

            {/* 箭头 */}
            <div className="trip-detail-route-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>

            {/* 目的地 */}
            <div className="trip-detail-route-point">
              <div className="trip-detail-route-city">{trip.name.split('→')[1] || '目的地'}</div>
              <div className="trip-detail-route-date">
                {formatDateEN(endDate)}, {endTime}
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="trip-detail-divider" />

          {/* 统计信息 */}
          <div className="trip-detail-stats">
            <div className="trip-detail-stat-item">
              <div className="trip-detail-stat-label">天数</div>
              <div className="trip-detail-stat-value">
                {trip.totalDays}
                <span className="trip-detail-stat-unit">天</span>
              </div>
            </div>
            <div className="trip-detail-stat-item">
              <div className="trip-detail-stat-label">目标</div>
              <div className="trip-detail-stat-value">
                {stats.totalGoals}
                <span className="trip-detail-stat-unit">个</span>
              </div>
            </div>
          </div>

          {/* 价格/积分区域 */}
          <div className="trip-detail-price-section">
            <div className="trip-detail-price-info">
              <div className="trip-detail-price-label">积分</div>
              <div className="trip-detail-price-value">
                {trip.totalPoints}
                <span className="trip-detail-price-unit">分</span>
              </div>
            </div>

            {/* 完成率圆环 */}
            <div className="trip-detail-progress">
              <div className="trip-detail-progress-ring">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle
                    className="trip-detail-progress-ring-bg"
                    cx="30"
                    cy="30"
                    r={radius}
                  />
                  <circle
                    className="trip-detail-progress-ring-fill"
                    cx="30"
                    cy="30"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="trip-detail-progress-text">
                  {stats.completionRate}%
                </div>
              </div>
              <div className="trip-detail-progress-label">完成率</div>
            </div>
          </div>

          {/* 日程预览 */}
          <div className="trip-detail-schedules">
            <div className="trip-detail-schedules-title">日程概览</div>
            {trip.schedules.slice(0, 4).map((schedule) => (
              <div key={schedule.id} className="trip-detail-schedule-item">
                <div className={`trip-detail-schedule-day ${schedule.isCompleted ? 'completed' : ''}`}>
                  {schedule.label}
                </div>
                <div className="trip-detail-schedule-info">
                  <div className="trip-detail-schedule-date">
                    {schedule.date ? formatDateCN(schedule.date) : schedule.label}
                  </div>
                  <div className="trip-detail-schedule-goals">
                    {schedule.goals.length}个目标 · {schedule.goals.filter(g => g.status === 'completed').length}已完成
                  </div>
                </div>
                {schedule.isCompleted && (
                  <svg className="trip-detail-schedule-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
            {trip.schedules.length > 4 && (
              <div className="trip-detail-schedule-item" style={{ justifyContent: 'center', color: '#aeafb5', fontSize: '13px' }}>
                还有 {trip.schedules.length - 4} 个日程...
              </div>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="trip-detail-footer">
          <button className="trip-detail-btn-secondary" onClick={onClose}>
            关闭
          </button>
          <button className="trip-detail-btn-primary" onClick={onEnterTrip}>
            进入行程
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailModal;
