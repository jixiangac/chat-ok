# 提案：优化纪念日面板性能

## 概述

纪念日面板在使用过程中存在明显的卡顿问题，需要进行性能优化以提升用户体验。

## 问题分析

通过代码审查，识别出以下性能瓶颈：

### 1. CalendarPicker 日历组件卡顿严重
- **问题**：使用 antd-mobile 的 `CalendarPicker` 组件，该组件渲染完整日历视图，DOM 节点多，渲染开销大
- **影响**：打开日期选择器时明显卡顿，滑动切换月份时掉帧
- **位置**：`src/pages/dc/panels/memorial/components/CreateMemorialModal/index.tsx`
- **建议**：改用 `DatePicker` 组件，使用滚轮选择模式，更轻量

### 2. IconPicker 组件渲染开销大
- **问题**：每次渲染都会遍历 25 个 Lucide React 图标组件
- **影响**：CreateMemorialModal 打开时明显卡顿
- **位置**：`src/pages/dc/panels/memorial/components/IconPicker/index.tsx`

### 2. CreateMemorialModal 缺少懒加载
- **问题**：IconPicker 和 BackgroundPicker 在弹窗打开时同步渲染
- **影响**：弹窗打开延迟，用户感知明显
- **位置**：`src/pages/dc/panels/memorial/components/CreateMemorialModal/index.tsx`

### 3. 图片压缩阻塞主线程
- **问题**：BackgroundPicker 中的图片压缩使用同步 Canvas 操作
- **影响**：上传图片时界面冻结
- **位置**：`src/pages/dc/panels/memorial/components/BackgroundPicker/index.tsx`

### 4. MemorialCard 重复计算
- **问题**：每次渲染都调用 `getIconConfig` 和 `getShortDaysText`
- **影响**：列表滚动时可能出现掉帧
- **位置**：`src/pages/dc/panels/memorial/components/MemorialCard/index.tsx`

### 5. useMemorials Hook 频繁排序
- **问题**：每次数据变更都会重新排序整个列表
- **影响**：数据操作时的额外开销
- **位置**：`src/pages/dc/panels/memorial/hooks/useMemorials.ts`

### 6. 缺少虚拟列表
- **问题**：纪念日列表直接渲染所有项目
- **影响**：当纪念日数量较多时，DOM 节点过多导致性能下降
- **位置**：`src/pages/dc/panels/memorial/index.tsx`

## 优化方案

### 方案 A：组件级优化（推荐）
1. **IconPicker 优化**
   - 使用 `React.memo` 包装图标按钮
   - 实现图标懒加载，只渲染可视区域的图标
   - 缓存图标组件引用

2. **CreateMemorialModal 优化**
   - 使用 `React.lazy` 懒加载 IconPicker 和 BackgroundPicker
   - 添加 Suspense 边界和加载状态

3. **BackgroundPicker 优化**
   - 将图片压缩移至 Web Worker
   - 添加压缩进度指示器

4. **MemorialCard 优化**
   - 使用 `useMemo` 缓存计算结果
   - 优化 memo 比较函数

5. **useMemorials 优化**
   - 使用 `useMemo` 缓存排序结果
   - 实现增量更新而非全量排序

### 方案 B：架构级优化
1. 引入虚拟列表（react-window 或 react-virtualized）
2. 实现状态管理优化（使用 zustand 或 jotai）
3. 添加骨架屏和渐进式加载

## 预期效果

- 弹窗打开时间减少 50%+
- 列表滚动帧率稳定在 60fps
- 图片上传时界面保持响应
- 整体交互流畅度显著提升

## 风险评估

- **低风险**：组件级优化不改变现有架构
- **中风险**：引入新依赖（如 react-window）需要额外测试
- **兼容性**：所有优化向后兼容，不影响现有功能

## 附加需求：纪念日模式专属精灵图片

纪念日模式下，`randomizeSpriteImage` 应使用专属的图片列表：

```typescript
const MEMORIAL_SPRITE_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01F8l0Tl1mu0awjBaMv_!!6000000005013-2-tps-1080-913.png',
  'https://img.alicdn.com/imgextra/i2/O1CN014inOqq1ir1YDFC7dU_!!6000000004465-2-tps-1080-1001.png',
  'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01z4bPnp1KoEM5j3N5E_!!6000000001210-2-tps-1080-932.png',
  'https://img.alicdn.com/imgextra/i4/O1CN014kAwOY1Rgd5shGzLy_!!6000000002141-2-tps-1080-994.png',
];
```

## 相关文件

- `src/pages/dc/panels/memorial/index.tsx`
- `src/pages/dc/panels/memorial/components/IconPicker/index.tsx`
- `src/pages/dc/panels/memorial/components/BackgroundPicker/index.tsx`
- `src/pages/dc/panels/memorial/components/CreateMemorialModal/index.tsx`
- `src/pages/dc/panels/memorial/components/MemorialCard/index.tsx`
- `src/pages/dc/panels/memorial/hooks/useMemorials.ts`
- `src/pages/dc/constants/sprites.ts`
- `src/pages/dc/hooks/useSpriteImage.ts`
