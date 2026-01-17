import { Task, NumericConfig, ChecklistConfig, CheckInConfig, CycleConfig } from '../types';
import { getCurrentDate } from './dateTracker';

// 兼容旧版 MainlineTask 类型
interface MainlineTask {
  numericConfig?: NumericConfig;
  checklistConfig?: ChecklistConfig;
  checkInConfig?: CheckInConfig;
  cycleConfig?: any;
  createdAt?: string;
  mainlineType?: string;
  progress?: any;
}

// ============ 格式化工具函数 ============

/**
 * 格式化数值：保留两位小数，使用字符串截取方式（不四舍五入）
 */
export function formatNumber(value: number | string | undefined): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  // 转为字符串，找到小数点位置
  const str = num.toString();
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return str; // 整数直接返回
  
  // 截取小数点后两位
  return str.substring(0, dotIndex + 3);
}

// ============ 截止时间相关 ============

/** 截止时间颜色配置 */
export const DEADLINE_COLORS = {
  urgent: '#5c0011',      // 乌梅红 - 0天（今天截止）
  warning: '#c41d7f',     // 玫瑰红 - 剩余1/3周期
  caution: '#d48806',     // 烟黄 - 剩余2/3周期
  normal: 'rgba(55, 53, 47, 0.5)'  // 默认灰色
};

/**
 * 根据剩余天数和周期天数获取截止时间颜色
 */
export function getDeadlineColor(remainingDays: number, cycleDays: number, cycleProgress: number): string {
  const startThreshold = cycleProgress < 50 ? cycleDays / 2 : cycleDays / 3;
  if (remainingDays > startThreshold) return DEADLINE_COLORS.normal;
  if (remainingDays <= 0) return DEADLINE_COLORS.urgent;
  if (remainingDays <= startThreshold / 3) return DEADLINE_COLORS.warning;
  if (remainingDays <= (startThreshold * 2) / 3) return DEADLINE_COLORS.caution;
  return DEADLINE_COLORS.normal;
}

/**
 * 获取截止时间文案
 */
export function getDeadlineText(remainingDays: number): string {
  if (remainingDays <= 0) return '今天截止';
  if (remainingDays === 1) return '明天截止';
  return `${remainingDays}天后截止`;
}

// ============ 进度计算函数 ============

/**
 * 计算数值型任务的进度
 */
export function calculateNumericProgress(
  mainlineTask: MainlineTask,
  options?: {
    currentCycleNumber?: number;
    cycleStartValue?: number;
  }): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleStart: number;
  currentCycleTarget: number;
} {
  // 支持新格式（直接传入配置）和旧格式（传入 mainlineTask）
  const numericConfig = (mainlineTask as any).numericConfig;
  const cycleConfig = (mainlineTask as any).cycleConfig || (mainlineTask as any).cycle;
  
  if (!numericConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleStart: 0,
      currentCycleTarget: 0
    };
  }

  const { startValue, targetValue, currentValue, perCycleTarget, originalStartValue } = numericConfig;
  
  // 使用传入的周期编号，否则使用 cycleConfig 中的值
  const currentCycle = options?.currentCycleNumber ?? cycleConfig?.currentCycle ?? 1;
  const cycleStartValue = options?.cycleStartValue;
  
  // 使用原始起始值计算总进度（如果存在）
  const originalStart = originalStartValue ?? startValue;
  
  // 判断目标方向：减少还是增加
  const isDecrease = targetValue < originalStart;

  // 计算总进度 - 根据方向计算有效变化量（基于原始起始值）
  // 减少目标：只有减少的部分才算完成，增加了则为0
  // 增加目标：只有增加的部分才算完成，减少了则为0
  const totalChange = Math.abs(targetValue - originalStart);
  const rawChange = currentValue - originalStart;
  const effectiveChange = isDecrease 
    ? Math.max(0, -rawChange)  // 减少目标：负变化才有效
    : Math.max(0, rawChange);   // 增加目标：正变化才有效
  const totalProgress = totalChange > 0 
    ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) 
    : 0;

  // 计算本周期起始值和目标值
  // 如果提供了 cycleStartValue，使用它；否则基于周期编号计算
  let currentCycleStart: number;
  if (cycleStartValue !== undefined) {
    currentCycleStart = cycleStartValue;
  } else {
    currentCycleStart = startValue + (perCycleTarget * (currentCycle - 1)) * (isDecrease ? -1 : 1);
  }
  const currentCycleTarget = currentCycleStart + perCycleTarget * (isDecrease ? -1 : 1);

  // 计算本周期进度 - 根据方向计算有效变化量
  const rawCycleChange = currentValue - currentCycleStart;
  const effectiveCycleChange = isDecrease 
    ? Math.max(0, -rawCycleChange)  // 减少目标：负变化才有效
    : Math.max(0, rawCycleChange);   // 增加目标：正变化才有效
  const cycleProgress = perCycleTarget > 0 
    ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) 
    : 0;

  return {
    cycleProgress,
    totalProgress,
    currentCycleStart: Math.round(currentCycleStart * 100) / 100,
    currentCycleTarget: Math.round(currentCycleTarget * 100) / 100
  };
}

