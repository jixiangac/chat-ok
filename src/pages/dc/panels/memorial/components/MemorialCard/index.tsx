/**
 * 纪念日卡片组件 - 性能优化版本
 */

import React, { memo, useMemo, useCallback } from 'react';
import { Pin } from 'lucide-react';
import type { Memorial } from '../../types';
import { getShortDaysText, formatDate } from '../../utils';
import { getIconConfig, getDefaultIcon } from '../../constants';
import styles from './styles.module.css';

interface MemorialCardProps {
  memorial: Memorial;
  onClick?: () => void;
}

function MemorialCardComponent({ memorial, onClick }: MemorialCardProps) {
  // 获取图标组件 - 使用 useMemo 缓存
  const iconConfig = useMemo(() => {
    return getIconConfig(memorial.icon) || getDefaultIcon();
  }, [memorial.icon]);

  const IconComponent = iconConfig.component;

  // 计算天数显示 - 使用 useMemo 缓存
  const daysText = useMemo(() => {
    return getShortDaysText(memorial.date);
  }, [memorial.date]);

  // 格式化日期 - 使用 useMemo 缓存
  const formattedDate = useMemo(() => {
    return formatDate(memorial.date);
  }, [memorial.date]);

  // 图标颜色 - 使用 useMemo 缓存
  const iconColor = useMemo(() => {
    return memorial.iconColor || iconConfig.defaultColor;
  }, [memorial.iconColor, iconConfig.defaultColor]);

  // 图标背景色 - 使用 useMemo 缓存
  const iconBgColor = useMemo(() => {
    return `${iconColor}33`; // 添加 20% 透明度
  }, [iconColor]);

  // 点击处理 - 使用 useCallback 缓存
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 图标 */}
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: iconBgColor }}
      >
        <IconComponent
          size={24}
          color={iconColor}
          strokeWidth={1.5}
        />
      </div>

      {/* 内容 */}
      <div className={styles.content}>
        <h3 className={styles.name}>{memorial.name}</h3>
        <div className={styles.dateInfo}>{formattedDate}</div>
      </div>

      {/* 天数和置顶图标 */}
      <div className={styles.daysWrapper}>
        <span className={styles.days}>{daysText}</span>
        {memorial.isPinned && (
          <Pin size={14} className={styles.pinIcon} />
        )}
      </div>
    </div>
  );
}

// 自定义比较函数，只比较必要的属性
function arePropsEqual(prevProps: MemorialCardProps, nextProps: MemorialCardProps): boolean {
  const prevMemorial = prevProps.memorial;
  const nextMemorial = nextProps.memorial;

  return (
    prevMemorial.id === nextMemorial.id &&
    prevMemorial.name === nextMemorial.name &&
    prevMemorial.date === nextMemorial.date &&
    prevMemorial.icon === nextMemorial.icon &&
    prevMemorial.iconColor === nextMemorial.iconColor &&
    prevMemorial.isPinned === nextMemorial.isPinned &&
    prevProps.onClick === nextProps.onClick
  );
}

export const MemorialCard = memo(MemorialCardComponent, arePropsEqual);
export default MemorialCard;
