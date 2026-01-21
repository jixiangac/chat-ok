## ADDED Requirements

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

The system SHALL display a visual toast notification when user earns points, with support for merging multiple rewards.

#### Scenario: Single reward display
- **WHEN** user earns points from a single source
- **THEN** display a simple toast showing spirit jade and cultivation amounts with source label

#### Scenario: Multiple rewards merge
- **WHEN** user earns points from multiple sources in one action (e.g., check-in triggers cycle completion and daily view completion)
- **THEN** display a merged toast listing each reward with amounts and a total summary

#### Scenario: Toast animation
- **WHEN** reward toast is displayed
- **THEN** toast slides down from top with number rolling animation

#### Scenario: Toast duration
- **WHEN** single reward is displayed
- **THEN** toast stays for 2 seconds

#### Scenario: Multiple rewards duration
- **WHEN** merged rewards (2-4 items) are displayed
- **THEN** toast stays for 3 seconds

#### Scenario: Consumption does not trigger toast
- **WHEN** user spends spirit jade (create task, refresh daily view)
- **THEN** no reward toast is displayed (use button disabled state instead)

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
