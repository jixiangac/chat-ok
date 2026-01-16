/**
 * DC 模块类型定义 v2
 * 重构后的统一数据结构
 */

// ============ 基础类型 ============

/** 视图模式类型 */
export type ViewMode = 'default' | 'group';

/** 任务类型 */
export type TaskType = 'mainline' | 'sidelineA' | 'sidelineB';

/** 任务分类（适用于所有任务类型） */
export type Category = 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';

/** 任务状态 */
export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'ARCHIVED_HISTORY';

/** 任务来源场景 */
export type SceneType = 'normal' | 'vacation' | 'memorial' | 'okr';

/** 支线任务优先级 */
export type Priority = 'high' | 'medium' | 'low';

/** 数值型任务方向 */
export type NumericDirection = 'INCREASE' | 'DECREASE';

/** 打卡单位 */
export type CheckInUnit = 'TIMES' | 'DURATION' | 'QUANTITY';

/** 清单项状态 */
export type ChecklistItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';

/** 活动日志类型 */
export type ActivityType =
  | 'CREATE'           // 创建任务
  | 'UPDATE_VALUE'     // 更新数值
  | 'CHECK_IN'         // 打卡
  | 'COMPLETE_ITEM'    // 完成清单项
  | 'CYCLE_ADVANCE'    // 周期推进
  | 'STATUS_CHANGE'    // 状态变更
  | 'NOTE';            // 备注

/** 标签类型 */
export type TagType = 'normal' | 'location' | 'mood';

// ============ 标签系统 ============

/** 任务标签 */
export interface TaskTag {
  id: string;
  name: string;
  color: string;
  type: TagType;
  icon?: string;
  createdAt: string;
}

/** 任务标签关联 */
export interface TaskTags {
  normalTagId?: string;
  locationTagId?: string;
  moodTagId?: string;
}

// ============ 今日必须完成 ============

/** 今日必须完成状态 */
export interface TodayMustCompleteState {
  date: string;
  taskIds: string[];
  skipped: boolean;
  hasShownModal: boolean;
}

// ============ 核心配置 ============

/** 周期配置 */
export interface CycleConfig {
  /** 总时长（天） */
  totalDays: number;
  /** 单周期长度（天） */
  cycleDays: number;
  /** 总周期数 */
  totalCycles: number;
  /** 当前周期（1-based） */
  currentCycle: number;
}

/** 时间信息 */
export interface TimeInfo {
  /** 创建时间 YYYY-MM-DD HH:mm:ss */
  createdAt: string;
  /** 开始日期 YYYY-MM-DD */
  startDate: string;
  /** 结束日期 YYYY-MM-DD */
  endDate: string;
  /** 完成时间 YYYY-MM-DD HH:mm:ss */
  completedAt?: string;
  /** 归档时间 YYYY-MM-DD HH:mm:ss */
  archivedAt?: string;
}

/** 进度信息（存储在数据中） */
export interface ProgressInfo {
  /** 总进度百分比 0-100 */
  totalPercentage: number;
  /** 当前周期进度百分比 0-100 */
  cyclePercentage: number;
  /** 当前周期起始值 */
  cycleStartValue: number | string;
  /** 当前周期目标值 */
  cycleTargetValue: number | string;
  /** 当前周期已完成量 */
  cycleAchieved: number;
  /** 当前周期还需量 */
  cycleRemaining: number;
  /** 最后更新时间 YYYY-MM-DD HH:mm:ss */
  lastUpdatedAt: string;
}

/** 今日进度信息 */
export interface TodayProgress {
  /** 是否可以继续打卡/记录 */
  canCheckIn: boolean;
  /** 今日打卡/记录次数 */
  todayCount: number;
  /** 今日累计值（时长或数量） */
  todayValue: number;
  /** 今日目标是否已完成 */
  isCompleted: boolean;
  /** 今日目标值 */
  dailyTarget?: number;
  /** 最后更新时间 */
  lastUpdatedAt?: string;
}

