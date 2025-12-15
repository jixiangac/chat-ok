// 任务类型定义
export type TaskType = 'mainline' | 'sidelineA' | 'sidelineB';
export type Priority = 'high' | 'medium' | 'low';

// 主线任务类型
export type MainlineTaskType = 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';

// 数值型任务方向
export type NumericDirection = 'INCREASE' | 'DECREASE';

// 清单项状态
export type ChecklistItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';

// 打卡单位（打卡类型）
export type CheckInUnit = 'TIMES' | 'DURATION' | 'QUANTITY';

// 单次打卡记录（支持多轮打卡）
export interface CheckInEntry {
  id: string;
  time: string; // 打卡时间 HH:mm:ss
  value?: number; // 时长(分钟)或数值
  note?: string;
}

// 数值型任务配置
export interface NumericConfig {
  direction: NumericDirection;
  unit: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  perCycleTarget: number;
  perDayAverage: number;
  originalStartValue?: number; // 原始起始值，用于计算总目标进度
  originalPerCycleTarget?: number; // 原始每周期目标值，用于限制最小周期目标
}

// 清单项
export interface ChecklistItem {
  id: string;
  title: string;
  status: ChecklistItemStatus;
  cycle: number;
  subProgress?: {
    type: 'PAGES' | 'PERCENTAGE' | 'CUSTOM';
    current: number;
    total: number;
  };
  startedAt?: string;
  completedAt?: string;
  durationDays?: number;
  convertedToSideTask?: boolean;
}

// 清单型任务配置
export interface ChecklistConfig {
  totalItems: number;
  completedItems: number;
  perCycleTarget: number;
  items: ChecklistItem[];
}

// 打卡记录（每日记录，包含多轮打卡）
export interface CheckInRecord {
  date: string;
  checked: boolean;
  entries: CheckInEntry[]; // 当日所有打卡记录
  totalValue?: number; // 当日累计值（时长或数值）
  note?: string;
  reason?: string;
}

// 连续打卡记录
export interface StreakRecord {
  startDate: string;
  endDate: string | null;
  days: number;
  status: 'ACTIVE' | 'COMPLETED';
}

// 打卡型任务配置
export interface CheckInConfig {
  unit: CheckInUnit; // 打卡类型：次数/时长/数值
  
  // 次数型配置
  dailyMaxTimes?: number; // 单日打卡次数上限，默认1
  cycleTargetTimes?: number; // 周期总次数目标
  
  // 时长型配置
  dailyTargetMinutes?: number; // 单日目标时长(分钟)，默认15
  cycleTargetMinutes?: number; // 周期总时长目标(分钟)
  quickDurations?: number[]; // 快捷时长选项，默认[5,10,15]
  
  // 数值型配置
  dailyTargetValue?: number; // 单日目标数值
  cycleTargetValue?: number; // 周期总目标数值
  valueUnit?: string; // 数值单位，如"个"、"页"、"公里"
  
  // 通用配置
  allowMultiplePerDay: boolean; // 是否允许每日多次打卡
  weekendExempt: boolean; // 周末是否豁免
  perCycleTarget: number; // 每周期目标（兼容旧字段）
  
  // 统计数据
  currentStreak: number;
  longestStreak: number;
  checkInRate: number;
  streaks: StreakRecord[];
  records: CheckInRecord[];
}

// 周期配置
export interface CycleConfig {
  totalDurationDays: number;
  cycleLengthDays: number;
  totalCycles: number;
  currentCycle: number;
}

// 进度信息
export interface ProgressInfo {
  totalPercentage: number;
  currentCyclePercentage: number;
  currentCycleStart?: number | string;
  currentCycleTarget?: number | string;
  currentCycleAchieved?: number;
  currentCycleRemaining?: number;
}

// 提醒配置
export interface ReminderConfig {
  strategy: 'SMART' | 'DAILY' | 'NONE';
  halfCycleThreshold?: number;
  finalCycleThreshold?: number;
  inactiveDaysAlert?: number;
}

// 主线任务接口
export interface MainlineTask {
  id: string;
  mainlineType: MainlineTaskType;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DOWNGRADED' | 'PAUSED';
  createdAt: string;
  startDate?: string;
  
  cycleConfig: CycleConfig;
  progress: ProgressInfo;
  reminderConfig?: ReminderConfig;
  
  // 类型特定配置
  numericConfig?: NumericConfig;
  checklistConfig?: ChecklistConfig;
  checkInConfig?: CheckInConfig;
  
  // 历史记录
  history?: Array<{
    date: string;
    type: string;
    value?: any;
    note?: string;
  }>;
}

// 任务接口（兼容旧版）
export interface Task {
  id: string;
  title: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  type: TaskType;
  cycle?: string;
  completed?: boolean;
  
  // 主线任务特定字段
  mainlineType?: MainlineTaskType;
  mainlineTask?: MainlineTask;
  
  // 详情页需要的字段
  icon?: string;
  encouragement?: string;
  startDate?: string;
  cycleDays?: number;
  totalCycles?: number;
  
  // 支线任务主题色（创建时分配，固定不变）
  themeColor?: string;
  minCheckInsPerCycle?: number;
  checkIns?: Array<{
    id: string;
    date: string;
    timestamp: number;
    value?: number; // 时长(分钟)或数值
  }>;
}

// 目标数据接口
export interface GoalData {
  // 基础信息
  title: string;
  encouragement: string;
  icon: string;
  startDate: string;
  
  // 任务分类
  type: TaskType;
  priority?: Priority;
  
  // 主线任务类型
  mainlineType?: MainlineTaskType;
  
  // 周期配置
  totalDays: number;
  cycleDays: number;
  totalCycles: number;
  minCheckInsPerCycle: number;
  
  // 数值型配置
  numericConfig?: {
    direction: NumericDirection;
    unit: string;
    startValue: number;
    targetValue: number;
  };
  
  // 清单型配置
  checklistConfig?: {
    totalItems: number;
    items?: Array<{
      title: string;
    }>;
  };
  
  // 打卡型配置
  checkInConfig?: {
    dailyTarget: number;
    unit: CheckInUnit;
    allowMultiplePerDay: boolean;
    weekendExempt: boolean;
  };
  
  // 兼容旧数据（可选保留）
  duration?: string;
  customDuration?: boolean;
  targetCompletionRate?: number;
}

// 周期信息接口
export interface CycleInfo {
  totalCycles: number;
  remainingDays: number;
  totalCheckInsNeeded: number;
  averageCheckInsPerWeek: number;
}

// 配置验证结果
export interface ValidationResult {
  valid: boolean;
  message?: string;
}
