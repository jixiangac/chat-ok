// 度假模式主内容组件（重构版）
import React, { useState } from 'react';
import { useVacation } from '../../contexts';
import { useSchedule } from '../../hooks';
import { isScheduleExpired, getScheduleStats } from '../../utils';
import { TripGoal } from '../../types';
import DayTabs from '../DayTabs';
import GoalCard from '../GoalCard';
import TripList from '../TripList';
import AddGoalModal from '../AddGoalModal';
import CreateTripModal from '../CreateTripModal';
import TripSummaryModal from '../TripSummaryModal';
import styles from './styles.module.css';

interface VacationContentProps {
  onAddClick?: () => void;
}

// 图标组件
const BackIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const HERO_IMAGE_EVEN = 'https://img.alicdn.com/imgextra/i3/O1CN010YyJmP1kfgyamhkBU_!!6000000004711-2-tps-2528-1696.png';
const HERO_IMAGE_ODD = 'https://img.alicdn.com/imgextra/i1/O1CN01Smhsov1Y7Y3oIzUY1_!!6000000003012-2-tps-2528-1696.png';
const EMPTY_IMAGE = 'https://img.alicdn.com/imgextra/i4/O1CN01TriqaL25lHkCEqChd_!!6000000007566-2-tps-1298-1199.png';

const VacationContent: React.FC<VacationContentProps> = ({ onAddClick }) => {
  const {
    trips,
    currentTrip,
    currentScheduleId,
    currentSchedule,
    selectTrip,
    createTrip,
    deleteTrip,
    clearCurrentTrip,
    selectSchedule,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
  } = useVacation();

  const { isEvenSchedule } = useSchedule(currentTrip, currentScheduleId);

  // Modal 状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{ goal: TripGoal; scheduleId: string } | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // 当前日程是否过期
  const isCurrentScheduleExpired = currentSchedule ? isScheduleExpired(currentSchedule) : false;
  const currentStats = getScheduleStats(currentSchedule);

  // 处理创建行程
  const handleCreateTrip = (data: { name: string; startDate: string; totalDays: number; hasPreparation: boolean }) => {
    createTrip(data);
    setShowCreateModal(false);
  };

  // 处理添加目标
  const handleAddGoal = (scheduleId: string, goal: { time: string; content: string; location?: string; note?: string }) => {
    if (editingGoal) {
      updateGoal(editingGoal.scheduleId, editingGoal.goal.id, goal);
      setEditingGoal(null);
    } else {
      addGoal(scheduleId, goal);
    }
    setShowAddGoalModal(false);
  };

  // 处理完成目标
  const handleCompleteGoal = (goalId: string) => {
    const tripCompleted = completeGoal(currentScheduleId, goalId);
    if (tripCompleted) {
      setShowSummaryModal(true);
    }
  };

  // 处理编辑目标
  const handleEditGoal = (goal: TripGoal) => {
    setEditingGoal({ goal, scheduleId: currentScheduleId });
    setShowAddGoalModal(true);
  };

  // 处理删除目标
  const handleDeleteGoal = (goalId: string) => {
    if (confirm('确定要删除这个目标吗？')) {
      deleteGoal(currentScheduleId, goalId);
    }
  };

  // 获取完成率样式类
  const getRateClass = (rate: number) => {
    if (rate >= 80) return styles.statsRateHigh;
    if (rate >= 50) return styles.statsRateMedium;
    return styles.statsRateLow;
  };

  return (
    <div className={styles.container}>
      {/* 顶部图片 */}
      <div className={styles.heroImage}>
        <img
          src={currentTrip ? (isEvenSchedule ? HERO_IMAGE_EVEN : HERO_IMAGE_ODD) : HERO_IMAGE_EVEN}
          alt="度假模式"
          className={styles.heroImg}
        />
      </div>

      {!currentTrip ? (
        // 行程列表视图
        <TripList
          trips={trips}
          onSelectTrip={selectTrip}
          onDeleteTrip={deleteTrip}
          onCreateTrip={() => setShowCreateModal(true)}
        />
      ) : (
        // 行程详情视图
        <>
          {/* 返回按钮和行程名称 */}
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={clearCurrentTrip}>
              <BackIcon />
            </button>
            <span className={styles.tripName}>{currentTrip.name}</span>
          </div>

          {/* 日程切换栏 */}
          <DayTabs
            schedules={currentTrip.schedules}
            currentScheduleId={currentScheduleId}
            onSelectSchedule={selectSchedule}
          />

          {/* 日程标题和状态 */}
          <div className={styles.scheduleHeader}>
            <div className={styles.scheduleHeaderContent}>
              <h2 className={styles.scheduleTitle}>
                {currentSchedule?.label} 行程安排
                {currentSchedule?.date && ` (${currentSchedule.date})`}
              </h2>
              {isCurrentScheduleExpired && <span className={styles.expiredBadge}>已过期</span>}
            </div>
          </div>

          {/* 目标列表 */}
          <div className={styles.goalList}>
            {currentSchedule?.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isExpired={isCurrentScheduleExpired}
                onComplete={() => handleCompleteGoal(goal.id)}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))}

            {/* 添加目标按钮 - 未过期时显示 */}
            {!isCurrentScheduleExpired ? (
              <div
                className={styles.addGoalBtn}
                onClick={() => {
                  setEditingGoal(null);
                  setShowAddGoalModal(true);
                }}
              >
                <div className={styles.addGoalIcon}>
                  <PlusIcon />
                </div>
                <span className={styles.addGoalText}>添加目标</span>
              </div>
            ) : (
              // 过期且没有目标时显示提示
              currentSchedule?.goals.length === 0 && (
                <div className={styles.emptyState}>
                  <img src={EMPTY_IMAGE} alt="已过期" className={styles.emptyImage} />
                  <div className={styles.emptyText}>时光，时光，已经悄悄走过去</div>
                </div>
              )
            )}
          </div>

          {/* 底部统计 */}
          {currentSchedule && currentSchedule.goals.length > 0 && (
            <div className={`${styles.stats} ${isCurrentScheduleExpired && currentStats.failed > 0 ? styles.statsFailed : ''}`}>
              <div className={styles.statsLeft}>
                <span className={styles.statsCompleted}>✓ {currentStats.completed}</span>
                {currentStats.failed > 0 && <span className={styles.statsFail}>✗ {currentStats.failed}</span>}
                <span className={styles.statsTotal}>共 {currentStats.total} 项</span>
              </div>
              <div className={styles.statsRight}>
                {isCurrentScheduleExpired && (
                  <span className={`${styles.statsRate} ${getRateClass(currentStats.rate)}`}>
                    完成率 {currentStats.rate}%
                  </span>
                )}
                <span>积分：{currentTrip.totalPoints}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateTripModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTrip} />

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
        onComplete={() => {
          setShowSummaryModal(false);
          clearCurrentTrip();
        }}
      />
    </div>
  );
};

export default VacationContent;
