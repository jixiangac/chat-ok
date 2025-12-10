import type { TaskType, Priority } from '../types';

export interface GoalDetailModalProps {
  visible: boolean;
  goalId: string;
  onClose: () => void;
}

export interface CheckIn {
  id: string;
  date: string;
  timestamp: number;
  note?: string;
}

export interface GoalDetail {
  id: string;
  title: string;
  icon: string;
  encouragement: string;
  type: TaskType;
  priority?: Priority;
  
  // 周期配置
  totalDays: number;
  cycleDays: number;
  totalCycles: number;
  minCheckInsPerCycle: number;
  startDate: string;
  
  // 打卡记录
  checkIns?: CheckIn[];
  
  // 其他字段
  duration?: string;
  customDuration?: boolean;
  targetCompletionRate?: number;
  createdAt?: string;
  status?: 'active' | 'completed' | 'failed' | 'downgraded';
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

export interface GoalHeaderProps {
  goal: GoalDetail;
  onClose: () => void;
  currentCheckIns: number;
  requiredCheckIns: number;
  totalCheckIns: number;
  totalCycles: number;
  currentCycle: number;
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

export interface CurrentCyclePanelProps {
  cycle: CurrentCycleInfo;
}

export interface CheckInRecordPanelProps {
  records: CheckIn[];
  cycleStartDate: string;
  cycleEndDate: string;
}

