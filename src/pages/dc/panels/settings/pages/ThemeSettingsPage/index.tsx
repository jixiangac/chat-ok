/**
 * 主题设置子页面
 * 整合现有的主题配置功能
 */

import React from 'react';
import { SubPageLayout } from '../../components';
import ThemeSettings from '../../ThemeSettings';
import styles from './styles.module.css';

// 主题设置头图
const THEME_HEADER_IMAGE = 'https://img.alicdn.com/imgextra/i2/O1CN014inOqq1ir1YDFC7dU_!!6000000004465-2-tps-1080-1001.png';
const THEME_HEADER_BACKGROUND = 'linear-gradient(135deg, #E8F4F8 0%, #D4E8F0 100%)';

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
      headerImage={THEME_HEADER_IMAGE}
      headerBackground={THEME_HEADER_BACKGROUND}
      onBack={onBack}
    >
      <div className={styles.content}>
        <ThemeSettings onBack={onBack} />
      </div>
    </SubPageLayout>
  );
};

export default ThemeSettingsPage;

