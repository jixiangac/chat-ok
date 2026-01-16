import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../types';
import { SidelineTaskCard } from '../../components/card';
import { calculateVisibleSidelineTasks, prefersReducedMotion } from '../../utils/responsive';
import { gridItemVariants, listContainerVariants } from '../../constants/animations';

interface SidelineTaskGridProps {
  tasks: Task[];
  onRandomOpen?: () => void;
  onShowAll?: () => void;
  onTaskClick?: (taskId: string) => void;
}

const SidelineTaskGrid: React.FC<SidelineTaskGridProps> = ({
  tasks,
  onRandomOpen,
  onShowAll,
  onTaskClick
}) => {
  // 动态计算可显示的任务数量
  const [visibleCount, setVisibleCount] = useState(() => calculateVisibleSidelineTasks());
  const [shouldAnimate, setShouldAnimate] = useState(() => !prefersReducedMotion());

  // 监听窗口大小变化，重新计算可显示数量
  const handleResize = useCallback(() => {
    setVisibleCount(calculateVisibleSidelineTasks());
  }, []);

  useEffect(() => {
    // 初始计算
    handleResize();

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 监听用户动画偏好变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [handleResize]);

  // 根据计算结果截取任务
  const displayTasks = tasks.slice(0, visibleCount);

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

  return (
    <div style={{
      padding: '5px 4px',
    }}>
      {/* 支线任务按钮网格 */}
      <motion.div
        variants={shouldAnimate ? listContainerVariants : undefined}
        initial={shouldAnimate ? 'hidden' : undefined}
        animate={shouldAnimate ? 'visible' : undefined}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <AnimatePresence mode="popLayout">
          {displayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              custom={index}
              variants={shouldAnimate ? gridItemVariants : undefined}
              initial={shouldAnimate ? 'hidden' : undefined}
              animate={shouldAnimate ? 'visible' : undefined}
              exit={shouldAnimate ? { opacity: 0, scale: 0.9 } : undefined}
              whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
              layout={shouldAnimate}
              style={{ willChange: 'transform, opacity' }}
            >
              <SidelineTaskCard
                task={task}
                variant="grid"
                onClick={() => onTaskClick?.(task.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 底部按钮区域 */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 10 } : undefined}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center'
        }}
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

export default SidelineTaskGrid;

