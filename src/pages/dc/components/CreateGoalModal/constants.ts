import type { TaskType, Priority } from '../../types';

export const POPULAR_GOALS = ['每天进步一点点', '喝水', '吃早餐', '吃水果', '早起'];

export const ICONS = [
  '🐸', '🌱', '🛏️', '📚', '🥤', '🍓', '🥗',
  '⭐', '🛋️', '📖', '💿', '🥚', '😊', '🎮'
];

export const TOTAL_DURATION_OPTIONS = [
  { label: '1个月', value: 30, description: '短期冲刺', icon: '🎯' },
  { label: '3个月', value: 90, description: '季度目标', icon: '📈' },
  { label: '6个月', value: 180, description: '半年计划', icon: '🎪' },
  { label: '1年', value: 365, description: '年度目标', icon: '🏆' },
  { label: '自定义', value: 0, description: '自由设置', icon: '⚙️' }
];

export const CYCLE_LENGTH_OPTIONS = [
  { label: '7天', value: 7, description: '每周一循环', icon: '📅', tip: '适合高频目标' },
  { label: '10天', value: 10, description: '每旬一循环', icon: '📆', tip: '平衡频率' },
  { label: '15天', value: 15, description: '半月一循环', icon: '🗓️', tip: '适合低频目标' }
];

export const MIN_CHECK_INS_PER_CYCLE = 3;

export const TASK_TYPES: Array<{
  type: TaskType;
  label: string;
  description: string;
  subtitle: string;
  color: string;
  bgColor: string;
}> = [
  {
    type: 'mainline',
    label: '🔴 主线任务',
    description: '重要且紧急',
    subtitle: '同时只能1个，100%达成',
    color: '#ff4444',
    bgColor: '#fff5f5'
  },
  {
    type: 'sidelineA',
    label: '🟡 支线任务A',
    description: '重要但不紧急',
    subtitle: '可多个，长期培养',
    color: '#ffaa00',
    bgColor: '#fffbf0'
  },
  {
    type: 'sidelineB',
    label: '🟢 支线任务B',
    description: '紧急不重要/都不重要',
    subtitle: '可多个，灵活调整',
    color: '#44bb44',
    bgColor: '#f5fff5'
  }
];

export const PRIORITY_OPTIONS: Array<{
  value: Priority;
  label: string;
  color: string;
}> = [
  { value: 'high', label: '高', color: '#ff4444' },
  { value: 'medium', label: '中', color: '#ffaa00' },
  { value: 'low', label: '低', color: '#44bb44' }
];
