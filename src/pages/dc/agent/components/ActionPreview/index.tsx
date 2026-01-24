/**
 * 结构化输出预览组件
 * 显示任务配置预览或清单项预览，支持确认/取消
 */

import { Check, X } from 'lucide-react';
import type { ActionPreviewProps, TaskConfigData, ChecklistItemsData, NumericConfigData, CheckInConfigData } from '../../types';
import styles from './styles.module.css';

// 任务类型映射
const CATEGORY_LABELS: Record<string, string> = {
  NUMERIC: '数值型',
  CHECKLIST: '清单型',
  CHECK_IN: '打卡型',
};

// 方向映射
const DIRECTION_LABELS: Record<string, string> = {
  INCREASE: '增加',
  DECREASE: '减少',
};

// 打卡单位映射
const CHECK_IN_UNIT_LABELS: Record<string, string> = {
  TIMES: '次数',
  DURATION: '时长',
  QUANTITY: '数量',
};

export function ActionPreview({ output, onConfirm, onCancel, showActions = true }: ActionPreviewProps) {
  if (output.type === 'TASK_CONFIG') {
    const data = output.data as TaskConfigData;
    const numericConfig = data.numericConfig as NumericConfigData | undefined;
    const checkInConfig = data.checkInConfig as CheckInConfigData | undefined;

    // 计算周期数
    const totalCycles = Math.floor(data.totalDays / data.cycleDays);

    // 构建配置详情（与产品预览面板保持一致）
    const configDetails: Array<{ label: string; value: string }> = [];

    // 基础信息
    configDetails.push({ label: '任务类型', value: CATEGORY_LABELS[data.category] || data.category });
    configDetails.push({ label: '总时长', value: `${data.totalDays} 天` });
    configDetails.push({ label: '周期', value: `${data.cycleDays} 天 × ${totalCycles} 周期` });

    // 数值型配置 - 直观展示增减变化
    if (data.category === 'NUMERIC') {
      if (numericConfig) {
        const { startValue, targetValue, unit, direction } = numericConfig;
        // 显示目标方向
        configDetails.push({ label: '目标方向', value: DIRECTION_LABELS[direction] || direction });
        // 显示完整的目标变化
        const diff = Math.abs(targetValue - startValue);
        const changeText = direction === 'DECREASE'
          ? `${startValue}${unit} → ${targetValue}${unit}（减少 ${diff}${unit}）`
          : `${startValue}${unit} → ${targetValue}${unit}（增加 ${diff}${unit}）`;
        configDetails.push({ label: '目标变化', value: changeText });
      } else {
        // 备用：如果没有详细配置，至少提示用户这是数值型
        configDetails.push({ label: '目标方向', value: '待配置' });
      }
    }

    // 打卡型配置
    if (data.category === 'CHECK_IN' && checkInConfig) {
      configDetails.push({ label: '打卡类型', value: CHECK_IN_UNIT_LABELS[checkInConfig.unit] || checkInConfig.unit });
      if (checkInConfig.dailyMax) {
        const unitLabel = checkInConfig.valueUnit || (checkInConfig.unit === 'TIMES' ? '次' : checkInConfig.unit === 'DURATION' ? '分钟' : '个');
        configDetails.push({ label: '每日目标', value: `${checkInConfig.dailyMax}${unitLabel}` });
      }
    }

    // 清单型：检查是否有清单项目
    const isChecklist = data.category === 'CHECKLIST';
    const hasChecklistItems = isChecklist && data.checklistItems && data.checklistItems.length > 0;
    const needsChecklistItems = isChecklist && !hasChecklistItems;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>推荐配置</span>
        </div>
        <p className={styles.guideText}>根据你的需求，为你生成以下任务配置方案：</p>
        <div className={styles.card}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.configTable}>
            {configDetails.map((item, index) => (
              <div key={index} className={styles.configRow}>
                <span className={styles.configLabel}>{item.label}</span>
                <span className={styles.configValue}>{item.value}</span>
              </div>
            ))}
          </div>
          {/* 清单型任务：展示具体的清单项目列表 */}
          {hasChecklistItems && (
            <div className={styles.checklistSection}>
              <div className={styles.checklistHeader}>
                <span>清单项目</span>
                <span className={styles.checklistCount}>共 {data.checklistItems!.length} 项</span>
              </div>
              <div className={styles.list}>
                {data.checklistItems!.map((item, index) => (
                  <div key={index} className={styles.listItem}>
                    <span className={styles.bullet}>{index + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 清单型任务但没有清单项：显示提示 */}
          {needsChecklistItems && (
            <div className={styles.checklistSection}>
              <div className={styles.checklistHeader}>
                <span>清单项目</span>
              </div>
              <div className={styles.emptyChecklist}>
                <span>📝</span>
                <span>确认后可添加具体清单项目</span>
              </div>
            </div>
          )}
        </div>
        {showActions && (
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              <X size={16} />
              <span>重新规划</span>
            </button>
            <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
              <Check size={16} />
              <span>使用此配置</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (output.type === 'CHECKLIST_ITEMS') {
    const data = output.data as ChecklistItemsData;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>推荐清单</span>
          <span className={styles.count}>共 {data.items.length} 项</span>
        </div>
        <p className={styles.guideText}>为你整理了以下清单项目，确认后添加到任务中：</p>
        <div className={styles.list}>
          {data.items.map((item, index) => (
            <div key={index} className={styles.listItem}>
              <span className={styles.bullet}>{index + 1}.</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        {showActions && (
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              <X size={16} />
              <span>重新整理</span>
            </button>
            <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
              <Check size={16} />
              <span>添加到清单</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default ActionPreview;
