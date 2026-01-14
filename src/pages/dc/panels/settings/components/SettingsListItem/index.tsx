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
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.listItem} ${highlight ? styles.highlight : ''} ${disabled ? styles.disabled : ''}`}
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
