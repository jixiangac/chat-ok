# Design: 优化设置界面动画效果

## Context

当前设置界面使用 `open.tsx` 和 `pop.tsx` 实现的全屏弹窗方式打开，虽然功能完整，但交互体验与原生 iOS 应用有差距。用户期望获得更流畅、更原生的页面切换体验。

### 现有实现
- 设置面板通过弹窗形式打开
- 子页面使用页面栈管理（`usePageStack`）
- 页面切换有基本的动画效果

### 目标效果
- 类似 iOS 原生应用的页面切换体验
- 整屏横移效果（非弹窗）
- 卡片堆叠效果（子页面切换）
- 列表项翻书动画（入场效果）

## Goals / Non-Goals

### Goals
- 实现流畅的页面切换动画
- 支持手势返回
- 提升用户体验
- 保持代码可维护性
- 支持无障碍访问（`prefers-reduced-motion`）

### Non-Goals
- 不改变现有功能逻辑
- 不引入复杂的动画库（如 framer-motion）
- 不影响其他模块

## Decisions

### Decision 1: 使用 CSS Transform + Transition 实现动画

**选择**: 使用纯 CSS 实现动画效果

**原因**:
- 性能优秀（GPU 加速）
- 无需引入额外依赖
- 与现有纪念日界面动画实现方式一致
- 易于维护和调试

**替代方案**:
- framer-motion: 功能强大但增加包体积
- react-spring: 物理动画效果好但学习成本高
- GSAP: 专业动画库但过于复杂

### Decision 2: 使用原生 Touch 事件实现手势返回

**选择**: 使用原生 `touchstart`、`touchmove`、`touchend` 事件

**原因**:
- 无需引入额外依赖
- 控制更精细
- 与现有代码风格一致
- 避免与系统手势冲突（只响应左边缘滑动）

**替代方案**:
- @use-gesture/react: 功能丰富但增加依赖
- hammer.js: 老牌手势库但体积较大

### Decision 3: 动画参数与纪念日界面保持一致

**选择**: 复用纪念日界面的动画参数

**参数**:
- 动画时长: 400ms
- 缓动函数: ease-out（进入）/ ease-in（退出）
- 翻书动画: rotateX 从 -90deg 到 0deg
- 延迟间隔: 60ms

**原因**:
- 保持应用内动画风格一致
- 已验证的动画效果
- 减少设计决策

### Decision 4: 采用 Dimensional Layering 设计模式

**选择**: 使用层级堆叠效果实现子页面切换

**原因**:
- 符合 iOS 原生设计语言
- 提供清晰的空间层次感
- 用户直观理解页面层级关系

## Technical Design

### 1. 页面切换动画

```css
/* 设置面板入口动画 */
.settingsPanel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(100%);
  transition: transform 0.4s ease-out;
  will-change: transform; /* 性能优化 */
}

.settingsPanel.visible {
  transform: translateX(0);
}

/* 退出动画使用 ease-in */
.settingsPanel.exiting {
  transform: translateX(100%);
  transition: transform 0.4s ease-in;
}

/* 子页面卡片堆叠效果 (Dimensional Layering) */
.pageStack {
  position: relative;
  perspective: 1000px;
}

.page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
  will-change: transform;
}

.page.background {
  transform: scale(0.95) translateX(-5%);
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page.entering {
  transform: translateX(100%);
  z-index: 2;
}

.page.active {
  transform: translateX(0);
  z-index: 2;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.page.exiting {
  transform: translateX(100%);
  transition: transform 0.4s ease-in;
}
```

### 2. 列表项翻书动画

```css
/* 复用纪念日界面的 flipIn 动画 */
.listItem {
  opacity: 0;
  transform: rotateX(-90deg);
  transform-origin: top center;
  animation: flipIn 0.4s ease-out forwards;
}

/* 交错动画延迟 */
.listItem:nth-child(1) { animation-delay: 0ms; }
.listItem:nth-child(2) { animation-delay: 60ms; }
.listItem:nth-child(3) { animation-delay: 120ms; }
.listItem:nth-child(4) { animation-delay: 180ms; }
.listItem:nth-child(5) { animation-delay: 240ms; }
/* 最多 5 个，避免过度动画 */

@keyframes flipIn {
  0% {
    opacity: 0;
    transform: rotateX(-90deg);
  }
  60% {
    opacity: 1;
    transform: rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg);
  }
}
```

### 3. 无障碍支持

```css
/* 尊重用户的动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .settingsPanel,
  .page,
  .listItem {
    animation: none !important;
    transition: none !important;
  }
  
  /* 保留必要的状态变化，但移除动画 */
  .settingsPanel.visible {
    transform: translateX(0);
  }
  
  .page.active {
    transform: translateX(0);
  }
}
```

### 4. 手势返回实现

