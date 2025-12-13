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

export default function MainlineTaskCard({ task, onClick }: MainlineTaskCardProps) {
  const remainingDays = calculateRemainingDays(task);

  // 根据任务类型渲染不同的内容
  const renderContent = () => {
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
            <span style={{ fontSize: '18px', lineHeight: '1' }}>📈</span>
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
            <span style={{ fontSize: '18px', lineHeight: '1' }}>📋</span>
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
            <span style={{ fontSize: '18px', lineHeight: '1' }}>✅</span>
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
