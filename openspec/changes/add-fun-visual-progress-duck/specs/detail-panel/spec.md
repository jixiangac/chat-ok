# detail-panel Specification Delta

> 本文件描述对 `detail-panel` 规范的增量修改

## ADDED Requirements

### Requirement: 趣味视觉进度组件 - 鸭子剪影

系统 **SHALL** 为打卡型任务提供基于图标映射的趣味视觉进度组件，首个实现为鸭子剪影 + 水波填充效果。

#### Scenario: 根据 category 选择视觉组件

**GIVEN** 任务类型为 CHECK_IN
**WHEN** 显示今日进度卡片
**THEN** 根据任务的 `category` 字段选择对应的视觉组件：
- `category: 'water'` → 渲染 DuckWaterProgress（鸭子剪影）
- 其他 category 或未定义 → 渲染 CoffeeCupProgress（咖啡杯，默认）

#### Scenario: 鸭子剪影视觉效果

**GIVEN** 任务 category 为 'water'
**WHEN** 显示进度组件
**THEN** 显示：
- 中心：鸭子剪影（灰色 #E8E8E8）
- 水波填充：奶油蓝 #A8D8EA，高度 = 周期完成度百分比
- 水波下方：进度数值「455 / 2000 ml」
- 数值下方：差值「还差 1545 ml」

#### Scenario: 水位上升动画

**GIVEN** 用户点击快捷按钮完成打卡
**WHEN** 打卡成功
**THEN** 
- 水波高度从旧进度平滑上升到新进度（300ms ease-out）
- 进度数值跳动更新
- 差值同步更新

#### Scenario: 水面晃动效果

**GIVEN** 鸭子剪影组件显示
**WHEN** 组件加载完成
**THEN** 水面持续晃动（3s 无限循环动画）

#### Scenario: 完成庆祝动画

**GIVEN** 打卡后周期进度达到 100%
**WHEN** 水位上升动画结束
**THEN** 
- 触发撒花效果（canvas-confetti）
- 粒子数 100，扩散角度 70°，起点 y=0.6
- 动画持续约 2s

#### Scenario: 超出目标时的水位显示

**GIVEN** 用户打卡超过周期目标值
**WHEN** 计算水位高度
**THEN** 水位保持 100%（不溢出剪影）

---

### Requirement: 快捷操作按钮

系统 **SHALL** 为打卡型任务提供快捷操作按钮，支持快速累加值、一键填满和手动输入。

#### Scenario: 快捷按钮渲染

**GIVEN** 任务 checkInConfig 包含 quickActions 配置
**WHEN** 显示详情页
**THEN** 在进度组件下方显示快捷按钮网格（2 列 3 行）：
- 每个按钮显示 label 文字
- 按钮样式：白色背景，圆角 12px，边框 1px #E8E8E8
- 激活状态：主题渐变色背景

#### Scenario: 数值按钮点击

**GIVEN** 用户点击数值按钮（如"50ml"）
**WHEN** 点击成功
**THEN** 
- 调用 checkIn API，累加对应数值
- 触发水位上升动画
- 显示成功 Toast

#### Scenario: 一键填满按钮

**GIVEN** 用户点击"一键填满"按钮
**WHEN** 点击成功
**THEN** 
- 读取当前周期的 cycleTargetValue
- 调用 checkIn API，直接设置为目标值
- 触发撒花动画

#### Scenario: 手动输入按钮

**GIVEN** 用户点击"手动输入"按钮
**WHEN** 点击触发
**THEN** 打开现有的 CheckInModal 弹窗

#### Scenario: 按钮禁用状态

**GIVEN** 今日目标已完成或正在处理中
**WHEN** 显示快捷按钮
**THEN** 所有按钮变灰，禁用点击

---

### Requirement: 底部二级入口按钮

系统 **SHALL** 将二级入口按钮改为简约的文字按钮样式，参考支线任务区域的「随机打开」「所有支线」按钮。

#### Scenario: 简约按钮样式

**GIVEN** 显示详情页
**WHEN** 渲染二级入口区域
**THEN** 
- 按钮无背景、无边框
- 文字颜色：#9b9b9b
- 字体大小：14px
- 内边距：8px 12px
- 圆角：8px

#### Scenario: 横向居中布局

**GIVEN** 显示二级入口
**WHEN** 渲染按钮容器
**THEN** 
- 按钮横向居中排列
- 按钮间距：20px
- 容器上边距：16px

#### Scenario: hover 交互

**GIVEN** 鼠标悬停在按钮上
**WHEN** hover 触发
**THEN** 文字颜色变为 #666

#### Scenario: 点击交互

**GIVEN** 用户点击按钮
**WHEN** tap 触发
**THEN** 
- 按钮缩放至 scale(0.95)
- 打开对应的子页面（变动记录 / 周期计划）

