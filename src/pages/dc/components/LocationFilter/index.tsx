/**
 * 地点筛选下拉组件
 * 用于筛选任务的地点标签
 */

import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ChevronDown, Check, Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine } from 'lucide-react';
import styles from './styles.module.css';

// 地点标签类型
export interface LocationTag {
  id: string;
  name: string;
  icon?: string;
}

// 地点图标映射
const LOCATION_ICON_MAP: Record<string, React.ReactNode> = {
  home: <Home size={12} />,
  building: <Building2 size={12} />,
  coffee: <Coffee size={12} />,
  gym: <Dumbbell size={12} />,
  train: <Train size={12} />,
  school: <School size={12} />,
  hospital: <Hospital size={12} />,
  shop: <ShoppingCart size={12} />,
  beach: <Palmtree size={12} />,
  park: <TreePine size={12} />,
};

// 获取地点图标组件
const getLocationIcon = (iconName?: string) => {
  if (!iconName) return null;
  return LOCATION_ICON_MAP[iconName] || null;
};

export interface LocationFilterProps {
  /** 可选的地点标签列表 */
  locationTags: LocationTag[];
  /** 当前选中的地点标签ID */
  selectedTagId: string | null;
  /** 选中地点标签变化时的回调 */
  onTagChange: (tagId: string | null) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locationTags,
  selectedTagId,
  onTagChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭筛选
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 获取当前选中的地点标签
  const selectedTag = selectedTagId 
    ? locationTags.find(tag => tag.id === selectedTagId) 
    : null;

  // 如果没有可用的地点标签，不渲染
  if (locationTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.filterWrapper} ref={filterRef}>
      <button
        className={`${styles.filterButton} ${selectedTagId ? styles.filterActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin size={14} />
        {selectedTag && (
          <span className={styles.filterText}>{selectedTag.name}</span>
        )}
        <ChevronDown size={12} />
      </button>
      
      {isOpen && (
        <div className={styles.filterDropdown}>
          <div
            className={`${styles.filterOption} ${!selectedTagId ? styles.filterOptionActive : ''}`}
            onClick={() => {
              onTagChange(null);
              setIsOpen(false);
            }}
          >
            <span>全部</span>
            {!selectedTagId && <Check size={12} className={styles.filterOptionCheck} />}
          </div>
          {locationTags.map(tag => (
            <div
              key={tag.id}
              className={`${styles.filterOption} ${selectedTagId === tag.id ? styles.filterOptionActive : ''}`}
              onClick={() => {
                onTagChange(tag.id);
                setIsOpen(false);
              }}
            >
              <span className={styles.filterOptionIcon}>{getLocationIcon(tag.icon)}</span>
              <span>{tag.name}</span>
              {selectedTagId === tag.id && <Check size={12} className={styles.filterOptionCheck} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
