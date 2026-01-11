/**
 * 虚拟纪念日列表组件
 * 使用 react-virtuoso 优化大量数据的渲染性能
 */

import React, { memo, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { Memorial } from '../../types';
import { MemorialCard } from '../MemorialCard';
import styles from './styles.module.css';

interface VirtualMemorialListProps {
  memorials: Memorial[];
  onMemorialClick: (memorialId: string) => void;
}

// 列表项渲染组件
interface ItemContentProps {
  index: number;
  data: Memorial[];
  onMemorialClick: (memorialId: string) => void;
}

const ItemContent = memo(function ItemContent({ index, data, onMemorialClick }: ItemContentProps) {
  const memorial = data[index];

  const handleClick = useCallback(() => {
    onMemorialClick(memorial.id);
  }, [memorial.id, onMemorialClick]);

  return (
    <div className={styles.listItem}>
      <MemorialCard memorial={memorial} onClick={handleClick} />
    </div>
  );
});

export function VirtualMemorialList({ memorials, onMemorialClick }: VirtualMemorialListProps) {
  // 渲染单个列表项
  const renderItem = useCallback((index: number) => (
    <ItemContent 
      index={index} 
      data={memorials} 
      onMemorialClick={onMemorialClick} 
    />
  ), [memorials, onMemorialClick]);

  // 如果数据量少，直接渲染普通列表
  if (memorials.length <= 10) {
    return (
      <div className={styles.regularList}>
        {memorials.map((memorial) => (
          <MemorialCard
            key={memorial.id}
            memorial={memorial}
            onClick={() => onMemorialClick(memorial.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Virtuoso
        totalCount={memorials.length}
        itemContent={renderItem}
        className={styles.virtualList}
        style={{ height: '400px' }}
        overscan={5}
      />
    </div>
  );
}

export default VirtualMemorialList;
