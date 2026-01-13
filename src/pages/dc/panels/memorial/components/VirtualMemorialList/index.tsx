/**
 * 虚拟纪念日列表组件
 * 使用 react-virtuoso 优化大量数据的渲染性能
 */

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { Memorial } from '../../types';
import { MemorialCard } from '../MemorialCard';
import styles from './styles.module.css';

interface VirtualMemorialListProps {
  memorials: Memorial[];
  onMemorialClick: (memorialId: string) => void;
  /** 用于触发重置的 key，变化时会重置滚动位置和动画 */
  resetKey?: number;
}

// 列表项渲染组件
interface ItemContentProps {
  index: number;
  data: Memorial[];
  onMemorialClick: (memorialId: string) => void;
  animationDelay: string;
}

const ItemContent = memo(function ItemContent({ index, data, onMemorialClick, animationDelay }: ItemContentProps) {
  const memorial = data[index];

  const handleClick = useCallback(() => {
    onMemorialClick(memorial.id);
  }, [memorial.id, onMemorialClick]);

  return (
    <div className={styles.listItem} style={{ animationDelay }}>
      <MemorialCard memorial={memorial} onClick={handleClick} />
    </div>
  );
});

export function VirtualMemorialList({ memorials, onMemorialClick, resetKey }: VirtualMemorialListProps) {
  // Virtuoso 的 ref，用于重置滚动位置
  const virtuosoRef = useRef<any>(null);
  // 普通列表容器的 ref
  const regularListRef = useRef<HTMLDivElement>(null);

  // 当 resetKey 变化时，重置滚动位置到顶部
  useEffect(() => {
    virtuosoRef.current?.scrollTo({ top: 0 });
    regularListRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  // 渲染单个列表项
  const renderItem = useCallback((index: number) => {
    const animationDelay = `${index * 60}ms`;
    return (
    <ItemContent 
      index={index} 
      data={memorials} 
      onMemorialClick={onMemorialClick} 
      animationDelay={animationDelay}
    />
    );
  }, [memorials, onMemorialClick]);

  // 如果数据量少，直接渲染普通列表
  if (memorials.length <= 10) {
    return (
      <div className={styles.regularList} ref={regularListRef}>
        {memorials.map((memorial, index) => (
          <div 
            key={memorial.id}
            className={styles.regularListItem}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <MemorialCard
              memorial={memorial}
              onClick={() => onMemorialClick(memorial.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Virtuoso
        ref={virtuosoRef}
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


