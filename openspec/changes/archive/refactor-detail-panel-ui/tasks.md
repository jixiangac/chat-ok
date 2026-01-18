# Tasks: 任务详情页 UI 重构 - 咖啡杯视觉设计

## 1. 核心视觉组件开发

### 1.1 咖啡杯进度组件 (CoffeeCupProgress) - Neumorphism 风格
- [x] 1.1.1 创建咖啡杯基础结构
  - 杯身：Neumorphism 凸起效果 `box-shadow: -5px -5px 15px #fff, 5px 5px 15px rgba(0,0,0,0.1)`
  - 杯身内部：圆角矩形 `border-radius: 8px 8px 16px 16px`
  - 把手：C 形曲线 + Neumorphism 阴影
  - 杯底盘：椭圆形 + 浅灰色阴影
- [x] 1.1.2 实现咖啡水位动态高度（周期进度）
- [x] 1.1.3 实现咖啡颜色渐变规则
  - 进度 0-30%: 浅咖啡 `#C4A484`
  - 进度 31-70%: 中咖啡 `#8B7355`
  - 进度 71-100%: 深咖啡 `#6F4E37`
- [x] 1.1.4 实现泡沫层效果
  - 泡沫颜色 `#F5E6D3`
  - SVG 波浪 path，8px 高度
- [x] 1.1.5 实现蒸汽动画（进度 > 30% 时显示）
  - 3 条曲线，各 40px 高
  - 飘动动画 2s 循环，opacity 渐变
- [x] 1.1.6 实现水位上涨动画（打卡成功时触发）
  - 时长 600ms，缓动 ease-out

### 1.2 水杯进度组件 (WaterCupProgress) - Liquid Glass 风格
- [x] 1.2.1 创建透明杯身
  - Glassmorphism 效果：`background: rgba(255,255,255,0.3); backdrop-filter: blur(10px)`
  - 边框：`1px solid rgba(255,255,255,0.2)`
- [x] 1.2.2 实现水液体填充
  - 渐变蓝色：`linear-gradient(180deg, #B8E0FF 0%, #87CEEB 100%)`
- [x] 1.2.3 实现水波纹动画
  - 微妙波动，2s 周期
- [x] 1.2.4 实现气泡上浮效果
  - 随机位置，opacity 动画

### 1.3 冰块融化组件 (IceMeltProgress) - Glassmorphism 风格
- [x] 1.3.1 创建冰块视觉元素
  - 不规则多边形：`clip-path: polygon(...)`
  - 渐变：`linear-gradient(135deg, #E0F4FF 0%, #B8E0FF 50%, #87CEEB 100%)`
- [x] 1.3.2 实现裂纹效果
  - SVG 线条，随进度增加裂纹数量
  - 裂纹动画 300ms，ease-out
- [x] 1.3.3 实现融化水效果
  - 底部水滩 + 波浪动画
  - 高度随进度增加
- [x] 1.3.4 实现水滴滴落动画
  - 从冰块边缘滴落
  - 500ms 周期，随机间隔

### 1.4 奶油风今日进度条 (TodayProgressBar) - Soft UI Evolution 风格
- [x] 1.4.1 创建进度条基础结构
  - 背景：`#FFF8F0`，圆角 12px，高度 24px
- [x] 1.4.2 实现奶油白渐变填充
  - 渐变：`linear-gradient(90deg, #FFFEF5, #FFF5E6)`
- [x] 1.4.3 实现波浪动画效果
  - 填充区域右侧边缘 SVG 波浪
  - 1.5s 循环，ease-in-out
- [x] 1.4.4 实现奶油滴落效果
  - 进度条末端下方圆形
  - 滴落动画 400ms，ease-in
- [x] 1.4.5 实现今日完成状态样式
  - 图标 ☕ + 文字「今日目标已达成」

## 2. CHECKLIST 类型组件

### 2.1 清单进度组件 (ChecklistProgress) - Minimal & Direct 风格
- [ ] 2.1.1 创建清单列表组件
- [ ] 2.1.2 实现清单项勾选交互
- [ ] 2.1.3 实现完成项样式（删除线、变淡）

## 3. 页面布局重构

### 3.1 主容器重构
- [x] 3.1.1 更新背景色为 `#F8FAFC`（修仙界面背景色）
- [x] 3.1.2 移除 Tab 系统
- [x] 3.1.3 实现单屏布局结构

