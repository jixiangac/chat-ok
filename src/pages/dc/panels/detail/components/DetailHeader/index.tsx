import { X, MoreHorizontal, Edit2, Archive, FastForward, SkipForward, Zap, Copy, StopCircle, ArrowRightLeft } from 'lucide-react';
import { Toast } from 'antd-mobile';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { exportSingleTask, copyToClipboard, getDeveloperMode } from '../../../../utils';
import styles from './styles.module.css';

export interface DetailHeaderProps {
  /** 任务标题 */
  title: string;
  /** 任务图标 */
  icon?: string;
  /** 任务ID（用于导出） */
  taskId?: string;
  /** 关闭回调 */
  onClose: () => void;
  /** 编辑回调 */
  onEdit?: () => void;
  /** 归档回调 */
  onArchive?: () => void;
  /** Debug: 下一天 */
  onDebugNextDay?: () => void;
  /** Debug: 下一周期 */
  onDebugNextCycle?: () => void;
  /** 提前结束 */
  onEndPlanEarly?: () => void;
  /** 转为支线任务（仅主线任务可用） */
  onConvertToSideline?: () => void;
  /** 是否已结束 */
  isPlanEnded?: boolean;
  /** 是否显示 Debug 选项 */
  showDebug?: boolean;
}

/**
 * 简化的详情页顶部栏
 * 保留返回、标题、更多操作
 */
export default function DetailHeader({
  title,
  icon,
  taskId,
  onClose,
  onEdit,
  onArchive,
  onDebugNextDay,
  onDebugNextCycle,
  onEndPlanEarly,
  onConvertToSideline,
  isPlanEnded = false,
  showDebug = true
}: DetailHeaderProps) {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions &&
          menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);
  
  // 获取开发者模式状态
  const isDeveloperMode = useMemo(() => getDeveloperMode(), []);

  // 导出当前任务数据
  const handleExportTask = useCallback(async () => {
    if (!taskId) {
      Toast.show({ icon: 'fail', content: '任务ID不存在' });
      return;
    }
    const data = exportSingleTask(taskId);
    if (data) {
      const success = await copyToClipboard(data);
      if (success) {
        Toast.show({ icon: 'success', content: '任务数据已复制到剪贴板' });
      } else {
        Toast.show({ icon: 'fail', content: '复制失败，请重试' });
      }
    } else {
      Toast.show({ icon: 'fail', content: '导出失败：任务不存在' });
    }
    setShowActions(false);
  }, [taskId]);

  // 菜单项点击处理
  const handleEdit = useCallback(() => {
    setShowActions(false);
    onEdit?.();
  }, [onEdit]);

  const handleEndPlanEarly = useCallback(() => {
    setShowActions(false);
    onEndPlanEarly?.();
  }, [onEndPlanEarly]);

  const handleArchive = useCallback(() => {
    setShowActions(false);
    onArchive?.();
  }, [onArchive]);

  const handleDebugNextDay = useCallback(() => {
    setShowActions(false);
    onDebugNextDay?.();
  }, [onDebugNextDay]);

  const handleDebugNextCycle = useCallback(() => {
    setShowActions(false);
    onDebugNextCycle?.();
  }, [onDebugNextCycle]);

  const handleConvertToSideline = useCallback(() => {
    setShowActions(false);
    onConvertToSideline?.();
  }, [onConvertToSideline]);

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={onClose}>
        <X size={24} />
      </button>
      
      <div className={styles.titleSection}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h1 className={styles.title}>{title}</h1>
      </div>
      
      <div className={styles.rightActions}>
        <button ref={buttonRef} className={styles.moreButton} onClick={() => setShowActions(!showActions)}>
          <MoreHorizontal size={24} />
        </button>
        
        {showActions && (
          <div ref={menuRef} className={styles.menuDropdown}>
            {onEdit && (
              <div className={styles.menuItem} onClick={handleEdit}>
                <Edit2 size={14} style={{ marginRight: 6 }} />
                编辑任务
              </div>
            )}
            {onEndPlanEarly && !isPlanEnded && (
              <div className={styles.menuItem} onClick={handleEndPlanEarly}>
                <StopCircle size={14} style={{ marginRight: 6 }} />
                提前结束
              </div>
            )}
            {onConvertToSideline && !isPlanEnded && (
              <div className={styles.menuItem} onClick={handleConvertToSideline}>
                <ArrowRightLeft size={14} style={{ marginRight: 6 }} />
                转为支线
              </div>
            )}
            {isPlanEnded && onArchive && (
              <div className={styles.menuItem} onClick={handleArchive}>
                <Archive size={14} style={{ marginRight: 6 }} />
                归档任务
              </div>
            )}
            {isDeveloperMode && showDebug && onDebugNextDay && !isPlanEnded && (
              <div className={styles.menuItem} onClick={handleDebugNextDay}>
                🐛 Debug: 进入下一天
              </div>
            )}
            {isDeveloperMode && showDebug && onDebugNextCycle && !isPlanEnded && (
              <div className={styles.menuItem} onClick={handleDebugNextCycle}>
                🐛 Debug: 进入下一周期
              </div>
            )}
            {taskId && (
              <div className={styles.menuItem} onClick={handleExportTask}>
                <Copy size={14} style={{ marginRight: 6 }} />
                导出任务数据
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { DetailHeader };






