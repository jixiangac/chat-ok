/**
 * 设置分组组件
 * 用于将设置项分组显示
 */

import React from 'react';
import styles from './styles.module.css';

export interface SettingsSectionProps {
  /** 分组标题 */
  title: string;
  /** 子元素 */
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

export default SettingsSection;
