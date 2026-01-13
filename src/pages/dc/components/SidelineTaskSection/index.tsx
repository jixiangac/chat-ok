/**
 * 支线任务区块组件
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import SidelineTaskGrid from '../SidelineTaskGrid';
import GroupModeGrid from '../GroupModeGrid';
import { fadeVariants } from '../../constants/animations';
import type { Task, TaskTag, ViewMode } from '../../types';
import styles from './styles.module.css';

interface SidelineTaskSectionProps {
  /** 支线任务列表 */
  tasks: Task[];
  /** 是否有带标签的任务 */
  hasTaggedTasks: boolean;
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
  /** 显示全部任务回调 */
  onShowAll: () => void;
}

const SidelineTaskSection: React.FC<SidelineTaskSectionProps> = ({
  tasks,
  hasTaggedTasks,
  viewMode,
  onToggleViewMode,
  onGroupClick,
  onTaskClick,
  onRandomOpen,
  onShowAll,
}) => {
  if (tasks.length === 0) {
    return null;
  }

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
        
        {viewMode === 'group' ? (
          <GroupModeGrid
            tasks={tasks}
            onGroupClick={onGroupClick}
            onRandomOpen={onRandomOpen}
            onShowAll={onShowAll}
          />
        ) : (
          <SidelineTaskGrid 
            tasks={tasks}
            onTaskClick={onTaskClick}
            onRandomOpen={onRandomOpen}
            onShowAll={onShowAll}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SidelineTaskSection;
