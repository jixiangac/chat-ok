import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { useTaskContext } from '../context';
import { Task } from '../types';
import styles from './RandomTaskPicker.module.css';

interface RandomTaskPickerProps {
  onSelectTask: (taskId: string) => void;
}

export default function RandomTaskPicker({ onSelectTask }: RandomTaskPickerProps) {
  const { tasks } = useTaskContext();
  const [showModal, setShowModal] = useState(false);
  const [pickedTask, setPickedTask] = useState<Task | null>(null);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  // 检查任务今日是否已完成
  const isTodayCompleted = useCallback((task: Task) => {
    const today = dayjs().format('YYYY-MM-DD');
    return task.mainlineTask?.checkInConfig?.records?.some(
      r => r.date === today && r.checked
    ) || false;
  }, []);

  // 获取未完成的支线任务并按优先级排序
  const getEligibleTasks = useCallback(() => {
    // 筛选支线任务，排除已归档、已完成、今日已完成的
    const sidelineTasks = tasks.filter(t => 
      (t.type === 'sidelineA' || t.type === 'sidelineB') &&
      (t as any).status !== 'archived' &&
      !t.completed &&
      t.mainlineTask?.status !== 'COMPLETED' &&
      !isTodayCompleted(t) // 排除今日已完成的任务
    );

    // 排除已经抽过的
    const availableTasks = sidelineTasks.filter(t => !excludedIds.has(t.id));

    // 按优先级排序
    // 时长类任务优先（CHECK_IN类型中的DURATION）
    return availableTasks.sort((a, b) => {
      const aIsDuration = a.mainlineTask?.checkInConfig?.unit === 'DURATION';
      const bIsDuration = b.mainlineTask?.checkInConfig?.unit === 'DURATION';
      
      if (aIsDuration && !bIsDuration) return -1;
      if (!aIsDuration && bIsDuration) return 1;

      return 0;
    });
  }, [tasks, excludedIds, isTodayCompleted]);

  // 随机抽取任务（带权重）
  const pickRandomTask = useCallback(() => {
    const eligibleTasks = getEligibleTasks();
    
    if (eligibleTasks.length === 0) {
      setPickedTask(null);
      return;
    }

    // 权重分配：排序靠前的任务权重更高
    const weights = eligibleTasks.map((_, index) => Math.max(1, eligibleTasks.length - index));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    setPickedTask(eligibleTasks[selectedIndex]);
  }, [getEligibleTasks]);

  // 打开抽签弹层
  const handleOpen = () => {
    setExcludedIds(new Set()); // 重置排除列表
    setShowModal(true);
    pickRandomTask();
  };

  // 关闭弹层
  const handleClose = () => {
    setShowModal(false);
    setPickedTask(null);
  };

  // 确定选择
  const handleConfirm = () => {
    if (pickedTask) {
      onSelectTask(pickedTask.id);
      handleClose();
    }
  };

  // 换一换
  const handleReroll = () => {
    if (pickedTask) {
      setExcludedIds(prev => new Set([...prev, pickedTask.id]));
    }
    
    // 延迟执行以确保excludedIds已更新
    setTimeout(() => {
      const eligibleTasks = tasks.filter(t => 
        (t.type === 'sidelineA' || t.type === 'sidelineB') &&
        (t as any).status !== 'archived' &&
        !t.completed &&
        t.mainlineTask?.status !== 'COMPLETED' &&
        !isTodayCompleted(t) && // 排除今日已完成的任务
        !excludedIds.has(t.id) &&
        t.id !== pickedTask?.id
      );

      if (eligibleTasks.length === 0) {
        setPickedTask(null);
        return;
      }

      // 重新排序和抽取（时长类优先）
      const sorted = eligibleTasks.sort((a, b) => {
        const aIsDuration = a.mainlineTask?.checkInConfig?.unit === 'DURATION';
        const bIsDuration = b.mainlineTask?.checkInConfig?.unit === 'DURATION';
        
        if (aIsDuration && !bIsDuration) return -1;
        if (!aIsDuration && bIsDuration) return 1;

        return 0;
      });

      const weights = sorted.map((_, index) => Math.max(1, sorted.length - index));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;
      
      for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          selectedIndex = i;
          break;
        }
      }

      setPickedTask(sorted[selectedIndex]);
    }, 0);
  };

  // 获取任务类型标签
  const getTaskTypeLabel = (task: Task) => {
    const type = task.mainlineTask?.mainlineType;
    const unit = task.mainlineTask?.checkInConfig?.unit;
    
    if (type === 'CHECK_IN') {
      if (unit === 'DURATION') return '时长打卡';
      if (unit === 'QUANTITY') return '数值打卡';
      return '次数打卡';
    }
    if (type === 'NUMERIC') return '数值目标';
    if (type === 'CHECKLIST') return '清单任务';
    return '支线任务';
  };

  // 获取剩余可抽取数量
  const getRemainingCount = () => {
    const eligibleTasks = tasks.filter(t => 
      (t.type === 'sidelineA' || t.type === 'sidelineB') &&
      (t as any).status !== 'archived' &&
      !t.completed &&
      t.mainlineTask?.status !== 'COMPLETED' &&
      !isTodayCompleted(t) && // 排除今日已完成的任务
      !excludedIds.has(t.id) &&
      t.id !== pickedTask?.id
    );
    return eligibleTasks.length;
  };

  return (
    <>
      <div className={styles.trigger} onClick={handleOpen}>
        <div className={styles.cloud}>
          {/* 可爱圆润小云朵 */}
          <svg 
            className={styles.cloudSvg}
            viewBox="0 0 120 70" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
            </defs>
            {/* 主云体 - 更圆润的形状 */}
            <ellipse cx="60" cy="42" rx="38" ry="22" fill="url(#cloudGradient)" />
            {/* 左侧小鼓包 */}
            <circle cx="32" cy="40" r="16" fill="url(#cloudGradient)" />
            {/* 右侧小鼓包 */}
            <circle cx="88" cy="40" r="14" fill="url(#cloudGradient)" />
            {/* 顶部小鼓包 */}
            <circle cx="50" cy="28" r="14" fill="url(#cloudGradient)" />
            <circle cx="72" cy="26" r="12" fill="url(#cloudGradient)" />
          </svg>
          <span className={styles.cloudText}>试试手气</span>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>随机任务</h3>
              <p className={styles.modalSubtitle}>从支线任务中为你抽取一个</p>
            </div>

            {pickedTask ? (
              <>
                <div 
                  className={styles.taskCard}
                  style={{ 
                    backgroundColor: pickedTask.themeColor 
                      ? `${pickedTask.themeColor}40` 
                      : '#f8f8f8' 
                  }}
                >
                  <h4 className={styles.taskTitle}>{pickedTask.title}</h4>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskTag}>
                      {getTaskTypeLabel(pickedTask)}
                    </span>
                    {!isTodayCompleted(pickedTask) && (
                      <span className={`${styles.taskTag} ${styles.taskTagHighlight}`}>
                        今日待完成
                      </span>
                    )}
                    {pickedTask.mainlineTask?.checkInConfig?.unit === 'DURATION' && (
                      <span className={styles.taskTag}>
                        时长类
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button 
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={handleReroll}
                    disabled={getRemainingCount() === 0}
                  >
                    换一换 {getRemainingCount() > 0 && `(${getRemainingCount()})`}
                  </button>
                  <button 
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    onClick={handleConfirm}
                  >
                    确定
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}></div>
                <p className={styles.emptyText}>
                  {excludedIds.size > 0 
                    ? '已经抽完所有任务啦！' 
                    : '暂无可抽取的支线任务'}
                </p>
                <button 
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={handleClose}
                  style={{ marginTop: '16px' }}
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
