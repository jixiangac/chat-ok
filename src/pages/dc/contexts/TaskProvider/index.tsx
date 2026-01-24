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
import { archiveTask as archiveTaskToStorage, getArchivedTasks } from '../../utils/archiveStorage';
import { getEffectiveMainlineType, getCurrentDate } from '../../utils';

// 导入重构后的辅助函数
import {
  calculateTodayProgress,
  getSimulatedToday,
  formatNumberPrecision
} from '../../utils/todayProgressCalculator';
import {
  validateCheckIn,
  createCheckInEntry,
  updateCheckInRecords,
  calculateStreak,
  calculateCheckInCycleProgress,
  detectCycleCompletion,
  createCheckInActivity,
  getTodayCheckInsFromRecords,
  mergeCheckInProgressUpdate
} from '../../utils/checkInHelper';
import {
  calculateNumericTotalProgress,
  calculateNumericCycleProgress,
  calculateCompensationTarget,
  createDebtSnapshot,
  createValueUpdateActivity,
  calculateOriginalCycleTargetValue,
  hasReachedFinalTarget,
  calculateCycleTimeInfo,
  handleLegacyDebtSnapshot,
  getRandomColorScheme
} from '../../utils/numericRecordHelper';

// 注意：DEBT_COLOR_SCHEMES 和 getRandomColorScheme 已从 numericRecordHelper 导入

// 创建 Context
const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

// 生成唯一 ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 注意：getSimulatedToday 已从 todayProgressCalculator 导入

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

// 注意：getTodayCheckInsFromRecords 已从 checkInHelper 导入

