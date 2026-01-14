/**
 * 标签设置页面
 * 管理三类标签：普通标签、地点标签、心情标签
 * 使用 lucide 图标
 * 底部固定新增按钮，点击弹出底部弹窗
 * 支持滑动删除
 */

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, Tag, MapPin, Smile, X,
  Home, Building2, Coffee, Dumbbell, Train, School, Hospital, ShoppingCart, Palmtree, TreePine,
  Plane, Car, Bike, Ship, Church, Library, Warehouse, Store, Mountain, Waves,
  SmilePlus, Frown, Angry, Moon, HelpCircle, Zap, PartyPopper, Heart, Flame, Snowflake,
  Meh, Laugh, ThumbsUp, ThumbsDown, CloudRain, Sun, Rainbow, Skull, Ghost, Sparkle,
  Pin, Star, Target, BookOpen, Lightbulb, Wrench, Palette, Music, PersonStanding, Sparkles,
  Clock, Calendar, Flag, Bookmark, Bell, Camera, Gift, Trophy, Crown, Diamond,
  Briefcase, Folder, FileText, Mail, Phone, Wifi, Battery, Settings, Lock, Key,
  Gamepad2, Headphones, Tv, Monitor, Laptop, Smartphone, Watch, Glasses, Umbrella, Shirt,
  Apple, Pizza, IceCream, Cake, Wine, Beer, Soup, Salad, Egg, Fish
} from 'lucide-react';
import { SafeArea, Popup, SwipeAction } from 'antd-mobile';
import type { TaskTag, TagType, Task } from '../../../types';
import { 
  getTagsByType, 
  createTag, 
  deleteTag,
  TAG_COLORS 
} from '../../../utils/tagStorage';
import { useTaskContext } from '../../../contexts';
import { SidelineTaskCard } from '../../../components/card';
import './index.css';

interface TagSettingsProps {
  onBack: () => void;
  onTagDeleted?: (tagId: string) => void;
}

// Tab 配置
const TABS: { type: TagType; label: string; icon: React.ReactNode }[] = [
  { type: 'normal', label: '普通', icon: <Tag size={16} /> },
  { type: 'location', label: '地点', icon: <MapPin size={16} /> },
  { type: 'mood', label: '心情', icon: <Smile size={16} /> },
];

// 地点图标配置
const LOCATION_ICONS = [
  { icon: <Home size={18} />, name: 'home' },
  { icon: <Building2 size={18} />, name: 'building' },
  { icon: <Coffee size={18} />, name: 'coffee' },
  { icon: <Dumbbell size={18} />, name: 'gym' },
  { icon: <Train size={18} />, name: 'train' },
  { icon: <School size={18} />, name: 'school' },
  { icon: <Hospital size={18} />, name: 'hospital' },
  { icon: <ShoppingCart size={18} />, name: 'shop' },
  { icon: <Palmtree size={18} />, name: 'beach' },
  { icon: <TreePine size={18} />, name: 'park' },
  { icon: <Plane size={18} />, name: 'airport' },
  { icon: <Car size={18} />, name: 'parking' },
  { icon: <Bike size={18} />, name: 'bike' },
  { icon: <Ship size={18} />, name: 'port' },
  { icon: <Church size={18} />, name: 'church' },
  { icon: <Library size={18} />, name: 'library' },
  { icon: <Warehouse size={18} />, name: 'warehouse' },
  { icon: <Store size={18} />, name: 'store' },
  { icon: <Mountain size={18} />, name: 'mountain' },
  { icon: <Waves size={18} />, name: 'sea' },
];

// 心情图标配置
const MOOD_ICONS = [
  { icon: <SmilePlus size={18} />, name: 'happy' },
  { icon: <Frown size={18} />, name: 'sad' },
  { icon: <Angry size={18} />, name: 'angry' },
  { icon: <Moon size={18} />, name: 'sleepy' },
  { icon: <HelpCircle size={18} />, name: 'thinking' },
  { icon: <Zap size={18} />, name: 'energetic' },
  { icon: <PartyPopper size={18} />, name: 'celebrate' },
  { icon: <Heart size={18} />, name: 'love' },
  { icon: <Flame size={18} />, name: 'fire' },
  { icon: <Snowflake size={18} />, name: 'cold' },
  { icon: <Meh size={18} />, name: 'meh' },
  { icon: <Laugh size={18} />, name: 'laugh' },
  { icon: <ThumbsUp size={18} />, name: 'thumbsup' },
  { icon: <ThumbsDown size={18} />, name: 'thumbsdown' },
  { icon: <CloudRain size={18} />, name: 'rain' },
  { icon: <Sun size={18} />, name: 'sunny' },
  { icon: <Rainbow size={18} />, name: 'rainbow' },
  { icon: <Skull size={18} />, name: 'tired' },
  { icon: <Ghost size={18} />, name: 'scared' },
  { icon: <Sparkle size={18} />, name: 'excited' },
];

