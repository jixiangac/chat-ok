/**
 * DC 模块 Context 统一导出
 * 
 * Provider 层级关系：
 * AppProvider (系统配置)
 *   └─ WorldProvider (世界数据)
 *       └─ UserProvider (用户信息)
 *           └─ SceneProvider (场景数据)
 *               └─ TaskProvider (任务操作)
 *                   └─ UIProvider (UI状态)
 */

// ========== AppProvider ==========
export { AppProvider, useApp, useTheme, themePresets, AppProvider as ThemeProvider } from './AppProvider';
export type { ThemeKey, AppConfig, NotificationConfig, PreferencesConfig } from './AppProvider';

// ========== WorldProvider ==========
export { WorldProvider, useWorld } from './WorldProvider';
export type { WorldData, Promotion, Activity, Announcement } from './WorldProvider';

// ========== UserProvider ==========
export { UserProvider, useUser } from './UserProvider';
export type { 
  UserData, 
  UserProfile, 
  UserLevel, 
  TodayMustComplete, 
  DailyChecklist, 
  UserStats 
} from './UserProvider';

// ========== SceneProvider ==========
export { SceneProvider, useScene } from './SceneProvider';
export type { SceneType, SceneData, NormalSceneAccess, TabConfig } from './SceneProvider/types';

// ========== TaskProvider ==========
export { TaskProvider, useTaskContext } from './TaskProvider';
export type { TaskContextValue, HistoryRecord, CycleInfo } from './TaskProvider';

// ========== UIProvider ==========
export { UIProvider, useUI, UI_KEYS } from './UIProvider';
export { 
  useActiveTab, 
  useModal, 
  useSettingsModal, 
  useArchiveModal, 
  useScrollPosition, 
  useViewMode, 
  useAddTrigger,
  useTodayMustCompleteModal,
  useUIState 
} from './UIProvider/hooks';
export type { UIContextValue, UIKey } from './UIProvider';
export type { TabKey, ViewMode } from './UIProvider/hooks';

// ========== 兼容旧版导出 ==========
// 保持与旧版 API 的兼容性

// 旧版 ThemeContext 兼容
export { themePresets as themePresetsLegacy } from './AppProvider';

// 旧版 UIStateContext 兼容
export { useUIState as useUIStateLegacy } from './UIProvider/hooks';



