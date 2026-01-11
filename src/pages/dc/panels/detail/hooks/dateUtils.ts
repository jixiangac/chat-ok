import type { GoalDetail, CurrentCycleInfo } from '../types';

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

// 获取当前周期信息
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
