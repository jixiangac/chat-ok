import { CYCLE_LENGTH_OPTIONS } from '../constants';

interface CycleSelectorProps {
  cycleDays: number;
  onCycleDaysChange: (days: number) => void;
}

export default function CycleSelector({ cycleDays, onCycleDaysChange }: CycleSelectorProps) {
  return (
    <div style={{
      backgroundColor: '#f8f8f8',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
          周期长度
        </span>
        <span style={{ fontSize: '14px', color: '#999' }}>
          每{cycleDays}天一个周期
        </span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        {CYCLE_LENGTH_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onCycleDaysChange(option.value)}
            style={{
              padding: '12px 8px',
              backgroundColor: cycleDays === option.value ? 'black' : 'white',
              color: cycleDays === option.value ? 'white' : 'black',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>
              {option.icon}
            </div>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '14px',
              marginBottom: '4px' 
            }}>
              {option.label}
            </div>
            <div style={{ 
              fontSize: '10px', 
              opacity: 0.7,
              lineHeight: '1.3'
            }}>
              {option.description}
            </div>
          </button>
        ))}
      </div>
      
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>💡</span>
        <span>
          {CYCLE_LENGTH_OPTIONS.find(o => o.value === cycleDays)?.tip}
        </span>
      </div>
    </div>
  );
}
