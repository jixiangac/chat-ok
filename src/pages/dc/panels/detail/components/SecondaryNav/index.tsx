import { FileText, Target, Calendar } from 'lucide-react';
import styles from './styles.module.css';

export interface SecondaryNavProps {
  /** 点击记录入口 */
  onRecordsClick?: () => void;
  /** 点击历史入口 */
  onHistoryClick?: () => void;
  /** 点击日历入口 */
  onCalendarClick?: () => void;
  /** 任务类型 */
  taskType?: 'CHECK_IN' | 'NUMERIC' | 'CHECKLIST';
}

/**
 * 二级入口导航组件
 * 提供「记录」「历史」「日历」等入口
 */
export default function SecondaryNav({
  onRecordsClick,
  onHistoryClick,
  onCalendarClick,
  taskType = 'CHECK_IN'
}: SecondaryNavProps) {
  const navItems = [
    {
      key: 'records',
      icon: <FileText size={18} />,
      label: taskType === 'NUMERIC' ? '变动记录' : '变动记录',
      onClick: onRecordsClick
    },
    {
      key: 'history',
      icon: <Target size={18} />,
      label: '周期计划',
      onClick: onHistoryClick
    },
    {
      key: 'calendar',
      icon: <Calendar size={18} />,
      label: '日历视图',
      onClick: onCalendarClick,
      hidden: taskType === 'NUMERIC' // 数值型不显示日历
    }
  ].filter(item => !item.hidden);

  return (
    <div className={styles.container}>
      {navItems.map(item => (
        <button
          key={item.key}
          className={styles.navItem}
          onClick={item.onClick}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export { SecondaryNav };

