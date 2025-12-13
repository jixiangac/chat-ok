import { useState } from 'react';
import { X, Pencil, MoreHorizontal, BarChart3, ClipboardList, CheckCircle, Target } from 'lucide-react';
import type { GoalHeaderProps } from './types';
import type { MainlineTaskType } from '../types';
import styles from '../css/GoalHeader.module.css';

// 进度阶段图片配置
const PROGRESS_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01lbaPb71byAPZUhGyr_!!6000000003533-2-tps-1409-1248.png', // 0-20%
  'https://img.alicdn.com/imgextra/i4/O1CN01Fj0ix31kYp2Hctyjg_!!6000000004696-2-tps-820-810.png',   // 20-40%
  'https://img.alicdn.com/imgextra/i4/O1CN01DBSRcZ1EtpUw4LYt1_!!6000000000410-2-tps-786-599.png',   // 40-60%
  'https://img.alicdn.com/imgextra/i4/O1CN01hZns3k1uu1WmQmkZ2_!!6000000006096-2-tps-1056-992.png',  // 60-80%
  'https://img.alicdn.com/imgextra/i2/O1CN01msiq0R1rS8Z6jGJ1P_!!6000000005629-2-tps-2528-1696.png', // 80-100%
];

// 根据进度获取对应图片
const getProgressImage = (progress: number): string => {
  if (progress < 20) return PROGRESS_IMAGES[0];
  if (progress < 40) return PROGRESS_IMAGES[1];
  if (progress < 60) return PROGRESS_IMAGES[2];
  if (progress < 80) return PROGRESS_IMAGES[3];
  return PROGRESS_IMAGES[4];
};

// 格式化大数字（如 1000000 -> 100W）
const formatLargeNumber = (num: number): string => {
  if (num >= 10000) {
    const wan = num / 10000;
    return wan % 1 === 0 ? `${wan}W` : `${wan.toFixed(1)}W`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
};

export default function GoalHeader({ 
  goal, 
  onClose,
  currentCheckIns,
  requiredCheckIns,
  totalCheckIns,
  totalCycles,
  currentCycle,
  remainingDays,
  onDebugNextCycle
}: GoalHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  // 智能判断任务类型：根据实际配置数据决定
  const getEffectiveMainlineType = (): MainlineTaskType => {
    if (goal.numericConfig) return 'NUMERIC';
    if (goal.checklistConfig) return 'CHECKLIST';
    return 'CHECK_IN';
  };
  
  const mainlineType = getEffectiveMainlineType();
  
  // 根据任务类型计算进度
  const getProgress = () => {
    if (mainlineType === 'NUMERIC' && goal.numericConfig) {
      const config = goal.numericConfig;
      const isDecrease = config.direction === 'DECREASE';
      // 使用原始起始值计算总目标进度
      const originalStart = config.originalStartValue ?? config.startValue;
      const totalChange = Math.abs(config.targetValue - originalStart);
      // 根据方向计算有效变化量（基于原始起始值）
      const rawChange = config.currentValue - originalStart;
      const effectiveChange = isDecrease 
        ? Math.max(0, -rawChange)  // 减少目标：负变化才有效
        : Math.max(0, rawChange);   // 增加目标：正变化才有效
      return totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;
    }
    if (mainlineType === 'CHECKLIST' && goal.checklistConfig) {
      const config = goal.checklistConfig;
      return config.totalItems > 0 ? Math.round((config.completedItems / config.totalItems) * 100) : 0;
    }
    // CHECK_IN 类型
    const totalRequired = totalCycles * requiredCheckIns;
    return totalRequired > 0 ? Math.round((totalCheckIns / totalRequired) * 100) : 0;
  };
  
  const progress = getProgress();
  
  // 本周期进度
  const getCycleProgress = () => {
    if (mainlineType === 'NUMERIC' && goal.progress) {
      return goal.progress.currentCyclePercentage || 0;
    }
    return requiredCheckIns > 0 ? Math.min((currentCheckIns / requiredCheckIns) * 100, 100) : 0;
  };
  
  const cycleProgress = getCycleProgress();
  
  // 获取任务类型图标
  const getTypeIcon = (type: MainlineTaskType) => {
    switch (type) {
      case 'NUMERIC': return <BarChart3 size={16} />;
      case 'CHECKLIST': return <ClipboardList size={16} />;
      case 'CHECK_IN': return <CheckCircle size={16} />;
      default: return <Target size={16} />;
    }
  };
  
  // 获取周期信息文案
  const getCycleInfo = () => {
    if (mainlineType === 'NUMERIC') {
      return `${remainingDays}天剩余`;
    }
    if (mainlineType === 'CHECKLIST') {
      return `${remainingDays}天剩余`;
    }
    return `${currentCheckIns}/${requiredCheckIns} 次`;
  };
  
  // 获取当前进度对应的图片
  const progressImage = getProgressImage(progress);
  
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
          <div className={styles.actionButton}>
            <Pencil size={18} />
          </div>
          <div className={styles.actionButton} onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={18} />
          </div>
          {showMenu && (
            <div className={styles.menuDropdown}>
              <div 
                className={styles.menuItem}
                onClick={() => {
                  onDebugNextCycle?.();
                  setShowMenu(false);
                }}
              >
                🐛 Debug: 进入下一周期
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 根据任务类型渲染不同的进度展示 */}
      {mainlineType === 'NUMERIC' ? (
        // 数值型：圆圈进度条 + 周期信息 + 进度图片
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
                <span className={styles.infoValue}>{currentCycle}<span style={{ padding: '0 5px' }}>/</span>{totalCycles}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>目标进度</span>
                <span className={styles.infoValue}>
                  {goal.numericConfig 
                    ? <>{formatLargeNumber(goal.numericConfig.currentValue)}<span style={{ padding: '0 5px' }}>/</span><span className={styles.infoValueTarget}>{formatLargeNumber(goal.numericConfig.targetValue)}</span>{goal.numericConfig.unit}</>
                    : `${remainingDays}天`}
                </span>
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
      ) : (
        // 其他类型：保持原有的条形进度条
        <>
          <div className={styles.mainValue}>
            {progress}%
          </div>
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.progressInfo}>
              <span>周期 {currentCycle}/{totalCycles}</span>
              <span>{remainingDays}天剩余</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
