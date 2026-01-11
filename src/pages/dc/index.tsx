import { useState } from 'react';
import dayjs from 'dayjs';
import { Plus, X, Archive, Settings as SettingsIcon } from 'lucide-react';

// Components
import CreateMainlineTaskModal from './components/CreateMainlineTaskModal';
import { MainlineTaskCard, SidelineTaskCard } from './components/card';
import MoonPhase from './components/MoonPhase';
import DailyProgress from './components/DailyProgress';
import SidelineTaskGrid from './components/SidelineTaskGrid';
import TodayProgress from './components/TodayProgress';

// Panels
import GoalDetailModal from './panels/detail';
import VacationContent from './panels/happy/VacationContent';
import ArchiveList from './panels/archive';
import Settings from './panels/settings';

// Contexts
import { TaskProvider, useTaskContext, ThemeProvider } from './contexts';

// Hooks
import { useSpriteImage, useTaskSort } from './hooks';

// Constants
import { getNextThemeColor, EMPTY_STATE_IMAGE } from './constants';

// Types
import type { Task, MainlineTask } from './types';

// Styles
import styles from './css/DCPage.module.css';

// Tab 配置
const TABS = [
  { key: 'normal', label: '常规' },
  { key: 'vacation', label: '度假' },
  { key: 'memorial', label: '纪念' }
] as const;

type TabKey = 'home' | 'normal' | 'vacation' | 'memorial';

