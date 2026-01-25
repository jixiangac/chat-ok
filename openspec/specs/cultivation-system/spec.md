# cultivation-system Specification

## Purpose
TBD - created by archiving change add-cultivation-level-system. Update Purpose after archive.
## Requirements
### Requirement: Cultivation Level System

The system SHALL implement a cultivation level system based on "A Record of a Mortal's Journey to Immortality" (凡人修仙传), providing long-term progression motivation for users.

#### Scenario: New user initialization
- **WHEN** a new user first accesses the DC module
- **THEN** the system initializes their cultivation data with Realm = LIANQI (炼气), Stage = 1, CurrentExp = 0

#### Scenario: View current cultivation status
- **WHEN** user pulls down on the main page beyond threshold
- **THEN** full-screen cultivation panel appears showing current realm, stage, and exp progress

---

### Requirement: Realm Hierarchy

The system SHALL support 9 major realms with the following structure:
- 炼气期 (LIANQI): 13 layers
- 筑基期 (ZHUJI): 5 stages (初期/中期/后期/巅峰/大圆满)
- 结丹期 (JIEDAN): 5 stages
- 元婴期 (YUANYING): 5 stages
- 化神期 (HUASHEN): 5 stages
- 炼虚期 (LIANXU): 5 stages
- 合体期 (HETI): 5 stages
- 大乘期 (DACHENG): 5 stages
- 渡劫期 (DUJIE): 5 stages

#### Scenario: Exp range calculation for LIANQI
- **WHEN** calculating exp range for LIANQI realm
- **THEN** each layer's max exp is 5% higher than the previous layer (Layer 1 base = 100)

#### Scenario: Exp range calculation for higher realms
- **WHEN** calculating exp range for ZHUJI and above
- **THEN** first stage is 15% higher than previous realm's last stage, subsequent stages are 10% higher

---

### Requirement: Exp Acquisition from Task Check-in

The system SHALL award cultivation exp when users complete task check-ins, with different amounts based on task type.

#### Scenario: NUMERIC task check-in
- **WHEN** user records progress for a NUMERIC type task
- **THEN** user gains 10 cultivation exp immediately

#### Scenario: CHECKLIST task item completion
- **WHEN** user completes an item in a CHECKLIST type task
- **THEN** user gains 5 cultivation exp immediately

#### Scenario: CHECK_IN task check-in
- **WHEN** user checks in for a CHECK_IN type task
- **THEN** user gains 8 cultivation exp immediately

---

### Requirement: Cycle Completion Rewards

The system SHALL award bonus cultivation exp at the end of each task cycle based on completion percentage.

#### Scenario: Cycle completion above 30%
- **WHEN** a task cycle ends with completion percentage >= 30%
- **THEN** user receives bonus cultivation exp proportional to completion

#### Scenario: Full cycle completion bonus
- **WHEN** a task cycle ends with 100% completion
- **THEN** user receives an additional 20% bonus on top of the base cycle reward

#### Scenario: Cycle completion below 30%
- **WHEN** a task cycle ends with completion percentage < 30%
- **THEN** user loses a fixed amount of cultivation exp based on current realm tier

---

### Requirement: Exp Penalty Scaling

The system SHALL scale exp penalties based on the user's current realm, with higher realms receiving larger penalties.

#### Scenario: Low realm penalty
- **WHEN** user in LIANQI realm fails a cycle
- **THEN** user loses 5 exp (minimum penalty tier)

#### Scenario: High realm penalty
- **WHEN** user in DUJIE realm fails a cycle
- **THEN** user loses 50 exp (maximum penalty tier)

#### Scenario: Exp floor protection
- **WHEN** penalty would reduce exp below 0
- **THEN** exp is set to 0 instead of going negative

---

### Requirement: Realm Breakthrough

The system SHALL require manual confirmation to advance to a higher realm/stage when exp requirements are met.

#### Scenario: Breakthrough available
- **WHEN** user's current exp reaches or exceeds the current stage maximum
- **THEN** a "Breakthrough" button becomes available on the cultivation panel

#### Scenario: Breakthrough execution
- **WHEN** user taps the "Breakthrough" button
- **THEN** user advances to the next stage/realm and exp resets for new stage

---

### Requirement: Minor Stage Demotion

The system SHALL automatically demote users within the same major realm when exp falls below stage minimum.

#### Scenario: Within-realm demotion
- **WHEN** user's exp falls below current stage minimum AND next lower stage is in same realm
- **THEN** user is immediately demoted to the lower stage

---

### Requirement: Major Realm Demotion Protection (Seclusion)

The system SHALL provide a 15-day seclusion protection period before demoting users across major realm boundaries.

#### Scenario: Seclusion trigger
- **WHEN** user's exp would cause demotion to a lower major realm
- **THEN** seclusion mode activates with a fixed exp maintenance target

#### Scenario: Seclusion success
- **WHEN** user reaches the maintenance target within 15 days
- **THEN** seclusion ends and user remains at current realm

#### Scenario: Seclusion failure
- **WHEN** 15 days pass without reaching maintenance target
- **THEN** user is demoted to the realm corresponding to their current exp

#### Scenario: Normal task activity during seclusion
- **WHEN** user is in seclusion mode
- **THEN** user can still complete tasks and gain exp normally

---

### Requirement: Cultivation History Tracking

The system SHALL maintain a history of cultivation exp changes, organized by week.

#### Scenario: Record exp gain
- **WHEN** user gains cultivation exp from any source
- **THEN** a record is added to the current week's history with timestamp, type, amount, and source

#### Scenario: Record exp loss
- **WHEN** user loses cultivation exp from any source
- **THEN** a record is added to the current week's history with timestamp, type, amount (negative), and reason

#### Scenario: History retention
- **WHEN** history data is older than 12 weeks
- **THEN** old data may be cleaned up to save storage

---

### Requirement: Cultivation Panel UI

The system SHALL provide a full-screen cultivation panel with minimalist design, triggered by pull-down gesture.

#### Scenario: Panel trigger
- **WHEN** user pulls down on main page beyond 150px threshold
- **THEN** cultivation panel slides in with smooth animation covering full screen

#### Scenario: Panel content display
- **WHEN** cultivation panel is visible
- **THEN** panel shows: realm name, current stage, character/imagery area, exp progress bar with numbers, action buttons

#### Scenario: Panel dismiss
- **WHEN** user swipes up or taps close
- **THEN** panel slides out with smooth animation

---

### Requirement: Data Persistence

The system SHALL persist all cultivation data locally in dc_user_data.

#### Scenario: Data save
- **WHEN** any cultivation data changes
- **THEN** updated data is saved to local storage immediately

#### Scenario: Data load
- **WHEN** user opens the DC module
- **THEN** cultivation data is loaded from local storage (or initialized if not exists)

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

