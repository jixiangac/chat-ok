import { useState } from 'react';
import { Calendar, Plane, Plus, X, Archive } from 'lucide-react';
// import CreateGoalModal from './dc/CreateGoalModal';
import CreateMainlineTaskModal from './dc/CreateMainlineTaskModal';
import { MainlineTaskCard, SidelineTaskCard } from './dc/card';
import GoalDetailModal from './dc/detail';
import { Task, MainlineTask } from './dc/types';
import VacationContent from './dc/happy/VacationContent';
import { TaskProvider, useTaskContext } from './dc/context';
import ArchiveList from './dc/archive';

function DemoPageContent() {
  const { tasks, addTask, refreshTasks } = useTaskContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [mainlineModalVisible, setMainlineModalVisible] = useState(false);
  const [showAllSidelineTasks, setShowAllSidelineTasks] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isVacationMode, setIsVacationMode] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // 过滤掉已归档的任务
  const activeTasks = tasks.filter(t => (t as any).status !== 'archived');

  // 检查是否有主线或支线任务（排除已归档）
  const hasMainOrSubTasks = activeTasks.some(t => t.type === 'mainline' || t.type === 'sidelineA' || t.type === 'sidelineB');

  // 获取支线任务（排除已归档）
  const sidelineTasks = activeTasks.filter(t => t.type === 'sidelineA' || t.type === 'sidelineB');
  const displayedSidelineTasks = sidelineTasks.slice(0, 3);

  // 检查是否已有主线任务（排除已归档）
  const hasMainlineTask = activeTasks.some(t => t.type === 'mainline');

  // 处理任务创建（统一处理主线和支线任务）
  const handleCreateTask = (taskData: any) => {
    const today = new Date().toISOString().split('T')[0];
    const isMainline = taskData.taskCategory === 'MAINLINE';
    
    // 创建任务对象
    const task: MainlineTask = {
      id: Date.now().toString(),
      mainlineType: taskData.mainlineType,
      title: taskData.title,
      status: 'ACTIVE',
      createdAt: today,
      cycleConfig: {
        totalDurationDays: taskData.totalDays,
        cycleLengthDays: taskData.cycleDays,
        totalCycles: taskData.totalCycles,
        currentCycle: 1
      },
      progress: {
        totalPercentage: 0,
        currentCyclePercentage: 0
      },
      numericConfig: taskData.numericConfig,
      checklistConfig: taskData.checklistConfig ? {
        ...taskData.checklistConfig,
        completedItems: 0,
        perCycleTarget: Math.ceil(taskData.checklistConfig.totalItems / taskData.totalCycles)
      } : undefined,
      checkInConfig: taskData.checkInConfig ? {
        ...taskData.checkInConfig,
        currentStreak: 0,
        longestStreak: 0,
        checkInRate: 0,
        streaks: [],
        records: []
      } : undefined,
      history: []
    };

    // 创建兼容的 Task 对象
    const newTask: Task = {
      id: task.id,
      title: taskData.title,
      progress: 0,
      currentDay: 0,
      totalDays: taskData.totalDays,
      type: isMainline ? 'mainline' : 'sidelineA',
      mainlineType: taskData.mainlineType,
      mainlineTask: task,
      startDate: today,
      cycleDays: taskData.cycleDays,
      totalCycles: taskData.totalCycles,
      cycle: `1/${taskData.totalCycles}`
    };

    addTask(newTask);
    setMainlineModalVisible(false);
  };

  // 处理添加按钮点击
  const handleAddClick = () => {
    setMainlineModalVisible(true);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 模式切换按钮 */}
            <button 
              onClick={() => setIsVacationMode(!isVacationMode)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isVacationMode ? '#f0f0f0' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isVacationMode ? '#f0f0f0' : 'transparent'}
              title={isVacationMode ? "切换到常规模式" : "切换到度假模式"}
            >
              {isVacationMode ? (
                <Calendar size={20} />
              ) : (
                <Plane size={20} />
              )}
            </button>
            {/* 归档按钮 */}
            <button 
              onClick={() => setShowArchive(true)}
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
              title="归档任务"
            >
              <Archive size={20} />
            </button>
            {/* 添加按钮 */}
            <button 
              onClick={handleAddClick}
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
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State - 常规模式下当没有主线和支线任务时显示 */}
      {/* {!isVacationMode && !hasMainOrSubTasks && (
        <div 
          onClick={handleAddClick}
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
      )} */}

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px'
      }}>
        {isVacationMode ? (
          // 度假模式内容
          <VacationContent onAddClick={handleAddClick} />
        ) : (
          // 常规模式内容
          <>
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
              
              {hasMainlineTask ? (
                activeTasks.filter(t => t.type === 'mainline').map(task => (
                  <MainlineTaskCard 
                    key={task.id} 
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                  />
                ))
              ) : (
                <div
                  onClick={() => setMainlineModalVisible(true)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(55, 53, 47, 0.09)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '120px'
                  }}
                >
                  <img 
                    src="https://img.alicdn.com/imgextra/i4/O1CN01yTnklC1ia4tDwlksJ_!!6000000004428-2-tps-2528-1696.png"
                    alt="新增主线任务"
                    style={{
                      width: '90%',
                      height: 'auto',
                      opacity: 0.3,
                      position: 'absolute',
                      right: '-60px',
                      top: '48%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  {/* 骨架图样式 */}
                  <div style={{ position: 'relative', zIndex: 1, width: '50%' }}>
                    {/* 标题行 */}
                    <div style={{
                      width: '100%',
                      height: '14px',
                      backgroundColor: 'rgba(55, 53, 47, 0.08)',
                      borderRadius: '4px',
                      marginBottom: '16px'
                    }}></div>
                    {/* 周期信息行 */}
                    <div style={{
                      width: '70%',
                      height: '10px',
                      backgroundColor: 'rgba(55, 53, 47, 0.06)',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}></div>
                    {/* 进度条 */}
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'rgba(55, 53, 47, 0.06)',
                      borderRadius: '2px',
                      marginBottom: '16px'
                    }}></div>
                    {/* 总进度行 */}
                    <div style={{
                      width: '60%',
                      height: '10px',
                      backgroundColor: 'rgba(55, 53, 47, 0.06)',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}></div>
                    {/* 底部小进度条 */}
                    <div style={{
                      width: '40%',
                      height: '3px',
                      backgroundColor: 'rgba(55, 53, 47, 0.04)',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              )}
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
          </>
        )}
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

      {/* Create Task Modal (主线/支线任务统一使用) */}
      <CreateMainlineTaskModal
        visible={mainlineModalVisible}
        onClose={() => setMainlineModalVisible(false)}
        onSubmit={handleCreateTask}
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
                <X size={20} />
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
        onDataChange={refreshTasks}
      />

      {/* Archive List */}
      {showArchive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          <ArchiveList 
            onBack={() => setShowArchive(false)}
            onTaskClick={(taskId) => {
              setSelectedTaskId(taskId);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  return (
    <TaskProvider>
      <DemoPageContent />
    </TaskProvider>
  );
}
