## Context

DC 任务管理系统需要增加游戏化激励机制。本设计基于《凡人修仙传》的修炼体系，将任务完成转化为"修为"积累，通过境界晋升给用户长期目标感。

**约束条件**:
- 纯前端实现，数据存储在本地 `dc_user_data`
- 需要与现有任务打卡逻辑集成
- UI 风格保持 Notion 简约风，参考图片质感

## Goals / Non-Goals

**Goals**:
- 实现完整的 9 大境界 53 级修仙体系
- 任务打卡实时获得修为
- 周期结算奖励/惩罚机制
- 跨大境界降级的闭关保护
- 下拉触发的全屏修炼面板

**Non-Goals**:
- 灵石消费系统（后续迭代）
- 广告获取修为（后续迭代）
- 晋升/降级动画弹窗（后续迭代）

## Decisions

### 1. 境界与修为范围设计

采用阶梯式增长曲线：

```typescript
// 炼气期基础值
const BASE_CULTIVATION = 100;

// 炼气期 13 层，每层 +5%
// 第1层: 100, 第2层: 105, 第3层: 110.25 ...

// 筑基期起，跨大境界 +15%，同境界内每阶段 +10%
// 筑基初期 = 炼气13层上限 * 1.15
// 筑基中期 = 筑基初期上限 * 1.10
```

**决策理由**: 阶梯式增长既保证前期快速反馈，又让后期有挑战性。

### 2. 数据结构设计

```typescript
interface CultivationData {
  // 当前状态
  realm: RealmType;           // 大境界
  stage: StageType;           // 小阶段（炼气期为层数）
  currentExp: number;         // 当前修为值
  
  // 闭关状态
  seclusion: {
    active: boolean;          // 是否在闭关中
    startDate: string;        // 闭关开始日期
    targetExp: number;        // 维持目标修为
    originalRealm: RealmType; // 原境界（闭关失败后降级目标）
  } | null;
  
  // 统计
  totalExpGained: number;     // 累计获得修为
  breakthroughCount: number;  // 突破次数
}

// 修为历史记录（按周存储）
interface CultivationHistory {
  [weekKey: string]: CultivationRecord[];
}

interface CultivationRecord {
  timestamp: string;
  type: 'check_in' | 'cycle_reward' | 'cycle_penalty' | 'donation';
  amount: number;
  taskId?: string;
  taskTitle?: string;
  description: string;
}
```

### 3. 修为获取配置

```typescript
const TASK_EXP_CONFIG = {
  NUMERIC: 10,    // 数值型任务每次打卡
  CHECKLIST: 5,   // 清单型任务每项完成
  CHECK_IN: 8,    // 打卡型任务每次打卡
};

const CYCLE_REWARD_CONFIG = {
  threshold: 0.3,           // 30% 完成度触发奖励
  baseMultiplier: 1.0,      // 基础倍率
  fullCompletionBonus: 0.2, // 100% 完成额外 +20%
};
```

### 4. 修为降低配置

```typescript
const PENALTY_CONFIG = {
  // 按境界分档，境界越高扣得越多
  LIANQI: 5,      // 炼气期
  ZHUJI: 10,      // 筑基期
  JIEDAN: 15,     // 结丹期
  YUANYING: 20,   // 元婴期
  HUASHEN: 25,    // 化神期
  LIANXU: 30,     // 炼虚期
  HETI: 35,       // 合体期
  DACHENG: 40,    // 大乘期
  DUJIE: 50,      // 渡劫期
};
```

### 5. 闭关保护机制

- **触发条件**: 修为降低导致需要跨大境界降级时
- **闭关时长**: 15 天
- **维持目标**: 固定值（由系统在触发时计算并设定）
- **成功条件**: 15 天内修为达到维持目标
- **失败后果**: 按实际修为对应境界降级

### 6. UI 交互设计

**触发方式**: 主页面下拉超过阈值（如 150px）触发全屏修炼面板

**面板布局**（参考提供的图片）:
- 顶部: 境界名称 + 当前阶段
- 中部: 角色形象/意象展示区
- 下部: 修为进度条 + 数值显示
- 底部: 详情按钮 / 突破按钮（修为满时显示）

**设计风格**: 
- 浅色简约背景（参考图3）
- 圆角卡片布局
- 使用 ui-ux-pro-max 工作流精细打磨

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 修为数值膨胀过快 | 阶梯式增长 + 后期需要更多修为 |
| 用户因降级产生挫败感 | 闭关保护 + 低境界低惩罚 |
| 本地存储数据丢失 | 后续考虑云同步，当前接受风险 |
| 历史记录存储过大 | 按周存储 + 定期清理旧数据 |

## Migration Plan

1. 新功能独立模块，不影响现有任务逻辑
2. 用户首次访问时初始化为炼气一层、修为 0
3. 现有任务打卡逻辑增加修为获取钩子
4. 周期结算逻辑增加修为奖惩钩子

## Open Questions

1. 炼气期每层的具体修为范围数值需要最终确定（建议：第1层 0-100）
2. 角色形象展示区是否需要动态效果（建议：简单静态图即可）
3. 修为历史保留多久（建议：最近 12 周）
