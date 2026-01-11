interface WarningAlertProps {
  visible: boolean;
  onClose: () => void;
}

export default function WarningAlert({ visible, onClose }: WarningAlertProps) {
  if (!visible) return null;
  
  return (
    <div style={{
      backgroundColor: '#fff5f5',
      border: '1px solid #ff4444',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#ff4444',
          marginBottom: '4px'
        }}>
          无法创建主线任务
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666'
        }}>
          同一时间只能有1个主线任务。请先完成或将现有主线任务降级为支线任务。
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#999'
        }}
      >
        ✕
      </button>
    </div>
  );
}
