// 添加目标弹窗组件
import React, { useState, useEffect, useMemo } from 'react';
import { SafeArea } from 'antd-mobile';
import { TripSchedule, TripGoal } from '../../types';
import { isScheduleExpired } from '../../utils';
import styles from './styles.module.css';

interface AddGoalModalProps {
  visible: boolean;
  schedules: TripSchedule[];
  currentScheduleId: string;
  editingGoal?: TripGoal | null;
  onClose: () => void;
  onSubmit: (scheduleId: string, goal: { time: string; content: string; location?: string; note?: string }) => void;
}

// 关闭图标
const CloseIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  visible,
  schedules,
  currentScheduleId,
  editingGoal,
  onClose,
  onSubmit,
}) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState(currentScheduleId);
  const [time, setTime] = useState('08:00');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  // 使用 useMemo 缓存过滤后的日程列表
  const availableSchedules = useMemo(() => {
    return schedules.filter((s) => !isScheduleExpired(s));
  }, [schedules]);

  // 只在 visible 变为 true 时初始化表单
  useEffect(() => {
    if (visible) {
      if (editingGoal) {
        setTime(editingGoal.time);
        setContent(editingGoal.content);
        setLocation(editingGoal.location || '');
        setNote(editingGoal.note || '');
      } else {
        // 如果当前日程已过期，选择第一个可用的日程
        const currentSchedule = schedules.find((s) => s.id === currentScheduleId);
        if (currentSchedule && isScheduleExpired(currentSchedule)) {
          const firstAvailable = schedules.find((s) => !isScheduleExpired(s));
          setSelectedScheduleId(firstAvailable?.id || currentScheduleId);
        } else {
          setSelectedScheduleId(currentScheduleId);
        }
        setTime('08:00');
        setContent('');
        setLocation('');
        setNote('');
      }
    }
    // 只依赖 visible 和 editingGoal，避免不必要的重置
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingGoal]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    onSubmit(selectedScheduleId, {
      time,
      content: content.trim(),
      location: location.trim() || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;

  const isValid = content.trim() && availableSchedules.length > 0;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{editingGoal ? '编辑行程目标' : '添加行程目标'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* 所属日程 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>所属日程：</label>
            {availableSchedules.length === 0 ? (
              <div className={styles.errorBox}>所有日程都已过期，无法添加新目标</div>
            ) : (
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className={styles.select}
              >
                {availableSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.label} {schedule.date ? `(${schedule.date})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 计划时间 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>计划时间：</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={styles.input} />
          </div>

          {/* 目标内容 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>目标内容：</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="如：参观蝴蝶泉"
              className={styles.input}
            />
          </div>

          {/* 地点 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>地点（选填）：</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="如：大理蝴蝶泉景区"
              className={styles.input}
            />
          </div>

          {/* 备注 */}
          <div className={`${styles.formGroup} ${styles.formGroupLast}`}>
            <label className={styles.label}>备注（选填）：</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：门票60元，记得带学生证"
              rows={2}
              className={styles.textarea}
            />
          </div>

          {/* 提交按钮 */}
          <button onClick={handleSubmit} disabled={!isValid} className={styles.submitBtn}>
            {editingGoal ? '保存修改' : '添加目标'}
          </button>
          <SafeArea position="bottom" />
        </div>
      </div>
    </div>
  );
};

export default AddGoalModal;

