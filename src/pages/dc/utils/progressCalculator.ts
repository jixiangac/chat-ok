import type { MainlineTaskType, NumericConfig, ChecklistConfig, CheckInConfig } from '../types';

/**
 * 进度计算工具函数
 * 提取自各个组件中的重复计算逻辑，统一管理
 */

// 格式化大数字（如 1000000 -> 100W）
export const formatLargeNumber = (num: number): string => {
  if (num >= 10000) {
    const wan = num / 10000;
    return wan % 1 === 0 ? `${wan}W` : `${wan.toFixed(1)}W`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
};

// 千分位格式化
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 智能判断任务类型
export const getEffectiveMainlineType = (
  numericConfig?: NumericConfig,
  checklistConfig?: ChecklistConfig,
  checkInConfig?: CheckInConfig
): MainlineTaskType => {
  if (numericConfig) return 'NUMERIC';
  if (checklistConfig) return 'CHECKLIST';
  return 'CHECK_IN';
};

// 数值型进度计算
export interface NumericProgressResult {
  totalProgress: number;
  cycleProgress: number;
  effectiveChange: number;
  cycleAchieved: number;
  cycleRemaining: number;
  cycleTargetValue: number;
  cycleStartValue: number;
}

export const calculateNumericProgress = (
  config: NumericConfig,
  currentCycleNumber: number,
  totalCycles: number,
  cycleSnapshots?: Array<{ actualValue?: number }>,
  history?: Array<{ date: string; value?: number }>,
  cycleStartDate?: string
): NumericProgressResult => {
  const isDecrease = config.direction === 'DECREASE';
  const originalStart = config.originalStartValue ?? config.startValue;
  const totalChange = Math.abs(config.targetValue - originalStart);
  
  // 计算总进度
  const rawChange = config.currentValue - originalStart;
  const effectiveChange = isDecrease 
    ? Math.max(0, -rawChange)
    : Math.max(0, rawChange);
  const totalProgress = totalChange > 0 
    ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) 
    : 0;
  
  // 计算周期进度
  const perCycleTarget = config.perCycleTarget || (totalChange / totalCycles);
  
  // 获取周期起始值
  let cycleStartValue = config.startValue;
  if (cycleSnapshots && cycleSnapshots.length > 0) {
    const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
    if (lastSnapshot.actualValue !== undefined) {
      cycleStartValue = lastSnapshot.actualValue;
    }
  } else if (history && cycleStartDate) {
    const cycleStart = new Date(cycleStartDate);
    for (let i = history.length - 1; i >= 0; i--) {
      const recordDate = new Date(history[i].date);
      if (recordDate < cycleStart && history[i].value !== undefined) {
        cycleStartValue = history[i].value as number;
        break;
      }
    }
    if (currentCycleNumber === 1) {
      cycleStartValue = config.startValue;
    }
  }
  
  // 计算周期目标值
  let cycleTargetValue = isDecrease 
    ? cycleStartValue - perCycleTarget 
    : cycleStartValue + perCycleTarget;
  
  // 确保目标值不超过最终目标
  if (isDecrease) {
    cycleTargetValue = Math.max(cycleTargetValue, config.targetValue);
  } else {
    cycleTargetValue = Math.min(cycleTargetValue, config.targetValue);
  }
  
  // 计算周期已完成
  const rawCycleChange = config.currentValue - cycleStartValue;
  const cycleAchieved = isDecrease 
    ? Math.max(0, -rawCycleChange)
    : Math.max(0, rawCycleChange);
  
  // 计算周期还需
  let cycleRemaining: number;
  if (isDecrease) {
    cycleRemaining = Math.max(0, config.currentValue - cycleTargetValue);
  } else {
    cycleRemaining = Math.max(0, cycleTargetValue - config.currentValue);
  }
  
  // 计算周期进度百分比
  const cycleProgress = perCycleTarget > 0 
    ? Math.min(Math.round((cycleAchieved / perCycleTarget) * 100), 100) 
    : 0;
  
  return {
    totalProgress,
    cycleProgress,
    effectiveChange,
    cycleAchieved: Math.round(cycleAchieved * 10) / 10,
    cycleRemaining: Math.round(cycleRemaining * 10) / 10,
    cycleTargetValue: Math.round(cycleTargetValue * 10) / 10,
    cycleStartValue: Math.round(cycleStartValue * 10) / 10
  };
};

// 清单型进度计算
export const calculateChecklistProgress = (config: ChecklistConfig): number => {
  return config.totalItems > 0 
    ? Math.round((config.completedItems / config.totalItems) * 100) 
    : 0;
};

// 打卡型进度计算
export interface CheckInProgressResult {
  totalProgress: number;
  cycleProgress: number;
  totalValue: number;
  cycleValue: number;
}

export const calculateCheckInProgress = (
  config: CheckInConfig,
  checkIns: Array<{ date: string; value?: number }>,
  totalCycles: number,
  requiredCheckIns: number,
  cycleStartDate: string,
  cycleEndDate: string
): CheckInProgressResult => {
  const unit = config.unit || 'TIMES';
  
  // 过滤当前周期的打卡记录
  const cycleCheckIns = checkIns.filter(c => {
    return c.date >= cycleStartDate && c.date <= cycleEndDate;
  });
  
  let totalProgress = 0;
  let cycleProgress = 0;
  let totalValue = 0;
  let cycleValue = 0;
  
  if (unit === 'TIMES') {
    const perCycleTarget = config.cycleTargetTimes || config.perCycleTarget || requiredCheckIns;
    const totalRequired = totalCycles * perCycleTarget;
    totalValue = checkIns.length;
    cycleValue = cycleCheckIns.length;
    totalProgress = totalRequired > 0 ? Math.round((totalValue / totalRequired) * 100) : 0;
    cycleProgress = perCycleTarget > 0 ? Math.min(Math.round((cycleValue / perCycleTarget) * 100), 100) : 0;
  } else if (unit === 'DURATION') {
    const perCycleTarget = config.cycleTargetMinutes || config.perCycleTarget || 0;
    const totalRequired = totalCycles * perCycleTarget;
    totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
    cycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
    totalProgress = totalRequired > 0 ? Math.round((totalValue / totalRequired) * 100) : 0;
    cycleProgress = perCycleTarget > 0 ? Math.min(Math.round((cycleValue / perCycleTarget) * 100), 100) : 0;
  } else {
    const perCycleTarget = config.cycleTargetValue || config.perCycleTarget || 0;
    const totalRequired = totalCycles * perCycleTarget;
    totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
    cycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
    totalProgress = totalRequired > 0 ? Math.round((totalValue / totalRequired) * 100) : 0;
    cycleProgress = perCycleTarget > 0 ? Math.min(Math.round((cycleValue / perCycleTarget) * 100), 100) : 0;
  }
  
  return {
    totalProgress: Math.min(totalProgress, 100),
    cycleProgress,
    totalValue,
    cycleValue
  };
};
