import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const STORAGE_KEY = 'dc_theme';

// 预设主题配色方案
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
};

export type ThemeKey = keyof typeof themePresets;

interface ThemeContextValue {
  currentTheme: ThemeKey;
  themeColors: typeof themePresets.default;
  setTheme: (theme: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// 从 localStorage 读取主题
const loadThemeFromStorage = (): ThemeKey => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in themePresets) {
      return stored as ThemeKey;
    }
    return 'default';
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return 'default';
  }
};

// 保存主题到 localStorage
const saveThemeToStorage = (theme: ThemeKey) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('default');

  // 初始化时从 localStorage 加载主题
  useEffect(() => {
    const loadedTheme = loadThemeFromStorage();
    setCurrentTheme(loadedTheme);
  }, []);

  const setTheme = useCallback((theme: ThemeKey) => {
    setCurrentTheme(theme);
    saveThemeToStorage(theme);
  }, []);

  const value: ThemeContextValue = {
    currentTheme,
    themeColors: themePresets[currentTheme],
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
