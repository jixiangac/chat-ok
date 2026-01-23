/**
 * 类型选择页面
 * 步骤 2：选择任务类型模板
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { TaskTypeCard, BottomNavigation } from '../../components';
import { TASK_TYPE_OPTIONS } from '../../constants';
import type { CreateTaskModalState } from '../../modalTypes';
import styles from './styles.module.css';

export interface TypeSelectPageProps {
  state: CreateTaskModalState;
  setState: React.Dispatch<React.SetStateAction<CreateTaskModalState>>;
  onNext: () => void;
  onBack: () => void;
  onAIMode?: () => void;
}

const TypeSelectPage: React.FC<TypeSelectPageProps> = ({
  state,
  setState,
  onNext,
  onBack,
  onAIMode,
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

        {/* AI 入口 - 简洁淡雅风格 */}
        {onAIMode && (
          <div className={styles.aiEntrySection}>
            <button className={styles.aiEntryButton} onClick={onAIMode}>
              <Sparkles size={14} />
              <span>AI 帮我创建</span>
            </button>
          </div>
        )}
      </div>

      <BottomNavigation
        onNext={onNext}
        nextDisabled={!state.selectedType}
      />
    </div>
  );
};

export default TypeSelectPage;