```typescript
// useSwipeBack Hook
import { useRef, useCallback, useEffect } from 'react';

interface UseSwipeBackOptions {
  onBack: () => void;
  threshold?: number;
  edgeWidth?: number;
  enabled?: boolean;
}

const useSwipeBack = ({
  onBack,
  threshold = 100,
  edgeWidth = 50,
  enabled = true
}: UseSwipeBackOptions) => {
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const pageRef = useRef<HTMLDivElement>(null);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    // 只响应从左边缘开始的滑动，避免与系统手势冲突
    if (touch.clientX < edgeWidth) {
      startX.current = touch.clientX;
      isDragging.current = true;
    }
  }, [enabled, edgeWidth]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !enabled) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    if (deltaX > 0 && pageRef.current) {
      // 实时更新页面位置，提供拖拽反馈
      pageRef.current.style.transform = `translateX(${deltaX}px)`;
      pageRef.current.style.transition = 'none';
    }
  }, [enabled]);
  
  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || !enabled) return;
    
    const deltaX = currentX.current - startX.current;
    
    if (pageRef.current) {
      // 恢复过渡动画
      pageRef.current.style.transition = 'transform 0.3s ease-out';
      
      if (deltaX > threshold) {
        // 触发返回
        pageRef.current.style.transform = 'translateX(100%)';
        setTimeout(onBack, 300);
      } else {
        // 回弹
        pageRef.current.style.transform = 'translateX(0)';
      }
    }
    
    isDragging.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [enabled, threshold, onBack]);
  
  useEffect(() => {
    const element = pageRef.current;
    if (!element || !enabled) return;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);
  
  return { pageRef };
};

export default useSwipeBack;
```

### 5. 底部固定按钮组件

```typescript
// BottomFixedButton 组件
import React from 'react';
import styles from './styles.module.css';

interface BottomFixedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const BottomFixedButton: React.FC<BottomFixedButtonProps> = ({
  children,
  onClick,
  disabled = false
}) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default BottomFixedButton;
```

```css
/* BottomFixedButton/styles.module.css */
.container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom)); /* 安全区域 */
  background: linear-gradient(to top, var(--bg-color) 80%, transparent);
}

.button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease-out;
}

.button:hover {
  opacity: 0.9;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 6. 组件结构

```
settings/
├── components/
│   ├── PageTransition/          # 新增：页面切换动画组件
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── BottomFixedButton/       # 新增：底部固定按钮组件
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── ...
├── hooks/
│   ├── useSwipeBack.ts          # 新增：手势返回 Hook
│   └── ...
├── animations/                   # 新增：动画样式
│   └── index.css
└── ...
```

## UI/UX 设计规范

### 交互规范

| 元素 | 规范 | 说明 |
|------|------|------|
| 可点击元素 | `cursor: pointer` | 所有可交互元素必须添加 |
| 悬停反馈 | 颜色/透明度变化 | 避免 scale 导致布局偏移 |
| 过渡时间 | 150-300ms | 悬停状态变化 |
| 页面切换 | 300-400ms | 页面进入/退出动画 |

### 层级管理

| 层级 | z-index | 用途 |
|------|---------|------|
| 背景页面 | 1 | 被覆盖的页面 |
| 当前页面 | 2 | 活动页面 |
| 底部固定按钮 | 10 | 固定在底部的操作按钮 |
| 弹窗遮罩 | 100 | 弹窗背景 |
| 弹窗内容 | 101 | 弹窗主体 |

### 安全区域

- 底部固定元素必须考虑 `env(safe-area-inset-bottom)`
- 顶部导航必须考虑 `env(safe-area-inset-top)`

## Risks / Trade-offs

### Risk 1: 动画性能问题
- **风险**: 低端设备可能出现动画卡顿
- **缓解**: 
  - 使用 `transform` 和 `opacity` 实现动画（GPU 加速）
  - 添加 `will-change` 提示浏览器优化
  - 避免触发重排

### Risk 2: 手势冲突
- **风险**: 手势返回可能与页面内滚动或系统手势冲突
- **缓解**: 
  - 只响应从左边缘（< 50px）开始的滑动
  - 使用垂直滚动作为主要交互方式

### Risk 3: 过度动画
- **风险**: 过多动画可能导致用户分心或晕动症
- **缓解**: 
  - 限制每个视图最多 1-2 个关键动画元素
  - 支持 `prefers-reduced-motion` 媒体查询
  - 列表项动画最多 5 个

### Risk 4: 主题设置保存逻辑变更
- **风险**: 用户可能不习惯需要点击保存才生效
- **缓解**: 保持预览功能，让用户能看到效果

### Risk 5: 导航历史问题
- **风险**: 返回按钮行为不符合预期
- **缓解**: 使用 `history.pushState()` 正确管理导航历史

## Migration Plan

1. 先实现基础动画组件和 Hook
2. 添加无障碍支持（`prefers-reduced-motion`）
3. 逐步替换现有组件
4. 测试各个页面的动画效果
5. 在低端设备上测试性能
6. 优化性能问题

## Pre-Delivery Checklist

### 视觉质量
- [ ] 悬停状态不会导致布局偏移
- [ ] 动画流畅，无卡顿

### 交互
- [ ] 所有可点击元素有 `cursor: pointer`
- [ ] 悬停状态提供清晰的视觉反馈
- [ ] 过渡动画平滑（150-300ms）
- [ ] 键盘导航可见焦点状态

### 无障碍
- [ ] 支持 `prefers-reduced-motion`
- [ ] 颜色不是唯一的状态指示器

### 布局
- [ ] 固定元素有适当的边距
- [ ] 内容不会被固定导航遮挡
- [ ] 考虑安全区域（Safe Area）

## Open Questions

- 无
