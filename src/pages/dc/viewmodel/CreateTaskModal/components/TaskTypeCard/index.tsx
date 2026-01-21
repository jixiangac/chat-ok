/**
 * 任务类型卡片组件
 * 用于展示任务类型选项
 */

import React from 'react';
import { Check } from 'lucide-react';
import styles from './styles.module.css';

export interface TaskTypeCardProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  examples: string;
  feature: string;
  selected?: boolean;
  animated?: boolean;
  animationIndex?: number;
  onClick?: () => void;
}

const TaskTypeCard: React.FC<TaskTypeCardProps> = ({
  icon: Icon,
  title,
  description,
  examples,
  feature,
  selected = false,
  animated = false,
  animationIndex = 0,
  onClick,
}) => {
  const animationDelay = animated ? `${animationIndex * 60}ms` : undefined;

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${animated ? styles.animated : ''}`}
      style={animated ? {
        animationDelay,
        opacity: 0,
        transform: 'rotateX(-90deg)',
        transformOrigin: 'top center',
      } : undefined}
      onClick={onClick}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Icon size={28} />
        </div>
        <div className={styles.textContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
          <div className={styles.examples}>{examples}</div>
          <div className={styles.feature}>{feature}</div>
        </div>
      </div>
      <div className={styles.checkbox}>
        {selected && <Check size={18} />}
      </div>
    </div>
  );
};

export default TaskTypeCard;
