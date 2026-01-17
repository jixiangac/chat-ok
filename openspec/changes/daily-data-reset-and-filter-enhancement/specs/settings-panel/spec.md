# settings-panel Specification Delta

## ADDED Requirements

### Requirement: Developer Options Section
The system SHALL provide a developer options section in settings for testing purposes.

#### Scenario: Display developer options
- **WHEN** user opens settings panel
- **THEN** system displays a "开发者选项" (Developer Options) section

#### Scenario: Show current date
- **WHEN** developer options section is visible
- **THEN** system displays the current effective date in YYYY-MM-DD format
- **AND** indicates whether it's a real date or test date

### Requirement: Date Test Controls
The system SHALL provide controls for testing date-related functionality.

#### Scenario: Date picker display
- **WHEN** developer options section is visible
- **THEN** system displays a date picker for selecting test date

#### Scenario: Set test date button
- **WHEN** user selects a date and clicks "设置测试日期" (Set Test Date)
- **THEN** system stores the selected date as test date
- **AND** displays confirmation message

#### Scenario: Clear test date button
- **WHEN** user clicks "清除测试日期" (Clear Test Date)
- **THEN** system removes the test date
- **AND** reverts to using real system date
- **AND** displays confirmation message

#### Scenario: Trigger date change button
- **WHEN** user clicks "触发日期变更" (Trigger Date Change)
- **THEN** system executes the daily reset process
- **AND** displays the reset results (tasks reset count, cycles advanced count)

### Requirement: Date Test Visual Feedback
The system SHALL provide visual feedback for date test operations.

#### Scenario: Test date indicator
- **WHEN** a test date is active
- **THEN** system displays a warning badge indicating test mode is active

#### Scenario: Reset results display
- **WHEN** date change is triggered
- **THEN** system displays:
  - Number of tasks with todayProgress reset
  - Number of tasks with cycle advanced
  - Cache clear status
