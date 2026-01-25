/**
 * 打卡辅助函数
 * 从 TaskProvider.checkIn 函数中拆分出来的独立纯函数
 *
 * 功能：
 * 1. 打卡验证
 * 2. 打卡记录创建
 * 3. 更新打卡记录数组
 * 4. 计算连续打卡
 * 5. 计算周期进度
 * 6. 周期完成检测
 */

import dayjs from 'dayjs';
import type {
  Task,
  CheckInConfig,
  CheckInEntry,
  DailyCheckInRecord,
  ProgressInfo,
  CheckInLog
} from '../types';

// ============ 类型定义 ============

export interface CheckInValidationResult {
  /** 是否允许打卡 */
  allowed: boolean;
  /** 不允许打卡的原因 */
  reason?: string;
}

export interface StreakResult {
  /** 当前连续打卡天数 */
  currentStreak: number;
  /** 最长连续打卡天数 */
  longestStreak: number;
}

export interface CheckInCycleProgressResult {
  /** 周期进度百分比 */
  cyclePercentage: number;
  /** 总进度百分比 */
  totalPercentage: number;
  /** 当前周期已完成量 */
  cycleAchieved: number;
  /** 当前周期还需量 */
  cycleRemaining: number;
}

export interface CycleCompletionResult {
  /** 周期是否刚刚完成 */
  cycleJustCompleted: boolean;
  /** 完成的周期编号 */
  cycleNumber?: number;
}

// ============ 工具函数 ============

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============ 核心函数 ============

/**
 * 验证是否可以打卡
 *
 * @param config 打卡配置
 * @param todayCheckIns 今日已有的打卡记录
 * @returns 验证结果
 */
export function validateCheckIn(
  config: CheckInConfig | undefined,
  todayCheckIns: CheckInEntry[]
): CheckInValidationResult {
  if (!config) {
    // 无配置时，允许首次打卡
    return {
      allowed: todayCheckIns.length === 0,
      reason: todayCheckIns.length > 0 ? '今日已打卡' : undefined
    };
  }

  const unit = config.unit;

  if (unit === 'TIMES') {
    const dailyMax = config.dailyMaxTimes || 1;
    if (todayCheckIns.length >= dailyMax) {
      return { allowed: false, reason: '今日已达到打卡上限' };
    }
  } else if (unit === 'DURATION') {
    const dailyTarget = config.dailyTargetMinutes || 15;
    const todayTotal = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
    // DURATION 类型允许超过目标继续打卡
    if (todayTotal >= dailyTarget) {
      // 只是记录日志，不阻止打卡
      console.log('今日已达到时长目标，但仍允许继续打卡');
    }
  } else if (unit === 'QUANTITY') {
    const dailyTarget = config.dailyTargetValue || 0;
    const todayTotal = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
    // QUANTITY 类型允许超过目标继续打卡（与 DURATION 一致）
    if (dailyTarget > 0 && todayTotal >= dailyTarget) {
      console.log('今日已达到数值目标，但仍允许继续打卡');
    }
  }

  return { allowed: true };
}

/**
 * 创建打卡记录条目
 *
 * @param value 打卡数值（可选）
 * @param note 备注（可选）
 * @returns 打卡记录条目
 */
export function createCheckInEntry(value?: number, note?: string): CheckInEntry {
  return {
    id: `checkin_${Date.now()}`,
    time: dayjs().format('HH:mm:ss'),
    value: value,
    note: note || undefined
  };
}

/**
 * 更新打卡记录数组
 *
 * @param records 现有的每日打卡记录数组
 * @param entry 新的打卡记录条目
 * @param date 日期字符串 (YYYY-MM-DD)
 * @param value 打卡数值（可选）
 * @returns 更新后的记录数组
 */
export function updateCheckInRecords(
  records: DailyCheckInRecord[],
  entry: CheckInEntry,
  date: string,
  value?: number
): DailyCheckInRecord[] {
  const newRecords = [...records];
  const todayRecordIndex = newRecords.findIndex(r => r.date === date);

  if (todayRecordIndex >= 0) {
    // 更新今日记录
    const existingEntries = newRecords[todayRecordIndex].entries || [];
    newRecords[todayRecordIndex] = {
      ...newRecords[todayRecordIndex],
      checked: true,
      entries: [...existingEntries, entry],
      totalValue: (newRecords[todayRecordIndex].totalValue || 0) + (value || 1),
    };
  } else {
    // 创建新的今日记录
    newRecords.push({
      date,
      checked: true,
      entries: [entry],
      totalValue: value || 1,
    });
  }

  return newRecords;
}

/**
 * 计算连续打卡天数
 *
 * @param records 每日打卡记录数组
 * @param today 今日日期字符串 (YYYY-MM-DD)
 * @returns 连续打卡统计结果
 */
