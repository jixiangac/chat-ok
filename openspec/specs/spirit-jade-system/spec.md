# spirit-jade-system Specification

## Purpose
TBD - created by archiving change add-spirit-jade-system. Update Purpose after archive.
## Requirements
### Requirement: Spirit Jade Initialization

The system SHALL initialize spirit jade (灵玉) data for new users with a starting balance.

#### Scenario: New user initialization
- **WHEN** a new user first accesses the DC module
- **THEN** the system initializes their spirit jade balance to 1000

#### Scenario: Existing user migration
- **WHEN** an existing user accesses the DC module without spirit jade data
- **THEN** the system initializes their spirit jade balance to 1000

---

### Requirement: Daily Points Cap Calculation

The system SHALL calculate daily points cap (灵石 and 修为) based on task type and check-in unit.

#### Scenario: Base values
- **WHEN** calculating points cap
- **THEN** base spirit jade is 20 and base cultivation is 10

#### Scenario: Duration type bonus
- **WHEN** task check-in unit is DURATION (时长类)
- **THEN** apply 15% bonus to base values

#### Scenario: Times type standard
- **WHEN** task check-in unit is TIMES (次数类)
- **THEN** apply no bonus (100% of base)

#### Scenario: Quantity type bonus
- **WHEN** task check-in unit is QUANTITY (数量类)
- **THEN** apply 10% bonus to base values

#### Scenario: Mainline task multiplier
- **WHEN** task type is mainline
- **THEN** double the calculated cap (100% bonus on top of check-in unit calculation)

#### Scenario: Result rounding
- **WHEN** calculating final points cap
- **THEN** all results SHALL be rounded down to integers

---

### Requirement: Points Acquisition from Check-in

系统 **SHALL** 在打卡时根据每日奖励上限控制奖励发放。

#### Scenario: 每日奖励上限检查

- **WHEN** 用户完成打卡且计算出应得奖励
- **AND** 该任务今日已获得奖励达到每日上限
- **THEN** 不再发放奖励（灵玉和修为均为 0）
- **AND** 打卡操作正常完成
- **AND** 显示 Toast 提示「今日奖励已达上限，继续打卡不再获得奖励」

#### Scenario: 未达上限正常发放

- **WHEN** 用户完成打卡且计算出应得奖励
- **AND** 该任务今日已获得奖励未达到每日上限
- **THEN** 正常发放奖励
- **AND** 累计该任务今日已发放奖励

#### Scenario: 部分发放（接近上限）

- **WHEN** 用户完成打卡且计算出应得奖励 R
- **AND** 该任务今日已获得奖励为 A，上限为 C
- **AND** A + R > C
- **THEN** 实际发放 C - A（发放至上限）
- **AND** 显示实际获得的奖励数量

---

### Requirement: Cycle Completion Bonus

The system SHALL award bonus points when a task cycle reaches 100% completion.

#### Scenario: Full cycle completion reward
- **WHEN** a task cycle ends with 100% completion
- **THEN** user receives bonus equal to 10% of daily points cap

#### Scenario: Single reward per cycle
- **WHEN** cycle completion bonus is awarded
- **THEN** the bonus can only be awarded once per cycle

---

### Requirement: Daily View Completion Reward

The system SHALL award fixed points when user completes 100% of daily view tasks.

#### Scenario: Base completion reward
- **WHEN** daily view progress reaches 100%
- **THEN** user receives base reward of 10 spirit jade and 10 cultivation

#### Scenario: Task count bonus tier 1
- **WHEN** daily view has more than 5 tasks
- **THEN** apply 15% bonus to base reward

#### Scenario: Task count bonus tier 2
- **WHEN** daily view has more than 8 tasks
- **THEN** apply 20% bonus to base reward (overrides tier 1)

#### Scenario: Task count bonus tier 3
- **WHEN** daily view has more than 10 tasks
- **THEN** apply 25% bonus to base reward (overrides tier 2)

#### Scenario: Single reward per day
- **WHEN** daily view completion reward is awarded
- **THEN** the reward can only be awarded once per day

---

### Requirement: Archive Summary Reward

The system SHALL award points when user archives a task with summary.

#### Scenario: Archive reward calculation
- **WHEN** user clicks archive summary
- **THEN** total reward value equals daily points cap × 2

#### Scenario: Distribution by completion rate
- **WHEN** archive reward is distributed
- **THEN** actual reward equals total value × task completion rate

#### Scenario: Minimum completion threshold
- **WHEN** task total completion rate is below 30%
- **THEN** no archive reward is distributed

---

