/**
 * AppProvider 类型定义
 * 管理系统基础配置：主题、推送、偏好设置
 */

// 主题预设
export const themePresets = {
  default: {
    name: '默认黑色',
    primary: '#000000',
    primaryHover: '#333333',
  },
  green: {
    name: '森林绿',
    primary: '#8CB369',
    primaryHover: '#7AA35A',
  },
  yellow: {
    name: '柠檬黄',
    primary: '#F4E285',
    primaryHover: '#E5D376',
  },
  darkGreen: {
    name: '墨绿色',
    primary: '#5B8C5A',
    primaryHover: '#4A7B49',
  },
  blue: {
    name: '天空蓝',
    primary: '#5B9BD5',
    primaryHover: '#4A8AC4',
  },
  purple: {
    name: '薰衣草',
    primary: '#9B8EC4',
    primaryHover: '#8A7DB3',
  },
  coral: {
    name: '珊瑚橙',
    primary: '#F08080',
    primaryHover: '#E07070',
  },
} as const;

// 主题颜色类型
export interface ThemeColors {
  name: string;
  primary: string;
  primaryHover: string;
}

export type ThemeKey = keyof typeof themePresets;

// 主题配置
export interface ThemeConfig {
  currentTheme: ThemeKey;
  customColors?: Record<string, string>;
}

// 推送配置
export interface NotificationConfig {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // "HH:mm" 格式
  cycleEndAlert: boolean;
  achievementAlert: boolean;
}

// 系统偏好
export interface PreferencesConfig {
  language: 'zh-CN' | 'en-US';
  firstDayOfWeek: 0 | 1; // 0=周日, 1=周一
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
}

// 完整的应用配置
export interface AppConfig {
  theme: ThemeConfig;
  notification: NotificationConfig;
  preferences: PreferencesConfig;
}

// 默认配置
export const defaultAppConfig: AppConfig = {
  theme: {
    currentTheme: 'default',
  },
  notification: {
    enabled: true,
    dailyReminder: false,
    reminderTime: '09:00',
    cycleEndAlert: true,
    achievementAlert: true,
  },
  preferences: {
    language: 'zh-CN',
    firstDayOfWeek: 1,
    dateFormat: 'YYYY-MM-DD',
  },
};

// Context 值类型
export interface AppContextValue {
  // 配置数据
  config: AppConfig;
  
  // 主题相关
  currentTheme: ThemeKey;
  themeColors: ThemeColors;
  setTheme: (theme: ThemeKey) => void;
  
  // 推送相关
  updateNotification: (config: Partial<NotificationConfig>) => void;
  
  // 偏好相关
  updatePreferences: (prefs: Partial<PreferencesConfig>) => void;
  
  // 完整配置更新
  updateConfig: (config: Partial<AppConfig>) => void;
  resetConfig: () => void;
}