export function calculateStreak(
  records: DailyCheckInRecord[],
  today: string
): StreakResult {
  const uniqueDates = [...new Set(
    records.filter(r => r.checked).map(r => r.date)
  )].sort();

  let currentStreak = 0;
  let checkDate = dayjs(today);

  while (uniqueDates.includes(checkDate.format('YYYY-MM-DD'))) {
    currentStreak++;
    checkDate = checkDate.subtract(1, 'day');
  }

  // 获取现有的最长连续记录
  const existingLongestStreak = Math.max(
    ...records.map(r => 0), // 默认值
    currentStreak
  );

  return {
    currentStreak,
    longestStreak: Math.max(existingLongestStreak, currentStreak)
  };
}

/**
 * 计算打卡型任务的周期进度
 *
 * @param task 任务对象
 * @param records 更新后的每日打卡记录数组
 * @returns 周期进度结果
 */
export function calculateCheckInCycleProgress(
  task: Task,
  records: DailyCheckInRecord[]
): CheckInCycleProgressResult {
  const { currentCycle, totalCycles, cycleDays } = task.cycle;
  const startDate = dayjs(task.time.startDate);
  const config = task.checkInConfig;
  const perCycleTarget = config?.perCycleTarget || 1;
  const unit = config?.unit || 'TIMES';

  // 计算当前周期的开始和结束日期
  const cycleStartDay = (currentCycle - 1) * cycleDays;
  const cycleEndDay = cycleStartDay + cycleDays - 1;
  const cycleStartDate = startDate.add(cycleStartDay, 'day').format('YYYY-MM-DD');
  const cycleEndDate = startDate.add(cycleEndDay, 'day').format('YYYY-MM-DD');

  // 过滤当前周期的记录
  const cycleRecords = records.filter(r =>
    r.date >= cycleStartDate && r.date <= cycleEndDate && r.checked
  );

  let currentCycleValue: number;
  let totalValue: number;

  if (unit === 'TIMES') {
    // 确保 entries 数组存在，如果不存在则默认计为1次
    currentCycleValue = cycleRecords.reduce((sum, r) => sum + (r.entries?.length || 1), 0);
    totalValue = records.filter(r => r.checked).reduce((sum, r) => sum + (r.entries?.length || 1), 0);
  } else {
    currentCycleValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
    totalValue = records.filter(r => r.checked).reduce((sum, r) => sum + (r.totalValue || 0), 0);
  }

  const cyclePercentage = Math.min(100, Math.round((currentCycleValue / perCycleTarget) * 100));
  const totalTarget = totalCycles * perCycleTarget;
  const totalPercentage = Math.min(100, Math.round((totalValue / totalTarget) * 100));

  // 计算 cycleAchieved 和 cycleRemaining
  const cycleAchieved = currentCycleValue;
  const cycleRemaining = Math.max(0, perCycleTarget - currentCycleValue);

  return {
    cyclePercentage,
    totalPercentage,
    cycleAchieved,
    cycleRemaining
  };
}

/**
 * 检测周期是否刚刚完成
 *
 * @param prevPercentage 之前的周期进度百分比
 * @param newPercentage 新的周期进度百分比
 * @param currentCycle 当前周期编号
 * @returns 周期完成检测结果
 */
export function detectCycleCompletion(
  prevPercentage: number,
  newPercentage: number,
  currentCycle: number
): CycleCompletionResult {
  const cycleJustCompleted = prevPercentage < 100 && newPercentage >= 100;

  return {
    cycleJustCompleted,
    cycleNumber: cycleJustCompleted ? currentCycle : undefined
  };
}

/**
 * 创建打卡活动日志
 *
 * @param date 日期字符串 (YYYY-MM-DD)
 * @param timestamp 时间戳
 * @param value 打卡数值（可选）
 * @param note 备注（可选）
 * @returns 打卡活动日志
 */
export function createCheckInActivity(
  date: string,
  timestamp: number,
  value?: number,
  note?: string
): CheckInLog {
  return {
    id: generateId(),
    type: 'CHECK_IN' as const,
    date,
    timestamp,
    count: 1,
    value,
    note: note || undefined
  };
}

/**
 * 从任务和日期获取今日打卡记录
 *
 * @param task 任务对象
 * @param effectiveToday 有效的今日日期字符串
 * @returns 今日打卡记录数组
 */
export function getTodayCheckInsFromRecords(
  task: Task,
  effectiveToday: string
): CheckInEntry[] {
  const records = task.checkInConfig?.records || [];
  const todayRecord = records.find(r => r.date === effectiveToday);
  return todayRecord?.entries || [];
}

/**
 * 合并打卡更新到 ProgressInfo
 *
 * @param existingProgress 现有的进度信息
 * @param cycleProgress 新计算的周期进度
 * @returns 合并后的完整进度信息
 */
export function mergeCheckInProgressUpdate(
  existingProgress: ProgressInfo,
  cycleProgress: CheckInCycleProgressResult
): ProgressInfo {
  return {
    ...existingProgress,
    cyclePercentage: cycleProgress.cyclePercentage,
    totalPercentage: cycleProgress.totalPercentage,
    cycleAchieved: cycleProgress.cycleAchieved,
    cycleRemaining: cycleProgress.cycleRemaining,
    lastUpdatedAt: dayjs().toISOString()
  };
}
