import { useState, useMemo } from 'react';
import { Popup } from 'antd-mobile';
import { Target, TrendingUp, Tent, Trophy, BarChart3, ClipboardList, CheckCircle, Calendar } from 'lucide-react';
import type { MainlineTaskType, NumericDirection, CheckInUnit } from './types';
import { CycleCalculator } from './utils/cycleCalculator';

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
  { label: '10天', value: 10, description: '适合短期冲刺', recommended: '<3个月' },
  { label: '30天', value: 30, description: '适合月度计划', recommended: '≥3个月' },
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
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<Step>('cycle');
  
  // 步骤1：周期设定
  const [totalDays, setTotalDays] = useState(90);
  const [cycleDays, setCycleDays] = useState(10);
  const [customDays, setCustomDays] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
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
  const [dailyTarget, setDailyTarget] = useState('1');
  const [checkInUnit, setCheckInUnit] = useState<CheckInUnit>('TIMES');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [weekendExempt, setWeekendExempt] = useState(false);
  
  // 计算周期信息
  const cycleInfo = useMemo(() => {
    const totalCycles = Math.floor(totalDays / cycleDays);
    const remainingDays = totalDays % cycleDays;
    return {
      totalCycles,
      remainingDays
    };
  }, [totalDays, cycleDays]);
  
  // 推荐周期长度
  const recommendedCycleDays = totalDays < 90 ? 10 : 30;
  
  // 重置表单
  const resetForm = () => {
    setCurrentStep('cycle');
    setTotalDays(90);
    setCycleDays(10);
    setCustomDays('');
    setIsCustom(false);
    setSelectedType(null);
    setTaskTitle('');
    setNumericDirection('DECREASE');
    setNumericUnit('斤');
    setStartValue('');
    setTargetValue('');
    setTotalItems('10');
    setChecklistItems(['', '', '', '']);
    setDailyTarget('1');
    setCheckInUnit('TIMES');
    setAllowMultiple(false);
    setWeekendExempt(false);
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
      totalDays,
      cycleDays,
      totalCycles: cycleInfo.totalCycles,
      startDate: new Date().toISOString().split('T')[0]
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
      const target = parseInt(dailyTarget);
      if (isNaN(target) || target < 1) {
        alert('请输入有效的每日目标');
        return;
      }
      taskData.checkInConfig = {
        dailyTarget: target,
        unit: checkInUnit,
        allowMultiplePerDay: allowMultiple,
        weekendExempt: weekendExempt,
        perCycleTarget: cycleDays * target
      };
    }
    
    onSubmit(taskData);
    handleClose();
  };
  
  // 渲染步骤1：周期设定
  const renderCycleStep = () => (
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {TOTAL_DURATION_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setTotalDays(option.value);
                setIsCustom(false);
                // 自动推荐周期长度
                setCycleDays(option.value < 90 ? 10 : 30);
              }}
              style={{
                padding: '16px',
                backgroundColor: !isCustom && totalDays === option.value ? 'black' : 'white',
                color: !isCustom && totalDays === option.value ? 'white' : 'black',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <option.Icon size={24} style={{ marginBottom: '4px' }} />
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{option.label}</div>
            </button>
          ))}
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
                setCycleDays(days < 90 ? 10 : 30);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CYCLE_LENGTH_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setCycleDays(option.value)}
              style={{
                padding: '16px',
                backgroundColor: cycleDays === option.value ? 'black' : 'white',
                color: cycleDays === option.value ? 'white' : 'black',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                    {option.label}一个周期
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {option.description}
                  </div>
                </div>
                {option.value === recommendedCycleDays && (
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: cycleDays === option.value ? 'rgba(255,255,255,0.2)' : '#fff5f0',
                    color: cycleDays === option.value ? 'white' : '#ff6b6b',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    推荐
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 预览 */}
      <div style={{
        backgroundColor: '#f0f7ff',
        border: '1px solid #4a9eff',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>ℹ️</span>
          <span>预计将创建 {cycleInfo.totalCycles} 个周期</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
          • 总时长：{totalDays}天<br/>
          • 周期长度：{cycleDays}天<br/>
          • 总周期数：{cycleInfo.totalCycles}个<br/>
          {cycleInfo.remainingDays > 0 && `• 剩余：${cycleInfo.remainingDays}天（缓冲期）`}
        </div>
      </div>
    </div>
  );
  
  // 渲染步骤2：类型选择
  const renderTypeStep = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
        步骤2：选择任务类型模板
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TASK_TYPE_OPTIONS.map(option => (
          <button
            key={option.type}
            onClick={() => setSelectedType(option.type)}
            style={{
              padding: '20px',
              backgroundColor: selectedType === option.type ? '#f0f7ff' : 'white',
              border: selectedType === option.type ? '2px solid #4a9eff' : '1px solid #e5e5e5',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <option.Icon size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
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
              {selectedType === option.type && (
                <CheckCircle size={24} color="#4a9eff" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
  
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
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
            📝 任务名称
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
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
                🎯 数值目标
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setNumericDirection('INCREASE')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: numericDirection === 'INCREASE' ? 'black' : 'white',
                      color: numericDirection === 'INCREASE' ? 'white' : 'black',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    增加
                  </button>
                  <button
                    onClick={() => setNumericDirection('DECREASE')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: numericDirection === 'DECREASE' ? 'black' : 'white',
                      color: numericDirection === 'DECREASE' ? 'white' : 'black',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    减少
                  </button>
                </div>
              </div>
            </div>
            
            {/* 自动规划预览 */}
            {startValue && targetValue && (
              <div style={{
                backgroundColor: '#f0f7ff',
                border: '1px solid #4a9eff',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  📊 系统自动规划
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8' }}>
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
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
                📋 清单设定
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
                backgroundColor: '#f0f7ff',
                border: '1px solid #4a9eff',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  📊 系统自动规划
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8' }}>
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
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>
                ✅ 打卡规则
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>每日目标</div>
                <input
                  type="number"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(e.target.value)}
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
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  每天需要打卡的次数
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>打卡单位</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { value: 'TIMES', label: '次数' },
                    { value: 'DURATION', label: '时长' },
                    { value: 'QUANTITY', label: '数量' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setCheckInUnit(option.value as CheckInUnit)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: checkInUnit === option.value ? 'black' : 'white',
                        color: checkInUnit === option.value ? 'white' : 'black',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
                  高级设置（可选）
                </div>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '13px' }}>允许每日多次打卡</span>
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
              </div>
            </div>
            
            {/* 自动规划预览 */}
            {dailyTarget && (
              <div style={{
                backgroundColor: '#f0f7ff',
                border: '1px solid #4a9eff',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  📊 系统自动规划
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8' }}>
                  • 每周期目标：{cycleDays * parseInt(dailyTarget)}次打卡<br/>
                  • 预计总打卡：{totalDays * parseInt(dailyTarget)}次
                </div>
              </div>
            )}
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
            创建主线任务
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
            backgroundColor: (currentStep === 'type' && !selectedType) ? '#ccc' : 'black',
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
