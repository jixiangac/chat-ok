/**
 * 设置列表项组件
 * 支持普通样式和高亮样式
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles.module.css';

export interface SettingsListItemProps {
  /** 图标 */
  icon?: React.ReactNode;
  /** 标题 */
  title: string;
  /** 描述（可选） */
  description?: string;
  /** 是否高亮样式 */
  highlight?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 右侧自定义内容 */
  rightContent?: React.ReactNode;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 是否启用翻书动画 */
  animated?: boolean;
  /** 动画延迟索引（用于交错动画） */
  animationIndex?: number;
  /** 点击事件 */
  onClick?: () => void;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({
  icon,
  title,
  description,
  highlight = false,
  disabled = false,
  rightContent,
  showArrow = true,
  animated = false,
  animationIndex = 0,
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // 计算动画延迟
  const animationDelay = animated ? `${animationIndex * 60}ms` : undefined;

  return (
    <div
      className={`${styles.listItem} ${highlight ? styles.highlight : ''} ${disabled ? styles.disabled : ''} ${animated ? styles.animated : ''}`}
      style={animated ? { 
        animationDelay,
        opacity: 0,
        transform: 'rotateX(-90deg)',
        transformOrigin: 'top center',
      } : undefined}
      onClick={handleClick}
    >
      <div className={styles.leftContent}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.textContent}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
      <div className={styles.rightContent}>
        {rightContent}
        {showArrow && !disabled && (
          <ChevronRight size={18} className={styles.arrow} />
        )}
      </div>
    </div>
  );
};

export default SettingsListItem;

