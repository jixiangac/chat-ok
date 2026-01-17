/**
 * 一日视图弹窗组件
 * 展示今日任务的时段分布 - 小票风格
 */

import React, { useMemo, useState } from 'react';
import { Popup, SafeArea } from 'antd-mobile';
import { 
  Check, Sun, Sunset, Moon, X
} from 'lucide-react';
import dayjs from 'dayjs';
import type { Task, TagType } from '../../types';
import { getUsedLocationTags } from '../../utils/tagStorage';
import { useTaskContext, useScene } from '../../contexts';
import { LocationFilter } from '../../components';
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

// 获取今日老黄历（基于日期的伪随机）
const getTodayAlmanac = () => {
  const day = dayjs().date();
  const month = dayjs().month();
  return ALMANAC_QUOTES[(day + month) % ALMANAC_QUOTES.length];
};

interface TaskWithPeriod extends Task {
  period: 'morning' | 'afternoon' | 'evening';
  displayTime: string;
  isCompleted: boolean;
  hasProgress: boolean;
  dailyProgress: number;
}

const DailyViewPopup: React.FC<DailyViewPopupProps> = ({
  visible,
  onClose,
}) => {
  const { setSelectedTaskId } = useTaskContext();
  const { normal } = useScene();
  
  // 从上下文获取活跃任务
  const tasks = useMemo(() => {
    return [...normal.mainlineTasks, ...normal.sidelineTasks];
  }, [normal.mainlineTasks, normal.sidelineTasks]);
  const [selectedLocationTagId, setSelectedLocationTagId] = useState<string | null>(null);

  // 获取已使用的地点标签
  const usedLocationTags = useMemo(() => {
    return getUsedLocationTags(tasks);
  }, [tasks]);

  // 筛选后的任务（使用新的智能筛选逻辑）
  const filteredTasks = useMemo(() => {
    // 从 SceneProvider 获取缓存的一日清单任务ID
    const dailyViewTaskIds = normal.dailyViewTaskIds;
    console.log(dailyViewTaskIds,'dailyViewTaskIds')
    
    // 按照缓存的ID顺序获取任务（保持顺序不变）
    // 支持 CHECK_IN 和 NUMERIC 类型任务
    const dailyTasks = dailyViewTaskIds
      .map(id => normal.getById(id))
      .filter((task): task is Task => 
        task !== undefined && 
        (task.category === 'CHECK_IN' || task.category === 'NUMERIC')
      );
    
    // 应用地点筛选
    if (!selectedLocationTagId) {
      return dailyTasks;
    }
    
    return dailyTasks.filter(task => 
      task.tags?.locationTagId === selectedLocationTagId
    );
  }, [normal.dailyViewTaskIds, normal.getById, selectedLocationTagId]);

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
      // 计算今日进度百分比
      const todayValue = task.todayProgress?.todayValue ?? 0;
      const dailyTarget = task.todayProgress?.dailyTarget ?? 0;
      const isCompleted = task.todayProgress?.isCompleted ?? false;
      // 使用绝对值处理减少型任务（NUMERIC 类型的 todayValue 可能为负数）
      const dailyProgress = dailyTarget > 0 ? Math.min(100, Math.max(0, (Math.abs(todayValue) / dailyTarget) * 100)) : 0;
      // 只有有每日目标且未完成时才显示进度图标
      const hasProgress = dailyTarget > 0 && !isCompleted;

      return {
        ...task,
        period,
        displayTime: `${hour.toString().padStart(2, '0')}:00`,
        isCompleted: task.todayProgress?.isCompleted ?? false,
        hasProgress,
        dailyProgress,
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

  // 今日日期信息
  const dateInfo = useMemo(() => {
    const now = dayjs();
    return {
      date: now.format('MM/DD'),
      weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.day()],
    };
  }, []);

  // 当前时间
  const currentTime = useMemo(() => {
    return dayjs().format('YYYY/MM/DD HH:mm:ss');
  }, [visible]);

  // 老黄历
  const almanac = useMemo(() => getTodayAlmanac(), []);

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
    const period = TIME_PERIODS[periodKey];
    const Icon = period.icon;
    
    // 计算时段标题的动画延迟
    const headerIndex = getGlobalIndex(periodKey, 0, true);
    const headerAnimationDelay = `${headerIndex * 60}ms`;
    
    // 计算虚线的动画延迟（在该时段所有任务之后）
    const lastTaskIndex = periodTasks.length > 0 
      ? getGlobalIndex(periodKey, periodTasks.length - 1, false)
      : headerIndex;
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
          {periodTasks.length === 0 ? (
            <div className={styles.emptyPeriod}>- - -</div>
          ) : (
            periodTasks.map((task, index) => {
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
                    <span className={styles.taskTitle}>{task.title}</span>
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
            })
          )}
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
          {renderPeriodSection('morning', tasksByPeriod.morning, false)}
          {renderPeriodSection('afternoon', tasksByPeriod.afternoon, false)}
          {renderPeriodSection('evening', tasksByPeriod.evening, true)}
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








