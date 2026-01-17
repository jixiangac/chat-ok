# Tasks: 每日数据重置与一日清单筛选增强

## Overview

本任务清单按照实现顺序组织，每个任务都是可独立验证的工作单元。

---

## Phase 1: 日期检测机制

### Task 1.1: 创建日期追踪工具
**文件**: `src/pages/dc/utils/dateTracker.ts`

**工作内容**:
- [x] 创建 `DateTracker` 类或函数集
- [x] 实现 `getLastVisitedDate()` - 获取上次访问日期
- [x] 实现 `setLastVisitedDate(date)` - 设置访问日期
- [x] 实现 `checkDateChange()` - 检测日期是否变更
- [x] 实现 `getTestDate()` - 获取测试日期（如果设置）
- [x] 实现 `setTestDate(date)` - 设置测试日期
- [x] 实现 `clearTestDate()` - 清除测试日期

**验证**:
- 手动测试日期存储和读取
- 验证日期变更检测逻辑

**依赖**: 无

**状态**: ✅ 已完成

---

### Task 1.2: 创建数据重置工具
**文件**: `src/pages/dc/utils/dailyDataReset.ts`

**工作内容**:
- [x] 实现 `resetTodayProgress(task)` - 重置单个任务的今日进度
- [x] 实现 `shouldAdvanceCycle(task, targetDate)` - 判断是否需要推进周期
- [x] 实现 `calculateNewCycle(task, targetDate)` - 计算新的周期信息
- [x] 实现 `performDailyReset(tasks, targetDate)` - 执行完整的每日重置

**验证**:
- 单元测试各个函数
- 验证周期推进计算正确性

**依赖**: Task 1.1

**状态**: ✅ 已完成

---

### Task 1.3: 集成日期检测到 AppProvider
**文件**: `src/pages/dc/contexts/AppProvider/index.tsx`

**工作内容**:
- [x] 在 AppProvider 初始化时调用日期检测
- [x] 添加 visibilitychange 事件监听
- [x] 添加 online 事件监听
- [x] 日期变更时触发 `system-date-changed` 事件
- [x] 添加 `systemDate` 到 context value
- [x] 添加 `setTestDate` 方法到 context value
- [x] 添加 `checkDate` 方法供外部调用（场景切换、页面切换时使用）

**验证**:
- 验证冷启动时日期检测
- 验证 tab 切换时日期检测
- 验证网络恢复时日期检测
- 验证场景切换时日期检测
- 验证页面切换时日期检测

**依赖**: Task 1.1, Task 1.2

**状态**: ✅ 已完成

---

### Task 1.4: 集成数据重置到 SceneProvider
**文件**: `src/pages/dc/contexts/SceneProvider/index.tsx`

**工作内容**:
- [x] 监听 `system-date-changed` 事件
- [x] 调用 `performDailyReset` 重置任务数据
- [x] 清空一日清单缓存
- [x] 更新场景数据

**验证**:
- 验证日期变更后 todayProgress 被重置
- 验证周期正确推进
- 验证缓存被清空

**依赖**: Task 1.3

**状态**: ✅ 已完成

---

## Phase 2: 一日清单筛选优化

### Task 2.1: 重构筛选逻辑
**文件**: `src/pages/dc/utils/dailyViewFilter.ts`

**工作内容**:
- [x] 更新 `filterDailyViewTasks` 函数
- [x] 实现排除规则（已完成、归档、进度100%）
- [x] 实现必显示规则（每日打卡、快临期）
- [x] 实现 `isNearDeadline(task)` - 判断是否快临期（剩余≤30%周期时间）
- [x] 实现 `hasDailyTarget(task)` - 判断是否有每日目标

**验证**:
- 验证排除规则正确工作
- 验证必显示规则正确工作
- 验证快临期判断（30%周期时间）

**依赖**: 无

**状态**: ✅ 已完成

---

### Task 2.2: 实现动态数量控制
**文件**: `src/pages/dc/utils/dailyViewFilter.ts`

**工作内容**:
- [x] 实现 `calculateFlexibleTaskLimit(mandatoryCount)` - 计算时间充裕任务数量限制
- [x] 实现 `selectFlexibleTasks(tasks, limit)` - 选择时间充裕任务
- [x] 实现加权概率选择算法
- [x] 确保每天结果一致（使用任务ID+日期作为种子）

**验证**:
- 验证数量控制规则（≤3个→3个，4-5个→2个，≥6个→1个）
- 验证加权概率选择
- 验证每天结果一致性

