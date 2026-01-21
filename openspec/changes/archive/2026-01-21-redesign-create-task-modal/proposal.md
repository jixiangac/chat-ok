# Proposal: 重新设计创建任务弹窗

## 概述

重新设计 `CreateTaskModal` 组件，采用与设置页面一致的全屏整屏横移交互模式和 UI 风格，提升用户体验的一致性和流畅度。

## 动机

### 现状问题

1. **交互模式不一致**：CreateTaskModal 使用底部 Popup 弹窗，而设置页面使用全屏整屏横移，两种交互体验割裂
2. **样式实现混乱**：大量使用内联样式（600+ 行代码），难以维护和复用
3. **缺乏手势支持**：不支持滑动返回，用户需要点击按钮才能返回上一步
4. **视觉风格差异**：与设置页面的 Notion 风格不统一，缺乏头图、分组等设计元素

### 设置页面优秀实践

| 特性 | 设置页面 | CreateTaskModal（现状） |
|------|----------|------------------------|
| 交互模式 | 全屏整屏横移 | 底部 Popup |
| 手势支持 | 滑动返回 | 无 |
| 样式方案 | CSS Modules | 内联样式 |
| 组件复用 | SettingsSection、SettingsListItem | 无 |
| 动画效果 | 翻书动画、页面横移 | framer-motion 步骤切换 |
| 页面管理 | usePageStack | 简单 state |

## 设计目标

1. **统一交互体验**：采用全屏整屏横移模式，支持手势滑动返回
2. **复用设置页面组件**：使用 SubPageLayout、SettingsSection、SettingsListItem 等组件
3. **CSS Modules 重构**：将内联样式迁移到 CSS Modules
4. **保持功能完整**：保留现有的 3 步创建流程和所有配置选项

## 变更范围

### 新增

- `src/pages/dc/viewmodel/CreateTaskModal/styles.module.css` - 主样式文件
- `src/pages/dc/viewmodel/CreateTaskModal/pages/` - 页面组件目录
  - `CycleSettingsPage.tsx` - 周期设置页面
  - `TypeSelectPage.tsx` - 类型选择页面
  - `ConfigPage.tsx` - 具体配置页面
- `src/pages/dc/viewmodel/CreateTaskModal/components/` - 组件目录
  - `TaskTypeCard/` - 任务类型卡片组件
  - `CyclePreview/` - 周期预览组件
  - `OptionGrid/` - 选项网格组件

### 修改

- `src/pages/dc/viewmodel/CreateTaskModal/index.tsx` - 重构为页面栈管理模式
- `src/pages/dc/viewmodel/CreateTaskModal/steps/` - 迁移至 pages 目录（后删除）

### 删除

- `src/pages/dc/viewmodel/CreateTaskModal/steps/CycleStep.tsx`
- `src/pages/dc/viewmodel/CreateTaskModal/steps/TypeStep.tsx`
- `src/pages/dc/viewmodel/CreateTaskModal/steps/ConfigStep.tsx`

## 技术方案

### 1. 页面栈管理

复用设置页面的 `usePageStack` hook：

```typescript
const { currentPage, push, pop, canGoBack, reset } = usePageStack();
```

### 2. 手势返回

复用设置页面的 `useSwipeBack` hook：

```typescript
const { pageRef } = useSwipeBack({
  onBack: () => handleBack(true),
  enabled: canGoBack,
});
```

### 3. 页面布局

每个步骤页面使用 `SubPageLayout` 包装：

```tsx
<SubPageLayout
  title="周期设置"
  description="设定任务的总时长和周期长度"
  headerImage={cycleHeaderImage}
  onBack={handleBack}
>
  {/* 页面内容 */}
</SubPageLayout>
```

### 4. 表单组件

使用 `SettingsSection` 和 `SettingsListItem` 组织表单：

```tsx
<SettingsSection title="总时长">
  <SettingsListItem
    icon={<Calendar size={18} />}
    title="90 天"
    description="约 3 个月"
    rightContent={isSelected ? <Check /> : null}
    onClick={() => setTotalDays(90)}
  />
</SettingsSection>
```

## 用户体验改进

1. **更流畅的导航**：整屏横移动画，视觉连贯
2. **手势支持**：右滑返回上一步，操作自然
3. **视觉一致性**：与设置页面风格统一
4. **更好的信息层次**：头图 + 标题 + 描述 + 内容的清晰结构

## 兼容性

- 保持现有 props 接口不变（`visible`、`onClose`）
- 保持所有任务创建功能不变
- 保持灵玉扣除逻辑不变

## 依赖

- 复用 `src/pages/dc/panels/settings/hooks/usePageStack.ts`
- 复用 `src/pages/dc/panels/settings/hooks/useSwipeBack.ts`
- 复用 `src/pages/dc/panels/settings/components/SubPageLayout/`
- 复用 `src/pages/dc/panels/settings/components/SettingsSection/`
- 复用 `src/pages/dc/panels/settings/components/SettingsListItem/`

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 组件复用可能导致设置页面和创建弹窗样式耦合 | 使用 props 传递自定义样式，保持灵活性 |
| 全屏模式可能影响用户对"弹窗"的预期 | 保持从底部滑入的入场动画，保持熟悉感 |
| 代码迁移可能引入 bug | 分阶段迁移，每步验证 |

## 验收标准

1. CreateTaskModal 使用全屏整屏横移交互
2. 支持手势滑动返回
3. 使用 CSS Modules 替代内联样式
4. 复用设置页面的 SubPageLayout、SettingsSection 等组件
5. 保持所有现有功能正常工作
6. 视觉风格与设置页面一致
