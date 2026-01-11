interface EncouragementInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EncouragementInput({ value, onChange }: EncouragementInputProps) {
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
        <span style={{ fontSize: '14px', color: '#666' }}>写一句鼓励自己的话</span>
        <button
          style={{
            padding: '4px 12px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          换一句
        </button>
      </div>
      <textarea
        placeholder="请输入"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          borderRadius: '12px',
          backgroundColor: 'white',
          fontSize: '14px',
          outline: 'none',
          resize: 'none',
          minHeight: '80px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
