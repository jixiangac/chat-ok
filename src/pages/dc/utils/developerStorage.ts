/**
 * 开发者模式存储工具
 * 用于管理开发者模式状态和数据导入导出功能
 */

const STORAGE_KEYS = {
  DEVELOPER_MODE: 'dc_developer_mode',
  LOCATION_FILTER: 'dc_location_filter',
};

/**
 * 获取开发者模式状态
 */
export const getDeveloperMode = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DEVELOPER_MODE);
    return stored === 'true';
  } catch (error) {
    console.error('Failed to get developer mode:', error);
    return false;
  }
};

/**
 * 设置开发者模式状态
 */
export const setDeveloperMode = (enabled: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DEVELOPER_MODE, String(enabled));
  } catch (error) {
    console.error('Failed to set developer mode:', error);
  }
};

/**
 * 获取保存的地点筛选
 */
export const getSavedLocationFilter = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LOCATION_FILTER);
  } catch (error) {
    console.error('Failed to get location filter:', error);
    return null;
  }
};

/**
 * 保存地点筛选
 */
export const saveLocationFilter = (locationTagId: string | null): void => {
  try {
    if (locationTagId) {
      localStorage.setItem(STORAGE_KEYS.LOCATION_FILTER, locationTagId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOCATION_FILTER);
    }
  } catch (error) {
    console.error('Failed to save location filter:', error);
  }
};

/**
 * 导出所有任务数据
 */
export const exportAllTasks = (): string => {
  try {
    // 从新的场景化存储中读取任务
    const sceneKey = 'dc_scene_normal';
    const sceneData = localStorage.getItem(sceneKey);
    if (!sceneData) {
      return JSON.stringify({ tasks: [], exportTime: new Date().toISOString() });
    }
    const parsed = JSON.parse(sceneData);
    const tasks = parsed.tasks || [];
    return JSON.stringify({
      tasks,
      exportTime: new Date().toISOString(),
      version: '2.0'
    }, null, 2);
  } catch (error) {
    console.error('Failed to export tasks:', error);
    return JSON.stringify({ error: 'Export failed', tasks: [] });
  }
};

/**
 * 导出单个任务数据
 */
export const exportSingleTask = (taskId: string): string | null => {
  try {
    // 从新的场景化存储中读取任务
    const sceneKey = 'dc_scene_normal';
    const sceneData = localStorage.getItem(sceneKey);

    if (!sceneData) return null;

    const parsed = JSON.parse(sceneData);
    const tasks = parsed.tasks || [];
    const task = tasks.find((t: any) => t.id === taskId);

    if (!task) return null;

    return JSON.stringify({
      task,
      exportTime: new Date().toISOString(),
      version: '2.0'
    }, null, 2);
  } catch (error) {
    console.error('Failed to export single task:', error);
    return null;
  }
};

/**
 * 导入所有任务数据（覆盖现有数据）
 */
export const importAllTasks = (jsonData: string): { success: boolean; message: string; count?: number } => {
  try {
    const data = JSON.parse(jsonData);

    // 验证数据格式
    if (!data.tasks || !Array.isArray(data.tasks)) {
      return { success: false, message: '数据格式错误：缺少 tasks 数组' };
    }

    // 验证每个任务的基本结构
    for (const task of data.tasks) {
      if (!task.id || !task.title) {
        return { success: false, message: '数据格式错误：任务缺少必要字段 (id, title)' };
      }
    }

    // 保存到新的场景化存储
    const sceneKey = 'dc_scene_normal';
    const existingData = localStorage.getItem(sceneKey);
    const meta = existingData ? JSON.parse(existingData).meta : { lastUpdate: Date.now(), version: 1 };

    localStorage.setItem(sceneKey, JSON.stringify({
      tasks: data.tasks,
      meta: { ...meta, lastUpdate: Date.now() }
    }));

    return {
      success: true,
      message: `成功导入 ${data.tasks.length} 个任务`,
      count: data.tasks.length
    };
  } catch (error) {
    console.error('Failed to import tasks:', error);
    return { success: false, message: '导入失败：JSON 解析错误' };
  }
};

/**
 * 导入单个任务数据（添加到现有数据）
 */
export const importSingleTask = (jsonData: string): { success: boolean; message: string } => {
  try {
    const data = JSON.parse(jsonData);

    // 支持两种格式：{ task: {...} } 或直接 {...}
    const task = data.task || data;

    // 验证任务的基本结构
    if (!task.id || !task.title) {
      return { success: false, message: '数据格式错误：任务缺少必要字段 (id, title)' };
    }

    // 从新的场景化存储中获取现有任务
    const sceneKey = 'dc_scene_normal';
    const sceneData = localStorage.getItem(sceneKey);
    const parsed = sceneData ? JSON.parse(sceneData) : { tasks: [], meta: { lastUpdate: Date.now(), version: 1 } };
    const tasks = parsed.tasks || [];

    // 检查是否已存在相同 ID 的任务
    const existingIndex = tasks.findIndex((t: any) => t.id === task.id);

    if (existingIndex >= 0) {
      // 更新现有任务
      tasks[existingIndex] = task;
    } else {
      // 添加新任务
      tasks.push(task);
    }

    // 保存到新的场景化存储
    localStorage.setItem(sceneKey, JSON.stringify({
      tasks,
      meta: { ...parsed.meta, lastUpdate: Date.now() }
    }));

    return {
      success: true,
      message: existingIndex >= 0 ? '任务已更新' : '任务已添加'
    };
  } catch (error) {
    console.error('Failed to import single task:', error);
    return { success: false, message: '导入失败：JSON 解析错误' };
  }
};

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // 降级方案
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      return false;
    }
  }
};
