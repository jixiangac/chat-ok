// 度假模式状态管理 Context
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Trip, TripGoal, TripSchedule } from '../types';
import {
  loadTrips,
  createTrip as createTripStorage,
  deleteTrip as deleteTripStorage,
  addGoalToSchedule,
  updateGoal as updateGoalStorage,
  deleteGoal as deleteGoalStorage,
  completeGoal as completeGoalStorage,
} from '../storage';
import { isTripActive, isTripUpcoming, getToday, getDateOnly, getTripDayIndex } from '../utils';

// 创建行程数据类型
export interface CreateTripData {
  name: string;
  startDate: string;
  totalDays: number;
  hasPreparation: boolean;
}

// 目标数据类型
export interface GoalData {
  time: string;
  content: string;
  location?: string;
  note?: string;
}

// Context 值类型
interface VacationContextValue {
  // 状态
  trips: Trip[];
  currentTrip: Trip | null;
  currentScheduleId: string;
  currentSchedule: TripSchedule | undefined;

  // 行程操作
  selectTrip: (tripId: string) => void;
  createTrip: (data: CreateTripData) => void;
  deleteTrip: (tripId: string) => void;
  clearCurrentTrip: () => void;

  // 日程操作
  selectSchedule: (scheduleId: string) => void;

  // 目标操作
  addGoal: (scheduleId: string, goal: GoalData) => void;
  updateGoal: (scheduleId: string, goalId: string, updates: Partial<TripGoal>) => void;
  deleteGoal: (scheduleId: string, goalId: string) => void;
  completeGoal: (scheduleId: string, goalId: string) => boolean;

  // 刷新
  refreshData: () => void;
}

// 创建 Context
const VacationContext = createContext<VacationContextValue | null>(null);

// Provider Props
interface VacationProviderProps {
  children: ReactNode;
}

// 查找即将开始或正在进行的行程
const findUpcomingOrActiveTrip = (tripList: Trip[]): Trip | null => {
  const activeTrips = tripList.filter((trip) => !trip.isCompleted);

  for (const trip of activeTrips) {
    if (isTripActive(trip)) {
      return trip;
    }
    if (isTripUpcoming(trip, 3)) {
      return trip;
    }
  }

  return null;
};

// 根据当前日期找到对应的日程
const findCurrentSchedule = (trip: Trip): string => {
  const daysDiff = getTripDayIndex(trip);

  if (daysDiff < 0) {
    const prepSchedule = trip.schedules.find((s) => s.type === 'preparation');
    return prepSchedule?.id || trip.schedules[0]?.id || '';
  }

  const hasPrep = trip.schedules.some((s) => s.type === 'preparation');
  const scheduleIndex = hasPrep ? daysDiff + 1 : daysDiff;

  if (scheduleIndex >= 0 && scheduleIndex < trip.schedules.length) {
    return trip.schedules[scheduleIndex].id;
  }

  return trip.schedules[trip.schedules.length - 1]?.id || '';
};

// VacationProvider 组件
export const VacationProvider: React.FC<VacationProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentScheduleId, setCurrentScheduleId] = useState<string>('');

  const currentSchedule = useMemo(() => {
    return currentTrip?.schedules.find((s) => s.id === currentScheduleId);
  }, [currentTrip, currentScheduleId]);

  useEffect(() => {
    const loadedTrips = loadTrips();
    setTrips(loadedTrips);

    const upcomingTrip = findUpcomingOrActiveTrip(loadedTrips);
    if (upcomingTrip) {
      setCurrentTrip(upcomingTrip);
      const scheduleId = findCurrentSchedule(upcomingTrip);
      setCurrentScheduleId(scheduleId);
    }
  }, []);

  const refreshData = useCallback(() => {
    const loadedTrips = loadTrips();
    setTrips(loadedTrips);

    if (currentTrip) {
      const updated = loadedTrips.find((t) => t.id === currentTrip.id);
      if (updated) {
        setCurrentTrip(updated);
      }
    }
  }, [currentTrip]);

  const selectTrip = useCallback(
    (tripId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (trip) {
        setCurrentTrip(trip);
        if (trip.schedules.length > 0) {
          setCurrentScheduleId(trip.schedules[0].id);
        }
      }
    },
    [trips]
  );

  const createTrip = useCallback((data: CreateTripData) => {
    const newTrip = createTripStorage(data.name, data.startDate, data.totalDays, data.hasPreparation);
    setTrips((prev) => [...prev, newTrip]);
    setCurrentTrip(newTrip);
    if (newTrip.schedules.length > 0) {
      setCurrentScheduleId(newTrip.schedules[0].id);
    }
  }, []);

  const deleteTrip = useCallback(
    (tripId: string) => {
      deleteTripStorage(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
        setCurrentScheduleId('');
      }
    },
    [currentTrip]
  );

  const clearCurrentTrip = useCallback(() => {
    setCurrentTrip(null);
    setCurrentScheduleId('');
  }, []);

  const selectSchedule = useCallback((scheduleId: string) => {
    setCurrentScheduleId(scheduleId);
  }, []);

  const addGoal = useCallback(
    (scheduleId: string, goal: GoalData) => {
      if (!currentTrip) return;
      addGoalToSchedule(currentTrip.id, scheduleId, goal);
      refreshData();
    },
    [currentTrip, refreshData]
  );

  const updateGoal = useCallback(
    (scheduleId: string, goalId: string, updates: Partial<TripGoal>) => {
      if (!currentTrip) return;
      updateGoalStorage(currentTrip.id, scheduleId, goalId, updates);
      refreshData();
    },
    [currentTrip, refreshData]
  );

  const deleteGoal = useCallback(
    (scheduleId: string, goalId: string) => {
      if (!currentTrip) return;
      deleteGoalStorage(currentTrip.id, scheduleId, goalId);
      refreshData();
    },
    [currentTrip, refreshData]
  );

  const completeGoal = useCallback(
    (scheduleId: string, goalId: string): boolean => {
      if (!currentTrip) return false;
      completeGoalStorage(currentTrip.id, scheduleId, goalId);
      refreshData();

      const updatedTrips = loadTrips();
      const updatedTrip = updatedTrips.find((t) => t.id === currentTrip.id);
      return updatedTrip?.isCompleted || false;
    },
    [currentTrip, refreshData]
  );

  const value = useMemo<VacationContextValue>(
    () => ({
      trips,
      currentTrip,
      currentScheduleId,
      currentSchedule,
      selectTrip,
      createTrip,
      deleteTrip,
      clearCurrentTrip,
      selectSchedule,
      addGoal,
      updateGoal,
      deleteGoal,
      completeGoal,
      refreshData,
    }),
    [
      trips,
      currentTrip,
      currentScheduleId,
      currentSchedule,
      selectTrip,
      createTrip,
      deleteTrip,
      clearCurrentTrip,
      selectSchedule,
      addGoal,
      updateGoal,
      deleteGoal,
      completeGoal,
      refreshData,
    ]
  );

  return <VacationContext.Provider value={value}>{children}</VacationContext.Provider>;
};

// useVacation Hook
export const useVacation = (): VacationContextValue => {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error('useVacation must be used within a VacationProvider');
  }
  return context;
};

export default VacationContext;
