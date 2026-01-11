// 度假模式模块入口
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { VacationProvider } from './contexts';
import { VacationContent, VacationContentRef } from './components';

export interface HappyPanelRef {
  triggerAdd: () => void;
}

interface HappyPanelProps {
  onAddClick?: () => void;
}

/**
 * Happy Panel - 度假模式面板
 * 使用 VacationProvider 包装，提供全局状态管理
 */
const HappyPanel = forwardRef<HappyPanelRef, HappyPanelProps>(({ onAddClick }, ref) => {
  const contentRef = useRef<VacationContentRef>(null);

  useImperativeHandle(ref, () => ({
    triggerAdd: () => {
      contentRef.current?.triggerAdd();
    }
  }));

  return (
    <VacationProvider>
      <VacationContent ref={contentRef} onAddClick={onAddClick} />
    </VacationProvider>
  );
});

HappyPanel.displayName = 'HappyPanel';

export default HappyPanel;

// 导出子模块供外部使用
export * from './types';
export { VacationProvider, useVacation } from './contexts';
export type { CreateTripData, GoalData } from './contexts';
export { useTrips, useSchedule, useGoals, useTripNavigation } from './hooks';
export * from './utils';
export { DayTabs, GoalCard, TripList, VacationContent } from './components';

