/**
 * 纪念日列表骨架屏组件
 */

import React from 'react';
import { MemorialCardSkeleton } from '../MemorialCardSkeleton';
import styles from './styles.module.css';

interface MemorialListSkeletonProps {
  count?: number;
}

export function MemorialListSkeleton({ count = 5 }: MemorialListSkeletonProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <MemorialCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default MemorialListSkeleton;
