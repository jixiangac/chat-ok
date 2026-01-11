// 日程相关工具函数
import { TripSchedule, TripGoal } from '../types';

/**
 * 判断日程是否已过期（日期已过）
 */
export const isScheduleExpired = (schedule: TripSchedule): boolean => {
  if (!schedule.date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduleDate = new Date(schedule.date);
  const scheduleDateOnly = new Date(
    scheduleDate.getFullYear(),
    scheduleDate.getMonth(),
    scheduleDate.getDate()
  );
  return scheduleDateOnly < today;
};

/**
 * 判断日程是否有未完成的目标（用于过期日程）
 */
export const hasFailedGoals = (schedule: TripSchedule): boolean => {
  if (!isScheduleExpired(schedule)) return false;
  return schedule.goals.some((g) => g.status !== 'completed');
};

/**
 * 判断日程是否全部完成
 */
export const isScheduleCompleted = (schedule: TripSchedule): boolean => {
  return schedule.goals.length > 0 && schedule.goals.every((g) => g.status === 'completed');
};

/**
 * 日程统计信息
 */
export interface ScheduleStats {
  total: number;
  completed: number;
  failed: number;
  rate: number;
}

/**
 * 计算日程完成度统计
 */
export const getScheduleStats = (schedule: TripSchedule | undefined): ScheduleStats => {
  if (!schedule) {
    return { total: 0, completed: 0, failed: 0, rate: 0 };
  }
  
  const total = schedule.goals.length;
  const completed = schedule.goals.filter((g) => g.status === 'completed').length;
  const expired = isScheduleExpired(schedule);
  const failed = expired ? total - completed : 0;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, failed, rate };
};

/**
 * 获取日程状态颜色
 */
export const getScheduleStatusColor = (schedule: TripSchedule): string => {
  if (isScheduleCompleted(schedule)) {
    return '#4CAF50'; // 成功绿
  }
  if (hasFailedGoals(schedule)) {
    return '#e74c3c'; // 失败红
  }
  return '#666'; // 默认灰
};

/**
 * 获取目标状态颜色
 */
export const getGoalStatusColor = (goal: TripGoal, isExpired: boolean): string => {
  if (goal.status === 'completed') {
    return '#333';
  }
  if (isExpired) {
    return '#e74c3c';
  }
  return 'transparent';
};

/**
 * 获取目标边框样式
 */
export const getGoalBorderStyle = (goal: TripGoal, isExpired: boolean): string => {
  if (goal.status === 'completed') {
    return 'none';
  }
  if (isExpired) {
    return '2px solid #e74c3c';
  }
  return '2px solid #ddd';
};
