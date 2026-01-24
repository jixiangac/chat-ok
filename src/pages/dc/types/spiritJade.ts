/**
 * 灵玉系统类型定义
 */

import type { TaskType, CheckInUnit } from '../types';

// ============ 积分来源类型 ============

/** 积分获取来源 */
export type PointsEarnSource = 
  | 'CHECK_IN'           // 任务打卡
  | 'CYCLE_COMPLETE'     // 周期完成100%
  | 'DAILY_COMPLETE'     // 一日清单完成100%
  | 'ARCHIVE';           // 归档总结

/** 积分消耗来源 */
export type PointsSpendSource =
  | 'CREATE_TASK'        // 创建任务
  | 'REFRESH_DAILY'      // 刷新一日清单
  | 'AI_CHAT';           // AI 对话消耗

/** 积分来源（所有） */
export type PointsSource = PointsEarnSource | PointsSpendSource;

// ============ 积分数据结构 ============

/** 灵玉数据 */
export interface SpiritJadeData {
  /** 当前余额 */
  balance: number;
  
  /** 累计获得 */
  totalEarned: number;
  
  /** 累计消耗 */
  totalSpent: number;
  
  /** 最后更新时间 */
  lastUpdatedAt: string;
  
  /** 创建时间 */
  createdAt: string;
}

/** 积分变动记录 */
export interface PointsRecord {
  id: string;
  timestamp: string;
  type: 'EARN' | 'SPEND';
  source: PointsSource;
  spiritJade: number;
  cultivation: number;
  taskId?: string;
  taskTitle?: string;
  description: string;
}

/** 积分历史记录（按周存储） */
export interface PointsHistory {
  [weekKey: string]: PointsRecord[];
}

// ============ 积分计算相关 ============

/** 每日积分上限 */
export interface DailyPointsCap {
  spiritJade: number;
  cultivation: number;
}

/** 奖励项（用于合并显示） */
export interface RewardItem {
  /** 基础灵玉 */
  spiritJade: number;
  /** 基础修为 */
  cultivation: number;
  /** 来源描述，如"任务打卡"、"周期100%完成" */
  source: string;
  /** 等级提升信息（可选） */
  levelUp?: {
    newLevelName: string;
  };
  /** 额外加成信息（可选） */
  bonus?: {
    reason: string;           // 加成原因，如"必完成任务"
    percentage: number;       // 加成比例，如 15 表示 +15%
    spiritJade: number;       // 加成灵玉数量
    cultivation: number;      // 加成修为数量
  };
  /** 今日奖励剩余（可选） */
  todayRemaining?: {
    spiritJade: { earned: number; cap: number };
    cultivation: { earned: number; cap: number };
  };
}

/** 奖励显示配置 */
export interface RewardToastConfig {
  rewards: RewardItem[];
  duration?: number;  // 显示时长，默认2000ms
}

// ============ 积分操作参数 ============

/** 增加积分参数 */
export interface AddPointsParams {
  spiritJade: number;
  cultivation: number;
  source: PointsEarnSource;
  taskId?: string;
  taskTitle?: string;
  description?: string;
}

/** 消耗灵玉参数 */
export interface SpendSpiritJadeParams {
  amount: number;
  source: PointsSpendSource;
  taskId?: string;
  taskTitle?: string;
  description?: string;
}

// ============ 一日清单完成奖励状态 ============

/** 一日清单奖励状态 */
export interface DailyCompleteRewardState {
  date: string;
  rewarded: boolean;
  rewardedAt?: string;
}

// ============ 周期完成奖励状态 ============

/** 周期完成奖励状态（存储在任务中） */
export interface CycleCompleteRewardState {
  /** 已领取奖励的周期编号列表 */
  rewardedCycles: number[];
}
