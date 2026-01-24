/**
 * 归档任务子页面
 * 使用 SubPageLayout 布局，提供下拉筛选功能（与支线区域一致）
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Check, ListFilter, CircleCheck } from 'lucide-react';
import { SubPageLayout } from '../../components';
import { useScene, useTaskContext } from '@/pages/dc/contexts';
import GoalDetailModal from '@/pages/dc/panels/detail';
import styles from './styles.module.css';

// 归档页面头图
const ARCHIVE_HEADER_IMAGE = 'https://gw.alicdn.com/imgextra/i4/O1CN01D0Tl411aLPHk7fhz4_!!6000000003313-2-tps-1080-954.png';
const ARCHIVE_HEADER_BACKGROUND = 'linear-gradient(135deg, #E8E0D4 0%, #D4C8BC 100%)';

export interface ArchivePageProps {
  /** 返回上一页 */
  onBack: () => void;
}

type TaskTypeFilter = 'all' | 'mainline' | 'sideline';
type CompletionFilter = 'all' | 'completed' | 'incomplete';

// 任务类型选项
const TASK_TYPE_OPTIONS: { value: TaskTypeFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'mainline', label: '主线' },
  { value: 'sideline', label: '支线' },
];

// 完成状态选项
const COMPLETION_OPTIONS: { value: CompletionFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'completed', label: '已完成' },
  { value: 'incomplete', label: '未完成' },
];

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

const ArchivePage: React.FC<ArchivePageProps> = ({ onBack }) => {
  const { normal } = useScene();
  const { setSelectedTaskId } = useTaskContext();

  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskTypeFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  // 归档任务详情弹窗状态
  const [selectedArchivedTaskId, setSelectedArchivedTaskId] = useState<string | null>(null);

  // 下拉菜单状态
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isCompletionFilterOpen, setIsCompletionFilterOpen] = useState(false);

  const typeFilterRef = useRef<HTMLDivElement>(null);
  const completionFilterRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
        setIsTypeFilterOpen(false);
      }
      if (completionFilterRef.current && !completionFilterRef.current.contains(event.target as Node)) {
        setIsCompletionFilterOpen(false);
      }
    };

    if (isTypeFilterOpen || isCompletionFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTypeFilterOpen, isCompletionFilterOpen]);

  // 从 SceneProvider 获取归档任务
  const archivedTasks = normal.archivedTasks;

  // 筛选任务
  const filteredTasks = useMemo(() => {
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
  }, [archivedTasks, taskTypeFilter, completionFilter]);

  // 处理任务点击 - 打开只读详情弹窗
  const handleTaskClick = (taskId: string) => {
    setSelectedArchivedTaskId(taskId);
  };

  // 获取当前选中的标签文本
  const currentTypeLabel = TASK_TYPE_OPTIONS.find(o => o.value === taskTypeFilter)?.label || '全部';
  const currentCompletionLabel = COMPLETION_OPTIONS.find(o => o.value === completionFilter)?.label || '全部';

  return (
    <SubPageLayout
      title="归档任务"
      description="查看已完成和未完成的归档任务"
      headerImage={ARCHIVE_HEADER_IMAGE}
      headerBackground={ARCHIVE_HEADER_BACKGROUND}
      onBack={onBack}
    >
      <div className={styles.container}>
        {/* 筛选区域 - 与支线区域一致的下拉筛选风格 */}
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            {/* 任务类型筛选 */}
            <div className={styles.filterWrapper} ref={typeFilterRef}>
              <button
                className={`${styles.filterButton} ${taskTypeFilter !== 'all' ? styles.filterActive : ''}`}
                onClick={() => {
                  setIsTypeFilterOpen(!isTypeFilterOpen);
                  setIsCompletionFilterOpen(false);
                }}
              >
                <ListFilter size={14} />
                <span>{currentTypeLabel}</span>
                <ChevronDown size={14} className={`${styles.filterChevron} ${isTypeFilterOpen ? styles.open : ''}`} />
              </button>

              {isTypeFilterOpen && (
                <div className={styles.filterDropdown}>
                  {TASK_TYPE_OPTIONS.map(option => (
                    <div
                      key={option.value}
                      className={`${styles.filterOption} ${taskTypeFilter === option.value ? styles.filterOptionActive : ''}`}
                      onClick={() => {
                        setTaskTypeFilter(option.value);
                        setIsTypeFilterOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {taskTypeFilter === option.value && <Check size={14} className={styles.filterOptionCheck} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 完成状态筛选 */}
            <div className={styles.filterWrapper} ref={completionFilterRef}>
              <button
                className={`${styles.filterButton} ${completionFilter !== 'all' ? styles.filterActive : ''}`}
                onClick={() => {
                  setIsCompletionFilterOpen(!isCompletionFilterOpen);
                  setIsTypeFilterOpen(false);
                }}
              >
                <CircleCheck size={14} />
                <span>{currentCompletionLabel}</span>
                <ChevronDown size={14} className={`${styles.filterChevron} ${isCompletionFilterOpen ? styles.open : ''}`} />
              </button>

              {isCompletionFilterOpen && (
                <div className={styles.filterDropdown}>
                  {COMPLETION_OPTIONS.map(option => (
                    <div
                      key={option.value}
                      className={`${styles.filterOption} ${completionFilter === option.value ? styles.filterOptionActive : ''}`}
                      onClick={() => {
                        setCompletionFilter(option.value);
                        setIsCompletionFilterOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {completionFilter === option.value && <Check size={14} className={styles.filterOptionCheck} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className={styles.listContainer}>
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
                    onClick={() => handleTaskClick(task.id)}
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
        </div>
      </div>

      {/* 归档任务详情弹窗 - 只读模式 */}
      <GoalDetailModal
        visible={!!selectedArchivedTaskId}
        taskId={selectedArchivedTaskId || undefined}
        onClose={() => setSelectedArchivedTaskId(null)}
        isReadOnly
      />
    </SubPageLayout>
  );
};

export default ArchivePage;
