import { useState, useEffect, useCallback } from 'react';
import type { GoalDetail, CurrentCycleInfo, CheckIn } from './types';

export function useGoalDetail(goalId: string) {
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
          setGoalDetail(goal);
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
  
  useEffect(() => {
    fetchGoalDetail();
  }, [fetchGoalDetail]);
  
  return { 
    goalDetail, 
    loading,
    checkInLoading,
    refetch: fetchGoalDetail,
    checkIn
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
  
  // 计算当前周期编号（从1开始）
  const currentCycleNumber = Math.floor(elapsedDays / goalDetail.cycleDays) + 1;
  
  // 计算当前周期的起始天数
  const cycleStartDay = (currentCycleNumber - 1) * goalDetail.cycleDays;
  const cycleEndDay = cycleStartDay + goalDetail.cycleDays - 1;
  
  // 计算当前周期的开始和结束日期
  const currentCycleStart = new Date(startDate);
  currentCycleStart.setDate(startDate.getDate() + cycleStartDay);
  
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  
  // 计算剩余天数
  const remainingDays = Math.max(0, cycleEndDay - elapsedDays);
  
  // 获取本周期的打卡记录
  const checkIns = goalDetail.checkIns || [];
  const checkInDates = checkIns
    .filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= currentCycleStart && checkInDate <= currentCycleEnd;
    })
    .map(checkIn => checkIn.date);
  
  return {
    cycleNumber: currentCycleNumber,
    totalCycles: goalDetail.totalCycles,
    startDate: currentCycleStart.toISOString().split('T')[0],
    endDate: currentCycleEnd.toISOString().split('T')[0],
    checkInCount: checkInDates.length,
    requiredCheckIns: goalDetail.minCheckInsPerCycle,
    remainingDays,
    checkInDates
  };
}

