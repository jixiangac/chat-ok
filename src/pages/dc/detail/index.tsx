import { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import GoalHeader from './GoalHeader';
import CurrentCyclePanel from './CurrentCyclePanel';
import CheckInRecordPanel from './CheckInRecordPanel';
import { useGoalDetail, getCurrentCycle } from './hooks';
import type { GoalDetailModalProps } from './types';

export default function GoalDetailModal({ 
  visible, 
  goalId, 
  onClose 
}: GoalDetailModalProps) {
  const { goalDetail, loading, checkInLoading, checkIn } = useGoalDetail(goalId);
  const [activeTab, setActiveTab] = useState<'cycle' | 'records'>('cycle');
  
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
  
  if (loading || !goalDetail) {
    return null;
  }
  
  const currentCycle = getCurrentCycle(goalDetail);
  
  // 计算总打卡次数
  const totalCheckIns = goalDetail.checkIns?.length || 0;
  
  // 获取本周期的打卡记录
  const cycleRecords = goalDetail.checkIns?.filter(checkIn => {
    const checkInDate = new Date(checkIn.date);
    const cycleStart = new Date(currentCycle.startDate);
    const cycleEnd = new Date(currentCycle.endDate);
    return checkInDate >= cycleStart && checkInDate <= cycleEnd;
  }) || [];
  
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
      />
      
      {/* 胶囊Tab */}
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
        <div
          onClick={() => setActiveTab('cycle')}
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
            background: activeTab === 'cycle' ? '#F5F5F5' : 'transparent',
            color: activeTab === 'cycle' ? '#141414' : '#525252'
          }}
        >
          当前周期
        </div>
        <div
          onClick={() => setActiveTab('records')}
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
            background: activeTab === 'records' ? '#F5F5F5' : 'transparent',
            color: activeTab === 'records' ? '#141414' : '#525252'
          }}
        >
          打卡记录
        </div>
      </div>
      
      {/* 内容区 - 可滚动 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        background: '#fff',
        WebkitOverflowScrolling: 'touch'
      }}>
        {activeTab === 'cycle' ? (
          <CurrentCyclePanel cycle={currentCycle} />
        ) : (
          <CheckInRecordPanel
            records={cycleRecords}
            cycleStartDate={currentCycle.startDate}
            cycleEndDate={currentCycle.endDate}
          />
        )}
      </div>
      
      {/* 底部打卡按钮 */}
      <div style={{
        padding: '16px 20px',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        background: '#fff',
        flexShrink: 0
      }}>
        <button
          onClick={handleCheckIn}
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
          {checkInLoading ? (
            '打卡中...'
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>✓</span>
              立即打卡
            </>
          )}
        </button>
      </div>
    </Popup>
  );
}



