/**
 * 归档存储工具
 * 管理已归档任务的独立存储
 */

import type { Task } from '../types';

// 存储键
const ARCHIVE_STORAGE_KEY = 'dc_archived_tasks';
const SCENE_STORAGE_KEY = 'dc_scene_normal';

// 旧版存储键（用于兼容）
const LEGACY_TASKS_KEY = 'dc_tasks';

/**
 * 归档任务接口（包含归档时的额外信息）
 */
export interface ArchivedTask extends Task {
  /** 归档时间 */
  archivedAt: string;
  /** 归档时的总结/备注 */
  archiveSummary?: string;
}

/**
 * 获取所有归档任务
 */
export function getArchivedTasks(): ArchivedTask[] {
  try {
    const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load archived tasks:', error);
    return [];
  }
}

/**
 * 保存归档任务列表
 */
export function saveArchivedTasks(tasks: ArchivedTask[]): void {
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save archived tasks:', error);
  }
}

/**
 * 归档任务
 * 将任务从主存储移动到归档存储
 * @param taskId 要归档的任务ID
 * @param summary 归档总结（可选）
 * @returns 是否成功
 */
export function archiveTask(taskId: string, summary?: string): { success: boolean; message: string } {
  try {
    // 1. 从场景存储获取任务（优先使用新存储）
    console.log(`[Archive] 开始归档任务: ${taskId}`);
    
    let sceneData: any = null;
    let tasks: Task[] = [];
    let useNewStorage = false;
    
    const sceneJson = localStorage.getItem(SCENE_STORAGE_KEY);
    if (sceneJson) {
      sceneData = JSON.parse(sceneJson);
      tasks = sceneData.tasks || [];
      useNewStorage = true;
      console.log(`[Archive] 从新存储 ${SCENE_STORAGE_KEY} 读取到 ${tasks.length} 个任务`);
    } else {
      // 尝试旧存储
      const legacyJson = localStorage.getItem(LEGACY_TASKS_KEY);
      if (legacyJson) {
        tasks = JSON.parse(legacyJson);
        console.log(`[Archive] 从旧存储 ${LEGACY_TASKS_KEY} 读取到 ${tasks.length} 个任务`);
      }
    }

    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
    console.log(`[Archive] 查找任务 ${taskId}，索引: ${taskIndex}`);
    
    if (taskIndex === -1) {
      console.log(`[Archive] 未找到任务，任务ID列表:`, tasks.map(t => t.id));
      return { success: false, message: '未找到指定任务' };
    }

    const task = tasks[taskIndex];
    console.log(`[Archive] 找到任务:`, { id: task.id, title: task.title, status: task.status });

    // 2. 创建归档任务
    const archivedTask: ArchivedTask = {
      ...task,
      status: 'ARCHIVED_HISTORY',
      archivedAt: new Date().toISOString(),
      archiveSummary: summary,
    };

    // 更新 time.archivedAt
    if (archivedTask.time) {
      archivedTask.time = {
        ...archivedTask.time,
        archivedAt: new Date().toISOString(),
      };
    }

    // 3. 添加到归档存储
    const archivedTasks = getArchivedTasks();
    archivedTasks.unshift(archivedTask); // 新归档的放在最前面
    saveArchivedTasks(archivedTasks);

    // 4. 从主存储中移除
    const remainingTasks = tasks.filter((t: Task) => t.id !== taskId);
    console.log(`[Archive] 移除后剩余 ${remainingTasks.length} 个任务`);
    
    if (useNewStorage && sceneData) {
      // 保存到新存储
      sceneData.tasks = remainingTasks;
      sceneData.meta = { ...sceneData.meta, lastUpdate: Date.now() };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(sceneData));
      console.log(`[Archive] 已保存到新存储 ${SCENE_STORAGE_KEY}`);
    } else {
      // 保存到旧存储
      localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(remainingTasks));
      console.log(`[Archive] 已保存到旧存储 ${LEGACY_TASKS_KEY}`);
    }

    console.log(`[Archive] 任务 ${taskId} 已归档到历史记录`);

    return { success: true, message: '任务已归档到历史记录' };
  } catch (error) {
    console.error('Failed to archive task:', error);
    return { 
      success: false, 
      message: '归档失败：' + (error instanceof Error ? error.message : '未知错误') 
    };
  }
}

/**
 * 从归档中恢复任务
 * @param taskId 要恢复的任务ID
 * @returns 是否成功
 */
