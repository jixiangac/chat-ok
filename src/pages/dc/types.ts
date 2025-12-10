// 任务类型定义
export type TaskType = 'mainline' | 'sidelineA' | 'sidelineB';
export type Priority = 'high' | 'medium' | 'low';

// 任务接口
export interface Task {
  id: string;
  title: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  type: TaskType;
  cycle?: string;
  completed?: boolean;
  // 详情页需要的字段
  icon?: string;
  encouragement?: string;
  startDate?: string;
  cycleDays?: number;
  totalCycles?: number;
  minCheckInsPerCycle?: number;
  checkIns?: Array<{
    id: string;
    date: string;
    timestamp: number;
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
  
  // 周期配置
  totalDays: number;              // 总天数
  cycleDays: number;              // 周期长度（7/10/15）
  totalCycles: number;            // 总周期数（自动计算）
  minCheckInsPerCycle: number;    // 每周期最低打卡次数（固定3）
  
  // 兼容旧数据（可选保留）
  duration?: string;
  customDuration?: boolean;
  targetCompletionRate?: number;
}

// 周期信息接口
export interface CycleInfo {
  totalCycles: number;           // 总周期数
  remainingDays: number;         // 余数天数
  totalCheckInsNeeded: number;   // 总打卡次数
  averageCheckInsPerWeek: number; // 平均每周打卡次数
}

// 配置验证结果
export interface ValidationResult {
  valid: boolean;
  message?: string;
}


