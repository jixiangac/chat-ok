import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { TASK_TYPE_OPTIONS } from '../constants';
import type { ConfigStepProps } from '../types';
import NumericConfig from './configs/NumericConfig';
import ChecklistConfig from './configs/ChecklistConfig';
import CheckInConfig from './configs/CheckInConfig';
import { fadeVariants } from '../../../constants/animations';

export default function ConfigStep({
  selectedType,
  taskTitle,
  setTaskTitle,
  cycleInfo,
  cycleDays,
  totalDays,
  numericDirection,
  setNumericDirection,
  numericUnit,
  setNumericUnit,
  startValue,
  setStartValue,
  targetValue,
  setTargetValue,
  totalItems,
  setTotalItems,
  checklistItems,
  setChecklistItems,
  checkInUnit,
  setCheckInUnit,
  allowMultiple,
  setAllowMultiple,
  weekendExempt,
  setWeekendExempt,
  dailyMaxTimes,
  setDailyMaxTimes,
  cycleTargetTimes,
  setCycleTargetTimes,
  dailyTargetMinutes,
  setDailyTargetMinutes,
  cycleTargetMinutes,
  setCycleTargetMinutes,
  dailyTargetValue,
  setDailyTargetValue,
  cycleTargetValue,
  setCycleTargetValue,
  valueUnit,
  setValueUnit
}: ConfigStepProps) {
  const typeOption = TASK_TYPE_OPTIONS.find(t => t.type === selectedType);

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
      style={{ 
        padding: '20px 16px',
        minHeight: '520px',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        步骤3：{typeOption?.label}设定
      </h2>
      
      {/* 任务名称 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ marginBottom: '18px' }}
      >
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileText size={16} /> 任务名称
        </div>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder={
            selectedType === 'NUMERIC' ? '例如：减重到理想体重' :
            selectedType === 'CHECKLIST' ? '例如：完成10本历史书阅读' :
            '例如：每天背20个单词'
          }
          style={inputStyle}
        />
      </motion.div>
      
      {/* 数值型配置 */}
      {selectedType === 'NUMERIC' && (
        <NumericConfig
          numericDirection={numericDirection}
          setNumericDirection={setNumericDirection}
          numericUnit={numericUnit}
          setNumericUnit={setNumericUnit}
          startValue={startValue}
          setStartValue={setStartValue}
          targetValue={targetValue}
          setTargetValue={setTargetValue}
          cycleInfo={cycleInfo}
          totalDays={totalDays}
        />
      )}
      
      {/* 清单型配置 */}
      {selectedType === 'CHECKLIST' && (
        <ChecklistConfig
          totalItems={totalItems}
          setTotalItems={setTotalItems}
          checklistItems={checklistItems}
          setChecklistItems={setChecklistItems}
          cycleInfo={cycleInfo}
        />
      )}
      
      {/* 打卡型配置 */}
      {selectedType === 'CHECK_IN' && (
        <CheckInConfig
          checkInUnit={checkInUnit}
          setCheckInUnit={setCheckInUnit}
          cycleDays={cycleDays}
          cycleInfo={cycleInfo}
          dailyMaxTimes={dailyMaxTimes}
          setDailyMaxTimes={setDailyMaxTimes}
          cycleTargetTimes={cycleTargetTimes}
          setCycleTargetTimes={setCycleTargetTimes}
          dailyTargetMinutes={dailyTargetMinutes}
          setDailyTargetMinutes={setDailyTargetMinutes}
          cycleTargetMinutes={cycleTargetMinutes}
          setCycleTargetMinutes={setCycleTargetMinutes}
          dailyTargetValue={dailyTargetValue}
          setDailyTargetValue={setDailyTargetValue}
          cycleTargetValue={cycleTargetValue}
          setCycleTargetValue={setCycleTargetValue}
          valueUnit={valueUnit}
          setValueUnit={setValueUnit}
        />
      )}
    </motion.div>
  );
}

