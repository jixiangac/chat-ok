# Design: 支线任务系统增强

## Context

当前 DC 模块的支线任务系统需要增强以下能力：
1. 更直观的任务完成进度展示
2. 更灵活的标签分类体系
3. 按地点筛选任务的能力
4. 一日视图规划功能

### 约束条件
- 需要兼容现有数据结构，支持平滑迁移
- 使用现有的奶油风配色系统
- 遵循 DC 模块的 Notion 风格设计语言
- 数据存储使用 localStorage

## Goals / Non-Goals

### Goals
- 实现三类标签体系（普通、地点、心情）
- 在 GroupModeGrid 中显示任务完成进度
- 支持按地点筛选支线任务
- 实现一日视图弹窗

### Non-Goals
- 不实现自动地点识别（GPS 定位）
- 不实现标签的云端同步
- 不实现一日视图中的任务拖拽排序（后续迭代）

## Decisions

### 1. 标签数据结构设计

**决策**: 扩展现有 `TaskTag` 接口，添加 `type` 字段区分标签类型

```typescript
// 标签类型
type TagType = 'normal' | 'location' | 'mood';

// 标签接口
interface TaskTag {
  id: string;
  name: string;
  color: string;
  type: TagType;      // 新增
  icon?: string;      // 新增，用于地点和心情标签
  createdAt: string;
}

// 任务标签关联
interface TaskTags {
  normalTagId?: string;
  locationTagId?: string;
  moodTagId?: string;
}
```

**理由**: 
- 复用现有标签存储逻辑
- 通过 `type` 字段区分，便于按类型查询
- 每类标签独立 ID，支持任务同时拥有多类标签

**替代方案**: 
- 为每类标签创建独立存储 → 增加复杂度，不利于统一管理

### 2. 标签图标配置

**决策**: 为地点和心情标签预设图标列表

```typescript
// 地点标签图标
const LOCATION_ICONS = ['🏠', '🏢', '☕', '🏋️', '🚇', '🏫', '🏥', '🛒'];

// 心情标签图标
const MOOD_ICONS = ['😊', '😔', '😤', '😴', '🤔', '💪', '🎉', '😌'];
```

**理由**: 
- 使用 Emoji 作为图标，无需额外图标库
- 预设常用图标，降低用户选择成本
- 支持用户自定义扩展

### 3. 一日视图时段划分

**决策**: 固定时段划分

```typescript
const TIME_PERIODS = {
  morning: { start: 6, end: 12, label: '上午' },
  afternoon: { start: 12, end: 18, label: '下午' },
  evening: { start: 18, end: 24, label: '晚上' },
};
```

**理由**: 
- 符合大多数用户的作息习惯
- 简化实现，避免过度配置
- 后续可根据用户反馈调整

### 4. 任务时间分配算法

**决策**: 按任务顺序平均分配到三个时段，生成示意时间

```typescript
function distributeTasksToTimePeriods(tasks: Task[]) {
  const periods = ['morning', 'afternoon', 'evening'];
  const tasksPerPeriod = Math.ceil(tasks.length / 3);
  
  return tasks.map((task, index) => {
    const periodIndex = Math.floor(index / tasksPerPeriod);
    const period = periods[Math.min(periodIndex, 2)];
    const positionInPeriod = index % tasksPerPeriod;
    
    // 生成示意时间（整点）
    const baseHour = TIME_PERIODS[period].start;
    const hour = baseHour + positionInPeriod;
    
    return { ...task, period, displayTime: `${hour}:00` };
  });
}
```

**理由**: 
- 简单直观的分配逻辑
- 示意时间仅用于视觉展示，不影响实际任务执行
- 保持任务原有顺序

### 5. 数据迁移策略

**决策**: 应用启动时自动检测并执行迁移

```typescript
function migrateTagData() {
  const tags = loadTagsFromStorage();
  const needsMigration = tags.some(tag => !tag.type);
  
  if (needsMigration) {
    const migratedTags = tags.map(tag => ({
      ...tag,
      type: tag.type || 'normal',
    }));
    saveTagsToStorage(migratedTags);
  }
}

function migrateTaskData(tasks: Task[]) {
  return tasks.map(task => {
    if (task.tagId && !task.tags) {
      return {
        ...task,
        tags: { normalTagId: task.tagId },
        tagId: undefined, // 保留兼容
      };
    }
    return task;
  });
}
```

**理由**: 
- 自动迁移，用户无感知
- 保留旧字段兼容性，避免数据丢失
- 迁移逻辑幂等，可重复执行

## Risks / Trade-offs

### 风险 1: 标签删除导致数据不一致
- **风险**: 删除标签后，任务中的标签引用失效
- **缓解**: 删除前提示用户，确认后批量清理任务关联

### 风险 2: 一日视图性能
- **风险**: 任务数量过多时，渲染性能下降
- **缓解**: 使用虚拟列表或限制显示数量（如最多50个）

### 风险 3: 数据迁移失败
- **风险**: 迁移过程中断导致数据损坏
- **缓解**: 迁移前备份数据，迁移失败时回滚

## Component Architecture

```
TodayProgress
└── DailyViewPopup (Popup)
    ├── Header (标题 + 日期)
    ├── TagFilter (标签筛选)
    └── TimePeriodList
        ├── MorningSection
        ├── AfternoonSection
        └── EveningSection
            └── TaskItem (任务项)

SidelineTaskSection
├── LocationFilter (地点筛选按钮)
├── ViewModeToggle (视图切换)
├── GroupModeGrid
│   └── GroupCard (含完成数量)
└── SidelineTaskGrid

TagSettingsPanel (Popup)
├── TabBar (普通/地点/心情)
└── TagList
    └── TagItem (图标 + 名称 + 删除)
```

## Open Questions

1. ~~一日视图是否需要支持任务拖拽排序？~~ → 暂不实现，后续迭代
2. ~~地点筛选是否需要支持多选？~~ → 暂不实现，单选即可
3. 是否需要为标签添加排序功能？ → 待用户反馈后决定
