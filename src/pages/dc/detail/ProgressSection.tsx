import type { ProgressSectionProps } from './types';
import styles from '../css/ProgressSection.module.css';

export default function ProgressSection({
  currentCheckIns,
  requiredCheckIns,
  totalCheckIns,
  totalCycles,
  currentCycle,
  onRefresh
}: ProgressSectionProps) {
  return (
    <div className={styles.container}>
      {/* 操作按钮 */}
      <div className={styles.buttonRow}>
        <div className={`${styles.actionBtn} ${styles.actionBtnOutline}`}>
          查看进度
        </div>
        <div className={`${styles.actionBtn} ${styles.actionBtnFilled}`}>
          立即打卡
        </div>
      </div>
    </div>
  );
}
