/**
 * 紫微斗数分析报告组件
 * Tab 分类展示：财运/感情/事业
 */

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

export default function ZiweiAnalysisReport({
  chartData,
  activeTab,
  onTabChange,
}: ZiweiAnalysisReportProps) {
  const { palaces } = chartData;

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
    <div>
      {/* Tab 切换 */}
      <div className={styles.reportTabs}>
        {ANALYSIS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.reportTab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => onTabChange(tab.key as AnalysisTab)}
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
