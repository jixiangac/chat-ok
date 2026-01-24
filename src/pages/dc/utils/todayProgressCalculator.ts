/**
 * 统一的今日进度计算工具
 * 整合 TaskProvider.calculateTodayProgress 和 checkInStatus.getTodayCheckInStatusForTask
 *
 * 功能：
 * 1. 支持 NUMERIC 类型任务（从 TaskProvider 移植）
 * 2. 支持 TIMES/DURATION/QUANTITY 类型（打卡型任务）
 * 3. 兼容新旧数据格式（从 checkInStatus.ts 移植）
 * 4. 类型安全，同时接受 Task 和 any 类型
 */

import dayjs from 'dayjs';
import type { Task, TodayProgress, CheckInEntry, DailyCheckInRecord } from '../types';
import { getCurrentDate } from './dateTracker';

// ============ 类型定义 ============

export interface TodayProgressOptions {
  /** 可传入模拟日期（用于测试） */
  simulatedToday?: string;
  /** 是否格式化数字精度 */
  formatNumbers?: boolean;
}

export interface TodayProgressResult extends TodayProgress {
  /** 是否可以继续打卡/记录 */
  canCheckIn: boolean;
  /** 今日打卡/记录次数 */
  todayCount: number;
  /** 今日累计值（时长或数量） */
  todayValue: number;
  /** 今日目标是否已完成 */
  isCompleted: boolean;
  /** 今日目标值 */
  dailyTarget?: number;
  /** 最后更新时间 */
  lastUpdatedAt?: string;
}

// ============ 工具函数 ============

/**
 * 数字精度处理函数
 * - 大于等于1000：保留整数
 * - 大于等于100：最多保留1位小数
 * - 小于100：最多保留2位小数
 */
export const formatNumberPrecision = (num: number): number => {
  const absNum = Math.abs(num);
  if (absNum >= 1000) {
    return Math.round(num);
  } else if (absNum >= 100) {
    return Math.round(num * 10) / 10;
  } else {
    return Math.round(num * 100) / 100;
  }
};

/**
 * 获取模拟的"今天"日期
 * 优先使用全局测试日期，其次使用任务级别的 debugDayOffset
 */
export const getSimulatedToday = (task?: Task | any): string => {
  // 优先使用全局测试日期
  const currentDate = getCurrentDate();
  const offset = task ? ((task as any).debugDayOffset || 0) : 0;

  if (offset === 0) {
    return currentDate;
  }

  // 如果有偏移量，在当前日期基础上计算
  return dayjs(currentDate).add(offset, 'day').format('YYYY-MM-DD');
};

/**
 * 从 checkInConfig.records 获取今日打卡记录
 * 兼容新旧数据格式
 */
export const getTodayCheckIns = (
  task: Task | any,
  effectiveToday: string
): CheckInEntry[] => {
  // 新格式：从 checkInConfig.records 获取
  const checkInConfig = task?.checkInConfig || task?.mainlineTask?.checkInConfig;

  if (checkInConfig?.records) {
    const todayRecord = checkInConfig.records.find(
      (r: DailyCheckInRecord) => r.date === effectiveToday
    );
    return todayRecord?.entries || [];
  }

  // 旧格式：从 checkIns 获取
  const checkIns = task?.checkIns || [];
  return checkIns.filter((c: any) => c.date === effectiveToday);
};

// ============ 核心计算函数 ============

/**
 * 计算 NUMERIC 类型任务的今日进度
 */
