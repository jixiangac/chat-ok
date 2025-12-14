import dayjs from 'dayjs';
import { Task } from '../types';
import styles from '../css/MainlineTaskCard.module.css';
import { 
  calculateRemainingDays, 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress,
  isTodayCheckedIn 
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

export default function MainlineTaskCard({ task, onClick }: MainlineTaskCardProps) {
  const remainingDays = calculateRemainingDays(task);
  
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
    
    // 计算进度
    const progressData = calculateNumericProgress(mainlineTask);

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
              color: 'rgba(55, 53, 47, 0.5)',
              fontWeight: '400'
            }}>
              {remainingDays}天后截止
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {cycleConfig.currentCycle}/{cycleConfig.totalCycles}
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
              color: 'rgba(55, 53, 47, 0.5)',
              fontWeight: '400'
            }}>
              {remainingDays}天后截止
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {cycleConfig.currentCycle}/{cycleConfig.totalCycles}
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
              color: 'rgba(55, 53, 47, 0.5)',
              fontWeight: '400'
            }}>
              {remainingDays}天后截止
            </span>
            <span style={{ 
              fontSize: '11px',
              color: 'rgba(55, 53, 47, 0.5)',
              backgroundColor: 'rgba(55, 53, 47, 0.06)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {cycleConfig.currentCycle}/{cycleConfig.totalCycles}
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
    >
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}
