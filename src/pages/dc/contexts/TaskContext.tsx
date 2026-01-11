import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Task } from '../types';

const STORAGE_KEY = 'dc_tasks';

// 从 localStorage 读取任务
const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

// 保存任务到 localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

interface TaskContextValue {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  refreshTasks: () => void;
  getTaskById: (taskId: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasksState] = useState<Task[]>([]);

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasksState(loadedTasks);
  }, []);

  // 设置任务列表并保存到 localStorage
  const setTasks = useCallback((newTasks: Task[]) => {
    setTasksState(newTasks);
    saveTasksToStorage(newTasks);
  }, []);

  // 添加任务
  const addTask = useCallback((task: Task) => {
    setTasksState(prev => {
      const newTasks = [...prev, task];
      saveTasksToStorage(newTasks);
      return newTasks;
    });
  }, []);

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasksState(prev => {
      const newTasks = prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      saveTasksToStorage(newTasks);
      return newTasks;
    });
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    setTasksState(prev => {
      const newTasks = prev.filter(task => task.id !== taskId);
      saveTasksToStorage(newTasks);
      return newTasks;
    });
  }, []);

  // 刷新任务列表（从 localStorage 重新加载）
  const refreshTasks = useCallback(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasksState(loadedTasks);
  }, []);

  // 根据 ID 获取任务
  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const value: TaskContextValue = {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
    getTaskById
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
