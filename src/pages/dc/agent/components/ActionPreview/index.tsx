/**
 * 结构化输出预览组件
 * 显示任务配置预览或清单项预览，支持确认/取消
 */

import { Check, X } from 'lucide-react';
import type { ActionPreviewProps, TaskConfigData, ChecklistItemsData } from '../../types';
import styles from './styles.module.css';

// 任务类型映射
const CATEGORY_LABELS: Record<string, string> = {
  NUMERIC: '数值型',
  CHECKLIST: '清单型',
  CHECK_IN: '打卡型',
};

export function ActionPreview({ output, onConfirm, onCancel }: ActionPreviewProps) {
  if (output.type === 'TASK_CONFIG') {
    const data = output.data as TaskConfigData;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>任务配置</span>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.meta}>
            <span className={styles.tag}>{CATEGORY_LABELS[data.category] || data.category}</span>
            <span className={styles.info}>{data.totalDays}天</span>
            <span className={styles.info}>周期{data.cycleDays}天</span>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            <X size={16} />
            <span>取消</span>
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            <Check size={16} />
            <span>创建任务</span>
          </button>
        </div>
      </div>
    );
  }

  if (output.type === 'CHECKLIST_ITEMS') {
    const data = output.data as ChecklistItemsData;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>清单项</span>
          <span className={styles.count}>{data.items.length} 项</span>
        </div>
        <div className={styles.list}>
          {data.items.map((item, index) => (
            <div key={index} className={styles.listItem}>
              <span className={styles.bullet}>•</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            <X size={16} />
            <span>取消</span>
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            <Check size={16} />
            <span>添加到清单</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default ActionPreview;
