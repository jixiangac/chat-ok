/**
 * 统一设置面板组件
 * 整合页面栈管理和所有设置子页面
 * 支持整屏横移动画和手势返回
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import { usePageStack, useSwipeBack } from '../hooks';
import {
  SettingsMainPage,
  ThemeSettingsPage,
  TagSettingsPage,
  DataManagementPage,
  TodayMustCompletePage,
} from '../pages';
import styles from './styles.module.css';
import '../animations/index.css';

export interface UnifiedSettingsPanelProps {
  /** 是否可见 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标签删除回调 */
  onTagDeleted?: (tagId: string) => void;
  /** 数据变更回调 */
  onDataChanged?: () => void;
}

const UnifiedSettingsPanel: React.FC<UnifiedSettingsPanelProps> = ({
  visible,
  onClose,
  onTagDeleted,
  onDataChanged,
}) => {
  const { currentPage, stack, push, pop, canGoBack, reset } = usePageStack();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 面板动画状态
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // 页面切换动画状态
  const [pageAnimationState, setPageAnimationState] = useState<'idle' | 'entering' | 'exiting' | 'closing'>('idle');
  
  // 处理面板显示/隐藏动画
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      setIsExiting(false);
      setPageAnimationState('idle');
    }
  }, [visible]);

  // 关闭时重置页面栈
  useEffect(() => {
    if (!visible && !isExiting) {
      reset();
    }
  }, [visible, isExiting, reset]);

  // 处理关闭动画 - 主页面右滑退出
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setPageAnimationState('closing');
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      setPageAnimationState('idle');
      onClose();
    }, 400);
  }, [onClose]);

  // 处理导航（进入子页面）
  const handleNavigate = useCallback((pageId: string, title: string) => {
    setPageAnimationState('entering');
    push({ id: pageId, title });
    // 动画完成后重置状态
    setTimeout(() => setPageAnimationState('idle'), 400);
  }, [push]);

  // 处理返回（退出子页面）
  const handleBack = useCallback(() => {
    if (canGoBack) {
      setPageAnimationState('exiting');
      setTimeout(() => {
        pop();
        setPageAnimationState('idle');
      }, 400);
    } else {
      handleClose();
    }
  }, [canGoBack, pop, handleClose]);

  // 子页面手势返回支持
  const { pageRef: subPageRef } = useSwipeBack({
    onBack: handleBack,
    enabled: canGoBack,
  });

  // 主页面手势关闭支持
  const { pageRef: mainPageRef } = useSwipeBack({
    onBack: handleClose,
    enabled: !canGoBack && isVisible && !isExiting,
  });

  // 处理今日毕任务点击
  const handleOpenTodayMustComplete = useCallback((readOnly?: boolean) => {
    handleNavigate('todayMustComplete', '今日毕任务');
  }, [handleNavigate]);

  // 渲染页面内容
  const renderPageContent = (pageId: string) => {
    switch (pageId) {
      case 'theme':
        return <ThemeSettingsPage onBack={handleBack} />;
      case 'tags':
        return <TagSettingsPage onBack={handleBack} onTagDeleted={onTagDeleted} />;
      case 'data':
        return <DataManagementPage onBack={handleBack} onDataChanged={onDataChanged} />;
      case 'todayMustComplete':
        return (
          <TodayMustCompletePage
            onBack={handleBack}
          />
        );
      case 'main':
      default:
        return (
          <SettingsMainPage
            onNavigate={handleNavigate}
            onOpenTodayMustComplete={handleOpenTodayMustComplete}
          />
        );
    }
  };

  // 获取页面层级样式
  const getPageLayerClass = (index: number) => {
    const isCurrentPage = index === stack.length - 1;
    const isBackgroundPage = index === stack.length - 2;
    
    // 主页面关闭时的动画
    if (pageAnimationState === 'closing' && isCurrentPage) {
      return styles.pageLayerExiting;
    }
    
    if (pageAnimationState === 'entering') {
      if (isCurrentPage) return styles.pageLayerEntering;
      if (isBackgroundPage) return styles.pageLayerBackground;
    }
    
    if (pageAnimationState === 'exiting') {
      if (isCurrentPage) return styles.pageLayerExiting;
      if (isBackgroundPage) return styles.pageLayerActive;
    }
    
    if (isCurrentPage) return styles.pageLayerActive;
    if (isBackgroundPage) return styles.pageLayerBackground;
    
    return styles.pageLayerHidden;
  };

  // 获取页面的 ref（主页面用 mainPageRef，子页面用 subPageRef）
  const getPageRef = (index: number, pageId: string) => {
    if (index !== stack.length - 1) return undefined;
    return pageId === 'main' ? mainPageRef : subPageRef;
  };

  if (!isVisible) return null;

  return createPortal(
    <div 
      className={`${styles.panel} ${isExiting ? styles.panelExiting : styles.panelVisible}`}
      ref={containerRef}
    >
      {/* 页面栈 */}
      <div className={styles.pageStack}>
        {stack.map((page, index) => (
          <div
            key={page.id}
            ref={getPageRef(index, page.id)}
            className={`${styles.pageLayer} ${getPageLayerClass(index)}`}
          >
            {/* 主页面头部 - 只在主页面显示，使用返回箭头 */}
            {page.id === 'main' && (
              <div className={styles.header}>
                <button className={styles.backButton} onClick={handleClose}>
                  <ChevronLeft size={24} />
                </button>
                <h2 className={styles.title}>设置</h2>
                <div className={styles.headerSpacer} />
              </div>
            )}

            {/* 页面内容 */}
            <div className={styles.content}>
              {renderPageContent(page.id)}
            </div>
          </div>
        ))}
      </div>

      <SafeArea position="bottom" />
    </div>,
    document.body
  );
};

export default UnifiedSettingsPanel;