const calculateNumericTodayProgress = (
  task: Task | any,
  effectiveToday: string,
  options?: TodayProgressOptions
): TodayProgressResult => {
  const numericConfig = task.numericConfig;
  if (!numericConfig) {
    return {
      canCheckIn: false,
      todayCount: 0,
      todayValue: 0,
      isCompleted: false,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  const dailyTarget = formatNumberPrecision(Math.abs(numericConfig.perDayAverage || 0));

  // 计算今日记录的数值变化
  const activities = task.activities || [];
  const todayActivities = activities.filter((a: any) =>
    dayjs(a.date).format('YYYY-MM-DD') === effectiveToday && a.type === 'UPDATE_VALUE'
  );

  // 计算今日数值变化总和（newValue - oldValue）
  const todayValue = todayActivities.reduce((sum: number, a: any) => {
    return sum + ((a.newValue || 0) - (a.oldValue || 0));
  }, 0);

  // 使用绝对值判断是否完成（减少型任务 todayValue 为负数）
  const isCompleted = dailyTarget > 0 && Math.abs(todayValue) >= dailyTarget;

  return {
    canCheckIn: true,
    todayCount: todayActivities.length,
    todayValue: formatNumberPrecision(todayValue),
    isCompleted,
    dailyTarget,
    lastUpdatedAt: dayjs().toISOString()
  };
};

/**
 * 计算 CHECK_IN 类型任务的今日进度
 */
const calculateCheckInTodayProgress = (
  task: Task | any,
  effectiveToday: string,
  todayCheckIns: CheckInEntry[],
  options?: TodayProgressOptions
): TodayProgressResult => {
  const checkInConfig = task?.checkInConfig || task?.mainlineTask?.checkInConfig;

  // 无配置时的默认处理
  if (!checkInConfig) {
    return {
      canCheckIn: todayCheckIns.length === 0,
      todayCount: todayCheckIns.length,
      todayValue: 0,
      isCompleted: todayCheckIns.length > 0,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  const unit = checkInConfig.unit;
  const todayValue = todayCheckIns.reduce((sum: number, c: any) => sum + (c.value || 1), 0);

  // TIMES 类型：按次数打卡
  if (unit === 'TIMES') {
    const dailyMax = checkInConfig.dailyMaxTimes || 1;
    return {
      canCheckIn: todayCheckIns.length < dailyMax,
      todayCount: todayCheckIns.length,
      todayValue: todayCheckIns.length,
      isCompleted: todayCheckIns.length >= dailyMax,
      dailyTarget: dailyMax,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  // DURATION 类型：按时长打卡
  if (unit === 'DURATION') {
    const dailyTarget = formatNumberPrecision(checkInConfig.dailyTargetMinutes || 15);
    return {
      canCheckIn: todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue: formatNumberPrecision(todayValue),
      isCompleted: todayValue >= dailyTarget,
      dailyTarget,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  // QUANTITY 类型：按数量打卡
  if (unit === 'QUANTITY') {
    // 优先使用 dailyTargetValue，如果没有则使用 cycleTargetValue / cycleDays 计算
    let dailyTarget = checkInConfig.dailyTargetValue || 0;

    // 如果没有设置每日目标，但有周期目标，则计算每日平均目标
    if (dailyTarget === 0 && checkInConfig.cycleTargetValue) {
      const cycleDays = task?.cycle?.cycleDays || task?.cycleDays || 7;
      dailyTarget = Math.ceil(checkInConfig.cycleTargetValue / cycleDays);
    }

    dailyTarget = formatNumberPrecision(dailyTarget);
    const formattedTodayValue = formatNumberPrecision(todayValue);

    return {
      canCheckIn: dailyTarget === 0 || todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue: formattedTodayValue,
      isCompleted: dailyTarget > 0 && todayValue >= dailyTarget,
      dailyTarget: dailyTarget > 0 ? dailyTarget : undefined,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  // 默认返回
  return {
    canCheckIn: true,
    todayCount: 0,
    todayValue: 0,
    isCompleted: false,
    lastUpdatedAt: dayjs().toISOString()
  };
};

/**
 * 计算 CHECKLIST 类型任务的今日进度
 * 每日目标 = Math.ceil(周期清单数量 / 周期天数)
 */
const calculateChecklistTodayProgress = (
  task: Task | any,
  effectiveToday: string,
  options?: TodayProgressOptions
): TodayProgressResult => {
  const checklistConfig = task.checklistConfig;
  if (!checklistConfig) {
    return {
      canCheckIn: false,
      todayCount: 0,
      todayValue: 0,
      isCompleted: false,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  const items = checklistConfig.items || [];
  const cycleDays = task.cycle?.cycleDays || 7;
  const currentCycle = task.cycle?.currentCycle || 1;

  // 当前周期的清单项数量
  const cycleItems = items.filter((item: any) => item.cycle === currentCycle);
  const cycleItemCount = cycleItems.length;

  // 计算每日目标：向上取整(周期清单数 / 周期天数)
  const dailyTarget = cycleItemCount > 0 ? Math.ceil(cycleItemCount / cycleDays) : 1;

  // 今日已完成的清单项数量
  const todayCompletedItems = items.filter((item: any) =>
    item.status === 'COMPLETED' &&
    item.completedAt &&
    dayjs(item.completedAt).format('YYYY-MM-DD') === effectiveToday
  );
  const todayValue = todayCompletedItems.length;

  // 是否已完成今日目标
  const isCompleted = todayValue >= dailyTarget;

  return {
    canCheckIn: !isCompleted,
    todayCount: todayValue,
    todayValue,
    isCompleted,
    dailyTarget,
    lastUpdatedAt: dayjs().toISOString()
  };
};

// ============ 主导出函数 ============

/**
 * 统一的今日进度计算函数
 *
 * @param task 任务对象（支持新旧格式）
 * @param options 可选配置
 * @returns 今日进度结果
 *
 * @example
 * // 基本用法
 * const progress = calculateTodayProgress(task);
 *
 * @example
 * // 使用模拟日期
 * const progress = calculateTodayProgress(task, { simulatedToday: '2024-01-15' });
 */
export function calculateTodayProgress(
  task: Task | any,
  options?: TodayProgressOptions
): TodayProgressResult {
  if (!task) {
    return {
      canCheckIn: false,
      todayCount: 0,
      todayValue: 0,
      isCompleted: false,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  // 确定有效的今日日期
  const effectiveToday = options?.simulatedToday || getSimulatedToday(task);

  // 获取今日打卡记录
  const todayCheckIns = getTodayCheckIns(task, effectiveToday);

  // 根据任务分类选择计算方式
  const category = task.category ||
    (task.numericConfig ? 'NUMERIC' :
     task.checklistConfig ? 'CHECKLIST' : 'CHECK_IN');

  // NUMERIC 类型任务：使用 numericConfig.perDayAverage 作为每日目标
  if (category === 'NUMERIC' && task.numericConfig) {
    return calculateNumericTodayProgress(task, effectiveToday, options);
  }

  // CHECKLIST 类型任务：使用 周期清单数/周期天数 作为每日目标
  if (category === 'CHECKLIST' && task.checklistConfig) {
    return calculateChecklistTodayProgress(task, effectiveToday, options);
  }

  // CHECK_IN 类型任务
  return calculateCheckInTodayProgress(task, effectiveToday, todayCheckIns, options);
}

/**
 * 获取今日打卡状态（兼容旧 API）
 * 这是 getTodayCheckInStatusForTask 的替代函数
 *
 * @param taskDetail 任务详情对象
 * @returns 今日打卡状态
 */
export function getTodayCheckInStatusForTask(taskDetail: any): {
  canCheckIn: boolean;
  todayCount: number;
  todayValue: number;
  isCompleted: boolean;
  dailyTarget?: number;
} {
  const result = calculateTodayProgress(taskDetail);
  return {
    canCheckIn: result.canCheckIn,
    todayCount: result.todayCount,
    todayValue: result.todayValue,
    isCompleted: result.isCompleted,
    dailyTarget: result.dailyTarget
  };
}

export default calculateTodayProgress;
