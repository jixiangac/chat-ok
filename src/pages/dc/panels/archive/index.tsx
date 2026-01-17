import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import { useTheme, useScene } from '../../contexts';
import styles from './ArchiveList.module.css';

interface ArchiveListProps {
  onBack: () => void;
  onTaskClick: (taskId: string) => void;
}

/** 判断是否为支线任务 */
const isSidelineTask = (type: string): boolean => {
  return type === 'sidelineA' || type === 'sidelineB';
};

/** 获取单位显示 */
const getUnit = (category: string, numericUnit?: string): string => {
  if (category === 'NUMERIC') return numericUnit || '';
  if (category === 'CHECKLIST') return '项';
  if (category === 'CHECK_IN') return '次';
  return '';
};

type TaskTypeFilter = 'all' | 'mainline' | 'sideline';
type CompletionFilter = 'all' | 'completed' | 'incomplete';

export default function ArchiveList({ onBack, onTaskClick }: ArchiveListProps) {
  const { themeColors } = useTheme();
  const { normal } = useScene();
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskTypeFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  // 从 SceneProvider 获取归档任务
  const archivedTasks = normal.archivedTasks;

  // 筛选任务
  const filteredTasks = (() => {
    if (!archivedTasks || archivedTasks.length === 0) return [];
    
    return archivedTasks.filter(task => {
      // 任务类型筛选
      if (taskTypeFilter === 'mainline' && task.type !== 'mainline') return false;
      if (taskTypeFilter === 'sideline' && !isSidelineTask(task.type)) return false;
      
      // 完成状态筛选
      const completionRate = task.progress?.totalPercentage || 0;
      if (completionFilter === 'completed' && completionRate < 100) return false;
      if (completionFilter === 'incomplete' && completionRate >= 100) return false;
      
      return true;
    });
  })();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.title}>归档任务</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterButton} ${taskTypeFilter === 'all' ? styles.filterButtonActive : ''}`}
            onClick={() => setTaskTypeFilter('all')}
            style={taskTypeFilter === 'all' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            全部
          </button>
          <button
            className={`${styles.filterButton} ${taskTypeFilter === 'mainline' ? styles.filterButtonActive : ''}`}
            onClick={() => setTaskTypeFilter('mainline')}
            style={taskTypeFilter === 'mainline' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            主线任务
          </button>
          <button
            className={`${styles.filterButton} ${taskTypeFilter === 'sideline' ? styles.filterButtonActive : ''}`}
            onClick={() => setTaskTypeFilter('sideline')}
            style={taskTypeFilter === 'sideline' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            支线任务
          </button>
        </div>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterButton} ${completionFilter === 'all' ? styles.filterButtonActive : ''}`}
            onClick={() => setCompletionFilter('all')}
            style={completionFilter === 'all' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            全部
          </button>
          <button
            className={`${styles.filterButton} ${completionFilter === 'completed' ? styles.filterButtonActive : ''}`}
            onClick={() => setCompletionFilter('completed')}
            style={completionFilter === 'completed' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            已完成
          </button>
          <button
            className={`${styles.filterButton} ${completionFilter === 'incomplete' ? styles.filterButtonActive : ''}`}
            onClick={() => setCompletionFilter('incomplete')}
            style={completionFilter === 'incomplete' ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
          >
            未完成
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {!filteredTasks || filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <p className={styles.emptyText}>暂无归档任务</p>
          </div>
        ) : (
          <div className={styles.list} key={`${taskTypeFilter}-${completionFilter}`}>
            {filteredTasks.map(task => {
              const { progress, cycle, status, category, numericConfig } = task;
              const completionRate = progress?.totalPercentage || 0;
              const isSuccess = status === 'COMPLETED' || completionRate >= 100;
              const isSideline = isSidelineTask(task.type);
              const totalCycles = cycle?.totalCycles || 1;
              const currentCycle = cycle?.currentCycle || 1;
              const unit = getUnit(category, numericConfig?.unit);
              const isNumeric = category === 'NUMERIC';

              return (
                <div 
                  key={task.id} 
                  className={styles.card}
                  onClick={() => onTaskClick(task.id)}
                >
                  {/* 标题和完成标记 */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                      <span className={styles.cardIcon}>{isSuccess ? '✓' : '—'}</span>
                      <h3 className={styles.cardTitle}>{task.title}</h3>
                    </div>
                    <span className={styles.cardBadge}>
                      {isSideline ? '支线任务' : '主线任务'}
                    </span>
                  </div>

                  {/* 结算对比 */}
                  <div className={styles.cardStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>初始计划</div>
                      <div className={styles.statValue}>
                        {isNumeric && numericConfig
                          ? `${numericConfig.originalStartValue ?? numericConfig.startValue} → ${numericConfig.targetValue}${unit}`
                          : `${progress?.cycleTargetValue || 0}${unit}`
                        }
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>最终结算</div>
                      <div className={styles.statValue}>
                        {isNumeric && numericConfig
                          ? `${numericConfig.currentValue}${unit}`
                          : `${progress?.cycleAchieved || 0}${unit}`
                        }
                      </div>
                    </div>
                  </div>

                  {/* 底部统计 */}
                  <div className={styles.cardFooter}>
                    <div className={styles.footerItem}>
                      <div className={styles.footerValue}>
                        {currentCycle}/{totalCycles}
                      </div>
                      <div className={styles.footerLabel}>完成周期</div>
                    </div>
                    <div className={styles.footerItem}>
                      <div className={styles.footerValue}>{completionRate}%</div>
                      <div className={styles.footerLabel}>完成率</div>
                    </div>
                    <div className={styles.footerItem}>
                      <div className={styles.footerValue}>
                        {isSuccess ? '达成' : '未达成'}
                      </div>
                      <div className={styles.footerLabel}>目标状态</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}


