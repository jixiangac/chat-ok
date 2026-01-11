import { getSimulatedToday } from './dateUtils';

// 独立的获取今日打卡状态函数，可以传入任意任务详情数据
export function getTodayCheckInStatusForTask(taskDetail: any): { 
  canCheckIn: boolean; 
  todayCount: number; 
  todayValue: number; 
  isCompleted: boolean; 
  dailyTarget?: number 
} {
  const targetGoalDetail = taskDetail;
  if (!targetGoalDetail) return { canCheckIn: false, todayCount: 0, todayValue: 0, isCompleted: false };
  
  // 使用模拟的"今天"日期
  const effectiveToday = getSimulatedToday(targetGoalDetail);
  
  const todayCheckIns = (targetGoalDetail.checkIns || []).filter((c: any) => c.date === effectiveToday);
  const config = targetGoalDetail.checkInConfig;
  
  if (!config) {
    return {
      canCheckIn: todayCheckIns.length === 0,
      todayCount: todayCheckIns.length,
      todayValue: 0,
      isCompleted: todayCheckIns.length > 0
    };
  }
  
  const unit = config.unit;
  const todayValue = todayCheckIns.reduce((sum: number, c: any) => sum + (c.value || 1), 0);
  
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
}