// 注意：formatNumberPrecision 和 calculateTodayProgress 已从 todayProgressCalculator 导入

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

  const getTaskById = useCallback((taskId: string, includeArchived: boolean = true): Task | undefined => {
    // 先在活跃任务中查找
    const activeTask = scene.getTaskById(taskId, 'normal');
    if (activeTask) return activeTask;

    // 如果允许且未找到，在归档任务中查找
    if (includeArchived) {
      const archivedTasks = getArchivedTasks();
      return archivedTasks.find(t => t.id === taskId);
    }

    return undefined;
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

  // 打卡功能（使用重构后的辅助函数）
  const checkIn = useCallback(async (
    taskId: string,
    value?: number,
    note?: string,
    sceneType?: SceneType
  ): Promise<{ success: boolean; cycleJustCompleted?: boolean; cycleNumber?: number }> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return { success: false };

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return { success: false };

    try {
      const simulatedToday = getSimulatedToday(task);
      const config = task.checkInConfig;
      const todayCheckIns = getTodayCheckInsFromRecords(task, simulatedToday);

      // 1. 验证是否可以打卡
      const validation = validateCheckIn(config, todayCheckIns);
      if (!validation.allowed) {
        console.log(validation.reason);
        return { success: false };
      }

      // 2. 创建打卡记录
      const newEntry = createCheckInEntry(value, note);

      // 3. 更新打卡记录数组
      const newRecords = updateCheckInRecords(
        config?.records || [],
        newEntry,
        simulatedToday,
        value
      );

      // 4. 计算连续打卡
      const streak = calculateStreak(newRecords, simulatedToday);
      const updatedConfig = {
        ...(config || {}),
        records: newRecords,
        currentStreak: streak.currentStreak,
        longestStreak: Math.max(config?.longestStreak || 0, streak.longestStreak)
      } as any;

      // 5. 计算周期进度
      const prevCyclePercentage = task.progress?.cyclePercentage || 0;
      const currentCycleNumber = task.cycle?.currentCycle || 1;
      let progressUpdate: Partial<Task> = {};

      if (task.category === 'CHECK_IN') {
        const cycleProgress = calculateCheckInCycleProgress(task, newRecords);
        progressUpdate = {
          progress: mergeCheckInProgressUpdate(task.progress, cycleProgress)
        };
      }

      // 6. 创建活动日志
      const newActivity = createCheckInActivity(
        simulatedToday,
        getSimulatedTimestamp(task),
        value,
        note
      );
      const updatedActivities = [...task.activities, newActivity];

      // 7. 计算更新后的今日进度
      const updatedTask = { ...task, checkInConfig: updatedConfig };
      const todayProgress = calculateTodayProgress(updatedTask as Task);

      // 8. 更新任务
      scene.updateTask(targetScene, taskId, {
        checkInConfig: updatedConfig,
        todayProgress,
        activities: updatedActivities,
        ...progressUpdate
      });

      // 9. 检测周期完成
      const newCyclePercentage = (progressUpdate.progress as any)?.cyclePercentage || 0;
      const completion = detectCycleCompletion(
        prevCyclePercentage,
        newCyclePercentage,
        currentCycleNumber
      );

      return {
        success: true,
        cycleJustCompleted: completion.cycleJustCompleted,
        cycleNumber: completion.cycleNumber
      };
    } catch (error) {
      console.error('打卡失败:', error);
      return { success: false };
    }
  }, [scene, detectScene]);

  // 记录数值型数据（使用重构后的辅助函数）
  const recordNumericData = useCallback(async (
    taskId: string,
    value: number,
    note?: string,
    sceneType?: SceneType
  ): Promise<boolean> => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      const config = task.numericConfig;
      if (!config) return false;

      const previousValue = config.currentValue;
      const progress = task.progress;
      const isDecrease = config.direction === 'DECREASE';
      const originalStart = config.originalStartValue ?? config.startValue;
      const totalChange = Math.abs(config.targetValue - originalStart);
      const perCycleTarget = config.perCycleTarget || (totalChange / task.cycle.totalCycles);

      // 1. 计算总进度
      const totalProgress = calculateNumericTotalProgress(config, value);

      // 2. 计算周期进度
      const cycleProgress = calculateNumericCycleProgress(config, progress, value, perCycleTarget);
      let { cyclePercentage, effectiveCycleChange, cycleStartValue } = cycleProgress;

      // 3. 更新数值配置
      const updatedNumericConfig = {
        ...config,
        currentValue: value
      };

      // 4. 创建活动日志
      const simulatedToday = getSimulatedToday(task);
      const newActivity = createValueUpdateActivity(
        previousValue,
        value,
        simulatedToday,
        getSimulatedTimestamp(task),
        note
      );

      // 5. 检查是否已达成最终目标
      const alreadyReachedFinalTarget = hasReachedFinalTarget(config, value);

      // 6. 计算 cycleAchieved 和 cycleRemaining
      let cycleAchieved = effectiveCycleChange;
      let cycleRemaining = Math.max(0, perCycleTarget - effectiveCycleChange);

      if (alreadyReachedFinalTarget) {
        cyclePercentage = 100;
        cycleRemaining = 0;
      }

      // 7. 计算原始周期目标值
      const originalCycleTargetValue = calculateOriginalCycleTargetValue(config, cycleStartValue, perCycleTarget);

      // 8. 构建基础更新对象
      const existingCompensationTarget = progress.compensationTargetValue;
      const updates: Partial<Task> = {
        numericConfig: updatedNumericConfig,
        activities: [...task.activities, newActivity],
        progress: {
          ...task.progress,
          totalPercentage: totalProgress.totalPercentage,
          cyclePercentage,
          cycleStartValue,
          cycleAchieved,
          cycleRemaining,
          lastUpdatedAt: dayjs().toISOString(),
          cycleTargetValue: originalCycleTargetValue,
          compensationTargetValue: existingCompensationTarget,
        }
      };

      // 9. 处理补偿目标值逻辑
      const debugOffset = (task as any).debugDayOffset || 0;
      const simulatedTodayDate = dayjs().add(debugOffset, 'day');
      const { daysInCurrentCycle, isInFirstHalf } = calculateCycleTimeInfo(task, simulatedTodayDate);
      const currentCycle = task.cycle.currentCycle;

      if (cyclePercentage >= 100 && isInFirstHalf && existingCompensationTarget === undefined) {
        const compensation = calculateCompensationTarget(
          config,
          value,
          currentCycle,
          perCycleTarget,
          progress
        );

        if (compensation.compensationTarget !== undefined) {
          // 设置补偿目标值
          (updates.progress as any).compensationTargetValue = compensation.compensationTarget;
          (updates.progress as any).debtFromCycle = compensation.compensationFromCycle;
          (updates.progress as any).cyclePercentage = compensation.compensationPercentage;

          // 创建欠账快照
          updates.previousCycleDebtSnapshot = createDebtSnapshot(
            currentCycle,
            compensation.compensationTarget,
            compensation.compensationFromCycle || 1,
            originalStart,
            value,
            compensation.compensationPercentage || 0
          );
        } else {
          // 清除补偿目标
          (updates.progress as any).compensationTargetValue = undefined;
          (updates.progress as any).debtFromCycle = undefined;
          updates.previousCycleDebtSnapshot = undefined;
        }
      }

      // 10. 处理旧版欠账快照兼容逻辑
      if (!updates.previousCycleDebtSnapshot) {
        const legacySnapshot = handleLegacyDebtSnapshot(
          task,
          cyclePercentage,
          value,
          daysInCurrentCycle,
          task.cycle.cycleDays
        );
        if (legacySnapshot) {
          updates.previousCycleDebtSnapshot = legacySnapshot;
        }
      }

      // 11. 计算更新后的今日进度
      const updatedTask = { ...task, ...updates };
      updates.todayProgress = calculateTodayProgress(updatedTask as Task);

      // 12. 更新任务
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
    updates: { status?: string; subProgress?: { current: number; total: number }; cycle?: number },
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
        // 更新清单项所属周期
        if (updates.cycle !== undefined) {
          items[itemIndex] = {
            ...items[itemIndex],
            cycle: updates.cycle,
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

  // 批量更新清单项周期（一次性更新多个，避免并发问题）
  const batchUpdateChecklistItemsCycle = useCallback(async (
    taskId: string,
    itemIds: string[],
    cycle: number,
    sceneType?: SceneType
  ): Promise<boolean> => {
    if (itemIds.length === 0) return true;

    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return false;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return false;

    try {
      const config = task.checklistConfig;
      if (!config) return false;

      // 一次性更新所有清单项的周期
      const items = [...(config.items || [])];
      const itemIdSet = new Set(itemIds);

      items.forEach((item, index) => {
        if (itemIdSet.has(item.id)) {
          items[index] = { ...item, cycle };
        }
      });

      // 计算更新后的进度
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

      // 一次性更新任务
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

      return true;
    } catch (error) {
      console.error('批量更新清单项周期失败:', error);
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

      // 处理清单类型任务：将未完成的清单项迁移到新周期
      let updatedChecklistConfig = task.checklistConfig;
      if (task.category === 'CHECKLIST' && task.checklistConfig) {
        const items = task.checklistConfig.items || [];
        const updatedItems = items.map(item => {
          // 只处理当前周期未完成的项
          if (item.cycle === currentCycle && item.status !== 'COMPLETED') {
            return {
              ...item,
              cycle: newCycleNumber,
              // 保留原始周期（如果还没有的话）
              originalCycle: item.originalCycle ?? currentCycle,
            };
          }
          return item;
        });
        updatedChecklistConfig = {
          ...task.checklistConfig,
          items: updatedItems,
        };
      }

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
        debugDayOffset: newDebugDayOffset + 1,
        // 清单类型：更新清单配置（包含迁移后的清单项）
        ...(updatedChecklistConfig && { checklistConfig: updatedChecklistConfig }),
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
    batchUpdateChecklistItemsCycle,
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






