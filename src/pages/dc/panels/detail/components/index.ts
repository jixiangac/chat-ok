/**
 * Detail 面板组件导出
 * 
 * 组件分类：
 * 1. 头部组件 - DetailHeader
 * 2. 进度可视化组件 - CoffeeCupProgress, WaterCupProgress, TodayProgressBar, DuckWaterProgress
 * 3. 周期面板组件 - NumericCyclePanel, CheckInCyclePanel, ChecklistCyclePanel
 * 4. 信息展示组件 - CycleInfo, SecondaryNav
 * 4.1 变动记录组件 - ActivityRecordPanel
 * 5. 历史面板组件 - HistoryRecordPanel, HistoryCyclePanel, CalendarViewPanel, CheckInRecordPanel, CheckInHistoryPanel
 * 6. 弹窗组件 - RecordDataModal, CheckInModal, CycleSummaryDialog
 * 7. 其他组件 - ProgressSection, TabBar
 */

// 头部组件
export { DetailHeader } from './DetailHeader';

// 进度可视化组件（新增）
export { default as CoffeeCupProgress } from './CoffeeCupProgress';
export { default as WaterCupProgress } from './WaterCupProgress';
export { default as TodayProgressBar } from './TodayProgressBar';

// 鸭子水波进度组件（从 components 目录导入）
export { DuckWaterProgress } from '../../../components/DuckWaterProgress';

// 信息展示组件（新增）
export { default as CycleInfo } from './CycleInfo';
export { default as SecondaryNav } from './SecondaryNav';

// 变动记录组件（新增）
export { default as ActivityRecordPanel } from './ActivityRecordPanel';

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
export { default as ProgressSection } from './ProgressSection';
export { default as TabBar } from './TabBar';




