# daily-view Specification

## Purpose
TBD - created by archiving change enhance-sideline-task-system. Update Purpose after archive.
## Requirements
### Requirement: Daily View Popup
The system SHALL provide a daily view popup for visualizing today's tasks.

#### Scenario: Trigger daily view
- **WHEN** user clicks on "今日完成率" (Today's completion rate) in TodayProgress
- **THEN** system displays the DailyViewPopup as a bottom sheet

#### Scenario: Popup display
- **WHEN** DailyViewPopup opens
- **THEN** it renders as an antd-mobile Popup component

### Requirement: Daily View Header
The daily view SHALL display a header with title and date information.

#### Scenario: Title display
- **WHEN** DailyViewPopup renders
- **THEN** header shows "一日清单" as main title and "• • • TODAY'S LIST • • •" as subtitle

#### Scenario: Date information
- **WHEN** DailyViewPopup renders
- **THEN** header shows current date (MM/DD), weekday, and a daily motto/slogan

### Requirement: Daily View Tag Filter
The daily view SHALL support filtering tasks by tags.

#### Scenario: Tag filter display
- **WHEN** DailyViewPopup renders
- **THEN** a tag filter section appears below the header

#### Scenario: Filter by tag
- **WHEN** user selects a tag in the filter
- **THEN** only tasks with that tag are displayed in the time periods

### Requirement: Time Period Sections
The daily view SHALL organize tasks into three time periods.

#### Scenario: Time period layout
- **WHEN** DailyViewPopup renders
- **THEN** tasks are organized into three sections: 上午 (Morning), 下午 (Afternoon), 晚上 (Evening)

#### Scenario: Time period boundaries
- **WHEN** distributing tasks to time periods
- **THEN** Morning is 6:00-12:00, Afternoon is 12:00-18:00, Evening is 18:00-24:00

#### Scenario: Section header
- **WHEN** a time period section renders
- **THEN** it displays the period name (上午/下午/晚上) aligned to the right with a dashed separator line

### Requirement: Task Distribution Algorithm
Tasks SHALL be automatically distributed across time periods.

#### Scenario: Even distribution
- **WHEN** tasks are distributed to time periods
- **THEN** tasks are divided as evenly as possible across the three periods

#### Scenario: Maintain task order
- **WHEN** distributing tasks
- **THEN** the original task order is preserved within each period

#### Scenario: Generate display time
- **WHEN** a task is assigned to a period
- **THEN** system generates a display time (whole hour) based on position within the period

#### Scenario: Display time format
- **WHEN** showing task display time
- **THEN** time is formatted as "HH:00" (e.g., "09:00", "14:00", "20:00")

### Requirement: Task Item Display
Each task in the daily view SHALL show its title, display time, and completion status.

#### Scenario: Task item layout
- **WHEN** a task item renders
- **THEN** it shows task title on the left and display time on the right

#### Scenario: Completed task styling
- **WHEN** a task is completed for today
- **THEN** the task title and time are displayed with strikethrough text

#### Scenario: Incomplete task styling
- **WHEN** a task is not completed for today
- **THEN** the task title and time are displayed normally

### Requirement: Task Item Interaction
Users SHALL be able to interact with tasks in the daily view.

#### Scenario: Click to open detail
- **WHEN** user clicks on a task item
- **THEN** system opens the task detail panel

#### Scenario: Close popup on navigation
- **WHEN** user navigates to task detail
- **THEN** the DailyViewPopup closes

### Requirement: Daily View Visual Style
The daily view SHALL follow the Notion-style design language.

#### Scenario: Typography
- **WHEN** DailyViewPopup renders
- **THEN** it uses clean, minimal typography consistent with the DC module design

#### Scenario: Separator lines
- **WHEN** time period sections render
- **THEN** dashed separator lines are used between sections

#### Scenario: Color scheme
- **WHEN** DailyViewPopup renders
- **THEN** it uses the cream-style color palette for backgrounds and accents

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

