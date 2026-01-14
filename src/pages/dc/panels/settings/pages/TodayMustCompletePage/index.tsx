/**
 * 今日毕任务子页面
 * 在设置面板中作为子页面使用
 * 底部固定按钮
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SafeArea } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import type { Task } from '@/pages/dc/types';
import { SidelineTaskCard } from '@/pages/dc/components/card';
import { getTodayMustCompleteTaskIds } from '@/pages/dc/utils/todayMustCompleteStorage';
import { getTodayCheckInStatusForTask } from '@/pages/dc/panels/detail/hooks';
import styles from './styles.module.css';

const MAX_SELECTIONS = 3;

export interface TodayMustCompletePageProps {
  /** 返回上一页 */
  onBack: () => void;
  /** 所有未完成的支线任务 */
  tasks: Task[];
  /** 只读模式 */
  readOnly?: boolean;
  /** 确认选择 */
  onConfirm: (taskIds: string[]) => void;
  /** 跳过 */
  onSkip: () => void;
  /** 是否显示跳过按钮（弹窗模式显示，设置页面不显示） */
  showSkipButton?: boolean;
}

const TodayMustCompletePage: React.FC<TodayMustCompletePageProps> = ({
  onBack,
  tasks,
  readOnly = false,
  onConfirm,
  onSkip,
  showSkipButton = false, // 默认不显示跳过按钮（设置页面模式）
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 只读模式下，加载已设置的任务
  useEffect(() => {
    if (readOnly) {
      const savedTaskIds = getTodayMustCompleteTaskIds();
      setSelectedTaskIds(savedTaskIds);
    } else {
      setSelectedTaskIds([]);
    }
  }, [readOnly]);

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
        return prev.filter(id => id !== taskId);
      } else if (prev.length < MAX_SELECTIONS) {
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

  // 处理确认/保存
  const handleConfirm = () => {
    onConfirm(selectedTaskIds);
    onBack();
  };

  // 处理跳过
  const handleSkip = () => {
    onSkip();
    onBack();
  };

  return (
    <SubPageLayout
      title="今日毕任务"
      description={readOnly 
        ? '今日已设置的重点任务' 
        : `选择今天要重点完成的任务（最多${MAX_SELECTIONS}个）`
      }
      onBack={onBack}
    >
      <div className={styles.container}>
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

      {/* 底部固定按钮区域 - 编辑模式显示 */}
      {!readOnly && (
        <div className={styles.bottomFixed}>
          <div className={styles.footer}>
            {showSkipButton ? (
              // 弹窗模式：显示跳过和确定按钮
              <>
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
              </>
            ) : (
              // 设置页面模式：只显示保存按钮
              <button
                className={styles.saveButton}
                onClick={handleConfirm}
                disabled={selectedTaskIds.length === 0}
              >
                保存
              </button>
            )}
          </div>
          <SafeArea position="bottom" />
        </div>
      )}
    </SubPageLayout>
  );
};

export default TodayMustCompletePage;
