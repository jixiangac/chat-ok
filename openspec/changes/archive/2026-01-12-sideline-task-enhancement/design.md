# Design: 支线任务视图增强

## 1. 数据结构设计

### 1.1 标签类型定义

```typescript
// 标签接口
interface TaskTag {
  id: string;           // 标签唯一ID
  name: string;         // 标签名称
  color: string;        // 标签颜色（系统自动分配）
  createdAt: string;    // 创建时间
}

// 扩展 Task 接口
interface Task {
  // ... 现有字段
  tag?: string;         // 标签ID（可选，每个任务只能有一个标签）
}
```

### 1.2 今日必须完成状态

```typescript
// 今日必须完成状态
interface TodayMustCompleteState {
  date: string;                    // 日期 YYYY-MM-DD
  taskIds: string[];               // 选中的任务ID列表（最多3个）
  skipped: boolean;                // 是否已跳过
  lastPromptTime?: string;         // 上次提示时间
}
```

### 1.3 视图模式

```typescript
type SidelineViewMode = 'default' | 'group';
```

## 2. 存储设计

### 2.1 存储键

| 键名 | 类型 | 描述 |
|------|------|------|
| `dc_task_tags` | `TaskTag[]` | 所有标签列表 |
| `dc_today_must_complete` | `TodayMustCompleteState` | 今日必须完成状态 |
| `dc_sideline_view_mode` | `SidelineViewMode` | 支线任务视图模式 |

### 2.2 存储工具函数

```typescript
// tagStorage.ts
export const TagStorage = {
  getAll: (): TaskTag[] => { ... },
  add: (tag: Omit<TaskTag, 'id' | 'createdAt'>): TaskTag => { ... },
  remove: (tagId: string): void => { ... },
  getNextColor: (): string => { ... },
};

// todayMustCompleteStorage.ts
export const TodayMustCompleteStorage = {
  get: (): TodayMustCompleteState | null => { ... },
  set: (state: TodayMustCompleteState): void => { ... },
  shouldShowPrompt: (): boolean => { ... },
  markSkipped: (): void => { ... },
  reset: (): void => { ... },
};
```

## 3. 组件设计

### 3.1 TodayMustCompleteModal

**位置**: `src/pages/dc/components/TodayMustCompleteModal/`

**Props**:
```typescript
interface TodayMustCompleteModalProps {
  visible: boolean;
  tasks: Task[];                           // 所有未完成的支线任务
  onClose: () => void;
  onConfirm: (taskIds: string[]) => void;
  onSkip: () => void;
}
```

**布局结构**:
```
┌─────────────────────────────────────┐
│  [卡片图片]                          │
│                                     │
├─────────────────────────────────────┤
│  选择今日必须完成的任务（最多3个）    │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │ ← 横向滚动
│  │任务1│ │任务2│ │任务3│ │任务4│   │   第一行
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │ ← 横向滚动
│  │任务5│ │任务6│ │任务7│ │任务8│   │   第二行
│  └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  已选择:                            │
│  ┌─────────┐ ┌─────────┐           │
│  │ 任务1 ✕ │ │ 任务2 ✕ │           │
│  └─────────┘ └─────────┘           │
├─────────────────────────────────────┤
│  [跳过]              [确认]         │
└─────────────────────────────────────┘
```

### 3.2 TagSelector

**位置**: `src/pages/dc/components/TagSelector/`

**Props**:
```typescript
interface TagSelectorProps {
  value?: string;                    // 当前选中的标签ID
  onChange: (tagId: string | undefined) => void;
  existingTags: TaskTag[];           // 已有标签列表
  onCreateTag: (name: string) => TaskTag;
}
```

**布局结构**:
```
┌─────────────────────────────────────┐
│  标签                               │
├─────────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐     │
│  │ 工作  │ │ 学习  │ │ 健康  │     │
│  └───────┘ └───────┘ └───────┘     │
│  ┌───────────────┐                 │
│  │ + 新建标签    │                 │
│  └───────────────┘                 │
└─────────────────────────────────────┘
```

### 3.3 SidelineTaskEditModal

**位置**: `src/pages/dc/components/SidelineTaskEditModal/`

**Props**:
```typescript
interface SidelineTaskEditModalProps {
  visible: boolean;
  task: Task;
  onClose: () => void;
  onSave: (updates: { title?: string; tag?: string }) => void;
}
```

### 3.4 GroupCard

**位置**: `src/pages/dc/components/GroupCard/`

**设计参考**: 复用现有的 `SidelineTaskCard` grid 模式样式（`.gridCard`），稍微增加高度

**Props**:
```typescript
interface GroupCardProps {
  tag: TaskTag;
  tasks: Task[];                     // 该标签下的所有任务
  onClick: () => void;
}
```

**布局结构** (参考 SidelineTaskCard.module.css 的 gridCard 样式):
```
┌─────────────────────────────────────┐
│  🏷️ 工作                      3/5  │
│  ████████░░░░░░░░░░                │
└─────────────────────────────────────┘
```

