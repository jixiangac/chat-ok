import { memo, useMemo, ReactNode } from 'react';
import styles from './styles.module.css';

interface StatCardProps {
  /** 标签文字 */
  label: string;
  /** 数值 */
  value: string | number;
  /** 单位 */
  unit?: string;
  /** 图标 */
  icon?: ReactNode;
  /** 副标题/描述 */
  description?: string;
  /** 变化趋势 */
  trend?: 'up' | 'down' | 'neutral';
  /** 变化值 */
  trendValue?: string | number;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * 统计卡片组件
 * 使用 memo 优化渲染性能
 */
function StatCardComponent({
  label,
  value,
  unit,
  icon,
  description,
  trend,
  trendValue,
  backgroundColor,
  className,
  onClick
}: StatCardProps) {
  // 使用 useMemo 缓存样式
  const containerStyle = useMemo(() => ({
    backgroundColor: backgroundColor || undefined,
    cursor: onClick ? 'pointer' : undefined
  }), [backgroundColor, onClick]);

  const trendClassName = useMemo(() => {
    if (!trend) return '';
    return trend === 'up' ? styles.trendUp : trend === 'down' ? styles.trendDown : styles.trendNeutral;
  }, [trend]);

  const classNames = [
    styles.container,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classNames}
      style={containerStyle}
      onClick={onClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
        {description && <div className={styles.description}>{description}</div>}
        {trend && trendValue !== undefined && (
          <div className={`${styles.trend} ${trendClassName}`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
            <span className={styles.trendValue}>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 使用 memo 包装，只在 props 变化时重新渲染
export const StatCard = memo(StatCardComponent);
export default StatCard;

/**
 * 统计卡片网格容器
 */
interface StatCardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  className?: string;
}

function StatCardGridComponent({
  children,
  columns = 2,
  gap = 12,
  className
}: StatCardGridProps) {
  const style = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`
  }), [columns, gap]);

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export const StatCardGrid = memo(StatCardGridComponent);
