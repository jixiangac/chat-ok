import { MainlineTask, Task } from '../types';

/**
 * 计算数值型任务的进度
 */
export function calculateNumericProgress(
  mainlineTask: MainlineTask,
  options?: {
    currentCycleNumber?: number;
    cycleStartValue?: number;
  }): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleStart: number;
  currentCycleTarget: number;
} {
  if (!mainlineTask.numericConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleStart: 0,
      currentCycleTarget: 0
    };
  }

  const { startValue, targetValue, currentValue, perCycleTarget, originalStartValue } = mainlineTask.numericConfig;
  
  // 使用传入的周期编号，否则使用 cycleConfig 中的值
  const currentCycle = options?.currentCycleNumber ?? mainlineTask.cycleConfig.currentCycle;
  const cycleStartValue = options?.cycleStartValue;
  
  // 使用原始起始值计算总进度（如果存在）
  const originalStart = originalStartValue ?? startValue;
  
  // 判断目标方向：减少还是增加
  const isDecrease = targetValue < originalStart;

  // 计算总进度 - 根据方向计算有效变化量（基于原始起始值）
  // 减少目标：只有减少的部分才算完成，增加了则为0
  // 增加目标：只有增加的部分才算完成，减少了则为0
  const totalChange = Math.abs(targetValue - originalStart);
  const rawChange = currentValue - originalStart;
  const effectiveChange = isDecrease 
    ? Math.max(0, -rawChange)  // 减少目标：负变化才有效
    : Math.max(0, rawChange);   // 增加目标：正变化才有效
  const totalProgress = totalChange > 0 
    ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) 
    : 0;

  // 计算本周期起始值和目标值
  // 如果提供了 cycleStartValue，使用它；否则基于周期编号计算
  let currentCycleStart: number;
  if (cycleStartValue !== undefined) {
    currentCycleStart = cycleStartValue;
  } else {
    currentCycleStart = startValue + (perCycleTarget * (currentCycle - 1)) * (isDecrease ? -1 : 1);
  }
  const currentCycleTarget = currentCycleStart + perCycleTarget * (isDecrease ? -1 : 1);

  // 计算本周期进度 - 根据方向计算有效变化量
  const rawCycleChange = currentValue - currentCycleStart;
  const effectiveCycleChange = isDecrease 
    ? Math.max(0, -rawCycleChange)  // 减少目标：负变化才有效
    : Math.max(0, rawCycleChange);   // 增加目标：正变化才有效
  const cycleProgress = perCycleTarget > 0 
    ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) 
    : 0;

  return {
    cycleProgress,
    totalProgress,
    currentCycleStart: Math.round(currentCycleStart * 100) / 100,
    currentCycleTarget: Math.round(currentCycleTarget * 100) / 100
  };
}

/**
 * 计算清单型任务的进度
 */
export function calculateChecklistProgress(mainlineTask: MainlineTask): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleCompleted: number;
  currentCycleTarget: number;
} {
  if (!mainlineTask.checklistConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleCompleted: 0,
      currentCycleTarget: 0
    };
  }

  const { completedItems, totalItems, perCycleTarget, items } = mainlineTask.checklistConfig;
  const { currentCycle } = mainlineTask.cycleConfig;

  // 计算总进度
  const totalProgress = Math.round((completedItems / totalItems) * 100);

  // 计算本周期完成数量
  const currentCycleCompleted = items.filter(
    item => item.status === 'COMPLETED' && item.cycle === currentCycle
  ).length;

  // 计算本周期进度
  const cycleProgress = Math.min(100, Math.round((currentCycleCompleted / perCycleTarget) * 100));

  return {
    cycleProgress,
    totalProgress,
    currentCycleCompleted,
    currentCycleTarget: perCycleTarget
  };
}

/**
 * 计算打卡型任务的进度
 */
export function calculateCheckInProgress(mainlineTask: MainlineTask): {
  cycleProgress: number;
  totalProgress: number;
  currentCycleCheckIns: number;
  totalCheckIns: number;
} {
  if (!mainlineTask.checkInConfig) {
    return {
      cycleProgress: 0,
      totalProgress: 0,
      currentCycleCheckIns: 0,
      totalCheckIns: 0
    };
  }

  const { perCycleTarget, records } = mainlineTask.checkInConfig;
  const { currentCycle, totalCycles, cycleLengthDays } = mainlineTask.cycleConfig;

  // 计算当前周期的日期范围
  const startDate = new Date(mainlineTask.createdAt);
  const currentCycleStartDay = (currentCycle - 1) * cycleLengthDays;
  const currentCycleEndDay = currentCycle * cycleLengthDays;

  const currentCycleStartDate = new Date(startDate);
  currentCycleStartDate.setDate(startDate.getDate() + currentCycleStartDay);

  const currentCycleEndDate = new Date(startDate);
  currentCycleEndDate.setDate(startDate.getDate() + currentCycleEndDay);

  // 统计本周期打卡次数
  const currentCycleCheckIns = records?.filter(record => {
    const recordDate = new Date(record.date);
    return record.checked && 
           recordDate >= currentCycleStartDate && 
           recordDate < currentCycleEndDate;
  }).length || 0;

  // 统计总打卡次数
  const totalCheckIns = records?.filter(record => record.checked).length || 0;

  // 计算进度
  const cycleProgress = Math.min(100, Math.round((currentCycleCheckIns / perCycleTarget) * 100));
  const totalTarget = totalCycles * perCycleTarget;
  const totalProgress = Math.round((totalCheckIns / totalTarget) * 100);

  return {
    cycleProgress,
    totalProgress,
    currentCycleCheckIns,
    totalCheckIns
  };
}

