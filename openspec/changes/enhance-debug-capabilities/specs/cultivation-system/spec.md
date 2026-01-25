# cultivation-system Specification Delta

## ADDED Requirements

### Requirement: 修为调试功能

系统 **SHALL** 在开发者模式下提供修为数值直接设置功能，并自动触发等级更新。

#### Scenario: 调试设置修为数值

**GIVEN** 用户在设置面板的开发者选项中打开修为调试页面
**WHEN** 用户输入目标修为数值并确认
**THEN** 系统应当：
- 根据新修为值计算对应的等级（境界、阶段、层数）
- 直接将 `currentExp` 设置为指定数值
- 同步更新 `realm`、`stage`、`layer` 为计算出的等级
- **不触发闭关逻辑**（调试模式直接设置）
- 更新 `lastUpdatedAt` 时间戳
- 添加调试操作历史记录（type='DEBUG'）
- 显示操作成功 Toast，包含等级变化信息

#### Scenario: 修为设置触发升级

**GIVEN** 当前等级为炼气期第一层，修为 50
**WHEN** 用户通过调试设置修为为 500
**THEN** 系统应当：
- 计算 500 修为对应的等级（假设为炼气期第五层）
- 直接将等级更新为炼气期第五层
- 设置 `currentExp` 为 500
- 显示 Toast「修为已设置为 500，等级变更为炼气期第五层」

#### Scenario: 修为设置触发降级

**GIVEN** 当前等级为筑基期中期，修为 1200
**WHEN** 用户通过调试设置修为为 100
**THEN** 系统应当：
- 计算 100 修为对应的等级（炼气期第一层）
- 直接将等级更新为炼气期第一层
- 设置 `currentExp` 为 100
- **不触发闭关保护**（调试模式直接降级）
- 清除任何现有的闭关状态
- 显示 Toast「修为已设置为 100，等级变更为炼气期第一层」

#### Scenario: 等级变化预览

**GIVEN** 用户在修为调试页面输入新的修为数值
**WHEN** 输入框失去焦点或输入完成
**THEN** 系统应当显示预览信息：
- 当前等级 → 设置后等级
- 如果等级会发生变化，使用高亮颜色提示

#### Scenario: 修为调试入口

**GIVEN** 用户打开设置面板
**WHEN** 查看开发者分组
**THEN** 显示「修为调试」入口
**AND** 点击后跳转到修为调试子页面

### Requirement: 根据修为计算等级

系统 **SHALL** 提供工具函数，根据修为数值反推对应的等级。

#### Scenario: 计算炼气期等级

**GIVEN** 修为值在炼气期范围内
**WHEN** 调用 calculateLevelFromExp(exp)
**THEN** 返回 `{ realm: 'LIANQI', stage: null, layer: 对应层数 }`

#### Scenario: 计算高级境界等级

**GIVEN** 修为值在筑基期及以上范围
**WHEN** 调用 calculateLevelFromExp(exp)
**THEN** 返回 `{ realm: 对应境界, stage: 对应阶段, layer: null }`

#### Scenario: 修为为 0

**GIVEN** 修为值为 0
**WHEN** 调用 calculateLevelFromExp(0)
**THEN** 返回 `{ realm: 'LIANQI', stage: null, layer: 1 }`（最低等级）

#### Scenario: 修为超过最高等级上限

**GIVEN** 修为值超过渡劫期大圆满上限
**WHEN** 调用 calculateLevelFromExp(exp)
**THEN** 返回 `{ realm: 'DUJIE', stage: 'PERFECT', layer: null }`（最高等级）
