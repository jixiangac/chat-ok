/**
 * WorldProvider 类型定义
 * 管理世界活动数据：优惠、活动、公告等
 */

// 优惠信息
export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'discount' | 'gift' | 'event';
  imageUrl?: string;
  link?: string;
}

// 活动信息
export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants?: number;
  imageUrl?: string;
  link?: string;
}

// 公告信息
export interface Announcement {
  id: string;
  content: string;
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  expiresAt?: string;
}

// 世界数据
export interface WorldData {
  promotions: Promotion[];
  activities: Activity[];
  announcements: Announcement[];
  lastUpdate: string;
}

// 默认世界数据
export const defaultWorldData: WorldData = {
  promotions: [],
  activities: [],
  announcements: [],
  lastUpdate: new Date().toISOString(),
};

// Context 值类型
export interface WorldContextValue {
  // 数据
  worldData: WorldData;
  
  // 快捷访问
  activePromotions: Promotion[];
  activeActivities: Activity[];
  activeAnnouncements: Announcement[];
  
  // 操作
  refreshWorldData: () => Promise<void>;
  
  // 状态
  isLoading: boolean;
  lastUpdate: string;
}
