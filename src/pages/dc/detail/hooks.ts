import { useState, useEffect, useCallback } from 'react';
import type { GoalDetail, CurrentCycleInfo, CheckIn } from './types';
import type { NumericConfig, ChecklistItem } from '../types';

export function useGoalDetail(goalId: string, onDataChange?: () => void) {
  const [goalDetail, setGoalDetail] = useState<GoalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  
  const fetchGoalDetail = useCallback(() => {
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goal = goals.find((g: any) => g.id === goalId);
        if (goal) {
          // 如果有mainlineTask，从中提取配置到顶层，便于详情页使用
          if (goal.mainlineTask) {
            const mt = goal.mainlineTask;
            const normalizedGoal = {
              ...goal,
              mainlineType: mt.mainlineType || goal.mainlineType,
              numericConfig: mt.numericConfig || goal.numericConfig,
              checklistConfig: mt.checklistConfig || goal.checklistConfig,
              checkInConfig: mt.checkInConfig || goal.checkInConfig,
              history: mt.history || goal.history || [],
              progress: mt.progress || goal.progress,
              // 从cycleConfig提取周期信息
              totalDays: mt.cycleConfig?.totalDurationDays || goal.totalDays,
              cycleDays: mt.cycleConfig?.cycleLengthDays || goal.cycleDays,
              totalCycles: mt.cycleConfig?.totalCycles || goal.totalCycles,
              minCheckInsPerCycle: mt.checkInConfig?.perCycleTarget || goal.minCheckInsPerCycle || 3,
              // 保留cycleSnapshots
              cycleSnapshots: goal.cycleSnapshots || []
            };
            setGoalDetail(normalizedGoal);
          } else {
            setGoalDetail(goal);
          }
        }
      }
    } catch (error) {
      console.error('加载目标详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, [goalId]);
  
  // 打卡功能
  const checkIn = useCallback(async (note?: string) => {
    if (!goalDetail || checkInLoading) return false;
    
    setCheckInLoading(true);
    try {
      const now = new Date();
      const newCheckIn: CheckIn = {
        id: `checkin_${Date.now()}`,
        date: now.toISOString().split('T')[0],
        timestamp: now.getTime(),
        note: note || undefined
      };
      
      // 更新本地存储
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          if (!goals[goalIndex].checkIns) {
            goals[goalIndex].checkIns = [];
          }
          goals[goalIndex].checkIns.push(newCheckIn);
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态
          setGoalDetail({
            ...goalDetail,
            checkIns: [...(goalDetail.checkIns || []), newCheckIn]
          });
        }
      }
      return true;
    } catch (error) {
      console.error('打卡失败:', error);
      return false;
    } finally {
      setCheckInLoading(false);
    }
  }, [goalDetail, goalId, checkInLoading]);
  
  // 数值型任务 - 记录数据
  const recordNumericData = useCallback(async (value: number, note?: string) => {
    if (!goalDetail || checkInLoading) return false;
    
    setCheckInLoading(true);
    try {
      const now = new Date();
      const config = goalDetail.numericConfig;
      if (!config) return false;
      
      const previousValue = config.currentValue;
      const change = value - previousValue;
      
      // 创建历史记录
      const historyRecord = {
        date: now.toISOString(),
        type: 'NUMERIC_UPDATE',
        value,
        change,
        note: note || undefined
      };
      
      // 更新本地存储
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          // 计算进度 - 根据方向计算有效变化量
          // 减少目标：只有减少的部分才算完成，增加了则为0
          // 增加目标：只有增加的部分才算完成，减少了则为0
          const isDecrease = config.direction === 'DECREASE';
          const totalChange = Math.abs(config.targetValue - config.startValue);
          const rawChange = value - config.startValue;
          const effectiveChange = isDecrease 
            ? Math.max(0, -rawChange)  // 减少目标：负变化才有效
            : Math.max(0, rawChange);   // 增加目标：正变化才有效
          const totalPercentage = totalChange > 0 
            ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) 
            : 0;
          
          // 计算周期进度
          const totalCycles = goalDetail.totalCycles || 1;
          const perCycleTarget = config.perCycleTarget || (totalChange / totalCycles);
          
          // 获取周期起始值
          const history = goalDetail.history || [];
          const cycleInfo = getCurrentCycle(goalDetail);
          const cycleStartDate = new Date(cycleInfo.startDate);
          
          let cycleStartValue = config.startValue;
          for (let i = history.length - 1; i >= 0; i--) {
            const recordDate = new Date(history[i].date);
            if (recordDate < cycleStartDate && history[i].value !== undefined) {
              cycleStartValue = history[i].value as number;
              break;
            }
          }
          if (cycleInfo.cycleNumber === 1) {
            cycleStartValue = config.startValue;
          }
          
          // 计算周期有效变化量
          const rawCycleChange = value - cycleStartValue;
          const effectiveCycleChange = isDecrease 
            ? Math.max(0, -rawCycleChange)
            : Math.max(0, rawCycleChange);
          const cyclePercentage = perCycleTarget > 0 
            ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) 
            : 0;
          
          // 如果有mainlineTask，更新其中的配置
          if (goal.mainlineTask) {
            if (goal.mainlineTask.numericConfig) {
              goal.mainlineTask.numericConfig.currentValue = value;
            }
            if (!goal.mainlineTask.history) {
              goal.mainlineTask.history = [];
            }
            goal.mainlineTask.history.push(historyRecord);
            if (!goal.mainlineTask.progress) {
              goal.mainlineTask.progress = {};
            }
            goal.mainlineTask.progress.totalPercentage = totalPercentage;
            goal.mainlineTask.progress.currentCyclePercentage = cyclePercentage;
          }
          
          // 同时更新顶层配置（兼容旧数据）
          if (!goal.numericConfig) {
            goal.numericConfig = config;
          }
          goal.numericConfig.currentValue = value;
          
          if (!goal.history) {
            goal.history = [];
          }
          goal.history.push(historyRecord);
          
          if (!goal.progress) {
            goal.progress = {};
          }
          goal.progress.totalPercentage = totalPercentage;
          goal.progress.currentCyclePercentage = cyclePercentage;
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态 - 同步更新所有相关数据
          const newHistory = [...(goalDetail.history || []), historyRecord];
          setGoalDetail({
            ...goalDetail,
            numericConfig: {
              ...config,
              currentValue: value
            },
            history: newHistory,
            progress: {
              totalPercentage,
              currentCyclePercentage: cyclePercentage
            }
          });
          
          // 通知外部数据变化
          onDataChange?.();
        }
      }
      return true;
    } catch (error) {
      console.error('记录数据失败:', error);
      return false;
    } finally {
      setCheckInLoading(false);
    }
  }, [goalDetail, goalId, checkInLoading, onDataChange]);
  
  // 清单型任务 - 更新清单项进度
  const updateChecklistItem = useCallback(async (
    itemId: string, 
    updates: { status?: string; subProgress?: { current: number; total: number } }
  ) => {
    if (!goalDetail || checkInLoading) return false;
    
    setCheckInLoading(true);
    try {
      const config = goalDetail.checklistConfig;
      if (!config) return false;
      
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const items = goals[goalIndex].checklistConfig?.items || [];
          const itemIndex = items.findIndex((item: ChecklistItem) => item.id === itemId);
          
          if (itemIndex !== -1) {
            // 更新清单项
            if (updates.status) {
              items[itemIndex].status = updates.status;
              if (updates.status === 'COMPLETED') {
                items[itemIndex].completedAt = new Date().toISOString().split('T')[0];
              }
            }
            if (updates.subProgress) {
              items[itemIndex].subProgress = updates.subProgress;
            }
            
            goals[goalIndex].checklistConfig.items = items;
            
            // 计算已完成数
            const completedCount = items.filter((item: ChecklistItem) => item.status === 'COMPLETED').length;
            goals[goalIndex].checklistConfig.completedItems = completedCount;
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            // 更新状态
            setGoalDetail({
              ...goalDetail,
              checklistConfig: {
                ...config,
                items,
                completedItems: completedCount
              }
            });
          }
        }
      }
      return true;
    } catch (error) {
      console.error('更新清单项失败:', error);
      return false;
    } finally {
      setCheckInLoading(false);
    }
  }, [goalDetail, goalId, checkInLoading]);
  
  useEffect(() => {
    fetchGoalDetail();
  }, [fetchGoalDetail]);
  
  // Debug: 进入下一个周期（保存当前周期快照，重新计算后续周期目标）
  const debugNextCycle = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          // 获取当前周期信息
          const currentCycleInfo = getCurrentCycle(goalDetail);
          
          // 保存当前周期的快照数据
          const cycleSnapshots = goal.cycleSnapshots || [];
          if (goalDetail.numericConfig) {
            const config = goalDetail.numericConfig;
            const { startValue, targetValue: finalTarget, direction, currentValue } = config;
            const totalChange = Math.abs(finalTarget - startValue);
            const remainingCyclesBeforeSnapshot = goalDetail.totalCycles - (cycleSnapshots.length || 0);
            const changePerCycle = totalChange / remainingCyclesBeforeSnapshot;
            
            // 计算当前周期结束时的目标值（相对于当前的startValue）
            const cycleIndexInCurrentPlan = currentCycleInfo.cycleNumber - (cycleSnapshots.length || 0);
            let cycleTargetValue: number;
            if (direction === 'DECREASE') {
              cycleTargetValue = startValue - (changePerCycle * cycleIndexInCurrentPlan);
            } else {
              cycleTargetValue = startValue + (changePerCycle * cycleIndexInCurrentPlan);
            }
            
            // 计算完成率
            const targetChangeForCycle = Math.abs(cycleTargetValue - startValue);
            const actualChangeFromStart = direction === 'DECREASE' 
              ? startValue - currentValue 
              : currentValue - startValue;
            const completionRate = targetChangeForCycle > 0 
              ? Math.min(100, Math.max(0, Math.round((actualChangeFromStart / targetChangeForCycle) * 100)))
              : 0;
            
            // 添加当前周期快照（使用实际的周期编号和日期）
            cycleSnapshots.push({
              cycleNumber: currentCycleInfo.cycleNumber,
              startDate: currentCycleInfo.startDate,
              endDate: currentCycleInfo.endDate,
              targetValue: parseFloat(cycleTargetValue.toFixed(1)),
              actualValue: parseFloat(currentValue.toFixed(1)), // 结算值
              completionRate,
              unit: config.unit
            });
            
            goal.cycleSnapshots = cycleSnapshots;
          }
          
          // 不修改startDate，保持时间周期不变
          // 通过cycleSnapshots来标记已完成的周期
          
          // 更新numericConfig中的startValue用于后续周期的目标计算
          let updatedNumericConfig = goalDetail.numericConfig;
          const remainingCycles = goalDetail.totalCycles - currentCycleInfo.cycleNumber;
          
          if (goalDetail.numericConfig && remainingCycles > 0) {
            const config = goalDetail.numericConfig;
            const currentValue = config.currentValue;
            const finalTarget = config.targetValue;
            const originalPerCycleTarget = config.perCycleTarget;
            
            // 计算剩余需要变化的量
            const remainingChange = Math.abs(finalTarget - currentValue);
            // 计算新的每周期目标
            let newPerCycleTarget = remainingChange / remainingCycles;
            
            // 保存原始的每周期目标值
            const origPerCycleTarget = config.originalPerCycleTarget || originalPerCycleTarget;
            
            // 不能小于原始的最小周期目标值
            newPerCycleTarget = Math.max(newPerCycleTarget, origPerCycleTarget);
            
            // 更新numericConfig：新的起始值为当前值（用于计算后续周期目标）
            // 保存原始起始值用于计算总目标进度
            updatedNumericConfig = {
              ...config,
              startValue: currentValue,
              perCycleTarget: newPerCycleTarget,
              originalStartValue: config.originalStartValue || config.startValue,
              originalPerCycleTarget: origPerCycleTarget
            };
            
            // 更新goal中的numericConfig
            goal.numericConfig = updatedNumericConfig;
            if (goal.mainlineTask?.numericConfig) {
              goal.mainlineTask.numericConfig = updatedNumericConfig;
            }
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态（不修改startDate）
          setGoalDetail({
            ...goalDetail,
            numericConfig: updatedNumericConfig,
            cycleSnapshots
          });
          
          // 通知外部数据变化
          onDataChange?.();
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Debug进入下一周期失败:', error);
      return false;
    }
  }, [goalDetail, goalId, onDataChange]);
  
  return { 
    goalDetail, 
    loading,
    checkInLoading,
    refetch: fetchGoalDetail,
    checkIn,
    recordNumericData,
    updateChecklistItem,
    debugNextCycle
  };
}

