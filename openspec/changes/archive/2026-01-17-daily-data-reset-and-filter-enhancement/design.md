# Design: 每日数据重置与一日清单筛选增强

## Architecture Overview

本设计涉及三个主要系统的协作：

```
┌─────────────────────────────────────────────────────────────────┐
│                        AppProvider                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  DateTracker    │  │  Event Emitter  │  │  Test Date      │  │
│  │  (日期检测)      │──│  (事件触发)      │──│  (测试日期)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ system-date-changed event
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SceneProvider                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  DailyReset     │  │  CycleAdvance   │  │  Cache Clear    │  │
│  │  (数据重置)      │──│  (周期推进)      │──│  (缓存清理)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ tasks updated
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DailyViewFilter                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Exclude Rules  │  │  Mandatory      │  │  Flexible       │  │
│  │  (排除规则)      │──│  (必显示)        │──│  (动态显示)      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. DateTracker (日期追踪器)

**职责**: 管理日期状态，检测日期变更

**存储结构**:
```typescript
// localStorage keys
const STORAGE_KEYS = {
  LAST_VISITED_DATE: 'dc_last_visited_date',  // 上次访问日期
  TEST_DATE: 'dc_test_date',                   // 测试日期（可选）
};

// 日期格式: YYYY-MM-DD
```

**核心接口**:
```typescript
interface DateTracker {
  // 获取当前有效日期（优先使用测试日期）
  getCurrentDate(): string;
  
  // 获取上次访问日期
  getLastVisitedDate(): string | null;
  
  // 设置上次访问日期
  setLastVisitedDate(date: string): void;
  
  // 检测日期是否变更，返回变更信息
  checkDateChange(): DateChangeInfo | null;
  
  // 测试日期管理
  getTestDate(): string | null;
  setTestDate(date: string): void;
  clearTestDate(): void;
}

interface DateChangeInfo {
  oldDate: string;
  newDate: string;
  daysDiff: number;  // 相差天数
}
```

**检测时机**:
- App 初始化时（冷启动）
- visibilitychange 事件（tab 激活）
- online 事件（网络恢复）
- 场景切换时（normal、vacation、memorial、okr 之间切换）
- 页面切换时（设置页面、详情页打开）

### 2. DailyDataReset (每日数据重置)

**职责**: 执行数据重置和周期推进

**核心接口**:
```typescript
interface DailyDataReset {
  // 重置单个任务的今日进度
  resetTodayProgress(task: Task): Task;
  
  // 判断是否需要推进周期
  shouldAdvanceCycle(task: Task, targetDate: string): boolean;
  
  // 计算新的周期信息
  calculateNewCycle(task: Task, targetDate: string): CycleUpdateInfo;
  
  // 执行完整的每日重置
  performDailyReset(tasks: Task[], targetDate: string): DailyResetResult;
}

interface CycleUpdateInfo {
  newCycle: number;
  cycleAdvanced: boolean;
  cyclesSkipped: number;
}

interface DailyResetResult {
  updatedTasks: Task[];
  resetCount: number;
  cycleAdvancedCount: number;
}
```

**周期推进算法**:
```typescript
function calculateNewCycle(task: Task, targetDate: string): CycleUpdateInfo {
  const { time, cycle } = task;
  const startDate = dayjs(time.startDate);
  const target = dayjs(targetDate);
  const daysPassed = target.diff(startDate, 'day');
  
  // 计算应该在第几个周期
  const expectedCycle = Math.floor(daysPassed / cycle.cycleDays) + 1;
  const newCycle = Math.min(expectedCycle, cycle.totalCycles);
  
  return {
    newCycle,
    cycleAdvanced: newCycle > cycle.currentCycle,
    cyclesSkipped: newCycle - cycle.currentCycle
  };
}
```

### 3. DailyViewFilter (一日清单筛选器)

**职责**: 根据规则筛选今日应显示的任务

**筛选流程**:
```
输入: 所有任务
    │
    ▼
┌─────────────────────────────────────┐
│ Step 1: 排除规则                     │
│ - 已完成 (COMPLETED)                 │
│ - 已归档 (ARCHIVED, ARCHIVED_HISTORY)│
│ - 总进度 >= 100%                     │
│ - 周期进度 >= 100%                   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Step 2: 分类任务                     │
│ - 主线任务 → 必显示                  │
│ - 每日打卡任务 → 必显示              │
│ - 快临期任务 → 必显示                │
│ - 时间充裕任务 → 待选                │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Step 3: 动态选择时间充裕任务          │
│ - 计算可显示数量                     │
│ - 加权概率选择                       │
└─────────────────────────────────────┘
    │
    ▼
