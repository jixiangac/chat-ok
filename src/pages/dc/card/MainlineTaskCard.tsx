import { Task } from '../types';
import styles from '../css/MainlineTaskCard.module.css';

interface MainlineTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function MainlineTaskCard({ task, onClick }: MainlineTaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={styles.card}
    >
      <div className={styles.content}>
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
      </div>
    </div>
  );
}
