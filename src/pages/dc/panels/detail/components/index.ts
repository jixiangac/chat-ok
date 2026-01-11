/**
 * Detail 面板组件导出
 * 
 * 组件分类：
 * 1. 头部组件 - GoalHeader
 * 2. 周期面板组件 - NumericCyclePanel, CheckInCyclePanel, ChecklistCyclePanel
 * 3. 历史面板组件 - HistoryRecordPanel, HistoryCyclePanel, CalendarViewPanel, CheckInRecordPanel, CheckInHistoryPanel
 * 4. 弹窗组件 - RecordDataModal, CheckInModal, CycleSummaryDialog
 * 5. 其他组件 - ProgressSection, TabBar, CurrentCyclePanel
 */

// 头部组件
export { GoalHeader } from './GoalHeader';

// 周期面板组件
export { NumericCyclePanel } from './NumericCyclePanel';
export { default as CheckInCyclePanel } from './CheckInCyclePanel';
export { default as ChecklistCyclePanel } from './ChecklistCyclePanel';

// 历史面板组件
export { default as HistoryRecordPanel } from './HistoryRecordPanel';
export { default as HistoryCyclePanel } from './HistoryCyclePanel';
export { default as CalendarViewPanel } from './CalendarViewPanel';
export { default as CheckInRecordPanel } from './CheckInRecordPanel';
export { default as CheckInHistoryPanel } from './CheckInHistoryPanel';

// 弹窗组件
export { default as RecordDataModal } from './RecordDataModal';
export { default as CheckInModal } from './CheckInModal';
export { showCycleSummaryDialog } from './CycleSummaryDialog';

// 其他组件
export { default as CurrentCyclePanel } from './CurrentCyclePanel';
export { default as ProgressSection } from './ProgressSection';
export { default as TabBar } from './TabBar';
