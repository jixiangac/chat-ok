/**
 * 步骤1：基本信息页面
 * 名称 + 日期 + 图标选择（二级） + 背景选择（二级）
 * 参考 CreateTaskModal 的 ConfigPage 设计
 */

import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { DatePicker, Popup } from 'antd-mobile';
import { ChevronRight, X } from 'lucide-react';
import dayjs from 'dayjs';
import type { MemorialBackground } from '../../../types';
import { getIconConfig, getDefaultIcon, getBackgroundStyle } from '../../../constants';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { BottomNavigation } from '../../../../../viewmodel/CreateTaskModal/components';
import styles from '../pageStyles.module.css';

// 懒加载选择器
const IconPicker = lazy(() => import('../../IconPicker'));
const BackgroundPicker = lazy(() => import('../../BackgroundPicker'));

interface BasicInfoPageProps {
  name: string;
  date: Date;
  icon: string;
  iconColor: string;
  background: MemorialBackground;
  note: string;
  onNameChange: (name: string) => void;
  onDateChange: (date: Date) => void;
  onIconChange: (icon: string) => void;
  onIconColorChange: (color: string) => void;
  onBackgroundChange: (background: MemorialBackground) => void;
  onNoteChange: (note: string) => void;
  onNext: () => void;
}

