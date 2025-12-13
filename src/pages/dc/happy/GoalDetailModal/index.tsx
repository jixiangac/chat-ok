// 目标详情弹窗 - 记录图片和心情
import React, { useState, useRef } from 'react';
import { TripGoal } from '../types';
import './styles.css';

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

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  record,
  onClose,
  onSave
}) => {
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

  return (
    <div className="goal-detail-overlay" onClick={onClose}>
      <div className="goal-detail-modal" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="goal-detail-header">
          <div className="goal-detail-title">
            <span className="goal-detail-time">{goal.time}</span>
            <span className="goal-detail-content">{goal.content}</span>
          </div>
          <button className="goal-detail-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 图片上传区域 */}
        <div className="goal-detail-image-section">
          {image ? (
            <div className="goal-detail-image-preview">
              <img src={image} alt="记录图片" />
              <button className="goal-detail-image-remove" onClick={handleRemoveImage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="goal-detail-image-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>点击上传图片</span>
            </div>
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
        <div className="goal-detail-note-section">
          <label className="goal-detail-note-label">记录心情或事情</label>
          <textarea
            className="goal-detail-note-input"
            placeholder="写下这一刻的感受..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        {/* 底部按钮 */}
        <div className="goal-detail-footer">
          <button className="goal-detail-btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="goal-detail-btn-save" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailModal;
