import { motion } from 'framer-motion';
import styles from './styles.module.css';

export interface SecondaryNavProps {
  /** 点击日历入口 */
  onCalendarClick?: () => void;
  /** 点击历史入口 */
  onHistoryClick?: () => void;
  /** 任务类型 */
  taskType?: 'CHECK_IN' | 'NUMERIC' | 'CHECKLIST';
}

/**
 * 二级入口导航组件
 * 简约文字按钮样式
 */
export default function SecondaryNav({
  onCalendarClick,
  onHistoryClick,
  taskType = 'CHECK_IN'
}: SecondaryNavProps) {
  const navItems = [
    {
      key: 'calendar',
      label: '历史记录',
      onClick: onCalendarClick
    },
    {
      key: 'history',
      label: '周期计划',
      onClick: onHistoryClick
    }
  ];

  return (
    <div className={styles.container}>
      {navItems.map(item => (
        <motion.button
          key={item.key}
          className={styles.navButton}
          onClick={item.onClick}
          whileHover={{ color: '#666' }}
          whileTap={{ scale: 0.95 }}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}

export { SecondaryNav };
