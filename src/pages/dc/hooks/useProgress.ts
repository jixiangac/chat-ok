import { useMemo } from 'react';
import type { NumericConfig, ChecklistConfig, CheckInConfig } from '../types';
import {
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  getEffectiveMainlineType,
  type NumericProgressResult,
  type CheckInProgressResult
} from '../utils/progressCalculator';

/**
 * 统一的进度计算 Hook
 * 使用 useMemo 缓存计算结果，避免重复计算
 */

interface UseProgressParams {
  numericConfig?: NumericConfig;
  checklistConfig?: ChecklistConfig;
  checkInConfig?: CheckInConfig;
  checkIns?: Array<{ date: string; value?: number }>;
  totalCycles: number;
  currentCycleNumber: number;
  requiredCheckIns: number;
  cycleStartDate: string;
  cycleEndDate: string;
  cycleSnapshots?: Array<{ actualValue?: number }>;
  history?: Array<{ date: string; value?: number }>;
}

interface UseProgressResult {
  mainlineType: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
  totalProgress: number;
  cycleProgress: number;
  numericProgress?: NumericProgressResult;
  checkInProgress?: CheckInProgressResult;
}

export function useProgress({
  numericConfig,
  checklistConfig,
  checkInConfig,
  checkIns = [],
  totalCycles,
  currentCycleNumber,
  requiredCheckIns,
  cycleStartDate,
  cycleEndDate,
  cycleSnapshots,
  history
}: UseProgressParams): UseProgressResult {
  // 缓存任务类型判断
  const mainlineType = useMemo(() => {
    return getEffectiveMainlineType(numericConfig, checklistConfig, checkInConfig);
  }, [numericConfig, checklistConfig, checkInConfig]);

  // 缓存数值型进度计算
  const numericProgress = useMemo(() => {
    if (!numericConfig) return undefined;
    return calculateNumericProgress(
      numericConfig,
      currentCycleNumber,
      totalCycles,
      cycleSnapshots,
      history,
      cycleStartDate
    );
  }, [numericConfig, currentCycleNumber, totalCycles, cycleSnapshots, history, cycleStartDate]);

  // 缓存清单型进度计算
  const checklistProgress = useMemo(() => {
    if (!checklistConfig) return 0;
    return calculateChecklistProgress(checklistConfig);
  }, [checklistConfig]);

  // 缓存打卡型进度计算
  const checkInProgress = useMemo(() => {
    if (!checkInConfig) return undefined;
    return calculateCheckInProgress(
      checkInConfig,
      checkIns,
      totalCycles,
      requiredCheckIns,
      cycleStartDate,
      cycleEndDate
    );
  }, [checkInConfig, checkIns, totalCycles, requiredCheckIns, cycleStartDate, cycleEndDate]);

  // 计算总进度和周期进度
  const { totalProgress, cycleProgress } = useMemo(() => {
    switch (mainlineType) {
      case 'NUMERIC':
        return {
          totalProgress: numericProgress?.totalProgress ?? 0,
          cycleProgress: numericProgress?.cycleProgress ?? 0
        };
      case 'CHECKLIST':
        return {
          totalProgress: checklistProgress,
          cycleProgress: checklistProgress
        };
      case 'CHECK_IN':
      default:
        return {
          totalProgress: checkInProgress?.totalProgress ?? 0,
          cycleProgress: checkInProgress?.cycleProgress ?? 0
        };
    }
  }, [mainlineType, numericProgress, checklistProgress, checkInProgress]);

  return {
    mainlineType,
    totalProgress,
    cycleProgress,
    numericProgress,
    checkInProgress
  };
}

/**
 * 计划结束状态 Hook
 * 判断计划是否已结束，并计算最终统计数据
 */
interface UsePlanEndStatusParams {
  startDate: string;
  cycleDays: number;
  totalCycles: number;
  cycleSnapshots?: Array<{
    cycleNumber: number;
    completionRate: number;
    actualValue?: number;
  }>;
  status?: string;
  numericConfig?: NumericConfig;
  simulatedToday?: string;
}

interface PlanEndInfo {
  isPlanEnded: boolean;
  planStartDate?: string;
  planEndDate?: string;
  completedCycles?: number;
  averageCompletionRate?: number;
  isSuccess?: boolean;
  finalActualValue?: number;
}

