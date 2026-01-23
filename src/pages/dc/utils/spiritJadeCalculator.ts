/**
 * 灵玉积分计算工具函数
 */

import type { TaskType, CheckInUnit } from '../types';
import type { DailyPointsCap, RewardItem } from '../types/spiritJade';
import {
  BASE_POINTS_SPIRIT_JADE,
  BASE_POINTS_CULTIVATION,
  CHECK_IN_UNIT_MULTIPLIER,
  TASK_TYPE_MULTIPLIER,
  TODAY_MUST_COMPLETE_BONUS,
  CYCLE_COMPLETE_BONUS_RATE,
  DAILY_VIEW_COMPLETE_REWARD,
  ARCHIVE_REWARD,
} from '../constants/spiritJade';

/**
 * 计算任务的每日积分上限
 * @param taskType 任务类型
 * @param checkInUnit 打卡类型
 * @returns 每日积分上限 { spiritJade, cultivation }
 */
export function calculateDailyPointsCap(
  taskType: TaskType,
  checkInUnit: CheckInUnit
): DailyPointsCap {
  const unitMultiplier = CHECK_IN_UNIT_MULTIPLIER[checkInUnit] || 1.0;
  const typeMultiplier = TASK_TYPE_MULTIPLIER[taskType] || 1.0;

  return {
    spiritJade: Math.floor(BASE_POINTS_SPIRIT_JADE * unitMultiplier * typeMultiplier),
    cultivation: Math.floor(BASE_POINTS_CULTIVATION * unitMultiplier * typeMultiplier),
  };
}

/** 打卡积分分配结果（包含基础和加成明细） */
export interface CheckInPointsResult {
  /** 基础灵玉 */
  baseSpiritJade: number;
  /** 基础修为 */
  baseCultivation: number;
  /** 必完成任务加成（可选） */
  mustCompleteBonus?: {
    spiritJade: number;
    cultivation: number;
    percentage: number;  // 15
  };
  /** 周期100%完成加成（可选） */
  cycleCompleteBonus?: {
    spiritJade: number;
    cultivation: number;
    percentage: number;  // 10
  };
  /** 最终总计 */
  total: DailyPointsCap;
}

/**
 * 计算打卡积分分配（返回基础和加成明细）
 * @param completionRatio 完成比例 (0-1)
 * @param dailyCap 每日积分上限
 * @param isTodayMustComplete 是否为今日必须完成任务
 * @param isCycleComplete 是否触发周期100%完成
 * @returns 分配的积分明细
 */
export function distributeCheckInPoints(
  completionRatio: number,
  dailyCap: DailyPointsCap,
  isTodayMustComplete: boolean = false,
  isCycleComplete: boolean = false
): CheckInPointsResult {
  // 基础积分：按完成比例分配，向上取整
  const baseSpiritJade = Math.ceil(dailyCap.spiritJade * completionRatio);
  const baseCultivation = Math.ceil(dailyCap.cultivation * completionRatio);

  let totalSpiritJade = baseSpiritJade;
  let totalCultivation = baseCultivation;

  const result: CheckInPointsResult = {
    baseSpiritJade,
    baseCultivation,
    total: { spiritJade: 0, cultivation: 0 },
  };

  // 必完成任务加成 +15%
  if (isTodayMustComplete) {
    const mustBonusSpiritJade = Math.ceil(baseSpiritJade * TODAY_MUST_COMPLETE_BONUS);
    const mustBonusCultivation = Math.ceil(baseCultivation * TODAY_MUST_COMPLETE_BONUS);
    result.mustCompleteBonus = {
      spiritJade: mustBonusSpiritJade,
      cultivation: mustBonusCultivation,
      percentage: Math.round(TODAY_MUST_COMPLETE_BONUS * 100),
    };
    totalSpiritJade += mustBonusSpiritJade;
    totalCultivation += mustBonusCultivation;
  }

  // 周期100%完成加成 +10%
  if (isCycleComplete) {
    const cycleBonusSpiritJade = Math.floor(dailyCap.spiritJade * CYCLE_COMPLETE_BONUS_RATE);
    const cycleBonusCultivation = Math.floor(dailyCap.cultivation * CYCLE_COMPLETE_BONUS_RATE);
    result.cycleCompleteBonus = {
      spiritJade: cycleBonusSpiritJade,
      cultivation: cycleBonusCultivation,
      percentage: Math.round(CYCLE_COMPLETE_BONUS_RATE * 100),
    };
    totalSpiritJade += cycleBonusSpiritJade;
    totalCultivation += cycleBonusCultivation;
  }

  result.total = {
    spiritJade: totalSpiritJade,
    cultivation: totalCultivation,
  };

  return result;
}

/**
 * 计算周期完成100%的额外奖励
 * @param dailyCap 每日积分上限
 * @returns 额外奖励 { spiritJade, cultivation }
 */
