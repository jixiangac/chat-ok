import { Task } from '../types';
import styles from '../css/SidelineTaskCard.module.css';
import { 
  calculateRemainingDays, 
  calculateNumericProgress,
  calculateChecklistProgress,
  calculateCheckInProgress
} from '../utils/mainlineTaskHelper';

interface SidelineTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function SidelineTaskCard({ task, onClick }: SidelineTaskCardProps) {
  const remainingDays = calculateRemainingDays(task);
  
  // 计算总进度
  const getTotalProgress = () => {
    if (!task.mainlineTask) return task.progress || 0;
    
    switch (task.mainlineType) {
      case 'NUMERIC': {
        const progressData = calculateNumericProgress(task.mainlineTask);
        return progressData.totalProgress;
      }
      case 'CHECKLIST': {
        const progressData = calculateChecklistProgress(task.mainlineTask);
        return progressData.totalProgress;
      }
      case 'CHECK_IN': {
        const progressData = calculateCheckInProgress(task.mainlineTask);
        return progressData.totalProgress;
      }
      default:
        return task.progress || 0;
    }
  };
  
  const totalProgress = getTotalProgress();
  
  return (
    <div
      onClick={onClick}
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.progress}>{totalProgress}%</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${totalProgress}%` }}
        ></div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.daysText}>
          {remainingDays > 0 ? `${remainingDays}天后截止` : '已截止'}
        </span>
        {task.totalCycles && task.mainlineTask?.cycleConfig && (
          <span className={styles.cycleText}>
            {task.mainlineTask.cycleConfig.currentCycle}/{task.totalCycles}
          </span>
        )}
      </div>
    </div>
  );
}
