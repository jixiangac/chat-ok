import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Popup, Toast } from 'antd-mobile';
import { FileText, Check, Archive, Clock, Hash } from 'lucide-react';
import { useTheme } from '../../contexts';
import dayjs from 'dayjs';
import {
  GoalHeader,
  NumericCyclePanel,
  ChecklistCyclePanel,
  CheckInCyclePanel,
  HistoryRecordPanel,
  HistoryCyclePanel,
  CalendarViewPanel,
  CheckInRecordPanel,
  RecordDataModal,
  CheckInModal,
  CheckInHistoryPanel
} from './components';
import { useGoalDetail, getCurrentCycle, getSimulatedToday } from './hooks';
import { getTabsConfig, isCycleTab } from './utils';
import { getEffectiveMainlineType } from '../../utils';
import type { GoalDetailModalProps } from './types';
import type { MainlineTaskType } from '../../types';

export default function GoalDetailModal({ 
  visible, 
  goalId, 
  onClose,
  onDataChange
}: GoalDetailModalProps) {
  // ========== 所有 Hooks 必须在组件顶部，条件返回之前 ==========
  
  const { 
    goalDetail, 
    loading, 
    checkInLoading, 
    checkIn,
    getTodayCheckInStatus,
    recordNumericData, 
    updateChecklistItem,
    debugNextCycle,
    debugNextDay,
    endPlanEarly,
    archiveTask
  } = useGoalDetail(goalId, onDataChange);
  
  const [activeTab, setActiveTab] = useState<string>('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const { themeColors } = useTheme();
  
  // 触发彩纸效果
  const triggerConfetti = useCallback(() => {
    let x = 0.5;
    let y = 0.9;
    
    if (checkInButtonRef.current) {
      const rect = checkInButtonRef.current.getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
    
    const myConfetti = confetti.create(canvas, { resize: true });
    
    myConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ["hsl(var(--primary))","hsl(var(--accent))","hsl(var(--secondary))","hsl(var(--muted))"],
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['circle']
    }).then(() => {
      document.body.removeChild(canvas);
    });
  }, []);
  
  // 每次打开时设置默认tab
  useEffect(() => {
    if (visible && goalDetail) {
      let defaultTab = 'cycle';
      if (goalDetail.numericConfig) {
        defaultTab = 'targets';
      } else if (goalDetail.checklistConfig) {
        defaultTab = 'current';
      }
      setActiveTab(defaultTab);
    }
  }, [visible, goalDetail]);
  
  // 提交打卡
  const handleCheckInSubmit = useCallback(async (value?: number, note?: string) => {
    const success = await checkIn(value, note);
    if (success) {
      triggerConfetti();
      Toast.show({ icon: 'success', content: '打卡成功！' });
      setShowCheckInModal(false);
    } else {
      const todayStatus = getTodayCheckInStatus();
      Toast.show({ 
        icon: 'fail', 
        content: todayStatus.isCompleted ? '今日目标已完成' : '打卡失败，请重试' 
      });
    }
  }, [checkIn, triggerConfetti, getTodayCheckInStatus]);
  
  // 处理打卡按钮点击
  const handleCheckInClick = useCallback(() => {
    const config = goalDetail?.checkInConfig;
    const unit = config?.unit || 'TIMES';
    if (unit === 'TIMES') {
      handleCheckInSubmit(1);
    } else {
      setShowCheckInModal(true);
    }
  }, [goalDetail?.checkInConfig, handleCheckInSubmit]);
  
  // 处理数值型记录数据
  const handleRecordData = useCallback(() => {
    setShowRecordModal(true);
  }, []);
  
  // 提交数值记录
  const handleRecordSubmit = useCallback(async (value: number, note?: string) => {
    const success = await recordNumericData(value, note);
    if (success) {
      triggerConfetti();
      Toast.show({ icon: 'success', content: '记录成功！' });
      setShowRecordModal(false);
    } else {
      Toast.show({ icon: 'fail', content: '记录失败，请重试' });
    }
  }, [recordNumericData, triggerConfetti]);
  
  // 处理清单项更新
  const handleUpdateProgress = useCallback(async (itemId: string) => {
    const success = await updateChecklistItem(itemId, { status: 'COMPLETED' });
    if (success) {
      Toast.show({ icon: 'success', content: '更新成功！' });
    } else {
      Toast.show({ icon: 'fail', content: '更新失败，请重试' });
    }
  }, [updateChecklistItem]);
  
  // 处理归档
  const handleArchive = useCallback(async () => {
    const success = await archiveTask();
    if (success) {
      Toast.show({ icon: 'success', content: '已归档！' });
      onClose();
    } else {
      Toast.show({ icon: 'fail', content: '归档失败，请重试' });
    }
  }, [archiveTask, onClose]);
  
  // Debug 回调
  const handleDebugNextDay = useCallback(async () => {
    const result = await debugNextDay();
    if (result && result.success) {
      Toast.show({
        icon: 'success',
        content: result.enteredNextCycle ? '已进入下一周期' : '已进入下一天',
      });
    }
  }, [debugNextDay]);
  
  const handleDebugNextCycle = useCallback(async () => {
    const success = await debugNextCycle();
    if (success) {
      Toast.show({ icon: 'success', content: '已进入下一周期' });
    }
  }, [debugNextCycle]);
  
  const handleEndPlanEarly = useCallback(async () => {
    const success = await endPlanEarly();
    if (success) {
      Toast.show({ icon: 'success', content: '任务已提前结束' });
    }
  }, [endPlanEarly]);
  
  const handleConvertToSideline = useCallback(() => {
    Toast.show({ content: '功能开发中...' });
  }, []);
  
  // 判断计划是否已结束
  const isPlanEnded = useMemo(() => {
    if (!goalDetail) return false;
    const { cycleDays, totalCycles, startDate, cycleSnapshots, status } = goalDetail;
    const start = dayjs(startDate);
    const simulatedToday = getSimulatedToday(goalDetail);
    const today = dayjs(simulatedToday);
    const planEndDate = start.add(totalCycles * cycleDays - 1, 'day');
    const isPlanEndedByTime = today.isAfter(planEndDate);
    const isPlanEndedByStatus = status === 'completed' || status === 'archived';
    const isPlanEndedBySnapshots = (cycleSnapshots?.length || 0) >= totalCycles;
    return isPlanEndedByTime || isPlanEndedByStatus || isPlanEndedBySnapshots;
  }, [goalDetail]);
  
  // 获取当前周期信息
  const currentCycle = useMemo(() => {
    if (!goalDetail) return null;
    return getCurrentCycle(goalDetail);
  }, [goalDetail]);
  
  // 任务类型判断
  const mainlineType = useMemo((): MainlineTaskType => {
    if (!goalDetail) return 'CHECK_IN';
    return getEffectiveMainlineType(
      goalDetail.numericConfig,
      goalDetail.checklistConfig,
      goalDetail.checkInConfig
    );
  }, [goalDetail]);
  
  // tabs 配置
  const tabs = useMemo(() => {
    return getTabsConfig(mainlineType, isPlanEnded);
  }, [mainlineType, isPlanEnded]);
  
  // 总打卡次数
  const totalCheckIns = useMemo(() => {
    return goalDetail?.checkIns?.length || 0;
  }, [goalDetail?.checkIns?.length]);
  
  // 本周期的打卡记录
  const cycleRecords = useMemo(() => {
    if (!goalDetail?.checkIns || !currentCycle) return [];
    return goalDetail.checkIns.filter(c => {
      const checkInDate = new Date(c.date);
      const cycleStart = new Date(currentCycle.startDate);
      const cycleEnd = new Date(currentCycle.endDate);
      return checkInDate >= cycleStart && checkInDate <= cycleEnd;
    });
  }, [goalDetail?.checkIns, currentCycle]);
  
  // 今日打卡状态
  const todayCheckInStatus = useMemo(() => {
    return getTodayCheckInStatus();
  }, [getTodayCheckInStatus]);
  
  // 底部按钮文案
  const buttonText = useMemo(() => {
    if (isPlanEnded) {
      return <><Archive size={16} style={{ marginRight: 6 }} /> 归档总结</>;
    }
    switch (mainlineType) {
      case 'NUMERIC': return <><FileText size={16} style={{ marginRight: 6 }} /> 记录新数据</>;
      case 'CHECKLIST': return <><FileText size={16} style={{ marginRight: 6 }} /> 更新进度</>;
      case 'CHECK_IN':
      default: {
        const config = goalDetail?.checkInConfig;
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
  }, [isPlanEnded, mainlineType, goalDetail?.checkInConfig, todayCheckInStatus.isCompleted]);
  
  // 按钮禁用状态
  const isCheckInButtonDisabled = useMemo(() => {
    if (isPlanEnded) return false;
    if (mainlineType !== 'CHECK_IN') return false;
    return todayCheckInStatus.isCompleted;
  }, [isPlanEnded, mainlineType, todayCheckInStatus.isCompleted]);
  
  // 底部按钮点击处理
  const buttonHandler = useMemo(() => {
    if (isPlanEnded) return handleArchive;
    switch (mainlineType) {
      case 'NUMERIC': return handleRecordData;
      case 'CHECKLIST': return () => handleUpdateProgress('');
      case 'CHECK_IN':
      default: return handleCheckInClick;
    }
  }, [isPlanEnded, mainlineType, handleArchive, handleRecordData, handleUpdateProgress, handleCheckInClick]);
  
  // 内容渲染
  const renderedContent = useMemo(() => {
    if (!goalDetail || !currentCycle) return null;
    switch (mainlineType) {
      case 'NUMERIC':
        if (activeTab === 'targets') {
          return <NumericCyclePanel goal={goalDetail} cycle={currentCycle} onRecordData={handleRecordData} />;
        }
        if (activeTab === 'records') {
          return <HistoryRecordPanel goal={goalDetail} />;
        }
        if (activeTab === 'history') {
          return <HistoryCyclePanel goal={goalDetail} />;
        }
        return null;
      case 'CHECKLIST':
        if (activeTab === 'current' || activeTab === 'cycle') {
          return <ChecklistCyclePanel goal={goalDetail} cycle={currentCycle} onUpdateProgress={handleUpdateProgress} />;
        }
        return <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>清单视图开发中...</div>;
      case 'CHECK_IN':
      default:
        if (activeTab === 'cycle') {
          return <CheckInCyclePanel goal={goalDetail} cycle={currentCycle} />;
        }
        if (activeTab === 'calendar') {
          return <CalendarViewPanel goal={goalDetail} />;
        }
        if (activeTab === 'history') {
          return <CheckInHistoryPanel goal={goalDetail} />;
        }
        if (activeTab === 'records') {
          return (
            <CheckInRecordPanel
              records={cycleRecords}
              cycleStartDate={currentCycle.startDate}
              cycleEndDate={currentCycle.endDate}
            />
          );
        }
        return null;
    }
  }, [mainlineType, activeTab, goalDetail, currentCycle, cycleRecords, handleRecordData, handleUpdateProgress]);
  
  // ========== 条件返回 - 所有 Hooks 已在上面调用完毕 ==========
  
  if (loading || !goalDetail || !currentCycle) {
    return null;
  }
  
  // ========== 渲染 ==========
  
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      destroyOnClose={false}
      forceRender={false}
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#f5f5f5'
      }}
    >
      <GoalHeader 
        goal={goalDetail} 
        onClose={onClose}
        currentCheckIns={currentCycle.checkInCount}
        requiredCheckIns={currentCycle.requiredCheckIns}
        totalCheckIns={totalCheckIns}
        totalCycles={goalDetail.totalCycles}
        currentCycle={currentCycle.cycleNumber}
        remainingDays={currentCycle.remainingDays}
        isPlanEnded={isPlanEnded}
        onDebugNextDay={handleDebugNextDay}
        onDebugNextCycle={handleDebugNextCycle}
        onEndPlanEarly={handleEndPlanEarly}
        onConvertToSideline={handleConvertToSideline}
      />
      
      <div style={{ 
        display: 'flex',
        gap: '12px',
        padding: '8px 20px 8px',
        flexShrink: 0,
        overflowX: 'auto',
        borderBottom: '1px dashed #ddd',
        borderTop: '1px dashed #ddd',
        background: '#fff',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tabs.map(tab => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              height: '32px',
              padding: '0 16px',
              borderRadius: '8px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.3s',
              background: activeTab === tab.key ? '#F5F5F5' : 'transparent',
              color: activeTab === tab.key ? '#141414' : '#525252'
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        background: '#fff',
        WebkitOverflowScrolling: 'touch'
      }}>
        {renderedContent}
      </div>
      
      {isCycleTab(activeTab) && goalDetail.status !== 'archived' && (
        <div style={{
          padding: '16px 20px',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
          background: '#fff',
          flexShrink: 0
        }}>
          <button
            ref={checkInButtonRef}
            onClick={buttonHandler}
            disabled={checkInLoading || isCheckInButtonDisabled}
            style={{
              width: '100%',
              height: '52px',
              background: (checkInLoading || isCheckInButtonDisabled) ? '#ccc' : themeColors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '26px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (checkInLoading || isCheckInButtonDisabled) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {checkInLoading ? '处理中...' : buttonText}
          </button>
        </div>
      )}
      
      {mainlineType === 'NUMERIC' && goalDetail.numericConfig && (
        <RecordDataModal
          visible={showRecordModal}
          onClose={() => setShowRecordModal(false)}
          onSubmit={handleRecordSubmit}
          currentValue={goalDetail.numericConfig.currentValue}
          unit={goalDetail.numericConfig.unit}
          direction={goalDetail.numericConfig.direction}
          loading={checkInLoading}
        />
      )}
      
      {mainlineType === 'CHECK_IN' && goalDetail.checkInConfig && (
        <CheckInModal
          visible={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          onSubmit={handleCheckInSubmit}
          unit={goalDetail.checkInConfig.unit || 'TIMES'}
          loading={checkInLoading}
          quickDurations={goalDetail.checkInConfig.quickDurations || [5, 10, 15]}
          dailyTargetMinutes={goalDetail.checkInConfig.dailyTargetMinutes || 15}
          valueUnit={goalDetail.checkInConfig.valueUnit || '个'}
          dailyTargetValue={goalDetail.checkInConfig.dailyTargetValue || 0}
          todayValue={todayCheckInStatus.todayValue}
        />
      )}
    </Popup>
  );
}

