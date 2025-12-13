// 添加目标弹窗组件 - Notion风格
import React, { useState, useEffect } from 'react';
import { TripSchedule, TripGoal } from './types';

interface AddGoalModalProps {
  visible: boolean;
  schedules: TripSchedule[];
  currentScheduleId: string;
  editingGoal?: TripGoal | null;
  onClose: () => void;
  onSubmit: (scheduleId: string, goal: { time: string; content: string; location?: string; note?: string }) => void;
}

// 判断日程是否已过期
const isScheduleExpired = (schedule: TripSchedule): boolean => {
  if (!schedule.date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduleDate = new Date(schedule.date);
  const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
  return scheduleDateOnly < today;
};

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  visible,
  schedules,
  currentScheduleId,
  editingGoal,
  onClose,
  onSubmit
}) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState(currentScheduleId);
  const [time, setTime] = useState('08:00');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  // 过滤掉已过期的日程（只保留未过期的日程可选）
  const availableSchedules = schedules.filter(s => !isScheduleExpired(s));

  useEffect(() => {
    if (visible) {
      if (editingGoal) {
        setTime(editingGoal.time);
        setContent(editingGoal.content);
        setLocation(editingGoal.location || '');
        setNote(editingGoal.note || '');
      } else {
        // 如果当前日程已过期，选择第一个可用的日程
        const currentSchedule = schedules.find(s => s.id === currentScheduleId);
        if (currentSchedule && isScheduleExpired(currentSchedule)) {
          setSelectedScheduleId(availableSchedules[0]?.id || currentScheduleId);
        } else {
          setSelectedScheduleId(currentScheduleId);
        }
        setTime('08:00');
        setContent('');
        setLocation('');
        setNote('');
      }
    }
  }, [visible, currentScheduleId, editingGoal, schedules]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSubmit(selectedScheduleId, {
      time,
      content: content.trim(),
      location: location.trim() || undefined,
      note: note.trim() || undefined
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'auto',
          animation: 'scaleIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '500',
            color: '#333'
          }}>
            {editingGoal ? '编辑行程目标' : '添加行程目标'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* 所属日程 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              所属日程：
            </label>
            {availableSchedules.length === 0 ? (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #fde2e2',
                backgroundColor: '#fef5f5',
                fontSize: '14px',
                color: '#c0392b'
              }}>
                所有日程都已过期，无法添加新目标
              </div>
            ) : (
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e0e0e0',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                {availableSchedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.label} {schedule.date ? `(${schedule.date})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 计划时间 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              计划时间：
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 目标内容 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              目标内容：
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="如：参观蝴蝶泉"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 地点 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              地点（选填）：
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="如：大理蝴蝶泉景区"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 备注 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              备注（选填）：
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：门票60元，记得带学生证"
              rows={2}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 按钮 */}
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || availableSchedules.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: (content.trim() && availableSchedules.length > 0) ? '#333' : '#ccc',
              color: 'white',
              fontSize: '14px',
              cursor: (content.trim() && availableSchedules.length > 0) ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (content.trim() && availableSchedules.length > 0) e.currentTarget.style.backgroundColor = '#555';
            }}
            onMouseLeave={(e) => {
              if (content.trim() && availableSchedules.length > 0) e.currentTarget.style.backgroundColor = '#333';
            }}
          >
            {editingGoal ? '保存修改' : '添加目标'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddGoalModal;
