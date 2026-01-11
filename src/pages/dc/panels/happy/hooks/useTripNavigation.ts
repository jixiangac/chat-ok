// 行程导航逻辑 Hook
import { useMemo, useCallback } from 'react';
import { Trip } from '../types';
import { isTripActive, isTripUpcoming, getTripDayIndex } from '../utils';

export interface UseTripNavigationReturn {
  findUpcomingOrActiveTrip: () => Trip | null;
  findCurrentScheduleId: (trip: Trip) => string;
}

export const useTripNavigation = (trips: Trip[]): UseTripNavigationReturn => {
  // 查找即将开始或正在进行的行程
  const findUpcomingOrActiveTrip = useCallback((): Trip | null => {
    // 筛选未完成的行程
    const activeTrips = trips.filter((trip) => !trip.isCompleted);

    for (const trip of activeTrips) {
      // 检查是否正在进行中
      if (isTripActive(trip)) {
        return trip;
      }

      // 检查是否在3天内开始
      if (isTripUpcoming(trip, 3)) {
        return trip;
      }
    }

    return null;
  }, [trips]);

  // 根据当前日期找到对应的日程 ID
  const findCurrentScheduleId = useCallback((trip: Trip): string => {
    const daysDiff = getTripDayIndex(trip);

    // 如果还没开始，显示准备日程（如果有）或第一天
    if (daysDiff < 0) {
      const prepSchedule = trip.schedules.find((s) => s.type === 'preparation');
      return prepSchedule?.id || trip.schedules[0]?.id || '';
    }

    // 如果已经开始，找到对应的日程
    // 考虑准备日程的偏移
    const hasPrep = trip.schedules.some((s) => s.type === 'preparation');
    const scheduleIndex = hasPrep ? daysDiff + 1 : daysDiff;

    if (scheduleIndex >= 0 && scheduleIndex < trip.schedules.length) {
      return trip.schedules[scheduleIndex].id;
    }

    // 如果超出范围，返回最后一个日程
    return trip.schedules[trip.schedules.length - 1]?.id || '';
  }, []);

  return {
    findUpcomingOrActiveTrip,
    findCurrentScheduleId,
  };
};

export default useTripNavigation;
