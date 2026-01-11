/**
 * 纪念日数据管理 Hook - 性能优化版本
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Memorial, CreateMemorialInput, UpdateMemorialInput } from '../types';
import { loadMemorials, saveMemorials, generateId } from '../storage';

interface UseMemorialsReturn {
  memorials: Memorial[];
  loading: boolean;
  addMemorial: (data: CreateMemorialInput) => Memorial;
  updateMemorial: (id: string, data: UpdateMemorialInput) => void;
  deleteMemorial: (id: string) => void;
  togglePin: (id: string) => void;
  getMemorialById: (id: string) => Memorial | undefined;
  refresh: () => void;
}

/**
 * 排序纪念日列表
 * 1. 置顶优先（按置顶时间倒序）
 * 2. 非置顶按创建时间倒序
 */
function sortMemorials(memorials: Memorial[]): Memorial[] {
  return [...memorials].sort((a, b) => {
    // 置顶优先
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // 同为置顶，按置顶时间倒序
    if (a.isPinned && b.isPinned) {
      return (b.pinnedAt || 0) - (a.pinnedAt || 0);
    }

    // 非置顶，按创建时间倒序
    return b.createdAt - a.createdAt;
  });
}

/**
 * 防抖保存函数
 */
function useDebouncedSave(delay: number = 300) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback((data: Memorial[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // 使用 requestIdleCallback 在空闲时保存
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => saveMemorials(data), { timeout: 1000 });
      } else {
        saveMemorials(data);
      }
    }, delay);
  }, [delay]);

  // 清理
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
}

export function useMemorials(): UseMemorialsReturn {
  const [rawMemorials, setRawMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSave = useDebouncedSave();

  // 使用 useMemo 缓存排序结果
  const memorials = useMemo(() => {
    return sortMemorials(rawMemorials);
  }, [rawMemorials]);

  // 使用 Map 缓存 ID 查找
  const memorialsMap = useMemo(() => {
    return new Map(memorials.map(m => [m.id, m]));
  }, [memorials]);

  // 加载数据
  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const data = loadMemorials();
      setRawMemorials(data);
    } catch (error) {
      console.error('Failed to load memorials:', error);
      setRawMemorials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 添加纪念日 - 增量更新
  const addMemorial = useCallback(
    (data: CreateMemorialInput): Memorial => {
      const now = Date.now();
      const newMemorial: Memorial = {
        ...data,
        id: generateId(),
        isPinned: false,
        createdAt: now,
        updatedAt: now,
      };

      setRawMemorials(prev => {
        const updated = [...prev, newMemorial];
        debouncedSave(updated);
        return updated;
      });

      return newMemorial;
    },
    [debouncedSave]
  );

  // 更新纪念日 - 增量更新
  const updateMemorial = useCallback(
    (id: string, data: UpdateMemorialInput) => {
      setRawMemorials(prev => {
        const updated = prev.map(m =>
          m.id === id
            ? { ...m, ...data, updatedAt: Date.now() }
            : m
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // 删除纪念日 - 增量更新
  const deleteMemorial = useCallback(
    (id: string) => {
      setRawMemorials(prev => {
        const updated = prev.filter(m => m.id !== id);
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // 切换置顶状态 - 增量更新
  const togglePin = useCallback(
    (id: string) => {
      setRawMemorials(prev => {
        const updated = prev.map(m => {
          if (m.id !== id) return m;

          if (m.isPinned) {
            return {
              ...m,
              isPinned: false,
              pinnedAt: undefined,
              updatedAt: Date.now(),
            };
          } else {
            return {
              ...m,
              isPinned: true,
              pinnedAt: Date.now(),
              updatedAt: Date.now(),
            };
          }
        });
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // 根据 ID 获取纪念日 - 使用 Map 优化查找
  const getMemorialById = useCallback(
    (id: string): Memorial | undefined => {
      return memorialsMap.get(id);
    },
    [memorialsMap]
  );

  return {
    memorials,
    loading,
    addMemorial,
    updateMemorial,
    deleteMemorial,
    togglePin,
    getMemorialById,
    refresh: loadData,
  };
}
