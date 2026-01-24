/**
 * 步骤3：预览确认页面
 */

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import type { MemorialBackground } from '../../../types';
import { getBackgroundStyle } from '../../../constants';
import { getIconConfig, getDefaultIcon } from '../../../constants';
import { getShortDaysText } from '../../../utils';
import styles from '../pageStyles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

// 创建纪念日固定消耗 50 灵玉
const MEMORIAL_CREATION_COST = 50;

interface PreviewPageProps {
  name: string;
  date: Date;
  icon: string;
  iconColor: string;
  background: MemorialBackground;
  note: string;
  isEditing: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function PreviewPage({
  name,
  date,
  icon,
  iconColor,
  background,
  note,
  isEditing,
  onSubmit,
  onBack,
}: PreviewPageProps) {
  // 获取图标组件
  const iconConfig = useMemo(() => {
    return getIconConfig(icon) || getDefaultIcon();
  }, [icon]);

  const IconComponent = iconConfig.component;

  // 计算天数显示
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  const daysText = useMemo(() => getShortDaysText(dateStr), [dateStr]);

  // 格式化日期
  const formattedDate = dayjs(date).format('YYYY年M月D日');

  // 背景样式
  const backgroundStyle = useMemo(() => getBackgroundStyle(background), [background]);

  // 图标背景色
  const iconBgColor = useMemo(() => `${iconColor}33`, [iconColor]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* 预览卡片 */}
        <div className={styles.previewSection}>
          <div className={styles.sectionTitle}>预览效果</div>

          {/* 纪念日卡片预览 */}
          <div className={styles.previewCard}>
            <div
              className={styles.previewIconWrapper}
              style={{ backgroundColor: iconBgColor }}
            >
              <IconComponent
                size={24}
                color={iconColor}
                strokeWidth={1.5}
              />
            </div>
            <div className={styles.previewContent}>
              <h3 className={styles.previewName}>{name || '纪念日名称'}</h3>
              <div className={styles.previewDate}>{formattedDate}</div>
            </div>
            <span className={styles.previewDays}>{daysText}</span>
          </div>

          {/* 背景预览 */}
          <div className={styles.backgroundPreview} style={backgroundStyle}>
            <div className={styles.backgroundPreviewLabel}>详情页背景</div>
          </div>

          {/* 备注预览 */}
          {note && (
            <div className={styles.notePreview}>
              <div className={styles.noteLabel}>备注</div>
              <div className={styles.noteContent}>{note}</div>
            </div>
          )}
        </div>

        {/* 灵玉消耗提示（仅创建模式显示） */}
        {!isEditing && (
          <div className={styles.costInfo}>
            <div className={styles.costLabel}>创建消耗</div>
            <div className={styles.costValue}>
              <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.jadeIcon} />
              <span>{MEMORIAL_CREATION_COST}</span>
            </div>
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      <div className={styles.footerDual}>
        <button
          className={styles.backButton}
          onClick={onBack}
          type="button"
        >
          上一步
        </button>
        <button
          className={styles.submitButton}
          onClick={onSubmit}
          type="button"
        >
          {isEditing ? '保存' : '确认创建'}
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
