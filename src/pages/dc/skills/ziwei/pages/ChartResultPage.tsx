/**
 * 紫微斗数命盘结果页
 */

import { useState } from 'react';
import { SafeArea } from 'antd-mobile';
import { Sparkles } from 'lucide-react';
import type { ChartResultPageProps, AnalysisTab } from '../types';
import ZiweiChart from '../components/ZiweiChart';
import ZiweiAnalysisReport from '../components/ZiweiAnalysisReport';
import styles from '../styles.module.css';

export default function ChartResultPage({
  chartData,
  onAIAnalysis,
  onBack,
  skipAnimation = false,
}: ChartResultPageProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('wealth');

  return (
    <div className={styles.resultPage}>
      <div className={styles.resultScroll}>
        {/* 命盘图 */}
        <ZiweiChart chartData={chartData} skipAnimation={skipAnimation} />

        {/* 分类报告 */}
        <ZiweiAnalysisReport
          chartData={chartData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          skipAnimation={skipAnimation}
        />

        {/* AI 入口 - 简洁淡雅风格 */}
        <div className={styles.aiEntrySection}>
          <button className={styles.aiEntryButton} onClick={onAIAnalysis}>
            <Sparkles size={14} />
            <span>AI 参详命盘</span>
          </button>
        </div>

        <SafeArea position="bottom" />
      </div>
    </div>
  );
}
