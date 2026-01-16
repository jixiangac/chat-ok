/**
 * UIProvider 类型定义
 * 通用的 UI 状态 KV 存储
 */

// Context 值类型
export interface UIContextValue {
  // 获取值
  get: <T = any>(key: string, defaultValue?: T) => T | undefined;
  
  // 设置值
  set: <T = any>(key: string, value: T) => void;
  
  // 删除值
  remove: (key: string) => void;
  
  // 清空所有
  clear: () => void;
  
  // 批量获取
  getMultiple: (keys: string[]) => Record<string, any>;
  
  // 批量设置
  setMultiple: (entries: Record<string, any>) => void;
  
  // 检查是否存在
  has: (key: string) => boolean;
  
  // 获取所有 key
  keys: () => string[];
}
