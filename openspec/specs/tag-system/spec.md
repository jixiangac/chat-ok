# tag-system Specification

## Purpose
TBD - created by archiving change enhance-sideline-task-system. Update Purpose after archive.
## Requirements
### Requirement: Tag Type Classification
The system SHALL support three types of tags for task categorization.

#### Scenario: Tag types available
- **WHEN** user accesses tag management
- **THEN** system displays three tag categories: Normal (普通), Location (地点), Mood (心情)

#### Scenario: Tag type identification
- **WHEN** a tag is created
- **THEN** the tag MUST have a type field indicating its category

### Requirement: Tag Data Structure
Each tag SHALL contain the following properties: id, name, color, type, icon (optional), and createdAt.

#### Scenario: Tag with icon
- **WHEN** a location or mood tag is created
- **THEN** the tag MAY include an emoji icon for visual identification

#### Scenario: Tag color assignment
- **WHEN** a new tag is created
- **THEN** system SHALL assign a color from the predefined cream-style color palette

### Requirement: Tag Settings Panel
The system SHALL provide a dedicated settings panel for managing tags.

#### Scenario: Access tag settings
- **WHEN** user clicks "标签设置" in the settings menu
- **THEN** system displays the tag settings panel with tab navigation

#### Scenario: Tab navigation
- **WHEN** user is in tag settings panel
- **THEN** user can switch between Normal, Location, and Mood tabs

#### Scenario: View tags by type
- **WHEN** user selects a tag type tab
- **THEN** system displays all tags of that type with icon, name, and color

### Requirement: Tag Creation
Users SHALL be able to create new tags in the settings panel.

#### Scenario: Create normal tag
- **WHEN** user adds a new tag in the Normal tab
- **THEN** system creates a tag with type='normal' and assigns a color

#### Scenario: Create location tag with icon
- **WHEN** user adds a new tag in the Location tab
- **THEN** system allows user to select an emoji icon and creates a tag with type='location'

#### Scenario: Create mood tag with icon
- **WHEN** user adds a new tag in the Mood tab
- **THEN** system allows user to select an emoji icon and creates a tag with type='mood'

### Requirement: Tag Deletion
Users SHALL be able to delete tags with confirmation.

#### Scenario: Delete tag confirmation
- **WHEN** user attempts to delete a tag
- **THEN** system displays a confirmation dialog warning about task association removal

#### Scenario: Delete tag with associated tasks
- **WHEN** user confirms tag deletion
- **THEN** system removes the tag AND clears all task associations with that tag

### Requirement: Tag Storage
Tags SHALL be persisted in localStorage with automatic migration support.

#### Scenario: Tag persistence
- **WHEN** tags are created or modified
- **THEN** changes are immediately saved to localStorage

#### Scenario: Legacy tag migration
- **WHEN** application loads tags without type field
- **THEN** system automatically migrates them as 'normal' type tags

### Requirement: Task Tag Association
Each task SHALL support multiple tag associations, one per tag type.

#### Scenario: Multiple tag types per task
- **WHEN** user edits a task
- **THEN** user can select one tag from each type (normal, location, mood)

#### Scenario: Task tags data structure
- **WHEN** a task has tags assigned
- **THEN** task stores tags as an object with normalTagId, locationTagId, and moodTagId fields

#### Scenario: Legacy tagId migration
- **WHEN** application loads a task with tagId field (legacy)
- **THEN** system migrates it to tags.normalTagId

