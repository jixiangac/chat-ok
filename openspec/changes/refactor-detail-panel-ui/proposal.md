# Change: 重构任务详情页 UI - 以周期为核心的咖啡杯视觉设计

## Why

当前任务详情页设计过于复杂，包含多个 Tab 切换和冗余信息层级，影响用户专注于核心操作。需要简化为单屏聚焦设计，**以周期进度为核心呈现**，使用咖啡杯视觉隐喻让进度展示更直观有趣，同时在咖啡杯下方使用奶油风进度条展示今日进度。

## Design System (UI/UX Pro Max)

基于 UI/UX Pro Max 搜索结果，采用以下设计风格：

| 组件 | 设计风格 | 理由 |
|------|----------|------|
| 咖啡杯 | **Neumorphism + Soft UI Evolution** | 柔和凸起效果，温暖舒适，适合习惯养成应用 |
| 水杯 | **Liquid Glass** | 流动玻璃效果，清澈透明，适合液体视觉 |
| 冰块 | **Glassmorphism** | 透明渐变，配合融化动画 |
| 进度条 | **Soft UI Evolution** | 改进的软 UI，更好的对比度 |
| 整体布局 | **Minimal & Direct** | 简洁直接，快速加载 |

## What Changes

- **移除 Tab 系统**：不再需要多 Tab 切换，核心内容单屏展示
- **以周期为核心**：咖啡杯水位表示周期进度，作为页面视觉焦点
- **新增具象化进度组件**：
  - CHECK_IN 类型：咖啡杯水位隐喻（Neumorphism 风格）
  - NUMERIC 增加型：透明水杯注水（Liquid Glass 风格）
  - NUMERIC 减少型：冰块融化（Glassmorphism 风格）
  - CHECKLIST 类型：清单列表直接展示
- **奶油风今日进度条**：咖啡杯下方展示今日进度，带波浪和滴落效果
- **简化页面结构**：顶部栏 → 周期进度（咖啡杯）→ 今日进度（奶油条）→ 周期信息 → 二级入口 → 打卡按钮
- **统一色系**：采用 Coffee Shop 色板 + 修仙界面背景色

## Visual Design

### 咖啡杯进度（周期进度）- Neumorphism 风格
- 杯身采用 Neumorphism 凸起效果：`box-shadow: -5px -5px 15px #fff, 5px 5px 15px rgba(0,0,0,0.1)`
- 咖啡水位高度 = 周期完成百分比
- 进度越高，咖啡颜色越深（浅咖啡 → 中咖啡 → 深咖啡）
- 进度 > 30% 时显示蒸汽动画（2s 循环）
- 咖啡顶部有泡沫层效果

### 水杯进度（NUMERIC 增加）- Liquid Glass 风格
- 杯身采用 Glassmorphism 透明效果：`backdrop-filter: blur(10px)`
- 水液体渐变蓝色填充
- 水波纹微妙波动动画
- 气泡上浮效果

### 冰块融化（NUMERIC 减少）- Glassmorphism 风格
- 冰块采用不规则多边形 + 透明渐变
- 随进度增加裂纹效果
- 底部融化水滩 + 波浪动画
- 水滴滴落动画

### 奶油风进度条（今日进度）
- 位于咖啡杯下方
- 浅米色背景 `#FFF8F0`
- 奶油白渐变填充 `linear-gradient(90deg, #FFFEF5, #FFF5E6)`
- 带波浪动画效果（1.5s 循环）
- 进度条末端有奶油滴落效果

### 色系规范 (Coffee Shop Palette)
| 元素 | 颜色值 | 说明 |
|------|--------|------|
| 页面背景 | `#F8FAFC` | 修仙界面背景色 |
| 咖啡色（深） | `#6F4E37` | 进度 100% |
| 咖啡色（中） | `#8B7355` | 进度 50-99% |
| 咖啡色（浅） | `#C4A484` | 进度 < 50% |
| 咖啡泡沫 | `#F5E6D3` | 泡沫层 |
| 奶油白 | `#FFFEF5` | 进度条填充 |
| 奶油米 | `#FFF8F0` | 进度条背景 |
| 水蓝色 | `#87CEEB` | 水杯填充 |
| 冰蓝色 | `#E0F4FF` | 冰块颜色 |
| CTA 按钮 | `#F97316` | 温暖橙色 |

### 动画规范
- 使用 `ease-out` 进入动画，`ease-in` 退出动画
- 循环动画仅用于装饰元素（蒸汽、波浪）
- 支持 `prefers-reduced-motion` 媒体查询

## Impact

- **Affected specs**: `detail-panel`
- **Affected code**:
  - `src/pages/dc/panels/detail/index.tsx` - 主入口重构
  - `src/pages/dc/panels/detail/components/CoffeeCupProgress/` - 新增咖啡杯进度组件
  - `src/pages/dc/panels/detail/components/WaterCupProgress/` - 新增水杯进度组件
  - `src/pages/dc/panels/detail/components/IceMeltProgress/` - 新增冰块融化组件
  - `src/pages/dc/panels/detail/components/TodayProgressBar/` - 新增奶油风进度条
  - `src/pages/dc/panels/detail/GoalDetailModal.module.css` - 更新背景色和布局
  - 移除或归档不再使用的 Tab 相关组件

## Success Criteria

1. 详情页单屏展示，无需滚动
2. 周期进度通过咖啡杯/水杯/冰块水位直观呈现
3. 今日进度通过奶油风进度条展示
4. 打卡/记录操作后有直观的动画反馈（水位上升、奶油填充）
5. 页面背景色与修仙界面一致（`#F8FAFC`）
6. 整体风格与设置面板保持统一
7. 动画遵循 `prefers-reduced-motion` 无障碍要求
8. 确保 WCAG AA 对比度标准
