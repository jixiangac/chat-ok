/**
 * 一日视图弹窗组件
 * 展示今日任务的时段分布 - 小票风格
 */

import React, { useMemo, useState } from 'react';
import { Popup, SafeArea, Toast } from 'antd-mobile';
import {
  Check, Sun, Sunset, Moon, X, RefreshCw, ListChecks
} from 'lucide-react';
import dayjs from 'dayjs';
import type { Task, TagType } from '../../types';
import { getUsedLocationTags } from '../../utils/tagStorage';
import { clearDailyViewCache, hasTodayRefreshed, markTodayRefreshed, calculateTodayProgress, getCurrentDate } from '../../utils';
import { useTaskContext, useScene, useCultivation, useApp } from '../../contexts';
import { LocationFilter } from '../../components';
import { SPIRIT_JADE_COST } from '../../constants/spiritJade';
import styles from './styles.module.css';

// 圆圈进度条组件（与支线卡片一致）
interface CircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted?: boolean;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ 
  progress, 
  size = 16, 
  strokeWidth = 2,
  isCompleted = false 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isCompleted) {
    return (
      <div className={styles.checkIcon}>
        <Check size={12} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(139, 134, 128, 0.2)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#6B6560"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
};

interface DailyViewPopupProps {
  visible: boolean;
  onClose: () => void;
}

// 时段配置
const TIME_PERIODS = {
  morning: { start: 6, end: 12, label: '上午', icon: Sun },
  afternoon: { start: 12, end: 18, label: '下午', icon: Sunset },
  evening: { start: 18, end: 24, label: '晚上', icon: Moon },
};

// 老黄历语录
const ALMANAC_QUOTES = [
  '宜：专注工作，忌：拖延症发作',
  '宜：早起锻炼，忌：熬夜追剧',
  '宜：整理思绪，忌：杂念丛生',
  '宜：稳扎稳打，忌：急于求成',
  '宜：静心阅读，忌：浮躁不安',
  '宜：与人为善，忌：斤斤计较',
  '宜：脚踏实地，忌：好高骛远',
  '宜：保持微笑，忌：愁眉苦脸',
  '宜：勤俭节约，忌：铺张浪费',
  '宜：虚心学习，忌：固步自封',
  '宜：积极进取，忌：消极怠工',
  '宜：珍惜时间，忌：虚度光阴',
  '宜：心平气和，忌：大动肝火',
  '宜：未雨绸缪，忌：临时抱佛脚',
  '宜：持之以恒，忌：三天打鱼',
];

// 获取今日老黄历（基于日期的伪随机，使用测试日期）
const getTodayAlmanac = () => {
  const effectiveToday = getCurrentDate();
  const todayDate = dayjs(effectiveToday);
  const day = todayDate.date();
  const month = todayDate.month();
  return ALMANAC_QUOTES[(day + month) % ALMANAC_QUOTES.length];
};

interface TaskWithPeriod extends Task {
  period: 'morning' | 'afternoon' | 'evening';
  displayTime: string;
  isCompleted: boolean;
  hasProgress: boolean;
  dailyProgress: number;
  /** 显示标题（带目标信息） */
  displayTitle: string;
  /** 是否是清单类型 */
  isChecklist: boolean;
}

const DailyViewPopup: React.FC<DailyViewPopupProps> = ({
  visible,
  onClose,
}) => {
  const { setSelectedTaskId } = useTaskContext();
  const { normal, refreshScene } = useScene();
  const { systemDate } = useApp();
  const {
    canSpendSpiritJade,
    spendSpiritJade,
    spiritJadeData
  } = useCultivation();

  // 检查今日是否已刷新
  const [hasRefreshed, setHasRefreshed] = useState(() => hasTodayRefreshed());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 检查今日是否有进度（进度大于0时也禁止刷新）
  const hasTodayProgress = useMemo(() => {
    return normal.todayProgress.percentage > 0;
  }, [normal.todayProgress.percentage]);

  // 是否禁用刷新按钮：已刷新过 或 今日有进度
  const isRefreshDisabled = hasRefreshed || hasTodayProgress;

  // 注意：一日清单完成100%的奖励监听已移至 SceneProvider，无需在此重复监听

  // 处理刷新一日清单
  const handleRefresh = async () => {
    if (isRefreshDisabled || isRefreshing) return;
    
    const refreshCost = SPIRIT_JADE_COST.REFRESH_DAILY_VIEW;
    
    // 检查灵玉是否足够
    if (!canSpendSpiritJade(refreshCost)) {
      Toast.show({
        icon: 'fail',
        content: `灵玉不足！刷新需要 ${refreshCost} 灵玉，当前余额 ${spiritJadeData.balance}`,
      });
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      // 1. 清除一日清单缓存
      clearDailyViewCache();
      
      // 2. 标记今日已刷新
      markTodayRefreshed();
      setHasRefreshed(true);
      
      // 3. 刷新场景数据，触发重新计算 dailyViewTaskIds
      refreshScene('normal');
      
      // 4. 扣除灵玉
      spendSpiritJade({
        amount: refreshCost,
        source: 'REFRESH_DAILY',
        description: '刷新一日清单',
      });
      
      Toast.show({
        icon: 'success',
        content: `已刷新一日清单，消耗 ${refreshCost} 灵玉`,
      });
    } catch (error) {
      console.error('刷新一日清单失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 从上下文获取活跃任务
  const tasks = useMemo(() => {
    return [...normal.mainlineTasks, ...normal.sidelineTasks];
  }, [normal.mainlineTasks, normal.sidelineTasks]);
  const [selectedLocationTagId, setSelectedLocationTagId] = useState<string | null>(null);

  // 获取已使用的地点标签
  const usedLocationTags = useMemo(() => {
    return getUsedLocationTags(tasks);
  }, [tasks]);

  // 筛选后的任务（使用缓存的任务ID列表）
  const filteredTasks = useMemo(() => {
    // 从 SceneProvider 获取缓存的一日清单任务ID
    const dailyViewTaskIds = normal.dailyViewTaskIds;

    // 按照缓存的ID顺序获取任务（保持顺序不变）
    // 支持所有类型任务：CHECK_IN、NUMERIC、CHECKLIST
    // 同时从活跃任务和归档任务中查找（今日归档的任务仍然显示）
    const dailyTasks = dailyViewTaskIds
      .map(id => {
        // 先从活跃任务中查找
        const activeTask = normal.getById(id);
        if (activeTask) return activeTask;
        // 如果找不到，从归档任务中查找
        return normal.archivedTasks.find(t => t.id === id);
      })
      .filter((task): task is Task => task !== undefined);

    // 应用地点筛选
    if (!selectedLocationTagId) {
      return dailyTasks;
    }

    return dailyTasks.filter(task =>
      task.tags?.locationTagId === selectedLocationTagId
    );
  }, [normal.dailyViewTaskIds, normal.getById, normal.archivedTasks, selectedLocationTagId]);

  // 生成任务显示标题
  const getDisplayTitle = (task: Task): string => {
    const title = task.title;

    // CHECKLIST 类型：显示名称[当日目标数量]
    if (task.category === 'CHECKLIST') {
      const dailyTarget = task.todayProgress?.dailyTarget ?? 0;
      return dailyTarget > 0 ? `${title}[${dailyTarget}项]` : title;
    }

    // 优先使用 todayProgress.dailyTarget（今日目标）
    const dailyTarget = task.todayProgress?.dailyTarget;
    if (dailyTarget && dailyTarget > 0) {
      // CHECK_IN 类型
      if (task.category === 'CHECK_IN' && task.checkInConfig) {
        const config = task.checkInConfig;
        if (config.unit === 'DURATION') {
          return `${title}[${dailyTarget}分钟]`;
        }
        if (config.unit === 'QUANTITY') {
          const unit = config.valueUnit || '';
          return `${title}[${dailyTarget}${unit}]`;
        }
        if (config.unit === 'TIMES') {
          return `${title}[${dailyTarget}次]`;
        }
      }
      // NUMERIC 类型
      if (task.category === 'NUMERIC' && task.numericConfig) {
        const unit = task.numericConfig.unit || '';
        return `${title}[${dailyTarget}${unit}]`;
      }
    }

    // 回退到配置中的目标值
    if (task.category === 'CHECK_IN' && task.checkInConfig) {
      const config = task.checkInConfig;
      if (config.unit === 'DURATION' && config.dailyTargetMinutes) {
        return `${title}[${config.dailyTargetMinutes}分钟]`;
      }
      if (config.unit === 'QUANTITY' && config.dailyTargetValue) {
        const unit = config.valueUnit || '';
        return `${title}[${config.dailyTargetValue}${unit}]`;
      }
      if (config.unit === 'TIMES' && config.dailyMaxTimes) {
        return `${title}[${config.dailyMaxTimes}次]`;
      }
    }

    if (task.category === 'NUMERIC' && task.numericConfig?.perDayAverage) {
      const unit = task.numericConfig.unit || '';
      return `${title}[${task.numericConfig.perDayAverage}${unit}]`;
    }

    return title;
  };

  // 将任务分配到时段
  const tasksWithPeriods = useMemo((): TaskWithPeriod[] => {
    const periods: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];
    const tasksPerPeriod = Math.max(1, Math.ceil(filteredTasks.length / 3));

    return filteredTasks.map((task, index) => {
      const periodIndex = Math.min(Math.floor(index / tasksPerPeriod), 2);
      const period = periods[periodIndex];
      const positionInPeriod = index % tasksPerPeriod;

      // 生成示意时间（整点）
      const baseHour = TIME_PERIODS[period].start;
      const hoursInPeriod = TIME_PERIODS[period].end - TIME_PERIODS[period].start;
      const hour = baseHour + Math.min(positionInPeriod * 2, hoursInPeriod - 1);

      // 重新计算今日进度（确保使用最新数据）
      const freshTodayProgress = calculateTodayProgress(task);
      const todayValue = freshTodayProgress.todayValue ?? 0;
      const dailyTarget = freshTodayProgress.dailyTarget ?? 0;
      const isCompleted = freshTodayProgress.isCompleted ?? false;

      // 使用绝对值处理减少型任务（NUMERIC 类型的 todayValue 可能为负数）
      const dailyProgress = dailyTarget > 0 ? Math.min(100, Math.max(0, (Math.abs(todayValue) / dailyTarget) * 100)) : 0;
      // 只有有每日目标且未完成时才显示进度图标
      const hasProgress = todayValue > 0 && dailyTarget > 0 && !isCompleted;

      return {
        ...task,
        period,
        displayTime: `${hour.toString().padStart(2, '0')}:00`,
        isCompleted,
        hasProgress,
        dailyProgress,
        displayTitle: getDisplayTitle(task),
        isChecklist: task.category === 'CHECKLIST',
      };
    });
  }, [filteredTasks, normal.isTodayCompleted]);

  // 按时段分组
  const tasksByPeriod = useMemo(() => {
    return {
      morning: tasksWithPeriods.filter(t => t.period === 'morning'),
      afternoon: tasksWithPeriods.filter(t => t.period === 'afternoon'),
      evening: tasksWithPeriods.filter(t => t.period === 'evening'),
    };
  }, [tasksWithPeriods]);

  // 今日日期信息（使用测试日期，依赖 systemDate 以响应日期变化）
  const dateInfo = useMemo(() => {
    const effectiveToday = getCurrentDate();
    const todayDate = dayjs(effectiveToday);
    return {
      date: todayDate.format('MM/DD'),
      weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][todayDate.day()],
    };
  }, [systemDate]);

  // 当前时间（使用测试日期 + 实际时间，依赖 systemDate 以响应日期变化）
  const currentTime = useMemo(() => {
    const effectiveToday = getCurrentDate();
    const now = dayjs();
    // 使用有效日期 + 当前时分秒
    return dayjs(effectiveToday)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .format('YYYY/MM/DD HH:mm:ss');
  }, [visible, systemDate]);

  // 老黄历（依赖 systemDate 以响应日期变化）
  const almanac = useMemo(() => getTodayAlmanac(), [systemDate]);

  // 计算全局索引（包括时段标题和任务项）
  const getGlobalIndex = (periodKey: 'morning' | 'afternoon' | 'evening', localIndex: number, isHeader: boolean): number => {
    let offset = 0;
    
    if (periodKey === 'afternoon') {
      // 上午的标题 + 上午的任务
      offset = 1 + tasksByPeriod.morning.length;
    } else if (periodKey === 'evening') {
      // 上午的标题 + 上午的任务 + 下午的标题 + 下午的任务
      offset = 1 + tasksByPeriod.morning.length + 1 + tasksByPeriod.afternoon.length;
    }
    
    // 如果是标题，直接返回 offset；如果是任务项，需要加上标题的位置（+1）和任务的本地索引
    return isHeader ? offset : offset + 1 + localIndex;
  };

  const renderPeriodSection = (
    periodKey: 'morning' | 'afternoon' | 'evening',
    periodTasks: TaskWithPeriod[],
    isLast: boolean = false
  ) => {
    // 如果该时段没有任务，不渲染该时段
    if (periodTasks.length === 0) {
      return null;
    }

    const period = TIME_PERIODS[periodKey];
    const Icon = period.icon;

    // 计算时段标题的动画延迟
    const headerIndex = getGlobalIndex(periodKey, 0, true);
    const headerAnimationDelay = `${headerIndex * 60}ms`;

    // 计算虚线的动画延迟（在该时段所有任务之后）
    const lastTaskIndex = getGlobalIndex(periodKey, periodTasks.length - 1, false);
    const dashedLineAnimationDelay = `${(lastTaskIndex + 1) * 60}ms`;

    return (
      <div className={styles.periodSection} key={periodKey}>
        <div
          className={styles.periodHeader}
          style={{ animationDelay: headerAnimationDelay }}
        >
          <Icon size={14} className={styles.periodIcon} />
          <span className={styles.periodLabel}>{period.label}</span>
        </div>
        <div className={styles.periodTasks}>
          {periodTasks.map((task, index) => {
            const globalIndex = getGlobalIndex(periodKey, index, false);
            const animationDelay = `${globalIndex * 60}ms`;

            return (
              <div
                key={task.id}
                className={`${styles.taskItem} ${task.isCompleted ? styles.taskCompleted : ''}`}
                style={{ animationDelay }}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <div className={styles.taskLeft}>
                  {task.isChecklist && (
                    <ListChecks size={14} className={styles.checklistIcon} />
                  )}
                  <span className={styles.taskTitle}>{task.displayTitle}</span>
                  {task.hasProgress && (
                    <CircleProgress
                      progress={task.dailyProgress}
                      isCompleted={task.isCompleted}
                      size={16}
                      strokeWidth={2}
                    />
                  )}
                </div>
                <span className={styles.taskTime}>{task.displayTime}</span>
              </div>
            );
          })}
        </div>
        {!isLast && (
          <div 
            className={styles.dashedLine}
            style={{ animationDelay: dashedLineAnimationDelay }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <Popup
      visible={visible}
      mask={false}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        height: '100%',
      }}
    >
      <div className={styles.container}>
        {/* 顶部安全区 */}
        <SafeArea position="top" />
        
        {/* 票据顶部锯齿 */}
        <div className={styles.ticketTop}></div>
        
        {/* 右上角关闭按钮 */}
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
        
        {/* 标题 */}
        <div className={styles.header}>
          {/* 左上角刷新按钮 */}
          <button 
            className={`${styles.refreshButton} ${isRefreshDisabled ? styles.refreshDisabled : ''} ${isRefreshing ? styles.refreshing : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshDisabled || isRefreshing}
            title={
              hasTodayProgress 
                ? '今日已有进度，无法刷新' 
                : hasRefreshed 
                  ? '今日已刷新' 
                  : '重新生成一日清单'
            }
          >
            <RefreshCw size={16} />
          </button>
          
          <h1 className={styles.title}>一日清单</h1>
          <p className={styles.titleEn}>* * * TODAY'S LIST * * *</p>
        </div>

        {/* 日期行 */}
        <div className={styles.dateRow}>
          <div className={styles.dateInfo}>
            <span className={styles.date}>{dateInfo.date}</span>
            <span className={styles.weekday}>{dateInfo.weekday}</span>
          </div>
          
          {/* 地点筛选 */}
          <LocationFilter
            locationTags={usedLocationTags}
            selectedTagId={selectedLocationTagId}
            onTagChange={setSelectedLocationTagId}
          />
        </div>

        <div className={styles.dashedLine}></div>

        {/* 时段列表 */}
        <div className={styles.periodList}>
          {(() => {
            // 计算哪些时段有任务
            const periods: Array<{ key: 'morning' | 'afternoon' | 'evening'; tasks: TaskWithPeriod[] }> = [
              { key: 'morning', tasks: tasksByPeriod.morning },
              { key: 'afternoon', tasks: tasksByPeriod.afternoon },
              { key: 'evening', tasks: tasksByPeriod.evening },
            ].filter(p => p.tasks.length > 0);

            return periods.map((p, index) =>
              renderPeriodSection(p.key, p.tasks, index === periods.length - 1)
            );
          })()}
        </div>

        <div className={styles.dashedLine} style={{margin: '5px 0'}}></div>
        {/* 老黄历 */}
        <div className={styles.almanacSection}>
          <p className={styles.almanacText}>{almanac}</p>
        </div>

        <div className={styles.dashedLine} style={{margin: '5px 0'}}></div>

        {/* 底部时间 */}
        {/* <div className={styles.footer}>
          <span className={styles.printTime}>打印时间：{currentTime}</span>
        </div> */}

        {/* 票据底部锯齿 */}
        {/* <div className={styles.ticketBottom}></div> */}
        
        {/* 底部安全区 */}
        <SafeArea position="bottom" />
      </div>
    </Popup>
  );
};

export default DailyViewPopup;











