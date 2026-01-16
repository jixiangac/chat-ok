import { Target, TrendingUp, Tent, Trophy, BarChart3, ClipboardList, CheckCircle } from 'lucide-react';
import type { MainlineTaskType } from '../../types';

// 总时长选项
export const TOTAL_DURATION_OPTIONS = [
  { label: '1个月', value: 30, Icon: Target },
  { label: '3个月', value: 90, Icon: TrendingUp },
  { label: '半年', value: 180, Icon: Tent },
  { label: '1年', value: 365, Icon: Trophy },
];

// 周期长度选项
export const CYCLE_LENGTH_OPTIONS = [
  { label: '10天', value: 10, description: '小步快跑' },
  { label: '15天', value: 15, description: '张弛有度' },
  { label: '30天', value: 30, description: '稳扎稳打' },
];

// 任务类型选项
export const TASK_TYPE_OPTIONS: Array<{
  type: MainlineTaskType;
  Icon: typeof BarChart3;
  label: string;
  description: string;
  examples: string;
  feature: string;
}> = [
  {
    type: 'NUMERIC',
    Icon: BarChart3,
    label: '数值型任务',
    description: '适合有明确数值目标',
    examples: '例如：减重、存钱、阅读',
    feature: '特点：松散打卡，记录数值'
  },
  {
    type: 'CHECKLIST',
    Icon: ClipboardList,
    label: '清单型任务',
    description: '适合完成一系列事项',
    examples: '例如：读书计划、技能树',
    feature: '特点：清单管理，逐项完成'
  },
  {
    type: 'CHECK_IN',
    Icon: CheckCircle,
    label: '打卡型任务',
    description: '适合养成每日习惯',
    examples: '例如：背单词、运动打卡',
    feature: '特点：每日打卡，强调连续'
  }
];

// 打卡类型选项
export const CHECK_IN_TYPE_OPTIONS = [
  { value: 'TIMES' as const, label: '次数型', desc: '记录打卡次数' },
  { value: 'DURATION' as const, label: '时长型', desc: '记录时长' },
  { value: 'QUANTITY' as const, label: '数值型', desc: '记录数值' }
];

// 增减方向选项
export const DIRECTION_OPTIONS = [
  { value: 'INCREASE' as const, label: '增加' },
  { value: 'DECREASE' as const, label: '减少' }
];
