/**
 * 周期预览组件
 * 显示周期配置的预览信息
 */

import React from 'react';
import styles from './styles.module.css';

export interface CyclePreviewProps {
  totalDays: number;
  cycleDays: number;
}

const CyclePreview: React.FC<CyclePreviewProps> = ({ totalDays, cycleDays }) => {
  const totalCycles = Math.floor(totalDays / cycleDays);
  const remainingDays = totalDays % cycleDays;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        预计将创建 {totalCycles} 个周期
      </div>
      <div className={styles.details}>
        <div>总时长：{totalDays}天</div>
        <div>周期长度：{cycleDays}天</div>
        <div>总周期数：{totalCycles}个</div>
        {remainingDays > 0 && <div>剩余：{remainingDays}天（缓冲期）</div>}
      </div>
    </div>
  );
};

export default CyclePreview;
