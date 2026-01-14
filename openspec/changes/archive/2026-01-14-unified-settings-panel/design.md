# Design Document: 统一设置面板

## Context
DC 模块当前的设置功能分散在不同位置，缺乏统一的入口和导航体验。用户需要在多个地方寻找配置选项，体验不够流畅。本次设计旨在创建一个统一的设置面板，整合所有配置功能，并提供现代化的交互体验。

## Goals / Non-Goals

### Goals
- 提供统一的设置入口和导航体验
- 整合所有现有的设置功能（今日毕任务、主题、标签）
- 实现清晰的功能分组和层级结构
- 复刻参考设计的视觉风格
- 支持未来扩展（场景管理、更多数据类型）

### Non-Goals
- 不改变现有功能的核心逻辑
- 不修改数据存储结构
- 本期不实现场景管理的实际功能
- 不涉及服务端同步功能

## Architecture Overview

### 组件层级结构
```
UnifiedSettingsPanel (容器组件)
├── PageStack (页面栈管理)
│   ├── SettingsMainPage (主页面)
│   │   ├── SettingsSection (分组)
│   │   │   ├── 基础设置
│   │   │   │   ├── SettingsListItem (今日毕任务) - 特殊样式
│   │   │   │   ├── SettingsListItem (主题设置)
│   │   │   │   └── SettingsListItem (标签管理)
│   │   │   ├── 场景管理
│   │   │   │   ├── SettingsListItem (常规模式) - 占位
│   │   │   │   ├── SettingsListItem (度假模式) - 占位
│   │   │   │   ├── SettingsListItem (纪念日模式) - 占位
│   │   │   │   └── SettingsListItem (OKR模式) - 占位
│   │   │   └── 开发者
│   │   │       └── SettingsListItem (数据管理)
│   │   └── Header (标题 + 关闭按钮)
│   ├── SubPage (子页面)
│   │   ├── Header (标题 + 返回按钮)
│   │   ├── HeaderImage (头图区域)
│   │   └── Content (内容区域)
│   └── Navigation (导航控制)
└── Popup (全屏弹窗容器)
```

### 页面栈管理
```typescript
interface PageStackItem {
  id: string;
  component: React.ComponentType;
  title: string;
  props?: any;
}

interface PageStackState {
  stack: PageStackItem[];
  currentIndex: number;
}

// 页面栈操作
- push(page): 推入新页面
- pop(): 返回上一页
- replace(page): 替换当前页面
- reset(): 重置到主页面
```

## Decisions

### 1. 弹窗实现方案
**决策**: 使用现有的 `open.tsx` 和 `pop.tsx` 实现全屏弹窗

**理由**:
- 已有成熟的实现，无需重复开发
- 支持全屏展示，适合复杂的设置界面
- 与项目其他弹窗保持一致的交互体验

**替代方案**:
- 使用 antd-mobile 的 Popup: 功能较简单，不够灵活
- 自己实现弹窗: 增加开发成本，且可能与现有组件冲突

### 2. 页面导航方案
**决策**: 在同一弹窗内实现页面栈管理

**理由**:
- 避免多层弹窗嵌套，性能更好
- 提供更流畅的页面切换动画
- 便于统一管理导航状态和历史记录
- 支持手势返回等高级交互

**替代方案**:
- 多层弹窗嵌套: 会导致层级混乱，关闭逻辑复杂
- 使用路由: 过于重量级，且与弹窗模式不匹配

### 3. 今日毕任务双场景支持
**决策**: 保留原有独立弹窗，在设置中作为子页面复用相同 UI

**理由**:
- 自动弹出场景需要独立的弹窗实现
- 设置中需要作为子页面集成
- 复用相同的 UI 组件和逻辑，减少代码重复

**实现方式**:
```typescript
// TodayMustCompleteModal 支持两种模式
interface TodayMustCompleteModalProps {
  mode: 'standalone' | 'subpage'; // 独立弹窗 or 子页面
  visible: boolean;
  // ... 其他 props
}
```

### 4. 子页面布局设计
**决策**: 采用"头图 + 内容"的布局结构

**理由**:
- 与今日必须完成的界面保持一致
- 头图提供视觉吸引力和品牌感
- 内容区域灵活，可适配不同类型的设置

**布局结构**:
```
┌─────────────────────┐
│   Header Image      │ 固定高度，展示品牌图片
├─────────────────────┤
│   Title Section     │ 标题和描述
├─────────────────────┤
│                     │
│   Content Area      │ 可滚动的内容区域
│                     │
└─────────────────────┘
```

### 5. 样式实现方案
**决策**: 完全复刻参考设计，使用 CSS Modules

