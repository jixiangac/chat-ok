/**
 * TaskProvider 类型定义
 * 管理单条任务的操作和计算
 */

import type { Task, CheckInEntry, ProgressInfo, CycleConfig } from '../../types';
import type { SceneType } from '../SceneProvider/types';

// 历史记录类型
export interface HistoryRecord {
  id: string;
  timestamp: number;
  date: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'CHECK_IN' | 'CYCLE_ADVANCE' | 'COMPLETE' | 'ARCHIVE';
  value?: any;
  note?: string;
}

// 周期信息
export interface CycleInfo {
  currentCycle: number;
  totalCycles: number;
  daysInCurrentCycle: number;
  daysRemainingInCycle: number;
  cycleStartDate: string;
  cycleEndDate: string;
  isLastCycle: boolean;
}

// 验证结果
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: string[];
}

// Context 值类型
export interface TaskContextValue {
  // ========== 基础 CRUD ==========
  
  // 当前选中的任务 ID
  selectedTaskId: string | null;
  setSelectedTaskId: (taskId: string | null) => void;
  
  // 创建任务
  createTask: (scene: SceneType, taskData: Partial<Task>) => Task;
  
  // 更新任务
  updateTask: (taskId: string, updates: Partial<Task>, scene?: SceneType) => void;
  
  // 删除任务
  deleteTask: (taskId: string, scene?: SceneType) => void;
  
  // 获取任务
  getTask: (taskId: string, scene?: SceneType) => Task | undefined;
  
  // ========== 兼容旧版 ==========
  
  // 任务列表（兼容旧版）
  tasks: Task[];
  
  // 设置任务列表（兼容旧版）
  setTasks: (tasks: Task[]) => void;
  
  // 添加任务（兼容旧版）
  addTask: (task: Task) => void;
  
  // 刷新任务（兼容旧版）
  refreshTasks: () => void;
  
  // 根据 ID 获取任务（兼容旧版）
  getTaskById: (taskId: string) => Task | undefined;
  
  // ========== 进度管理 ==========
  
  // 更新进度
  updateProgress: (taskId: string, progress: number, scene?: SceneType) => void;
  
  // 记录打卡
  recordCheckIn: (taskId: string, entry: CheckInEntry, scene?: SceneType) => void;
  
  // 完成任务
  completeTask: (taskId: string, scene?: SceneType) => void;
  
  // ========== 周期管理 ==========
  
  // 计算周期信息
  calculateCycle: (taskId: string, scene?: SceneType) => CycleInfo | null;
  
  // 推进周期
  advanceCycle: (taskId: string, scene?: SceneType) => void;
  
  // ========== 历史记录 ==========
  
  // 添加历史记录
  addHistory: (taskId: string, record: Omit<HistoryRecord, 'id' | 'timestamp'>, scene?: SceneType) => void;
  
  // 获取历史记录
  getHistory: (taskId: string, scene?: SceneType) => HistoryRecord[];
  
  // ========== 批量操作 ==========
  
  // 批量更新
  batchUpdate: (scene: SceneType, updates: Array<{ id: string; data: Partial<Task> }>) => void;
  
  // 批量删除
  batchDelete: (taskIds: string[], scene?: SceneType) => void;
}

