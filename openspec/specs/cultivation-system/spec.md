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

