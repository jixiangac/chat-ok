# Proposal: 趣味视觉进度组件 - 喝水鸭

## Motivation

当前任务详情页使用咖啡杯作为默认的进度可视化隐喻，虽然符合简约设计原则，但缺乏个性化和趣味性。用户希望为不同类型的任务提供更贴合场景的视觉元素，增强使用体验的愉悦感。

参考喝水打卡应用的设计，使用**鸭子剪影 + 水波填充**的视觉隐喻，将抽象的进度数据转化为生动的视觉反馈。这种设计既保持了简约风格，又提供了足够的趣味性和情感连接。

## Goals

### 核心目标
1. **视觉升级**：为 CHECK_IN 类型任务提供趣味视觉进度组件
2. **可扩展性**：建立图标映射机制，支持未来添加更多图标类型
3. **用户体验**：通过流畅动画和视觉反馈增强打卡成就感

### 非目标
- 不涉及任务数据结构的重大变更
- 不影响现有的任务创建流程
- 不提供用户手动切换视图的功能

## User Stories

**作为用户，我希望：**
1. 看到与任务场景匹配的可爱图标（如喝水任务显示鸭子）
2. 打卡时看到水位上升的流畅动画，获得即时反馈
3. 完成目标时看到庆祝动画，增强成就感

## Proposed Solution

### 方案概述

在现有的 `detail-panel` 基础上，新增一个趣味视觉进度组件 `DuckWaterProgress`，与现有的 `CoffeeCupProgress` 并列。根据任务的 `category` 字段自动选择对应的视觉组件。

### 核心设计

#### 1. 统一视觉组件

所有 CHECK_IN 类型任务统一使用鸭子剪影 + 水波填充的视觉效果，替代现有的咖啡杯组件。

#### 2. 视觉元素

##### 鸭子剪影组件 (`DuckWaterProgress`)

```
┌─────────────────────────────────┐
│                                 │
│        ╭───╮                    │
│       ╱ · · ╲     ← 鸭头        │
│      │  ︶  │                    │
│       ╲───╱                     │
│     ╱███████╲    ← 水波填充    │
│    │█████████│   (奶油蓝)      │
│     ╲███████╱                   │
│       ╲ ╱                       │
│        ╳       ← 鸭身剪影      │
│                                 │
│       455 / 2000 ml             │
│       还差 1545 ml              │
│                                 │
└─────────────────────────────────┘
```

**设计规格：**
- **剪影颜色**：`#E8E8E8`（浅灰，符合浅系风格）
- **水波颜色**：奶油蓝 `#A8D8EA`（固定）
- **水波动画**：
  - 上升动画：300ms ease-out
  - 水面晃动：subtle 无限循环动画
- **尺寸**：自适应容器，保持 1:1 比例

#### 3. 快捷操作按钮

```tsx
// 按钮配置示例（从 Task.checkInConfig 读取）
const quickActions = [
  { label: '50ml', value: 50 },
  { label: '100ml', value: 100 },
  { label: '200ml', value: 200 },
  { label: '500ml', value: 500 },
  { label: '一键填满', action: 'fillToTarget' },
  { label: '手动输入', action: 'openModal' }
];
```

**交互逻辑：**
- 点击数值按钮：累加到当前值
- 点击"一键填满"：直接设置为周期目标值
- 点击"手动输入"：弹出现有的 `CheckInModal`

#### 4. 底部二级入口按钮

改造现有的二级入口区域，参考支线任务区域的「随机打开」「所有支线」按钮样式，使用简约的横向文字按钮：

```tsx
// 参考 SidelineTaskGrid 的按钮样式
const buttonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '14px',
  color: '#9b9b9b',
  cursor: 'pointer',
  padding: '8px 12px',
  textDecoration: 'none',
  transition: 'color 0.2s ease, transform 0.2s ease',
  borderRadius: '8px',
};

// 布局：横向居中排列，间距 20px
<div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
  <button style={buttonStyle}>变动记录</button>
  <button style={buttonStyle}>周期计划</button>
</div>
```

### 技术实现

#### 组件结构

```
src/pages/dc/components/
└── DuckWaterProgress/
    ├── index.tsx          # 主组件
    ├── DuckSilhouette.tsx # SVG 鸭子剪影
    ├── WaterWave.tsx      # 水波动画组件
    └── styles.module.css
```

#### 数据流

```typescript
// Task 数据结构（新增字段）
interface Task {
  // ... 现有字段
  
  checkInConfig?: {
    // ... 现有字段
    quickActions?: Array<{    // 新增：快捷操作配置
      label: string;
      value?: number;
      action?: 'fillToTarget' | 'openModal';
    }>;
  };
}
```

#### 动画实现

```typescript
// 使用 framer-motion
import { motion } from 'framer-motion';

<motion.div
  className={styles.water}
  initial={{ height: `${prevProgress}%` }}
  animate={{ height: `${currentProgress}%` }}
  transition={{ 
    duration: 0.3, 
    ease: 'easeOut' 
  }}
/>
```

#### 完成庆祝

```typescript
// 使用 canvas-confetti
import confetti from 'canvas-confetti';

if (progress >= 100) {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}
```

### 影响范围

#### 修改文件

- `src/pages/dc/panels/detail/index.tsx` - 集成新组件
- `src/pages/dc/types.ts` - 新增 `quickActions` 类型定义

#### 新增文件

- `src/pages/dc/components/DuckWaterProgress/` - 新组件
- `src/pages/dc/components/QuickActionButtons/` - 快捷按钮组件

#### 不变部分

- 任务创建流程保持不变
- 数据存储结构保持兼容
- 现有 `CoffeeCupProgress` 组件不受影响

## Alternatives Considered

### 方案 1：用户可切换视图

**优点**：灵活性高，用户可自由选择
**缺点**：
- 增加 UI 复杂度（需要切换按钮）
- 增加状态管理成本
- 与"简约设计"原则冲突

**决策**：不采用，保持简约

### 方案 2：通用图标容器

设计一个通用的"剪影容器"，支持任意 SVG 图标。

**优点**：高度可扩展
**缺点**：
- 过度设计，当前需求不需要
- 增加抽象层复杂度

**决策**：不采用，按需扩展

## Open Questions

1. **Q**: 如果用户想自定义图标怎么办？
   **A**: 暂不支持，通过预设图标满足主流场景

2. **Q**: 快捷按钮的数值是否需要持久化？
   **A**: 是，作为 `checkInConfig.quickActions` 保存

3. **Q**: 是否需要支持深色模式？
   **A**: 一期不支持，使用固定的浅系配色

## Success Metrics

- 用户打卡时的视觉满意度（主观评价）
- 动画性能：60fps 无卡顿
- 组件加载时间：< 100ms

## Timeline

- **Phase 1**（优先级：高）：实现鸭子剪影组件和基础动画
- **Phase 2**（优先级：中）：集成到详情页，实现快捷按钮
- **Phase 3**（优先级：低）：优化动画细节，添加更多图标类型
