/**
 * 今日毕任务子页面
 * 在设置面板中作为子页面使用
 * 直接消费 Provider 数据
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SafeArea } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import type { Task } from '@/pages/dc/types';
import { SidelineTaskCard } from '@/pages/dc/components/card';
import { getTodayCheckInStatusForTask } from '@/pages/dc/panels/detail/hooks';
import { useScene, useUser } from '@/pages/dc/contexts';
import styles from './styles.module.css';

const MAX_SELECTIONS = 3;

export interface TodayMustCompletePageProps {
  /** 返回上一页 */
  onBack: () => void;
}

const TodayMustCompletePage: React.FC<TodayMustCompletePageProps> = ({
  onBack,
}) => {
  // 从 Provider 获取数据
  const { sidelineTasks } = useScene();
  const { 
    todayMustComplete, 
    setTodayMustCompleteTasks, 
    skipTodayMustComplete 
  } = useUser();
  
  const readOnly = todayMustComplete.readOnly;
  const tasks = sidelineTasks;
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 只读模式下，加载已设置的任务
  useEffect(() => {
    if (readOnly) {
      setSelectedTaskIds(todayMustComplete.taskIds);
    } else {
      setSelectedTaskIds([]);
    }
  }, [readOnly, todayMustComplete.taskIds]);

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
    setTodayMustCompleteTasks(selectedTaskIds);
    onBack();
  };

  // 处理跳过
  const handleSkip = () => {
    skipTodayMustComplete();
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
            <button
              className={styles.saveButton}
              onClick={handleConfirm}
              disabled={selectedTaskIds.length === 0}
            >
              保存
            </button>
          </div>
          <SafeArea position="bottom" />
        </div>
      )}
    </SubPageLayout>
  );
};

export default TodayMustCompletePage;
