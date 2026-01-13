/**
 * 常规模式面板
 */

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { MainlineTaskCard } from '../../components/card';
import CreateMainlineTaskModal from '../../components/CreateMainlineTaskModal';
import TodayProgress from '../../components/TodayProgress';
import GroupDetailPopup from '../../components/GroupDetailPopup';
import SidelineTaskSection from '../../components/SidelineTaskSection';
import { AllSidelineTasksPopup } from '../../components/AllSidelineTasksList';
import GoalDetailModal from '../detail';
import { useTaskContext } from '../../contexts';
import { useTaskSort } from '../../hooks';
import { EMPTY_STATE_IMAGE, getNextThemeColor } from '../../constants';
import { fadeVariants, cardVariants } from '../../constants/animations';
import type { Task, MainlineTask, TaskTag, ViewMode } from '../../types';
import styles from './styles.module.css';

export interface NormalPanelRef {
  triggerAdd: () => void;
  // 保留接口但不再在 NormalPanel 内部处理，由 DCPageContent 顶层处理
  openTodayMustComplete: (readOnly?: boolean) => void;
}

interface NormalPanelProps {}

const NormalPanel = forwardRef<NormalPanelRef, NormalPanelProps>((props, ref) => {
  const { tasks, addTask, refreshTasks } = useTaskContext();
  
  // 常规模式内部状态
  const [mainlineModalVisible, setMainlineModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAllSidelineTasks, setShowAllSidelineTasks] = useState(false);
  
  // Group 模式状态
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [selectedGroupTag, setSelectedGroupTag] = useState<TaskTag | null>(null);
  const [selectedGroupTasks, setSelectedGroupTasks] = useState<Task[]>([]);
  const [showGroupDetail, setShowGroupDetail] = useState(false);

  const { 
    hasMainlineTask, 
    mainlineTasks, 
    sidelineTasks,
    isTodayCompleted,
    isCycleCompleted
  } = useTaskSort(tasks);

  // 检查是否有带标签的任务（用于显示切换图标）
  const hasTaggedTasks = sidelineTasks.some(task => task.tagId);

  // 处理 Group 卡片点击
  const handleGroupClick = (tag: TaskTag, tasks: Task[]) => {
    setSelectedGroupTag(tag);
    setSelectedGroupTasks(tasks);
    setShowGroupDetail(true);
  };

  // 切换视图模式
  const toggleViewMode = () => {
    if (viewMode === 'default') {
      setViewMode('group');
    } else {
      setViewMode('default');
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAdd: () => {
      setMainlineModalVisible(true);
    },
    // 保留接口但不做任何事情，由 DCPageContent 顶层处理
    openTodayMustComplete: (readOnly?: boolean) => {
      // 不再在 NormalPanel 内部处理，由 DCPageContent 顶层处理
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
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className={styles.taskSection}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>主线任务</h2>
        </div>
        
        <AnimatePresence mode="wait">
          {hasMainlineTask ? (
            mainlineTasks.map((task, index) => (
              <motion.div
                key={task.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileTap="tap"
              >
                <MainlineTaskCard 
                  task={task}
                  onClick={() => setSelectedTaskId(task.id)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.98 }}
              className={styles.emptyCard}
              onClick={handleAddClick}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 支线任务区块 */}
      <SidelineTaskSection
        tasks={sidelineTasks}
        hasTaggedTasks={hasTaggedTasks}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        onGroupClick={handleGroupClick}
        onTaskClick={(taskId) => setSelectedTaskId(taskId)}
        onRandomOpen={() => {
          if (sidelineTasks.length > 0) {
            const randomIndex = Math.floor(Math.random() * sidelineTasks.length);
            setSelectedTaskId(sidelineTasks[randomIndex].id);
          }
        }}
        onShowAll={() => setShowAllSidelineTasks(true)}
      />

      {/* 所有支线任务抽屉 */}
      <AllSidelineTasksPopup
        visible={showAllSidelineTasks}
        onClose={() => setShowAllSidelineTasks(false)}
        tasks={sidelineTasks}
        onTaskClick={(taskId) => setSelectedTaskId(taskId)}
        isTodayCompleted={isTodayCompleted}
        isCycleCompleted={isCycleCompleted}
      />

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
      <AnimatePresence>
        {(hasMainlineTask || sidelineTasks.length > 0) && (
          <TodayProgress onTaskSelect={(taskId) => setSelectedTaskId(taskId)} />
        )}
      </AnimatePresence>

      {/* Group 详情弹窗 */}
      <GroupDetailPopup
        visible={showGroupDetail}
        tag={selectedGroupTag}
        tasks={selectedGroupTasks}
        onClose={() => setShowGroupDetail(false)}
        onTaskClick={(taskId) => {
          setSelectedTaskId(taskId);
        }}
      />
    </>
  );
});

NormalPanel.displayName = 'NormalPanel';

export default NormalPanel;

