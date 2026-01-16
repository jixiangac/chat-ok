/**
 * 详情页辅助函数
 * 注意：useGoalDetail 的功能已合并到 TaskProvider 中
 * 这里只保留必要的工具函数导出
 */

// 从拆分的模块导入并重新导出
export { 
  formatLocalDate, 
  getSimulatedToday, 
  getSimulatedTodayDate, 
  getCurrentCycle 
} from './hooks/dateUtils';

export { getTodayCheckInStatusForTask } from './hooks/checkInStatus';

export { getRandomColorScheme, DEBT_COLOR_SCHEMES } from './hooks/constants';
