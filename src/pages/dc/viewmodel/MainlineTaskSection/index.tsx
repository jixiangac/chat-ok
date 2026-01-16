/**
 * 主线任务区块组件
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainlineTaskCard } from '../../components/card';
import { useScene, useTaskContext } from '../../contexts';
import { fadeVariants, cardVariants } from '../../constants/animations';
import { EMPTY_STATE_IMAGE } from '../../constants';
import styles from './styles.module.css';

interface MainlineTaskSectionProps {
  /** 添加任务回调 */
  onAddClick: () => void;
}

const MainlineTaskSection: React.FC<MainlineTaskSectionProps> = ({ onAddClick }) => {
  // 从 context 获取数据
  const { normal } = useScene();
  const { setSelectedTaskId } = useTaskContext();
  
  const { hasMainlineTask, mainlineTasks } = normal;

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={styles.taskSection}
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>主线任务</h2>
      </div>
      
      <AnimatePresence mode="wait">
        {hasMainlineTask ? (
          mainlineTasks.map((task, index) => (
            <motion.div
              key={task.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileTap="tap"
            >
              <MainlineTaskCard 
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            whileTap={{ scale: 0.98 }}
            className={styles.emptyCard}
            onClick={onAddClick}
          >
            <img 
              src={EMPTY_STATE_IMAGE}
              alt="新增主线任务"
              className={styles.emptyCardImage}
            />
            <div className={styles.emptyCardSkeleton}>
              <div className={`${styles.skeletonLine} ${styles.title}`} />
              <div className={`${styles.skeletonLine} ${styles.subtitle}`} />
              <div className={`${styles.skeletonLine} ${styles.progress}`} />
              <div className={`${styles.skeletonLine} ${styles.info}`} />
              <div className={`${styles.skeletonLine} ${styles.small}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainlineTaskSection;

