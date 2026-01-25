/**
 * 支线任务编辑弹窗
 * 用于编辑任务名称和标签（支持多类型标签）
 * 标签选择独立显示：任务名称、标签、地点、心情
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, Tag, MapPin, Smile, ChevronDown, Check,
  Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine,
  SmilePlus, Frown, Angry, Moon, HelpCircle, Zap, PartyPopper, Heart, Flame, Snowflake,
  Pin, Star, Target, BookOpen, Lightbulb, Wrench, Palette, Music, PersonStanding, Sparkles
} from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import type { Task, TaskTags, TaskTag, TagType } from '../../types';
import { getTagsByType } from '../../utils/tagStorage';
import styles from './styles.module.css';

// 图标映射
const ICON_MAP: Record<string, React.ReactNode> = {
  // 地点图标
  home: <Home size={14} />,
  building: <Building2 size={14} />,
  coffee: <Coffee size={14} />,
  gym: <Dumbbell size={14} />,
  train: <Train size={14} />,
  school: <School size={14} />,
  hospital: <Hospital size={14} />,
  shop: <ShoppingCart size={14} />,
  beach: <Palmtree size={14} />,
  park: <TreePine size={14} />,
  // 心情图标
  happy: <SmilePlus size={14} />,
  sad: <Frown size={14} />,
  angry: <Angry size={14} />,
  sleepy: <Moon size={14} />,
  thinking: <HelpCircle size={14} />,
  energetic: <Zap size={14} />,
  celebrate: <PartyPopper size={14} />,
  love: <Heart size={14} />,
  fire: <Flame size={14} />,
  cold: <Snowflake size={14} />,
  // 普通图标
  pin: <Pin size={14} />,
  star: <Star size={14} />,
  target: <Target size={14} />,
  book: <BookOpen size={14} />,
  idea: <Lightbulb size={14} />,
  tool: <Wrench size={14} />,
  art: <Palette size={14} />,
  music: <Music size={14} />,
  person: <PersonStanding size={14} />,
  sparkle: <Sparkles size={14} />,
};

// 获取图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
};

interface SidelineTaskEditModalProps {
  visible: boolean;
  task: Task | null;
  onSave: (taskId: string, updates: { title?: string; tagId?: string; tags?: TaskTags }) => void;
  onClose: () => void;
  onGoToTagSettings?: () => void;
}

// 标签选择器组件
interface TagFieldProps {
  label: string;
  icon: React.ReactNode;
  type: TagType;
  selectedTagId?: string;
  onSelect: (tagId: string | undefined) => void;
}

const DROPDOWN_MAX_HEIGHT = 240; // 下拉菜单最大高度

const TagField: React.FC<TagFieldProps> = ({
  label,
  icon,
  type,
  selectedTagId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tags = useMemo(() => getTagsByType(type), [type]);
  const selectedTag = useMemo(() => tags.find(t => t.id === selectedTagId), [tags, selectedTagId]);

  // 计算下拉菜单位置（自适应：向上或向下）
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 计算实际需要的高度
    const itemCount = tags.length + 1; // +1 for "无" option
    const estimatedHeight = Math.min(itemCount * 44 + 8, DROPDOWN_MAX_HEIGHT);

    // 决定向上还是向下弹出
    const shouldOpenUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: 'fixed',
      left: rect.right - 160, // 右对齐
      minWidth: 160,
      maxHeight: DROPDOWN_MAX_HEIGHT,
      zIndex: 99999,
    };

    if (shouldOpenUpward) {
      // 向上弹出
      style.bottom = viewportHeight - rect.top + 4;
    } else {
      // 向下弹出
      style.top = rect.bottom + 4;
    }

    // 确保不超出右边界
    if (rect.right > window.innerWidth - 10) {
      style.left = window.innerWidth - 170;
    }

    setDropdownStyle(style);
  }, [tags.length]);

  // 点击按钮时更新位置
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  // 监听窗口变化时关闭下拉菜单（滚动时不关闭，因为菜单内部需要滚动）
  useEffect(() => {
    if (isOpen) {
      const handleResize = () => {
        setIsOpen(false);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const isClickOnButton = buttonRef.current?.contains(target);
        const isClickOnDropdown = dropdownRef.current?.contains(target);

        if (!isClickOnButton && !isClickOnDropdown) {
          setIsOpen(false);
        }
      };

      // 使用 mousedown 替代 click，响应更快
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (tagId: string | undefined) => {
    onSelect(tagId);
    setIsOpen(false);
  };

  // 使用 Portal 渲染下拉菜单到 body
  const dropdownContent = isOpen && ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className={styles.tagDropdownPortal}
      style={dropdownStyle}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={`${styles.tagOption} ${!selectedTagId ? styles.tagOptionActive : ''}`}
        onClick={() => handleSelect(undefined)}
      >
        <span>无</span>
        {!selectedTagId && <Check size={14} />}
      </div>
      {tags.map(tag => (
        <div
          key={tag.id}
          className={`${styles.tagOption} ${selectedTagId === tag.id ? styles.tagOptionActive : ''}`}
          onClick={() => handleSelect(tag.id)}
        >
          <div className={styles.tagOptionLeft}>
            {tag.icon && <span className={styles.tagIcon}>{getIconComponent(tag.icon)}</span>}
            <span
              className={styles.tagDot}
              style={{ backgroundColor: tag.color }}
            />
            <span>{tag.name}</span>
          </div>
          {selectedTagId === tag.id && <Check size={14} />}
        </div>
      ))}
      {tags.length === 0 && (
        <div className={styles.tagEmpty}>暂无{label}</div>
      )}
    </div>,
    document.body
  );

  return (
    <div className={styles.tagField}>
      <div className={styles.tagFieldLabel}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={styles.tagFieldValue}>
        <button
          ref={buttonRef}
          className={styles.tagFieldButton}
          onClick={handleButtonClick}
        >
          {selectedTag ? (
            <>
              {selectedTag.icon && <span className={styles.tagIcon}>{getIconComponent(selectedTag.icon)}</span>}
              <span
                className={styles.tagDot}
                style={{ backgroundColor: selectedTag.color }}
              />
              <span className={styles.tagName}>{selectedTag.name}</span>
            </>
          ) : (
            <span className={styles.tagPlaceholder}>选择{label}</span>
          )}
          <ChevronDown size={14} className={styles.tagChevron} />
        </button>
        {dropdownContent}
      </div>
    </div>
  );
};

const SidelineTaskEditModal: React.FC<SidelineTaskEditModalProps> = ({
  visible,
  task,
  onSave,
  onClose,
  onGoToTagSettings,
}) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<TaskTags>({});

  // 当任务变化时，重置表单
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      // 兼容新旧格式
      if (task.tags) {
        setTags(task.tags);
      } else if (task.tagId) {
        setTags({ normalTagId: task.tagId });
      } else {
        setTags({});
      }
    }
  }, [task]);

  // 处理保存
  const handleSave = () => {
    if (!task || !title.trim()) return;

    const updates: { title?: string; tagId?: string; tags?: TaskTags } = {};
    
    if (title.trim() !== task.title) {
      updates.title = title.trim();
    }
    
    // 检查标签是否有变化
    const originalTags = task.tags || (task.tagId ? { normalTagId: task.tagId } : {});
    const tagsChanged = 
      tags.normalTagId !== originalTags.normalTagId ||
      tags.locationTagId !== originalTags.locationTagId ||
      tags.moodTagId !== originalTags.moodTagId;

    if (tagsChanged) {
      updates.tags = tags;
      // 同时更新旧版 tagId 以保持兼容
      updates.tagId = tags.normalTagId;
    }

    // 只有有变化时才保存
    if (Object.keys(updates).length > 0) {
      onSave(task.id, updates);
    }
    
    onClose();
  };

  // 更新标签
  const handleTagChange = (type: TagType, tagId: string | undefined) => {
    setTags(prev => {
      const newTags = { ...prev };
      switch (type) {
        case 'normal':
          newTags.normalTagId = tagId;
          break;
        case 'location':
          newTags.locationTagId = tagId;
          break;
        case 'mood':
          newTags.moodTagId = tagId;
          break;
      }
      return newTags;
    });
  };

  if (!visible || !task) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header}>
          <h3 className={styles.title}>编辑任务</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className={styles.content}>
          {/* 任务名称 */}
          <div className={styles.formItem}>
            <label className={styles.label}>任务名称</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入任务名称"
              maxLength={30}
            />
          </div>

          {/* 标签选择 - 独立显示 */}
          <div className={styles.tagFields}>
            <TagField
              label="标签"
              icon={<Tag size={16} />}
              type="normal"
              selectedTagId={tags.normalTagId}
              onSelect={(id) => handleTagChange('normal', id)}
            />
            <TagField
              label="地点"
              icon={<MapPin size={16} />}
              type="location"
              selectedTagId={tags.locationTagId}
              onSelect={(id) => handleTagChange('location', id)}
            />
            <TagField
              label="心情"
              icon={<Smile size={16} />}
              type="mood"
              selectedTagId={tags.moodTagId}
              onSelect={(id) => handleTagChange('mood', id)}
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            取消
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!title.trim()}
          >
            保存
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default SidelineTaskEditModal;

