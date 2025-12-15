import { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import { Popup } from 'antd-mobile';
import { Target, TrendingUp, Tent, Trophy, BarChart3, ClipboardList, CheckCircle, Calendar, FileText, Hash, ListChecks, Clock, Calculator } from 'lucide-react';
import type { MainlineTaskType, NumericDirection, CheckInUnit } from './types';
import { CycleCalculator } from './utils/cycleCalculator';
import { useTheme } from './settings/theme';

interface CreateMainlineTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

// 步骤枚举
type Step = 'cycle' | 'type' | 'config';

// 总时长选项
const TOTAL_DURATION_OPTIONS = [
  { label: '1个月', value: 30, Icon: Target },
  { label: '3个月', value: 90, Icon: TrendingUp },
  { label: '半年', value: 180, Icon: Tent },
  { label: '1年', value: 365, Icon: Trophy },
];

// 周期长度选项
const CYCLE_LENGTH_OPTIONS = [
  { label: '10天', value: 10, description: '小步快跑' },
  { label: '15天', value: 15, description: '张弛有度' },
  { label: '30天', value: 30, description: '稳扎稳打' },
];

// 任务类型选项
const TASK_TYPE_OPTIONS = [
  {
    type: 'NUMERIC' as MainlineTaskType,
    Icon: BarChart3,
    label: '数值型任务',
    description: '适合有明确数值目标',
    examples: '例如：减重、存钱、阅读',
    feature: '特点：松散打卡，记录数值'
  },
  {
    type: 'CHECKLIST' as MainlineTaskType,
    Icon: ClipboardList,
    label: '清单型任务',
    description: '适合完成一系列事项',
    examples: '例如：读书计划、技能树',
    feature: '特点：清单管理，逐项完成'
  },
  {
    type: 'CHECK_IN' as MainlineTaskType,
    Icon: CheckCircle,
    label: '打卡型任务',
    description: '适合养成每日习惯',
    examples: '例如：背单词、运动打卡',
    feature: '特点：每日打卡，强调连续'
  }
];

export default function CreateMainlineTaskModal({
  visible,
  onClose,
  onSubmit
}: CreateMainlineTaskModalProps) {
  // 任务类别（主线/支线）- 根据localStorage中是否存在未归档的主线任务自动判断
  const [taskCategory, setTaskCategory] = useState<'MAINLINE' | 'SIDELINE'>('MAINLINE');
  
  const { themeColors } = useTheme();
  
  // 每次弹窗打开时，从localStorage判断应该创建主线还是支线任务
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
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<Step>('cycle');
  
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
  const [allowMultiple, setAllowMultiple] = useState(true); // 默认允许多轮打卡
  const [weekendExempt, setWeekendExempt] = useState(false);
  
  // 次数型打卡配置
  const [dailyMaxTimes, setDailyMaxTimes] = useState('1'); // 单日打卡次数上限
  const [cycleTargetTimes, setCycleTargetTimes] = useState(''); // 周期总次数目标
  
  // 时长型打卡配置
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState('15'); // 单日目标时长
  const [cycleTargetMinutes, setCycleTargetMinutes] = useState(''); // 周期总时长目标
  
  // 数值型打卡配置
  const [dailyTargetValue, setDailyTargetValue] = useState(''); // 单日目标数值
  const [cycleTargetValue, setCycleTargetValue] = useState(''); // 周期总目标数值
  const [valueUnit, setValueUnit] = useState('个'); // 数值单位
  
  // 计算周期信息
  const cycleInfo = useMemo(() => {
    const totalCycles = Math.floor(totalDays / cycleDays);
    const remainingDays = totalDays % cycleDays;
    return {
      totalCycles,
      remainingDays
    };
  }, [totalDays, cycleDays]);
  
  // 推荐周期长度：只有1年(365天)时推荐30天，其他都推荐10天
  const recommendedCycleDays = totalDays >= 365 ? 30 : 10;
  
  // 重置表单
  const resetForm = () => {
    setCurrentStep('cycle');
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
    if (currentStep === 'cycle') {
      setCurrentStep('type');
    } else if (currentStep === 'type' && selectedType) {
      setCurrentStep('config');
    }
  };
  
  const handleBack = () => {
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
      taskCategory, // 主线或支线
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
      // 根据打卡类型构建配置
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
        // 次数型打卡
        const maxTimes = parseInt(dailyMaxTimes) || 1;
        const defaultCycleTarget = cycleDays * maxTimes;
        const cycleTarget = cycleTargetTimes ? parseInt(cycleTargetTimes) : defaultCycleTarget;
        
        checkInConfig.dailyMaxTimes = maxTimes;
        checkInConfig.cycleTargetTimes = cycleTarget;
        checkInConfig.perCycleTarget = cycleTarget;
      } else if (checkInUnit === 'DURATION') {
        // 时长型打卡
        const dailyMinutes = parseInt(dailyTargetMinutes) || 15;
        const defaultCycleMinutes = cycleDays * dailyMinutes;
        const cycleMinutes = cycleTargetMinutes ? parseInt(cycleTargetMinutes) : defaultCycleMinutes;
        
        checkInConfig.dailyTargetMinutes = dailyMinutes;
        checkInConfig.cycleTargetMinutes = cycleMinutes;
        checkInConfig.quickDurations = [5, 10, 15];
        checkInConfig.perCycleTarget = cycleMinutes;
      } else if (checkInUnit === 'QUANTITY') {
        // 数值型打卡
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
  
  // 总时长选择的 refs 和高亮状态
  const durationRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [durationHighlight, setDurationHighlight] = useState({ top: 0, left: 0, height: 0, width: 0 });
  
  // 增减方向选择的 refs 和高亮状态
  const directionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [directionHighlight, setDirectionHighlight] = useState({ top: 0, left: 0, height: 0, width: 0 });
  
  // 打卡类型选择的 refs 和高亮状态
  const checkInTypeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [checkInTypeHighlight, setCheckInTypeHighlight] = useState({ top: 0, left: 0, height: 0, width: 0 });
  
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
  
  // 周期长度选择的 refs 和高亮状态
  const cycleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [cycleHighlight, setCycleHighlight] = useState({ top: 0, left: 0, height: 0, width: 0 });
  
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
  
  // 计算增减方向高亮框位置
  useEffect(() => {
    const directionOptions = ['INCREASE', 'DECREASE'];
    const selectedIndex = directionOptions.findIndex(opt => opt === numericDirection);
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
  }, [numericDirection, currentStep]);
  
  // 计算打卡类型高亮框位置
  useEffect(() => {
    const checkInTypeOptions = ['TIMES', 'DURATION', 'QUANTITY'];
    const selectedIndex = checkInTypeOptions.findIndex(opt => opt === checkInUnit);
    if (selectedIndex >= 0 && checkInTypeRefs.current[selectedIndex]) {
      const card = checkInTypeRefs.current[selectedIndex];
      if (card) {
        setCheckInTypeHighlight({
          top: card.offsetTop,
          left: card.offsetLeft,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [checkInUnit, currentStep]);
  
  // 渲染步骤1：周期设定
  const renderCycleStep = () => {
    const selectedDurationIndex = isCustom ? -1 : TOTAL_DURATION_OPTIONS.findIndex(opt => opt.value === totalDays);
    
    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
          步骤1：周期设定
        </h2>
        
        {/* 总时长 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
            <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} /> 设定总时长
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
            我想用多久完成这个目标？
          </div>
          <div style={{ 
            position: 'relative',
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px', 
            marginBottom: '12px' 
          }}>
            {TOTAL_DURATION_OPTIONS.map((option, index) => {
              const isSelected = !isCustom && totalDays === option.value;
              return (
                <button
                  key={option.value}
                  ref={el => durationRefs.current[index] = el}
                  onClick={() => {
                    setTotalDays(option.value);
                    setIsCustom(false);
                    setCustomDays('');
                    setCycleDays(option.value === 365 ? 30 : 10);
                  }}
                  style={{
                    width: '100%',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <option.Icon size={24} />
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{option.label}</div>
                  </div>
                </button>
              );
            })}
            
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
      
      {/* 周期长度 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
          <Target size={16} style={{ display: 'inline', marginRight: '6px' }} /> 选择周期长度
        </div>
        <div style={{ 
          position: 'relative',
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px',
          marginBottom: '12px'
        }}>
          {CYCLE_LENGTH_OPTIONS.map((option, index) => {
            const isSelected = !isCustomCycle && cycleDays === option.value;
            // 1个月(30天)时禁止选择30天周期
            const isDisabled = totalDays === 30 && option.value === 30;
            return (
              <button
                key={option.value}
                ref={el => cycleRefs.current[index] = el}
                onClick={() => {
                  if (isDisabled) return;
                  setCycleDays(option.value);
                  setIsCustomCycle(false);
                  setCustomCycleDays('');
                }}
                disabled={isDisabled}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  border: '2px solid #9ca3af',
                  padding: '16px 8px',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  opacity: isDisabled ? 0.4 : 1
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                  {option.label}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {option.description}
                </div>
              </button>
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
              // 允许清空输入
              if (value === '') {
                setCustomCycleDays('');
                return;
              }
              const days = parseInt(value);
              // 限制在5-30之间
              if (days < 5) {
                setCustomCycleDays('5');
                setCycleDays(5);
                setIsCustomCycle(true);
              } else if (days > 30) {
                setCustomCycleDays('30');
                setCycleDays(30);
                setIsCustomCycle(true);
              } else {
                setCustomCycleDays(value);
                setCycleDays(days);
                setIsCustomCycle(true);
              }
            }}
            placeholder="5-30"
            min={5}
            max={30}
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
      
      {/* 预览 */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#37352f' }}>
          预计将创建 {cycleInfo.totalCycles} 个周期
        </div>
        <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
          <div>总时长：{totalDays}天</div>
          <div>周期长度：{cycleDays}天</div>
          <div>总周期数：{cycleInfo.totalCycles}个</div>
          {cycleInfo.remainingDays > 0 && <div>剩余：{cycleInfo.remainingDays}天（缓冲期）</div>}
        </div>
      </div>
      
      {/* 起始时间 */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
          <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} /> 设定起始时间
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={dayjs().subtract(7, 'day').format('YYYY-MM-DD')}
          max={dayjs().add(1, 'month').format('YYYY-MM-DD')}
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
        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          可选择过去1周内或未来1个月内的日期
        </div>
      </div>
    </div>
    );
  };
  
  // 渲染步骤2：类型选择
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState({ top: 0, height: 0, width: 0 });
  
  // 计算高亮框位置
  useEffect(() => {
    const selectedIndex = TASK_TYPE_OPTIONS.findIndex(opt => opt.type === selectedType);
    if (selectedIndex >= 0 && cardRefs.current[selectedIndex]) {
      const card = cardRefs.current[selectedIndex];
      if (card) {
        setHighlightStyle({
          top: card.offsetTop,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [selectedType]);
  
  const renderTypeStep = () => {
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
  };
  
  // 渲染步骤3：具体配置
  const renderConfigStep = () => {
    if (!selectedType) return null;
    
    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
          步骤3：{TASK_TYPE_OPTIONS.find(t => t.type === selectedType)?.label}设定
        </h2>
        
        {/* 任务名称 */}
        <div style={{ marginBottom: '20px' }}>
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
        
        {/* 数值型配置 */}
        {selectedType === 'NUMERIC' && (
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
                  {[
                    { value: 'INCREASE' as NumericDirection, label: '增加' },
                    { value: 'DECREASE' as NumericDirection, label: '减少' }
                  ].map((option, index) => {
                    const isSelected = numericDirection === option.value;
                    return (
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
                    );
                  })}
                  
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
        )}
        
        {/* 清单型配置 */}
        {selectedType === 'CHECKLIST' && (
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
        )}
        
        {/* 打卡型配置 */}
        {selectedType === 'CHECK_IN' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> 选择打卡类型
              </div>
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { value: 'TIMES', label: '次数型', desc: '记录打卡次数' },
                  { value: 'DURATION', label: '时长型', desc: '记录时长' },
                  { value: 'QUANTITY', label: '数值型', desc: '记录数值' }
                ].map((option, index) => {
                  const isSelected = checkInUnit === option.value;
                  return (
                    <button
                      key={option.value}
                      ref={el => checkInTypeRefs.current[index] = el}
                      onClick={() => setCheckInUnit(option.value as CheckInUnit)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid #9ca3af',
                        padding: '16px 8px',
                        borderRadius: '16px',
                        backgroundColor: 'white',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {option.desc}
                      </div>
                    </button>
                  );
                })}
                
                {/* 选中高亮边框 */}
                <div style={{
                  width: `${checkInTypeHighlight.width}px`,
                  height: `${checkInTypeHighlight.height}px`,
                  position: 'absolute',
                  top: `${checkInTypeHighlight.top}px`,
                  left: `${checkInTypeHighlight.left}px`,
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  transition: 'top 0.3s, left 0.3s, height 0.3s, width 0.3s',
                  opacity: 1,
                  boxShadow: 'inset 0 0 0 3px #000'
                }} />
              </div>
              
              {/* 次数型打卡配置 */}
              {checkInUnit === 'TIMES' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Hash size={14} /> 次数型打卡设置
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日打卡上限</div>
                      <input
                        type="number"
                        value={dailyMaxTimes}
                        onChange={(e) => setDailyMaxTimes(e.target.value)}
                        placeholder="1"
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
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总次数目标</div>
                      <input
                        type="number"
                        value={cycleTargetTimes}
                        onChange={(e) => setCycleTargetTimes(e.target.value)}
                        placeholder={`${cycleDays * (parseInt(dailyMaxTimes) || 1)}`}
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
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    默认周期目标 = 天数 × 单日上限 = {cycleDays * (parseInt(dailyMaxTimes) || 1)} 次
                  </div>
                </div>
              )}
              
              {/* 时长型打卡配置 */}
              {checkInUnit === 'DURATION' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> 时长型打卡设置
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日目标时长(分钟)</div>
                      <input
                        type="number"
                        value={dailyTargetMinutes}
                        onChange={(e) => setDailyTargetMinutes(e.target.value)}
                        placeholder="15"
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
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总时长目标(分钟)</div>
                      <input
                        type="number"
                        value={cycleTargetMinutes}
                        onChange={(e) => setCycleTargetMinutes(e.target.value)}
                        placeholder={`${cycleDays * (parseInt(dailyTargetMinutes) || 15)}`}
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
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    打卡时可选择 5/10/15 分钟或自定义时长
                  </div>
                </div>
              )}
              
              {/* 数值型打卡配置 */}
              {checkInUnit === 'QUANTITY' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calculator size={14} /> 数值型打卡设置
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日目标数值</div>
                      <input
                        type="number"
                        value={dailyTargetValue}
                        onChange={(e) => setDailyTargetValue(e.target.value)}
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
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>数值单位</div>
                      <input
                        type="text"
                        value={valueUnit}
                        onChange={(e) => setValueUnit(e.target.value)}
                        placeholder="个"
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
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总目标数值</div>
                    <input
                      type="number"
                      value={cycleTargetValue}
                      onChange={(e) => setCycleTargetValue(e.target.value)}
                      placeholder={`${cycleDays * (parseFloat(dailyTargetValue) || 0)}`}
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
              )}
              
              {/* 高级设置 */}
              {/* <div style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
                  高级设置
                </div>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '13px' }}>允许每日多轮打卡</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={weekendExempt}
                    onChange={(e) => setWeekendExempt(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '13px' }}>周末豁免（周末不计入）</span>
                </label>
              </div> */}
            </div>
            
            {/* 自动规划预览 */}
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
                {checkInUnit === 'TIMES' && (
                  <>
                    • 单日打卡上限：{parseInt(dailyMaxTimes) || 1} 次<br/>
                    • 每周期目标：{cycleTargetTimes || (cycleDays * (parseInt(dailyMaxTimes) || 1))} 次<br/>
                    • 预计总打卡：{cycleInfo.totalCycles * (parseInt(cycleTargetTimes) || (cycleDays * (parseInt(dailyMaxTimes) || 1)))} 次
                  </>
                )}
                {checkInUnit === 'DURATION' && (
                  <>
                    • 单日目标时长：{parseInt(dailyTargetMinutes) || 15} 分钟<br/>
                    • 每周期目标：{cycleTargetMinutes || (cycleDays * (parseInt(dailyTargetMinutes) || 15))} 分钟<br/>
                    • 预计总时长：{cycleInfo.totalCycles * (parseInt(cycleTargetMinutes) || (cycleDays * (parseInt(dailyTargetMinutes) || 15)))} 分钟
                  </>
                )}
                {checkInUnit === 'QUANTITY' && dailyTargetValue && (
                  <>
                    • 单日目标：{parseFloat(dailyTargetValue)} {valueUnit}<br/>
                    • 每周期目标：{cycleTargetValue || (cycleDays * parseFloat(dailyTargetValue))} {valueUnit}<br/>
                    • 预计总目标：{cycleInfo.totalCycles * (parseFloat(cycleTargetValue) || (cycleDays * parseFloat(dailyTargetValue)))} {valueUnit}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
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
        background: '#ffffff'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            创建{taskCategory === 'MAINLINE' ? '主线' : '支线'}任务
          </h2>
          <button
            onClick={handleClose}
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
          </button>
        </div>
        
        {/* 步骤指示器 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {['cycle', 'type', 'config'].map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep === step || (
                  (step === 'type' && currentStep === 'config') ||
                  (step === 'cycle' && (currentStep === 'type' || currentStep === 'config'))
                ) ? 'black' : '#e5e5e5',
                color: currentStep === step || (
                  (step === 'type' && currentStep === 'config') ||
                  (step === 'cycle' && (currentStep === 'type' || currentStep === 'config'))
                ) ? 'white' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {index + 1}
              </div>
              {index < 2 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: (
                    (step === 'cycle' && (currentStep === 'type' || currentStep === 'config'))
                  ) ? 'black' : '#e5e5e5',
                  marginLeft: '8px'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div style={{ paddingBottom: '80px' }}>
        {currentStep === 'cycle' && renderCycleStep()}
        {currentStep === 'type' && renderTypeStep()}
        {currentStep === 'config' && renderConfigStep()}
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0',
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        gap: '12px'
      }}>
        {currentStep !== 'cycle' && (
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: '14px',
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
          </button>
        )}
        <button
          onClick={currentStep === 'config' ? handleSubmit : handleNext}
          disabled={currentStep === 'type' && !selectedType}
          style={{
            flex: 1,
            padding: '14px',
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
        </button>
      </div>
    </Popup>
  );
}
