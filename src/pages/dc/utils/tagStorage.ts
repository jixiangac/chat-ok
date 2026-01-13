/**
 * 标签存储工具
 * 管理任务标签的本地存储
 * 支持三类标签：普通标签、地点标签、心情标签
 */

import type { TaskTag, TagType, Task, TaskTags } from '../types';
import { SIDELINE_THEME_COLORS } from '../constants/colors';

const STORAGE_KEY = 'dc_task_tags';
const MIGRATION_KEY = 'dc_tag_migration_v2';

// 标签颜色列表（使用支线任务主题色）
export const TAG_COLORS = SIDELINE_THEME_COLORS;

// 地点标签图标
export const LOCATION_ICONS = ['home', 'building', 'coffee', 'gym', 'train', 'school', 'hospital', 'shop', 'beach', 'park'];

// 心情标签图标
export const MOOD_ICONS = ['happy', 'sad', 'angry', 'sleepy', 'thinking', 'energetic', 'celebrate', 'love', 'fire', 'cold'];

// 普通标签图标（可选）
export const NORMAL_ICONS = ['pin', 'star', 'target', 'book', 'idea', 'tool', 'art', 'music', 'person', 'sparkle'];

/**
 * 获取标签类型对应的图标列表
 */
export const getIconsForType = (type: TagType): string[] => {
  switch (type) {
    case 'location':
      return LOCATION_ICONS;
    case 'mood':
      return MOOD_ICONS;
    case 'normal':
    default:
      return NORMAL_ICONS;
  }
};

/**
 * 获取标签类型的默认图标
 */
export const getDefaultIconForType = (type: TagType): string | undefined => {
  switch (type) {
    case 'location':
      return LOCATION_ICONS[0];
    case 'mood':
      return MOOD_ICONS[0];
    case 'normal':
    default:
      return undefined; // 普通标签不需要图标
  }
};

/**
 * 从 localStorage 读取标签列表
 */
