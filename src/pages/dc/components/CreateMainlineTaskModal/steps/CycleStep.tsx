import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Calendar, Target } from 'lucide-react';
import { TOTAL_DURATION_OPTIONS, CYCLE_LENGTH_OPTIONS } from '../constants';
import type { CycleStepProps, HighlightStyle } from '../types';
import { fadeVariants } from '../../../constants/animations';

export default function CycleStep({
  totalDays,
  setTotalDays,
  cycleDays,
  setCycleDays,
  customDays,
  setCustomDays,
  isCustom,
  setIsCustom,
  customCycleDays,
  setCustomCycleDays,
  isCustomCycle,
  setIsCustomCycle,
  startDate,
  setStartDate,
  cycleInfo
}: CycleStepProps) {
  const durationRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cycleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [durationHighlight, setDurationHighlight] = useState<HighlightStyle>({ top: 0, left: 0, height: 0, width: 0 });
  const [cycleHighlight, setCycleHighlight] = useState<HighlightStyle>({ top: 0, left: 0, height: 0, width: 0 });

  // 计算总时长高亮框位置
  useEffect(() => {
    if (isCustom) return;
    const selectedIndex = TOTAL_DURATION_OPTIONS.findIndex(opt => opt.value === totalDays);
    if (selectedIndex >= 0 && durationRefs.current[selectedIndex]) {
      const card = durationRefs.current[selectedIndex];
      if (card) {
        setDurationHighlight({
          top: card.offsetTop,
          left: card.offsetLeft,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [totalDays, isCustom]);

  // 计算周期长度高亮框位置
  useEffect(() => {
    if (isCustomCycle) return;
    const selectedIndex = CYCLE_LENGTH_OPTIONS.findIndex(opt => opt.value === cycleDays);
    if (selectedIndex >= 0 && cycleRefs.current[selectedIndex]) {
      const card = cycleRefs.current[selectedIndex];
      if (card) {
        setCycleHighlight({
          top: card.offsetTop,
          left: card.offsetLeft,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [cycleDays, isCustomCycle]);

  const selectedDurationIndex = isCustom ? -1 : TOTAL_DURATION_OPTIONS.findIndex(opt => opt.value === totalDays);

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

  // 通用按钮样式
  const buttonBaseStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: '2px solid #9ca3af',
    padding: '14px 12px',
    borderRadius: '16px',
    backgroundColor: 'white',
    textAlign: 'left',
    transition: 'all 0.2s',
    minWidth: 0,
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        padding: '20px 16px',
        minHeight: '520px',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        步骤1：周期设定
      </h2>
      
      {/* 总时长 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
          <Calendar size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 设定总时长
        </div>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
          我想用多久完成这个目标？
        </div>
        <div style={{ 
          position: 'relative',
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px', 
          marginBottom: '12px' 
        }}>
          {TOTAL_DURATION_OPTIONS.map((option, index) => (
            <motion.button
              key={option.value}
              ref={el => { durationRefs.current[index] = el; }}
              onClick={() => {
                setTotalDays(option.value);
                setIsCustom(false);
                setCustomDays('');
                setCycleDays(option.value === 365 ? 30 : 10);
              }}
              whileTap={{ scale: 0.98 }}
              style={buttonBaseStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <option.Icon size={22} style={{ flexShrink: 0 }} />
                <div style={{ fontWeight: '600', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {option.label}
                </div>
              </div>
            </motion.button>
          ))}
          
          {/* 选中高亮边框 */}
          <div style={{
            width: `${durationHighlight.width}px`,
            height: `${durationHighlight.height}px`,
            position: 'absolute',
            top: `${durationHighlight.top}px`,
            left: `${durationHighlight.left}px`,
            borderRadius: '16px',
            pointerEvents: 'none',
            transition: 'top 0.3s, left 0.3s, height 0.3s, width 0.3s',
            opacity: selectedDurationIndex >= 0 ? 1 : 0,
            boxShadow: 'inset 0 0 0 3px #000'
          }} />
        </div>
        
        {/* 自定义天数 */}
        <div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>自定义天数：</div>
          <input
            type="number"
            value={customDays}
            onChange={(e) => {
              setCustomDays(e.target.value);
              const days = parseInt(e.target.value);
              if (days > 0) {
                setTotalDays(days);
                setIsCustom(true);
                setCycleDays(days >= 365 ? 30 : 10);
              }
            }}
            placeholder="输入天数"
            style={inputStyle}
          />
        </div>
      </div>
    
      {/* 周期长度 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
          <Target size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 选择周期长度
        </div>
        <div style={{ 
          position: 'relative',
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          marginBottom: '12px'
        }}>
          {CYCLE_LENGTH_OPTIONS.map((option, index) => {
            const isDisabled = totalDays === 30 && option.value === 30;
            return (
              <motion.button
                key={option.value}
                ref={el => { cycleRefs.current[index] = el; }}
                onClick={() => {
                  if (isDisabled) return;
                  setCycleDays(option.value);
                  setIsCustomCycle(false);
                  setCustomCycleDays('');
                }}
                disabled={isDisabled}
                whileTap={isDisabled ? undefined : { scale: 0.98 }}
                style={{
                  ...buttonBaseStyle,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 6px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.4 : 1
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>
                  {option.label}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {option.description}
                </div>
              </motion.button>
            );
          })}
          
          {/* 选中高亮边框 */}
          <div style={{
            width: `${cycleHighlight.width}px`,
            height: `${cycleHighlight.height}px`,
            position: 'absolute',
            top: `${cycleHighlight.top}px`,
            left: `${cycleHighlight.left}px`,
            borderRadius: '16px',
            pointerEvents: 'none',
            transition: 'top 0.3s, left 0.3s, height 0.3s, width 0.3s',
            opacity: isCustomCycle ? 0 : 1,
            boxShadow: 'inset 0 0 0 3px #000'
          }} />
        </div>
        
        {/* 自定义周期天数 */}
        <div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>自定义周期天数（5-30天）：</div>
          <input
            type="number"
            value={customCycleDays}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setCustomCycleDays('');
                return;
              }
              const days = parseInt(value);
              const clampedDays = Math.min(30, Math.max(5, days));
              setCustomCycleDays(String(clampedDays));
              setCycleDays(clampedDays);
              setIsCustomCycle(true);
            }}
            placeholder="5-30"
            min={5}
            max={30}
            style={inputStyle}
          />
        </div>
      </div>
      
      {/* 预览 */}
      {/* <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: '#f9f9f9',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '14px'
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#37352f' }}>
          预计将创建 {cycleInfo.totalCycles} 个周期
        </div>
        <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
          <div>总时长：{totalDays}天</div>
          <div>周期长度：{cycleDays}天</div>
          <div>总周期数：{cycleInfo.totalCycles}个</div>
          {cycleInfo.remainingDays > 0 && <div>剩余：{cycleInfo.remainingDays}天（缓冲期）</div>}
        </div>
      </motion.div> */}
      
      {/* 起始时间 */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
          <Calendar size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 设定起始时间
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={dayjs().subtract(7, 'day').format('YYYY-MM-DD')}
          max={dayjs().add(1, 'month').format('YYYY-MM-DD')}
          style={inputStyle}
        />
        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          可选择过去1周内或未来1个月内的日期
        </div>
      </div>
    </motion.div>
  );
}


