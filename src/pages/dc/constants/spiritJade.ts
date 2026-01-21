/**
 * 灵玉系统常量配置
 */

import type { TaskType, CheckInUnit } from '../types';

// ============ 基础值 ============

/** 灵石基础值（每日积分上限） */
export const BASE_POINTS_SPIRIT_JADE = 20;

/** 修为基础值（每日积分上限） */
export const BASE_POINTS_CULTIVATION = 10;

/** 灵玉初始值 */
export const INITIAL_SPIRIT_JADE = 1000;

// ============ 打卡类型系数 ============

/** 打卡类型积分系数 */
export const CHECK_IN_UNIT_MULTIPLIER: Record<CheckInUnit, number> = {
  DURATION: 1.15,   // 时长类 +15%
  TIMES: 1.0,       // 次数类 维持
  QUANTITY: 1.10,   // 数量类 +10%
};

// ============ 任务类型系数 ============

/** 任务类型积分系数 */
export const TASK_TYPE_MULTIPLIER: Record<TaskType, number> = {
  mainline: 2.0,    // 主线任务 +100%
  sidelineA: 1.0,
  sidelineB: 1.0,
};

// ============ 灵玉消耗配置 ============

/** 灵玉消耗配置 */
export const SPIRIT_JADE_COST = {
  /** 创建支线任务 */
  CREATE_SIDELINE_TASK: 200,
  /** 创建主线任务 */
  CREATE_MAINLINE_TASK: 500,
  /** 刷新一日清单 */
  REFRESH_DAILY_VIEW: 25,
} as const;

// ============ 奖励配置 ============

/** 今日必须完成任务加成 */
export const TODAY_MUST_COMPLETE_BONUS = 0.15;  // +15%

/** 周期完成100%额外奖励率 */
export const CYCLE_COMPLETE_BONUS_RATE = 0.10;  // 上限积分 × 10%

/** 一日清单完成奖励配置 */
export const DAILY_VIEW_COMPLETE_REWARD = {
  /** 基础灵石 */
  baseSpiritJade: 10,
  /** 基础修为 */
  baseCultivation: 10,
  /** 任务数量加成阈值 */
  countBonus: [
    { threshold: 10, bonus: 1.25 },  // > 10个任务 +25%
    { threshold: 8, bonus: 1.20 },   // > 8个任务 +20%
    { threshold: 5, bonus: 1.15 },   // > 5个任务 +15%
  ] as const,
} as const;

/** 归档奖励配置 */
export const ARCHIVE_REWARD = {
  /** 总值倍数：每日上限 × 2 */
  multiplier: 2,
  /** 最低完成率阈值 */
  minCompletionRate: 0.3,  // 完成率 < 30% 不分发
} as const;

// ============ Toast 配置 ============

/** 奖励Toast显示时长（毫秒） */
export const REWARD_TOAST_DURATION = {
  /** 单条奖励 */
  single: 2000,
  /** 多条奖励 */
  multiple: 3000,
} as const;

// ============ 来源描述 ============

/** 积分来源描述映射 */
export const POINTS_SOURCE_LABEL: Record<string, string> = {
  CHECK_IN: '任务打卡',
  CYCLE_COMPLETE: '周期完成',
  DAILY_COMPLETE: '一日清单完成',
  ARCHIVE: '归档奖励',
  CREATE_TASK: '创建任务',
  REFRESH_DAILY: '刷新一日清单',
};
