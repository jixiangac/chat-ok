/**
 * UIProvider - UI 状态 KV 存储
 * 提供通用的 key-value 存储接口，自动持久化到 localStorage
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UIContextValue } from './types';

const STORAGE_KEY = 'dc_ui_state';

// 从 localStorage 加载
const loadUIState = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load UI state:', error);
    return {};
  }
};

// 保存到 localStorage
const saveUIState = (state: Record<string, any>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save UI state:', error);
  }
};

// 创建 Context
const UIContext = createContext<UIContextValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [state, setState] = useState<Record<string, any>>(loadUIState);

  // 获取值
  const get = useCallback(<T = any>(key: string, defaultValue?: T): T | undefined => {
    return state[key] !== undefined ? state[key] : defaultValue;
  }, [state]);

  // 设置值
  const set = useCallback(<T = any>(key: string, value: T) => {
    setState(prev => {
      const newState = { ...prev, [key]: value };
      saveUIState(newState);
      return newState;
    });
  }, []);

  // 删除值
  const remove = useCallback((key: string) => {
    setState(prev => {
      const newState = { ...prev };
      delete newState[key];
      saveUIState(newState);
      return newState;
    });
  }, []);

  // 清空所有
  const clear = useCallback(() => {
    setState({});
    saveUIState({});
  }, []);

  // 批量获取
  const getMultiple = useCallback((keys: string[]) => {
    return keys.reduce((acc, key) => {
      acc[key] = state[key];
      return acc;
    }, {} as Record<string, any>);
  }, [state]);

  // 批量设置
  const setMultiple = useCallback((entries: Record<string, any>) => {
    setState(prev => {
      const newState = { ...prev, ...entries };
      saveUIState(newState);
      return newState;
    });
  }, []);

  // 检查是否存在
  const has = useCallback((key: string) => {
    return key in state;
  }, [state]);

  // 获取所有 key
  const getAllKeys = useCallback(() => {
    return Object.keys(state);
  }, [state]);

  const value: UIContextValue = {
    get,
    set,
    remove,
    clear,
    getMultiple,
    setMultiple,
    has,
    keys: getAllKeys,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

/**
 * 使用 UI 状态的 Hook
 */
export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

// 导出类型和常量
export { UI_KEYS } from './keys';
export type { UIContextValue } from './types';
export type { UIKey } from './keys';
