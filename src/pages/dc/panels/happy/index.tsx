// 度假模式模块入口
import React from 'react';
import { VacationProvider } from './contexts';
import { VacationContent } from './components';

interface HappyPanelProps {
  onAddClick?: () => void;
}

/**
 * Happy Panel - 度假模式面板
 * 使用 VacationProvider 包装，提供全局状态管理
 */
const HappyPanel: React.FC<HappyPanelProps> = ({ onAddClick }) => {
  return (
    <VacationProvider>
      <VacationContent onAddClick={onAddClick} />
    </VacationProvider>
  );
};

export default HappyPanel;

// 导出子模块供外部使用
export * from './types';
export { VacationProvider, useVacation } from './contexts';
export type { CreateTripData, GoalData } from './contexts';
export { useTrips, useSchedule, useGoals, useTripNavigation } from './hooks';
export * from './utils';
export { DayTabs, GoalCard, TripList, VacationContent } from './components';
