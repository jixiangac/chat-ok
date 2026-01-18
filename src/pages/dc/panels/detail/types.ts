import type { TaskType, Priority, Category, NumericConfig, ChecklistConfig, CheckInConfig, ProgressInfo, CycleConfig } from '../../types';

export interface GoalDetailModalProps {
  visible: boolean;
  taskId?: string; // 可选，不传则从 TaskProvider 的 selectedTaskId 获取
  onClose: () => void;
  onDataChange?: () => void; // 数据变化时的回调，用于刷新卡片列表
}

export interface CheckIn {
  id: string;
  date: string;
  timestamp: number;
  value?: number; // 时长(分钟)或数值
  note?: string;
}

// 每日打卡汇总（支持多轮打卡）
export interface DailyCheckInSummary {
  date: string;
  entries: CheckIn[]; // 当日所有打卡记录
  totalTimes: number; // 当日打卡次数
  totalValue: number; // 当日累计值（时长或数值）
}

export interface GoalDetail {
  id: string;
  title: string;
  icon: string;
  encouragement: string;
  type: TaskType;
  priority?: Priority;
  
  // 主线任务类型
  mainlineType?: Category;
  
  // 周期配置
  totalDays: number;
  cycleDays: number;
  totalCycles: number;
  minCheckInsPerCycle: number;
  startDate: string;
  
  // 打卡记录
  checkIns?: CheckIn[];
  
  // 数值型配置
  numericConfig?: NumericConfig;
  
  // 清单型配置
  checklistConfig?: ChecklistConfig;
  
  // 打卡型配置
  checkInConfig?: CheckInConfig;
  
  // 进度信息
  progress?: ProgressInfo;
  
  // 历史记录
  history?: Array<{
    date: string;
    type: string;
    value?: number;
    change?: number;
    note?: string;
    itemId?: string;
  }>;
  
  // 周期快照（保存过去周期的数据，进入新周期时不会改变）
  cycleSnapshots?: Array<{
    cycleNumber: number;
    startDate: string;
    endDate: string;
    targetValue: number;
    actualValue: number; // 结算值（周期结束时的实际值）
    completionRate: number;
    unit: string;
  }>;
  
  // 其他字段
  duration?: string;
  customDuration?: boolean;
  targetCompletionRate?: number;
  createdAt?: string;
  status?: 'active' | 'completed' | 'failed' | 'downgraded' | 'archived' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'ARCHIVED_HISTORY';
  
  // Debug模拟天数偏移（用于模拟时间推进）
  debugDayOffset?: number;
}

export interface CurrentCycleInfo {
  cycleNumber: number;
  totalCycles: number;
  startDate: string;
  endDate: string;
  checkInCount: number;
  requiredCheckIns: number;
  remainingDays: number;
  checkInDates: string[];
}

export interface CurrentCycleCardProps {
  cycle: CurrentCycleInfo;
}

export interface CheckInCalendarProps {
  startDate: string;
  endDate: string;
  checkInDates: string[];
}

export interface CheckInButtonProps {
  disabled: boolean;
  loading: boolean;
  onCheckIn: () => void;
}

export interface ProgressSectionProps {
  currentCheckIns: number;
  requiredCheckIns: number;
  totalCheckIns: number;
  totalCycles: number;
  currentCycle: number;
  onRefresh?: () => void;
}

export interface TabBarProps {
  activeTab: 'cycle' | 'records';
  onChange: (tab: 'cycle' | 'records') => void;
}

export interface CheckInRecordPanelProps {
  records: CheckIn[];
  cycleStartDate: string;
  cycleEndDate: string;
}








