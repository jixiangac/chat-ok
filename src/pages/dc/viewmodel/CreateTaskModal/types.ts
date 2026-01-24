import type { Category, NumericDirection, CheckInUnit } from '../../types';

// 保持旧版兼容的别名
type MainlineTaskType = Category;

// 步骤枚举
export type Step = 'cycle' | 'type' | 'config';

// 任务类别
export type TaskCategory = 'MAINLINE' | 'SIDELINE';

// 周期信息
export interface CycleInfo {
  totalCycles: number;
  remainingDays: number;
}

// 高亮样式
export interface HighlightStyle {
  top: number;
  left: number;
  height: number;
  width: number;
}

// 组件 Props（保留旧版兼容）
export interface CreateMainlineTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

// 新版组件 Props - 不需要 onSubmit，内部处理
export interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  /** AI 预填数据（来自 general 角色的 TASK_CONFIG 输出） */
  initialData?: {
    title?: string;
    category?: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
    totalDays?: number;
    cycleDays?: number;
    numericConfig?: {
      direction: 'INCREASE' | 'DECREASE';
      unit: string;
      startValue: number;
      targetValue: number;
    };
    checklistItems?: string[];
    checkInConfig?: {
      unit: 'TIMES' | 'DURATION' | 'QUANTITY';
      dailyMax?: number;
      valueUnit?: string;
    };
  };
}

// 周期步骤 Props
export interface CycleStepProps {
  totalDays: number;
  setTotalDays: (days: number) => void;
  cycleDays: number;
  setCycleDays: (days: number) => void;
  customDays: string;
  setCustomDays: (days: string) => void;
  isCustom: boolean;
  setIsCustom: (isCustom: boolean) => void;
  customCycleDays: string;
  setCustomCycleDays: (days: string) => void;
  isCustomCycle: boolean;
  setIsCustomCycle: (isCustom: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  cycleInfo: CycleInfo;
}

// 类型步骤 Props
export interface TypeStepProps {
  selectedType: MainlineTaskType | null;
  setSelectedType: (type: MainlineTaskType) => void;
}

// 配置步骤 Props
export interface ConfigStepProps {
  selectedType: MainlineTaskType;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  cycleInfo: CycleInfo;
  cycleDays: number;
  totalDays: number;
  // 数值型配置
  numericDirection: NumericDirection;
  setNumericDirection: (direction: NumericDirection) => void;
  numericUnit: string;
  setNumericUnit: (unit: string) => void;
  startValue: string;
  setStartValue: (value: string) => void;
  targetValue: string;
  setTargetValue: (value: string) => void;
  // 清单型配置
  totalItems: string;
  setTotalItems: (items: string) => void;
  checklistItems: string[];
  setChecklistItems: (items: string[]) => void;
  // 打卡型配置
  checkInUnit: CheckInUnit;
  setCheckInUnit: (unit: CheckInUnit) => void;
  allowMultiple: boolean;
  setAllowMultiple: (allow: boolean) => void;
  weekendExempt: boolean;
  setWeekendExempt: (exempt: boolean) => void;
  dailyMaxTimes: string;
  setDailyMaxTimes: (times: string) => void;
  cycleTargetTimes: string;
  setCycleTargetTimes: (times: string) => void;
  dailyTargetMinutes: string;
  setDailyTargetMinutes: (minutes: string) => void;
  cycleTargetMinutes: string;
  setCycleTargetMinutes: (minutes: string) => void;
  dailyTargetValue: string;
  setDailyTargetValue: (value: string) => void;
  cycleTargetValue: string;
  setCycleTargetValue: (value: string) => void;
  valueUnit: string;
  setValueUnit: (unit: string) => void;
}

