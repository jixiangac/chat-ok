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

The system SHALL award spirit jade and cultivation points when users complete task check-ins.

#### Scenario: Points distribution by completion ratio
- **WHEN** user records progress for a task
- **THEN** user gains points proportional to completion ratio (ceiling rounding)

#### Scenario: Today must complete bonus
- **WHEN** task is marked as "today must complete" (今日必须完成)
- **THEN** apply 15% bonus to awarded points

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

系统 SHALL 提供全屏的灵玉明细页面，使用与设置子页面一致的布局风格。

#### Scenario: 打开灵玉明细页面
- **WHEN** 用户点击主页面顶部的灵玉图标
- **THEN** 系统应当从右侧滑入全屏灵玉明细页面
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-out 缓动函数

#### Scenario: 灵玉页面布局
- **WHEN** 灵玉明细页面打开
- **THEN** 页面应当使用 SubPageLayout 布局
- **AND** 顶部应当显示灵玉主题头图
- **AND** 头图下方应当显示"灵玉明细"标题和描述
- **AND** 内容区域应当显示余额概览和变动记录

#### Scenario: 余额概览展示
- **WHEN** 灵玉明细页面显示余额概览区域
- **THEN** 应当显示当前余额，包含灵玉图标和数值
- **AND** 应当显示累计获得金额（绿色上箭头）
- **AND** 应当显示累计消耗金额（红色下箭头）

#### Scenario: 变动记录列表
- **WHEN** 灵玉明细页面显示变动记录区域
- **THEN** 应当显示"变动记录"分组标题
- **AND** 记录应当按时间倒序排列
- **AND** 每条记录应当显示来源、描述、时间和金额
- **AND** 获得金额显示为绿色带加号
- **AND** 消耗金额显示为红色带减号

#### Scenario: 空状态展示
- **WHEN** 没有灵玉变动记录
- **THEN** 应当显示"暂无记录"提示

#### Scenario: 关闭灵玉页面
- **WHEN** 用户点击返回按钮
- **THEN** 页面应当向右侧滑出
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-in 缓动函数

#### Scenario: 手势返回
- **WHEN** 用户从左边缘（< 50px）向右滑动
- **AND** 滑动距离超过阈值（100px）
- **THEN** 系统应当触发返回操作
- **AND** 关闭灵玉明细页面

