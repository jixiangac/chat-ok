import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Popup, Toast, SafeArea } from 'antd-mobile';
import { FileText, Check, Archive, Clock, Hash } from 'lucide-react';
import { useTheme } from '../../contexts';
import { DEFAULT_TABS, TAB_KEYS } from './constants';
import {
  GoalHeader,
  NumericCyclePanel,
  ChecklistCyclePanel,
  CheckInCyclePanel,
  HistoryRecordPanel,
  HistoryCyclePanel,
  CalendarViewPanel,
  RecordDataModal,
  CheckInModal,
  CheckInHistoryPanel
} from './components';
import { getSimulatedToday } from './hooks';
import { useConfetti } from '../../hooks';
import { useTaskContext } from '../../contexts';
import { getTabsConfig, isCycleTab } from './utils';
import type { GoalDetailModalProps, CurrentCycleInfo } from './types';
import type { Category, Task } from '../../types';
import SidelineTaskEditModal from '../../components/SidelineTaskEditModal';
import styles from './GoalDetailModal.module.css';
import dayjs from 'dayjs';
import { getCurrentDate } from '../../utils';

// 从 Task 构建 CurrentCycleInfo
function buildCurrentCycleInfo(task: Task): CurrentCycleInfo {
  const { cycle, time, checkInConfig, progress } = task;
  
  // 计算当前周期的开始和结束日期
  const startDate = dayjs(time.startDate);
  const cycleStartDay = (cycle.currentCycle - 1) * cycle.cycleDays;
  const cycleEndDay = cycleStartDay + cycle.cycleDays - 1;
  
  const cycleStartDate = startDate.add(cycleStartDay, 'day').format('YYYY-MM-DD');
  const cycleEndDate = startDate.add(cycleEndDay, 'day').format('YYYY-MM-DD');
  
  // 计算剩余天数（使用全局日期）
  const today = dayjs(getCurrentDate());
  const cycleEnd = dayjs(cycleEndDate);
  const remainingDays = Math.max(0, cycleEnd.diff(today, 'day'));
  
  // 获取本周期的打卡记录
  let checkInDates: string[] = [];
  let checkInCount = 0;
  
  if (checkInConfig?.records) {
    const cycleStart = dayjs(cycleStartDate);
    const cycleEnd = dayjs(cycleEndDate);
    
    checkInDates = checkInConfig.records
      .filter(r => {
        const recordDate = dayjs(r.date);
        return recordDate.isAfter(cycleStart.subtract(1, 'day')) && 
               recordDate.isBefore(cycleEnd.add(1, 'day')) &&
               r.checked;
      })
      .map(r => r.date);
    
    checkInCount = checkInDates.length;
  }
  
  return {
    cycleNumber: cycle.currentCycle,
    totalCycles: cycle.totalCycles,
    startDate: cycleStartDate,
    endDate: cycleEndDate,
    checkInCount,
    requiredCheckIns: checkInConfig?.perCycleTarget || 3,
    remainingDays,
    checkInDates
  };
}

