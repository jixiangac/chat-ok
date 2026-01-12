# Change: 优化常规面板移动端体验和动画效果

## Why
常规面板（Normal Panel）在移动端存在多个体验问题：
1. 支线任务网格在移动端显示固定6个任务，未根据屏幕高度自适应
2. 创建任务弹窗在移动端普遍存在横向滚动条，影响用户体验
3. 缺少流畅的页面切换和交互动画，体验不够优雅
4. 部分组件在小屏幕设备上布局不够合理

## What Changes
- 支线任务网格根据屏幕高度动态计算显示数量（最多3行6个任务）
- 修复创建任务弹窗的横向滚动条问题，优化移动端布局
- 引入 Framer Motion 动画库，增强页面切换和交互动画
- 优化弹窗内表单布局，适配小屏幕设备
- 全面审查常规面板相关组件的移动端适配

## Impact
- Affected specs: `normal-panel` (新建规范)
- Affected code:
  - `src/pages/dc/panels/normal/index.tsx` - 常规面板主组件
  - `src/pages/dc/components/SidelineTaskGrid/index.tsx` - 支线任务网格
  - `src/pages/dc/components/CreateMainlineTaskModal/` - 创建任务弹窗及其子组件
  - `src/pages/dc/components/CreateMainlineTaskModal/steps/` - 弹窗步骤组件
  - `package.json` - 添加 framer-motion 依赖
