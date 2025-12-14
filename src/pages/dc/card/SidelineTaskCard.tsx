import { Task } from '../types';
import styles from '../css/SidelineTaskCard.module.css';
import { 
  calculateRemainingDays, 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress
} from '../utils/mainlineTaskHelper';

// 默认主题色列表（用于兼容旧数据，基于用户提供的配色图）
const DEFAULT_THEME_COLORS = [
  '#F6EFEF', '#E0CEC6', '#F1F1E8', '#B9C9B9',
  '#E7E6ED', '#C0BDD1', '#F2F0EB', '#D6CBBD',
  '#EAECEF', '#B8BCC1', '#C6DDE5', '#E8E1B8',
  '#B3BEE5', '#E6D6BB', '#D5C4C0', '#C9D4C9',
  '#D4D1E0', '#E0DDD5', '#D1D8E0', '#D5E0E0'
];

// 根据ID生成固定颜色索引（兼容旧数据）
const getColorFromId = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return DEFAULT_THEME_COLORS[Math.abs(hash) % DEFAULT_THEME_COLORS.length];
};

interface SidelineTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function SidelineTaskCard({ task, onClick }: SidelineTaskCardProps) {
  const remainingDays = calculateRemainingDays(task);
  
  // 获取主题色（优先使用存储的，否则根据ID生成）
  const themeColor = task.themeColor || getColorFromId(task.id);
  
  // 计算总进度和周期进度
  const getProgressData = () => {
    if (!task.mainlineTask) return { totalProgress: task.progress || 0, cycleProgress: 0, cycleInfo: '' };
    
    switch (task.mainlineType) {
      case 'NUMERIC': {
        const progressData = calculateNumericProgress(task.mainlineTask);
        const config = task.mainlineTask.numericConfig;
        const cycleInfo = config ? `${config.currentValue}/${progressData.currentCycleTarget}${config.unit}` : '';
        return { 
          totalProgress: progressData.totalProgress, 
          cycleProgress: progressData.cycleProgress,
          cycleInfo
        };
      }
      case 'CHECKLIST': {
        const progressData = calculateChecklistProgress(task.mainlineTask);
        const cycleInfo = `${progressData.currentCycleCompleted}/${progressData.currentCycleTarget}项`;
        return { 
          totalProgress: progressData.totalProgress, 
          cycleProgress: progressData.cycleProgress,
          cycleInfo
        };
      }
      case 'CHECK_IN': {
        const config = task.mainlineTask.checkInConfig;
        const checkIns = task.checkIns || [];
        const { currentCycle, totalCycles, cycleLengthDays } = task.mainlineTask.cycleConfig;
        const unit = config?.unit || 'TIMES';
        
        // 计算当前周期的日期范围
        const startDate = new Date(task.startDate || task.mainlineTask.createdAt);
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
          perCycleTarget = config?.cycleTargetTimes || config?.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.length;
          totalValue = checkIns.length;
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = '次';
        } else if (unit === 'DURATION') {
          // 时长型
          perCycleTarget = config?.cycleTargetMinutes || config?.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = '分钟';
        } else {
          // 数值型 (QUANTITY)
          perCycleTarget = config?.cycleTargetValue || config?.perCycleTarget || 0;
          currentCycleValue = cycleCheckIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalValue = checkIns.reduce((sum, c) => sum + (c.value || 0), 0);
          totalTarget = totalCycles * perCycleTarget;
          unitLabel = config?.valueUnit || '个';
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
        return { totalProgress: task.progress || 0, cycleProgress: 0, cycleInfo: '' };
    }
  };
  
  const { totalProgress, cycleProgress, cycleInfo } = getProgressData();
  
  // 将hex转为rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // 渐变背景样式（从左到右渐变，进度范围内从浅到深，边缘柔和过渡）
  // 即使进度为0也显示淡淡的主题色底色
  const gradientStyle = {
    background: cycleProgress > 0
      ? `linear-gradient(to right, ${hexToRgba(themeColor, 0.15)} 0%, ${hexToRgba(themeColor, 0.5)} ${Math.max(0, cycleProgress - 5)}%, ${hexToRgba(themeColor, 0.2)} ${cycleProgress}%, white ${Math.min(100, cycleProgress + 15)}%)`
      : hexToRgba(themeColor, 0.08)
  };

  return (
    <div
      onClick={onClick}
      className={styles.card}
      style={gradientStyle}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.cycleInfoText}>{cycleInfo || `${cycleProgress}%`}</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${cycleProgress}%` }}
        ></div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.daysText}>
          {remainingDays > 0 ? `${remainingDays}天后截止` : '已截止'}
        </span>
        <div className={styles.footerRight}>
          {task.totalCycles && task.mainlineTask?.cycleConfig && (
            <span className={styles.cycleText}>
              {task.mainlineTask.cycleConfig.currentCycle}/{task.totalCycles}
            </span>
          )}
          <span className={styles.totalProgressText}>{totalProgress}%</span>
        </div>
      </div>
    </div>
  );
}
