import { FilterOutline } from 'antd-mobile-icons';
import type { TabBarProps } from './types';
import styles from '../css/TabBar.module.css';

export default function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className={styles.container}>
      <div
        className={styles.tab}
        onClick={() => onChange(activeTab === 'cycle' ? 'records' : 'cycle')}
      >
        {activeTab === 'cycle' ? '打卡记录' : '当前周期'}
        <FilterOutline className={styles.filterIcon} />
      </div>
      <div className={styles.rightLabel}>
        进度
      </div>
    </div>
  );
}
