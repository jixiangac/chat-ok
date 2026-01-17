# daily-view Specification Delta

## MODIFIED Requirements

### Requirement: Daily View Task Filtering
The system SHALL filter tasks for the daily view based on priority rules.

#### Scenario: Exclude completed tasks
- **WHEN** filtering tasks for daily view
- **THEN** system excludes tasks with status COMPLETED or ARCHIVED or ARCHIVED_HISTORY

#### Scenario: Exclude fully completed tasks
- **WHEN** filtering tasks for daily view
- **THEN** system excludes tasks with totalPercentage >= 100%

#### Scenario: Exclude cycle completed tasks
- **WHEN** filtering tasks for daily view
- **THEN** system excludes tasks with cyclePercentage >= 100%

### Requirement: Mandatory Task Display
The system SHALL always display certain types of tasks in the daily view.

#### Scenario: Display mainline tasks
- **WHEN** filtering tasks for daily view
- **THEN** system includes all active mainline tasks

#### Scenario: Display daily target tasks
- **WHEN** a task has dailyTarget configured (CHECK_IN or NUMERIC type)
- **THEN** system includes the task in daily view

#### Scenario: Display near-deadline tasks
- **WHEN** a task's remaining cycle time is <= 30% of cycle duration
- **AND** the task has not completed its cycle target
- **THEN** system includes the task in daily view

### Requirement: Flexible Task Display
The system SHALL dynamically select additional tasks based on available slots.

#### Scenario: Calculate flexible task limit
- **WHEN** mandatory task count is <= 3
- **THEN** flexible task limit is 3
- **WHEN** mandatory task count is 4-5
- **THEN** flexible task limit is 2
- **WHEN** mandatory task count is >= 6
- **THEN** flexible task limit is 1

#### Scenario: Select flexible tasks by weighted probability
- **WHEN** selecting flexible tasks
- **THEN** system uses weighted probability where lower completion rate = higher weight
- **AND** selection is deterministic for the same date (using task ID + date as seed)

## ADDED Requirements

### Requirement: Daily Data Reset
The system SHALL reset daily progress data when date changes.

#### Scenario: Detect date change on app load
- **WHEN** user opens the app
- **AND** current date differs from last visited date
- **THEN** system triggers daily reset process

#### Scenario: Detect date change on tab activation
- **WHEN** user switches back to the app tab
- **AND** current date differs from last visited date
- **THEN** system triggers daily reset process

#### Scenario: Detect date change on network recovery
- **WHEN** network connection is restored
- **AND** current date differs from last visited date
- **THEN** system triggers daily reset process

#### Scenario: Detect date change on scene switch
- **WHEN** user switches between scenes (normal, vacation, memorial, okr)
- **AND** current date differs from last visited date
- **THEN** system triggers daily reset process

#### Scenario: Detect date change on page navigation
- **WHEN** user opens settings page or task detail page
- **AND** current date differs from last visited date
- **THEN** system triggers daily reset process

#### Scenario: Reset todayProgress
- **WHEN** daily reset is triggered
- **THEN** system resets todayProgress for all tasks:
  - canCheckIn = true
  - todayCount = 0
  - todayValue = 0
  - isCompleted = false

#### Scenario: Clear daily view cache
- **WHEN** daily reset is triggered
- **THEN** system clears dc_daily_view_cache from localStorage

### Requirement: Cycle Advancement
The system SHALL advance task cycles when date changes.

#### Scenario: Calculate expected cycle
- **WHEN** daily reset is triggered
- **THEN** system calculates expected cycle based on days passed since start date

#### Scenario: Advance cycle
- **WHEN** expected cycle > current cycle
- **AND** expected cycle <= total cycles
- **THEN** system updates currentCycle to expected cycle

#### Scenario: Skip multiple cycles
- **WHEN** user hasn't opened app for multiple days
- **THEN** system advances directly to the correct cycle (not one by one)

#### Scenario: Settle cycle status
- **WHEN** cycle is advanced
- **THEN** system settles the previous cycle's status based on completion

### Requirement: Date Test Feature
The system SHALL provide a date testing feature in settings for verification.

#### Scenario: Display current system date
- **WHEN** user opens settings
- **THEN** system displays current effective date (real or test date)

#### Scenario: Set test date
- **WHEN** user selects a test date in settings
- **THEN** system stores the test date
- **AND** uses test date for all date-related calculations

#### Scenario: Trigger date change manually
- **WHEN** user clicks "trigger date change" button
- **THEN** system executes the daily reset process with the test date

#### Scenario: Clear test date
- **WHEN** user clicks "clear test date" button
- **THEN** system removes test date
- **AND** reverts to using real system date
