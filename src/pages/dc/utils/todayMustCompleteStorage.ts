/**
 * 今日必须完成任务状态存储工具
 * 管理每日必须完成任务的本地存储
 */

import dayjs from 'dayjs';
import type { TodayMustCompleteState } from '../types';
import { getCurrentDate } from './dateTracker';

const STORAGE_KEY = 'dc_today_must_complete';

// 触发弹窗的时间（8点）
const TRIGGER_HOUR = 8;

/**
 * 获取今日日期字符串（使用全局日期，支持测试日期）
 */
export const getTodayDateString = (): string => {
  return getCurrentDate();
};

/**
 * 从 localStorage 读取今日必须完成状态
 */
export const loadTodayMustCompleteState = (): TodayMustCompleteState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const state: TodayMustCompleteState = JSON.parse(stored);
    
    // 检查是否是今天的数据
    if (state.date !== getTodayDateString()) {
      // 不是今天的数据，返回 null（需要重置）
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to load today must complete state:', error);
    return null;
  }
};

/**
 * 保存今日必须完成状态到 localStorage
 */
export const saveTodayMustCompleteState = (state: TodayMustCompleteState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save today must complete state:', error);
  }
};

/**
 * 创建新的今日状态
 */
export const createTodayState = (): TodayMustCompleteState => {
  return {
    date: getTodayDateString(),
    taskIds: [],
    skipped: false,
    hasShownModal: false,
  };
};

/**
 * 检查是否应该显示今日必须完成弹窗
 * 条件：
 * 1. 当前时间在8点之后
 * 2. 今天还没有显示过弹窗
 * 3. 今天没有跳过
 * 4. 今天还没有设置过任务
 */
export const shouldShowTodayMustCompleteModal = (): boolean => {
  const now = dayjs();
  const currentHour = now.hour();
  
  // 8点之前不显示
  if (currentHour < TRIGGER_HOUR) {
    return false;
  }
  
  const state = loadTodayMustCompleteState();
  
  // 没有今天的状态，需要显示
  if (!state) {
    return true;
  }
  
  // 今天已经显示过弹窗
  if (state.hasShownModal) {
    return false;
  }
  
  // 今天已经跳过
  if (state.skipped) {
    return false;
  }
  
  // 今天已经设置过任务
  if (state.taskIds.length > 0) {
    return false;
  }
  
  return true;
};

/**
 * 标记今日弹窗已显示
 */
export const markModalShown = (): void => {
  let state = loadTodayMustCompleteState();
  
  if (!state) {
    state = createTodayState();
  }
  
  state.hasShownModal = true;
  saveTodayMustCompleteState(state);
};

/**
 * 设置今日必须完成的任务
 */
export const setTodayMustCompleteTasks = (taskIds: string[]): void => {
  let state = loadTodayMustCompleteState();
  
  if (!state) {
    state = createTodayState();
  }
  
  state.taskIds = taskIds.slice(0, 3); // 最多3个
  state.hasShownModal = true;
  saveTodayMustCompleteState(state);
};

/**
 * 跳过今日设置
 */
export const skipTodayMustComplete = (): void => {
  let state = loadTodayMustCompleteState();
  
  if (!state) {
    state = createTodayState();
  }
  
  state.skipped = true;
  state.hasShownModal = true;
  saveTodayMustCompleteState(state);
};

/**
 * 获取今日必须完成的任务ID列表
 */
export const getTodayMustCompleteTaskIds = (): string[] => {
  const state = loadTodayMustCompleteState();
  return state?.taskIds || [];
};

/**
 * 检查任务是否是今日必须完成
 */
export const isTaskTodayMustComplete = (taskId: string): boolean => {
  const taskIds = getTodayMustCompleteTaskIds();
  return taskIds.includes(taskId);
};

/**
 * 从今日必须完成列表中移除任务
 */
export const removeFromTodayMustComplete = (taskId: string): void => {
  const state = loadTodayMustCompleteState();
  
  if (!state) return;
  
  state.taskIds = state.taskIds.filter(id => id !== taskId);
  saveTodayMustCompleteState(state);
};

/**
 * 检查今天是否已经设置过（用于设置面板入口显示）
 */
export const hasTodayBeenSet = (): boolean => {
  const state = loadTodayMustCompleteState();
  
  if (!state) return false;
  
  return state.taskIds.length > 0 || state.skipped;
};

/**
 * 检查今天是否已经设置过任务（不包括跳过）
 */
export const hasTodaySetTasks = (): boolean => {
  const state = loadTodayMustCompleteState();
  
  if (!state) return false;
  
  return state.taskIds.length > 0;
};

/**
 * 检查当前是否可以手动打开设置弹窗（可编辑模式）
 * 条件：今天还没有设置过任务（跳过的情况也可以重新设置）
 * 注意：设置面板入口不受8点限制，8点限制只用于自动弹出
 */
export const canOpenModalForEdit = (): boolean => {
  // 只要没有设置过任务，就可以编辑（包括跳过的情况）
  return !hasTodaySetTasks();
};

/**
 * 检查当前是否可以打开查看弹窗（只读模式）
 * 条件：今天已经设置过任务
 * 注意：设置面板入口不受8点限制
 */
export const canOpenModalForView = (): boolean => {
  return hasTodaySetTasks();
};
