import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Popup } from 'antd-mobile';
import type { GoalData, TaskType, Priority } from '../../types';
import { CycleCalculator } from '../../utils/cycleCalculator';
import { MIN_CHECK_INS_PER_CYCLE } from './constants';
import type { CreateGoalModalProps } from './types';
import {
  PopularGoals,
  EncouragementInput,
  IconSelector,
  DurationSelector,
  CycleSelector,
  CyclePreview,
  DateSelector,
  TaskTypeSelector,
  PrioritySelector,
  WarningAlert,
  RulesExplanation
} from './components';

export default function CreateGoalModal({ 
  visible, 
  onClose, 
  onSubmit,
  existingMainlineGoal,
  localStorageKey = 'dc_tasks'
}: CreateGoalModalProps) {
  const [goalTitle, setGoalTitle] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [taskType, setTaskType] = useState<TaskType>('sidelineA');
  const [priority, setPriority] = useState<Priority>('medium');
  const [showWarning, setShowWarning] = useState(false);
  const [hasMainlineGoal, setHasMainlineGoal] = useState(false);
  
  const [totalDays, setTotalDays] = useState(365);
  const [cycleDays, setCycleDays] = useState(10);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState('365');
  
  const cycleInfo = useMemo(() => {
    return CycleCalculator.calculateCycleInfo(totalDays, cycleDays, MIN_CHECK_INS_PER_CYCLE);
  }, [totalDays, cycleDays]);
  
  const configValidation = useMemo(() => {
    return CycleCalculator.validateCycleConfig(totalDays, cycleDays);
  }, [totalDays, cycleDays]);

  useEffect(() => {
    if (existingMainlineGoal !== undefined) {
      setHasMainlineGoal(existingMainlineGoal);
      return;
    }

    try {
      const storedGoals = localStorage.getItem(localStorageKey);
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const hasMainline = Array.isArray(goals) && goals.some(
          (goal: any) => {
            const isMainline = goal.type === 'mainline';
            const isActive = !goal.status || goal.status === 'active';
            return isMainline && isActive;
          }
        );
        setHasMainlineGoal(hasMainline);
      } else {
        setHasMainlineGoal(false);
      }
    } catch (error) {
      console.error('❌ 读取 localStorage 失败:', error);
      setHasMainlineGoal(false);
    }
  }, [existingMainlineGoal, localStorageKey, visible]);

  useEffect(() => {
    if (hasMainlineGoal && taskType === 'mainline') {
      setTaskType('sidelineA');
    }
  }, [hasMainlineGoal, taskType]);

  const handleSubmit = () => {
    if (!configValidation.valid) {
      alert(configValidation.message);
      return;
    }
    
    if (!goalTitle.trim()) {
      alert('请输入目标标题');
      return;
    }
    
    if (taskType === 'mainline') {
      try {
        const storedGoals = localStorage.getItem(localStorageKey);
        if (storedGoals) {
          const goals = JSON.parse(storedGoals);
          const hasActiveMainline = Array.isArray(goals) && goals.some(
            (goal: any) => {
              const isMainline = goal.type === 'mainline';
              const isActive = !goal.status || goal.status === 'active';
              return isMainline && isActive;
            }
          );
          
          if (hasActiveMainline) {
            setShowWarning(true);
            return;
          }
        }
      } catch (error) {
        console.error('❌ 验证主线任务失败:', error);
      }
    }

    const goalData: GoalData = {
      title: goalTitle,
      encouragement,
      icon: selectedIcon,
      startDate,
      type: taskType,
      priority: taskType !== 'mainline' ? priority : undefined,
      targetCompletionRate: taskType === 'mainline' ? 100 : undefined,
      totalDays,
      cycleDays,
      totalCycles: cycleInfo.totalCycles,
      minCheckInsPerCycle: MIN_CHECK_INS_PER_CYCLE,
      duration: `${totalDays}days`,
      customDuration: isCustomDuration
    };
    
    onSubmit(goalData);
    handleClose();
  };
  
  const handleClose = () => {
    setGoalTitle('');
    setEncouragement('');
    setSelectedIcon('⭐');
    setTaskType('sidelineA');
    setPriority('medium');
    setTotalDays(365);
    setCycleDays(10);
    setIsCustomDuration(false);
    setCustomDaysInput('365');
    setShowWarning(false);
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position='bottom'
      destroyOnClose={false}
      bodyStyle={{
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        minHeight: '80vh',
        maxHeight: '90vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#ffffff',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div style={{
        padding: '24px 24px 0 24px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: 0
          }}>新建目标</h2>
          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Goal Title Input */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="输入你想要坚持的目标"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <PopularGoals onSelect={setGoalTitle} />
        
        <EncouragementInput 
          value={encouragement} 
          onChange={setEncouragement} 
        />
        
        <IconSelector 
          selectedIcon={selectedIcon} 
          onSelect={setSelectedIcon} 
        />
        
        <DurationSelector
          totalDays={totalDays}
          isCustomDuration={isCustomDuration}
          customDaysInput={customDaysInput}
          onTotalDaysChange={setTotalDays}
          onCustomDurationChange={setIsCustomDuration}
          onCustomDaysInputChange={setCustomDaysInput}
        />
        
        <CycleSelector 
          cycleDays={cycleDays} 
          onCycleDaysChange={setCycleDays} 
        />
        
        <CyclePreview 
          cycleInfo={cycleInfo} 
          configValidation={configValidation} 
          cycleDays={cycleDays} 
        />
        
        <DateSelector 
          startDate={startDate} 
          totalDays={totalDays} 
          onStartDateChange={setStartDate} 
        />
        
        <TaskTypeSelector 
          taskType={taskType} 
          hasMainlineGoal={hasMainlineGoal} 
          onTaskTypeChange={setTaskType} 
        />
        
        {taskType !== 'mainline' && (
          <PrioritySelector 
            priority={priority} 
            onPriorityChange={setPriority} 
          />
        )}
        
        <WarningAlert 
          visible={showWarning} 
          onClose={() => setShowWarning(false)} 
        />
        
        <RulesExplanation />
      </div>

      {/* Submit Button */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0',
        position: 'sticky',
        bottom: 0
      }}>
        <button
          onClick={handleSubmit}
          disabled={!configValidation.valid || !goalTitle.trim()}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: (!configValidation.valid || !goalTitle.trim()) ? '#ccc' : 'black',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (!configValidation.valid || !goalTitle.trim()) ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => {
            if (configValidation.valid && goalTitle.trim()) {
              e.currentTarget.style.opacity = '0.8';
            }
          }}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          创建目标
        </button>
      </div>
    </Popup>
  );
}
