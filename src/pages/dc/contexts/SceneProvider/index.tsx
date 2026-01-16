/**
 * SceneProvider - 场景数据管理
 * 管理不同场景的数据、索引、缓存
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
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

  // ========== 支线任务快捷访问 ==========
  
  const sidelineTasks = useMemo(() => {
    const sidelineA = getTasksByType('sidelineA', 'normal');
    const sidelineB = getTasksByType('sidelineB', 'normal');
    return [...sidelineA, ...sidelineB].filter(task => !task.completed);
  }, [getTasksByType]);

  // ========== 场景快捷访问 ==========

  // 常规场景快捷访问
  const normal: NormalSceneAccess = useMemo(() => ({
    mainlineTasks: getTasksByType('mainline', 'normal'),
    sidelineTasks: [
      ...getTasksByType('sidelineA', 'normal'),
      ...getTasksByType('sidelineB', 'normal'),
    ],
    activeTasks: getTasksByStatus('active', 'normal'),
    completedTasks: getTasksByStatus('completed', 'normal'),
    archivedTasks: getTasksByStatus('archived', 'normal'),
    todayTasks: Array.from(scenes.normal.index.byDate.today)
      .map(id => scenes.normal.index.byId.get(id))
      .filter((task): task is Task => task !== undefined),
    getById: (id: string) => getTaskById(id, 'normal'),
  }), [scenes.normal, getTasksByType, getTasksByStatus, getTaskById]);

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

