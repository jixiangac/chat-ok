import { useRef } from 'react';
import { Plus, Archive, Settings as SettingsIcon } from 'lucide-react';
import { SafeArea } from 'antd-mobile';

// Panels
import { HappyPanel, ArchiveList, UnifiedSettingsPanel, MemorialPanel, NormalPanel } from './panels';
import type { HappyPanelRef } from './panels';
import type { MemorialPanelRef } from './panels';
import type { NormalPanelRef } from './panels/normal';

// ViewModel - 直接消费 Provider 的组件
import { MoonPhase, TodayMustCompleteModal } from './viewmodel';

// Contexts - 新架构
import { 
  AppProvider, 
  WorldProvider, 
  UserProvider, 
  SceneProvider, 
  TaskProvider, 
  UIProvider,
  useUIState, 
  useTaskContext,
  useScene
} from './contexts';

// Styles
import styles from './css/DCPage.module.css';

type TabKey = 'home' | 'normal' | 'vacation' | 'memorial';

function DCPageContent() {
  // 场景状态（从 SceneProvider）
  const { 
    tabs, 
    spriteImage
  } = useScene();
  
  // UI 状态（从 UIProvider）
  const { 
    activeTab, 
    setActiveTab, 
    showArchive, 
    showSettings, 
    openArchive, 
    openSettings, 
    closeArchive, 
    closeSettings
  } = useUIState();
  
  // 任务状态（从 TaskProvider）
  const { setSelectedTaskId } = useTaskContext();
  
  // Panel refs
  const normalPanelRef = useRef<NormalPanelRef>(null);
  const happyPanelRef = useRef<HappyPanelRef>(null);
  const memorialPanelRef = useRef<MemorialPanelRef>(null);

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

  // 过滤显示的 tabs（不显示 okr）
  const displayTabs = tabs.filter(tab => tab.key !== 'okr');

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {/* Tab 导航 */}
          <div className={styles.tabNav}>
            {displayTabs.map((tab) => (
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
            <MoonPhase />
          </div>
          <img 
            src={spriteImage} 
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

      {/* 设置面板 */}
      <UnifiedSettingsPanel 
        visible={showSettings}
        onClose={closeSettings}
      />

      {/* 今日必须完成弹窗 - 直接消费 Provider 数据 */}
      <TodayMustCompleteModal />

      {/* 底部安全区域 */}
      <SafeArea position="bottom" />
    </div>
  );
}

/**
 * DC 页面入口
 * 
 * Provider 层级架构：
 * AppProvider (系统配置：主题、推送)
 *   └─ WorldProvider (世界数据：优惠、活动)
 *       └─ UserProvider (用户信息：等级、索引、今日必完成检查)
 *           └─ UIProvider (UI状态：KV存储、弹窗状态)
 *               └─ SceneProvider (场景数据：tabs、sprite、sidelineTasks、索引、缓存)
 *                   └─ TaskProvider (任务操作：CRUD、计算、选中任务)
 */
export default function DCPage() {
  return (
    <AppProvider>
      <WorldProvider>
        <UserProvider>
          <UIProvider>
            <SceneProvider>
              <TaskProvider>
                <DCPageContent />
              </TaskProvider>
            </SceneProvider>
          </UIProvider>
        </UserProvider>
      </WorldProvider>
    </AppProvider>
  );
}