export function calculateCycleCompleteBonus(dailyCap: DailyPointsCap): DailyPointsCap {
  return {
    spiritJade: Math.floor(dailyCap.spiritJade * CYCLE_COMPLETE_BONUS_RATE),
    cultivation: Math.floor(dailyCap.cultivation * CYCLE_COMPLETE_BONUS_RATE),
  };
}

/**
 * 计算一日清单完成奖励
 * @param taskCount 清单中的任务数量
 * @returns 奖励 { spiritJade, cultivation }
 */
export function calculateDailyViewCompleteReward(taskCount: number): DailyPointsCap {
  const { baseSpiritJade, baseCultivation, countBonus } = DAILY_VIEW_COMPLETE_REWARD;

  // 找到适用的加成
  let bonus = 1.0;
  for (const item of countBonus) {
    if (taskCount > item.threshold) {
      bonus = item.bonus;
      break;  // countBonus 已按阈值降序排列
    }
  }

  return {
    spiritJade: Math.floor(baseSpiritJade * bonus),
    cultivation: Math.floor(baseCultivation * bonus),
  };
}

/**
 * 计算归档总结奖励
 * @param dailyCap 任务的每日积分上限
 * @param completionRate 总完成率 (0-1)
 * @returns 奖励 { spiritJade, cultivation }，如果完成率低于阈值则返回 { 0, 0 }
 */
export function calculateArchiveReward(
  dailyCap: DailyPointsCap,
  completionRate: number
): DailyPointsCap {
  // 完成率低于阈值不发放
  if (completionRate < ARCHIVE_REWARD.minCompletionRate) {
    return { spiritJade: 0, cultivation: 0 };
  }

  // 总值 = 每日上限 × 2
  const totalSpiritJade = dailyCap.spiritJade * ARCHIVE_REWARD.multiplier;
  const totalCultivation = dailyCap.cultivation * ARCHIVE_REWARD.multiplier;

  // 按完成率分发
  return {
    spiritJade: Math.floor(totalSpiritJade * completionRate),
    cultivation: Math.floor(totalCultivation * completionRate),
  };
}

/**
 * 合并奖励列表，计算总计
 * @param rewards 奖励列表
 * @returns { items: 奖励列表, total: 总计 }
 */
export function mergeRewards(rewards: RewardItem[]): {
  items: RewardItem[];
  total: DailyPointsCap;
} {
  const total: DailyPointsCap = {
    spiritJade: 0,
    cultivation: 0,
  };

  for (const reward of rewards) {
    total.spiritJade += reward.spiritJade;
    total.cultivation += reward.cultivation;
  }

  return { items: rewards, total };
}

/**
 * 获取任务的打卡类型（从 checkInConfig 中提取）
 * @param task 任务对象
 * @returns 打卡类型，默认 TIMES
 */
export function getTaskCheckInUnit(task: { checkInConfig?: { unit?: CheckInUnit } }): CheckInUnit {
  return task.checkInConfig?.unit || 'TIMES';
}

/**
 * 向下取整到指定位数
 * @param value 数值
 * @param place 位数（10=十位，100=百位）
 * @returns 取整后的值
 */
function floorToPlace(value: number, place: number): number {
  return Math.floor(value / place) * place;
}

/**
 * 计算创建任务的灵玉消耗
 * 基于任务完成后可获得的灵玉数量动态计算
 *
 * 计算规则：
 * - 主线任务：完成灵玉 × 0.2，取整到十位，范围 500~1000
 * - 支线任务：完成灵玉 × 0.15，取整到十位，范围 200~500
 *
 * @param totalCompletionReward 100%完成任务可获得的总灵玉
 * @param isMainline 是否为主线任务
 * @returns 创建任务需要消耗的灵玉
 */
export function calculateTaskCreationCost(
  totalCompletionReward: number,
  isMainline: boolean
): number {
  if (isMainline) {
    // 主线任务：× 0.2，取整到十位，范围 500~1000
    const rawCost = totalCompletionReward * 0.2;
    const roundedCost = floorToPlace(rawCost, 10);
    return Math.max(500, Math.min(1000, roundedCost));
  } else {
    // 支线任务：× 0.15，取整到十位，范围 200~500
    const rawCost = totalCompletionReward * 0.15;
    const roundedCost = floorToPlace(rawCost, 10);
    return Math.max(200, Math.min(500, roundedCost));
  }
}

/**
 * 计算任务100%完成可获得的总灵玉
 * @param dailyCap 每日积分上限
 * @param totalDays 总天数
 * @returns 总灵玉数
 */
export function calculateTotalCompletionReward(
  dailyCap: DailyPointsCap,
  totalDays: number
): number {
  return dailyCap.spiritJade * totalDays;
}
