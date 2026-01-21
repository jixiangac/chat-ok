/**
 * CreateTaskModal 状态类型定义
 * 用于新版全屏横移模式
 */

import type { Category, NumericDirection, CheckInUnit } from '../../types';

/**
 * CreateTaskModal 统一状态
 */
export interface CreateTaskModalState {
  // 周期设置
  totalDays: number;
  cycleDays: number;
  startDate: string;

  // 类型选择
  selectedType: Category | null;

  // 任务配置 - 通用
  taskTitle: string;

  // 数值型配置
  numericDirection: NumericDirection;
  numericUnit: string;
  startValue: string;
  targetValue: string;

  // 清单型配置
  totalItems: string;
  checklistItems: string[];

  // 打卡型配置
  checkInUnit: CheckInUnit;
  allowMultiple: boolean;
  weekendExempt: boolean;
  dailyMaxTimes: string;
  cycleTargetTimes: string;
  dailyTargetMinutes: string;
  cycleTargetMinutes: string;
  dailyTargetValue: string;
  cycleTargetValue: string;
  valueUnit: string;
}

/**
 * 初始状态工厂函数
 */
export const createInitialState = (startDate: string): CreateTaskModalState => ({
  // 周期设置
  totalDays: 90,
  cycleDays: 10,
  startDate,

  // 类型选择
  selectedType: null,

  // 任务配置 - 通用
  taskTitle: '',

  // 数值型配置
  numericDirection: 'DECREASE',
  numericUnit: '斤',
  startValue: '',
  targetValue: '',

  // 清单型配置
  totalItems: '10',
  checklistItems: ['', '', '', ''],

  // 打卡型配置
  checkInUnit: 'TIMES',
  allowMultiple: true,
  weekendExempt: false,
  dailyMaxTimes: '1',
  cycleTargetTimes: '',
  dailyTargetMinutes: '15',
  cycleTargetMinutes: '',
  dailyTargetValue: '',
  cycleTargetValue: '',
  valueUnit: '个',
});
