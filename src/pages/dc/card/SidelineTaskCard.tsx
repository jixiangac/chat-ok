import { Task } from '../types';
import styles from '../css/SidelineTaskCard.module.css';

interface SidelineTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function SidelineTaskCard({ task, onClick }: SidelineTaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${task.progress}%` }}
        ></div>
      </div>
      
      <div className={styles.daysText}>
        {task.currentDay}/{task.totalDays} 天
      </div>
    </div>
  );
}
