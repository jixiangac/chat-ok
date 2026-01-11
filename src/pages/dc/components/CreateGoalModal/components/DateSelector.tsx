import { CycleCalculator } from '../../../utils/cycleCalculator';

interface DateSelectorProps {
  startDate: string;
  totalDays: number;
  onStartDateChange: (date: string) => void;
}

export default function DateSelector({ startDate, totalDays, onStartDateChange }: DateSelectorProps) {
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
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
          开始日期
        </span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none'
          }}
        />
      </div>
      
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>预计结束日期</span>
        <span style={{ fontWeight: '600', color: '#333' }}>
          {CycleCalculator.calculateEndDate(startDate, totalDays)}
        </span>
      </div>
    </div>
  );
}
