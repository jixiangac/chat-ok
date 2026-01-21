/**
 * CreateTaskModal - 创建任务弹窗
 * 采用底部 Popup 模式 + 内部页面横移切换
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Popup, SafeArea, Toast } from 'antd-mobile';
import { X, ChevronLeft, Sparkles } from 'lucide-react';
import { AgentChat, type StructuredOutput, type TaskConfigData } from '../../agent';
import type { Category } from '../../types';
import { useScene, useTaskContext, useCultivation } from '../../contexts';
import { getNextThemeColor } from '../../constants';
import { SPIRIT_JADE_COST } from '../../constants/spiritJade';
import { createTask } from '../../utils/migration';
import { getCurrentDate } from '../../utils';
import { usePageStack, useSwipeBack } from '../../panels/settings/hooks';
import { CycleSettingsPage, TypeSelectPage, ConfigPage } from './pages';
import { StepProgressBar } from './components';
import type { CreateTaskModalProps } from './types';
import type { CreateTaskModalState } from './modalTypes';
import { createInitialState } from './modalTypes';
import styles from './styles.module.css';

// 初始页面 - 调整为类型选择
const INITIAL_PAGE = { id: 'type', title: '任务类型' };

// 页面步骤映射 - 调整顺序：类型 -> 配置 -> 周期预览
const PAGE_STEP_MAP: Record<string, number> = {
  type: 1,
  config: 2,
  cycle: 3,
};

export default function CreateTaskModal({
  visible,
  onClose
}: CreateTaskModalProps) {
  const { normal } = useScene();
  const { addTask } = useTaskContext();
  const { canSpendSpiritJade, spendSpiritJade, spiritJadeData } = useCultivation();

  const { hasMainlineTask, sidelineTasks } = normal;

  // 任务类别
  const [taskCategory, setTaskCategory] = useState<'MAINLINE' | 'SIDELINE'>('MAINLINE');

  // 统一状态管理
  const [state, setState] = useState<CreateTaskModalState>(() => createInitialState(getCurrentDate()));

  // 页面栈管理
  const { stack, push, pop, canGoBack, reset } = usePageStack(INITIAL_PAGE);

  // 页面动画状态
  const [pageAnimationState, setPageAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  // 动画计数器，用于强制重新触发 CSS 动画
  const [animationKey, setAnimationKey] = useState(0);
  // AI 模式状态
  const [isAIMode, setIsAIMode] = useState(false);
  // 页面元素 refs，用于强制触发动画
  const pageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const containerRef = useRef<HTMLDivElement>(null);

  // 处理面板显示
  useEffect(() => {
    if (visible) {
      setPageAnimationState('idle');
      setTaskCategory(hasMainlineTask ? 'SIDELINE' : 'MAINLINE');
      setState(createInitialState(getCurrentDate()));
      setIsAIMode(false);
      reset();
    }
  }, [visible, hasMainlineTask, reset]);

  // 处理 AI 生成的任务配置
  const handleAIStructuredOutput = useCallback((output: StructuredOutput) => {
    if (output.type === 'TASK_CONFIG') {
      const config = output.data as TaskConfigData;
      // 将 AI 生成的配置应用到表单
      setState(s => ({
        ...s,
        taskTitle: config.title,
        totalDays: config.totalDays,
        cycleDays: config.cycleDays,
        selectedType: config.category,
      }));
      // 切换回表单模式，跳转到配置页
      setIsAIMode(false);
      // 跳转到配置页和周期预览页让用户确认
      push({ id: 'config', title: '任务配置' });
      push({ id: 'cycle', title: '周期预览' });
      Toast.show({ content: 'AI 已生成任务配置，请确认' });
    }
  }, [push]);

  // 关闭处理
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // 记录需要执行入场动画的新页面 ID
  const pendingEnterPageId = useRef<string | null>(null);

  // 导航到下一页
  const handleNavigate = useCallback((pageId: string, title: string) => {
    pendingEnterPageId.current = pageId;
    setAnimationKey(k => k + 1);
    setPageAnimationState('entering');
    push({ id: pageId, title });
    setTimeout(() => setPageAnimationState('idle'), 300);
  }, [push]);

  // 返回上一页
  const handleBack = useCallback((skipAnimation?: boolean) => {
    if (canGoBack) {
      if (skipAnimation) {
        pop();
        setPageAnimationState('idle');
      } else {
        setPageAnimationState('exiting');
        setTimeout(() => {
          pop();
          setPageAnimationState('idle');
        }, 300);
      }
    } else {
      handleClose();
    }
  }, [canGoBack, pop, handleClose]);

  // 手势返回支持
  const { pageRef: subPageRef } = useSwipeBack({
    onBack: () => handleBack(true),
    enabled: canGoBack,
  });

  const { pageRef: mainPageRef } = useSwipeBack({
    onBack: () => handleClose(),
    enabled: !canGoBack && visible,
  });

  // 获取页面 ref
  const getPageRef = (index: number, pageId: string) => {
    if (index !== stack.length - 1) return undefined;
    return pageId === 'type' ? mainPageRef : subPageRef;
  };

  // 提交任务
  const handleSubmit = useCallback(() => {
    if (!state.taskTitle.trim() || !state.selectedType) {
      Toast.show({ icon: 'fail', content: '请填写完整信息' });
      return;
    }

    const isMainline = taskCategory === 'MAINLINE';
    const requiredJade = isMainline
      ? SPIRIT_JADE_COST.CREATE_MAINLINE_TASK
      : SPIRIT_JADE_COST.CREATE_SIDELINE_TASK;

    if (!canSpendSpiritJade(requiredJade)) {
      Toast.show({
        icon: 'fail',
        content: `灵玉不足！创建${isMainline ? '主线' : '支线'}任务需要 ${requiredJade} 灵玉，当前余额 ${spiritJadeData.balance}`,
      });
      return;
    }

    const cycleInfo = {
      totalCycles: Math.floor(state.totalDays / state.cycleDays),
    };

    // 构建任务数据
    let numericConfig;
    let checklistConfig;
    let checkInConfig;

    if (state.selectedType === 'NUMERIC') {
      const start = parseFloat(state.startValue);
      const target = parseFloat(state.targetValue);
      if (isNaN(start) || isNaN(target)) {
        Toast.show({ icon: 'fail', content: '请输入有效的数值' });
        return;
      }
      const totalChange = Math.abs(target - start);
      numericConfig = {
        direction: state.numericDirection,
        unit: state.numericUnit,
        startValue: start,
        targetValue: target,
        perCycleTarget: totalChange / cycleInfo.totalCycles,
      };
    } else if (state.selectedType === 'CHECKLIST') {
      const items = parseInt(state.totalItems);
      if (isNaN(items) || items < 1) {
        Toast.show({ icon: 'fail', content: '请输入有效的清单项数量' });
        return;
      }
      const filledItems = state.checklistItems.filter(item => item.trim());
      checklistConfig = {
        totalItems: items,
        perCycleTarget: Math.ceil(items / cycleInfo.totalCycles),
        items: filledItems.map((title, index) => ({
          id: `item_${Date.now()}_${index}`,
          title,
          status: 'PENDING' as const,
          cycle: Math.floor(index / Math.ceil(items / cycleInfo.totalCycles)) + 1,
        })),
      };
    } else if (state.selectedType === 'CHECK_IN') {
      checkInConfig = {
        unit: state.checkInUnit,
        allowMultiplePerDay: state.allowMultiple,
        weekendExempt: state.weekendExempt,
        perCycleTarget: 0,
        dailyMaxTimes: undefined as number | undefined,
        cycleTargetTimes: undefined as number | undefined,
        dailyTargetMinutes: undefined as number | undefined,
        cycleTargetMinutes: undefined as number | undefined,
      };

      if (state.checkInUnit === 'TIMES') {
        const maxTimes = parseInt(state.dailyMaxTimes) || 1;
        const cycleTarget = state.cycleTargetTimes
          ? parseInt(state.cycleTargetTimes)
          : state.cycleDays * maxTimes;
        checkInConfig.dailyMaxTimes = maxTimes;
        checkInConfig.cycleTargetTimes = cycleTarget;
        checkInConfig.perCycleTarget = cycleTarget;
      } else if (state.checkInUnit === 'DURATION') {
        const dailyMinutes = parseInt(state.dailyTargetMinutes) || 15;
        const cycleMinutes = state.cycleTargetMinutes
          ? parseInt(state.cycleTargetMinutes)
          : state.cycleDays * dailyMinutes;
        checkInConfig.dailyTargetMinutes = dailyMinutes;
        checkInConfig.cycleTargetMinutes = cycleMinutes;
        checkInConfig.perCycleTarget = cycleMinutes;
      } else if (state.checkInUnit === 'QUANTITY') {
        const dailyValue = parseFloat(state.dailyTargetValue) || 0;
        if (!dailyValue) {
          Toast.show({ icon: 'fail', content: '请输入有效的单日目标数值' });
          return;
        }
        const cycleValue = state.cycleTargetValue
          ? parseFloat(state.cycleTargetValue)
          : state.cycleDays * dailyValue;
        checkInConfig.perCycleTarget = cycleValue;
      }
    }

    // 获取主题色
    const usedColors = sidelineTasks.map(t => t.themeColor).filter(Boolean) as string[];
    const nextThemeColor = getNextThemeColor(usedColors);

    const category: Category = state.selectedType || 'CHECK_IN';

    const newTask = createTask({
      title: state.taskTitle,
      type: isMainline ? 'mainline' : 'sidelineA',
      category,
      from: 'normal',
      startDate: state.startDate,
      totalDays: state.totalDays,
      cycleDays: state.cycleDays,
      priority: isMainline ? undefined : 'medium',
      themeColor: isMainline ? undefined : nextThemeColor,
      numericConfig,
      checklistConfig,
      checkInConfig,
    });

    addTask(newTask);

    spendSpiritJade({
      amount: requiredJade,
      source: 'CREATE_TASK',
      taskId: newTask.id,
      taskTitle: newTask.title,
      description: `创建${isMainline ? '主线' : '支线'}任务「${newTask.title}」`,
    });

    // 彩纸效果
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.5, y: 0.9 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['circle'],
    }).then(() => {
      document.body.removeChild(canvas);
    });

    handleClose();
  }, [
    state,
    taskCategory,
    canSpendSpiritJade,
    spiritJadeData.balance,
    sidelineTasks,
    addTask,
    spendSpiritJade,
    handleClose,
  ]);

  // 获取页面层级样式
  const getPageLayerClass = (index: number) => {
    const isCurrentPage = index === stack.length - 1;
    const isBackgroundPage = index === stack.length - 2;

    if (pageAnimationState === 'entering') {
      // 新页面进入时
      if (isCurrentPage) return styles.pageLayerEntering;
      if (isBackgroundPage) return styles.pageLayerShrinking;
    }

    if (pageAnimationState === 'exiting') {
      // 当前页面退出时
      if (isCurrentPage) return styles.pageLayerExiting;
      if (isBackgroundPage) return styles.pageLayerExpanding;
    }

    if (isCurrentPage) return styles.pageLayerActive;
    if (isBackgroundPage) return styles.pageLayerBackground;

    return styles.pageLayerHidden;
  };

  // 获取当前页面标题
  const getCurrentTitle = () => {
    const currentPage = stack[stack.length - 1];
    switch (currentPage.id) {
      case 'type':
        return `创建${taskCategory === 'MAINLINE' ? '主线' : '支线'}任务`;
      case 'config':
        return '任务配置';
      case 'cycle':
        return '周期配置';
      default:
        return currentPage.title;
    }
  };

  // 获取当前步骤
  const getCurrentStep = () => {
    const currentPage = stack[stack.length - 1];
    return PAGE_STEP_MAP[currentPage.id] || 1;
  };

  // 渲染页面内容 - 顺序：类型 -> 配置 -> 周期预览
  const renderPageContent = (pageId: string) => {
    switch (pageId) {
      case 'type':
        return (
          <TypeSelectPage
            state={state}
            setState={setState}
            onNext={() => handleNavigate('config', '任务配置')}
            onBack={() => handleClose()}
          />
        );
      case 'config':
        return (
          <ConfigPage
            state={state}
            setState={setState}
            onNext={() => handleNavigate('cycle', '周期预览')}
            onBack={() => handleBack()}
            taskCategory={taskCategory}
          />
        );
      case 'cycle':
        return (
          <CycleSettingsPage
            state={state}
            setState={setState}
            onSubmit={handleSubmit}
            onBack={() => handleBack()}
            taskCategory={taskCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position="bottom"
      bodyClassName={styles.popupBody}
    >
      {/* 顶部 Header */}
      <div className={styles.header}>
        <button
          className={styles.headerButton}
          onClick={() => {
            if (isAIMode) {
              setIsAIMode(false);
            } else if (canGoBack) {
              handleBack();
            } else {
              handleClose();
            }
          }}
        >
          {(canGoBack || isAIMode) ? <ChevronLeft size={24} /> : <X size={24} />}
        </button>
        <h2 className={styles.title}>
          {isAIMode ? 'AI 任务助手' : getCurrentTitle()}
        </h2>
        {/* AI 模式切换按钮 - 仅在第一页显示 */}
        {!isAIMode && !canGoBack ? (
          <button
            className={styles.headerButton}
            onClick={() => setIsAIMode(true)}
            title="AI 帮我创建"
          >
            <Sparkles size={20} />
          </button>
        ) : (
          <div className={styles.headerSpacer} />
        )}
      </div>

      {/* iOS 风格进度条 - AI 模式不显示 */}
      {!isAIMode && <StepProgressBar currentStep={getCurrentStep()} totalSteps={3} />}

      {/* AI 模式 - 显示 AgentChat */}
      {isAIMode ? (
        <div className={styles.aiModeContainer}>
          <AgentChat
            role="taskCreator"
            onStructuredOutput={handleAIStructuredOutput}
            placeholder="告诉我你想达成什么目标..."
            hideHeader
          />
        </div>
      ) : (
      /* 页面栈容器 */
      <div className={styles.pageStack} ref={containerRef}>
        {stack.map((page, index) => {
          const isCurrentPage = index === stack.length - 1;
          // 只有新进入的页面使用动态 key（确保每次导航创建新元素）
          const needsAnimationKey = isCurrentPage && pageAnimationState === 'entering';
          const pageKey = needsAnimationKey ? `${page.id}-anim-${animationKey}` : page.id;

          // 收集页面元素 ref，并处理入场动画
          const setPageRef = (el: HTMLDivElement | null) => {
            if (el) {
              pageRefs.current.set(page.id, el);

              // 如果这是新进入的页面，设置入场动画
              if (pendingEnterPageId.current === page.id) {
                // 先禁用 transition，设置到右侧
                el.style.transition = 'none';
                el.style.transform = 'translateX(100%)';
                // 强制 reflow
                void el.offsetHeight;
                // 恢复 transition 并滑入
                el.style.transition = '';
                el.style.transform = '';
                pendingEnterPageId.current = null;
              }
            }
            // 同时处理原有的 ref
            const originalRef = getPageRef(index, page.id);
            if (originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
              (originalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }
          };

          return (
            <div
              key={pageKey}
              ref={setPageRef}
              className={`${styles.pageLayer} ${getPageLayerClass(index)}`}
            >
              {renderPageContent(page.id)}
            </div>
          );
        })}
      </div>
      )}

      <SafeArea position="bottom" />
    </Popup>
  );
}
