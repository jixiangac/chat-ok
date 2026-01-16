/**
 * AppProvider 存储逻辑
 */

import type { AppConfig, ThemeKey } from './types';
import { defaultAppConfig, themePresets } from './types';

const STORAGE_KEY = 'dc_app_config';

/**
 * 从 localStorage 加载配置
 */
export const loadAppConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合并默认配置，确保新增字段有默认值
      return {
        theme: { ...defaultAppConfig.theme, ...parsed.theme },
        notification: { ...defaultAppConfig.notification, ...parsed.notification },
        preferences: { ...defaultAppConfig.preferences, ...parsed.preferences },
      };
    }
    return defaultAppConfig;
  } catch (error) {
    console.error('Failed to load app config from localStorage:', error);
    return defaultAppConfig;
  }
};

/**
 * 保存配置到 localStorage
 */
export const saveAppConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save app config to localStorage:', error);
  }
};

/**
 * 应用主题 CSS 变量到 document
 */
export const applyThemeCSSVariables = (theme: ThemeKey): void => {
  const colors = themePresets[theme];
  if (colors) {
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-primary-hover', colors.primaryHover);
  }
};

/**
 * 清除配置
 */
export const clearAppConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear app config from localStorage:', error);
  }
};
