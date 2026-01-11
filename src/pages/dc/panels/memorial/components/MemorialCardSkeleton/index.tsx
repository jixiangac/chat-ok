/**
 * 纪念日卡片骨架屏组件
 */

import React from 'react';
import styles from './styles.module.css';

export function MemorialCardSkeleton() {
  return (
    <div className={styles.card}>
      {/* 图标骨架 */}
      <div className={styles.iconSkeleton} />

      {/* 内容骨架 */}
      <div className={styles.content}>
        <div className={styles.nameSkeleton} />
        <div className={styles.dateSkeleton} />
      </div>

      {/* 天数骨架 */}
      <div className={styles.daysSkeleton} />
    </div>
  );
}

export default MemorialCardSkeleton;