**依赖**: Task 2.1

**状态**: ✅ 已完成

---

### Task 2.3: 更新 SceneProvider 中的筛选调用
**文件**: `src/pages/dc/contexts/SceneProvider/index.tsx`

**工作内容**:
- [x] 更新 `dailyViewTaskIds` 的计算逻辑
- [x] 确保使用新的筛选规则
- [x] 验证缓存机制正常工作

**验证**:
- 验证一日清单显示正确的任务
- 验证缓存在日期变更后被清空

**依赖**: Task 2.1, Task 2.2

**状态**: ✅ 已完成（使用现有的 filterDailyViewTasks，新增 filterDailyViewTasksEnhanced 可选使用）

---

## Phase 3: 设置中的时间测试功能

### Task 3.1: 添加时间测试 UI
**文件**: `src/pages/dc/panels/settings/pages/DateTestPage/`

**工作内容**:
- [x] 创建 `DateTestPage` 组件
- [x] 显示当前系统日期
- [x] 添加日期选择器（使用 antd-mobile DatePicker）
- [x] 添加"设置测试日期"按钮
- [x] 添加"清除测试日期"按钮
- [x] 添加"触发日期变更"按钮

**验证**:
- 验证 UI 正确显示
- 验证日期选择器工作正常

**依赖**: Task 1.3

**状态**: ✅ 已完成

---

### Task 3.2: 集成时间测试功能
**文件**: `src/pages/dc/panels/settings/`

**工作内容**:
- [x] 在设置面板中添加"开发者选项"区域
- [x] 集成 `DateTestPage` 组件
- [x] 连接 AppProvider 的 `setTestDate` 方法
- [x] 实现触发日期变更逻辑

**验证**:
- 验证设置测试日期后，系统使用测试日期
- 验证触发日期变更后，数据正确重置
- 验证清除测试日期后，恢复使用真实日期

**依赖**: Task 3.1

**状态**: ✅ 已完成

---

## Phase 4: 测试与验证

### Task 4.1: 端到端测试
**工作内容**:
- [ ] 测试场景1：正常跨天（关闭应用，第二天打开）
- [ ] 测试场景2：多天未打开（跳过多个周期）
- [ ] 测试场景3：使用测试日期功能验证
- [ ] 测试场景4：一日清单筛选规则验证

**验证**:
- 所有场景通过测试

**依赖**: 所有前置任务

**状态**: ⏳ 待验证

---

### Task 4.2: 代码审查与优化
**工作内容**:
- [ ] 代码审查
- [ ] 性能优化（如有必要）
- [ ] 文档更新

**验证**:
- 代码符合项目规范
- 无性能问题

**依赖**: Task 4.1

**状态**: ⏳ 待验证

---

## Summary

| Phase | Tasks | 预计时间 | 状态 |
|-------|-------|---------|------|
| Phase 1 | 4 tasks | 1小时 | ✅ 已完成 |
| Phase 2 | 3 tasks | 45分钟 | ✅ 已完成 |
| Phase 3 | 2 tasks | 30分钟 | ✅ 已完成 |
| Phase 4 | 2 tasks | 30分钟 | ⏳ 待验证 |
| **Total** | **11 tasks** | **~2.5小时** | **进行中** |

## 已创建/修改的文件

### 新建文件
1. `src/pages/dc/utils/dateTracker.ts` - 日期追踪工具
2. `src/pages/dc/utils/dailyDataReset.ts` - 每日数据重置工具
3. `src/pages/dc/panels/settings/pages/DateTestPage/index.tsx` - 日期测试页面
4. `src/pages/dc/panels/settings/pages/DateTestPage/styles.module.css` - 日期测试页面样式

### 修改文件
1. `src/pages/dc/utils/index.ts` - 导出新工具函数
2. `src/pages/dc/utils/dailyViewFilter.ts` - 添加快临期判断和动态数量控制
3. `src/pages/dc/contexts/AppProvider/types.ts` - 添加日期相关类型
4. `src/pages/dc/contexts/AppProvider/index.tsx` - 添加日期检测功能
5. `src/pages/dc/contexts/SceneProvider/index.tsx` - 添加日期变更事件监听
6. `src/pages/dc/panels/settings/pages/index.ts` - 导出 DateTestPage
7. `src/pages/dc/panels/settings/pages/SettingsMainPage/index.tsx` - 添加日期测试入口
8. `src/pages/dc/panels/settings/UnifiedSettingsPanel/index.tsx` - 添加日期测试页面路由
