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
  formatDisplayNumber,
  getEffectiveMainlineType,
  calculateNumericProgress as calculateNumericProgressV2,
  calculateChecklistProgress as calculateChecklistProgressV2,
  calculateCheckInProgress as calculateCheckInProgressV2,
  type NumericProgressResult,
  type CheckInProgressResult
} from './progressCalculator';

// 进度计算器类
export { ProgressCalculator, getEffectiveCategory } from './progressCalculator';

// 数据迁移工具
export {
  TaskMigration,
  createTask,
  default as MigrationTool
} from './migration';

// 响应式工具函数
export {
  LAYOUT_CONSTANTS,
  calculateVisibleSidelineTasks,
  getScreenSize,
  isSmallScreen,
  isMobileDevice,
  getSafeAreaInsets,
  calculateModalMaxHeight,
  calculateGridColumns,
  prefersReducedMotion,
  type ScreenSize
} from './responsive';

// 标签存储工具
export {
  TAG_COLORS,
  loadTagsFromStorage,
  saveTagsToStorage,
  getNextTagColor,
  createTag,
  deleteTag,
  updateTag,
  getTagById,
  getAllTags
} from './tagStorage';

// 今日必须完成存储工具
export {
  getTodayDateString,
  loadTodayMustCompleteState,
  saveTodayMustCompleteState,
  createTodayState,
  shouldShowTodayMustCompleteModal,
  markModalShown,
  setTodayMustCompleteTasks,
  skipTodayMustComplete,
  getTodayMustCompleteTaskIds,
  isTaskTodayMustComplete,
  removeFromTodayMustComplete,
  hasTodayBeenSet,
  hasTodaySetTasks,
  canOpenModalForEdit,
  canOpenModalForView
} from './todayMustCompleteStorage';

// 开发者模式存储工具
export {
  getDeveloperMode,
  setDeveloperMode,
  getSavedLocationFilter,
  saveLocationFilter,
  exportAllTasks,
  exportSingleTask,
  importAllTasks,
  importSingleTask,
  copyToClipboard
} from './developerStorage';

// 数据导入导出工具
export {
  exportData,
  importData,
  exportToClipboard,
  getDataStats,
  clearData,
  repairTaskProgressData,
  migrateToNewFormat,
  DATA_TYPE_CONFIG,
  type DataType
} from './dataExportImport';

// 一日清单筛选和缓存工具
export {
  filterDailyViewTasks,
  filterDailyViewTasksEnhanced,
  isNearDeadline,
  hasDailyTargetTask,
  calculateFlexibleTaskLimit,
  selectFlexibleTasks
} from './dailyViewFilter';

export {
  getCachedDailyTaskIds,
  saveDailyTaskIdsCache,
  clearDailyViewCache,
  hasTodayRefreshed,
  markTodayRefreshed,
  clearRefreshStatus
} from './dailyViewCache';

// 归档存储工具
export {
  getArchivedTasks,
  saveArchivedTasks,
  archiveTask,
  restoreFromArchive,
  deleteArchivedTask,
  getArchiveStats,
  clearAllArchivedTasks,
  migrateOldArchivedTasks,
  type ArchivedTask
} from './archiveStorage';

// 日期追踪工具
export {
  getCurrentDate,
  getRealSystemDate,
  getLastVisitedDate,
  setLastVisitedDate,
  checkDateChange,
  getTestDate,
  setTestDate,
  clearTestDate,
  hasTestDate,
  forceCheckDateChange,
  type DateChangeInfo
} from './dateTracker';

// 每日数据重置工具
export {
  resetTodayProgress,
  shouldAdvanceCycle,
  calculateNewCycle,
  advanceTaskCycle,
  performDailyReset,
  needsProgressReset,
  type CycleUpdateInfo,
  type DailyResetResult
} from './dailyDataReset';

// 修仙等级体系工具
export {
  getLevelDisplayName,
  getCurrentExpCap,
  getCurrentLevelInfo,
  getNextLevel,
  getPreviousLevel,
  isCrossRealmDemotion,
  getSeclusionInfo,
  getLevelIndex,
  compareLevels,
  generateCultivationId,
  getWeekKey,
  formatExp,
  getRealmIconPath
} from './cultivation';

// 灵玉积分计算工具
export {
  calculateDailyPointsCap,
  distributeCheckInPoints,
  calculateCycleCompleteBonus,
  calculateDailyViewCompleteReward,
  calculateArchiveReward,
  mergeRewards,
  getTaskCheckInUnit
} from './spiritJadeCalculator';

// 周期完成奖励追踪
export {
  hasCycleRewardClaimed,
  markCycleRewardClaimed,
  getClaimedCycles,
  clearTaskCycleRewards,
  cleanExpiredCycleRewards
} from './cycleRewardStorage';

// 一日清单完成奖励追踪
export {
  hasTodayDailyCompleteRewardClaimed,
  markTodayDailyCompleteRewardClaimed,
  clearDailyCompleteReward
} from './dailyCompleteRewardStorage';

// 今日进度计算工具（统一的进度计算函数）
export {
  calculateTodayProgress,
  getTodayCheckInStatusForTask,
  getSimulatedToday,
  getTodayCheckIns,
  formatNumberPrecision,
  type TodayProgressResult,
  type TodayProgressOptions
} from './todayProgressCalculator';

// 打卡辅助工具
export {
  validateCheckIn,
  createCheckInEntry,
  updateCheckInRecords,
  calculateStreak,
  calculateCheckInCycleProgress,
  detectCycleCompletion,
  createCheckInActivity,
  getTodayCheckInsFromRecords,
  mergeCheckInProgressUpdate,
  type CheckInValidationResult,
  type StreakResult,
  type CheckInCycleProgressResult,
  type CycleCompletionResult
} from './checkInHelper';

// 数值记录辅助工具
export {
  calculateNumericTotalProgress,
  calculateNumericCycleProgress,
  calculateCompensationTarget,
  createDebtSnapshot,
  createValueUpdateActivity,
  calculateOriginalCycleTargetValue,
  hasReachedFinalTarget,
  calculateCycleTimeInfo,
  handleLegacyDebtSnapshot,
  getRandomColorScheme,
  type NumericTotalProgressResult,
  type NumericCycleProgressResult,
  type CompensationTargetResult,
  type DebtColorScheme
} from './numericRecordHelper';
