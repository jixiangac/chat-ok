/**
 * 日期追踪工具
 * 
 * 功能：
 * 1. 管理日期状态，检测日期变更
 * 2. 支持测试日期功能
 * 3. 使用 localStorage 持久化存储
 */

import dayjs from 'dayjs';

// localStorage keys
const STORAGE_KEYS = {
  LAST_VISITED_DATE: 'dc_last_visited_date',  // 上次访问日期
  TEST_DATE: 'dc_test_date',                   // 测试日期（可选）
};

// 日期格式
const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * 日期变更信息
 */
export interface DateChangeInfo {
  oldDate: string;
  newDate: string;
  daysDiff: number;  // 相差天数
}

/**
 * Task 类型（简化版，仅用于获取 debugDayOffset）
 */
interface TaskWithOffset {
  debugDayOffset?: number;
}

/**
 * 获取当前有效日期（优先使用测试日期）
 * @param task 可选的任务对象，如果传入且有 debugDayOffset，则在基础日期上偏移
 * @returns 当前日期字符串 YYYY-MM-DD
 */
export function getCurrentDate(task?: any): string {
  const testDate = getTestDate();
  // 基础日期：优先使用测试日期，否则使用系统日期
  const baseDate = testDate || dayjs().format(DATE_FORMAT);
  // console.log(task,'tasktasktasktask')
  // 如果传入了 task 且有 debugDayOffset，则在基础日期上偏移
  const offset = task?.debugDayOffset || 0;
  if (offset === 0) {
    return baseDate;
  }
  
  return dayjs(baseDate).add(offset, 'day').format(DATE_FORMAT);
}

/**
 * 获取真实系统日期（不受测试日期影响）
 * @returns 真实系统日期字符串 YYYY-MM-DD
 */
export function getRealSystemDate(): string {
  return dayjs().format(DATE_FORMAT);
}

/**
 * 获取上次访问日期
 * @returns 上次访问日期，如果不存在则返回 null
 */
export function getLastVisitedDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_VISITED_DATE);
  } catch (error) {
    console.error('读取上次访问日期失败:', error);
    return null;
  }
}

/**
 * 设置上次访问日期
 * @param date 日期字符串 YYYY-MM-DD
 */
export function setLastVisitedDate(date: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISITED_DATE, date);
  } catch (error) {
    console.error('保存上次访问日期失败:', error);
  }
}

/**
 * 检测日期是否变更
 * @returns 日期变更信息，如果没有变更则返回 null
 */
export function checkDateChange(): DateChangeInfo | null {
  const currentDate = getCurrentDate();
  const lastVisitedDate = getLastVisitedDate();
  
  // 首次访问，设置当前日期并返回 null
  if (!lastVisitedDate) {
    setLastVisitedDate(currentDate);
    return null;
  }
  
  // 日期相同，无变更
  if (lastVisitedDate === currentDate) {
    return null;
  }
  
  // 计算相差天数
  const daysDiff = dayjs(currentDate).diff(dayjs(lastVisitedDate), 'day');
  
  // 更新上次访问日期
  setLastVisitedDate(currentDate);
  
  return {
    oldDate: lastVisitedDate,
    newDate: currentDate,
    daysDiff,
  };
}

/**
 * 获取测试日期
 * @returns 测试日期，如果未设置则返回 null
 */
export function getTestDate(): string | null {
  try {
    const testDate = localStorage.getItem(STORAGE_KEYS.TEST_DATE);
    if (testDate) {
      // 验证日期格式
      if (dayjs(testDate, DATE_FORMAT, true).isValid()) {
        return testDate;
      }
      // 格式无效，清除
      localStorage.removeItem(STORAGE_KEYS.TEST_DATE);
    }
    return null;
  } catch (error) {
    console.error('读取测试日期失败:', error);
    return null;
  }
}

/**
 * 设置测试日期
 * @param date 日期字符串 YYYY-MM-DD
 * @returns 是否设置成功
 */
export function setTestDate(date: string): boolean {
  try {
    // 验证日期格式
    if (!dayjs(date, DATE_FORMAT, true).isValid()) {
      console.error('无效的日期格式:', date);
      return false;
    }
    localStorage.setItem(STORAGE_KEYS.TEST_DATE, date);
    return true;
  } catch (error) {
    console.error('保存测试日期失败:', error);
    return false;
  }
}

/**
 * 清除测试日期
 */
export function clearTestDate(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEST_DATE);
  } catch (error) {
    console.error('清除测试日期失败:', error);
  }
}

/**
 * 检查是否设置了测试日期
 * @returns 是否设置了测试日期
 */
export function hasTestDate(): boolean {
  return getTestDate() !== null;
}

/**
 * 强制触发日期变更检测（用于测试）
 * 将上次访问日期设置为指定日期，然后检测变更
 * @param oldDate 模拟的旧日期
 * @returns 日期变更信息
 */
export function forceCheckDateChange(oldDate: string): DateChangeInfo | null {
  const currentDate = getCurrentDate();
  
  if (oldDate === currentDate) {
    return null;
  }
  
  const daysDiff = dayjs(currentDate).diff(dayjs(oldDate), 'day');
  
  // 更新上次访问日期为当前日期
  setLastVisitedDate(currentDate);
  
  return {
    oldDate,
    newDate: currentDate,
    daysDiff,
  };
}

