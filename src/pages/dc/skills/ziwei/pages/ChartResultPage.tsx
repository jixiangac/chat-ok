/**
 * 紫微斗数命盘结果页
 */

import { useState } from 'react';
import { SafeArea } from 'antd-mobile';
import type { ChartResultPageProps, AnalysisTab } from '../types';
import ZiweiChart from '../components/ZiweiChart';
import ZiweiAnalysisReport from '../components/ZiweiAnalysisReport';
import styles from '../styles.module.css';

export default function ChartResultPage({
  chartData,
  onAIAnalysis,
  onBack,
}: ChartResultPageProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('wealth');

  return (
    <div className={styles.resultPage}>
      <div className={styles.resultScroll}>
        {/* 命盘图 */}
        <ZiweiChart chartData={chartData} />

        {/* 分类报告 */}
        <ZiweiAnalysisReport
          chartData={chartData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* 底部导航 */}
      <div className={styles.bottomNav}>
        <button
          className={`${styles.navButton} ${styles.navButtonSecondary}`}
          onClick={onBack}
        >
          上一步
        </button>
        <button
          className={`${styles.navButton} ${styles.navButtonPrimary}`}
          onClick={onAIAnalysis}
        >
          AI 深度分析
        </button>
      </div>

      <SafeArea position="bottom" />
    </div>
  );
}
