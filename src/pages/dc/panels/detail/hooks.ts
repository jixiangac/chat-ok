import { useState, useEffect, useCallback } from 'react';
import type { GoalDetail, CheckIn } from './types';
import type { ChecklistItem } from '../../types';

// 从拆分的模块导入
import { 
  formatLocalDate, 
  getSimulatedToday, 
  getSimulatedTodayDate, 
  getCurrentCycle 
} from './hooks/dateUtils';
import { getTodayCheckInStatusForTask } from './hooks/checkInStatus';
import { getRandomColorScheme } from './hooks/constants';
import { 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  calculateCurrentCycleNumber
} from '../../utils/mainlineTaskHelper';

// 重新导出供外部使用
export { 
  formatLocalDate, 
  getSimulatedToday, 
  getSimulatedTodayDate, 
  getCurrentCycle,
  getTodayCheckInStatusForTask
};

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
              totalDays: mt.cycleConfig?.totalDurationDays || goal.totalDays,
              cycleDays: mt.cycleConfig?.cycleLengthDays || goal.cycleDays,
              totalCycles: mt.cycleConfig?.totalCycles || goal.totalCycles,
              minCheckInsPerCycle: mt.checkInConfig?.perCycleTarget || goal.minCheckInsPerCycle || 3,
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
  const checkIn = useCallback(async (value?: number, note?: string) => {
    if (!goalDetail || checkInLoading) return false;
    
    setCheckInLoading(true);
    try {
      const simulatedToday = getSimulatedToday(goalDetail);
      const now = new Date();
      const config = goalDetail.checkInConfig;
      const effectiveToday = simulatedToday;
      const todayCheckIns = (goalDetail.checkIns || []).filter(c => c.date === effectiveToday);
      
      if (config) {
        const unit = config.unit;
        if (unit === 'TIMES') {
          const dailyMax = config.dailyMaxTimes || 1;
          if (todayCheckIns.length >= dailyMax) {
            console.log('今日已达到打卡上限');
            return false;
          }
        } else if (unit === 'DURATION') {
          const dailyTarget = config.dailyTargetMinutes || 15;
          const todayTotal = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          if (todayTotal >= dailyTarget) {
            console.log('今日已达到时长目标');
            return false;
          }
        } else if (unit === 'QUANTITY') {
          const dailyTarget = config.dailyTargetValue || 0;
          const todayTotal = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          if (dailyTarget > 0 && todayTotal >= dailyTarget) {
            console.log('今日已达到数值目标');
            return false;
          }
        }
      }
      
      const newCheckIn: CheckIn = {
        id: `checkin_${Date.now()}`,
        date: effectiveToday,
        timestamp: now.getTime(),
        value: value,
        note: note || undefined
      };
      
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          if (!goals[goalIndex].checkIns) {
            goals[goalIndex].checkIns = [];
          }
          goals[goalIndex].checkIns.push(newCheckIn);
          
          const checkInConfig = goals[goalIndex].mainlineTask?.checkInConfig || goals[goalIndex].checkInConfig;
          if (checkInConfig) {
            const checkIns = goals[goalIndex].checkIns;
            const uniqueDates = [...new Set(checkIns.map((c: CheckIn) => c.date))].sort();
            
            let currentStreak = 0;
            let checkDate = new Date(effectiveToday);
            
            while (uniqueDates.includes(formatLocalDate(checkDate))) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            }
            
            checkInConfig.currentStreak = currentStreak;
            checkInConfig.longestStreak = Math.max(
              checkInConfig.longestStreak || 0,
              currentStreak
            );
            
            if (goals[goalIndex].mainlineTask?.checkInConfig) {
              goals[goalIndex].mainlineTask.checkInConfig = checkInConfig;
            }
            goals[goalIndex].checkInConfig = checkInConfig;
            
            // 计算并更新打卡型任务的进度
            if (goals[goalIndex].mainlineTask?.mainlineType === 'CHECK_IN') {
              const mainlineTask = goals[goalIndex].mainlineTask;
              const checkIns = goals[goalIndex].checkIns || [];
              const cycleInfo = getCurrentCycle(goals[goalIndex]);
              const totalCycles = mainlineTask.cycleConfig?.totalCycles || 1;
              const perCycleTarget = checkInConfig.perCycleTarget || 1;
              const unit = checkInConfig.unit || 'TIMES';
              
              // 计算当前周期的打卡数据
              const cycleCheckIns = checkIns.filter((c: CheckIn) => 
                c.date >= cycleInfo.startDate && c.date <= cycleInfo.endDate
              );
              
              let currentCycleValue: number;
              let totalValue: number;
              
              if (unit === 'TIMES') {
                currentCycleValue = cycleCheckIns.length;
                totalValue = checkIns.length;
              } else if (unit === 'DURATION') {
                currentCycleValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
                totalValue = checkIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
              } else {
                currentCycleValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
                totalValue = checkIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
              }
              
              const currentCyclePercentage = Math.min(100, Math.round((currentCycleValue / perCycleTarget) * 100));
              const totalTarget = totalCycles * perCycleTarget;
              const totalPercentage = Math.min(100, Math.round((totalValue / totalTarget) * 100));
              
              const progress = {
                currentCyclePercentage,
                totalPercentage
              };
              
              // 更新进度到 mainlineTask 和 goal
              if (goals[goalIndex].mainlineTask) {
                goals[goalIndex].mainlineTask.progress = {
                  ...goals[goalIndex].mainlineTask.progress,
                  ...progress
                };
              }
              goals[goalIndex].progress = {
                ...goals[goalIndex].progress,
                ...progress
              };
            }
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          setGoalDetail({
            ...goalDetail,
            checkIns: [...(goalDetail.checkIns || []), newCheckIn],
            checkInConfig: goals[goalIndex].checkInConfig
          });
          
          onDataChange?.();
        }
      }
      return true;
    } catch (error) {
      console.error('打卡失败:', error);
      return false;
    } finally {
      setCheckInLoading(false);
    }
  }, [goalDetail, goalId, checkInLoading, onDataChange]);
  
  // 获取今日打卡状态
  const getTodayCheckInStatus = useCallback((customGoalDetail?: any) => {
    const targetGoalDetail = customGoalDetail || goalDetail;
    return getTodayCheckInStatusForTask(targetGoalDetail);
  }, [goalDetail]);
  
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
      
      const historyRecord = {
        date: now.toISOString(),
        type: 'NUMERIC_UPDATE',
        value,
        change,
        note: note || undefined
      };
      
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          const isDecrease = config.direction === 'DECREASE';
          const totalChange = Math.abs(config.targetValue - config.startValue);
          const rawChange = value - config.startValue;
          const effectiveChange = isDecrease 
            ? Math.max(0, -rawChange)
            : Math.max(0, rawChange);
          const totalPercentage = totalChange > 0 
            ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) 
            : 0;
          
          const totalCycles = goalDetail.totalCycles || 1;
          const perCycleTarget = config.perCycleTarget || (totalChange / totalCycles);
          
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
          
          const rawCycleChange = value - cycleStartValue;
          const effectiveCycleChange = isDecrease 
            ? Math.max(0, -rawCycleChange)
            : Math.max(0, rawCycleChange);
          const cyclePercentage = perCycleTarget > 0 
            ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) 
            : 0;
          
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
          
          // 检查欠账快照逻辑
          const cycleSnapshots = goal.cycleSnapshots || [];
          if (cycleSnapshots.length > 0 && cyclePercentage >= 100) {
            const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
            
            if (lastSnapshot.completionRate !== undefined && lastSnapshot.completionRate < 100) {
              const previousCycleTarget = lastSnapshot.targetValue;
              
              let reachedLastTarget = false;
              if (isDecrease) {
                reachedLastTarget = value <= previousCycleTarget;
              } else {
                reachedLastTarget = value >= previousCycleTarget;
              }
              
              if (!reachedLastTarget) {
                const simulatedToday = getSimulatedToday(goalDetail);
                const cycleEnd = new Date(cycleInfo.endDate);
                const today = new Date(simulatedToday);
                const remainingDays = Math.floor((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                if (remainingDays > goalDetail.cycleDays / 2 && !goal.previousCycleDebtSnapshot) {
                  const colorScheme = getRandomColorScheme();
                  goal.previousCycleDebtSnapshot = {
                    cycleNumber: lastSnapshot.cycleNumber,
                    targetValue: previousCycleTarget,
                    createdAt: new Date().toISOString(),
                    currentCycleNumber: cycleInfo.cycleNumber,
                    currentCycleProgress: cyclePercentage,
                    bgColor: colorScheme.bgColor,
                    progressColor: colorScheme.progressColor,
                    borderColor: colorScheme.borderColor,
                    debtCycleSnapshot: {
                      startDate: lastSnapshot.startDate,
                      endDate: lastSnapshot.endDate,
                      startValue: cycleStartValue,
                      actualValue: lastSnapshot.actualValue,
                      completionRate: lastSnapshot.completionRate,
                      unit: config.unit,
                      perCycleTarget: config.perCycleTarget || 0
                    }
                  };
                }
              } else {
                goal.previousCycleDebtSnapshot = undefined;
              }
            }
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
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
            if (updates.status) {
              items[itemIndex].status = updates.status;
              if (updates.status === 'COMPLETED') {
                items[itemIndex].completedAt = formatLocalDate(new Date());
              }
            }
            if (updates.subProgress) {
              items[itemIndex].subProgress = updates.subProgress;
            }
            
            goals[goalIndex].checklistConfig.items = items;
            
            const completedCount = items.filter((item: ChecklistItem) => item.status === 'COMPLETED').length;
            goals[goalIndex].checklistConfig.completedItems = completedCount;
            
            // 计算并更新清单型任务的进度
            if (goals[goalIndex].mainlineTask?.mainlineType === 'CHECKLIST') {
              const mainlineTask = goals[goalIndex].mainlineTask;
              const totalItems = goals[goalIndex].checklistConfig.totalItems;
              const perCycleTarget = goals[goalIndex].checklistConfig.perCycleTarget;
              const currentCycle = mainlineTask.cycleConfig?.currentCycle || 1;
              
              const currentCycleCompleted = items.filter(
                (item: ChecklistItem) => item.status === 'COMPLETED' && item.cycle === currentCycle
              ).length;
              
              const currentCyclePercentage = Math.min(100, Math.round((currentCycleCompleted / perCycleTarget) * 100));
              const totalPercentage = Math.round((completedCount / totalItems) * 100);
              
              const progress = {
                currentCyclePercentage,
                totalPercentage
              };
              
              if (goals[goalIndex].mainlineTask) {
                goals[goalIndex].mainlineTask.progress = { 
                  ...goals[goalIndex].mainlineTask.progress, 
                  ...progress 
                };
              }
              goals[goalIndex].progress = { 
                ...goals[goalIndex].progress, 
                ...progress 
              };
            }
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            setGoalDetail({
              ...goalDetail,
              checklistConfig: {
                ...config,
                items,
                completedItems: completedCount
              }
            });
            
            onDataChange?.();
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
  }, [goalDetail, goalId, checkInLoading, onDataChange]);
  
  useEffect(() => {
    fetchGoalDetail();
  }, [fetchGoalDetail]);
  
  // Debug: 进入下一个周期
  const debugNextCycle = useCallback(async () => {
    if (!goalDetail) return false;
    
    const currentCycleInfo = getCurrentCycle(goalDetail);
    
    if (currentCycleInfo.cycleNumber >= goalDetail.totalCycles) {
      console.log('已经是最后一个周期，计划已结束');
      return false;
    }
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          const cycleSnapshots = goal.cycleSnapshots || [];
          if (goalDetail.numericConfig) {
            const config = goalDetail.numericConfig;
            const { startValue, targetValue: finalTarget, direction, currentValue } = config;
            const totalChange = Math.abs(finalTarget - startValue);
            const remainingCyclesBeforeSnapshot = goalDetail.totalCycles - (cycleSnapshots.length || 0);
            const changePerCycle = totalChange / remainingCyclesBeforeSnapshot;
            
            const cycleIndexInCurrentPlan = currentCycleInfo.cycleNumber - (cycleSnapshots.length || 0);
            let cycleTargetValue: number;
            if (direction === 'DECREASE') {
              cycleTargetValue = startValue - (changePerCycle * cycleIndexInCurrentPlan);
            } else {
              cycleTargetValue = startValue + (changePerCycle * cycleIndexInCurrentPlan);
            }
            
            const targetChangeForCycle = Math.abs(cycleTargetValue - startValue);
            const actualChangeFromStart = direction === 'DECREASE' 
              ? startValue - currentValue 
              : currentValue - startValue;
            const completionRate = targetChangeForCycle > 0 
              ? Math.min(100, Math.max(0, Math.round((actualChangeFromStart / targetChangeForCycle) * 100)))
              : 0;
            
            cycleSnapshots.push({
              cycleNumber: currentCycleInfo.cycleNumber,
              startDate: currentCycleInfo.startDate,
              endDate: currentCycleInfo.endDate,
              targetValue: parseFloat(cycleTargetValue.toFixed(1)),
              actualValue: parseFloat(currentValue.toFixed(1)),
              completionRate,
              unit: config.unit
            });
            
            goal.cycleSnapshots = cycleSnapshots;
          } else if (goalDetail.checkInConfig) {
            const config = goalDetail.checkInConfig;
            const unit = config.unit || 'TIMES';
            
            const cycleCheckIns = (goalDetail.checkIns || []).filter((c: CheckIn) => {
              return c.date >= currentCycleInfo.startDate && c.date <= currentCycleInfo.endDate;
            });
            
            let targetValue: number;
            let actualValue: number;
            let unitLabel: string;
            
            if (unit === 'TIMES') {
              targetValue = config.cycleTargetTimes || config.perCycleTarget || currentCycleInfo.requiredCheckIns;
              actualValue = cycleCheckIns.length;
              unitLabel = '次';
            } else if (unit === 'DURATION') {
              targetValue = config.cycleTargetMinutes || config.perCycleTarget || 150;
              actualValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
              unitLabel = '分钟';
            } else {
              targetValue = config.cycleTargetValue || config.perCycleTarget || 0;
              actualValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
              unitLabel = config.valueUnit || '个';
            }
            
            const completionRate = targetValue > 0 
              ? Math.min(100, Math.round((actualValue / targetValue) * 100))
              : 0;
            
            cycleSnapshots.push({
              cycleNumber: currentCycleInfo.cycleNumber,
              startDate: currentCycleInfo.startDate,
              endDate: currentCycleInfo.endDate,
              targetValue,
              actualValue,
              completionRate,
              unit: unitLabel
            });
            
            goal.cycleSnapshots = cycleSnapshots;
          } else {
            cycleSnapshots.push({
              cycleNumber: currentCycleInfo.cycleNumber,
              startDate: currentCycleInfo.startDate,
              endDate: currentCycleInfo.endDate,
              targetValue: 0,
              actualValue: 0,
              completionRate: 0,
              unit: ''
            });
            goal.cycleSnapshots = cycleSnapshots;
          }
          
          let updatedNumericConfig = goalDetail.numericConfig;
          const remainingCycles = goalDetail.totalCycles - currentCycleInfo.cycleNumber;
          
          let newStatus = goalDetail.status;
          if (remainingCycles === 0) {
            newStatus = 'completed';
            goal.status = 'completed';
            goal.completedAt = new Date().toISOString();
            if (goal.mainlineTask) {
              goal.mainlineTask.status = 'completed';
            }
          }
          
          if (goalDetail.numericConfig && remainingCycles > 0) {
            const config = goalDetail.numericConfig;
            const currentValue = config.currentValue;
            const finalTarget = config.targetValue;
            const originalPerCycleTarget = config.perCycleTarget;
            
            const remainingChange = Math.abs(finalTarget - currentValue);
            let newPerCycleTarget = remainingChange / remainingCycles;
            
            const origPerCycleTarget = config.originalPerCycleTarget || originalPerCycleTarget;
            newPerCycleTarget = Math.max(newPerCycleTarget, origPerCycleTarget);
            
            updatedNumericConfig = {
              ...config,
              startValue: currentValue,
              perCycleTarget: newPerCycleTarget,
              originalStartValue: config.originalStartValue || config.startValue,
              originalPerCycleTarget: origPerCycleTarget
            };
            
            goal.numericConfig = updatedNumericConfig;
            if (goal.mainlineTask?.numericConfig) {
              goal.mainlineTask.numericConfig = updatedNumericConfig;
            }
          }
          
          const newCycleNumber = currentCycleInfo.cycleNumber + 1;
          const startDate = new Date(goalDetail.startDate);
          const newCycleStartDay = (newCycleNumber - 1) * goalDetail.cycleDays;
          const newCycleStartDate = new Date(startDate);
          newCycleStartDate.setDate(startDate.getDate() + newCycleStartDay);
          
          const realTodayForOffset = new Date();
          realTodayForOffset.setHours(0, 0, 0, 0);
          newCycleStartDate.setHours(0, 0, 0, 0);
          const newCycleOffset = Math.floor((newCycleStartDate.getTime() - realTodayForOffset.getTime()) / (1000 * 60 * 60 * 24));
          
          if (goal.mainlineTask?.cycleConfig) {
            goal.mainlineTask.cycleConfig.currentCycle = newCycleNumber;
          }
          if (goal.cycleConfig) {
            goal.cycleConfig.currentCycle = newCycleNumber;
          }
          
          goal.debugDayOffset = newCycleOffset;
          if (goal.mainlineTask) {
            goal.mainlineTask.debugDayOffset = newCycleOffset;
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          setGoalDetail({
            ...goalDetail,
            numericConfig: updatedNumericConfig,
            checkInConfig: goalDetail.checkInConfig,
            cycleSnapshots,
            status: newStatus,
            debugDayOffset: newCycleOffset
          });
          
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
  
  // Debug: 进入下一天
  const debugNextDay = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          const currentOffset = goal.debugDayOffset || 0;
          const newOffset = currentOffset + 1;
          
          const realToday = new Date();
          realToday.setDate(realToday.getDate() + newOffset);
          const newSimulatedToday = realToday;
          
          const startDate = new Date(goalDetail.startDate);
          const realElapsedDays = Math.floor(
            (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const snapshotCount = goal.cycleSnapshots?.length || 0;
          const realCycleNumber = Math.floor(realElapsedDays / goalDetail.cycleDays) + 1;
          const currentCycleNumber = Math.min(Math.max(realCycleNumber, snapshotCount + 1), goalDetail.totalCycles);
          const cycleEndDay = currentCycleNumber * goalDetail.cycleDays;
          const currentCycleEnd = new Date(startDate);
          currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
          
          const shouldEnterNextCycle = newSimulatedToday > currentCycleEnd && currentCycleNumber < goalDetail.totalCycles;
          
          if (shouldEnterNextCycle) {
            const cycleSnapshots = goal.cycleSnapshots || [];
            const currentCycleInfo = getCurrentCycle(goalDetail);
            
            if (goalDetail.checkInConfig) {
              const config = goalDetail.checkInConfig;
              const unit = config.unit || 'TIMES';
              
              const effectiveCycleEnd = getSimulatedToday(goalDetail) > currentCycleInfo.endDate 
                ? getSimulatedToday(goalDetail) 
                : currentCycleInfo.endDate;
              const cycleCheckIns = (goalDetail.checkIns || []).filter((c: CheckIn) => {
                return c.date >= currentCycleInfo.startDate && c.date <= effectiveCycleEnd;
              });
              
              let targetValue: number;
              let actualValue: number;
              let unitLabel: string;
              
              if (unit === 'TIMES') {
                targetValue = config.cycleTargetTimes || config.perCycleTarget || currentCycleInfo.requiredCheckIns;
                actualValue = cycleCheckIns.length;
                unitLabel = '次';
              } else if (unit === 'DURATION') {
                targetValue = config.cycleTargetMinutes || config.perCycleTarget || 150;
                actualValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
                unitLabel = '分钟';
              } else {
                targetValue = config.cycleTargetValue || config.perCycleTarget || 0;
                actualValue = cycleCheckIns.reduce((sum: number, c: CheckIn) => sum + (c.value || 0), 0);
                unitLabel = config.valueUnit || '个';
              }
              
              const completionRate = targetValue > 0 
                ? Math.min(100, Math.round((actualValue / targetValue) * 100))
                : 0;
              
              cycleSnapshots.push({
                cycleNumber: currentCycleInfo.cycleNumber,
                startDate: currentCycleInfo.startDate,
                endDate: currentCycleInfo.endDate,
                targetValue,
                actualValue,
                completionRate,
                unit: unitLabel
              });
              
              goal.cycleSnapshots = cycleSnapshots;
            }
            
            const newCycleNumber = currentCycleNumber + 1;
            const newCycleStartDay = (newCycleNumber - 1) * goalDetail.cycleDays;
            const newCycleStartDate = new Date(startDate);
            newCycleStartDate.setDate(startDate.getDate() + newCycleStartDay);
            
            const realTodayForOffset = new Date();
            realTodayForOffset.setHours(0, 0, 0, 0);
            newCycleStartDate.setHours(0, 0, 0, 0);
            const newCycleOffset = Math.floor((newCycleStartDate.getTime() - realTodayForOffset.getTime()) / (1000 * 60 * 60 * 24));
            
            if (goal.mainlineTask?.cycleConfig) {
              goal.mainlineTask.cycleConfig.currentCycle = newCycleNumber;
            }
            if (goal.cycleConfig) {
              goal.cycleConfig.currentCycle = newCycleNumber;
            }
            
            goal.debugDayOffset = newCycleOffset;
            if (goal.mainlineTask) {
              goal.mainlineTask.debugDayOffset = newCycleOffset;
            }
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            setGoalDetail({
              ...goalDetail,
              debugDayOffset: newCycleOffset,
              cycleSnapshots
            });
            
            onDataChange?.();
            return { success: true, enteredNextCycle: true };
          } else {
            goal.debugDayOffset = newOffset;
            if (goal.mainlineTask) {
              goal.mainlineTask.debugDayOffset = newOffset;
            }
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            setGoalDetail({
              ...goalDetail,
              debugDayOffset: newOffset
            });
            
            onDataChange?.();
            return { success: true, enteredNextCycle: false };
          }
        }
      }
      return { success: false, enteredNextCycle: false };
    } catch (error) {
      console.error('Debug进入下一天失败:', error);
      return { success: false, enteredNextCycle: false };
    }
  }, [goalDetail, goalId, onDataChange]);
  
  // 提前结束任务
  const endPlanEarly = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          goal.status = 'completed';
          goal.completedAt = new Date().toISOString();
          if (goal.mainlineTask) {
            goal.mainlineTask.status = 'completed';
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          setGoalDetail({
            ...goalDetail,
            status: 'completed'
          });
          
          onDataChange?.();
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('提前结束任务失败:', error);
      return false;
    }
  }, [goalDetail, goalId, onDataChange]);
  
  // 归档任务
  const archiveTask = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          goal.status = 'archived';
          goal.archivedAt = new Date().toISOString();
          if (goal.mainlineTask) {
            goal.mainlineTask.status = 'ARCHIVED';
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          setGoalDetail({
            ...goalDetail,
            status: 'archived'
          });
          
          onDataChange?.();
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('归档任务失败:', error);
      return false;
    }
  }, [goalDetail, goalId, onDataChange]);
  
  return { 
    goalDetail, 
    loading,
    checkInLoading,
    refetch: fetchGoalDetail,
    checkIn,
    getTodayCheckInStatus,
    recordNumericData,
    updateChecklistItem,
    debugNextCycle,
    debugNextDay,
    endPlanEarly,
    archiveTask
  };
}