function DCPageContent() {
  const { tasks, addTask, refreshTasks } = useTaskContext();
  const [mainlineModalVisible, setMainlineModalVisible] = useState(false);
  const [showAllSidelineTasks, setShowAllSidelineTasks] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('normal');
  const [showArchive, setShowArchive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 使用自定义 hooks
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage();
  const { 
    activeTasks, 
    hasMainlineTask, 
    mainlineTasks, 
    sidelineTasks,
    isTodayCompleted,
    isCycleCompleted
  } = useTaskSort(tasks);

  // 处理任务创建（统一处理主线和支线任务）
  const handleCreateTask = (taskData: any) => {
    const today = dayjs().format('YYYY-MM-DD');
    const startDate = taskData.startDate || today;
    const isMainline = taskData.taskCategory === 'MAINLINE';
    
    // 获取下一个可用的主题色
    const usedColors = sidelineTasks.map(t => t.themeColor);
    const nextThemeColor = getNextThemeColor(usedColors);
    
    // 创建任务对象
    const task: MainlineTask = {
      id: Date.now().toString(),
      mainlineType: taskData.mainlineType,
      title: taskData.title,
      status: 'ACTIVE',
      createdAt: today,
      startDate: startDate,
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
      startDate: startDate,
      cycleDays: taskData.cycleDays,
      totalCycles: taskData.totalCycles,
      cycle: `1/${taskData.totalCycles}`,
      themeColor: isMainline ? undefined : nextThemeColor
    };

    addTask(newTask);
    setMainlineModalVisible(false);
  };

  const handleAddClick = () => {
    setMainlineModalVisible(true);
  };

  // 渲染常规模式内容
  const renderNormalContent = () => (
    <>
      {/* 小精灵区域 */}
      <div className={styles.spriteSection}>
        <div className={styles.moonPhaseWrapper}>
          <MoonPhase onClick={randomizeSpriteImage} />
        </div>
        <img 
          src={getCurrentSpriteImage()} 
          alt="可爱的小精灵"
          className={styles.spriteImage}
        />
      </div>

      {/* 主线任务区块 */}
      <div className={styles.taskSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>主线任务</h2>
        </div>
        
        {hasMainlineTask ? (
          mainlineTasks.map(task => (
            <MainlineTaskCard 
              key={task.id} 
              task={task}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))
        ) : (
          <div className={styles.emptyCard} onClick={() => setMainlineModalVisible(true)}>
            <img 
              src={EMPTY_STATE_IMAGE}
              alt="新增主线任务"
              className={styles.emptyCardImage}
            />
            <div className={styles.emptyCardSkeleton}>
              <div className={`${styles.skeletonLine} ${styles.title}`} />
              <div className={`${styles.skeletonLine} ${styles.subtitle}`} />
              <div className={`${styles.skeletonLine} ${styles.progress}`} />
              <div className={`${styles.skeletonLine} ${styles.info}`} />
              <div className={`${styles.skeletonLine} ${styles.small}`} />
            </div>
          </div>
        )}
      </div>

      {/* 支线任务区块 */}
      {sidelineTasks.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>支线任务</h2>
          </div>
          
          <SidelineTaskGrid 
            tasks={sidelineTasks}
            onTaskClick={(taskId) => setSelectedTaskId(taskId)}
            onRandomOpen={() => {
              if (sidelineTasks.length > 0) {
                const randomIndex = Math.floor(Math.random() * sidelineTasks.length);
                setSelectedTaskId(sidelineTasks[randomIndex].id);
              }
            }}
            onShowAll={() => setShowAllSidelineTasks(true)}
          />
        </div>
      )}
    </>
  );

  // 渲染建设中页面
  const renderUnderConstruction = () => (
    <div className={styles.underConstruction}>
      <div className={styles.constructionIcon}>🚧</div>
      <div className={styles.constructionTitle}>建设中</div>
      <div className={styles.constructionSubtitle}>纪念功能即将上线</div>
    </div>
  );

  // 渲染内容区域
  const renderContent = () => {
    switch (activeTab) {
      case 'vacation':
        return <VacationContent onAddClick={handleAddClick} />;
      case 'memorial':
        return renderUnderConstruction();
      case 'normal':
        return renderNormalContent();
      default:
        return (
          <DailyProgress 
            onTaskClick={(taskId) => {
              if (taskId) {
                setSelectedTaskId(taskId);
              } else {
                const mainTask = activeTasks.find(t => t.type === 'mainline');
                if (mainTask) {
                  setSelectedTaskId(mainTask.id);
                } else {
                  setMainlineModalVisible(true);
                }
              }
            }}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {/* Tab 导航 */}
          <div className={styles.tabNav}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : styles.inactive}`}
              >
                {tab.label}
                <span className={`${styles.tabIndicator} ${activeTab === tab.key ? styles.active : styles.inactive}`} />
              </button>
            ))}
          </div>

          {/* 右侧按钮 */}
          <div className={styles.headerActions}>
            <button 
              onClick={() => setShowArchive(true)}
              className={styles.iconButton}
              title="归档任务"
            >
              <Archive size={18} />
            </button>
            <button 
              onClick={handleAddClick}
              className={styles.iconButton}
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className={styles.iconButton}
              title="设置"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${styles.content} ${activeTab === 'normal' ? styles.contentWithBottomBar : ''}`}>
        {renderContent()}
      </div>

      {/* 创建任务弹窗 */}
      <CreateMainlineTaskModal
        visible={mainlineModalVisible}
        onClose={() => setMainlineModalVisible(false)}
        onSubmit={handleCreateTask}
      />

      {/* 所有支线任务抽屉 */}
      {showAllSidelineTasks && (
        <div className={styles.overlay} onClick={() => setShowAllSidelineTasks(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHandle}>
              <div className={styles.drawerHandleBar} />
            </div>

            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>所有支线任务 ({sidelineTasks.length})</h2>
              <button onClick={() => setShowAllSidelineTasks(false)} className={styles.iconButton}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.taskList}>
                {sidelineTasks.map(task => (
                  <SidelineTaskCard 
                    key={task.id} 
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                    isTodayCompleted={isTodayCompleted(task)}
                    isCycleCompleted={isCycleCompleted(task)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 任务详情弹窗 */}
      <GoalDetailModal
        visible={!!selectedTaskId}
        goalId={selectedTaskId || ''}
        onClose={() => setSelectedTaskId(null)}
        onDataChange={refreshTasks}
      />

      {/* 归档列表 */}
      {showArchive && (
        <div className={styles.fullScreenPanel}>
          <ArchiveList 
            onBack={() => setShowArchive(false)}
            onTaskClick={(taskId) => setSelectedTaskId(taskId)}
          />
        </div>
      )}

      {/* 设置面板 */}
      <Settings 
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* 底部今日进度条 */}
      {activeTab === 'normal' && (hasMainlineTask || sidelineTasks.length > 0) && (
        <TodayProgress onTaskSelect={(taskId) => setSelectedTaskId(taskId)} />
      )}
    </div>
  );
}

export default function DCPage() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <DCPageContent />
      </TaskProvider>
    </ThemeProvider>
  );
}
