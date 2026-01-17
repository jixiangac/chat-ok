/**
 * 数据导入导出工具
 * 支持多种数据类型的导入导出
 */

import { copyToClipboard } from './developerStorage';
import { 
  calculateNumericProgress, 
  calculateChecklistProgress, 
  calculateCheckInProgress,
  calculateCurrentCycleNumber
} from './mainlineTaskHelper';
import type { Task, ProgressInfo } from '../types';
import { TaskMigration } from './migration';
import { 
  loadSceneData, 
  saveSceneData,
  clearSceneData,
} from '../contexts/SceneProvider/storage';
import type { SceneType } from '../contexts/SceneProvider/types';
import { buildIndex } from '../contexts/SceneProvider/indexBuilder';

// 其他存储键常量（非场景化数据）
const STORAGE_KEYS = {
  TAGS: 'dc_task_tags',
  VACATION_TRIPS: 'vacation_trips',
  VACATION_STATE: 'vacation_mode_state',
  MEMORIALS: 'dc_memorials',
  MEMORIAL_DATE_FORMAT: 'dc_memorial_date_format',
  TODAY_MUST_COMPLETE: 'dc_today_must_complete',
  DEVELOPER_MODE: 'dc_developer_mode',
  LOCATION_FILTER: 'dc_location_filter',
};

// 数据类型定义
export type DataType = 'tasks' | 'tags' | 'vacation' | 'memorial' | 'preferences';

// 数据类型配置
export const DATA_TYPE_CONFIG: Record<DataType, {
  label: string;
  description: string;
  keys: string[];
  scene?: SceneType; // 场景类型（用于场景化存储）
  exportKey?: string; // 导出时使用的字段名（用于偏好设置等）
}> = {
  tasks: {
    label: '任务数据',
    description: '所有任务及其打卡记录',
    keys: [], // 使用 SceneProvider 存储
    scene: 'normal',
  },
  tags: {
    label: '标签数据',
    description: '普通标签、地点标签、心情标签',
    keys: [STORAGE_KEYS.TAGS],
  },
  vacation: {
    label: '度假数据',
    description: '度假行程和目标',
    keys: [STORAGE_KEYS.VACATION_TRIPS, STORAGE_KEYS.VACATION_STATE],
  },
  memorial: {
    label: '纪念日数据',
    description: '纪念日记录和显示格式',
    keys: [STORAGE_KEYS.MEMORIALS, STORAGE_KEYS.MEMORIAL_DATE_FORMAT],
  },
  preferences: {
    label: '偏好设置',
    description: '今日必须完成、开发者模式等',
    keys: ["dc_user_data"]
  },
};

/**
 * 导出指定类型的数据
 */
export const exportData = (dataType: DataType): string => {
  try {
    const config = DATA_TYPE_CONFIG[dataType];
    const exportedData: Record<string, unknown> = {
      type: dataType,
      exportTime: new Date().toISOString(),
      version: '2.0', // 更新版本号
    };

    // 如果是场景化数据，使用 SceneProvider 存储
    if (config.scene) {
      const sceneData = loadSceneData(config.scene);
      exportedData.tasks = sceneData.tasks;
      exportedData.meta = sceneData.meta;
    }

    // 处理其他存储键（偏好设置使用 userdata 字段）
    if (config.exportKey) {
      // 使用统一的导出字段名
      const userData: Record<string, unknown> = {};
      for (const key of config.keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            userData[key] = JSON.parse(stored);
          } catch {
            userData[key] = stored;
          }
        }
      }
      exportedData[config.exportKey] = userData;
    } else {
      // 直接使用存储键名
      for (const key of config.keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            exportedData[key] = parsed;
          } catch {
            exportedData[key] = stored;
          }
        }
      }
    }

    return JSON.stringify(exportedData, null, 2);
  } catch (error) {
    console.error(`Failed to export ${dataType}:`, error);
    return JSON.stringify({ error: 'Export failed', type: dataType });
  }
};

/**
 * 检测任务数组中是否包含老格式数据
 */
