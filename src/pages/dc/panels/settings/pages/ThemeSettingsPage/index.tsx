/**
 * 主题设置子页面
 * 整合现有的主题配置功能
 */

import React from 'react';
import { SubPageLayout } from '../../components';
import ThemeSettings from '../../ThemeSettings';
import styles from './styles.module.css';

export interface ThemeSettingsPageProps {
  /** 返回上一页 */
  onBack: () => void;
}

const ThemeSettingsPage: React.FC<ThemeSettingsPageProps> = ({
  onBack,
}) => {
  return (
    <SubPageLayout
      title="主题设置"
      description="自定义应用的主题配色方案"
      onBack={onBack}
    >
      <div className={styles.content}>
        <ThemeSettings onBack={onBack} />
      </div>
    </SubPageLayout>
  );
};

export default ThemeSettingsPage;
