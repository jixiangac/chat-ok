/**
 * 今日毕任务子页面
 * 在设置面板中作为子页面使用
 * 直接消费 Provider 数据
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SafeArea } from 'antd-mobile';
import dayjs from 'dayjs';
import { Calendar, AlertTriangle } from 'lucide-react';
import { SubPageLayout } from '../../components';
import type { Task } from '@/pages/dc/types';
import { SidelineTaskCard } from '@/pages/dc/components/card';
import { useScene, useUser, useApp } from '@/pages/dc/contexts';
import { getCurrentDate } from '@/pages/dc/utils';
import styles from './styles.module.css';

const MAX_SELECTIONS = 3;

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

export interface TodayMustCompletePageProps {
  /** 返回上一页 */
  onBack: () => void;
}

const TodayMustCompletePage: React.FC<TodayMustCompletePageProps> = ({
  onBack,
}) => {
  // 从 Provider 获取数据
  const { normal } = useScene();
  const {
    todayMustComplete,
    setTodayMustCompleteTasks,
    skipTodayMustComplete
  } = useUser();
  // 获取系统日期和测试日期信息
  const { systemDate, testDate } = useApp();

  const readOnly = todayMustComplete.readOnly;

  // 获取当前日期（支持测试日期）
  const currentDate = getCurrentDate();

  // 判断是否使用测试日期
  const isUsingTestDate = !!testDate;

  // 格式化显示日期
  const displayDate = dayjs(currentDate).format('MM月DD日');

  // 获取所有任务（主线 + 支线），并过滤掉不符合条件的任务
  // 条件：总完成率 < 100%，非归档，非超期
  const tasks = useMemo(() => {
    const allTasks = [...normal.mainlineTasks, ...normal.sidelineTasks];
    return allTasks.filter(task => {
      // 排除归档的任务（activeTasks已经排除了，但为了安全再检查一次）
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

  // 只读模式下，加载已设置的任务
  useEffect(() => {
    if (readOnly) {
      setSelectedTaskIds(todayMustComplete.taskIds);
    } else {
      setSelectedTaskIds([]);
    }
  }, [readOnly, todayMustComplete.taskIds]);

  // 直接使用过滤后的任务列表（不再额外过滤今日已完成的任务）
  const availableTasks = tasks;

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
        {/* 日期显示卡片 */}
        <div className={`${styles.dateCard} ${isUsingTestDate ? styles.dateCardTest : ''}`}>
          <div className={styles.dateCardIcon}>
            {isUsingTestDate ? <AlertTriangle size={16} /> : <Calendar size={16} />}
          </div>
          <div className={styles.dateCardContent}>
            <span className={styles.dateCardLabel}>
              {isUsingTestDate ? '测试日期' : '当前日期'}
            </span>
            <span className={styles.dateCardValue}>{displayDate}</span>
          </div>
          {isUsingTestDate && (
            <span className={styles.dateCardBadge}>测试模式</span>
          )}
        </div>

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


