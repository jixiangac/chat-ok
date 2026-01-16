/**
 * TaskProvider - 任务操作管理
 * 管理单条任务的增删改查、进度计算、周期管理
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Task, CheckInEntry } from '../../types';
import type { TaskContextValue, HistoryRecord, CycleInfo } from './types';
import type { SceneType } from '../SceneProvider/types';
import { useScene } from '../SceneProvider';

// 创建 Context
const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

// 生成唯一 ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
  const createTask = useCallback((sceneType: SceneType, taskData: Partial<Task>): Task => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title || '未命名任务',
      type: taskData.type || 'sidelineA',
      progress: taskData.progress || 0,
      currentDay: taskData.currentDay || 0,
      totalDays: taskData.totalDays || 30,
      ...taskData,
    };

    // 添加到场景
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

  // 任务列表（兼容旧版，返回 normal 场景的所有任务）
  const tasks = scene.getAllTasks('normal');

  // 设置任务列表（兼容旧版）
  const setTasks = useCallback((newTasks: Task[]) => {
    scene.setTasks('normal', newTasks);
  }, [scene]);

  // 添加任务（兼容旧版）
  const addTask = useCallback((task: Task) => {
    scene.addTask('normal', task);
  }, [scene]);

  // 刷新任务（兼容旧版）
  const refreshTasks = useCallback(() => {
    scene.refreshScene('normal');
  }, [scene]);

  // 根据 ID 获取任务（兼容旧版）
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

    scene.updateTask(targetScene, taskId, { progress });

    // 检查是否完成
    if (progress >= 100 && !task.completed) {
      completeTask(taskId, targetScene);
    }
  }, [scene, detectScene]);

  // 记录打卡
  const recordCheckIn = useCallback((taskId: string, entry: CheckInEntry, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task) return;

    // 添加打卡记录
    const checkIns = task.checkIns || [];
    const newCheckIn = {
      id: entry.id || generateId(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      value: entry.value,
    };

    scene.updateTask(targetScene, taskId, {
      checkIns: [...checkIns, newCheckIn],
    });
  }, [scene, detectScene]);

  // 完成任务
  const completeTask = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    scene.updateTask(targetScene, taskId, {
      completed: true,
      progress: 100,
    });
  }, [scene, detectScene]);

  // ========== 周期管理 ==========

  // 计算周期信息
  const calculateCycle = useCallback((taskId: string, sceneType?: SceneType): CycleInfo | null => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return null;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task || !task.startDate || !task.cycleDays || !task.totalCycles) {
      return null;
    }

    const startDate = new Date(task.startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const currentCycle = Math.min(
      Math.floor(daysSinceStart / task.cycleDays) + 1,
      task.totalCycles
    );
    
    const daysInCurrentCycle = daysSinceStart % task.cycleDays;
    const daysRemainingInCycle = task.cycleDays - daysInCurrentCycle;
    
    const cycleStartDate = new Date(startDate);
    cycleStartDate.setDate(cycleStartDate.getDate() + (currentCycle - 1) * task.cycleDays);
    
    const cycleEndDate = new Date(cycleStartDate);
    cycleEndDate.setDate(cycleEndDate.getDate() + task.cycleDays - 1);

    return {
      currentCycle,
      totalCycles: task.totalCycles,
      daysInCurrentCycle,
      daysRemainingInCycle,
      cycleStartDate: cycleStartDate.toISOString().split('T')[0],
      cycleEndDate: cycleEndDate.toISOString().split('T')[0],
      isLastCycle: currentCycle === task.totalCycles,
    };
  }, [scene, detectScene]);

  // 推进周期
  const advanceCycle = useCallback((taskId: string, sceneType?: SceneType) => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return;

    const task = scene.getTaskById(taskId, targetScene);
    if (!task?.mainlineTask) return;

    const cycleConfig = task.mainlineTask.cycleConfig;
    if (cycleConfig.currentCycle < cycleConfig.totalCycles) {
      scene.updateTask(targetScene, taskId, {
        mainlineTask: {
          ...task.mainlineTask,
          cycleConfig: {
            ...cycleConfig,
            currentCycle: cycleConfig.currentCycle + 1,
          },
        },
      });
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
    if (!task?.mainlineTask) return;

    const historyRecord = {
      id: generateId(),
      timestamp: Date.now(),
      ...record,
    };

    const history = task.mainlineTask.history || [];
    scene.updateTask(targetScene, taskId, {
      mainlineTask: {
        ...task.mainlineTask,
        history: [...history, historyRecord],
      },
    });
  }, [scene, detectScene]);

  // 获取历史记录
  const getHistory = useCallback((taskId: string, sceneType?: SceneType): HistoryRecord[] => {
    const targetScene = sceneType || detectScene(taskId);
    if (!targetScene) return [];

    const task = scene.getTaskById(taskId, targetScene);
    return (task?.mainlineTask?.history as HistoryRecord[]) || [];
  }, [scene, detectScene]);

  // ========== 批量操作 ==========

  // 批量更新
  const batchUpdate = useCallback((sceneType: SceneType, updates: Array<{ id: string; data: Partial<Task> }>) => {
    scene.batchUpdate(sceneType, updates);
  }, [scene]);

  // 批量删除
  const batchDelete = useCallback((taskIds: string[], sceneType?: SceneType) => {
    taskIds.forEach(taskId => {
      deleteTask(taskId, sceneType);
    });
  }, [deleteTask]);

  const value: TaskContextValue = {
    // 选中任务
    selectedTaskId,
    setSelectedTaskId,
    
    // 基础 CRUD
    createTask,
    updateTask,
    deleteTask,
    getTask,
    
    // 兼容旧版
    tasks,
    setTasks,
    addTask,
    refreshTasks,
    getTaskById,
    
    // 进度管理
    updateProgress,
    recordCheckIn,
    completeTask,
    
    // 周期管理
    calculateCycle,
    advanceCycle,
    
    // 历史记录
    addHistory,
    getHistory,
    
    // 批量操作
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

// 导出类型
export type { TaskContextValue, HistoryRecord, CycleInfo } from './types';

