/**
 * 紫微斗数 AI 分析页
 */

import { useMemo } from 'react';
import { SafeArea } from 'antd-mobile';
import { AgentChat } from '../../../agent';
import type { AnalysisPageProps } from '../types';
import { formatChartForAI } from '../utils';
import styles from '../styles.module.css';

export default function AnalysisPage({ chartData, onBack }: AnalysisPageProps) {
  // 将命盘数据格式化为 AI 可理解的文本，作为系统提示词的一部分
  const chartContext = useMemo(() => {
    return formatChartForAI(chartData);
  }, [chartData]);

  return (
    <div className={styles.analysisPage}>
      <div className={styles.analysisChat}>
        <AgentChat
          role="ziweiAnalyst"
          placeholder="问问关于你命盘的问题..."
          hideHeader
          extraContext={chartContext}
        />
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
