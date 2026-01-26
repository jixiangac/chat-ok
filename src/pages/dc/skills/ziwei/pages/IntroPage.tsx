/**
 * 紫微斗数介绍页
 */

import { SafeArea } from 'antd-mobile';
import type { IntroPageProps } from '../types';
import { ZIWEI_ICON_URL } from '../constants';
import styles from '../styles.module.css';

const FEATURES = [
  '真太阳时校正',
  '十二宫位分析',
  '十四主星排盘',
  'AI 命理问答',
];

export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className={styles.introPage}>
      <img
        src={ZIWEI_ICON_URL}
        alt="紫微斗数"
        className={styles.introImage}
      />

      <h1 className={styles.introTitle}>紫微斗数</h1>

      <p className={styles.introDesc}>
        紫微斗数是中国传统命理学的重要分支，通过出生时间推演命盘，洞察人生运势走向。
      </p>

      <div className={styles.introFeatures}>
        {FEATURES.map((feature) => (
          <span key={feature} className={styles.featureTag}>
            {feature}
          </span>
        ))}
      </div>

      <button
        className={styles.introStartButton}
        onClick={onStart}
      >
        开始排盘
      </button>

      <SafeArea position="bottom" />
    </div>
  );
}