export function restoreFromArchive(taskId: string): { success: boolean; message: string } {
  try {
    // 1. 从归档存储获取任务
    const archivedTasks = getArchivedTasks();
    const taskIndex = archivedTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return { success: false, message: '未找到指定的归档任务' };
    }

    const archivedTask = archivedTasks[taskIndex];

    // 2. 恢复任务状态
    const restoredTask: Task = {
      ...archivedTask,
      status: 'COMPLETED', // 恢复为已完成状态
    };

    // 移除归档特有字段
    delete (restoredTask as any).archiveSummary;

    // 3. 添加回主存储（优先使用新存储）
    const sceneJson = localStorage.getItem(SCENE_STORAGE_KEY);
    let tasks: Task[] = [];
    let sceneData: any = null;
    let useNewStorage = false;
    
    if (sceneJson) {
      sceneData = JSON.parse(sceneJson);
      tasks = sceneData.tasks || [];
      useNewStorage = true;
    } else {
      const legacyJson = localStorage.getItem(LEGACY_TASKS_KEY);
      tasks = legacyJson ? JSON.parse(legacyJson) : [];
    }
    
    tasks.push(restoredTask);
    
    if (useNewStorage && sceneData) {
      sceneData.tasks = tasks;
      sceneData.meta = { ...sceneData.meta, lastUpdate: Date.now() };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(sceneData));
    } else {
      localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(tasks));
    }

    // 4. 从归档存储中移除
    archivedTasks.splice(taskIndex, 1);
    saveArchivedTasks(archivedTasks);

    console.log(`[Archive] 任务 ${taskId} 已从归档恢复`);

    return { success: true, message: '任务已从归档恢复' };
  } catch (error) {
    console.error('Failed to restore task from archive:', error);
    return { 
      success: false, 
      message: '恢复失败：' + (error instanceof Error ? error.message : '未知错误') 
    };
  }
}

/**
 * 永久删除归档任务
 * @param taskId 要删除的任务ID
 * @returns 是否成功
 */
export function deleteArchivedTask(taskId: string): { success: boolean; message: string } {
  try {
    const archivedTasks = getArchivedTasks();
    const taskIndex = archivedTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return { success: false, message: '未找到指定的归档任务' };
    }

    archivedTasks.splice(taskIndex, 1);
    saveArchivedTasks(archivedTasks);

    console.log(`[Archive] 归档任务 ${taskId} 已永久删除`);

    return { success: true, message: '归档任务已永久删除' };
  } catch (error) {
    console.error('Failed to delete archived task:', error);
    return { 
      success: false, 
      message: '删除失败：' + (error instanceof Error ? error.message : '未知错误') 
    };
  }
}

/**
 * 获取归档统计信息
 */
export function getArchiveStats(): {
  totalCount: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
} {
  const archivedTasks = getArchivedTasks();
  
  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = {};

  for (const task of archivedTasks) {
    // 按分类统计
    const category = task.category || 'UNKNOWN';
    byCategory[category] = (byCategory[category] || 0) + 1;

    // 按类型统计
    const type = task.type || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
  }

  return {
    totalCount: archivedTasks.length,
    byCategory,
    byType,
  };
}

/**
 * 清空所有归档任务
 */
export function clearAllArchivedTasks(): { success: boolean; message: string } {
  try {
    localStorage.removeItem(ARCHIVE_STORAGE_KEY);
    return { success: true, message: '已清空所有归档任务' };
  } catch (error) {
    console.error('Failed to clear archived tasks:', error);
    return { 
      success: false, 
      message: '清空失败：' + (error instanceof Error ? error.message : '未知错误') 
    };
  }
}

/**
 * 迁移旧的归档任务到新存储
 * 将主存储中状态为 ARCHIVED 的任务迁移到归档存储
 */
export function migrateOldArchivedTasks(): { success: boolean; migratedCount: number; message: string } {
  try {
    // 从场景存储获取任务（优先使用新存储）
    let tasks: Task[] = [];
    let sceneData: any = null;
    let useNewStorage = false;
    
    const sceneJson = localStorage.getItem(SCENE_STORAGE_KEY);
    if (sceneJson) {
      sceneData = JSON.parse(sceneJson);
      tasks = sceneData.tasks || [];
      useNewStorage = true;
    } else {
      const legacyJson = localStorage.getItem(LEGACY_TASKS_KEY);
      if (legacyJson) {
        tasks = JSON.parse(legacyJson);
      }
    }

    if (tasks.length === 0) {
      return { success: true, migratedCount: 0, message: '没有找到任务数据' };
    }
    
    const archivedTasks = getArchivedTasks();

    // 找出所有已归档的任务
    const toMigrate = tasks.filter((t: Task) => 
      t.status === 'ARCHIVED' || 
      (t as any).status === 'archived'
    );

    if (toMigrate.length === 0) {
      return { success: true, migratedCount: 0, message: '没有需要迁移的归档任务' };
    }

    // 迁移到归档存储
    for (const task of toMigrate) {
      const archivedTask: ArchivedTask = {
        ...task,
        status: 'ARCHIVED_HISTORY',
        archivedAt: (task.time?.archivedAt) || new Date().toISOString(),
      };
      archivedTasks.push(archivedTask);
    }

    // 保存归档存储
    saveArchivedTasks(archivedTasks);

    // 从主存储中移除已归档的任务
    const remainingTasks = tasks.filter((t: Task) => 
      t.status !== 'ARCHIVED' && 
      (t as any).status !== 'archived'
    );
    
    if (useNewStorage && sceneData) {
      sceneData.tasks = remainingTasks;
      sceneData.meta = { ...sceneData.meta, lastUpdate: Date.now() };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(sceneData));
    } else {
      localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(remainingTasks));
    }

    console.log(`[Archive] 迁移了 ${toMigrate.length} 个归档任务到新存储`);

    return { 
      success: true, 
      migratedCount: toMigrate.length, 
      message: `成功迁移 ${toMigrate.length} 个归档任务` 
    };
  } catch (error) {
    console.error('Failed to migrate archived tasks:', error);
    return { 
      success: false, 
      migratedCount: 0,
      message: '迁移失败：' + (error instanceof Error ? error.message : '未知错误') 
    };
  }
}


