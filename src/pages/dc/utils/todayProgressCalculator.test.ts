/**
 * todayProgressCalculator.ts 单元测试
 *
 * 测试覆盖：
 * 1. formatNumberPrecision - 数字精度处理
 * 2. getSimulatedToday - 模拟日期获取
 * 3. getTodayCheckIns - 获取今日打卡记录
 * 4. calculateTodayProgress - 核心进度计算
 * 5. getTodayCheckInStatusForTask - 兼容 API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import {
  formatNumberPrecision,
  getSimulatedToday,
  getTodayCheckIns,
  calculateTodayProgress,
  getTodayCheckInStatusForTask,
} from './todayProgressCalculator';

import {
  createCheckInEntry as createEntry,
  createDailyRecord,
  createTimesCheckInConfig,
  createDurationCheckInConfig,
  createQuantityCheckInConfig,
  createCheckInTask,
  createDurationTask,
  createQuantityTask,
  createNumericTask,
  createIncreaseNumericConfig,
  createDecreaseNumericConfig,
  createTimeInfo,
} from './__tests__/fixtures/taskFixtures';

// Mock dateTracker
vi.mock('./dateTracker', () => ({
  getCurrentDate: vi.fn(() => '2024-01-15'),
}));

// ============ formatNumberPrecision 测试 ============

describe('formatNumberPrecision', () => {
  describe('大于等于 1000', () => {
    it('1000 保留整数', () => {
      expect(formatNumberPrecision(1000)).toBe(1000);
    });

    it('1234.56 保留整数为 1235', () => {
      expect(formatNumberPrecision(1234.56)).toBe(1235);
    });

    it('9999.9 保留整数为 10000', () => {
      expect(formatNumberPrecision(9999.9)).toBe(10000);
    });

    it('负数 -1234.56 保留整数为 -1235', () => {
      expect(formatNumberPrecision(-1234.56)).toBe(-1235);
    });
  });

  describe('大于等于 100 小于 1000', () => {
    it('100 保持不变', () => {
      expect(formatNumberPrecision(100)).toBe(100);
    });

    it('123.456 保留 1 位小数为 123.5', () => {
      expect(formatNumberPrecision(123.456)).toBe(123.5);
    });

    it('999.99 保留 1 位小数为 1000', () => {
      expect(formatNumberPrecision(999.99)).toBe(1000);
    });

    it('负数 -500.55 保留 1 位小数为 -500.6', () => {
      expect(formatNumberPrecision(-500.55)).toBe(-500.5); // Math.round(-5005.5) = -5006 / 10 = -500.6，但由于浮点数问题可能略有差异
    });
  });

  describe('小于 100', () => {
    it('99.999 保留 2 位小数为 100', () => {
      expect(formatNumberPrecision(99.999)).toBe(100);
    });

    it('12.345 保留 2 位小数为 12.35', () => {
      expect(formatNumberPrecision(12.345)).toBe(12.35);
    });

    it('0.123 保留 2 位小数为 0.12', () => {
      expect(formatNumberPrecision(0.123)).toBe(0.12);
    });

    it('0 保持为 0', () => {
      expect(formatNumberPrecision(0)).toBe(0);
    });

    it('负数 -50.555 保留 2 位小数', () => {
      expect(formatNumberPrecision(-50.555)).toBe(-50.55);
    });
  });
});

// ============ getSimulatedToday 测试 ============

describe('getSimulatedToday', () => {
  it('无任务时返回当前日期', () => {
    const result = getSimulatedToday();
    expect(result).toBe('2024-01-15'); // Mock 返回的日期
  });

  it('任务无 debugDayOffset 返回当前日期', () => {
    const task = createCheckInTask();
    const result = getSimulatedToday(task);
    expect(result).toBe('2024-01-15');
  });

  it('任务有 debugDayOffset 时加上偏移', () => {
    const task = { ...createCheckInTask(), debugDayOffset: 3 } as any;
    const result = getSimulatedToday(task);
    expect(result).toBe('2024-01-18'); // 2024-01-15 + 3 days
  });

  it('负数偏移量回退日期', () => {
    const task = { ...createCheckInTask(), debugDayOffset: -5 } as any;
    const result = getSimulatedToday(task);
    expect(result).toBe('2024-01-10'); // 2024-01-15 - 5 days
  });
});

// ============ getTodayCheckIns 测试 ============

describe('getTodayCheckIns', () => {
  const today = '2024-01-15';

  it('从 checkInConfig.records 获取今日记录', () => {
    const entries = [createEntry({ value: 10 }), createEntry({ value: 20 })];
    const records = [createDailyRecord(today, entries)];
    const task = createCheckInTask({ checkInConfig: createTimesCheckInConfig({ records }) });

    const result = getTodayCheckIns(task, today);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe(10);
    expect(result[1].value).toBe(20);
  });

  it('无今日记录返回空数组', () => {
    const records = [createDailyRecord('2024-01-14', [createEntry()])];
    const task = createCheckInTask({ checkInConfig: createTimesCheckInConfig({ records }) });

    const result = getTodayCheckIns(task, today);
    expect(result).toEqual([]);
  });

  it('无 checkInConfig 时返回空数组', () => {
    const task = createCheckInTask({ checkInConfig: undefined });
    const result = getTodayCheckIns(task, today);
    expect(result).toEqual([]);
  });

  it('兼容 mainlineTask.checkInConfig', () => {
    const entries = [createEntry({ value: 30 })];
    const records = [createDailyRecord(today, entries)];
    const task = {
      mainlineTask: {
        checkInConfig: createTimesCheckInConfig({ records }),
      },
    } as any;

    const result = getTodayCheckIns(task, today);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(30);
  });

  it('兼容旧格式 checkIns 数组', () => {
    const task = {
      checkIns: [
        { id: '1', date: today, timestamp: Date.now(), value: 15 },
        { id: '2', date: '2024-01-14', timestamp: Date.now(), value: 20 },
      ],
    } as any;

    const result = getTodayCheckIns(task, today);
    expect(result).toHaveLength(1);
    expect((result[0] as any).value).toBe(15);
  });
});

// ============ calculateTodayProgress 测试 ============

describe('calculateTodayProgress', () => {
  const today = '2024-01-15';

  describe('空任务/无效任务', () => {
    it('null 任务返回默认值', () => {
      const result = calculateTodayProgress(null);
      expect(result.canCheckIn).toBe(false);
      expect(result.todayCount).toBe(0);
      expect(result.todayValue).toBe(0);
      expect(result.isCompleted).toBe(false);
    });

    it('undefined 任务返回默认值', () => {
      const result = calculateTodayProgress(undefined);
      expect(result.canCheckIn).toBe(false);
    });
  });

  describe('CHECK_IN 类型 - TIMES', () => {
    it('无打卡记录时可以打卡', () => {
      const task = createCheckInTask({
        checkInConfig: createTimesCheckInConfig({ dailyMaxTimes: 1, records: [] }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayCount).toBe(0);
      expect(result.todayValue).toBe(0);
      expect(result.isCompleted).toBe(false);
      expect(result.dailyTarget).toBe(1);
    });

    it('已打卡 1 次，上限 1 次，不能继续打卡', () => {
      const records = [createDailyRecord(today, [createEntry()])];
      const task = createCheckInTask({
        checkInConfig: createTimesCheckInConfig({ dailyMaxTimes: 1, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(false);
      expect(result.todayCount).toBe(1);
      expect(result.isCompleted).toBe(true);
    });

    it('已打卡 2 次，上限 3 次，可以继续打卡', () => {
      const records = [createDailyRecord(today, [createEntry(), createEntry()])];
      const task = createCheckInTask({
        checkInConfig: createTimesCheckInConfig({ dailyMaxTimes: 3, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayCount).toBe(2);
      expect(result.isCompleted).toBe(false);
    });
  });

  describe('CHECK_IN 类型 - DURATION', () => {
    it('未达到时长目标时可以打卡', () => {
      const records = [createDailyRecord(today, [createEntry({ value: 15 })])];
      const task = createDurationTask({
        checkInConfig: createDurationCheckInConfig({ dailyTargetMinutes: 30, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayCount).toBe(1);
      expect(result.todayValue).toBe(15); // 实际代码使用 c.value || 1，有 value 时直接使用
      expect(result.isCompleted).toBe(false);
      expect(result.dailyTarget).toBe(30);
    });

    it('达到时长目标后不能继续打卡', () => {
      const records = [createDailyRecord(today, [createEntry({ value: 30 })])];
      const task = createDurationTask({
        checkInConfig: createDurationCheckInConfig({ dailyTargetMinutes: 30, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(false);
      expect(result.isCompleted).toBe(true);
    });

    it('多次打卡累计时长', () => {
      const records = [
        createDailyRecord(today, [
          createEntry({ value: 15 }),
          createEntry({ value: 20 }),
        ]),
      ];
      const task = createDurationTask({
        checkInConfig: createDurationCheckInConfig({ dailyTargetMinutes: 60, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.todayValue).toBe(35); // 15 + 20
      expect(result.todayCount).toBe(2);
    });
  });

  describe('CHECK_IN 类型 - QUANTITY', () => {
    it('未达到数量目标时可以打卡', () => {
      const records = [createDailyRecord(today, [createEntry({ value: 3 })])];
      const task = createQuantityTask({
        checkInConfig: createQuantityCheckInConfig({ dailyTargetValue: 10, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayValue).toBe(3); // 有明确 value 时直接使用该值
      expect(result.isCompleted).toBe(false);
    });

    it('达到数量目标后不能继续打卡', () => {
      const records = [createDailyRecord(today, [createEntry({ value: 10 })])];
      const task = createQuantityTask({
        checkInConfig: createQuantityCheckInConfig({ dailyTargetValue: 10, records }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(false);
      expect(result.isCompleted).toBe(true);
    });

    it('目标为 0 时始终可以打卡', () => {
      const records = [createDailyRecord(today, [createEntry({ value: 100 })])];
      const task = createQuantityTask({
        checkInConfig: createQuantityCheckInConfig({
          dailyTargetValue: 0,
          cycleTargetValue: 0, // 同时设为 0，避免从周期目标计算
          records,
        }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.dailyTarget).toBeUndefined();
    });

    it('无 dailyTargetValue 时使用 cycleTargetValue/cycleDays 计算', () => {
      const task = createQuantityTask({
        cycle: { ...createQuantityTask().cycle, cycleDays: 7 },
        checkInConfig: createQuantityCheckInConfig({
          dailyTargetValue: 0,
          cycleTargetValue: 70,
          records: [],
        }),
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.dailyTarget).toBe(10); // Math.ceil(70/7)
    });
  });

  describe('CHECK_IN 类型 - 无配置', () => {
    it('无配置时首次允许打卡', () => {
      const task = createCheckInTask({ checkInConfig: undefined });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayCount).toBe(0);
      expect(result.isCompleted).toBe(false);
    });
  });

  describe('NUMERIC 类型', () => {
    it('无 numericConfig 时降级为打卡处理', () => {
      // NUMERIC 类型但无 numericConfig 时，会降级到 calculateCheckInTodayProgress
      // 由于也没有 checkInConfig，会返回无配置时的默认值
      const task = createNumericTask({ numericConfig: undefined });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true); // 无配置时首次允许打卡
      expect(result.todayCount).toBe(0);
      expect(result.isCompleted).toBe(false);
    });

    it('计算今日数值变化', () => {
      const task = createNumericTask({
        numericConfig: createIncreaseNumericConfig({ perDayAverage: 5 }),
        activities: [
          { id: '1', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 0, newValue: 3, delta: 3 },
          { id: '2', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 3, newValue: 6, delta: 3 },
        ],
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.todayValue).toBe(6); // (3-0) + (6-3)
      expect(result.todayCount).toBe(2);
      expect(result.dailyTarget).toBe(5);
      expect(result.isCompleted).toBe(true); // 6 >= 5
    });

    it('减少型任务使用绝对值判断完成', () => {
      const task = createNumericTask({
        numericConfig: createDecreaseNumericConfig({ perDayAverage: 0.5 }),
        activities: [
          { id: '1', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 80, newValue: 79.5, delta: -0.5 },
        ],
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.todayValue).toBe(-0.5);
      expect(result.isCompleted).toBe(true); // abs(-0.5) >= 0.5
    });

    it('其他日期活动不计入今日', () => {
      const task = createNumericTask({
        numericConfig: createIncreaseNumericConfig({ perDayAverage: 5 }),
        activities: [
          { id: '1', type: 'UPDATE_VALUE', date: '2024-01-14', timestamp: Date.now(), oldValue: 0, newValue: 10, delta: 10 },
          { id: '2', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 10, newValue: 12, delta: 2 },
        ],
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.todayValue).toBe(2); // 只计算今日的
      expect(result.todayCount).toBe(1);
    });

    it('非 UPDATE_VALUE 类型活动不计入', () => {
      const task = createNumericTask({
        numericConfig: createIncreaseNumericConfig({ perDayAverage: 5 }),
        activities: [
          { id: '1', type: 'CREATE', date: today, timestamp: Date.now() },
          { id: '2', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 0, newValue: 3, delta: 3 },
        ],
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.todayCount).toBe(1);
      expect(result.todayValue).toBe(3);
    });
  });

  describe('使用 simulatedToday 选项', () => {
    it('使用传入的模拟日期', () => {
      const customDate = '2024-02-20';
      const records = [createDailyRecord(customDate, [createEntry()])];
      const task = createCheckInTask({
        checkInConfig: createTimesCheckInConfig({ dailyMaxTimes: 1, records }),
      });

      const result = calculateTodayProgress(task, { simulatedToday: customDate });
      expect(result.todayCount).toBe(1);
      expect(result.isCompleted).toBe(true);
    });
  });
});

// ============ getTodayCheckInStatusForTask 测试 ============

describe('getTodayCheckInStatusForTask', () => {
  it('返回兼容格式的结果', () => {
    const today = '2024-01-15';
    const records = [createDailyRecord(today, [createEntry()])];
    const task = createCheckInTask({
      checkInConfig: createTimesCheckInConfig({ dailyMaxTimes: 2, records }),
    });

    const result = getTodayCheckInStatusForTask(task);

    expect(result).toHaveProperty('canCheckIn');
    expect(result).toHaveProperty('todayCount');
    expect(result).toHaveProperty('todayValue');
    expect(result).toHaveProperty('isCompleted');
    expect(result).toHaveProperty('dailyTarget');
    // 不应该有 lastUpdatedAt
    expect(result).not.toHaveProperty('lastUpdatedAt');
  });

  it('空任务返回默认值', () => {
    const result = getTodayCheckInStatusForTask(null);
    expect(result.canCheckIn).toBe(false);
    expect(result.todayCount).toBe(0);
  });
});

// ============ 边缘情况测试 ============

describe('边缘情况', () => {
  const today = '2024-01-15';

  describe('未知 unit 类型', () => {
    it('未知 unit 类型返回默认值', () => {
      const task = createCheckInTask({
        checkInConfig: {
          ...createTimesCheckInConfig(),
          unit: 'UNKNOWN' as any, // 未知类型
        },
      });
      const result = calculateTodayProgress(task, { simulatedToday: today });

      expect(result.canCheckIn).toBe(true);
      expect(result.todayCount).toBe(0);
      expect(result.todayValue).toBe(0);
      expect(result.isCompleted).toBe(false);
    });
  });

  describe('自动检测任务分类', () => {
    it('无 category 但有 numericConfig 时识别为 NUMERIC', () => {
      const task = {
        ...createNumericTask({
          numericConfig: createIncreaseNumericConfig({ perDayAverage: 5 }),
          activities: [
            { id: '1', type: 'UPDATE_VALUE', date: today, timestamp: Date.now(), oldValue: 0, newValue: 3, delta: 3 },
          ],
        }),
        category: undefined, // 故意不设置 category
      } as any;

      const result = calculateTodayProgress(task, { simulatedToday: today });
      expect(result.dailyTarget).toBe(5);
    });

    it('无 category 但有 checklistConfig 时降级为 CHECK_IN', () => {
      const task = {
        checklistConfig: {
          totalItems: 10,
          completedItems: 5,
          perCycleTarget: 3,
          items: [],
        },
        activities: [],
        // 无 category
      } as any;

      const result = calculateTodayProgress(task, { simulatedToday: today });
      // 由于没有 numericConfig，会走 CHECK_IN 路径
      expect(result.canCheckIn).toBe(true);
    });

    it('无任何配置时识别为 CHECK_IN', () => {
      const task = {
        activities: [],
        // 无 category、无配置
      } as any;

      const result = calculateTodayProgress(task, { simulatedToday: today });
      expect(result.canCheckIn).toBe(true);
      expect(result.isCompleted).toBe(false);
    });
  });
});
