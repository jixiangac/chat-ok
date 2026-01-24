## Context

本次变更涉及 6 个功能点，跨越多个模块。需要确保各功能独立实现、互不干扰，同时保持 UI 一致性。

## Goals / Non-Goals

**Goals:**
- 提升 AI 聊天到任务创建的转化体验
- 优化清单类任务的详情页交互
- 完善归档任务的查看能力
- 统一纪念日创建的交互范式
- 支持任务类型灵活转换
- 修复奖励上限 BUG

**Non-Goals:**
- 不新增任务类型
- 不修改周期计算逻辑
- 不重构整体数据结构

## Decisions

### 1. 通用聊天任务卡片处理

**Decision:** 在 DCPage 层面处理 general 角色的 onStructuredOutput，而非在 AgentChat 内部

**Rationale:** 
- CreateTaskModal 需要访问 TaskContext
- 状态提升到 DCPage 便于统一管理
- 复用现有 CreateTaskModal 的 initialState 机制

**AI 行为约束（需在 System Prompt 中明确）:**
- 仅当用户明确表达创建任务意图时才输出 TASK_CONFIG
- 判断关键词：“创建任务”、“新建目标”、“帮我建个”、“添加任务”等
- 禁止在用户闲聊、询问或未明确说明创建意图时主动推荐任务配置

**Implementation:**
```typescript
// DCPage.tsx
const handleGeneralOutput = (output: StructuredOutput) => {
  if (output.type === 'TASK_CONFIG') {
    setCreateModalInitialState(output.data);
    setShowCreateModal(true);
  }
};
```

### 2. 清单详情页布局

**Decision:** 重构 ChecklistCyclePanel 组件，移除顶部进度可视化，直接展示清单列表

**Rationale:**
- 清单类型与水位隐喻不符
- 需要支持清单项操作（添加/延后）
- 用户对清单的核心需求是“看到并完成”

**Layout Structure:**
```
┌────────────────────────────────────────┐
│ DetailHeader                              │
├────────────────────────────────────────┤
│ 本周期清单 (3/5)                   📚 │
├────────────────────────────────────────┤
│ ☑️ 清单项A（已完成）                    │
│ ☑️ 清单项B（已完成）                    │
│ □ 清单项C    ← 右滑显示「移到下周期 💎2」  │
│ □ 清单项D                              │
│ □ 清单项E                              │
│ + 加入更多清单... (💎1/项)              │
├────────────────────────────────────────┤
│ CycleInfo 周期进展卡片 (与其他类型一致)    │
├────────────────────────────────────────┤
│ SecondaryNav (历史记录、周期计划)              │
└────────────────────────────────────────┘
```

**右滑操作实现 (antd-mobile SwipeAction):**
```typescript
import { SwipeAction } from 'antd-mobile';

<SwipeAction
  rightActions={[
    {
      key: 'postpone',
      text: '移到下周期',
      color: '#FF9500',
      onClick: () => handlePostponeClick(item)
    }
  ]}
>
  <ChecklistItem item={item} onCheck={handleCheck} />
</SwipeAction>
```

**二次确认弹窗组件 (ChecklistConfirmDialog):**
- 复用支线区域的弹窗 UI 风格 (SidelineTaskEditModal 样式)
- 支持「移到下周期」和「加入当前周期」两种操作
- 显示灵玉消耗提示

**renderProgressVisual 修改:**
```typescript
const renderProgressVisual = () => {
  if (taskCategory === 'CHECKLIST') {
    return null; // 清单类型不显示水杯/咖啡杯
  }
  // ... 其他类型逻辑
};
```

**清单项 UI 规范（触控友好）:**
- 每项最小高度 48px，符合 iOS/Android 触控设计指南
- 勾选框点击区域 padding 至少 12px
- 右滑操作触发阈值 30%，避免误触

**清单项周期分配逻辑:**
```typescript
// 初始化时平均分配
const itemsPerCycle = Math.ceil(totalItems / totalCycles);

// 周期结算时，未完成项自动延续
const getNextCycleItems = (currentCycleItems, nextCycleItems) => {
  const incomplete = currentCycleItems.filter(i => i.status !== 'COMPLETED');
  return [...incomplete, ...nextCycleItems];
};
```

### 3. 归档任务只读模式

**Decision:** 通过 `isReadOnly` prop 控制 GoalDetailModal 的显示逻辑

**Rationale:**
- 复用现有详情页组件，减少代码重复
- 通过 prop 控制比创建新组件更灵活
- 归档任务与活跃任务的数据结构一致

**Implementation:**
```typescript
// GoalDetailModal
interface GoalDetailModalProps {
  // ...
  isReadOnly?: boolean;  // 归档任务使用
}

// 只读模式下隐藏的元素
if (!isReadOnly) {
  // 显示打卡按钮、编辑按钮等
}
```

### 4. 纪念日步骤式创建

**Decision:** 参考 CreateTaskModal 的页面栈模式实现

**Rationale:**
- 保持交互一致性
- 复用 usePageStack hook
- 用户已熟悉该交互模式

**Steps:**
1. BasicInfoPage: 名称 + 日期选择
2. BackgroundPage: 图片/渐变/纯色选择
3. PreviewPage: 卡片效果预览 + 确认创建

### 5. 主线转支线机制

**Decision:** 仅修改 `type` 字段，不改变其他数据

**Rationale:**
- 主线和支线在数据结构上完全一致
- 用户期望保留所有进度
- 最小化变更风险

**Implementation:**
```typescript
const convertToSideline = (taskId: string) => {
  updateTask(taskId, { type: 'sidelineA' });
};
```

### 6. 奖励上限检查

**Decision:** 在 `awardCheckInReward` 函数中增加每日累计检查

**Rationale:**
- 集中在一处修改
- 不影响其他奖励计算逻辑
- 易于测试和维护

**Data Structure:**
```typescript
interface DailyRewardTracker {
  date: string;  // YYYY-MM-DD
  taskRewards: {
    [taskId: string]: {
      spiritJade: number;
      cultivation: number;
    }
  }
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 清单详情页重构可能影响现有用户习惯 | 保留周期进展卡片，仅替换今日进度区域 |
| 灵玉消耗点增多可能降低用户体验 | 消耗金额设定较低（1-2灵玉），有明确提示 |
| 归档任务数据量大可能影响详情页加载 | 复用现有组件，无额外数据请求 |

## Open Questions

- 纪念日创建是否需要支持编辑已有纪念日的流程复用？（建议：本期不考虑，编辑保持现有逻辑）
