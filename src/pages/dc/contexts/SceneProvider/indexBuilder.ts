/**
 * 索引构建器
 * 用于构建和更新场景数据索引
 */

import type { Task } from '../../types';
import type { SceneIndex } from './types';
import { createEmptyIndex } from './types';

/**
 * 获取今天的日期字符串
 */
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * 获取本周开始日期
 */
const getWeekStart = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 周一为一周开始
  return new Date(now.setDate(diff));
};

/**
 * 获取本月开始日期
 */
const getMonthStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

/**
 * 构建完整索引
 */
export function buildIndex(tasks: Task[]): SceneIndex {
  const index = createEmptyIndex();
  
  const today = getTodayString();
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  tasks.forEach(task => {
    // 按 ID 索引
    index.byId.set(task.id, task);

    // 按类型索引
    if (task.type === 'mainline') {
      index.byType.mainline.add(task.id);
    } else if (task.type === 'sidelineA') {
      index.byType.sidelineA.add(task.id);
    } else if (task.type === 'sidelineB') {
      index.byType.sidelineB.add(task.id);
    }

    // 按状态索引
    if (task.completed) {
      index.byStatus.completed.add(task.id);
    } else {
      index.byStatus.active.add(task.id);
    }
    
    // 检查主线任务状态
    if (task.mainlineTask?.status === 'PAUSED') {
      index.byStatus.paused.add(task.id);
    }

    // 按标签索引
    if (task.tags?.normalTagId) {
      if (!index.byTag.has(task.tags.normalTagId)) {
        index.byTag.set(task.tags.normalTagId, new Set());
      }
      index.byTag.get(task.tags.normalTagId)!.add(task.id);
    }
    // 兼容旧版 tagId
    if (task.tagId) {
      if (!index.byTag.has(task.tagId)) {
        index.byTag.set(task.tagId, new Set());
      }
      index.byTag.get(task.tagId)!.add(task.id);
    }

    // 按日期索引
    const taskDate = task.startDate || task.mainlineTask?.createdAt;
    if (taskDate) {
      const taskDateObj = new Date(taskDate);
      const taskDateStr = taskDateObj.toISOString().split('T')[0];
      
      if (taskDateStr === today) {
        index.byDate.today.add(task.id);
      }
      if (taskDateObj >= weekStart) {
        index.byDate.thisWeek.add(task.id);
      }
      if (taskDateObj >= monthStart) {
        index.byDate.thisMonth.add(task.id);
      }
    }
  });

  return index;
}

/**
 * 添加任务到索引
 */
export function addToIndex(index: SceneIndex, task: Task): SceneIndex {
  const newIndex = cloneIndex(index);
  
  // 按 ID 索引
  newIndex.byId.set(task.id, task);

  // 按类型索引
  if (task.type === 'mainline') {
    newIndex.byType.mainline.add(task.id);
  } else if (task.type === 'sidelineA') {
    newIndex.byType.sidelineA.add(task.id);
  } else if (task.type === 'sidelineB') {
    newIndex.byType.sidelineB.add(task.id);
  }

  // 按状态索引
  if (task.completed) {
    newIndex.byStatus.completed.add(task.id);
  } else {
    newIndex.byStatus.active.add(task.id);
  }

  // 按标签索引
  if (task.tags?.normalTagId) {
    if (!newIndex.byTag.has(task.tags.normalTagId)) {
      newIndex.byTag.set(task.tags.normalTagId, new Set());
    }
    newIndex.byTag.get(task.tags.normalTagId)!.add(task.id);
  }

  return newIndex;
}

/**
 * 从索引中移除任务
 */
export function removeFromIndex(index: SceneIndex, taskId: string): SceneIndex {
  const newIndex = cloneIndex(index);
  
  // 从所有索引中移除
  newIndex.byId.delete(taskId);
  newIndex.byType.mainline.delete(taskId);
  newIndex.byType.sidelineA.delete(taskId);
  newIndex.byType.sidelineB.delete(taskId);
  newIndex.byStatus.active.delete(taskId);
  newIndex.byStatus.completed.delete(taskId);
  newIndex.byStatus.archived.delete(taskId);
  newIndex.byStatus.paused.delete(taskId);
  newIndex.byDate.today.delete(taskId);
  newIndex.byDate.thisWeek.delete(taskId);
  newIndex.byDate.thisMonth.delete(taskId);
  
  // 从标签索引中移除
  newIndex.byTag.forEach(set => set.delete(taskId));

  return newIndex;
}

/**
 * 更新索引中的任务
 */
export function updateInIndex(index: SceneIndex, task: Task): SceneIndex {
  // 先移除再添加
  const indexAfterRemove = removeFromIndex(index, task.id);
  return addToIndex(indexAfterRemove, task);
}

/**
 * 克隆索引（浅拷贝）
 */
function cloneIndex(index: SceneIndex): SceneIndex {
  return {
    byId: new Map(index.byId),
    byType: {
      mainline: new Set(index.byType.mainline),
      sidelineA: new Set(index.byType.sidelineA),
      sidelineB: new Set(index.byType.sidelineB),
    },
    byStatus: {
      active: new Set(index.byStatus.active),
      completed: new Set(index.byStatus.completed),
      archived: new Set(index.byStatus.archived),
      paused: new Set(index.byStatus.paused),
    },
    byTag: new Map(Array.from(index.byTag.entries()).map(([k, v]) => [k, new Set(v)])),
    byDate: {
      today: new Set(index.byDate.today),
      thisWeek: new Set(index.byDate.thisWeek),
      thisMonth: new Set(index.byDate.thisMonth),
    },
  };
}

