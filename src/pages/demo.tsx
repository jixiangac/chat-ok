import { useState, useEffect } from 'react';
import CreateGoalModal from './dc/CreateGoalModal';
import { MainlineTaskCard, SidelineTaskCard } from './dc/card';
import GoalDetailModal from './dc/detail';
import { Task } from './dc/types';

const STORAGE_KEY = 'dc_tasks';

// 从 localStorage 读取任务
const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

// 保存任务到 localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export default function DemoPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAllSidelineTasks, setShowAllSidelineTasks] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
  }, []);

  // 当任务列表变化时保存到 localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  // 检查是否有主线或支线任务
  const hasMainOrSubTasks = tasks.some(t => t.type === 'mainline' || t.type === 'sidelineA' || t.type === 'sidelineB');

  // 获取支线任务
  const sidelineTasks = tasks.filter(t => t.type === 'sidelineA' || t.type === 'sidelineB');
  const displayedSidelineTasks = sidelineTasks.slice(0, 3);

  const handleCreateGoal = (goal: any) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      id: Date.now().toString(),
      title: goal.title,
      progress: 0,
      currentDay: 0,
      totalDays: 180, // 默认6个月
      type: goal.type, // 直接使用 goal.type
      // 添加详情页需要的字段
      icon: goal.icon || '🎯',
      encouragement: goal.encouragement || '',
      startDate: today,
      cycleDays: goal.cycleDays || 10,
      totalCycles: Math.ceil(180 / (goal.cycleDays || 10)),
      minCheckInsPerCycle: 3,
      checkIns: []
    };
    setTasks([...tasks, newTask]);
    setModalVisible(false);
  };

  return (
    <div style={{
      width: '100%',
      minWidth: '390px',
      height: '100vh',
      backgroundColor: 'white',
      borderRadius: '40px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ fontSize: '30px', margin: 0, fontWeight: 'normal' }}>36×10</h1>
          <button 
            onClick={() => setModalVisible(true)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Empty State - 当没有主线和支线任务时显示 */}
      {!hasMainOrSubTasks && (
        <div 
          onClick={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          <img 
            src="https://img.alicdn.com/imgextra/i4/O1CN01yTnklC1ia4tDwlksJ_!!6000000004428-2-tps-2528-1696.png"
            alt="暂无任务"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px'
      }}>
        {/* Cute Ghost Character */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <img 
            src="https://img.alicdn.com/imgextra/i4/O1CN01FgLcMT1COZEIxZ3nG_!!6000000000071-2-tps-1248-832.png" 
            alt="可爱的小精灵"
            style={{
              width: '100%',
              maxWidth: '350px',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Main Task Section */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ padding: '0 8px', marginBottom: '8px' }}>
            <h2 style={{
              fontSize: '12px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
              fontWeight: 'normal'
            }}>主线任务</h2>
          </div>
          
          {tasks.filter(t => t.type === 'mainline').map(task => (
            <MainlineTaskCard 
              key={task.id} 
              task={task}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))}
        </div>

        {/* Sub Tasks Section */}
        <div>
          <div style={{ padding: '0 8px', marginBottom: '8px' }}>
            <h2 style={{
              fontSize: '12px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
              fontWeight: 'normal'
            }}>支线任务</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedSidelineTasks.map(task => (
              <SidelineTaskCard 
                key={task.id} 
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
              />
            ))}
            
            {/* Show More Button */}
            {sidelineTasks.length > 3 && (
              <button
                onClick={() => setShowAllSidelineTasks(true)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontSize: '14px',
                  color: '#666',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                显示更多 ({sidelineTasks.length - 3} 个任务)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div style={{
        height: '24px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '128px',
          height: '4px',
          backgroundColor: 'black',
          borderRadius: '20px',
          opacity: 0.3
        }}></div>
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateGoal}
      />

      {/* All Sideline Tasks Drawer */}
      {showAllSidelineTasks && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowAllSidelineTasks(false)}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Handle */}
            <div style={{
              padding: '12px 0',
              display: 'flex',
              justifyContent: 'center',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#ddd',
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Drawer Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 'normal'
              }}>所有支线任务 ({sidelineTasks.length})</h2>
              <button
                onClick={() => setShowAllSidelineTasks(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 24px',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sidelineTasks.map(task => (
                  <SidelineTaskCard 
                    key={task.id} 
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Goal Detail Modal */}
      <GoalDetailModal
        visible={!!selectedTaskId}
        goalId={selectedTaskId || ''}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}







