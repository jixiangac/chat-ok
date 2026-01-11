/**
 * Detail 面板工具函数
 */

import type { MainlineTaskType } from '../../../types';
import { TAB_KEYS } from '../constants';

// 格式化大数字（如 1000000 -> 100W）
export const formatLargeNumber = (num: number): string => {
  if (num >= 10000) {
    const wan = num / 10000;
    return wan % 1 === 0 ? `${wan}W` : `${wan.toFixed(1)}W`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
};

// 千分位格式化
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 根据任务类型获取Tab配置
export const getTabsConfig = (mainlineType: MainlineTaskType, isPlanEnded = false) => {
  // 当计划结束时，第一个Tab改为"完结总结"
  const firstTabLabel = isPlanEnded ? '完结总结' : '周期目标';
  
  switch (mainlineType) {
    case 'NUMERIC':
      return [
        { key: TAB_KEYS.TARGETS, label: firstTabLabel },
        { key: TAB_KEYS.RECORDS, label: '变动记录' },
        { key: TAB_KEYS.HISTORY, label: '周期计划' },
      ];
    case 'CHECKLIST':
      return [
        { key: TAB_KEYS.CURRENT, label: firstTabLabel },
        { key: TAB_KEYS.ALL, label: '全部清单' }
      ];
    case 'CHECK_IN':
    default:
      return [
        { key: TAB_KEYS.CYCLE, label: firstTabLabel },
        { key: TAB_KEYS.CALENDAR, label: '变动记录' },
        { key: TAB_KEYS.HISTORY, label: '周期计划' },
      ];
  }
};

// 获取默认Tab
export const getDefaultTab = (mainlineType: MainlineTaskType): string => {
  switch (mainlineType) {
    case 'NUMERIC': return TAB_KEYS.TARGETS;
    case 'CHECKLIST': return TAB_KEYS.CURRENT;
    default: return TAB_KEYS.CYCLE;
  }
};

// 判断是否为周期目标Tab
export const isCycleTab = (tab: string): boolean => {
  return tab === TAB_KEYS.TARGETS || tab === TAB_KEYS.CURRENT || tab === TAB_KEYS.CYCLE;
};
