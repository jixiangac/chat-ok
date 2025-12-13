// 度假模式类型定义

// 目标状态
export type GoalStatus = 'pending' | 'completed' | 'upcoming' | 'expired';

// 日程状态
export type ScheduleStatus = 'upcoming' | 'active' | 'completed' | 'expired';

// 单个目标
export interface TripGoal {
  id: string;
  time: string;        // 计划时间 HH:mm
  content: string;     // 目标内容
  location?: string;   // 地点（选填）
  note?: string;       // 备注（选填）
  status: GoalStatus;  // 完成状态
}

// 日程类型
export type ScheduleType = 'preparation' | 'day' | 'return';

// 单个日程（一天）
export interface TripSchedule {
  id: string;
  type: ScheduleType;
  dayNumber?: number;  // Day N 的 N，preparation 和 return 不需要
  label: string;       // 显示标签：准备、D1、D2...、返程
  date?: string;       // 实际日期 YYYY-MM-DD
  goals: TripGoal[];
  isCompleted: boolean;
}

// 行程
export interface Trip {
  id: string;
  name: string;              // 行程名称
  startDate: string;         // 出发日期 YYYY-MM-DD
  totalDays: number;         // 旅行天数
  hasPreparation: boolean;   // 是否有出发准备日程
  schedules: TripSchedule[]; // 所有日程
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;      // 行程是否完成
  totalPoints: number;       // 旅行积分
}

// 行程总结
export interface TripSummary {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
  dailyRates: { label: string; rate: number }[];
  earnedPoints: number;
  badges: string[];
  comment?: string;
}

// 旅行徽章
export interface TravelBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

// 度假模式状态
export interface VacationModeState {
  isActive: boolean;
  currentTripId: string | null;
  currentScheduleId: string | null;
}
