/**
 * 修炼面板组件
 * 展示修仙等级、修为进度、突破功能
 */

import { memo, useMemo, forwardRef, useImperativeHandle } from 'react';
import type { ReactElement } from 'react';
import { REALM_CONFIG, LIANQI_LAYER_NAMES, STAGE_CONFIG } from '../../constants/cultivation';
import type { RealmType, LianqiLayer, StageType } from '../../constants/cultivation';
import type { CultivationData, CurrentLevelInfo } from '../../types/cultivation';
import { getCurrentLevelInfo, formatExp, getSeclusionInfo } from '../../utils/cultivation';
import styles from './styles.module.css';

// ============ 类型定义 ============

export interface CultivationPanelProps {
  /** 修仙数据 */
  data: CultivationData;
  /** 关闭面板 */
  onClose: () => void;
  /** 突破回调 */
  onBreakthrough?: () => void;
  /** 查看详情回调 */
  onViewDetail?: () => void;
}

export interface CultivationPanelRef {
  /** 刷新面板 */
  refresh: () => void;
}

// ============ 图标组件 ============

/** 返回箭头图标 */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

/** 突破图标 */
const BreakthroughIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

/** 闭关图标 */
const SeclusionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

/** 境界图标 */
const RealmIcon = ({ realm }: { realm: RealmType }) => {
  const iconPaths: Record<RealmType, ReactElement> = {
    LIANQI: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
    ),
    ZHUJI: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" />
      </svg>
    ),
    JIEDAN: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
      </svg>
    ),
    YUANYING: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
      </svg>
    ),
    HUASHEN: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
      </svg>
    ),
    LIANXU: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L6.59,17.89C8,19.2 9.91,20 12,20Z" />
      </svg>
    ),
    HETI: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
      </svg>
    ),
    DACHENG: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
      </svg>
    ),
    DUJIE: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
      </svg>
    ),
  };

  return <span className={styles.realmIcon}>{iconPaths[realm]}</span>;
};

/** 打坐人物 SVG */
const MeditationFigure = ({ color }: { color: string }) => (
  <svg 
    className={styles.meditationFigure} 
    viewBox="0 0 200 200" 
    fill="none"
    style={{ '--realm-color': color } as React.CSSProperties}
  >
    {/* 头部 */}
    <circle cx="100" cy="50" r="25" fill={color} opacity="0.9" />
    {/* 身体 */}
    <ellipse cx="100" cy="110" rx="35" ry="40" fill={color} opacity="0.8" />
    {/* 左臂 */}
    <ellipse cx="55" cy="100" rx="15" ry="25" fill={color} opacity="0.7" transform="rotate(-20 55 100)" />
    {/* 右臂 */}
    <ellipse cx="145" cy="100" rx="15" ry="25" fill={color} opacity="0.7" transform="rotate(20 145 100)" />
    {/* 左腿 */}
    <ellipse cx="75" cy="155" rx="25" ry="15" fill={color} opacity="0.75" />
    {/* 右腿 */}
    <ellipse cx="125" cy="155" rx="25" ry="15" fill={color} opacity="0.75" />
    {/* 光环 */}
    <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="2" fill="none" opacity="0.2" />
    <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="1" fill="none" opacity="0.1" />
  </svg>
);

// ============ 子组件 ============

/** 境界徽章 */
const RealmBadge = memo(({ levelInfo }: { levelInfo: CurrentLevelInfo }) => {
  const realmInfo = REALM_CONFIG[levelInfo.realm];
  
  // 获取阶段/层数显示
  const stageDisplay = useMemo(() => {
    if (levelInfo.realm === 'LIANQI' && levelInfo.layer !== null) {
      return LIANQI_LAYER_NAMES[levelInfo.layer as LianqiLayer];
    }
    if (levelInfo.stage !== null) {
      return STAGE_CONFIG[levelInfo.stage as StageType].name;
    }
    return '';
  }, [levelInfo.realm, levelInfo.layer, levelInfo.stage]);

  return (
    <div 
      className={styles.realmBadge}
      style={{
        '--realm-color': levelInfo.color,
        '--realm-color-light': levelInfo.colorLight,
      } as React.CSSProperties}
    >
      <RealmIcon realm={levelInfo.realm} />
      <h2 className={styles.realmName}>{realmInfo.name}</h2>
      <span className={styles.realmStage}>{stageDisplay}</span>
    </div>
  );
});

RealmBadge.displayName = 'RealmBadge';