/**
 * 计算剩余天数（基于当前周期结束日期和模拟日期）
 * 与详情页的getCurrentCycle逻辑保持一致
 */
export function calculateRemainingDays(task: Task): number {
  if (!task.startDate || !task.cycleDays || !task.totalCycles) return 0;
  
  const startDate = new Date(task.startDate);
  const now = new Date();
  
  // 考虑debugDayOffset偏移，获取模拟的"今天"
  const debugOffset = (task as any).debugDayOffset || 0;
  const simulatedToday = new Date(now);
  simulatedToday.setDate(simulatedToday.getDate() + debugOffset);
  simulatedToday.setHours(0, 0, 0, 0);
  
  // 基于真实日期计算周期编号
  const realElapsedDays = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 考虑cycleSnapshots数量
  const snapshotCount = (task as any).cycleSnapshots?.length || 0;
  
  // 计算基于真实时间的周期编号
  const realCycleNumber = Math.floor(realElapsedDays / task.cycleDays) + 1;
  
  // 当前周期编号 = max(基于真实时间的周期, 快照数+1)，但不超过总周期数
  const currentCycleNumber = Math.min(Math.max(realCycleNumber, snapshotCount + 1), task.totalCycles);
  
  // 计算当前周期的结束日期
  const cycleEndDay = currentCycleNumber * task.cycleDays - 1;
  const currentCycleEnd = new Date(startDate);
  currentCycleEnd.setDate(startDate.getDate() + cycleEndDay);
  currentCycleEnd.setHours(0, 0, 0, 0);
  
  // 计算剩余天数（基于当前周期结束日期和模拟日期）
  return Math.max(0, Math.floor((currentCycleEnd.getTime() - simulatedToday.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * 检查今日是否已打卡
 */
export function isTodayCheckedIn(mainlineTask: MainlineTask): boolean {
  if (!mainlineTask.checkInConfig?.records) return false;
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return mainlineTask.checkInConfig.records.some(
    record => record.date === today && record.checked
  );
}

/**
 * 更新主线任务进度
 */
export function updateMainlineTaskProgress(mainlineTask: MainlineTask): MainlineTask {
  let updatedProgress = { ...mainlineTask.progress };

  if (mainlineTask.mainlineType === 'NUMERIC') {
    const progress = calculateNumericProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      currentCyclePercentage: progress.cycleProgress,
      currentCycleStart: progress.currentCycleStart,
      currentCycleTarget: progress.currentCycleTarget
    };
  } else if (mainlineTask.mainlineType === 'CHECKLIST') {
    const progress = calculateChecklistProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      currentCyclePercentage: progress.cycleProgress
    };
  } else if (mainlineTask.mainlineType === 'CHECK_IN') {
    const progress = calculateCheckInProgress(mainlineTask);
    updatedProgress = {
      totalPercentage: progress.totalProgress,
      currentCyclePercentage: progress.cycleProgress
    };
  }

  return {
    ...mainlineTask,
    progress: updatedProgress
  };
}

/**
 * 计算当前周期编号（基于cycleSnapshots）
 * 这个函数与详情页的getCurrentCycle逻辑保持一致
 */
export function calculateCurrentCycleNumber(task: Task): number {
  if (!task.startDate || !task.cycleDays || !task.totalCycles) {
    return 1;
  }
  
  const startDate = new Date(task.startDate);
  const now = new Date();
  
  // 考虑debugDayOffset偏移
  const debugOffset = (task as any).debugDayOffset || 0;
  const simulatedToday = new Date(now);
  simulatedToday.setDate(simulatedToday.getDate() + debugOffset);
  
  // 基于真实日期计算周期编号
  const realElapsedDays = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 考虑cycleSnapshots数量
  const snapshotCount = (task as any).cycleSnapshots?.length || 0;
  
  // 计算基于真实时间的周期编号
  const realCycleNumber = Math.floor(realElapsedDays / task.cycleDays) + 1;
  
  // 当前周期编号 = max(基于真实时间的周期, 快照数+1)，但不超过总周期数
  return Math.min(Math.max(realCycleNumber, snapshotCount + 1), task.totalCycles);
}



