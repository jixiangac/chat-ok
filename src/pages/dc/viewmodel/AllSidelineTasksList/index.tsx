/**
 * 所有支线任务列表组件
 * 
 * 提供两种使用方式：
 * 1. AllSidelineTasksList - 本体组件，不带 Popup 包裹
 * 2. AllSidelineTasksPopup - 弹窗版本，带 Popup 包裹
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { Popup, SafeArea } from 'antd-mobile';
import { Virtuoso } from 'react-virtuoso';
import { 
  X, Tag, MapPin, Smile, ChevronDown, Check,
  Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine,
  SmilePlus, Frown, Angry, Moon, HelpCircle, Zap, PartyPopper, Heart, Flame, Snowflake,
  Pin, Star, Target, BookOpen, Lightbulb, Wrench, Palette, Music, PersonStanding, Sparkles
} from 'lucide-react';
import { SidelineTaskCard } from '../../components/card';
import type { Task, TaskTag, TagType } from '../../types';
import { getTagsByType, getUsedLocationTags } from '../../utils/tagStorage';
import { getSavedLocationFilter, saveLocationFilter } from '@/pages/dc/utils/developerStorage';
import styles from './styles.module.css';

// 使用虚拟列表的阈值
const VIRTUAL_LIST_THRESHOLD = 6;
// 每个任务卡片的高度（包含 padding-bottom: 8px）
const TASK_ITEM_HEIGHT = 95;

// 图标映射
const ICON_MAP: Record<string, React.ReactNode> = {
  // 地点图标
  home: <Home size={14} />,
  building: <Building2 size={14} />,
  coffee: <Coffee size={14} />,
  gym: <Dumbbell size={14} />,
  train: <Train size={14} />,
  school: <School size={14} />,
  hospital: <Hospital size={14} />,
  shop: <ShoppingCart size={14} />,
  beach: <Palmtree size={14} />,
  park: <TreePine size={14} />,
  // 心情图标
  happy: <SmilePlus size={14} />,
  sad: <Frown size={14} />,
  angry: <Angry size={14} />,
  sleepy: <Moon size={14} />,
  thinking: <HelpCircle size={14} />,
  energetic: <Zap size={14} />,
  celebrate: <PartyPopper size={14} />,
  love: <Heart size={14} />,
  fire: <Flame size={14} />,
  cold: <Snowflake size={14} />,
  // 普通图标
  pin: <Pin size={14} />,
  star: <Star size={14} />,
  target: <Target size={14} />,
  book: <BookOpen size={14} />,
  idea: <Lightbulb size={14} />,
  tool: <Wrench size={14} />,
  art: <Palette size={14} />,
  music: <Music size={14} />,
  person: <PersonStanding size={14} />,
  sparkle: <Sparkles size={14} />,
};

const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
};

interface AllSidelineTasksListProps {
  /** 支线任务列表 */
  tasks: Task[];
  /** 任务点击回调 */
  onTaskClick?: (taskId: string) => void;
  /** 判断任务今日是否完成 */
  isTodayCompleted?: (task: Task) => boolean;
  /** 判断任务周期是否完成 */
  isCycleCompleted?: (task: Task) => boolean;
  /** 自定义标题 */
  title?: string;
  /** 关闭按钮点击回调（仅在本体组件中使用时可选） */
  onClose?: () => void;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 最大容器高度（用于限制虚拟列表高度），不传则不限制 */
  maxContainerHeight?: number;
  /** 是否显示筛选 */
  showFilter?: boolean;
  /** 是否持久化地点筛选 */
  persistLocationFilter?: boolean;
}

// 筛选类型
type FilterType = 'normal' | 'location' | 'mood';

// 筛选按钮组件
interface FilterButtonProps {
  type: FilterType;
  label: string;
  icon: React.ReactNode;
  tasks: Task[];
  selectedTagId: string | null;
  onSelect: (tagId: string | null) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  type,
  label,
  icon,
  tasks,
  selectedTagId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // 获取该类型的所有标签
  const allTags = useMemo(() => getTagsByType(type), [type]);
  
