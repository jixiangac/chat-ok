import { ICONS } from '../constants';

interface IconSelectorProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
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
        <span style={{ fontSize: '14px', color: '#666' }}>图标</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{selectedIcon}</span>
          <span style={{ fontSize: '20px' }}>›</span>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px'
      }}>
        {ICONS.map((icon) => (
          <button
            key={icon}
            onClick={() => onSelect(icon)}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: selectedIcon === icon ? '#e5e5e5' : 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
