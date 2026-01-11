import { useRef, useEffect, useState } from 'react';
import { TASK_TYPE_OPTIONS } from '../constants';
import type { TypeStepProps, HighlightStyle } from '../types';

export default function TypeStep({ selectedType, setSelectedType }: TypeStepProps) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({ top: 0, left: 0, height: 0, width: 0 });

  // 计算高亮框位置
  useEffect(() => {
    const selectedIndex = TASK_TYPE_OPTIONS.findIndex(opt => opt.type === selectedType);
    if (selectedIndex >= 0 && cardRefs.current[selectedIndex]) {
      const card = cardRefs.current[selectedIndex];
      if (card) {
        setHighlightStyle({
          top: card.offsetTop,
          left: 0,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [selectedType]);

  const selectedIndex = TASK_TYPE_OPTIONS.findIndex(opt => opt.type === selectedType);

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
        步骤2：选择任务类型模板
      </h2>
      
      <div style={{ 
        width: '100%', 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {TASK_TYPE_OPTIONS.map((option, index) => {
          const isSelected = selectedType === option.type;
          return (
            <button
              key={option.type}
              ref={el => cardRefs.current[index] = el}
              onClick={() => setSelectedType(option.type)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                cursor: 'pointer',
                border: '2px solid #9ca3af',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <option.Icon size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                    {option.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                    {option.examples}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4a9eff', fontWeight: '500' }}>
                    {option.feature}
                  </div>
                </div>
              </div>
              <div style={{
                border: '1.5px solid',
                borderColor: isSelected ? '#000' : '#9ca3af',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                marginTop: '2px',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s',
                flexShrink: 0
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity 0.2s'
                }} />
              </div>
            </button>
          );
        })}
        
        {/* 选中高亮边框 */}
        <div style={{
          width: `${highlightStyle.width}px`,
          height: `${highlightStyle.height}px`,
          position: 'absolute',
          top: `${highlightStyle.top}px`,
          left: 0,
          borderRadius: '16px',
          pointerEvents: 'none',
          transition: 'top 0.3s, height 0.3s, width 0.3s',
          opacity: selectedIndex >= 0 ? 1 : 0,
          boxShadow: 'inset 0 0 0 3px #000'
        }} />
      </div>
    </div>
  );
}
