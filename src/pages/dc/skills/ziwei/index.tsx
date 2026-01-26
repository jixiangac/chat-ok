/**
 * 紫微斗数主面板
 * 采用底部 Popup 模式 + 4步页面流程
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Popup, SafeArea, Toast } from 'antd-mobile';
import { X, ChevronLeft } from 'lucide-react';
import type { ZiweiPanelProps, ZiweiStep, BirthInfo, ChartData } from './types';
import { PAGE_STEP_MAP, STORAGE_KEY } from './constants';
import { generateChart } from './utils';
import { IntroPage, BirthFormPage, LoadingPage, ChartResultPage, AnalysisPage } from './pages';
import { useUI, UI_KEYS, useCultivation } from '../../contexts';
import { SPIRIT_JADE_COST } from '../../constants/spiritJade';
import styles from './styles.module.css';

// 长条形进度条组件（参考 CreateTaskModal 的 StepProgressBar）
function StepProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressSegments}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCurrent = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          return (
            <div
              key={i}
              className={`${styles.progressSegment} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// 获取步骤标题
function getStepTitle(step: ZiweiStep): string {
  switch (step) {
    case 'intro':
      return '紫微斗数';
    case 'input':
      return '八字信息';
    case 'loading':
      return '命盘推演';
    case 'result':
      return '命盘结果';
    case 'analysis':
      return 'AI 分析';
    default:
      return '紫微斗数';
  }
}

// 比较两个 BirthInfo 是否相同
function isSameBirthInfo(a: BirthInfo | null, b: BirthInfo | null): boolean {
  if (!a || !b) return false;
  return (
    a.dateType === b.dateType &&
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.hour === b.hour &&
    a.city === b.city &&
    a.gender === b.gender
  );
}

export default function ZiweiPanel({ visible, onClose }: ZiweiPanelProps) {
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<ZiweiStep>('intro');
  // 步骤历史栈
  const [stepHistory, setStepHistory] = useState<ZiweiStep[]>(['intro']);
  // 出生信息（表单数据）
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  // 命盘数据
  const [chartData, setChartData] = useState<ChartData | null>(null);
  // 页面动画状态
  const [animationState, setAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  // 上次成功生成命盘的出生信息（用于判断是否需要重新 loading）
  const [lastGeneratedBirthInfo, setLastGeneratedBirthInfo] = useState<BirthInfo | null>(null);
  // 是否跳过命盘动画（已生成过且数据未变时跳过）
  const [skipChartAnimation, setSkipChartAnimation] = useState(false);
  // 标记是否已从本地存储加载
  const hasLoadedFromStorage = useRef(false);

  // 使用 UI 状态来通知其他组件紫微斗数面板已打开
  const ui = useUI();

  // 灵玉系统
  const { spiritJadeData, spendSpiritJade, canSpendSpiritJade } = useCultivation();
  const chartCost = SPIRIT_JADE_COST.GENERATE_ZIWEI_CHART;

  // 同步 visible 状态到全局 UI 状态（直接调用 ui.set 避免依赖问题）
  useEffect(() => {
    ui.set(UI_KEYS.MODAL_ZIWEI_VISIBLE, visible);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // 加载已保存的数据（表单 + 命盘）
  useEffect(() => {
    if (visible && !hasLoadedFromStorage.current) {
      hasLoadedFromStorage.current = true;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          // 恢复表单数据
          if (data.birthInfo) {
            setBirthInfo(data.birthInfo);
          }
          // 恢复命盘数据和生成标记
          if (data.chartData && data.lastGeneratedBirthInfo) {
            setChartData(data.chartData);
            setLastGeneratedBirthInfo(data.lastGeneratedBirthInfo);
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }, [visible]);

  // 保存数据到本地存储
  const saveToStorage = useCallback((
    newBirthInfo: BirthInfo | null,
    newChartData: ChartData | null,
    newLastGeneratedBirthInfo: BirthInfo | null
  ) => {
    try {
      const dataToSave = {
        birthInfo: newBirthInfo,
        chartData: newChartData,
        lastGeneratedBirthInfo: newLastGeneratedBirthInfo,
        lastUpdatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      // 忽略存储错误
    }
  }, []);

  // 重置步骤状态（但保留数据）
  useEffect(() => {
    if (visible) {
      setCurrentStep('intro');
      setStepHistory(['intro']);
      setAnimationState('idle');
    } else {
      // 面板关闭时重置加载标记，下次打开时重新加载
      hasLoadedFromStorage.current = false;
    }
  }, [visible]);

  // 导航到下一步
  const navigateTo = useCallback((step: ZiweiStep) => {
    // 先设置动画状态，确保新页面以初始位置渲染
    setAnimationState('entering');
    // 然后添加新页面并切换
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
    // 动画结束后恢复空闲状态
    setTimeout(() => setAnimationState('idle'), 350);
  }, []);

  // 返回上一步
  const goBack = useCallback(() => {
    if (stepHistory.length > 1) {
      setAnimationState('exiting');
      setTimeout(() => {
        setStepHistory((prev) => {
          const newHistory = prev.slice(0, -1);
          setCurrentStep(newHistory[newHistory.length - 1]);
          return newHistory;
        });
        setAnimationState('idle');
      }, 300);
    } else {
      onClose();
    }
  }, [stepHistory, onClose]);

  // 处理出生信息提交
  const handleBirthInfoSubmit = useCallback((info: BirthInfo) => {
    setBirthInfo(info);

    // 检查是否和上次生成的数据相同
    const isSameData = isSameBirthInfo(info, lastGeneratedBirthInfo);

    // 如果数据相同且已有命盘，直接跳转到结果页（无需重新生成，跳过动画，不扣费）
    if (isSameData && chartData) {
      // 保存表单数据（即使没变也更新时间戳）
      saveToStorage(info, chartData, lastGeneratedBirthInfo);
      // 跳过动画
      setSkipChartAnimation(true);
      navigateTo('result');
      return;
    }

    // 数据不同，需要重新生成，需要扣费
    // 检查灵玉是否足够
    if (!canSpendSpiritJade(chartCost)) {
      Toast.show({
        icon: 'fail',
        content: '灵玉不足，无法生成命盘',
      });
      return;
    }

    // 扣除灵玉
    const spendSuccess = spendSpiritJade({
      amount: chartCost,
      source: 'ZIWEI_CHART',
      description: '生成紫微命盘',
    });

    if (!spendSuccess) {
      Toast.show({
        icon: 'fail',
        content: '灵玉扣除失败',
      });
      return;
    }

    // 生成命盘
    try {
      const chart = generateChart(info);
      setChartData(chart);
      setLastGeneratedBirthInfo(info);
      // 保存到本地存储
      saveToStorage(info, chart, info);
      // 需要播放动画
      setSkipChartAnimation(false);
      // 跳转到 loading 页面
      navigateTo('loading');
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '命盘生成失败，请检查输入信息',
      });
      console.error('Chart generation error:', error);
    }
  }, [navigateTo, lastGeneratedBirthInfo, chartData, saveToStorage, canSpendSpiritJade, spendSpiritJade, chartCost]);

  // Loading 完成后跳转到结果页
  const handleLoadingComplete = useCallback(() => {
    // 直接设置到 result，不经过 loading 在历史中
    setStepHistory((prev) => {
      // 移除 loading，添加 result
      const withoutLoading = prev.filter(s => s !== 'loading');
      return [...withoutLoading, 'result'];
    });
    setCurrentStep('result');
  }, []);

  // 进入 AI 分析
  const handleAIAnalysis = useCallback(() => {
    navigateTo('analysis');
  }, [navigateTo]);

  // 获取页面层级样式
  const getPageLayerClass = (pageStep: ZiweiStep) => {
    const isCurrentPage = pageStep === currentStep;
    const currentIndex = stepHistory.indexOf(currentStep);
    const pageIndex = stepHistory.indexOf(pageStep);
    const isBackgroundPage = pageIndex === currentIndex - 1;

    // 进入动画：新页面从右侧滑入
    if (animationState === 'entering') {
      if (isCurrentPage) return styles.pageLayerEntering;
      if (isBackgroundPage) return styles.pageLayerBackground;
    }

    // 退出动画：当前页面滑出到右侧
    if (animationState === 'exiting') {
      if (isCurrentPage) return styles.pageLayerExiting;
      if (isBackgroundPage) return styles.pageLayerActive;
    }

    // 空闲状态
    if (isCurrentPage) return styles.pageLayerActive;
    if (isBackgroundPage) return styles.pageLayerBackground;

    return styles.pageLayerHidden;
  };

  // 是否已有命盘
  const hasExistingChart = !!(chartData && lastGeneratedBirthInfo);

  // 渲染页面内容
  const renderPage = (step: ZiweiStep) => {
    switch (step) {
      case 'intro':
        return <IntroPage onStart={() => navigateTo('input')} />;
      case 'input':
        return (
          <BirthFormPage
            initialValues={birthInfo || undefined}
            onSubmit={handleBirthInfoSubmit}
            onBack={goBack}
            loading={false}
            costAmount={chartCost}
            jadeBalance={spiritJadeData.balance}
            hasExistingChart={hasExistingChart}
            lastGeneratedInfo={lastGeneratedBirthInfo}
          />
        );
      case 'loading':
        return <LoadingPage onComplete={handleLoadingComplete} />;
      case 'result':
        return chartData ? (
          <ChartResultPage
            chartData={chartData}
            onAIAnalysis={handleAIAnalysis}
            onBack={goBack}
            skipAnimation={skipChartAnimation}
          />
        ) : null;
      case 'analysis':
        return chartData ? (
          <AnalysisPage chartData={chartData} onBack={goBack} />
        ) : null;
      default:
        return null;
    }
  };

  const canGoBack = stepHistory.length > 1;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyClassName={styles.popupBody}
    >
      {/* 顶部 Header */}
      <div className={styles.header}>
        <button
          className={styles.headerButton}
          onClick={canGoBack ? goBack : onClose}
        >
          {canGoBack ? <ChevronLeft size={24} /> : <X size={24} />}
        </button>
        <h2 className={styles.title}>{getStepTitle(currentStep)}</h2>
        <div className={styles.headerSpacer} />
      </div>

      {/* 进度条 */}
      <StepProgressBar currentStep={PAGE_STEP_MAP[currentStep]} totalSteps={4} />

      {/* 内容区域 */}
      <div className={styles.contentWrapper}>
        <div className={styles.pageStack}>
          {/* 只渲染当前步骤和历史步骤 */}
          {stepHistory.map((step) => (
            <div
              key={step}
              className={`${styles.pageLayer} ${getPageLayerClass(step)}`}
            >
              {renderPage(step)}
            </div>
          ))}
        </div>
      </div>

      <SafeArea position="bottom" />
    </Popup>
  );
}

// 导出组件和类型
export { ZiweiPanel };
export type { ZiweiPanelProps };
