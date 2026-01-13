# sideline-task Specification

## Purpose
TBD - created by archiving change enhance-sideline-task-system. Update Purpose after archive.
## Requirements
### Requirement: GroupModeGrid Completion Count Display
The GroupModeGrid SHALL display task completion count for each group.

#### Scenario: Display completion count
- **WHEN** GroupModeGrid renders a group card
- **THEN** the card displays "completed/total" count on the right side of the icon row

#### Scenario: Today completion definition
- **WHEN** calculating completion count
- **THEN** a task is considered "completed" if it has achieved 100% of today's target (check-in count, duration, or value)

#### Scenario: Check-in task completion
- **WHEN** a check-in type task has met its daily target
- **THEN** it counts as completed for the day

### Requirement: Location Filter in SidelineTaskSection
The SidelineTaskSection SHALL provide location-based filtering for tasks.

#### Scenario: Location filter button
- **WHEN** SidelineTaskSection renders
- **THEN** a location filter button (icon + text) appears to the left of the view mode toggle

#### Scenario: Filter options
- **WHEN** user clicks the location filter button
- **THEN** system displays options: "全部" (All) + list of location tags used by sideline tasks

#### Scenario: Filter only used location tags
- **WHEN** building the location filter options
- **THEN** only location tags that are assigned to at least one sideline task are shown

#### Scenario: Apply location filter
- **WHEN** user selects a location tag
- **THEN** only tasks with that location tag are displayed (in list mode only)

#### Scenario: Filter in list mode only
- **WHEN** view mode is GroupModeGrid
- **THEN** location filter is not applied (all tasks shown in groups)

#### Scenario: Reset filter
- **WHEN** user selects "全部" (All)
- **THEN** all sideline tasks are displayed without location filtering

### Requirement: Multi-Type Tag Selection in Task Edit
The task edit modal SHALL support selecting tags from all three types.

#### Scenario: Tag selection UI
- **WHEN** user opens task edit modal
- **THEN** TagSelector displays tabs for Normal, Location, and Mood tags

#### Scenario: Select multiple tag types
- **WHEN** user edits a task
- **THEN** user can select one tag from each type simultaneously

#### Scenario: No inline tag creation
- **WHEN** user is in TagSelector within task edit modal
- **THEN** there is no option to create new tags (must go to settings)

#### Scenario: Save task with multiple tags
- **WHEN** user saves a task with tags selected
- **THEN** task stores normalTagId, locationTagId, and moodTagId in the tags object

### Requirement: TagSelector Component
The TagSelector component SHALL support multi-type tag selection with tab navigation.

#### Scenario: Tab-based tag display
- **WHEN** TagSelector renders
- **THEN** it displays tabs for switching between Normal, Location, and Mood tags

#### Scenario: Tag selection per type
- **WHEN** user selects a tag in one type
- **THEN** it does not affect selections in other types

#### Scenario: Visual distinction by type
- **WHEN** displaying tags
- **THEN** location and mood tags show their emoji icons alongside the name

