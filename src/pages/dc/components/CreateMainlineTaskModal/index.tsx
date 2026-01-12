import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import { Popup } from 'antd-mobile';
import type { MainlineTaskType, NumericDirection, CheckInUnit } from '../../types';
import { useTheme } from '../../contexts';
import type { Step, TaskCategory, CycleInfo, CreateMainlineTaskModalProps } from './types';
import { CycleStep, TypeStep, ConfigStep } from './steps';
import { stepVariants, smoothTransition } from '../../constants/animations';

export default function CreateMainlineTaskModal({
  visible,
  onClose,
  onSubmit
}: CreateMainlineTaskModalProps) {
  const { themeColors } = useTheme();
  
  // 任务类别
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('MAINLINE');
  
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<Step>('cycle');
  
  // 步骤方向（用于动画）
  const [stepDirection, setStepDirection] = useState(1);
  
  // 步骤1：周期设定
  const [totalDays, setTotalDays] = useState(90);
  const [cycleDays, setCycleDays] = useState(10);
  const [customDays, setCustomDays] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customCycleDays, setCustomCycleDays] = useState('');
  const [isCustomCycle, setIsCustomCycle] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  
  // 步骤2：类型选择
  const [selectedType, setSelectedType] = useState<MainlineTaskType | null>(null);
  
  // 步骤3：具体配置
  const [taskTitle, setTaskTitle] = useState('');
  
  // 数值型配置
  const [numericDirection, setNumericDirection] = useState<NumericDirection>('DECREASE');
  const [numericUnit, setNumericUnit] = useState('斤');
  const [startValue, setStartValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  
  // 清单型配置
  const [totalItems, setTotalItems] = useState('10');
  const [checklistItems, setChecklistItems] = useState<string[]>(['', '', '', '']);
  
  // 打卡型配置
  const [checkInUnit, setCheckInUnit] = useState<CheckInUnit>('TIMES');
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [weekendExempt, setWeekendExempt] = useState(false);
  const [dailyMaxTimes, setDailyMaxTimes] = useState('1');
  const [cycleTargetTimes, setCycleTargetTimes] = useState('');
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState('15');
  const [cycleTargetMinutes, setCycleTargetMinutes] = useState('');
  const [dailyTargetValue, setDailyTargetValue] = useState('');
  const [cycleTargetValue, setCycleTargetValue] = useState('');
  const [valueUnit, setValueUnit] = useState('个');
  
  // 计算周期信息
  const cycleInfo: CycleInfo = useMemo(() => ({
    totalCycles: Math.floor(totalDays / cycleDays),
    remainingDays: totalDays % cycleDays
  }), [totalDays, cycleDays]);
  
  // 每次弹窗打开时，判断应该创建主线还是支线任务
  useEffect(() => {
    if (visible) {
      const storedTasks = localStorage.getItem('dc_tasks');
      let hasActiveMainlineTask = false;
      
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          hasActiveMainlineTask = parsedTasks.some(
            (t: any) => t.type === 'mainline' && t.status !== 'archived'
          );
        } catch (e) {
          console.error('解析dc_tasks失败:', e);
        }
      }
      
      setTaskCategory(hasActiveMainlineTask ? 'SIDELINE' : 'MAINLINE');
    }
  }, [visible]);
  
  // 重置表单
  const resetForm = () => {
    setCurrentStep('cycle');
    setStepDirection(1);
    setTotalDays(90);
    setCycleDays(10);
    setCustomDays('');
    setIsCustom(false);
    setCustomCycleDays('');
    setIsCustomCycle(false);
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setSelectedType(null);
    setTaskTitle('');
    setNumericDirection('DECREASE');
    setNumericUnit('斤');
    setStartValue('');
    setTargetValue('');
    setTotalItems('10');
    setChecklistItems(['', '', '', '']);
    setCheckInUnit('TIMES');
    setAllowMultiple(true);
    setWeekendExempt(false);
    setDailyMaxTimes('1');
    setCycleTargetTimes('');
    setDailyTargetMinutes('15');
    setCycleTargetMinutes('');
    setDailyTargetValue('');
    setCycleTargetValue('');
    setValueUnit('个');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleNext = () => {
    setStepDirection(1);
    if (currentStep === 'cycle') {
      setCurrentStep('type');
    } else if (currentStep === 'type' && selectedType) {
      setCurrentStep('config');
    }
  };
  
  const handleBack = () => {
    setStepDirection(-1);
    if (currentStep === 'type') {
      setCurrentStep('cycle');
    } else if (currentStep === 'config') {
      setCurrentStep('type');
    }
  };
  
  const handleSubmit = () => {
    if (!taskTitle.trim() || !selectedType) {
      alert('请填写完整信息');
      return;
    }
    
    const baseData = {
      title: taskTitle,
      mainlineType: selectedType,
      taskCategory,
      totalDays,
      cycleDays,
      totalCycles: cycleInfo.totalCycles,
      startDate
    };
    
    let taskData: any = baseData;
    
    if (selectedType === 'NUMERIC') {
      const start = parseFloat(startValue);
      const target = parseFloat(targetValue);
      if (isNaN(start) || isNaN(target)) {
        alert('请输入有效的数值');
        return;
      }
      const totalChange = Math.abs(target - start);
      taskData.numericConfig = {
        direction: numericDirection,
        unit: numericUnit,
        startValue: start,
        targetValue: target,
        currentValue: start,
        perCycleTarget: totalChange / cycleInfo.totalCycles,
        perDayAverage: totalChange / totalDays
      };
    } else if (selectedType === 'CHECKLIST') {
      const items = parseInt(totalItems);
      if (isNaN(items) || items < 1) {
        alert('请输入有效的清单项数量');
        return;
      }
      const filledItems = checklistItems.filter(item => item.trim());
      taskData.checklistConfig = {
        totalItems: items,
        items: filledItems.map((title, index) => ({
          id: `item_${Date.now()}_${index}`,
          title,
          status: 'PENDING',
          cycle: Math.floor(index / Math.ceil(items / cycleInfo.totalCycles)) + 1
        }))
      };
    } else if (selectedType === 'CHECK_IN') {
      const checkInConfig: any = {
        unit: checkInUnit,
        allowMultiplePerDay: allowMultiple,
        weekendExempt: weekendExempt,
        currentStreak: 0,
        longestStreak: 0,
        checkInRate: 0,
        streaks: [],
        records: []
      };
      
      if (checkInUnit === 'TIMES') {
        const maxTimes = parseInt(dailyMaxTimes) || 1;
        const defaultCycleTarget = cycleDays * maxTimes;
        const cycleTarget = cycleTargetTimes ? parseInt(cycleTargetTimes) : defaultCycleTarget;
        checkInConfig.dailyMaxTimes = maxTimes;
        checkInConfig.cycleTargetTimes = cycleTarget;
        checkInConfig.perCycleTarget = cycleTarget;
      } else if (checkInUnit === 'DURATION') {
        const dailyMinutes = parseInt(dailyTargetMinutes) || 15;
        const defaultCycleMinutes = cycleDays * dailyMinutes;
        const cycleMinutes = cycleTargetMinutes ? parseInt(cycleTargetMinutes) : defaultCycleMinutes;
        checkInConfig.dailyTargetMinutes = dailyMinutes;
        checkInConfig.cycleTargetMinutes = cycleMinutes;
        checkInConfig.quickDurations = [5, 10, 15];
        checkInConfig.perCycleTarget = cycleMinutes;
      } else if (checkInUnit === 'QUANTITY') {
        const dailyValue = parseFloat(dailyTargetValue) || 0;
        const defaultCycleValue = cycleDays * dailyValue;
        const cycleValue = cycleTargetValue ? parseFloat(cycleTargetValue) : defaultCycleValue;
        if (!dailyValue) {
          alert('请输入有效的单日目标数值');
          return;
        }
        checkInConfig.dailyTargetValue = dailyValue;
        checkInConfig.cycleTargetValue = cycleValue;
        checkInConfig.valueUnit = valueUnit;
        checkInConfig.perCycleTarget = cycleValue;
      }
      
      taskData.checkInConfig = checkInConfig;
    }
    
    // 触发彩纸效果
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
    
    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.5, y: 0.9 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['circle']
    }).then(() => {
      document.body.removeChild(canvas);
    });
    
    onSubmit(taskData);
    handleClose();
  };

  // 获取步骤索引
  const getStepIndex = (step: Step): number => {
    const steps: Step[] = ['cycle', 'type', 'config'];
    return steps.indexOf(step);
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
        height: '85vh',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowX: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', margin: 0 }}>
            创建{taskCategory === 'MAINLINE' ? '主线' : '支线'}任务
          </h2>
          <motion.button
            onClick={handleClose}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </motion.button>
        </div>
        
        {/* 步骤指示器 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '14px'
        }}>
          {['cycle', 'type', 'config'].map((step, index) => {
            const isCompleted = getStepIndex(currentStep) > index;
            const isCurrent = currentStep === step;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <motion.div
                  animate={{
                    backgroundColor: isCompleted || isCurrent ? 'black' : '#e5e5e5',
                    color: isCompleted || isCurrent ? 'white' : '#999',
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </motion.div>
                {index < 2 && (
                  <motion.div
                    animate={{
                      backgroundColor: isCompleted ? 'black' : '#e5e5e5',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      flex: 1,
                      height: '2px',
                      marginLeft: '6px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Content with step animation */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
      }}>
        <AnimatePresence mode="wait" custom={stepDirection}>
          {currentStep === 'cycle' && (
            <motion.div
              key="cycle"
              custom={stepDirection}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <CycleStep
                totalDays={totalDays}
                setTotalDays={setTotalDays}
                cycleDays={cycleDays}
                setCycleDays={setCycleDays}
                customDays={customDays}
                setCustomDays={setCustomDays}
                isCustom={isCustom}
                setIsCustom={setIsCustom}
                customCycleDays={customCycleDays}
                setCustomCycleDays={setCustomCycleDays}
                isCustomCycle={isCustomCycle}
                setIsCustomCycle={setIsCustomCycle}
                startDate={startDate}
                setStartDate={setStartDate}
                cycleInfo={cycleInfo}
              />
            </motion.div>
          )}
          {currentStep === 'type' && (
            <motion.div
              key="type"
              custom={stepDirection}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <TypeStep
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </motion.div>
          )}
          {currentStep === 'config' && selectedType && (
            <motion.div
              key="config"
              custom={stepDirection}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <ConfigStep
                selectedType={selectedType}
                taskTitle={taskTitle}
                setTaskTitle={setTaskTitle}
                cycleInfo={cycleInfo}
                cycleDays={cycleDays}
                totalDays={totalDays}
                numericDirection={numericDirection}
                setNumericDirection={setNumericDirection}
                numericUnit={numericUnit}
                setNumericUnit={setNumericUnit}
                startValue={startValue}
                setStartValue={setStartValue}
                targetValue={targetValue}
                setTargetValue={setTargetValue}
                totalItems={totalItems}
                setTotalItems={setTotalItems}
                checklistItems={checklistItems}
                setChecklistItems={setChecklistItems}
                checkInUnit={checkInUnit}
                setCheckInUnit={setCheckInUnit}
                allowMultiple={allowMultiple}
                setAllowMultiple={setAllowMultiple}
                weekendExempt={weekendExempt}
                setWeekendExempt={setWeekendExempt}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '14px 16px',
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0',
        flexShrink: 0,
        display: 'flex',
        gap: '10px'
      }}>
        {currentStep !== 'cycle' && (
          <motion.button
            onClick={handleBack}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              padding: '13px',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            上一步
          </motion.button>
        )}
        <motion.button
          onClick={currentStep === 'config' ? handleSubmit : handleNext}
          disabled={currentStep === 'type' && !selectedType}
          whileTap={(currentStep === 'type' && !selectedType) ? undefined : { scale: 0.98 }}
          style={{
            flex: 1,
            padding: '13px',
            backgroundColor: (currentStep === 'type' && !selectedType) ? '#ccc' : themeColors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: (currentStep === 'type' && !selectedType) ? 'not-allowed' : 'pointer'
          }}
        >
          {currentStep === 'config' ? '创建任务' : '下一步'}
        </motion.button>
      </div>
    </Popup>
  );
}

