/**
 * 创建/编辑纪念日弹窗 - 步骤式设计
 * 步骤1：基本信息（名称+日期）
 * 步骤2：背景选择（图标+背景+备注）
 * 步骤3：预览确认（灵玉消耗）
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Toast, SafeArea, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import type { Memorial, CreateMemorialInput, MemorialBackground } from '../../types';
import { getDefaultIcon, getDefaultColor, getDefaultBackground } from '../../constants';
import { usePageStack, useSwipeBack } from '../../../../panels/settings/hooks';
import { useCultivation } from '../../../../contexts';
import { InsufficientJadePopup } from '../../../../components';
import { StepProgressBar } from '../../../../viewmodel/CreateTaskModal/components';
import { BasicInfoPage, BackgroundPage } from './pages';
import styles from './styles.module.css';

// 创建纪念日固定消耗 50 灵玉
const MEMORIAL_CREATION_COST = 50;

// 初始页面
const INITIAL_PAGE = { id: 'basic', title: '基本信息' };

// 页面步骤映射（2步流程）
const PAGE_STEP_MAP: Record<string, number> = {
  basic: 1,
  background: 2,
};

// 总步骤数
const TOTAL_STEPS = 2;

interface CreateMemorialModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemorialInput) => void;
  editingMemorial?: Memorial | null;
}

export function CreateMemorialModal({
  visible,
  onClose,
  onSubmit,
  editingMemorial,
}: CreateMemorialModalProps) {
  const { canSpendSpiritJade, spendSpiritJade, spiritJadeData } = useCultivation();

  // 表单状态
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [icon, setIcon] = useState(getDefaultIcon().name);
  const [iconColor, setIconColor] = useState(getDefaultColor());
  const [note, setNote] = useState('');
  const [background, setBackground] = useState<MemorialBackground>(getDefaultBackground());

  // 页面栈管理
  const { stack, push, pop, canGoBack, reset } = usePageStack(INITIAL_PAGE);

  // 页面动画状态
  const [pageAnimationState, setPageAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const [animationKey, setAnimationKey] = useState(0);

  // 灵玉不足弹窗状态
  const [insufficientJadePopup, setInsufficientJadePopup] = useState<{
    visible: boolean;
    requiredAmount: number;
  }>({ visible: false, requiredAmount: 0 });

  // 记录需要执行入场动画的新页面 ID
  const pendingEnterPageId = useRef<string | null>(null);
  const pageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 编辑模式时填充数据
  useEffect(() => {
    if (visible) {
      if (editingMemorial) {
        setName(editingMemorial.name);
        setDate(new Date(editingMemorial.date));
        setIcon(editingMemorial.icon);
        setIconColor(editingMemorial.iconColor);
        setNote(editingMemorial.note || '');
        setBackground(editingMemorial.background);
      } else {
        // 重置表单
        setName('');
        setDate(new Date());
        setIcon(getDefaultIcon().name);
        setIconColor(getDefaultColor());
        setNote('');
        setBackground(getDefaultBackground());
      }
      reset();
      setPageAnimationState('idle');
    }
  }, [editingMemorial, visible, reset]);

  // 表单验证
  const isValid = name.trim().length > 0 && date !== null;

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
      onClose();
    }
  }, [canGoBack, pop, onClose]);

  // 手势返回支持 - 只有子页面支持手势返回，第一个页面禁用手势（防止误关闭）
  const { pageRef: subPageRef, bindEvents: bindSubPageEvents } = useSwipeBack({
    onBack: () => handleBack(true),
    enabled: canGoBack,
  });

  // 获取页面 ref - 只有子页面需要绑定手势 ref
  const getPageRef = (index: number, pageId: string) => {
    if (index !== stack.length - 1) return undefined;
    // 第一个页面 'basic' 不绑定手势，返回 undefined
    return pageId === 'basic' ? undefined : subPageRef;
  };

  // 提交表单
  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    // 编辑模式不消耗灵玉
    if (!editingMemorial) {
      if (!canSpendSpiritJade(MEMORIAL_CREATION_COST)) {
        setInsufficientJadePopup({
          visible: true,
          requiredAmount: MEMORIAL_CREATION_COST,
        });
        return;
      }
    }

    const dateStr = dayjs(date).format('YYYY-MM-DD');
    onSubmit({
      name: name.trim(),
      date: dateStr,
      icon,
      iconColor,
      note: note.trim() || undefined,
      background,
    });

    // 创建模式扣除灵玉
    if (!editingMemorial) {
      spendSpiritJade({
        amount: MEMORIAL_CREATION_COST,
        source: 'CREATE_MEMORIAL',
        description: `创建纪念日「${name.trim()}」`,
      });
      Toast.show({ icon: 'success', content: '纪念日创建成功' });
    } else {
      Toast.show({ icon: 'success', content: '保存成功' });
    }

    onClose();
  }, [isValid, name, date, icon, iconColor, note, background, onSubmit, onClose, editingMemorial, canSpendSpiritJade, spendSpiritJade]);

  // 获取页面层级样式
  const getPageLayerClass = (index: number) => {
    const isCurrentPage = index === stack.length - 1;
    const isBackgroundPage = index === stack.length - 2;

    if (pageAnimationState === 'entering') {
      if (isCurrentPage) return styles.pageLayerEntering;
      if (isBackgroundPage) return styles.pageLayerShrinking;
    }

    if (pageAnimationState === 'exiting') {
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
    if (editingMemorial) {
      return currentPage.id === 'basic' ? '编辑纪念日' : '预览效果';
    }
    switch (currentPage.id) {
      case 'basic':
        return '创建纪念日';
      case 'background':
        return '预览效果';
      default:
        return currentPage.title;
    }
  };

  // 获取当前步骤
  const getCurrentStep = () => {
    const currentPage = stack[stack.length - 1];
    return PAGE_STEP_MAP[currentPage.id] || 1;
  };

  // 渲染页面内容（2步流程）
  const renderPageContent = (pageId: string) => {
    switch (pageId) {
      case 'basic':
        // 第一步：名称、日期、图标、背景、备注
        return (
          <BasicInfoPage
            name={name}
            date={date}
            icon={icon}
            iconColor={iconColor}
            background={background}
            note={note}
            onNameChange={setName}
            onDateChange={setDate}
            onIconChange={setIcon}
            onIconColorChange={setIconColor}
            onBackgroundChange={setBackground}
            onNoteChange={setNote}
            onNext={() => handleNavigate('background', '预览效果')}
          />
        );
      case 'background':
        // 第二步：预览效果、灵玉消耗
        return (
          <BackgroundPage
            name={name}
            date={date}
            icon={icon}
            iconColor={iconColor}
            background={background}
            note={note}
            isEditing={!!editingMemorial}
            onSubmit={handleSubmit}
            onBack={() => handleBack()}
          />
        );
      default:
        return null;
    }
  };

  // 阻止背景点击关闭
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 使用 Popup 组件渲染
  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={onClose}
        position="bottom"
        bodyClassName={styles.popupBody}
      >
        {/* 头部 */}
        <div className={styles.header}>
          <button
            className={styles.headerButton}
            onClick={() => {
              if (canGoBack) {
                handleBack();
              } else {
                onClose();
              }
            }}
            type="button"
          >
            {canGoBack ? <ChevronLeft size={24} /> : <X size={20} />}
          </button>
          <h2 className={styles.title}>
            {getCurrentTitle()}
          </h2>
          <div className={styles.headerSpacer} />
        </div>

        {/* 分段进度条 */}
        <StepProgressBar currentStep={getCurrentStep()} totalSteps={TOTAL_STEPS} />

        {/* 内容区域包裹容器 */}
        <div className={styles.contentWrapper}>
          {/* 页面栈容器 */}
          <div className={styles.pageStack}>
            {stack.map((page, index) => {
              const isCurrentPage = index === stack.length - 1;
              const needsAnimationKey = isCurrentPage && pageAnimationState === 'entering';
              const pageKey = needsAnimationKey ? `${page.id}-anim-${animationKey}` : page.id;

              const setPageRef = (el: HTMLDivElement | null) => {
                if (el) {
                  pageRefs.current.set(page.id, el);

                  if (pendingEnterPageId.current === page.id) {
                    el.style.transition = 'none';
                    el.style.transform = 'translateX(100%)';
                    void el.offsetHeight;
                    el.style.transition = '';
                    el.style.transform = '';
                    pendingEnterPageId.current = null;
                  }

                  // 为子页面绑定手势事件（第一个页面 'basic' 不绑定手势）
                  if (index === stack.length - 1 && page.id !== 'basic') {
                    bindSubPageEvents(el);
                  }
                }
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
        </div>

        <SafeArea position="bottom" />
      </Popup>

      {/* 灵玉不足弹窗 */}
      <InsufficientJadePopup
        visible={insufficientJadePopup.visible}
        currentBalance={spiritJadeData.balance}
        requiredAmount={insufficientJadePopup.requiredAmount}
        onClose={() => setInsufficientJadePopup({ visible: false, requiredAmount: 0 })}
      />
    </>
  );
}

export default CreateMemorialModal;
