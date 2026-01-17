/**
 * 进度计算工具函数 v2
 * 适配新的 Task 数据结构
 */

import dayjs from 'dayjs';
import type {
  Task,
  Category,
  ProgressInfo,
  NumericConfig,
  ChecklistConfig,
  CheckInConfig,
  CycleConfig,
  ActivityLog,
  ValueUpdateLog,
} from '../types';

// ============ 格式化工具 ============

/**
 * 格式化大数字（如 1000000 -> 100W）
 */
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

/**
 * 千分位格式化
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

/**
 * 智能判断任务分类
 */
export const getEffectiveCategory = (
  numericConfig?: NumericConfig,
  checklistConfig?: ChecklistConfig,
  checkInConfig?: CheckInConfig
): Category => {
  if (numericConfig) return 'NUMERIC';
  if (checklistConfig) return 'CHECKLIST';
  return 'CHECK_IN';
};

// ============ 进度计算结果类型 ============

export interface NumericProgressResult {
  totalProgress: number;
  cycleProgress: number;
  effectiveChange: number;
  cycleAchieved: number;
  cycleRemaining: number;
  cycleTargetValue: number;
  cycleStartValue: number;
}

export interface CheckInProgressResult {
  totalProgress: number;
  cycleProgress: number;
  totalValue: number;
  cycleValue: number;
}

// ============ 核心进度计算类 ============

/**
 * 进度计算器类
 * 计算并返回完整的 ProgressInfo 对象用于存储
 */
export class ProgressCalculator {
  /**
   * 计算任务的完整进度信息
   * @param task 任务对象
   * @returns 更新后的 ProgressInfo
   */
  static calculateProgress(task: Task): ProgressInfo {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    switch (task.category) {
      case 'NUMERIC':
        return this.calculateNumericProgress(task, now);
      case 'CHECKLIST':
        return this.calculateChecklistProgress(task, now);
      case 'CHECK_IN':
        return this.calculateCheckInProgress(task, now);
      default:
        return {
          totalPercentage: 0,
          cyclePercentage: 0,
          cycleStartValue: 0,
          cycleTargetValue: 0,
          cycleAchieved: 0,
          cycleRemaining: 0,
          lastUpdatedAt: now,
        };
    }
  }

  /**
   * 计算数值型任务进度
   */
  private static calculateNumericProgress(task: Task, now: string): ProgressInfo {
    const config = task.numericConfig!;
    const isDecrease = config.direction === 'DECREASE';
    const originalStart = config.originalStartValue ?? config.startValue;
    const totalChange = Math.abs(config.targetValue - originalStart);

    // 总进度
    const rawChange = config.currentValue - originalStart;
    const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
    const totalPercentage = totalChange > 0
      ? Math.min(100, Math.round((effectiveChange / totalChange) * 100))
      : 0;

    // 周期进度
    const perCycleTarget = config.perCycleTarget || (totalChange / task.cycle.totalCycles);
    const cycleStartValue = this.getCycleStartValueFromActivities(task, config);
    
    let cycleTargetValue = isDecrease
      ? cycleStartValue - perCycleTarget
      : cycleStartValue + perCycleTarget;

    // 确保目标值不超过最终目标
    if (isDecrease) {
      cycleTargetValue = Math.max(cycleTargetValue, config.targetValue);
    } else {
      cycleTargetValue = Math.min(cycleTargetValue, config.targetValue);
    }

    const rawCycleChange = config.currentValue - cycleStartValue;
    const cycleAchieved = isDecrease
      ? Math.max(0, -rawCycleChange)
      : Math.max(0, rawCycleChange);

    const cycleRemaining = isDecrease
      ? Math.max(0, config.currentValue - cycleTargetValue)
      : Math.max(0, cycleTargetValue - config.currentValue);

    const cyclePercentage = perCycleTarget > 0
      ? Math.min(Math.round((cycleAchieved / perCycleTarget) * 100), 100)
      : 0;

    return {
      totalPercentage,
      cyclePercentage,
      cycleStartValue: Math.round(cycleStartValue * 10) / 10,
      cycleTargetValue: Math.round(cycleTargetValue * 10) / 10,
      cycleAchieved: Math.round(cycleAchieved * 10) / 10,
      cycleRemaining: Math.round(cycleRemaining * 10) / 10,
      lastUpdatedAt: now,
    };
  }

  /**
   * 计算清单型任务进度
   */
  private static calculateChecklistProgress(task: Task, now: string): ProgressInfo {
    const config = task.checklistConfig!;
    const totalPercentage = config.totalItems > 0
      ? Math.round((config.completedItems / config.totalItems) * 100)
      : 0;

    // 当前周期的清单项
    const cycleItems = config.items.filter(item => item.cycle === task.cycle.currentCycle);
    const cycleCompleted = cycleItems.filter(item => item.status === 'COMPLETED').length;
    const cycleTarget = Math.min(config.perCycleTarget, cycleItems.length);
    const cyclePercentage = cycleTarget > 0
      ? Math.round((cycleCompleted / cycleTarget) * 100)
      : 0;

    return {
      totalPercentage,
      cyclePercentage: Math.min(cyclePercentage, 100),
      cycleStartValue: 0,
      cycleTargetValue: config.perCycleTarget,
      cycleAchieved: cycleCompleted,
      cycleRemaining: Math.max(0, config.perCycleTarget - cycleCompleted),
      lastUpdatedAt: now,
    };
  }

