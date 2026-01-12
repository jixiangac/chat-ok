/**
 * 今日必须完成任务 Hook
 * 管理今日必须完成任务的状态和逻辑
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task } from '../types';
import {
  shouldShowTodayMustCompleteModal,
  setTodayMustCompleteTasks,
  skipTodayMustComplete,
  getTodayMustCompleteTaskIds,
  isTaskTodayMustComplete,
  removeFromTodayMustComplete,
  canOpenModalForEdit,
  markModalShown,
} from '../utils/todayMustCompleteStorage';

interface UseTodayMustCompleteOptions {
  sidelineTasks: Task[];
  onTaskComplete?: (taskId: string) => void;
}

interface UseTodayMustCompleteReturn {
  // 状态
  showModal: boolean;
  todayMustCompleteTaskIds: string[];
  canManuallyOpen: boolean;
  
  // 方法
  openModal: () => void;
  closeModal: () => void;
  confirmSelection: (taskIds: string[]) => void;
  skipSelection: () => void;
  checkAndShowModal: () => void;
  isTaskMustComplete: (taskId: string) => boolean;
  handleTaskComplete: (taskId: string) => void;
}

export function useTodayMustComplete({
  sidelineTasks,
  onTaskComplete,
}: UseTodayMustCompleteOptions): UseTodayMustCompleteReturn {
  const [showModal, setShowModal] = useState(false);
  const [todayMustCompleteTaskIds, setTodayMustCompleteTaskIds] = useState<string[]>([]);
  const [canManuallyOpen, setCanManuallyOpen] = useState(false);

  // 初始化时加载今日必须完成的任务
  useEffect(() => {
    const taskIds = getTodayMustCompleteTaskIds();
    setTodayMustCompleteTaskIds(taskIds);
    setCanManuallyOpen(canOpenModalForEdit());
  }, []);

  // 检查并显示弹窗
  const checkAndShowModal = useCallback(() => {
    // 只有当有支线任务时才检查
    if (sidelineTasks.length === 0) {
      return;
    }

    if (shouldShowTodayMustCompleteModal()) {
      setShowModal(true);
      markModalShown();
    }
  }, [sidelineTasks.length]);

  // 打开弹窗（手动）
  const openModal = useCallback(() => {
    // 允许打开弹窗（编辑或查看模式由调用方决定）
    setShowModal(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // 确认选择
  const confirmSelection = useCallback((taskIds: string[]) => {
    setTodayMustCompleteTasks(taskIds);
    setTodayMustCompleteTaskIds(taskIds);
    setShowModal(false);
    setCanManuallyOpen(false);
  }, []);

  // 跳过选择
  const skipSelection = useCallback(() => {
    skipTodayMustComplete();
    setShowModal(false);
    setCanManuallyOpen(false);
  }, []);

  // 检查任务是否是今日必须完成
  const isTaskMustComplete = useCallback((taskId: string) => {
    return todayMustCompleteTaskIds.includes(taskId);
  }, [todayMustCompleteTaskIds]);

  // 处理任务完成（从今日必须完成列表中移除）
  const handleTaskComplete = useCallback((taskId: string) => {
    if (isTaskTodayMustComplete(taskId)) {
      removeFromTodayMustComplete(taskId);
      setTodayMustCompleteTaskIds(prev => prev.filter(id => id !== taskId));
    }
    onTaskComplete?.(taskId);
  }, [onTaskComplete]);

  return {
    showModal,
    todayMustCompleteTaskIds,
    canManuallyOpen,
    openModal,
    closeModal,
    confirmSelection,
    skipSelection,
    checkAndShowModal,
    isTaskMustComplete,
    handleTaskComplete,
  };
}

export default useTodayMustComplete;