/**
 * 计算清单型任务的进度
 */
export function calculateChecklistProgress(mainlineTask: MainlineTask): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleCompleted: number;
  currentCycleTarget: number;
} {
  // 支持新格式（直接传入配置）和旧格式（传入 mainlineTask）
  const checklistConfig = (mainlineTask as any).checklistConfig;
  const cycleConfig = (mainlineTask as any).cycleConfig || (mainlineTask as any).cycle;
  
  if (!checklistConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleCompleted: 0,
      currentCycleTarget: 0
    };
  }

  const { completedItems, totalItems, perCycleTarget, items } = checklistConfig;
  const currentCycle = cycleConfig?.currentCycle ?? 1;

  // 计算总进度
  const totalProgress = Math.round((completedItems / totalItems) * 100);

  // 计算本周期完成数量
  const currentCycleCompleted = items.filter(
    item => item.status === 'COMPLETED' && item.cycle === currentCycle
  ).length;

  // 计算本周期进度
  const cycleProgress = Math.min(100, Math.round((currentCycleCompleted / perCycleTarget) * 100));

  return {
    cycleProgress,
    totalProgress,
    currentCycleCompleted,
    currentCycleTarget: perCycleTarget
  };
}

/**
 * 计算打卡型任务的进度
 */
export function calculateCheckInProgress(mainlineTask: MainlineTask): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleCheckIns: number;
  totalCheckIns: number;
} {
  // 支持新格式（直接传入配置）和旧格式（传入 mainlineTask）
  const checkInConfig = (mainlineTask as any).checkInConfig;
  const cycleConfig = (mainlineTask as any).cycleConfig || (mainlineTask as any).cycle;
  
  if (!checkInConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleCheckIns: 0,
      totalCheckIns: 0
    };
  }

  const { perCycleTarget, records } = checkInConfig;
  const currentCycle = cycleConfig?.currentCycle ?? 1;
  const totalCycles = cycleConfig?.totalCycles ?? 1;
  const cycleLengthDays = cycleConfig?.cycleDays ?? cycleConfig?.cycleLengthDays ?? 7;

  // 计算当前周期的日期范围
  const createdAt = (mainlineTask as any).createdAt || (mainlineTask as any).time?.createdAt;
  const startDate = new Date(createdAt || new Date());
  const currentCycleStartDay = (currentCycle - 1) * cycleLengthDays;
  const currentCycleEndDay = currentCycle * cycleLengthDays;

  const currentCycleStartDate = new Date(startDate);
  currentCycleStartDate.setDate(startDate.getDate() + currentCycleStartDay);

  const currentCycleEndDate = new Date(startDate);
  currentCycleEndDate.setDate(startDate.getDate() + currentCycleEndDay);

  // 统计本周期打卡次数
  const currentCycleCheckIns = records?.filter(record => {
    const recordDate = new Date(record.date);
    return record.checked && 
           recordDate >= currentCycleStartDate && 
           recordDate < currentCycleEndDate;
  }).length || 0;

  // 统计总打卡次数
  const totalCheckIns = records?.filter(record => record.checked).length || 0;

  // 计算进度
  const cycleProgress = Math.min(100, Math.round((currentCycleCheckIns / perCycleTarget) * 100));
  const totalTarget = totalCycles * perCycleTarget;
  const totalProgress = Math.round((totalCheckIns / totalTarget) * 100);

  return {
    cycleProgress,
    totalProgress,
    currentCycleCheckIns,
    totalCheckIns
  };
}

/**
 * 计算剩余天数（基于当前周期结束日期和模拟日期）
 * 与详情页的getCurrentCycle逻辑保持一致
 * 优先使用全局测试日期，其次使用任务级别的debugDayOffset
 */
