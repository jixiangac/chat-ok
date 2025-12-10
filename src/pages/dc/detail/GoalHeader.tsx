import { CloseOutline, EditSOutline, MoreOutline } from 'antd-mobile-icons';
import type { GoalHeaderProps } from './types';
import styles from '../css/GoalHeader.module.css';

export default function GoalHeader({ 
  goal, 
  onClose,
  currentCheckIns,
  requiredCheckIns,
  totalCheckIns,
  totalCycles,
  currentCycle
}: GoalHeaderProps) {
  // 计算完成进度百分比
  const totalRequired = totalCycles * requiredCheckIns;
  const progress = totalRequired > 0 ? Math.round((totalCheckIns / totalRequired) * 100) : 0;
  
  // 本周期进度
  const cycleProgress = requiredCheckIns > 0 ? Math.min((currentCheckIns / requiredCheckIns) * 100, 100) : 0;
  
  return (
    <div className={styles.container}>
      {/* 顶部操作栏 */}
      <div className={styles.topBar}>
        <div className={styles.closeButton} onClick={onClose}>
          <CloseOutline />
        </div>
        <div className={styles.rightActions}>
          <div className={styles.actionButton}>
            <EditSOutline />
          </div>
          <div className={styles.actionButton}>
            <MoreOutline />
          </div>
        </div>
      </div>
      
      {/* 图标 + 标题 */}
      <div className={styles.titleRow}>
        <div className={styles.icon}>
          {goal.icon}
        </div>
        <div className={styles.title}>
          {goal.title}
        </div>
      </div>
      
      {/* 主要数值显示 */}
      <div className={styles.mainValue}>
        {progress}%
      </div>
      
      {/* 进度条 */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${cycleProgress}%` }}
          />
        </div>
        <div className={styles.progressInfo}>
          <span>第 {currentCycle} 周期</span>
          <span>{currentCheckIns}/{requiredCheckIns} 次</span>
        </div>
      </div>
    </div>
  );
}
