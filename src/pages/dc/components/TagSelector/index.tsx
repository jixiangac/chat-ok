/**
 * 标签选择器组件
 * 支持选择三类标签：普通标签、地点标签、心情标签
 */

import React, { useState, useEffect, useRef } from 'react';
import { Check, X, ChevronDown, Tag, MapPin, Smile, Settings } from 'lucide-react';
import type { TaskTag, TagType, TaskTags } from '../../types';
import { getTagsByType } from '../../utils/tagStorage';
import styles from './styles.module.css';

interface TagSelectorProps {
  /** 当前选中的标签（新版多类型） */
  selectedTags?: TaskTags;
  /** 选择回调（新版多类型） */
  onSelectTags?: (tags: TaskTags) => void;
  /** 当前选中的标签ID（旧版兼容） */
  selectedTagId?: string;
  /** 选择回调（旧版兼容） */
  onSelect?: (tagId: string | undefined) => void;
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 跳转到标签设置 */
  onGoToSettings?: () => void;
}

// Tab 配置
const TABS: { type: TagType; label: string; icon: React.ReactNode }[] = [
  { type: 'normal', label: '普通', icon: <Tag size={14} /> },
  { type: 'location', label: '地点', icon: <MapPin size={14} /> },
  { type: 'mood', label: '心情', icon: <Smile size={14} /> },
];

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onSelectTags,
  selectedTagId,
  onSelect,
  showLabel = true,
  onGoToSettings,
}) => {
  const [activeTab, setActiveTab] = useState<TagType>('normal');
  const [tagsByType, setTagsByType] = useState<Record<TagType, TaskTag[]>>({
    normal: [],
    location: [],
    mood: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载所有类型的标签
  useEffect(() => {
    const loadAllTags = () => {
      setTagsByType({
        normal: getTagsByType('normal'),
        location: getTagsByType('location'),
        mood: getTagsByType('mood'),
      });
    };
    loadAllTags();
  }, [isExpanded]); // 每次展开时重新加载

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 获取当前选中的标签ID（根据类型）
  const getSelectedTagIdForType = (type: TagType): string | undefined => {
    if (selectedTags) {
      switch (type) {
        case 'normal':
          return selectedTags.normalTagId;
        case 'location':
          return selectedTags.locationTagId;
        case 'mood':
          return selectedTags.moodTagId;
      }
    }
    // 兼容旧版
    if (type === 'normal' && selectedTagId) {
      return selectedTagId;
    }
    return undefined;
  };

  // 处理标签选择
  const handleTagSelect = (tagId: string, type: TagType) => {
    const currentSelectedId = getSelectedTagIdForType(type);
    const newTagId = currentSelectedId === tagId ? undefined : tagId;

    if (onSelectTags) {
      const newTags = { ...selectedTags };
      switch (type) {
        case 'normal':
          newTags.normalTagId = newTagId;
          break;
        case 'location':
          newTags.locationTagId = newTagId;
          break;
        case 'mood':
          newTags.moodTagId = newTagId;
          break;
      }
      onSelectTags(newTags);
    } else if (onSelect && type === 'normal') {
      // 兼容旧版
      onSelect(newTagId);
    }
  };

  // 处理清除标签
  const handleClearTag = (e: React.MouseEvent, type: TagType) => {
    e.stopPropagation();
    if (onSelectTags) {
      const newTags = { ...selectedTags };
      switch (type) {
        case 'normal':
          newTags.normalTagId = undefined;
          break;
        case 'location':
          newTags.locationTagId = undefined;
          break;
        case 'mood':
          newTags.moodTagId = undefined;
          break;
      }
      onSelectTags(newTags);
    } else if (onSelect && type === 'normal') {
      onSelect(undefined);
    }
  };

  // 获取所有选中的标签
  const getSelectedTags = (): TaskTag[] => {
    const result: TaskTag[] = [];
    
    const normalId = getSelectedTagIdForType('normal');
    const locationId = getSelectedTagIdForType('location');
    const moodId = getSelectedTagIdForType('mood');

    if (normalId) {
      const tag = tagsByType.normal.find(t => t.id === normalId);
      if (tag) result.push(tag);
    }
    if (locationId) {
      const tag = tagsByType.location.find(t => t.id === locationId);
      if (tag) result.push(tag);
    }
    if (moodId) {
      const tag = tagsByType.mood.find(t => t.id === moodId);
      if (tag) result.push(tag);
    }

    return result;
  };

  const selectedTagsList = getSelectedTags();
  const currentTags = tagsByType[activeTab];
  const currentSelectedId = getSelectedTagIdForType(activeTab);

  return (
    <div className={styles.container} ref={containerRef}>
      {showLabel && <div className={styles.label}>标签</div>}
      
      {/* 当前选择的标签或占位符 */}
      <div 
        className={styles.selectedTag}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {selectedTagsList.length > 0 ? (
          <div className={styles.selectedTagsList}>
            {selectedTagsList.map(tag => (
              <span key={tag.id} className={styles.selectedTagItem}>
                {tag.icon && <span className={styles.tagIcon}>{tag.icon}</span>}
                <span 
                  className={styles.tagColorDot} 
                  style={{ backgroundColor: tag.color }}
                />
                <span className={styles.tagName}>{tag.name}</span>
                <button 
                  className={styles.clearTagButton}
                  onClick={(e) => handleClearTag(e, tag.type)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <>
            <span className={styles.placeholder}>选择标签</span>
            <ChevronDown size={16} className={styles.chevron} />
          </>
        )}
      </div>

      {/* 展开的标签列表 */}
      {isExpanded && (
        <div className={styles.dropdown}>
          {/* Tab 切换 */}
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.type}
                className={`${styles.tab} ${activeTab === tab.type ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.type)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {getSelectedTagIdForType(tab.type) && (
                  <span className={styles.tabDot} />
                )}
              </button>
            ))}
          </div>

          {/* 标签列表 */}
          <div className={styles.tagList}>
            {currentTags.length === 0 ? (
              <div className={styles.emptyTip}>
                暂无{TABS.find(t => t.type === activeTab)?.label}标签
              </div>
            ) : (
              currentTags.map(tag => (
                <div
                  key={tag.id}
                  className={`${styles.tagItem} ${currentSelectedId === tag.id ? styles.selected : ''}`}
                  onClick={() => handleTagSelect(tag.id, activeTab)}
                >
                  {tag.icon && <span className={styles.tagIcon}>{tag.icon}</span>}
                  <span 
                    className={styles.tagColorDot} 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className={styles.tagName}>{tag.name}</span>
                  {currentSelectedId === tag.id && (
                    <Check size={14} className={styles.checkIcon} />
                  )}
                </div>
              ))
            )}

            {/* 跳转设置按钮 */}
            {onGoToSettings && (
              <button
                className={styles.goToSettingsButton}
                onClick={() => {
                  setIsExpanded(false);
                  onGoToSettings();
                }}
              >
                <Settings size={14} />
                <span>管理标签</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
