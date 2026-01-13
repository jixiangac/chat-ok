/**
 * Group 模式网格组件
 * 按标签分组显示支线任务，使用两列布局，带 motion 动画
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Swiper } from 'antd-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskTag } from '../../types';
import { getAllTags } from '../../utils/tagStorage';
import { prefersReducedMotion } from '../../utils/responsive';
import { gridItemVariants, listContainerVariants } from '../../constants/animations';
import GroupCard from '../GroupCard';
import styles from './styles.module.css';

interface GroupModeGridProps {
  tasks: Task[];
  onGroupClick: (tag: TaskTag, tasks: Task[]) => void;
  onRandomOpen: () => void;
  onShowAll: () => void;
}

const GroupModeGrid: React.FC<GroupModeGridProps> = ({
  tasks,
  onGroupClick,
  onRandomOpen,
  onShowAll,
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(() => !prefersReducedMotion());

  // 监听用户动画偏好变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // 获取所有标签
  const allTags = useMemo(() => getAllTags(), []);

  // 按标签分组任务
  const groupedTasks = useMemo(() => {
    const groups: { tag: TaskTag; tasks: Task[] }[] = [];
    
    allTags.forEach(tag => {
      const tagTasks = tasks.filter(task => task.tagId === tag.id);
      if (tagTasks.length > 0) {
        groups.push({ tag, tasks: tagTasks });
      }
    });

    return groups;
  }, [tasks, allTags]);

  // 判断是否需要使用 Swiper（超过4个分组时）
  const useSwiper = groupedTasks.length > 4;

  // 将分组按4个一组分页
  const pagedGroups = useMemo(() => {
    if (!useSwiper) return [];
    const pages: { tag: TaskTag; tasks: Task[] }[][] = [];
    for (let i = 0; i < groupedTasks.length; i += 4) {
      pages.push(groupedTasks.slice(i, i + 4));
    }
    return pages;
  }, [groupedTasks, useSwiper]);

  // 按钮样式
  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#9b9b9b',
    cursor: 'pointer',
    padding: '8px 12px',
    textDecoration: 'none',
    transition: 'color 0.2s ease, transform 0.2s ease',
    borderRadius: '8px',
  };

  // 如果没有分组，显示空状态
  if (groupedTasks.length === 0) {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.emptyState}
          initial={shouldAnimate ? { opacity: 0, y: 10 } : undefined}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        >
          <div className={styles.emptyIcon}>📁</div>
          <div className={styles.emptyText}>暂无带标签的任务</div>
        </motion.div>
        <motion.div 
          className={styles.buttonArea}
          initial={shouldAnimate ? { opacity: 0, y: 10 } : undefined}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.1 }}
        >
          <motion.button 
            style={buttonStyle} 
            onClick={onRandomOpen}
            whileHover={shouldAnimate ? { color: '#666' } : undefined}
            whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
          >
            随机打开
          </motion.button>
          <motion.button 
            style={buttonStyle} 
            onClick={onShowAll}
            whileHover={shouldAnimate ? { color: '#666' } : undefined}
            whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
          >
            所有支线
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Group 卡片区域 */}
      {useSwiper ? (
        /* 超过4个分组时使用 Swiper 横向滚动 */
        <motion.div 
          className={styles.swiperContainer}
          initial={shouldAnimate ? { opacity: 0, y: 10 } : undefined}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.3 }}
        >
          <Swiper
            slideSize={100}
            stuckAtBoundary={false}
            defaultIndex={0}
            indicator={() => null}
            style={{
              '--border-radius': '8px',
            } as React.CSSProperties}
          >
            {pagedGroups.map((pageItems, pageIndex) => (
              <Swiper.Item key={pageIndex}>
                <motion.div 
                  className={styles.swiperPage}
                  initial={shouldAnimate ? { opacity: 0 } : undefined}
                  animate={shouldAnimate ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.3, delay: pageIndex * 0.1 }}
                >
                  {pageItems.map(({ tag, tasks: tagTasks }, itemIndex) => (
                    <motion.div 
                      key={tag.id} 
                      className={styles.swiperGridItem}
                      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : undefined}
                      animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
                      transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                      whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                    >
                      <GroupCard
                        tag={tag}
                        tasks={tagTasks}
                        onClick={() => onGroupClick(tag, tagTasks)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </Swiper.Item>
            ))}
          </Swiper>
        </motion.div>
      ) : (
        /* 4个及以下使用网格布局 */
        <motion.div
          className={styles.grid}
          variants={shouldAnimate ? listContainerVariants : undefined}
          initial={shouldAnimate ? 'hidden' : undefined}
          animate={shouldAnimate ? 'visible' : undefined}
        >
          <AnimatePresence mode="popLayout">
            {groupedTasks.map(({ tag, tasks: tagTasks }, index) => (
              <motion.div
                key={tag.id}
                custom={index}
                variants={shouldAnimate ? gridItemVariants : undefined}
                initial={shouldAnimate ? 'hidden' : undefined}
                animate={shouldAnimate ? 'visible' : undefined}
                exit={shouldAnimate ? { opacity: 0, scale: 0.9 } : undefined}
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                layout={shouldAnimate}
                style={{ willChange: 'transform, opacity' }}
              >
                <GroupCard
                  tag={tag}
                  tasks={tagTasks}
                  onClick={() => onGroupClick(tag, tagTasks)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 底部按钮区域 */}
      <motion.div
        className={styles.buttonArea}
        initial={shouldAnimate ? { opacity: 0, y: 10 } : undefined}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.button
          onClick={onRandomOpen}
          whileHover={shouldAnimate ? { color: '#666' } : undefined}
          whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
          style={buttonStyle}
        >
          随机打开
        </motion.button>
        
        <motion.button
          onClick={onShowAll}
          whileHover={shouldAnimate ? { color: '#666' } : undefined}
          whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
          style={buttonStyle}
        >
          所有支线
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GroupModeGrid;