export function calculateRemainingDays(task: Task): number {
  const startDateStr = task.time.startDate;
  const cycleDays = task.cycle.cycleDays;
  const totalCycles = task.cycle.totalCycles;
  
  if (!startDateStr || !cycleDays || !totalCycles) return 0;
  
  const startDate = new Date(startDateStr);
  
  // 优先使用全局测试日期，其次使用任务级别的debugDayOffset
  const currentDate = getCurrentDate();
  const debugOffset = (task as any).debugDayOffset || 0;
  const simulatedToday = new Date(currentDate);
  if (debugOffset !== 0) {
    simulatedToday.setDate(simulatedToday.getDate() + debugOffset);
  }
  simulatedToday.setHours(0, 0, 0, 0);
  
  // 基于模拟日期计算周期编号
  const elapsedDays = Math.floor(
    (simulatedToday.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 考虑cycleSnapshots数量
  const snapshotCount = (task as any).cycleSnapshots?.length || 0;
  
  // 计算基于模拟时间的周期编号
  const calculatedCycleNumber = Math.floor(elapsedDays / cycleDays) + 1;
  
  // 当前周期编号 = max(基于模拟时间的周期, 快照数+1)，但不超过总周期数
  // 如果任务有 cycle.currentCycle，优先使用它
  const currentCycleNumber = task.cycle?.currentCycle || 
    Math.min(Math.max(calculatedCycleNumber, snapshotCount + 1), totalCycles);
  
  // 计算当前周期的结束日期
  const cycleEndDay = currentCycleNumber * cycleDays - 1;
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  currentCycleEnd.setHours(0, 0, 0, 0);
  
  // 计算剩余天数（基于当前周期结束日期和模拟日期）
  return Math.max(0, Math.floor((currentCycleEnd.getTime() - simulatedToday.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * 检查今日是否已打卡
 */
export function isTodayCheckedIn(mainlineTask: MainlineTask): boolean {
  // 支持新旧格式
  const checkInConfig = (mainlineTask as any).checkInConfig;
  
  if (!checkInConfig?.records) return false;
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return checkInConfig.records.some(
    record => record.date === today && record.checked
  );
}

/**
 * 更新主线任务进度
 */
export function updateMainlineTaskProgress(mainlineTask: MainlineTask): MainlineTask {
  let updatedProgress = { ...mainlineTask.progress };

  const mainlineType = (mainlineTask as any).category;
  
  if (mainlineType === 'NUMERIC') {
    const progress = calculateNumericProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      cyclePercentage: progress.cycleProgress,
      cycleStartValue: progress.currentCycleStart,
      cycleTargetValue: progress.currentCycleTarget
    };
  } else if (mainlineType === 'CHECKLIST') {
    const progress = calculateChecklistProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      cyclePercentage: progress.cycleProgress
    };
  } else if (mainlineType === 'CHECK_IN') {
    const progress = calculateCheckInProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      cyclePercentage: progress.cycleProgress
    };
  }

  return {
    ...mainlineTask,
    progress: updatedProgress
  };
}

/**
 * 计算当前周期编号（基于cycleSnapshots）
 * 这个函数与详情页的getCurrentCycle逻辑保持一致
 * 优先使用全局测试日期，其次使用任务级别的debugDayOffset
 */
export function calculateCurrentCycleNumber(task: Task): number {
  // 如果任务有 cycle.currentCycle，优先使用它
  if (task.cycle?.currentCycle) return task.cycle.currentCycle;
  
  const startDateStr = task.time.startDate;
  const cycleDays = task.cycle.cycleDays;
  const totalCycles = task.cycle.totalCycles;
  
  if (!startDateStr || !cycleDays || !totalCycles) {
    return 1;
  }
  
  const startDate = new Date(startDateStr);
  
  // 优先使用全局测试日期，其次使用任务级别的debugDayOffset
  const currentDate = getCurrentDate();
  const debugOffset = (task as any).debugDayOffset || 0;
  const simulatedToday = new Date(currentDate);
  if (debugOffset !== 0) {
    simulatedToday.setDate(simulatedToday.getDate() + debugOffset);
  }
  
  // 基于模拟日期计算周期编号
  const elapsedDays = Math.floor(
    (simulatedToday.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 考虑cycleSnapshots数量
  const snapshotCount = (task as any).cycleSnapshots?.length || 0;
  
  // 计算基于模拟时间的周期编号
  const calculatedCycleNumber = Math.floor(elapsedDays / cycleDays) + 1;
  
  // 当前周期编号 = max(基于模拟时间的周期, 快照数+1)，但不超过总周期数
  return Math.min(Math.max(calculatedCycleNumber, snapshotCount + 1), totalCycles);
}
