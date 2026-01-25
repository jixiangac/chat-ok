import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Popup, Toast, Dialog } from 'antd-mobile';
import { ConvertToSidelinePopup } from '../../components';
import { FileText, Check, Archive, Clock, Hash, ChevronLeft, ChevronRight, Droplets, Coffee, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

import { useTheme, useCultivation } from '../../contexts';
import { useTaskContext } from '../../contexts';
import { useConfetti } from '../../hooks';
import { getCurrentDate, calculateTodayProgress } from '../../utils';
import { useSwipeBack } from '../settings/hooks';
import {
  DetailHeader,
  CoffeeCupProgress,
  WaterCupProgress,
  CycleInfo,
  SecondaryNav,
  RecordDataModal,
  CheckInModal,
  ChecklistRecordModal,
  ActivityRecordPanel,
  HistoryCyclePanel,
  CalendarViewPanel,
  NumericCyclePanel,
  CheckInCyclePanel,
  ChecklistCyclePanel
} from './components';
import SidelineTaskEditModal from '../../components/SidelineTaskEditModal';
import type { GoalDetailModalProps, CurrentCycleInfo } from './types';
import type { Category, Task } from '../../types';
import styles from './GoalDetailModal.module.css';

// 子页面类型
type SubPageType = 'records' | 'history' | 'calendar' | null;

export default function GoalDetailModal({
  visible,
  taskId: propTaskId,
  onClose,
  onDataChange,
  isReadOnly = false
}: GoalDetailModalProps) {
  const { 
    getTaskById,
    updateTask,
    archiveTask,
    checkIn: taskCheckIn,
    recordNumericData: taskRecordNumericData,
    updateChecklistItem: taskUpdateChecklistItem,
    batchUpdateChecklistItemsCycle: taskBatchUpdateChecklistItemsCycle,
    debugNextCycle: taskDebugNextCycle,
    debugNextDay: taskDebugNextDay,
    endPlanEarly: taskEndPlanEarly,
    refreshTasks,
    selectedTaskId
  } = useTaskContext();
  
  const taskId = propTaskId || selectedTaskId;

  const task = useMemo(() => {
    if (!taskId) return null;
    return getTaskById(taskId);
  }, [taskId, getTaskById]);

  console.log(task, 'curtask');
  
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  
  // 子页面状态
  const [currentSubPage, setCurrentSubPage] = useState<SubPageType>(null);
  const [subPageAnimating, setSubPageAnimating] = useState(false);
  const [subPageExiting, setSubPageExiting] = useState(false);

  // 主线转支线弹窗状态
  const [showConvertPopup, setShowConvertPopup] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const subPageRef = useRef<HTMLDivElement>(null);
  useTheme(); // 保持 hook 调用但不再使用 themeColors

  const { triggerConfetti } = useConfetti(checkInButtonRef);
  const {
    dispatchCheckInReward,
    dispatchArchiveReward,
    canSpendSpiritJade,
    spendSpiritJade,
    spiritJadeData,
  } = useCultivation();
  
  // 子页面手势返回
  const { pageRef: swipeRef } = useSwipeBack({
    onBack: () => handleSubPageClose(true),
    enabled: currentSubPage !== null && !subPageAnimating,
  });
  
  // 打开子页面
  const handleSubPageOpen = useCallback((page: SubPageType) => {
    setSubPageAnimating(true);
    setCurrentSubPage(page);
    setTimeout(() => setSubPageAnimating(false), 400);
  }, []);
  
  // 关闭子页面
  const handleSubPageClose = useCallback((skipAnimation?: boolean) => {
    if (skipAnimation) {
      setCurrentSubPage(null);
      setSubPageAnimating(false);
      setSubPageExiting(false);
    } else {
      setSubPageExiting(true);
      setTimeout(() => {
        setCurrentSubPage(null);
        setSubPageAnimating(false);
        setSubPageExiting(false);
      }, 400);
    }
  }, []);
  
  // 重置子页面状态
  useEffect(() => {
    if (!visible) {
      setCurrentSubPage(null);
      setSubPageAnimating(false);
      setSubPageExiting(false);
    }
  }, [visible]);
  
  const currentCycle = useMemo(() => {
    if (!task?.cycle) return null;
    const { cycle, progress, checkInConfig } = task;
    return {
      cycleNumber: cycle.currentCycle,
      totalCycles: cycle.totalCycles,
      startDate: cycle.cycleStartDate,
      endDate: cycle.cycleEndDate,
      checkInCount: progress.cycleAchieved || 0,
      requiredCheckIns: checkInConfig?.perCycleTarget || 3,
      remainingDays: cycle.remainingDays,
    } as CurrentCycleInfo;
  }, [task?.cycle, task?.progress, task?.checkInConfig]);
  
  const todayCheckInStatus = useMemo(() => {
    if (!task) {
      return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false, dailyTarget: 1 };
    }
    // 实时计算今日进度，确保 dailyTarget 始终有值
    const progress = calculateTodayProgress(task);
    return {
      dailyTarget: progress.dailyTarget || 1,
      canCheckIn: progress.canCheckIn,
      todayCount: progress.todayCount,
      todayValue: progress.todayValue,
      isCompleted: progress.isCompleted
    };
  }, [task]);
  
  const isPlanEnded = task?.isPlanEnded ?? false;
  const taskCategory: Category = task?.category ?? 'CHECK_IN';
  
  // 计算周期进度百分比
  const cycleProgress = useMemo(() => {
    if (!task) return 0;
    return task.progress.cyclePercentage || 0;
  }, [task]);

  // 计算总目标进度
  const totalProgress = useMemo(() => {
    if (!task) return 0;
    return task.progress.totalPercentage || 0;
  }, [task]);

  // 计算当前是周期第几天（考虑调试偏移量）
  const currentDayInCycle = useMemo(() => {
    if (!currentCycle || !task) return 1;
    const today = dayjs(getCurrentDate(task));
    const cycleStart = dayjs(currentCycle.startDate);
    return Math.max(1, today.diff(cycleStart, 'day') + 1);
  }, [currentCycle, task]);

  // 计算当前周期待办清单项（用于记录清单按钮）
  const pendingChecklistItems = useMemo(() => {
    if (!task || taskCategory !== 'CHECKLIST' || !currentCycle) return [];
    const items = task.checklistConfig?.items || [];
    return items.filter(
      item => item.cycle === currentCycle.cycleNumber && item.status !== 'COMPLETED'
    );
  }, [task, taskCategory, currentCycle]);

  // 提交打卡
  const handleCheckInSubmit = useCallback(async (value?: number, note?: string) => {
    if (!taskId || !task) return;
    setCheckInLoading(true);
    try {
      const result = await taskCheckIn(taskId, value, note);
      if (result.success) {
        triggerConfetti();
        // Toast.show({ icon: 'success', content: '打卡成功！' });
        setShowCheckInModal(false);
        
        // 计算完成比例
        const config = task.checkInConfig;
        const unit = config?.unit || 'TIMES';
        const dailyTarget = todayCheckInStatus.dailyTarget || 1;
        let completionRatio = 1;
        
        if (unit === 'TIMES') {
          completionRatio = 1 / dailyTarget;
        } else {
          const checkInValue = value || 1;
          completionRatio = Math.min(1, checkInValue / dailyTarget);
        }
        
        // 发放奖励（包含周期完成加成）
        dispatchCheckInReward({ 
          task, 
          completionRatio,
          isCycleComplete: result.cycleJustCompleted,
          cycleNumber: result.cycleNumber,
        });
        
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
  }, [taskId, task, taskCheckIn, triggerConfetti, todayCheckInStatus, dispatchCheckInReward, refreshTasks, getTaskById, onDataChange]);
  
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

  // 处理清单记录按钮点击 - 打开清单选择弹窗
  const handleChecklistRecord = useCallback(() => {
    if (!taskId || !task || pendingChecklistItems.length === 0) return;
    setShowChecklistModal(true);
  }, [taskId, task, pendingChecklistItems.length]);

  // 处理清单选择弹窗提交
  const handleChecklistModalSubmit = useCallback(async (item: { id: string; title: string }) => {
    if (!taskId || !task) return;

    setCheckInLoading(true);
    try {
      const success = await taskUpdateChecklistItem(taskId, item.id, { status: 'COMPLETED' });
      if (success) {
        setShowChecklistModal(false);
        triggerConfetti();

        // 发放奖励 - 基于每日目标分配奖励
        // dailyTarget = Math.ceil(周期清单数 / 周期天数)
        const dailyTarget = todayCheckInStatus.dailyTarget || 1;
        const completionRatio = 1 / dailyTarget; // 每完成一项的比例
        const reward = dispatchCheckInReward({
          task,
          completionRatio,
        });

        // 只有没有奖励弹窗时才显示 Toast
        if (!reward || (reward.spiritJade === 0 && reward.cultivation === 0)) {
          Toast.show({ icon: 'success', content: '完成！' });
        }

        refreshTasks();
        onDataChange?.();
      } else {
        Toast.show({ icon: 'fail', content: '操作失败' });
      }
    } finally {
      setCheckInLoading(false);
    }
  }, [taskId, task, taskUpdateChecklistItem, triggerConfetti, dispatchCheckInReward, refreshTasks, onDataChange, todayCheckInStatus.dailyTarget]);

  // 处理清单项更新（包含奖励发放）
  const handleChecklistItemUpdate = useCallback(async (
    itemId: string,
    updates: { status?: string; cycle?: number }
  ): Promise<boolean> => {
    if (!taskId || !task) return false;

    const success = await taskUpdateChecklistItem(taskId, itemId, updates);

    // 如果是完成操作，发放奖励
    if (success && updates.status === 'COMPLETED') {
      // 基于每日目标分配奖励
      // dailyTarget = Math.ceil(周期清单数 / 周期天数)
      const dailyTarget = todayCheckInStatus.dailyTarget || 1;
      const completionRatio = 1 / dailyTarget;
      const reward = dispatchCheckInReward({
        task,
        completionRatio,
      });

      // 只有没有奖励弹窗时才显示 Toast（奖励上限已达）
      if (!reward || (reward.spiritJade === 0 && reward.cultivation === 0)) {
        Toast.show({ icon: 'success', content: '完成！' });
      }
    }

    return success;
  }, [taskId, task, taskUpdateChecklistItem, dispatchCheckInReward, todayCheckInStatus.dailyTarget]);

  // 批量更新清单项周期
  const handleBatchUpdateChecklistItemsCycle = useCallback(async (
    itemIds: string[],
    cycle: number
  ): Promise<boolean> => {
    if (!taskId) return false;
    return taskBatchUpdateChecklistItemsCycle(taskId, itemIds, cycle);
  }, [taskId, taskBatchUpdateChecklistItemsCycle]);

  // 提交数值记录
  const handleRecordSubmit = useCallback(async (value: number, note?: string) => {
    if (!taskId || !task) return;
    setCheckInLoading(true);
    try {
      // 记录打卡前的周期进度
      const prevCyclePercentage = task.progress?.cyclePercentage || 0;
      const currentCycleNumber = task.cycle?.currentCycle || 1;
      
      const numericConfig = task.numericConfig;
      const previousValue = numericConfig?.currentValue || 0;
      const success = await taskRecordNumericData(taskId, value, note);
      if (success) {
        triggerConfetti();
        // Toast.show({ icon: 'success', content: '记录成功！' });
        setShowRecordModal(false);
        
        // 计算完成比例
        const dailyTarget = todayCheckInStatus.dailyTarget || 1;
        const change = Math.abs(value - previousValue);
        const completionRatio = Math.min(1, change / dailyTarget);
        
        // 刷新任务数据后检查周期完成
        await refreshTasks();
        
        // 获取更新后的任务数据，检查是否触发周期100%完成
        const updatedTask = getTaskById(taskId);
        const newCyclePercentage = updatedTask?.progress?.cyclePercentage || 0;
        const isCycleComplete = prevCyclePercentage < 100 && newCyclePercentage >= 100;
        
        // 发放奖励（包含周期完成加成）
        if (completionRatio > 0) {
          dispatchCheckInReward({ 
            task, 
            completionRatio,
            isCycleComplete,
            cycleNumber: isCycleComplete ? currentCycleNumber : undefined,
          });
        }
      } else {
        Toast.show({ icon: 'fail', content: '记录失败，请重试' });
      }
    } finally {
      setCheckInLoading(false);
    }
  }, [taskId, task, taskRecordNumericData, triggerConfetti, todayCheckInStatus.dailyTarget, dispatchCheckInReward, refreshTasks, getTaskById]);
  
  // 处理归档
  const handleArchive = useCallback(async () => {
    if (!taskId || !task) return;
    
    // 计算完成率
    const completionRate = (task.progress?.totalPercentage || 0) / 100;
    
    const result = archiveTask(taskId);
    if (result.success) {
      // 发放归档奖励
      dispatchArchiveReward({ task, completionRate });
      
      Toast.show({ icon: 'success', content: '已归档！' });
      onClose();
    } else {
      Toast.show({ icon: 'fail', content: '归档失败，请重试' });
    }
  }, [archiveTask, taskId, task, dispatchArchiveReward, onClose]);
  
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

  // 转为支线任务消耗的灵玉
  const CONVERT_TO_SIDELINE_COST = 50;

  // 打开主线转支线弹窗
  const handleOpenConvertPopup = useCallback(() => {
    setShowConvertPopup(true);
  }, []);

  // 确认主线转支线
  const handleConfirmConvert = useCallback(async () => {
    if (!taskId || !task) return;

    setConvertLoading(true);
    try {
      // 扣除灵玉
      spendSpiritJade({
        amount: CONVERT_TO_SIDELINE_COST,
        source: 'CONVERT_TO_SIDELINE',
        taskId: taskId,
        taskTitle: task.title,
        description: `将主线任务「${task.title}」转为支线任务`,
      });

      // 更新任务类型
      updateTask(taskId, { type: 'sidelineA' });

      Toast.show({ icon: 'success', content: '已转为支线任务' });
      setShowConvertPopup(false);
      refreshTasks();
      onDataChange?.();
      onClose();
    } finally {
      setConvertLoading(false);
    }
  }, [taskId, task, spendSpiritJade, updateTask, refreshTasks, onDataChange, onClose]);

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
        if (unit === 'TIMES') {
          // 次数类型：完成后显示"今日已完成"
          if (todayCheckInStatus.isCompleted) {
            return <><Check size={16} style={{ marginRight: 6 }} /> 今日已完成</>;
          }
          return <><Check size={16} style={{ marginRight: 6 }} /> 立即打卡</>;
        } else if (unit === 'DURATION') {
          // 时长类型：完成后显示"今日已完成"但仍可继续
          if (todayCheckInStatus.isCompleted) {
            return <><Check size={16} style={{ marginRight: 6 }} /> 今日已完成</>;
          }
          return <><Clock size={16} style={{ marginRight: 6 }} /> 记录时长</>;
        } else if (unit === 'QUANTITY') {
          // 数量类型：完成后显示"今日已完成"但仍可继续
          if (todayCheckInStatus.isCompleted) {
            return <><Check size={16} style={{ marginRight: 6 }} /> 今日已完成</>;
          }
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
    const unit = task?.checkInConfig?.unit;
    // DURATION 和 QUANTITY 类型允许继续打卡（可以超额完成）
    if (unit === 'DURATION' || unit === 'QUANTITY') {
      return false;
    }
    // TIMES 类型：达到每日上限后禁用
    return todayCheckInStatus.isCompleted;
  }, [isPlanEnded, taskCategory, todayCheckInStatus.isCompleted, task]);
  
  // 底部按钮点击处理
  const buttonHandler = useMemo(() => {
    if (isPlanEnded) return handleArchive;
    switch (taskCategory) {
      case 'NUMERIC': return handleRecordData;
      case 'CHECKLIST': return () => {}; // TODO: 清单类型处理
      case 'CHECK_IN':
      default: return handleCheckInClick;
    }
  }, [isPlanEnded, taskCategory, handleArchive, handleRecordData, handleCheckInClick]);

  // 渲染进度可视化组件
  const renderProgressVisual = () => {
    if (!task || !currentCycle || !taskCategory) return null;

    switch (taskCategory) {
      case 'CHECKLIST':
        // 清单类型不显示水杯进度，改用清单列表直接展示
        return null;
      case 'NUMERIC': {
        const numericConfig = task.numericConfig;
        // 使用总进度数据
        const currentValue = numericConfig?.currentValue || 0;
        const targetValue = numericConfig?.targetValue || 0;
        const unit = numericConfig?.unit || '';
        const direction = numericConfig?.direction || 'INCREASE';
        const startValue = numericConfig?.originalStartValue ?? numericConfig?.startValue ?? 0;

        // 统一使用咖啡杯组件（正向和减向都用）
        return (
          <WaterCupProgress
            progress={totalProgress}
            isPlanEnded={isPlanEnded}
            currentValue={currentValue}
            targetValue={targetValue}
            unit={unit}
            direction={direction}
            startValue={startValue}
            category={taskCategory}
            animate
            size="large"
          />
        );
      }
      case 'CHECK_IN':
      default: {
        const config = task.checkInConfig;
        const unitType = config?.unit || 'TIMES';
        
        // 计算总量数据
        let currentValue = 0;
        let targetValue = 0;
        let unit = '次';
        
        if (unitType === 'TIMES') {
          // 总次数
          currentValue = config?.records?.filter(r => r.checked).reduce((sum, r) => sum + (r.entries?.length || 1), 0) || 0;
          targetValue = (config?.cycleTargetTimes || config?.perCycleTarget || 0) * task.cycle.totalCycles;
          unit = '次';
        } else if (unitType === 'DURATION') {
          // 总时长（分钟）
          currentValue = config?.records?.reduce((sum, r) => sum + (r.totalValue || 0), 0) || 0;
          targetValue = (config?.cycleTargetMinutes || config?.perCycleTarget || 0) * task.cycle.totalCycles;
          unit = '分钟';
        } else if (unitType === 'QUANTITY') {
          // 总数量
          currentValue = config?.records?.reduce((sum, r) => sum + (r.totalValue || 0), 0) || 0;
          targetValue = (config?.cycleTargetValue || config?.perCycleTarget || 0) * task.cycle.totalCycles;
          unit = config?.valueUnit || '个';
        }

        return (
          <WaterCupProgress
            progress={totalProgress}
            isPlanEnded={isPlanEnded}
            currentValue={currentValue}
            targetValue={targetValue}
            category={`CHECK_IN_${unitType}`}
            unit={unit}
            animate
            size="large"
          />
        );

      }
    }
  };
  
  // 渲染子页面内容
  const renderSubPageContent = () => {
    if (!task) return null;
    
    switch (currentSubPage) {
      case 'records':
        // 当日记录只显示今天的
        return <ActivityRecordPanel goal={task} todayOnly />;
      case 'history':
        return <HistoryCyclePanel goal={task as any} />;
      case 'calendar':
        return <CalendarViewPanel goal={task as any} />;
      default:
        return null;
    }
  };
  
  // 获取子页面标题（考虑调试偏移量）
  const getSubPageTitle = (): React.ReactNode => {
    switch (currentSubPage) {
      case 'records': {
        const simulatedDate = task ? getCurrentDate(task) : dayjs().format('YYYY-MM-DD');
        return <><Calendar size={18} style={{ marginRight: 12 }} /><span style={{position: 'relative', top: -3}}>{simulatedDate}</span></>;
      }
      case 'history': return '周期计划';
      case 'calendar': return '历史记录';
      default: return '';
    }
  };
  
  const isDataReady = task && currentCycle;
  
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      style={{ zIndex: 1200 }}
      bodyClassName={styles.popupBody}
    >
      {isDataReady ? (
        <div className={styles.pageStack}>
          {/* 主页面 */}
          <div className={`${styles.pageLayer} ${currentSubPage ? styles.pageLayerBackground : styles.pageLayerActive}`}>
            {/* 顶部栏 */}
            <DetailHeader
              title={task.title}
              icon={task.icon}
              taskId={taskId || undefined}
              onClose={onClose}
              onEdit={isReadOnly ? undefined : handleEdit}
              onArchive={isReadOnly ? undefined : handleArchive}
              onDebugNextDay={isReadOnly ? undefined : handleDebugNextDay}
              onDebugNextCycle={isReadOnly ? undefined : handleDebugNextCycle}
              onEndPlanEarly={isReadOnly ? undefined : handleEndPlanEarly}
              onConvertToSideline={isReadOnly || task.type !== 'mainline' ? undefined : handleOpenConvertPopup}
              isPlanEnded={isPlanEnded}
            />
            
            {/* 内容区域 */}
            <div className={styles.contentContainer}>
              {/* 周期进度可视化（鸭子/水杯/冰块）- 清单类型不显示 */}
              {taskCategory !== 'CHECKLIST' && (
                <div className={styles.progressSection}>
                  {renderProgressVisual()}
                </div>
              )}

              {/* 清单类型：显示清单列表（使用 progressSection 容器保持高度一致） */}
              {taskCategory === 'CHECKLIST' && (
                <div className={styles.progressSection} style={{ justifyContent: 'flex-start', overflow: 'auto' }}>
                  <ChecklistCyclePanel
                    goal={task}
                    cycle={currentCycle}
                    onUpdateChecklistItem={isReadOnly ? undefined : handleChecklistItemUpdate}
                    onBatchUpdateCycle={isReadOnly ? undefined : handleBatchUpdateChecklistItemsCycle}
                  />
                </div>
              )}

              {/* 周期信息卡片 - 所有类型都显示 */}
              {isPlanEnded ? (
                taskCategory === 'NUMERIC' ? (
                  <NumericCyclePanel
                    goal={task}
                    cycle={currentCycle}
                    onRecordData={handleRecordData}
                  />
                ) : taskCategory === 'CHECK_IN' ? (
                  <CheckInCyclePanel
                    goal={task}
                    cycle={currentCycle}
                  />
                ) : null
              ) : (
                <CycleInfo
                  currentCycle={currentCycle.cycleNumber}
                  totalCycles={currentCycle.totalCycles}
                  remainingDays={currentCycle.remainingDays}
                  startDate={currentCycle.startDate}
                  endDate={currentCycle.endDate}
                  cycleDays={task.cycle.cycleDays}
                  currentDay={currentDayInCycle}
                  completionRate={cycleProgress}
                  cycleAchieved={
                    taskCategory === 'NUMERIC'
                      ? (task.progress.cycleAchieved || 0)
                      : taskCategory === 'CHECKLIST'
                        ? (task.checklistConfig?.items?.filter(i => i.cycle === currentCycle.cycleNumber && i.status === 'COMPLETED').length || 0)
                        : currentCycle.checkInCount
                  }
                  cycleTarget={
                    taskCategory === 'NUMERIC'
                      ? (task.numericConfig?.perCycleTarget || 0)
                      : taskCategory === 'CHECKLIST'
                        ? (task.checklistConfig?.items?.filter(i => i.cycle === currentCycle.cycleNumber).length || 0)
                        : currentCycle.requiredCheckIns
                  }
                />
              )}
              
              {/* 当日记录入口（所有类型都显示） */}
              {!isPlanEnded && (
                <div
                  className={styles.todayRecordCard}
                  onClick={() => handleSubPageOpen('records')}
                >
                  <div className={styles.todayRecordLeft}>
                    <div className={styles.todayRecordIcon}>
                      {taskCategory === 'NUMERIC' ? (
                        <Coffee size={20} color="#C4A08A" />
                      ) : taskCategory === 'CHECKLIST' ? (
                        <Check size={20} color="#34C759" />
                      ) : (
                        <Droplets size={20} color="#4FC3F7" />
                      )}
                    </div>
                    <span className={styles.todayRecordLabel}>当日记录</span>
                  </div>
                  <div className={styles.todayRecordRight}>
                    <span className={styles.todayRecordCount}>
                      {/* 所有类型统一使用 todayCheckInStatus */}
                      {todayCheckInStatus.todayValue}<span style={{margin: '0 5px'}}>/</span>{todayCheckInStatus.dailyTarget}
                    </span>
                    <ChevronRight size={20} color="#ccc" />
                  </div>
                </div>
              )}
              {/* 二级入口 */}
              <SecondaryNav
                taskType={taskCategory}
                onCalendarClick={() => handleSubPageOpen('calendar')}
                onHistoryClick={() => handleSubPageOpen('history')}
              />
            </div>
            
            {/* 底部按钮 - 只读模式不显示 */}
            {!isReadOnly && task.status !== 'ARCHIVED' && task.status !== 'ARCHIVED_HISTORY' && (
              <>
                <div className={styles.buttonContainer}>
                  {taskCategory === 'CHECKLIST' && !isPlanEnded ? (
                    // 清单类型（未结束）：记录清单按钮
                    <button
                      ref={checkInButtonRef}
                      onClick={handleChecklistRecord}
                      disabled={checkInLoading || !pendingChecklistItems.length}
                      className={styles.actionButton}
                    >
                      {checkInLoading ? '处理中...' : pendingChecklistItems.length ? (
                        <><FileText size={16} style={{ marginRight: 6 }} /> 记录清单</>
                      ) : (
                        <><Check size={16} style={{ marginRight: 6 }} /> 已全部完成</>
                      )}
                    </button>
                  ) : taskCategory === 'CHECKLIST' && isPlanEnded ? (
                    // 清单类型（已结束）：归档按钮
                    <button
                      ref={checkInButtonRef}
                      onClick={handleArchive}
                      disabled={checkInLoading}
                      className={styles.actionButton}
                    >
                      {checkInLoading ? '处理中...' : <><Archive size={16} style={{ marginRight: 6 }} /> 归档总结</>}
                    </button>
                  ) : (
                    // 其他类型：原有按钮
                    <button
                      ref={checkInButtonRef}
                      onClick={buttonHandler}
                      disabled={checkInLoading || isCheckInButtonDisabled}
                      className={`${styles.actionButton} ${todayCheckInStatus.isCompleted && !isCheckInButtonDisabled ? styles.completed : ''}`}
                    >
                      {checkInLoading ? '处理中...' : buttonText}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* 子页面 */}
          {currentSubPage && (
            <div 
              ref={swipeRef}
              className={`${styles.pageLayer} ${subPageExiting ? styles.pageLayerExiting : subPageAnimating ? styles.pageLayerEntering : styles.pageLayerActive}`}
            >
              {/* 子页面头部 */}
              <div className={styles.subPageHeader}>
                <button className={styles.backButton} onClick={() => handleSubPageClose()}>
                  <ChevronLeft size={24} />
                </button>
                <h2 className={styles.subPageTitle}>{getSubPageTitle()}</h2>
                {currentSubPage === 'history' ? (
                  <div className={styles.progressBadge}>
                    <span className={styles.progressValue}>{Math.round(totalProgress)}%</span>
                  </div>
                ) : (
                  <div className={styles.headerSpacer} />
                )}
              </div>
              
              {/* 子页面内容 */}
              <div className={styles.subPageContent}>
                {renderSubPageContent()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          加载中...
        </div>
      )}
      
      {/* 数值记录弹窗 */}
      {taskCategory === 'NUMERIC' && task?.numericConfig && (
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
      
      {/* 打卡弹窗 */}
      {taskCategory === 'CHECK_IN' && task?.checkInConfig && (
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

      {/* 清单记录弹窗 */}
      {taskCategory === 'CHECKLIST' && (
        <ChecklistRecordModal
          visible={showChecklistModal}
          onClose={() => setShowChecklistModal(false)}
          onSubmit={handleChecklistModalSubmit}
          pendingItems={pendingChecklistItems}
          loading={checkInLoading}
        />
      )}

      {/* 编辑弹窗 */}
      {task && (
        <SidelineTaskEditModal
          visible={showEditModal}
          task={task}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />)
      }

      {/* 主线转支线确认弹窗 */}
      {task && (
        <ConvertToSidelinePopup
          visible={showConvertPopup}
          taskTitle={task.title}
          currentBalance={spiritJadeData.balance}
          requiredAmount={CONVERT_TO_SIDELINE_COST}
          onClose={() => setShowConvertPopup(false)}
          onConfirm={handleConfirmConvert}
          loading={convertLoading}
        />
      )}
    </Popup>
  );
}





