/**
 * 页面栈管理 Hook
 * 用于在设置面板内实现多级页面导航
 */

import { useState, useCallback, useMemo } from 'react';

export interface PageStackItem {
  id: string;
  title: string;
  props?: Record<string, unknown>;
}

export interface UsePageStackReturn {
  /** 当前页面 */
  currentPage: PageStackItem;
  /** 页面栈 */
  stack: PageStackItem[];
  /** 是否可以返回 */
  canGoBack: boolean;
  /** 推入新页面 */
  push: (page: PageStackItem) => void;
  /** 返回上一页 */
  pop: () => void;
  /** 替换当前页面 */
  replace: (page: PageStackItem) => void;
  /** 重置到主页面 */
  reset: () => void;
  /** 当前页面索引 */
  currentIndex: number;
}

const MAIN_PAGE: PageStackItem = {
  id: 'main',
  title: '设置',
};

export function usePageStack(initialPage: PageStackItem = MAIN_PAGE): UsePageStackReturn {
  const [stack, setStack] = useState<PageStackItem[]>([initialPage]);

  const currentPage = useMemo(() => stack[stack.length - 1], [stack]);
  const currentIndex = stack.length - 1;
  const canGoBack = stack.length > 1;

  const push = useCallback((page: PageStackItem) => {
    setStack(prev => [...prev, page]);
  }, []);

  const pop = useCallback(() => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const replace = useCallback((page: PageStackItem) => {
    setStack(prev => [...prev.slice(0, -1), page]);
  }, []);

  const reset = useCallback(() => {
    setStack([initialPage]);
  }, [initialPage]);

  return {
    currentPage,
    stack,
    canGoBack,
    push,
    pop,
    replace,
    reset,
    currentIndex,
  };
}

export default usePageStack;
