// 创建行程弹窗组件
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { SafeArea } from 'antd-mobile';
import styles from './styles.module.css';

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; startDate: string; totalDays: number; hasPreparation: boolean }) => void;
}

// 关闭图标
const CloseIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 21, 30];

const CreateTripModal: React.FC<CreateTripModalProps> = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [totalDays, setTotalDays] = useState(3);
  const [hasPreparation, setHasPreparation] = useState(true);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      startDate,
      totalDays,
      hasPreparation,
    });

    // 重置表单
    setName('');
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setTotalDays(3);
    setHasPreparation(true);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;

  const isValid = name.trim();

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>创建旅行行程</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* 行程名称 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>行程名称：</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：云南之旅"
              className={styles.input}
            />
          </div>

          {/* 出发日期 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>出发日期：</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* 旅行天数 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>旅行天数：</label>
            <select
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
              className={styles.select}
            >
              {DAYS_OPTIONS.map((days) => (
                <option key={days} value={days}>
                  {days} 天
                </option>
              ))}
            </select>
          </div>

          {/* 出发准备选项 */}
          <div className={`${styles.formGroup} ${styles.formGroupLast}`}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasPreparation}
                onChange={(e) => setHasPreparation(e.target.checked)}
                className={styles.checkbox}
              />
              添加「出发准备」日程
            </label>
          </div>

          {/* 提交按钮 */}
          <button onClick={handleSubmit} disabled={!isValid} className={styles.submitBtn}>
            创建行程
          </button>
          <SafeArea position="bottom" />
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;

