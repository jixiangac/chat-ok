/**
 * 标签存储工具
 * 管理任务标签的本地存储
 */

import type { TaskTag } from '../types';
import { SIDELINE_THEME_COLORS } from '../constants/colors';

const STORAGE_KEY = 'dc_task_tags';

// 标签颜色列表（使用支线任务主题色）
export const TAG_COLORS = SIDELINE_THEME_COLORS;

/**
 * 从 localStorage 读取标签列表
 */
export const loadTagsFromStorage = (): TaskTag[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tags from localStorage:', error);
    return [];
  }
};

/**
 * 保存标签列表到 localStorage
 */
export const saveTagsToStorage = (tags: TaskTag[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch (error) {
    console.error('Failed to save tags to localStorage:', error);
  }
};

/**
 * 获取下一个可用的标签颜色
 */
export const getNextTagColor = (existingTags: TaskTag[]): string => {
  const usedColors = existingTags.map(tag => tag.color);
  
  // 找到第一个未使用的颜色
  for (const color of TAG_COLORS) {
    if (!usedColors.includes(color)) {
      return color;
    }
  }
  
  // 如果所有颜色都用过了，循环使用
  return TAG_COLORS[existingTags.length % TAG_COLORS.length];
};

/**
 * 创建新标签
 */
export const createTag = (name: string): TaskTag => {
  const existingTags = loadTagsFromStorage();
  
  const newTag: TaskTag = {
    id: Date.now().toString(),
    name: name.trim(),
    color: getNextTagColor(existingTags),
    createdAt: new Date().toISOString(),
  };
  
  const updatedTags = [...existingTags, newTag];
  saveTagsToStorage(updatedTags);
  
  return newTag;
};

/**
 * 删除标签
 */
export const deleteTag = (tagId: string): void => {
  const existingTags = loadTagsFromStorage();
  const updatedTags = existingTags.filter(tag => tag.id !== tagId);
  saveTagsToStorage(updatedTags);
};

/**
 * 更新标签
 */
export const updateTag = (tagId: string, updates: Partial<Omit<TaskTag, 'id' | 'createdAt'>>): TaskTag | null => {
  const existingTags = loadTagsFromStorage();
  const tagIndex = existingTags.findIndex(tag => tag.id === tagId);
  
  if (tagIndex === -1) {
    return null;
  }
  
  const updatedTag = { ...existingTags[tagIndex], ...updates };
  existingTags[tagIndex] = updatedTag;
  saveTagsToStorage(existingTags);
  
  return updatedTag;
};

/**
 * 根据ID获取标签
 */
export const getTagById = (tagId: string): TaskTag | undefined => {
  const tags = loadTagsFromStorage();
  return tags.find(tag => tag.id === tagId);
};

/**
 * 获取所有标签
 */
export const getAllTags = (): TaskTag[] => {
  return loadTagsFromStorage();
};

