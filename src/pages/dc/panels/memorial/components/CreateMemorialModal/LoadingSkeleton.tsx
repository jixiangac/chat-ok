/**
 * 创建弹窗加载骨架屏
 */

import React from 'react';
import styles from './LoadingSkeleton.module.css';

export function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.skeleton}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
      </div>
    </div>
  );
}