**样式规范** (基于 gridCard，稍微增加高度):
```css
.groupCard {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 12px 14px;              /* 比 gridCard 稍大 */
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  min-height: 64px;                /* 比 gridCard 的 52px 稍高 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: white;
}

.groupCard:active {
  opacity: 0.9;
}

.groupHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.groupIcon {
  font-size: 14px;
}

.groupName {
  font-size: 13px;
  font-weight: 400;
  color: #37352f;
  flex: 1;
}

.groupCount {
  font-size: 11px;
  color: #9b9b9b;
}

.groupProgressBar {
  height: 3px;
  background-color: rgba(55, 53, 47, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.groupProgressFill {
  height: 100%;
  background-color: rgba(55, 53, 47, 0.2);
  transition: width 0.3s;
  border-radius: 2px;
}
```

**进度计算**:
```typescript
// 计算该标签下所有任务的总进度
const calculateGroupProgress = (tasks: Task[]): { completed: number; total: number; percentage: number } => {
  const total = tasks.length;
  const completed = tasks.filter(t => isTodayCompleted(t)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
};
```

### 3.5 GroupModeGrid

**位置**: `src/pages/dc/components/GroupModeGrid/`

**Props**:
```typescript
interface GroupModeGridProps {
  tasks: Task[];
  tags: TaskTag[];
  onGroupClick: (tagId: string) => void;
}
```

## 4. Hook 设计

### 4.1 useTodayMustComplete

```typescript
interface UseTodayMustCompleteReturn {
  shouldShowModal: boolean;          // 是否应该显示弹窗（8点后首次打开）
  canSetToday: boolean;              // 今天是否可以设置（未设置过）
  selectedTaskIds: string[];         // 已选择的任务ID
  setSelectedTaskIds: (ids: string[]) => void;
  confirmSelection: () => void;      // 确认选择
  skipToday: () => void;             // 跳过今天
  openModal: () => void;             // 手动打开弹窗（从设置面板触发）
  isTaskMustComplete: (taskId: string) => boolean;  // 判断任务是否是今日必须完成
}

function useTodayMustComplete(): UseTodayMustCompleteReturn;
```

### 4.3 设置面板入口

在设置面板中添加"设置今日必须完成任务"入口：

```typescript
// 设置面板中的入口
{canSetToday && (
  <div className={styles.settingItem} onClick={openTodayMustCompleteModal}>
    <span>设置今日必须完成任务</span>
    <ChevronRight size={16} />
  </div>
)}
```

**显示条件**: `canSetToday` 为 true（当天未设置过且未跳过）

### 4.2 useTaskTags

```typescript
interface UseTaskTagsReturn {
  tags: TaskTag[];                   // 所有标签
  addTag: (name: string) => TaskTag; // 添加标签
  removeTag: (tagId: string) => void; // 删除标签
  getTagById: (tagId: string) => TaskTag | undefined;
  getTasksByTag: (tagId: string) => Task[];
  hasAnyTaggedTask: boolean;         // 是否有任何带标签的任务
}

function useTaskTags(tasks: Task[]): UseTaskTagsReturn;
```

## 5. 滚动条优化方案

### 5.1 问题分析

当前问题：多个滚动条同时出现

**当前结构** (`src/pages/dc/index.tsx`):
```tsx
<div className={styles.content}>           {/* 第115行 - 整个内容区域滚动 */}
  <div className={styles.spriteSection}>   {/* 第117行 - 小精灵区域 */}
    ...
  </div>
  {renderTabContent()}                      {/* 第129行 - Tab 内容 */}
</div>
```

问题：`.content` 包含了小精灵区域和 Tab 内容，导致整个区域一起滚动，可能产生多个滚动条。

### 5.2 解决方案

**方案：将 Tab 内容区域独立为滚动容器**

修改 `src/pages/dc/index.tsx` 第128行附近的结构：

```tsx
{/* Content */}
<div className={styles.content}>
  {/* 小精灵区域 - 固定不滚动 */}
  <div className={styles.spriteSection}>
    <div className={styles.moonPhaseWrapper}>
      <MoonPhase onClick={randomizeSpriteImage} />
    </div>
    <img 
      src={getCurrentSpriteImage()} 
      alt="可爱的小精灵"
      className={styles.spriteImage}
    />
  </div>

  {/* Tab 对应的内容 - 独立滚动区域 */}
  <div className={styles.tabContent}>
    {renderTabContent()}
  </div>
</div>
```

### 5.3 CSS 修改

```css
/* DCPage.module.css */

/* 主容器 - 禁止滚动 */
.container {
  width: 100%;
  min-width: 360px;
  height: 100vh;
  background-color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 内容区域 - 不滚动，使用 flex 布局 */
.content {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;  /* 改为 hidden，不在这里滚动 */
}

/* 小精灵区域 - 固定高度，不滚动 */
.spriteSection {
  flex-shrink: 0;  /* 不压缩 */
  /* 保持现有样式 */
}

/* Tab 内容区域 - 唯一的滚动容器 */
.tabContent {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.contentWithBottomBar .tabContent {
  padding-bottom: 80px;
}
```

