/**
 * StepProgressBar - 分段式步骤进度条
 * 优雅的三段式进度指示器
 */

import React from 'react';
import styles from './styles.module.css';

export interface StepProgressBarProps {
  /** 当前步骤 (从 1 开始) */
  currentStep: number;
  /** 总步骤数 */
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.segments}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`${styles.segment} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;
