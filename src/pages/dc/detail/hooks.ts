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
  
  // 打卡功能 - 支持次数型、时长型、数值型打卡
  const checkIn = useCallback(async (value?: number, note?: string) => {
    if (!goalDetail || checkInLoading) return false;
    
    setCheckInLoading(true);
    try {
      // 使用模拟的"今天"日期
      const simulatedToday = getSimulatedToday(goalDetail);
      const now = new Date();
      const config = goalDetail.checkInConfig;
      
      // 使用模拟日期作为打卡日期
      const effectiveToday = simulatedToday;
      
      // 检查是否达到单日上限（使用有效的"今日"日期）
      const todayCheckIns = (goalDetail.checkIns || []).filter(c => c.date === effectiveToday);
      
      if (config) {
        const unit = config.unit;
        if (unit === 'TIMES') {
          // 次数型：检查单日打卡次数上限
          const dailyMax = config.dailyMaxTimes || 1;
          if (todayCheckIns.length >= dailyMax) {
            console.log('今日已达到打卡上限');
            return false;
          }
        } else if (unit === 'DURATION') {
          // 时长型：检查单日时长上限
          const dailyTarget = config.dailyTargetMinutes || 15;
          const todayTotal = todayCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          if (todayTotal >= dailyTarget) {
            console.log('今日已达到时长目标');
            return false;
          }
        } else if (unit === 'QUANTITY') {
          // 数值型：检查单日数值上限
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
        value: value, // 时长(分钟)或数值
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
          
          // 更新连续打卡统计 - 优先从 mainlineTask读取checkInConfig
          const checkInConfig = goals[goalIndex].mainlineTask?.checkInConfig || goals[goalIndex].checkInConfig;
          if (checkInConfig) {
            const checkIns = goals[goalIndex].checkIns;
            const uniqueDates = [...new Set(checkIns.map((c: CheckIn) => c.date))].sort();
            
            // 计算当前连续打卡天数（使用模拟的"今日"日期）
            // 从模拟的"今日"日期开始，向前查找连续打卡天数
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
            
            // 同步更新到mainlineTask
            if (goals[goalIndex].mainlineTask?.checkInConfig) {
              goals[goalIndex].mainlineTask.checkInConfig = checkInConfig;
            }
            goals[goalIndex].checkInConfig = checkInConfig;
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态
          setGoalDetail({
            ...goalDetail,
            checkIns: [...(goalDetail.checkIns || []), newCheckIn],
            checkInConfig: goals[goalIndex].checkInConfig
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
  
  // 获取今日打卡状态
  const getTodayCheckInStatus = useCallback(() => {
    if (!goalDetail) return { canCheckIn: false, todayCount: 0, todayValue: 0, isCompleted: false };
    
    // 使用模拟的"今天"日期
    const effectiveToday = getSimulatedToday(goalDetail);
    
    const todayCheckIns = (goalDetail.checkIns || []).filter(c => c.date === effectiveToday);
    const config = goalDetail.checkInConfig;
    
    if (!config) {
      return {
        canCheckIn: todayCheckIns.length === 0,
        todayCount: todayCheckIns.length,
        todayValue: 0,
        isCompleted: todayCheckIns.length > 0
      };
    }
    
    const unit = config.unit;
    const todayValue = todayCheckIns.reduce((sum, c) => sum + (c.value || 1), 0);
    
    if (unit === 'TIMES') {
      const dailyMax = config.dailyMaxTimes || 1;
      return {
        canCheckIn: todayCheckIns.length < dailyMax,
        todayCount: todayCheckIns.length,
        todayValue: todayCheckIns.length,
        isCompleted: todayCheckIns.length >= dailyMax,
        dailyTarget: dailyMax
      };
    } else if (unit === 'DURATION') {
      const dailyTarget = config.dailyTargetMinutes || 15;
      return {
        canCheckIn: todayValue < dailyTarget,
        todayCount: todayCheckIns.length,
        todayValue,
        isCompleted: todayValue >= dailyTarget,
        dailyTarget
      };
    } else if (unit === 'QUANTITY') {
      const dailyTarget = config.dailyTargetValue || 0;
      return {
        canCheckIn: dailyTarget === 0 || todayValue < dailyTarget,
        todayCount: todayCheckIns.length,
        todayValue,
        isCompleted: dailyTarget > 0 && todayValue >= dailyTarget,
        dailyTarget
      };
    }
    
    return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false };
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
                items[itemIndex].completedAt = formatLocalDate(new Date());
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
    
    // 获取当前周期信息
    const currentCycleInfo = getCurrentCycle(goalDetail);
    
    // 检查是否已经是最后一个周期，如果是则不允许继续
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
          } else if (goalDetail.checkInConfig) {
            // 打卡型任务的周期快照
            const config = goalDetail.checkInConfig;
            const unit = config.unit || 'TIMES';
            
            // 获取当前周期的打卡数据
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
            // 既没有numericConfig也没有checkInConfig，仍然添加一个基本快照
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
          
          // 不修改startDate，保持时间周期不变
          // 通过cycleSnapshots来标记已完成的周期
          
          // 更新numericConfig中的startValue用于后续周期的目标计算
          let updatedNumericConfig = goalDetail.numericConfig;
          const remainingCycles = goalDetail.totalCycles - currentCycleInfo.cycleNumber;
          
          // 检查是否是最后一个周期，如果是则标记任务完成
          let newStatus = goalDetail.status;
          if (remainingCycles === 0) {
            // 这是最后一个周期，标记任务为已完成
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
          
          // 计算新周期第一天相对于真实今天的偏移量
          const newCycleNumber = currentCycleInfo.cycleNumber + 1;
          const startDate = new Date(goalDetail.startDate);
          const newCycleStartDay = (newCycleNumber - 1) * goalDetail.cycleDays;
          const newCycleStartDate = new Date(startDate);
          newCycleStartDate.setDate(startDate.getDate() + newCycleStartDay);
          
          const realTodayForOffset = new Date();
          realTodayForOffset.setHours(0, 0, 0, 0);
          newCycleStartDate.setHours(0, 0, 0, 0);
          const newCycleOffset = Math.floor((newCycleStartDate.getTime() - realTodayForOffset.getTime()) / (1000 * 60 * 60 * 24));
          
          goal.debugDayOffset = newCycleOffset;
          if (goal.mainlineTask) {
            goal.mainlineTask.debugDayOffset = newCycleOffset;
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态
          setGoalDetail({
            ...goalDetail,
            numericConfig: updatedNumericConfig,
            checkInConfig: goalDetail.checkInConfig,
            cycleSnapshots,
            status: newStatus,
            debugDayOffset: newCycleOffset
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
  
  // Debug: 进入下一天（模拟时间推进一天）
  // 如果模拟日期超出当前周期结束日期，自动进入下一周期
  const debugNextDay = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          // 增加模拟天数偏移
          const currentOffset = goal.debugDayOffset || 0;
          const newOffset = currentOffset + 1;
          
          // 计算新的模拟日期
          const realToday = new Date();
          realToday.setDate(realToday.getDate() + newOffset);
          const newSimulatedToday = realToday;
          
          // 计算当前周期的结束日期
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
          
          // 检查新的模拟日期是否超出当前周期结束日期
          const shouldEnterNextCycle = newSimulatedToday > currentCycleEnd && currentCycleNumber < goalDetail.totalCycles;
          
          if (shouldEnterNextCycle) {
            // 自动进入下一周期：保存当前周期快照
            const cycleSnapshots = goal.cycleSnapshots || [];
            
            // 获取当前周期信息
            const currentCycleInfo = getCurrentCycle(goalDetail);
            
            if (goalDetail.checkInConfig) {
              // 打卡型任务的周期快照
              const config = goalDetail.checkInConfig;
              const unit = config.unit || 'TIMES';
              
              // 获取当前周期的打卡数据（包含模拟日期的打卡）
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
            
            // 计算新周期第一天相对于真实今天的偏移量
            // 新周期编号 = 当前周期编号 + 1
            const newCycleNumber = currentCycleNumber + 1;
            const newCycleStartDay = (newCycleNumber - 1) * goalDetail.cycleDays;
            const newCycleStartDate = new Date(startDate);
            newCycleStartDate.setDate(startDate.getDate() + newCycleStartDay);
            
            // 计算新周期第一天相对于真实今天的偏移量
            const realTodayForOffset = new Date();
            realTodayForOffset.setHours(0, 0, 0, 0);
            newCycleStartDate.setHours(0, 0, 0, 0);
            const newCycleOffset = Math.floor((newCycleStartDate.getTime() - realTodayForOffset.getTime()) / (1000 * 60 * 60 * 24));
            
            goal.debugDayOffset = newCycleOffset;
            if (goal.mainlineTask) {
              goal.mainlineTask.debugDayOffset = newCycleOffset;
            }
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            // 更新状态
            setGoalDetail({
              ...goalDetail,
              debugDayOffset: newCycleOffset,
              cycleSnapshots
            });
            
            onDataChange?.();
            return { success: true, enteredNextCycle: true };
          } else {
            // 正常增加天数偏移
            goal.debugDayOffset = newOffset;
            if (goal.mainlineTask) {
              goal.mainlineTask.debugDayOffset = newOffset;
            }
            
            localStorage.setItem('dc_tasks', JSON.stringify(goals));
            
            // 更新状态
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
  
  // 提前结束任务（在当前周期直接结束，不进入下一周期）
  const endPlanEarly = useCallback(async () => {
    if (!goalDetail) return false;
    
    try {
      const storedGoals = localStorage.getItem('dc_tasks');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const goalIndex = goals.findIndex((g: any) => g.id === goalId);
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          
          // 直接标记任务为已完成，不保存周期快照
          goal.status = 'completed';
          goal.completedAt = new Date().toISOString();
          if (goal.mainlineTask) {
            goal.mainlineTask.status = 'completed';
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态
          setGoalDetail({
            ...goalDetail,
            status: 'completed'
          });
          
          // 通知外部数据变化
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
          
          // 标记任务为已归档
          goal.status = 'archived';
          goal.archivedAt = new Date().toISOString();
          if (goal.mainlineTask) {
            goal.mainlineTask.status = 'ARCHIVED';
          }
          
          localStorage.setItem('dc_tasks', JSON.stringify(goals));
          
          // 更新状态
          setGoalDetail({
            ...goalDetail,
            status: 'archived'
          });
          
          // 通知外部数据变化
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

// 将 Date 对象格式化为本地时区的 YYYY-MM-DD 字符串
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取模拟的"今天"日期（考虑debugDayOffset偏移，使用本地时区）
export function getSimulatedToday(goalDetail: GoalDetail): string {
  const realToday = new Date();
  const offset = goalDetail.debugDayOffset || 0;
  realToday.setDate(realToday.getDate() + offset);
  return formatLocalDate(realToday);
}

// 获取模拟的"今天"Date对象
export function getSimulatedTodayDate(goalDetail: GoalDetail): Date {
  const realToday = new Date();
  const offset = goalDetail.debugDayOffset || 0;
  realToday.setDate(realToday.getDate() + offset);
  return realToday;
}

export function getCurrentCycle(goalDetail: GoalDetail): CurrentCycleInfo {
  // 如果缺少必要字段,返回默认值
  if (!goalDetail.startDate || !goalDetail.cycleDays || !goalDetail.totalCycles || !goalDetail.minCheckInsPerCycle) {
    const today = getSimulatedToday(goalDetail);
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
  
  // 获取模拟的"今天"日期
  const simulatedToday = getSimulatedTodayDate(goalDetail);
  // 获取真实的今天日期
  const realToday = new Date();
  const startDate = new Date(goalDetail.startDate);
  
  // 基于真实日期计算周期编号（保持周期稳定）
  const realElapsedDays = Math.floor(
    (realToday.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 考虑debug模拟跳过的周期数
  const snapshotCount = goalDetail.cycleSnapshots?.length || 0;
  
  // 计算基于真实时间的周期编号
  const realCycleNumber = Math.floor(realElapsedDays / goalDetail.cycleDays) + 1;
  
  // 当前周期编号 = max(基于真实时间的周期, 快照数+1)
  const currentCycleNumber = Math.min(Math.max(realCycleNumber, snapshotCount + 1), goalDetail.totalCycles);
  
  // 计算当前周期的起始天数
  const cycleStartDay = (currentCycleNumber - 1) * goalDetail.cycleDays;
  const cycleEndDay = cycleStartDay + goalDetail.cycleDays - 1;
  
  // 计算当前周期的开始和结束日期
  const currentCycleStart = new Date(startDate);
  currentCycleStart.setDate(startDate.getDate() + cycleStartDay);
  
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  
  // 扩展周期日期范围以包含模拟日期的打卡
  // 起始日期取较小值，结束日期取较大值
  const effectiveCycleStart = simulatedToday < currentCycleStart ? simulatedToday : currentCycleStart;
  const effectiveCycleEnd = simulatedToday > currentCycleEnd ? simulatedToday : currentCycleEnd;
  
  // 计算剩余天数（基于原始周期结束日期和模拟日期）
  const remainingDays = Math.max(0, Math.floor((currentCycleEnd.getTime() - simulatedToday.getTime()) / (1000 * 60 * 60 * 24)));
  
  // 获取本周期的打卡记录（使用扩展后的周期日期范围）
  const checkIns = goalDetail.checkIns || [];
  const checkInDates = checkIns
    .filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= effectiveCycleStart && checkInDate <= effectiveCycleEnd;
    })
    .map(checkIn => checkIn.date);
  
  return {
    cycleNumber: currentCycleNumber,
    totalCycles: goalDetail.totalCycles,
    startDate: formatLocalDate(currentCycleStart),
    endDate: formatLocalDate(currentCycleEnd),
    checkInCount: checkInDates.length,
    requiredCheckIns: goalDetail.minCheckInsPerCycle,
    remainingDays,
    checkInDates
  };
}

