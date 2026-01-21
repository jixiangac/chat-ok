## Context

DC 任务管理系统已有修为系统，但缺乏资源消耗机制。本设计引入灵玉作为可消耗货币，与修为形成"消耗-获取"闭环，增强游戏化体验。

**约束条件**:
- 纯前端实现，数据存储在本地 `dc_user_data`
- 需与现有 CultivationProvider 协同工作
- 不破坏现有任务打卡流程

## Goals / Non-Goals

**Goals**:
- 实现灵玉积分的存储与管理
- 实现每日积分上限计算机制
- 创建任务时检查并扣除灵玉
- 任务打卡时同步获取灵玉和修为
- 一日清单完成和刷新的积分逻辑
- 归档总结时的积分奖励

**Non-Goals**:
- 灵玉购买/充值（不涉及真实货币）
- 灵玉交易/转让
- 积分排行榜

## Decisions

### 1. 每日积分上限计算

```typescript
// 基础值
const BASE_SPIRIT_JADE = 20;  // 灵石基础
const BASE_CULTIVATION = 10;  // 修为基础

// 打卡类型系数
const CHECK_IN_UNIT_MULTIPLIER = {
  DURATION: 1.15,   // 时长类 +15%
  TIMES: 1.0,       // 次数类 维持
  QUANTITY: 1.10,   // 数量类 +10%
};

// 任务类型系数
const TASK_TYPE_MULTIPLIER = {
  mainline: 2.0,    // 主线任务 +100%
  sidelineA: 1.0,
  sidelineB: 1.0,
};

// 计算公式
function calculateDailyPointsCap(taskType: TaskType, checkInUnit: CheckInUnit) {
  const unitMultiplier = CHECK_IN_UNIT_MULTIPLIER[checkInUnit];
  const typeMultiplier = TASK_TYPE_MULTIPLIER[taskType];
  
  return {
    spiritJade: Math.floor(BASE_SPIRIT_JADE * unitMultiplier * typeMultiplier),
    cultivation: Math.floor(BASE_CULTIVATION * unitMultiplier * typeMultiplier),
  };
}
```

**上限积分示例表**:

| 任务类型 | 打卡类型 | 灵石上限 | 修为上限 |
|---------|---------|---------|---------|
| 支线 | 时长(DURATION) | 23 | 11 |
| 支线 | 次数(TIMES) | 20 | 10 |
| 支线 | 数量(QUANTITY) | 22 | 11 |
| 主线 | 时长(DURATION) | 46 | 22 |
| 主线 | 次数(TIMES) | 40 | 20 |
| 主线 | 数量(QUANTITY) | 44 | 22 |

### 2. 积分分配逻辑

```typescript
// 任务打卡积分分配
function distributeCheckInPoints(
  completionRatio: number,  // 0-1 的完成比例
  dailyCap: { spiritJade: number, cultivation: number },
  isTodayMustComplete: boolean  // 是否为今日必须完成任务
) {
  let spiritJade = Math.ceil(dailyCap.spiritJade * completionRatio);
  let cultivation = Math.ceil(dailyCap.cultivation * completionRatio);
  
  // 今日必须完成任务额外 +15%
  if (isTodayMustComplete) {
    spiritJade = Math.ceil(spiritJade * 1.15);
    cultivation = Math.ceil(cultivation * 1.15);
  }
  
  return { spiritJade, cultivation };
}
```

### 3. 灵玉消耗配置

```typescript
const SPIRIT_JADE_COST = {
  CREATE_SIDELINE_TASK: 200,   // 创建支线任务
  CREATE_MAINLINE_TASK: 500,   // 创建主线任务
  REFRESH_DAILY_VIEW: 25,      // 刷新一日清单
};
```

### 4. 额外奖励配置

