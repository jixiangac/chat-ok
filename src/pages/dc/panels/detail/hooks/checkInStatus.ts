/**
 * 今日打卡状态工具
 *
 * 注意：此模块现在使用统一的 todayProgressCalculator 进行计算
 * 保留此文件是为了向后兼容，新代码应直接使用 todayProgressCalculator
 */

// 从统一的今日进度计算器重新导出
export { getTodayCheckInStatusForTask } from '../../../utils/todayProgressCalculator';

// 保留 getSimulatedToday 的重新导出以供其他模块使用
export { getSimulatedToday } from './dateUtils';

