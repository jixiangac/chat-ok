// 创建行程弹窗组件 - Notion风格
import React, { useState } from 'react';
import dayjs from 'dayjs';

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    startDate: string;
    totalDays: number;
    hasPreparation: boolean;
  }) => void;
}

const CreateTripModal: React.FC<CreateTripModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
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
      hasPreparation
    });
    
    // 重置表单
    setName('');
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setTotalDays(3);
    setHasPreparation(true);
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
            创建旅行行程
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
          {/* 行程名称 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              行程名称：
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：云南之旅"
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

          {/* 出发日期 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              出发日期：
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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

          {/* 旅行天数 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              旅行天数：
            </label>
            <select
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 21, 30].map(days => (
                <option key={days} value={days}>
                  {days} 天
                </option>
              ))}
            </select>
          </div>

          {/* 出发准备选项 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              color: '#333'
            }}>
              <input
                type="checkbox"
                checked={hasPreparation}
                onChange={(e) => setHasPreparation(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              添加「出发准备」日程
            </label>
          </div>

          {/* 按钮 */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: name.trim() ? '#333' : '#ccc',
              color: 'white',
              fontSize: '14px',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (name.trim()) e.currentTarget.style.backgroundColor = '#555';
            }}
            onMouseLeave={(e) => {
              if (name.trim()) e.currentTarget.style.backgroundColor = '#333';
            }}
          >
            创建行程
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

export default CreateTripModal;
