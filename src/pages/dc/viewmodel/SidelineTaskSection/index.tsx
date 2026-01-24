/**
 * 支线任务区块组件
 * 支持地点筛选功能
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, List, MapPin, ChevronDown, Check,
  Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine
} from 'lucide-react';
import SidelineTaskGrid from '../SidelineTaskGrid';
import GroupModeGrid from '../GroupModeGrid';
import { fadeVariants } from '../../constants/animations';
import { AllSidelineTasksPopup } from '../AllSidelineTasksList';
import type { Task, TaskTag, ViewMode } from '../../types';
import { getUsedLocationTags } from '../../utils/tagStorage';
import { getSavedLocationFilter, saveLocationFilter } from '@/pages/dc/utils/developerStorage';
import { useModal, UI_KEYS } from '../../contexts';
import styles from './styles.module.css';

// 地点图标映射
const LOCATION_ICON_MAP: Record<string, React.ReactNode> = {
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
};

// 获取地点图标组件
const getLocationIcon = (iconName?: string) => {
  if (!iconName) return null;
  return LOCATION_ICON_MAP[iconName] || null;
};

interface SidelineTaskSectionProps {
  /** 支线任务列表 */
  tasks: Task[];
  /** 当前视图模式 */
  viewMode: ViewMode;
  /** 切换视图模式 */
  onToggleViewMode: () => void;
  /** 分组点击回调 */
  onGroupClick: (tag: TaskTag, tasks: Task[]) => void;
  /** 任务点击回调 */
  onTaskClick: (taskId: string) => void;
  /** 随机打开任务回调 */
  onRandomOpen: () => void;
  /** 判断任务今日是否完成 */
  isTodayCompleted?: (task: Task) => boolean;
  /** 判断任务周期是否完成 */
  isCycleCompleted?: (task: Task) => boolean;
}

const SidelineTaskSection: React.FC<SidelineTaskSectionProps> = ({
  tasks,
  viewMode,
  onToggleViewMode,
  onGroupClick,
  onTaskClick,
  onRandomOpen,
  isTodayCompleted,
  isCycleCompleted,
}) => {
  // 显示全部支线任务弹窗状态（使用全局 UI 状态）
  const { visible: showAllSidelineTasks, open: openAllSideline, close: closeAllSideline } = useModal(UI_KEYS.MODAL_ALL_SIDELINE_VISIBLE);

  // 从本地存储读取初始地点筛选状态
  const [selectedLocationTagId, setSelectedLocationTagId] = useState<string | null>(() => getSavedLocationFilter());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // 获取已使用的地点标签
  const usedLocationTags = useMemo(() => {
    return getUsedLocationTags(tasks);
  }, [tasks]);

  // 检查是否有带标签的任务（用于显示切换图标）
  const hasTaggedTasks = useMemo(() => {
    return tasks.some(task => task.tags?.normalTagId || (task as any).tagId);
  }, [tasks]);

  // 点击外部关闭筛选下拉
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

  // 处理地点筛选变化（同时保存到本地存储）
  const handleLocationFilterChange = (tagId: string | null) => {
    setSelectedLocationTagId(tagId);
    saveLocationFilter(tagId);
    setIsFilterOpen(false);
  };

  // 筛选后的任务列表
  const filteredTasks = useMemo(() => {
    if (!selectedLocationTagId || viewMode === 'group') {
      return tasks;
    }
    return tasks.filter(task => task.tags?.locationTagId === selectedLocationTagId);
  }, [tasks, selectedLocationTagId, viewMode]);

  // 获取当前选中的地点标签
  const selectedLocationTag = useMemo(() => {
    if (!selectedLocationTagId) return null;
    return usedLocationTags.find(tag => tag.id === selectedLocationTagId);
  }, [selectedLocationTagId, usedLocationTags]);

  if (tasks.length === 0) {
    return null;
  }

  const showLocationFilter = usedLocationTags.length > 0 && viewMode !== 'group';

  return (
    <AnimatePresence>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>支线任务</h2>
            <div className={styles.headerActions}>
              {/* 地点筛选按钮 */}
              {showLocationFilter && (
                <div className={styles.filterWrapper} ref={filterRef}>
                  <button
                    className={`${styles.filterButton} ${selectedLocationTagId ? styles.filterActive : ''}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <MapPin size={14} />
                    {selectedLocationTag && (
                      <span>{selectedLocationTag.name}</span>
                    )}
                    <ChevronDown size={14} className={styles.filterChevron} />
                  </button>
                  
                  {/* 筛选下拉菜单 */}
                  {isFilterOpen && (
                    <div className={styles.filterDropdown}>
                      <div
                        className={`${styles.filterOption} ${!selectedLocationTagId ? styles.filterOptionActive : ''}`}
                        onClick={() => {
                          handleLocationFilterChange(null);
                        }}
                      >
                        <span>全部</span>
                        {!selectedLocationTagId && <Check size={14} className={styles.filterOptionCheck} />}
                      </div>
                      {usedLocationTags.map(tag => (
                        <div
                          key={tag.id}
                          className={`${styles.filterOption} ${selectedLocationTagId === tag.id ? styles.filterOptionActive : ''}`}
                          onClick={() => {
                            handleLocationFilterChange(tag.id);
                          }}
                        >
                          <span className={styles.filterOptionIcon}>{getLocationIcon(tag.icon)}</span>
                          <span>{tag.name}</span>
                          {selectedLocationTagId === tag.id && <Check size={14} className={styles.filterOptionCheck} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* 视图切换按钮 */}
              {hasTaggedTasks && (
                <button
                  className={styles.viewModeButton}
                  onClick={onToggleViewMode}
                  title={viewMode === 'default' ? '切换到分组视图' : '切换到默认视图'}
                >
                  {viewMode === 'default' ? <LayoutGrid size={16} /> : <List size={16} />}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {viewMode === 'group' ? (
          <GroupModeGrid
            tasks={tasks}
            onGroupClick={onGroupClick}
            onRandomOpen={onRandomOpen}
            onShowAll={openAllSideline}
          />
        ) : (
          <SidelineTaskGrid
            tasks={filteredTasks}
            onTaskClick={onTaskClick}
            onRandomOpen={onRandomOpen}
            onShowAll={openAllSideline}
          />
        )}

        {/* 所有支线任务抽屉 */}
        <AllSidelineTasksPopup
          visible={showAllSidelineTasks}
          onClose={closeAllSideline}
          tasks={tasks}
          onTaskClick={onTaskClick}
          isTodayCompleted={isTodayCompleted}
          isCycleCompleted={isCycleCompleted}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SidelineTaskSection;







