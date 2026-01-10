import React from 'react';

// 默认主题色列表（与支线卡片保持一致）
const DEFAULT_THEME_COLORS = [
  '#F6EFEF', '#E0CEC6', '#F1F1E8', '#B9C9B9',
  '#E7E6ED', '#C0BDD1', '#F2F0EB', '#D6CBBD',
  '#EAECEF', '#B8BCC1', '#C6DDE5', '#E8E1B8',
  '#B3BEE5', '#E6D6BB', '#D5C4C0', '#C9D4C9',
  '#D4D1E0', '#E0DDD5', '#D1D8E0', '#D5E0E0'
];

// 根据ID生成固定颜色索引（兼容旧数据）
const getColorFromId = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return DEFAULT_THEME_COLORS[Math.abs(hash) % DEFAULT_THEME_COLORS.length];
};

// 将hex转为rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface Task {
  id: string;
  title: string;
  type: string;
  cycle?: string;
  themeColor?: string;
  mainlineTask?: {
    progress?: {
      currentCyclePercentage?: number;
    };
    cycleConfig?: {
      currentCycle?: number;
      totalCycles?: number;
    };
  };
}

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
  // 取前6个支线任务，如果不足6个则用占位符补充
  const displayTasks = [...tasks.slice(0, 6)];
  while (displayTasks.length < 6) {
    displayTasks.push({ id: `placeholder-${displayTasks.length}`, title: '暂无任务', type: 'placeholder' });
  }

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
        {displayTasks.map((task, index) => {
          // 获取进度数据
          const currentCycle = task.mainlineTask?.cycleConfig?.currentCycle || 1;
          const totalCycles = task.mainlineTask?.cycleConfig?.totalCycles || 1;
          const cycleProgress = task.mainlineTask?.progress?.currentCyclePercentage || 0;
          
          // 获取主题色（优先使用存储的，否则根据ID生成）
          const themeColor = task.type !== 'placeholder' ? (task.themeColor || getColorFromId(task.id)) : '#fafafa';
          
          // 调试信息
          console.log(`Task ${task.title}:`, {
            cycleProgress,
            themeColor,
            hasMainlineTask: !!task.mainlineTask,
            hasProgress: !!task.mainlineTask?.progress
          });
          
          // 渐变背景样式（与原支线卡片逻辑一致）
          // 为了测试，我们先给一个固定的进度值
          const testProgress = cycleProgress > 0 ? cycleProgress : 30; // 测试用30%进度
          
          const gradientStyle = task.type === 'placeholder' 
            ? { backgroundColor: '#fafafa' }
            : {
                background: `linear-gradient(to right, ${hexToRgba(themeColor, 0.15)} 0%, ${hexToRgba(themeColor, 0.5)} ${Math.max(0, testProgress - 5)}%, ${hexToRgba(themeColor, 0.2)} ${testProgress}%, white ${Math.min(100, testProgress + 15)}%)`
              };
          
          return (
            <button
              key={task.id}
              onClick={() => task.type !== 'placeholder' && onTaskClick?.(task.id)}
              disabled={task.type === 'placeholder'}
              style={{
                ...gradientStyle,
                border: '1px dashed #d9d9d9',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '13px',
                color: task.type === 'placeholder' ? '#d0d0d0' : '#6b6b6b',
                cursor: task.type === 'placeholder' ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                fontWeight: '400',
                textAlign: 'left',
                minHeight: '52px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                opacity: task.type === 'placeholder' ? 0.5 : 1,
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                if (task.type !== 'placeholder') {
                  // 悬停时稍微加深渐变效果
                  e.currentTarget.style.background = `linear-gradient(to right, ${hexToRgba(themeColor, 0.2)} 0%, ${hexToRgba(themeColor, 0.6)} ${Math.max(0, testProgress - 5)}%, ${hexToRgba(themeColor, 0.25)} ${testProgress}%, #f8f8f7 ${Math.min(100, testProgress + 15)}%)`;
                }
              }}
              onMouseLeave={(e) => {
                if (task.type !== 'placeholder') {
                  // 恢复原始渐变效果
                  e.currentTarget.style.background = `linear-gradient(to right, ${hexToRgba(themeColor, 0.15)} 0%, ${hexToRgba(themeColor, 0.5)} ${Math.max(0, testProgress - 5)}%, ${hexToRgba(themeColor, 0.2)} ${testProgress}%, white ${Math.min(100, testProgress + 15)}%)`;
                }
              }}
            >
              {/* 任务标题 */}
              <div style={{
                fontSize: '13px',
                fontWeight: '400',
                color: task.type === 'placeholder' ? '#d0d0d0' : '#37352f',
                lineHeight: '1.2'
              }}>
                {task.title}
              </div>
              
              {/* 进度信息 */}
              {task.type !== 'placeholder' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#9b9b9b',
                    fontWeight: '400'
                  }}>
                    {currentCycle}/{totalCycles}次
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#9b9b9b',
                    fontWeight: '400'
                  }}>
                    {Math.round(cycleProgress)}%
                  </span>
                </div>
              )}
            </button>
          );
        })}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6b6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9b9b9b';
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
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6b6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9b9b9b';
          }}
        >
          所有任务
        </button>
      </div>
    </div>
  );
};

export default SidelineTaskGrid;