const hasLegacyTasks = (tasks: any[]): boolean => {
  return tasks.some((task: any) => TaskMigration.isLegacyTask(task));
};

/**
 * 转换老格式任务数组为新格式
 */
const migrateLegacyTasks = (tasks: any[]): { tasks: Task[]; migratedCount: number; errors: string[] } => {
  const result: { tasks: Task[]; migratedCount: number; errors: string[] } = {
    tasks: [],
    migratedCount: 0,
    errors: [],
  };

  for (const task of tasks) {
    try {
      if (TaskMigration.isLegacyTask(task)) {
        // 老格式任务，需要迁移
        const migratedTask = TaskMigration.migrateTask(task);
        result.tasks.push(migratedTask);
        result.migratedCount++;
        console.log(`[Import] 已转换老格式任务: ${task.id} - ${task.title}`);
      } else {
        // 新格式任务，直接使用
        result.tasks.push(task as Task);
      }
    } catch (error) {
      const errorMsg = `任务 ${task.id || '未知'} 转换失败: ${error instanceof Error ? error.message : '未知错误'}`;
      result.errors.push(errorMsg);
      console.error(`[Import] ${errorMsg}`);
    }
  }

  return result;
};

/**
 * 导入指定类型的数据
 */
export const importData = (
  dataType: DataType,
  jsonData: string
): { success: boolean; message: string } => {
  try {
    const data = JSON.parse(jsonData);
    const config = DATA_TYPE_CONFIG[dataType];

    // 验证数据类型
    if (data.type && data.type !== dataType) {
      return {
        success: false,
        message: `数据类型不匹配：期望 ${dataType}，实际 ${data.type}`,
      };
    }

    // 如果是场景化数据，使用 SceneProvider 存储
    if (config.scene) {
      // 兼容老格式：老数据存储在 dc_tasks 字段中
      let tasks: any[] = [];
      let isLegacyFormat = false;
      
      if (Array.isArray(data.dc_tasks)) {
        // 老格式数据（version 1.0）
        tasks = data.dc_tasks;
        isLegacyFormat = true;
        console.log('[Import] 检测到老格式数据结构（dc_tasks 字段）');
      } else if (Array.isArray(data.tasks)) {
        // 新格式数据（version 2.0）
        tasks = data.tasks;
      }
      
      const meta = data.meta || { lastUpdate: Date.now(), version: 1 };
      
      // 检测并转换老格式数据
      if (tasks.length > 0 && (isLegacyFormat || hasLegacyTasks(tasks))) {
        console.log('[Import] 检测到老格式任务数据，开始转换...');
        const migrationResult = migrateLegacyTasks(tasks);
        tasks = migrationResult.tasks;
        
        if (migrationResult.errors.length > 0) {
          console.warn('[Import] 部分任务转换失败:', migrationResult.errors);
        }
        
        console.log(`[Import] 转换完成，共转换 ${migrationResult.migratedCount} 个老格式任务`);
        
        // 如果所有任务都转换失败
        if (tasks.length === 0 && migrationResult.errors.length > 0) {
          return {
            success: false,
            message: `数据转换失败：${migrationResult.errors.join('; ')}`,
          };
        }
      }
      
      saveSceneData(config.scene, {
        tasks,
        index: buildIndex(tasks),
        meta,
      });
      return {
        success: true,
        message: isLegacyFormat || (data.tasks && hasLegacyTasks(data.tasks))
          ? `成功导入 ${config.label}（已自动转换 ${tasks.length} 条老格式数据）`
          : `成功导入 ${config.label}`,
      };
    }

    // 导入每个存储键的数据（偏好设置使用 userdata 字段）
    let importedCount = 0;
    
    if (config.exportKey && data[config.exportKey]) {
      // 从统一的导出字段中读取
      const userData = data[config.exportKey];
      for (const key of config.keys) {
        if (userData[key] !== undefined) {
          const value = typeof userData[key] === 'string' ? userData[key] : JSON.stringify(userData[key]);
          localStorage.setItem(key, value);
          importedCount++;
        }
      }
    } else {
      // 直接从存储键名读取（兼容老格式）
      for (const key of config.keys) {
        if (data[key] !== undefined) {
          const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          localStorage.setItem(key, value);
          importedCount++;
        }
      }
    }

    if (importedCount === 0) {
      return {
        success: false,
        message: '未找到可导入的数据',
      };
    }

    return {
      success: true,
      message: `成功导入 ${config.label}`,
    };
  } catch (error) {
    console.error(`Failed to import ${dataType}:`, error);
    return {
      success: false,
      message: '导入失败：JSON 解析错误',
    };
  }
};

