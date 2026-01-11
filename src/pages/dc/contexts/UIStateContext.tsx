/**
 * UI 状态管理 Context
 * 管理全局的 UI 状态，如 activeTab、弹窗显示状态等
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tab 类型定义
export type TabKey = 'home' | 'normal' | 'vacation' | 'memorial';

// UI 状态接口
interface UIState {
  activeTab: TabKey;
  showSettings: boolean;
  showArchive: boolean;
  addTrigger: number;
}

// Context 接口
interface UIStateContextType {
  // 状态
  activeTab: TabKey;
  showSettings: boolean;
  showArchive: boolean;
  addTrigger: number;
  
  // 操作方法
  setActiveTab: (tab: TabKey) => void;
  setShowSettings: (show: boolean) => void;
  setShowArchive: (show: boolean) => void;
  triggerAdd: () => void;
  
  // 便捷方法
  openSettings: () => void;
  closeSettings: () => void;
  openArchive: () => void;
  closeArchive: () => void;
}

// 创建 Context
const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

// Provider 组件
interface UIStateProviderProps {
  children: ReactNode;
  initialTab?: TabKey;
}

export function UIStateProvider({ children, initialTab = 'normal' }: UIStateProviderProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [showSettings, setShowSettings] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [addTrigger, setAddTrigger] = useState(0);

  // 便捷方法
  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);
  const openArchive = () => setShowArchive(true);
  const closeArchive = () => setShowArchive(false);
  const triggerAdd = () => setAddTrigger(prev => prev + 1);

  const value: UIStateContextType = {
    // 状态
    activeTab,
    showSettings,
    showArchive,
    addTrigger,
    
    // 操作方法
    setActiveTab,
    setShowSettings,
    setShowArchive,
    triggerAdd,
    
    // 便捷方法
    openSettings,
    closeSettings,
    openArchive,
    closeArchive,
  };

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}

// Hook
export function useUIState(): UIStateContextType {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}

export default UIStateContext;
