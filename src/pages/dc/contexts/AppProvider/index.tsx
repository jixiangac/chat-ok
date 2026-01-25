/**
 * AppProvider - 系统基础配置管理
 * 管理主题配色、消息推送、系统偏好、日期检测等
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { AppConfig, AppContextValue, ThemeKey, NotificationConfig, PreferencesConfig, DateChangeInfo } from './types';
import { themePresets, defaultAppConfig } from './types';
import { loadAppConfig, saveAppConfig, applyThemeCSSVariables, clearAppConfig } from './storage';
import {
  getCurrentDate,
  getTestDate,
  setTestDate as setTestDateStorage,
  clearTestDate as clearTestDateStorage,
  checkDateChange,
  setLastVisitedDate,
} from '../../utils/dateTracker';

// 创建 Context
const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

// 日期变更事件名称
export const DATE_CHANGE_EVENT = 'system-date-changed';

export function AppProvider({ children }: AppProviderProps) {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [systemDate, setSystemDate] = useState<string>(getCurrentDate());
  const [testDate, setTestDateState] = useState<string | null>(getTestDate());
  
  // 用于防抖的 ref
  const checkDateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化时从 localStorage 加载配置
  useEffect(() => {
    const loadedConfig = loadAppConfig();
    setConfig(loadedConfig);
    applyThemeCSSVariables(loadedConfig.theme.currentTheme);
    
    // 初始化时检查日期变更
    const dateChange = checkDateChange();
    if (dateChange) {
      console.log('[AppProvider] 检测到日期变更:', dateChange);
      // 触发日期变更事件
      window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
    }
  }, []);

  // 监听 visibilitychange 事件
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 使用防抖避免频繁检测
        if (checkDateTimeoutRef.current) {
          clearTimeout(checkDateTimeoutRef.current);
        }
        checkDateTimeoutRef.current = setTimeout(() => {
          const dateChange = checkDateChange();
          if (dateChange) {
            console.log('[AppProvider] visibilitychange 检测到日期变更:', dateChange);
            setSystemDate(dateChange.newDate);
            window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
          }
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (checkDateTimeoutRef.current) {
        clearTimeout(checkDateTimeoutRef.current);
      }
    };
  }, []);

  // 监听 online 事件
  useEffect(() => {
    const handleOnline = () => {
      const dateChange = checkDateChange();
      if (dateChange) {
        console.log('[AppProvider] online 检测到日期变更:', dateChange);
        setSystemDate(dateChange.newDate);
        window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
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

  // 设置测试日期
  const setTestDate = useCallback((date: string): boolean => {
    const success = setTestDateStorage(date);
    if (success) {
      setTestDateState(date);
      setSystemDate(date);
    }
    return success;
  }, []);

  // 清除测试日期
  const clearTestDate = useCallback(() => {
    const oldDate = testDate || systemDate;
    clearTestDateStorage();
    setTestDateState(null);
    const newDate = getCurrentDate();
    setSystemDate(newDate);

    // 触发日期变更事件，让所有监听器知道日期已恢复
    const dateChange: DateChangeInfo = {
      oldDate,
      newDate,
      daysDiff: 0, // 简化处理
    };
    window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
  }, [testDate, systemDate]);

  // 检查日期变更
  const checkDate = useCallback((): DateChangeInfo | null => {
    const dateChange = checkDateChange();
    if (dateChange) {
      setSystemDate(dateChange.newDate);
    }
    return dateChange;
  }, []);

  // 手动触发日期变更事件
  const triggerDateChange = useCallback(() => {
    const currentDate = getCurrentDate();
    const lastDate = systemDate;
    
    if (currentDate !== lastDate) {
      const dateChange: DateChangeInfo = {
        oldDate: lastDate,
        newDate: currentDate,
        daysDiff: 1, // 简化处理
      };
      setSystemDate(currentDate);
      setLastVisitedDate(currentDate);
      window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
    } else {
      // 即使日期相同，也触发事件（用于测试）
      const dateChange: DateChangeInfo = {
        oldDate: lastDate,
        newDate: currentDate,
        daysDiff: 0,
      };
      window.dispatchEvent(new CustomEvent(DATE_CHANGE_EVENT, { detail: dateChange }));
    }
  }, [systemDate]);

  const value: AppContextValue = {
    config,
    currentTheme: config.theme.currentTheme,
    themeColors: themePresets[config.theme.currentTheme],
    setTheme,
    updateNotification,
    updatePreferences,
    updateConfig,
    resetConfig,
    // 日期相关
    systemDate,
    testDate,
    setTestDate,
    clearTestDate,
    checkDate,
    triggerDateChange,
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
