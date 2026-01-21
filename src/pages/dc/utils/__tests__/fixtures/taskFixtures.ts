/**
 * 测试数据工厂
 * 为打卡功能单元测试提供可复用的测试数据
 */

import type {
  Task,
  CheckInConfig,
  CheckInEntry,
  DailyCheckInRecord,
  CycleConfig,
  TimeInfo,
  ProgressInfo,
  NumericConfig,
} from '../../../types';

// ============ 基础工厂函数 ============

/**
 * 创建 CheckInEntry
 */
export function createCheckInEntry(overrides: Partial<CheckInEntry> = {}): CheckInEntry {
  return {
    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    time: '10:00:00',
    value: undefined,
    note: undefined,
    ...overrides,
  };
}

/**
 * 创建 DailyCheckInRecord
 */
export function createDailyRecord(
  date: string,
  entries: CheckInEntry[] = [],
  overrides: Partial<DailyCheckInRecord> = {}
): DailyCheckInRecord {
  return {
    date,
    checked: entries.length > 0,
    entries,
    totalValue: entries.reduce((sum, e) => sum + (e.value || 1), 0),
    ...overrides,
  };
}

/**
 * 创建 CycleConfig
 */
export function createCycleConfig(overrides: Partial<CycleConfig> = {}): CycleConfig {
  return {
    totalDays: 21,
    cycleDays: 7,
    totalCycles: 3,
    currentCycle: 1,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-07',
    remainingDays: 7,
    ...overrides,
  };
}

/**
 * 创建 TimeInfo
 */
export function createTimeInfo(overrides: Partial<TimeInfo> = {}): TimeInfo {
  return {
    createdAt: '2024-01-01 00:00:00',
    startDate: '2024-01-01',
    endDate: '2024-01-21',
    ...overrides,
  };
}

/**
 * 创建 ProgressInfo
 */
export function createProgressInfo(overrides: Partial<ProgressInfo> = {}): ProgressInfo {
  return {
    totalPercentage: 0,
    cyclePercentage: 0,
    cycleStartValue: 0,
    cycleTargetValue: 7,
    cycleAchieved: 0,
    cycleRemaining: 7,
    lastUpdatedAt: '2024-01-01 00:00:00',
    ...overrides,
  };
}

// ============ CheckInConfig 工厂 ============

/**
 * 创建 TIMES 类型的 CheckInConfig
 */
export function createTimesCheckInConfig(
  overrides: Partial<CheckInConfig> = {}
): CheckInConfig {
  return {
    unit: 'TIMES',
    dailyMaxTimes: 1,
    cycleTargetTimes: 7,
    allowMultiplePerDay: false,
    weekendExempt: false,
    perCycleTarget: 7,
    currentStreak: 0,
    longestStreak: 0,
    checkInRate: 0,
    streaks: [],
    records: [],
    ...overrides,
  };
}

/**
 * 创建 DURATION 类型的 CheckInConfig
 */
export function createDurationCheckInConfig(
  overrides: Partial<CheckInConfig> = {}
): CheckInConfig {
  return {
    unit: 'DURATION',
    dailyTargetMinutes: 30,
    cycleTargetMinutes: 210,
    quickDurations: [15, 30, 45, 60],
    allowMultiplePerDay: true,
    weekendExempt: false,
    perCycleTarget: 210,
    currentStreak: 0,
    longestStreak: 0,
    checkInRate: 0,
    streaks: [],
    records: [],
    ...overrides,
  };
}

/**
 * 创建 QUANTITY 类型的 CheckInConfig
 */
export function createQuantityCheckInConfig(
  overrides: Partial<CheckInConfig> = {}
): CheckInConfig {
  return {
    unit: 'QUANTITY',
    dailyTargetValue: 5,
    cycleTargetValue: 35,
    valueUnit: '个',
    allowMultiplePerDay: true,
    weekendExempt: false,
    perCycleTarget: 35,
    currentStreak: 0,
    longestStreak: 0,
    checkInRate: 0,
    streaks: [],
    records: [],
    ...overrides,
  };
}

// ============ NumericConfig 工厂 ============

/**
 * 创建 NumericConfig（增加型）
 */
export function createIncreaseNumericConfig(
  overrides: Partial<NumericConfig> = {}
): NumericConfig {
  return {
    direction: 'INCREASE',
    unit: '公里',
    startValue: 0,
    targetValue: 100,
    currentValue: 0,
    perCycleTarget: 33.33,
    perDayAverage: 4.76,
    ...overrides,
  };
}

/**
 * 创建 NumericConfig（减少型）
 */
