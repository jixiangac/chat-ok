/**
 * 一日视图弹窗组件
 * 展示今日任务的时段分布 - 小票风格
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Popup } from 'antd-mobile';
import { 
  MapPin, ChevronDown, Check, Sun, Sunset, Moon,
  Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine
} from 'lucide-react';
import dayjs from 'dayjs';
import type { Task, TagType } from '../../types';
import { getTagsByType, getTaskTags, getUsedLocationTags } from '../../utils/tagStorage';
import { getTodayCheckInStatusForTask } from '../../panels/detail/hooks';
import styles from './styles.module.css';

// 地点图标映射
const LOCATION_ICON_MAP: Record<string, React.ReactNode> = {
  home: <Home size={12} />,
  building: <Building2 size={12} />,
  coffee: <Coffee size={12} />,
  gym: <Dumbbell size={12} />,
  train: <Train size={12} />,
  school: <School size={12} />,
  hospital: <Hospital size={12} />,
  shop: <ShoppingCart size={12} />,
  beach: <Palmtree size={12} />,
  park: <TreePine size={12} />,
};

// 获取地点图标组件
const getLocationIcon = (iconName?: string) => {
  if (!iconName) return null;
  return LOCATION_ICON_MAP[iconName] || null;
};

interface DailyViewPopupProps {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
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
}

const DailyViewPopup: React.FC<DailyViewPopupProps> = ({
  visible,
  onClose,
  tasks,
  onTaskClick,
}) => {
  const [selectedLocationTagId, setSelectedLocationTagId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭筛选
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // 获取已使用的地点标签
  const usedLocationTags = useMemo(() => {
    return getUsedLocationTags(tasks);
  }, [tasks]);

  // 获取当前选中的地点标签
  const selectedLocationTag = useMemo(() => {
    if (!selectedLocationTagId) return null;
    return usedLocationTags.find(tag => tag.id === selectedLocationTagId);
  }, [selectedLocationTagId, usedLocationTags]);

  // 筛选后的任务
  const filteredTasks = useMemo(() => {
    if (!selectedLocationTagId) {
      return tasks;
    }
    return tasks.filter(task => task.tags?.locationTagId === selectedLocationTagId);
  }, [tasks, selectedLocationTagId]);

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
      
      // 检查今日完成状态
      const status = getTodayCheckInStatusForTask(task);

      return {
        ...task,
        period,
        displayTime: `${hour.toString().padStart(2, '0')}:00`,
        isCompleted: status.isCompleted,
      };
    });
  }, [filteredTasks]);

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

  const renderPeriodSection = (
    periodKey: 'morning' | 'afternoon' | 'evening',
    periodTasks: TaskWithPeriod[]
  ) => {
    const period = TIME_PERIODS[periodKey];
    const Icon = period.icon;

    return (
      <div className={styles.periodSection} key={periodKey}>
        <div className={styles.periodHeader}>
          <Icon size={14} className={styles.periodIcon} />
          <span className={styles.periodLabel}>{period.label}</span>
        </div>
        <div className={styles.periodTasks}>
          {periodTasks.length === 0 ? (
            <div className={styles.emptyPeriod}>- - -</div>
          ) : (
            periodTasks.map(task => (
              <div
                key={task.id}
                className={`${styles.taskItem} ${task.isCompleted ? styles.taskCompleted : ''}`}
                onClick={() => onTaskClick(task.id)}
              >
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={styles.taskTime}>{task.displayTime}</span>
              </div>
            ))
          )}
        </div>
        <div className={styles.dashedLine}></div>
      </div>
    );
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        height: '90vh',
      }}
    >
      <div className={styles.container}>
        {/* 票据顶部锯齿 */}
        <div className={styles.ticketTop}></div>
        
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
          {usedLocationTags.length > 0 && (
            <div className={styles.filterWrapper} ref={filterRef}>
              <button
                className={`${styles.filterButton} ${selectedLocationTagId ? styles.filterActive : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <MapPin size={14} />
                {selectedLocationTag && (
                  <span className={styles.filterText}>{selectedLocationTag.name}</span>
                )}
                <ChevronDown size={12} />
              </button>
              
              {isFilterOpen && (
                <div className={styles.filterDropdown}>
                  <div
                    className={`${styles.filterOption} ${!selectedLocationTagId ? styles.filterOptionActive : ''}`}
                    onClick={() => {
                      setSelectedLocationTagId(null);
                      setIsFilterOpen(false);
                    }}
                  >
                    <span>全部</span>
                    {!selectedLocationTagId && <Check size={12} className={styles.filterOptionCheck} />}
                  </div>
                  {usedLocationTags.map(tag => (
                    <div
                      key={tag.id}
                      className={`${styles.filterOption} ${selectedLocationTagId === tag.id ? styles.filterOptionActive : ''}`}
                      onClick={() => {
                        setSelectedLocationTagId(tag.id);
                        setIsFilterOpen(false);
                      }}
                    >
                      <span className={styles.filterOptionIcon}>{getLocationIcon(tag.icon)}</span>
                      <span>{tag.name}</span>
                      {selectedLocationTagId === tag.id && <Check size={12} className={styles.filterOptionCheck} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.dashedLine}></div>

        {/* 时段列表 */}
        <div className={styles.periodList}>
          {renderPeriodSection('morning', tasksByPeriod.morning)}
          {renderPeriodSection('afternoon', tasksByPeriod.afternoon)}
          {renderPeriodSection('evening', tasksByPeriod.evening)}
        </div>

        {/* 老黄历 */}
        <div className={styles.almanacSection}>
          <p className={styles.almanacText}>{almanac}</p>
        </div>

        <div className={styles.dashedLine}></div>

        {/* 底部时间 */}
        <div className={styles.footer}>
          <span className={styles.printTime}>打印时间：{currentTime}</span>
        </div>

        {/* 票据底部锯齿 */}
        <div className={styles.ticketBottom}></div>
      </div>
    </Popup>
  );
};

export default DailyViewPopup;



