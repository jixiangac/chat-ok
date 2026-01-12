/**
 * 响应式工具函数
 * 用于计算屏幕高度、动态调整布局等
 */

/** 布局常量 */
export const LAYOUT_CONSTANTS = {
  /** 头部高度 */
  HEADER_HEIGHT: 60,
  /** 主线任务卡片高度 */
  MAINLINE_CARD_HEIGHT: 200,
  /** 底部栏高度 */
  BOTTOM_BAR_HEIGHT: 80,
  /** 支线任务卡片高度 */
  SIDELINE_CARD_HEIGHT: 120,
  /** 网格间距 */
  GRID_GAP: 14,
  /** 最大行数 */
  MAX_ROWS: 3,
  /** 每行任务数 */
  TASKS_PER_ROW: 2,
  /** 最小显示任务数 */
  MIN_VISIBLE_TASKS: 2,
  /** 最大显示任务数 */
  MAX_VISIBLE_TASKS: 6,
};

/**
 * 计算支线任务网格可显示的任务数量
 * 根据屏幕高度动态计算，最多显示3行6个任务
 * @returns 可显示的任务数量
 */
export const calculateVisibleSidelineTasks = (): number => {
  
  const {
    HEADER_HEIGHT,
    MAINLINE_CARD_HEIGHT,
    BOTTOM_BAR_HEIGHT,
    SIDELINE_CARD_HEIGHT,
    GRID_GAP,
    MAX_ROWS,
    TASKS_PER_ROW,
    MIN_VISIBLE_TASKS,
    MAX_VISIBLE_TASKS,
  } = LAYOUT_CONSTANTS;

  const safeAreaHeight = window.innerHeight - MAINLINE_CARD_HEIGHT;

  // 计算可用高度
  const availableHeight = safeAreaHeight - HEADER_HEIGHT - MAINLINE_CARD_HEIGHT - BOTTOM_BAR_HEIGHT;

  // 计算可容纳的行数
  const possibleRows = Math.floor((availableHeight + GRID_GAP) / (SIDELINE_CARD_HEIGHT + GRID_GAP));
  const actualRows = Math.min(Math.max(possibleRows, 1), MAX_ROWS);

  // 计算任务数量
  const taskCount = actualRows * TASKS_PER_ROW;

  // 确保在合理范围内
  return Math.min(Math.max(taskCount, MIN_VISIBLE_TASKS), MAX_VISIBLE_TASKS);
};

/**
 * 获取当前屏幕尺寸类型
 * @returns 屏幕尺寸类型
 */
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg';

export const getScreenSize = (): ScreenSize => {
  const width = window.innerWidth;
  if (width < 375) return 'xs';
  if (width < 414) return 'sm';
  if (width < 768) return 'md';
  return 'lg';
};

/**
 * 判断是否为小屏幕设备
 * @returns 是否为小屏幕
 */
export const isSmallScreen = (): boolean => {
  return window.innerWidth < 375;
};

/**
 * 判断是否为移动端设备
 * @returns 是否为移动端
 */
export const isMobileDevice = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * 获取安全区域内边距
 * @returns 安全区域内边距
 */
export const getSafeAreaInsets = (): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
    bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
    left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10),
    right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10),
  };
};

/**
 * 计算弹窗最大高度
 * @param padding 额外的内边距
 * @returns 弹窗最大高度
 */
export const calculateModalMaxHeight = (padding: number = 40): number => {
  const safeAreaInsets = getSafeAreaInsets();
  return window.innerHeight - safeAreaInsets.top - safeAreaInsets.bottom - padding;
};

/**
 * 根据屏幕宽度计算网格列数
 * @param minColumnWidth 最小列宽
 * @param maxColumns 最大列数
 * @param containerPadding 容器内边距
 * @returns 列数
 */
export const calculateGridColumns = (
  minColumnWidth: number = 150,
  maxColumns: number = 2,
  containerPadding: number = 32
): number => {
  const availableWidth = window.innerWidth - containerPadding;
  const possibleColumns = Math.floor(availableWidth / minColumnWidth);
  return Math.min(Math.max(possibleColumns, 1), maxColumns);
};

/**
 * 检查用户是否偏好减少动画
 * @returns 是否偏好减少动画
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
