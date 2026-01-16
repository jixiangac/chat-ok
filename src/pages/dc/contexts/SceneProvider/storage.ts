/**
 * SceneProvider 存储逻辑
 */

import type { Task } from '../../types';
import type { SceneType, SceneData } from './types';
import { createEmptySceneData } from './types';
import { buildIndex } from './indexBuilder';

// 存储键
const STORAGE_KEYS: Record<SceneType, string> = {
  normal: 'dc_scene_normal',
  vacation: 'dc_scene_vacation',
  memorial: 'dc_scene_memorial',
  okr: 'dc_scene_okr',
};

// 旧版任务存储键（用于迁移）
const LEGACY_TASKS_KEY = 'dc_tasks';

/**
 * 从 localStorage 加载场景数据
 */
export const loadSceneData = (scene: SceneType): SceneData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[scene]);
    if (stored) {
      const parsed = JSON.parse(stored);
      const tasks: Task[] = parsed.tasks || [];
      return {
        tasks,
        index: buildIndex(tasks),
        meta: {
          lastUpdate: parsed.meta?.lastUpdate || Date.now(),
          version: parsed.meta?.version || 1,
        },
      };
    }
    return createEmptySceneData();
  } catch (error) {
    console.error(`Failed to load scene data for ${scene}:`, error);
    return createEmptySceneData();
  }
};

/**
 * 保存场景数据到 localStorage
 */
export const saveSceneData = (scene: SceneType, data: SceneData): void => {
  try {
    // 只保存任务和元数据，索引在加载时重建
    const toSave = {
      tasks: data.tasks,
      meta: data.meta,
    };
    localStorage.setItem(STORAGE_KEYS[scene], JSON.stringify(toSave));
  } catch (error) {
    console.error(`Failed to save scene data for ${scene}:`, error);
  }
};

/**
 * 清除场景数据
 */
export const clearSceneData = (scene: SceneType): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS[scene]);
  } catch (error) {
    console.error(`Failed to clear scene data for ${scene}:`, error);
  }
};

/**
 * 从旧版存储迁移数据
 * 将所有任务迁移到 normal 场景
 */
export const migrateFromLegacyStorage = (): Task[] | null => {
  try {
    const stored = localStorage.getItem(LEGACY_TASKS_KEY);
    if (stored) {
      const tasks: Task[] = JSON.parse(stored);
      return tasks;
    }
    return null;
  } catch (error) {
    console.error('Failed to migrate from legacy storage:', error);
    return null;
  }
};

/**
 * 标记迁移完成
 */
export const markMigrationComplete = (): void => {
  try {
    localStorage.setItem('dc_migration_v2_complete', 'true');
  } catch (error) {
    console.error('Failed to mark migration complete:', error);
  }
};

/**
 * 检查是否需要迁移
 */
export const needsMigration = (): boolean => {
  try {
    const migrated = localStorage.getItem('dc_migration_v2_complete');
    if (migrated === 'true') {
      return false;
    }
    // 检查是否有旧版数据
    const legacyData = localStorage.getItem(LEGACY_TASKS_KEY);
    return !!legacyData;
  } catch (error) {
    return false;
  }
};

/**
 * 执行数据迁移
 */
export const performMigration = (): SceneData => {
  const legacyTasks = migrateFromLegacyStorage();
  if (legacyTasks && legacyTasks.length > 0) {
    const sceneData: SceneData = {
      tasks: legacyTasks,
      index: buildIndex(legacyTasks),
      meta: {
        lastUpdate: Date.now(),
        version: 1,
      },
    };
    // 保存到新的存储位置
    saveSceneData('normal', sceneData);
    // 标记迁移完成
    markMigrationComplete();
    return sceneData;
  }
  return createEmptySceneData();
};
