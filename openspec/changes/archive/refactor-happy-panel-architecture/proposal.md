# Change: 重构 Happy Panel（度假模式）整体架构

## Why

当前 `src/pages/dc/panels/happy` 模块存在以下架构问题：

1. **组件职责过重**：`VacationContent.tsx` 承担了状态管理、业务逻辑、UI渲染等多重职责，代码量达 500+ 行，难以维护
2. **缺少 Context 管理**：所有状态都在顶层组件中管理，没有使用 DC 模块标准的 Context 模式，导致 props drilling
3. **缺少 Hooks 抽象**：业务逻辑（如行程查找、日程计算、目标管理）没有抽取到自定义 hooks 中，复用性差
4. **样式不统一**：大量内联样式，没有使用 CSS Modules，与 DC 模块规范不一致
5. **目录结构不规范**：没有遵循 DC 模块的标准目录结构（缺少 hooks/、css/、components/ 子目录）
6. **工具函数重复**：`isScheduleExpired` 函数在 `DayTabs.tsx`、`AddGoalModal.tsx`、`VacationContent.tsx` 中重复定义

## What Changes

### 1. 目录结构重组
- 创建 `components/` 子目录，将 UI 组件迁移进去
- 创建 `hooks/` 子目录，抽取业务逻辑 hooks
- 创建 `css/` 子目录，将内联样式迁移到 CSS Modules
- 创建 `contexts/` 子目录，实现 VacationContext

### 2. 状态管理重构
- 新增 `VacationContext` 管理全局状态（trips、currentTrip、currentSchedule）
- 新增 `VacationProvider` 组件包装整个模块

### 3. 业务逻辑抽取
- 新增 `useTrips` hook：行程 CRUD 操作
- 新增 `useSchedule` hook：日程相关逻辑
- 新增 `useGoals` hook：目标管理逻辑
- 新增 `useTripNavigation` hook：行程导航逻辑

### 4. 工具函数整合
- 将重复的 `isScheduleExpired` 等函数整合到 `utils/scheduleHelper.ts`
- 将日期计算逻辑整合到 `utils/dateHelper.ts`

### 5. 样式规范化
- 将所有内联样式迁移到 CSS Modules
- 统一使用 DC 模块的设计规范（颜色、间距、圆角等）

## Impact

- **Affected specs**: vacation-mode
- **Affected code**: 
  - `src/pages/dc/panels/happy/` 目录下所有文件
  - 不影响其他 DC 模块组件
- **Breaking changes**: 无，仅内部重构
- **Migration**: 无需迁移，保持对外接口不变
