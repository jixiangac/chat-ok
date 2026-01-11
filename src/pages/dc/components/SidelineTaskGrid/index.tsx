import React from 'react';
import { Task } from '../../types';
import { SidelineTaskCard } from '../card';

interface SidelineTaskGridProps {
  tasks: Task[];
  onRandomOpen?: () => void;
  onShowAll?: () => void;
  onTaskClick?: (taskId: string) => void;
}

const SidelineTaskGrid: React.FC<SidelineTaskGridProps> = ({
  tasks,
  onRandomOpen,
  onShowAll,
  onTaskClick
}) => {
  // 取前6个支线任务
  const displayTasks = tasks.slice(0, 6);

  return (
    <div style={{
      padding: '5px 4px',
    }}>
      {/* 支线任务按钮网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {displayTasks.map((task) => (
          <SidelineTaskCard
            key={task.id}
            task={task}
            variant="grid"
            onClick={() => onTaskClick?.(task.id)}
          />
        ))}
      </div>

      {/* 底部按钮区域 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        justifyContent: 'center'
      }}>
        <button
          onClick={onRandomOpen}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: '#9b9b9b',
            cursor: 'pointer',
            padding: '0',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
        >
          随机打开
        </button>
        
        <button
          onClick={onShowAll}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: '#9b9b9b',
            cursor: 'pointer',
            padding: '0',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
        >
          所有支线
        </button>
      </div>
    </div>
  );
};

export default SidelineTaskGrid;
