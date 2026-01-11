import type { Priority } from '../../../types';
import { PRIORITY_OPTIONS } from '../constants';

interface PrioritySelectorProps {
  priority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

export default function PrioritySelector({ priority, onPriorityChange }: PrioritySelectorProps) {
  return (
    <div style={{
      backgroundColor: '#f8f8f8',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '12px',
        fontWeight: '500'
      }}>
        优先级
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        {PRIORITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onPriorityChange(option.value)}
            style={{
              padding: '12px',
              backgroundColor: priority === option.value ? option.color : 'white',
              color: priority === option.value ? 'white' : '#333',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
