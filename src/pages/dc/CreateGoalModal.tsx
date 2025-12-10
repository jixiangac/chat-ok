import { useState, useEffect, useMemo } from 'react';
import { Popup } from 'antd-mobile';
import type { GoalData, TaskType, Priority } from './types';
import { CycleCalculator } from './utils/cycleCalculator';

interface CreateGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goal: GoalData) => void;
  existingMainlineGoal?: boolean;
  localStorageKey?: string;
}

const POPULAR_GOALS = ['每天进步一点点', '喝水', '吃早餐', '吃水果', '早起'];

const ICONS = [
  '🐸', '🌱', '🛏️', '📚', '🥤', '🍓', '🥗',
  '⭐', '🛋️', '📖', '💿', '🥚', '😊', '🎮'
];

const TOTAL_DURATION_OPTIONS = [
  { label: '1个月', value: 30, description: '短期冲刺', icon: '🎯' },
  { label: '3个月', value: 90, description: '季度目标', icon: '📈' },
  { label: '6个月', value: 180, description: '半年计划', icon: '🎪' },
  { label: '1年', value: 365, description: '年度目标', icon: '🏆' },
  { label: '自定义', value: 0, description: '自由设置', icon: '⚙️' }
];

const CYCLE_LENGTH_OPTIONS = [
  { label: '7天', value: 7, description: '每周一循环', icon: '📅', tip: '适合高频目标' },
  { label: '10天', value: 10, description: '每旬一循环', icon: '📆', tip: '平衡频率' },
  { label: '15天', value: 15, description: '半月一循环', icon: '🗓️', tip: '适合低频目标' }
];

const MIN_CHECK_INS_PER_CYCLE = 3;

const TASK_TYPES = [
  {
    type: 'mainline' as TaskType,
    label: '🔴 主线任务',
    description: '重要且紧急',
    subtitle: '同时只能1个，100%达成',
    color: '#ff4444',
    bgColor: '#fff5f5'
  },
  {
    type: 'sidelineA' as TaskType,
    label: '🟡 支线任务A',
    description: '重要但不紧急',
    subtitle: '可多个，长期培养',
    color: '#ffaa00',
    bgColor: '#fffbf0'
  },
  {
    type: 'sidelineB' as TaskType,
    label: '🟢 支线任务B',
    description: '紧急不重要/都不重要',
    subtitle: '可多个，灵活调整',
    color: '#44bb44',
    bgColor: '#f5fff5'
  }
];

