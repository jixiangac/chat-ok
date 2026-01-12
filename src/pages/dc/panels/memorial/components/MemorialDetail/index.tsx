/**
 * 纪念日详情组件
 * 参考设计：日期和名称在左上角，天数显示在左下角
 * 点击左上角区域显示操作浮层
 */

import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Pin, Edit2, Trash2 } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import type { Memorial } from '../../types';
import { useDateFormat } from '../../hooks';
import { getStructuredDaysData, isToday } from '../../utils';
import { getBackgroundStyle, isDarkBackground } from '../../constants';
import styles from './styles.module.css';

interface MemorialDetailProps {
  memorial: Memorial;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function MemorialDetail({
  memorial,
  visible,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
}: MemorialDetailProps) {
  const { format, toggleFormat } = useDateFormat();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // 获取结构化的天数数据
  const daysData = useMemo(() => {
    return getStructuredDaysData(memorial.date, format);
  }, [memorial.date, format]);

  // 背景样式
  const backgroundStyle = useMemo(() => {
    return getBackgroundStyle(memorial.background);
  }, [memorial.background]);

  // 判断是否为深色背景（图片背景为深色，需要白色文字）
  const isDark = useMemo(() => {
    return isDarkBackground(memorial.background);
  }, [memorial.background]);

  // 格式化日期显示 (YYYY-MM-DD 格式)
  const formattedDate = useMemo(() => {
    const date = new Date(memorial.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [memorial.date]);

  // 处理删除确认
  const handleDeleteConfirm = useCallback(() => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  }, [onDelete, onClose]);

  // 处理编辑
  const handleEdit = useCallback(() => {
    setShowActionMenu(false);
    onEdit();
  }, [onEdit]);

  // 处理置顶
  const handleTogglePin = useCallback(() => {
    setShowActionMenu(false);
    onTogglePin();
  }, [onTogglePin]);

  // 处理删除
  const handleDelete = useCallback(() => {
    setShowActionMenu(false);
    setShowDeleteConfirm(true);
  }, []);

  if (!visible) return null;

  // 使用 Portal 渲染到 body 下，避免被父容器的 overflow 影响
  return createPortal(
    <div className={styles.container}>
      {/* 背景区域 */}
      <div 
        className={`${styles.backgroundArea} ${isDark ? styles.darkBg : styles.lightBg}`} 
        style={backgroundStyle}
      >
        {/* 关闭按钮 */}
        <button className={styles.closeButton} onClick={onClose} type="button">
          <X size={20} />
        </button>

        {/* 左上角：日期和名称（点击显示操作菜单） */}
        <div 
          className={styles.topInfo} 
          onClick={() => setShowActionMenu(true)}
        >
          <div className={styles.dateText}>{formattedDate}</div>
          <div className={styles.nameText}>{memorial.name}</div>
        </div>

        {/* 左下角：天数显示（可点击切换格式） */}
        <div className={styles.bottomInfo} onClick={toggleFormat}>
          {isToday(memorial.date) ? (
            <div className={styles.todayText}>TODAY</div>
          ) : daysData ? (
            <div className={styles.daysContainer}>
              {daysData.items.map((item, index) => (
                <div key={index} className={styles.daysRow}>
                  <span className={styles.daysNumber}>{item.number}</span>
                  <span className={styles.daysUnit}>{item.unit}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* 备注 */}
        {memorial.note && (
          <div className={styles.noteWrapper}>
            <p className={styles.note}>"{memorial.note}"</p>
          </div>
        )}
        <SafeArea position="bottom" />
      </div>

      {/* 操作浮层菜单 */}
      {showActionMenu && (
        <div className={styles.menuOverlay} onClick={() => setShowActionMenu(false)}>
          <div className={styles.menuDialog} onClick={(e) => e.stopPropagation()}>
            <button className={styles.menuItem} onClick={handleEdit} type="button">
              <Edit2 size={18} />
              <span>编辑</span>
            </button>
            <button 
              className={`${styles.menuItem} ${memorial.isPinned ? styles.menuItemActive : ''}`} 
              onClick={handleTogglePin} 
              type="button"
            >
              <Pin size={18} fill={memorial.isPinned ? 'currentColor' : 'none'} />
              <span>{memorial.isPinned ? '取消置顶' : '置顶'}</span>
            </button>
            <button 
              className={`${styles.menuItem} ${styles.menuItemDanger}`} 
              onClick={handleDelete} 
              type="button"
            >
              <Trash2 size={18} />
              <span>删除</span>
            </button>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>确认删除</h3>
            <p className={styles.confirmMessage}>
              确定要删除"{memorial.name}"吗？此操作无法撤销。
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmCancel}
                onClick={() => setShowDeleteConfirm(false)}
                type="button"
              >
                取消
              </button>
              <button
                className={styles.confirmDelete}
                onClick={handleDeleteConfirm}
                type="button"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

export default MemorialDetail;


