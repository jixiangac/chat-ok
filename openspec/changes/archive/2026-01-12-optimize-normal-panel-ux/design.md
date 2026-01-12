# Design: 常规面板移动端体验优化

## Context
常规面板是 DC 模块的核心功能之一，用户在此管理主线任务和支线任务。当前实现在移动端存在多个体验问题：
- 支线任务网格固定显示6个任务，未考虑屏幕高度差异
- 创建任务弹窗使用固定宽度布局，在小屏幕上出现横向滚动条
- 缺少流畅的动画效果，交互体验不够优雅

项目使用 React 18 + TypeScript + antd-mobile，遵循 Notion 风格的简洁设计语言。

## Goals / Non-Goals

### Goals
- 支线任务网格根据屏幕高度自适应显示数量
- 消除创建任务弹窗的横向滚动条
- 引入优雅细腻的动画效果，提升交互体验
- 保持 Notion 风格的简洁设计
- 确保动画性能良好，不影响低端设备

### Non-Goals
- 不改变现有的功能逻辑和数据结构
- 不重构整个常规面板架构
- 不添加新的任务类型或功能
- 不改变现有的交互流程

## Decisions

### 1. 动画库选择：Framer Motion

**决策**: 使用 Framer Motion（现已更名为 Motion）作为动画库

**理由**:
- 8.1M 周下载量，生态成熟稳定
- 声明式 API，易于集成到现有 React 组件
- 内置手势支持，适合移动端交互
- 优秀的性能优化，自动使用 GPU 加速
- 与 React 18 兼容性好
- 支持复杂的动画编排和序列

**替代方案**:
- react-spring: 基于物理弹簧动画，更自然但学习曲线较陡
- CSS Transitions: 简单但功能有限，不适合复杂动画编排
- GSAP: 功能强大但体积较大，对于当前需求过度

### 2. 响应式布局策略

**决策**: 使用 CSS Grid + 媒体查询 + JavaScript 动态计算相结合

**实现**:
```typescript
// 支线任务网格动态计算
const calculateVisibleTasks = () => {
  const safeAreaHeight = window.innerHeight;
  const headerHeight = 60; // 估算
  const mainlineCardHeight = 200; // 估算
  const bottomBarHeight = 80; // 估算
  const availableHeight = safeAreaHeight - headerHeight - mainlineCardHeight - bottomBarHeight;
  
  const taskCardHeight = 120; // 单个任务卡片高度
  const gap = 14; // 网格间距
  const maxRows = 3; // 最多3行
  
  const possibleRows = Math.floor((availableHeight + gap) / (taskCardHeight + gap));
  const actualRows = Math.min(possibleRows, maxRows);
  
  return actualRows * 2; // 每行2个任务
};
```

**弹窗布局修复**:
- 将固定宽度的 Grid 改为响应式布局
- 使用 `minmax()` 和 `auto-fit` 实现自适应列数
- 在小屏幕上（< 375px）强制单列布局
- 减小内边距和间距以适配小屏幕

### 3. 动画设计原则

**风格**: 优雅细腻，符合 Notion 风格

**具体实现**:
```typescript
// 弹窗动画配置
const modalVariants = {
  hidden: { 
    y: '100%',
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// 步骤切换动画
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  })
};

// 任务卡片动画
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut'
    }
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};
```

**性能优化**:
- 仅使用 `transform` 和 `opacity` 属性（GPU 加速）
- 避免动画期间的布局重排
- 使用 `will-change` 提示浏览器优化
- 在低端设备上降级动画复杂度

## Risks / Trade-offs

### 风险1: 动画库增加包体积
- **影响**: Framer Motion 约 60KB (gzipped)
- **缓解**: 项目已有其他较大依赖，60KB 可接受；使用 tree-shaking 减少实际打包体积

### 风险2: 动画性能影响低端设备
- **影响**: 复杂动画可能在低端设备上卡顿
- **缓解**: 
  - 使用 GPU 加速属性
  - 提供动画降级方案
  - 使用 `prefers-reduced-motion` 媒体查询

### 风险3: 响应式计算可能不准确
- **影响**: 不同设备的实际可用高度可能与计算值有偏差
- **缓解**:
  - 使用保守的估算值
  - 添加最小/最大值限制
  - 实际测试多种设备

### Trade-off: 动画复杂度 vs 性能
- **选择**: 优先保证流畅度，适度简化动画
- **理由**: 移动端性能优先，过度复杂的动画会影响体验

## Migration Plan

### 实施步骤
1. **Phase 1**: 安装依赖，创建基础动画配置
2. **Phase 2**: 修复布局问题（横向滚动条）
3. **Phase 3**: 实现响应式支线任务网格
4. **Phase 4**: 添加动画效果
5. **Phase 5**: 测试和优化

### 向后兼容
- 不改变现有数据结构
- 不改变现有 API 接口
- 保持现有功能逻辑不变
- 仅优化 UI 和交互体验

### 回滚方案
- 如果动画导致严重性能问题，可以通过配置禁用
- 如果响应式布局有问题，可以回退到固定布局
- 所有改动都是增量式的，可以逐步回滚

## Open Questions

1. **是否需要为动画添加用户偏好设置？**
   - 建议：暂不添加，先观察用户反馈
   
2. **是否需要支持横屏模式？**
   - 建议：暂不考虑，项目主要面向竖屏使用

3. **动画时长是否需要可配置？**
   - 建议：使用固定值，保持一致性