### 5.4 各面板处理

- `NormalPanel`: 移除任何可能的 overflow 设置，内容自然流动
- `HappyPanel`: 检查并移除 overflow 设置
- `MemorialPanel`: 检查并移除 overflow 设置

### 5.5 修改文件清单

1. `src/pages/dc/index.tsx` - 添加 `.tabContent` 包装层
2. `src/pages/dc/css/DCPage.module.css` - 添加 `.tabContent` 样式，修改 `.content` 样式
3. `src/pages/dc/panels/normal/styles.module.css` - 检查并移除 overflow
4. `src/pages/dc/panels/happy/index.tsx` - 检查并移除 overflow
5. `src/pages/dc/panels/memorial/styles.module.css` - 检查并移除 overflow

## 6. 标签颜色系统

### 6.1 预定义颜色

```typescript
// constants/colors.ts
export const TAG_COLORS = [
  '#FFE4E1', // 浅粉红
  '#E6E6FA', // 薰衣草
  '#E0FFFF', // 浅青色
  '#F0FFF0', // 蜜瓜色
  '#FFF8DC', // 玉米丝色
  '#FFE4B5', // 鹿皮色
  '#D8BFD8', // 蓟色
  '#B0E0E6', // 粉蓝色
  '#98FB98', // 浅绿色
  '#DDA0DD', // 梅红色
];
```

### 6.2 颜色分配算法

```typescript
function getNextTagColor(existingTags: TaskTag[]): string {
  const usedColors = existingTags.map(t => t.color);
  
  // 找到第一个未使用的颜色
  for (const color of TAG_COLORS) {
    if (!usedColors.includes(color)) {
      return color;
    }
  }
  
  // 如果所有颜色都用过，循环使用
  return TAG_COLORS[existingTags.length % TAG_COLORS.length];
}
```

## 7. 排序逻辑

### 7.1 支线任务排序优先级

1. **今日必须完成且未完成** - 最高优先级
2. **今日已完成** - 次优先级
3. **普通任务** - 按创建时间排序

```typescript
function sortSidelineTasks(
  tasks: Task[], 
  todayMustCompleteIds: string[]
): Task[] {
  return [...tasks].sort((a, b) => {
    const aIsMust = todayMustCompleteIds.includes(a.id);
    const bIsMust = todayMustCompleteIds.includes(b.id);
    const aIsCompleted = isTodayCompleted(a);
    const bIsCompleted = isTodayCompleted(b);
    
    // 今日必须完成且未完成的排最前
    if (aIsMust && !aIsCompleted && (!bIsMust || bIsCompleted)) return -1;
    if (bIsMust && !bIsCompleted && (!aIsMust || aIsCompleted)) return 1;
    
    // 今日必须完成且已完成的排第二
    if (aIsMust && aIsCompleted && !bIsMust) return -1;
    if (bIsMust && bIsCompleted && !aIsMust) return 1;
    
    // 其他按创建时间排序
    return new Date(b.mainlineTask?.createdAt || 0).getTime() - 
           new Date(a.mainlineTask?.createdAt || 0).getTime();
  });
}
```

## 8. 状态流转

### 8.1 今日必须完成状态流转

```
┌─────────────┐
│   初始状态   │
└──────┬──────┘
       │ 8点后首次打开
       ▼
┌─────────────┐
│  显示弹窗   │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────┐
│确认 │ │跳过 │
└──┬──┘ └──┬──┘
   │       │
   ▼       ▼
┌─────────────┐
│ 当天不再提示 │
└──────┬──────┘
       │ 跨天
       ▼
┌─────────────┐
│   重置状态   │
└─────────────┘
```

### 8.2 Group 模式状态流转

```
┌─────────────────┐
│  默认模式       │
└────────┬────────┘
         │ 点击切换图标
         │ (需要有带标签的任务)
         ▼
┌─────────────────┐
│  Group 模式     │
└────────┬────────┘
         │ 点击切换图标
         │ 或删除所有标签
         ▼
┌─────────────────┐
│  默认模式       │
└─────────────────┘
```

## 9. 性能考虑

### 9.1 组件优化

- 使用 `React.memo` 包装 `GroupCard` 和 `SidelineTaskCard`
- 使用 `useMemo` 缓存排序后的任务列表
- 使用 `useCallback` 缓存事件处理函数

### 9.2 存储优化

- 标签数据量小，直接使用 localStorage
- 今日必须完成状态每天重置，不会累积

### 9.3 渲染优化

- Group 模式下使用虚拟列表（如果任务数量超过50个）
- 弹窗使用 `destroyOnClose` 避免不必要的 DOM 保留
