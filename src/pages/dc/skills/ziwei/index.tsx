/**
 * 紫微斗数主面板
 * 采用底部 Popup 模式 + 4步页面流程
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Popup, SafeArea, Toast } from 'antd-mobile';
import { X, ChevronLeft } from 'lucide-react';
import type { ZiweiPanelProps, ZiweiStep, BirthInfo, ChartData } from './types';
import { PAGE_STEP_MAP, STORAGE_KEY } from './constants';
import { generateChart } from './utils';
import { IntroPage, BirthFormPage, ChartResultPage, AnalysisPage } from './pages';
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
    case 'result':
      return '命盘结果';
    case 'analysis':
      return 'AI 分析';
    default:
      return '紫微斗数';
  }
}

export default function ZiweiPanel({ visible, onClose }: ZiweiPanelProps) {
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<ZiweiStep>('intro');
  // 步骤历史栈
  const [stepHistory, setStepHistory] = useState<ZiweiStep[]>(['intro']);
  // 出生信息
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  // 命盘数据
  const [chartData, setChartData] = useState<ChartData | null>(null);
  // 页面动画状态
  const [animationState, setAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  // 加载状态
  const [isGenerating, setIsGenerating] = useState(false);

  // 加载已保存的命盘
  useEffect(() => {
    if (visible) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.chartData && data.birthInfo) {
            setBirthInfo(data.birthInfo);
            setChartData(data.chartData);
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }, [visible]);

  // 重置状态
  useEffect(() => {
    if (visible) {
      setCurrentStep('intro');
      setStepHistory(['intro']);
      setAnimationState('idle');
    }
  }, [visible]);

  // 导航到下一步
  const navigateTo = useCallback((step: ZiweiStep) => {
    setAnimationState('entering');
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
    setTimeout(() => setAnimationState('idle'), 300);
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
    setIsGenerating(true);

    // 使用 setTimeout 让 UI 有时间显示 loading 状态
    setTimeout(() => {
      try {
        // 生成命盘
        const chart = generateChart(info);
        setChartData(chart);
        setIsGenerating(false);
        navigateTo('result');
      } catch (error) {
        setIsGenerating(false);
        Toast.show({
          icon: 'fail',
          content: '命盘生成失败，请检查输入信息',
        });
        console.error('Chart generation error:', error);
      }
    }, 100);
  }, [navigateTo]);

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

    if (animationState === 'entering') {
      if (isCurrentPage) return styles.pageLayerEntering;
      if (isBackgroundPage) return styles.pageLayerBackground;
    }

    if (animationState === 'exiting') {
      if (isCurrentPage) return styles.pageLayerExiting;
      if (isBackgroundPage) return styles.pageLayerActive;
    }

    if (isCurrentPage) return styles.pageLayerActive;
    if (isBackgroundPage) return styles.pageLayerBackground;

    return styles.pageLayerHidden;
  };

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
            loading={isGenerating}
          />
        );
      case 'result':
        return chartData ? (
          <ChartResultPage
            chartData={chartData}
            onAIAnalysis={handleAIAnalysis}
            onBack={goBack}
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
