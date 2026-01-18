/**
 * TaskProvider - 任务操作管理
 * 管理单条任务的增删改查、进度计算、周期管理
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import dayjs from 'dayjs';
import type { Task, CheckInEntry, TodayProgress, DailyCheckInRecord } from '../../types';
import type { TaskContextValue, HistoryRecord, CycleInfo, TodayCheckInStatus, GoalDetailData } from './types';
import type { SceneType } from '../SceneProvider/types';
import { createTask as createNewFormatTask } from '../../utils/migration';
import { useScene } from '../SceneProvider';
import { archiveTask as archiveTaskToStorage } from '../../utils/archiveStorage';
import { getEffectiveMainlineType, getCurrentDate } from '../../utils';

// 欠账快照配色方案
const DEBT_COLOR_SCHEMES = [
  { bgColor: 'rgba(246, 239, 239, 0.6)', progressColor: 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)', borderColor: '#E0CEC6' },
  { bgColor: 'rgba(241, 241, 232, 0.6)', progressColor: 'linear-gradient(90deg, #F1F1E8 0%, #B9C9B9 100%)', borderColor: '#B9C9B9' },
  { bgColor: 'rgba(231, 230, 237, 0.6)', progressColor: 'linear-gradient(90deg, #E7E6ED 0%, #C0BDD1 100%)', borderColor: '#C0BDD1' },
  { bgColor: 'rgba(234, 236, 239, 0.6)', progressColor: 'linear-gradient(90deg, #EAECEF 0%, #B8BCC1 100%)', borderColor: '#B8BCC1' },
];

const getRandomColorScheme = () => {
  return DEBT_COLOR_SCHEMES[Math.floor(Math.random() * DEBT_COLOR_SCHEMES.length)];
};

// 创建 Context
const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

// 生成唯一 ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 获取模拟的"今天"日期（优先使用全局测试日期）
const getSimulatedToday = (task: Task): string => {
  // 优先使用全局测试日期
  const currentDate = getCurrentDate();
  const offset = (task as any).debugDayOffset || 0;
  
  if (offset === 0) {
    return currentDate;
  }
  
  // 如果有偏移量，在当前日期基础上计算
  return dayjs(currentDate).add(offset, 'day').format('YYYY-MM-DD');
};

// 获取模拟的时间戳（优先使用全局测试日期）
// 保留当前的时分秒信息，只调整日期部分
const getSimulatedTimestamp = (task: Task): number => {
  const offset = (task as any).debugDayOffset || 0;
  
  if (offset === 0) {
    // 没有偏移量，直接返回当前时间戳
    return Date.now();
  }
  
  // 有偏移量时，在当前时间基础上调整日期，保留时分秒
  return dayjs().add(offset, 'day').valueOf();
};

// 从 checkInConfig.records 获取今日打卡记录
const getTodayCheckInsFromRecords = (task: Task, effectiveToday: string): CheckInEntry[] => {
  const records = task.checkInConfig?.records || [];
  const todayRecord = records.find(r => r.date === effectiveToday);
  return todayRecord?.entries || [];
};

// 数字精度处理函数
// - 大于等于1000：保留整数
// - 大于等于100：最多保留1位小数
// - 小于100：最多保留2位小数
const formatNumberPrecision = (num: number): number => {
  const absNum = Math.abs(num);
  if (absNum >= 1000) {
    return Math.round(num);
  } else if (absNum >= 100) {
    return Math.round(num * 10) / 10;
  } else {
    return Math.round(num * 100) / 100;
  }
};

// 计算今日进度
const calculateTodayProgress = (task: Task): TodayProgress => {
  const effectiveToday = getSimulatedToday(task);
  const checkInConfig = task.checkInConfig;
  const todayCheckIns = getTodayCheckInsFromRecords(task, effectiveToday);

  // NUMERIC 类型任务：使用 numericConfig.perDayAverage 作为每日目标
  if (task.category === 'NUMERIC' && task.numericConfig) {
    const dailyTarget = formatNumberPrecision(Math.abs(task.numericConfig.perDayAverage || 0));
    // 计算今日记录的数值变化
    const todayActivities = task.activities?.filter(a => 
      dayjs(a.date).format('YYYY-MM-DD') === effectiveToday && a.type === 'UPDATE_VALUE'
    ) || [];
    // 计算今日数值变化总和（newValue - oldValue）
    const todayValue = todayActivities.reduce((sum, a) => {
      const activity = a as { newValue?: number; oldValue?: number };
      return sum + ((activity.newValue || 0) - (activity.oldValue || 0));
    }, 0);
    // 使用绝对值判断是否完成（减少型任务 todayValue 为负数）
    const isCompleted = dailyTarget > 0 && Math.abs(todayValue) >= dailyTarget;
    
    return {
      canCheckIn: true,
      todayCount: todayActivities.length,
      todayValue: formatNumberPrecision(todayValue),
      isCompleted,
      dailyTarget,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  if (!checkInConfig) {
    return {
      canCheckIn: todayCheckIns.length === 0,
      todayCount: todayCheckIns.length,
      todayValue: 0,
      isCompleted: todayCheckIns.length > 0,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  const unit = checkInConfig.unit;
  const todayValue = todayCheckIns.reduce((sum, c) => sum + (c.value || 1), 0);

  if (unit === 'TIMES') {
    const dailyMax = checkInConfig.dailyMaxTimes || 1;
    return {
      canCheckIn: todayCheckIns.length < dailyMax,
      todayCount: todayCheckIns.length,
      todayValue: todayCheckIns.length,
      isCompleted: todayCheckIns.length >= dailyMax,
      dailyTarget: dailyMax,
      lastUpdatedAt: dayjs().toISOString()
    };
  } else if (unit === 'DURATION') {
    const dailyTarget = formatNumberPrecision(checkInConfig.dailyTargetMinutes || 15);
    return {
      canCheckIn: todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue: formatNumberPrecision(todayValue),
      isCompleted: todayValue >= dailyTarget,
      dailyTarget,
      lastUpdatedAt: dayjs().toISOString()
    };
  } else if (unit === 'QUANTITY') {
    // 数值型打卡：优先使用 dailyTargetValue，如果没有则使用 cycleTargetValue / cycleDays 计算
    let dailyTarget = checkInConfig.dailyTargetValue || 0;
    
    // 如果没有设置每日目标，但有周期目标，则计算每日平均目标
    if (dailyTarget === 0 && checkInConfig.cycleTargetValue) {
      // 从任务中获取周期天数
      const cycleDays = task.cycle?.cycleDays || 7;
      dailyTarget = Math.ceil(checkInConfig.cycleTargetValue / cycleDays);
    }
    
    dailyTarget = formatNumberPrecision(dailyTarget);
    const formattedTodayValue = formatNumberPrecision(todayValue);
    
    return {
      canCheckIn: dailyTarget === 0 || todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue: formattedTodayValue,
      isCompleted: dailyTarget > 0 && todayValue >= dailyTarget,
      dailyTarget: dailyTarget > 0 ? dailyTarget : undefined,
      lastUpdatedAt: dayjs().toISOString()
    };
  }

  return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false, lastUpdatedAt: dayjs().toISOString() };
};

export function TaskProvider({ children }: TaskProviderProps) {
  // 依赖 SceneProvider
  const scene = useScene();
  
  // 当前选中的任务 ID
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // ========== 辅助函数 ==========

  // 自动检测任务所属场景
  const detectScene = useCallback((taskId: string): SceneType | null => {
    if (scene.getTaskById(taskId, 'normal')) return 'normal';
    if (scene.getTaskById(taskId, 'vacation')) return 'vacation';
    if (scene.getTaskById(taskId, 'memorial')) return 'memorial';
    if (scene.getTaskById(taskId, 'okr')) return 'okr';
    return null;
  }, [scene]);

  // ========== 基础 CRUD ==========

  // 创建任务
  const createTask = useCallback((sceneType: SceneType, taskData: Partial<Task> & {
    title?: string;
    type?: 'mainline' | 'sidelineA' | 'sidelineB';
    category?: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
    startDate?: string;
    totalDays?: number;
    cycleDays?: number;
  }): Task => {
    const newTask = createNewFormatTask({
      title: taskData.title || '未命名任务',
      type: taskData.type || 'sidelineA',
      category: taskData.category || 'CHECK_IN',
      from: sceneType,
      startDate: taskData.startDate || getCurrentDate(),
      totalDays: taskData.totalDays || 30,
      cycleDays: taskData.cycleDays || 10,
      ...taskData,
    });

    scene.addTask(sceneType, newTask);
    return newTask;
  }, [scene]);

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<Task>, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) {
      console.error(`Task ${taskId} not found in any scene`);
      return;
    }
    scene.updateTask(targetScene, taskId, updates);
  }, [scene, detectScene]);

  // 删除任务
  const deleteTask = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) {
      console.error(`Task ${taskId} not found`);
      return;
    }
    scene.deleteTask(targetScene, taskId);
  }, [scene, detectScene]);

  // 获取任务
  const getTask = useCallback((taskId: string, sceneType?: SceneType): Task | undefined => {
    if (sceneType) {
      return scene.getTaskById(taskId, sceneType);
    }
    const targetScene = detectScene(taskId);
    return targetScene ? scene.getTaskById(taskId, targetScene) : undefined;
  }, [scene, detectScene]);

  // ========== 兼容旧版 ==========

  const tasks = scene.getAllTasks('normal');

  const setTasks = useCallback((newTasks: Task[]) => {
    scene.setTasks('normal', newTasks);
  }, [scene]);

  const addTask = useCallback((task: Task) => {
    scene.addTask('normal', task);
  }, [scene]);

  const refreshTasks = useCallback(() => {
    scene.refreshScene('normal');
  }, [scene]);

  const getTaskById = useCallback((taskId: string): Task | undefined => {
    return scene.getTaskById(taskId, 'normal');
  }, [scene]);

  // ========== 进度管理 ==========

  // 更新进度
  const updateProgress = useCallback((taskId: string, progress: number, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    scene.updateTask(targetScene, taskId, { 
      progress: {
        ...task.progress,
        totalPercentage: progress,
      }
    });

    if (progress >= 100 && task.status !== 'COMPLETED') {
      completeTask(taskId, targetScene);
    }
  }, [scene, detectScene]);

  // 记录打卡（添加到 checkInConfig.records）
  const recordCheckIn = useCallback((taskId: string, entry: CheckInEntry, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task || !task.checkInConfig) return;

    // 使用模拟日期
    const today = getSimulatedToday(task);
    const records = [...(task.checkInConfig.records || [])];
    
    // 查找今日记录
    const todayRecordIndex = records.findIndex(r => r.date === today);
    const newEntry: CheckInEntry = {
      id: entry.id || generateId(),
      time: dayjs().format('HH:mm:ss'),
      value: entry.value,
      note: entry.note,
    };

    if (todayRecordIndex >= 0) {
      // 更新今日记录
      // 确保 entries 数组存在，如果不存在则初始化为空数组
      const existingEntries = records[todayRecordIndex].entries || [];
      records[todayRecordIndex] = {
        ...records[todayRecordIndex],
        checked: true,
        entries: [...existingEntries, newEntry],
        totalValue: (records[todayRecordIndex].totalValue || 0) + (entry.value || 1),
      };
    } else {
      // 创建新的今日记录
      records.push({
        date: today,
        checked: true,
        entries: [newEntry],
        totalValue: entry.value || 1,
      });
    }

    scene.updateTask(targetScene, taskId, {
      checkInConfig: {
        ...task.checkInConfig,
        records,
      },
    });
  }, [scene, detectScene]);

  // 完成任务
  const completeTask = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    scene.updateTask(targetScene, taskId, {
      status: 'COMPLETED',
      progress: { 
        ...task.progress,
        totalPercentage: 100, 
        cyclePercentage: 100,
        cycleAchieved: task.progress.cycleAchieved,
        cycleRemaining: 0,
        lastUpdatedAt: dayjs().toISOString()
      },
      time: { 
        ...task.time,
        completedAt: dayjs().toISOString() 
      },
    });
  }, [scene, detectScene]);

  // 归档任务
  const archiveTask = useCallback((taskId: string, summary?: string, sceneType?: SceneType): { success: boolean; message: string } => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) {
      return { success: false, message: '未找到任务' };
    }

    const result = archiveTaskToStorage(taskId, summary);
    
    if (result.success) {
      scene.refreshScene(targetScene);
    }
    
    return result;
  }, [scene, detectScene]);

  // ========== 周期管理 ==========

  // 计算周期信息
  const calculateCycle = useCallback((taskId: string, sceneType?: SceneType): CycleInfo | null => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return null;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return null;
    
    const startDateStr = task.time.startDate;
    const cycleDays = task.cycle.cycleDays;
    const totalCycles = task.cycle.totalCycles;
    
    if (!startDateStr || !cycleDays || !totalCycles) {
      return null;
    }

    const startDate = dayjs(startDateStr);
    
    // 获取模拟的"今天"日期（优先使用全局测试日期）
    const currentDate = getCurrentDate();
    const debugOffset = (task as any).debugDayOffset || 0;
    const simulatedToday = dayjs(currentDate).add(debugOffset, 'day');
    
    // 使用 task.cycle.currentCycle 作为当前周期编号
    const currentCycle = task.cycle.currentCycle;
    
    // 计算当前周期的起始天数
    const cycleStartDay = (currentCycle - 1) * cycleDays;
    const cycleEndDay = cycleStartDay + cycleDays - 1;
    
    // 计算当前周期的开始和结束日期
    const currentCycleStart = startDate.add(cycleStartDay, 'day');
    const currentCycleEnd = startDate.add(cycleEndDay, 'day');
    
    // 计算剩余天数
    const daysInCurrentCycle = simulatedToday.diff(currentCycleStart, 'day');
    const daysRemainingInCycle = cycleDays - daysInCurrentCycle;

    return {
      currentCycle,
      totalCycles,
      daysInCurrentCycle,
      daysRemainingInCycle: Math.max(0, daysRemainingInCycle),
      cycleStartDate: currentCycleStart.format('YYYY-MM-DD'),
      cycleEndDate: currentCycleEnd.format('YYYY-MM-DD'),
      isLastCycle: currentCycle === totalCycles,
    };
  }, [scene, detectScene]);

  // 推进周期
  const advanceCycle = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    const cycleConfig = task.cycle;
    if (!cycleConfig) return;
    
    if (cycleConfig.currentCycle < cycleConfig.totalCycles) {
      const newCycleNumber = cycleConfig.currentCycle + 1;
      const startDate = dayjs(task.time.startDate);
      const cycleDays = task.cycle.cycleDays;
      const newCycleStartDate = startDate.add((newCycleNumber - 1) * cycleDays, 'day').format('YYYY-MM-DD');
      const newCycleEndDate = startDate.add(newCycleNumber * cycleDays - 1, 'day').format('YYYY-MM-DD');
      
      scene.updateTask(targetScene, taskId, {
        cycle: {
          ...task.cycle,
          currentCycle: newCycleNumber,
          cycleStartDate: newCycleStartDate,
          cycleEndDate: newCycleEndDate,
          remainingDays: cycleDays,
        },
      });
    }
  }, [scene, detectScene]);

  // ========== 打卡与数据记录 ==========

  // 获取今日打卡状态
  const getTodayCheckInStatus = useCallback((taskId: string, sceneType?: SceneType): TodayCheckInStatus => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return { canCheckIn: false, todayCount: 0, todayValue: 0, isCompleted: false };

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return { canCheckIn: false, todayCount: 0, todayValue: 0, isCompleted: false };

    // 直接使用 task.todayProgress，如果不存在则计算
    const todayProgress = task.todayProgress || calculateTodayProgress(task);
    return {
      canCheckIn: todayProgress.canCheckIn,
      todayCount: todayProgress.todayCount,
      todayValue: todayProgress.todayValue,
      isCompleted: todayProgress.isCompleted,
      dailyTarget: todayProgress.dailyTarget
    };
  }, [scene, detectScene]);

  // 打卡功能
  const checkIn = useCallback(async (taskId: string, value?: number, note?: string, sceneType?: SceneType): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    console.log(task,'config')
    console.log(task.checkInConfig, 'config')

    try {
      const simulatedToday = getSimulatedToday(task);
      const config = task.checkInConfig;
      
      const todayCheckIns = getTodayCheckInsFromRecords(task, simulatedToday);

      // 检查是否可以打卡
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
            // return false;
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

      // 创建新的打卡记录
      const newEntry: CheckInEntry = {
        id: `checkin_${Date.now()}`,
        time: dayjs().format('HH:mm:ss'),
        value: value,
        note: note || undefined
      };

      // 更新 records
      const records = [...(config?.records || [])];
      const todayRecordIndex = records.findIndex(r => r.date === simulatedToday);
      
      if (todayRecordIndex >= 0) {
        // 确保 entries 数组存在，如果不存在则初始化为空数组
        const existingEntries = records[todayRecordIndex].entries || [];
        records[todayRecordIndex] = {
          ...records[todayRecordIndex],
          checked: true,
          entries: [...existingEntries, newEntry],
          totalValue: (records[todayRecordIndex].totalValue || 0) + (value || 1),
        };
      } else {
        records.push({
          date: simulatedToday,
          checked: true,
          entries: [newEntry],
          totalValue: value || 1,
        });
      }
      
      // 更新连续打卡记录
      let updatedConfig = { ...(config || {}) } as any;
      if (config) {
        const uniqueDates = [...new Set(records.filter(r => r.checked).map(r => r.date))].sort();
        let currentStreak = 0;
        let checkDate = dayjs(simulatedToday);
        
        while (uniqueDates.includes(checkDate.format('YYYY-MM-DD'))) {
          currentStreak++;
          checkDate = checkDate.subtract(1, 'day');
        }
        
        updatedConfig.currentStreak = currentStreak;
        updatedConfig.longestStreak = Math.max(updatedConfig.longestStreak || 0, currentStreak);
        updatedConfig.records = records;
      }

      // 计算并更新打卡型任务的进度
      let progressUpdate: Partial<Task> = {};
      if (task.category === 'CHECK_IN') {
        // 直接使用 task.cycle 中的周期信息
        const { currentCycle, totalCycles, cycleDays } = task.cycle;
        const startDate = dayjs(task.time.startDate);
        const perCycleTarget = config?.perCycleTarget || 1;
        const unit = config?.unit || 'TIMES';

        // 计算当前周期的开始和结束日期
        const cycleStartDay = (currentCycle - 1) * cycleDays;
        const cycleEndDay = cycleStartDay + cycleDays - 1;
        const cycleStartDate = startDate.add(cycleStartDay, 'day').format('YYYY-MM-DD');
        const cycleEndDate = startDate.add(cycleEndDay, 'day').format('YYYY-MM-DD');

        const cycleRecords = records.filter(r =>
          r.date >= cycleStartDate && r.date <= cycleEndDate && r.checked
        );

        let currentCycleValue: number;
        let totalValue: number;

        if (unit === 'TIMES') {
          // 确保 entries 数组存在，如果不存在则默认计为1次
          currentCycleValue = cycleRecords.reduce((sum, r) => sum + (r.entries?.length || 1), 0);
          totalValue = records.filter(r => r.checked).reduce((sum, r) => sum + (r.entries?.length || 1), 0);
        } else {
          currentCycleValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
          totalValue = records.filter(r => r.checked).reduce((sum, r) => sum + (r.totalValue || 0), 0);
        }

        const cyclePercentage = Math.min(100, Math.round((currentCycleValue / perCycleTarget) * 100));
        const totalTarget = totalCycles * perCycleTarget;
        const totalPercentage = Math.min(100, Math.round((totalValue / totalTarget) * 100));

        // 计算 cycleAchieved 和 cycleRemaining
        const cycleAchieved = currentCycleValue;
        const cycleRemaining = Math.max(0, perCycleTarget - currentCycleValue);

        progressUpdate = {
          progress: {
            ...task.progress,
            cyclePercentage,
            totalPercentage,
            cycleAchieved,
            cycleRemaining,
            lastUpdatedAt: dayjs().toISOString()
          }
        };
      }

      // 添加活动日志（使用模拟日期）
      const newActivity = {
        id: generateId(),
        type: 'CHECK_IN' as const,
        date: simulatedToday,
        timestamp: getSimulatedTimestamp(task),
        count: 1,
        value: value,
        note: note || undefined
      };

      const updatedActivities = [...task.activities, newActivity];

      // 计算更新后的今日进度
      const updatedTask = {
        ...task,
        checkInConfig: updatedConfig
      };
      const todayProgress = calculateTodayProgress(updatedTask as Task);

      scene.updateTask(targetScene, taskId, {
        checkInConfig: updatedConfig,
        todayProgress,
        activities: updatedActivities,
        ...progressUpdate
      });

      return true;
    } catch (error) {
      console.error('打卡失败:', error);
      return false;
    }
  }, [scene, detectScene]);

  // 记录数值型数据
  const recordNumericData = useCallback(async (taskId: string, value: number, note?: string, sceneType?: SceneType): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;
console.log(value,'value')
    try {
      const config = task.numericConfig;
      if (!config) return false;

      const previousValue = config.currentValue;
      const change = value - previousValue;
      const progress = task.progress;
      const isDecrease = config.direction === 'DECREASE';
      const originalStart = config.originalStartValue ?? config.startValue;
      const totalChange = Math.abs(config.targetValue - originalStart);
      const rawChange = value - originalStart;
      const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
      const totalPercentage = totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;

      const perCycleTarget = config.perCycleTarget || (totalChange / task.cycle.totalCycles);

      // 从 progress 中获取周期起始值
      const cycleStartValueRaw = progress.cycleStartValue ?? config.startValue;
      const cycleStartValue = typeof cycleStartValueRaw === 'number' ? cycleStartValueRaw : config.startValue;

      // 检查是否已有补偿目标值，如果有则用它来计算进度
      const existingCompensationTarget = progress.compensationTargetValue;
      
      let cyclePercentage: number;
      let effectiveCycleChange: number;
      
      if (existingCompensationTarget !== undefined) {
        // 使用补偿目标值计算进度
        const compensationTotal = isDecrease 
          ? cycleStartValue - existingCompensationTarget 
          : existingCompensationTarget - cycleStartValue;
        const compensationChange = isDecrease 
          ? cycleStartValue - value 
          : value - cycleStartValue;
        effectiveCycleChange = Math.max(0, compensationChange);
        cyclePercentage = compensationTotal > 0 
          ? Math.max(0, Math.min(100, Math.round((compensationChange / compensationTotal) * 100)))
          : 0;
      } else {
        // 使用原周期目标计算进度
        const rawCycleChange = value - cycleStartValue;
        effectiveCycleChange = isDecrease ? Math.max(0, -rawCycleChange) : Math.max(0, rawCycleChange);
        cyclePercentage = perCycleTarget > 0 ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) : 0;
      }

      const updatedNumericConfig = {
        ...config,
        currentValue: value
      };

      // 添加活动日志（使用模拟日期）
      // date 字段使用 ISO 格式，包含完整的时间信息
      const currentDate = getCurrentDate();
      const offset = (task as any).debugDayOffset || 0;
      // 优先使用全局测试日期，如果有 debugDayOffset 则在此基础上偏移
      const simulatedDateTime = offset === 0
        ? dayjs(currentDate).format('YYYY-MM-DD')
        : dayjs().add(offset, 'day').format('YYYY-MM-DD');

        console.log({
          currentDate,
          simulatedDateTime,
          offset,
        },'simulatedDateTime')
      const newActivity = {
        id: generateId(),
        type: 'UPDATE_VALUE' as const,
        date: simulatedDateTime,
        timestamp: getSimulatedTimestamp(task),
        oldValue: previousValue,
        newValue: value,
        delta: change,
        note: note || undefined
      };

      // 检查是否已达成最终目标
      const alreadyReachedFinalTarget = isDecrease 
        ? value <= config.targetValue
        : value >= config.targetValue;
      
      // 计算 cycleAchieved 和 cycleRemaining（数值型任务）
      let cycleAchieved = effectiveCycleChange;
      let cycleRemainingCalc = Math.max(0, perCycleTarget - effectiveCycleChange);
      
      // 如果已达成最终目标，进度100%，还需0
      if (alreadyReachedFinalTarget) {
        cyclePercentage = 100;
        cycleRemainingCalc = 0;
      }
      
      const cycleRemaining = cycleRemainingCalc;

      // 计算当前周期目标值（保持原值不变，不用 compensationTargetValue 覆盖）
      let originalCycleTargetValue = cycleStartValue + perCycleTarget * (isDecrease ? -1 : 1);
      // 确保周期目标值不超过最终目标值
      if (isDecrease) {
        originalCycleTargetValue = Math.max(originalCycleTargetValue, config.targetValue);
      } else {
        originalCycleTargetValue = Math.min(originalCycleTargetValue, config.targetValue);
      }

      const updates: Partial<Task> = {
        numericConfig: updatedNumericConfig,
        activities: [...task.activities, newActivity],
        progress: {
          ...task.progress,
          totalPercentage,
          cyclePercentage,
          cycleStartValue,
          cycleAchieved,
          cycleRemaining,
          lastUpdatedAt: dayjs().toISOString(),
          cycleTargetValue: originalCycleTargetValue,
          // 保留已有的补偿目标值（只用于计算，不覆盖 cycleTargetValue）
          compensationTargetValue: existingCompensationTarget,
        }
      };

      // 处理欠款和补偿目标值逻辑
      const currentCycle = task.cycle.currentCycle;
      const cycleDays = task.cycle.cycleDays;
      const startDate = dayjs(task.time.startDate);
      const debugOffset = (task as any).debugDayOffset || 0;
      const simulatedTodayDate = dayjs().add(debugOffset, 'day');
      
      // 计算当前周期的开始日期和已过天数
      const cycleStartDay = (currentCycle - 1) * cycleDays;
      const currentCycleStart = startDate.add(cycleStartDay, 'day');
      const daysInCurrentCycle = simulatedTodayDate.diff(currentCycleStart, 'day');
      const isInFirstHalf = daysInCurrentCycle < cycleDays / 2;

      // 如果当前周期进度达到100%且在前50%时间内，且没有已设置的补偿目标，检查是否需要设置补偿目标
      // 不依赖 previousCycleDebt，直接检查当前值是否达到各周期计划目标
      if (cyclePercentage >= 100 && isInFirstHalf && existingCompensationTarget === undefined) {
        // 从周期计划取最多3个周期的目标值，找第一个当前值未达标的作为补偿目标
        const originalStart = config.originalStartValue ?? config.startValue;
        let compensationTarget: number | undefined;
        let compensationFromCycle: number | undefined;
        
        // 从当前周期开始往前检查，最多检查3个周期
        const startCycle = currentCycle;
        const endCycle = Math.max(1, currentCycle - 2); // 往前最多2个，总共3个周期
        
        for (let i = startCycle; i >= endCycle; i--) {
          // 计算第i个周期的计划目标值
          const cycleTargetForI = isDecrease 
            ? originalStart - (perCycleTarget * i)
            : originalStart + (perCycleTarget * i);
          
          // 检查当前值是否达到这个周期的目标
          let hasReached = false;
          if (isDecrease) {
            hasReached = value <= cycleTargetForI;
          } else {
            hasReached = value >= cycleTargetForI;
          }
          
          if (!hasReached) {
            // 找到未达标的周期目标（从当前往前找，取最早未达标的）
            compensationTarget = cycleTargetForI;
            compensationFromCycle = i;
            // 继续往前找，取最早未达标的
          }
        }
        
        if (compensationTarget !== undefined) {
          // 补偿目标不能超过最终目标值（减少方向不能小于targetValue，增加方向不能大于targetValue）
          if (isDecrease) {
            compensationTarget = Math.max(compensationTarget, config.targetValue);
          } else {
            compensationTarget = Math.min(compensationTarget, config.targetValue);
          }
          
          // 设置补偿目标值，替代当前周期目标
          (updates.progress as any).compensationTargetValue = compensationTarget;
          (updates.progress as any).debtFromCycle = compensationFromCycle;
          
          // 重新计算基于补偿目标的进度（从当前周期起始值到补偿目标）
          const cycleStartNum = typeof cycleStartValue === 'number' ? cycleStartValue : 0;
          const compensationChange = isDecrease 
            ? cycleStartNum - value 
            : value - cycleStartNum;
          const compensationTotal = isDecrease 
            ? cycleStartNum - compensationTarget 
            : compensationTarget - cycleStartNum;
          // 确保进度不为负数
          const compensationPercentage = compensationTotal > 0 
            ? Math.max(0, Math.min(100, Math.round((compensationChange / compensationTotal) * 100)))
            : 0;
          
          (updates.progress as any).cyclePercentage = compensationPercentage;
          // 不覆盖 cycleTargetValue，保持原值，只用 compensationTargetValue 进行计算
          
          // 设置欠账快照用于卡片显示
          const colorScheme = getRandomColorScheme();
          updates.previousCycleDebtSnapshot = {
            currentCycleNumber: currentCycle,
            targetValue: compensationTarget,
            bgColor: colorScheme.bgColor,
            progressColor: colorScheme.progressColor,
            borderColor: colorScheme.borderColor,
            debtCycleSnapshot: {
              cycleNumber: compensationFromCycle || 1,
              startValue: originalStart,
              targetValue: compensationTarget,
              actualValue: value,
              completionRate: compensationPercentage,
            }
          };
        } else {
          // 所有周期目标都已达到，清除补偿目标
          (updates.progress as any).compensationTargetValue = undefined;
          (updates.progress as any).debtFromCycle = undefined;
          updates.previousCycleDebtSnapshot = undefined;
        }
      }

      // 兼容旧的欠账快照逻辑
      const cycleSnapshots = (task as any).cycleSnapshots || [];
      if (cycleSnapshots.length > 0 && cyclePercentage >= 100 && !updates.previousCycleDebtSnapshot) {
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
            const remainingDays = Math.max(0, cycleDays - daysInCurrentCycle);

            if (remainingDays > cycleDays / 2 && !task.previousCycleDebtSnapshot) {
              const colorScheme = getRandomColorScheme();
              updates.previousCycleDebtSnapshot = {
                currentCycleNumber: currentCycle,
                targetValue: previousCycleTarget,
                bgColor: colorScheme.bgColor,
                progressColor: colorScheme.progressColor,
                borderColor: colorScheme.borderColor,
                debtCycleSnapshot: {
                  cycleNumber: lastSnapshot.cycleNumber,
                  startValue: cycleStartValue,
                  targetValue: previousCycleTarget,
                  actualValue: lastSnapshot.actualValue,
                  completionRate: lastSnapshot.completionRate,
                }
              };
            }
          } else {
            updates.previousCycleDebtSnapshot = undefined;
          }
        }
      }

      // 计算更新后的今日进度
      const updatedTask = { ...task, ...updates };
      updates.todayProgress = calculateTodayProgress(updatedTask as Task);

      scene.updateTask(targetScene, taskId, updates);
      return true;
    } catch (error) {
      console.error('记录数据失败:', error);
      return false;
    }
  }, [scene, detectScene]);

  // 更新清单项
  const updateChecklistItem = useCallback(async (
    taskId: string,
    itemId: string,
    updates: { status?: string; subProgress?: { current: number; total: number } },
    sceneType?: SceneType
  ): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      const config = task.checklistConfig;
      if (!config) return false;

      const items = [...(config.items || [])];
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        if (updates.status) {
          items[itemIndex] = {
            ...items[itemIndex],
            status: updates.status as any,
          };
          if (updates.status === 'COMPLETED') {
            items[itemIndex].completedAt = dayjs().toISOString();
          }
        }
        if (updates.subProgress) {
          items[itemIndex] = {
            ...items[itemIndex],
            subProgress: {
              ...items[itemIndex].subProgress,
              current: updates.subProgress.current,
              total: updates.subProgress.total,
            } as any,
          };
        }

        const completedCount = items.filter(item => item.status === 'COMPLETED').length;

        let progressUpdate: Partial<Task> = {};
        if (task.category === 'CHECKLIST') {
          const totalItems = config.totalItems;
          const perCycleTarget = config.perCycleTarget;
          const currentCycle = task.cycle.currentCycle;

          const currentCycleCompleted = items.filter(
            item => item.status === 'COMPLETED' && item.cycle === currentCycle
          ).length;

          const cyclePercentage = Math.min(100, Math.round((currentCycleCompleted / perCycleTarget) * 100));
          const totalPercentage = Math.round((completedCount / totalItems) * 100);

          // 计算 cycleAchieved 和 cycleRemaining（清单型任务）
          const cycleAchieved = currentCycleCompleted;
          const cycleRemaining = Math.max(0, perCycleTarget - currentCycleCompleted);

          progressUpdate = {
            progress: {
              ...task.progress,
              cyclePercentage,
              totalPercentage,
              cycleAchieved,
              cycleRemaining,
              lastUpdatedAt: dayjs().toISOString()
            }
          };
        }

        scene.updateTask(targetScene, taskId, {
          checklistConfig: {
            ...config,
            items,
            completedItems: completedCount
          },
          ...progressUpdate
        });

        // 更新今日进度
        const updatedTask = scene.getTaskById(taskId, targetScene);
        if (updatedTask) {
          scene.updateTask(targetScene, taskId, {
            todayProgress: calculateTodayProgress(updatedTask)
          });
        }
      }

      return true;
    } catch (error) {
      console.error('更新清单项失败:', error);
      return false;
    }
  }, [scene, detectScene]);

  // 提前结束任务
  const endPlanEarly = useCallback(async (taskId: string, sceneType?: SceneType): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      scene.updateTask(targetScene, taskId, {
        status: 'COMPLETED',
        isPlanEnded: true,
        time: {
          ...task.time,
          completedAt: dayjs().toISOString()
        }
      });
      return true;
    } catch (error) {
      console.error('提前结束任务失败:', error);
      return false;
    }
  }, [scene, detectScene]);

  // 获取目标详情数据
  const getGoalDetailData = useCallback((taskId: string, sceneType?: SceneType): GoalDetailData => {
    const targetScene = sceneType || detectScene(taskId);
    const task = targetScene ? scene.getTaskById(taskId, targetScene) : null;
    
    if (!task) {
      return {
        task: null,
        loading: false,
        checkInLoading: false,
        cycleInfo: null,
        todayCheckInStatus: { canCheckIn: false, todayCount: 0, todayValue: 0, isCompleted: false },
        isPlanEnded: false,
        mainlineType: 'CHECK_IN'
      };
    }

    const cycleInfo = calculateCycle(taskId, targetScene || undefined);
    const todayStatus = getTodayCheckInStatus(taskId, targetScene || undefined);
    
    // 判断计划是否已结束
    const cycleDays = task.cycle.cycleDays;
    const totalCycles = task.cycle.totalCycles;
    const startDate = task.time.startDate;
    const cycleSnapshots = (task as any).cycleSnapshots || [];
    const status = task.status;
    
    let isPlanEnded = task.isPlanEnded || false;
    if (!isPlanEnded && startDate && cycleDays && totalCycles) {
      const start = dayjs(startDate);
      const simulatedToday = getSimulatedToday(task);
      const today = dayjs(simulatedToday);
      const planEndDate = start.add(totalCycles * cycleDays - 1, 'day');
      
      const isPlanEndedByTime = today.isAfter(planEndDate);
      const isPlanEndedByStatus = status === 'COMPLETED' || status === 'ARCHIVED' || status === 'ARCHIVED_HISTORY';
      const isPlanEndedBySnapshots = cycleSnapshots.length >= totalCycles;
      isPlanEnded = isPlanEndedByTime || isPlanEndedByStatus || isPlanEndedBySnapshots;
    }

    const mainlineType = getEffectiveMainlineType(
      task.numericConfig,
      task.checklistConfig,
      task.checkInConfig
    );

    return {
      task,
      loading: false,
      checkInLoading: false,
      cycleInfo,
      todayCheckInStatus: todayStatus,
      isPlanEnded,
      mainlineType
    };
  }, [scene, detectScene, calculateCycle, getTodayCheckInStatus]);

  // 更新今日进度（手动触发）
  const updateTodayProgress = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    const todayProgress = calculateTodayProgress(task);
    scene.updateTask(targetScene, taskId, { todayProgress });
  }, [scene, detectScene]);

  // Debug: 进入下一天
  const debugNextDay = useCallback(async (taskId: string, sceneType?: SceneType): Promise<{ success: boolean; enteredNextCycle: boolean }> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return { success: false, enteredNextCycle: false };

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return { success: false, enteredNextCycle: false };

    try {
      const currentOffset = (task as any).debugDayOffset || 0;
      const newOffset = currentOffset + 1;
      const cycleDays = task.cycle.cycleDays;
      const currentCycle = task.cycle.currentCycle;
      const startDate = dayjs(task.time.startDate);

      // 计算新的模拟日期
      const newSimulatedDate = dayjs().add(newOffset, 'day');
      
      // 计算当前周期的结束日期
      // 当前周期开始日期 = startDate + (currentCycle - 1) * cycleDays
      // 当前周期结束日期 = 开始日期 + cycleDays - 1
      const currentCycleStartDate = startDate.add((currentCycle - 1) * cycleDays, 'day');
      const currentCycleEndDate = currentCycleStartDate.add(cycleDays - 1, 'day');

      // 如果新的模拟日期超过了当前周期的结束日期，需要进入下一周期
      const shouldEnterNextCycle = newSimulatedDate.isAfter(currentCycleEndDate, 'day');

      // 构建更新对象
      let updates: Partial<Task> & { debugDayOffset?: number } = {
        debugDayOffset: newOffset
      };

      if (shouldEnterNextCycle) {
        const totalCycles = task.cycle.totalCycles;

        if (currentCycle >= totalCycles) {
          // 已经是最后一个周期，结束计划
          updates = {
            ...updates,
            status: 'COMPLETED',
            isPlanEnded: true,
            time: {
              ...task.time,
              completedAt: dayjs().toISOString()
            }
          };
        } else {
          // 进入下一周期 - 使用与 debugNextCycle 相同的逻辑
          const newCycleNumber = currentCycle + 1;
          const perCycleTarget = task.checkInConfig?.perCycleTarget || task.numericConfig?.perCycleTarget || task.checklistConfig?.perCycleTarget || 0;

          // 计算上一周期的完成情况和欠款
          let previousCycleDebt: number | undefined;
          let previousCycleCompleted = true;
          let newCycleStartValue: number;
          let newCycleTargetValue: number;
          let debtFromCycle: number | undefined;

          if (task.category === 'NUMERIC' && task.numericConfig) {
            const config = task.numericConfig;
            const isDecrease = config.direction === 'DECREASE';
            const currentValue = config.currentValue;
            
            const previousCycleTargetValue = typeof task.progress.cycleTargetValue === 'number' 
              ? task.progress.cycleTargetValue 
              : parseFloat(task.progress.cycleTargetValue as string) || config.targetValue;

            // 判断是否完成：达到周期目标 或 已达成最终目标
            const reachedCycleTarget = isDecrease 
              ? currentValue <= previousCycleTargetValue
              : currentValue >= previousCycleTargetValue;
            const reachedFinalTarget = isDecrease
              ? currentValue <= config.targetValue
              : currentValue >= config.targetValue;
            previousCycleCompleted = reachedCycleTarget || reachedFinalTarget;

            newCycleStartValue = currentValue;

            if (previousCycleCompleted) {
              newCycleTargetValue = isDecrease 
                ? newCycleStartValue - perCycleTarget
                : newCycleStartValue + perCycleTarget;
            } else {
              previousCycleDebt = isDecrease 
                ? currentValue - previousCycleTargetValue
                : previousCycleTargetValue - currentValue;
              debtFromCycle = currentCycle;
              
              newCycleTargetValue = isDecrease 
                ? newCycleStartValue - perCycleTarget
                : newCycleStartValue + perCycleTarget;
            }

            if (isDecrease) {
              newCycleTargetValue = Math.max(newCycleTargetValue, config.targetValue);
            } else {
              newCycleTargetValue = Math.min(newCycleTargetValue, config.targetValue);
            }
          } else {
            newCycleStartValue = 0;
            newCycleTargetValue = perCycleTarget;
            
            const cyclePercentage = task.progress.cyclePercentage || 0;
            previousCycleCompleted = cyclePercentage >= 100;
            if (!previousCycleCompleted) {
              previousCycleDebt = perCycleTarget - (task.progress.cycleAchieved || 0);
              debtFromCycle = currentCycle;
            }
          }

          // 获取上一周期的结算值和计划目标值（用于记录到活动日志）
          let settlementValue: number | undefined;
          let planTargetValue: number | undefined;
          let hasDebt = !previousCycleCompleted;
          let completedByCompensation = false;
          
          if (task.category === 'NUMERIC' && task.numericConfig) {
            settlementValue = task.numericConfig.currentValue;
            planTargetValue = typeof task.progress.cycleTargetValue === 'number' 
              ? task.progress.cycleTargetValue 
              : parseFloat(task.progress.cycleTargetValue as string);
            if (task.progress.compensationTargetValue !== undefined && task.progress.cyclePercentage >= 100) {
              completedByCompensation = true;
            }
          }

          // 创建周期推进日志
          const cycleAdvanceLog = {
            id: generateId(),
            type: 'CYCLE_ADVANCE' as const,
            date: getSimulatedToday(task),
            timestamp: getSimulatedTimestamp(task),
            cycleNumber: currentCycle,
            completionRate: task.progress.cyclePercentage,
            settlementValue,
            planTargetValue,
            hasDebt,
            completedByCompensation
          };

          // 检查新周期开始时是否已达成最终目标
          let newCyclePercentage = 0;
          let newCycleAchieved = 0;
          let newCycleRemaining = perCycleTarget;
          
          if (task.category === 'NUMERIC' && task.numericConfig) {
            const config = task.numericConfig;
            const isDecrease = config.direction === 'DECREASE';
            const alreadyReachedFinalTarget = isDecrease 
              ? config.currentValue <= config.targetValue
              : config.currentValue >= config.targetValue;
            
            if (alreadyReachedFinalTarget) {
              // 已达成最终目标，周期目标量就是已完成量
              const cycleTargetAmount = isDecrease
                ? newCycleStartValue - newCycleTargetValue
                : newCycleTargetValue - newCycleStartValue;
              newCyclePercentage = 100;
              newCycleAchieved = Math.max(0, cycleTargetAmount);
              newCycleRemaining = 0;
            }
          }

          // 计算新周期的日期信息
          const newCycleStartDateStr = startDate.add((newCycleNumber - 1) * cycleDays, 'day').format('YYYY-MM-DD');
          const newCycleEndDateStr = startDate.add(newCycleNumber * cycleDays - 1, 'day').format('YYYY-MM-DD');

          updates = {
            ...updates,
            cycle: {
              ...task.cycle,
              currentCycle: newCycleNumber,
              cycleStartDate: newCycleStartDateStr,
              cycleEndDate: newCycleEndDateStr,
              remainingDays: cycleDays,
            },
            progress: {
              ...task.progress,
              cyclePercentage: newCyclePercentage,
              cycleAchieved: newCycleAchieved,
              cycleRemaining: newCycleRemaining,
              cycleStartValue: newCycleStartValue,
              cycleTargetValue: newCycleTargetValue,
              previousCycleDebt,
              previousCycleCompleted,
              debtFromCycle,
              compensationTargetValue: undefined,
              lastUpdatedAt: dayjs().toISOString()
            },
            activities: [...task.activities, cycleAdvanceLog]
          };
        }
      }

      // 计算新一天的 todayProgress（使用更新后的数据）
      const updatedTaskForProgress = { ...task, ...updates } as Task;
      updates.todayProgress = calculateTodayProgress(updatedTaskForProgress);

      // 一次性更新所有数据
      scene.updateTask(targetScene, taskId, updates as Partial<Task>);

      return { success: true, enteredNextCycle: shouldEnterNextCycle };
    } catch (error) {
      console.error('Debug进入下一天失败:', error);
      return { success: false, enteredNextCycle: false };
    }
  }, [scene, detectScene]);

  // Debug: 进入下一周期
  const debugNextCycle = useCallback(async (taskId: string, sceneType?: SceneType): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      const totalCycles = task.cycle.totalCycles;
      const currentCycle = task.cycle.currentCycle;
      const cycleDays = task.cycle.cycleDays;

      // 检查是否已经是最后一个周期，如果是则结束计划
      if (currentCycle >= totalCycles) {
        scene.updateTask(targetScene, taskId, {
          status: 'COMPLETED',
          isPlanEnded: true,
          time: {
            ...task.time,
            completedAt: dayjs().toISOString()
          }
        });
        return true;
      }

      // 新周期编号
      const newCycleNumber = currentCycle + 1;

      // 根据 startDate 计算新周期第一天对应的 debugDayOffset
      const startDate = dayjs(task.time.startDate);
      const realToday = dayjs();
      
      // 新周期的开始日期
      const newCycleStartDate = startDate.add((newCycleNumber - 1) * cycleDays, 'day');
      const newDebugDayOffset = newCycleStartDate.diff(realToday, 'day');

      // 获取周期目标值
      const perCycleTarget = task.checkInConfig?.perCycleTarget || task.numericConfig?.perCycleTarget || task.checklistConfig?.perCycleTarget || 0;

      // 计算上一周期的完成情况和欠款
      let previousCycleDebt: number | undefined;
      let previousCycleCompleted = true;
      let newCycleStartValue: number;
      let newCycleTargetValue: number;
      let debtFromCycle: number | undefined;

      if (task.category === 'NUMERIC' && task.numericConfig) {
        const config = task.numericConfig;
        const isDecrease = config.direction === 'DECREASE';
        const currentValue = config.currentValue;
        
        // 上一周期的目标值
        const previousCycleTargetValue = typeof task.progress.cycleTargetValue === 'number' 
          ? task.progress.cycleTargetValue 
          : parseFloat(task.progress.cycleTargetValue as string) || config.targetValue;

        // 判断是否完成：达到周期目标 或 已达成最终目标
        const reachedCycleTarget = isDecrease 
          ? currentValue <= previousCycleTargetValue
          : currentValue >= previousCycleTargetValue;
        const reachedFinalTarget = isDecrease
          ? currentValue <= config.targetValue
          : currentValue >= config.targetValue;
        previousCycleCompleted = reachedCycleTarget || reachedFinalTarget;

        // 新周期的起始值 = 上一周期的结算值（当前值）
        newCycleStartValue = currentValue;

        if (previousCycleCompleted) {
          // 上一周期完成：目标值 = 新周期计划的目标值
          newCycleTargetValue = isDecrease 
            ? newCycleStartValue - perCycleTarget
            : newCycleStartValue + perCycleTarget;
        } else {
          // 上一周期未完成：记录欠款值
          previousCycleDebt = isDecrease 
            ? currentValue - previousCycleTargetValue  // 减少型：当前值 - 目标值 = 欠款
            : previousCycleTargetValue - currentValue; // 增加型：目标值 - 当前值 = 欠款
          debtFromCycle = currentCycle;
          
          // 目标值 = 结算值 + 周期平均计划值
          newCycleTargetValue = isDecrease 
            ? newCycleStartValue - perCycleTarget
            : newCycleStartValue + perCycleTarget;
        }

        // 确保目标值不超过最终目标
        if (isDecrease) {
          newCycleTargetValue = Math.max(newCycleTargetValue, config.targetValue);
        } else {
          newCycleTargetValue = Math.min(newCycleTargetValue, config.targetValue);
        }
      } else {
        // 非数值型任务：简单重置
        newCycleStartValue = 0;
        newCycleTargetValue = perCycleTarget;
        
        // 检查打卡型或清单型任务的完成情况
        const cyclePercentage = task.progress.cyclePercentage || 0;
        previousCycleCompleted = cyclePercentage >= 100;
        if (!previousCycleCompleted) {
          previousCycleDebt = perCycleTarget - (task.progress.cycleAchieved || 0);
          debtFromCycle = currentCycle;
        }
      }

      // 获取上一周期的结算值和计划目标值（用于记录到活动日志）
      let settlementValue: number | undefined;
      let planTargetValue: number | undefined;
      let hasDebt = !previousCycleCompleted;
      let completedByCompensation = false;
      
      if (task.category === 'NUMERIC' && task.numericConfig) {
        settlementValue = task.numericConfig.currentValue;
        planTargetValue = typeof task.progress.cycleTargetValue === 'number' 
          ? task.progress.cycleTargetValue 
          : parseFloat(task.progress.cycleTargetValue as string);
        // 检查是否通过补偿完成（有补偿目标值且进度>=100）
        if (task.progress.compensationTargetValue !== undefined && task.progress.cyclePercentage >= 100) {
          completedByCompensation = true;
        }
      }

      // 创建周期推进日志
      const cycleAdvanceLog = {
        id: generateId(),
        type: 'CYCLE_ADVANCE' as const,
        date: getSimulatedToday(task),
        timestamp: getSimulatedTimestamp(task),
        cycleNumber: currentCycle,
        completionRate: task.progress.cyclePercentage,
        settlementValue,
        planTargetValue,
        hasDebt,
        completedByCompensation
      };

      // 检查新周期开始时是否已达成最终目标
      let newCyclePercentage = 0;
      let newCycleAchieved = 0;
      let newCycleRemaining = perCycleTarget;
      
      if (task.category === 'NUMERIC' && task.numericConfig) {
        const config = task.numericConfig;
        const isDecrease = config.direction === 'DECREASE';
        const alreadyReachedFinalTarget = isDecrease 
          ? config.currentValue <= config.targetValue
          : config.currentValue >= config.targetValue;
        
        if (alreadyReachedFinalTarget) {
          // 已达成最终目标，周期目标量就是已完成量
          const cycleTargetAmount = isDecrease
            ? newCycleStartValue - newCycleTargetValue
            : newCycleTargetValue - newCycleStartValue;
          newCyclePercentage = 100;
          newCycleAchieved = Math.max(0, cycleTargetAmount);
          newCycleRemaining = 0;
        }
      }

      // 计算新周期的日期信息
      const newCycleEndDate = startDate.add(newCycleNumber * cycleDays - 1, 'day').format('YYYY-MM-DD');

      // 构建更新对象
      const updates: Partial<Task> & { debugDayOffset?: number } = {
        cycle: {
          ...task.cycle,
          currentCycle: newCycleNumber,
          cycleStartDate: newCycleStartDate.format('YYYY-MM-DD'),
          cycleEndDate: newCycleEndDate,
          remainingDays: cycleDays,
        },
        progress: {
          ...task.progress,
          cyclePercentage: newCyclePercentage,
          cycleAchieved: newCycleAchieved,
          cycleRemaining: newCycleRemaining,
          cycleStartValue: newCycleStartValue,
          cycleTargetValue: newCycleTargetValue,
          previousCycleDebt,
          previousCycleCompleted,
          debtFromCycle,
          compensationTargetValue: undefined, // 新周期开始时清除补偿目标
          lastUpdatedAt: dayjs().toISOString()
        },
        activities: [...task.activities, cycleAdvanceLog],
        todayProgress: calculateTodayProgress({ 
          ...task, 
          cycle: { ...task.cycle, currentCycle: newCycleNumber }, 
          debugDayOffset: newDebugDayOffset 
        } as Task),
        debugDayOffset: newDebugDayOffset + 1
      };

      scene.updateTask(targetScene, taskId, updates as Partial<Task>);

      return true;
    } catch (error) {
      console.error('Debug进入下一周期失败:', error);
      return false;
    }
  }, [scene, detectScene]);

  // ========== 历史记录 ==========

  // 添加历史记录
  const addHistory = useCallback((
    taskId: string, 
    record: Omit<HistoryRecord, 'id' | 'timestamp'>, 
    sceneType?: SceneType
  ) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    // 使用模拟日期
    const newActivity = {
      id: generateId(),
      type: record.type as any,
      date: getSimulatedToday(task),
      timestamp: getSimulatedTimestamp(task),
    };

    scene.updateTask(targetScene, taskId, {
      activities: [...task.activities, newActivity],
    });
  }, [scene, detectScene]);

  // 获取历史记录
  const getHistory = useCallback((taskId: string, sceneType?: SceneType): HistoryRecord[] => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return [];

    const task = scene.getTaskById(taskId, targetScene);
    if (!task?.activities) return [];
    
    return task.activities.map(a => ({ 
      id: a.id, 
      timestamp: a.timestamp,
      type: a.type,
      date: a.date,
    })) as HistoryRecord[];
  }, [scene, detectScene]);

  // ========== 批量操作 ==========

  const batchUpdate = useCallback((sceneType: SceneType, updates: Array<{ id: string; data: Partial<Task> }>) => {
    scene.batchUpdate(sceneType, updates);
  }, [scene]);

  const batchDelete = useCallback((taskIds: string[], sceneType?: SceneType) => {
    taskIds.forEach(taskId => {
      deleteTask(taskId, sceneType);
    });
  }, [deleteTask]);

  const value: TaskContextValue = {
    selectedTaskId,
    setSelectedTaskId,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    tasks,
    setTasks,
    addTask,
    refreshTasks,
    getTaskById,
    checkIn,
    getTodayCheckInStatus,
    recordNumericData,
    updateChecklistItem,
    endPlanEarly,
    getGoalDetailData,
    updateTodayProgress,
    updateProgress,
    recordCheckIn,
    completeTask,
    archiveTask,
    calculateCycle,
    advanceCycle,
    debugNextDay,
    debugNextCycle,
    addHistory,
    getHistory,
    batchUpdate,
    batchDelete,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * 使用任务操作的 Hook
 */
export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export type { TaskContextValue, HistoryRecord, CycleInfo, TodayCheckInStatus, GoalDetailData } from './types';






