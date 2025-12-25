import dayjs from 'dayjs';
import { Task, PreviousCycleDebtSnapshot } from '../types';
import styles from '../css/MainlineTaskCard.module.css';
import { 
  calculateRemainingDays, 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  isTodayCheckedIn,
  calculateCurrentCycleNumber
} from '../utils/mainlineTaskHelper';

interface MainlineTaskCardProps {
  task: Task;
  onClick?: () => void;
}

// 完成度图片配置
const COMPLETION_IMAGES = {
  perfect: 'https://img.alicdn.com/imgextra/i4/O1CN01F6mnTB1EYIsoD561E_!!6000000000363-2-tps-1546-1128.png',
  excellent: 'https://img.alicdn.com/imgextra/i1/O1CN01NYxRqC1IVnARBv0Fg_!!6000000000899-2-tps-820-810.png',
  good: 'https://img.alicdn.com/imgextra/i2/O1CN01lbaPb71byAPZUhGyr_!!6000000003533-2-tps-1409-1248.png',
  nook: 'https://img.alicdn.com/imgextra/i2/O1CN01If1G3b1MgYx39T1Hf_!!6000000001464-2-tps-1389-1229.png',
  fair: 'https://img.alicdn.com/imgextra/i1/O1CN01SRiffz1vcuLIJzIIk_!!6000000006194-2-tps-1456-1285.png',
  poor: 'https://img.alicdn.com/imgextra/i2/O1CN01x4uEXd21IC7oS7CLR_!!6000000006961-2-tps-1494-1322.png',
  bad: 'https://img.alicdn.com/imgextra/i4/O1CN01NC5Fmh1rQIysmewqD_!!6000000005625-2-tps-928-845.png',
  terrible: 'https://img.alicdn.com/imgextra/i2/O1CN01BA0NSS247boF4jf09_!!6000000007344-2-tps-1056-992.png',
};

// 根据完成度获取图片
const getCompletionImage = (completionRate: number): string => {
  if (completionRate >= 100) return COMPLETION_IMAGES.perfect;
  if (completionRate >= 80) return COMPLETION_IMAGES.excellent;
  if (completionRate >= 70) return COMPLETION_IMAGES.good;
  if (completionRate >= 50) return COMPLETION_IMAGES.nook;
  if (completionRate >= 40) return COMPLETION_IMAGES.fair;
  if (completionRate >= 30) return COMPLETION_IMAGES.poor;
  if (completionRate >= 5) return COMPLETION_IMAGES.bad;
  return COMPLETION_IMAGES.terrible;
};

// 根据完成度获取评价文案
const getCompletionText = (completionRate: number): string => {
  if (completionRate >= 100) return '完美完成！';
  if (completionRate >= 80) return '表现优秀！';
  if (completionRate >= 70) return '做得不错！';
  if (completionRate >= 50) return '还可以';
  if (completionRate >= 40) return '需要加油';
  if (completionRate >= 30) return '有待提高';
  if (completionRate >= 5) return '还需努力';
  return '下次加油';
};

// 截止时间颜色配置
const DEADLINE_COLORS = {
  urgent: '#5c0011',      // 乌梅红 - 0天（今天截止）
  warning: '#c41d7f',     // 玫瑰红 - 剩余1/3周期
  caution: '#d48806',     // 烟黄 - 剩余2/3周期
  normal: 'rgba(55, 53, 47, 0.5)'  // 默认灰色
};

// 根据剩余天数和周期天数获取截止时间颜色
// 只有在剩余天数 ≤ 1/3 周期天数时才开始变色，在这个范围内按3个阶段依次变色
// 如果周期完成率小于50%，从1/2时间开始变色
const getDeadlineColor = (remainingDays: number, cycleDays: number, cycleProgress: number): string => {
  // 根据周期完成率决定变色起始点
  // 完成率 < 50%：从剩余 1/2 周期开始变色
  // 完成率 >= 50%：从剩余 1/3 周期开始变色
  const startThreshold = cycleProgress < 50 ? cycleDays / 2 : cycleDays / 3;
  
  // 如果剩余天数 > 变色起始点，使用默认颜色
  if (remainingDays > startThreshold) return DEADLINE_COLORS.normal;
  
  // 在变色范围内，按3个阶段变色
  if (remainingDays <= 0) return DEADLINE_COLORS.urgent;
  if (remainingDays <= startThreshold / 3) return DEADLINE_COLORS.warning;
  if (remainingDays <= (startThreshold * 2) / 3) return DEADLINE_COLORS.caution;
  
  return DEADLINE_COLORS.normal;
};

