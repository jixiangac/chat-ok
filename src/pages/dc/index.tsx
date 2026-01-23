import { useRef, useState, useCallback, useMemo } from 'react';
import { Plus, Archive, Settings as SettingsIcon } from 'lucide-react';
import { SafeArea } from 'antd-mobile';

// Agent Chat
import { AgentChatPopup, type UserBaseInfo } from './agent';

// Utils
import { getCurrentLevelInfo } from './utils/cultivation';

// Panels
import { HappyPanel, ArchiveList, UnifiedSettingsPanel, MemorialPanel, NormalPanel } from './panels';
import type { HappyPanelRef } from './panels';
import type { MemorialPanelRef } from './panels';
import type { NormalPanelRef } from './panels/normal';

// ViewModel - 直接消费 Provider 的组件
import { MoonPhase, TodayMustCompleteModal } from './viewmodel';

// Hooks
import { usePullToSecondFloor } from './hooks/usePullToSecondFloor';

// Components
import SecondFloorIndicator from './components/SecondFloorIndicator';

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
  useScene,
  CultivationProvider,
  useCultivation,
  useModal,
  UI_KEYS
} from './contexts';

// Cultivation
import SecondFloorPanel from './panels/cultivation/SecondFloorPanel';

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
    showTodayMustCompleteModal,
    openArchive,
    openSettings,
    closeArchive,
    closeSettings
  } = useUIState();
  
  // 任务状态（从 TaskProvider）
  const { selectedTaskId, setSelectedTaskId } = useTaskContext();
  
  // 创建任务弹窗状态
  const { visible: showCreateTaskModal } = useModal(UI_KEYS.MODAL_CREATE_TASK_VISIBLE);
  
  // 度假模式弹窗状态
  const { visible: showVacationCreateTrip } = useModal(UI_KEYS.MODAL_VACATION_CREATE_TRIP_VISIBLE);
  const { visible: showVacationAddGoal } = useModal(UI_KEYS.MODAL_VACATION_ADD_GOAL_VISIBLE);
  // 纪念日模式弹窗状态
  const { visible: showMemorialCreate } = useModal(UI_KEYS.MODAL_MEMORIAL_CREATE_VISIBLE);
  // 一日清单弹窗状态
  const { visible: showDailyView } = useModal(UI_KEYS.MODAL_DAILY_VIEW_VISIBLE);
  
  // 修仙状态（从 CultivationProvider）
  const { data: cultivationData, breakthrough, spiritJadeData } = useCultivation();

  // 构建 AI 对话所需的用户基础信息
  const userInfo: UserBaseInfo = useMemo(() => {
    const levelInfo = getCurrentLevelInfo(cultivationData);
    return {
      spiritJade: spiritJadeData.balance,
      cultivation: cultivationData.currentExp,
      cultivationLevel: levelInfo.displayName,
    };
  }, [cultivationData, spiritJadeData.balance]);

  // Panel refs
  const normalPanelRef = useRef<NormalPanelRef>(null);
  const happyPanelRef = useRef<HappyPanelRef>(null);
  const memorialPanelRef = useRef<MemorialPanelRef>(null);

  // 二楼状态
  const [pullProgress, setPullProgress] = useState(0);
  const [pullStage, setPullStage] = useState<'idle' | 'first' | 'second'>('idle');

  // AI 小精灵对话状态
  const [showSpriteChat, setShowSpriteChat] = useState(false);

  // 下拉进度回调
  const handlePullProgress = useCallback((progress: number, stage: 'idle' | 'first' | 'second') => {
    setPullProgress(progress);
    setPullStage(stage);
  }, []);

  // 判断是否有弹窗打开，有弹窗时禁用下拉进入二楼
  // 包括：设置面板、归档列表、今日必完成弹窗、任务详情页、创建任务弹窗、度假模式弹窗、纪念日弹窗、一日清单弹窗
  const hasModalOpen = showSettings || 
    showArchive || 
    showTodayMustCompleteModal || 
    !!selectedTaskId || 
    showCreateTaskModal || 
    showVacationCreateTrip || 
    showVacationAddGoal || 
    showMemorialCreate ||
    showDailyView;

  // 下拉进入二楼 Hook
  const {
    containerProps,
    isPulling,
    isInSecondFloor,
    pullDistance,
    leaveSecondFloor
  } = usePullToSecondFloor({
    firstThreshold: 80,
    secondThreshold: 100,
    maxPull: 100,
    enabled: !hasModalOpen,
    onProgress: handlePullProgress,
    onEnterSecondFloor: () => {
      console.log('进入修炼二楼');
    },
    onLeaveSecondFloor: () => {
      console.log('离开修炼二楼');
      setPullProgress(0);
      setPullStage('idle');
    },
  });

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

  // 关闭修炼面板
  const handleCloseCultivation = useCallback(() => {
    leaveSecondFloor();
  }, [leaveSecondFloor]);

  // 处理突破
  const handleBreakthrough = useCallback(() => {
    const result = breakthrough();
    console.log(result.message);
  }, [breakthrough]);

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

  // 计算主内容区域的位移和样式
  const mainContentStyle: React.CSSProperties = {
    transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'none',
    transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: pullDistance > 0 ? '20px 20px 0 0' : '0',
    boxShadow: pullDistance > 0 ? '0 -4px 20px rgba(0, 0, 0, 0.15)' : 'none',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div className={styles.container} {...containerProps}>
      {/* 二楼下拉指示器 */}
      <SecondFloorIndicator
        progress={pullProgress}
        stage={pullStage}
        isPulling={isPulling}
        firstHint="查看等级修为"
        secondHint="查看等级修为"
        triggeredHint="进入二层楼"
      />

      {/* 主内容区域 - 下拉时跟随移动 */}
      <div style={mainContentStyle}>
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
            {/* 右上角灵玉 */}
            <div className={styles.coinWrapper}>
              <img 
                src="https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png"
                alt="灵玉"
                style={{ width: 30, height: 25 }}
              />
              <span className={styles.coinCount}>{spiritJadeData.balance}</span>
            </div>
            {/* 小精灵区域 - 点击唤起 AI 对话 */}
            {/* <div className={styles.moonPhaseWrapper}>
              <MoonPhase />
            </div> */}
            <img
              src={spriteImage}
              alt="可爱的小精灵"
              className={styles.spriteImage}
              onClick={() => setShowSpriteChat(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Tab 对应的内容 - 可滚动区域 */}
          <div className={styles.tabContent}>
            {renderTabContent()}
          </div>
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

      {/* 二楼修炼面板 */}
      <SecondFloorPanel
        data={cultivationData}
        visible={isInSecondFloor}
        onClose={handleCloseCultivation}
        onBreakthrough={handleBreakthrough}
      />

      {/* AI 小精灵对话弹窗 */}
      <AgentChatPopup
        visible={showSpriteChat}
        onClose={() => setShowSpriteChat(false)}
        role="general"
        placeholder="和小精灵聊聊天吧..."
        userInfo={userInfo}
      />

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
            <CultivationProvider>
              <SceneProvider>
                <TaskProvider>
                  <DCPageContent />
                </TaskProvider>
              </SceneProvider>
            </CultivationProvider>
          </UIProvider>
        </UserProvider>
      </WorldProvider>
    </AppProvider>
  );
}







