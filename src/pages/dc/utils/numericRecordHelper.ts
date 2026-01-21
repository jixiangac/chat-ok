/**
 * 数值记录辅助函数
 * 从 TaskProvider.recordNumericData 函数中拆分出来的独立纯函数
 *
 * 功能：
 * 1. 总进度计算
 * 2. 周期进度计算
 * 3. 补偿目标计算
 * 4. 欠账快照创建
 * 5. 数值更新活动日志创建
 */

import dayjs from 'dayjs';
import type {
  Task,
  NumericConfig,
  ProgressInfo,
  ValueUpdateLog,
  PreviousCycleDebtSnapshot
} from '../types';

// ============ 类型定义 ============

export interface NumericTotalProgressResult {
  /** 总进度百分比 */
  totalPercentage: number;
  /** 有效变化量 */
  effectiveChange: number;
}

export interface NumericCycleProgressResult {
  /** 周期进度百分比 */
  cyclePercentage: number;
  /** 有效周期变化量 */
  effectiveCycleChange: number;
  /** 周期起始值 */
  cycleStartValue: number;
}

export interface CompensationTargetResult {
  /** 补偿目标值 */
  compensationTarget?: number;
  /** 欠款来源周期 */
  compensationFromCycle?: number;
  /** 基于补偿目标的新进度百分比 */
  compensationPercentage?: number;
}

export interface DebtColorScheme {
  bgColor: string;
  progressColor: string;
  borderColor: string;
}

// ============ 配色方案 ============

const DEBT_COLOR_SCHEMES: DebtColorScheme[] = [
  { bgColor: 'rgba(246, 239, 239, 0.6)', progressColor: 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)', borderColor: '#E0CEC6' },
  { bgColor: 'rgba(241, 241, 232, 0.6)', progressColor: 'linear-gradient(90deg, #F1F1E8 0%, #B9C9B9 100%)', borderColor: '#B9C9B9' },
  { bgColor: 'rgba(231, 230, 237, 0.6)', progressColor: 'linear-gradient(90deg, #E7E6ED 0%, #C0BDD1 100%)', borderColor: '#C0BDD1' },
  { bgColor: 'rgba(234, 236, 239, 0.6)', progressColor: 'linear-gradient(90deg, #EAECEF 0%, #B8BCC1 100%)', borderColor: '#B8BCC1' },
];

/**
 * 获取随机配色方案
 */
export const getRandomColorScheme = (): DebtColorScheme => {
  return DEBT_COLOR_SCHEMES[Math.floor(Math.random() * DEBT_COLOR_SCHEMES.length)];
};

// ============ 工具函数 ============

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============ 核心函数 ============

/**
 * 计算数值型任务的总进度
 *
 * @param config 数值型任务配置
 * @param currentValue 当前值
 * @returns 总进度结果
 */
export function calculateNumericTotalProgress(
  config: NumericConfig,
  currentValue: number
): NumericTotalProgressResult {
  const isDecrease = config.direction === 'DECREASE';
  const originalStart = config.originalStartValue ?? config.startValue;
  const totalChange = Math.abs(config.targetValue - originalStart);
  const rawChange = currentValue - originalStart;
  const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
  const totalPercentage = totalChange > 0
    ? Math.min(100, Math.round((effectiveChange / totalChange) * 100))
    : 0;

  return {
    totalPercentage,
    effectiveChange
  };
}

/**
 * 计算数值型任务的周期进度
 *
 * @param config 数值型任务配置
 * @param progress 当前进度信息
 * @param currentValue 当前值
 * @param perCycleTarget 每周期目标量
 * @returns 周期进度结果
 */
export function calculateNumericCycleProgress(
  config: NumericConfig,
  progress: ProgressInfo,
  currentValue: number,
  perCycleTarget: number
): NumericCycleProgressResult {
  const isDecrease = config.direction === 'DECREASE';

  // 从 progress 中获取周期起始值
  const cycleStartValueRaw = progress.cycleStartValue ?? config.startValue;
  const cycleStartValue = typeof cycleStartValueRaw === 'number'
    ? cycleStartValueRaw
    : config.startValue;

  // 检查是否已有补偿目标值
  const existingCompensationTarget = progress.compensationTargetValue;

  let cyclePercentage: number;
  let effectiveCycleChange: number;

  if (existingCompensationTarget !== undefined) {
    // 使用补偿目标值计算进度
    const compensationTotal = isDecrease
      ? cycleStartValue - existingCompensationTarget
      : existingCompensationTarget - cycleStartValue;
    const compensationChange = isDecrease
      ? cycleStartValue - currentValue
      : currentValue - cycleStartValue;
    effectiveCycleChange = Math.max(0, compensationChange);
    cyclePercentage = compensationTotal > 0
      ? Math.max(0, Math.min(100, Math.round((compensationChange / compensationTotal) * 100)))
      : 0;
  } else {
    // 使用原周期目标计算进度
    const rawCycleChange = currentValue - cycleStartValue;
    effectiveCycleChange = isDecrease ? Math.max(0, -rawCycleChange) : Math.max(0, rawCycleChange);
    cyclePercentage = perCycleTarget > 0
      ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100))
      : 0;
  }

  return {
    cyclePercentage,
    effectiveCycleChange,
    cycleStartValue
  };
}