**理由**:
- 参考设计已经过验证，用户体验良好
- CSS Modules 提供样式隔离，避免冲突
- 便于维护和调整

**关键样式规范**:
```css
/* 分组标题 */
.sectionTitle {
  font-size: 12px;
  color: rgba(55, 53, 47, 0.5);
  padding: 16px 16px 8px;
}

/* 列表项 */
.listItem {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 今日毕任务特殊样式 */
.listItemHighlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### 6. 数据管理实现
**决策**: 参考现有任务数据的导入导出实现

**理由**:
- 保持交互一致性
- 复用已验证的代码逻辑
- 减少用户学习成本

**实现要点**:
- 查找现有任务数据导入导出的实现位置
- 提取通用的导入导出逻辑
- 为每种数据类型创建对应的处理函数
- 保持相同的文件格式和交互方式

## Technical Details

### 页面栈管理 Hook
```typescript
// hooks/usePageStack.ts
export function usePageStack() {
  const [stack, setStack] = useState<PageStackItem[]>([
    { id: 'main', component: SettingsMainPage, title: '设置' }
  ]);
  
  const push = useCallback((page: PageStackItem) => {
    setStack(prev => [...prev, page]);
  }, []);
  
  const pop = useCallback(() => {
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);
  
  const canGoBack = stack.length > 1;
  const currentPage = stack[stack.length - 1];
  
  return { currentPage, push, pop, canGoBack };
}
```

### 手势返回实现（可选）
```typescript
// 使用 touch 事件实现左滑返回
const handleTouchStart = (e: TouchEvent) => {
  startX = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  
  if (diff > 50 && canGoBack) {
    // 触发返回动画
    setTranslateX(diff);
  }
};

const handleTouchEnd = () => {
  if (translateX > 100) {
    pop(); // 返回上一页
  } else {
    setTranslateX(0); // 回弹
  }
};
```

### localStorage Key 查找
需要在实现时查找以下数据的 localStorage key:
- 标签数据: 查找 `src/pages/dc/utils/` 或 `src/pages/dc/contexts/`
- 度假数据: 查找 happy/vacation 相关代码
- 纪念日数据: 查找 memorial 相关代码
- 偏好状态: 查找 preference/settings 相关代码

## Risks / Trade-offs

### 风险1: 页面栈管理复杂度
**风险**: 自己实现页面栈可能遇到状态管理和动画同步问题

**缓解措施**:
- 使用成熟的状态管理模式
- 充分测试各种导航场景
- 提供降级方案（禁用动画）

### 风险2: 今日毕任务双模式兼容
**风险**: 同一组件支持两种使用场景可能导致逻辑复杂

**缓解措施**:
- 通过 props 清晰区分两种模式
- 提取共享逻辑到独立函数
- 充分的单元测试

### 风险3: 样式复刻精度
**风险**: 完全复刻参考设计可能遇到细节差异

**缓解措施**:
- 使用设计稿标注或测量工具
- 与设计师/产品经理确认关键细节
- 迭代优化，逐步接近目标效果

### Trade-off: 功能完整性 vs 开发周期
- 本期不实现场景管理的实际功能，仅展示占位
- 左滑手势返回作为可选功能，优先级较低
- 专注于核心功能和视觉还原

## Migration Plan

### 阶段1: 基础框架搭建
1. 创建新的设置面板组件结构
2. 实现页面栈管理
3. 实现基本的导航功能

### 阶段2: 功能迁移
1. 迁移主题设置功能
2. 迁移标签管理功能
3. 改造今日毕任务组件

### 阶段3: 新功能开发
1. 实现数据管理功能
2. 添加场景管理占位
3. 完善样式细节

### 阶段4: 测试和优化
1. 全面测试所有功能
2. 优化性能和动画
3. 修复发现的问题

### Rollback 策略
- 保留原有设置面板代码，通过 feature flag 控制
- 如遇重大问题，可快速回退到旧版本
- 数据结构不变，无需数据迁移

## Open Questions

1. **手势返回的优先级**: 是否必须在第一版实现？
   - 建议: 作为可选功能，后续迭代添加

2. **场景管理的交互**: 点击后是否需要提示"功能开发中"？
   - 建议: 暂时不可点击，或显示"敬请期待"提示

3. **数据管理的权限控制**: 是否需要二次确认或密码保护？
   - 建议: 导出无需确认，导入需要确认弹窗

4. **头图资源**: 每个子页面是否需要不同的头图？
   - 建议: 初期使用相同头图，后续可定制化

5. **动画性能**: 在低端设备上是否需要降级？
   - 建议: 提供禁用动画的选项
