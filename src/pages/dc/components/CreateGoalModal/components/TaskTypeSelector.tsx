import type { TaskType } from '../../../types';
import { TASK_TYPES } from '../constants';

interface TaskTypeSelectorProps {
  taskType: TaskType;
  hasMainlineGoal: boolean;
  onTaskTypeChange: (type: TaskType) => void;
}

export default function TaskTypeSelector({ 
  taskType, 
  hasMainlineGoal, 
  onTaskTypeChange 
}: TaskTypeSelectorProps) {
  return (
    <div style={{
      backgroundColor: '#f8f8f8',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '12px',
        fontWeight: '500'
      }}>
        任务类型（艾森豪威尔矩阵）
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {TASK_TYPES.map((task) => {
          const isDisabled = task.type === 'mainline' && hasMainlineGoal;
          const isSelected = taskType === task.type;
          
          return (
            <button
              key={task.type}
              onClick={() => !isDisabled && onTaskTypeChange(task.type)}
              disabled={isDisabled}
              style={{
                padding: '16px',
                backgroundColor: isSelected ? task.bgColor : 'white',
                border: isSelected ? `2px solid ${task.color}` : '1px solid #e5e5e5',
                borderRadius: '12px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                opacity: isDisabled ? 0.5 : 1,
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: isDisabled ? '#999' : '#333',
                    marginBottom: '4px'
                  }}>
                    {task.label}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    {task.description}
                  </div>
                </div>
                {isSelected && (
                  <span style={{
                    fontSize: '18px',
                    color: task.color
                  }}>✓</span>
                )}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '4px'
              }}>
                {task.subtitle}
              </div>
              {isDisabled && (
                <div style={{
                  fontSize: '11px',
                  color: '#ff4444',
                  marginTop: '6px',
                  fontWeight: '500'
                }}>
                  ⚠️ 已存在主线任务，请先完成或降级
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
