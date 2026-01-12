/**
 * 标签选择器组件
 * 点击展开显示所有标签选项
 */

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, X, ChevronDown } from 'lucide-react';
import type { TaskTag } from '../../types';
import { getAllTags, createTag } from '../../utils/tagStorage';
import styles from './styles.module.css';

interface TagSelectorProps {
  selectedTagId?: string;
  onSelect: (tagId: string | undefined) => void;
  showLabel?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagId,
  onSelect,
  showLabel = true,
}) => {
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载标签列表
  useEffect(() => {
    const loadedTags = getAllTags();
    setTags(loadedTags);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsCreating(false);
        setNewTagName('');
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 处理标签选择
  const handleTagSelect = (tagId: string) => {
    if (selectedTagId === tagId) {
      // 取消选择
      onSelect(undefined);
    } else {
      onSelect(tagId);
    }
    setIsExpanded(false);
  };

  // 处理创建新标签
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const newTag = createTag(newTagName.trim());
    setTags(prev => [...prev, newTag]);
    onSelect(newTag.id);
    setNewTagName('');
    setIsCreating(false);
    setIsExpanded(false);
  };

  // 处理取消创建
  const handleCancelCreate = () => {
    setNewTagName('');
    setIsCreating(false);
  };

  // 处理清除标签
  const handleClearTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  // 获取选中的标签
  const selectedTag = tags.find(t => t.id === selectedTagId);

  return (
    <div className={styles.container} ref={containerRef}>
      {showLabel && <div className={styles.label}>标签</div>}
      
      {/* 当前选择的标签或占位符 */}
      <div 
        className={styles.selectedTag}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {selectedTag ? (
          <>
            <span 
              className={styles.tagColorDot} 
              style={{ backgroundColor: selectedTag.color }}
            />
            <span className={styles.tagName}>{selectedTag.name}</span>
            <button 
              className={styles.clearTagButton}
              onClick={handleClearTag}
            >
              <X size={14} />
            </button>
          </>
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
          <div className={styles.tagList}>
            {/* 已有标签 */}
            {tags.map(tag => (
              <div
                key={tag.id}
                className={`${styles.tagItem} ${selectedTagId === tag.id ? styles.selected : ''}`}
                onClick={() => handleTagSelect(tag.id)}
              >
                <span 
                  className={styles.tagColorDot} 
                  style={{ backgroundColor: tag.color }}
                />
                <span className={styles.tagName}>{tag.name}</span>
                {selectedTagId === tag.id && (
                  <Check size={14} className={styles.checkIcon} />
                )}
              </div>
            ))}

            {/* 新建标签按钮或输入框 */}
            {isCreating ? (
              <div className={styles.newTagInput}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="输入标签名称"
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleCreateTag();
                    } else if (e.key === 'Escape') {
                      handleCancelCreate();
                    }
                  }}
                  autoFocus
                  maxLength={10}
                />
                <div className={styles.inputActions}>
                  <button
                    className={`${styles.inputButton} ${styles.confirmButton}`}
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className={`${styles.inputButton} ${styles.cancelButton}`}
                    onClick={handleCancelCreate}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.addTagButton}
                onClick={() => setIsCreating(true)}
              >
                <Plus size={14} />
                <span>新建标签</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
