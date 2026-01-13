## ADDED Requirements

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