输出: 筛选后的任务列表
```

**快临期判断**:
```typescript
function isNearDeadline(task: Task): boolean {
  const { cycle, time } = task;
  const today = dayjs();
  const startDate = dayjs(time.startDate);
  
  // 计算当前周期的起始日期
  const cycleStartDate = startDate.add(
    (cycle.currentCycle - 1) * cycle.cycleDays, 
    'day'
  );
  
  // 计算当前周期的结束日期
  const cycleEndDate = cycleStartDate.add(cycle.cycleDays, 'day');
  
  // 计算剩余天数
  const remainingDays = cycleEndDate.diff(today, 'day');
  
  // 剩余天数 <= 30% 周期时间
  return remainingDays <= cycle.cycleDays * 0.3;
}
```

**动态数量控制**:
```typescript
function calculateFlexibleTaskLimit(mandatoryCount: number): number {
  if (mandatoryCount <= 3) return 3;
  if (mandatoryCount <= 5) return 2;
  return 1;
}
```

**加权概率选择**:
```typescript
function selectFlexibleTasks(
  tasks: Task[], 
  limit: number, 
  date: string
): Task[] {
  if (tasks.length <= limit) return tasks;
  
  // 计算每个任务的权重（完成率越低权重越高）
  const weighted = tasks.map(task => {
    const completionRate = task.progress?.cyclePercentage ?? 0;
    // 权重 = 100 - 完成率，最小为1
    const weight = Math.max(1, 100 - completionRate);
    return { task, weight };
  });
  
  // 使用稳定的伪随机选择
  const selected: Task[] = [];
  const remaining = [...weighted];
  
  while (selected.length < limit && remaining.length > 0) {
    // 计算总权重
    const totalWeight = remaining.reduce((sum, w) => sum + w.weight, 0);
    
    // 生成稳定的随机数
    const seed = hashCode(date + selected.length.toString());
    const random = (seed % 1000) / 1000 * totalWeight;
    
    // 选择任务
    let cumulative = 0;
    for (let i = 0; i < remaining.length; i++) {
      cumulative += remaining[i].weight;
      if (cumulative >= random) {
        selected.push(remaining[i].task);
        remaining.splice(i, 1);
        break;
      }
    }
  }
  
  return selected;
}
```

## Data Flow

### 日期变更流程

```
1. 用户打开应用 / 切换 tab / 网络恢复 / 场景切换 / 页面切换
   │
   ▼
2. AppProvider.checkDate()
   │
   ├─ 无变更 → 结束
   │
   └─ 有变更 → 触发 system-date-changed 事件
                │
                ▼
3. SceneProvider 监听事件
   │
   ▼
4. 执行 performDailyReset()
   │
   ├─ 重置所有任务的 todayProgress
   │
   ├─ 推进需要推进的周期
   │
   └─ 清空一日清单缓存
       │
       ▼
5. 更新 React 状态，触发重渲染
   │
   ▼
6. 一日清单使用新的筛选逻辑
```

### 测试日期流程

```
1. 用户在设置中选择测试日期
   │
   ▼
2. 调用 AppProvider.setTestDate(date)
   │
   ▼
3. 存储到 localStorage
   │
   ▼
4. 用户点击"触发日期变更"
   │
   ▼
5. 手动触发 system-date-changed 事件
   │
   ▼
6. 执行正常的日期变更流程
```

## Error Handling

### 边界情况

1. **任务开始日期在未来**
   - 不推进周期
   - todayProgress 保持初始状态

2. **任务已结束（超过总周期）**
   - 周期保持在最后一个
   - 检查是否需要标记为完成

3. **localStorage 不可用**
   - 降级为内存存储
   - 每次刷新都会触发重置

4. **测试日期格式错误**
   - 验证日期格式
   - 无效日期不保存

## Performance Considerations

1. **批量更新**
   - 使用 `batchUpdate` 一次性更新所有任务
   - 避免多次触发 React 重渲染

2. **缓存策略**
   - 一日清单结果缓存到 localStorage
   - 日期变更时清空缓存

3. **事件节流**
   - visibilitychange 事件使用防抖
   - 避免频繁检测

## Testing Strategy

### 单元测试

1. `DateTracker` 测试
   - 日期存储和读取
   - 日期变更检测
   - 测试日期功能

2. `DailyDataReset` 测试
   - todayProgress 重置
   - 周期推进计算
   - 多天跳过场景

3. `DailyViewFilter` 测试
   - 排除规则
   - 必显示规则
   - 动态数量控制
   - 加权概率选择

### 集成测试

1. 日期变更端到端流程
2. 设置中的时间测试功能
3. 一日清单显示正确性
