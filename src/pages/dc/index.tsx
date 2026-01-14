import { useState, useRef, useEffect } from 'react';
import { Plus, Archive, Settings as SettingsIcon } from 'lucide-react';
import { SafeArea } from 'antd-mobile';

// Components
import MoonPhase from './components/MoonPhase';

// Panels
import { HappyPanel, ArchiveList, UnifiedSettingsPanel, MemorialPanel, NormalPanel } from './panels';
import type { HappyPanelRef } from './panels';
import type { MemorialPanelRef } from './panels';
import type { NormalPanelRef } from './panels/normal';
import TodayMustCompleteModal from './components/TodayMustCompleteModal';

// Contexts
import { TaskProvider, ThemeProvider, UIStateProvider, useUIState, useTaskContext } from './contexts';

// Hooks
import { useSpriteImage, useTaskSort, useTodayMustComplete } from './hooks';

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
  const { activeTab, setActiveTab, showArchive, showSettings, openArchive, openSettings, closeArchive, closeSettings } = useUIState();
  const { tasks } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Panel refs
  const normalPanelRef = useRef<NormalPanelRef>(null);
  const happyPanelRef = useRef<HappyPanelRef>(null);
  const memorialPanelRef = useRef<MemorialPanelRef>(null);

  // 使用自定义 hooks
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage();

  // 获取支线任务
  const { sidelineTasks } = useTaskSort(tasks);

  // 今日必须完成弹窗状态（只读模式）
  const [todayMustCompleteReadOnly, setTodayMustCompleteReadOnly] = useState(false);

  // 今日必须完成功能 - 在顶层管理，所有 TAB 都能触发
  const {
    showModal: showTodayMustCompleteModal,
    openModal: openTodayMustCompleteModal,
    closeModal: closeTodayMustCompleteModal,
    confirmSelection,
    skipSelection,
    checkAndShowModal,
  } = useTodayMustComplete({ sidelineTasks });

  // 组件挂载时检查是否需要显示今日必须完成弹窗
  useEffect(() => {
    checkAndShowModal();
  }, [checkAndShowModal]);

  // 处理添加按钮点击 - 根据当前 tab 触发对应 panel 的添加功能
  const handleAddClick = () => {
    if (activeTab === 'normal') {
      normalPanelRef.current?.triggerAdd();
    } else if (activeTab === 'vacation') {
      happyPanelRef.current?.triggerAdd();
    } else if (activeTab === 'memorial') {
      memorialPanelRef.current?.triggerAdd();
    }
  };

  // 处理打开今日必须完成弹窗
  const handleOpenTodayMustComplete = (readOnly?: boolean) => {
    setTodayMustCompleteReadOnly(readOnly || false);
    openTodayMustCompleteModal();
  };

  // 渲染 tab 对应的内容区域（小精灵下方的部分）
  const renderTabContent = () => {
    switch (activeTab) {
      case 'vacation':
        return <HappyPanel ref={happyPanelRef} />;
      case 'memorial':
        return <MemorialPanel ref={memorialPanelRef} />;
      case 'normal':
        return <NormalPanel ref={normalPanelRef} />;
      default:
        return <NormalPanel ref={normalPanelRef} />;
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
              onClick={openArchive}
              className={styles.iconButton}
              title="归档任务"
            >
              <Archive size={18} />
            </button>
            <button 
              onClick={handleAddClick}
              className={styles.iconButton}
              title="新增"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={openSettings}
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
        {/* 小精灵区域 - 固定不滚动 */}
        <div className={styles.spriteSection}>
          {/* 小精灵区域 */}
            <div className={styles.moonPhaseWrapper}>
            <MoonPhase onClick={randomizeSpriteImage} />
          </div>
          <img 
            src={getCurrentSpriteImage()} 
            alt="可爱的小精灵"
            className={styles.spriteImage}
          />
        </div>

        {/* Tab 对应的内容 - 可滚动区域 */}
        <div className={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>

      {/* 归档列表 */}
      {showArchive && (
        <div className={styles.fullScreenPanel}>
          <ArchiveList 
            onBack={closeArchive}
            onTaskClick={(taskId) => setSelectedTaskId(taskId)}
          />
        </div>
      )}

      {/* 设置面板 - 今日毕任务在设置中作为子页面 */}
      <UnifiedSettingsPanel 
        visible={showSettings}
        onClose={closeSettings}
        sidelineTasks={sidelineTasks}
        onConfirmTodayMustComplete={confirmSelection}
        onSkipTodayMustComplete={skipSelection}
      />

      {/* 今日必须完成弹窗 - 仅用于自动弹出场景 */}
      <TodayMustCompleteModal
        visible={showTodayMustCompleteModal}
        tasks={sidelineTasks}
        readOnly={todayMustCompleteReadOnly}
        onConfirm={confirmSelection}
        onSkip={skipSelection}
        onClose={closeTodayMustCompleteModal}
      />

      {/* 底部安全区域 */}
      <SafeArea position="bottom" />
    </div>
  );
}

export default function DCPage() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <UIStateProvider initialTab="normal">
          <DCPageContent />
        </UIStateProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}
