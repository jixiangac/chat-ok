import type { Task } from '../../../types';
import type { CurrentCycleInfo } from '../types';
import { getCurrentDate } from '../../../utils/dateTracker';

// 将 Date 对象格式化为本地时区的 YYYY-MM-DD 字符串
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取模拟的"今天"日期（考虑测试日期和debugDayOffset偏移，使用本地时区）
// 优先使用全局测试日期，其次使用任务级别的debugDayOffset
export function getSimulatedToday(task?: Task | any): string {
  // 优先使用全局测试日期
  const currentDate = getCurrentDate();
  const offset = task ? ((task as any).debugDayOffset || 0) : 0;
  
  if (offset === 0) {
    return currentDate;
  }
  
  // 如果有偏移量，在当前日期基础上计算
  const date = new Date(currentDate);
  date.setDate(date.getDate() + offset);
  return formatLocalDate(date);
}

// 获取模拟的"今天"Date对象
export function getSimulatedTodayDate(task?: Task | any): Date {
  // 优先使用全局测试日期
  const currentDate = getCurrentDate();
  const offset = task ? ((task as any).debugDayOffset || 0) : 0;
  
  const date = new Date(currentDate);
  if (offset !== 0) {
    date.setDate(date.getDate() + offset);
  }
  return date;
}

// 获取当前周期信息
// 支持新旧格式
export function getCurrentCycle(task: Task | any): CurrentCycleInfo {
  // 支持新格式
  const startDateStr = task.time?.startDate || task.startDate;
  const cycleDays = task.cycle?.cycleDays || task.cycleDays;
  const totalCycles = task.cycle?.totalCycles || task.totalCycles;
  const currentCycleFromTask = task.cycle?.currentCycle;
  const minCheckInsPerCycle = task.checkInConfig?.perCycleTarget || 
                               task.minCheckInsPerCycle || 
                               3;
  
  // 如果缺少必要字段,返回默认值
  if (!startDateStr || !cycleDays || !totalCycles) {
    const today = getSimulatedToday(task);
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
  const simulatedToday = getSimulatedTodayDate(task);
  const startDate = new Date(startDateStr);
  
  // 如果新格式有 currentCycle，直接使用
  let currentCycleNumber = currentCycleFromTask;
  
  if (!currentCycleNumber) {
    // 兼容旧格式：基于时间计算（使用系统日期，支持测试日期）
    const elapsedDays = Math.floor(
      (simulatedToday.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // 考虑debug模拟跳过的周期数（从 activities 中提取）
    const snapshotCount = task.activities?.filter((a: any) => a.type === 'CYCLE_ADVANCE').length || 
                          task.cycleSnapshots?.length || 0;
    
    const calculatedCycleNumber = Math.floor(elapsedDays / cycleDays) + 1;
    currentCycleNumber = Math.min(Math.max(calculatedCycleNumber, snapshotCount + 1), totalCycles);
  }
  
  // 计算当前周期的起始天数
  const cycleStartDay = (currentCycleNumber - 1) * cycleDays;
  const cycleEndDay = cycleStartDay + cycleDays - 1;
  
  // 计算当前周期的开始和结束日期
  const currentCycleStart = new Date(startDate);
  currentCycleStart.setDate(startDate.getDate() + cycleStartDay);
  
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  
  // 扩展周期日期范围以包含模拟日期的打卡
  const effectiveCycleStart = simulatedToday < currentCycleStart ? simulatedToday : currentCycleStart;
  const effectiveCycleEnd = simulatedToday > currentCycleEnd ? simulatedToday : currentCycleEnd;
  
  // 计算剩余天数
  const remainingDays = Math.max(0, Math.floor((currentCycleEnd.getTime() - simulatedToday.getTime()) / (1000 * 60 * 60 * 24)));
  
  // 获取本周期的打卡记录
  const checkInConfig = task.checkInConfig;
  let checkInDates: string[] = [];
  
  if (checkInConfig?.records) {
    // 新格式：从 checkInConfig.records 获取
    checkInDates = checkInConfig.records
      .filter((r: any) => {
        const recordDate = new Date(r.date);
        return recordDate >= effectiveCycleStart && recordDate <= effectiveCycleEnd && r.checked;
      })
      .map((r: any) => r.date);
  } else {
    // 旧格式：从 checkIns 获取
    const checkIns = task.checkIns || [];
    checkInDates = checkIns
      .filter((checkIn: any) => {
        const checkInDate = new Date(checkIn.date);
        return checkInDate >= effectiveCycleStart && checkInDate <= effectiveCycleEnd;
      })
      .map((checkIn: any) => checkIn.date);
  }
  
  return {
    cycleNumber: currentCycleNumber,
    totalCycles,
    startDate: formatLocalDate(currentCycleStart),
    endDate: formatLocalDate(currentCycleEnd),
    checkInCount: checkInDates.length,
    requiredCheckIns: minCheckInsPerCycle,
    remainingDays,
    checkInDates
  };
}
