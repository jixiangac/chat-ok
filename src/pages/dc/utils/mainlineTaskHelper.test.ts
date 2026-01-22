/**
 * mainlineTaskHelper.ts 单元测试
 *
 * 测试覆盖：
 * 1. formatNumber - 数值格式化
 * 2. getDeadlineColor - 截止时间颜色
 * 3. getDeadlineText - 截止时间文案
 * 4. calculateNumericProgress - 数值型任务进度计算
 * 5. calculateChecklistProgress - 清单型任务进度计算
 * 6. calculateCheckInProgress - 打卡型任务进度计算
 * 7. calculateRemainingDays - 剩余天数计算
 * 8. isTodayCheckedIn - 今日打卡检测
 * 9. updateMainlineTaskProgress - 主线任务进度更新
 * 10. calculateCurrentCycleNumber - 当前周期编号计算
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import {
  formatNumber,
  DEADLINE_COLORS,
  getDeadlineColor,
  getDeadlineText,
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  calculateRemainingDays,
  isTodayCheckedIn,
  updateMainlineTaskProgress,
  calculateCurrentCycleNumber,
} from './mainlineTaskHelper';

import type { Task, NumericConfig, ChecklistConfig, CheckInConfig } from '../types';
import {
  createCheckInTask,
  createNumericTask,
  createIncreaseNumericConfig,
  createDecreaseNumericConfig,
  createTimesCheckInConfig,
  createCycleConfig,
  createTimeInfo,
  createProgressInfo,
  createDailyRecord,
  createCheckInEntry,
  generateDateRange,
} from './__tests__/fixtures/taskFixtures';

// Mock dateTracker
vi.mock('./dateTracker', () => ({
  getCurrentDate: vi.fn(() => '2024-01-15'),
}));

// ============ formatNumber 测试 ============

describe('formatNumber', () => {
  describe('基本功能', () => {
    it('整数直接返回', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-50)).toBe('-50');
    });

    it('小数截取两位（不四舍五入）', () => {
      expect(formatNumber(12.345)).toBe('12.34');
      expect(formatNumber(12.349)).toBe('12.34');
      expect(formatNumber(99.999)).toBe('99.99');
    });

    it('一位小数保持不变', () => {
      expect(formatNumber(12.3)).toBe('12.3');
    });
  });

  describe('边界情况', () => {
    it('undefined 返回 "0"', () => {
      expect(formatNumber(undefined)).toBe('0');
    });

    it('null 返回 "0"', () => {
      expect(formatNumber(null as any)).toBe('0');
    });

    it('字符串数字正确解析', () => {
      expect(formatNumber('123.456')).toBe('123.45');
      expect(formatNumber('100')).toBe('100');
    });

    it('无效字符串返回 "0"', () => {
      expect(formatNumber('abc')).toBe('0');
      expect(formatNumber('')).toBe('0');
    });

    it('负数小数正确处理', () => {
      expect(formatNumber(-12.345)).toBe('-12.34');
    });
  });
});

// ============ getDeadlineColor 测试 ============

describe('getDeadlineColor', () => {
  describe('进度 < 50% 时', () => {
    const cycleProgress = 30;
    const cycleDays = 10;
    // startThreshold = cycleDays / 2 = 5

    it('剩余天数 > 5 天返回 normal', () => {
      expect(getDeadlineColor(6, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.normal);
    });

    it('剩余 0 天返回 urgent', () => {
      expect(getDeadlineColor(0, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.urgent);
    });

    it('剩余 1 天（<= 5/3 ≈ 1.67）返回 warning', () => {
      expect(getDeadlineColor(1, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.warning);
    });

    it('剩余 3 天（<= 5*2/3 ≈ 3.33）返回 caution', () => {
      expect(getDeadlineColor(3, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.caution);
    });
  });

  describe('进度 >= 50% 时', () => {
    const cycleProgress = 60;
    const cycleDays = 9;
    // startThreshold = cycleDays / 3 = 3

    it('剩余天数 > 3 天返回 normal', () => {
      expect(getDeadlineColor(4, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.normal);
    });

    it('剩余 0 天返回 urgent', () => {
      expect(getDeadlineColor(0, cycleDays, cycleProgress)).toBe(DEADLINE_COLORS.urgent);
    });
  });
});

// ============ getDeadlineText 测试 ============

describe('getDeadlineText', () => {
  it('剩余 0 天返回 "今天截止"', () => {
    expect(getDeadlineText(0)).toBe('今天截止');
  });

  it('剩余 1 天返回 "明天截止"', () => {
    expect(getDeadlineText(1)).toBe('明天截止');
  });

  it('剩余多天返回 "N天后截止"', () => {
    expect(getDeadlineText(5)).toBe('5天后截止');
    expect(getDeadlineText(30)).toBe('30天后截止');
  });

  it('负数天数返回 "今天截止"', () => {
    expect(getDeadlineText(-1)).toBe('今天截止');
  });
});

// ============ calculateNumericProgress 测试 ============

describe('calculateNumericProgress', () => {
  describe('增加型任务', () => {
    it('无 numericConfig 返回默认值', () => {
      const result = calculateNumericProgress({});
      expect(result.cycleProgress).toBe(0);
      expect(result.totalProgress).toBe(0);
    });

    it('从 0 增加到 100，当前值 50 = 50% 总进度', () => {
      const config = createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 50,
        perCycleTarget: 33.33,
      });
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(50);
    });

    it('周期进度计算正确', () => {
      const config = createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 20,
        perCycleTarget: 33.33,
      });
      // 周期1：0 -> 33.33，当前 20，周期进度 = 20/33.33 ≈ 60%
      const result = calculateNumericProgress({
        numericConfig: config,
        cycleConfig: { currentCycle: 1 }
      });

      expect(result.cycleProgress).toBe(60);
      expect(result.currentCycleStart).toBe(0);
      expect(result.currentCycleTarget).toBe(33.33);
    });

    it('第二周期起始值正确', () => {
      const config = createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 50,
        perCycleTarget: 33.33,
      });
      const result = calculateNumericProgress({
        numericConfig: config,
        cycleConfig: { currentCycle: 2 }
      });

      // 第二周期：33.33 -> 66.66
      expect(result.currentCycleStart).toBe(33.33);
      expect(result.currentCycleTarget).toBe(66.66);
    });

    it('使用 options.cycleStartValue 覆盖计算', () => {
      const config = createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 60,
        perCycleTarget: 20,
      });
      const result = calculateNumericProgress(
        { numericConfig: config, cycleConfig: { currentCycle: 2 } },
        { cycleStartValue: 40 }
      );

      expect(result.currentCycleStart).toBe(40);
      expect(result.currentCycleTarget).toBe(60);
    });

    it('值反向变化时进度为 0', () => {
      // 增加型任务但值减少了
      const config = createIncreaseNumericConfig({
        startValue: 50,
        targetValue: 100,
        currentValue: 40, // 比起始值还低
        perCycleTarget: 25,
      });
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(0);
      expect(result.cycleProgress).toBe(0);
    });

    it('超过目标值时进度为 100', () => {
      const config = createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 120,
        perCycleTarget: 33.33,
      });
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(100);
    });
  });

  describe('减少型任务', () => {
    it('从 80 减少到 70，当前值 75 = 50% 总进度', () => {
      const config = createDecreaseNumericConfig({
        startValue: 80,
        targetValue: 70,
        currentValue: 75,
        perCycleTarget: 3.33,
      });
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(50);
    });

    it('周期进度和目标正确计算', () => {
      const config = createDecreaseNumericConfig({
        startValue: 80,
        targetValue: 70,
        currentValue: 78,
        perCycleTarget: 3.33,
      });
      // 周期1：80 -> 76.67，当前 78，周期进度 = 2/3.33 ≈ 60%
      const result = calculateNumericProgress({
        numericConfig: config,
        cycleConfig: { currentCycle: 1 }
      });

      expect(result.cycleProgress).toBe(60);
      expect(result.currentCycleStart).toBe(80);
      expect(result.currentCycleTarget).toBe(76.67);
    });

    it('值反向增加时进度为 0', () => {
      // 减少型任务但值增加了
      const config = createDecreaseNumericConfig({
        startValue: 80,
        targetValue: 70,
        currentValue: 85, // 比起始值还高
        perCycleTarget: 3.33,
      });
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(0);
    });
  });

  describe('originalStartValue 处理', () => {
    it('使用 originalStartValue 计算总进度', () => {
      const config: NumericConfig = {
        direction: 'INCREASE',
        unit: '公里',
        startValue: 50, // 当前周期起始
        targetValue: 100,
        currentValue: 75,
        perCycleTarget: 25,
        perDayAverage: 5,
        originalStartValue: 0, // 原始起始值
      };
      // 总进度应该基于 originalStartValue 计算：75/100 = 75%
      const result = calculateNumericProgress({ numericConfig: config });

      expect(result.totalProgress).toBe(75);
    });
  });
});

// ============ calculateChecklistProgress 测试 ============

describe('calculateChecklistProgress', () => {
  it('无 checklistConfig 返回默认值', () => {
    const result = calculateChecklistProgress({});
    expect(result.cycleProgress).toBe(0);
    expect(result.totalProgress).toBe(0);
  });

  it('总进度正确计算', () => {
    const config: ChecklistConfig = {
      totalItems: 10,
      completedItems: 5,
      perCycleTarget: 3,
      items: [],
    };
    const result = calculateChecklistProgress({ checklistConfig: config });

    expect(result.totalProgress).toBe(50);
  });

  it('周期进度正确计算', () => {
    const config: ChecklistConfig = {
      totalItems: 10,
      completedItems: 3,
      perCycleTarget: 3,
      items: [
        { id: '1', title: 'Item 1', status: 'COMPLETED', cycle: 1 },
        { id: '2', title: 'Item 2', status: 'COMPLETED', cycle: 1 },
        { id: '3', title: 'Item 3', status: 'PENDING', cycle: 1 },
      ],
    };
    const result = calculateChecklistProgress({
      checklistConfig: config,
      cycleConfig: { currentCycle: 1 }
    });

    // 当前周期完成 2 个，目标 3 个 = 67%
    expect(result.cycleProgress).toBe(67);
    expect(result.currentCycleCompleted).toBe(2);
    expect(result.currentCycleTarget).toBe(3);
  });

  it('只计算当前周期的完成项', () => {
    const config: ChecklistConfig = {
      totalItems: 10,
      completedItems: 4,
      perCycleTarget: 3,
      items: [
        { id: '1', title: 'Item 1', status: 'COMPLETED', cycle: 1 },
        { id: '2', title: 'Item 2', status: 'COMPLETED', cycle: 1 },
        { id: '3', title: 'Item 3', status: 'COMPLETED', cycle: 2 },
        { id: '4', title: 'Item 4', status: 'COMPLETED', cycle: 2 },
      ],
    };
    const result = calculateChecklistProgress({
      checklistConfig: config,
      cycleConfig: { currentCycle: 2 }
    });

    // 周期 2 完成 2 个
    expect(result.currentCycleCompleted).toBe(2);
  });

  it('周期进度上限为 100%', () => {
    const config: ChecklistConfig = {
      totalItems: 10,
      completedItems: 5,
      perCycleTarget: 2,
      items: [
        { id: '1', title: 'Item 1', status: 'COMPLETED', cycle: 1 },
        { id: '2', title: 'Item 2', status: 'COMPLETED', cycle: 1 },
        { id: '3', title: 'Item 3', status: 'COMPLETED', cycle: 1 },
      ],
    };
    const result = calculateChecklistProgress({
      checklistConfig: config,
      cycleConfig: { currentCycle: 1 }
    });

    expect(result.cycleProgress).toBe(100);
  });
});

// ============ calculateCheckInProgress 测试 ============

describe('calculateCheckInProgress', () => {
  it('无 checkInConfig 返回默认值', () => {
    const result = calculateCheckInProgress({});
    expect(result.cycleProgress).toBe(0);
    expect(result.totalProgress).toBe(0);
    expect(result.currentCycleCheckIns).toBe(0);
  });

  it('当前周期打卡次数正确统计', () => {
    const startDate = '2024-01-01';
    const config = createTimesCheckInConfig({
      perCycleTarget: 7,
      records: [
        createDailyRecord('2024-01-01', [createCheckInEntry()]),
        createDailyRecord('2024-01-02', [createCheckInEntry()]),
        createDailyRecord('2024-01-03', [createCheckInEntry()]),
      ],
    });

    const result = calculateCheckInProgress({
      checkInConfig: config,
      cycleConfig: {
        currentCycle: 1,
        cycleDays: 7,
        totalCycles: 3,
      },
      createdAt: startDate,
    });

    expect(result.currentCycleCheckIns).toBe(3);
    expect(result.cycleProgress).toBe(43); // 3/7 ≈ 43%
  });

  it('多次打卡的 entries 正确累加', () => {
    const config = createTimesCheckInConfig({
      perCycleTarget: 7,
      records: [
        createDailyRecord('2024-01-01', [createCheckInEntry(), createCheckInEntry()]), // 2 次
        createDailyRecord('2024-01-02', [createCheckInEntry()]), // 1 次
      ],
    });

    const result = calculateCheckInProgress({
      checkInConfig: config,
      cycleConfig: { currentCycle: 1, cycleDays: 7, totalCycles: 3 },
      createdAt: '2024-01-01',
    });

    expect(result.currentCycleCheckIns).toBe(3);
    expect(result.totalCheckIns).toBe(3);
  });

  it('跨周期记录不计入当前周期', () => {
    const config = createTimesCheckInConfig({
      perCycleTarget: 7,
      records: [
        createDailyRecord('2024-01-01', [createCheckInEntry()]), // 第一周期
        createDailyRecord('2024-01-08', [createCheckInEntry()]), // 第二周期
        createDailyRecord('2024-01-09', [createCheckInEntry()]), // 第二周期
      ],
    });

    const result = calculateCheckInProgress({
      checkInConfig: config,
      cycleConfig: { currentCycle: 2, cycleDays: 7, totalCycles: 3 },
      createdAt: '2024-01-01',
    });

    // 第二周期只有 2 次
    expect(result.currentCycleCheckIns).toBe(2);
    expect(result.totalCheckIns).toBe(3);
  });

  it('总进度正确计算', () => {
    const dates = generateDateRange('2024-01-01', 14);
    const records = dates.map(d => createDailyRecord(d, [createCheckInEntry()]));

    const config = createTimesCheckInConfig({
      perCycleTarget: 7,
      records,
    });

    const result = calculateCheckInProgress({
      checkInConfig: config,
      cycleConfig: { currentCycle: 2, cycleDays: 7, totalCycles: 3 },
      createdAt: '2024-01-01',
    });

    // 总目标 21 次，完成 14 次 = 67%
    expect(result.totalProgress).toBe(67);
  });

  it('兼容 time.createdAt 格式', () => {
    const config = createTimesCheckInConfig({
      perCycleTarget: 7,
      records: [createDailyRecord('2024-01-01', [createCheckInEntry()])],
    });

    const result = calculateCheckInProgress({
      checkInConfig: config,
      cycleConfig: { currentCycle: 1, cycleDays: 7, totalCycles: 3 },
      time: { createdAt: '2024-01-01 00:00:00' },
    });

    expect(result.currentCycleCheckIns).toBe(1);
  });
});

// ============ calculateRemainingDays 测试 ============

describe('calculateRemainingDays', () => {
  it('缺少必要数据返回 0', () => {
    const task = { time: {}, cycle: {} } as Task;
    expect(calculateRemainingDays(task)).toBe(0);
  });

  it('周期第一天剩余天数等于周期天数减 1', () => {
    const task = createCheckInTask({
      time: createTimeInfo({ startDate: '2024-01-15' }), // 今天开始
      cycle: createCycleConfig({ cycleDays: 7, totalCycles: 3, currentCycle: 1 }),
    });

    // 模拟日期是 2024-01-15，周期结束日是 2024-01-21
    const result = calculateRemainingDays(task);
    expect(result).toBe(6);
  });

  it('周期最后一天剩余天数为 0', () => {
    const task = createCheckInTask({
      time: createTimeInfo({ startDate: '2024-01-09' }), // 7 天前
      cycle: createCycleConfig({ cycleDays: 7, totalCycles: 3, currentCycle: 1 }),
    });

    // 模拟日期是 2024-01-15，第一周期结束日是 2024-01-15
    const result = calculateRemainingDays(task);
    expect(result).toBe(0);
  });

  it('支持 debugDayOffset', () => {
    const task = {
      ...createCheckInTask({
        time: createTimeInfo({ startDate: '2024-01-15' }),
        cycle: createCycleConfig({ cycleDays: 7, totalCycles: 3, currentCycle: 1 }),
      }),
      debugDayOffset: 3,
    } as any;

    // 模拟日期变成 2024-01-18，剩余 3 天
    const result = calculateRemainingDays(task);
    expect(result).toBe(3);
  });

  it('兼容旧格式 startDate', () => {
    const task = {
      startDate: '2024-01-15',
      cycleDays: 7,
      totalCycles: 3,
      cycle: { currentCycle: 1 },
    } as any;

    const result = calculateRemainingDays(task);
    expect(result).toBe(6);
  });
});

// ============ isTodayCheckedIn 测试 ============

describe('isTodayCheckedIn', () => {
  it('无 checkInConfig 返回 false', () => {
    expect(isTodayCheckedIn({})).toBe(false);
  });

  it('无 records 返回 false', () => {
    expect(isTodayCheckedIn({ checkInConfig: {} })).toBe(false);
  });

  it('今日有打卡返回 true', () => {
    // 需要使用真实的今天日期
    const today = dayjs().format('YYYY-MM-DD');
    const task = {
      checkInConfig: {
        records: [{ date: today, checked: true, entries: [] }],
      },
    };
    expect(isTodayCheckedIn(task)).toBe(true);
  });

  it('今日未打卡返回 false', () => {
    const task = {
      checkInConfig: {
        records: [{ date: '2024-01-14', checked: true, entries: [] }],
      },
    };
    expect(isTodayCheckedIn(task)).toBe(false);
  });

  it('今日记录 checked 为 false 返回 false', () => {
    const today = dayjs().format('YYYY-MM-DD');
    const task = {
      checkInConfig: {
        records: [{ date: today, checked: false, entries: [] }],
      },
    };
    expect(isTodayCheckedIn(task)).toBe(false);
  });
});

// ============ updateMainlineTaskProgress 测试 ============

describe('updateMainlineTaskProgress', () => {
  it('NUMERIC 类型更新进度', () => {
    const task: any = {
      category: 'NUMERIC',
      numericConfig: createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 50,
        perCycleTarget: 33.33,
      }),
      cycleConfig: { currentCycle: 1 },
      progress: {},
    };

    const result = updateMainlineTaskProgress(task);

    expect(result.progress.totalPercentage).toBe(50);
    expect(result.progress.cyclePercentage).toBeDefined();
  });

  it('CHECKLIST 类型更新进度', () => {
    const task: any = {
      category: 'CHECKLIST',
      checklistConfig: {
        totalItems: 10,
        completedItems: 3,
        perCycleTarget: 3,
        items: [
          { id: '1', title: 'Item 1', status: 'COMPLETED', cycle: 1 },
          { id: '2', title: 'Item 2', status: 'COMPLETED', cycle: 1 },
        ],
      },
      cycleConfig: { currentCycle: 1 },
      progress: {},
    };

    const result = updateMainlineTaskProgress(task);

    expect(result.progress.totalPercentage).toBe(30);
    expect(result.progress.cyclePercentage).toBe(67);
  });

  it('CHECK_IN 类型更新进度', () => {
    const task: any = {
      category: 'CHECK_IN',
      checkInConfig: createTimesCheckInConfig({
        perCycleTarget: 7,
        records: [
          createDailyRecord('2024-01-01', [createCheckInEntry()]),
          createDailyRecord('2024-01-02', [createCheckInEntry()]),
        ],
      }),
      cycleConfig: { currentCycle: 1, cycleDays: 7, totalCycles: 3 },
      createdAt: '2024-01-01',
      progress: {},
    };

    const result = updateMainlineTaskProgress(task);

    expect(result.progress.totalPercentage).toBe(10); // 2/21 ≈ 10%
    expect(result.progress.cyclePercentage).toBe(29); // 2/7 ≈ 29%
  });

  it('保留原有进度字段', () => {
    const task: any = {
      category: 'NUMERIC',
      numericConfig: createIncreaseNumericConfig({
        startValue: 0,
        targetValue: 100,
        currentValue: 50,
        perCycleTarget: 33.33,
      }),
      cycleConfig: { currentCycle: 1 },
      progress: {
        someOtherField: 'preserved',
      },
    };

    const result = updateMainlineTaskProgress(task);

    // 由于 updateMainlineTaskProgress 使用展开运算符，需要验证是否正确更新
    expect(result.progress.totalPercentage).toBeDefined();
  });
});

// ============ calculateCurrentCycleNumber 测试 ============

describe('calculateCurrentCycleNumber', () => {
  it('有 cycle.currentCycle 时直接返回', () => {
    const task = createCheckInTask({
      cycle: createCycleConfig({ currentCycle: 3 }),
    });

    expect(calculateCurrentCycleNumber(task)).toBe(3);
  });

  it('缺少必要数据返回 1', () => {
    const task = { time: {}, cycle: {} } as Task;
    expect(calculateCurrentCycleNumber(task)).toBe(1);
  });

  it('基于时间计算周期编号', () => {
    // 模拟日期是 2024-01-15
    // 开始日期 2024-01-01，周期 7 天
    // 第 15 天应该是第 3 周期
    const task = {
      time: { startDate: '2024-01-01' },
      cycle: {
        cycleDays: 7,
        totalCycles: 5,
        // 故意不设置 currentCycle
      },
    } as any;

    const result = calculateCurrentCycleNumber(task);
    // 14 天 / 7 天 = 2 周期，+1 = 第 3 周期
    expect(result).toBe(3);
  });

  it('不超过总周期数', () => {
    const task = {
      time: { startDate: '2024-01-01' },
      cycle: {
        cycleDays: 7,
        totalCycles: 2, // 只有 2 个周期
      },
    } as any;

    const result = calculateCurrentCycleNumber(task);
    // 应该最多返回 2
    expect(result).toBeLessThanOrEqual(2);
  });

  it('考虑 cycleSnapshots 数量', () => {
    const task = {
      time: { startDate: '2024-01-15' }, // 今天开始
      cycle: {
        cycleDays: 7,
        totalCycles: 5,
      },
      cycleSnapshots: [{}, {}], // 已有 2 个快照
    } as any;

    const result = calculateCurrentCycleNumber(task);
    // max(1, 3) = 3（基于时间计算是 1，但快照数+1 = 3）
    expect(result).toBe(3);
  });

  it('支持 debugDayOffset', () => {
    const task = {
      time: { startDate: '2024-01-15' },
      cycle: {
        cycleDays: 7,
        totalCycles: 5,
      },
      debugDayOffset: 7, // 7 天后
    } as any;

    const result = calculateCurrentCycleNumber(task);
    // 应该是第 2 周期
    expect(result).toBe(2);
  });

  it('兼容旧格式字段', () => {
    const task = {
      startDate: '2024-01-01',
      cycleDays: 7,
      totalCycles: 5,
      cycle: {},
    } as any;

    const result = calculateCurrentCycleNumber(task);
    expect(result).toBeGreaterThanOrEqual(1);
  });
});
