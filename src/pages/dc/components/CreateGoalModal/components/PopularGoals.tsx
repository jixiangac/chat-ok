import { POPULAR_GOALS } from '../constants';

interface PopularGoalsProps {
  onSelect: (goal: string) => void;
}

export default function PopularGoals({ onSelect }: PopularGoalsProps) {
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
        <span style={{ fontSize: '14px', color: '#666' }}>大家都在坚持</span>
        <span style={{ fontSize: '20px' }}>›</span>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {POPULAR_GOALS.map((goal) => (
          <button
            key={goal}
            onClick={() => onSelect(goal)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>
  );
}
