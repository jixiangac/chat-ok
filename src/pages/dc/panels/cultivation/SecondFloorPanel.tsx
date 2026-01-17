/**
 * 二楼修炼面板组件
 * 全屏大气设计，图片为主视觉
 */

import { memo, useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { REALM_CONFIG, LIANQI_LAYER_NAMES, STAGE_CONFIG } from '../../constants/cultivation';
import type { LianqiLayer, StageType } from '../../constants/cultivation';
import type { CultivationData } from '../../types/cultivation';
import { getCurrentLevelInfo, formatExp } from '../../utils/cultivation';
import styles from './SecondFloorPanel.module.css';

// 修仙角色图片
const CULTIVATION_IMAGE = 'https://img.alicdn.com/imgextra/i3/O1CN01J34xYC1WIQEsC45B7_!!6000000002765-2-tps-1264-848.png';

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
}: SecondFloorPanelProps) {
  const levelInfo = useMemo(() => getCurrentLevelInfo(data), [data]);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 上滑关闭相关状态
  const [translateY, setTranslateY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // 获取境界和层级显示
  const realmInfo = REALM_CONFIG[levelInfo.realm];
  const stageDisplay = useMemo(() => {
    if (levelInfo.realm === 'LIANQI' && levelInfo.layer !== null) {
      return LIANQI_LAYER_NAMES[levelInfo.layer as LianqiLayer];
    }
    if (levelInfo.stage !== null) {
      return STAGE_CONFIG[levelInfo.stage as StageType].name;
    }
    return '';
  }, [levelInfo.realm, levelInfo.layer, levelInfo.stage]);

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;
    
    // 检查是否在内容区域顶部
    const content = contentRef.current;
    if (content && content.scrollTop <= 0) {
      isDragging.current = true;
    }
  }, []);

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
          <span className={styles.levelName}>{realmInfo.name}</span>
          <span className={styles.levelStage}>{stageDisplay}</span>
        </div>

        {/* 中间 - 大图展示 */}
        <div className={styles.characterSection}>
          <img 
            src={CULTIVATION_IMAGE} 
            alt="修仙角色"
            className={styles.characterImage}
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
        <div className={styles.swipeHint}>
          <span>上滑回到任务界面</span>
        </div>
      </footer>
    </div>
  );
}

export const SecondFloorPanel = memo(SecondFloorPanelComponent);
export default SecondFloorPanel;