/**
 * 迁移旧数据到新格式
 * 将所有旧格式任务转换为新的 v2 格式
 */
export const migrateToNewFormat = async (): Promise<{ success: boolean; message: string; migratedCount: number }> => {
  try {
    // 先重置迁移标记，强制重新迁移
    TaskMigration.resetMigration();
    
    console.log('[Migration] 开始迁移...');
    
    // 检查是否有任何任务数据（使用 SceneProvider）
    const sceneData = loadSceneData('normal');
    const tasks = sceneData.tasks;
    
    if (!tasks || tasks.length === 0) {
      return {
        success: true,
        message: '没有找到任务数据',
        migratedCount: 0
      };
    }
    
    console.log(`[Migration] 找到 ${tasks.length} 个任务`);
    
    // 检查是否有旧格式数据（检查所有任务，而不只是第一个）
    const hasLegacyData = tasks.some((task: any) => {
      // 新格式必须有 time、cycle、progress 对象，且 progress 有 lastUpdatedAt
      if (
        task.time &&
        task.cycle &&
        task.progress &&
        typeof task.progress === 'object' &&
        task.progress.lastUpdatedAt
      ) {
        return false;
      }
      // 旧格式特征：progress 是数字，或有 currentDay 字段，或有 mainlineTask 字段
      return (
        typeof task.progress === 'number' ||
        'currentDay' in task ||
        'mainlineTask' in task
      );
    });
    
    if (!hasLegacyData) {
      console.log('[Migration] 所有数据已经是新格式');
      return {
        success: true,
        message: '所有数据已经是新格式，无需迁移',
        migratedCount: 0
      };
    }
    
    console.log('[Migration] 检测到旧格式数据，开始执行迁移...');
    
    // 执行迁移
    const result = await TaskMigration.migrate();
    
    console.log('[Migration] 迁移结果:', result);
    
    // 验证迁移后的数据（使用 SceneProvider）
    const migratedSceneData = loadSceneData('normal');
    if (migratedSceneData.tasks.length > 0) {
      console.log('[Migration] 迁移后的第一个任务:', migratedSceneData.tasks[0]);
    }
    
    // 强制刷新页面以加载新数据
    
    return {
      success: result.success,
      message: result.success 
        ? `成功迁移 ${result.migratedCount} 个任务到新格式` 
        : `迁移失败：${result.errors.map(e => e.error).join('; ')}`,
      migratedCount: result.migratedCount
    };
  } catch (error) {
    console.error('Failed to migrate to new format:', error);
    return {
      success: false,
      message: '迁移失败：' + (error instanceof Error ? error.message : '未知错误'),
      migratedCount: 0
    };
  }
};

/**
 * 导出数据到剪贴板
 */
export const exportToClipboard = async (dataType: DataType): Promise<boolean> => {
  const data = exportData(dataType);
  return copyToClipboard(data);
};

/**
 * 获取数据统计信息
 */
export const getDataStats = (dataType: DataType): { count: number; size: string } => {
  try {
    const config = DATA_TYPE_CONFIG[dataType];
    let totalSize = 0;
    let count = 0;

    // 如果是场景化数据，使用 SceneProvider
    if (config.scene) {
      const sceneData = loadSceneData(config.scene);
      count = sceneData.tasks.length;
      // 估算大小
      totalSize = JSON.stringify(sceneData.tasks).length;
    }

    // 处理其他存储键
    for (const key of config.keys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        totalSize += stored.length;
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            count += parsed.length;
          } else if (typeof parsed === 'object') {
            count += 1;
          }
        } catch {
          count += 1;
        }
      }
    }

    // 格式化大小
    const sizeInKB = totalSize / 1024;
    const size = sizeInKB < 1 ? `${totalSize} B` : `${sizeInKB.toFixed(1)} KB`;

    return { count, size };
  } catch (error) {
    console.error(`Failed to get stats for ${dataType}:`, error);
    return { count: 0, size: '0 B' };
  }
};