export function BasicInfoPage({
  name,
  date,
  icon,
  iconColor,
  background,
  note,
  onNameChange,
  onDateChange,
  onIconChange,
  onIconColorChange,
  onBackgroundChange,
  onNoteChange,
  onNext,
}: BasicInfoPageProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const [backgroundPickerVisible, setBackgroundPickerVisible] = useState(false);

  // 临时选择状态（用于二级弹窗确认前的预览）
  const [tempIcon, setTempIcon] = useState(icon);
  const [tempIconColor, setTempIconColor] = useState(iconColor);
  const [tempBackground, setTempBackground] = useState<MemorialBackground>(background);

  // 处理日期选择
  const handleDateConfirm = useCallback((val: Date | null) => {
    if (val) {
      onDateChange(val);
    }
    setCalendarVisible(false);
  }, [onDateChange]);

  // 打开图标选择器
  const handleOpenIconPicker = useCallback(() => {
    setTempIcon(icon);
    setTempIconColor(iconColor);
    setIconPickerVisible(true);
  }, [icon, iconColor]);

  // 确认图标选择
  const handleConfirmIcon = useCallback(() => {
    onIconChange(tempIcon);
    onIconColorChange(tempIconColor);
    setIconPickerVisible(false);
  }, [tempIcon, tempIconColor, onIconChange, onIconColorChange]);

  // 打开背景选择器
  const handleOpenBackgroundPicker = useCallback(() => {
    setTempBackground(background);
    setBackgroundPickerVisible(true);
  }, [background]);

  // 确认背景选择
  const handleConfirmBackground = useCallback(() => {
    onBackgroundChange(tempBackground);
    setBackgroundPickerVisible(false);
  }, [tempBackground, onBackgroundChange]);

  // 格式化日期显示
  const dateDisplayText = dayjs(date).format('YYYY年M月D日');

  // 判断日期是今天或未来还是过去
  const isFutureOrToday = useMemo(() => {
    const today = dayjs().startOf('day');
    const selectedDate = dayjs(date).startOf('day');
    return selectedDate.isSame(today) || selectedDate.isAfter(today);
  }, [date]);

  // 日期类型提示文字
  const dateTypeHint = isFutureOrToday ? '倒计时' : '每年重复';

  // 获取图标组件
  const iconConfig = useMemo(() => {
    return getIconConfig(icon) || getDefaultIcon();
  }, [icon]);
  const IconComponent = iconConfig.component;

  // 图标背景色
  const iconBgColor = useMemo(() => `${iconColor}33`, [iconColor]);

  // 背景样式
  const backgroundStyle = useMemo(() => getBackgroundStyle(background), [background]);

  // 表单验证
  const isValid = name.trim().length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 名称输入 */}
        <div className={styles.nameSection}>
          <div className={styles.nameInputWrapper}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="输入纪念日名称..."
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={50}
            />
          </div>
        </div>

        {/* 日期选择 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>日期</div>
          <div
            className={styles.dateButton}
            onClick={() => setCalendarVisible(true)}
          >
            <span>{dateDisplayText}</span>
            <div className={styles.dateRight}>
              <span className={styles.dateHint}>{dateTypeHint}</span>
              <ChevronRight size={18} />
            </div>
          </div>
          <DatePicker
            visible={calendarVisible}
            onClose={() => setCalendarVisible(false)}
            precision="day"
            value={date}
            min={new Date(1900, 0, 1)}
            max={new Date(2100, 11, 31)}
            onConfirm={handleDateConfirm}
          />
        </div>

        {/* 图标选择入口 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>图标</div>
          <div
            className={styles.selectorEntry}
            onClick={handleOpenIconPicker}
          >
            <div className={styles.selectorLeft}>
              <div
                className={styles.selectorPreview}
                style={{ backgroundColor: iconBgColor }}
              >
                <IconComponent size={20} color={iconColor} strokeWidth={1.5} />
              </div>
              <span className={styles.selectorLabel}>图标与颜色</span>
            </div>
            <div className={styles.selectorRight}>
              <ChevronRight size={18} />
            </div>
          </div>
        </div>

        {/* 背景选择入口 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>背景</div>
          <div
            className={styles.selectorEntry}
            onClick={handleOpenBackgroundPicker}
          >
            <div className={styles.selectorLeft}>
              <div
                className={styles.selectorPreview}
                style={backgroundStyle}
              />
              <span className={styles.selectorLabel}>详情页背景</span>
            </div>
            <div className={styles.selectorRight}>
              <ChevronRight size={18} />
            </div>
          </div>
        </div>

        {/* 备注 */}
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>备注（可选）</div>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="添加一些备注..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            maxLength={200}
          />
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNavigation
        onNext={onNext}
        nextDisabled={!isValid}
      />

      {/* 图标选择器弹窗 */}
      <Popup
        visible={iconPickerVisible}
        onMaskClick={() => setIconPickerVisible(false)}
        position="bottom"
        bodyClassName={styles.pickerPopup}
      >
        <div className={styles.pickerHeader}>
          <button
            className={styles.pickerCloseBtn}
            onClick={() => setIconPickerVisible(false)}
            type="button"
          >
            <X size={20} />
          </button>
          <span className={styles.pickerTitle}>选择图标</span>
          <div className={styles.pickerSpacer} />
        </div>
        <div className={styles.pickerContent}>
          <Suspense fallback={<LoadingSkeleton />}>
            <IconPicker
              selectedIcon={tempIcon}
              selectedColor={tempIconColor}
              onIconChange={setTempIcon}
              onColorChange={setTempIconColor}
            />
          </Suspense>
        </div>
        <div className={styles.pickerFooter}>
          <button
            className={styles.pickerConfirmBtn}
            onClick={handleConfirmIcon}
            type="button"
          >
            确认
          </button>
        </div>
      </Popup>

      {/* 背景选择器弹窗 */}
      <Popup
        visible={backgroundPickerVisible}
        onMaskClick={() => setBackgroundPickerVisible(false)}
        position="bottom"
        bodyClassName={styles.pickerPopup}
      >
        <div className={styles.pickerHeader}>
          <button
            className={styles.pickerCloseBtn}
            onClick={() => setBackgroundPickerVisible(false)}
            type="button"
          >
            <X size={20} />
          </button>
          <span className={styles.pickerTitle}>选择背景</span>
          <div className={styles.pickerSpacer} />
        </div>
        <div className={styles.pickerContent}>
          <Suspense fallback={<LoadingSkeleton />}>
            <BackgroundPicker
              value={tempBackground}
              onChange={setTempBackground}
              solidOnly
            />
          </Suspense>
        </div>
        <div className={styles.pickerFooter}>
          <button
            className={styles.pickerConfirmBtn}
            onClick={handleConfirmBackground}
            type="button"
          >
            确认
          </button>
        </div>
      </Popup>
    </div>
  );
}

export default BasicInfoPage;
