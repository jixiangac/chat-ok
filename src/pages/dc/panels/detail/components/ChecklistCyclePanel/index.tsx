import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Check, Plus, ChevronRight, CheckCircle2, X, Calendar } from 'lucide-react';
import { SwipeAction, Toast, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import type { Task, ChecklistItem } from '../../../../types';
import type { CurrentCycleInfo } from '../../types';
import { useCultivation, useTheme } from '../../../../contexts';
import { InsufficientJadePopup } from '../../../../components';
import styles from '../../../../css/ChecklistCyclePanel.module.css';

// 格式化完成时间
const formatCompletedTime = (isoTime: string): string => {
  const time = dayjs(isoTime);
  const today = dayjs();
  if (time.isSame(today, 'day')) {
    return `今天 ${time.format('HH:mm')}`;
  }
  if (time.isSame(today.subtract(1, 'day'), 'day')) {
    return `昨天 ${time.format('HH:mm')}`;
  }
  return time.format('M月D日 HH:mm');
};

// 判断是否今天完成
const isCompletedToday = (item: ChecklistItem): boolean => {
  if (!item.completedAt || item.status !== 'COMPLETED') return false;
  return dayjs(item.completedAt).isSame(dayjs(), 'day');
};

// 灵玉消耗常量
const POSTPONE_COST = 2;  // 延后到下周期消耗 2 灵玉
const ADD_TO_CURRENT_COST = 1;  // 加入当前周期消耗 1 灵玉

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

// 确认弹窗头图
const CONFIRM_HEADER_IMAGE = 'https://gw.alicdn.com/imgextra/i2/O1CN01UPJlbL229K4qqUhj7_!!6000000007077-2-tps-1080-978.png';

interface ChecklistCyclePanelProps {
  goal: Task;
  cycle: CurrentCycleInfo;
  onUpdateChecklistItem?: (itemId: string, updates: { status?: string; cycle?: number }) => Promise<boolean>;
  onBatchUpdateCycle?: (itemIds: string[], cycle: number) => Promise<boolean>;
}

export default function ChecklistCyclePanel({
  goal,
  cycle,
  onUpdateChecklistItem,
  onBatchUpdateCycle,
}: ChecklistCyclePanelProps) {
  const [showAddMorePopup, setShowAddMorePopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [insufficientJadePopup, setInsufficientJadePopup] = useState<{
    visible: boolean;
    requiredAmount: number;
  }>({ visible: false, requiredAmount: 0 });

  // 移到下周期确认弹窗
  const [postponeConfirm, setPostponeConfirm] = useState<{
    visible: boolean;
    item: ChecklistItem | null;
  }>({ visible: false, item: null });

  // 修仙数据（用于灵玉消耗）
  const { spiritJadeData, canSpendSpiritJade, spendSpiritJade } = useCultivation();
  // 主题颜色
  const { themeColors } = useTheme();

  const config = goal.checklistConfig;
  const items = config?.items || [];
  const isPlanEnded = goal.isPlanEnded || goal.status === 'ARCHIVED' || goal.status === 'COMPLETED';

  // 计划结束状态的统计数据（必须在 early return 之前调用所有 hooks）
  const summaryData = useMemo(() => {
    if (!isPlanEnded || !config) return null;

    const totalItems = items.length;
    const completedItems = items.filter(item => item.status === 'COMPLETED').length;
    const pendingItems = totalItems - completedItems;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const isSuccess = completionRate >= 100;

    return {
      totalItems,
      completedItems,
      pendingItems,
      completionRate,
      isSuccess,
      totalCycles: goal.cycle.totalCycles,
      currentCycle: goal.cycle.currentCycle,
      startDate: goal.time.startDate,
      endDate: goal.time.endDate,
    };
  }, [isPlanEnded, items, goal, config]);

  // 本周期的清单项（必须在 early return 之前定义）
  const cycleItems = config ? items.filter(item => item.cycle === cycle.cycleNumber) : [];

  // 本周期未完成的清单项（有 originalCycle 的项置顶）
  const pendingCycleItems = useMemo(() => {
    if (!config) return [];
    const pending = cycleItems.filter(item => item.status !== 'COMPLETED');
    // 排序：有 originalCycle 的项（遗留项）置顶，按 originalCycle 升序
    return pending.sort((a, b) => {
      const aHasOriginal = a.originalCycle !== undefined;
      const bHasOriginal = b.originalCycle !== undefined;
      if (aHasOriginal && !bHasOriginal) return -1;
      if (!aHasOriginal && bHasOriginal) return 1;
      if (aHasOriginal && bHasOriginal) {
        return (a.originalCycle ?? 0) - (b.originalCycle ?? 0);
      }
      return 0;
    });
  }, [cycleItems, config]);

  // 计算选中项的总消耗（必须在 early return 之前定义）
  const totalCost = useMemo(() => selectedItems.size * ADD_TO_CURRENT_COST, [selectedItems.size]);

  // Early return 必须在所有 hooks 之后
  if (!config) {
    return <div className={styles.container}>清单配置缺失</div>;
  }

  // 如果计划已结束，显示总结视图
  if (isPlanEnded && summaryData) {
    return (
      <div className={styles.summaryContainer}>
        {/* 总结信息行 - 参考 CycleInfo 样式 */}
        <div className={styles.summaryWrapper}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <span className={styles.label}>周期</span>
              <span className={styles.value}>
                <strong>{summaryData.currentCycle}</strong>
                <span className={styles.separator}>/</span>
                <span className={styles.total}>{summaryData.totalCycles}</span>
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.infoItem}>
              <span className={styles.label}>完成率</span>
              <span className={styles.value}>
                <strong>{summaryData.completionRate}</strong>
                <span className={styles.total}>%</span>
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.infoItem}>
              <span className={styles.label}>状态</span>
              <span className={styles.value}>
                <strong className={summaryData.isSuccess ? styles.successText : styles.warningText}>
                  {summaryData.isSuccess ? '全部完成' : '部分完成'}
                </strong>
              </span>
            </div>
          </div>

          {/* 日期行 */}
          <div className={styles.dateRangeSummary}>
            <div className={styles.dateLeft}>
              <Calendar size={14} className={styles.iconSummary} />
              <span>{dayjs(summaryData.startDate).format('YYYY-MM-DD')} - {dayjs(summaryData.endDate).format('YYYY-MM-DD')}</span>
            </div>
            <div className={styles.resultValue}>
              <span className={styles.resultLabel}>完成</span>
              <span className={styles.resultCurrent}>{summaryData.completedItems}/{summaryData.totalItems}项</span>
            </div>
          </div>
        </div>

        {/* 完整清单列表（只读） */}
        <div className={styles.summaryListSection}>
          <div className={styles.sectionHeader}>
            <CheckCircle2 size={14} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>全部清单 ({summaryData.completedItems}/{items.length})</span>
          </div>

          <div className={styles.summaryListContainer}>
            {items.map(item => (
              <div
                key={item.id}
                className={`${styles.summaryListItem} ${item.status === 'COMPLETED' ? styles.completed : ''}`}
              >
                <div className={`${styles.summaryCheckbox} ${item.status === 'COMPLETED' ? styles.checked : ''}`}>
                  {item.status === 'COMPLETED' && <Check size={12} strokeWidth={3} />}
                </div>
                <div className={styles.summaryItemContent}>
                  <div className={styles.summaryItemTitle}>{item.title}</div>
                  <div className={styles.summaryItemMeta}>
                    第 {item.cycle} 周期
                    {item.status === 'COMPLETED' && item.completedAt && (
                      <> · 完成于 {dayjs(item.completedAt).format('M月D日')}</>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 本周期已完成数量
  const cycleCompleted = cycleItems.filter(item => item.status === 'COMPLETED').length;

  // 今日已完成的清单项（本周期内），按完成时间升序排列（最早完成的在前，最新完成的在后）
  const todayCompletedItems = cycleItems
    .filter(isCompletedToday)
    .sort((a, b) => {
      const timeA = a.completedAt ? dayjs(a.completedAt).valueOf() : 0;
      const timeB = b.completedAt ? dayjs(b.completedAt).valueOf() : 0;
      return timeA - timeB; // 升序：时间越早越前，时间越晚越后
    });

  // 已完成项折叠显示逻辑
  const DEFAULT_VISIBLE_COUNT = 2;
  const hasMoreCompleted = todayCompletedItems.length > DEFAULT_VISIBLE_COUNT;
  // 折叠时显示最后（最新）的2项
  const visibleCompletedItems = showAllCompleted
    ? todayCompletedItems
    : todayCompletedItems.slice(-DEFAULT_VISIBLE_COUNT);

  // 非当前周期且未完成的清单项（可加入当前周期）
  const otherPendingItems = items.filter(
    item => item.cycle !== cycle.cycleNumber && item.status !== 'COMPLETED'
  );

  // 处理清单项点击（切换完成状态）
  // 注意：Toast 和奖励弹窗由详情页的 handleChecklistItemUpdate 统一处理
  const handleToggleItem = async (item: ChecklistItem) => {
    if (!onUpdateChecklistItem) return;

    const newStatus = item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await onUpdateChecklistItem(item.id, { status: newStatus });
    // 奖励弹窗会自动显示，不需要在这里显示 Toast
  };

  // 处理延后到下周期 - 显示确认弹窗
  const handlePostponeClick = (item: ChecklistItem) => {
    if (!onUpdateChecklistItem) return;

    // 检查灵玉是否足够
    if (!canSpendSpiritJade(POSTPONE_COST)) {
      setInsufficientJadePopup({ visible: true, requiredAmount: POSTPONE_COST });
      return;
    }

    // 显示确认弹窗
    setPostponeConfirm({ visible: true, item });
  };

  // 确认延后到下周期
  const handleConfirmPostpone = async () => {
    if (!onUpdateChecklistItem || !postponeConfirm.item) return;

    setIsSubmitting(true);

    try {
      const item = postponeConfirm.item;

      // 扣除灵玉
      spendSpiritJade({
        amount: POSTPONE_COST,
        source: 'CHECKLIST_POSTPONE',
        taskId: goal.id,
        taskTitle: goal.title,
        description: `延后清单项「${item.title}」到下周期`,
      });

      // 更新清单项周期
      const nextCycle = cycle.cycleNumber + 1;
      const success = await onUpdateChecklistItem(item.id, { cycle: nextCycle });

      if (success) {
        Toast.show({ content: '已移到下周期', icon: 'success' });
        setPostponeConfirm({ visible: false, item: null });
      } else {
        Toast.show({ content: '操作失败', icon: 'fail' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 切换选中状态
  const handleToggleSelect = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // 处理提交按钮点击
  const handleSubmitClick = () => {
    if (selectedItems.size === 0) return;

    // 检查灵玉是否足够
    if (!canSpendSpiritJade(totalCost)) {
      setInsufficientJadePopup({ visible: true, requiredAmount: totalCost });
      return;
    }

    // 显示确认弹窗
    setShowConfirmModal(true);
  };

  // 确认添加选中的清单项
  const handleConfirmAdd = async () => {
    if (selectedItems.size === 0) return;
    // 优先使用批量更新，如果没有则回退到单个更新
    if (!onBatchUpdateCycle && !onUpdateChecklistItem) return;

    setIsSubmitting(true);

    try {
      // 获取选中的清单项 ID
      const itemIds = otherPendingItems
        .filter(item => selectedItems.has(item.id))
        .map(item => item.id);

      // 扣除灵玉
      spendSpiritJade({
        amount: totalCost,
        source: 'CHECKLIST_ADD_TO_CURRENT',
        taskId: goal.id,
        taskTitle: goal.title,
        description: `将 ${itemIds.length} 个清单项加入当前周期`,
      });

      let success = false;

      // 优先使用批量更新（一次性更新所有项，避免并发问题）
      if (onBatchUpdateCycle) {
        success = await onBatchUpdateCycle(itemIds, cycle.cycleNumber);
      } else if (onUpdateChecklistItem) {
        // 回退：顺序更新（可能有并发问题）
        let successCount = 0;
        for (const itemId of itemIds) {
          const result = await onUpdateChecklistItem(itemId, { cycle: cycle.cycleNumber });
          if (result) successCount++;
        }
        success = successCount === itemIds.length;
      }

      if (success) {
        Toast.show({ content: `已添加 ${itemIds.length} 个清单项`, icon: 'success' });
        setSelectedItems(new Set());
        setShowConfirmModal(false);
        setShowAddMorePopup(false);
      } else {
        Toast.show({ content: '操作失败', icon: 'fail' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 关闭弹窗时重置选择
  const handleClosePopup = () => {
    setShowAddMorePopup(false);
    setSelectedItems(new Set());
  };

  // 渲染待办清单项（带滑动操作）
  const renderPendingItem = (item: ChecklistItem) => {
    const hasOriginalCycle = item.originalCycle !== undefined;
    const itemContent = (
      <div
        className={`${styles.listItem} ${hasOriginalCycle ? styles.carryoverItem : ''}`}
        onClick={() => handleToggleItem(item)}
      >
        <div className={styles.itemCheckbox} />
        <div className={styles.itemContent}>
          <div className={styles.itemTitle}>{item.title}</div>
          {hasOriginalCycle && (
            <div className={styles.itemCarryoverHint}>
              来自第 {item.originalCycle} 周期
            </div>
          )}
        </div>
      </div>
    );

    // 只读模式不显示滑动操作
    if (!onUpdateChecklistItem) {
      return <div key={item.id}>{itemContent}</div>;
    }

    return (
      <SwipeAction
        key={item.id}
        rightActions={[
          {
            key: 'postpone',
            text: (
              <div className={styles.swipeActionContent}>
                <span className={styles.swipeActionTitle}>下周期</span>
                <span className={styles.swipeActionCost}>
                  <img src={SPIRIT_JADE_ICON} alt="" className={styles.swipeActionIcon} />
                  {POSTPONE_COST}
                </span>
              </div>
            ),
            color: '#FF9500',
            onClick: () => handlePostponeClick(item),
          },
        ]}
        style={{ borderRadius: 12, overflow: 'hidden' }}
      >
        {itemContent}
      </SwipeAction>
    );
  };

  // 渲染已完成清单项（今日记录用）
  const renderCompletedItem = (item: ChecklistItem) => {
    return (
      <div
        key={item.id}
        className={`${styles.listItem} ${styles.completed}`}
        onClick={() => handleToggleItem(item)}
      >
        <div className={`${styles.itemCheckbox} ${styles.checked}`}>
          <Check size={14} strokeWidth={3} />
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemTitle}>{item.title}</div>
        </div>
        {item.completedAt && (
          <div className={styles.itemTime}>
            {formatCompletedTime(item.completedAt)}
          </div>
        )}
      </div>
    );
  };

  // 渲染可加入当前周期的清单项（多选模式）
  const renderSelectableItem = (item: ChecklistItem) => {
    const isSelected = selectedItems.has(item.id);
    return (
      <div
        key={item.id}
        className={`${styles.selectableItem} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleToggleSelect(item.id)}
      >
        <div className={`${styles.selectCheckbox} ${isSelected ? styles.checked : ''}`}>
          {isSelected && <Check size={12} strokeWidth={3} />}
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemTitle}>{item.title}</div>
          <div className={styles.itemMeta}>
            原计划: 第 {item.cycle} 周期
          </div>
        </div>
      </div>
    );
  };

  // 确认弹窗
  const renderConfirmModal = () => {
    if (!showConfirmModal) return null;

    const isInsufficient = !canSpendSpiritJade(totalCost);

    return createPortal(
      <div className={styles.confirmOverlay} onClick={() => setShowConfirmModal(false)}>
        <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
          {/* 头图 */}
          <div className={styles.confirmHeader}>
            <button className={styles.confirmCloseBtn} onClick={() => setShowConfirmModal(false)}>
              <X size={20} />
            </button>
            <img src={CONFIRM_HEADER_IMAGE} alt="" className={styles.confirmHeaderImg} />
          </div>

          {/* 内容 */}
          <div className={styles.confirmContent}>
            <div className={styles.confirmTitle}>确认添加清单</div>

            {/* 消耗信息 */}
            <div className={styles.confirmCostSection}>
              <div className={styles.confirmCostRow}>
                <span className={styles.confirmCostLabel}>移动清单数量</span>
                <span className={styles.confirmCostValue}>{selectedItems.size} 项</span>
              </div>
              <div className={styles.confirmCostRow}>
                <span className={styles.confirmCostLabel}>消耗灵玉</span>
                <span className={styles.confirmCostValue}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.confirmJadeIcon} />
                  {totalCost}
                </span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmCostRow}>
                <span className={styles.confirmCostLabel}>当前余额</span>
                <span className={`${styles.confirmCostValue} ${isInsufficient ? styles.insufficient : ''}`}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.confirmJadeIcon} />
                  {spiritJadeData.balance}
                </span>
              </div>
              {isInsufficient && (
                <div className={styles.confirmWarning}>
                  灵玉不足，还差 {totalCost - spiritJadeData.balance} 灵玉
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmCancelBtn}
                onClick={() => setShowConfirmModal(false)}
              >
                取消
              </button>
              <button
                className={`${styles.confirmSubmitBtn} ${isInsufficient ? styles.disabled : ''}`}
                onClick={handleConfirmAdd}
                disabled={isInsufficient || isSubmitting}
                style={{ backgroundColor: isInsufficient ? undefined : themeColors.primary }}
              >
                {isSubmitting ? '处理中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // 移到下周期确认弹窗
  const renderPostponeConfirmModal = () => {
    if (!postponeConfirm.visible || !postponeConfirm.item) return null;

    const item = postponeConfirm.item;
    const isInsufficient = !canSpendSpiritJade(POSTPONE_COST);

    return createPortal(
      <div className={styles.confirmOverlay} onClick={() => setPostponeConfirm({ visible: false, item: null })}>
        <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
          {/* 头图 */}
          <div className={styles.confirmHeader}>
            <button className={styles.confirmCloseBtn} onClick={() => setPostponeConfirm({ visible: false, item: null })}>
              <X size={20} />
            </button>
            <img src={CONFIRM_HEADER_IMAGE} alt="" className={styles.confirmHeaderImg} />
          </div>

          {/* 内容 */}
          <div className={styles.confirmContent}>
            <div className={styles.confirmTitle}>移到下周期</div>

            {/* 清单项名称 */}
            <div className={styles.confirmItemName}>「{item.title}」</div>

            {/* 消耗信息 */}
            <div className={styles.confirmCostSection}>
              <div className={styles.confirmCostRow}>
                <span className={styles.confirmCostLabel}>消耗灵玉</span>
                <span className={styles.confirmCostValue}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.confirmJadeIcon} />
                  {POSTPONE_COST}
                </span>
              </div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmCostRow}>
                <span className={styles.confirmCostLabel}>当前余额</span>
                <span className={`${styles.confirmCostValue} ${isInsufficient ? styles.insufficient : ''}`}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.confirmJadeIcon} />
                  {spiritJadeData.balance}
                </span>
              </div>
              {isInsufficient && (
                <div className={styles.confirmWarning}>
                  灵玉不足，还差 {POSTPONE_COST - spiritJadeData.balance} 灵玉
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmCancelBtn}
                onClick={() => setPostponeConfirm({ visible: false, item: null })}
              >
                取消
              </button>
              <button
                className={`${styles.confirmSubmitBtn} ${isInsufficient ? styles.disabled : ''}`}
                onClick={handleConfirmPostpone}
                disabled={isInsufficient || isSubmitting}
                style={{ backgroundColor: isInsufficient ? undefined : themeColors.primary }}
              >
                {isSubmitting ? '处理中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={styles.container}>
      {/* 今日已完成 */}
      {todayCompletedItems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <CheckCircle2 size={14} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>今日已完成 ({todayCompletedItems.length})</span>
          </div>

          <div className={styles.listContainer}>
            {/* 展开更多按钮 - 在顶部显示 */}
            {hasMoreCompleted && !showAllCompleted && (
              <div
                className={styles.expandButton}
                onClick={() => setShowAllCompleted(true)}
              >
                显示更早的 {todayCompletedItems.length - DEFAULT_VISIBLE_COUNT} 项
              </div>
            )}
            {visibleCompletedItems.map(item => renderCompletedItem(item))}
            {/* 收起按钮 */}
            {hasMoreCompleted && showAllCompleted && (
              <div
                className={styles.collapseButton}
                onClick={() => setShowAllCompleted(false)}
              >
                收起
              </div>
            )}
          </div>
        </div>
      )}

      {/* 待办清单 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>待办 ({pendingCycleItems.length})</span>
        </div>

        <div className={styles.listContainer}>
          {pendingCycleItems.length > 0 ? (
            pendingCycleItems.map(item => renderPendingItem(item))
          ) : (
            <div className={styles.emptyHint}>
              {cycleCompleted > 0 ? '本周期清单已全部完成 🎉' : '本周期暂无清单项'}
            </div>
          )}
        </div>

        {/* 加入更多清单入口 */}
        {otherPendingItems.length > 0 && onUpdateChecklistItem && (
          <div
            className={styles.addMoreEntry}
            onClick={() => setShowAddMorePopup(true)}
          >
            <Plus size={16} />
            <span>加入更多清单...</span>
            <span className={styles.addMoreCount}>{otherPendingItems.length}</span>
            <ChevronRight size={16} />
          </div>
        )}
      </div>


      {/* 加入更多清单弹窗 */}
      <Popup
        visible={showAddMorePopup}
        onMaskClick={handleClosePopup}
        position="bottom"
        getContainer={() => document.body}
        style={{ '--z-index': 2000 } as React.CSSProperties}
        bodyStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className={styles.addMorePopup}>
          <div className={styles.popupHeader}>
            <span>选择要加入的清单</span>
            <span className={styles.popupClose} onClick={handleClosePopup}>×</span>
          </div>

          <div className={styles.popupContent}>
            {otherPendingItems.length > 0 ? (
              otherPendingItems.map(renderSelectableItem)
            ) : (
              <div className={styles.emptyHint}>没有可加入的清单项</div>
            )}
          </div>

          {/* 底部提交栏 - 常驻显示 */}
          <div className={styles.popupFooter}>
            <div className={styles.footerInfo}>
              <span className={styles.footerCount}>
                {selectedItems.size > 0 ? `已选 ${selectedItems.size} 项` : '请选择清单项'}
              </span>
              <span className={styles.footerCost}>
                消耗
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.footerJadeIcon} />
                {totalCost}
              </span>
            </div>
            <button
              className={`${styles.footerSubmitBtn} ${selectedItems.size === 0 ? styles.disabled : ''}`}
              onClick={handleSubmitClick}
              disabled={selectedItems.size === 0}
              style={{ backgroundColor: selectedItems.size === 0 ? undefined : themeColors.primary }}
            >
              确认添加
            </button>
          </div>
        </div>
      </Popup>

      {/* 添加清单确认弹窗 */}
      {renderConfirmModal()}

      {/* 移到下周期确认弹窗 */}
      {renderPostponeConfirmModal()}

      {/* 灵玉不足弹窗 */}
      <InsufficientJadePopup
        visible={insufficientJadePopup.visible}
        currentBalance={spiritJadeData.balance}
        requiredAmount={insufficientJadePopup.requiredAmount}
        onClose={() => setInsufficientJadePopup({ visible: false, requiredAmount: 0 })}
      />
    </div>
  );
}
