/**
 * WorldProvider - 世界活动数据管理
 * 管理优惠、活动、公告等全局数据（预留）
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { WorldContextValue, WorldData, Promotion, Activity, Announcement } from './types';
import { defaultWorldData } from './types';

// 创建 Context
const WorldContext = createContext<WorldContextValue | null>(null);

interface WorldProviderProps {
  children: ReactNode;
}

// 判断是否在有效期内
const isActive = (startDate: string, endDate: string): boolean => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
};

// 判断公告是否有效
const isAnnouncementActive = (announcement: Announcement): boolean => {
  if (announcement.expiresAt) {
    return new Date() < new Date(announcement.expiresAt);
  }
  return true;
};

export function WorldProvider({ children }: WorldProviderProps) {
  const [worldData, setWorldData] = useState<WorldData>(defaultWorldData);
  const [isLoading, setIsLoading] = useState(false);

  // 活跃的优惠
  const activePromotions = useMemo(() => {
    return worldData.promotions.filter(p => isActive(p.startDate, p.endDate));
  }, [worldData.promotions]);

  // 活跃的活动
  const activeActivities = useMemo(() => {
    return worldData.activities.filter(a => isActive(a.startDate, a.endDate));
  }, [worldData.activities]);

  // 活跃的公告
  const activeAnnouncements = useMemo(() => {
    return worldData.announcements
      .filter(isAnnouncementActive)
      .sort((a, b) => {
        // 按优先级排序
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [worldData.announcements]);

  // 刷新世界数据（预留 API 调用）
  const refreshWorldData = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: 实现 API 调用获取世界数据
      // const response = await fetch('/api/world-data');
      // const data = await response.json();
      // setWorldData(data);
      
      // 目前使用默认数据
      setWorldData(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to refresh world data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: WorldContextValue = {
    worldData,
    activePromotions,
    activeActivities,
    activeAnnouncements,
    refreshWorldData,
    isLoading,
    lastUpdate: worldData.lastUpdate,
  };

  return (
    <WorldContext.Provider value={value}>
      {children}
    </WorldContext.Provider>
  );
}

/**
 * 使用世界数据的 Hook
 */
export function useWorld(): WorldContextValue {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
}

// 导出类型
export type { WorldData, Promotion, Activity, Announcement } from './types';
