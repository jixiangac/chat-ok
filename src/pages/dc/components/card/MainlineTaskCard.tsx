import { Task } from '../../types';
import styles from './MainlineTaskCard.module.css';
import { calculateRemainingDays, formatNumber, getDeadlineColor, getDeadlineText } from '../../utils/mainlineTaskHelper';

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

export default function MainlineTaskCard({ task, onClick }: MainlineTaskCardProps) {
  // ========== 直接从 task 获取已计算好的数据 ==========
  const { progress, cycle, category, numericConfig, checklistConfig, checkInConfig } = task;
 
  // 周期信息 - 直接使用
  const currentCycle = cycle?.currentCycle || 1;
  const totalCycles = cycle?.totalCycles || 1;
  const cycleDays = cycle?.cycleDays || 7;
  
  // 进度信息 - 直接使用已计算好的值
  const cycleProgress = progress?.cyclePercentage || 0;
  const totalProgress = progress?.totalPercentage || 0;
  const cycleStartValue = progress?.cycleStartValue;
  const cycleTargetValue = progress?.cycleTargetValue;
  const compensationTargetValue = progress?.compensationTargetValue;
  
  // 剩余天数 - 需要实时计算
  const remainingDays = calculateRemainingDays(task);
  const deadlineColor = getDeadlineColor(remainingDays, cycleDays, cycleProgress);
  const deadlineText = getDeadlineText(remainingDays);
  
  // 欠账显示信息 - 直接使用已计算好的值
  const debtDisplay = task.debtDisplay;
  const showPreviousCycleDebt = debtDisplay?.showDebt || false;
  const displayDebtTarget = debtDisplay?.debtTarget;
  const debtProgress = debtDisplay?.debtProgress;
  const debtColors = {
    bgColor: debtDisplay?.bgColor || 'rgba(246, 239, 239, 0.6)',
    progressColor: debtDisplay?.progressColor || 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)',
    borderColor: debtDisplay?.borderColor || '#E0CEC6'
  };
  
  // 任务是否已完成 - 直接使用已计算好的值
  const isCompleted = task.isPlanEnded || task.status === 'COMPLETED' || task.status === 'ARCHIVED';

  // ========== 渲染函数 ==========
  
  // 已完成任务的结算卡片
  const renderCompletedContent = () => {
    let completionRate = 0;
    let originalStart = 0;
    let targetValue = 0;
    let finalValue = 0;
    let unit = '';
    let isSuccess = false;
    
    if (numericConfig) {
      originalStart = numericConfig.originalStartValue ?? numericConfig.startValue;
      targetValue = numericConfig.targetValue;
      finalValue = numericConfig.currentValue;
      unit = numericConfig.unit;
      const totalChange = Math.abs(targetValue - originalStart);
      const isDecrease = numericConfig.direction === 'DECREASE';
      const rawChange = finalValue - originalStart;
      const effectiveChange = isDecrease ? Math.max(0, -rawChange) : Math.max(0, rawChange);
      completionRate = totalChange > 0 ? Math.min(100, Math.round((effectiveChange / totalChange) * 100)) : 0;
      isSuccess = isDecrease ? finalValue <= targetValue : finalValue >= targetValue;
    } else if (checklistConfig) {
      completionRate = checklistConfig.totalItems > 0 
        ? Math.round((checklistConfig.completedItems / checklistConfig.totalItems) * 100) : 0;
      finalValue = checklistConfig.completedItems;
      targetValue = checklistConfig.totalItems;
      unit = '项';
      isSuccess = completionRate >= 100;
    } else if (checkInConfig) {
      const totalTarget = totalCycles * checkInConfig.perCycleTarget;
      const totalCheckIns = checkInConfig.records?.filter(r => r.checked).length || 0;
      completionRate = totalTarget > 0 ? Math.min(100, Math.round((totalCheckIns / totalTarget) * 100)) : 0;
      finalValue = totalCheckIns;
      targetValue = totalTarget;
      unit = '次';
      isSuccess = completionRate >= 100;
    }
    
    return (
      <>
        <div className={styles.completedHeader}>
          <div className={styles.completedTitleWrapper}>
            <span className={styles.completedIcon}>{isSuccess ? '✓' : '—'}</span>
            <h3 className={styles.completedTitle}>{task.title}</h3>
          </div>
          <span className={styles.completedBadge}>已完结</span>
        </div>

        <div className={styles.settlementSection}>
          <div className={styles.settlementCard}>
            <div className={styles.settlementLabel}>初始计划</div>
            <div className={styles.settlementValue}>
              {numericConfig 
                ? `${formatNumber(originalStart)} → ${formatNumber(targetValue)}${unit}`
                : `${formatNumber(targetValue)}${unit}`
              }
            </div>
          </div>
          <div className={styles.settlementCard}>
            <div className={styles.settlementLabel}>最终结算</div>
            <div className={styles.settlementValue}>{formatNumber(finalValue)}{unit}</div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{totalCycles}/{totalCycles}</div>
            <div className={styles.statLabel}>完成周期</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{completionRate}%</div>
            <div className={styles.statLabel}>完成率</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{isSuccess ? '达成' : '未达成'}</div>
            <div className={styles.statLabel}>目标状态</div>
          </div>
        </div>
      </>
    );
  };

  // 数值型任务卡片
  const renderNumericContent = () => {
    if (!numericConfig) return renderLegacyContent();
    const { unit, originalStartValue, startValue, targetValue, perCycleTarget } = numericConfig;
    
    // 欠账模式下的进度 - 直接使用已计算好的值
    const displayProgress = showPreviousCycleDebt && debtProgress !== undefined ? debtProgress : cycleProgress;
    
    // 检查是否有补偿目标值（替代当前周期目标进行计算）
    const hasCompensation = compensationTargetValue !== undefined;
    
    // 如果有补偿目标，显示补偿目标值；否则显示原周期目标值
    // cycleTargetValue 保持原值不变，compensationTargetValue 是实际计算用的目标
    const displayTargetValue = hasCompensation ? compensationTargetValue : cycleTargetValue;
    
    // 判断总目标是否已完成
    const isTotalCompleted = totalProgress >= 100;
    
    return (
      <>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.titleDot}>●</span>
            <h3 className={styles.title}>{task.title}</h3>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.deadlineText} style={{ color: deadlineColor }}>{deadlineText}</span>
            <span className={styles.cycleBadge}>{currentCycle}/{totalCycles}</span>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              本周期 · {formatNumber(cycleStartValue)}{unit} → {formatNumber(displayTargetValue)}{unit}
              {hasCompensation && (
                <span className={styles.originalTarget}>
                  (原{formatNumber(cycleTargetValue)}{unit})
                </span>
              )}
            </span>
            <span className={styles.progressValue}>
              {showPreviousCycleDebt ? displayProgress : cycleProgress}%
            </span>
          </div>
          
          <div 
            className={styles.progressBar}
            style={showPreviousCycleDebt || hasCompensation ? { backgroundColor: debtColors.bgColor } : undefined}
          >
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${showPreviousCycleDebt ? displayProgress : cycleProgress}%`,
                background: showPreviousCycleDebt || hasCompensation ? debtColors.progressColor : undefined
              }}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerLabel}>
            {isTotalCompleted 
              ? '🎉 总目标已达成' 
              : `总进度 · ${formatNumber(originalStartValue ?? startValue)}${unit} → ${formatNumber(targetValue)}${unit}`
            }
          </span>
          <div className={styles.footerProgress}>
            <div className={styles.footerProgressBar}>
              <div className={styles.footerProgressFill} style={{ width: `${totalProgress}%` }} />
            </div>
            <span className={styles.footerProgressValue}>{totalProgress}%</span>
          </div>
        </div>
      </>
    );
  };

  // 清单型任务卡片
  const renderChecklistContent = () => {
    if (!checklistConfig) return renderLegacyContent();
    const { completedItems, totalItems, items, perCycleTarget } = checklistConfig;
    const currentItem = items.find(item => item.status === 'IN_PROGRESS');
    
    // 计算本周期完成数
    const currentCycleCompleted = items.filter(
      item => item.status === 'COMPLETED' && item.cycle === currentCycle
    ).length;
    
    // 判断总目标是否已完成
    const isTotalCompleted = totalProgress >= 100;

    return (
      <>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.titleDot}>●</span>
            <h3 className={styles.title}>{task.title}</h3>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.deadlineText} style={{ color: deadlineColor }}>{deadlineText}</span>
            <span className={styles.cycleBadge}>{currentCycle}/{totalCycles}</span>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              本周期 · {currentCycleCompleted}/{perCycleTarget} 项
            </span>
            <span className={styles.progressValue}>{cycleProgress}%</span>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${cycleProgress}%` }} />
          </div>

          {currentItem && (
            <div className={styles.currentItemSection}>
              <div className={styles.currentItemLabel}>进行中</div>
              <div className={styles.currentItemTitle}>{currentItem.title}</div>
              {currentItem.subProgress && (
                <div className={styles.currentItemProgress}>
                  {currentItem.subProgress.current}/{currentItem.subProgress.total}
                  {currentItem.subProgress.type === 'PAGES' ? '页' : '%'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerLabel}>
            {isTotalCompleted ? '🎉 总目标已达成' : `总进度 · ${completedItems}/${totalItems} 本`}
          </span>
          <div className={styles.footerProgress}>
            <div className={styles.footerProgressBar}>
              <div className={styles.footerProgressFill} style={{ width: `${totalProgress}%` }} />
            </div>
            <span className={styles.footerProgressValue}>{totalProgress}%</span>
          </div>
        </div>
      </>
    );
  };

  // 打卡型任务卡片
  const renderCheckInContent = () => {
    if (!checkInConfig) return renderLegacyContent();
    const { perCycleTarget, records } = checkInConfig;
    const totalTarget = totalCycles * perCycleTarget;
    const totalCheckIns = records?.filter(record => record.checked).length || 0;
    
    // 计算本周期打卡数
    const startDate = task.time?.startDate ? new Date(task.time.startDate) : new Date();
    const currentCycleStartDay = (currentCycle - 1) * cycleDays;
    const currentCycleEndDay = currentCycle * cycleDays;
    const currentCycleStartDate = new Date(startDate);
    currentCycleStartDate.setDate(startDate.getDate() + currentCycleStartDay);
    const currentCycleEndDate = new Date(startDate);
    currentCycleEndDate.setDate(startDate.getDate() + currentCycleEndDay);
    
    const currentCycleCheckIns = records?.filter(record => {
      const recordDate = new Date(record.date);
      return record.checked && recordDate >= currentCycleStartDate && recordDate < currentCycleEndDate;
    }).length || 0;
    
    // 判断总目标是否已完成
    const isTotalCompleted = totalProgress >= 100;

    return (
      <>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.titleDot}>●</span>
            <h3 className={styles.title}>{task.title}</h3>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.deadlineText} style={{ color: deadlineColor }}>{deadlineText}</span>
            <span className={styles.cycleBadge}>{currentCycle}/{totalCycles}</span>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>本周期 · {currentCycleCheckIns}/{perCycleTarget} 次</span>
            <span className={styles.progressValue}>{cycleProgress}%</span>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${cycleProgress}%` }} />
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerLabel}>
            {isTotalCompleted ? '🎉 总目标已达成' : `总打卡 · ${totalCheckIns}/${totalTarget} 次`}
          </span>
          <div className={styles.footerProgress}>
            <div className={styles.footerProgressBar}>
              <div className={styles.footerProgressFill} style={{ width: `${totalProgress}%` }} />
            </div>
            <span className={styles.footerProgressValue}>{totalProgress}%</span>
          </div>
        </div>
      </>
    );
  };

  // 兼容旧版本的渲染
  const renderLegacyContent = () => (
    <>
      <div className={styles.legacyHeader}>
        <h3 className={styles.legacyTitle}>{task.title}</h3>
        {cycle && (
          <div className={styles.legacyCycleBadge}>
            <span className={styles.legacyCycleText}>周期 {currentCycle}/{totalCycles}</span>
          </div>
        )}
      </div>
      
      <div className={styles.legacyProgressContainer}>
        <div className={styles.legacyProgressBar}>
          <div className={styles.legacyProgressFill} style={{ width: `${cycleProgress}%` }} />
        </div>
      </div>
      
      <div className={styles.legacyFooter}>
        <span className={styles.legacyDaysText}>
          第 {(task as any).currentDay || 1} 天 / {cycle?.totalDays || 30} 天
        </span>
        <div className={styles.legacyProgressInfo}>
          <span>{cycleProgress}%</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </div>
    </>
  );

  // 根据任务类型渲染不同的内容
  const renderContent = () => {
    if (isCompleted) return renderCompletedContent();
    if (!category) return renderLegacyContent();
    
    switch (category) {
      case 'NUMERIC': return renderNumericContent();
      case 'CHECKLIST': return renderChecklistContent();
      case 'CHECK_IN': return renderCheckInContent();
      default: return renderLegacyContent();
    }
  };

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
