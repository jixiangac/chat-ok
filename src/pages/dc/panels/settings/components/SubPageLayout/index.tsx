/**
 * 子页面布局组件
 * 提供统一的子页面布局结构：头图 + 标题 + 内容
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './styles.module.css';

// 默认头图
const DEFAULT_HEADER_IMAGE = 'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png';

export interface SubPageLayoutProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 头图 URL */
  headerImage?: string;
  /** 头图背景色（渐变） */
  headerBackground?: string;
  /** 返回按钮点击事件 */
  onBack: () => void;
  /** 子元素 */
  children: React.ReactNode;
  /** 右上角操作按钮 */
  rightAction?: React.ReactNode;
}

const SubPageLayout: React.FC<SubPageLayoutProps> = ({
  title,
  description,
  headerImage = DEFAULT_HEADER_IMAGE,
  headerBackground,
  onBack,
  children,
  rightAction,
}) => {
  return (
    <div className={styles.container}>
      {/* 头图区域 */}
      <div className={styles.headerImage} style={headerBackground ? { background: headerBackground } : undefined}>
        <button className={styles.backButton} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        {rightAction && (
          <div className={styles.rightAction}>{rightAction}</div>
        )}
        <img
          src={headerImage}
          alt={title}
          className={styles.headerImg}
        />
      </div>

      {/* 标题区域 */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default SubPageLayout;

