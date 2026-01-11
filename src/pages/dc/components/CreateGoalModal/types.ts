import type { GoalData, TaskType, Priority } from '../../types';

export interface CreateGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goal: GoalData) => void;
  existingMainlineGoal?: boolean;
  localStorageKey?: string;
}

export interface CycleInfo {
  totalCycles: number;
  totalCheckInsNeeded: number;
  averageCheckInsPerWeek: number;
  remainingDays: number;
}

export interface ConfigValidation {
  valid: boolean;
  message?: string;
}

export interface FormState {
  goalTitle: string;
  encouragement: string;
  selectedIcon: string;
  startDate: string;
  taskType: TaskType;
  priority: Priority;
  totalDays: number;
  cycleDays: number;
  isCustomDuration: boolean;
  customDaysInput: string;
  showWarning: boolean;
  hasMainlineGoal: boolean;
}
