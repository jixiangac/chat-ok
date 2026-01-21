/**
 * checkInHelper.ts 单元测试
 *
 * 测试覆盖：
 * 1. validateCheckIn - 打卡验证逻辑
 * 2. createCheckInEntry - 打卡条目创建
 * 3. updateCheckInRecords - 记录更新
 * 4. calculateStreak - 连续打卡计算
 * 5. calculateCheckInCycleProgress - 周期进度计算
 * 6. detectCycleCompletion - 周期完成检测
 * 7. createCheckInActivity - 活动日志创建
 * 8. getTodayCheckInsFromRecords - 获取今日打卡记录
 * 9. mergeCheckInProgressUpdate - 进度合并
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import dayjs from 'dayjs';
import {
  validateCheckIn,
  createCheckInEntry,
  updateCheckInRecords,
  calculateStreak,
  calculateCheckInCycleProgress,
  detectCycleCompletion,
  createCheckInActivity,
  getTodayCheckInsFromRecords,
  mergeCheckInProgressUpdate,
} from './checkInHelper';

import {
  createCheckInEntry as createEntry,
  createDailyRecord,
  createTimesCheckInConfig,
  createDurationCheckInConfig,
  createQuantityCheckInConfig,
  createCheckInTask,
  createProgressInfo,
  createCycleConfig,
  createTimeInfo,
  generateDateRange,
} from './__tests__/fixtures/taskFixtures';

// ============ validateCheckIn 测试 ============

describe('validateCheckIn', () => {
  describe('无配置时', () => {
    it('首次打卡时允许', () => {
      const result = validateCheckIn(undefined, []);
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('今日已打卡时拒绝', () => {
      const todayCheckIns = [createEntry()];
      const result = validateCheckIn(undefined, todayCheckIns);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('今日已打卡');
    });
  });

  describe('TIMES 类型', () => {
    it('未达到每日上限时允许', () => {
      const config = createTimesCheckInConfig({ dailyMaxTimes: 3 });
      const todayCheckIns = [createEntry(), createEntry()];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true);
    });

    it('达到每日上限时拒绝', () => {
      const config = createTimesCheckInConfig({ dailyMaxTimes: 2 });
      const todayCheckIns = [createEntry(), createEntry()];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('今日已达到打卡上限');
    });

    it('默认每日上限为 1', () => {
      const config = createTimesCheckInConfig({ dailyMaxTimes: undefined });
      const todayCheckIns = [createEntry()];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(false);
    });

    it('空记录时允许打卡', () => {
      const config = createTimesCheckInConfig({ dailyMaxTimes: 1 });
      const result = validateCheckIn(config, []);
      expect(result.allowed).toBe(true);
    });
  });

  describe('DURATION 类型', () => {
    it('未达到每日目标时允许', () => {
      const config = createDurationCheckInConfig({ dailyTargetMinutes: 30 });
      const todayCheckIns = [createEntry({ value: 15 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true);
    });

    it('达到每日目标后仍允许打卡（DURATION 类型特性）', () => {
      const config = createDurationCheckInConfig({ dailyTargetMinutes: 30 });
      const todayCheckIns = [createEntry({ value: 30 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true);
    });

    it('多次打卡累计时长', () => {
      const config = createDurationCheckInConfig({ dailyTargetMinutes: 60 });
      const todayCheckIns = [
        createEntry({ value: 20 }),
        createEntry({ value: 20 }),
        createEntry({ value: 20 }),
      ];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true); // 60分钟后仍允许
    });
  });

  describe('QUANTITY 类型', () => {
    it('未达到每日目标时允许', () => {
      const config = createQuantityCheckInConfig({ dailyTargetValue: 10 });
      const todayCheckIns = [createEntry({ value: 5 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true);
    });

    it('达到每日目标时拒绝', () => {
      const config = createQuantityCheckInConfig({ dailyTargetValue: 10 });
      const todayCheckIns = [createEntry({ value: 10 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('今日已达到数值目标');
    });

    it('超过每日目标时拒绝', () => {
      const config = createQuantityCheckInConfig({ dailyTargetValue: 10 });
      const todayCheckIns = [createEntry({ value: 15 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(false);
    });

    it('目标为 0 时始终允许', () => {
      const config = createQuantityCheckInConfig({ dailyTargetValue: 0 });
      const todayCheckIns = [createEntry({ value: 100 })];
      const result = validateCheckIn(config, todayCheckIns);
      expect(result.allowed).toBe(true);
    });
  });
});

// ============ createCheckInEntry 测试 ============

describe('createCheckInEntry', () => {
  it('创建基本打卡条目', () => {
    const entry = createCheckInEntry();
    expect(entry.id).toMatch(/^checkin_\d+$/);
    expect(entry.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(entry.value).toBeUndefined();
    expect(entry.note).toBeUndefined();
  });

  it('创建带数值的打卡条目', () => {
    const entry = createCheckInEntry(30);
    expect(entry.value).toBe(30);
    expect(entry.note).toBeUndefined();
  });

  it('创建带备注的打卡条目', () => {
    const entry = createCheckInEntry(undefined, '今天状态不错');
    expect(entry.value).toBeUndefined();
    expect(entry.note).toBe('今天状态不错');
  });

  it('创建带数值和备注的打卡条目', () => {
    const entry = createCheckInEntry(45, '高效学习');
    expect(entry.value).toBe(45);
    expect(entry.note).toBe('高效学习');
  });
});

// ============ updateCheckInRecords 测试 ============

describe('updateCheckInRecords', () => {
  const today = '2024-01-15';
  const yesterday = '2024-01-14';

  it('向空记录添加首条记录', () => {
    const entry = createEntry({ value: 10 });
    const result = updateCheckInRecords([], entry, today, 10);

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe(today);
    expect(result[0].checked).toBe(true);
    expect(result[0].entries).toHaveLength(1);
    expect(result[0].totalValue).toBe(10);
  });

  it('向已有记录的日期追加条目', () => {
    const existingRecord = createDailyRecord(today, [createEntry({ value: 5 })]);
    const newEntry = createEntry({ value: 10 });
    const result = updateCheckInRecords([existingRecord], newEntry, today, 10);

    expect(result).toHaveLength(1);
    expect(result[0].entries).toHaveLength(2);
    expect(result[0].totalValue).toBe(15); // 5 + 10
  });

  it('向不同日期添加记录', () => {
    const existingRecord = createDailyRecord(yesterday, [createEntry()]);
    const newEntry = createEntry({ value: 10 });
    const result = updateCheckInRecords([existingRecord], newEntry, today, 10);

    expect(result).toHaveLength(2);
    expect(result.find(r => r.date === today)).toBeDefined();
    expect(result.find(r => r.date === yesterday)).toBeDefined();
  });

  it('无数值时默认累加 1', () => {
    const entry = createEntry();
    const result = updateCheckInRecords([], entry, today);

    expect(result[0].totalValue).toBe(1);
  });
});

// ============ calculateStreak 测试 ============

describe('calculateStreak', () => {
  it('空记录返回 0 连续', () => {
    const result = calculateStreak([], '2024-01-15');
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it('只有今天打卡返回 1 连续', () => {
    const records = [createDailyRecord('2024-01-15', [createEntry()])];
    const result = calculateStreak(records, '2024-01-15');
    expect(result.currentStreak).toBe(1);
  });

  it('连续 3 天打卡返回 3 连续', () => {
    const dates = ['2024-01-13', '2024-01-14', '2024-01-15'];
    const records = dates.map(date => createDailyRecord(date, [createEntry()]));
    const result = calculateStreak(records, '2024-01-15');
    expect(result.currentStreak).toBe(3);
  });

  it('中断后重新计算', () => {
    // 1月12日打卡，1月13日没打卡，1月14、15日打卡
    const records = [
      createDailyRecord('2024-01-12', [createEntry()]),
      createDailyRecord('2024-01-14', [createEntry()]),
      createDailyRecord('2024-01-15', [createEntry()]),
    ];
    const result = calculateStreak(records, '2024-01-15');
    expect(result.currentStreak).toBe(2); // 只计算 14、15 两天
  });

  it('今天未打卡则连续为 0', () => {
    const records = [
      createDailyRecord('2024-01-13', [createEntry()]),
      createDailyRecord('2024-01-14', [createEntry()]),
    ];
    const result = calculateStreak(records, '2024-01-15');
    expect(result.currentStreak).toBe(0);
  });
});

// ============ calculateCheckInCycleProgress 测试 ============

describe('calculateCheckInCycleProgress', () => {
  const baseTask = createCheckInTask({
    time: createTimeInfo({ startDate: '2024-01-01' }),
    cycle: createCycleConfig({
      currentCycle: 1,
      cycleDays: 7,
      totalCycles: 3,
    }),
    checkInConfig: createTimesCheckInConfig({
      unit: 'TIMES',
      perCycleTarget: 7,
    }),
  });

  describe('TIMES 类型', () => {
    it('无记录时进度为 0', () => {
      const task = { ...baseTask, checkInConfig: { ...baseTask.checkInConfig!, records: [] } };
      const result = calculateCheckInCycleProgress(task, []);
      expect(result.cyclePercentage).toBe(0);
      expect(result.totalPercentage).toBe(0);
      expect(result.cycleAchieved).toBe(0);
      expect(result.cycleRemaining).toBe(7);
    });

    it('周期内 3 次打卡 = 43% 进度（3/7）', () => {
      const records = [
        createDailyRecord('2024-01-01', [createEntry()]),
        createDailyRecord('2024-01-02', [createEntry()]),
        createDailyRecord('2024-01-03', [createEntry()]),
      ];
      const result = calculateCheckInCycleProgress(baseTask, records);
      expect(result.cyclePercentage).toBe(43); // Math.round(3/7 * 100)
      expect(result.cycleAchieved).toBe(3);
      expect(result.cycleRemaining).toBe(4);
    });

    it('周期内完成 7 次打卡 = 100% 进度', () => {
      const dates = generateDateRange('2024-01-01', 7);
      const records = dates.map(d => createDailyRecord(d, [createEntry()]));
      const result = calculateCheckInCycleProgress(baseTask, records);
      expect(result.cyclePercentage).toBe(100);
      expect(result.cycleAchieved).toBe(7);
      expect(result.cycleRemaining).toBe(0);
    });

    it('每日多次打卡时正确累计', () => {
      const records = [
        createDailyRecord('2024-01-01', [createEntry(), createEntry()]),
        createDailyRecord('2024-01-02', [createEntry()]),
      ];
      const result = calculateCheckInCycleProgress(baseTask, records);
      expect(result.cycleAchieved).toBe(3); // 2 + 1 = 3 次
    });

    it('周期外记录不计入当前周期', () => {
      // 1月8日开始的第二周期，之前的记录不计入
      const task = {
        ...baseTask,
        cycle: createCycleConfig({
          currentCycle: 2,
          cycleDays: 7,
          totalCycles: 3,
        }),
      };
      const records = [
        createDailyRecord('2024-01-01', [createEntry()]), // 第一周期
        createDailyRecord('2024-01-08', [createEntry()]), // 第二周期
      ];
      const result = calculateCheckInCycleProgress(task, records);
      expect(result.cycleAchieved).toBe(1); // 只计算第二周期的 1 次
    });
  });

  describe('DURATION/QUANTITY 类型', () => {
    it('DURATION 类型按总时长计算', () => {
      const task = {
        ...baseTask,
        checkInConfig: createDurationCheckInConfig({
          unit: 'DURATION',
          perCycleTarget: 210, // 每周期 210 分钟
        }),
      };
      const records = [
        createDailyRecord('2024-01-01', [createEntry({ value: 30 })]),
        createDailyRecord('2024-01-02', [createEntry({ value: 45 })]),
      ];
      const result = calculateCheckInCycleProgress(task, records);
      expect(result.cycleAchieved).toBe(75); // 30 + 45 = 75 分钟
      expect(result.cyclePercentage).toBe(36); // Math.round(75/210 * 100)
    });

    it('QUANTITY 类型按总数量计算', () => {
      const task = {
        ...baseTask,
        checkInConfig: createQuantityCheckInConfig({
          unit: 'QUANTITY',
          perCycleTarget: 100,
        }),
      };
      const records = [
        createDailyRecord('2024-01-01', [createEntry({ value: 20 })], { totalValue: 20 }),
        createDailyRecord('2024-01-02', [createEntry({ value: 30 })], { totalValue: 30 }),
      ];
      const result = calculateCheckInCycleProgress(task, records);
      expect(result.cycleAchieved).toBe(50);
      expect(result.cyclePercentage).toBe(50);
    });
  });

  describe('总进度计算', () => {
    it('跨周期计算总进度', () => {
      // 3 个周期，每周期目标 7 次，总目标 21 次
      const allDates = generateDateRange('2024-01-01', 14); // 2 周的记录
      const records = allDates.map(d => createDailyRecord(d, [createEntry()]));

      // 第二周期任务状态
      const task = {
        ...baseTask,
        cycle: createCycleConfig({
          currentCycle: 2,
          cycleDays: 7,
          totalCycles: 3,
        }),
      };

      const result = calculateCheckInCycleProgress(task, records);
      expect(result.totalPercentage).toBe(67); // 14/21 ≈ 67%
    });
  });
});

// ============ detectCycleCompletion 测试 ============

describe('detectCycleCompletion', () => {
  it('进度从 99% 到 100% 检测为刚完成', () => {
    const result = detectCycleCompletion(99, 100, 1);
    expect(result.cycleJustCompleted).toBe(true);
    expect(result.cycleNumber).toBe(1);
  });

  it('进度从 50% 到 100% 检测为刚完成', () => {
    const result = detectCycleCompletion(50, 100, 2);
    expect(result.cycleJustCompleted).toBe(true);
    expect(result.cycleNumber).toBe(2);
  });

  it('进度已经是 100% 不再触发', () => {
    const result = detectCycleCompletion(100, 100, 1);
    expect(result.cycleJustCompleted).toBe(false);
    expect(result.cycleNumber).toBeUndefined();
  });

  it('进度未达到 100% 不触发', () => {
    const result = detectCycleCompletion(50, 80, 1);
    expect(result.cycleJustCompleted).toBe(false);
    expect(result.cycleNumber).toBeUndefined();
  });
});

// ============ createCheckInActivity 测试 ============

describe('createCheckInActivity', () => {
  it('创建基本活动日志', () => {
    const timestamp = Date.now();
    const activity = createCheckInActivity('2024-01-15', timestamp);

    expect(activity.id).toBeDefined();
    expect(activity.type).toBe('CHECK_IN');
    expect(activity.date).toBe('2024-01-15');
    expect(activity.timestamp).toBe(timestamp);
    expect(activity.count).toBe(1);
    expect(activity.value).toBeUndefined();
    expect(activity.note).toBeUndefined();
  });

  it('创建带数值的活动日志', () => {
    const activity = createCheckInActivity('2024-01-15', Date.now(), 30);
    expect(activity.value).toBe(30);
  });

  it('创建带备注的活动日志', () => {
    const activity = createCheckInActivity('2024-01-15', Date.now(), undefined, '效率很高');
    expect(activity.note).toBe('效率很高');
  });
});

// ============ getTodayCheckInsFromRecords 测试 ============

describe('getTodayCheckInsFromRecords', () => {
  it('无记录返回空数组', () => {
    const task = createCheckInTask({ checkInConfig: createTimesCheckInConfig({ records: [] }) });
    const result = getTodayCheckInsFromRecords(task, '2024-01-15');
    expect(result).toEqual([]);
  });

  it('找到今日记录返回条目', () => {
    const today = '2024-01-15';
    const entries = [createEntry({ value: 10 }), createEntry({ value: 20 })];
    const records = [createDailyRecord(today, entries)];
    const task = createCheckInTask({ checkInConfig: createTimesCheckInConfig({ records }) });

    const result = getTodayCheckInsFromRecords(task, today);
    expect(result).toHaveLength(2);
  });

  it('其他日期记录不返回', () => {
    const yesterday = '2024-01-14';
    const records = [createDailyRecord(yesterday, [createEntry()])];
    const task = createCheckInTask({ checkInConfig: createTimesCheckInConfig({ records }) });

    const result = getTodayCheckInsFromRecords(task, '2024-01-15');
    expect(result).toEqual([]);
  });

  it('无 checkInConfig 返回空数组', () => {
    const task = createCheckInTask({ checkInConfig: undefined });
    const result = getTodayCheckInsFromRecords(task, '2024-01-15');
    expect(result).toEqual([]);
  });
});

// ============ mergeCheckInProgressUpdate 测试 ============

describe('mergeCheckInProgressUpdate', () => {
  it('合并进度更新', () => {
    const existingProgress = createProgressInfo({
      totalPercentage: 50,
      cyclePercentage: 70,
      cycleAchieved: 5,
      cycleRemaining: 2,
    });

    const cycleProgress = {
      cyclePercentage: 85,
      totalPercentage: 60,
      cycleAchieved: 6,
      cycleRemaining: 1,
    };

    const result = mergeCheckInProgressUpdate(existingProgress, cycleProgress);

    expect(result.cyclePercentage).toBe(85);
    expect(result.totalPercentage).toBe(60);
    expect(result.cycleAchieved).toBe(6);
    expect(result.cycleRemaining).toBe(1);
    expect(result.lastUpdatedAt).toBeDefined();
  });

  it('保留其他进度字段', () => {
    const existingProgress = createProgressInfo({
      cycleStartValue: 10,
      cycleTargetValue: 100,
      previousCycleDebt: 5,
    });

    const cycleProgress = {
      cyclePercentage: 50,
      totalPercentage: 25,
      cycleAchieved: 5,
      cycleRemaining: 5,
    };

    const result = mergeCheckInProgressUpdate(existingProgress, cycleProgress);

    expect(result.cycleStartValue).toBe(10);
    expect(result.cycleTargetValue).toBe(100);
    expect(result.previousCycleDebt).toBe(5);
  });
});
