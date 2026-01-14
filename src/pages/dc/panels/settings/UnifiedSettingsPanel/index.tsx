/**
 * 统一设置面板组件
 * 整合页面栈管理和所有设置子页面
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import { usePageStack } from '../hooks';
import {
  SettingsMainPage,
  ThemeSettingsPage,
  TagSettingsPage,
  DataManagementPage,
  TodayMustCompletePage,
} from '../pages';
import type { Task } from '@/pages/dc/types';
import styles from './styles.module.css';

export interface UnifiedSettingsPanelProps {
  /** 是否可见 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 支线任务列表（用于今日毕任务） */
  sidelineTasks?: Task[];
  /** 确认今日毕任务选择 */
  onConfirmTodayMustComplete?: (taskIds: string[]) => void;
  /** 跳过今日毕任务 */
  onSkipTodayMustComplete?: () => void;
  /** 标签删除回调 */
  onTagDeleted?: (tagId: string) => void;
  /** 数据变更回调 */
  onDataChanged?: () => void;
}

const UnifiedSettingsPanel: React.FC<UnifiedSettingsPanelProps> = ({
  visible,
  onClose,
  sidelineTasks = [],
  onConfirmTodayMustComplete,
  onSkipTodayMustComplete,
  onTagDeleted,
  onDataChanged,
}) => {
  const { currentPage, push, pop, canGoBack, reset } = usePageStack();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 今日毕任务只读模式
  const [todayMustCompleteReadOnly, setTodayMustCompleteReadOnly] = useState(false);

  // 关闭时重置页面栈
  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  // 处理导航（进入子页面）
  const handleNavigate = useCallback((pageId: string, title: string) => {
    push({ id: pageId, title });
  }, [push]);

  // 处理返回（退出子页面）
  const handleBack = useCallback(() => {
    if (canGoBack) {
      pop();
    } else {
      onClose();
    }
  }, [canGoBack, pop, onClose]);

  // 处理今日毕任务点击
  const handleOpenTodayMustComplete = useCallback((readOnly?: boolean) => {
    setTodayMustCompleteReadOnly(readOnly || false);
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
            tasks={sidelineTasks}
            readOnly={todayMustCompleteReadOnly}
            onConfirm={onConfirmTodayMustComplete || (() => {})}
            onSkip={onSkipTodayMustComplete || (() => {})}
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

  if (!visible) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={containerRef}
        className={styles.container} 
        onClick={e => e.stopPropagation()}
      >
        {/* 主页面头部 - 只在主页面显示 */}
        {currentPage.id === 'main' && (
          <div className={styles.header}>
            <h2 className={styles.title}>设置</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* 页面内容 */}
        <div className={styles.content}>
          {renderPageContent(currentPage.id)}
        </div>

        <SafeArea position="bottom" />
      </div>
    </div>,
    document.body
  );
};

export default UnifiedSettingsPanel;
