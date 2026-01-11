// 度假模式内容组件 - 嵌入到主页面中使用
import React, { useState, useEffect } from 'react';
import { Trip, TripGoal } from './types';
import {
  loadTrips,
  createTrip,
  deleteTrip,
  addGoalToSchedule,
  updateGoal,
  deleteGoal,
  completeGoal,
  calculateTripStats
} from './storage';
import DayTabs from './DayTabs';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import CreateTripModal from './CreateTripModal';
import TripSummaryModal from './TripSummaryModal';
import TripList from './TripList';

interface VacationContentProps {
  onAddClick: () => void;
}

const VacationContent: React.FC<VacationContentProps> = ({ onAddClick }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentScheduleId, setCurrentScheduleId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{ goal: TripGoal; scheduleId: string } | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // 检查行程是否在3天内或正在进行中
  const findUpcomingOrActiveTrip = (tripList: Trip[]): Trip | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 筛选未完成的行程
    const activeTrips = tripList.filter(trip => !trip.isCompleted);
    
    for (const trip of activeTrips) {
      const startDate = new Date(trip.startDate);
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      
      // 计算行程结束日期
      const endDate = new Date(startDateOnly.getTime() + (trip.totalDays - 1) * 24 * 60 * 60 * 1000);
      
      // 检查是否正在进行中（今天在行程日期范围内）
      if (today >= startDateOnly && today <= endDate) {
        return trip;
      }
      
      // 检查是否在3天内开始
      if (startDateOnly > today && startDateOnly <= threeDaysLater) {
        return trip;
      }
    }
    
    return null;
  };

  // 根据当前日期找到对应的日程
  const findCurrentSchedule = (trip: Trip): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(trip.startDate);
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    // 计算今天是行程的第几天
    const daysDiff = Math.floor((today.getTime() - startDateOnly.getTime()) / (24 * 60 * 60 * 1000));
    
    // 如果还没开始，显示准备日程（如果有）或第一天
    if (daysDiff < 0) {
      const prepSchedule = trip.schedules.find(s => s.type === 'preparation');
      return prepSchedule?.id || trip.schedules[0]?.id || '';
    }
    
    // 如果已经开始，找到对应的日程
    // 考虑准备日程的偏移
    const hasPrep = trip.schedules.some(s => s.type === 'preparation');
    const scheduleIndex = hasPrep ? daysDiff + 1 : daysDiff;
    
    if (scheduleIndex >= 0 && scheduleIndex < trip.schedules.length) {
      return trip.schedules[scheduleIndex].id;
    }
    
    // 如果超出范围，返回最后一个日程
    return trip.schedules[trip.schedules.length - 1]?.id || '';
  };

  // 加载行程数据并自动选择即将开始或进行中的行程
  useEffect(() => {
    const loadedTrips = loadTrips();
    setTrips(loadedTrips);
    
    // 自动选择即将开始或进行中的行程
    const upcomingTrip = findUpcomingOrActiveTrip(loadedTrips);
    if (upcomingTrip) {
      setCurrentTrip(upcomingTrip);
      const scheduleId = findCurrentSchedule(upcomingTrip);
      setCurrentScheduleId(scheduleId);
    }
  }, []);

  // 刷新数据
  const refreshData = () => {
    const loadedTrips = loadTrips();
    setTrips(loadedTrips);
    
    if (currentTrip) {
      const updated = loadedTrips.find(t => t.id === currentTrip.id);
      if (updated) {
        setCurrentTrip(updated);
      }
    }
  };

  // 选择行程
  const handleSelectTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      if (trip.schedules.length > 0) {
        setCurrentScheduleId(trip.schedules[0].id);
      }
    }
  };

  // 创建行程
  const handleCreateTrip = (data: {
    name: string;
    startDate: string;
    totalDays: number;
    hasPreparation: boolean;
  }) => {
    const newTrip = createTrip(data.name, data.startDate, data.totalDays, data.hasPreparation);
    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    if (newTrip.schedules.length > 0) {
      setCurrentScheduleId(newTrip.schedules[0].id);
    }
  };

  // 删除行程
  const handleDeleteTrip = (tripId: string) => {
    deleteTrip(tripId);
    setTrips(trips.filter(t => t.id !== tripId));
    if (currentTrip?.id === tripId) {
      setCurrentTrip(null);
    }
  };

  // 添加目标
  const handleAddGoal = (scheduleId: string, goal: { time: string; content: string; location?: string; note?: string }) => {
    if (!currentTrip) return;
    
    if (editingGoal) {
      updateGoal(currentTrip.id, editingGoal.scheduleId, editingGoal.goal.id, goal);
      setEditingGoal(null);
    } else {
      addGoalToSchedule(currentTrip.id, scheduleId, goal);
    }
    
    refreshData();
  };

  // 完成目标
  const handleCompleteGoal = (scheduleId: string, goalId: string) => {
    if (!currentTrip) return;
    completeGoal(currentTrip.id, scheduleId, goalId);
    refreshData();
    
    const updatedTrips = loadTrips();
    const updatedTrip = updatedTrips.find(t => t.id === currentTrip.id);
    if (updatedTrip?.isCompleted) {
      setShowSummaryModal(true);
    }
  };

  // 编辑目标
  const handleEditGoal = (scheduleId: string, goal: TripGoal) => {
    setEditingGoal({ goal, scheduleId });
    setShowAddGoalModal(true);
  };

  // 删除目标
  const handleDeleteGoal = (scheduleId: string, goalId: string) => {
    if (!currentTrip) return;
    if (confirm('确定要删除这个目标吗？')) {
      deleteGoal(currentTrip.id, scheduleId, goalId);
      refreshData();
    }
  };

  // 完成行程总结
  const handleCompleteSummary = () => {
    setShowSummaryModal(false);
    setCurrentTrip(null);
  };

  // 获取当前日程
  const currentSchedule = currentTrip?.schedules.find(s => s.id === currentScheduleId);
  
  // 获取当前日程索引，用于切换图片
  const currentScheduleIndex = currentTrip?.schedules.findIndex(s => s.id === currentScheduleId) || 0;
  const isEvenSchedule = currentScheduleIndex % 2 === 0;

  // 判断日程是否已过期（日期已过）
  const isScheduleExpired = (schedule: typeof currentSchedule): boolean => {
    if (!schedule?.date) return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduleDate = new Date(schedule.date);
    const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
    return scheduleDateOnly < today;
  };

  // 当前日程是否过期
  const isCurrentScheduleExpired = currentSchedule ? isScheduleExpired(currentSchedule) : false;

  // 计算日程完成度统计
  const getScheduleStats = (schedule: typeof currentSchedule) => {
    if (!schedule) return { total: 0, completed: 0, failed: 0, rate: 0 };
    const total = schedule.goals.length;
    const completed = schedule.goals.filter(g => g.status === 'completed').length;
    const isExpired = isScheduleExpired(schedule);
    const failed = isExpired ? total - completed : 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, failed, rate };
  };

  const currentStats = getScheduleStats(currentSchedule);

  return (
    <>
      {/* 顶部图片 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <img 
          src={currentTrip 
            ? (isEvenSchedule 
              ? "https://img.alicdn.com/imgextra/i3/O1CN010YyJmP1kfgyamhkBU_!!6000000004711-2-tps-2528-1696.png"
              : "https://img.alicdn.com/imgextra/i1/O1CN01Smhsov1Y7Y3oIzUY1_!!6000000003012-2-tps-2528-1696.png")
            : "https://img.alicdn.com/imgextra/i3/O1CN010YyJmP1kfgyamhkBU_!!6000000004711-2-tps-2528-1696.png"
          }
          alt="度假模式"
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {!currentTrip ? (
        // 行程列表视图
        <TripList
          trips={trips}
          onSelectTrip={handleSelectTrip}
          onDeleteTrip={handleDeleteTrip}
          onCreateTrip={() => setShowCreateModal(true)}
        />
      ) : (
        // 行程详情视图
        <>
          {/* 返回按钮和行程名称 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '0 8px',
            marginBottom: '12px'
          }}>
            <button
              onClick={() => setCurrentTrip(null)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
              {currentTrip.name}
            </span>
          </div>

          {/* 日程切换栏 */}
          <DayTabs
            schedules={currentTrip.schedules}
            currentScheduleId={currentScheduleId}
            onSelectSchedule={setCurrentScheduleId}
          />

          {/* 日程标题和状态 */}
          <div style={{ padding: '0 8px', marginBottom: '8px', marginTop: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '12px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
                fontWeight: 'normal'
              }}>
                {currentSchedule?.label} 行程安排
                {currentSchedule?.date && ` (${currentSchedule.date})`}
              </h2>
              {isCurrentScheduleExpired && (
                <span style={{
                  fontSize: '11px',
                  color: '#e74c3c',
                  backgroundColor: '#fde2e2',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  已过期
                </span>
              )}
            </div>
          </div>

          {/* 目标列表 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 已有目标 */}
            {currentSchedule?.goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isExpired={isCurrentScheduleExpired}
                onComplete={() => handleCompleteGoal(currentScheduleId, goal.id)}
                onEdit={() => handleEditGoal(currentScheduleId, goal)}
                onDelete={() => handleDeleteGoal(currentScheduleId, goal.id)}
              />
            ))}

            {/* 添加目标按钮 - 未过期时显示 */}
            {!isCurrentScheduleExpired ? (
              <div 
                onClick={() => {
                  setEditingGoal(null);
                  setShowAddGoalModal(true);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <span style={{ fontSize: '14px', color: '#999' }}>
                  添加目标
                </span>
              </div>
            ) : (
              // 过期且没有目标时显示提示
              currentSchedule?.goals.length === 0 && (
                <div 
                  style={{
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                    padding: '24px 16px',
                    border: '1px solid #f0f0f0',
                    textAlign: 'center'
                  }}
                >
                  <img 
                    src="https://img.alicdn.com/imgextra/i4/O1CN01TriqaL25lHkCEqChd_!!6000000007566-2-tps-1298-1199.png"
                    alt="已过期"
                    style={{
                      width: '80px',
                      height: 'auto',
                      opacity: 0.6,
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{ fontSize: '13px', color: '#999' }}>时光，时光，已经悄悄走过去</div>
                </div>
              )
            )}
          </div>

          {/* 底部统计 */}
          {currentSchedule && currentSchedule.goals.length > 0 && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: isCurrentScheduleExpired && currentStats.failed > 0 ? '#fef5f5' : 'white',
              borderRadius: '12px',
              border: isCurrentScheduleExpired && currentStats.failed > 0 ? '1px solid #fde2e2' : '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4CAF50' }}>
                  ✓ {currentStats.completed}
                </span>
                {currentStats.failed > 0 && (
                  <span style={{ color: '#e74c3c' }}>
                    ✗ {currentStats.failed}
                  </span>
                )}
                <span style={{ color: '#999' }}>
                  共 {currentStats.total} 项
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isCurrentScheduleExpired && (
                  <span style={{
                    fontSize: '12px',
                    color: currentStats.rate >= 80 ? '#4CAF50' : (currentStats.rate >= 50 ? '#FF9800' : '#e74c3c'),
                    fontWeight: '500'
                  }}>
                    完成率 {currentStats.rate}%
                  </span>
                )}
                <span>
                  积分：{currentTrip.totalPoints}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateTripModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTrip}
      />

      <AddGoalModal
        visible={showAddGoalModal}
        schedules={currentTrip?.schedules || []}
        currentScheduleId={currentScheduleId}
        editingGoal={editingGoal?.goal}
        onClose={() => {
          setShowAddGoalModal(false);
          setEditingGoal(null);
        }}
        onSubmit={handleAddGoal}
      />

      <TripSummaryModal
        visible={showSummaryModal}
        trip={currentTrip}
        onClose={() => setShowSummaryModal(false)}
        onComplete={handleCompleteSummary}
      />
    </>
  );
};

export default VacationContent;