/** 进度区域 */
const ProgressSection = memo(({ levelInfo }: { levelInfo: CurrentLevelInfo }) => {
  const progressHint = useMemo(() => {
    if (levelInfo.isMaxLevel) {
      return '已达最高境界';
    }
    if (levelInfo.canBreakthrough) {
      return '修为圆满，可以突破！';
    }
    const remaining = levelInfo.expCap - levelInfo.currentExp;
    return `距离突破还需 ${formatExp(remaining)} 修为`;
  }, [levelInfo]);

  return (
    <div 
      className={styles.progressSection}
      style={{
        '--realm-color': levelInfo.color,
        '--realm-color-light': levelInfo.colorLight,
      } as React.CSSProperties}
    >
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>修为进度</span>
        <span className={styles.progressValue}>
          {formatExp(levelInfo.currentExp)} / {formatExp(levelInfo.expCap)}
        </span>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${levelInfo.progress}%` }}
        />
      </div>
      <p className={`${styles.progressHint} ${levelInfo.canBreakthrough ? styles.canBreakthrough : ''}`}>
        {progressHint}
      </p>
    </div>
  );
});

ProgressSection.displayName = 'ProgressSection';

/** 统计卡片 */
const StatsSection = memo(({ data }: { data: CultivationData }) => (
  <div className={styles.statsSection}>
    <div className={styles.statCard}>
      <div className={styles.statLabel}>累计修为</div>
      <div className={styles.statValue}>
        {formatExp(data.totalExpGained)}
        <span className={styles.statUnit}>点</span>
      </div>
    </div>
    <div className={styles.statCard}>
      <div className={styles.statLabel}>突破次数</div>
      <div className={styles.statValue}>
        {data.breakthroughCount}
        <span className={styles.statUnit}>次</span>
      </div>
    </div>
  </div>
));

StatsSection.displayName = 'StatsSection';

/** 闭关状态横幅 */
const SeclusionBanner = memo(({ data }: { data: CultivationData }) => {
  const seclusionInfo = getSeclusionInfo(data);
  
  if (!seclusionInfo) return null;

  return (
    <div className={styles.seclusionBanner}>
      <div className={styles.seclusionIcon}>
        <SeclusionIcon />
      </div>
      <div className={styles.seclusionInfo}>
        <div className={styles.seclusionTitle}>
          闭关修炼中 · 剩余 {seclusionInfo.remainingDays} 天
        </div>
        <div className={styles.seclusionDesc}>
          目标修为: {formatExp(seclusionInfo.targetExp)} · 
          当前进度: {seclusionInfo.progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
});

SeclusionBanner.displayName = 'SeclusionBanner';

// ============ 主组件 ============

const CultivationPanel = forwardRef<CultivationPanelRef, CultivationPanelProps>(
  ({ data, onClose, onBreakthrough, onViewDetail }, ref) => {
    // 计算当前等级信息
    const levelInfo = useMemo(() => getCurrentLevelInfo(data), [data]);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      refresh: () => {
        // 触发重新渲染
      },
    }));

    // 处理突破点击
    const handleBreakthrough = () => {
      if (levelInfo.canBreakthrough && onBreakthrough) {
        onBreakthrough();
      }
    };

    return (
      <div className={styles.panel}>
        {/* 顶部导航栏 */}
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <ArrowLeftIcon />
            <span>返回</span>
          </button>
          {onViewDetail && (
            <button className={styles.detailButton} onClick={onViewDetail}>
              详情
            </button>
          )}
        </header>

        {/* 主内容区域 */}
        <main className={styles.content}>
          {/* 闭关状态横幅 */}
          <SeclusionBanner data={data} />

          {/* 境界徽章 */}
          <section className={styles.realmSection}>
            <RealmBadge levelInfo={levelInfo} />
          </section>

          {/* 角色意象展示区 */}
          <section 
            className={styles.characterSection}
            style={{
              '--realm-color': levelInfo.color,
              '--realm-color-light': levelInfo.colorLight,
            } as React.CSSProperties}
          >
            <div className={styles.characterBackground} />
            <div className={styles.characterImage}>
              <MeditationFigure color={levelInfo.color} />
            </div>
          </section>

          {/* 进度区域 */}
          <ProgressSection levelInfo={levelInfo} />

          {/* 统计卡片 */}
          <StatsSection data={data} />
        </main>

        {/* 操作按钮 */}
        <div className={styles.actionSection}>
          <button
            className={`${styles.breakthroughButton} ${
              levelInfo.canBreakthrough && !levelInfo.isMaxLevel 
                ? styles.active 
                : styles.disabled
            }`}
            onClick={handleBreakthrough}
            disabled={!levelInfo.canBreakthrough || levelInfo.isMaxLevel}
          >
            <BreakthroughIcon />
            <span>
              {levelInfo.isMaxLevel 
                ? '已达巅峰' 
                : levelInfo.canBreakthrough 
                  ? '突破' 
                  : '修为不足'}
            </span>
          </button>
        </div>
      </div>
    );
  }
);

CultivationPanel.displayName = 'CultivationPanel';

export default memo(CultivationPanel);

