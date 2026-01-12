/**
 * Group 卡片组件
 * 显示标签分组信息，使用渐变进度样式
 * 进度按今日完成数量计算
 */

import React, { useMemo } from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import type { Task, TaskTag } from '../../types';
import { getTodayCheckInStatusForTask } from '../../panels/detail/hooks';
import styles from './styles.module.css';

interface GroupCardProps {
  tag: TaskTag;
  tasks: Task[];
  onClick: () => void;
}

// 将hex转为rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GroupCard: React.FC<GroupCardProps> = ({
  tag,
  tasks,
  onClick,
}) => {
  // 计算今日完成进度
  const { completedCount, progress } = useMemo(() => {
    const completed = tasks.filter(task => {
      // 检查任务今日是否已完成打卡
      const status = getTodayCheckInStatusForTask(task);
      return status.isCompleted;
    });

    const prog = tasks.length > 0 
      ? Math.round((completed.length / tasks.length) * 100) 
      : 0;

    return { completedCount: completed.length, progress: prog };
  }, [tasks]);

  // 渐变背景样式（与支线 grid 卡片一致）
  const gradientStyle = useMemo(() => {
    if (progress <= 0) return { background: '#fff' };
    
    return {
      background: `linear-gradient(to right, ${hexToRgba(tag.color, 0.15)} 0%, ${hexToRgba(tag.color, 0.5)} ${Math.max(0, progress - 5)}%, ${hexToRgba(tag.color, 0.2)} ${progress}%, white ${Math.min(100, progress + 15)}%)`
    };
  }, [progress, tag.color]);

  return (
    <button
      className={styles.card}
      onClick={onClick}
      style={gradientStyle}
    >
      <div className={styles.content}>
        {/* 图标 */}
        <div className={styles.iconWrapper} style={{ color: tag.color }}>
          <Folder size={20} />
        </div>
        {/* 标签名 */}
        <div className={styles.tagName}>{tag.name}</div>
      </div>
      {/* 右侧箭头 */}
      <ChevronRight size={18} className={styles.arrow} style={{ color: tag.color }} />
    </button>
  );
};

export default GroupCard;
