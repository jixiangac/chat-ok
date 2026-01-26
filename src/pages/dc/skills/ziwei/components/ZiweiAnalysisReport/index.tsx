/**
 * 紫微斗数分析报告组件
 * Tab 分类展示：财运/感情/事业
 * 支持延迟显示动画（在命盘动画完成后出现）
 */

import { useState, useEffect, useRef } from 'react';
import type { ZiweiAnalysisReportProps, AnalysisTab } from '../../types';
import { ANALYSIS_TABS } from '../../constants';
import { getPalaceSummary } from '../../utils';
import styles from '../../styles.module.css';

// 各 Tab 对应的宫位分析
const TAB_PALACES: Record<AnalysisTab, Array<{ key: string; label: string }>> = {
  wealth: [
    { key: 'caibo', label: '财帛宫' },
    { key: 'tianzhai', label: '田宅宫' },
    { key: 'fude', label: '福德宫' },
  ],
  emotion: [
    { key: 'fuqi', label: '夫妻宫' },
    { key: 'zinv', label: '子女宫' },
    { key: 'jiaoyou', label: '交友宫' },
  ],
  career: [
    { key: 'shiye', label: '事业宫' },
    { key: 'ming', label: '命宫' },
    { key: 'qianyi', label: '迁移宫' },
  ],
};

// 命盘动画总时长（等待命盘动画完成后再显示报告）
// 中心 100ms + 12个宫位 * 80ms = 约 1060ms，加上一点缓冲
const CHART_ANIMATION_DURATION = 1200;

export default function ZiweiAnalysisReport({
  chartData,
  activeTab,
  onTabChange,
  skipAnimation = false,
}: ZiweiAnalysisReportProps) {
  const { palaces } = chartData;

  // 控制报告区域是否可见（跳过动画时直接显示）
  const [isVisible, setIsVisible] = useState(skipAnimation);
  const hasAnimated = useRef(skipAnimation);

  // 延迟显示报告区域（仅在需要动画时执行）
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, CHART_ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const renderTabContent = () => {
    const palaceConfigs = TAB_PALACES[activeTab];

    return (
      <div className={styles.reportContent}>
        {palaceConfigs.map(({ key, label }) => {
          const palace = palaces[key as keyof typeof palaces];
          const summary = getPalaceSummary(palace, key as any);
          const mainStars = palace.stars.major.join('、') || '无主星';
          const huaStars = palace.stars.hua.join('、');

          return (
            <div key={key} className={styles.reportSection}>
              <div className={styles.reportSectionTitle}>
                <span>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(55,53,47,0.5)' }}>
                  {palace.earthlyBranch} · {mainStars}
                  {huaStars && ` · ${huaStars}`}
                </span>
              </div>
              <div className={styles.reportSectionContent}>
                {summary}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`${styles.analysisReportContainer} ${isVisible ? styles.analysisReportVisible : ''}`}>
      {/* Tab 切换 */}
      <div className={styles.reportTabs}>
        {ANALYSIS_TABS.map((tab, index) => (
          <button
            key={tab.key}
            className={`${styles.reportTab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onTabChange(tab.key as AnalysisTab)}
            style={{ animationDelay: isVisible ? `${index * 0.1}s` : '0s' }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {renderTabContent()}
    </div>
  );
}
