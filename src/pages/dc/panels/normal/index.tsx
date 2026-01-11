/**
 * 常规模式面板
 */

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import dayjs from 'dayjs';
import { MainlineTaskCard, SidelineTaskCard } from '../../components/card';
import SidelineTaskGrid from '../../components/SidelineTaskGrid';
import CreateMainlineTaskModal from '../../components/CreateMainlineTaskModal';
import TodayProgress from '../../components/TodayProgress';
import GoalDetailModal from '../detail';
import { useTaskContext } from '../../contexts';
import { useTaskSort } from '../../hooks';
import { EMPTY_STATE_IMAGE, getNextThemeColor } from '../../constants';
import { X } from 'lucide-react';
import type { Task, MainlineTask } from '../../types';
import styles from './styles.module.css';

export interface NormalPanelRef {
  triggerAdd: () => void;
}

interface NormalPanelProps {}

const NormalPanel = forwardRef<NormalPanelRef, NormalPanelProps>((props, ref) => {
  const { tasks, addTask, refreshTasks } = useTaskContext();
  
  // 常规模式内部状态
  const [mainlineModalVisible, setMainlineModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAllSidelineTasks, setShowAllSidelineTasks] = useState(false);

  const { 
    hasMainlineTask, 
    mainlineTasks, 
    sidelineTasks,
    isTodayCompleted,
    isCycleCompleted
  } = useTaskSort(tasks);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAdd: () => {
      setMainlineModalVisible(true);
    }
  }));

  // 处理任务创建（统一处理主线和支线任务）
  const handleCreateTask = (taskData: any) => {
    const today = dayjs().format('YYYY-MM-DD');
    const startDate = taskData.startDate || today;
    const isMainline = taskData.taskCategory === 'MAINLINE';
    
    // 获取下一个可用的主题色
    const usedColors = sidelineTasks.map(t => t.themeColor);
    const nextThemeColor = getNextThemeColor(usedColors);
    
    // 创建任务对象
    const task: MainlineTask = {
      id: Date.now().toString(),
      mainlineType: taskData.mainlineType,
      title: taskData.title,
      status: 'ACTIVE',
      createdAt: today,
      startDate: startDate,
      cycleConfig: {
        totalDurationDays: taskData.totalDays,
        cycleLengthDays: taskData.cycleDays,
        totalCycles: taskData.totalCycles,
        currentCycle: 1
      },
      progress: {
        totalPercentage: 0,
        currentCyclePercentage: 0
      },
      numericConfig: taskData.numericConfig,
      checklistConfig: taskData.checklistConfig ? {
        ...taskData.checklistConfig,
        completedItems: 0,
        perCycleTarget: Math.ceil(taskData.checklistConfig.totalItems / taskData.totalCycles)
      } : undefined,
      checkInConfig: taskData.checkInConfig ? {
        ...taskData.checkInConfig,
        currentStreak: 0,
        longestStreak: 0,
        checkInRate: 0,
        streaks: [],
        records: []
      } : undefined,
      history: []
    };

    // 创建兼容的 Task 对象
    const newTask: Task = {
      id: task.id,
      title: taskData.title,
      progress: 0,
      currentDay: 0,
      totalDays: taskData.totalDays,
      type: isMainline ? 'mainline' : 'sidelineA',
      mainlineType: taskData.mainlineType,
      mainlineTask: task,
      startDate: startDate,
      cycleDays: taskData.cycleDays,
      totalCycles: taskData.totalCycles,
      cycle: `1/${taskData.totalCycles}`,
      themeColor: isMainline ? undefined : nextThemeColor
    };

    addTask(newTask);
    setMainlineModalVisible(false);
  };

  const handleAddClick = () => {
    setMainlineModalVisible(true);
  };

  return (
    <>
      {/* 主线任务区块 */}
      <div className={styles.taskSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>主线任务</h2>
        </div>
        
        {hasMainlineTask ? (
          mainlineTasks.map(task => (
            <MainlineTaskCard 
              key={task.id} 
              task={task}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))
        ) : (
          <div className={styles.emptyCard} onClick={handleAddClick}>
            <img 
              src={EMPTY_STATE_IMAGE}
              alt="新增主线任务"
              className={styles.emptyCardImage}
            />
            <div className={styles.emptyCardSkeleton}>
              <div className={`${styles.skeletonLine} ${styles.title}`} />
              <div className={`${styles.skeletonLine} ${styles.subtitle}`} />
              <div className={`${styles.skeletonLine} ${styles.progress}`} />
              <div className={`${styles.skeletonLine} ${styles.info}`} />
              <div className={`${styles.skeletonLine} ${styles.small}`} />
            </div>
          </div>
        )}
      </div>

      {/* 支线任务区块 */}
      {sidelineTasks.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>支线任务</h2>
          </div>
          
          <SidelineTaskGrid 
            tasks={sidelineTasks}
            onTaskClick={(taskId) => setSelectedTaskId(taskId)}
            onRandomOpen={() => {
              if (sidelineTasks.length > 0) {
                const randomIndex = Math.floor(Math.random() * sidelineTasks.length);
                setSelectedTaskId(sidelineTasks[randomIndex].id);
              }
            }}
            onShowAll={() => setShowAllSidelineTasks(true)}
          />
        </div>
      )}

      {/* 所有支线任务抽屉 */}
      {showAllSidelineTasks && (
        <div className={styles.overlay} onClick={() => setShowAllSidelineTasks(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHandle}>
              <div className={styles.drawerHandleBar} />
            </div>

            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>所有支线任务 ({sidelineTasks.length})</h2>
              <button onClick={() => setShowAllSidelineTasks(false)} className={styles.iconButton}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.taskList}>
                {sidelineTasks.map(task => (
                  <SidelineTaskCard 
                    key={task.id} 
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                    isTodayCompleted={isTodayCompleted(task)}
                    isCycleCompleted={isCycleCompleted(task)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 创建任务弹窗 */}
      <CreateMainlineTaskModal
        visible={mainlineModalVisible}
        onClose={() => setMainlineModalVisible(false)}
        onSubmit={handleCreateTask}
      />

      {/* 任务详情弹窗 */}
      <GoalDetailModal
        visible={!!selectedTaskId}
        goalId={selectedTaskId || ''}
        onClose={() => setSelectedTaskId(null)}
        onDataChange={refreshTasks}
      />

      {/* 底部今日进度条 */}
      {(hasMainlineTask || sidelineTasks.length > 0) && (
        <TodayProgress onTaskSelect={(taskId) => setSelectedTaskId(taskId)} />
      )}
    </>
  );
});

NormalPanel.displayName = 'NormalPanel';

export default NormalPanel;