// 普通图标配置
const NORMAL_ICONS = [
  { icon: <Pin size={18} />, name: 'pin' },
  { icon: <Star size={18} />, name: 'star' },
  { icon: <Target size={18} />, name: 'target' },
  { icon: <BookOpen size={18} />, name: 'book' },
  { icon: <Lightbulb size={18} />, name: 'idea' },
  { icon: <Wrench size={18} />, name: 'tool' },
  { icon: <Palette size={18} />, name: 'art' },
  { icon: <Music size={18} />, name: 'music' },
  { icon: <PersonStanding size={18} />, name: 'person' },
  { icon: <Sparkles size={18} />, name: 'sparkle' },
  { icon: <Clock size={18} />, name: 'clock' },
  { icon: <Calendar size={18} />, name: 'calendar' },
  { icon: <Flag size={18} />, name: 'flag' },
  { icon: <Bookmark size={18} />, name: 'bookmark' },
  { icon: <Bell size={18} />, name: 'bell' },
  { icon: <Camera size={18} />, name: 'camera' },
  { icon: <Gift size={18} />, name: 'gift' },
  { icon: <Trophy size={18} />, name: 'trophy' },
  { icon: <Crown size={18} />, name: 'crown' },
  { icon: <Diamond size={18} />, name: 'diamond' },
  { icon: <Briefcase size={18} />, name: 'work' },
  { icon: <Folder size={18} />, name: 'folder' },
  { icon: <FileText size={18} />, name: 'document' },
  { icon: <Mail size={18} />, name: 'mail' },
  { icon: <Phone size={18} />, name: 'phone' },
  { icon: <Gamepad2 size={18} />, name: 'game' },
  { icon: <Headphones size={18} />, name: 'headphones' },
  { icon: <Laptop size={18} />, name: 'laptop' },
  { icon: <Apple size={18} />, name: 'apple' },
  { icon: <Pizza size={18} />, name: 'food' },
];

// 获取图标组件
const getIconComponent = (iconName: string, type: TagType) => {
  const icons = type === 'location' ? LOCATION_ICONS : type === 'mood' ? MOOD_ICONS : NORMAL_ICONS;
  const found = icons.find(i => i.name === iconName);
  return found?.icon || null;
};

// 删除确认弹窗图片
const DELETE_CONFIRM_IMAGE = 'https://img.alicdn.com/imgextra/i3/O1CN01L8CqQY1rlNCp99Pt4_!!6000000005671-2-tps-1406-1260.png';

