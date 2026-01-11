export {
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  calculateRemainingDays,
  isTodayCheckedIn,
  updateMainlineTaskProgress,
  calculateCurrentCycleNumber
} from './mainlineTaskHelper';

export { CycleCalculator } from './cycleCalculator';

// 进度计算工具函数
export {
  formatLargeNumber,
  formatNumber,
  getEffectiveMainlineType,
  calculateNumericProgress as calculateNumericProgressV2,
  calculateChecklistProgress as calculateChecklistProgressV2,
  calculateCheckInProgress as calculateCheckInProgressV2,
  type NumericProgressResult,
  type CheckInProgressResult
} from './progressCalculator';
