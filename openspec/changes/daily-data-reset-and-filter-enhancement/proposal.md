# Proposal: 每日数据重置与一日清单筛选增强

## Summary

实现每日数据自动重置机制和优化一日清单任务筛选逻辑，同时提供设置中的时间测试功能用于验证。

## Motivation

当前系统存在以下问题：
1. **每日数据未自动重置**：当天的进度数据（todayProgress）在新的一天不会自动清空，导致数据不准确
2. **周期状态未自动更新**：如果用户多天未打开应用，周期序号和状态不会自动推进
3. **一日清单筛选逻辑不够智能**：缺乏对周期N次任务的智能分配，以及基于完成率的优先级排序
4. **缺乏测试手段**：无法方便地验证日期变更逻辑是否正确工作

## Goals

1. 实现跨天检测机制，在应用启动或激活时自动检测日期变更
2. 日期变更时自动重置 todayProgress 和清空一日清单缓存
3. 自动推进任务周期到正确日期，并结算周期状态
4. 优化一日清单筛选逻辑，支持优先级排序和动态数量控制
5. 在设置中提供时间测试功能，方便验证日期变更逻辑

## Non-Goals

- 不修改任务的核心数据结构
- 不改变现有的周期结算逻辑
- 不影响其他场景（vacation、memorial、okr）的数据

## Proposed Solution

### 1. 日期检测机制

使用 localStorage 存储上次访问日期，在以下时机检测日期变更：
- App 初始化时（冷启动）
- visibilitychange 事件（tab 激活）
- online 事件（网络恢复）
- 场景切换时（normal、vacation、memorial、okr 之间切换）
- 页面切换时（设置页面、详情页打开）

### 2. 数据重置流程

当检测到日期变更时：
1. 清空 `dc_daily_view_cache`
2. 重置所有任务的 `todayProgress`
3. 检查并推进周期到正确日期
4. 根据周期结算 status

### 3. 一日清单筛选规则

**排除规则**：
- 已完成、归档的任务
- 总进度≥100%的任务
- 当前周期进度≥100%的任务

**必显示规则**：
- 每日打卡任务（有 dailyTarget）
- 快临期任务（剩余≤30%周期时间）

**动态显示规则**：
- 时间充裕任务数量控制：
  - 前面≤3个 → 最多3个
  - 前面4-5个 → 最多2个
  - 前面≥6个 → 最多1个
- 选择策略：加权概率，完成率越低权重越高

### 4. 设置中的时间测试功能

在设置面板中添加开发者选项：
- 显示当前系统日期
- 提供日期选择器，可手动设置测试日期
- 触发日期变更逻辑，验证数据重置是否正确

## Impact

### Affected Components
- `src/pages/dc/contexts/AppProvider/` - 添加日期检测
- `src/pages/dc/contexts/SceneProvider/` - 集成数据重置
- `src/pages/dc/utils/dailyViewFilter.ts` - 优化筛选逻辑
- `src/pages/dc/utils/dailyViewCache.ts` - 缓存清理
- `src/pages/dc/panels/settings/` - 添加时间测试功能

### New Files
- `src/pages/dc/utils/dateTracker.ts` - 日期检测工具
- `src/pages/dc/utils/dailyDataReset.ts` - 数据重置工具

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| 周期推进可能导致数据丢失 | 推进前记录周期结算日志 |
| 时间测试功能可能被误用 | 仅在开发模式下显示 |
| 筛选逻辑变更可能影响用户体验 | 保持核心规则不变，仅优化边缘情况 |

## Timeline

预计实现时间：2-3小时

## Approval

- [ ] 产品确认
- [ ] 技术评审