/**
 * 清除指定类型的数据
 */
export const clearData = (dataType: DataType): boolean => {
  try {
    const config = DATA_TYPE_CONFIG[dataType];
    
    // 如果是场景化数据，使用 SceneProvider
    if (config.scene) {
      clearSceneData(config.scene);
    }
    
    for (const key of config.keys) {
      localStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.error(`Failed to clear ${dataType}:`, error);
    return false;
  }
};

/**
 * 修复任务进度数据
 * 遍历所有任务，重新计算并存储 progress 字段
 */
export const repairTaskProgressData = (): { success: boolean; message: string; repairedCount: number } => {
  try {
    // 使用 SceneProvider 加载数据
    const sceneData = loadSceneData('normal');
    const tasks = sceneData.tasks;
    
    if (!tasks || tasks.length === 0) {
      return {
        success: true,
        message: '没有找到任务数据',
        repairedCount: 0
      };
    }
    
    let repairedCount = 0;

    const repairedTasks = tasks.map(task => {
      // 只处理有 category 的任务
      const category = task.category;
      if (!category) return task;
      
      // 计算当前周期编号
      const currentCycleNumber = calculateCurrentCycleNumber(task);
      
      // 获取周期起始值（从 cycleSnapshots 获取）
      const cycleSnapshots = (task as any).cycleSnapshots || [];
      let cycleStartValue: number | undefined;
      if (cycleSnapshots.length > 0 && task.numericConfig) {
        const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
        if (lastSnapshot.actualValue !== undefined) {
          cycleStartValue = lastSnapshot.actualValue;
        }
      }

      let newProgress: ProgressInfo;

      switch (category) {
        case 'NUMERIC': {
          const progressData = calculateNumericProgress({ numericConfig: task.numericConfig, cycle: task.cycle } as any, {
            currentCycleNumber,
            cycleStartValue
          });
          newProgress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: progressData.currentCycleStart,
            cycleTargetValue: progressData.currentCycleTarget,
            cycleAchieved: 0,
            cycleRemaining: 0,
            lastUpdatedAt: new Date().toISOString(),
          };
          break;
        }
        case 'CHECKLIST': {
          const progressData = calculateChecklistProgress({ checklistConfig: task.checklistConfig, cycle: task.cycle } as any);
          newProgress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: 0,
            cycleTargetValue: 0,
            cycleAchieved: 0,
            cycleRemaining: 0,
            lastUpdatedAt: new Date().toISOString(),
          };
          break;
        }
        case 'CHECK_IN': {
          const progressData = calculateCheckInProgress({ checkInConfig: task.checkInConfig, cycle: task.cycle, time: task.time } as any);
          newProgress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: 0,
            cycleTargetValue: 0,
            cycleAchieved: 0,
            cycleRemaining: 0,
            lastUpdatedAt: new Date().toISOString(),
          };
          break;
        }
        default:
          return task;
      }

      repairedCount++;

      // 更新 task.progress
      return {
        ...task,
        progress: newProgress
      };
    });

    // 使用 SceneProvider 保存修复后的数据
    saveSceneData('normal', {
      tasks: repairedTasks,
      index: buildIndex(repairedTasks),
      meta: { ...sceneData.meta, lastUpdate: Date.now() },
    });

    return {
      success: true,
      message: `成功修复 ${repairedCount} 个任务的进度数据`,
      repairedCount
    };
  } catch (error) {
    console.error('Failed to repair task progress data:', error);
    return {
      success: false,
      message: '修复失败：' + (error instanceof Error ? error.message : '未知错误'),
      repairedCount: 0
    };
  }
};















