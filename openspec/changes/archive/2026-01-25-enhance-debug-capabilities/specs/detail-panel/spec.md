# detail-panel Specification Delta

## ADDED Requirements

### Requirement: 任务详情调试功能

系统 **SHALL** 在开发者模式下提供任务时间调试功能，支持模拟进入下一天和下一周期。

#### Scenario: Debug 进入下一天

**GIVEN** 用户在开发者模式下打开任务详情页
**WHEN** 用户点击「Debug: 下一天」
**THEN** 系统执行以下操作：
- 增加任务的 `debugDayOffset`
- 基于模拟日期重新计算 `todayProgress`
- 如果模拟日期跨越周期边界，自动触发周期切换逻辑
- 更新周期进展信息（剩余天数、周期百分比）
- 后续的打卡记录和奖励计算均使用模拟日期

#### Scenario: Debug 进入下一周期

**GIVEN** 用户在开发者模式下打开任务详情页
**WHEN** 用户点击「Debug: 下一周期」
**THEN** 系统执行以下操作：
- 计算下一周期第一天对应的 `debugDayOffset`
- 将 `debugDayOffset` 设置为下一周期第一天
- 更新 `cycle.currentCycle` 为下一周期
- 重置周期相关进度（`cyclePercentage`、`cycleAchieved`）
- 清单类型任务正确迁移未完成项到新周期
- 创建周期切换活动日志

#### Scenario: 模拟日期下的当日记录

**GIVEN** 任务存在 `debugDayOffset` > 0
**WHEN** 用户进行打卡或记录操作
**THEN** 系统应当：
- 记录的日期使用模拟日期（当前日期 + debugDayOffset）
- 记录的时间戳使用模拟时间戳
- 当日进度计算基于模拟日期

#### Scenario: 模拟日期下的奖励计算

**GIVEN** 任务存在 `debugDayOffset` > 0
**WHEN** 打卡完成触发奖励计算
**THEN** 系统应当：
- 每日奖励上限检查基于模拟日期
- 奖励历史记录使用模拟日期
