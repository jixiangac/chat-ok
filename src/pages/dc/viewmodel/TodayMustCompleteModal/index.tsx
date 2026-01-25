/**
 * 今日必须完成任务设置弹窗
 * 支持编辑模式和只读模式
 * 直接消费 Provider 数据
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import dayjs from 'dayjs';
import type { Task } from '../../types';
import { SidelineTaskCard } from '../../components/card';
import { useScene, useUser, useUIState, useApp } from '../../contexts';
import { getCurrentDate } from '../../utils';
import styles from './styles.module.css';

/**
 * 判断任务是否超期
 * 如果任务的结束日期已过，则视为超期
 * @param task 任务对象
 * @param currentDate 当前日期（支持测试日期）
 */
const isTaskExpired = (task: Task, currentDate: string): boolean => {
  if (!task.time?.endDate) return false;
  return dayjs(currentDate).isAfter(dayjs(task.time.endDate), 'day');
};

// IP 图片地址
const HEADER_IMAGE_URL = 'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png';

const MAX_SELECTIONS = 3;

const TodayMustCompleteModal: React.FC = () => {
  // 从 Provider 获取数据
  const { normal } = useScene();
  const {
    todayMustComplete,
    checkAndShowTodayMustComplete,
    setTodayMustCompleteTasks,
    skipTodayMustComplete,
    markTodayMustCompleteShown
  } = useUser();
  const {
    showTodayMustCompleteModal: visible,
    closeTodayMustCompleteModal: onClose,
    openTodayMustCompleteModal
  } = useUIState();
  // 订阅 systemDate 以响应测试日期变化（变量用于触发重新渲染）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { systemDate } = useApp();

  const readOnly = todayMustComplete.readOnly;

  // 获取当前日期（支持测试日期）
  const currentDate = getCurrentDate();

  // 获取所有任务（主线 + 支线），并过滤掉不符合条件的任务
  // 条件：总完成率 < 100%，非归档，非超期
  const tasks = useMemo(() => {
    const allTasks = [...normal.mainlineTasks, ...normal.sidelineTasks];
    return allTasks.filter(task => {
      // 排除归档的任务
      if (task.status === 'ARCHIVED' || task.status === 'ARCHIVED_HISTORY') {
        return false;
      }
      // 排除超期的任务（使用当前日期）
      if (isTaskExpired(task, currentDate)) {
        return false;
      }
      // 排除总完成率已达100%的任务
      if ((task.progress?.totalPercentage ?? 0) >= 100) {
        return false;
      }
      return true;
    });
  }, [normal.mainlineTasks, normal.sidelineTasks, currentDate]);
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 组件挂载时检查是否需要显示今日必须完成弹窗
  useEffect(() => {
    if (checkAndShowTodayMustComplete()) {
      openTodayMustCompleteModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次

  // 只读模式下，加载已设置的任务
  useEffect(() => {
    if (visible && readOnly) {
      setSelectedTaskIds(todayMustComplete.taskIds);
    } else if (visible && !readOnly) {
      setSelectedTaskIds([]);
    }
  }, [visible, readOnly, todayMustComplete.taskIds]);

  // 直接使用过滤后的任务列表（不再额外过滤今日已完成的任务）
  const availableTasks = tasks;

  // 处理任务选择（仅编辑模式）
  const handleTaskSelect = (taskId: string) => {
    if (readOnly) return;
    
    setSelectedTaskIds(prev => {
      if (prev.includes(taskId)) {
        // 取消选择
        return prev.filter(id => id !== taskId);
      } else if (prev.length < MAX_SELECTIONS) {
        // 添加选择
        return [...prev, taskId];
      }
      return prev;
    });
  };

  // 获取已选择的任务对象
  const selectedTasks = useMemo(() => {
    return selectedTaskIds
      .map(id => tasks.find(t => t.id === id))
      .filter(Boolean) as Task[];
  }, [selectedTaskIds, tasks]);

  // 处理确认
  const handleConfirm = () => {
    setTodayMustCompleteTasks(selectedTaskIds);
    onClose();
  };

  // 处理跳过
  const handleSkip = () => {
    skipTodayMustComplete();
    onClose();
  };

  // 处理关闭
  const handleClose = () => {
    markTodayMustCompleteShown();
    onClose();
  };

  if (!visible) return null;

  // 使用 Portal 渲染到 body 下，避免被父容器的 overflow 影响
  return createPortal(
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 顶部图片区域 */}
        <div className={styles.headerImage}>
          {/* 只读模式显示关闭按钮 */}
          {readOnly && (
            <button className={styles.closeButton} onClick={handleClose}>
              <X size={20} />
            </button>
          )}
          <img 
            src={HEADER_IMAGE_URL} 
            alt="今日必须完成" 
            className={styles.headerImg}
          />
        </div>

        {/* 标题区域 */}
        <div className={styles.titleSection}>
          <h2 className={styles.title}>今日必须完成</h2>
          <p className={styles.subtitle}>
            {readOnly 
              ? '今日已设置的重点任务' 
              : `选择今天要重点完成的任务（最多${MAX_SELECTIONS}个）`
            }
          </p>
        </div>

        {/* 任务选择/展示区域 */}
        <div className={styles.taskSelectionSection}>
          {readOnly ? (
            // 只读模式：展示已选择的任务
            <>
              <div className={styles.sectionLabel}>已设置的任务</div>
              <div className={styles.taskGrid}>
                {selectedTasks.length > 0 ? (
                  selectedTasks.map(task => (
                    <SidelineTaskCard
                      key={task.id}
                      task={task}
                      variant="grid"
                      isMustComplete={true}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>暂无设置的任务</div>
                )}
              </div>
            </>
          ) : (
            // 编辑模式：选择任务
            <>
              <div className={styles.sectionLabel}>
                选择任务
                <span className={styles.selectedCount}>{selectedTaskIds.length}/{MAX_SELECTIONS}</span>
              </div>
              <div className={styles.taskGrid}>
                {availableTasks.map(task => (
                  <div
                    key={task.id}
                    className={`${styles.taskCardWrapper} ${
                      selectedTaskIds.includes(task.id) ? styles.selected : ''
                    } ${
                      selectedTaskIds.length >= MAX_SELECTIONS && !selectedTaskIds.includes(task.id)
                        ? styles.disabled
                        : ''
                    }`}
                    onClick={() => handleTaskSelect(task.id)}
                  >
                    <SidelineTaskCard
                      task={task}
                      variant="grid"
                    />
                    {selectedTaskIds.includes(task.id) && (
                      <div className={styles.selectedBadge}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 底部按钮 - 仅编辑模式显示 */}
        {!readOnly && (
          <div className={styles.footer}>
            <button className={styles.skipButton} onClick={handleSkip}>
              跳过
            </button>
            <button
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={selectedTaskIds.length === 0}
            >
              确定
            </button>
          </div>
        )}
        <SafeArea position="bottom" />
      </div>
    </div>,
    document.body
  );
};

export default TodayMustCompleteModal;


