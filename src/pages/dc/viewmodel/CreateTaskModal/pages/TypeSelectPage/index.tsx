/**
 * 类型选择页面
 * 步骤 2：选择任务类型模板
 */

import React from 'react';
import { TaskTypeCard, BottomNavigation } from '../../components';
import { TASK_TYPE_OPTIONS } from '../../constants';
import type { CreateTaskModalState } from '../../modalTypes';
import styles from './styles.module.css';

export interface TypeSelectPageProps {
  state: CreateTaskModalState;
  setState: React.Dispatch<React.SetStateAction<CreateTaskModalState>>;
  onNext: () => void;
  onBack: () => void;
}

const TypeSelectPage: React.FC<TypeSelectPageProps> = ({
  state,
  setState,
  onNext,
  onBack,
}) => {
  const handleTypeSelect = (type: typeof TASK_TYPE_OPTIONS[0]['type']) => {
    setState(s => ({ ...s, selectedType: type }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sectionTitle}>选择任务类型</div>
        <div className={styles.cardList}>
          {TASK_TYPE_OPTIONS.map((option) => (
            <TaskTypeCard
              key={option.type}
              icon={option.Icon}
              title={option.label}
              description={option.description}
              examples={option.examples}
              feature={option.feature}
              selected={state.selectedType === option.type}
              onClick={() => handleTypeSelect(option.type)}
            />
          ))}
        </div>
      </div>

      <BottomNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!state.selectedType}
      />
    </div>
  );
};

export default TypeSelectPage;