export function createDecreaseNumericConfig(
  overrides: Partial<NumericConfig> = {}
): NumericConfig {
  return {
    direction: 'DECREASE',
    unit: '公斤',
    startValue: 80,
    targetValue: 70,
    currentValue: 80,
    perCycleTarget: 3.33,
    perDayAverage: 0.48,
    ...overrides,
  };
}

// ============ Task 工厂 ============

/**
 * 创建基础 Task（打卡型 TIMES）
 */
export function createCheckInTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `task_${Date.now()}`,
    title: '测试打卡任务',
    type: 'mainline',
    category: 'CHECK_IN',
    status: 'ACTIVE',
    from: 'normal',
    time: createTimeInfo(),
    cycle: createCycleConfig(),
    progress: createProgressInfo(),
    checkInConfig: createTimesCheckInConfig(),
    activities: [],
    ...overrides,
  };
}

/**
 * 创建 DURATION 类型打卡任务
 */
export function createDurationTask(overrides: Partial<Task> = {}): Task {
  return createCheckInTask({
    checkInConfig: createDurationCheckInConfig(),
    ...overrides,
  });
}

/**
 * 创建 QUANTITY 类型打卡任务
 */
export function createQuantityTask(overrides: Partial<Task> = {}): Task {
  return createCheckInTask({
    checkInConfig: createQuantityCheckInConfig(),
    ...overrides,
  });
}

/**
 * 创建 NUMERIC 类型任务
 */
export function createNumericTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `task_${Date.now()}`,
    title: '测试数值任务',
    type: 'mainline',
    category: 'NUMERIC',
    status: 'ACTIVE',
    from: 'normal',
    time: createTimeInfo(),
    cycle: createCycleConfig(),
    progress: createProgressInfo({ cycleTargetValue: 33.33 }),
    numericConfig: createIncreaseNumericConfig(),
    activities: [],
    ...overrides,
  };
}

// ============ 场景工厂 ============

/**
 * 创建带有打卡记录的任务
 */
export function createTaskWithRecords(
  recordDates: string[],
  overrides: Partial<Task> = {}
): Task {
  const records = recordDates.map((date) =>
    createDailyRecord(date, [createCheckInEntry()])
  );

  return createCheckInTask({
    checkInConfig: createTimesCheckInConfig({ records }),
    ...overrides,
  });
}

/**
 * 创建连续打卡场景的任务
 */
export function createStreakTask(
  startDate: string,
  streakDays: number,
  overrides: Partial<Task> = {}
): Task {
  const records: DailyCheckInRecord[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < streakDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    records.push(createDailyRecord(dateStr, [createCheckInEntry()]));
  }

  return createCheckInTask({
    time: createTimeInfo({ startDate }),
    checkInConfig: createTimesCheckInConfig({
      records,
      currentStreak: streakDays,
    }),
    ...overrides,
  });
}

/**
 * 创建今日已有打卡记录的任务
 */
export function createTodayCheckedTask(
  today: string,
  checkInCount: number = 1,
  overrides: Partial<Task> = {}
): Task {
  const entries = Array.from({ length: checkInCount }, (_, i) =>
    createCheckInEntry({ time: `${10 + i}:00:00` })
  );
  const records = [createDailyRecord(today, entries)];

  return createCheckInTask({
    checkInConfig: createTimesCheckInConfig({ records }),
    ...overrides,
  });
}

/**
 * 创建带 DURATION 打卡记录的任务
 */
export function createDurationTaskWithRecords(
  today: string,
  minutesChecked: number,
  overrides: Partial<Task> = {}
): Task {
  const entries = [createCheckInEntry({ value: minutesChecked })];
  const records = [createDailyRecord(today, entries)];

  return createDurationTask({
    checkInConfig: createDurationCheckInConfig({ records }),
    ...overrides,
  });
}

/**
 * 创建带 QUANTITY 打卡记录的任务
 */
export function createQuantityTaskWithRecords(
  today: string,
  quantityChecked: number,
  overrides: Partial<Task> = {}
): Task {
  const entries = [createCheckInEntry({ value: quantityChecked })];
  const records = [createDailyRecord(today, entries)];

  return createQuantityTask({
    checkInConfig: createQuantityCheckInConfig({ records }),
    ...overrides,
  });
}

// ============ 工具函数 ============

/**
 * 生成连续日期数组
 */
export function generateDateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * 获取相对于今天的日期
 */
export function getRelativeDate(daysFromToday: number, baseDate?: string): string {
  const base = baseDate ? new Date(baseDate) : new Date();
  base.setDate(base.getDate() + daysFromToday);
  return base.toISOString().split('T')[0];
}
