/**
 * UIProvider 便捷 Hooks
 * 提供常用 UI 状态的快捷访问
 */

import { useCallback, useMemo } from 'react';
import { useUI } from './index';
import { UI_KEYS } from './keys';

// Tab 类型定义
export type TabKey = 'home' | 'normal' | 'vacation' | 'memorial';

// 视图模式类型
export type ViewMode = 'default' | 'group';

/**
 * Tab 管理 Hook
 */
export function useActiveTab(defaultTab: TabKey = 'normal') {
  const ui = useUI();
  
  const activeTab = useMemo(() => {
    return ui.get<TabKey>(UI_KEYS.ACTIVE_TAB, defaultTab) || defaultTab;
  }, [ui, defaultTab]);
  
  const setActiveTab = useCallback((tab: TabKey) => {
    ui.set(UI_KEYS.ACTIVE_TAB, tab);
    // 记录历史
    const history = ui.get<TabKey[]>(UI_KEYS.TAB_HISTORY, []) || [];
    ui.set(UI_KEYS.TAB_HISTORY, [...history, tab].slice(-10));
  }, [ui]);
  
  return { activeTab, setActiveTab };
}

/**
 * 弹窗管理 Hook
 */
export function useModal(modalKey: string) {
  const ui = useUI();
  
  const visible = useMemo(() => {
    return ui.get<boolean>(modalKey, false) || false;
  }, [ui, modalKey]);
  
  const open = useCallback(() => ui.set(modalKey, true), [ui, modalKey]);
  const close = useCallback(() => ui.set(modalKey, false), [ui, modalKey]);
  const toggle = useCallback(() => ui.set(modalKey, !visible), [ui, modalKey, visible]);
  
  return { visible, open, close, toggle };
}

/**
 * 设置弹窗 Hook
 */
export function useSettingsModal() {
  return useModal(UI_KEYS.MODAL_SETTINGS);
}

/**
 * 归档弹窗 Hook
 */
export function useArchiveModal() {
  return useModal(UI_KEYS.MODAL_ARCHIVE);
}

/**
 * 今日必完成弹窗 Hook
 */
export function useTodayMustCompleteModal() {
  return useModal(UI_KEYS.MODAL_TODAY_MUST_COMPLETE_VISIBLE);
}

/**
 * 滚动位置管理 Hook
 */
export function useScrollPosition(key: string) {
  const ui = useUI();
  
  const position = useMemo(() => {
    return ui.get<number>(key, 0) || 0;
  }, [ui, key]);
  
  const savePosition = useCallback((pos: number) => {
    ui.set(key, pos);
  }, [ui, key]);
  
  return { position, savePosition };
}

/**
 * 视图模式管理 Hook
 */
export function useViewMode(scene?: string) {
  const ui = useUI();
  const key = scene ? `viewMode.${scene}` : UI_KEYS.VIEW_MODE;
  
  const viewMode = useMemo(() => {
    return ui.get<ViewMode>(key, 'default') || 'default';
  }, [ui, key]);
  
  const setViewMode = useCallback((mode: ViewMode) => {
    ui.set(key, mode);
  }, [ui, key]);
  
  return { viewMode, setViewMode };
}

/**
 * 添加触发器 Hook（用于触发添加操作）
 */
export function useAddTrigger() {
  const ui = useUI();
  
  const addTrigger = useMemo(() => {
    return ui.get<number>(UI_KEYS.ADD_TRIGGER, 0) || 0;
  }, [ui]);
  
  const triggerAdd = useCallback(() => {
    ui.set(UI_KEYS.ADD_TRIGGER, addTrigger + 1);
  }, [ui, addTrigger]);
  
  return { addTrigger, triggerAdd };
}

/**
 * 兼容旧版 UIState Hook
 * 提供与旧版 UIStateContext 相同的接口
 */
export function useUIState() {
  const { activeTab, setActiveTab } = useActiveTab();
  const { visible: showSettings, open: openSettings, close: closeSettings } = useSettingsModal();
  const { visible: showArchive, open: openArchive, close: closeArchive } = useArchiveModal();
  const { visible: showTodayMustCompleteModal, open: openTodayMustCompleteModal, close: closeTodayMustCompleteModal } = useTodayMustCompleteModal();
  const { addTrigger, triggerAdd } = useAddTrigger();
  const ui = useUI();
  
  return {
    // 状态
    activeTab,
    showSettings,
    showArchive,
    showTodayMustCompleteModal,
    addTrigger,
    
    // 操作方法
    setActiveTab,
    setShowSettings: (show: boolean) => ui.set(UI_KEYS.MODAL_SETTINGS, show),
    setShowArchive: (show: boolean) => ui.set(UI_KEYS.MODAL_ARCHIVE, show),
    triggerAdd,
    
    // 便捷方法
    openSettings,
    closeSettings,
    openArchive,
    closeArchive,
    openTodayMustCompleteModal,
    closeTodayMustCompleteModal,
  };
}