```typescript
// 周期完成100%额外奖励
const CYCLE_COMPLETE_BONUS_RATE = 0.10;  // 上限积分 × 10%

// 一日清单完成奖励
const DAILY_VIEW_COMPLETE_REWARD = {
  baseSpiritJade: 10,
  baseCultivation: 10,
  countBonus: {
    5: 1.15,   // > 5个任务 +15%
    8: 1.20,   // > 8个任务 +20%
    10: 1.25,  // > 10个任务 +25%
  },
};

// 归档总结奖励
const ARCHIVE_REWARD = {
  multiplier: 2,          // 总值 = 每日上限 × 2
  minCompletionRate: 0.3, // 完成率 < 30% 不分发
};
```

### 5. 数据结构设计

```typescript
interface SpiritJadeData {
  // 当前余额
  balance: number;  // 初始 1000
  
  // 统计
  totalEarned: number;    // 累计获得
  totalSpent: number;     // 累计消耗
  
  // 时间戳
  lastUpdatedAt: string;
  createdAt: string;
}

// 积分变动记录
interface PointsRecord {
  id: string;
  timestamp: string;
  type: 'EARN' | 'SPEND';
  source: 'CHECK_IN' | 'CYCLE_COMPLETE' | 'DAILY_COMPLETE' | 'ARCHIVE' | 'CREATE_TASK' | 'REFRESH_DAILY';
  spiritJade: number;
  cultivation: number;
  taskId?: string;
  taskTitle?: string;
  description: string;
}
```

### 6. Context 设计方案

**方案选择**: 扩展现有 CultivationProvider，新增灵玉相关状态和方法

**决策理由**: 
- 灵玉和修为是强关联的双积分，打卡时需要同时处理
- 避免多 Context 导致状态同步问题
- 复用现有的历史记录机制

## Risks / Trade-offs

| 风险 | 缓解措施 |
|-----|---------|
| 灵玉不足影响用户创建任务 | 初始值设为1000，确保足够创建多个任务 |
| 积分计算复杂度增加 | 抽象为独立工具函数，便于测试和维护 |
| 数据迁移（现有用户） | 首次加载时检测并初始化灵玉数据 |

## 7. 奖励获取显化UI

当用户获得积分时，通过轻量级浮层Toast展示奖励，增强获得感。

### 单一奖励样式
```
┌─────────────────────────┐
│  💎 +23   ⚡ +11        │
│  任务打卡               │
└─────────────────────────┘
```

### 多重奖励合并样式
当一次操作触发多个奖励时（如打卡同时触发周期完成+清单完成）：
```
┌─────────────────────────┐
│  💎 +23   ⚡ +11        │
│  ├ 任务打卡             │
│  💎 +4    ⚡ +2         │
│  ├ 周期100%完成         │
│  💎 +12   ⚡ +12        │
│  └ 一日清单完成         │
│  ─────────────────────  │
│  合计 💎 +39  ⚡ +25    │
└─────────────────────────┘
```

### 实现方案

```typescript
// 奖励项
interface RewardItem {
  spiritJade: number;
  cultivation: number;
  source: string;  // '任务打卡' | '周期100%完成' | '一日清单完成' | '归档奖励'
}

// 奖励队列：在一次操作中收集所有奖励
const rewards: RewardItem[] = [];

// 打卡时收集所有触发的奖励
rewards.push({ spiritJade: 23, cultivation: 11, source: '任务打卡' });

// 检查是否触发周期完成
if (cycleJustCompleted) {
  rewards.push({ spiritJade: 4, cultivation: 2, source: '周期100%完成' });
}

// 检查是否触发一日清单完成
if (dailyViewJustCompleted) {
  rewards.push({ spiritJade: 12, cultivation: 12, source: '一日清单完成' });
}

// 统一显示
showRewardToast(rewards);
```

### 显示规则

| 奖励数量 | 显示样式 | 停留时长 |
|---------|---------|--------|
| 1条 | 简洁单行 | 2秒 |
| 2-4条 | 分条列出 + 合计行 | 3秒 |

### 触发场景
- ✅ 任务打卡获得积分
- ✅ 周期完成100%额外奖励
- ✅ 一日清单完成100%奖励
- ✅ 归档总结奖励

### 不触发场景
- ❌ 创建任务消耗灵玉（用按钮禁用态表达）
- ❌ 刷新一日清单消耗（同上）

## Open Questions

- [ ] 是否需要积分变动的历史记录查看入口？
