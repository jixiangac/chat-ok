import { useState, useEffect } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { FileText, Check } from 'lucide-react';
import GoalHeader from './GoalHeader';
import NumericCyclePanel from './NumericCyclePanel';
import ChecklistCyclePanel from './ChecklistCyclePanel';
import CheckInCyclePanel from './CheckInCyclePanel';
import HistoryRecordPanel from './HistoryRecordPanel';
import HistoryCyclePanel from './HistoryCyclePanel';
import CalendarViewPanel from './CalendarViewPanel';
import CheckInRecordPanel from './CheckInRecordPanel';
import RecordDataModal from './RecordDataModal';
import { useGoalDetail, getCurrentCycle } from './hooks';
import type { GoalDetailModalProps } from './types';
import type { MainlineTaskType } from '../types';

// 根据任务类型获取Tab配置
const getTabsConfig = (mainlineType: MainlineTaskType) => {
  switch (mainlineType) {
    case 'NUMERIC':
      return [
        { key: 'targets', label: '周期目标' },
        { key: 'records', label: '变动记录' },
        { key: 'history', label: '周期计划' },
      ];
    case 'CHECKLIST':
      return [
        { key: 'current', label: '周期目标' },
        { key: 'all', label: '全部清单' }
      ];
    case 'CHECK_IN':
    default:
      return [
        { key: 'cycle', label: '周期目标' },
        { key: 'calendar', label: '打卡记录' },
      ];
  }
};

// 获取默认Tab
const getDefaultTab = (mainlineType: MainlineTaskType) => {
  switch (mainlineType) {
    case 'CHECKLIST': return 'current';
    default: return 'cycle';
  }
};

export default function GoalDetailModal({ 
  visible, 
  goalId, 
  onClose,
  onDataChange
}: GoalDetailModalProps) {
  const { 
    goalDetail, 
    loading, 
    checkInLoading, 
    checkIn, 
    recordNumericData, 
    updateChecklistItem,
    debugNextCycle
  } = useGoalDetail(goalId, onDataChange);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  
  // 每次打开时设置默认tab为周期目标
  useEffect(() => {
    if (visible && goalDetail) {
      // 根据任务类型设置默认tab
      let defaultTab = 'cycle';
      if (goalDetail.numericConfig) {
        defaultTab = 'targets';
      } else if (goalDetail.checklistConfig) {
        defaultTab = 'current';
      }
      setActiveTab(defaultTab);
    }
  }, [visible, goalDetail]);
  
  // 处理打卡
  const handleCheckIn = async () => {
    const success = await checkIn();
    if (success) {
      Toast.show({
        icon: 'success',
        content: '打卡成功！',
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '打卡失败，请重试',
      });
    }
  };
  
  // 处理数值型记录数据
  const handleRecordData = () => {
    setShowRecordModal(true);
  };
  
  // 提交数值记录
  const handleRecordSubmit = async (value: number, note?: string) => {
    const success = await recordNumericData(value, note);
    if (success) {
      Toast.show({
        icon: 'success',
        content: '记录成功！',
      });
      setShowRecordModal(false);
    } else {
      Toast.show({
        icon: 'fail',
        content: '记录失败，请重试',
      });
    }
  };
  
  // 处理清单项更新
  const handleUpdateProgress = async (itemId: string) => {
    // 简化处理：直接标记为完成
    const success = await updateChecklistItem(itemId, { status: 'COMPLETED' });
    if (success) {
      Toast.show({
        icon: 'success',
        content: '更新成功！',
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '更新失败，请重试',
      });
    }
  };
  
  if (loading || !goalDetail) {
    return null;
  }
  
  const currentCycle = getCurrentCycle(goalDetail);

  console.log(currentCycle, goalDetail, 'currentCycle')
  
  // 智能判断任务类型：根据实际配置数据决定
  const getEffectiveMainlineType = (): MainlineTaskType => {
    // 如果有numericConfig，则为数值型
    if (goalDetail.numericConfig) {
      return 'NUMERIC';
    }
    // 如果有checklistConfig，则为清单型
    if (goalDetail.checklistConfig) {
      return 'CHECKLIST';
    }
    // 如果明确指定了mainlineType且不是上述两种，或者没有指定，默认为打卡型
    return 'CHECK_IN';
  };
  
  const mainlineType = getEffectiveMainlineType();
  const tabs = getTabsConfig(mainlineType);
  
  // 计算总打卡次数
  const totalCheckIns = goalDetail.checkIns?.length || 0;
  
  // 获取本周期的打卡记录
  const cycleRecords = goalDetail.checkIns?.filter(checkIn => {
    const checkInDate = new Date(checkIn.date);
    const cycleStart = new Date(currentCycle.startDate);
    const cycleEnd = new Date(currentCycle.endDate);
    return checkInDate >= cycleStart && checkInDate <= cycleEnd;
  }) || [];
  
  // 根据任务类型和Tab渲染内容
  const renderContent = () => {
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
  };
  
  // 获取底部按钮文案
  const getButtonText = () => {
    switch (mainlineType) {
      case 'NUMERIC': return <><FileText size={16} style={{ marginRight: 6 }} /> 记录新数据</>;
      case 'CHECKLIST': return <><FileText size={16} style={{ marginRight: 6 }} /> 更新进度</>;
      case 'CHECK_IN':
      default: return <><Check size={16} style={{ marginRight: 6 }} /> 立即打卡</>;
    }
  };
  
  // 获取底部按钮点击处理
  const getButtonHandler = () => {
    switch (mainlineType) {
      case 'NUMERIC': return handleRecordData;
      case 'CHECKLIST': return () => handleUpdateProgress('');
      case 'CHECK_IN':
      default: return handleCheckIn;
    }
  };
  
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
      {/* 目标头部 + 进度条 */}
      <GoalHeader 
        goal={goalDetail} 
        onClose={onClose}
        currentCheckIns={currentCycle.checkInCount}
        requiredCheckIns={currentCycle.requiredCheckIns}
        totalCheckIns={totalCheckIns}
        totalCycles={goalDetail.totalCycles}
        currentCycle={currentCycle.cycleNumber}
        remainingDays={currentCycle.remainingDays}
        onDebugNextCycle={async () => {
          const success = await debugNextCycle();
          if (success) {
            Toast.show({
              icon: 'success',
              content: '已进入下一周期',
            });
          }
        }}
      />
      
      {/* 胶囊Tab - 根据任务类型动态渲染 */}
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
      
      {/* 内容区 - 可滚动 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        background: '#fff',
        WebkitOverflowScrolling: 'touch'
      }}>
        {renderContent()}
      </div>
      
      {/* 底部操作按钮 - 只在周期目标Tab显示 */}
      {(activeTab === 'targets' || activeTab === 'current' || activeTab === 'cycle') && (
        <div style={{
          padding: '16px 20px',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
          background: '#fff',
          flexShrink: 0
        }}>
          <button
            onClick={getButtonHandler()}
            disabled={checkInLoading}
            style={{
              width: '100%',
              height: '52px',
              background: checkInLoading ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '26px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: checkInLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {checkInLoading ? '处理中...' : getButtonText()}
          </button>
        </div>
      )}
      
      {/* 数值型记录弹窗 */}
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
    </Popup>
  );
}



