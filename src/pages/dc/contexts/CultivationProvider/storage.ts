/**
 * 修仙数据存储工具
 */

import type { CultivationData, CultivationHistory } from '../../types/cultivation';
import { INITIAL_CULTIVATION_DATA } from '../../types/cultivation';

const STORAGE_KEY = 'dc_cultivation_data';
const HISTORY_STORAGE_KEY = 'dc_cultivation_history';
const MAX_HISTORY_WEEKS = 12; // 保留最近12周的历史记录

/**
 * 加载修仙数据
 */
export function loadCultivationData(): CultivationData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合并默认值，确保新字段有默认值
      return {
        ...INITIAL_CULTIVATION_DATA,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load cultivation data:', error);
  }
  return { ...INITIAL_CULTIVATION_DATA };
}

/**
 * 保存修仙数据
 */
export function saveCultivationData(data: CultivationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save cultivation data:', error);
  }
}

/**
 * 加载修为历史记录
 */
export function loadCultivationHistory(): CultivationHistory {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cultivation history:', error);
  }
  return {};
}

/**
 * 保存修为历史记录
 */
export function saveCultivationHistory(history: CultivationHistory): void {
  try {
    // 清理旧数据，只保留最近的周
    const cleanedHistory = cleanOldHistory(history);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(cleanedHistory));
  } catch (error) {
    console.error('Failed to save cultivation history:', error);
  }
}

/**
 * 清理旧的历史记录
 */
function cleanOldHistory(history: CultivationHistory): CultivationHistory {
  const weekKeys = Object.keys(history).sort().reverse();
  
  if (weekKeys.length <= MAX_HISTORY_WEEKS) {
    return history;
  }
  
  const keysToKeep = weekKeys.slice(0, MAX_HISTORY_WEEKS);
  const cleanedHistory: CultivationHistory = {};
  
  for (const key of keysToKeep) {
    cleanedHistory[key] = history[key];
  }
  
  return cleanedHistory;
}

/**
 * 清除所有修仙数据
 */
export function clearCultivationData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cultivation data:', error);
  }
}

/**
 * 导出修仙数据
 */
export function exportCultivationData(): string {
  const data = loadCultivationData();
  const history = loadCultivationHistory();
  
  return JSON.stringify({
    data,
    history,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  }, null, 2);
}

/**
 * 导入修仙数据
 */
export function importCultivationData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.data || typeof parsed.data !== 'object') {
      console.error('Invalid cultivation data format');
      return false;
    }
    
    // 验证必要字段
    const requiredFields = ['realm', 'currentExp', 'totalExpGained'];
    for (const field of requiredFields) {
      if (!(field in parsed.data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    saveCultivationData(parsed.data);
    
    if (parsed.history && typeof parsed.history === 'object') {
      saveCultivationHistory(parsed.history);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import cultivation data:', error);
    return false;
  }
}
