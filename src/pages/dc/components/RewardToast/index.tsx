/**
 * 奖励提示组件
 * 显示获取灵玉和修为的奖励通知
 */

import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { RewardItem } from '../../types/spiritJade';
import styles from './styles.module.css';

// 图片资源
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';
const LEVEL_UP_HEADER = 'https://gw.alicdn.com/imgextra/i3/O1CN01hyy6yM1jmjSNr4H2j_!!6000000004591-2-tps-1080-1080.png';

export interface RewardToastProps {
  /** 奖励列表 */
  rewards: RewardItem[];
  /** 关闭回调 */
  onClose?: () => void;
  /** 是否显示 */
  visible?: boolean;
  /** 当前等级形象图（默认头图） */
  currentLevelImage?: string;
}

/** 数字滚动动画组件 */
function AnimatedNumber({ value, prefix = '+' }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplayValue(value);
      return undefined;
    }

    const duration = 600;
    const steps = 20;
    const stepValue = value / steps;
    const stepTime = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), value);
      setDisplayValue(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={styles.animatedNumber}>
      {prefix}{displayValue}
    </span>
  );
}

function RewardToastComponent({
  rewards,
  onClose,
  visible = true,
  currentLevelImage,
}: RewardToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  // 检查是否有等级提升
  const levelUpInfo = useMemo(() => {
    const levelUpReward = rewards.find(r => r.levelUp);
    return levelUpReward?.levelUp || null;
  }, [rewards]);

  // 获取第一个奖励的额外信息
  const firstReward = rewards[0];
  const bonus = firstReward?.bonus;
  const todayRemaining = firstReward?.todayRemaining;

  // 计算总计
  const total = useMemo(() => rewards.reduce(
    (acc, r) => ({
      spiritJade: acc.spiritJade + r.spiritJade,
      cultivation: acc.cultivation + r.cultivation,
    }),
    { spiritJade: 0, cultivation: 0 }
  ), [rewards]);

  // 关闭处理
  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  if (!visible || rewards.length === 0) {
    return null;
  }

  return createPortal(
    <div 
      className={`${styles.modalOverlay} ${isLeaving ? styles.leaving : ''}`}
      onClick={handleClose}
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 顶部图片 */}
        <div className={`${styles.headerImage} ${levelUpInfo ? styles.levelUp : ''}`}>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
          <img 
            src={levelUpInfo ? LEVEL_UP_HEADER : currentLevelImage}
            alt="奖励"
            className={styles.headerImg}
          />
        </div>

        {/* 标题区域 - 只在等级提升时显示 */}
        {levelUpInfo && (
          <div className={styles.titleSection}>
            <h2 className={styles.levelUpTitle}>恭喜，晋升至</h2>
            <p className={styles.levelUpName}>{levelUpInfo.newLevelName}</p>
          </div>
        )}

        {/* 奖励内容 */}
        <div className={styles.rewardSection}>
          {/* 来源描述 */}
          <div className={styles.sourceText}>{firstReward.source}</div>

          {/* 基础获取 */}
          <div className={styles.baseSection}>
            <div className={styles.sectionTitle}>基础获取</div>
            {firstReward.spiritJade > 0 && (
              <div className={styles.rewardLine}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
                <span className={styles.rewardLabel}>灵玉：</span>
                <AnimatedNumber value={firstReward.spiritJade} />
              </div>
            )}
            {firstReward.cultivation > 0 && (
              <div className={styles.rewardLine}>
                <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
                <span className={styles.rewardLabel}>修为：</span>
                <AnimatedNumber value={firstReward.cultivation} />
              </div>
            )}
          </div>

          {/* 额外加成 */}
          {bonus && (
            <div className={styles.bonusSection}>
              <div className={styles.sectionTitle}>额外加成</div>
              <div className={styles.bonusRow}>
                <span className={styles.bonusReason}>{bonus.reason}</span>
                <div className={styles.bonusValues}>
                  {bonus.spiritJade > 0 && (
                    <span className={styles.bonusValue}>
                      <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.bonusIcon} />
                      +{bonus.spiritJade}
                    </span>
                  )}
                  {bonus.cultivation > 0 && (
                    <span className={styles.bonusValue}>
                      <img src={CULTIVATION_ICON} alt="修为" className={styles.bonusIcon} />
                      +{bonus.cultivation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 最终获得（有加成时显示） */}
          {bonus && (
            <div className={styles.totalSection}>
              <div className={styles.sectionTitle}>最终获得</div>
              <div className={styles.totalValues}>
                {(firstReward.spiritJade + bonus.spiritJade) > 0 && (
                  <span className={styles.totalValue}>
                    <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.totalIcon} />
                    +{firstReward.spiritJade + bonus.spiritJade}
                  </span>
                )}
                {(firstReward.cultivation + bonus.cultivation) > 0 && (
                  <span className={styles.totalValue}>
                    <img src={CULTIVATION_ICON} alt="修为" className={styles.totalIcon} />
                    +{firstReward.cultivation + bonus.cultivation}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 今日奖励剩余 */}
          {todayRemaining && (
            <div className={styles.remainingSection}>
              <div className={styles.remainingTitle}>今日奖励剩余</div>
              <div className={styles.remainingItems}>
                <span className={styles.remainingItem}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.remainingIcon} />
                  {todayRemaining.spiritJade.earned}/{todayRemaining.spiritJade.cap}
                </span>
                <span className={styles.remainingItem}>
                  <img src={CULTIVATION_ICON} alt="修为" className={styles.remainingIcon} />
                  {todayRemaining.cultivation.earned}/{todayRemaining.cultivation.cap}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export const RewardToast = memo(RewardToastComponent);
export default RewardToast;
