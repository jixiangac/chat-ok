# 修仙等级体系 UI 设计规范

## 设计理念

结合图3的现代极简风格与修仙主题，打造一个**简约而有仙气**的修炼面板。

### 核心设计原则

1. **浅色简约背景** - 使用 Off-white (#F8FAFC) 作为主背景
2. **柔和的色彩** - 采用 Soft UI Evolution 风格，避免过于鲜艳的颜色
3. **圆角卡片** - 使用大圆角 (16-24px) 营造柔和感
4. **留白充足** - 保持呼吸感，不拥挤
5. **微妙的阴影** - 使用柔和阴影增加层次感

## 色彩系统

### 主色调（修仙主题）

```css
/* 境界色彩 - 从低到高渐变 */
--realm-lianqi: #90EE90;      /* 炼气期 - 嫩绿色 */
--realm-zhuji: #87CEEB;       /* 筑基期 - 天蓝色 */
--realm-jiedan: #DDA0DD;      /* 结丹期 - 淡紫色 */
--realm-yuanying: #FFB6C1;    /* 元婴期 - 粉红色 */
--realm-huashen: #F0E68C;     /* 化神期 - 金黄色 */
--realm-lianxu: #E6E6FA;      /* 炼虚期 - 淡紫罗兰 */
--realm-heti: #B0E0E6;        /* 合体期 - 淡青色 */
--realm-dacheng: #FFDAB9;     /* 大乘期 - 桃色 */
--realm-dujie: #FFD700;       /* 渡劫期 - 金色 */
```

### 基础色彩

```css
/* 背景色 */
--bg-primary: #F8FAFC;        /* 主背景 */
--bg-card: #FFFFFF;           /* 卡片背景 */
--bg-secondary: #F1F5F9;      /* 次级背景 */

/* 文字色 */
--text-primary: #1E293B;      /* 主文字 */
--text-secondary: #64748B;    /* 次级文字 */
--text-muted: #94A3B8;        /* 弱化文字 */

/* 边框色 */
--border-light: #E2E8F0;      /* 浅边框 */
--border-medium: #CBD5E1;     /* 中等边框 */

/* 进度条 */
--progress-bg: #E2E8F0;       /* 进度条背景 */
--progress-fill: linear-gradient(90deg, #10B981 0%, #34D399 100%); /* 进度条填充 */
```

## 布局结构

### 修炼面板（全屏下拉触发）

```
┌─────────────────────────────────────┐
│  ← 返回                    详情 →   │  顶部导航栏
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────────┐         │
│         │   境界徽章区域   │         │  境界展示区
│         │   「炼气期」     │         │
│         │   第三层        │         │
│         └─────────────────┘         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      ┌───────────────────────┐      │
│      │                       │      │
│      │    角色意象展示区     │      │  中央展示区
│      │    (打坐修炼图)       │      │  高度: 40vh
│      │                       │      │
│      └───────────────────────┘      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  修为进度                   │    │  进度区域
│  │  ████████████░░░░░  75/100  │    │
│  │  距离突破还需 25 修为       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      [ 突破 ]               │    │  操作按钮
│  │   (修为满时显示)            │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 境界徽章设计

```
    ┌─────────────────────┐
    │  ╭─────────────────╮│
    │  │   🌿 炼气期     ││  境界名称 + 图标
    │  │   ─────────     ││
    │  │   第 三 层      ││  当前阶段
    │  ╰─────────────────╯│
    └─────────────────────┘
```

## 组件规范

### 1. 境界徽章 (RealmBadge)

```tsx
// 尺寸
width: 160px
height: 80px
borderRadius: 16px

// 样式
background: linear-gradient(135deg, var(--realm-color) 0%, var(--realm-color-light) 100%)
boxShadow: 0 4px 12px rgba(0, 0, 0, 0.08)
border: 1px solid rgba(255, 255, 255, 0.5)

// 文字
境界名称: 20px, font-weight: 600
阶段: 14px, font-weight: 400
```

### 2. 修为进度条 (CultivationProgress)

```tsx
// 容器
height: 12px
borderRadius: 6px
background: var(--progress-bg)

// 进度填充
background: linear-gradient(90deg, currentRealmColor 0%, nextRealmColor 100%)
transition: width 0.3s ease

// 数值显示
position: 右侧
fontSize: 14px
color: var(--text-secondary)
```

### 3. 突破按钮 (BreakthroughButton)

```tsx
// 尺寸
width: 100%
maxWidth: 200px
height: 48px
borderRadius: 24px

// 样式（可突破时）
background: linear-gradient(135deg, #10B981 0%, #059669 100%)
color: white
boxShadow: 0 4px 12px rgba(16, 185, 129, 0.3)

// 样式（不可突破时）
background: var(--bg-secondary)
color: var(--text-muted)
cursor: not-allowed
```

### 4. 角色意象区域 (CharacterDisplay)

```tsx
// 容器
width: 100%
height: 40vh
minHeight: 200px
maxHeight: 300px
display: flex
alignItems: center
justifyContent: center

// 背景
background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)

// 图片/SVG
maxWidth: 80%
maxHeight: 80%
objectFit: contain
```

## 动画规范

### 进入动画

```css
/* 面板滑入 */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 境界徽章淡入 */
@keyframes fadeInScale {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### 进度条动画

```css
/* 进度增长 */
.progress-fill {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 修为获得时的闪光效果 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 突破动画（后续实现）

```css
/* 突破成功光效 */
@keyframes breakthrough {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px 10px rgba(16, 185, 129, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
```

## 响应式设计

### 移动端优先

```css
/* 基础样式 - 移动端 */
.cultivation-panel {
  padding: 16px;
}

.realm-badge {
  width: 140px;
  height: 70px;
}

.character-display {
  height: 35vh;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .cultivation-panel {
    padding: 24px;
  }
  
  .realm-badge {
    width: 180px;
    height: 90px;
  }
  
  .character-display {
    height: 45vh;
  }
}
```

## 无障碍设计

1. **颜色对比度** - 所有文字与背景对比度 ≥ 4.5:1
2. **触摸目标** - 所有可点击元素最小 44x44px
3. **动画偏好** - 尊重 `prefers-reduced-motion` 设置
4. **语义化** - 使用正确的 ARIA 标签

## 境界图标映射

| 境界 | 图标 | 颜色 |
|------|------|------|
| 炼气期 | 🌿 (叶子) | #90EE90 |
| 筑基期 | 🏔️ (山) | #87CEEB |
| 结丹期 | 💎 (宝石) | #DDA0DD |
| 元婴期 | 👶 (婴儿) | #FFB6C1 |
| 化神期 | ✨ (星光) | #F0E68C |
| 炼虚期 | 🌀 (漩涡) | #E6E6FA |
| 合体期 | ☯️ (阴阳) | #B0E0E6 |
| 大乘期 | 🌟 (大星) | #FFDAB9 |
| 渡劫期 | ⚡ (雷电) | #FFD700 |

> 注意：实际实现中使用 SVG 图标，不使用 emoji