/**
 * 计算补偿目标
 * 当周期进度达到100%且在前50%时间内时，检查是否需要设置补偿目标
 *
 * @param config 数值型任务配置
 * @param currentValue 当前值
 * @param currentCycle 当前周期编号
 * @param perCycleTarget 每周期目标量
 * @param progress 当前进度信息
 * @returns 补偿目标结果
 */
export function calculateCompensationTarget(
  config: NumericConfig,
  currentValue: number,
  currentCycle: number,
  perCycleTarget: number,
  progress: ProgressInfo
): CompensationTargetResult {
  const isDecrease = config.direction === 'DECREASE';
  const originalStart = config.originalStartValue ?? config.startValue;

  // 获取周期起始值
  const cycleStartValueRaw = progress.cycleStartValue ?? config.startValue;
  const cycleStartValue = typeof cycleStartValueRaw === 'number'
    ? cycleStartValueRaw
    : config.startValue;

  let compensationTarget: number | undefined;
  let compensationFromCycle: number | undefined;

  // 从当前周期开始往前检查，最多检查3个周期
  const startCycle = currentCycle;
  const endCycle = Math.max(1, currentCycle - 2); // 往前最多2个，总共3个周期

  for (let i = startCycle; i >= endCycle; i--) {
    // 计算第i个周期的计划目标值
    const cycleTargetForI = isDecrease
      ? originalStart - (perCycleTarget * i)
      : originalStart + (perCycleTarget * i);

    // 检查当前值是否达到这个周期的目标
    let hasReached = false;
    if (isDecrease) {
      hasReached = currentValue <= cycleTargetForI;
    } else {
      hasReached = currentValue >= cycleTargetForI;
    }

    if (!hasReached) {
      // 找到未达标的周期目标（从当前往前找，取最早未达标的）
      compensationTarget = cycleTargetForI;
      compensationFromCycle = i;
      // 继续往前找，取最早未达标的
    }
  }

  if (compensationTarget === undefined) {
    return {};
  }

  // 补偿目标不能超过最终目标值
  if (isDecrease) {
    compensationTarget = Math.max(compensationTarget, config.targetValue);
  } else {
    compensationTarget = Math.min(compensationTarget, config.targetValue);
  }

  // 重新计算基于补偿目标的进度
  const compensationChange = isDecrease
    ? cycleStartValue - currentValue
    : currentValue - cycleStartValue;
  const compensationTotal = isDecrease
    ? cycleStartValue - compensationTarget
    : compensationTarget - cycleStartValue;
  const compensationPercentage = compensationTotal > 0
    ? Math.max(0, Math.min(100, Math.round((compensationChange / compensationTotal) * 100)))
    : 0;

  return {
    compensationTarget,
    compensationFromCycle,
    compensationPercentage
  };
}

/**
 * 创建欠账快照
 *
 * @param currentCycle 当前周期编号
 * @param compensationTarget 补偿目标值
 * @param compensationFromCycle 欠款来源周期
 * @param originalStart 原始起始值
 * @param currentValue 当前值
 * @param compensationPercentage 补偿进度百分比
 * @returns 欠账快照对象
 */
export function createDebtSnapshot(
  currentCycle: number,
  compensationTarget: number,
  compensationFromCycle: number,
  originalStart: number,
  currentValue: number,
  compensationPercentage: number
): PreviousCycleDebtSnapshot {
  const colorScheme = getRandomColorScheme();

  return {
    currentCycleNumber: currentCycle,
    targetValue: compensationTarget,
    bgColor: colorScheme.bgColor,
    progressColor: colorScheme.progressColor,
    borderColor: colorScheme.borderColor,
    debtCycleSnapshot: {
      cycleNumber: compensationFromCycle,
      startValue: originalStart,
      targetValue: compensationTarget,
      actualValue: currentValue,
      completionRate: compensationPercentage,
    }
  };
}

/**
 * 创建数值更新活动日志
 *
 * @param previousValue 旧值
 * @param newValue 新值
 * @param date 日期字符串 (YYYY-MM-DD)
 * @param timestamp 时间戳
 * @param note 备注（可选）
 * @returns 数值更新活动日志
 */
