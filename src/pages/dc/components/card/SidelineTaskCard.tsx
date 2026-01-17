import React from 'react';
import { Task } from '../../types';
import styles from '../../css/SidelineTaskCard.module.css';
import dayjs from 'dayjs';
import { 
  calculateRemainingDays, 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  calculateCurrentCycleNumber
} from '../../utils/mainlineTaskHelper';
import { getTodayCheckInStatusForTask } from '../../panels/detail/hooks';
import { isTaskTodayMustComplete } from '../../utils/todayMustCompleteStorage';

// 默认主题色列表（用于兼容旧数据，基于用户提供的配色图）
const DEFAULT_THEME_COLORS = [
  '#F6EFEF', '#E0CEC6', '#F1F1E8', '#B9C9B9',
  '#E7E6ED', '#C0BDD1', '#F2F0EB', '#D6CBBD',
  '#EAECEF', '#B8BCC1', '#C6DDE5', '#E8E1B8',
  '#B3BEE5', '#E6D6BB', '#D5C4C0', '#C9D4C9',
  '#D4D1E0', '#E0DDD5', '#D1D8E0', '#D5E0E0'
];

// 格式化数值：大于等于1000时不显示小数点
const formatValue = (num: number): string => {
  if (Math.abs(num) >= 1000) {
    return Math.round(num).toLocaleString('zh-CN');
  }
  return num.toLocaleString('zh-CN');
};

// 根据ID生成固定颜色索引（兼容旧数据）
const getColorFromId = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return DEFAULT_THEME_COLORS[Math.abs(hash) % DEFAULT_THEME_COLORS.length];
};

// 将hex转为rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 圆圈进度条组件（用于grid模式）
interface CircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted?: boolean;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ 
  progress, 
  size = 16, 
  strokeWidth = 2,
  isCompleted = false 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isCompleted) {
    return (
      <div style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="#37352f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#37352f"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease'
          }}
        />
      </svg>
    </div>
  );
};

// 计算当日打卡任务完成状态和进度
const calculateDailyProgress = (task: Task): { isCompleted: boolean; progress: number } => {
  // 优先使用 task.todayProgress（支持 CHECK_IN 和 NUMERIC 类型）
  const tp = task.todayProgress;
  if (tp) {
    if (tp.isCompleted) {
      return { isCompleted: true, progress: 100 };
    }
    const dailyTarget = tp.dailyTarget ?? 0;
    if (dailyTarget > 0) {
      // 使用绝对值处理减少型任务（NUMERIC 类型的 todayValue 可能为负数）
      const progress = Math.min(100, Math.max(0, Math.round((Math.abs(tp.todayValue ?? 0) / dailyTarget) * 100)));
      return { isCompleted: false, progress };
    }
  }
  
  // 兼容旧逻辑
  const status = getTodayCheckInStatusForTask(task);
  
  if (status.isCompleted) {
    return { isCompleted: true, progress: 100 };
  }
  
  let progress = 0;
  if (status.dailyTarget && status.dailyTarget > 0) {
    progress = Math.min(100, Math.round((Math.abs(status.todayValue) / status.dailyTarget) * 100));
  }
  
  return { isCompleted: false, progress };
};

// 截止时间颜色配置
const DEADLINE_COLORS = {
  urgent: '#5c0011',      // 乌梅红 - 0天（今天截止）
  warning: '#c41d7f',     // 玫瑰红 - 剩余1/3周期
  caution: '#d48806',     // 烟黄 - 剩余2/3周期
  normal: 'rgba(55, 53, 47, 0.5)'  // 默认灰色
};

// 根据剩余天数和周期天数获取截止时间颜色
// 只有在剩余天数 ≤ 变色起始点时才开始变色，在这个范围内按3个阶段依次变色
// 如果周期完成率小于50%，从1/2时间开始变色
const getDeadlineColor = (remainingDays: number, cycleDays: number, cycleProgress: number): string => {
  // 根据周期完成率决定变色起始点
  // 完成率 < 50%：从剩余 1/2 周期开始变色
  // 完成率 >= 50%：从剩余 1/3 周期开始变色
  const startThreshold = cycleProgress < 50 ? cycleDays / 2 : cycleDays / 3;
  
  // 如果剩余天数 > 变色起始点，使用默认颜色
  if (remainingDays > startThreshold) return DEADLINE_COLORS.normal;
  
  // 在变色范围内，按3个阶段变色
  if (remainingDays <= 0) return DEADLINE_COLORS.urgent;
  if (remainingDays <= startThreshold / 3) return DEADLINE_COLORS.warning;
  if (remainingDays <= (startThreshold * 2) / 3) return DEADLINE_COLORS.caution;
  
  return DEADLINE_COLORS.normal;
};

