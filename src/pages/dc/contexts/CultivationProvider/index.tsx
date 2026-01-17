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
  type ReactNode 
} from 'react';
import type { CultivationData, CultivationRecord, CultivationHistory } from '../../types/cultivation';
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
} from '../../utils/cultivation';
import {
  loadCultivationData,
  saveCultivationData,
  loadCultivationHistory,
  saveCultivationHistory,
  clearCultivationData,
  exportCultivationData,
  importCultivationData,
} from './storage';
import type { 
  CultivationContextValue, 
  ExpChangeParams, 
  BreakthroughResult,
  SeclusionResult,
} from './types';

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
  // 状态
  const [data, setData] = useState<CultivationData>(INITIAL_CULTIVATION_DATA);
  const [history, setHistory] = useState<CultivationHistory>({});
  const [loading, setLoading] = useState(true);

  // 初始化加载数据
  useEffect(() => {
    const loadedData = loadCultivationData();
    const loadedHistory = loadCultivationHistory();
    setData(loadedData);
    setHistory(loadedHistory);
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

  // 增加修为
  const addExp = useCallback((params: ExpChangeParams) => {
    const { amount, type, taskId, taskTitle, description } = params;
    if (amount <= 0) return;

    const expBefore = data.currentExp;
    const newExp = data.currentExp + amount;
    const newTotalExp = data.totalExpGained + amount;

    const newData: CultivationData = {
      ...data,
      currentExp: newExp,
      totalExpGained: newTotalExp,
      lastUpdatedAt: new Date().toISOString(),
    };

    saveData(newData);

    // 添加历史记录
    const record: CultivationRecord = {
      id: generateCultivationId(),
      timestamp: new Date().toISOString(),
      type,
      amount,
      taskId,
      taskTitle,
      description: description || `获得 ${amount} 修为`,
      expBefore,
      expAfter: newExp,
      realmBefore: data.realm,
      realmAfter: data.realm,
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
    setData({ ...INITIAL_CULTIVATION_DATA });
    setHistory({});
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
    addExp,
    reduceExp,
    gainExpFromCheckIn,
    applyCycleReward,
    applyCyclePenalty,
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
    addExp,
    reduceExp,
    gainExpFromCheckIn,
    applyCycleReward,
    applyCyclePenalty,
    breakthrough,
    checkSeclusionEnd,
    getWeekHistory,
    getRecentHistory,
    resetData,
    exportDataFn,
    importDataFn,
  ]);

  return (
    <CultivationContext.Provider value={contextValue}>
      {children}
    </CultivationContext.Provider>
  );
}

export default CultivationProvider;

