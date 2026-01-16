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

// 存储键常量
const STORAGE_KEYS = {
  TASKS: 'dc_tasks',
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
}> = {
  tasks: {
    label: '任务数据',
    description: '所有任务及其打卡记录',
    keys: [STORAGE_KEYS.TASKS],
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
    keys: [STORAGE_KEYS.TODAY_MUST_COMPLETE, STORAGE_KEYS.DEVELOPER_MODE, STORAGE_KEYS.LOCATION_FILTER],
  },
};

/**
 * 导出指定类型的数据
 */
export const exportData = (dataType: DataType): string => {
  try {
    const config = DATA_TYPE_CONFIG[dataType];
    const data: Record<string, unknown> = {
      type: dataType,
      exportTime: new Date().toISOString(),
      version: '1.0',
    };

    for (const key of config.keys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          data[key] = JSON.parse(stored);
        } catch {
          data[key] = stored;
        }
      }
    }

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(`Failed to export ${dataType}:`, error);
    return JSON.stringify({ error: 'Export failed', type: dataType });
  }
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

    // 导入每个存储键的数据
    let importedCount = 0;
    for (const key of config.keys) {
      if (data[key] !== undefined) {
        const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
        localStorage.setItem(key, value);
        importedCount++;
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
    const tasksJson = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!tasksJson) {
      return {
        success: true,
        message: '没有找到任务数据',
        repairedCount: 0
      };
    }

    const tasks: Task[] = JSON.parse(tasksJson);
    let repairedCount = 0;

    const repairedTasks = tasks.map(task => {
      // 只处理有 mainlineTask 的任务
      if (!task.mainlineTask) {
        return task;
      }

      const mainlineTask = task.mainlineTask;
      const mainlineType = task.mainlineType || mainlineTask.mainlineType;
      
      // 计算当前周期编号
      const currentCycleNumber = calculateCurrentCycleNumber(task);
      
      // 获取周期起始值（从 cycleSnapshots 获取）
      const cycleSnapshots = (task as any).cycleSnapshots || [];
      let cycleStartValue: number | undefined;
      if (cycleSnapshots.length > 0 && mainlineTask.numericConfig) {
        const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
        if (lastSnapshot.actualValue !== undefined) {
          cycleStartValue = lastSnapshot.actualValue;
        }
      }

      let newProgress: ProgressInfo;

      switch (mainlineType) {
        case 'NUMERIC': {
          const progressData = calculateNumericProgress(mainlineTask, {
            currentCycleNumber,
            cycleStartValue
          });
          newProgress = {
            totalPercentage: progressData.totalProgress,
            currentCyclePercentage: progressData.cycleProgress,
            currentCycleStart: progressData.currentCycleStart,
            currentCycleTarget: progressData.currentCycleTarget
          };
          break;
        }
        case 'CHECKLIST': {
          const progressData = calculateChecklistProgress(mainlineTask);
          newProgress = {
            totalPercentage: progressData.totalProgress,
            currentCyclePercentage: progressData.cycleProgress
          };
          break;
        }
        case 'CHECK_IN': {
          const progressData = calculateCheckInProgress(mainlineTask);
          newProgress = {
            totalPercentage: progressData.totalProgress,
            currentCyclePercentage: progressData.cycleProgress
          };
          break;
        }
        default:
          return task;
      }

      repairedCount++;

      // 更新 mainlineTask.progress 和 task.progress
      return {
        ...task,
        progress: newProgress,
        mainlineTask: {
          ...mainlineTask,
          progress: newProgress
        }
      };
    });

    // 保存修复后的数据
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(repairedTasks));

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