export default function TagSettings({ onBack, onTagDeleted }: TagSettingsProps) {
  const { tasks } = useTaskContext();
  const [activeTab, setActiveTab] = useState<TagType>('normal');
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState<string>('');
  
  // 删除确认弹窗状态
  const [deleteConfirmTag, setDeleteConfirmTag] = useState<TaskTag | null>(null);

  // 加载标签
  useEffect(() => {
    loadTags();
  }, [activeTab]);

  const loadTags = () => {
    const loadedTags = getTagsByType(activeTab);
    setTags(loadedTags);
  };

  // 获取当前类型的图标列表
  const icons = activeTab === 'location' ? LOCATION_ICONS : activeTab === 'mood' ? MOOD_ICONS : NORMAL_ICONS;

  // 获取使用该标签的任务列表
  const getTasksWithTag = (tag: TaskTag): Task[] => {
    return tasks.filter(task => {
      if (tag.type === 'normal') {
        return task.tags?.normalTagId === tag.id || task.tagId === tag.id;
      } else if (tag.type === 'location') {
        return task.tags?.locationTagId === tag.id;
      } else if (tag.type === 'mood') {
        return task.tags?.moodTagId === tag.id;
      }
      return false;
    });
  };

  // 处理创建标签
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const iconName = selectedIconName || icons[0]?.name;
    createTag(newTagName.trim(), activeTab, iconName);
    
    setNewTagName('');
    setSelectedIconName('');
    setIsCreating(false);
    loadTags();
  };

  // 处理删除标签 - 显示确认弹窗
  const handleDeleteClick = (tag: TaskTag) => {
    setDeleteConfirmTag(tag);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deleteConfirmTag) {
      deleteTag(deleteConfirmTag.id);
      loadTags();
      onTagDeleted?.(deleteConfirmTag.id);
      setDeleteConfirmTag(null);
    }
  };

  // 取消创建
  const handleCancelCreate = () => {
    setNewTagName('');
    setSelectedIconName('');
    setIsCreating(false);
  };

  // 打开创建弹窗 - 默认选中第一个图标
  const handleOpenCreate = () => {
    const currentIcons = activeTab === 'location' ? LOCATION_ICONS : activeTab === 'mood' ? MOOD_ICONS : NORMAL_ICONS;
    setNewTagName('');
    setSelectedIconName(currentIcons[0]?.name || '');
    setIsCreating(true);
  };

  // 删除确认弹窗中的任务列表
  const tasksWithDeleteTag = useMemo(() => {
    if (!deleteConfirmTag) return [];
    return getTasksWithTag(deleteConfirmTag);
  }, [deleteConfirmTag, tasks]);

  return (
    <div className="tag-settings">
      {/* Tab 切换 */}
      <div className="tag-settings-tabs">
        {TABS.map(tab => (
          <button
            key={tab.type}
            className={`tag-settings-tab ${activeTab === tab.type ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.type);
              setIsCreating(false);
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 标签列表容器 - 只有这个区域可滚动 */}
      <div className="tag-settings-list-container">
        <div className="tag-settings-list">
          {tags.length === 0 && (
            <div className="tag-settings-empty">
              暂无{TABS.find(t => t.type === activeTab)?.label}标签
            </div>
          )}

          {tags.map(tag => (
            <SwipeAction
              key={tag.id}
              rightActions={[
                {
                  key: 'delete',
                  text: '删除',
                  color: 'danger',
                  onClick: () => handleDeleteClick(tag),
                },
              ]}
              style={{
                marginBottom: 8,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div className="tag-settings-item">
                <div className="tag-settings-item-left">
                  {tag.icon && (
                    <span className="tag-settings-item-icon">
                      {getIconComponent(tag.icon, tag.type)}
                    </span>
                  )}
                  <span 
                    className="tag-settings-item-dot"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="tag-settings-item-name">{tag.name}</span>
                </div>
              </div>
            </SwipeAction>
          ))}
        </div>
      </div>

      {/* 底部固定添加按钮 */}
      <div className="tag-settings-bottom-fixed">
        <button 
          className="tag-settings-add-btn-fixed"
          onClick={handleOpenCreate}
        >
          <Plus size={18} />
          <span>添加{TABS.find(t => t.type === activeTab)?.label}标签</span>
        </button>
        <SafeArea position="bottom" />
      </div>

      {/* 创建标签底部弹窗 */}
      <Popup
        visible={isCreating}
        onMaskClick={handleCancelCreate}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '20px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div className="tag-settings-popup-content">
          <div className="tag-settings-popup-header">
            <h3 className="tag-settings-popup-title">
              添加{TABS.find(t => t.type === activeTab)?.label}标签
            </h3>
            <button className="tag-settings-popup-close" onClick={handleCancelCreate}>
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            className="tag-settings-input"
            placeholder="输入标签名称"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            maxLength={10}
            autoFocus
          />
          
          {/* 图标选择 */}
          <div className="tag-settings-icon-picker">
            <div className="tag-settings-icon-label">选择图标</div>
            <div className="tag-settings-icon-grid">
              {icons.map(iconItem => (
                <button
                  key={iconItem.name}
                  className={`tag-settings-icon-item ${selectedIconName === iconItem.name ? 'selected' : ''}`}
                  onClick={() => setSelectedIconName(iconItem.name)}
                >
                  {iconItem.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="tag-settings-popup-actions">
            <button 
              className="tag-settings-btn tag-settings-btn-cancel"
              onClick={handleCancelCreate}
            >
              取消
            </button>
            <button 
              className="tag-settings-btn tag-settings-btn-confirm"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
            >
              创建
            </button>
          </div>
        </div>
        <SafeArea position="bottom" />
      </Popup>

      {/* 删除确认弹窗 */}
      {deleteConfirmTag && createPortal(
        <div className="tag-delete-overlay" onClick={() => setDeleteConfirmTag(null)}>
          <div className="tag-delete-modal" onClick={e => e.stopPropagation()}>
            {/* 顶部图片 */}
            <div className="tag-delete-header">
              <button className="tag-delete-close" onClick={() => setDeleteConfirmTag(null)}>
                <X size={20} />
              </button>
              <img 
                src={DELETE_CONFIRM_IMAGE} 
                alt="删除确认" 
                className="tag-delete-img"
              />
            </div>

            {/* 标题区域 */}
            <div className="tag-delete-title-section">
              <h2 className="tag-delete-title">删除标签</h2>
              <p className="tag-delete-subtitle">
                确定要删除标签"{deleteConfirmTag.name}"吗？
              </p>
            </div>

            {/* 关联任务列表 */}
            {tasksWithDeleteTag.length > 0 && (
              <div className="tag-delete-tasks-section">
                <div className="tag-delete-tasks-label">
                  以下 {tasksWithDeleteTag.length} 个任务将移除此标签
                </div>
                <div className="tag-delete-tasks-grid">
                  {tasksWithDeleteTag.map(task => (
                    <SidelineTaskCard
                      key={task.id}
                      task={task}
                      variant="grid"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 底部按钮 */}
            <div className="tag-delete-footer">
              <button 
                className="tag-delete-btn-cancel"
                onClick={() => setDeleteConfirmTag(null)}
              >
                取消
              </button>
              <button 
                className="tag-delete-btn-confirm"
                onClick={handleConfirmDelete}
              >
                删除
              </button>
            </div>
            <SafeArea position="bottom" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}




