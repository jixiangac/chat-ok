export default function RulesExplanation() {
  return (
    <div style={{
      backgroundColor: '#f8f8f8',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>💡</span>
        <span>打卡规则说明</span>
      </div>
      <div style={{
        fontSize: '12px',
        color: '#666',
        lineHeight: '1.6'
      }}>
        <div style={{ marginBottom: '8px' }}>
          本系统采用<strong>周期打卡制</strong>，而非每日打卡：
        </div>
        <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
          • 设定长期目标的deadline（如1年）
        </div>
        <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
          • 选择周期长度（7/10/15天）
        </div>
        <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
          • 每个周期内至少打卡<strong style={{ color: '#ff6b6b' }}>3次</strong>即可完成
        </div>
        <div style={{ paddingLeft: '12px', color: '#999', fontSize: '11px', marginTop: '8px' }}>
          💡 这样既保持目标推进，又不会过于频繁造成压力
        </div>
      </div>
    </div>
  );
}