// ============ 类型特定配置 ============

/** 数值型任务配置 */
export interface NumericConfig {
  /** 方向：增加/减少 */
  direction: NumericDirection;
  /** 单位 */
  unit: string;
  /** 起始值 */
  startValue: number;
  /** 目标值 */
  targetValue: number;
  /** 当前值 */
  currentValue: number;
  /** 每周期目标量 */
  perCycleTarget: number;
  /** 每日平均量 */
  perDayAverage: number;
  /** 原始起始值（用于计算总进度） */
  originalStartValue?: number;
  /** 原始每周期目标（用于限制最小周期目标） */
  originalPerCycleTarget?: number;
}

/** 清单项 */
export interface ChecklistItem {
  id: string;
  title: string;
  status: ChecklistItemStatus;
  /** 所属周期 */
  cycle: number;
  /** 子进度（可选） */
  subProgress?: {
    type: 'PAGES' | 'PERCENTAGE' | 'CUSTOM';
    current: number;
    total: number;
  };
  /** 开始时间 YYYY-MM-DD HH:mm:ss */
  startedAt?: string;
  /** 完成时间 YYYY-MM-DD HH:mm:ss */
  completedAt?: string;
  /** 耗时天数 */
  durationDays?: number;
  /** 是否已转为支线任务 */
  convertedToSideTask?: boolean;
}

/** 清单型任务配置 */
export interface ChecklistConfig {
  /** 总项数 */
  totalItems: number;
  /** 已完成项数 */
  completedItems: number;
  /** 每周期目标项数 */
  perCycleTarget: number;
  /** 清单项列表 */
  items: ChecklistItem[];
}

/** 单次打卡记录 */
export interface CheckInEntry {
  id: string;
  /** 打卡时间 HH:mm:ss */
  time: string;
  /** 数值（时长分钟数或数量） */
  value?: number;
  /** 备注 */
  note?: string;
}

/** 每日打卡记录 */
export interface DailyCheckInRecord {
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 是否已打卡 */
  checked: boolean;
  /** 当日所有打卡 */
  entries: CheckInEntry[];
  /** 当日累计值 */
  totalValue?: number;
  /** 备注 */
  note?: string;
  /** 未打卡原因 */
  reason?: string;
}

/** 连续打卡记录 */
export interface StreakRecord {
  startDate: string;
  endDate: string | null;
  days: number;
  status: 'ACTIVE' | 'COMPLETED';
}

/** 打卡型任务配置 */
export interface CheckInConfig {
  /** 打卡类型 */
  unit: CheckInUnit;

  // 次数型配置
  dailyMaxTimes?: number;
  cycleTargetTimes?: number;

  // 时长型配置
  dailyTargetMinutes?: number;
  cycleTargetMinutes?: number;
  quickDurations?: number[];

  // 数值型配置
  dailyTargetValue?: number;
  cycleTargetValue?: number;
  valueUnit?: string;

  // 通用配置
  allowMultiplePerDay: boolean;
  weekendExempt: boolean;
  perCycleTarget: number;

  // 统计数据
  currentStreak: number;
  longestStreak: number;
  checkInRate: number;
  streaks: StreakRecord[];
  records: DailyCheckInRecord[];
}

// ============ 活动日志 ============

/** 活动日志基础接口 */
export interface BaseActivityLog {
  id: string;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 时间戳（毫秒） */
  timestamp: number;
  /** 活动类型 */
  type: ActivityType;
  /** 备注 */
  note?: string;
}

/** 创建任务日志 */
export interface CreateLog extends BaseActivityLog {
  type: 'CREATE';
}

/** 数值更新日志 */
export interface ValueUpdateLog extends BaseActivityLog {
  type: 'UPDATE_VALUE';
  /** 旧值 */
  oldValue: number;
  /** 新值 */
  newValue: number;
  /** 变化量 */
  delta: number;
}

