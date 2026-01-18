import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Popup, Toast, SafeArea } from 'antd-mobile';
import { FileText, Check, Archive, Clock, Hash, ChevronLeft, ChevronRight, Droplets, Coffee, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

import { useTheme } from '../../contexts';
import { useTaskContext } from '../../contexts';
import { useConfetti } from '../../hooks';
import { getCurrentDate } from '../../utils';
import { useSwipeBack } from '../settings/hooks';
import {
  DetailHeader,
  CoffeeCupProgress,
  WaterCupProgress,
  DuckWaterProgress,
  CycleInfo,
  SecondaryNav,
  RecordDataModal,
  CheckInModal,
  ActivityRecordPanel,
  HistoryCyclePanel,
  CalendarViewPanel,
  NumericCyclePanel,
  CheckInCyclePanel
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
  onDataChange
}: GoalDetailModalProps) {
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
  
  const taskId = propTaskId || selectedTaskId;

  const task = useMemo(() => {
    if (!taskId) return null;
    return getTaskById(taskId);
  }, [taskId, getTaskById]);

  console.log(task, 'curtask');
  
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  
  // 子页面状态
  const [currentSubPage, setCurrentSubPage] = useState<SubPageType>(null);
  const [subPageAnimating, setSubPageAnimating] = useState(false);
  const [subPageExiting, setSubPageExiting] = useState(false);
  
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const subPageRef = useRef<HTMLDivElement>(null);
  const { themeColors } = useTheme();

  const { triggerConfetti } = useConfetti(checkInButtonRef);
  
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
  
  const todayProgress = task?.todayProgress;
  const todayCheckInStatus = useMemo(() => {
    if (!todayProgress) {
      return { canCheckIn: true, todayCount: 0, todayValue: 0, isCompleted: false };
    }
    return {
      dailyTarget: todayProgress.dailyTarget,
      canCheckIn: todayProgress.canCheckIn,
      todayCount: todayProgress.todayCount,
      todayValue: todayProgress.todayValue,
      isCompleted: todayProgress.isCompleted
    };
  }, [todayProgress]);
  
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

  // 计算当前是周期第几天
  const currentDayInCycle = useMemo(() => {
    if (!currentCycle || !task) return 1;
    const today = dayjs(getCurrentDate());
    const cycleStart = dayjs(currentCycle.startDate);
    return Math.max(1, today.diff(cycleStart, 'day') + 1);
  }, [currentCycle, task]);
  
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
  }, [taskId, taskRecordNumericData, triggerConfetti, refreshTasks]);
  
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
    if (taskCategory === 'CHECK_IN' && task?.checkInConfig?.unit === "DURATION") {
      return false;
    }
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
            category={taskCategory as 'NUMERIC' | 'CHECK_IN'}
            unit={unit}
            animate
            size="large"
          />
        );
        
        // return (
        //   <DuckWaterProgress
        //     progress={totalProgress}
        //     currentValue={currentValue}
        //     targetValue={targetValue}
        //     unit={unit}
        //     animate
        //     size="large"
        //   />
        // );
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
  
  // 获取子页面标题
  const getSubPageTitle = (): React.ReactNode => {
    switch (currentSubPage) {
      case 'records': return <><Calendar size={18} style={{ marginRight: 12 }} /><span style={{position: 'relative', top: -3}}>{dayjs().format('YYYY-MM-DD')}</span></>;
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
              onEdit={handleEdit}
              onArchive={handleArchive}
              onDebugNextDay={handleDebugNextDay}
              onDebugNextCycle={handleDebugNextCycle}
              onEndPlanEarly={handleEndPlanEarly}
              isPlanEnded={isPlanEnded}
            />
            
            {/* 内容区域 */}
            <div className={styles.contentContainer}>
              {/* 周期进度可视化（鸭子/水杯/冰块） */}
              <div className={styles.progressSection}>
                {renderProgressVisual()}
              </div>
              
              {/* 周期信息 - 计划结束时显示归档总结 */}
              {isPlanEnded ? (
                taskCategory === 'NUMERIC' ? (
                  <NumericCyclePanel
                    goal={task}
                    cycle={currentCycle}
                    onRecordData={handleRecordData}
                  />
                ) : (
                  <CheckInCyclePanel
                    goal={task}
                    cycle={currentCycle}
                  />
                )
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
                      : currentCycle.checkInCount
                  }
                  cycleTarget={
                    taskCategory === 'NUMERIC'
                      ? (task.numericConfig?.perCycleTarget || 0)
                      : currentCycle.requiredCheckIns
                  }
                />
              )}
              
              {/* 当日记录入口（CHECK_IN 和 NUMERIC 类型显示） */}
              {!isPlanEnded && (taskCategory === 'CHECK_IN' || taskCategory === 'NUMERIC') && (
                <div 
                  className={styles.todayRecordCard}
                  onClick={() => handleSubPageOpen('records')}
                >
                  <div className={styles.todayRecordLeft}>
                    <div className={styles.todayRecordIcon}>
                      {taskCategory === 'NUMERIC' ? (
                        <Coffee size={20} color="#C4A08A" />
                      ) : (
                        <Droplets size={20} color="#4FC3F7" />
                      )}
                    </div>
                    <span className={styles.todayRecordLabel}>当日记录</span>
                  </div>
                  <div className={styles.todayRecordRight}>
                    <span className={styles.todayRecordCount}>
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
            
            {/* 底部按钮 */}
            {task.status !== 'ARCHIVED' && task.status !== 'ARCHIVED_HISTORY' && (
              <>
                <div className={styles.buttonContainer}>
                  <button
                    ref={checkInButtonRef}
                    onClick={buttonHandler}
                    disabled={checkInLoading || isCheckInButtonDisabled}
                    className={`${styles.actionButton} ${todayCheckInStatus.isCompleted ? styles.completed : ''}`}
                    style={{ background: themeColors?.primary || undefined }}
                  >
                    {checkInLoading ? '处理中...' : buttonText}
                  </button>
                </div>
                <SafeArea position="bottom" />
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

      {/* 编辑弹窗 */}
      {task && (
        <SidelineTaskEditModal
          visible={showEditModal}
          task={task}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </Popup>
  );
}





