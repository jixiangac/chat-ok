/**
 * 二楼修炼面板组件
 * 全屏大气设计，图片为主视觉
 */

import { memo, useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { ChevronLeft, Zap, Clock } from 'lucide-react';
import { Toast } from 'antd-mobile';
import { REALM_CONFIG, LIANQI_LAYER_NAMES, STAGE_CONFIG } from '../../constants/cultivation';
import type { LianqiLayer, StageType, RealmType } from '../../constants/cultivation';
import type { CultivationData } from '../../types/cultivation';
import { getCurrentLevelInfo, formatExp, getCultivationImageFromData, getSeclusionInfo } from '../../utils/cultivation';
import { useModal, UI_KEYS, useCultivation } from '../../contexts';
import styles from './SecondFloorPanel.module.css';

// ============ 类型定义 ============

export interface SecondFloorPanelProps {
  /** 修仙数据 */
  data: CultivationData;
  /** 是否可见 */
  visible: boolean;
  /** 关闭面板 */
  onClose: () => void;
  /** 突破回调 */
  onBreakthrough?: () => void;
}

// ============ 主组件 ============

function SecondFloorPanelComponent({
  data,
  visible,
  onClose,
  onBreakthrough,
}: SecondFloorPanelProps) {
  const levelInfo = useMemo(() => getCurrentLevelInfo(data), [data]);
  const seclusionInfo = useMemo(() => getSeclusionInfo(data), [data]);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 获取突破方法
  const { breakthrough } = useCultivation();
  
  // 获取创建任务弹窗状态，用于禁用上滑关闭
  const { visible: isCreateTaskModalOpen } = useModal(UI_KEYS.MODAL_CREATE_TASK_VISIBLE);
  // 度假模式弹窗状态
  const { visible: isVacationCreateTripOpen } = useModal(UI_KEYS.MODAL_VACATION_CREATE_TRIP_VISIBLE);
  const { visible: isVacationAddGoalOpen } = useModal(UI_KEYS.MODAL_VACATION_ADD_GOAL_VISIBLE);
  // 纪念日模式弹窗状态
  const { visible: isMemorialCreateOpen } = useModal(UI_KEYS.MODAL_MEMORIAL_CREATE_VISIBLE);
  // 一日清单弹窗状态
  const { visible: isDailyViewOpen } = useModal(UI_KEYS.MODAL_DAILY_VIEW_VISIBLE);
  // 紫微斗数弹窗状态
  const { visible: isZiweiOpen } = useModal(UI_KEYS.MODAL_ZIWEI_VISIBLE);

  // 判断是否有任何创建弹窗打开
  const hasAnyModalOpen = isCreateTaskModalOpen || isVacationCreateTripOpen || isVacationAddGoalOpen || isMemorialCreateOpen || isDailyViewOpen || isZiweiOpen;
  
  // 上滑关闭相关状态
  const [translateY, setTranslateY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // 图片切换动画状态
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [displayedImage, setDisplayedImage] = useState('');

  // 获取当前显示的等级信息
  const displayLevel = useMemo(() => {
    return {
      realm: levelInfo.realm,
      stage: levelInfo.stage,
      layer: levelInfo.layer,
      name: levelInfo.displayName,
    };
  }, [levelInfo]);

  // 获取境界和层级显示（合并为完整名称）
  const realmInfo = REALM_CONFIG[displayLevel.realm];
  const fullLevelName = useMemo(() => {
    const shortName = realmInfo.shortName;
    if (displayLevel.realm === 'LIANQI' && displayLevel.layer !== null) {
      return `${shortName}${LIANQI_LAYER_NAMES[displayLevel.layer as LianqiLayer]}`;
    }
    if (displayLevel.stage !== null) {
      return `${shortName}${STAGE_CONFIG[displayLevel.stage as StageType].name}`;
    }
    return shortName;
  }, [displayLevel.realm, displayLevel.layer, displayLevel.stage, realmInfo.shortName]);

  // 获取当前应该显示的图片 URL
  const targetImage = useMemo(() => {
    return getCultivationImageFromData(data);
  }, [data]);

  // 图片切换动画效果
  useEffect(() => {
    // 初始化时直接设置图片
    if (!displayedImage) {
      setDisplayedImage(targetImage);
      return undefined;
    }
    
    // 如果目标图片与当前显示的图片不同，触发过渡动画
    if (targetImage !== displayedImage) {
      // 先淡出
      setIsImageTransitioning(true);
      
      // 等待淡出动画完成后更新图片
      const fadeOutTimer = setTimeout(() => {
        setDisplayedImage(targetImage);
        
        // 短暂延迟后淡入
        setTimeout(() => {
          setIsImageTransitioning(false);
        }, 50);
      }, 300);
      
      return () => clearTimeout(fadeOutTimer);
    }
    
    return undefined;
  }, [targetImage, displayedImage]);

  // 处理突破
  const handleBreakthrough = useCallback(() => {
    if (!levelInfo.canBreakthrough || levelInfo.isMaxLevel) return;
    
    const result = breakthrough();
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: result.message,
      });
      onBreakthrough?.();
    } else {
      Toast.show({
        icon: 'fail',
        content: result.message,
      });
    }
  }, [levelInfo.canBreakthrough, levelInfo.isMaxLevel, breakthrough, onBreakthrough]);

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 如果创建任务弹窗打开，禁用上滑关闭
    if (hasAnyModalOpen) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;
    
    // 检查是否在内容区域顶部
    const content = contentRef.current;
    if (content && content.scrollTop <= 0) {
      isDragging.current = true;
    }
  }, [hasAnyModalOpen]);

  // 触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const touch = e.touches[0];
    currentY.current = touch.clientY;
    
    const deltaY = startY.current - currentY.current;
    
    // 只处理向上滑动
    if (deltaY > 0) {
      // 使用阻尼效果
      const dampedDistance = Math.min(300, deltaY * 0.6);
      setTranslateY(-dampedDistance);
    }
  }, []);

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaY = startY.current - currentY.current;
    
    // 如果上滑超过阈值，关闭面板
    if (deltaY > 100) {
      setIsClosing(true);
      setTranslateY(-window.innerHeight);
      setTimeout(() => {
        onClose();
        setTranslateY(0);
        setIsClosing(false);
      }, 300);
    } else {
      // 回弹
      setTranslateY(0);
    }
  }, [onClose]);

  // 处理返回点击
  const handleBack = useCallback(() => {
    setIsClosing(true);
    setTranslateY(-window.innerHeight);
    setTimeout(() => {
      onClose();
      setTranslateY(0);
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  // 重置状态
  useEffect(() => {
    if (visible) {
      setTranslateY(0);
      setIsClosing(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      ref={panelRef}
      className={`${styles.panel} ${isClosing ? styles.closing : ''}`}
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部导航栏 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ChevronLeft size={24} />
        </button>
        <span className={styles.headerTitle}>修炼</span>
        <div className={styles.headerPlaceholder} />
      </header>

      {/* 主内容区域 */}
      <main ref={contentRef} className={styles.content}>
        {/* 右上角 - 等级信息 */}
        <div className={styles.levelBadge}>
          <span className={styles.levelName}>{fullLevelName}</span>
        </div>

        {/* 中间 - 大图展示 */}
        <div className={styles.characterSection}>
          <img
            src={displayedImage || targetImage}
            alt="修仙角色"
            className={`${styles.characterImage} ${isImageTransitioning ? styles.imageTransitioning : ''}`}
          />
        </div>

        {/* 底部 - 进度条 */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${levelInfo.progress}%`,
                background: `linear-gradient(90deg, ${levelInfo.color} 0%, ${levelInfo.colorLight} 100%)`
              }}
            />
          </div>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              {levelInfo.canBreakthrough 
                ? '修为圆满，可突破' 
                : `${formatExp(levelInfo.currentExp)} / ${formatExp(levelInfo.expCap)}`}
            </span>
          </div>
        </div>
      </main>

      {/* 底部提示 */}
      <footer className={styles.footer}>
        {/* 闭关状态横幅 */}
        {seclusionInfo && (
          <div className={styles.seclusionBanner}>
            <div className={styles.seclusionIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.seclusionInfo}>
              <div className={styles.seclusionTitle}>
                闭关修炼中 · 剩余 {seclusionInfo.remainingDays} 天
              </div>
              <div className={styles.seclusionDesc}>
                目标修为: {formatExp(seclusionInfo.targetExp)} · 进度: {seclusionInfo.progress.toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* 突破按钮 - 只在可突破时显示 */}
        {!seclusionInfo && levelInfo.canBreakthrough && !levelInfo.isMaxLevel && (
          <button
            className={`${styles.breakthroughButton} ${styles.active}`}
            onClick={handleBreakthrough}
          >
            <Zap size={18} />
            <span>突破</span>
          </button>
        )}

        <div className={styles.swipeHint}>
          <span>上滑关闭</span>
        </div>
      </footer>
    </div>
  );
}

export const SecondFloorPanel = memo(SecondFloorPanelComponent);
export default SecondFloorPanel;



