/**
 * 纪念日面板类型定义
 */

// 背景类型
export type BackgroundType = 'color' | 'gradient' | 'image';

// 背景设置
export interface MemorialBackground {
  type: BackgroundType;
  value: string; // 颜色值 / 渐变值 / 图片URL(base64)
}

// 纪念日数据模型
export interface Memorial {
  id: string;
  name: string;                    // 纪念日名称
  date: string;                    // 日期 (YYYY-MM-DD)
  icon: string;                    // lucide-react 图标名称
  iconColor: string;               // 图标颜色（蜡笔风格）
  note?: string;                   // 备注说明
  background: MemorialBackground;  // 背景设置
  isPinned: boolean;               // 是否置顶
  pinnedAt?: number;               // 置顶时间戳
  createdAt: number;               // 创建时间戳
  updatedAt: number;               // 更新时间戳
}

// 日期显示格式
export type DateDisplayFormat = 'days' | 'monthsDays' | 'yearsMonthsDays';

// 创建纪念日的输入数据
export type CreateMemorialInput = Omit<Memorial, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'pinnedAt'>;

// 更新纪念日的输入数据
export type UpdateMemorialInput = Partial<Omit<Memorial, 'id' | 'createdAt'>>;
