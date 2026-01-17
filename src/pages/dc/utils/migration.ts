/**
 * 数据迁移工具
 * 将旧版 Task 数据迁移到新版格式
 */

import dayjs from 'dayjs';
import type {
  Task,
  LegacyTask,
  ActivityLog,
  MigrationResult,
  ValidationResult,
  ProgressInfo,
  Category,
  TaskStatus,
  CycleConfig,
  TimeInfo,
  CheckInConfig,
  DailyCheckInRecord,
} from '../types';
import {
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  calculateCurrentCycleNumber,
} from './mainlineTaskHelper';

// 存储键
const STORAGE_KEY = 'dc_tasks';
const BACKUP_KEY = 'dc_tasks_backup_v1';
const MIGRATION_FLAG = 'dc_migration_v2_done';

/**
 * 数据迁移工具类
 */
export class TaskMigration {
  /**
   * 检查是否需要迁移
   */
  static needsMigration(): boolean {
    // 检查迁移标记
    if (localStorage.getItem(MIGRATION_FLAG) === 'true') {
      return false;
    }

    // 检查是否有旧数据
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return false;
    }

    try {
      const tasks = JSON.parse(stored);
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return false;
      }

      // 检查第一个任务是否是旧格式
      const firstTask = tasks[0];
      return this.isLegacyTask(firstTask);
    } catch {
      return false;
    }
  }

  /**
   * 判断是否是旧格式任务（公开方法，供导入时使用）
   */
  static isLegacyTask(task: any): boolean {
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
  }

  /**
   * 执行完整迁移
   */
  static async migrate(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedCount: 0,
      failedCount: 0,
      errors: [],
    };

    try {
      // 1. 读取旧数据
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('[TaskMigration] 没有找到任务数据');
        result.success = true;
        return result;
      }

      const legacyTasks: LegacyTask[] = JSON.parse(stored);
      console.log(`[TaskMigration] 读取到 ${legacyTasks.length} 个任务`);

      // 2. 备份旧数据
      result.backup = legacyTasks;
      localStorage.setItem(BACKUP_KEY, stored);
      console.log('[TaskMigration] 已备份旧数据');

      // 3. 迁移每个任务
      const newTasks: Task[] = [];
      for (const legacyTask of legacyTasks) {
        try {
          console.log(`[TaskMigration] 正在迁移任务: ${legacyTask.id} - ${legacyTask.title}`);
          const newTask = this.migrateTask(legacyTask);
          console.log(`[TaskMigration] 迁移后的任务:`, {
            id: newTask.id,
            title: newTask.title,
            hasTime: !!newTask.time,
            hasCycle: !!newTask.cycle,
            hasProgress: !!newTask.progress,
            progressType: typeof newTask.progress,
          });
          const validation = this.validateTask(newTask);

          if (validation.valid) {
            newTasks.push(newTask);
            result.migratedCount++;
            console.log(`[TaskMigration] 任务 ${legacyTask.id} 迁移成功`);
          } else {
            result.failedCount++;
            result.errors.push({
              taskId: legacyTask.id,
              error: validation.errors?.join('; ') || '验证失败',
            });
            console.error(`[TaskMigration] 任务 ${legacyTask.id} 验证失败:`, validation.errors);
          }
        } catch (error) {
          result.failedCount++;
          result.errors.push({
            taskId: legacyTask.id,
            error: error instanceof Error ? error.message : '未知错误',
          });
          console.error(`[TaskMigration] 任务 ${legacyTask.id} 迁移出错:`, error);
        }
      }

      // 4. 保存新数据
      console.log(`[TaskMigration] 准备保存 ${newTasks.length} 个迁移后的任务`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      localStorage.setItem(MIGRATION_FLAG, 'true');
      console.log('[TaskMigration] 迁移完成，已保存新数据');
      
      // 验证保存的数据
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const savedTasks = JSON.parse(savedData);
        console.log(`[TaskMigration] 验证：保存了 ${savedTasks.length} 个任务`);
        if (savedTasks.length > 0) {
          console.log('[TaskMigration] 第一个保存的任务:', savedTasks[0]);
        }
      }

      result.success = true;
      return result;
    } catch (error) {
      result.success = false;
      result.errors.push({
        taskId: 'SYSTEM',
        error: error instanceof Error ? error.message : '迁移失败',
      });
      console.error('[TaskMigration] 迁移过程出错:', error);
      return result;
    }
  }

  /**
   * 迁移单个任务
   */
  static migrateTask(legacy: LegacyTask): Task {
    // 扩展 legacy 类型以包含所有可能的老格式字段
    const legacyAny = legacy as any;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const startDate = legacy.startDate || dayjs().format('YYYY-MM-DD');
    const totalDays = legacy.totalDays || 365;
    const cycleDays = legacy.cycleDays || 10;
    const totalCycles = legacy.totalCycles || Math.floor(totalDays / cycleDays);

    // 确定任务分类
    const category = this.determineCategory(legacy);

    // 确定当前周期（先使用老数据中的值，后面会重新计算）
    const currentCycle = this.getCurrentCycle(legacy);

    // 构建时间信息
    const time: TimeInfo = {
      createdAt: legacy.createdAt || now,
      startDate,
      endDate: dayjs(startDate).add(totalDays, 'day').format('YYYY-MM-DD'),
      completedAt: legacyAny.completedAt || (legacy.completed ? now : undefined),
      archivedAt: legacyAny.archivedAt,
    };

    // 构建周期配置
    const cycle: CycleConfig = {
      totalDays,
      cycleDays,
      totalCycles,
      currentCycle,
    };

    // 先构建基础进度信息（后面会重新计算）
    const baseProgress = this.migrateProgress(legacy, category, cycle);

    // 构建新任务
    const newTask: Task = {
      id: legacy.id,
      title: legacy.title,
      type: legacy.type,
      category,
      status: this.migrateStatus(legacy),
      from: 'normal', // 默认来源

      time,
      cycle,
      progress: baseProgress,

      icon: legacy.icon,
      encouragement: legacy.encouragement,
      themeColor: legacy.themeColor,
      priority: legacy.type !== 'mainline' ? 'medium' : undefined,

      tags: legacy.tags || (legacy.tagId ? { normalTagId: legacy.tagId } : undefined),

      activities: this.migrateHistory(legacy),
    };

    // 迁移类型特定配置
    if (category === 'NUMERIC') {
      newTask.numericConfig = this.migrateNumericConfig(legacy);
    }
    if (category === 'CHECKLIST') {
      newTask.checklistConfig = this.migrateChecklistConfig(legacy);
    }
    if (category === 'CHECK_IN') {
      newTask.checkInConfig = this.migrateCheckInConfig(legacy);
    }

    // 重新计算周期和进度信息
    this.recalculateCycleAndProgress(newTask);

    return newTask;
  }

  /**
   * 确定任务分类
   */
  private static determineCategory(legacy: LegacyTask): Category {
    // 优先从 mainlineType 获取
    if (legacy.mainlineType) {
      return legacy.mainlineType as Category;
    }
    // 从 mainlineTask 获取
    if (legacy.mainlineTask?.mainlineType) {
      return legacy.mainlineTask.mainlineType as Category;
    }
    // 根据配置推断
    if (legacy.mainlineTask?.numericConfig) {
      return 'NUMERIC';
    }
    if (legacy.mainlineTask?.checklistConfig) {
      return 'CHECKLIST';
    }
    // 默认为打卡型
    return 'CHECK_IN';
  }

  /**
   * 获取当前周期
   */
  private static getCurrentCycle(legacy: LegacyTask): number {
    // 从 mainlineTask 获取
    if (legacy.mainlineTask?.cycleConfig?.currentCycle) {
      return legacy.mainlineTask.cycleConfig.currentCycle;
    }
    // 根据 currentDay 计算
    if (legacy.currentDay && legacy.cycleDays) {
      return Math.floor(legacy.currentDay / legacy.cycleDays) + 1;
    }
    return 1;
  }

  /**
   * 迁移状态
   */
  private static migrateStatus(legacy: LegacyTask): TaskStatus {
    // 优先从 mainlineTask.status 获取（更准确）
    if (legacy.mainlineTask?.status) {
      const mainlineStatus = legacy.mainlineTask.status.toUpperCase();
      if (mainlineStatus === 'COMPLETED' || mainlineStatus === 'ARCHIVED' || mainlineStatus === 'ACTIVE') {
        return mainlineStatus as TaskStatus;
      }
    }
    
    // 从任务根级别的 status 获取
    if (legacy.status) {
      const status = legacy.status.toUpperCase();
      if (status === 'COMPLETED' || status === 'ARCHIVED' || status === 'ACTIVE') {
        return status as TaskStatus;
      }
    }
    
    // 根据 completed 字段判断
    if (legacy.completed) {
      return 'COMPLETED';
    }
    
    // 默认为 ACTIVE
    return 'ACTIVE';
  }

  /**
   * 迁移进度信息
   */
  private static migrateProgress(
    legacy: LegacyTask,
    category: Category,
    cycle: CycleConfig
  ): ProgressInfo {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // 如果已经是新格式的 ProgressInfo
    const legacyAny = legacy as any;
    if (
      legacy.progress &&
      typeof legacy.progress === 'object' &&
      'lastUpdatedAt' in legacy.progress
    ) {
      return legacy.progress as ProgressInfo;
    }

    // 从 mainlineTask.progress 获取
    // 老格式中 progress 可能是对象但没有 lastUpdatedAt
    if (
      legacy.progress &&
      typeof legacy.progress === 'object' &&
      'totalPercentage' in legacy.progress
    ) {
      const progressObj = legacy.progress as any;
      return {
        totalPercentage: progressObj.totalPercentage || 0,
        cyclePercentage: progressObj.currentCyclePercentage || 0,
        cycleStartValue: progressObj.currentCycleStart || 0,
        cycleTargetValue: progressObj.currentCycleTarget || 0,
        cycleAchieved: progressObj.currentCycleAchieved || 0,
        cycleRemaining: progressObj.currentCycleRemaining || 0,
        lastUpdatedAt: now,
      };
    }

    const mainlineProgress = legacy.mainlineTask?.progress;
    if (mainlineProgress && typeof mainlineProgress === 'object') {
      return {
        totalPercentage: mainlineProgress.totalPercentage || 0,
        cyclePercentage: mainlineProgress.currentCyclePercentage || 0,
        cycleStartValue: mainlineProgress.currentCycleStart || 0,
        cycleTargetValue: mainlineProgress.currentCycleTarget || 0,
        cycleAchieved: mainlineProgress.currentCycleAchieved || 0,
        cycleRemaining: mainlineProgress.currentCycleRemaining || 0,
        lastUpdatedAt: now,
      };
    }

    // 旧格式：progress 是数字
    const totalPercentage = typeof legacy.progress === 'number' ? legacy.progress : 0;

    return {
      totalPercentage,
      cyclePercentage: 0,
      cycleStartValue: 0,
      cycleTargetValue: 0,
      cycleAchieved: 0,
      cycleRemaining: 0,
      lastUpdatedAt: now,
    };
  }

  /**
   * 重新计算周期和进度信息
   */
  private static recalculateCycleAndProgress(task: Task): void {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const today = dayjs().format('YYYY-MM-DD');
    
    // 检查任务是否已超过结束日期
    this.checkAndUpdateStatus(task, today);
    
    // 计算当前周期编号
    const currentCycleNumber = calculateCurrentCycleNumber(task);
    task.cycle.currentCycle = currentCycleNumber;
    
    // 根据任务类型计算进度
    switch (task.category) {
      case 'NUMERIC': {
        if (task.numericConfig) {
          const progressData = calculateNumericProgress(
            { numericConfig: task.numericConfig, cycle: task.cycle } as any,
            { currentCycleNumber }
          );
          task.progress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: progressData.currentCycleStart,
            cycleTargetValue: progressData.currentCycleTarget,
            cycleAchieved: 0,
            cycleRemaining: Math.abs(progressData.currentCycleTarget - task.numericConfig.currentValue),
            lastUpdatedAt: now,
          };
        }
        break;
      }
      case 'CHECKLIST': {
        if (task.checklistConfig) {
          const progressData = calculateChecklistProgress(
            { checklistConfig: task.checklistConfig, cycle: task.cycle } as any
          );
          task.progress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: 0,
            cycleTargetValue: progressData.currentCycleTarget,
            cycleAchieved: progressData.currentCycleCompleted,
            cycleRemaining: Math.max(0, progressData.currentCycleTarget - progressData.currentCycleCompleted),
            lastUpdatedAt: now,
          };
        }
        break;
      }
      case 'CHECK_IN': {
        if (task.checkInConfig) {
          const progressData = calculateCheckInProgress(
            { 
              checkInConfig: task.checkInConfig, 
              cycle: task.cycle, 
              time: task.time,
              createdAt: task.time.createdAt 
            } as any
          );
          task.progress = {
            totalPercentage: progressData.totalProgress,
            cyclePercentage: progressData.cycleProgress,
            cycleStartValue: 0,
            cycleTargetValue: task.checkInConfig.perCycleTarget,
            cycleAchieved: progressData.currentCycleCheckIns,
            cycleRemaining: Math.max(0, task.checkInConfig.perCycleTarget - progressData.currentCycleCheckIns),
            lastUpdatedAt: now,
          };
          
          // 计算今日进度
          task.todayProgress = this.calculateTodayProgress(task, today);
        }
        break;
      }
    }
  }

  /**
   * 检查并更新任务状态（处理超过结束日期的情况）
   */
  private static checkAndUpdateStatus(task: Task, today: string): void {
    // 如果任务已经是 COMPLETED 或 ARCHIVED，不需要处理
    if (task.status === 'COMPLETED' || task.status === 'ARCHIVED') {
      // 设置 isPlanEnded 标记
      task.isPlanEnded = true;
      return;
    }
    
    // 检查是否超过结束日期
    const endDate = task.time.endDate;
    if (endDate && dayjs(today).isAfter(dayjs(endDate))) {
      // 超过结束日期，标记为计划已结束
      task.isPlanEnded = true;
      // 如果任务还是 ACTIVE 状态，可以考虑自动归档
      // 但这里保持原状态，只设置 isPlanEnded 标记
      // 让用户自己决定是否归档
    }
  }

  /**
   * 计算今日进度
   */
  private static calculateTodayProgress(task: Task, today: string): Task['todayProgress'] {
    if (!task.checkInConfig) return undefined;
    
    const todayRecord = task.checkInConfig.records.find(r => r.date === today);
    const todayCount = todayRecord?.entries?.length || 0;
    const todayValue = todayRecord?.totalValue || 0;
    
    const dailyTarget = task.checkInConfig.dailyTargetMinutes || 
                        task.checkInConfig.dailyMaxTimes || 
                        task.checkInConfig.dailyTargetValue || 1;
    
    return {
      canCheckIn: task.checkInConfig.allowMultiplePerDay || todayCount === 0,
      todayCount,
      todayValue,
      isCompleted: todayValue >= dailyTarget || todayCount >= (task.checkInConfig.dailyMaxTimes || 1),
      dailyTarget,
      lastUpdatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  /**
   * 迁移数值型配置
   */
  private static migrateNumericConfig(legacy: LegacyTask): Task['numericConfig'] {
    // 老格式中 numericConfig 可能直接在任务上，也可能在 mainlineTask 下
    const legacyAny = legacy as any;
    const config = legacyAny.numericConfig || legacy.mainlineTask?.numericConfig;
    if (!config) {
      return undefined;
    }
    return {
      direction: config.direction,
      unit: config.unit,
      startValue: config.startValue,
      targetValue: config.targetValue,
      currentValue: config.currentValue,
      perCycleTarget: config.perCycleTarget,
      perDayAverage: config.perDayAverage,
      originalStartValue: config.originalStartValue,
      originalPerCycleTarget: config.originalPerCycleTarget,
    };
  }

  /**
   * 迁移清单型配置
   */
  private static migrateChecklistConfig(legacy: LegacyTask): Task['checklistConfig'] {
    // 老格式中 checklistConfig 可能直接在任务上，也可能在 mainlineTask 下
    const legacyAny = legacy as any;
    const config = legacyAny.checklistConfig || legacy.mainlineTask?.checklistConfig;
    if (!config) {
      return undefined;
    }
    return {
      totalItems: config.totalItems,
      completedItems: config.completedItems,
      perCycleTarget: config.perCycleTarget,
      items: config.items || [],
    };
  }

  /**
   * 迁移打卡配置
   */
  private static migrateCheckInConfig(legacy: LegacyTask): CheckInConfig | undefined {
    // 老格式中 checkInConfig 可能直接在任务上，也可能在 mainlineTask 下
    const legacyAny = legacy as any;
    const config = legacyAny.checkInConfig || legacy.mainlineTask?.checkInConfig || {};
    const checkIns = legacy.checkIns || [];

    // 转换打卡记录为新格式
    const records: DailyCheckInRecord[] = [];
    const recordMap = new Map<string, DailyCheckInRecord>();

    for (const checkIn of checkIns) {
      const date = checkIn.date || dayjs(checkIn.timestamp).format('YYYY-MM-DD');

      if (!recordMap.has(date)) {
        recordMap.set(date, {
          date,
          checked: true,
          entries: [],
          totalValue: 0,
        });
      }

      const record = recordMap.get(date)!;
      record.entries.push({
        id: checkIn.id,
        time: dayjs(checkIn.timestamp).format('HH:mm:ss'),
        value: checkIn.value,
      });
      record.totalValue = (record.totalValue || 0) + (checkIn.value || 0);
    }

    records.push(...recordMap.values());

    return {
      unit: config.unit || 'TIMES',
      dailyMaxTimes: config.dailyMaxTimes,
      cycleTargetTimes: config.cycleTargetTimes,
      dailyTargetMinutes: config.dailyTargetMinutes,
      cycleTargetMinutes: config.cycleTargetMinutes,
      quickDurations: config.quickDurations,
      dailyTargetValue: config.dailyTargetValue,
      cycleTargetValue: config.cycleTargetValue,
      valueUnit: config.valueUnit,
      allowMultiplePerDay: config.allowMultiplePerDay ?? false,
      weekendExempt: config.weekendExempt ?? false,
      perCycleTarget: config.perCycleTarget || legacy.minCheckInsPerCycle || 3,
      currentStreak: config.currentStreak || 0,
      longestStreak: config.longestStreak || 0,
      checkInRate: config.checkInRate || 0,
      streaks: config.streaks || [],
      records,
    };
  }

  /**
   * 迁移历史记录
   */
  private static migrateHistory(legacy: LegacyTask): ActivityLog[] {
    const activities: ActivityLog[] = [];
    // 老格式中 history 可能直接在任务上，也可能在 mainlineTask 下
    const legacyAny = legacy as any;
    const history = legacyAny.history || legacy.mainlineTask?.history || [];
    const createdAt = legacy.createdAt || dayjs().format('YYYY-MM-DD HH:mm:ss');

    // 添加创建日志
    activities.push({
      id: `create-${legacy.id}`,
      date: dayjs(createdAt).format('YYYY-MM-DD'),
      timestamp: dayjs(createdAt).valueOf(),
      type: 'CREATE',
    });

    // 转换旧历史记录
    for (const record of history) {
      const date = record.date || dayjs().format('YYYY-MM-DD');
      const timestamp = dayjs(date).valueOf();

      if (record.type === 'value_update' || record.type === 'UPDATE_VALUE' || record.type === 'NUMERIC_UPDATE') {
        activities.push({
          id: `value-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          date,
          timestamp,
          type: 'UPDATE_VALUE',
          oldValue: record.oldValue ?? (record.value - (record.change || 0)),
          newValue: record.value || 0,
          delta: record.change || ((record.value || 0) - (record.oldValue || 0)),
          note: record.note,
        });
      } else if (record.type === 'check_in' || record.type === 'CHECK_IN') {
        activities.push({
          id: `checkin-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          date,
          timestamp,
          type: 'CHECK_IN',
          value: record.value,
          count: 1,
          note: record.note,
        });
      }
    }

    // 从 checkIns 生成打卡日志
    const checkIns = legacy.checkIns || [];
    for (const checkIn of checkIns) {
      const date = checkIn.date || dayjs(checkIn.timestamp).format('YYYY-MM-DD');
      activities.push({
        id: `checkin-${checkIn.id}`,
        date,
        timestamp: checkIn.timestamp,
        type: 'CHECK_IN',
        value: checkIn.value,
        count: 1,
      });
    }

    // 按时间排序
    activities.sort((a, b) => a.timestamp - b.timestamp);

    return activities;
  }

  /**
   * 验证任务数据
   */
  private static validateTask(task: Task): ValidationResult {
    const errors: string[] = [];

    if (!task.id) errors.push('缺少 ID');
    if (!task.title) errors.push('缺少标题');
    if (!task.type) errors.push('缺少类型');
    if (!task.category) errors.push('缺少分类');
    if (!task.status) errors.push('缺少状态');
    if (!task.from) errors.push('缺少来源');
    if (!task.time) errors.push('缺少时间信息');
    if (!task.cycle) errors.push('缺少周期配置');
    if (!task.progress) errors.push('缺少进度信息');
    if (!Array.isArray(task.activities)) errors.push('活动日志格式错误');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 回滚迁移
   */
  static rollback(): boolean {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (!backup) {
        return false;
      }

      localStorage.setItem(STORAGE_KEY, backup);
      localStorage.removeItem(MIGRATION_FLAG);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 清理备份
   */
  static cleanupBackup(): void {
    localStorage.removeItem(BACKUP_KEY);
  }

  /**
   * 获取迁移状态
   */
  static getMigrationStatus(): {
    migrated: boolean;
    hasBackup: boolean;
  } {
    return {
      migrated: localStorage.getItem(MIGRATION_FLAG) === 'true',
      hasBackup: localStorage.getItem(BACKUP_KEY) !== null,
    };
  }

  /**
   * 强制重新迁移（用于调试）
   */
  static resetMigration(): void {
    localStorage.removeItem(MIGRATION_FLAG);
  }
}

/**
 * 创建新任务的工厂函数
 */
export function createTask(data: {
  title: string;
  type: Task['type'];
  category: Task['category'];
  from: Task['from'];
  startDate: string;
  totalDays: number;
  cycleDays: number;
  icon?: string;
  encouragement?: string;
  priority?: Task['priority'];
  themeColor?: string;
  tags?: Task['tags'];
  numericConfig?: Partial<Task['numericConfig']>;
  checklistConfig?: Partial<Task['checklistConfig']>;
  checkInConfig?: Partial<Task['checkInConfig']>;
}): Task {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const totalCycles = Math.floor(data.totalDays / data.cycleDays);

  const task: Task = {
    id,
    title: data.title,
    type: data.type,
    category: data.category,
    status: 'ACTIVE',
    from: data.from,

    time: {
      createdAt: now,
      startDate: data.startDate,
      endDate: dayjs(data.startDate).add(data.totalDays, 'day').format('YYYY-MM-DD'),
    },

    cycle: {
      totalDays: data.totalDays,
      cycleDays: data.cycleDays,
      totalCycles,
      currentCycle: 1,
    },

    progress: {
      totalPercentage: 0,
      cyclePercentage: 0,
      cycleStartValue: 0,
      cycleTargetValue: 0,
      cycleAchieved: 0,
      cycleRemaining: 0,
      lastUpdatedAt: now,
    },

    icon: data.icon,
    encouragement: data.encouragement,
    priority: data.priority,
    themeColor: data.themeColor,
    tags: data.tags,

    activities: [
      {
        id: `create-${id}`,
        date: dayjs().format('YYYY-MM-DD'),
        timestamp: Date.now(),
        type: 'CREATE',
      },
    ],
  };

  // 添加类型特定配置
  if (data.category === 'NUMERIC' && data.numericConfig) {
    const nc = data.numericConfig;
    const perCycleTarget = nc.perCycleTarget || Math.abs((nc.targetValue || 0) - (nc.startValue || 0)) / totalCycles;
    task.numericConfig = {
      direction: nc.direction || 'INCREASE',
      unit: nc.unit || '',
      startValue: nc.startValue || 0,
      targetValue: nc.targetValue || 0,
      currentValue: nc.startValue || 0,
      perCycleTarget,
      perDayAverage: perCycleTarget / data.cycleDays,
      originalStartValue: nc.startValue,
      originalPerCycleTarget: perCycleTarget,
    };
    task.progress.cycleStartValue = nc.startValue || 0;
    task.progress.cycleTargetValue = nc.direction === 'DECREASE'
      ? (nc.startValue || 0) - perCycleTarget
      : (nc.startValue || 0) + perCycleTarget;
    task.progress.cycleRemaining = perCycleTarget;
  }

  if (data.category === 'CHECKLIST' && data.checklistConfig) {
    const cc = data.checklistConfig;
    task.checklistConfig = {
      totalItems: cc.totalItems || 0,
      completedItems: 0,
      perCycleTarget: cc.perCycleTarget || 1,
      items: cc.items || [],
    };
    task.progress.cycleTargetValue = cc.perCycleTarget || 1;
    task.progress.cycleRemaining = cc.perCycleTarget || 1;
  }

  if (data.category === 'CHECK_IN' && data.checkInConfig) {
    const cic = data.checkInConfig;
    task.checkInConfig = {
      unit: cic.unit || 'TIMES',
      dailyMaxTimes: cic.dailyMaxTimes,
      cycleTargetTimes: cic.cycleTargetTimes,
      dailyTargetMinutes: cic.dailyTargetMinutes,
      cycleTargetMinutes: cic.cycleTargetMinutes,
      quickDurations: cic.quickDurations,
      dailyTargetValue: cic.dailyTargetValue,
      cycleTargetValue: cic.cycleTargetValue,
      valueUnit: cic.valueUnit,
      allowMultiplePerDay: cic.allowMultiplePerDay ?? false,
      weekendExempt: cic.weekendExempt ?? false,
      perCycleTarget: cic.perCycleTarget || 3,
      currentStreak: 0,
      longestStreak: 0,
      checkInRate: 0,
      streaks: [],
      records: [],
    };
    task.progress.cycleTargetValue = cic.perCycleTarget || 3;
    task.progress.cycleRemaining = cic.perCycleTarget || 3;
  }

  return task;
}

export default TaskMigration;







