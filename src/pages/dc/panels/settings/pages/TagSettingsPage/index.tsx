/**
 * 标签管理子页面
 * 整合现有的标签配置功能
 */

import React from 'react';
import { SubPageLayout } from '../../components';
import TagSettings from '../../TagSettings';
import styles from './styles.module.css';

export interface TagSettingsPageProps {
  /** 返回上一页 */
  onBack: () => void;
  /** 标签删除回调 */
  onTagDeleted?: (tagId: string) => void;
}

const TagSettingsPage: React.FC<TagSettingsPageProps> = ({
  onBack,
  onTagDeleted,
}) => {
  return (
    <SubPageLayout
      title="标签管理"
      description="管理任务的标签分类"
      onBack={onBack}
    >
      <div className={styles.content}>
        <TagSettingsContent onTagDeleted={onTagDeleted} />
      </div>
    </SubPageLayout>
  );
};

/**
 * 标签设置内容组件（不包含头部）
 */
const TagSettingsContent: React.FC<{ onTagDeleted?: (tagId: string) => void }> = ({ onTagDeleted }) => {
  // 这里我们需要复用 TagSettings 的内容，但不包含头部
  // 由于 TagSettings 组件包含头部，我们需要创建一个无头部版本
  // 暂时直接使用 TagSettings，后续可以优化
  return (
    <div className={styles.tagSettingsWrapper}>
      <TagSettings onBack={() => {}} onTagDeleted={onTagDeleted} />
    </div>
  );
};

export default TagSettingsPage;
