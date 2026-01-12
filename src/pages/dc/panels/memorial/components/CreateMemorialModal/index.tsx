/**
 * 创建/编辑纪念日弹窗
 */

import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { X } from 'lucide-react';
import { DatePicker, SafeArea } from 'antd-mobile';
import dayjs from 'dayjs';
import type { Memorial, CreateMemorialInput, MemorialBackground } from '../../types';
import { getDefaultIcon, getDefaultColor, getDefaultBackground } from '../../constants';
import { LoadingSkeleton } from './LoadingSkeleton';
import styles from './styles.module.css';

// 懒加载组件
const IconPicker = lazy(() => import('../IconPicker'));
const BackgroundPicker = lazy(() => import('../BackgroundPicker'));

interface CreateMemorialModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemorialInput) => void;
  editingMemorial?: Memorial | null;
}

export function CreateMemorialModal({
  visible,
  onClose,
  onSubmit,
  editingMemorial,
}: CreateMemorialModalProps) {
  // 表单状态
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [icon, setIcon] = useState(getDefaultIcon().name);
  const [iconColor, setIconColor] = useState(getDefaultColor());
  const [note, setNote] = useState('');
  const [background, setBackground] = useState<MemorialBackground>(getDefaultBackground());

  // 编辑模式时填充数据
  useEffect(() => {
    if (editingMemorial) {
      setName(editingMemorial.name);
      setDate(new Date(editingMemorial.date));
      setIcon(editingMemorial.icon);
      setIconColor(editingMemorial.iconColor);
      setNote(editingMemorial.note || '');
      setBackground(editingMemorial.background);
    } else {
      // 重置表单
      setName('');
      setDate(new Date());
      setIcon(getDefaultIcon().name);
      setIconColor(getDefaultColor());
      setNote('');
      setBackground(getDefaultBackground());
    }
  }, [editingMemorial, visible]);

  // 表单验证
  const isValid = name.trim().length > 0 && date !== null;

  // 提交表单
  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    const dateStr = dayjs(date).format('YYYY-MM-DD');
    onSubmit({
      name: name.trim(),
      date: dateStr,
      icon,
      iconColor,
      note: note.trim() || undefined,
      background,
    });

    onClose();
  }, [isValid, name, date, icon, iconColor, note, background, onSubmit, onClose]);

  // 阻止背景点击关闭
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 处理日期选择
  const handleDateConfirm = useCallback((val: Date | null) => {
    if (val) {
      setDate(val);
    }
    setCalendarVisible(false);
  }, []);

  // 格式化日期显示
  const dateDisplayText = dayjs(date).format('YYYY年M月D日');

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>
        {/* 拖拽手柄 */}
        <div className={styles.handle}>
          <div className={styles.handleBar} />
        </div>

        {/* 头部 */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingMemorial ? '编辑纪念日' : '创建纪念日'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className={styles.content}>
          {/* 名称 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>纪念日名称</label>
            <input
              type="text"
              className={styles.input}
              placeholder="例如：结婚纪念日"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* 日期 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>日期</label>
            <div
              className={styles.dateButton}
              onClick={() => setCalendarVisible(true)}
            >
              {dateDisplayText}
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

          {/* 图标选择 */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>图标</div>
            <Suspense fallback={<LoadingSkeleton />}>
              <IconPicker
                selectedIcon={icon}
                selectedColor={iconColor}
                onIconChange={setIcon}
                onColorChange={setIconColor}
              />
            </Suspense>
          </div>

          {/* 背景选择 */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>详情页背景</div>
            <Suspense fallback={<LoadingSkeleton />}>
              <BackgroundPicker value={background} onChange={setBackground} />
            </Suspense>
          </div>

          {/* 备注 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>备注（可选）</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="添加一些备注..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose} type="button">
            取消
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isValid}
            type="button"
          >
            {editingMemorial ? '保存' : '创建'}
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}

export default CreateMemorialModal;