export function getCurrentCycle(goalDetail: GoalDetail): CurrentCycleInfo {
  // 如果缺少必要字段,返回默认值
  if (!goalDetail.startDate || !goalDetail.cycleDays || !goalDetail.totalCycles || !goalDetail.minCheckInsPerCycle) {
    const today = new Date().toISOString().split('T')[0];
    return {
      cycleNumber: 1,
      totalCycles: 1,
      startDate: today,
      endDate: today,
      checkInCount: 0,
      requiredCheckIns: 3,
      remainingDays: 0,
      checkInDates: []
    };
  }
  
  const today = new Date();
  const startDate = new Date(goalDetail.startDate);
  const elapsedDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 计算实际的当前周期编号（基于时间）
  const realCycleNumber = Math.floor(elapsedDays / goalDetail.cycleDays) + 1;
  
  // 考虑debug模拟跳过的周期数
  const snapshotCount = goalDetail.cycleSnapshots?.length || 0;
  // 模拟的当前周期 = 实际周期 + 已跳过的周期数
  const simulatedCycleNumber = Math.min(realCycleNumber + snapshotCount, goalDetail.totalCycles);
  
  // 计算模拟当前周期的起始天数
  const cycleStartDay = (simulatedCycleNumber - 1) * goalDetail.cycleDays;
  const cycleEndDay = cycleStartDay + goalDetail.cycleDays - 1;
  
  // 计算模拟当前周期的开始和结束日期
  const currentCycleStart = new Date(startDate);
  currentCycleStart.setDate(startDate.getDate() + cycleStartDay);
  
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  
  // 计算剩余天数（基于模拟周期）
  const totalElapsedDays = elapsedDays + (snapshotCount * goalDetail.cycleDays);
  const remainingDays = Math.max(0, cycleEndDay - totalElapsedDays + (snapshotCount * goalDetail.cycleDays));
  
  // 获取本周期的打卡记录
  const checkIns = goalDetail.checkIns || [];
  const checkInDates = checkIns
    .filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= currentCycleStart && checkInDate <= currentCycleEnd;
    })
    .map(checkIn => checkIn.date);
  
  return {
    cycleNumber: simulatedCycleNumber,
    totalCycles: goalDetail.totalCycles,
    startDate: currentCycleStart.toISOString().split('T')[0],
    endDate: currentCycleEnd.toISOString().split('T')[0],
    checkInCount: checkInDates.length,
    requiredCheckIns: goalDetail.minCheckInsPerCycle,
    remainingDays,
    checkInDates
  };
}

