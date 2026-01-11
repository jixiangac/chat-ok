import { useState, useRef } from 'react';
import { Plus, Archive, Settings as SettingsIcon } from 'lucide-react';

// Components
import MoonPhase from './components/MoonPhase';

// Panels
import { HappyPanel, ArchiveList, Settings, MemorialPanel, NormalPanel } from './panels';
import type { HappyPanelRef } from './panels';
import type { MemorialPanelRef } from './panels';
import type { NormalPanelRef } from './panels/normal';

// Contexts
import { TaskProvider, ThemeProvider, UIStateProvider, useUIState } from './contexts';

// Hooks
import { useSpriteImage } from './hooks';

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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Panel refs
  const normalPanelRef = useRef<NormalPanelRef>(null);
  const happyPanelRef = useRef<HappyPanelRef>(null);
  const memorialPanelRef = useRef<MemorialPanelRef>(null);

  // 使用自定义 hooks
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage();

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
        {/* 小精灵区域 - 固定显示 */}
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

        {/* Tab 对应的内容 */}
        {renderTabContent()}
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
      <Settings 
        visible={showSettings}
        onClose={closeSettings}
      />
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

