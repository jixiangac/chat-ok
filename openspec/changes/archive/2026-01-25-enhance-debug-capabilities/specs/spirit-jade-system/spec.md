# spirit-jade-system Specification Delta

## ADDED Requirements

### Requirement: 灵玉调试功能

系统 **SHALL** 在开发者模式下提供灵玉数量直接设置功能。

#### Scenario: 调试设置灵玉数量

**GIVEN** 用户在设置面板的开发者选项中打开灵玉调试页面
**WHEN** 用户输入目标灵玉数量并确认
**THEN** 系统应当：
- 直接将灵玉余额设置为指定数值
- 如果新余额 > 原余额，差值计入 `totalEarned`
- 如果新余额 < 原余额，差值计入 `totalSpent`
- 更新 `lastUpdatedAt` 时间戳
- 添加调试操作历史记录（source='DEBUG_SET'）
- 显示操作成功 Toast

#### Scenario: 灵玉快捷增减

**GIVEN** 用户在灵玉调试页面
**WHEN** 用户点击快捷按钮（+100/+500/+1000/-100/归零）
**THEN** 系统应当：
- 根据按钮类型调整灵玉数量
- 归零操作将余额设置为 0
- 减少操作不允许余额变为负数（最低为 0）
- 更新历史记录和 UI 显示

#### Scenario: 灵玉调试入口

**GIVEN** 用户打开设置面板
**WHEN** 查看开发者分组
**THEN** 显示「灵玉调试」入口
**AND** 点击后跳转到灵玉调试子页面
