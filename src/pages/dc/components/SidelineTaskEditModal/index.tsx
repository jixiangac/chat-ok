/**
 * 支线任务编辑弹窗
 * 用于编辑任务名称和标签
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import type { Task } from '../../types';
import TagSelector from '../TagSelector';
import styles from './styles.module.css';

interface SidelineTaskEditModalProps {
  visible: boolean;
  task: Task | null;
  onSave: (taskId: string, updates: { title?: string; tagId?: string }) => void;
  onClose: () => void;
}

const SidelineTaskEditModal: React.FC<SidelineTaskEditModalProps> = ({
  visible,
  task,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [tagId, setTagId] = useState<string | undefined>(undefined);

  // 当任务变化时，重置表单
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setTagId(task.tagId);
    }
  }, [task]);

  // 处理保存
  const handleSave = () => {
    if (!task || !title.trim()) return;

    const updates: { title?: string; tagId?: string } = {};
    
    if (title.trim() !== task.title) {
      updates.title = title.trim();
    }
    
    if (tagId !== task.tagId) {
      updates.tagId = tagId;
    }

    // 只有有变化时才保存
    if (Object.keys(updates).length > 0) {
      onSave(task.id, updates);
    }
    
    onClose();
  };

  // 检查是否有变化
  const hasChanges = task && (
    title.trim() !== task.title ||
    tagId !== task.tagId
  );

  if (!visible || !task) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header}>
          <h3 className={styles.title}>编辑任务</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className={styles.content}>
          {/* 任务名称 */}
          <div className={styles.formItem}>
            <label className={styles.label}>任务名称</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入任务名称"
              maxLength={30}
            />
          </div>

          {/* 标签选择 */}
          <TagSelector
            selectedTagId={tagId}
            onSelect={setTagId}
          />
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            取消
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!title.trim()}
          >
            保存
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default SidelineTaskEditModal;