// 获取截止时间文案
const getDeadlineText = (remainingDays: number): string => {
  if (remainingDays <= 0) return '今天截止';
  if (remainingDays === 1) return '明天截止';
  return `${remainingDays}天后截止`;
};

interface SidelineTaskCardProps {
  task: Task;
  onClick?: () => void;
  isTodayCompleted?: boolean;
  isCycleCompleted?: boolean;
  variant?: 'card' | 'grid';
  isMustComplete?: boolean;
}

export default function SidelineTaskCard({ task, onClick, isTodayCompleted, isCycleCompleted, variant = 'card', isMustComplete }: SidelineTaskCardProps) {
  const mustComplete = isMustComplete ?? isTaskTodayMustComplete(task.id);
  const remainingDays = calculateRemainingDays(task);
  
  // 获取主题色（优先使用存储的，否则根据ID生成）
  const themeColor = task.themeColor || getColorFromId(task.id);
  
  // 计算当前周期（基于cycleSnapshots，与详情页逻辑一致）
  const currentCycleNumber = calculateCurrentCycleNumber(task);
  
  // 获取周期天数用于计算颜色（支持新旧格式）
  const cycleDays = task.cycle?.cycleDays || (task as any).cycleDays || 7;
  
  // 获取总周期数（支持新旧格式）
  const totalCycles = task.cycle?.totalCycles || (task as any).totalCycles || 1;
  
  // 获取任务分类（支持新旧格式）
  const taskCategory = task.category || (task as any).mainlineType;
  
  // 获取配置（支持新旧格式）
  const numericConfig = task.numericConfig || (task as any).mainlineTask?.numericConfig;
  const checklistConfig = task.checklistConfig || (task as any).mainlineTask?.checklistConfig;
  const checkInConfig = task.checkInConfig || (task as any).mainlineTask?.checkInConfig;
  const cycleConfig = task.cycle || (task as any).mainlineTask?.cycleConfig;
  
  // 计算周期起始值（从cycleSnapshots获取上一周期的结算值）
  const getCycleStartValue = (): number | undefined => {
    if (!numericConfig) return undefined;
    
    const config = numericConfig;
    const cycleSnapshots = (task as any).cycleSnapshots || (task as any).mainlineTask?.cycleSnapshots || [];
    
    // 如果有快照数据，使用上一周期的结算值作为本周期起始值
    if (cycleSnapshots.length > 0) {
      const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
      if (lastSnapshot.actualValue !== undefined) {
        return lastSnapshot.actualValue;
      }
    }
    
    // 没有快照时，使用配置的起始值
    return config.startValue;
  };
  const cycleStartValue = getCycleStartValue();
  
  // 计算总进度和周期进度
  const getProgressData = () => {
    // 如果有新格式的进度信息，直接使用
    if (task.progress && typeof task.progress === 'object' && 'cyclePercentage' in task.progress) {
      const progress = task.progress;
      return {
        totalProgress: progress.totalPercentage || 0,
        cycleProgress: progress.cyclePercentage || 0,
        cycleInfo: `${formatValue(Number(progress.cycleAchieved) || 0)}/${formatValue(Number(progress.cycleTargetValue) || 0)}`
      };
    }
    
    // 兼容旧格式
    const mainlineTask = (task as any).mainlineTask;
    if (!mainlineTask && !taskCategory) {
      return { totalProgress: 0, cycleProgress: 0, cycleInfo: '' };
    }
    
    switch (taskCategory) {
      case 'NUMERIC': {
        const progressData = calculateNumericProgress({ numericConfig, cycleConfig } as any, {
          currentCycleNumber,
          cycleStartValue
        });
        const cycleInfo = numericConfig ? `${formatValue(numericConfig.currentValue)}/${formatValue(progressData.currentCycleTarget)}${numericConfig.unit}` : '';
        return { 
          totalProgress: progressData.totalProgress, 
          cycleProgress: progressData.cycleProgress,
          cycleInfo
        };
      }
      case 'CHECKLIST': {
        const progressData = calculateChecklistProgress({ checklistConfig, cycleConfig } as any);
        const cycleInfo = `${progressData.currentCycleCompleted}/${progressData.currentCycleTarget}项`;
        return { 
          totalProgress: progressData.totalProgress, 
          cycleProgress: progressData.cycleProgress,
          cycleInfo
        };
      }
      case 'CHECK_IN': {
        const config = checkInConfig;
        if (!config) return { totalProgress: 0, cycleProgress: 0, cycleInfo: '' };
        
        const checkIns = (task as any).checkIns || [];
        const currentCycle = cycleConfig?.currentCycle || 1;
        const cycleLengthDays = cycleConfig?.cycleDays || cycleDays;
        const unit = config.unit || 'TIMES';
        
        // 计算当前周期的日期范围
        const startDate = new Date(task.time?.startDate || (task as any).startDate || (task as any).mainlineTask?.createdAt);
        const currentCycleStartDay = (currentCycle - 1) * cycleLengthDays;
        const currentCycleEndDay = currentCycle * cycleLengthDays;
        
        const currentCycleStartDate = new Date(startDate);
        currentCycleStartDate.setDate(startDate.getDate() + currentCycleStartDay);
        const cycleStartStr = currentCycleStartDate.toISOString().split('T')[0];
        
        const currentCycleEndDate = new Date(startDate);
        currentCycleEndDate.setDate(startDate.getDate() + currentCycleEndDay - 1);
        const cycleEndStr = currentCycleEndDate.toISOString().split('T')[0];
        
        // 获取本周期的打卡记录
        const cycleCheckIns = checkIns.filter(c => 
          c.date >= cycleStartStr && c.date <= cycleEndStr
        );
        
        let currentCycleValue: number;
        let totalValue: number;
        let perCycleTarget: number;
        let totalTarget: number;
        let cycleInfo: string;
        let unitLabel: string;
        
        if (unit === 'TIMES') {
          // 次数型
          perCycleTarget = config.cycleTargetTimes || config.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.length;
          totalValue = checkIns.length;
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = '次';
        } else if (unit === 'DURATION') {
          // 时长型
          perCycleTarget = config.cycleTargetMinutes || config.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = '分钟';
        } else {
          // 数值型 (QUANTITY)
          perCycleTarget = config.cycleTargetValue || config.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = config.valueUnit || '个';
        }
        
        // 计算进度
        const cycleProgress = perCycleTarget > 0 
          ? Math.min(100, Math.round((currentCycleValue / perCycleTarget) * 100))
          : 0;
        const totalProgress = totalTarget > 0 
          ? Math.round((totalValue / totalTarget) * 100)
          : 0;
        
        cycleInfo = `${currentCycleValue}/${perCycleTarget}${unitLabel}`;
        return { 
          totalProgress, 
          cycleProgress,
          cycleInfo
        };
      }
      default:
        return { totalProgress: 0, cycleProgress: 0, cycleInfo: '' };
    }
  };
  
  const { totalProgress, cycleProgress, cycleInfo } = getProgressData();
  
  // 计算截止时间颜色和文案（需要在获取cycleProgress之后）
  const deadlineColor = getDeadlineColor(remainingDays, cycleDays, cycleProgress);
  const deadlineText = getDeadlineText(remainingDays);
  
  // 渐变背景样式（从左到右渐变，进度范围内从浅到深，边缘柔和过渡）
  const gradientStyle = {
    background: cycleProgress > 0
      ? `linear-gradient(to right, ${hexToRgba(themeColor, 0.15)} 0%, ${hexToRgba(themeColor, 0.5)} ${Math.max(0, cycleProgress - 5)}%, ${hexToRgba(themeColor, 0.2)} ${cycleProgress}%, white ${Math.min(100, cycleProgress + 15)}%)`
      : '#fff'
  };

  // 计算当日打卡进度（用于grid模式）
  const dailyStatus = calculateDailyProgress(task);

  // Grid模式UI
  if (variant === 'grid') {
    return (
      <button
        onClick={onClick}
        className={styles.gridCard}
        style={gradientStyle}
      >
        {mustComplete && (
          <div className={styles.mustCompleteBadge} title="今日必须完成">
            🎯
          </div>
        )}
        <div className={styles.gridContent}>
          <div className={styles.gridTitle}>{task.title}</div>
          <div className={styles.gridInfo}>
            <span>{currentCycleNumber}/{totalCycles}</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
        </div>
        <CircleProgress
          progress={dailyStatus.progress}
          isCompleted={dailyStatus.isCompleted}
          size={16}
          strokeWidth={2}
        />
      </button>
    );
  }

  // Card模式UI（默认）
  return (
    <div
      onClick={onClick}
      className={styles.card}
      style={gradientStyle}
    >
      {mustComplete && (
        <div className={styles.mustCompleteBadge} title="今日必须完成">
          🎯
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {isCycleCompleted && (
            <span className={styles.cycleDoneBadge}>周期完成</span>
          )}
          {dailyStatus.isCompleted && (
            <span className={styles.todayDoneBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </span>
          )}
          <h3 className={styles.title}>{task.title}</h3>
        </div>
        <span className={styles.cycleInfoText}>{cycleInfo || `${cycleProgress}%`}</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${cycleProgress}%` }}
        ></div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.daysText} style={{ color: deadlineColor }}>
          {deadlineText}
        </span>
        <div className={styles.footerRight}>
          {totalCycles > 1 && (
            <span className={styles.cycleText}>
              {currentCycleNumber}/{totalCycles}
            </span>
          )}
          <span className={styles.totalProgressText}>{totalProgress}%</span>
        </div>
      </div>
    </div>
  );
}



