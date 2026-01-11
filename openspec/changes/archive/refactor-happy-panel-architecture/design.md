# Design: Happy Panel 架构重构

## Context

Happy Panel（度假模式）是 DC 模块中的一个独立面板，用于管理旅行行程和目标。当前实现存在架构问题，需要按照 DC 模块的标准规范进行重构。

### 当前架构

```
src/pages/dc/panels/happy/
├── AddGoalModal.tsx        # 添加目标弹窗（含重复的 isScheduleExpired）
├── CreateTripModal.tsx     # 创建行程弹窗
├── DayTabs.tsx             # 日程切换栏（含重复的 isScheduleExpired）
├── GoalCard.tsx            # 目标卡片
├── storage.ts              # 数据存储工具
├── TripList.tsx            # 行程列表
├── TripSummaryModal.tsx    # 行程总结弹窗
├── types.ts                # 类型定义
├── VacationContent.tsx     # 主内容组件（500+ 行，职责过重）
├── GoalDetailModal/        # 目标详情弹窗
│   ├── index.tsx
│   └── styles.css
└── TripDetailModal/        # 行程详情弹窗
    ├── index.tsx
    └── styles.css
```

### 问题分析

1. **VacationContent.tsx 职责过重**
   - 管理 6 个状态变量
   - 包含 10+ 个业务函数
   - 直接渲染复杂 UI
   - 代码量 500+ 行

2. **重复代码**
   - `isScheduleExpired` 在 3 个文件中重复定义
   - 日期计算逻辑分散在多处

3. **样式不规范**
   - 大量内联样式
   - 未使用 CSS Modules
   - 颜色值硬编码

## Goals / Non-Goals

### Goals
- 遵循 DC 模块的标准目录结构和设计规范
- 实现关注点分离：状态管理、业务逻辑、UI 渲染
- 消除重复代码
- 提高代码可维护性和可测试性
- 保持对外接口不变

### Non-Goals
- 不改变功能行为
- 不修改数据结构
- 不影响其他 DC 模块

## Decisions

### 1. 目录结构设计

```
src/pages/dc/panels/happy/
├── index.tsx                    # 入口文件，包含 Provider 包装
├── types.ts                     # 类型定义（保持不变）
├── storage.ts                   # 数据存储（保持不变）
├── components/                  # UI 组件
│   ├── index.ts                 # 统一导出
│   ├── VacationContent/         # 主内容组件（简化后）
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── TripList/                # 行程列表
│   │   ├── index.tsx
│   │   ├── TripCard.tsx
│   │   └── styles.module.css
│   ├── DayTabs/                 # 日程切换栏
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── GoalCard/                # 目标卡片
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── GoalDetailModal/         # 目标详情弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── TripDetailModal/         # 行程详情弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── AddGoalModal/            # 添加目标弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── CreateTripModal/         # 创建行程弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── TripSummaryModal/        # 行程总结弹窗
│       ├── index.tsx
│       └── styles.module.css
├── contexts/                    # 状态管理
│   ├── index.ts
│   └── VacationContext.tsx
├── hooks/                       # 自定义 Hooks
│   ├── index.ts
│   ├── useTrips.ts              # 行程 CRUD
│   ├── useSchedule.ts           # 日程逻辑
│   ├── useGoals.ts              # 目标管理
│   └── useTripNavigation.ts     # 行程导航
└── utils/                       # 工具函数
    ├── index.ts
    ├── scheduleHelper.ts        # 日程相关工具
    └── dateHelper.ts            # 日期计算工具
```

### 2. Context 设计

```typescript
// VacationContext.tsx
interface VacationContextValue {
  // 状态
  trips: Trip[];
  currentTrip: Trip | null;
  currentScheduleId: string;
  
  // 行程操作
  selectTrip: (tripId: string) => void;
  createTrip: (data: CreateTripData) => void;
  deleteTrip: (tripId: string) => void;
  clearCurrentTrip: () => void;
  
  // 日程操作
  selectSchedule: (scheduleId: string) => void;
  
  // 目标操作
  addGoal: (scheduleId: string, goal: GoalData) => void;
  updateGoal: (scheduleId: string, goalId: string, updates: Partial<TripGoal>) => void;
  deleteGoal: (scheduleId: string, goalId: string) => void;
  completeGoal: (scheduleId: string, goalId: string) => void;
  
  // 刷新
  refreshData: () => void;
}
```

### 3. Hooks 设计

```typescript
// useTrips.ts - 行程 CRUD 操作
function useTrips() {
  return {
    trips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTrip,
    refreshTrips
  };
}

// useSchedule.ts - 日程相关逻辑
function useSchedule(trip: Trip | null) {
  return {
    currentSchedule,
    scheduleStats,
    isScheduleExpired,
    findCurrentSchedule,
    selectSchedule
  };
}

// useGoals.ts - 目标管理
function useGoals(tripId: string, scheduleId: string) {
  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal
  };
}

// useTripNavigation.ts - 行程导航逻辑
function useTripNavigation(trips: Trip[]) {
  return {
    findUpcomingOrActiveTrip,
    findCurrentSchedule
  };
}
```

### 4. 工具函数整合

```typescript
// utils/scheduleHelper.ts
export function isScheduleExpired(schedule: TripSchedule): boolean;
export function hasFailedGoals(schedule: TripSchedule): boolean;
export function getScheduleStats(schedule: TripSchedule): ScheduleStats;
export function getScheduleStatusColor(schedule: TripSchedule): string;

// utils/dateHelper.ts
export function formatDate(dateStr: string): string;
export function getDaysDiff(date1: string, date2: string): number;
export function isDateInRange(date: string, start: string, end: string): boolean;
```

### 5. 样式规范

使用 CSS Modules，遵循 DC 模块设计规范：

```css
/* 颜色变量 */
--text-primary: rgb(55, 53, 47);
--text-secondary: rgba(55, 53, 47, 0.65);
--text-muted: rgba(55, 53, 47, 0.5);
--bg-card: #ffffff;
--bg-hover: #f5f5f5;
--border-light: rgba(55, 53, 47, 0.09);
--color-success: #4CAF50;
--color-error: #e74c3c;

/* 间距 */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;

/* 圆角 */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;
```

## Risks / Trade-offs

### Risks
1. **重构范围较大**：涉及多个文件的修改，需要仔细测试
   - Mitigation: 分阶段实施，每阶段完成后进行功能验证

2. **可能引入回归问题**：UI 行为可能发生细微变化
   - Mitigation: 保持对外接口不变，逐个组件迁移

### Trade-offs
1. **文件数量增加** vs **代码可维护性提升**
   - 选择：接受文件数量增加，换取更好的代码组织

2. **短期开发成本** vs **长期维护成本**
   - 选择：投入短期重构成本，降低长期维护成本

## Migration Plan

### Phase 1: 基础设施
1. 创建目录结构
2. 实现工具函数整合
3. 创建 VacationContext

### Phase 2: Hooks 抽取
1. 实现 useTrips hook
2. 实现 useSchedule hook
3. 实现 useGoals hook
4. 实现 useTripNavigation hook

### Phase 3: 组件迁移
1. 迁移 DayTabs 组件
2. 迁移 GoalCard 组件
3. 迁移 TripList 组件
4. 迁移各 Modal 组件

### Phase 4: 样式规范化
1. 创建 CSS Modules 文件
2. 迁移内联样式
3. 统一设计 token

### Phase 5: 清理
1. 删除旧文件
2. 更新导出
3. 功能验证

## Open Questions

1. 是否需要为 Modal 组件创建统一的基础组件？
2. 是否需要将 storage.ts 也迁移到 Context 中管理？
