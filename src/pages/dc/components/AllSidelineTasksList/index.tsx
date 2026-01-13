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
import { X } from 'lucide-react';
import { SidelineTaskCard } from '../card';
import type { Task } from '../../types';
import styles from './styles.module.css';

// 使用虚拟列表的阈值
const VIRTUAL_LIST_THRESHOLD = 6;
// 每个任务卡片的高度（包含 padding-bottom: 8px）
const TASK_ITEM_HEIGHT = 95;

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
}

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
}) => {
  // 内容区域的 ref，用于重置滚动位置
  const contentRef = useRef<HTMLDivElement>(null);
  // Virtuoso 的 ref
  const virtuosoRef = useRef<any>(null);

  // 每次 tasks 变化时，重置滚动位置到顶部
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    virtuosoRef.current?.scrollTo({ top: 0 });
  }, [tasks]);

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
  const useVirtualList = tasks.length > VIRTUAL_LIST_THRESHOLD;

  // 列表高度：根据任务实际个数计算，但不超过最大容器高度
  const listHeight = useMemo(() => {
    // 根据任务数量计算实际需要的高度
    const contentHeight = tasks.length * TASK_ITEM_HEIGHT;
    
    // 如果有最大高度限制，返回两者中较小的值
    if (maxContainerHeight && maxContainerHeight > 0) {
      return Math.min(contentHeight, maxContainerHeight);
    }
    
    // 没有限制则返回实际内容高度
    return contentHeight;
  }, [tasks.length, maxContainerHeight]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title || `所有支线任务 (${tasks.length})`}</h2>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        )}
      </div>

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
            totalCount={tasks.length}
            data={tasks}
            itemContent={renderTaskItem}
          />
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task, index) => (
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

interface AllSidelineTasksPopupProps extends Omit<AllSidelineTasksListProps, 'onClose' | 'showCloseButton' | 'maxContainerHeight'> {
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

  // 计算弹窗内列表的最大可用高度
  // const maxListHeight = useMemo(() => {
  //   // 弹窗最大高度 90vh，减去 header、SafeArea 和 content padding
  //   const maxHeight = window.innerHeight * 0.9 - HEADER_HEIGHT - SAFE_AREA_HEIGHT - CONTENT_PADDING;
  //   return maxHeight;
  // }, []);

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ 
        borderTopLeftRadius: '16px', 
        borderTopRightRadius: '16px',
        maxHeight: '90vh',
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
      />
      <SafeArea position="bottom" />
    </Popup>
  );
};

export default AllSidelineTasksList;




