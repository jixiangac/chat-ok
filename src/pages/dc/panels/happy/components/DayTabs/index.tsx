// 日程切换栏组件
import React from 'react';
import { TripSchedule } from '../../types';
import { isScheduleExpired, hasFailedGoals, isScheduleCompleted } from '../../utils';
import styles from './styles.module.css';

interface DayTabsProps {
  schedules: TripSchedule[];
  currentScheduleId: string;
  onSelectSchedule: (scheduleId: string) => void;
}

// 完成图标
const CheckIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4CAF50"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// 失败图标
const FailIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e74c3c"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DayTabs: React.FC<DayTabsProps> = ({ schedules, currentScheduleId, onSelectSchedule }) => {
  return (
    <div className={styles.container}>
      {schedules.map((schedule) => {
        const isActive = schedule.id === currentScheduleId;
        const expired = isScheduleExpired(schedule);
        const hasFailed = hasFailedGoals(schedule);
        const allCompleted = isScheduleCompleted(schedule);

        // 确定状态图标
        const renderStatusIcon = () => {
          if (allCompleted) {
            return (
              <span className={styles.statusIcon}>
                <CheckIcon />
              </span>
            );
          }
          if (hasFailed) {
            return (
              <span className={styles.statusIcon}>
                <FailIcon />
              </span>
            );
          }
          return null;
        };

        // 构建 tab 类名
        const tabClasses = [
          styles.tab,
          isActive && styles.tabActive,
          isActive && hasFailed && styles.tabFailed,
          expired && !isActive && styles.tabExpired,
        ]
          .filter(Boolean)
          .join(' ');

        // 构建 label 类名
        const labelClasses = [
          styles.tabLabel,
          isActive && styles.tabLabelActive,
          hasFailed && styles.tabLabelFailed,
          expired && !hasFailed && styles.tabLabelExpired,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button key={schedule.id} onClick={() => onSelectSchedule(schedule.id)} className={tabClasses}>
            {renderStatusIcon()}
            <span className={labelClasses}>{schedule.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DayTabs;
