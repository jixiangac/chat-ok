import { useRef, useEffect, useState } from 'react';
import { Target, BarChart3 } from 'lucide-react';
import { DIRECTION_OPTIONS } from '../../constants';
import type { HighlightStyle, CycleInfo } from '../../types';
import type { NumericDirection } from '../../../../types';

interface NumericConfigProps {
  numericDirection: NumericDirection;
  setNumericDirection: (direction: NumericDirection) => void;
  numericUnit: string;
  setNumericUnit: (unit: string) => void;
  startValue: string;
  setStartValue: (value: string) => void;
  targetValue: string;
  setTargetValue: (value: string) => void;
  cycleInfo: CycleInfo;
  totalDays: number;
}

export default function NumericConfig({
  numericDirection,
  setNumericDirection,
  numericUnit,
  setNumericUnit,
  startValue,
  setStartValue,
  targetValue,
  setTargetValue,
  cycleInfo,
  totalDays
}: NumericConfigProps) {
  const directionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [directionHighlight, setDirectionHighlight] = useState<HighlightStyle>({ top: 0, left: 0, height: 0, width: 0 });

  // 计算增减方向高亮框位置
  useEffect(() => {
    const selectedIndex = DIRECTION_OPTIONS.findIndex(opt => opt.value === numericDirection);
    if (selectedIndex >= 0 && directionRefs.current[selectedIndex]) {
      const card = directionRefs.current[selectedIndex];
      if (card) {
        setDirectionHighlight({
          top: card.offsetTop,
          left: card.offsetLeft,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [numericDirection]);

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={16} /> 数值目标
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>起始值</div>
            <input
              type="number"
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
              placeholder="150"
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
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>目标值</div>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="140"
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
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单位</div>
          <input
            type="text"
            value={numericUnit}
            onChange={(e) => setNumericUnit(e.target.value)}
            placeholder="斤"
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
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>增减方向</div>
          <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
            {DIRECTION_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                ref={el => directionRefs.current[index] = el}
                onClick={() => setNumericDirection(option.value)}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '2px solid #9ca3af',
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '16px' }}>{option.label}</div>
              </button>
            ))}
            
            {/* 选中高亮边框 */}
            <div style={{
              width: `${directionHighlight.width}px`,
              height: `${directionHighlight.height}px`,
              position: 'absolute',
              top: `${directionHighlight.top}px`,
              left: `${directionHighlight.left}px`,
              borderRadius: '16px',
              pointerEvents: 'none',
              transition: 'top 0.3s, left 0.3s, height 0.3s, width 0.3s',
              opacity: 1,
              boxShadow: 'inset 0 0 0 3px #000'
            }} />
          </div>
        </div>
      </div>
      
      {/* 自动规划预览 */}
      {startValue && targetValue && (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#37352f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 size={16} /> 系统自动规划
          </div>
          <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
            • 总目标：{numericDirection === 'DECREASE' ? '减少' : '增加'} {Math.abs(parseFloat(targetValue) - parseFloat(startValue)).toFixed(2)}{numericUnit}<br/>
            • 每周期目标：{(Math.abs(parseFloat(targetValue) - parseFloat(startValue)) / cycleInfo.totalCycles).toFixed(2)} {numericUnit}/周期<br/>
            • 每日平均：{(Math.abs(parseFloat(targetValue) - parseFloat(startValue)) / totalDays).toFixed(2)} {numericUnit}/天
          </div>
        </div>
      )}
    </>
  );
}