export function createValueUpdateActivity(
  previousValue: number,
  newValue: number,
  date: string,
  timestamp: number,
  note?: string
): ValueUpdateLog {
  return {
    id: generateId(),
    type: 'UPDATE_VALUE' as const,
    date,
    timestamp,
    oldValue: previousValue,
    newValue,
    delta: newValue - previousValue,
    note: note || undefined
  };
}

/**
 * 计算原始周期目标值（不受补偿目标影响）
 *
 * @param config 数值型任务配置
 * @param cycleStartValue 周期起始值
 * @param perCycleTarget 每周期目标量
 * @returns 原始周期目标值
 */
export function calculateOriginalCycleTargetValue(
  config: NumericConfig,
  cycleStartValue: number,
  perCycleTarget: number
): number {
  const isDecrease = config.direction === 'DECREASE';

  let originalCycleTargetValue = cycleStartValue + perCycleTarget * (isDecrease ? -1 : 1);

  // 确保周期目标值不超过最终目标值
  if (isDecrease) {
    originalCycleTargetValue = Math.max(originalCycleTargetValue, config.targetValue);
  } else {
    originalCycleTargetValue = Math.min(originalCycleTargetValue, config.targetValue);
  }

  return originalCycleTargetValue;
}

/**
 * 检查是否已达成最终目标
 *
 * @param config 数值型任务配置
 * @param currentValue 当前值
 * @returns 是否已达成最终目标
 */
export function hasReachedFinalTarget(
  config: NumericConfig,
  currentValue: number
): boolean {
  const isDecrease = config.direction === 'DECREASE';
  return isDecrease
    ? currentValue <= config.targetValue
    : currentValue >= config.targetValue;
}

/**
 * 计算当前周期已过天数和是否在前半段
 *
 * @param task 任务对象
 * @param simulatedTodayDate 模拟的今日日期对象
 * @returns 周期时间信息
 */
export function calculateCycleTimeInfo(
  task: Task,
  simulatedTodayDate: dayjs.Dayjs
): { daysInCurrentCycle: number; isInFirstHalf: boolean } {
  const currentCycle = task.cycle.currentCycle;
  const cycleDays = task.cycle.cycleDays;
  const startDate = dayjs(task.time.startDate);

  // 计算当前周期的开始日期和已过天数
  const cycleStartDay = (currentCycle - 1) * cycleDays;
  const currentCycleStart = startDate.add(cycleStartDay, 'day');
  const daysInCurrentCycle = simulatedTodayDate.diff(currentCycleStart, 'day');
  const isInFirstHalf = daysInCurrentCycle < cycleDays / 2;

  return { daysInCurrentCycle, isInFirstHalf };
}

/**
 * 处理旧版欠账快照逻辑（兼容性）
 *
 * @param task 任务对象
 * @param cyclePercentage 周期进度百分比
 * @param currentValue 当前值
 * @param daysInCurrentCycle 当前周期已过天数
 * @param cycleDays 周期天数
 * @returns 欠账快照或 undefined
 */
export function handleLegacyDebtSnapshot(
  task: Task,
  cyclePercentage: number,
  currentValue: number,
  daysInCurrentCycle: number,
  cycleDays: number
): PreviousCycleDebtSnapshot | undefined {
  const config = task.numericConfig;
  if (!config) return undefined;

  const isDecrease = config.direction === 'DECREASE';
  const cycleSnapshots = (task as any).cycleSnapshots || [];

  if (cycleSnapshots.length === 0 || cyclePercentage < 100) {
    return undefined;
  }

  const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
  if (lastSnapshot.completionRate === undefined || lastSnapshot.completionRate >= 100) {
    return undefined;
  }

  const previousCycleTarget = lastSnapshot.targetValue;
  let reachedLastTarget = false;
  if (isDecrease) {
    reachedLastTarget = currentValue <= previousCycleTarget;
  } else {
    reachedLastTarget = currentValue >= previousCycleTarget;
  }

  if (reachedLastTarget) {
    return undefined;
  }

  const remainingDays = Math.max(0, cycleDays - daysInCurrentCycle);

  if (remainingDays <= cycleDays / 2 || task.previousCycleDebtSnapshot) {
    return undefined;
  }

  const cycleStartValueRaw = task.progress.cycleStartValue;
  const cycleStartValue = typeof cycleStartValueRaw === 'number'
    ? cycleStartValueRaw
    : config.startValue;

  const colorScheme = getRandomColorScheme();
  return {
    currentCycleNumber: task.cycle.currentCycle,
    targetValue: previousCycleTarget,
    bgColor: colorScheme.bgColor,
    progressColor: colorScheme.progressColor,
    borderColor: colorScheme.borderColor,
    debtCycleSnapshot: {
      cycleNumber: lastSnapshot.cycleNumber,
      startValue: cycleStartValue,
      targetValue: previousCycleTarget,
      actualValue: lastSnapshot.actualValue,
      completionRate: lastSnapshot.completionRate,
    }
  };
}
