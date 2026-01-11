// 目标管理逻辑 Hook
import { useCallback } from 'react';
import { TripGoal } from '../types';
import {
  addGoalToSchedule,
  updateGoal as updateGoalStorage,
  deleteGoal as deleteGoalStorage,
  completeGoal as completeGoalStorage,
  loadTrips,
} from '../storage';

export interface GoalData {
  time: string;
  content: string;
  location?: string;
  note?: string;
}

export interface UseGoalsReturn {
  addGoal: (goal: GoalData) => TripGoal | null;
  updateGoal: (goalId: string, updates: Partial<TripGoal>) => TripGoal | null;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string) => boolean; // 返回是否触发行程完成
}

export const useGoals = (
  tripId: string | undefined,
  scheduleId: string,
  onRefresh?: () => void
): UseGoalsReturn => {
  // 添加目标
  const addGoal = useCallback(
    (goal: GoalData): TripGoal | null => {
      if (!tripId) return null;
      const newGoal = addGoalToSchedule(tripId, scheduleId, goal);
      onRefresh?.();
      return newGoal;
    },
    [tripId, scheduleId, onRefresh]
  );

  // 更新目标
  const updateGoal = useCallback(
    (goalId: string, updates: Partial<TripGoal>): TripGoal | null => {
      if (!tripId) return null;
      const updated = updateGoalStorage(tripId, scheduleId, goalId, updates);
      onRefresh?.();
      return updated;
    },
    [tripId, scheduleId, onRefresh]
  );

  // 删除目标
  const deleteGoal = useCallback(
    (goalId: string) => {
      if (!tripId) return;
      deleteGoalStorage(tripId, scheduleId, goalId);
      onRefresh?.();
    },
    [tripId, scheduleId, onRefresh]
  );

  // 完成目标
  const completeGoal = useCallback(
    (goalId: string): boolean => {
      if (!tripId) return false;
      completeGoalStorage(tripId, scheduleId, goalId);
      onRefresh?.();

      // 检查行程是否完成
      const updatedTrips = loadTrips();
      const updatedTrip = updatedTrips.find((t) => t.id === tripId);
      return updatedTrip?.isCompleted || false;
    },
    [tripId, scheduleId, onRefresh]
  );

  return {
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
  };
};

export default useGoals;
