/**
 * AppProvider - 系统基础配置管理
 * 管理主题配色、消息推送、系统偏好等
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppConfig, AppContextValue, ThemeKey, NotificationConfig, PreferencesConfig } from './types';
import { themePresets, defaultAppConfig } from './types';
import { loadAppConfig, saveAppConfig, applyThemeCSSVariables, clearAppConfig } from './storage';

// 创建 Context
const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);

  // 初始化时从 localStorage 加载配置
  useEffect(() => {
    const loadedConfig = loadAppConfig();
    setConfig(loadedConfig);
    applyThemeCSSVariables(loadedConfig.theme.currentTheme);
  }, []);

  // 设置主题
  const setTheme = useCallback((theme: ThemeKey) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        theme: { ...prev.theme, currentTheme: theme },
      };
      saveAppConfig(newConfig);
      applyThemeCSSVariables(theme);
      return newConfig;
    });
  }, []);

  // 更新推送配置
  const updateNotification = useCallback((notification: Partial<NotificationConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        notification: { ...prev.notification, ...notification },
      };
      saveAppConfig(newConfig);
      return newConfig;
    });
  }, []);

  // 更新偏好配置
  const updatePreferences = useCallback((preferences: Partial<PreferencesConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
      };
      saveAppConfig(newConfig);
      return newConfig;
    });
  }, []);

  // 更新完整配置
  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        ...updates,
        theme: updates.theme ? { ...prev.theme, ...updates.theme } : prev.theme,
        notification: updates.notification ? { ...prev.notification, ...updates.notification } : prev.notification,
        preferences: updates.preferences ? { ...prev.preferences, ...updates.preferences } : prev.preferences,
      };
      saveAppConfig(newConfig);
      if (updates.theme?.currentTheme) {
        applyThemeCSSVariables(updates.theme.currentTheme);
      }
      return newConfig;
    });
  }, []);

  // 重置配置
  const resetConfig = useCallback(() => {
    clearAppConfig();
    setConfig(defaultAppConfig);
    applyThemeCSSVariables(defaultAppConfig.theme.currentTheme);
  }, []);

  const value: AppContextValue = {
    config,
    currentTheme: config.theme.currentTheme,
    themeColors: themePresets[config.theme.currentTheme],
    setTheme,
    updateNotification,
    updatePreferences,
    updateConfig,
    resetConfig,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * 使用 App 配置的 Hook
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/**
 * 使用主题的 Hook（兼容旧版 useTheme）
 */
export function useTheme() {
  const { currentTheme, themeColors, setTheme } = useApp();
  return { currentTheme, themeColors, setTheme };
}

// 导出类型和常量
export { themePresets } from './types';
export type { ThemeKey, AppConfig, NotificationConfig, PreferencesConfig } from './types';