  /**
   * 计算打卡型任务进度
   */
  private static calculateCheckInProgress(task: Task, now: string): ProgressInfo {
    const config = task.checkInConfig!;
    const unit = config.unit || 'TIMES';

    // 获取周期日期范围
    const { cycleStartDate, cycleEndDate } = this.getCycleDateRange(task);

    // 过滤当前周期的记录
    const cycleRecords = config.records.filter(r =>
      r.date >= cycleStartDate && r.date <= cycleEndDate
    );

    let totalValue = 0;
    let cycleValue = 0;
    let perCycleTarget = config.perCycleTarget;

    if (unit === 'TIMES') {
      perCycleTarget = config.cycleTargetTimes || perCycleTarget;
      // 对于1日多次打卡，统计所有 entries 的数量，而不是 records 的数量
      totalValue = config.records
        .filter(r => r.checked)
        .reduce((sum, r) => sum + (r.entries?.length || 1), 0);
      cycleValue = cycleRecords
        .filter(r => r.checked)
        .reduce((sum, r) => sum + (r.entries?.length || 1), 0);
    } else if (unit === 'DURATION') {
      perCycleTarget = config.cycleTargetMinutes || perCycleTarget;
      totalValue = config.records.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      cycleValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
    } else {
      perCycleTarget = config.cycleTargetValue || perCycleTarget;
      totalValue = config.records.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      cycleValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
    }

    const totalRequired = task.cycle.totalCycles * perCycleTarget;
    const totalPercentage = totalRequired > 0
      ? Math.min(100, Math.round((totalValue / totalRequired) * 100))
      : 0;
    const cyclePercentage = perCycleTarget > 0
      ? Math.min(100, Math.round((cycleValue / perCycleTarget) * 100))
      : 0;

    return {
      totalPercentage,
      cyclePercentage,
      cycleStartValue: 0,
      cycleTargetValue: perCycleTarget,
      cycleAchieved: cycleValue,
      cycleRemaining: Math.max(0, perCycleTarget - cycleValue),
      lastUpdatedAt: now,
    };
  }

  /**
   * 从活动日志中获取周期起始值
   */
  private static getCycleStartValueFromActivities(task: Task, config: NumericConfig): number {
    // 查找最近的周期推进日志
    const cycleAdvanceLogs = task.activities
      .filter(a => a.type === 'CYCLE_ADVANCE')
      .sort((a, b) => b.timestamp - a.timestamp);

    if (cycleAdvanceLogs.length > 0 && task.cycle.currentCycle > 1) {
      // 找到周期推进时的数值
      const lastCycleLog = cycleAdvanceLogs[0];
      const valueLogs = task.activities
        .filter((a): a is ValueUpdateLog => 
          a.type === 'UPDATE_VALUE' && a.timestamp <= lastCycleLog.timestamp
        )
        .sort((a, b) => b.timestamp - a.timestamp);

      if (valueLogs.length > 0) {
        return valueLogs[0].newValue;
      }
    }

    return config.startValue;
  }

  /**
   * 获取周期日期范围
   */
  private static getCycleDateRange(task: Task): { cycleStartDate: string; cycleEndDate: string } {
    const startDate = dayjs(task.time.startDate);
    const currentCycle = task.cycle.currentCycle;
    const cycleDays = task.cycle.cycleDays;

    const cycleStartDate = startDate.add((currentCycle - 1) * cycleDays, 'day').format('YYYY-MM-DD');
    const cycleEndDate = startDate.add(currentCycle * cycleDays - 1, 'day').format('YYYY-MM-DD');

    return { cycleStartDate, cycleEndDate };
  }

  /**
   * 获取当前周期信息
   */
  static getCurrentCycleInfo(task: Task): {
    currentCycle: number;
    cycleStartDate: string;
    cycleEndDate: string;
    daysInCycle: number;
    daysRemaining: number;
    isLastCycle: boolean;
  } {
    const startDate = dayjs(task.time.startDate);
    const today = dayjs();
    const daysSinceStart = today.diff(startDate, 'day');
    
    const currentCycle = Math.min(
      Math.floor(daysSinceStart / task.cycle.cycleDays) + 1,
      task.cycle.totalCycles
    );

    const cycleStartDate = startDate.add((currentCycle - 1) * task.cycle.cycleDays, 'day');
    const cycleEndDate = startDate.add(currentCycle * task.cycle.cycleDays - 1, 'day');
    const daysInCycle = today.diff(cycleStartDate, 'day') + 1;
    const daysRemaining = cycleEndDate.diff(today, 'day');

    return {
      currentCycle,
      cycleStartDate: cycleStartDate.format('YYYY-MM-DD'),
      cycleEndDate: cycleEndDate.format('YYYY-MM-DD'),
      daysInCycle: Math.max(0, daysInCycle),
      daysRemaining: Math.max(0, daysRemaining),
      isLastCycle: currentCycle === task.cycle.totalCycles,
    };
  }
}

// ============ 兼容旧版的独立函数 ============

/**
 * 计算数值型进度（兼容旧版）
 */
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
    cycleStartValue: Math.round(cycleStartValue * 10) / 10,
  };
};

/**
 * 计算清单型进度（兼容旧版）
 */
export const calculateChecklistProgress = (config: ChecklistConfig): number => {
  return config.totalItems > 0
    ? Math.round((config.completedItems / config.totalItems) * 100)
    : 0;
};

/**
 * 计算打卡型进度（兼容旧版）
 */
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
    cycleValue,
  };
};

// ============ 导出 ============

export default ProgressCalculator;

// 兼容旧版导出
export { getEffectiveCategory as getEffectiveMainlineType };

