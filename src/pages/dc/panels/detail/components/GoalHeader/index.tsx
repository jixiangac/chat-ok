import { useState, useMemo, useCallback, memo } from 'react';
import { X, Pencil, MoreHorizontal, StopCircle, GitBranch, Copy } from 'lucide-react';
import { Toast } from 'antd-mobile';
import type { GoalHeaderProps } from '../../types';
import type { Category } from '../../../../types';
import { getProgressImage, getCompletionImage } from '../../constants';
import { formatLargeNumber } from '../../utils';
import { exportSingleTask, copyToClipboard, getDeveloperMode } from '../../../../utils';
import styles from './styles.module.css';

function GoalHeaderComponent({ 
  goal, 
  onClose,
  currentCheckIns,
  requiredCheckIns,
  totalCheckIns,
  totalCycles,
  currentCycle,
  remainingDays,
  onDebugNextCycle,
  onDebugNextDay,
  onEndPlanEarly,
  onConvertToSideline,
  onEdit,
  isPlanEnded
}: GoalHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  // 获取开发者模式状态
  const isDeveloperMode = useMemo(() => getDeveloperMode(), []);
  
  // 智能判断任务类型 - 使用 useMemo 缓存
  const mainlineType = useMemo((): Category => {
    if (goal.numericConfig) return 'NUMERIC';
    if (goal.checklistConfig) return 'CHECKLIST';
    return 'CHECK_IN';
  }, [goal.numericConfig, goal.checklistConfig]);
  
  // 根据任务类型计算进度 - 直接使用预计算的 progress
  const progress = useMemo(() => {
    // 优先使用预计算的进度
    const goalAny = goal as any;
    if (goalAny.progress?.totalPercentage !== undefined) {
      return goalAny.progress.totalPercentage;
    }
    
    // 兼容旧格式
    if (mainlineType === 'NUMERIC' && goal.numericConfig) {
      const config = goal.numericConfig;
      const isDecrease = config.direction === 'DECREASE';
      const originalStart = config.originalStartValue ?? config.startValue;
      const totalChange = Math.abs(config.targetValue - originalStart);
      const rawChange = config.currentValue - originalStart;
      const effectiveChange = isDecrease 
        ? Math.max(0, -rawChange)
        : Math.max(0, rawChange);
      return totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;
    }
    if (mainlineType === 'CHECKLIST' && goal.checklistConfig) {
      const config = goal.checklistConfig;
      return config.totalItems > 0 ? Math.round((config.completedItems / config.totalItems) * 100) : 0;
    }
    // CHECK_IN 类型
    const config = goal.checkInConfig;
    const unit = config?.unit || 'TIMES';
    const records = config?.records || [];
    const checkedRecords = records.filter(r => r.checked);
    
    if (unit === 'TIMES') {
      const perCycleTarget = config?.cycleTargetTimes || config?.perCycleTarget || requiredCheckIns;
      const totalRequired = totalCycles * perCycleTarget;
      return totalRequired > 0 ? Math.round((checkedRecords.length / totalRequired) * 100) : 0;
    } else if (unit === 'DURATION') {
      const perCycleTarget = config?.cycleTargetMinutes || config?.perCycleTarget || 0;
      const totalRequired = totalCycles * perCycleTarget;
      const totalValue = checkedRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      return totalRequired > 0 ? Math.round((totalValue / totalRequired) * 100) : 0;
    } else {
      const perCycleTarget = config?.cycleTargetValue || config?.perCycleTarget || 0;
      const totalRequired = totalCycles * perCycleTarget;
      const totalValue = checkedRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      return totalRequired > 0 ? Math.round((totalValue / totalRequired) * 100) : 0;
    }
  }, [mainlineType, goal, requiredCheckIns, totalCycles]);
  
  // 获取进度图片 - 使用 useMemo 缓存
  const progressImage = useMemo(() => {
    return isPlanEnded ? getCompletionImage(progress) : getProgressImage(progress);
  }, [isPlanEnded, progress]);
  
  // 渲染目标进度信息 - 使用 useMemo 缓存
  const progressInfo = useMemo(() => {
    if (goal.numericConfig) {
      return (
        <>
          {formatLargeNumber(goal.numericConfig.currentValue)}
          <span style={{ padding: '0 5px' }}>/</span>
          <span className={styles.infoValueTarget}>{formatLargeNumber(goal.numericConfig.targetValue)}</span>
          {goal.numericConfig.unit}
        </>
      );
    }
    if (goal.checklistConfig) {
      return (
        <>
          {goal.checklistConfig.completedItems}
          <span style={{ padding: '0 5px' }}>/</span>
          <span className={styles.infoValueTarget}>{goal.checklistConfig.totalItems}</span>项
        </>
      );
    }
    // CHECK_IN 类型
    const config = goal.checkInConfig;
    const unit = config?.unit || 'TIMES';
    const records = config?.records || [];
    const checkedRecords = records.filter(r => r.checked);
    
    if (unit === 'TIMES') {
      const perCycleTarget = config?.cycleTargetTimes || config?.perCycleTarget || requiredCheckIns;
      const totalTarget = totalCycles * perCycleTarget;
      return (
        <>
          {checkedRecords.length}
          <span style={{ padding: '0 5px' }}>/</span>
          <span className={styles.infoValueTarget}>{totalTarget}</span>次
        </>
      );
    } else if (unit === 'DURATION') {
      const perCycleTarget = config?.cycleTargetMinutes || config?.perCycleTarget || 0;
      const totalTarget = totalCycles * perCycleTarget;
      const totalValue = checkedRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      return (
        <>
          {totalValue}
          <span style={{ padding: '0 5px' }}>/</span>
          <span className={styles.infoValueTarget}>{totalTarget}</span>分钟
        </>
      );
    } else {
      const perCycleTarget = config?.cycleTargetValue || config?.perCycleTarget || 0;
      const totalTarget = totalCycles * perCycleTarget;
      const totalValue = checkedRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      return (
        <>
          {totalValue}
          <span style={{ padding: '0 5px' }}>/</span>
          <span className={styles.infoValueTarget}>{totalTarget}</span>{config?.valueUnit || '个'}
        </>
      );
    }
  }, [goal, requiredCheckIns, totalCycles]);
  
  // 菜单项点击处理 - 使用 useCallback 缓存
  const handleDebugNextDay = useCallback(() => {
    onDebugNextDay?.();
    setShowMenu(false);
  }, [onDebugNextDay]);
  
  const handleDebugNextCycle = useCallback(() => {
    onDebugNextCycle?.();
    setShowMenu(false);
  }, [onDebugNextCycle]);
  
  const handleEndPlanEarly = useCallback(() => {
    onEndPlanEarly?.();
    setShowMenu(false);
  }, [onEndPlanEarly]);
  
  const handleConvertToSideline = useCallback(() => {
    onConvertToSideline?.();
    setShowMenu(false);
  }, [onConvertToSideline]);

  const handleEdit = useCallback(() => {
    onEdit?.();
    setShowMenu(false);
  }, [onEdit]);
  
  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  // 导出当前任务数据
  const handleExportTask = useCallback(async () => {
    const data = exportSingleTask(goal.id);
    if (data) {
      const success = await copyToClipboard(data);
      if (success) {
        Toast.show({ icon: 'success', content: '任务数据已复制到剪贴板' });
      } else {
        Toast.show({ icon: 'fail', content: '复制失败，请重试' });
      }
    } else {
      Toast.show({ icon: 'fail', content: '导出失败：任务不存在' });
    }
    setShowMenu(false);
  }, [goal.id]);
  
  return (
    <div className={styles.container}>
      {/* 顶部操作栏 + 标题 */}
      <div className={styles.topBar}>
        <div className={styles.leftSection}>
          <div className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </div>
          <div className={styles.titleRow}>
            <div className={styles.icon}>
              {goal.icon}
            </div>
            <div className={styles.title}>
              {goal.title}
            </div>
          </div>
        </div>
        <div className={styles.rightActions}>
          <div className={styles.actionButton} onClick={handleEdit}>
            <Pencil size={18} />
          </div>
          <div className={styles.actionButton} onClick={toggleMenu}>
            <MoreHorizontal size={18} />
          </div>
          {showMenu && (
            <div className={styles.menuDropdown}>
              {!isPlanEnded && (
                <>
                  <div className={styles.menuItem} onClick={handleDebugNextDay}>
                    🐛 Debug: 进入下一天
                  </div>
                  <div className={styles.menuItem} onClick={handleDebugNextCycle}>
                    🐛 Debug: 进入下一周期
                  </div>
                  <div className={styles.menuItem} onClick={handleEndPlanEarly}>
                    <StopCircle size={14} style={{ marginRight: 6 }} />
                    提前结束任务
                  </div>
                  <div 
                    className={`${styles.menuItem} ${styles.menuItemDisabled}`}
                    onClick={handleConvertToSideline}
                  >
                    <GitBranch size={14} style={{ marginRight: 6 }} />
                    转成支线任务
                    <span className={styles.devTag}>开发中</span>
                  </div>
                  {isDeveloperMode && (
                    <div className={styles.menuItem} onClick={handleExportTask}>
                      <Copy size={14} style={{ marginRight: 6 }} />
                      导出任务数据
                    </div>
                  )}
                </>
              )}
              {isPlanEnded && isDeveloperMode && (
                <div className={styles.menuItem} onClick={handleExportTask}>
                  <Copy size={14} style={{ marginRight: 6 }} />
                  导出任务数据
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.numericProgress}>
        <div className={styles.leftContent}>
          <div className={styles.circleProgressWrapper}>
            <svg className={styles.circleProgress} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                className={styles.circleBackground}
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#circleGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.64} 264`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className={styles.circleValue}>{progress}%</div>
          </div>
          <div className={styles.numericInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>当前周期</span>
              <span className={styles.infoValue}>
                {currentCycle}<span style={{ padding: '0 5px' }}>/</span>{totalCycles}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>目标进度</span>
              <span className={styles.infoValue}>{progressInfo}</span>
            </div>
          </div>
        </div>
        {/* 进度图片 - 右侧自适应居中 */}
        <div className={styles.progressImageWrapper}>
          <img 
            src={progressImage} 
            alt="进度图片" 
            className={styles.progressImage}
          />
        </div>
      </div>
    </div>
  );
}

// 使用 memo 包装，优化渲染性能
export const GoalHeader = memo(GoalHeaderComponent);
export default GoalHeader;
