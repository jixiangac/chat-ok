/**
 * 底部固定按钮组件
 * 用于设置页面底部的操作按钮，支持安全区域
 */

import React from 'react';
import styles from './styles.module.css';

export interface BottomFixedButtonProps {
  /** 按钮内容 */
  children: React.ReactNode;
  /** 点击事件 */
  onClick: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮类型 */
  type?: 'primary' | 'default';
  /** 自定义类名 */
  className?: string;
}

const BottomFixedButton: React.FC<BottomFixedButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'primary',
  className = '',
}) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles[type]} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default BottomFixedButton;
