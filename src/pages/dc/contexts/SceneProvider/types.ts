/**
 * SceneProvider 类型定义
 * 管理场景数据、索引、缓存
 */

import type { Task, TaskType } from '../../types';

// 场景类型
export type SceneType = 'normal' | 'vacation' | 'memorial' | 'okr';

// Tab 配置
export interface TabConfig {
  key: SceneType;
  label: string;
  icon?: string;
}

// 小精灵配置
export interface SpriteConfig {
  currentImage: string;
  images: string[];
  lastRandomized: number;
}

// 索引结构
export interface SceneIndex {
  // 按 ID 索引（快速查找）
  byId: Map<string, Task>;
  
  // 按类型索引
  byType: {
    mainline: Set<string>;
    sidelineA: Set<string>;
    sidelineB: Set<string>;
  };
  
  // 按状态索引
  byStatus: {
    active: Set<string>;
    completed: Set<string>;
    archived: Set<string>;
    paused: Set<string>;
  };
  
  // 按标签索引
  byTag: Map<string, Set<string>>;
  
  // 按日期索引
  byDate: {
    today: Set<string>;
    thisWeek: Set<string>;
    thisMonth: Set<string>;
  };
}

// 缓存条目
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

// 场景数据
export interface SceneData {
  // 原始数据
  tasks: Task[];
  
  // 索引
  index: SceneIndex;
  
  // 元数据
  meta: {
    lastUpdate: number;
    version: number;
  };
}

// 常规场景快捷访问
export interface NormalSceneAccess {
  mainlineTasks: Task[];
  sidelineTasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  archivedTasks: Task[];
  todayTasks: Task[];
  getById: (id: string) => Task | undefined;
}

// 度假场景数据
export interface VacationSceneData {
  activities: any[];
  memories: any[];
}

// 纪念日场景数据
export interface MemorialSceneData {
  events: any[];
  countdowns: any[];
}

// OKR 场景数据
export interface OKRSceneData {
  objectives: any[];
  keyResults: any[];
}

// Context 值类型
export interface SceneContextValue {
  // ========== Tab 配置 ==========
  
  tabs: TabConfig[];
  
  // ========== 小精灵 ==========
  
  spriteImage: string;
  randomizeSpriteImage: () => void;
  
  // ========== 快捷访问 ==========
  
  sidelineTasks: Task[];
  
  // ========== 快速查询 ==========
  
  // 按 ID 获取（O(1)）
  getTaskById: (taskId: string, scene?: SceneType) => Task | undefined;
  
  // 按类型获取（O(1)）
  getTasksByType: (type: TaskType, scene: SceneType) => Task[];
  
  // 按状态获取（O(1)）
  getTasksByStatus: (status: string, scene: SceneType) => Task[];
  
  // 按标签获取（O(1)）
  getTasksByTag: (tagId: string, scene: SceneType) => Task[];
  
  // 批量获取
  getTasksByIds: (ids: string[], scene?: SceneType) => Task[];
  
  // 获取所有任务
  getAllTasks: (scene: SceneType) => Task[];
  
  // ========== 场景快捷访问 ==========
  
  normal: NormalSceneAccess;
  vacation: VacationSceneData;
  memorial: MemorialSceneData;
  okr: OKRSceneData;
  
  // ========== 数据操作 ==========
  
  // 添加任务
  addTask: (scene: SceneType, task: Task) => void;
  
  // 更新任务
  updateTask: (scene: SceneType, taskId: string, updates: Partial<Task>) => void;
  
  // 删除任务
  deleteTask: (scene: SceneType, taskId: string) => void;
  
  // 批量更新
  batchUpdate: (scene: SceneType, updates: Array<{ id: string; data: Partial<Task> }>) => void;
  
  // 设置任务列表
  setTasks: (scene: SceneType, tasks: Task[]) => void;
  
  // ========== 缓存管理 ==========
  
  // 获取缓存值
  getCached: <T>(scene: SceneType, key: string) => T | undefined;
  
  // 设置缓存
  setCache: <T>(scene: SceneType, key: string, value: T, ttl?: number) => void;
  
  // 清除缓存
  clearCache: (scene: SceneType, key?: string) => void;
  
  // ========== 数据刷新 ==========
  
  // 刷新场景
  refreshScene: (scene: SceneType) => void;
  
  // 重建索引
  rebuildIndex: (scene: SceneType) => void;
}

// 初始化空索引
export const createEmptyIndex = (): SceneIndex => ({
  byId: new Map(),
  byType: {
    mainline: new Set(),
    sidelineA: new Set(),
    sidelineB: new Set(),
  },
  byStatus: {
    active: new Set(),
    completed: new Set(),
    archived: new Set(),
    paused: new Set(),
  },
  byTag: new Map(),
  byDate: {
    today: new Set(),
    thisWeek: new Set(),
    thisMonth: new Set(),
  },
});

// 初始化场景数据
export const createEmptySceneData = (): SceneData => ({
  tasks: [],
  index: createEmptyIndex(),
  meta: {
    lastUpdate: Date.now(),
    version: 1,
  },
});

