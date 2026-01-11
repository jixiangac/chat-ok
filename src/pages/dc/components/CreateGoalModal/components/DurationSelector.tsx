import { TOTAL_DURATION_OPTIONS } from '../constants';

interface DurationSelectorProps {
  totalDays: number;
  isCustomDuration: boolean;
  customDaysInput: string;
  onTotalDaysChange: (days: number) => void;
  onCustomDurationChange: (isCustom: boolean) => void;
  onCustomDaysInputChange: (input: string) => void;
}

export default function DurationSelector({
  totalDays,
  isCustomDuration,
  customDaysInput,
  onTotalDaysChange,
  onCustomDurationChange,
  onCustomDaysInputChange
}: DurationSelectorProps) {
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
          目标总时长
        </span>
        <span style={{ fontSize: '14px', color: '#999' }}>
          {totalDays}天
        </span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: isCustomDuration ? '12px' : '0'
      }}>
        {TOTAL_DURATION_OPTIONS.map((option) => {
          const isSelected = isCustomDuration 
            ? option.value === 0 
            : totalDays === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => {
                if (option.value === 0) {
                  onCustomDurationChange(true);
                } else {
                  onTotalDaysChange(option.value);
                  onCustomDurationChange(false);
                }
              }}
              style={{
                padding: '12px',
                backgroundColor: isSelected ? 'black' : 'white',
                color: isSelected ? 'white' : 'black',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                fontSize: '20px', 
                marginBottom: '4px' 
              }}>
                {option.icon}
              </div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '14px',
                marginBottom: '2px' 
              }}>
                {option.label}
              </div>
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.7 
              }}>
                {option.description}
              </div>
            </button>
          );
        })}
      </div>
      
      {isCustomDuration && (
        <div>
          <input
            type="number"
            min="7"
            max="730"
            value={customDaysInput}
            onChange={(e) => {
              onCustomDaysInputChange(e.target.value);
              const days = Number(e.target.value);
              if (days >= 7 && days <= 730) {
                onTotalDaysChange(days);
              }
            }}
            placeholder="输入天数（7-730天）"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            fontSize: '11px',
            color: '#999',
            marginTop: '6px',
            paddingLeft: '4px'
          }}>
            💡 建议：7-730天之间
          </div>
        </div>
      )}
    </div>
  );
}
