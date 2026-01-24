/**
 * 常规模式面板
 */

import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GroupDetailPopup from '../../components/GroupDetailPopup';
import { TodayProgress, SidelineTaskSection, MainlineTaskSection, CreateTaskModal } from '../../viewmodel';
import GoalDetailModal from '../detail';
import { useTaskContext, useScene, useModal, UI_KEYS } from '../../contexts';
import type { Task, TaskTag, ViewMode } from '../../types';
import type { TaskConfigData } from '../../agent';

export interface NormalPanelRef {
  triggerAdd: () => void;
  // 保留接口但不再在 NormalPanel 内部处理，由 DCPageContent 顶层处理
  openTodayMustComplete: (readOnly?: boolean) => void;
}

interface NormalPanelProps {
  /** AI 预填任务配置（来自 general 角色） */
  aiTaskConfig?: TaskConfigData | null;
  /** 清除 AI 配置的回调 */
  onClearAiConfig?: () => void;
}

const NormalPanel = forwardRef<NormalPanelRef, NormalPanelProps>(({ aiTaskConfig, onClearAiConfig }, ref) => {
  const { refreshTasks, selectedTaskId, setSelectedTaskId } = useTaskContext();
  const { normal } = useScene();
  
  // 使用 UIProvider 管理创建任务弹窗状态
  const { visible: mainlineModalVisible, open: openMainlineModal, close: closeMainlineModal } = useModal(UI_KEYS.MODAL_CREATE_TASK_VISIBLE);
  
  // Group 模式状态
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [selectedGroupTag, setSelectedGroupTag] = useState<TaskTag | null>(null);
  const [selectedGroupTasks, setSelectedGroupTasks] = useState<Task[]>([]);
  const [showGroupDetail, setShowGroupDetail] = useState(false);

  // 从 SceneProvider 获取预计算的数据
  const {
    hasMainlineTask,
    mainlineTasks,
    sidelineTasks,
    isTodayCompleted,
    isCycleCompleted,
  } = normal;

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
      openMainlineModal();
    },
    // 保留接口但不做任何事情，由 DCPageContent 顶层处理
    openTodayMustComplete: (readOnly?: boolean) => {
      // 不再在 NormalPanel 内部处理，由 DCPageContent 顶层处理
    }
  }));

  const handleAddClick = () => {
    openMainlineModal();
  };

  return (
    <>
      {/* 主线任务区块 */}
      <MainlineTaskSection onAddClick={handleAddClick} />

      {/* 支线任务区块 */}
      <SidelineTaskSection
        tasks={sidelineTasks}
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
        isTodayCompleted={isTodayCompleted}
        isCycleCompleted={isCycleCompleted}
      />

      {/* 创建任务弹窗 */}
      <CreateTaskModal
        visible={mainlineModalVisible}
        onClose={() => {
          closeMainlineModal();
          // 关闭时清除 AI 配置
          onClearAiConfig?.();
        }}
        initialData={aiTaskConfig ? {
          title: aiTaskConfig.title,
          category: aiTaskConfig.category,
          totalDays: aiTaskConfig.totalDays,
          cycleDays: aiTaskConfig.cycleDays,
          numericConfig: aiTaskConfig.numericConfig,
          checklistItems: aiTaskConfig.checklistItems,
          checkInConfig: aiTaskConfig.checkInConfig,
        } : undefined}
      />

      {/* 任务详情弹窗 */}
      <GoalDetailModal
        visible={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* 底部今日进度条 */}
      <AnimatePresence>
        {(hasMainlineTask || sidelineTasks.length > 0) && (
          <TodayProgress />
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












