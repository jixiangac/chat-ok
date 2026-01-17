/**
 * SceneProvider - 场景数据管理
 * 管理不同场景的数据、索引、缓存
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import dayjs from 'dayjs';
import type { Task, TaskType } from '../../types';
import type { 
  SceneContextValue, 
  SceneType, 
  SceneData, 
  NormalSceneAccess,
  VacationSceneData,
  MemorialSceneData,
  OKRSceneData,
  TabConfig
} from './types';
import { createEmptySceneData } from './types';
import { buildIndex, addToIndex, removeFromIndex, updateInIndex } from './indexBuilder';
import { CacheManager } from './cacheManager';
import { loadSceneData, saveSceneData, needsMigration, performMigration } from './storage';
import { useSpriteImage } from '../../hooks';
import { filterDailyViewTasks, getCachedDailyTaskIds, saveDailyTaskIdsCache, clearDailyViewCache, getCurrentDate } from '../../utils';
import { calculateRemainingDays } from '../../utils/mainlineTaskHelper';
import { getTodayMustCompleteTaskIds } from '../../utils/todayMustCompleteStorage';
import { getArchivedTasks } from '../../utils/archiveStorage';
import { performDailyReset } from '../../utils/dailyDataReset';
import { DATE_CHANGE_EVENT } from '../AppProvider';
import type { DateChangeInfo } from '../AppProvider/types';

// 创建 Context
const SceneContext = createContext<SceneContextValue | null>(null);

interface SceneProviderProps {
  children: ReactNode;
}

// Tab 配置
const TABS: TabConfig[] = [
  { key: 'normal', label: '常规' },
  { key: 'vacation', label: '度假' },
  { key: 'memorial', label: '纪念' },
  { key: 'okr', label: 'OKR' },
];

export function SceneProvider({ children }: SceneProviderProps) {
  // 各场景数据
  const [scenes, setScenes] = useState<Record<SceneType, SceneData>>({
    normal: createEmptySceneData(),
    vacation: createEmptySceneData(),
    memorial: createEmptySceneData(),
    okr: createEmptySceneData(),
  });

  // 缓存管理器
  const cacheManager = useMemo(() => new CacheManager(), []);

  // 小精灵图片
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage();

  // 初始化时加载数据
  useEffect(() => {
    // 检查是否需要迁移
    if (needsMigration()) {
      const migratedData = performMigration();
      setScenes(prev => ({
        ...prev,
        normal: migratedData,
      }));
    } else {
      // 加载各场景数据
      setScenes({
        normal: loadSceneData('normal'),
        vacation: loadSceneData('vacation'),
        memorial: loadSceneData('memorial'),
        okr: loadSceneData('okr'),
      });
    }
  }, []);

  // 监听日期变更事件
  useEffect(() => {
    const handleDateChange = (event: CustomEvent<DateChangeInfo>) => {
      const { newDate, daysDiff } = event.detail;
      console.log('[SceneProvider] 收到日期变更事件:', event.detail);
      
      // 1. 清空一日清单缓存
      clearDailyViewCache();
      console.log('[SceneProvider] 已清空一日清单缓存');
      
      // 2. 执行每日数据重置
      setScenes(prev => {
        const normalTasks = prev.normal.tasks;
        
        // 执行重置
        const resetResult = performDailyReset(normalTasks, newDate);
        console.log('[SceneProvider] 每日重置结果:', {
          resetCount: resetResult.resetCount,
          cycleAdvancedCount: resetResult.cycleAdvancedCount,
          cycleAdvanceLogs: resetResult.cycleAdvanceLogs,
        });
        
        // 如果有任务被更新，更新场景数据
        if (resetResult.resetCount > 0 || resetResult.cycleAdvancedCount > 0) {
          const newSceneData: SceneData = {
            tasks: resetResult.updatedTasks,
            index: buildIndex(resetResult.updatedTasks),
            meta: {
              lastUpdate: Date.now(),
              version: prev.normal.meta.version + 1,
            },
          };
          
          // 清除缓存
          cacheManager.clearScene('normal');
          
          // 保存到 localStorage
          saveSceneData('normal', newSceneData);
          
          return { ...prev, normal: newSceneData };
        }
        
        return prev;
      });
    };

    // 添加事件监听
    window.addEventListener(DATE_CHANGE_EVENT, handleDateChange as EventListener);
    
    return () => {
      window.removeEventListener(DATE_CHANGE_EVENT, handleDateChange as EventListener);
    };
  }, [cacheManager]);

  // ========== 快速查询方法 ==========

  // 按 ID 获取任务（O(1)）
  const getTaskById = useCallback((taskId: string, scene: SceneType = 'normal'): Task | undefined => {
    return scenes[scene].index.byId.get(taskId);
  }, [scenes]);

  // 按类型获取任务
  const getTasksByType = useCallback((type: TaskType, scene: SceneType): Task[] => {
    const cacheKey = `tasks_by_type_${type}`;
    
    // 尝试从缓存获取
    const cached = cacheManager.get<Task[]>(scene, cacheKey);
    if (cached) return cached;
    
    // 从索引获取
    const typeIndex = scenes[scene].index.byType;
    let ids: Set<string>;
    
    if (type === 'mainline') {
      ids = typeIndex.mainline;
    } else if (type === 'sidelineA') {
      ids = typeIndex.sidelineA;
    } else {
      ids = typeIndex.sidelineB;
    }
    
    const tasks = Array.from(ids)
      .map(id => scenes[scene].index.byId.get(id))
      .filter((task): task is Task => task !== undefined);
    
    // 缓存结果
    cacheManager.set(scene, cacheKey, tasks);
    
    return tasks;
  }, [scenes, cacheManager]);

  // 按状态获取任务
  const getTasksByStatus = useCallback((status: string, scene: SceneType): Task[] => {
    const cacheKey = `tasks_by_status_${status}`;
    
    const cached = cacheManager.get<Task[]>(scene, cacheKey);
    if (cached) return cached;
    
    const statusIndex = scenes[scene].index.byStatus;
    const ids = statusIndex[status as keyof typeof statusIndex];
    if (!ids) return [];
    
    const tasks = Array.from(ids)
      .map(id => scenes[scene].index.byId.get(id))
      .filter((task): task is Task => task !== undefined);
    
    cacheManager.set(scene, cacheKey, tasks);
    
    return tasks;
  }, [scenes, cacheManager]);

  // 按标签获取任务
  const getTasksByTag = useCallback((tagId: string, scene: SceneType): Task[] => {
    const cacheKey = `tasks_by_tag_${tagId}`;
    
    const cached = cacheManager.get<Task[]>(scene, cacheKey);
    if (cached) return cached;
    
    const ids = scenes[scene].index.byTag.get(tagId);
    if (!ids) return [];
    
    const tasks = Array.from(ids)
      .map(id => scenes[scene].index.byId.get(id))
      .filter((task): task is Task => task !== undefined);
    
    cacheManager.set(scene, cacheKey, tasks);
    
    return tasks;
  }, [scenes, cacheManager]);

  // 批量获取任务
  const getTasksByIds = useCallback((ids: string[], scene: SceneType = 'normal'): Task[] => {
    return ids
      .map(id => scenes[scene].index.byId.get(id))
      .filter((task): task is Task => task !== undefined);
  }, [scenes]);

  // 获取所有任务
  const getAllTasks = useCallback((scene: SceneType): Task[] => {
    return scenes[scene].tasks;
  }, [scenes]);

  // ========== 数据操作 ==========

  // 添加任务
  const addTask = useCallback((scene: SceneType, task: Task) => {
    setScenes(prev => {
      const sceneData = prev[scene];
      const newTasks = [...sceneData.tasks, task];
      const newIndex = addToIndex(sceneData.index, task);
      
      const newSceneData: SceneData = {
        tasks: newTasks,
        index: newIndex,
        meta: {
          lastUpdate: Date.now(),
          version: sceneData.meta.version + 1,
        },
      };
      
      // 清除相关缓存
      cacheManager.clearScene(scene);
      
      // 保存到 localStorage
      saveSceneData(scene, newSceneData);
      
      return { ...prev, [scene]: newSceneData };
    });
  }, [cacheManager]);

  // 更新任务
  const updateTask = useCallback((scene: SceneType, taskId: string, updates: Partial<Task>) => {
    setScenes(prev => {
      const sceneData = prev[scene];
      const taskIndex = sceneData.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const updatedTask = { ...sceneData.tasks[taskIndex], ...updates };
      const newTasks = [...sceneData.tasks];
      newTasks[taskIndex] = updatedTask;
      
      const newIndex = updateInIndex(sceneData.index, updatedTask);
      
      const newSceneData: SceneData = {
        tasks: newTasks,
        index: newIndex,
        meta: {
          lastUpdate: Date.now(),
          version: sceneData.meta.version + 1,
        },
      };
      
      // 清除相关缓存
      cacheManager.clearScene(scene);
      
      // 保存到 localStorage
      saveSceneData(scene, newSceneData);
      
      return { ...prev, [scene]: newSceneData };
    });
  }, [cacheManager]);

  // 删除任务
  const deleteTask = useCallback((scene: SceneType, taskId: string) => {
    setScenes(prev => {
      const sceneData = prev[scene];
      const newTasks = sceneData.tasks.filter(t => t.id !== taskId);
      const newIndex = removeFromIndex(sceneData.index, taskId);
      
      const newSceneData: SceneData = {
        tasks: newTasks,
        index: newIndex,
        meta: {
          lastUpdate: Date.now(),
          version: sceneData.meta.version + 1,
        },
      };
      
      // 清除相关缓存
      cacheManager.clearScene(scene);
      
      // 保存到 localStorage
      saveSceneData(scene, newSceneData);
      
      return { ...prev, [scene]: newSceneData };
    });
  }, [cacheManager]);

  // 批量更新
  const batchUpdate = useCallback((scene: SceneType, updates: Array<{ id: string; data: Partial<Task> }>) => {
    setScenes(prev => {
      const sceneData = prev[scene];
      let newTasks = [...sceneData.tasks];
      let newIndex = sceneData.index;
      
      updates.forEach(({ id, data }) => {
        const taskIndex = newTasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
          const updatedTask = { ...newTasks[taskIndex], ...data };
          newTasks[taskIndex] = updatedTask;
          newIndex = updateInIndex(newIndex, updatedTask);
        }
      });
      
      const newSceneData: SceneData = {
        tasks: newTasks,
        index: newIndex,
        meta: {
          lastUpdate: Date.now(),
          version: sceneData.meta.version + 1,
        },
      };
      
      // 清除相关缓存
      cacheManager.clearScene(scene);
      
      // 保存到 localStorage
      saveSceneData(scene, newSceneData);
      
      return { ...prev, [scene]: newSceneData };
    });
  }, [cacheManager]);

  // 设置任务列表
  const setTasks = useCallback((scene: SceneType, tasks: Task[]) => {
    setScenes(prev => {
      const newSceneData: SceneData = {
        tasks,
        index: buildIndex(tasks),
        meta: {
          lastUpdate: Date.now(),
          version: prev[scene].meta.version + 1,
        },
      };
      
      // 清除相关缓存
      cacheManager.clearScene(scene);
      
      // 保存到 localStorage
      saveSceneData(scene, newSceneData);
      
      return { ...prev, [scene]: newSceneData };
    });
  }, [cacheManager]);

  // ========== 缓存管理 ==========

  const getCached = useCallback(<T,>(scene: SceneType, key: string): T | undefined => {
    return cacheManager.get<T>(scene, key);
  }, [cacheManager]);

  const setCache = useCallback(<T,>(scene: SceneType, key: string, value: T, ttl?: number) => {
    cacheManager.set(scene, key, value, ttl);
  }, [cacheManager]);

  const clearCache = useCallback((scene: SceneType, key?: string) => {
    if (key) {
      cacheManager.delete(scene, key);
    } else {
      cacheManager.clearScene(scene);
    }
  }, [cacheManager]);

  // ========== 数据刷新 ==========

  const refreshScene = useCallback((scene: SceneType) => {
    const loaded = loadSceneData(scene);
    setScenes(prev => ({ ...prev, [scene]: loaded }));
    cacheManager.clearScene(scene);
  }, [cacheManager]);

  const rebuildIndex = useCallback((scene: SceneType) => {
    setScenes(prev => {
      const sceneData = prev[scene];
      const newSceneData: SceneData = {
        ...sceneData,
        index: buildIndex(sceneData.tasks),
        meta: {
          ...sceneData.meta,
          lastUpdate: Date.now(),
        },
      };
      return { ...prev, [scene]: newSceneData };
    });
    cacheManager.clearScene(scene);
  }, [cacheManager]);

  // ========== 任务完成状态检查方法 ==========

  /**
   * 检查任务今日是否已完成打卡
   */
  const isTodayCompleted = useCallback((task: Task): boolean => {
    const today = getCurrentDate();
    const checkInConfig = task.checkInConfig;
    if (!checkInConfig) return false;
    
    const records = checkInConfig.records || [];
    const todayRecord = records.find(r => r.date === today);
    return todayRecord?.checked === true;
  }, []);

  /**
   * 检查任务当前周期是否已完成目标
   */
  const isCycleCompleted = useCallback((task: Task): boolean => {
    // 使用新格式的 cyclePercentage
    if (task.progress?.cyclePercentage >= 100) return true;
    
    // 检查打卡配置
    const checkInConfig = task.checkInConfig;
    if (checkInConfig) {
      const records = checkInConfig.records || [];
      
      const startDate = task.time.startDate;
      const cycleDays = task.cycle.cycleDays;
      const currentCycle = task.cycle.currentCycle;
      
      if (startDate) {
        const cycleStartDate = dayjs(startDate).add((currentCycle - 1) * cycleDays, 'day');
        const cycleEndDate = cycleStartDate.add(cycleDays, 'day');
        const cycleRecords = records.filter(r => {
          const recordDate = dayjs(r.date);
          return recordDate.isAfter(cycleStartDate.subtract(1, 'day')) &&
                 recordDate.isBefore(cycleEndDate) && r.checked;
        });
        
        if (checkInConfig.unit === 'TIMES') {
          const target = checkInConfig.cycleTargetTimes || checkInConfig.perCycleTarget || cycleDays;
          if (cycleRecords.length >= target) return true;
        } else if (checkInConfig.unit === 'DURATION') {
          const totalMinutes = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
          const target = checkInConfig.cycleTargetMinutes || checkInConfig.perCycleTarget || 0;
          if (totalMinutes >= target) return true;
        } else if (checkInConfig.unit === 'QUANTITY') {
          const totalValue = cycleRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
          const target = checkInConfig.cycleTargetValue || checkInConfig.perCycleTarget;
          if (target && totalValue >= target) return true;
        }
      }
    }
    return false;
  }, []);

  /**
   * 获取周期完成率
   */
  const getCycleProgress = useCallback((task: Task): number => {
    return task.progress?.cyclePercentage || 0;
  }, []);

  // ========== 今日必须完成任务ID ==========
  
  const mustCompleteIds = useMemo(() => {
    return getTodayMustCompleteTaskIds();
  }, [scenes.normal.meta.version]);

  // ========== 支线任务快捷访问 ==========
  
  const sidelineTasks = useMemo(() => {
    const sidelineA = getTasksByType('sidelineA', 'normal');
    const sidelineB = getTasksByType('sidelineB', 'normal');
    return [...sidelineA, ...sidelineB].filter(task => task.status !== 'COMPLETED');
  }, [getTasksByType]);

  // ========== 场景快捷访问 ==========
  
  // 常规场景的活跃任务（排除已归档）
  const normalActiveTasks = useMemo(() => {
    return scenes.normal.tasks.filter(t => t.status !== 'ARCHIVED' && t.status !== 'ARCHIVED_HISTORY');
  }, [scenes.normal.tasks]);

  // 常规场景的主线任务
  const normalMainlineTasks = useMemo(() => {
    return normalActiveTasks.filter(t => t.type === 'mainline');
  }, [normalActiveTasks]);

  // 常规场景的支线任务（已排序）
  // 排序规则：
  // 1. 今日必须完成的在最前面
  // 2. 今日已完成的排序靠后
  // 3. 周期完成率100%的最后
  // 4. 周期完成100%并且今日完成的最最后
  const normalSidelineTasks = useMemo(() => {
    return normalActiveTasks
      .filter(t => t.type === 'sidelineA' || t.type === 'sidelineB')
      .sort((a, b) => {
        const aIsMustComplete = mustCompleteIds.includes(a.id);
        const bIsMustComplete = mustCompleteIds.includes(b.id);
        const aTodayCompleted = a.todayProgress?.isCompleted ?? false;
        const bTodayCompleted = b.todayProgress?.isCompleted ?? false;
        const aCycleCompleted = (a.progress?.cyclePercentage ?? 0) >= 100;
        const bCycleCompleted = (b.progress?.cyclePercentage ?? 0) >= 100;
        
        // 1. 今日必须完成的在最前面
        if (aIsMustComplete && !bIsMustComplete) return -1;
        if (!aIsMustComplete && bIsMustComplete) return 1;
        
        // 2. 今日已完成的排序靠后
        if (!aTodayCompleted && bTodayCompleted) return -1;
        if (aTodayCompleted && !bTodayCompleted) return 1;
        
        // 3. 周期完成率100%的最后
        if (!aCycleCompleted && bCycleCompleted) return -1;
        if (aCycleCompleted && !bCycleCompleted) return 1;
        
        return 0;
      });
  }, [normalActiveTasks, mustCompleteIds]);

  // ========== 一日清单任务ID ==========
  
  const dailyViewTaskIds = useMemo(() => {
    // 1. 尝试从缓存获取今日任务ID列表
    const cachedTaskIds = getCachedDailyTaskIds();

    if (cachedTaskIds&&cachedTaskIds.length) {
      return cachedTaskIds;
    }
    
    // 2. 执行智能筛选逻辑
    const allTasks = [...normalMainlineTasks, ...normalSidelineTasks];

    if (!allTasks.length) {
      return []
    }

    const dailyTasks = filterDailyViewTasks(allTasks);

    const taskIds = dailyTasks.map(t => t.id);
    
    // 3. 保存到缓存，确保全天结果一致
    saveDailyTaskIdsCache(taskIds);
    
    return taskIds;
  }, [normalMainlineTasks, normalSidelineTasks, scenes.normal.meta.version]);

  // 计算今日完成率（基于一日清单）
  // 每个任务按 todayProgress 计算进度比例：完成=100%，否则按 todayValue/dailyTarget 计算
  // 最终完成率 = 所有任务进度比例之和 / 任务数量
  const todayProgress = useMemo(() => {
    // 基于一日清单的任务ID来计算
    if (dailyViewTaskIds.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    // 获取一日清单中的任务
    const dailyTasks = dailyViewTaskIds
      .map(id => scenes.normal.index.byId.get(id))
      .filter((task): task is Task => task !== undefined);

    const totalCount = dailyTasks.length;
    let completedCount = 0;
    let totalProgressRatio = 0;

    dailyTasks.forEach(task => {
      const tp = task.todayProgress;
      
      if (tp?.isCompleted) {
        // 已完成的任务算 100%
        completedCount++;
        totalProgressRatio += 1;
      } else if (tp && (tp.dailyTarget ?? 0) > 0) {
        // 未完成但有进度的任务，按比例计算
        // 使用绝对值处理减少型任务（todayValue 可能为负数）
        const ratio = Math.min(1, Math.max(0, Math.abs(tp.todayValue ?? 0) / (tp.dailyTarget ?? 1)));
        totalProgressRatio += ratio;
      }
      // 没有 todayProgress 或 dailyTarget 为 0 的任务，进度算 0
    });

    const percentage = totalCount > 0 ? Math.round((totalProgressRatio / totalCount) * 100) : 0;
    
    return { completed: completedCount, total: totalCount, percentage };
  }, [dailyViewTaskIds, scenes.normal.index.byId]);

  // 归档任务（从独立存储获取）
  const archivedTasks = useMemo(() => {
    return getArchivedTasks();
  }, [scenes.normal.meta.version]);

  // 常规场景快捷访问
  const normal: NormalSceneAccess = useMemo(() => ({
    mainlineTasks: normalMainlineTasks,
    sidelineTasks: normalSidelineTasks,
    displayedSidelineTasks: normalSidelineTasks.slice(0, 3),
    activeTasks: getTasksByStatus('active', 'normal'),
    completedTasks: getTasksByStatus('completed', 'normal'),
    archivedTasks,
    todayTasks: Array.from(scenes.normal.index.byDate.today)
      .map(id => scenes.normal.index.byId.get(id))
      .filter((task): task is Task => task !== undefined),
    hasMainlineTask: normalMainlineTasks.length > 0,
    todayProgress,
    dailyViewTaskIds,
    isTodayCompleted,
    isCycleCompleted,
    getById: (id: string) => getTaskById(id, 'normal'),
  }), [scenes.normal, normalMainlineTasks, normalSidelineTasks, archivedTasks, getTasksByStatus, getTaskById, todayProgress, dailyViewTaskIds, isTodayCompleted, isCycleCompleted]);

  // 度假场景（待实现）
  const vacation: VacationSceneData = useMemo(() => ({
    activities: [],
    memories: [],
  }), []);

  // 纪念日场景（待实现）
  const memorial: MemorialSceneData = useMemo(() => ({
    events: [],
    countdowns: [],
  }), []);

  // OKR 场景（待实现）
  const okr: OKRSceneData = useMemo(() => ({
    objectives: [],
    keyResults: [],
  }), []);

  const value: SceneContextValue = {
    // Tab 配置
    tabs: TABS,
    
    // 小精灵
    spriteImage: getCurrentSpriteImage(),
    randomizeSpriteImage,
    
    // 快捷访问
    sidelineTasks,
    
    // 快速查询
    getTaskById,
    getTasksByType,
    getTasksByStatus,
    getTasksByTag,
    getTasksByIds,
    getAllTasks,
    
    // 场景快捷访问
    normal,
    vacation,
    memorial,
    okr,
    
    // 数据操作
    addTask,
    updateTask,
    deleteTask,
    batchUpdate,
    setTasks,
    
    // 缓存管理
    getCached,
    setCache,
    clearCache,
    
    // 数据刷新
    refreshScene,
    rebuildIndex,
  };

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

/**
 * 使用场景数据的 Hook
 */
export function useScene(): SceneContextValue {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}

// 导出类型
export type { SceneType, SceneData, NormalSceneAccess } from './types';
