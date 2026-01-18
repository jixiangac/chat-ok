import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import styles from './styles.module.css';

/** 快捷操作配置 */
export interface QuickAction {
  /** 按钮标签 */
  label: string;
  /** 数值（用于累加） */
  value?: number;
  /** 特殊操作 */
  action?: 'fillToTarget' | 'openModal';
}

export interface QuickActionButtonsProps {
  /** 快捷操作配置列表 */
  actions: QuickAction[];
  /** 点击回调 */
  onAction: (value?: number, action?: 'fillToTarget' | 'openModal') => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 单位（用于显示） */
  unit?: string;
  /** 主题色 */
  themeColor?: string;
}

/**
 * 快捷操作按钮组件
 * 参考喝水打卡应用的设计风格
 * 
 * 布局：3 列 2 行网格，天蓝色胶囊按钮
 */
export default function QuickActionButtons({
  actions,
  onAction,
  disabled = false,
  loading = false,
  unit = '',
  themeColor = '#4FC3F7'
}: QuickActionButtonsProps) {
  const handleClick = (action: QuickAction) => {
    if (disabled || loading) return;
    onAction(action.value, action.action);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {actions.map((action, index) => (
          <motion.button
            key={index}
            className={styles.button}
            onClick={() => handleClick(action)}
            disabled={disabled || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              backgroundColor: themeColor,
              opacity: disabled ? 0.6 : 1 
            }}
          >
            <Lock size={14} className={styles.icon} />
            <span className={styles.label}>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/**
 * 默认快捷操作配置（喝水场景）
 */
export const DEFAULT_WATER_QUICK_ACTIONS: QuickAction[] = [
  { label: '50 ml', value: 50 },
  { label: '100 ml', value: 100 },
  { label: '200 ml', value: 200 },
  { label: '500 ml', value: 500 },
  { label: '一键填满', action: 'fillToTarget' },
  { label: '手动输入', action: 'openModal' },
];

/**
 * 默认快捷操作配置（次数场景）
 */
export const DEFAULT_TIMES_QUICK_ACTIONS: QuickAction[] = [
  { label: '+1', value: 1 },
  { label: '+2', value: 2 },
  { label: '+3', value: 3 },
  { label: '+5', value: 5 },
  { label: '一键填满', action: 'fillToTarget' },
  { label: '手动输入', action: 'openModal' },
];

export { QuickActionButtons };
