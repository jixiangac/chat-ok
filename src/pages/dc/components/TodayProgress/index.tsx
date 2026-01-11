import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTaskContext } from '../../contexts';
import { Task } from '../../types';
import RandomTaskPicker from '../RandomTaskPicker';
import './index.css';

interface TodayProgressProps {
  onTaskSelect?: (taskId: string) => void;
}

export default function TodayProgress({ onTaskSelect }: TodayProgressProps) {
  const { tasks } = useTaskContext();

  // 计算今日完成率
  const todayProgress = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    
    // 获取所有未归档的主线和支线任务
    const activeTasks = tasks.filter(t => 
      (t.type === 'mainline' || t.type === 'sidelineA' || t.type === 'sidelineB') &&
      (t as any).status !== 'archived'
    );

    if (activeTasks.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    let completedCount = 0;
    const totalCount = activeTasks.length;

    activeTasks.forEach(task => {
      const mainlineTask = task.mainlineTask;
      
      // 检查打卡类型任务的今日完成状态
      if (mainlineTask?.checkInConfig?.records) {
        const todayRecord = mainlineTask.checkInConfig.records.find(r => r.date === today);
        if (todayRecord?.checked) {
          completedCount++;
          return;
        }
      }
      
      // 检查旧版checkIns字段
      if (task.checkIns?.some(c => dayjs(c.date).format('YYYY-MM-DD') === today)) {
        completedCount++;
        return;
      }
    });

    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return {
      completed: completedCount,
      total: totalCount,
      percentage
    };
  }, [tasks]);

  const handleTaskSelect = (taskId: string) => {
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };

  return (
    <div className="today-progress-container">
      <div className="today-progress-section">
        <div className="today-progress-label">今日完成率</div>
        <div className="today-progress-value">{todayProgress.percentage}%</div>
      </div>
      
      <div className="today-progress-try-luck">
        <RandomTaskPicker onSelectTask={handleTaskSelect} />
      </div>
    </div>
  );
}
