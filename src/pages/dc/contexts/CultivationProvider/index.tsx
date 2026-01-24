/**
 * CultivationProvider - 修仙等级体系状态管理
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo, 
  useEffect,
  useRef,
  type ReactNode 
} from 'react';
import type { CultivationData, CultivationRecord, CultivationHistory } from '../../types/cultivation';
import type { SpiritJadeData, PointsHistory, PointsRecord, RewardItem, AddPointsParams, SpendSpiritJadeParams } from '../../types/spiritJade';
import type { TaskType, CheckInUnit } from '../../types';
import { INITIAL_CULTIVATION_DATA } from '../../types/cultivation';
import { 
  TASK_EXP_CONFIG, 
  CYCLE_REWARD_CONFIG, 
  PENALTY_CONFIG,
  getExpCap,
} from '../../constants/cultivation';
import { 
  getCurrentLevelInfo, 
  getSeclusionInfo, 
  getNextLevel,
  getPreviousLevel,
  isCrossRealmDemotion,
  getLevelDisplayName,
  generateCultivationId,
  getWeekKey,
  getCultivationImageFromData,
} from '../../utils/cultivation';
import {
  loadCultivationData,
  saveCultivationData,
  loadCultivationHistory,
  saveCultivationHistory,
  clearCultivationData,
  exportCultivationData,
  importCultivationData,
  loadSpiritJadeData,
  saveSpiritJadeData,
  loadPointsHistory,
  savePointsHistory,
  clearSpiritJadeData,
  INITIAL_SPIRIT_JADE_DATA,
} from './storage';
import type { 
  CultivationContextValue, 
  ExpChangeParams, 
  BreakthroughResult,
  SeclusionResult,
  CheckInRewardParams,
  CycleCompleteRewardParams,
  DailyCompleteRewardParams,
  ArchiveRewardParams,
} from './types';
import {
  calculateDailyPointsCap,
  distributeCheckInPoints,
  calculateCycleCompleteBonus,
  calculateDailyViewCompleteReward,
  calculateArchiveReward,
} from '../../utils/spiritJadeCalculator';
import { isTaskTodayMustComplete } from '../../utils/todayMustCompleteStorage';
import { hasCycleRewardClaimed, markCycleRewardClaimed } from '../../utils/cycleRewardStorage';
import { hasTodayDailyCompleteRewardClaimed, markTodayDailyCompleteRewardClaimed } from '../../utils/dailyCompleteRewardStorage';
import { calculateAllowedReward, addTodayTaskReward } from '../../utils/dailyRewardTracker';
import { RewardToast } from '../../components';

// ============ Context ============

const CultivationContext = createContext<CultivationContextValue | null>(null);

// ============ Hook ============

export function useCultivation(): CultivationContextValue {
  const context = useContext(CultivationContext);
  if (!context) {
    throw new Error('useCultivation must be used within a CultivationProvider');
  }
  return context;
}

// ============ Provider ============

interface CultivationProviderProps {
  children: ReactNode;
}

export function CultivationProvider({ children }: CultivationProviderProps) {
  // 修仙状态
  const [data, setData] = useState<CultivationData>(INITIAL_CULTIVATION_DATA);
  const [history, setHistory] = useState<CultivationHistory>({});
  const [loading, setLoading] = useState(true);
  
  // 灵玉状态
  const [spiritJadeData, setSpiritJadeData] = useState<SpiritJadeData>(INITIAL_SPIRIT_JADE_DATA);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory>({});

  // 奖励队列状态
  const [currentRewards, setCurrentRewards] = useState<RewardItem[]>([]);
  const [showRewardToast, setShowRewardToast] = useState(false);

  // 初始化加载数据
  useEffect(() => {
    const loadedData = loadCultivationData();
    const loadedHistory = loadCultivationHistory();
    const loadedSpiritJade = loadSpiritJadeData();
    const loadedPointsHistory = loadPointsHistory();
    setData(loadedData);
    setHistory(loadedHistory);
    setSpiritJadeData(loadedSpiritJade);
    setPointsHistory(loadedPointsHistory);
    setLoading(false);
  }, []);

  // 保存数据
  const saveData = useCallback((newData: CultivationData) => {
    setData(newData);
    saveCultivationData(newData);
  }, []);

  // 添加历史记录
  const addHistoryRecord = useCallback((record: CultivationRecord) => {
    const weekKey = getWeekKey();
    setHistory(prev => {
      const newHistory = { ...prev };
      if (!newHistory[weekKey]) {
        newHistory[weekKey] = [];
      }
      newHistory[weekKey] = [record, ...newHistory[weekKey]];
      saveCultivationHistory(newHistory);
      return newHistory;
    });
  }, []);

  // 计算当前等级信息
  const levelInfo = useMemo(() => getCurrentLevelInfo(data), [data]);

  // 计算闭关信息
  const seclusionInfo = useMemo(() => getSeclusionInfo(data), [data]);

  // ========== 修为操作 ==========

  // 最近一次升级信息（用于奖励弹窗显示）
  const lastLevelUpRef = useRef<{ newLevelName: string } | null>(null);

  // 增加修为
  const addExp = useCallback((params: ExpChangeParams) => {
    const { amount, type, taskId, taskTitle, description } = params;
    if (amount <= 0) return;

    // 清除上次的升级信息
    lastLevelUpRef.current = null;

    const expBefore = data.currentExp;
    let newExp = data.currentExp + amount;
    const newTotalExp = data.totalExpGained + amount;
    const currentExpCap = getExpCap(data.realm, data.stage, data.layer);

    let finalData: CultivationData = {
      ...data,
      totalExpGained: newTotalExp,
      lastUpdatedAt: new Date().toISOString(),
    };

    let finalRealm = data.realm;
    let autoUpgradeMessage = '';

    // 检查是否需要自动升级（同境界内）
    if (newExp >= currentExpCap) {
      const nextLevel = getNextLevel(data.realm, data.stage, data.layer);
      
      if (nextLevel) {
        // 同境界内自动升级
        if (nextLevel.realm === data.realm) {
          const overflowExp = newExp - currentExpCap;
          finalData = {
            ...finalData,
            realm: nextLevel.realm,
            stage: nextLevel.stage,
            layer: nextLevel.layer,
            currentExp: overflowExp,
            breakthroughCount: data.breakthroughCount + 1,
          };
          finalRealm = nextLevel.realm;
          const newLevelName = getLevelDisplayName(nextLevel.realm, nextLevel.stage, nextLevel.layer);
          autoUpgradeMessage = `，自动晋升至${newLevelName}`;
          // 记录升级信息
          lastLevelUpRef.current = { newLevelName };
        } else {
          // 跨境界，修为停在上限，等待手动突破
          newExp = currentExpCap;
          finalData = {
            ...finalData,
            currentExp: newExp,
          };
        }
      } else {
        // 已是最高等级，修为停在上限
        newExp = currentExpCap;
        finalData = {
          ...finalData,
          currentExp: newExp,
        };
      }
    } else {
      finalData = {
        ...finalData,
        currentExp: newExp,
      };
    }

    saveData(finalData);

    // 添加历史记录
    const record: CultivationRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type,
      amount,
      taskId,
      taskTitle,
      description: (description || `获得 ${amount} 修为`) + autoUpgradeMessage,
      expBefore,
      expAfter: finalData.currentExp,
      realmBefore: data.realm,
      realmAfter: finalRealm,
    };
    addHistoryRecord(record);
  }, [data, saveData, addHistoryRecord]);

  // 减少修为
  const reduceExp = useCallback((params: ExpChangeParams) => {
    const { amount, type, taskId, taskTitle, description } = params;
    if (amount <= 0) return;

    const expBefore = data.currentExp;
    let newExp = Math.max(0, data.currentExp - amount);
    let newData = { ...data };

    // 检查是否需要降级
    if (newExp <= 0 && data.realm !== 'LIANQI') {
      const prevLevel = getPreviousLevel(data.realm, data.stage, data.layer);
      
      if (prevLevel) {
        // 检查是否跨大境界降级
        if (isCrossRealmDemotion(data.realm, prevLevel.realm)) {
          // 触发闭关保护
          const targetExp = Math.floor(getExpCap(prevLevel.realm, prevLevel.stage, prevLevel.layer) * 0.5);
          
          newData = {
            ...data,
            currentExp: 0,
            seclusion: {
              active: true,
              startDate: new Date().toISOString().split('T')[0],
              targetExp,
              originalRealm: data.realm,
              originalStage: data.stage,
              originalLayer: data.layer,
            },
            lastUpdatedAt: new Date().toISOString(),
          };
        } else {
          // 同境界内降级，直接降级
          const prevExpCap = getExpCap(prevLevel.realm, prevLevel.stage, prevLevel.layer);
          newData = {
            ...data,
            realm: prevLevel.realm,
            stage: prevLevel.stage,
            layer: prevLevel.layer,
            currentExp: Math.floor(prevExpCap * 0.8), // 降级后保留80%修为
            lastUpdatedAt: new Date().toISOString(),
          };
        }
      }
    } else {
      newData = {
        ...data,
        currentExp: newExp,
        lastUpdatedAt: new Date().toISOString(),
      };
    }

    saveData(newData);

    // 添加历史记录
    const record: CultivationRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type,
      amount: -amount,
      taskId,
      taskTitle,
      description: description || `消耗 ${amount} 修为`,
      expBefore,
      expAfter: newData.currentExp,
      realmBefore: data.realm,
      realmAfter: newData.realm,
    };
    addHistoryRecord(record);
  }, [data, saveData, addHistoryRecord]);

  // 任务打卡获得修为
  const gainExpFromCheckIn = useCallback((
    taskId: string, 
    taskTitle: string, 
    taskCategory: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN'
  ) => {
    const expAmount = TASK_EXP_CONFIG[taskCategory];
    addExp({
      amount: expAmount,
      type: 'CHECK_IN',
      taskId,
      taskTitle,
      description: `完成任务「${taskTitle}」获得 ${expAmount} 修为`,
    });
  }, [addExp]);

  // 周期结算奖励
  const applyCycleReward = useCallback((completionRate: number, baseExp: number) => {
    if (completionRate < CYCLE_REWARD_CONFIG.threshold) {
      return; // 完成度不足，不发放奖励
    }

    let multiplier = CYCLE_REWARD_CONFIG.baseMultiplier;
    if (completionRate >= 1) {
      multiplier += CYCLE_REWARD_CONFIG.fullCompletionBonus;
    }

    const rewardExp = Math.floor(baseExp * multiplier);
    addExp({
      amount: rewardExp,
      type: 'CYCLE_REWARD',
      description: `周期结算奖励：完成度 ${(completionRate * 100).toFixed(0)}%，获得 ${rewardExp} 修为`,
    });
  }, [addExp]);

  // 周期结算惩罚
  const applyCyclePenalty = useCallback(() => {
    const penaltyAmount = PENALTY_CONFIG[data.realm];
    reduceExp({
      amount: penaltyAmount,
      type: 'CYCLE_PENALTY',
      description: `周期结算惩罚：完成度不足，扣除 ${penaltyAmount} 修为`,
    });
  }, [data.realm, reduceExp]);

  // ========== 灵玉操作 ==========

  // 保存灵玉数据
  const saveSpiritJade = useCallback((newData: SpiritJadeData) => {
    setSpiritJadeData(newData);
    saveSpiritJadeData(newData);
  }, []);

  // 添加积分历史记录
  const addPointsHistoryRecord = useCallback((record: PointsRecord) => {
    const weekKey = getWeekKey();
    setPointsHistory(prev => {
      const newHistory = { ...prev };
      if (!newHistory[weekKey]) {
        newHistory[weekKey] = [];
      }
      newHistory[weekKey] = [record, ...newHistory[weekKey]];
      savePointsHistory(newHistory);
      return newHistory;
    });
  }, []);

  // 检查是否可以消耗灵玉
  const canSpendSpiritJade = useCallback((amount: number): boolean => {
    return spiritJadeData.balance >= amount;
  }, [spiritJadeData.balance]);

  // 增加灵玉
  const addSpiritJade = useCallback((params: AddPointsParams) => {
    const { spiritJade, cultivation, source, taskId, taskTitle, description } = params;
    
    const newSpiritJadeData: SpiritJadeData = {
      ...spiritJadeData,
      balance: spiritJadeData.balance + spiritJade,
      totalEarned: spiritJadeData.totalEarned + spiritJade,
      lastUpdatedAt: new Date().toISOString(),
    };
    saveSpiritJade(newSpiritJadeData);

    // 添加历史记录
    const record: PointsRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type: 'EARN',
      source,
      spiritJade,
      cultivation,
      taskId,
      taskTitle,
      description: description || `获得 ${spiritJade} 灵玉`,
    };
    addPointsHistoryRecord(record);
  }, [spiritJadeData, saveSpiritJade, addPointsHistoryRecord]);

  // 消耗灵玉
  const spendSpiritJade = useCallback((params: SpendSpiritJadeParams): boolean => {
    const { amount, source, taskId, taskTitle, description } = params;
    
    if (!canSpendSpiritJade(amount)) {
      return false;
    }

    const newSpiritJadeData: SpiritJadeData = {
      ...spiritJadeData,
      balance: spiritJadeData.balance - amount,
      totalSpent: spiritJadeData.totalSpent + amount,
      lastUpdatedAt: new Date().toISOString(),
    };
    saveSpiritJade(newSpiritJadeData);

    // 添加历史记录
    const record: PointsRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type: 'SPEND',
      source,
      spiritJade: -amount,
      cultivation: 0,
      taskId,
      taskTitle,
      description: description || `消耗 ${amount} 灵玉`,
    };
    addPointsHistoryRecord(record);

    return true;
  }, [spiritJadeData, canSpendSpiritJade, saveSpiritJade, addPointsHistoryRecord]);

  // 同时增加灵玉和修为
  const addPoints = useCallback((params: AddPointsParams): RewardItem => {
    const { spiritJade, cultivation, source, taskId, taskTitle, description } = params;
    
    // 增加灵玉
    addSpiritJade(params);
    
    // 增加修为
    if (cultivation > 0) {
      addExp({
        amount: cultivation,
        type: 'CHECK_IN',
        taskId,
        taskTitle,
        description: description || `获得 ${cultivation} 修为`,
      });
    }

    // 检查是否有等级提升
    const levelUpInfo = lastLevelUpRef.current;

    return {
      spiritJade,
      cultivation,
      source: description || source,
      levelUp: levelUpInfo ? { newLevelName: levelUpInfo.newLevelName } : undefined,
    };
  }, [addSpiritJade, addExp]);

  // ========== 奖励队列管理 ==========

  // 添加奖励到队列并显示（手动关闭）
  const showReward = useCallback((reward: RewardItem) => {
    setCurrentRewards(prev => [...prev, reward]);
    setShowRewardToast(true);
  }, []);

  // 批量添加奖励（手动关闭）
  const showRewards = useCallback((rewards: RewardItem[]) => {
    if (rewards.length === 0) return;
    setCurrentRewards(prev => [...prev, ...rewards]);
    setShowRewardToast(true);
  }, []);

  // 关闭奖励显示
  const closeRewardToast = useCallback(() => {
    setShowRewardToast(false);
    setCurrentRewards([]);
  }, []);

  // ========== 奖励发放方法 ==========

  // 发放打卡奖励
  const dispatchCheckInReward = useCallback((params: CheckInRewardParams): RewardItem | null => {
    const { task, completionRatio, isCycleComplete = false, cycleNumber } = params;

    if (completionRatio <= 0) return null;

    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;
    const isTodayMustComplete = isTaskTodayMustComplete(task.id);

    // 检查周期奖励是否已领取
    const shouldGiveCycleBonus = isCycleComplete && cycleNumber !== undefined && !hasCycleRewardClaimed(task.id, cycleNumber);

    // 计算每日上限
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);

    // 计算积分分配（包含基础和加成明细）
    const pointsResult = distributeCheckInPoints(completionRatio, dailyCap, isTodayMustComplete, shouldGiveCycleBonus);

    // ===== 每日奖励上限检查 =====
    const allowedReward = calculateAllowedReward(
      task.id,
      pointsResult.total.spiritJade,
      pointsResult.total.cultivation,
      dailyCap.spiritJade,
      dailyCap.cultivation
    );

    // 如果已达到上限，不弹奖励弹窗，返回 null 让调用方显示 Toast
    if (allowedReward.alreadyAtCap) {
      return null;
    }

    // 计算实际发放的奖励（可能被上限截断）
    const actualJade = allowedReward.allowedJade;
    const actualCultivation = allowedReward.allowedCultivation;

    // 发放奖励（使用上限检查后的值）
    if (actualJade > 0) {
      addSpiritJade({
        spiritJade: actualJade,
        cultivation: actualCultivation,
        source: 'CHECK_IN',
        taskId: task.id,
        taskTitle: task.title,
        description: `任务「${task.title}」打卡`,
      });
    }

    // 增加修为
    if (actualCultivation > 0) {
      addExp({
        amount: actualCultivation,
        type: 'CHECK_IN',
        taskId: task.id,
        taskTitle: task.title,
        description: `任务「${task.title}」打卡`,
      });
    }

    // 记录今日已发放的奖励
    if (actualJade > 0 || actualCultivation > 0) {
      addTodayTaskReward(task.id, actualJade, actualCultivation);
    }

    // 标记周期奖励已领取
    if (shouldGiveCycleBonus && cycleNumber !== undefined) {
      markCycleRewardClaimed(task.id, cycleNumber);
    }

    // 检查是否有等级提升
    const levelUpInfo = lastLevelUpRef.current;

    // 计算实际基础奖励比例（如果被上限截断，按比例缩减）
    const jadeRatio = pointsResult.total.spiritJade > 0 ? actualJade / pointsResult.total.spiritJade : 0;
    const cultivationRatio = pointsResult.total.cultivation > 0 ? actualCultivation / pointsResult.total.cultivation : 0;

    // 构建奖励显示对象（显示实际发放的值）
    const reward: RewardItem = {
      spiritJade: Math.floor(pointsResult.baseSpiritJade * jadeRatio),
      cultivation: Math.floor(pointsResult.baseCultivation * cultivationRatio),
      source: `任务「${task.title}」打卡`,
      levelUp: levelUpInfo ? { newLevelName: levelUpInfo.newLevelName } : undefined,
    };

    // 添加加成信息
    const bonuses: string[] = [];
    let bonusSpiritJade = 0;
    let bonusCultivation = 0;

    if (pointsResult.mustCompleteBonus) {
      bonuses.push('必完成任务');
      bonusSpiritJade += Math.floor(pointsResult.mustCompleteBonus.spiritJade * jadeRatio);
      bonusCultivation += Math.floor(pointsResult.mustCompleteBonus.cultivation * cultivationRatio);
    }

    if (pointsResult.cycleCompleteBonus) {
      bonuses.push('周期完成');
      bonusSpiritJade += Math.floor(pointsResult.cycleCompleteBonus.spiritJade * jadeRatio);
      bonusCultivation += Math.floor(pointsResult.cycleCompleteBonus.cultivation * cultivationRatio);
    }

    if (bonuses.length > 0 && (bonusSpiritJade > 0 || bonusCultivation > 0)) {
      reward.bonus = {
        reason: bonuses.join('、'),
        percentage: bonuses.length === 1
          ? (pointsResult.mustCompleteBonus?.percentage || pointsResult.cycleCompleteBonus?.percentage || 0)
          : 0,  // 多个加成时不显示单一比例
        spiritJade: bonusSpiritJade,
        cultivation: bonusCultivation,
      };
    }

    // 如果奖励被部分截断，添加上限提示信息
    if (allowedReward.reachedJadeCap || allowedReward.reachedCultivationCap) {
      reward.todayRemaining = {
        spiritJade: { earned: dailyCap.spiritJade, cap: dailyCap.spiritJade },
        cultivation: { earned: dailyCap.cultivation, cap: dailyCap.cultivation },
      };
    }

    // 显示奖励
    showReward(reward);

    return reward;
  }, [addSpiritJade, addExp, showReward]);

  // 发放周期完成奖励
  const dispatchCycleCompleteReward = useCallback((params: CycleCompleteRewardParams): RewardItem | null => {
    const { task, cycleNumber } = params;
    
    // 检查是否已领取过该周期的奖励
    if (hasCycleRewardClaimed(task.id, cycleNumber)) {
      return null;
    }
    
    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;

    // 计算每日上限作为基准
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);
    
    // 计算周期完成奖励
    const bonus = calculateCycleCompleteBonus(dailyCap);

    // 发放奖励
    const reward = addPoints({
      spiritJade: bonus.spiritJade,
      cultivation: bonus.cultivation,
      source: 'CYCLE_COMPLETE',
      taskId: task.id,
      taskTitle: task.title,
      description: `周期${cycleNumber}完成100%`,
    });

    // 标记已领取
    markCycleRewardClaimed(task.id, cycleNumber);

    // 显示奖励
    showReward(reward);

    return reward;
  }, [addPoints, showReward]);

  // 发放一日清单完成奖励
  const dispatchDailyCompleteReward = useCallback((params: DailyCompleteRewardParams): RewardItem | null => {
    const { taskCount } = params;

    // 至少需要3个任务才能获得奖励
    if (taskCount < 3) {
      return null;
    }

    // 检查今日是否已领取
    if (hasTodayDailyCompleteRewardClaimed()) {
      return null;
    }

    // 计算一日清单完成奖励
    const bonus = calculateDailyViewCompleteReward(taskCount);

    // 发放奖励
    const reward = addPoints({
      spiritJade: bonus.spiritJade,
      cultivation: bonus.cultivation,
      source: 'DAILY_COMPLETE',
      description: `一日清单完成100%（${taskCount}个任务）`,
    });

    // 标记今日已领取
    markTodayDailyCompleteRewardClaimed();

    // 显示奖励
    showReward(reward);

    return reward;
  }, [addPoints, showReward]);

  // 发放归档奖励
  const dispatchArchiveReward = useCallback((params: ArchiveRewardParams): RewardItem | null => {
    const { task, completionRate } = params;
    
    // 完成率低于30%不发放
    if (completionRate < 0.3) return null;

    const taskType = task.type as TaskType;
    const checkInUnit = (task.checkInConfig?.unit || 'TIMES') as CheckInUnit;

    // 计算每日上限作为基准
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);
    
    // 计算归档奖励
    const points = calculateArchiveReward(dailyCap, completionRate);

    // 发放奖励
    const reward = addPoints({
      spiritJade: points.spiritJade,
      cultivation: points.cultivation,
      source: 'ARCHIVE',
      taskId: task.id,
      taskTitle: task.title,
      description: `归档「${task.title}」（完成率${Math.round(completionRate * 100)}%）`,
    });

    // 显示奖励
    showReward(reward);

    return reward;
  }, [addPoints, showReward]);

  // ========== 境界操作 ==========

  // 突破
  const breakthrough = useCallback((): BreakthroughResult => {
    const currentLevelInfo = getCurrentLevelInfo(data);
    
    if (!currentLevelInfo.canBreakthrough) {
      return {
        success: false,
        message: '修为不足，无法突破',
      };
    }

    if (currentLevelInfo.isMaxLevel) {
      return {
        success: false,
        message: '已达最高境界',
      };
    }

    const nextLevel = getNextLevel(data.realm, data.stage, data.layer);
    if (!nextLevel) {
      return {
        success: false,
        message: '无法获取下一等级信息',
      };
    }

    // 突破成功，重置修为为0
    const newData: CultivationData = {
      ...data,
      realm: nextLevel.realm,
      stage: nextLevel.stage,
      layer: nextLevel.layer,
      currentExp: 0,
      breakthroughCount: data.breakthroughCount + 1,
      lastUpdatedAt: new Date().toISOString(),
    };

    saveData(newData);

    const newLevelName = getLevelDisplayName(nextLevel.realm, nextLevel.stage, nextLevel.layer);

    // 添加历史记录
    const record: CultivationRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type: 'BREAKTHROUGH',
      amount: 0,
      description: `突破成功！晋升至 ${newLevelName}`,
      expBefore: data.currentExp,
      expAfter: 0,
      realmBefore: data.realm,
      realmAfter: nextLevel.realm,
    };
    addHistoryRecord(record);

    return {
      success: true,
      message: `恭喜突破成功！晋升至 ${newLevelName}`,
      newLevel: {
        ...nextLevel,
        displayName: newLevelName,
      },
    };
  }, [data, saveData, addHistoryRecord]);

  // 检查并处理闭关结束
  const checkSeclusionEnd = useCallback((): SeclusionResult | null => {
    if (!data.seclusion || !data.seclusion.active) {
      return null;
    }

    const secInfo = getSeclusionInfo(data);
    if (!secInfo) return null;

    // 检查是否闭关时间已到
    if (secInfo.remainingDays > 0) {
      return null; // 闭关未结束
    }

    // 闭关结束，检查是否达成目标
    if (secInfo.isTargetReached) {
      // 保级成功
      const newData: CultivationData = {
        ...data,
        seclusion: null,
        lastUpdatedAt: new Date().toISOString(),
      };
      saveData(newData);

      return {
        success: true,
        message: '闭关成功！境界得以保持',
        preserved: true,
      };
    } else {
      // 保级失败，降级
      const prevLevel = getPreviousLevel(
        data.seclusion.originalRealm,
        data.seclusion.originalStage,
        data.seclusion.originalLayer
      );

      if (prevLevel) {
        const prevExpCap = getExpCap(prevLevel.realm, prevLevel.stage, prevLevel.layer);
        const newData: CultivationData = {
          ...data,
          realm: prevLevel.realm,
          stage: prevLevel.stage,
          layer: prevLevel.layer,
          currentExp: Math.floor(prevExpCap * 0.5),
          seclusion: null,
          lastUpdatedAt: new Date().toISOString(),
        };
        saveData(newData);

        const demotedLevelName = getLevelDisplayName(prevLevel.realm, prevLevel.stage, prevLevel.layer);

        return {
          success: false,
          message: `闭关失败，境界跌落至 ${demotedLevelName}`,
          preserved: false,
          demotedLevel: {
            ...prevLevel,
            displayName: demotedLevelName,
          },
        };
      }
    }

    return null;
  }, [data, saveData]);

  // ========== 历史记录 ==========

  // 获取指定周的历史记录
  const getWeekHistory = useCallback((weekKey: string): CultivationRecord[] => {
    return history[weekKey] || [];
  }, [history]);

  // 获取最近的历史记录
  const getRecentHistory = useCallback((limit: number = 20): CultivationRecord[] => {
    const allRecords: CultivationRecord[] = [];
    const weekKeys = Object.keys(history).sort().reverse();
    
    for (const weekKey of weekKeys) {
      allRecords.push(...history[weekKey]);
      if (allRecords.length >= limit) {
        break;
      }
    }
    
    return allRecords.slice(0, limit);
  }, [history]);

  // ========== 数据管理 ==========

  // 重置数据
  const resetData = useCallback(() => {
    clearCultivationData();
    clearSpiritJadeData();
    setData({ ...INITIAL_CULTIVATION_DATA });
    setHistory({});
    setSpiritJadeData({ ...INITIAL_SPIRIT_JADE_DATA });
    setPointsHistory({});
  }, []);

  // 导出数据
  const exportDataFn = useCallback((): string => {
    return exportCultivationData();
  }, []);

  // 导入数据
  const importDataFn = useCallback((jsonString: string): boolean => {
    const success = importCultivationData(jsonString);
    if (success) {
      const loadedData = loadCultivationData();
      const loadedHistory = loadCultivationHistory();
      setData(loadedData);
      setHistory(loadedHistory);
    }
    return success;
  }, []);

  // ========== Context Value ==========

  const contextValue: CultivationContextValue = useMemo(() => ({
    data,
    levelInfo,
    seclusionInfo,
    history,
    loading,
    spiritJadeData,
    pointsHistory,
    addExp,
    reduceExp,
    gainExpFromCheckIn,
    applyCycleReward,
    applyCyclePenalty,
    addSpiritJade,
    spendSpiritJade,
    canSpendSpiritJade,
    addPoints,
    // 奖励发放
    currentRewards,
    showRewardToast,
    dispatchCheckInReward,
    dispatchCycleCompleteReward,
    dispatchDailyCompleteReward,
    dispatchArchiveReward,
    closeRewardToast,
    // 境界操作
    breakthrough,
    checkSeclusionEnd,
    getWeekHistory,
    getRecentHistory,
    resetData,
    exportData: exportDataFn,
    importData: importDataFn,
  }), [
    data,
    levelInfo,
    seclusionInfo,
    history,
    loading,
    spiritJadeData,
    pointsHistory,
    addExp,
    reduceExp,
    gainExpFromCheckIn,
    applyCycleReward,
    applyCyclePenalty,
    addSpiritJade,
    spendSpiritJade,
    canSpendSpiritJade,
    addPoints,
    currentRewards,
    showRewardToast,
    dispatchCheckInReward,
    dispatchCycleCompleteReward,
    dispatchDailyCompleteReward,
    dispatchArchiveReward,
    closeRewardToast,
    breakthrough,
    checkSeclusionEnd,
    getWeekHistory,
    getRecentHistory,
    resetData,
    exportDataFn,
    importDataFn,
  ]);

  // 计算当前等级形象图
  const currentLevelImage = useMemo(() => getCultivationImageFromData(data), [data]);

  return (
    <CultivationContext.Provider value={contextValue}>
      {children}
      {/* 全局奖励Toast */}
      <RewardToast
        rewards={currentRewards}
        visible={showRewardToast}
        onClose={closeRewardToast}
        currentLevelImage={currentLevelImage}
      />
    </CultivationContext.Provider>
  );
}

export default CultivationProvider;

