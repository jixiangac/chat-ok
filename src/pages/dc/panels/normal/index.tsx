/**
 * 常规模式面板
 */

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popup, SafeArea } from 'antd-mobile';
import dayjs from 'dayjs';
import { MainlineTaskCard, SidelineTaskCard } from '../../components/card';
import SidelineTaskGrid from '../../components/SidelineTaskGrid';
import CreateMainlineTaskModal from '../../components/CreateMainlineTaskModal';
import TodayProgress from '../../components/TodayProgress';
import TodayMustCompleteModal from '../../components/TodayMustCompleteModal';
import GroupModeGrid from '../../components/GroupModeGrid';
import GroupDetailPopup from '../../components/GroupDetailPopup';
import GoalDetailModal from '../detail';
import { useTaskContext } from '../../contexts';
import { useTaskSort, useTodayMustComplete } from '../../hooks';
import { EMPTY_STATE_IMAGE, getNextThemeColor } from '../../constants';
import { fadeVariants, cardVariants, overlayVariants, drawerRightVariants } from '../../constants/animations';
import { X, LayoutGrid, List } from 'lucide-react';
import type { Task, MainlineTask, TaskTag, ViewMode } from '../../types';
import { getAllTags } from '../../utils/tagStorage';
import styles from './styles.module.css';

export interface NormalPanelRef {
  triggerAdd: () => void;
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

  // 今日必须完成弹窗只读模式
  const [todayMustCompleteReadOnly, setTodayMustCompleteReadOnly] = useState(false);

  const { 
    hasMainlineTask, 
    mainlineTasks, 
    sidelineTasks,
    isTodayCompleted,
    isCycleCompleted
  } = useTaskSort(tasks);

  // 今日必须完成功能
  const {
    showModal: showTodayMustCompleteModal,
    todayMustCompleteTaskIds,
    openModal: openTodayMustCompleteModal,
    closeModal: closeTodayMustCompleteModal,
    confirmSelection,
    skipSelection,
    checkAndShowModal,
  } = useTodayMustComplete({ sidelineTasks });

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

  // 组件挂载时检查是否需要显示今日必须完成弹窗
  useEffect(() => {
    checkAndShowModal();
  }, [checkAndShowModal]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAdd: () => {
      setMainlineModalVisible(true);
    },
    openTodayMustComplete: (readOnly?: boolean) => {
      setTodayMustCompleteReadOnly(readOnly || false);
      openTodayMustCompleteModal();
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
      <AnimatePresence>
        {sidelineTasks.length > 0 && (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>支线任务</h2>
                {hasTaggedTasks && (
                  <button
                    className={styles.viewModeButton}
                    onClick={toggleViewMode}
                    title={viewMode === 'default' ? '切换到分组视图' : '切换到默认视图'}
                  >
                    {viewMode === 'default' ? <LayoutGrid size={16} /> : <List size={16} />}
                  </button>
                )}
              </div>
            </div>
            
            {viewMode === 'group' ? (
              <GroupModeGrid
                tasks={sidelineTasks}
                onGroupClick={handleGroupClick}
                onRandomOpen={() => {
                  if (sidelineTasks.length > 0) {
                    const randomIndex = Math.floor(Math.random() * sidelineTasks.length);
                    setSelectedTaskId(sidelineTasks[randomIndex].id);
                  }
                }}
                onShowAll={() => setShowAllSidelineTasks(true)}
              />
            ) : (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 所有支线任务抽屉 */}
      <Popup
        visible={showAllSidelineTasks}
        onMaskClick={() => setShowAllSidelineTasks(false)}
        position="bottom"
        bodyStyle={{ 
          borderTopLeftRadius: '16px', 
          borderTopRightRadius: '16px',
          maxHeight: '80vh'
        }}
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>所有支线任务 ({sidelineTasks.length})</h2>
          <button
            onClick={() => setShowAllSidelineTasks(false)}
            className={styles.iconButton}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          <div className={styles.taskList}>
            {sidelineTasks.map((task) => (
              <div key={task.id}>
                <SidelineTaskCard 
                  task={task}
                  onClick={() => setSelectedTaskId(task.id)}
                  isTodayCompleted={isTodayCompleted(task)}
                  isCycleCompleted={isCycleCompleted(task)}
                />
              </div>
            ))}
          </div>
        </div>
        <SafeArea position="bottom" />
      </Popup>

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

      {/* 今日必须完成弹窗 */}
      <TodayMustCompleteModal
        visible={showTodayMustCompleteModal}
        tasks={sidelineTasks}
        readOnly={todayMustCompleteReadOnly}
        onConfirm={confirmSelection}
        onSkip={skipSelection}
        onClose={closeTodayMustCompleteModal}
      />

      {/* Group 详情弹窗 */}
      <GroupDetailPopup
        visible={showGroupDetail}
        tag={selectedGroupTag}
        tasks={selectedGroupTasks}
        onClose={() => setShowGroupDetail(false)}
        onTaskClick={(taskId) => {
          setShowGroupDetail(false);
          setSelectedTaskId(taskId);
        }}
      />
    </>
  );
});

NormalPanel.displayName = 'NormalPanel';

export default NormalPanel;