export const loadTagsFromStorage = (): TaskTag[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tags = stored ? JSON.parse(stored) : [];
    // 确保迁移已执行
    return migrateTagsIfNeeded(tags);
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
 * 迁移旧版标签数据（添加 type 字段）
 */
const migrateTagsIfNeeded = (tags: TaskTag[]): TaskTag[] => {
  const migrated = localStorage.getItem(MIGRATION_KEY);
  if (migrated === 'done') {
    return tags;
  }

  const needsMigration = tags.some(tag => !tag.type);
  if (needsMigration) {
    const migratedTags = tags.map(tag => ({
      ...tag,
      type: tag.type || 'normal' as TagType,
    }));
    saveTagsToStorage(migratedTags);
    localStorage.setItem(MIGRATION_KEY, 'done');
    return migratedTags;
  }

  localStorage.setItem(MIGRATION_KEY, 'done');
  return tags;
};

/**
 * 获取下一个可用的标签颜色
 */
export const getNextTagColor = (existingTags: TaskTag[], type?: TagType): string => {
  // 只考虑同类型标签的颜色
  const sameTypeTags = type 
    ? existingTags.filter(tag => tag.type === type)
    : existingTags;
  const usedColors = sameTypeTags.map(tag => tag.color);
  
  // 找到第一个未使用的颜色
  for (const color of TAG_COLORS) {
    if (!usedColors.includes(color)) {
      return color;
    }
  }
  
  // 如果所有颜色都用过了，循环使用
  return TAG_COLORS[sameTypeTags.length % TAG_COLORS.length];
};

/**
 * 创建新标签
 */
export const createTag = (
  name: string, 
  type: TagType = 'normal',
  icon?: string
): TaskTag => {
  const existingTags = loadTagsFromStorage();
  
  const newTag: TaskTag = {
    id: Date.now().toString(),
    name: name.trim(),
    color: getNextTagColor(existingTags, type),
    type,
    icon: icon || getDefaultIconForType(type),
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
export const updateTag = (
  tagId: string, 
  updates: Partial<Omit<TaskTag, 'id' | 'createdAt' | 'type'>>
): TaskTag | null => {
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

/**
 * 按类型获取标签
 */
export const getTagsByType = (type: TagType): TaskTag[] => {
  const tags = loadTagsFromStorage();
  return tags.filter(tag => tag.type === type);
};

/**
 * 获取任务的有效标签ID（兼容新旧格式）
 * 返回普通标签ID（用于分组等场景）
 */
export const getTaskNormalTagId = (task: Task): string | undefined => {
  // 优先使用新版 tags
  if (task.tags?.normalTagId) {
    return task.tags.normalTagId;
  }
  // 兼容旧版 tagId
  return task.tagId;
};

/**
 * 获取任务的所有标签
 */
export const getTaskTags = (task: Task): {
  normalTag?: TaskTag;
  locationTag?: TaskTag;
  moodTag?: TaskTag;
} => {
  const tags = loadTagsFromStorage();
  const result: {
    normalTag?: TaskTag;
    locationTag?: TaskTag;
    moodTag?: TaskTag;
  } = {};

  // 新版 tags
  if (task.tags) {
    if (task.tags.normalTagId) {
      result.normalTag = tags.find(t => t.id === task.tags!.normalTagId);
    }
    if (task.tags.locationTagId) {
      result.locationTag = tags.find(t => t.id === task.tags!.locationTagId);
    }
    if (task.tags.moodTagId) {
      result.moodTag = tags.find(t => t.id === task.tags!.moodTagId);
    }
  }
  
  // 兼容旧版 tagId（作为普通标签）
  if (!result.normalTag && task.tagId) {
    result.normalTag = tags.find(t => t.id === task.tagId);
  }

  return result;
};

/**
 * 迁移任务数据（tagId → tags）
 */
export const migrateTaskTags = (task: Task): Task => {
  if (task.tagId && !task.tags) {
    return {
      ...task,
      tags: { normalTagId: task.tagId },
    };
  }
  return task;
};

/**
 * 批量迁移任务数据
 */
export const migrateAllTaskTags = (tasks: Task[]): Task[] => {
  return tasks.map(migrateTaskTags);
};

/**
 * 删除标签时清理任务关联
 * 返回需要更新的任务列表
 */
export const cleanupTaskTagReferences = (
  tasks: Task[], 
  tagId: string
): Task[] => {
  const tag = getTagById(tagId);
  if (!tag) return tasks;

  return tasks.map(task => {
    const updates: Partial<Task> = {};
    let needsUpdate = false;

    // 检查旧版 tagId
    if (task.tagId === tagId) {
      updates.tagId = undefined;
      needsUpdate = true;
    }

    // 检查新版 tags
    if (task.tags) {
      const newTags = { ...task.tags };
      
      if (tag.type === 'normal' && task.tags.normalTagId === tagId) {
        newTags.normalTagId = undefined;
        needsUpdate = true;
      }
      if (tag.type === 'location' && task.tags.locationTagId === tagId) {
        newTags.locationTagId = undefined;
        needsUpdate = true;
      }
      if (tag.type === 'mood' && task.tags.moodTagId === tagId) {
        newTags.moodTagId = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        updates.tags = newTags;
      }
    }

    return needsUpdate ? { ...task, ...updates } : task;
  });
};

/**
 * 获取任务中已使用的地点标签列表
 */
export const getUsedLocationTags = (tasks: Task[]): TaskTag[] => {
  const allTags = loadTagsFromStorage();
  const locationTags = allTags.filter(t => t.type === 'location');
  
  const usedTagIds = new Set<string>();
  
  tasks.forEach(task => {
    if (task.tags?.locationTagId) {
      usedTagIds.add(task.tags.locationTagId);
    }
  });

  return locationTags.filter(tag => usedTagIds.has(tag.id));
};

/**
 * 更新任务的标签
 */
export const updateTaskTags = (
  task: Task,
  tagType: TagType,
  tagId: string | undefined
): TaskTags => {
  const currentTags = task.tags || {};
  
  switch (tagType) {
    case 'normal':
      return { ...currentTags, normalTagId: tagId };
    case 'location':
      return { ...currentTags, locationTagId: tagId };
    case 'mood':
      return { ...currentTags, moodTagId: tagId };
    default:
      return currentTags;
  }
};