export function usePlanEndStatus({
  startDate,
  cycleDays,
  totalCycles,
  cycleSnapshots = [],
  status,
  numericConfig,
  simulatedToday
}: UsePlanEndStatusParams): PlanEndInfo {
  return useMemo(() => {
    const start = new Date(startDate);
    const today = simulatedToday ? new Date(simulatedToday) : new Date();
    
    // 计算计划结束日期
    const planEndDate = new Date(start);
    planEndDate.setDate(start.getDate() + totalCycles * cycleDays - 1);
    
    // 判断计划是否结束
    const isPlanEndedByTime = today > planEndDate;
    const isPlanEndedByStatus = status === 'completed' || status === 'archived';
    const isPlanEndedBySnapshots = cycleSnapshots.length >= totalCycles;
    const isPlanEnded = isPlanEndedByTime || isPlanEndedByStatus || isPlanEndedBySnapshots;
    
    if (!isPlanEnded) {
      return { isPlanEnded: false };
    }
    
    // 计算统计数据
    const completedCycles = cycleSnapshots.length;
    const allCompletionRates = cycleSnapshots.map(s => s.completionRate);
    const averageCompletionRate = allCompletionRates.length > 0
      ? Math.round(allCompletionRates.reduce((a, b) => a + b, 0) / allCompletionRates.length)
      : 0;
    
    // 获取最终值
    const lastSnapshot = cycleSnapshots.length > 0 
      ? cycleSnapshots[cycleSnapshots.length - 1] 
      : null;
    const finalActualValue = lastSnapshot?.actualValue ?? numericConfig?.currentValue;
    
    // 判断是否达成目标
    let isSuccess = false;
    if (numericConfig) {
      const isDecrease = numericConfig.direction === 'DECREASE';
      isSuccess = isDecrease 
        ? (finalActualValue ?? 0) <= numericConfig.targetValue
        : (finalActualValue ?? 0) >= numericConfig.targetValue;
    }
    
    return {
      isPlanEnded: true,
      planStartDate: startDate,
      planEndDate: planEndDate.toISOString().split('T')[0],
      completedCycles,
      averageCompletionRate,
      isSuccess,
      finalActualValue
    };
  }, [startDate, cycleDays, totalCycles, cycleSnapshots, status, numericConfig, simulatedToday]);
}

/**
 * 今日打卡状态 Hook
 * 缓存今日打卡状态的计算
 */
interface UseTodayCheckInParams {
  checkInConfig?: CheckInConfig;
  checkIns?: Array<{ date: string; value?: number }>;
  today: string;
}

interface TodayCheckInStatus {
  isCompleted: boolean;
  todayValue: number;
  todayCount: number;
  remainingValue: number;
}

export function useTodayCheckInStatus({
  checkInConfig,
  checkIns = [],
  today
}: UseTodayCheckInParams): TodayCheckInStatus {
  return useMemo(() => {
    if (!checkInConfig) {
      return {
        isCompleted: false,
        todayValue: 0,
        todayCount: 0,
        remainingValue: 0
      };
    }
    
    const todayCheckIns = checkIns.filter(c => c.date === today);
    const todayCount = todayCheckIns.length;
    const todayValue = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
    
    const unit = checkInConfig.unit || 'TIMES';
    let isCompleted = false;
    let remainingValue = 0;
    
    if (unit === 'TIMES') {
      const dailyMax = checkInConfig.dailyMaxTimes || 1;
      isCompleted = todayCount >= dailyMax;
      remainingValue = Math.max(0, dailyMax - todayCount);
    } else if (unit === 'DURATION') {
      const dailyTarget = checkInConfig.dailyTargetMinutes || 15;
      isCompleted = todayValue >= dailyTarget;
      remainingValue = Math.max(0, dailyTarget - todayValue);
    } else {
      const dailyTarget = checkInConfig.dailyTargetValue || 0;
      isCompleted = dailyTarget > 0 && todayValue >= dailyTarget;
      remainingValue = Math.max(0, dailyTarget - todayValue);
    }
    
    return {
      isCompleted,
      todayValue,
      todayCount,
      remainingValue
    };
  }, [checkInConfig, checkIns, today]);
}