### 3.2 顶部栏 (DetailHeader)
- [x] 3.2.1 简化顶部栏设计
- [x] 3.2.2 保留返回、标题、更多操作

### 3.3 周期信息区域 (CycleInfo)
- [x] 3.3.1 创建周期信息展示组件
- [x] 3.3.2 显示当前周期/总周期、剩余天数

### 3.4 二级入口 (SecondaryNav)
- [x] 3.4.1 创建二级入口导航组件
- [x] 3.4.2 实现「记录」「计划」入口

### 3.5 打卡按钮区域 (ActionButton)
- [x] 3.5.1 更新按钮颜色为 CTA 橙色 `#F97316`
- [x] 3.5.2 保留现有打卡逻辑
- [x] 3.5.3 集成 confetti 效果

## 4. 样式与动画

### 4.1 CSS 变量定义
- [x] 4.1.1 定义咖啡色系变量
  ```css
  --coffee-dark: #6F4E37;
  --coffee-medium: #8B7355;
  --coffee-light: #C4A484;
  --coffee-foam: #F5E6D3;
  ```
- [x] 4.1.2 定义奶油色系变量
  ```css
  --cream-light: #FFFEF5;
  --cream-bg: #FFF8F0;
  ```
- [x] 4.1.3 定义水/冰色系变量
  ```css
  --water-blue: #87CEEB;
  --ice-blue: #E0F4FF;
  ```
- [x] 4.1.4 定义页面背景色
  ```css
  --bg-page: #F8FAFC;
  --bg-card: #FFFFFF;
  ```

### 4.2 动画效果
- [x] 4.2.1 实现咖啡水位上升动画 (600ms, ease-out)
- [x] 4.2.2 实现蒸汽飘动动画 (2s, linear, 循环)
- [x] 4.2.3 实现奶油波浪动画 (1.5s, ease-in-out, 循环)
- [x] 4.2.4 实现奶油滴落动画 (400ms, ease-in)
- [x] 4.2.5 实现水波纹动画 (2s, ease-in-out, 循环)
- [x] 4.2.6 实现冰块裂纹动画 (300ms, ease-out)
- [x] 4.2.7 实现水滴滴落动画 (500ms, ease-in, 循环)

### 4.3 无障碍支持
- [x] 4.3.1 实现 `prefers-reduced-motion` 媒体查询
  ```css
  @media (prefers-reduced-motion: reduce) {
    .steam, .wave, .bubble, .drip {
      animation: none !important;
    }
  }
  ```
- [ ] 4.3.2 确保 WCAG AA 对比度标准

## 5. 二级页面

- [x] 5.1 将 `CheckInHistoryPanel` 包装为全屏 Popup
- [x] 5.2 将 `HistoryCyclePanel` 包装为全屏 Popup
- [x] 5.3 实现从二级入口跳转逻辑

## 6. 集成与测试

### 6.1 主入口集成
- [x] 6.1.1 重构 `index.tsx`
- [x] 6.1.2 集成所有新组件
- [x] 6.1.3 保留现有 Modal（CheckInModal、RecordDataModal）

### 6.2 测试验收
- [ ] 6.2.1 CHECK_IN 类型全流程测试（咖啡杯）
- [ ] 6.2.2 NUMERIC 增加型测试（水杯）
- [ ] 6.2.3 NUMERIC 减少型测试（冰块）
- [ ] 6.2.4 CHECKLIST 类型测试
- [ ] 6.2.5 已结束任务状态测试
- [ ] 6.2.6 小屏幕适配测试 (320px, 768px, 1024px)
- [ ] 6.2.7 动画性能测试
- [ ] 6.2.8 `prefers-reduced-motion` 测试
- [ ] 6.2.9 对比度测试 (WCAG AA)

## 优先级说明

**P0 - 核心功能**：1.1 ✅, 1.4 ✅, 3.1 ✅, 3.5 ✅, 6.1 ✅
**P1 - 重要功能**：1.2 ✅, 1.3 ✅, 3.2 ✅, 3.3 ✅, 3.4 ✅, 4.1 ✅, 4.3 (部分完成)
**P2 - 增强功能**：2.1, 4.2 ✅, 5.x ✅, 6.2

## 完成状态

- **已完成**: P0 全部完成，P1 大部分完成，P2 部分完成
- **待完成**: 2.1 清单组件、4.3.2 对比度测试、6.2 测试验收
