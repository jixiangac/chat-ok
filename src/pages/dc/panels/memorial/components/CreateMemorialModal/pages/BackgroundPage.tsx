/**
 * 步骤2：预览效果页面
 * 包含列表预览和详情预览
 * 参考 MemorialDetail 真实详情页样式
 */

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import type { MemorialBackground } from '../../../types';
import { getBackgroundStyle, getIconConfig, getDefaultIcon } from '../../../constants';
import { getStructuredDaysData, isToday, getShortDaysText } from '../../../utils';
import { BottomNavigation } from '../../../../../viewmodel/CreateTaskModal/components';
import styles from '../pageStyles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

// 创建纪念日固定消耗 50 灵玉
const MEMORIAL_CREATION_COST = 50;

interface BackgroundPageProps {
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

export function BackgroundPage({
  name,
  date,
  icon,
  iconColor,
  background,
  note,
  isEditing,
  onSubmit,
  onBack,
}: BackgroundPageProps) {
  // 获取图标组件
  const iconConfig = useMemo(() => {
    return getIconConfig(icon) || getDefaultIcon();
  }, [icon]);

  const IconComponent = iconConfig.component;

  // 日期字符串
  const dateStr = dayjs(date).format('YYYY-MM-DD');

  // 列表预览的天数文本
  const shortDaysText = useMemo(() => getShortDaysText(dateStr), [dateStr]);

  // 详情预览的结构化天数数据
  const daysData = useMemo(() => getStructuredDaysData(dateStr, 'days'), [dateStr]);

  // 是否是今天
  const isTodayDate = useMemo(() => isToday(dateStr), [dateStr]);

  // 格式化日期
  const formattedDate = dayjs(date).format('YYYY年M月D日');
  const detailFormattedDate = dayjs(date).format('YYYY-MM-DD');

  // 背景样式
  const backgroundStyle = useMemo(() => getBackgroundStyle(background), [background]);

  // 图标背景色
  const iconBgColor = useMemo(() => `${iconColor}33`, [iconColor]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 列表预览 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>列表预览</div>
        </div>
        <div className={styles.previewSection}>
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
            <span className={styles.previewDays}>{shortDaysText}</span>
          </div>
        </div>

        {/* 详情预览 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>详情预览</div>
        </div>
        <div className={styles.previewSection}>
          <div className={styles.detailPreview} style={backgroundStyle}>
            {/* 左上角：日期和名称 */}
            <div className={styles.detailTopInfo}>
              <div className={styles.detailDateText}>{detailFormattedDate}</div>
              <div className={styles.detailNameText}>{name || '纪念日名称'}</div>
            </div>

            {/* 左下角：天数显示 */}
            <div className={styles.detailBottomInfo}>
              {isTodayDate ? (
                <div className={styles.detailTodayText}>TODAY</div>
              ) : daysData ? (
                <div className={styles.detailDaysContainer}>
                  {daysData.items.map((item, index) => (
                    <div key={index} className={styles.detailDaysRow}>
                      <span className={styles.detailDaysNumber}>{item.number}</span>
                      <span className={styles.detailDaysUnit}>{item.unit}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* 右下角：备注 */}
            {note && (
              <div className={styles.detailNoteWrapper}>
                <p className={styles.detailNote}>"{note}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNavigation
        onBack={onBack}
        onNext={onSubmit}
        nextText={isEditing ? '保存' : '确认创建'}
        hint={!isEditing ? (
          <span className={styles.costHint}>
            <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.costIcon} />
            创建需消耗 <span>{MEMORIAL_CREATION_COST}</span> 灵玉
          </span>
        ) : undefined}
      />
    </div>
  );
}

export default BackgroundPage;