/** 打卡日志 */
export interface CheckInLog extends BaseActivityLog {
  type: 'CHECK_IN';
  /** 打卡值（时长或数量） */
  value?: number;
  /** 打卡次数 */
  count: number;
}

/** 清单项完成日志 */
export interface ItemCompleteLog extends BaseActivityLog {
  type: 'COMPLETE_ITEM';
  /** 清单项 ID */
  itemId: string;
  /** 清单项标题 */
  itemTitle: string;
}

/** 周期推进日志 */
export interface CycleAdvanceLog extends BaseActivityLog {
  type: 'CYCLE_ADVANCE';
  /** 周期号 */
  cycleNumber: number;
  /** 周期完成率 */
  completionRate: number;
}

/** 状态变更日志 */
export interface StatusChangeLog extends BaseActivityLog {
  type: 'STATUS_CHANGE';
  /** 旧状态 */
  oldStatus: TaskStatus;
  /** 新状态 */
  newStatus: TaskStatus;
}

/** 备注日志 */
export interface NoteLog extends BaseActivityLog {
  type: 'NOTE';
  /** 备注内容 */
  content: string;
}

/** 活动日志联合类型 */
export type ActivityLog =
  | CreateLog
  | ValueUpdateLog
  | CheckInLog
  | ItemCompleteLog
  | CycleAdvanceLog
  | StatusChangeLog
  | NoteLog;

// ============ 主任务接口 ============

/**
 * 统一任务接口 v2
 * 适用于主线任务和支线任务
 */
export interface Task {
  // ========== 基础信息 ==========
  /** 任务 ID */
  id: string;

  /** 任务标题 */
  title: string;

  /** 任务类型 */
  type: TaskType;

  /** 任务分类 */
  category: Category;

  /** 任务状态 */
  status: TaskStatus;

  /** 任务来源场景 */
  from: SceneType;

  // ========== 时间信息 ==========
  time: TimeInfo;

  // ========== 周期配置 ==========
  cycle: CycleConfig;

  // ========== 进度信息 ==========
  progress: ProgressInfo;

  // ========== 类型特定配置 ==========
  /** 数值型配置 */
  numericConfig?: NumericConfig;

  /** 清单型配置 */
  checklistConfig?: ChecklistConfig;

  /** 打卡型配置 */
  checkInConfig?: CheckInConfig;

  // ========== 支线任务特定 ==========
  /** 优先级（仅支线任务） */
  priority?: Priority;

  /** 主题色（仅支线任务） */
  themeColor?: string;

  // ========== UI 展示 ==========
  /** 图标 */
  icon?: string;

  /** 鼓励语 */
  encouragement?: string;

  // ========== 标签系统 ==========
  /** 任务标签 */
  tags?: TaskTags;

  // ========== 活动日志 ==========
  /** 活动历史记录 */
  activities: ActivityLog[];

  // ========== 今日进度 ==========
  /** 今日进度信息（打卡后自动更新） */
  todayProgress?: TodayProgress;

  // ========== 欠账快照 ==========
  /** 上一周期欠账快照（用于卡片显示） */
  previousCycleDebtSnapshot?: PreviousCycleDebtSnapshot;
  /** 欠账显示信息（已计算好，直接用于卡片展示） */
  debtDisplay?: DebtDisplayInfo;

  // ========== 计算状态 ==========
  /** 任务计划是否已结束（已计算好，直接用于卡片展示） */
  isPlanEnded?: boolean;
}

// ============ 辅助类型 ============

/** 任务创建数据 */
export interface TaskCreateData {
  title: string;
  type: TaskType;
  category: Category;
  from: SceneType;
  startDate: string;
  totalDays: number;
  cycleDays: number;
  icon?: string;
  encouragement?: string;

  // 数值型
  numericConfig?: Omit<NumericConfig, 'currentValue' | 'perDayAverage'>;

  // 清单型
  checklistConfig?: Omit<ChecklistConfig, 'completedItems'>;

