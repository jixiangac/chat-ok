/**
 * 今日必须完成任务设置弹窗
 * 支持编辑模式和只读模式
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import type { Task } from '../../types';
import { SidelineTaskCard } from '../card';
import { getTodayMustCompleteTaskIds } from '../../utils/todayMustCompleteStorage';
import { getTodayCheckInStatusForTask } from '../../panels/detail/hooks';
import styles from './styles.module.css';

// IP 图片地址
const HEADER_IMAGE_URL = 'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png';

interface TodayMustCompleteModalProps {
  visible: boolean;
  tasks: Task[]; // 所有未完成的支线任务
  readOnly?: boolean; // 只读模式
  onConfirm: (taskIds: string[]) => void;
  onSkip: () => void;
  onClose: () => void;
}

const MAX_SELECTIONS = 3;

const TodayMustCompleteModal: React.FC<TodayMustCompleteModalProps> = ({
  visible,
  tasks,
  readOnly = false,
  onConfirm,
  onSkip,
  onClose,
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 只读模式下，加载已设置的任务
  useEffect(() => {
    if (visible && readOnly) {
      const savedTaskIds = getTodayMustCompleteTaskIds();
      setSelectedTaskIds(savedTaskIds);
    } else if (visible && !readOnly) {
      setSelectedTaskIds([]);
    }
  }, [visible, readOnly]);

  // 过滤掉今日已完成打卡的任务（仅编辑模式）
  const availableTasks = useMemo(() => {
    if (readOnly) return tasks;
    return tasks.filter(task => {
      const status = getTodayCheckInStatusForTask(task);
      return !status.isCompleted;
    });
  }, [tasks, readOnly]);

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
    onConfirm(selectedTaskIds);
  };

  if (!visible) return null;

  // 使用 Portal 渲染到 body 下，避免被父容器的 overflow 影响
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 顶部图片区域 */}
        <div className={styles.headerImage}>
          {/* 只读模式显示关闭按钮 */}
          {readOnly && (
            <button className={styles.closeButton} onClick={onClose}>
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
            <button className={styles.skipButton} onClick={onSkip}>
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


