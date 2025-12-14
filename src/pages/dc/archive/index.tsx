import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Task } from '../types';
import { useTheme } from '../settings/theme';
import styles from './ArchiveList.module.css';

interface ArchiveListProps {
  onBack: () => void;
  onTaskClick: (taskId: string) => void;
}

// 完成度图片配置
const COMPLETION_IMAGES = {
  perfect: 'https://img.alicdn.com/imgextra/i4/O1CN01F6mnTB1EYIsoD561E_!!6000000000363-2-tps-1546-1128.png',
  excellent: 'https://img.alicdn.com/imgextra/i3/O1CN011IdLil1yQ23Ty5Ri9_!!6000000006572-2-tps-1406-1260.png',
  good: 'https://img.alicdn.com/imgextra/i2/O1CN01lbaPb71byAPZUhGyr_!!6000000003533-2-tps-1409-1248.png',
  nook: 'https://img.alicdn.com/imgextra/i2/O1CN01If1G3b1MgYx39T1Hf_!!6000000001464-2-tps-1389-1229.png',
  fair: 'https://img.alicdn.com/imgextra/i1/O1CN01SRiffz1vcuLIJzIIk_!!6000000006194-2-tps-1456-1285.png',
  poor: 'https://img.alicdn.com/imgextra/i2/O1CN01x4uEXd21IC7oS7CLR_!!6000000006961-2-tps-1494-1322.png',
  bad: 'https://img.alicdn.com/imgextra/i4/O1CN01NC5Fmh1rQIysmewqD_!!6000000005625-2-tps-928-845.png',
  terrible: 'https://img.alicdn.com/imgextra/i2/O1CN01BA0NSS247boF4jf09_!!6000000007344-2-tps-1056-992.png',
};

// 根据完成度获取图片
const getCompletionImage = (completionRate: number): string => {
  if (completionRate >= 100) return COMPLETION_IMAGES.perfect;
  if (completionRate >= 80) return COMPLETION_IMAGES.excellent;
  if (completionRate >= 70) return COMPLETION_IMAGES.good;
  if (completionRate >= 50) return COMPLETION_IMAGES.nook;
  if (completionRate >= 40) return COMPLETION_IMAGES.fair;
  if (completionRate >= 30) return COMPLETION_IMAGES.poor;
  if (completionRate >= 5) return COMPLETION_IMAGES.bad;
  return COMPLETION_IMAGES.terrible;
};

// 计算任务完成率
const calculateCompletionRate = (task: Task): number => {
  const mainlineTask = task.mainlineTask;
  if (!mainlineTask) return 0;

  if (mainlineTask.numericConfig) {
    const config = mainlineTask.numericConfig;
    const originalStart = config.originalStartValue ?? config.startValue;
    const targetValue = config.targetValue;
    const finalValue = config.currentValue;
    const totalChange = Math.abs(targetValue - originalStart);
    const isDecrease = config.direction === 'DECREASE';
    const rawChange = finalValue - originalStart;
    const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
    return totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;
  } else if (mainlineTask.checklistConfig) {
    const config = mainlineTask.checklistConfig;
    return config.totalItems > 0 ? Math.round((config.completedItems / config.totalItems) * 100) : 0;
  } else if (mainlineTask.checkInConfig) {
    const config = mainlineTask.checkInConfig;
    const cycleConfig = mainlineTask.cycleConfig;
    const totalTarget = cycleConfig.totalCycles * config.perCycleTarget;
    const totalCheckIns = config.records?.filter(r => r.checked).length || 0;
    return totalTarget > 0 ? Math.min(100, Math.round((totalCheckIns / totalTarget) * 100)) : 0;
  }
  return 0;
};

// 获取结算数据
const getSettlementData = (task: Task) => {
  const mainlineTask = task.mainlineTask;
  if (!mainlineTask) return { originalStart: 0, targetValue: 0, finalValue: 0, unit: '' };

  if (mainlineTask.numericConfig) {
    const config = mainlineTask.numericConfig;
    return {
      originalStart: config.originalStartValue ?? config.startValue,
      targetValue: config.targetValue,
      finalValue: config.currentValue,
      unit: config.unit
    };
  } else if (mainlineTask.checklistConfig) {
    const config = mainlineTask.checklistConfig;
    return {
      originalStart: 0,
      targetValue: config.totalItems,
      finalValue: config.completedItems,
      unit: '项'
    };
  } else if (mainlineTask.checkInConfig) {
    const config = mainlineTask.checkInConfig;
    const cycleConfig = mainlineTask.cycleConfig;
    const totalTarget = cycleConfig.totalCycles * config.perCycleTarget;
    const totalCheckIns = config.records?.filter(r => r.checked).length || 0;
    return {
      originalStart: 0,
      targetValue: totalTarget,
      finalValue: totalCheckIns,
      unit: '次'
    };
  }
  return { originalStart: 0, targetValue: 0, finalValue: 0, unit: '' };
};

type TaskTypeFilter = 'all' | 'mainline' | 'sideline';
type CompletionFilter = 'all' | 'completed' | 'incomplete';

export default function ArchiveList({ onBack, onTaskClick }: ArchiveListProps) {
  const { themeColors } = useTheme();
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskTypeFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  useEffect(() => {
    const loadArchivedTasks = () => {
      try {
        const stored = localStorage.getItem('dc_tasks');
        if (stored) {
          const tasks = JSON.parse(stored) as Task[];
          const archived = tasks.filter((t: any) => t.status === 'archived');
          setArchivedTasks(archived);
        }
      } catch (error) {
        console.error('Failed to load archived tasks:', error);
      }
    };
    loadArchivedTasks();
  }, []);

  // 筛选任务
  const filteredTasks = archivedTasks.filter(task => {
    // 任务类型筛选
    if (taskTypeFilter === 'mainline' && task.type !== 'mainline') return false;
    if (taskTypeFilter === 'sideline' && task.type === 'mainline') return false;
    
    // 完成状态筛选
    const completionRate = calculateCompletionRate(task);
    if (completionFilter === 'completed' && completionRate < 100) return false;
    if (completionFilter === 'incomplete' && completionRate >= 100) return false;
    
    return true;
  });

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
        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>—</div>
            <p className={styles.emptyText}>暂无归档任务</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filteredTasks.map(task => {
              const completionRate = calculateCompletionRate(task);
              const { originalStart, targetValue, finalValue, unit } = getSettlementData(task);
              const isSuccess = completionRate >= 100;
              const mainlineTask = task.mainlineTask;

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
                      {task.type === 'mainline' ? '主线任务' : '支线任务'}
                    </span>
                  </div>

                  {/* 结算对比 */}
                  <div className={styles.cardStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>初始计划</div>
                      <div className={styles.statValue}>
                        {mainlineTask?.numericConfig 
                          ? `${originalStart} → ${targetValue}${unit}`
                          : `${targetValue}${unit}`
                        }
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>最终结算</div>
                      <div className={styles.statValue}>{finalValue}{unit}</div>
                    </div>
                  </div>

                  {/* 底部统计 */}
                  <div className={styles.cardFooter}>
                    <div className={styles.footerItem}>
                      <div className={styles.footerValue}>
                        {task.totalCycles}/{task.totalCycles}
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
  );
}
