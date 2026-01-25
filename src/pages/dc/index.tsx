import { useRef, useState, useCallback, useMemo } from 'react';
import { Plus, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { SafeArea } from 'antd-mobile';

// Agent Chat
import { AgentChatPopup, type UserBaseInfo, type StructuredOutput, type TaskConfigData } from './agent';

// Utils
import { getCurrentLevelInfo, getLevelShortName } from './utils/cultivation';

// Panels
import { HappyPanel, UnifiedSettingsPanel, MemorialPanel, NormalPanel } from './panels';
import type { HappyPanelRef } from './panels';
import type { MemorialPanelRef } from './panels';
import type { NormalPanelRef } from './panels/normal';

// ViewModel - 直接消费 Provider 的组件
import { MoonPhase, TodayMustCompleteModal, SpiritJadePage } from './viewmodel';

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

// Skills
import { ZiweiPanel } from './skills/ziwei';
import { ZIWEI_ICON_URL } from './skills/ziwei/constants';

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
    showSettings,
    showTodayMustCompleteModal,
    openSettings,
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
  const { visible: showAllSideline } = useModal(UI_KEYS.MODAL_ALL_SIDELINE_VISIBLE);
  
  // 修仙状态（从 CultivationProvider）
  const { data: cultivationData, breakthrough, spiritJadeData, pointsHistory } = useCultivation();

  // 灵玉历史弹窗状态
  const [showJadeHistory, setShowJadeHistory] = useState(false);

  // AI 任务配置数据（来自 general 角色的 TASK_CONFIG 输出）
  const [aiTaskConfig, setAiTaskConfig] = useState<TaskConfigData | null>(null);

  // 构建 AI 对话所需的用户基础信息
  const userInfo: UserBaseInfo = useMemo(() => {
    const levelInfo = getCurrentLevelInfo(cultivationData);
    const levelShortName = getLevelShortName(cultivationData.realm, cultivationData.stage, cultivationData.layer);
    return {
      spiritJade: spiritJadeData.balance,
      cultivation: cultivationData.currentExp,
      cultivationLevel: levelInfo.displayName,
      cultivationLevelShort: levelShortName,
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

  // 紫微斗数面板
  const [showZiweiPanel, setShowZiweiPanel] = useState(false);

  // 下拉进度回调
  const handlePullProgress = useCallback((progress: number, stage: 'idle' | 'first' | 'second') => {
    setPullProgress(progress);
    setPullStage(stage);
  }, []);

  // 获取创建任务弹窗控制
  const { open: openCreateTaskModal } = useModal(UI_KEYS.MODAL_CREATE_TASK_VISIBLE);

  // 处理 general 角色的结构化输出（TASK_CONFIG）
  const handleGeneralStructuredOutput = useCallback((output: StructuredOutput) => {
    if (output.type === 'TASK_CONFIG') {
      const config = output.data as TaskConfigData;
      // 存储 AI 配置数据
      setAiTaskConfig(config);
      // 关闭小精灵对话
      setShowSpriteChat(false);
      // 切换到 normal tab（如果不在的话）
      if (activeTab !== 'normal') {
        setActiveTab('normal');
      }
      // 打开创建任务弹窗
      openCreateTaskModal();
    }
  }, [activeTab, setActiveTab, openCreateTaskModal]);

  // 判断是否有弹窗打开，有弹窗时禁用下拉进入二楼
  // 包括：设置面板、今日必完成弹窗、任务详情页、创建任务弹窗、度假模式弹窗、纪念日弹窗、一日清单弹窗、灵玉明细
  const hasModalOpen = showSettings ||
    showTodayMustCompleteModal ||
    !!selectedTaskId ||
    showCreateTaskModal ||
    showVacationCreateTrip ||
    showVacationAddGoal ||
    showMemorialCreate ||
    showDailyView ||
    showSpriteChat ||
    showAllSideline ||
    showJadeHistory;

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

  // 清除 AI 配置的回调
  const handleClearAiConfig = useCallback(() => {
    setAiTaskConfig(null);
  }, []);

  // 渲染 tab 对应的内容区域（小精灵下方的部分）
  const renderTabContent = () => {
    switch (activeTab) {
      case 'vacation':
        return <HappyPanel ref={happyPanelRef} />;
      case 'memorial':
        return <MemorialPanel ref={memorialPanelRef} />;
      case 'normal':
        return (
          <NormalPanel
            ref={normalPanelRef}
            aiTaskConfig={aiTaskConfig}
            onClearAiConfig={handleClearAiConfig}
          />
        );
      default:
        return (
          <NormalPanel
            ref={normalPanelRef}
            aiTaskConfig={aiTaskConfig}
            onClearAiConfig={handleClearAiConfig}
          />
        );
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
        triggeredHint="进入苦海"
      />

      {/* 主内容区域 - 下拉时跟随移动 */}
      <div style={mainContentStyle}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {/* 纪念日模式：返回按钮 + 居中标题 + 新增按钮 */}
            {activeTab === 'memorial' ? (
              <>
                <button
                  onClick={() => setActiveTab('normal')}
                  className={styles.backButton}
                  title="返回"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className={styles.headerTitleCenter}>纪念日</span>
                <div className={styles.headerActions}>
                  <button
                    onClick={handleAddClick}
                    className={styles.iconButton}
                    title="新增"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 左侧灵玉入口 */}
                <div className={styles.headerLeftArea}>
                  <div
                    className={styles.headerJadeWrapper}
                    onClick={() => setShowJadeHistory(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src="https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png"
                      alt="灵玉"
                      style={{ width: 30, height: 25 }}
                    />
                    <span className={styles.headerJadeCount}>{spiritJadeData.balance}</span>
                  </div>
                  <span className={styles.headerLevelText}>{userInfo.cultivationLevelShort}</span>
                </div>
                {/* 右侧按钮 */}
                <div className={styles.headerActions}>
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
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`${styles.content} ${activeTab === 'normal' ? styles.contentWithBottomBar : ''}`}>
          {/* 小精灵区域 - 固定不滚动 */}
          <div className={styles.spriteSection}>
            {/* 右上角纪念日入口 - 仅在非纪念日模式下显示 */}
            {activeTab !== 'memorial' && (
              <div
                className={styles.memorialWrapper}
                onClick={() => setActiveTab('memorial')}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="https://gw.alicdn.com/imgextra/i1/O1CN01GivT981sszPWatpbD_!!6000000005823-2-tps-1080-1055.png"
                  alt="纪念日"
                  style={{ width: 40, height: 40 }}
                />
              </div>
            )}
            {/* 紫微斗数入口 - 紧贴纪念日图标下方 */}
            <div
              className={styles.ziweiWrapper}
              onClick={() => setShowZiweiPanel(true)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={ZIWEI_ICON_URL}
                alt="紫微斗数"
                style={{ width: 43, height: 40 }}
              />
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
        onStructuredOutput={handleGeneralStructuredOutput}
      />

      {/* 紫微斗数面板 */}
      <ZiweiPanel
        visible={showZiweiPanel}
        onClose={() => setShowZiweiPanel(false)}
      />

      {/* 底部安全区域 */}
      <SafeArea position="bottom" />

      {/* 灵玉明细页面 */}
      <SpiritJadePage
        visible={showJadeHistory}
        onClose={() => setShowJadeHistory(false)}
        balance={spiritJadeData.balance}
        totalEarned={spiritJadeData.totalEarned}
        totalSpent={spiritJadeData.totalSpent}
        pointsHistory={pointsHistory}
      />
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