  // 获取任务中使用的标签
  const usedTags = useMemo(() => {
    const usedTagIds = new Set<string>();
    tasks.forEach(task => {
      const tagId = type === 'normal' 
        ? (task.tags?.normalTagId)
        : type === 'location'
        ? task.tags?.locationTagId
        : task.tags?.moodTagId;
      if (tagId) usedTagIds.add(tagId);
    });
    return allTags.filter(tag => usedTagIds.has(tag.id));
  }, [tasks, allTags, type]);

  // 获取选中的标签
  const selectedTag = useMemo(() => {
    if (!selectedTagId) return null;
    return usedTags.find(tag => tag.id === selectedTagId);
  }, [selectedTagId, usedTags]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (usedTags.length === 0) return null;

  return (
    <div className={styles.filterWrapper} ref={filterRef}>
      <button
        className={`${styles.filterButton} ${selectedTagId ? styles.filterActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        {selectedTag && <span>{selectedTag.name}</span>}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div
            className={`${styles.filterOption} ${!selectedTagId ? styles.filterOptionActive : ''}`}
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
          >
            <span>全部</span>
            {!selectedTagId && <Check size={14} className={styles.filterOptionCheck} />}
          </div>
          {usedTags.map(tag => (
            <div
              key={tag.id}
              className={`${styles.filterOption} ${selectedTagId === tag.id ? styles.filterOptionActive : ''}`}
              onClick={() => {
                onSelect(tag.id);
                setIsOpen(false);
              }}
            >
              <span className={styles.filterOptionIcon}>{getIconComponent(tag.icon)}</span>
              <span>{tag.name}</span>
              {selectedTagId === tag.id && <Check size={14} className={styles.filterOptionCheck} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 所有支线任务列表 - 本体组件
 */
export const AllSidelineTasksList: React.FC<AllSidelineTasksListProps> = ({
  tasks,
  onTaskClick,
  isTodayCompleted,
  isCycleCompleted,
  title,
  onClose,
  showCloseButton = true,
  maxContainerHeight,
  showFilter = false,
  persistLocationFilter = false,
}) => {
  // 内容区域的 ref，用于重置滚动位置
  const contentRef = useRef<HTMLDivElement>(null);
  // Virtuoso 的 ref
  const virtuosoRef = useRef<any>(null);

  // 初始化地点筛选状态（从本地存储读取）
  const getInitialLocationFilter = useCallback(() => {
    if (persistLocationFilter) {
      return getSavedLocationFilter();
    }
    return null;
  }, [persistLocationFilter]);

  // 筛选状态
  const [normalTagId, setNormalTagId] = useState<string | null>(null);
  const [locationTagId, setLocationTagId] = useState<string | null>(getInitialLocationFilter);
  const [moodTagId, setMoodTagId] = useState<string | null>(null);

  // 处理地点筛选变化（支持本地存储）
  const handleLocationFilterChange = useCallback((tagId: string | null) => {
    setLocationTagId(tagId);
    if (persistLocationFilter) {
      saveLocationFilter(tagId);
    }
  }, [persistLocationFilter]);

  // 筛选后的任务
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 普通标签筛选
      if (normalTagId) {
        const taskNormalTagId = task.tags?.normalTagId;
        if (taskNormalTagId !== normalTagId) return false;
      }
      // 地点标签筛选
      if (locationTagId) {
        if (task.tags?.locationTagId !== locationTagId) return false;
      }
      // 心情标签筛选
      if (moodTagId) {
        if (task.tags?.moodTagId !== moodTagId) return false;
      }
      return true;
    });
  }, [tasks, normalTagId, locationTagId, moodTagId]);

  // 每次 tasks 变化时，重置滚动位置到顶部
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    virtuosoRef.current?.scrollTo({ top: 0 });
  }, [filteredTasks]);

  // 渲染任务列表项
  const renderTaskItem = useCallback((index: number, task: Task) => {
    // 计算动画延迟，每个 item 延迟 60ms，模拟快速翻书效果
    const animationDelay = `${index * 60}ms`;
    
    return (
      <div 
        className={styles.taskItem}
        style={{ animationDelay }}
      >
        <SidelineTaskCard 
          task={task}
          onClick={() => onTaskClick?.(task.id)}
          isTodayCompleted={isTodayCompleted?.(task)}
          isCycleCompleted={isCycleCompleted?.(task)}
        />
      </div>
    );
  }, [onTaskClick, isTodayCompleted, isCycleCompleted]);

  // 是否使用虚拟列表
  const useVirtualList = filteredTasks.length > VIRTUAL_LIST_THRESHOLD;

  // 列表高度：根据任务实际个数计算，但不超过最大容器高度
  const listHeight = useMemo(() => {
    // 根据任务数量计算实际需要的高度
    const contentHeight = filteredTasks.length * TASK_ITEM_HEIGHT;
    
    // 如果有最大高度限制，返回两者中较小的值
    if (maxContainerHeight && maxContainerHeight > 0) {
      return Math.min(contentHeight, maxContainerHeight);
    }
    
    // 没有限制则返回实际内容高度
    return contentHeight;
  }, [filteredTasks.length, maxContainerHeight]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title || `所有支线任务 (${filteredTasks.length})`}</h2>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* 筛选区域 */}
      {showFilter && (
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <FilterButton
              type="normal"
              label="标签"
              icon={<Tag size={14} />}
              tasks={tasks}
              selectedTagId={normalTagId}
              onSelect={setNormalTagId}
            />
            <FilterButton
              type="location"
              label="地点"
              icon={<MapPin size={14} />}
              tasks={tasks}
              selectedTagId={locationTagId}
              onSelect={handleLocationFilterChange}
            />
            <FilterButton
              type="mood"
              label="心情"
              icon={<Smile size={14} />}
              tasks={tasks}
              selectedTagId={moodTagId}
              onSelect={setMoodTagId}
            />
          </div>
        </div>
      )}

      <div className={styles.content} ref={contentRef}>
        {useVirtualList ? (
          <Virtuoso
            style={{ 
              height: `${listHeight}px`,
              overflowX: 'hidden',
              width: '100%'
            }}
            ref={virtuosoRef}
            className={styles.virtuosoList}
            totalCount={filteredTasks.length}
            data={filteredTasks}
            itemContent={renderTaskItem}
          />
        ) : (
          <div className={styles.taskList}>
            {filteredTasks.map((task, index) => (
              <div key={task.id}>
                {renderTaskItem(index, task)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface AllSidelineTasksPopupProps extends Omit<AllSidelineTasksListProps, 'onClose' | 'showCloseButton' | 'maxContainerHeight' | 'showFilter'> {
  /** 弹窗是否可见 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
}

/**
 * 所有支线任务弹窗 - 弹窗版本
 */
export const AllSidelineTasksPopup: React.FC<AllSidelineTasksPopupProps> = ({
  visible,
  onClose,
  tasks,
  onTaskClick,
  isTodayCompleted,
  isCycleCompleted,
  title,
}) => {
  // 用于强制重新渲染列表的 key
  const [listKey, setListKey] = useState(0);
  
  // 当 visible 变为 true 时，更新 key 强制重新渲染
  useEffect(() => {
    if (visible) {
      setListKey(prev => prev + 1);
    }
  }, [visible]);

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ 
        borderTopLeftRadius: '16px', 
        borderTopRightRadius: '16px',
        height: '90vh',
        overflow: 'hidden',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AllSidelineTasksList
        key={listKey}
        tasks={tasks}
        onTaskClick={onTaskClick}
        isTodayCompleted={isTodayCompleted}
        isCycleCompleted={isCycleCompleted}
        title={title}
        onClose={onClose}
        showCloseButton={true}
        showFilter={true}
        persistLocationFilter={true}
      />
      <SafeArea position="bottom" />
    </Popup>
  );
};

export default AllSidelineTasksList;



