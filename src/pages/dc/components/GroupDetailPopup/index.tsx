/**
 * Group 详情弹窗组件
 * 显示某个标签下的所有任务，背景渐变跟随标签颜色配对
 */

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import type { Task, TaskTag } from '../../types';
import { SidelineTaskCard } from '../card';
import { getColorPair } from '../../constants/colors';
import styles from './styles.module.css';

// IP 图片地址
const HEADER_IMAGE_URL = 'https://img.alicdn.com/imgextra/i4/O1CN01v4XwU51lD7taaUmq1_!!6000000004784-2-tps-1080-724.png';

interface GroupDetailPopupProps {
  visible: boolean;
  tag: TaskTag | null;
  tasks: Task[];
  onClose: () => void;
  onTaskClick: (taskId: string) => void;
}

const GroupDetailPopup: React.FC<GroupDetailPopupProps> = ({
  visible,
  tag,
  tasks,
  onClose,
  onTaskClick,
}) => {
  // 根据标签颜色生成渐变背景（使用颜色配对）
  const headerGradient = useMemo(() => {
    if (!tag) return {};
    const startColor = tag.color;
    const endColor = getColorPair(tag.color);
    return {
      background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`
    };
  }, [tag]);

  if (!visible || !tag) return null;

  // 处理任务点击 - 保持弹窗打开，直接打开详情
  const handleTaskClick = (taskId: string) => {
    onTaskClick(taskId);
  };

  // 使用 Portal 渲染到 body 下，避免被父容器的 overflow 影响
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 顶部图片 - 使用标签颜色配对渐变背景 */}
        <div className={styles.headerImage} style={headerGradient}>
          {/* 右上角关闭按钮 */}
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
          <img 
            src={HEADER_IMAGE_URL} 
            alt={tag.name} 
            className={styles.headerImg}
          />
        </div>

        {/* 标题区域 */}
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <div 
              className={styles.colorDot}
              style={{ backgroundColor: tag.color }}
            />
            <h2 className={styles.title}>{tag.name}</h2>
          </div>
          <p className={styles.subtitle}>共 {tasks.length} 个任务</p>
        </div>

        {/* 任务列表 */}
        <div className={styles.taskSection}>
          <div className={styles.taskGrid}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <SidelineTaskCard
                  key={task.id}
                  task={task}
                  variant="grid"
                  onClick={() => handleTaskClick(task.id)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>该标签下暂无任务</div>
            )}
          </div>
          <SafeArea position="bottom" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GroupDetailPopup;



