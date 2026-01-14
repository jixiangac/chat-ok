# Change: 优化设置界面动画效果

## Why
当前设置界面使用弹窗形式打开，交互体验不够流畅。用户希望获得类似 iOS 原生应用的页面切换体验，包括整屏横移、卡片堆叠效果和列表项翻书动画，以提升整体用户体验。

## What Changes

### 1. 设置面板入口动画
- 将现有弹窗改为整屏横移效果（从右侧滑入，返回时向右滑出）
- 动画时长: 400ms
- 缓动函数: `ease-out`（进入时使用 ease-out，退出时使用 ease-in）

### 2. 子页面切换动画（Dimensional Layering）
- 实现 iOS 风格的卡片堆叠效果
- 当前页面缩小后移（scale: 0.95, translateX: -5%）
- 新页面从右侧滑入
- 使用 z-index 层级管理实现空间层次感
- 添加微妙的阴影提升层次感

### 3. 列表项入场动画
- 为设置列表项添加翻书效果（复用纪念日界面的 flipIn 动画）
- 使用交错动画（stagger），每项延迟 60ms
- 限制同时动画的元素数量（最多 1-2 个关键元素），避免过度动画

### 4. 手势支持
- 支持向右滑动手势返回
- 只响应从左边缘（< 50px）开始的滑动，避免与系统手势冲突
- 使用 `history.pushState()` 保持导航历史正确性

### 5. 标签设置页面
- 将新增按钮移至底部固定位置
- 点击后弹出底部弹窗
- 底部固定元素需考虑安全区域（Safe Area）

### 6. 主题设置页面
- 添加底部固定保存按钮
- 修改后需点击保存才生效
- 保持预览功能，让用户能看到效果

## UI/UX 设计规范

### 动画规范
| 属性 | 值 | 说明 |
|------|-----|------|
| 动画时长 | 300-400ms | 页面切换动画 |
| 缓动函数 | ease-out (进入) / ease-in (退出) | 避免使用 linear |
| 交错延迟 | 60ms | 列表项动画间隔 |

### 无障碍支持
- **必须**支持 `prefers-reduced-motion` 媒体查询
- 当用户开启减少动画时，禁用所有装饰性动画
- 保留必要的状态变化指示

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 交互规范
| 元素 | 规范 |
|------|------|
| 可点击元素 | 添加 `cursor-pointer` |
| 悬停反馈 | 使用颜色/透明度变化，避免 scale 导致布局偏移 |
| 过渡时间 | 150-300ms |
| 固定元素 | 考虑安全区域，避免与其他固定元素重叠 |

### 层级管理（Dimensional Layering）
- 使用 z-index 层级系统管理页面堆叠
- 背景页面: z-index: 1, scale: 0.95
- 当前页面: z-index: 2, scale: 1
- 使用 box-shadow 增强层次感

## Impact
- Affected specs: `settings-panel`
- Affected code:
  - `src/pages/dc/panels/settings/` - 设置面板相关组件
  - `src/pages/dc/panels/settings/components/SubPageLayout/` - 子页面布局组件
  - `src/pages/dc/panels/settings/pages/TagSettingsPage/` - 标签设置页面
  - `src/pages/dc/panels/settings/pages/ThemeSettingsPage/` - 主题设置页面
  - `src/pages/dc/panels/settings/TagSettings/` - 标签设置组件
  - `src/pages/dc/panels/settings/ThemeSettings/` - 主题设置组件

## 风险与缓解

### Risk 1: 动画性能问题
- **风险**: 低端设备可能出现动画卡顿
- **缓解**: 使用 `transform` 和 `opacity` 实现动画（GPU 加速），避免触发重排

### Risk 2: 手势冲突
- **风险**: 手势返回可能与页面内滚动或系统手势冲突
- **缓解**: 只响应从左边缘（< 50px）开始的滑动，使用垂直滚动作为主要交互

### Risk 3: 过度动画
- **风险**: 过多动画可能导致用户分心或晕动症
- **缓解**: 限制每个视图最多 1-2 个关键动画元素，支持 `prefers-reduced-motion`

### Risk 4: 导航历史问题
- **风险**: 返回按钮行为不符合预期
- **缓解**: 使用 `history.pushState()` 正确管理导航历史
