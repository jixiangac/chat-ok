# Proposal: 添加纪念日面板

## 概述

为 DC 模块添加纪念日（Memorial）功能面板，支持用户创建和管理纪念日，显示正计时（已过去天数）和倒计时（剩余天数）。

## 背景

当前 DC 模块已有"常规"和"度假"两个 Tab，"纪念"Tab 目前显示"建设中"占位页面。用户需要一个简单的纪念日管理功能来记录重要日期。

## 目标

1. 实现纪念日的创建、编辑、删除功能
2. 支持正计时（过去日期）和倒计时（未来日期）自动判断
3. 提供简洁的列表展示和详情查看
4. 支持置顶功能和多种天数显示格式

## 非目标

- 不需要分类管理功能
- 不需要提醒通知功能
- 不需要分享导出功能
- 不需要周期性重复功能

## 用户故事

1. **作为用户**，我想创建一个纪念日，记录重要的日期（如结婚纪念日、宝宝出生日）
2. **作为用户**，我想查看距离某个日期已经过去了多少天（正计时）
3. **作为用户**，我想查看距离某个日期还有多少天（倒计时）
4. **作为用户**，我想切换天数的显示格式（天 / 月+天 / 年+月+天）
5. **作为用户**，我想置顶重要的纪念日
6. **作为用户**，我想为纪念日设置个性化的图标和背景

## 技术方案

### 数据模型

```typescript
interface Memorial {
  id: string;
  name: string;                    // 纪念日名称
  date: string;                    // 日期 (YYYY-MM-DD)
  icon: string;                    // lucide-react 图标名称
  iconColor: string;               // 图标颜色（蜡笔风格）
  note?: string;                   // 备注说明
  background: MemorialBackground;  // 背景设置
  isPinned: boolean;               // 是否置顶
  pinnedAt?: number;               // 置顶时间戳
  createdAt: number;               // 创建时间戳
  updatedAt: number;               // 更新时间戳
}

interface MemorialBackground {
  type: 'color' | 'gradient' | 'image';
  value: string;  // 颜色值 / 渐变值 / 图片URL
}
```

### 存储方案

- 使用 `localStorage` 存储纪念日数据
- 存储键：`dc_memorials`
- 天数显示格式偏好存储键：`dc_memorial_date_format`

### 组件结构

```
src/pages/dc/panels/memorial/
├── index.tsx                    # 面板入口
├── types.ts                     # 类型定义
├── storage.ts                   # 存储工具
├── components/
│   ├── index.ts                 # 统一导出
│   ├── MemorialCard/            # 纪念日卡片（列表项）
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── MemorialDetail/          # 纪念日详情弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── CreateMemorialModal/     # 创建/编辑弹窗
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── IconPicker/              # 图标选择器
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── BackgroundPicker/        # 背景选择器
│       ├── index.tsx
│       └── styles.module.css
├── hooks/
│   ├── index.ts
│   ├── useMemorials.ts          # 纪念日数据管理
│   └── useDateFormat.ts         # 天数格式切换
├── utils/
│   ├── index.ts
│   ├── dateCalculator.ts        # 日期计算工具
│   └── iconConfig.ts            # 图标配置（蜡笔彩色风格）
└── constants/
    ├── index.ts
    ├── icons.ts                 # 预设图标列表
    └── backgrounds.ts           # 预设背景列表
```

## 界面设计

### 列表页面

- 布局与"常规"Tab 一致，顶部保留装饰图区域
- 纪念日列表使用单列 Grid 布局
- 每个卡片显示：图标、名称、天数
- 空状态显示示例卡片

### 卡片样式

- 参考 `SidelineTaskCard` 的 grid 模式
- 左侧显示蜡笔风格彩色图标
- 中间显示名称
- 右侧显示天数（正计时显示"已 X 天"，倒计时显示"还有 X 天"，今天显示"今天"）

### 详情页面

- 全屏弹窗展示
- 显示自定义背景
- 大字体显示天数（可点击切换格式）
- 显示名称、日期、备注
- 提供编辑、删除、置顶操作

## 排序规则

1. 置顶的纪念日优先（按置顶时间倒序）
2. 非置顶的按创建时间倒序

## 边界情况

- 日期为今天：显示"今天"
- 空状态：显示示例卡片引导用户创建
- 数据丢失：不需要特殊提示

## 影响范围

- 新增 `src/pages/dc/panels/memorial/` 目录及相关文件
- 修改 `src/pages/dc/index.tsx` 中的 `renderContent` 函数，替换"建设中"占位

## 风险评估

- **低风险**：功能独立，不影响现有任务管理功能
- **数据安全**：使用 localStorage，数据仅存储在本地

## 验收标准

1. 可以创建、编辑、删除纪念日
2. 正确显示正计时和倒计时
3. 支持天数格式切换并记忆偏好
4. 支持置顶功能
5. 支持自定义图标和背景
6. 空状态显示示例卡片
7. 界面风格与现有 DC 模块一致
