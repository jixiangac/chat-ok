import type { CycleInfo, ConfigValidation } from '../types';
import { MIN_CHECK_INS_PER_CYCLE } from '../constants';

interface CyclePreviewProps {
  cycleInfo: CycleInfo;
  configValidation: ConfigValidation;
  cycleDays: number;
}

export default function CyclePreview({ cycleInfo, configValidation, cycleDays }: CyclePreviewProps) {
  return (
    <div style={{
      backgroundColor: configValidation.valid ? '#f0f7ff' : '#fff5f5',
      border: `1px solid ${configValidation.valid ? '#4a9eff' : '#ff4444'}`,
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
        <span>{configValidation.valid ? '📊' : '⚠️'}</span>
        <span>周期规划预览</span>
      </div>
      
      {configValidation.valid ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#4a9eff',
                marginBottom: '4px'
              }}>
                {cycleInfo.totalCycles}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                总周期数
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#ff6b6b',
                marginBottom: '4px'
              }}>
                {cycleInfo.totalCheckInsNeeded}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                总打卡次数
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.8'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                width: '20px',
                flexShrink: 0
              }}>✅</span>
              <span>
                每个周期（<strong style={{ color: '#333' }}>{cycleDays}天</strong>）需打卡
                <strong style={{ color: '#ff6b6b' }}> {MIN_CHECK_INS_PER_CYCLE}次</strong>
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                width: '20px',
                flexShrink: 0
              }}>📈</span>
              <span>
                平均每周需打卡
                <strong style={{ color: '#4a9eff' }}> {cycleInfo.averageCheckInsPerWeek}次</strong>
              </span>
            </div>
            
            {cycleInfo.remainingDays > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#999',
                fontSize: '11px'
              }}>
                <span style={{ 
                  width: '20px',
                  flexShrink: 0
                }}>💡</span>
                <span>
                  剩余<strong> {cycleInfo.remainingDays}天</strong>作为缓冲期
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '13px',
          color: '#ff4444',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span>{configValidation.message}</span>
        </div>
      )}
    </div>
  );
}