export default function GoalDetailModal({ 
  visible, 
  taskId: propTaskId, 
  onClose,
  onDataChange
}: GoalDetailModalProps) {
  // ========== 所有 Hooks 必须在组件顶部，条件返回之前 ==========
  
  const { 
    getTaskById,
    updateTask,
    archiveTask,
    checkIn: taskCheckIn,
    recordNumericData: taskRecordNumericData,
    updateChecklistItem: taskUpdateChecklistItem,
    debugNextCycle: taskDebugNextCycle,
    debugNextDay: taskDebugNextDay,
    endPlanEarly: taskEndPlanEarly,
    refreshTasks,
    selectedTaskId
  } = useTaskContext();
  
  // 优先使用传入的 taskId，否则使用上下文中的 selectedTaskId
  const taskId = propTaskId || selectedTaskId;

  // 获取任务详情
  const task = useMemo(() => {
    if (!taskId) return null;
    return getTaskById(taskId);
  }, [taskId, getTaskById]);

  console.log(task,'curtask')
  
  const [activeTab, setActiveTab] = useState<string>(TAB_KEYS.TARGETS);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const { themeColors } = useTheme();

  // 使用彩纸效果 hook
  const { triggerConfetti } = useConfetti(checkInButtonRef);
  
  // 从 Task 构建当前周期信息
  const currentCycle = useMemo(() => {
    if (!task) return null;
    return buildCurrentCycleInfo(task);
  }, [task]);

  useEffect(() => {
    if (task) { 
      setActiveTab(DEFAULT_TABS[task.category]);
    }
  }, [task]);
  
  // 直接使用 Task 中预计算的今日进度
  const todayProgress = task?.todayProgress;
  const todayCheckInStatus = useMemo(() => {
    if (!todayProgress) {
      return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false };
    }
    return {
      canCheckIn: todayProgress.canCheckIn,
      todayCount: todayProgress.todayCount,
      todayValue: todayProgress.todayValue,
      isCompleted: todayProgress.isCompleted
    };
  }, [todayProgress]);
  
  // 直接使用 Task 中预计算的 isPlanEnded
  const isPlanEnded = task?.isPlanEnded ?? false;
  
  // 任务类型判断（直接使用 category 字段）
  const taskCategory: Category = task?.category ?? 'CHECK_IN';
  
  // tabs 配置
  const tabs = useMemo(() => {
    return getTabsConfig(taskCategory, isPlanEnded);
  }, [taskCategory, isPlanEnded]);
  
  // 总打卡次数（从 checkInConfig.records 计算）
  const totalCheckIns = useMemo(() => {
    if (!task?.checkInConfig?.records) return 0;
    return task.checkInConfig.records
      .filter(r => r.checked)
      .reduce((sum, r) => sum + (r.entries?.length || 1), 0);
  }, [task]);
  
  // 提交打卡
  const handleCheckInSubmit = useCallback(async (value?: number, note?: string) => {
    if (!taskId) return;
    setCheckInLoading(true);
    try {
      const success = await taskCheckIn(taskId, value, note);
      if (success) {
        triggerConfetti();
        Toast.show({ icon: 'success', content: '打卡成功！' });
        setShowCheckInModal(false);
        refreshTasks();
        onDataChange?.();
      } else {
        Toast.show({ 
          icon: 'fail', 
          content: todayCheckInStatus.isCompleted ? '今日目标已完成' : '打卡失败，请重试'
        });
      }
    } finally {
      setCheckInLoading(false);
    }
  }, [taskId, taskCheckIn, triggerConfetti, todayCheckInStatus.isCompleted, refreshTasks, onDataChange]);
  
  // 处理打卡按钮点击
  const handleCheckInClick = useCallback(() => {
    const config = task?.checkInConfig;
    const unit = config?.unit || 'TIMES';
    if (unit === 'TIMES') {
      handleCheckInSubmit(1);
    } else {
      setShowCheckInModal(true);
    }
  }, [task, handleCheckInSubmit]);
  
  // 处理数值型记录数据
  const handleRecordData = useCallback(() => {
    setShowRecordModal(true);
  }, []);
  
  // 提交数值记录
  const handleRecordSubmit = useCallback(async (value: number, note?: string) => {
    if (!taskId) return;
    setCheckInLoading(true);
    try {
      const success = await taskRecordNumericData(taskId, value, note);
      if (success) {
        triggerConfetti();
        Toast.show({ icon: 'success', content: '记录成功！' });
        setShowRecordModal(false);
        refreshTasks();
      } else {
        Toast.show({ icon: 'fail', content: '记录失败，请重试' });
      }
    } finally {
      setCheckInLoading(false);
    }
  }, [taskId, taskRecordNumericData, triggerConfetti, refreshTasks, onDataChange]);
  
  // 处理清单项更新
  const handleUpdateProgress = useCallback(async (itemId: string) => {
    if (!taskId) return;
    setCheckInLoading(true);
    try {
      const success = await taskUpdateChecklistItem(taskId, itemId, { status: 'COMPLETED' });
      if (success) {
        Toast.show({ icon: 'success', content: '更新成功！' });
        refreshTasks();
        // onDataChange?.();
      } else {
        Toast.show({ icon: 'fail', content: '更新失败，请重试' });
      }
    } finally {
      setCheckInLoading(false);
    }
  }, [taskId, taskUpdateChecklistItem, refreshTasks, onDataChange]);
  
  // 处理归档
  const handleArchive = useCallback(async () => {
    if (!taskId) return;
    const result = archiveTask(taskId);
    if (result.success) {
      Toast.show({ icon: 'success', content: '已归档！' });
      onClose();
    } else {
      Toast.show({ icon: 'fail', content: '归档失败，请重试' });
    }
  }, [archiveTask, taskId, onClose]);
  
  // Debug 回调
  const handleDebugNextDay = useCallback(async () => {
    if (!taskId) return;
    const result = await taskDebugNextDay(taskId);
    if (result && result.success) {
      Toast.show({
        icon: 'success',
        content: result.enteredNextCycle ? '已进入下一周期' : '已进入下一天',
      });
      refreshTasks();
      onDataChange?.();
    }
  }, [taskId, taskDebugNextDay, refreshTasks, onDataChange]);
  
  const handleDebugNextCycle = useCallback(async () => {
    if (!taskId) return;
    const success = await taskDebugNextCycle(taskId);
    if (success) {
      Toast.show({ icon: 'success', content: '已进入下一周期' });
      refreshTasks();
      onDataChange?.();
    }
  }, [taskId, taskDebugNextCycle, refreshTasks, onDataChange]);
  
  const handleEndPlanEarly = useCallback(async () => {
    if (!taskId) return;
    const success = await taskEndPlanEarly(taskId);
    if (success) {
      Toast.show({ icon: 'success', content: '任务已提前结束' });
      refreshTasks();
      onDataChange?.();
    }
  }, [taskId, taskEndPlanEarly, refreshTasks, onDataChange]);
  
  const handleConvertToSideline = useCallback(() => {
    Toast.show({ content: '功能开发中...' });
  }, []);

  // 处理编辑
  const handleEdit = useCallback(() => {
    setShowEditModal(true);
  }, []);

  // 处理编辑保存
  const handleEditSave = useCallback((taskId: string, updates: { title?: string; tagId?: string }) => {
    updateTask(taskId, updates);
    Toast.show({ icon: 'success', content: '保存成功！' });
    onDataChange?.();
  }, [updateTask, onDataChange]);
  
  // 底部按钮文案
  const buttonText = useMemo(() => {
    if (isPlanEnded) {
      return <><Archive size={16} style={{ marginRight: 6 }} /> 归档总结</>;
    }
    switch (taskCategory) {
      case 'NUMERIC': return <><FileText size={16} style={{ marginRight: 6 }} /> 记录新数据</>;
      case 'CHECKLIST': return <><FileText size={16} style={{ marginRight: 6 }} /> 更新进度</>;
      case 'CHECK_IN':
      default: {
        const config = task?.checkInConfig;
        const unit = config?.unit || 'TIMES';
        if (todayCheckInStatus.isCompleted) {
          return <><Check size={16} style={{ marginRight: 6 }} /> 今日已完成打卡</>;
        }
        if (unit === 'DURATION') {
          return <><Clock size={16} style={{ marginRight: 6 }} /> 记录时长</>;
        } else if (unit === 'QUANTITY') {
          return <><Hash size={16} style={{ marginRight: 6 }} /> 记录数值</>;
        }
        return <><Check size={16} style={{ marginRight: 6 }} /> 立即打卡</>;
      }
    }
  }, [isPlanEnded, taskCategory, task, todayCheckInStatus.isCompleted]);
  
  // 按钮禁用状态
  const isCheckInButtonDisabled = useMemo(() => {
    if (isPlanEnded) return false;
    if (taskCategory !== 'CHECK_IN') return false;
    if ( taskCategory === 'CHECK_IN' && task?.checkInConfig?.unit === "DURATION" ) {
      return false;
    }
    return todayCheckInStatus.isCompleted;
  }, [isPlanEnded, taskCategory, todayCheckInStatus.isCompleted]);
  
  // 底部按钮点击处理
  const buttonHandler = useMemo(() => {
    if (isPlanEnded) return handleArchive;
    switch (taskCategory) {
      case 'NUMERIC': return handleRecordData;
      case 'CHECKLIST': return () => handleUpdateProgress('');
      case 'CHECK_IN':
      default: return handleCheckInClick;
    }
  }, [isPlanEnded, taskCategory, handleArchive, handleRecordData, handleUpdateProgress, handleCheckInClick]);
  
  // 内容渲染
  const renderedContent = useMemo(() => {
    if (!task || !currentCycle) return null;
    
    switch (taskCategory) {
      case 'NUMERIC':
        if (activeTab === 'targets') {
          return <NumericCyclePanel goal={task} cycle={currentCycle} onRecordData={handleRecordData} />;
        }
        if (activeTab === 'records') {
          return <HistoryRecordPanel goal={task as any} />;
        }
        if (activeTab === 'history') {
          return <HistoryCyclePanel goal={task as any} />;
        }
        return null;
      case 'CHECKLIST':
        if (activeTab === 'current' || activeTab === 'cycle') {
          return <ChecklistCyclePanel goal={task as any} cycle={currentCycle} onUpdateProgress={handleUpdateProgress} />;
        }
        return <div className={styles.checklistPlaceholder}>清单视图开发中...</div>;
      case 'CHECK_IN':
      default:
        if (activeTab === 'cycle') {
          return <CheckInCyclePanel goal={task as any} cycle={currentCycle} />;
        }
        if (activeTab === 'calendar') {
          return <CalendarViewPanel goal={task as any} />;
        }
        if (activeTab === 'history') {
          return <CheckInHistoryPanel goal={task as any} />;
        }
        return null;
    }
  }, [taskCategory, activeTab, task, currentCycle, handleRecordData, handleUpdateProgress]);
  
  // 数据准备状态
  const isDataReady = task && currentCycle;
  
  // ========== 渲染 ==========
  
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      style={{ zIndex: 1200 }}
      bodyClassName={styles.popupBody}
    >
      {isDataReady ? (
        <>
          <GoalHeader 
            goal={task as any} 
            onClose={onClose}
            currentCheckIns={currentCycle.checkInCount}
            requiredCheckIns={currentCycle.requiredCheckIns}
            totalCheckIns={totalCheckIns}
            totalCycles={task.cycle.totalCycles}
            currentCycle={currentCycle.cycleNumber}
            remainingDays={currentCycle.remainingDays}
            isPlanEnded={isPlanEnded}
            onDebugNextDay={handleDebugNextDay}
            onDebugNextCycle={handleDebugNextCycle}
            onEndPlanEarly={handleEndPlanEarly}
            onConvertToSideline={handleConvertToSideline}
            onEdit={handleEdit}
          />
          
          <div className={styles.tabsContainer}>
            {tabs.map(tab => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              >
                {tab.label}
              </div>
            ))}
          </div>
          
          <div className={styles.contentContainer}>
            {renderedContent}
          </div>
          
          {isCycleTab(activeTab) && task.status !== 'ARCHIVED' && task.status !== 'ARCHIVED_HISTORY' && (<>
            <div className={styles.buttonContainer}>
              <button
                ref={checkInButtonRef}
                onClick={buttonHandler}
                disabled={checkInLoading || isCheckInButtonDisabled}
                className={styles.actionButton}
                style={{ background: (checkInLoading || isCheckInButtonDisabled) ? undefined : themeColors.primary }}
              >
                {checkInLoading ? '处理中...' : buttonText}
              </button>
            </div>
            <SafeArea position="bottom" />
          </>)}
          
          {taskCategory === 'NUMERIC' && task.numericConfig && (
            <RecordDataModal
              visible={showRecordModal}
              onClose={() => setShowRecordModal(false)}
              onSubmit={handleRecordSubmit}
              currentValue={task.numericConfig.currentValue}
              unit={task.numericConfig.unit}
              direction={task.numericConfig.direction}
              loading={checkInLoading}
            />
          )}
          
          {taskCategory === 'CHECK_IN' && task.checkInConfig && (
            <CheckInModal
              visible={showCheckInModal}
              onClose={() => setShowCheckInModal(false)}
              onSubmit={handleCheckInSubmit}
              unit={task.checkInConfig.unit || 'TIMES'}
              loading={checkInLoading}
              quickDurations={task.checkInConfig.quickDurations || [5, 10, 15]}
              dailyTargetMinutes={task.checkInConfig.dailyTargetMinutes || 15}
              valueUnit={task.checkInConfig.valueUnit || '个'}
              dailyTargetValue={task.checkInConfig.dailyTargetValue || 0}
              todayValue={todayCheckInStatus.todayValue}
            />
          )}

          {/* 编辑弹窗 */}
          <SidelineTaskEditModal
            visible={showEditModal}
            task={task}
            onSave={handleEditSave}
            onClose={() => setShowEditModal(false)}
          />
        </>
      ) : (
        <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          加载中...
        </div>
      )}
    </Popup>
  );
}
