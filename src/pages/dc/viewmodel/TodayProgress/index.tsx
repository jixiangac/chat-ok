/**
 * TodayProgress 组件
 * 直接消费 TaskProvider 数据
 */

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { SafeArea } from 'antd-mobile';
import { useTaskContext } from '../../contexts';
import { Task } from '../../types';
import RandomTaskPicker from '../RandomTaskPicker';
import DailyViewPopup from '../DailyViewPopup';
import './index.css';

interface TodayProgressProps {
  onTaskSelect?: (taskId: string) => void;
}

export default function TodayProgress({ onTaskSelect }: TodayProgressProps) {
  const { tasks } = useTaskContext();
  const [showDailyView, setShowDailyView] = useState(false);

  // 获取所有活跃任务（用于一日视图）
  const activeTasks = useMemo(() => {
    return tasks.filter(t => 
      (t.type === 'mainline' || t.type === 'sidelineA' || t.type === 'sidelineB') &&
      (t as any).status !== 'archived'
    );
  }, [tasks]);

  // 计算今日完成率
  const todayProgress = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');

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
  }, [activeTasks]);

  const handleTaskSelect = (taskId: string) => {
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };

  const handleDailyViewTaskClick = (taskId: string) => {
    // 不关闭一日视图，让用户可以继续查看
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };

  return (
    <>
      <div className="today-progress-wrapper">
        <div className="today-progress-container">
          <div 
            className="today-progress-section"
            onClick={() => setShowDailyView(true)}
            style={{ cursor: 'pointer' }}
          >
            <div className="today-progress-label">今日完成率</div>
            <div className="today-progress-value">{todayProgress.percentage}%</div>
          </div>
        
          <div className="today-progress-try-luck">
            <RandomTaskPicker onSelectTask={handleTaskSelect} />
          </div>
        </div>
        <SafeArea position="bottom" />
      </div>

      {/* 一日视图弹窗 */}
      <DailyViewPopup
        visible={showDailyView}
        onClose={() => setShowDailyView(false)}
        tasks={activeTasks}
        onTaskClick={handleDailyViewTaskClick}
      />
    </>
  );
}