#### Scenario: 按钮文案

**GIVEN** 任务类型为 CHECK_IN 或 NUMERIC
**WHEN** 显示二级入口
**THEN** 显示两个按钮：
- 「变动记录」 → 打开 ActivityRecordPanel
- 「周期计划」 → 打开 HistoryCyclePanel

---

## MODIFIED Requirements

### Requirement: CHECK_IN 类型 - 图标映射机制

系统 **SHALL** 为打卡型任务使用基于 category 的图标映射机制展示进度，默认使用咖啡杯水位隐喻。

#### Scenario: 默认咖啡杯布局

**GIVEN** 任务类型为 CHECK_IN 且 category 不为 'water'
**WHEN** 显示今日进度卡片
**THEN** 显示：
- 中心：咖啡杯图形，水位高度 = 周期完成度
- 水位下方：今日进度条
- 杯子下方：打卡按钮

---

## Component Structure Updates

### 新增组件

| 组件名 | 说明 | 位置 |
|--------|------|------|
| `DuckWaterProgress` | 鸭子剪影 + 水波进度组件 | `src/pages/dc/components/DuckWaterProgress/` |
| `DuckSilhouette` | 鸭子 SVG 剪影子组件 | `src/pages/dc/components/DuckWaterProgress/DuckSilhouette.tsx` |
| `WaterWave` | 水波动画子组件 | `src/pages/dc/components/DuckWaterProgress/WaterWave.tsx` |
| `QuickActionButtons` | 快捷操作按钮网格 | `src/pages/dc/components/QuickActionButtons/` |

### 修改组件

| 组件名 | 修改内容 |
|--------|----------|
| `TaskDetailPanel` (detail/index.tsx) | 添加图标映射逻辑，集成 QuickActionButtons |
| `SecondaryNav` | 改为简约文字按钮样式（参考 SidelineTaskGrid） |

---

## Data Model Updates

### CheckInConfig 扩展

```typescript
interface CheckInConfig {
  // ... 现有字段
  
  /** 快捷操作按钮配置 */
  quickActions?: Array<{
    /** 按钮文字 */
    label: string;
    /** 数值（如 50, 100） */
    value?: number;
    /** 特殊操作（fillToTarget | openModal） */
    action?: 'fillToTarget' | 'openModal';
  }>;
}
```

### Task 接口扩展

```typescript
interface Task {
  // ... 现有字段
  
  /** 任务分类（用于图标映射） */
  category: 'water' | 'coffee' | string;
}
```

**注意：** `category` 字段已存在于现有 Task 接口中，本次变更仅是利用该字段进行图标映射，无需修改数据结构。

---

## Visual Reference

### 鸭子剪影 + 水波

```
┌─────────────────────────────────┐
│                                 │
│        ╭───╮                    │
│       ╱ · · ╲                   │ ← 鸭头（灰色剪影）
│      │  ︶  │                    │
│       ╲───╱                     │
│     ╱███████╲                   │
│    │█████████│                  │ ← 水波填充（奶油蓝）
│     ╲███████╱                   │
│       ╲ ╱                       │
│        ╳                        │ ← 鸭身剪影
│                                 │
│       455 / 2000 ml             │
│       还差 1545 ml              │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │50ml │ │100ml│ │200ml│       │ ← 快捷按钮
│  └─────┘ └─────┘ └─────┘       │
│  ┌─────┐ ┌────────┐ ┌────┐     │
│  │500ml│ │一键填满│ │手动│     │
│  └─────┘ └────────┘ └────┘     │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 🌈 当日记录        2 >   │  │ ← 渐变色进度按钮
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Cross-References

本变更与以下规范相关：
- **detail-panel** - 主要变更目标
- **tag-system** - 未来可通过标签自动映射图标类型

---

## Implementation Notes

1. **图标映射扩展性**：
   - 使用配置映射表 `CATEGORY_ICON_MAP`，方便未来添加新图标
   - 建议将映射表抽取到 `constants/icons.ts`

2. **性能优化**：
   - SVG 使用 `<use>` 元素复用路径
   - 动画使用 GPU 加速（`transform: translateZ(0)`）
   - confetti 触发增加防抖，避免重复

3. **兼容性**：
   - 默认 category 为 'coffee'，保证现有任务继续使用咖啡杯
   - quickActions 为可选字段，不影响现有数据

4. **测试覆盖**：
   - 单元测试：组件渲染、动画触发、进度计算
   - 集成测试：完整打卡流程、多设备显示
   - 性能测试：动画帧率、内存占用

---

## Migration Path

无需数据迁移。现有任务：
- 继续使用 CoffeeCupProgress（默认行为）
- 新增的 quickActions 字段为可选，不影响现有功能
