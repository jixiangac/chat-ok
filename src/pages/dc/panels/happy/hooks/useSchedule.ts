// 日程相关逻辑 Hook
import { useMemo } from 'react';
import { Trip, TripSchedule } from '../types';
import {
  isScheduleExpired,
  hasFailedGoals,
  isScheduleCompleted,
  getScheduleStats,
  ScheduleStats,
} from '../utils';
import { getTripDayIndex } from '../utils/dateHelper';

export interface UseScheduleReturn {
  currentSchedule: TripSchedule | undefined;
  scheduleStats: ScheduleStats;
  isExpired: boolean;
  isCompleted: boolean;
  hasFailed: boolean;
  scheduleIndex: number;
  isEvenSchedule: boolean;
  findCurrentScheduleId: () => string;
}

export const useSchedule = (
  trip: Trip | null,
  currentScheduleId: string
): UseScheduleReturn => {
  // 当前日程
  const currentSchedule = useMemo(() => {
    return trip?.schedules.find((s) => s.id === currentScheduleId);
  }, [trip, currentScheduleId]);

  // 日程统计
  const scheduleStats = useMemo(() => {
    return getScheduleStats(currentSchedule);
  }, [currentSchedule]);

  // 日程是否过期
  const isExpired = useMemo(() => {
    return currentSchedule ? isScheduleExpired(currentSchedule) : false;
  }, [currentSchedule]);

  // 日程是否全部完成
  const isCompleted = useMemo(() => {
    return currentSchedule ? isScheduleCompleted(currentSchedule) : false;
  }, [currentSchedule]);

  // 日程是否有失败目标
  const hasFailed = useMemo(() => {
    return currentSchedule ? hasFailedGoals(currentSchedule) : false;
  }, [currentSchedule]);

  // 当前日程索引
  const scheduleIndex = useMemo(() => {
    if (!trip) return 0;
    return trip.schedules.findIndex((s) => s.id === currentScheduleId);
  }, [trip, currentScheduleId]);

  // 是否为偶数日程（用于切换图片）
  const isEvenSchedule = useMemo(() => {
    return scheduleIndex % 2 === 0;
  }, [scheduleIndex]);

  // 根据当前日期找到对应的日程 ID
  const findCurrentScheduleId = useMemo(() => {
    return (): string => {
      if (!trip) return '';

      const daysDiff = getTripDayIndex(trip);

      // 如果还没开始，显示准备日程（如果有）或第一天
      if (daysDiff < 0) {
        const prepSchedule = trip.schedules.find((s) => s.type === 'preparation');
        return prepSchedule?.id || trip.schedules[0]?.id || '';
      }

      // 如果已经开始，找到对应的日程
      const hasPrep = trip.schedules.some((s) => s.type === 'preparation');
      const scheduleIdx = hasPrep ? daysDiff + 1 : daysDiff;

      if (scheduleIdx >= 0 && scheduleIdx < trip.schedules.length) {
        return trip.schedules[scheduleIdx].id;
      }

      // 如果超出范围，返回最后一个日程
      return trip.schedules[trip.schedules.length - 1]?.id || '';
    };
  }, [trip]);

  return {
    currentSchedule,
    scheduleStats,
    isExpired,
    isCompleted,
    hasFailed,
    scheduleIndex,
    isEvenSchedule,
    findCurrentScheduleId,
  };
};

export default useSchedule;
