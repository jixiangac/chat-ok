/**
 * OptionGrid - 网格选项卡片
 * 用于两行两列或三列的选项展示，提高屏效
 */

import React from 'react';
import { Check } from 'lucide-react';
import styles from './styles.module.css';

export interface OptionCardProps {
  /** 图标组件 */
  icon?: React.ReactNode;
  /** 主标题 */
  label: string;
  /** 副标题/描述 */
  description?: string;
  /** 是否选中 */
  selected?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

export interface OptionGridProps {
  /** 选项列表 */
  options: OptionCardProps[];
  /** 列数 */
  columns?: 2 | 3;
  /** Section 标题 */
  title?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  label,
  description,
  selected,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.card} ${selected ? styles.cardSelected : ''} ${disabled ? styles.cardDisabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {selected && (
        <div className={styles.checkIcon}>
          <Check size={14} />
        </div>
      )}
      {icon && <div className={styles.icon}>{icon}</div>}
      <span className={styles.label}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </button>
  );
};

const OptionGrid: React.FC<OptionGridProps> = ({
  options,
  columns = 2,
  title,
}) => {
  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={`${styles.grid} ${columns === 3 ? styles.gridThree : styles.gridTwo}`}>
        {options.map((option, index) => (
          <OptionCard key={index} {...option} />
        ))}
      </div>
    </div>
  );
};

export default OptionGrid;