### Requirement: Spirit Jade Consumption for Task Creation

The system SHALL require spirit jade to create tasks, deducting from user balance.

#### Scenario: Sideline task cost
- **WHEN** user creates a sideline task (sidelineA or sidelineB)
- **THEN** deduct 200 spirit jade from balance

#### Scenario: Mainline task cost
- **WHEN** user creates a mainline task
- **THEN** deduct 500 spirit jade from balance

#### Scenario: Insufficient balance prevention
- **WHEN** user attempts to create task with insufficient spirit jade
- **THEN** creation is blocked and user is notified

---

### Requirement: Spirit Jade Consumption for Daily View Refresh

The system SHALL require spirit jade to refresh the daily view task list.

#### Scenario: Refresh cost
- **WHEN** user clicks refresh button in daily view
- **THEN** deduct 25 spirit jade from balance

#### Scenario: Insufficient balance prevention
- **WHEN** user attempts to refresh with insufficient spirit jade
- **THEN** refresh is blocked and user is notified

---

### Requirement: Reward Toast Display

系统 SHALL 在用户获得灵玉时显示 Toast 提示，支持合并多个奖励。

#### Scenario: 获得灵玉时显示 Toast
- **WHEN** 用户通过打卡、周期完成等方式获得灵玉
- **THEN** 系统应当显示 Toast 通知灵玉获得数量
- **AND** Toast 从顶部滑入并在 2-3 秒后自动消失

---

### Requirement: Points History Tracking

The system SHALL maintain a history of all points transactions.

#### Scenario: Record points gain
- **WHEN** user gains spirit jade or cultivation from any source
- **THEN** a record is added with timestamp, type, amount, and source

#### Scenario: Record points spend
- **WHEN** user spends spirit jade
- **THEN** a record is added with timestamp, type, amount (negative), and reason

---

### Requirement: Data Persistence

The system SHALL persist all spirit jade data locally.

#### Scenario: Data save
- **WHEN** any spirit jade data changes
- **THEN** updated data is saved to local storage immediately

#### Scenario: Data load
- **WHEN** user opens the DC module
- **THEN** spirit jade data is loaded from local storage (or initialized if not exists)

#### Scenario: Balance protection
- **WHEN** any operation would reduce balance below 0
- **THEN** the operation is rejected and balance remains unchanged

### Requirement: 灵玉明细全屏页面

系统 **SHALL** 使用与设置子页面一致的手势返回实现。

#### Scenario: 使用统一的手势返回 Hook

- **WHEN** 灵玉明细页面实现手势返回
- **THEN** 应当使用 useSwipeBack hook（来自 settings/hooks）
- **AND** 不应当自实现手势逻辑

#### Scenario: 手势滑动实时跟手

- **WHEN** 用户从左边缘（< 50px）开始向右滑动
- **THEN** 页面应当实时跟随手指位移
- **AND** 滑动时应当禁用 transition 动画（直接设置 transform）

#### Scenario: 手势返回触发

- **WHEN** 滑动距离超过阈值（100px）
- **AND** 用户释放手指
- **THEN** 页面应当平滑滑出并关闭

#### Scenario: 手势回弹

- **WHEN** 滑动距离未超过阈值（100px）
- **AND** 用户释放手指
- **THEN** 页面应当平滑回弹到原位
- **AND** 不触发关闭操作

### Requirement: 清单项操作灵玉消耗

系统 **SHALL** 在清单项添加和延后操作时消耗灵玉。

#### Scenario: 添加清单项到当前周期消耗

- **WHEN** 用户将清单项添加到当前周期
- **THEN** 扣除 1 灵玉
- **AND** 记录消耗历史（来源：清单项添加）

#### Scenario: 延后清单项到下一周期消耗

- **WHEN** 用户将清单项延后到下一周期
- **THEN** 扣除 2 灵玉
- **AND** 记录消耗历史（来源：清单项延后）

---

### Requirement: 纪念日创建灵玉消耗

系统 **SHALL** 在创建纪念日时消耗灵玉。

#### Scenario: 纪念日创建消耗

- **WHEN** 用户确认创建纪念日
- **THEN** 扣除 50 灵玉
- **AND** 记录消耗历史（来源：创建纪念日）

---

### Requirement: 主线转支线灵玉消耗

系统 **SHALL** 在主线任务转为支线任务时消耗灵玉。

#### Scenario: 主线转支线消耗

- **WHEN** 用户确认将主线任务转为支线
- **THEN** 扣除 50 灵玉
- **AND** 记录消耗历史（来源：主线转支线）

---

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

