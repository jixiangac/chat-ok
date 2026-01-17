/**
 * 修炼入口组件
 * 显示当前境界和修为进度，点击打开修炼面板
 */

import { memo, useMemo } from 'react';
import type { ReactElement } from 'react';
import type { RealmType } from '../../constants/cultivation';
import type { CultivationData } from '../../types/cultivation';
import { getCurrentLevelInfo, formatExp } from '../../utils/cultivation';
import styles from './styles.module.css';

// ============ 类型定义 ============

export interface CultivationEntryProps {
  /** 修仙数据 */
  data: CultivationData;
  /** 点击回调 */
  onClick: () => void;
  /** 紧凑模式 */
  compact?: boolean;
  /** 自定义类名 */
  className?: string;
}

// ============ 图标组件 ============

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

  return <>{iconPaths[realm]}</>;
};

/** 右箭头图标 */
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/** 闭关图标 */
const SeclusionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

// ============ 主组件 ============

function CultivationEntryComponent({
  data,
  onClick,
  compact = false,
  className,
}: CultivationEntryProps) {
  // 计算当前等级信息
  const levelInfo = useMemo(() => getCurrentLevelInfo(data), [data]);

  // 是否在闭关中
  const isInSeclusion = data.seclusion?.active ?? false;

  // 组合类名
  const entryClassName = [
    styles.entry,
    compact && styles.compact,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={entryClassName}
      onClick={onClick}
      style={{
        '--realm-color': levelInfo.color,
        '--realm-color-light': levelInfo.colorLight,
      } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* 境界图标 */}
      <div className={styles.realmIcon}>
        <RealmIcon realm={levelInfo.realm} />
      </div>

      {/* 信息区域 */}
      <div className={styles.info}>
        <h3 className={styles.levelName}>
          {levelInfo.displayName}
          {isInSeclusion && (
            <span className={styles.seclusionBadge}>
              <SeclusionIcon />
              闭关中
            </span>
          )}
        </h3>
        <span className={styles.expInfo}>
          修为 {formatExp(levelInfo.currentExp)} / {formatExp(levelInfo.expCap)}
        </span>
      </div>

      {/* 进度条 */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {levelInfo.progress.toFixed(0)}%
        </div>
      </div>

      {/* 箭头 */}
      <div className={styles.arrow}>
        <ChevronRightIcon />
      </div>
    </div>
  );
}

export const CultivationEntry = memo(CultivationEntryComponent);
export default CultivationEntry;