  // 打卡型
  checkInConfig?: Omit<CheckInConfig, 'currentStreak' | 'longestStreak' | 'checkInRate' | 'streaks' | 'records'>;

  // 支线任务
  priority?: Priority;
  themeColor?: string;
  tags?: TaskTags;
}

/** 任务更新数据 */
export type TaskUpdateData = Partial<Omit<Task, 'id' | 'type' | 'category' | 'from' | 'time' | 'activities'>>;

/** 迁移结果 */
export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  failedCount: number;
  errors: Array<{
    taskId: string;
    error: string;
  }>;
  backup?: LegacyTask[];
}

/** 验证结果 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: string[];
}

/** 周期信息（用于计算） */
export interface CycleInfo {
  totalCycles: number;
  remainingDays: number;
  totalCheckInsNeeded: number;
  averageCheckInsPerWeek: number;
}

// ============ 旧版兼容类型（仅用于迁移） ============

// 为了兼容旧代码，在 Task 接口中添加可选的旧字段

/** 旧版任务接口（仅用于迁移） */
export interface LegacyTask {
  id: string;
  title: string;
  type: TaskType;
  progress: number | any;
  currentDay: number;
  totalDays: number;
  cycle?: string;
  completed?: boolean;
  mainlineType?: string;
  mainlineTask?: {
    id: string;
    mainlineType: string;
    title: string;
    status: string;
    createdAt: string;
    startDate?: string;
    cycleConfig: {
      totalDurationDays: number;
      cycleLengthDays: number;
      totalCycles: number;
      currentCycle: number;
    };
    progress: any;
    numericConfig?: NumericConfig;
    checklistConfig?: ChecklistConfig;
    checkInConfig?: any;
    history?: Array<{
      date: string;
      type: string;
      oldValue?: any;
      value?: any;
      note?: string;
    }>;
  };
  icon?: string;
  encouragement?: string;
  startDate?: string;
  cycleDays?: number;
  totalCycles?: number;
  themeColor?: string;
  minCheckInsPerCycle?: number;
  checkIns?: Array<{
    id: string;
    date: string;
    timestamp: number;
    value?: number;
  }>;
  tagId?: string;
  tags?: TaskTags;
  createdAt?: string;
  status?: string;
}

/** 目标数据接口（用于创建任务） */
export interface GoalData {
  title: string;
  encouragement: string;
  icon: string;
  startDate: string;
  type: TaskType;
  priority?: Priority;
  category?: Category;
  totalDays: number;
  cycleDays: number;
  totalCycles: number;
  minCheckInsPerCycle: number;

  numericConfig?: {
    direction: NumericDirection;
    unit: string;
    startValue: number;
    targetValue: number;
  };

  checklistConfig?: {
    totalItems: number;
    items?: Array<{
      title: string;
    }>;
  };

  checkInConfig?: {
    dailyTarget: number;
    unit: CheckInUnit;
    allowMultiplePerDay: boolean;
    weekendExempt: boolean;
  };

  duration?: string;
  customDuration?: boolean;
  targetCompletionRate?: number;
}

// ============ 欠账快照类型（用于 MainlineTaskCard） ============

/** 欠账显示信息（用于卡片展示） */
export interface DebtDisplayInfo {
  /** 是否显示欠账 */
  showDebt: boolean;
  /** 欠账目标值 */
  debtTarget?: number;
  /** 欠账模式下的进度百分比 */
  debtProgress?: number;
  /** 欠账背景色 */
  bgColor: string;
  /** 欠账进度条颜色 */
  progressColor: string;
  /** 欠账边框颜色 */
  borderColor: string;
}

/** 上一周期欠账快照 */
export interface PreviousCycleDebtSnapshot {
  currentCycleNumber: number;
  targetValue: number;
  bgColor: string;
  progressColor: string;
  borderColor: string;
  debtCycleSnapshot?: {
    cycleNumber: number;
    startValue: number;
    targetValue: number;
    actualValue: number;
    completionRate: number;
  };
}