const PRIORITY_OPTIONS = [
  { value: 'high' as Priority, label: '高', color: '#ff4444' },
  { value: 'medium' as Priority, label: '中', color: '#ffaa00' },
  { value: 'low' as Priority, label: '低', color: '#44bb44' }
];

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
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
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

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>大家都在坚持</span>
              <span style={{ fontSize: '20px' }}>›</span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {POPULAR_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setGoalTitle(goal)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>写一句鼓励自己的话</span>
              <button
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                换一句
              </button>
            </div>
            <textarea
              placeholder="请输入"
              value={encouragement}
              onChange={(e) => setEncouragement(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: 'white',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                minHeight: '80px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>图标</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{selectedIcon}</span>
                <span style={{ fontSize: '20px' }}>›</span>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: selectedIcon === icon ? '#e5e5e5' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                目标总时长
              </span>
              <span style={{ fontSize: '14px', color: '#999' }}>
                {totalDays}天
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: isCustomDuration ? '12px' : '0'
            }}>
              {TOTAL_DURATION_OPTIONS.map((option) => {
                const isSelected = isCustomDuration 
                  ? option.value === 0 
                  : totalDays === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value === 0) {
                        setIsCustomDuration(true);
                      } else {
                        setTotalDays(option.value);
                        setIsCustomDuration(false);
                      }
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: isSelected ? 'black' : 'white',
                      color: isSelected ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      fontSize: '20px', 
                      marginBottom: '4px' 
                    }}>
                      {option.icon}
                    </div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      marginBottom: '2px' 
                    }}>
                      {option.label}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: 0.7 
                    }}>
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {isCustomDuration && (
              <div>
                <input
                  type="number"
                  min="7"
                  max="730"
                  value={customDaysInput}
                  onChange={(e) => {
                    setCustomDaysInput(e.target.value);
                    const days = Number(e.target.value);
                    if (days >= 7 && days <= 730) {
                      setTotalDays(days);
                    }
                  }}
                  placeholder="输入天数（7-730天）"
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
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '6px',
                  paddingLeft: '4px'
                }}>
                  💡 建议：7-730天之间
                </div>
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                周期长度
              </span>
              <span style={{ fontSize: '14px', color: '#999' }}>
                每{cycleDays}天一个周期
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {CYCLE_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCycleDays(option.value)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: cycleDays === option.value ? 'black' : 'white',
                    color: cycleDays === option.value ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>
                    {option.icon}
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '14px',
                    marginBottom: '4px' 
                  }}>
                    {option.label}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.7,
                    lineHeight: '1.3'
                  }}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
            
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>💡</span>
              <span>
                {CYCLE_LENGTH_OPTIONS.find(o => o.value === cycleDays)?.tip}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: configValidation.valid ? '#f0f7ff' : '#fff5f5',
            border: `1px solid ${configValidation.valid ? '#4a9eff' : '#ff4444'}`,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>{configValidation.valid ? '📊' : '⚠️'}</span>
              <span>周期规划预览</span>
            </div>
            
            {configValidation.valid ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#4a9eff',
                      marginBottom: '4px'
                    }}>
                      {cycleInfo.totalCycles}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      总周期数
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#ff6b6b',
                      marginBottom: '4px'
                    }}>
                      {cycleInfo.totalCheckInsNeeded}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      总打卡次数
                    </div>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: '1.8'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      width: '20px',
                      flexShrink: 0
                    }}>✅</span>
                    <span>
                      每个周期（<strong style={{ color: '#333' }}>{cycleDays}天</strong>）需打卡
                      <strong style={{ color: '#ff6b6b' }}> {MIN_CHECK_INS_PER_CYCLE}次</strong>
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      width: '20px',
                      flexShrink: 0
                    }}>📈</span>
                    <span>
                      平均每周需打卡
                      <strong style={{ color: '#4a9eff' }}> {cycleInfo.averageCheckInsPerWeek}次</strong>
                    </span>
                  </div>
                  
                  {cycleInfo.remainingDays > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: '#999',
                      fontSize: '11px'
                    }}>
                      <span style={{ 
                        width: '20px',
                        flexShrink: 0
                      }}>💡</span>
                      <span>
                        剩余<strong> {cycleInfo.remainingDays}天</strong>作为缓冲期
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                color: '#ff4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>{configValidation.message}</span>
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                开始日期
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>预计结束日期</span>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {CycleCalculator.calculateEndDate(startDate, totalDays)}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              任务类型（艾森豪威尔矩阵）
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {TASK_TYPES.map((task) => {
                const isDisabled = task.type === 'mainline' && hasMainlineGoal;
                const isSelected = taskType === task.type;
                
                return (
                  <button
                    key={task.type}
                    onClick={() => !isDisabled && setTaskType(task.type)}
                    disabled={isDisabled}
                    style={{
                      padding: '16px',
                      backgroundColor: isSelected ? task.bgColor : 'white',
                      border: isSelected ? `2px solid ${task.color}` : '1px solid #e5e5e5',
                      borderRadius: '12px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      opacity: isDisabled ? 0.5 : 1,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: isDisabled ? '#999' : '#333',
                          marginBottom: '4px'
                        }}>
                          {task.label}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#666'
                        }}>
                          {task.description}
                        </div>
                      </div>
                      {isSelected && (
                        <span style={{
                          fontSize: '18px',
                          color: task.color
                        }}>✓</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '4px'
                    }}>
                      {task.subtitle}
                    </div>
                    {isDisabled && (
                      <div style={{
                        fontSize: '11px',
                        color: '#ff4444',
                        marginTop: '6px',
                        fontWeight: '500'
                      }}>
                        ⚠️ 已存在主线任务，请先完成或降级
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {taskType !== 'mainline' && (
            <div style={{
              backgroundColor: '#f8f8f8',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                优先级
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
              }}>
                {PRIORITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value)}
                    style={{
                      padding: '12px',
                      backgroundColor: priority === option.value ? option.color : 'white',
                      color: priority === option.value ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showWarning && (
            <div style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #ff4444',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ff4444',
                  marginBottom: '4px'
                }}>
                  无法创建主线任务
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  同一时间只能有1个主线任务。请先完成或将现有主线任务降级为支线任务。
                </div>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>💡</span>
              <span>打卡规则说明</span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              <div style={{ marginBottom: '8px' }}>
                本系统采用<strong>周期打卡制</strong>，而非每日打卡：
              </div>
              <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
                • 设定长期目标的deadline（如1年）
              </div>
              <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
                • 选择周期长度（7/10/15天）
              </div>
              <div style={{ marginBottom: '6px', paddingLeft: '12px' }}>
                • 每个周期内至少打卡<strong style={{ color: '#ff6b6b' }}>3次</strong>即可完成
              </div>
              <div style={{ paddingLeft: '12px', color: '#999', fontSize: '11px', marginTop: '8px' }}>
                💡 这样既保持目标推进，又不会过于频繁造成压力
              </div>
            </div>
          </div>
      </div>

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