// 获取截止时间文案
const getDeadlineText = (remainingDays: number): string => {
  if (remainingDays <= 0) return '今天截止';
  if (remainingDays === 1) return '明天截止';
  return `${remainingDays}天后截止`;
};

export default function MainlineTaskCard({ task, onClick }: MainlineTaskCardProps) {
  const remainingDays = calculateRemainingDays(task);
  
  // 计算当前周期（基于cycleSnapshots，与详情页逻辑一致）
  const currentCycleNumber = calculateCurrentCycleNumber(task);

  // 获取周期天数用于计算颜色
  const cycleDays = task.cycleDays || 7;
  
  // 计算周期起始值和是否需要补上一周期欠账
  const getCycleInfo = (): { 
    cycleStartValue: number | undefined; 
    hasPreviousCycleDebt: boolean;
    previousCycleTarget: number | undefined;
    debtCycleNumber: number | undefined;
  } => {
    if (!task.mainlineTask?.numericConfig) {
      return { cycleStartValue: undefined, hasPreviousCycleDebt: false, previousCycleTarget: undefined, debtCycleNumber: undefined };
    }
    
    const config = task.mainlineTask.numericConfig;
    const cycleSnapshots = (task as any).cycleSnapshots || [];
    const isDecrease = config.targetValue < (config.originalStartValue ?? config.startValue);
    
    // 默认值
    let cycleStartValue = config.startValue;
    let hasPreviousCycleDebt = false;
    let previousCycleTarget: number | undefined = undefined;
    let debtCycleNumber: number | undefined = undefined;
    
    // 如果有快照数据
    if (cycleSnapshots.length > 0) {
      const lastSnapshot = cycleSnapshots[cycleSnapshots.length - 1];
      if (lastSnapshot.actualValue !== undefined) {
        cycleStartValue = lastSnapshot.actualValue;
        
        // 检查上一周期是否完成（completionRate < 100）
        if (lastSnapshot.completionRate !== undefined && lastSnapshot.completionRate < 100) {
          // 直接从快照中获取上一周期的目标值
          if (lastSnapshot.targetValue !== undefined) {
            const lastTarget = Math.round(lastSnapshot.targetValue * 100) / 100;
            
            // 检查当前值是否已达到上一周期目标
            const currentValue = config.currentValue;
            let reachedLastTarget = false;
            if (isDecrease) {
              reachedLastTarget = currentValue <= lastTarget;
            } else {
              reachedLastTarget = currentValue >= lastTarget;
            }
            
            if (!reachedLastTarget) {
              // 当前值未达到上一周期目标，显示上一周期欠账
              hasPreviousCycleDebt = true;
              previousCycleTarget = lastTarget;
              debtCycleNumber = lastSnapshot.cycleNumber;
            } else if (cycleSnapshots.length > 1) {
              // 当前值已达到上一周期目标，检查上上周期
              const prevPrevSnapshot = cycleSnapshots[cycleSnapshots.length - 2];
              if (prevPrevSnapshot.completionRate !== undefined && prevPrevSnapshot.completionRate < 100) {
                if (prevPrevSnapshot.targetValue !== undefined) {
                  const prevPrevTarget = Math.round(prevPrevSnapshot.targetValue * 100) / 100;
                  
                  // 检查当前值是否已达到上上周期目标
                  let reachedPrevPrevTarget = false;
                  if (isDecrease) {
                    reachedPrevPrevTarget = currentValue <= prevPrevTarget;
                  } else {
                    reachedPrevPrevTarget = currentValue >= prevPrevTarget;
                  }
                  
                  if (!reachedPrevPrevTarget) {
                    // 当前值未达到上上周期目标，显示上上周期欠账
                    hasPreviousCycleDebt = true;
                    previousCycleTarget = prevPrevTarget;
                    debtCycleNumber = prevPrevSnapshot.cycleNumber;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return { cycleStartValue, hasPreviousCycleDebt, previousCycleTarget, debtCycleNumber };
  };
  
  const { cycleStartValue, hasPreviousCycleDebt, previousCycleTarget, debtCycleNumber } = getCycleInfo();
  
  // 获取已保存的欠账快照
  const savedDebtSnapshot = (task as any).previousCycleDebtSnapshot as PreviousCycleDebtSnapshot | undefined;
  
  // 判断是否有欠账快照数据（需要有 debtCycleSnapshot 且周期编号匹配）
  const hasDebtSnapshot = savedDebtSnapshot?.debtCycleSnapshot !== undefined && savedDebtSnapshot?.currentCycleNumber === currentCycleNumber;
  
  // 获取欠账显示的配色（使用快照中保存的配色）
  const debtColors = hasDebtSnapshot && savedDebtSnapshot
    ? { bgColor: savedDebtSnapshot.bgColor, progressColor: savedDebtSnapshot.progressColor, borderColor: savedDebtSnapshot.borderColor }
    : { bgColor: 'rgba(246, 239, 239, 0.6)', progressColor: 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)', borderColor: '#E0CEC6' };
  
  // 判断是否显示上一周期欠账
  // 优先使用已保存的快照数据，如果没有则实时计算
  const getDebtDisplayInfo = (): { showDebt: boolean; debtTarget: number | undefined } => {
    // 如果有已保存的快照且有 debtCycleSnapshot，直接使用
    if (hasDebtSnapshot && savedDebtSnapshot) {
      return { showDebt: true, debtTarget: savedDebtSnapshot.targetValue };
    }
    
    // 否则实时计算
    if (!hasPreviousCycleDebt || !task.mainlineTask?.numericConfig) return { showDebt: false, debtTarget: undefined };
    if (previousCycleTarget === undefined) return { showDebt: false, debtTarget: undefined };
    
    // 计算当前周期进度
    const progressData = calculateNumericProgress(task.mainlineTask, {
      currentCycleNumber,
      cycleStartValue
    });
    
    // 如果当期已完成（>=100%）且剩余时间 > 1/2 周期，显示上一周期欠账
    const shouldShow = progressData.cycleProgress >= 100 && remainingDays > cycleDays / 2;
    return { showDebt: shouldShow, debtTarget: shouldShow ? previousCycleTarget : undefined };
  };
  
  const debtDisplayInfo = getDebtDisplayInfo();
  const showPreviousCycleDebt = debtDisplayInfo.showDebt;
  const displayDebtTarget = debtDisplayInfo.debtTarget;
  
  // 计算周期完成率
  const getCycleProgress = (): number => {
    if (!task.mainlineTask) return 0;
    switch (task.mainlineType) {
      case 'NUMERIC':
        return calculateNumericProgress(task.mainlineTask, {
          currentCycleNumber,
          cycleStartValue
        }).cycleProgress;
      case 'CHECKLIST':
        return calculateChecklistProgress(task.mainlineTask).cycleProgress;
      case 'CHECK_IN':
        return calculateCheckInProgress(task.mainlineTask).cycleProgress;
      default:
        return 0;
    }
  };
  const cycleProgress = getCycleProgress();
  const deadlineColor = getDeadlineColor(remainingDays, cycleDays, cycleProgress);
  const deadlineText = getDeadlineText(remainingDays);
  // 检查任务是否已完成（检查task.status、mainlineTask.status、时间或cycleSnapshots）
  const isPlanEnded = (() => {
    // 基于status判断
    if ((task as any).status === 'completed') return true;
    if ((task.mainlineTask?.status as string) === 'COMPLETED') return true;
    if ((task.mainlineTask?.status as string) === 'completed') return true;
    
    // 基于时间判断
    if (task.startDate && task.cycleDays && task.totalCycles) {
      const start = dayjs(task.startDate);
      const planEndDate = start.add(task.totalCycles * task.cycleDays - 1, 'day');
      if (dayjs().isAfter(planEndDate)) return true;
    }
    
    // 基于cycleSnapshots数量判断
    const cycleSnapshots = (task as any).cycleSnapshots || [];
    if (task.totalCycles && cycleSnapshots.length >= task.totalCycles) return true;
    
    return false;
  })();
  
  const isCompleted = isPlanEnded;

  // 根据任务类型渲染不同的内容
  const renderContent = () => {
    // 如果任务已完成，显示结算卡片
    if (isCompleted) {
      return renderCompletedContent();
    }
    
    if (!task.mainlineType || !task.mainlineTask) {
      // 兼容旧版本
      return renderLegacyContent();
    }

    switch (task.mainlineType) {
      case 'NUMERIC':
        return renderNumericContent();
      case 'CHECKLIST':
        return renderChecklistContent();
      case 'CHECK_IN':
        return renderCheckInContent();
      default:
        return renderLegacyContent();
    }
  };
  
  // 已完成任务的结算卡片（参考详情页完结总结样式）
  const renderCompletedContent = () => {
    const mainlineTask = task.mainlineTask;
    
    // 计算最终完成度和结算数据
    let completionRate = 0;
    let originalStart = 0;
    let targetValue = 0;
    let finalValue = 0;
    let unit = '';
    let isSuccess = false;
    
    if (mainlineTask?.numericConfig) {
      const config = mainlineTask.numericConfig;
      originalStart = config.originalStartValue ?? config.startValue;
      targetValue = config.targetValue;
      finalValue = config.currentValue;
      unit = config.unit;
      const totalChange = Math.abs(targetValue - originalStart);
      const isDecrease = config.direction === 'DECREASE';
      const rawChange = finalValue - originalStart;
      const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
      completionRate = totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;
      isSuccess = isDecrease ? finalValue <= targetValue : finalValue >= targetValue;
    } else if (mainlineTask?.checklistConfig) {
      const config = mainlineTask.checklistConfig;
      completionRate = config.totalItems > 0 ? Math.round((config.completedItems / config.totalItems) * 100) : 0;
      finalValue = config.completedItems;
      targetValue = config.totalItems;
      unit = '项';
      isSuccess = completionRate >= 100;
    } else if (mainlineTask?.checkInConfig) {
      const config = mainlineTask.checkInConfig;
      const cycleConfig = mainlineTask.cycleConfig;
      const totalTarget = cycleConfig.totalCycles * config.perCycleTarget;
      const totalCheckIns = config.records?.filter(r => r.checked).length || 0;
      completionRate = totalTarget > 0 ? Math.min(100, Math.round((totalCheckIns / totalTarget) * 100)) : 0;
      finalValue = totalCheckIns;
      targetValue = totalTarget;
      unit = '次';
      isSuccess = completionRate >= 100;
    }
    
    return (
      <>
        {/* 标题和完成标记 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', lineHeight: '1' }}>{isSuccess ? '✓' : '—'}</span>
            <h3 style={{ 
              fontSize: '15px', 
              fontWeight: '500', 
              margin: 0,
              color: 'rgb(55, 53, 47)',
              lineHeight: '1.4'
            }}>
              {task.title}
            </h3>
          </div>
          <span style={{ 
            fontSize: '11px',
            color: 'rgba(55, 53, 47, 0.5)',
            backgroundColor: 'rgba(55, 53, 47, 0.06)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: '500'
          }}>
            已完结
          </span>
        </div>

        {/* 结算对比 */}
        <div style={{ 
          display: 'flex',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {/* 初始计划 */}
          <div style={{ 
            flex: 1,
            padding: '10px 12px',
            backgroundColor: 'rgba(55, 53, 47, 0.04)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(55, 53, 47, 0.5)', marginBottom: '4px' }}>初始计划</div>
            <div style={{ fontSize: '14px', color: 'rgb(55, 53, 47)', fontWeight: '500' }}>
              {mainlineTask?.numericConfig 
                ? `${originalStart} → ${targetValue}${unit}`
                : `${targetValue}${unit}`
              }
            </div>
          </div>
          
          {/* 最终结算 */}
          <div style={{ 
            flex: 1,
            padding: '10px 12px',
            backgroundColor: 'rgba(55, 53, 47, 0.04)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(55, 53, 47, 0.5)', marginBottom: '4px' }}>最终结算</div>
            <div style={{ fontSize: '14px', color: 'rgb(55, 53, 47)', fontWeight: '500' }}>
              {finalValue}{unit}
            </div>
          </div>
        </div>

        {/* 底部统计 */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(55, 53, 47, 0.06)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: 'rgb(55, 53, 47)' }}>
              {task.totalCycles}/{task.totalCycles}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(55, 53, 47, 0.5)' }}>完成周期</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: 'rgb(55, 53, 47)' }}>
              {completionRate}%
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(55, 53, 47, 0.5)' }}>完成率</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: 'rgb(55, 53, 47)' }}>
              {isSuccess ? '达成' : '未达成'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(55, 53, 47, 0.5)' }}>目标状态</div>
          </div>
        </div>
      </>
    );
  };

  // 数值型任务卡片
  const renderNumericContent = () => {
    const mainlineTask = task.mainlineTask;
    if (!mainlineTask?.numericConfig) return renderLegacyContent();

    const { numericConfig, cycleConfig } = mainlineTask;
    const { unit } = numericConfig;
    
    // 计算进度（如果需要显示上一周期欠账，使用上一周期目标）
    let progressData = calculateNumericProgress(mainlineTask, {
      currentCycleNumber,
      cycleStartValue
    });
    
    // 如果需要显示上一周期欠账，重新计算进度
    let displayTarget = progressData.currentCycleTarget;
    let displayProgress = progressData.cycleProgress;
    let debtPerCycleTarget = numericConfig.perCycleTarget || 0;
    
    // 欠账模式下使用副本中的起始值和目标值
    let displayCycleStart = progressData.currentCycleStart;
    let displayCycleTarget = progressData.currentCycleTarget;
    
    if (showPreviousCycleDebt && savedDebtSnapshot?.debtCycleSnapshot) {
      // 使用副本中保存的起始值
      displayCycleStart = savedDebtSnapshot.debtCycleSnapshot.startValue;
    }
    
    if (showPreviousCycleDebt && displayDebtTarget !== undefined) {
      // 欠账模式下，进度基于从起始值到欠账目标值的变化量来计算
      // 计算从起始值到欠账目标值需要的变化量
      const targetChange = Math.abs(displayDebtTarget - (cycleStartValue || numericConfig.startValue));
      
      const isDecrease = numericConfig.targetValue < (numericConfig.originalStartValue ?? numericConfig.startValue);
      const rawCycleChange = numericConfig.currentValue - (cycleStartValue || numericConfig.startValue);
      const effectiveCycleChange = isDecrease ? Math.max(0, -rawCycleChange) : Math.max(0, rawCycleChange);
      
      // 基于欠账目标计算进度
      displayProgress = targetChange > 0 ? Math.min(100, Math.round((effectiveCycleChange / targetChange) * 100)) : 100;
      
      // 使用副本中的目标值
      displayCycleTarget = displayDebtTarget;
    }
    return (
      <>
        {/* 标题和周期信息 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '14px', lineHeight: '1', fontWeight: '600' }}>●</span>
            <h3 style={{ 
              fontSize: '15px', 
              fontWeight: '500', 
              margin: 0,
              color: 'rgb(55, 53, 47)',
              lineHeight: '1.4'
            }}>
              {task.title}
            </h3>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <span style={{ 
              fontSize: '12px',
              color: deadlineColor,
              fontWeight: '400'
            }}>
              {deadlineText}
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {currentCycleNumber}/{cycleConfig.totalCycles}
            </span>
          </div>
        </div>

        {/* 本周期进度 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px' 
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(55, 53, 47, 0.65)' }}>
              本周期 · {progressData.currentCycleStart}{unit} → {progressData.currentCycleTarget}{unit}
              {showPreviousCycleDebt && displayDebtTarget !== undefined && (
                <span style={{ marginLeft: '4px', fontWeight: '500' }}>
                  ({Math.round(displayDebtTarget * 100) / 100}{unit})
                </span>
              )}
            </span>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '500',
              color: 'rgb(55, 53, 47)'
            }}>
              {showPreviousCycleDebt ? displayProgress : progressData.cycleProgress}%
            </span>
          </div>
          
          <div style={{ 
            height: '4px',
            backgroundColor: showPreviousCycleDebt ? debtColors.bgColor : 'rgba(55, 53, 47, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${showPreviousCycleDebt ? displayProgress : progressData.cycleProgress}%`,
              height: '100%',
              background: showPreviousCycleDebt ? debtColors.progressColor : 'rgb(55, 53, 47)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* 总目标 */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(55, 53, 47, 0.06)'
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
            总进度 · {numericConfig.originalStartValue ?? numericConfig.startValue}{unit} → {numericConfig.targetValue}{unit}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '48px',
              height: '3px',
              backgroundColor: 'rgba(55, 53, 47, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progressData.totalProgress}%`,
                height: '100%',
                backgroundColor: 'rgba(55, 53, 47, 0.35)',
                borderRadius: '2px'
              }}></div>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
              {progressData.totalProgress}%
            </span>
          </div>
        </div>
      </>
    );
  };

  // 清单型任务卡片
  const renderChecklistContent = () => {
    const mainlineTask = task.mainlineTask;
    if (!mainlineTask?.checklistConfig) return renderLegacyContent();

    const { checklistConfig, cycleConfig } = mainlineTask;
    const { completedItems, totalItems, items } = checklistConfig;
    
    // 找到当前正在进行的清单项
    const currentItem = items.find(item => item.status === 'IN_PROGRESS');
    
    // 计算进度
    const progressData = calculateChecklistProgress(mainlineTask);

    return (
      <>
        {/* 标题和周期信息 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '14px', lineHeight: '1', fontWeight: '600' }}>●</span>
            <h3 style={{ 
              fontSize: '15px', 
              fontWeight: '500', 
              margin: 0,
              color: 'rgb(55, 53, 47)',
              lineHeight: '1.4'
            }}>
              {task.title}
            </h3>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <span style={{ 
              fontSize: '12px',
              color: deadlineColor,
              fontWeight: '400'
            }}>
              {deadlineText}
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {currentCycleNumber}/{cycleConfig.totalCycles}
            </span>
          </div>
        </div>

        {/* 本周期进度 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px' 
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(55, 53, 47, 0.65)' }}>
              本周期 · {progressData.currentCycleCompleted}/{progressData.currentCycleTarget} 项
            </span>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '500',
              color: 'rgb(55, 53, 47)'
            }}>
              {progressData.cycleProgress}%
            </span>
          </div>
          
          <div style={{ 
            height: '4px',
            backgroundColor: 'rgba(55, 53, 47, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progressData.cycleProgress}%`,
              height: '100%',
              backgroundColor: 'rgb(55, 53, 47)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {/* 当前进行中的清单项 */}
          {currentItem && (
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(55, 53, 47, 0.06)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(55, 53, 47, 0.5)', 
                marginBottom: '4px'
              }}>
                进行中
              </div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'rgb(55, 53, 47)',
                marginBottom: '2px'
              }}>
                {currentItem.title}
              </div>
              {currentItem.subProgress && (
                <div style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
                  {currentItem.subProgress.current}/{currentItem.subProgress.total}
                  {currentItem.subProgress.type === 'PAGES' ? '页' : '%'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 总目标 */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(55, 53, 47, 0.06)'
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
            总进度 · {completedItems}/{totalItems} 本
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '48px',
              height: '3px',
              backgroundColor: 'rgba(55, 53, 47, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progressData.totalProgress}%`,
                height: '100%',
                backgroundColor: 'rgba(55, 53, 47, 0.35)',
                borderRadius: '2px'
              }}></div>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
              {progressData.totalProgress}%
            </span>
          </div>
        </div>
      </>
    );
  };

  // 打卡型任务卡片
  const renderCheckInContent = () => {
    const mainlineTask = task.mainlineTask;
    console.log(mainlineTask,'mainlineTask')
    if (!mainlineTask?.checkInConfig) return renderLegacyContent();

    const { checkInConfig, cycleConfig } = mainlineTask;
    const { currentStreak, perCycleTarget } = checkInConfig;
    
    // 计算进度
    const progressData = calculateCheckInProgress(mainlineTask);
    const totalTarget = cycleConfig.totalCycles * perCycleTarget;

    // 检查今日是否已打卡
    const todayChecked = isTodayCheckedIn(mainlineTask);

    return (
      <>
        {/* 标题和周期信息 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '14px', lineHeight: '1', fontWeight: '600' }}>●</span>
            <h3 style={{ 
              fontSize: '15px', 
              fontWeight: '500', 
              margin: 0,
              color: 'rgb(55, 53, 47)',
              lineHeight: '1.4'
            }}>
              {task.title}
            </h3>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <span style={{ 
              fontSize: '12px',
              color: deadlineColor,
              fontWeight: '400'
            }}>
              {deadlineText}
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {currentCycleNumber}/{cycleConfig.totalCycles}
            </span>
          </div>
        </div>

        {/* 本周期打卡 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px' 
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(55, 53, 47, 0.65)' }}>
              本周期 · {progressData.currentCycleCheckIns}/{perCycleTarget} 次
            </span>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '500',
              color: 'rgb(55, 53, 47)'
            }}>
              {progressData.cycleProgress}%
            </span>
          </div>
          
          <div style={{ 
            height: '4px',
            backgroundColor: 'rgba(55, 53, 47, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{ 
              width: `${progressData.cycleProgress}%`,
              height: '100%',
              backgroundColor: 'rgb(55, 53, 47)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {/* 连续打卡 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            backgroundColor: 'rgba(55, 53, 47, 0.04)',
            borderRadius: '6px'
          }}>
            <span style={{ fontSize: '13px', color: 'rgba(55, 53, 47, 0.65)' }}>
              连续打卡
            </span>
            <span style={{ 
              fontSize: '15px', 
              fontWeight: '600', 
              color: 'rgb(55, 53, 47)'
            }}>
              {currentStreak} 天
            </span>
          </div>
        </div>

        {/* 总打卡 */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(55, 53, 47, 0.06)'
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
            总打卡 · {progressData.totalCheckIns}/{totalTarget} 次
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '48px',
              height: '3px',
              backgroundColor: 'rgba(55, 53, 47, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progressData.totalProgress}%`,
                height: '100%',
                backgroundColor: 'rgba(55, 53, 47, 0.35)',
                borderRadius: '2px'
              }}></div>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(55, 53, 47, 0.5)' }}>
              {progressData.totalProgress}%
            </span>
          </div>
        </div>
      </>
    );
  };

  // 兼容旧版本的渲染
  const renderLegacyContent = () => (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.cycle && (
          <div className={styles.cycleBadge}>
            <span className={styles.cycleText}>周期 {task.cycle}</span>
          </div>
        )}
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.daysText}>
          第 {task.currentDay} 天 / {task.totalDays} 天
        </span>
        <div className={styles.progressInfo}>
          <span>{task.progress}%</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </div>
    </>
  );

  return (
    <div
      onClick={onClick}
      className={styles.card}
      style={showPreviousCycleDebt ? {
        borderColor: debtColors.borderColor,
        borderWidth: '1px',
        borderStyle: 'solid'
      } : undefined}
    >
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}



















