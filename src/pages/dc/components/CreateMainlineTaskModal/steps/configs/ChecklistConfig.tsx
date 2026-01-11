import { ClipboardList, BarChart3 } from 'lucide-react';
import type { CycleInfo } from '../../types';

interface ChecklistConfigProps {
  totalItems: string;
  setTotalItems: (items: string) => void;
  checklistItems: string[];
  setChecklistItems: (items: string[]) => void;
  cycleInfo: CycleInfo;
}

export default function ChecklistConfig({
  totalItems,
  setTotalItems,
  checklistItems,
  setChecklistItems,
  cycleInfo
}: ChecklistConfigProps) {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClipboardList size={16} /> 清单设定
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>总项数</div>
          <input
            type="number"
            value={totalItems}
            onChange={(e) => setTotalItems(e.target.value)}
            placeholder="10"
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
        
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
          快速创建清单项（可选，创建后可继续编辑）：
        </div>
        {checklistItems.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...checklistItems];
              newItems[index] = e.target.value;
              setChecklistItems(newItems);
            }}
            placeholder={`${index + 1}. 清单项名称`}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '8px'
            }}
          />
        ))}
        <button
          onClick={() => setChecklistItems([...checklistItems, ''])}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#666'
          }}
        >
          + 添加更多清单项
        </button>
      </div>
      
      {/* 自动规划预览 */}
      {totalItems && (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#37352f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 size={16} /> 系统自动规划
          </div>
          <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
            • 总项数：{totalItems}项<br/>
            • 每周期目标：{Math.ceil(parseInt(totalItems) / cycleInfo.totalCycles)}项/周期
          </div>
        </div>
      )}
    </>
  );
}
