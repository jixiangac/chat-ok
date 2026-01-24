/**
 * UI 状态 Key 常量定义
 * 推荐的 key 命名规范
 */

export const UI_KEYS = {
  // Tab 相关
  ACTIVE_TAB: 'activeTab',
  TAB_HISTORY: 'tabHistory',
  
  // 弹窗相关
  MODAL_SETTINGS: 'modal.settings',
  MODAL_ARCHIVE: 'modal.archive',
  MODAL_CREATE_TASK: 'modal.createTask',
  MODAL_CREATE_TASK_VISIBLE: 'modal.createTask.visible',
  MODAL_TASK_DETAIL: 'modal.taskDetail',
  MODAL_TODAY_MUST_COMPLETE: 'modal.todayMustComplete',
  MODAL_TODAY_MUST_COMPLETE_VISIBLE: 'modal.todayMustComplete.visible',
  MODAL_DAILY_VIEW: 'modal.dailyView',
  MODAL_DAILY_VIEW_VISIBLE: 'modal.dailyView.visible',
  // 度假模式弹窗
  MODAL_VACATION_CREATE_TRIP_VISIBLE: 'modal.vacation.createTrip.visible',
  MODAL_VACATION_ADD_GOAL_VISIBLE: 'modal.vacation.addGoal.visible',
  // 纪念日模式弹窗
  MODAL_MEMORIAL_CREATE_VISIBLE: 'modal.memorial.create.visible',
  MODAL_MEMORIAL_DETAIL_VISIBLE: 'modal.memorial.detail.visible',
  // 支线任务弹窗
  MODAL_ALL_SIDELINE_VISIBLE: 'modal.allSideline.visible',
  
  // 滚动位置
  SCROLL_NORMAL: 'scroll.normal',
  SCROLL_VACATION: 'scroll.vacation',
  SCROLL_MEMORIAL: 'scroll.memorial',
  
  // 视图模式
  VIEW_MODE: 'viewMode',
  VIEW_MODE_NORMAL: 'viewMode.normal',
  VIEW_MODE_VACATION: 'viewMode.vacation',
  
  // 过滤器
  FILTER_SHOW_COMPLETED: 'filter.showCompleted',
  FILTER_TAG_ID: 'filter.tagId',
  FILTER_SORT_BY: 'filter.sortBy',
  
  // 展开/折叠状态
  EXPAND_MAINLINE: 'expand.mainline',
  EXPAND_SIDELINE: 'expand.sideline',
  
  // 其他
  LAST_VISIT: 'lastVisit',
  TUTORIAL_COMPLETED: 'tutorial.completed',
  ADD_TRIGGER: 'addTrigger',
} as const;

export type UIKey = typeof UI_KEYS[keyof typeof UI_KEYS];


