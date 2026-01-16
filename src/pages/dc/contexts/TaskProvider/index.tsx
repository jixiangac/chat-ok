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
import { getEffectiveMainlineType } from '../../utils';

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

// 获取模拟的"今天"日期
const getSimulatedToday = (task: Task): string => {
  const offset = (task as any).debugDayOffset || 0;
  return dayjs().add(offset, 'day').format('YYYY-MM-DD');
};

// 获取模拟的时间戳
const getSimulatedTimestamp = (task: Task): number => {
  const offset = (task as any).debugDayOffset || 0;
  return dayjs().add(offset, 'day').valueOf();
};

// 从 checkInConfig.records 获取今日打卡记录
const getTodayCheckInsFromRecords = (task: Task, effectiveToday: string): CheckInEntry[] => {
  const records = task.checkInConfig?.records || [];
  const todayRecord = records.find(r => r.date === effectiveToday);
  return todayRecord?.entries || [];
};

// 计算今日进度
const calculateTodayProgress = (task: Task): TodayProgress => {
  const effectiveToday = getSimulatedToday(task);
  const checkInConfig = task.checkInConfig;
  const todayCheckIns = getTodayCheckInsFromRecords(task, effectiveToday);

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
    const dailyTarget = checkInConfig.dailyTargetMinutes || 15;
    return {
      canCheckIn: todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue,
      isCompleted: todayValue >= dailyTarget,
      dailyTarget,
      lastUpdatedAt: dayjs().toISOString()
    };
  } else if (unit === 'QUANTITY') {
    const dailyTarget = checkInConfig.dailyTargetValue || 0;
    return {
      canCheckIn: dailyTarget === 0 || todayValue < dailyTarget,
      todayCount: todayCheckIns.length,
      todayValue,
      isCompleted: dailyTarget > 0 && todayValue >= dailyTarget,
      dailyTarget,
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
      startDate: taskData.startDate || dayjs().format('YYYY-MM-DD'),
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
      records[todayRecordIndex] = {
        ...records[todayRecordIndex],
        checked: true,
        entries: [...records[todayRecordIndex].entries, newEntry],
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
    
    // 获取模拟的"今天"日期
    const debugOffset = (task as any).debugDayOffset || 0;
    const realToday = dayjs();
    const simulatedToday = realToday.add(debugOffset, 'day');
    
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
      scene.updateTask(targetScene, taskId, {
        cycle: {
          ...task.cycle,
          currentCycle: cycleConfig.currentCycle + 1,
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

    const effectiveToday = getSimulatedToday(task);
    const checkInConfig = task.checkInConfig;
    const todayCheckIns = getTodayCheckInsFromRecords(task, effectiveToday);

    if (!checkInConfig) {
      return {
        canCheckIn: todayCheckIns.length === 0,
        todayCount: todayCheckIns.length,
        todayValue: 0,
        isCompleted: todayCheckIns.length > 0
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
        dailyTarget: dailyMax
      };
    } else if (unit === 'DURATION') {
      const dailyTarget = checkInConfig.dailyTargetMinutes || 15;
      return {
        canCheckIn: todayValue < dailyTarget,
        todayCount: todayCheckIns.length,
        todayValue,
        isCompleted: todayValue >= dailyTarget,
        dailyTarget
      };
    } else if (unit === 'QUANTITY') {
      const dailyTarget = checkInConfig.dailyTargetValue || 0;
      return {
        canCheckIn: dailyTarget === 0 || todayValue < dailyTarget,
        todayCount: todayCheckIns.length,
        todayValue,
        isCompleted: dailyTarget > 0 && todayValue >= dailyTarget,
        dailyTarget
      };
    }

    return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false };
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
        records[todayRecordIndex] = {
          ...records[todayRecordIndex],
          checked: true,
          entries: [...records[todayRecordIndex].entries, newEntry],
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
        const cycleInfo = calculateCycle(taskId, targetScene);
        const totalCycles = task.cycle.totalCycles;
        const perCycleTarget = config?.perCycleTarget || 1;
        const unit = config?.unit || 'TIMES';

        if (cycleInfo) {
          const cycleRecords = records.filter(r =>
            r.date >= cycleInfo.cycleStartDate && r.date <= cycleInfo.cycleEndDate && r.checked
          );

          let currentCycleValue: number;
          let totalValue: number;

          if (unit === 'TIMES') {
            currentCycleValue = cycleRecords.reduce((sum, r) => sum + r.entries.length, 0);
            totalValue = records.filter(r => r.checked).reduce((sum, r) => sum + r.entries.length, 0);
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
  }, [scene, detectScene, calculateCycle]);

  // 记录数值型数据
  const recordNumericData = useCallback(async (taskId: string, value: number, note?: string, sceneType?: SceneType): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      const config = task.numericConfig;
      if (!config) return false;

      const previousValue = config.currentValue;
      const change = value - previousValue;

      const isDecrease = config.direction === 'DECREASE';
      const originalStart = config.originalStartValue ?? config.startValue;
      const totalChange = Math.abs(config.targetValue - originalStart);
      const rawChange = value - originalStart;
      const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
      const totalPercentage = totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;

      const perCycleTarget = config.perCycleTarget || (totalChange / task.cycle.totalCycles);

      const cycleInfo = calculateCycle(taskId, targetScene);
      
      // 计算周期起始值
      let cycleStartValue = config.startValue;
      const cycleSnapshots = (task as any).cycleSnapshots || [];
      if (cycleSnapshots.length > 0) {
        const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
        if (lastSnapshot.actualValue !== undefined) {
          cycleStartValue = lastSnapshot.actualValue;
        }
      }

      const rawCycleChange = value - cycleStartValue;
      const effectiveCycleChange = isDecrease ? Math.max(0, -rawCycleChange) : Math.max(0, rawCycleChange);
      const cyclePercentage = perCycleTarget > 0 ? Math.min(100, Math.round((effectiveCycleChange / perCycleTarget) * 100)) : 0;

      const updatedNumericConfig = {
        ...config,
        currentValue: value
      };

      // 添加活动日志（使用模拟日期）
      const simulatedToday = getSimulatedToday(task);
      const newActivity = {
        id: generateId(),
        type: 'UPDATE_VALUE' as const,
        date: simulatedToday,
        timestamp: getSimulatedTimestamp(task),
        oldValue: previousValue,
        newValue: value,
        delta: change,
        note: note || undefined
      };

      // 计算 cycleAchieved 和 cycleRemaining（数值型任务）
      const cycleAchieved = effectiveCycleChange;
      const cycleRemaining = Math.max(0, perCycleTarget - effectiveCycleChange);

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
          cycleTargetValue: cycleStartValue + perCycleTarget * (isDecrease ? -1 : 1),
        }
      };

      // 处理欠账快照逻辑
      if (cycleSnapshots.length > 0 && cyclePercentage >= 100 && cycleInfo) {
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
            const remainingDays = cycleInfo.daysRemainingInCycle;
            const cycleDays = task.cycle.cycleDays;

            if (remainingDays > cycleDays / 2 && !task.previousCycleDebtSnapshot) {
              const colorScheme = getRandomColorScheme();
              updates.previousCycleDebtSnapshot = {
                currentCycleNumber: cycleInfo.currentCycle,
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
  }, [scene, detectScene, calculateCycle]);

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

      // 计算当前周期内已过的天数（基于 debugDayOffset）
      // 每个周期有 cycleDays 天，当 offset 超过当前周期的天数时，需要进入下一周期
      const daysInCurrentCycle = currentOffset % cycleDays;
      const newDaysInCycle = (currentOffset + 1) % cycleDays;

      // 如果新的天数回到 0，说明超过了周期天数，需要进入下一周期
      const shouldEnterNextCycle = newDaysInCycle === 0 && currentOffset > 0;

      // 更新 debugDayOffset
      scene.updateTask(targetScene, taskId, { debugDayOffset: newOffset } as any);

      if (shouldEnterNextCycle) {
        // 调用 debugNextCycle 的逻辑
        const updatedTask = scene.getTaskById(taskId, targetScene);
        if (updatedTask) {
          const totalCycles = updatedTask.cycle.totalCycles;
          const currentCycleNum = updatedTask.cycle.currentCycle;

          if (currentCycleNum >= totalCycles) {
            // 已经是最后一个周期，结束计划
            scene.updateTask(targetScene, taskId, {
              status: 'COMPLETED',
              isPlanEnded: true,
              time: {
                ...updatedTask.time,
                completedAt: dayjs().toISOString()
              }
            });
          } else {
            // 进入下一周期
            const newCycleNumber = currentCycleNum + 1;
            const perCycleTarget = updatedTask.checkInConfig?.perCycleTarget || updatedTask.numericConfig?.perCycleTarget || updatedTask.checklistConfig?.perCycleTarget || 0;

            scene.updateTask(targetScene, taskId, {
              cycle: {
                ...updatedTask.cycle,
                currentCycle: newCycleNumber
              },
              progress: {
                ...updatedTask.progress,
                cyclePercentage: 0,
                cycleAchieved: 0,
                cycleRemaining: perCycleTarget,
                lastUpdatedAt: dayjs().toISOString()
              }
            });
          }
        }
      }

      // 重新计算新一天的 todayProgress
      const finalTask = scene.getTaskById(taskId, targetScene);
      if (finalTask) {
        scene.updateTask(targetScene, taskId, {
          todayProgress: calculateTodayProgress(finalTask)
        });
      }

      return { success: true, enteredNextCycle: shouldEnterNextCycle };
    } catch (error) {
      console.error('Debug进入下一天失败:', error);
      return { success: false, enteredNextCycle: false };
    }
  }, [scene, detectScene, calculateCycle]);

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
        // 和 endPlanEarly 一样结束计划
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

      // 根据 startDate 重新计算 debugDayOffset，使模拟日期为新周期的第一天
      const startDate = dayjs(task.time.startDate);
      // const realToday = dayjs();
      // 新周期的开始日期 = startDate + (newCycleNumber - 1) * cycleDays
      const newCycleStartDate = startDate.add((newCycleNumber - 1) * cycleDays, 'day');
      const newDebugDayOffset = newCycleStartDate.diff(startDate, 'day');

      // 获取新周期的目标值用于重置 cycleRemaining
      const perCycleTarget = task.checkInConfig?.perCycleTarget || task.numericConfig?.perCycleTarget || task.checklistConfig?.perCycleTarget || 0;

      // 更新 cycle.currentCycle 和重置周期相关的 progress 数据
      scene.updateTask(targetScene, taskId, ({
        cycle: {
          ...task.cycle,
          currentCycle: newCycleNumber
        },
        progress: {
          ...task.progress,
          cyclePercentage: 0,
          cycleAchieved: 0,
          cycleRemaining: perCycleTarget,
          lastUpdatedAt: dayjs().toISOString()
        },
        todayProgress: calculateTodayProgress({ ...task, cycle: { ...task.cycle, currentCycle: newCycleNumber }, debugDayOffset: newDebugDayOffset } as Task),
        debugDayOffset: newDebugDayOffset
      }) as Partial<Task>);

      return true;
    } catch (error) {
      console.error('Debug进入下一周期失败:', error);
      return false;
    }
  }, [scene, detectScene, calculateCycle]);

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



























