## Context

DC 任务管理系统需要完善调试能力，以提高开发和测试效率。当前系统已有基础调试功能（debugNextDay、debugNextCycle、日期测试），但存在以下问题：
1. 现有调试功能存在 Bug
2. 灵玉和修为调试能力缺失
3. 调试功能对所有用户可见，需要隐藏

**约束条件**:
- 调试功能默认隐藏，通过彩蛋解锁
- 调试操作应当记录历史，便于追踪
- 不应影响正式业务逻辑和数据结构

## Goals / Non-Goals

**Goals**:
- 实现开发者模式解锁机制（彩蛋 + 密码）
- 修复任务详情调试的已知 Bug
- 实现灵玉数量的直接设置
- 实现修为数值的直接设置，并自动触发等级检查
- 统一调试入口，集中在设置面板的开发者选项

**Non-Goals**:
- 闭关相关调试（后续迭代）
- 批量调试（如批量修改多个任务）
- 调试数据的导出功能（已有数据管理功能）

## Decisions

### 1. 开发者模式解锁机制

```typescript
// 解锁流程：
// 1. 在「数据管理」页面的「偏好设置」区域快速点击 10 次
// 2. 弹出输入框
// 3. 输入 "jixiangac" 密码
// 4. 解锁成功，持久化到 localStorage

const DEVELOPER_MODE_KEY = 'dc_developer_mode';
const UNLOCK_PASSWORD = 'jixiangac';
const REQUIRED_CLICKS = 10;
const CLICK_TIMEOUT = 2000; // 2秒内完成 10 次点击
const MAX_PASSWORD_ATTEMPTS = 3; // 密码最多尝试3次

interface DeveloperModeState {
  enabled: boolean;
  unlockedAt?: string;
}

// 状态管理工具函数
function getDeveloperMode(): boolean { ... }
function setDeveloperMode(enabled: boolean): void { ... }
function toggleDeveloperMode(): void { ... }

// 解锁流程细节：
// - 解锁成功：无提示，直接显示新入口
// - 密码错误：Toast 提示「密码错误」，最多尝试 3 次
// - 超过 3 次：关闭弹窗，需要重新触发彩蛋（10次点击）
```

**解锁后可见的功能**：
- 详情页的 debugNextDay/debugNextCycle 按钮
- 设置页的「日期测试」入口
- 设置页的「灵玉调试」入口
- 设置页的「修为调试」入口

### 2. 任务详情调试 Bug 分析

已知问题：
1. **周期进展天数没更新** - 需要排查 `remainingDays` 计算逻辑
2. **当日记录里奖励不对** - 需要检查奖励计算是否使用模拟日期
3. **新记录不出现在当日记录** - 需要检查记录日期是否使用模拟日期

当前实现基于 `debugDayOffset` 字段，核心逻辑在：
- `getSimulatedToday(task)` - 获取模拟日期
- `getSimulatedTimestamp(task)` - 获取模拟时间戳

需要确保这些函数在所有相关地方被正确使用。

### 3. 灵玉调试接口设计

```typescript
// CultivationProvider 新增方法
interface CultivationContextValue {
  // ... 现有方法
  
  // 调试：直接设置灵玉数量
  debugSetSpiritJade: (amount: number) => void;
}

// 实现逻辑
const debugSetSpiritJade = useCallback((amount: number) => {
  const diff = amount - spiritJadeData.balance;
  const newData: SpiritJadeData = {
    ...spiritJadeData,
    balance: amount,
    // 根据 diff 正负决定更新 totalEarned 或 totalSpent
    totalEarned: diff > 0 ? spiritJadeData.totalEarned + diff : spiritJadeData.totalEarned,
    totalSpent: diff < 0 ? spiritJadeData.totalSpent + Math.abs(diff) : spiritJadeData.totalSpent,
    lastUpdatedAt: new Date().toISOString(),
  };
  saveSpiritJade(newData);
  
  // 记录调试操作到历史
  addPointsHistoryRecord({
    type: 'DEBUG',
    source: 'DEBUG_SET',
    spiritJade: diff,
    description: `[调试] 设置灵玉为 ${amount}`,
  });
}, [spiritJadeData, saveSpiritJade, addPointsHistoryRecord]);
```

### 4. 修为调试接口设计

```typescript
// CultivationProvider 新增方法
interface CultivationContextValue {
  // ... 现有方法
  
  // 调试：直接设置修为数值
  debugSetExp: (amount: number) => void;
}

// 实现逻辑 - 关键是自动触发等级更新
const debugSetExp = useCallback((amount: number) => {
  // 1. 根据新修为值计算应该处于的等级
  const targetLevel = calculateLevelFromExp(amount);
  
  // 2. 更新数据（直接设置，不触发闭关逻辑）
  const newData: CultivationData = {
    ...data,
    currentExp: amount,
    realm: targetLevel.realm,
    stage: targetLevel.stage,
    layer: targetLevel.layer,
    seclusion: null, // 清除闭关状态
    lastUpdatedAt: new Date().toISOString(),
  };
  
  saveData(newData);
  
  // 3. 记录历史
  addHistoryRecord({
    type: 'DEBUG',
    amount: amount - data.currentExp,
    description: `[调试] 设置修为为 ${amount}`,
  });
}, [data, saveData, addHistoryRecord]);
```

**等级计算逻辑**:
```typescript
// 根据修为值反推应处于的等级
function calculateLevelFromExp(exp: number): { realm: RealmType; stage: StageType | null; layer: LianqiLayer | null } {
  // 遍历所有等级，找到 exp 所属的区间
  // 从炼气一层开始，累加每个等级的 expCap
  // 直到找到 exp < 当前等级 expCap 的位置
}
```

### 5. 调试入口 UI 设计

解锁后在设置面板的开发者选项中新增入口：

```
开发者
├── 归档历史
├── 数据管理      ← 包含解锁机制 + 关闭入口
├── 日期测试      ← 解锁后可见
└── 调试          ← 新增，解锁后可见，包含灵玉和修为调试
```

**调试页面结构**:
- 包含两个调试模块：灵玉调试、修为调试
- 统一入口，方便管理

**灵玉调试模块**:
- 显示当前余额
- 提供数字输入框直接设置
- 提供快捷按钮：+100、+500、+1000、-100、归零

**修为调试模块**:
- 显示当前修为和等级
- 提供数字输入框直接设置
- 修为变更后显示等级变化预览
- 确认后自动更新等级

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 调试功能被滥用 | 需要彩蛋解锁 + 密码验证，且操作记录历史 |
| 修为直接设置跳过闭关逻辑 | 调试模式直接设置，明确标注为调试行为 |
| 等级计算逻辑复杂 | 复用现有的 getExpCap 等工具函数 |

## Open Questions

1. ~是否需要在调试操作时添加确认弹窗？~ 不需要，快捷操作
2. ~调试历史记录是否需要单独标记/过滤？~ 使用 type='DEBUG' 区分
