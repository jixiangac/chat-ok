/**
 * 修仙等级体系类型定义
 */

import type { RealmType, StageType, LianqiLayer } from '../constants/cultivation';

// ============ 修仙数据 ============

/** 闭关状态 */
export interface SeclusionState {
  /** 是否在闭关中 */
  active: boolean;
  /** 闭关开始日期 YYYY-MM-DD */
  startDate: string;
  /** 维持目标修为 */
  targetExp: number;
  /** 原境界（闭关失败后降级目标） */
  originalRealm: RealmType;
  /** 原阶段 */
  originalStage: StageType | null;
  /** 原层数（炼气期） */
  originalLayer: LianqiLayer | null;
}

/** 修仙数据 */
export interface CultivationData {
  /** 当前大境界 */
  realm: RealmType;
  /** 当前阶段（筑基期及以上） */
  stage: StageType | null;
  /** 当前层数（炼气期） */
  layer: LianqiLayer | null;
  /** 当前修为值 */
  currentExp: number;
  /** 闭关状态 */
  seclusion: SeclusionState | null;
  /** 累计获得修为 */
  totalExpGained: number;
  /** 突破次数 */
  breakthroughCount: number;
  /** 最后更新时间 */
  lastUpdatedAt: string;
}

// ============ 修为记录 ============

/** 修为变动类型 */
export type CultivationRecordType = 
  | 'CHECK_IN'       // 打卡获得
  | 'CYCLE_REWARD'   // 周期奖励
  | 'CYCLE_PENALTY'  // 周期惩罚
  | 'BREAKTHROUGH'   // 突破消耗
  | 'DONATION';      // 捐赠（预留）

/** 修为变动记录 */
export interface CultivationRecord {
  /** 记录 ID */
  id: string;
  /** 时间戳 */
  timestamp: string;
  /** 变动类型 */
  type: CultivationRecordType;
  /** 变动量（正数为获得，负数为消耗） */
  amount: number;
  /** 关联任务 ID */
  taskId?: string;
  /** 关联任务标题 */
  taskTitle?: string;
  /** 描述 */
  description: string;
  /** 变动前修为 */
  expBefore: number;
  /** 变动后修为 */
  expAfter: number;
  /** 变动前境界 */
  realmBefore: RealmType;
  /** 变动后境界 */
  realmAfter: RealmType;
}

/** 修为历史记录（按周存储） */
export interface CultivationHistory {
  [weekKey: string]: CultivationRecord[];
}

// ============ 境界变动 ============

/** 境界变动类型 */
export type RealmChangeType = 
  | 'BREAKTHROUGH'   // 突破晋升
  | 'DEMOTION'       // 降级
  | 'SECLUSION_START' // 开始闭关
  | 'SECLUSION_END';  // 闭关结束

/** 境界变动记录 */
export interface RealmChangeRecord {
  /** 记录 ID */
  id: string;
  /** 时间戳 */
  timestamp: string;
  /** 变动类型 */
  type: RealmChangeType;
  /** 变动前境界 */
  fromRealm: RealmType;
  /** 变动前阶段 */
  fromStage: StageType | null;
  /** 变动前层数 */
  fromLayer: LianqiLayer | null;
  /** 变动后境界 */
  toRealm: RealmType;
  /** 变动后阶段 */
  toStage: StageType | null;
  /** 变动后层数 */
  toLayer: LianqiLayer | null;
  /** 描述 */
  description: string;
}

// ============ 计算结果 ============

/** 当前等级信息 */
export interface CurrentLevelInfo {
  /** 境界 */
  realm: RealmType;
  /** 阶段 */
  stage: StageType | null;
  /** 层数 */
  layer: LianqiLayer | null;
  /** 显示名称 */
  displayName: string;
  /** 境界颜色 */
  color: string;
  /** 境界浅色 */
  colorLight: string;
  /** 当前修为 */
  currentExp: number;
  /** 当前等级修为上限 */
  expCap: number;
  /** 进度百分比 */
  progress: number;
  /** 是否可以突破 */
  canBreakthrough: boolean;
  /** 是否是最高等级 */
  isMaxLevel: boolean;
  /** 下一等级信息 */
  nextLevel: {
    realm: RealmType;
    stage: StageType | null;
    layer: LianqiLayer | null;
    displayName: string;
  } | null;
}

/** 闭关信息 */
export interface SeclusionInfo {
  /** 是否在闭关中 */
  active: boolean;
  /** 剩余天数 */
  remainingDays: number;
  /** 当前修为 */
  currentExp: number;
  /** 目标修为 */
  targetExp: number;
  /** 进度百分比 */
  progress: number;
  /** 是否已达成目标 */
  isTargetReached: boolean;
  /** 原境界显示名称 */
  originalLevelName: string;
}

// ============ 初始数据 ============

/** 初始修仙数据 */
export const INITIAL_CULTIVATION_DATA: CultivationData = {
  realm: 'LIANQI',
  stage: null,
  layer: 1,
  currentExp: 0,
  seclusion: null,
  totalExpGained: 0,
  breakthroughCount: 0,
  lastUpdatedAt: new Date().toISOString(),
};
