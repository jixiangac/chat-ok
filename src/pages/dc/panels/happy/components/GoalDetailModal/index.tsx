// 目标详情弹窗 - 记录图片和心情
import React, { useState, useRef } from 'react';
import { SafeArea } from 'antd-mobile';
import { TripGoal } from '../../types';
import styles from './styles.module.css';

interface GoalRecord {
  image?: string;
  note: string;
}

interface GoalDetailModalProps {
  goal: TripGoal;
  record?: GoalRecord;
  onClose: () => void;
  onSave: (record: GoalRecord) => void;
}

// 图标组件
const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ImageIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, record, onClose, onSave }) => {
  const [image, setImage] = useState<string | undefined>(record?.image);
  const [note, setNote] = useState(record?.note || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave({ image, note });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <span className={styles.time}>{goal.time}</span>
            <span className={styles.content}>{goal.content}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* 图片上传区域 */}
        <div className={styles.imageSection}>
          {image ? (
            <div className={styles.imagePreview}>
              <img src={image} alt="记录图片" className={styles.previewImg} />
              <button className={styles.imageRemove} onClick={handleRemoveImage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
              <ImageIcon />
              <span className={styles.imageUploadText}>点击上传图片</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* 心情/记录区域 */}
        <div className={styles.noteSection}>
          <label className={styles.noteLabel}>记录心情或事情</label>
          <textarea
            className={styles.noteInput}
            placeholder="写下这一刻的感受..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            取消
          </button>
          <button className={styles.btnSave} onClick={handleSave}>
            保存
          </button>
          <SafeArea position="bottom" />
        </div>
      </div>
    </div>
  );
};

export default GoalDetailModal;

