import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, BarChart3, Plus } from 'lucide-react';
import type { CycleInfo } from '../../types';
import { fadeVariants } from '../../../../constants/animations';

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
  // 通用输入框样式
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClipboardList size={16} /> 清单设定
        </div>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>总项数</div>
          <input
            type="number"
            value={totalItems}
            onChange={(e) => setTotalItems(e.target.value)}
            placeholder="10"
            style={inputStyle}
          />
        </div>
        
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
          快速创建清单项（可选，创建后可继续编辑）：
        </div>
        <AnimatePresence>
          {checklistItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
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
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          onClick={() => setChecklistItems([...checklistItems, ''])}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={14} /> 添加更多清单项
        </motion.button>
      </div>
      
      {/* 自动规划预览 */}
      <AnimatePresence>
        {totalItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: '#f9f9f9',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#37352f', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={16} /> 系统自动规划
            </div>
            <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
              • 总项数：{totalItems}项<br/>
              • 每周期目标：{Math.ceil(parseInt(totalItems) / cycleInfo.totalCycles)}项/周期
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
