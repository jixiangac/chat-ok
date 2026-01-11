# Project Context

## Purpose
这是一个基于 ice.js 框架的移动端 Web 应用，主要包含两个核心功能模块：
1. **量化交易机器人** - 加密货币和港美股的量化交易策略展示和账号管理
2. **任务管理系统 (DC)** - 一个功能丰富的目标/任务追踪系统，支持主线任务、支线任务、打卡、清单等多种任务类型

## Tech Stack

### 核心框架
- **ice.js v3** - 阿里巴巴开源的 React 应用框架
- **React 18** - UI 框架
- **TypeScript 4.9** - 类型安全的 JavaScript 超集

### UI 组件库
- **antd-mobile 5.x** - 移动端 UI 组件库
- **lucide-react** - 图标库

### 工具库
- **dayjs** - 日期处理
- **axios** - HTTP 请求
- **localforage** - 本地存储（IndexedDB/WebSQL/localStorage）
- **fingerprintjs2** - 浏览器指纹识别
- **canvas-confetti** - 庆祝动画效果

### 开发工具
- **ESLint** - 代码检查（使用 @ali/eslint-config-att 配置）
- **Stylelint** - 样式检查
- **@applint/spec** - 阿里巴巴代码规范

## Project Conventions

### Code Style

#### 文件命名
- **组件文件**: PascalCase（如 `MainlineTaskCard.tsx`、`CreateGoalModal.tsx`）
- **工具/hooks 文件**: camelCase（如 `useProgress.ts`、`cycleCalculator.ts`）
- **样式文件**: 使用 CSS Modules，命名为 `*.module.css`（如 `DCPage.module.css`）
- **类型定义文件**: `types.ts`
- **常量文件**: `constants.ts` 或 `constants/index.ts`

#### 目录结构
```
src/pages/[feature]/
├── index.tsx           # 页面入口
├── types.ts            # 类型定义
├── components/         # 组件目录
│   ├── index.ts        # 统一导出
│   ├── [Component]/    # 复杂组件独立目录
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── shared/         # 共享组件
├── contexts/           # React Context
├── hooks/              # 自定义 Hooks
├── panels/             # 面板/弹窗组件
├── utils/              # 工具函数
├── constants/          # 常量定义
└── css/                # 样式文件
```

#### 导入规范
- 使用 `@/*` 路径别名引用 `src/` 目录下的模块
- 使用 `ice` 别名引用 ice.js 框架模块
- 导入顺序：React/框架 → 第三方库 → 本地组件 → 工具/类型 → 样式

#### 类型定义规范
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型和类型别名
- 类型名使用 PascalCase
- Props 类型命名为 `[ComponentName]Props`

### Architecture Patterns

#### 状态管理
- 使用 **React Context** 进行全局状态管理
- 使用 **localStorage/localforage** 进行数据持久化
- Context 模式：Provider + useContext Hook

#### 组件设计模式
- **容器/展示组件分离**: 页面组件处理逻辑，子组件负责展示
- **复合组件模式**: 复杂功能拆分为多个子组件
- **自定义 Hooks**: 抽取可复用的状态逻辑

#### 样式方案
- 使用 **CSS Modules** 实现样式隔离
- 使用 **CSS 变量** 定义主题色和设计 token
- 内联样式用于动态样式计算

### Testing Strategy
- 当前项目未配置测试框架
- 建议后续添加 Jest + React Testing Library

### Git Workflow
- 使用 GitHub 进行版本控制
- 仓库地址: git@github.com:ice-lab/react-materials.git

---

## DC 模块 - 任务管理系统

> **路径**: `src/pages/dc/`
> 
> DC 模块是一个独立的 App 风格应用，拥有完整的设计系统和架构规范。在处理 DC 相关功能时，请严格遵循以下规范。

### DC 模块目录结构

```
src/pages/dc/
├── index.tsx                    # 页面入口，包含 Provider 包装
├── types.ts                     # 核心类型定义
├── components/                  # UI 组件
│   ├── index.ts                 # 统一导出
│   ├── card/                    # 任务卡片组件
│   │   ├── MainlineTaskCard.tsx
│   │   └── SidelineTaskCard.tsx
│   ├── CreateMainlineTaskModal/ # 创建任务弹窗
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── steps/               # 分步表单
│   ├── shared/                  # 共享组件
│   │   ├── CircleProgress/
│   │   ├── ProgressBar/
│   │   └── StatCard/
│   ├── DailyProgress/
│   ├── MoonPhase/
│   ├── SidelineTaskGrid/
│   ├── TodayProgress/
│   └── ThemedButton/
├── contexts/                    # 状态管理
│   ├── index.ts
│   ├── TaskContext.tsx          # 任务数据 Context
│   └── ThemeContext.tsx         # 主题 Context
├── hooks/                       # 自定义 Hooks
│   ├── index.ts
│   ├── useProgress.ts
│   ├── useSpriteImage.ts
│   └── useTaskSort.ts
├── panels/                      # 面板/弹窗
│   ├── detail/                  # 任务详情面板
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   ├── hooks.ts
│   │   ├── components/          # 详情页子组件
│   │   └── utils/
│   ├── archive/                 # 归档列表
│   ├── settings/                # 设置面板
│   └── happy/                   # 度假模式
├── utils/                       # 工具函数
│   ├── index.ts
│   ├── cycleCalculator.ts       # 周期计算
│   ├── mainlineTaskHelper.ts    # 主线任务辅助
│   └── progressCalculator.ts    # 进度计算
├── constants/                   # 常量定义
│   ├── index.ts
│   ├── colors.ts                # 主题色配置
│   └── sprites.ts               # 精灵图配置
└── css/                         # 样式文件
    ├── DCPage.module.css
    ├── MainlineTaskCard.module.css
    └── ...
```

### DC 模块设计规范

#### 视觉风格
- **设计语言**: Notion 风格，简洁、留白、轻量
- **主色调**: 黑白灰为主，彩色用于强调
- **圆角**: 8px-12px（卡片）、20px（底部抽屉）、26px（按钮）
- **阴影**: 极少使用，主要依靠边框区分层级
- **边框**: `rgba(55, 53, 47, 0.09)` 或 `#f0f0f0`

#### 配色系统

```typescript
// 主题色 - 支线任务使用
const SIDELINE_THEME_COLORS = [
  '#F6EFEF', // 奶油粉
  '#E0CEC6', // 淡玫瑰
  '#F1F1E8', // 奶油绿
  '#B9C9B9', // 薄荷绿
  '#E7E6ED', // 淡紫
  '#C0BDD1', // 紫灰
  // ... 共20种柔和色
];

// 文字颜色
const TEXT_COLORS = {
  primary: 'rgb(55, 53, 47)',           // 主文字
  secondary: 'rgba(55, 53, 47, 0.65)',  // 次要文字
  muted: 'rgba(55, 53, 47, 0.5)',       // 辅助文字
  disabled: 'rgba(55, 53, 47, 0.35)',   // 禁用文字
};

// 背景色
const BG_COLORS = {
  page: '#f5f5f5',
  card: '#ffffff',
  hover: '#f5f5f5',
  skeleton: 'rgba(55, 53, 47, 0.08)',
};
```

#### 间距规范
- **页面内边距**: 16px-24px
- **卡片内边距**: 16px
- **组件间距**: 8px-16px
- **标题与内容间距**: 8px-16px

#### 字体规范
- **标题**: 15px-18px, font-weight: 500
- **正文**: 13px-14px, font-weight: 400
- **辅助文字**: 11px-12px
- **行高**: 1.4-1.5

### DC 模块核心类型

```typescript
// 任务类型
type TaskType = 'mainline' | 'sidelineA' | 'sidelineB';
type MainlineTaskType = 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';

// 任务接口
interface Task {
  id: string;
  title: string;
  type: TaskType;
  mainlineType?: MainlineTaskType;
  mainlineTask?: MainlineTask;
  startDate?: string;
  cycleDays?: number;
  totalCycles?: number;
  themeColor?: string;  // 支线任务主题色
  // ...
}

// 主线任务
interface MainlineTask {
  id: string;
  mainlineType: MainlineTaskType;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'PAUSED';
  cycleConfig: CycleConfig;
  progress: ProgressInfo;
  numericConfig?: NumericConfig;
  checklistConfig?: ChecklistConfig;
  checkInConfig?: CheckInConfig;
}

// 周期配置
interface CycleConfig {
  totalDurationDays: number;
  cycleLengthDays: number;
  totalCycles: number;
  currentCycle: number;
}
```

### DC 模块组件规范

#### 组件结构
```typescript
// 标准组件结构
import { useState, useCallback, useMemo } from 'react';
import { useTaskContext, useTheme } from '../../contexts';
import type { ComponentProps } from './types';
import styles from './styles.module.css';

interface MyComponentProps {
  task: Task;
  onClick?: () => void;
}

export default function MyComponent({ task, onClick }: MyComponentProps) {
  // 1. Hooks 调用（必须在顶部）
  const { updateTask } = useTaskContext();
  const { themeColors } = useTheme();
  const [state, setState] = useState(false);
  
  // 2. 计算属性（useMemo）
  const computedValue = useMemo(() => {
    // ...
  }, [dependencies]);
  
  // 3. 回调函数（useCallback）
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies]);
  
  // 4. 渲染
  return (
    <div className={styles.container}>
      {/* ... */}
    </div>
  );
}
```

#### 样式编写规范
```css
/* 使用 CSS Modules */
.container {
  /* 布局 */
  display: flex;
  flex-direction: column;
  
  /* 尺寸 */
  width: 100%;
  padding: 16px;
  
  /* 视觉 */
  background-color: white;
  border-radius: 12px;
  border: 1px solid rgba(55, 53, 47, 0.09);
  
  /* 交互 */
  cursor: pointer;
  transition: all 0.2s;
}

.container:hover {
  background-color: #f5f5f5;
}

/* 使用语义化类名 */
.header { }
.content { }
.footer { }
.title { }
.subtitle { }
.progressBar { }
.progressFill { }
```

### DC 模块状态管理

#### TaskContext 使用
```typescript
// 获取任务数据
const { tasks, addTask, updateTask, deleteTask, refreshTasks } = useTaskContext();

// 添加任务
addTask({
  id: Date.now().toString(),
  title: '新任务',
  type: 'mainline',
  // ...
});

// 更新任务
updateTask(taskId, { progress: 50 });

// 删除任务
deleteTask(taskId);
```

#### 数据持久化
```typescript
// 使用 localStorage 存储
const STORAGE_KEY = 'dc_tasks';

const loadTasksFromStorage = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
```

### DC 模块交互规范

#### 弹窗/面板
- 使用 `antd-mobile` 的 `Popup` 组件
- 底部弹出，圆角 16px-20px
- 最大高度 80vh-90vh
- 包含拖拽手柄（drawerHandle）

#### 动画
- 过渡时间: 0.2s-0.3s
- 缓动函数: ease-out
- 进度条动画: `transition: width 0.3s ease`

#### 反馈
- 使用 `canvas-confetti` 实现庆祝效果
- 使用 `Toast.show()` 显示操作结果
- 按钮禁用状态使用灰色背景

### DC 模块最佳实践

1. **Hooks 规则**: 所有 Hooks 必须在组件顶部调用，条件返回之前
2. **性能优化**: 使用 `useMemo` 和 `useCallback` 避免不必要的重渲染
3. **类型安全**: 为所有 Props 和状态定义明确的 TypeScript 类型
4. **组件拆分**: 复杂组件拆分为多个子组件，每个组件职责单一
5. **样式隔离**: 使用 CSS Modules，避免全局样式污染
6. **统一导出**: 使用 `index.ts` 统一导出模块内容

---

## Domain Context

### 量化交易模块
- 加密货币策略展示
- 港美股策略展示
- 账号管理和数据展示

## Important Constraints

### 技术约束
- 移动端优先设计，需要适配各种屏幕尺寸
- 使用 localforage 进行本地数据持久化，需考虑存储限制
- 部分功能依赖外部 API（api.jixiang.chat）
- 单个文件大小最好保持在500行以下，如果超过最好拆成多个模块来实现

### 代码约束
- 部分文件使用 `@ts-nocheck` 跳过类型检查（如 `src/pages/index.tsx`、`src/utils.ts`），建议逐步修复
- 需要兼容旧版本数据结构

### 构建约束
- 生产环境使用 SWC 进行代码压缩
- 禁用 SSG 和 SSR，纯客户端渲染
- 禁用代码分割（codeSplitting: false）

## External Dependencies

### API 服务
- **api.jixiang.chat**: 量化交易数据 API
  - `/api/btc/list`: 获取账号列表、设备访问记录等

### 代理配置
- 开发环境代理 `/api` 到 `http://127.0.0.1:7001`

## Best Practices

### 组件开发
1. 优先使用函数组件和 Hooks
2. 使用 TypeScript 进行类型约束
3. 复杂组件拆分为独立目录，包含 index.tsx、types.ts、styles
4. 使用 CSS Modules 避免样式冲突

### 状态管理
1. 简单状态使用 useState
2. 跨组件状态使用 Context
3. 持久化数据使用 localforage
4. 避免过度使用全局状态

### 性能优化
1. 使用 useCallback/useMemo 优化渲染
2. 使用 requestIdleCallback 延迟非关键任务
3. 合理使用条件渲染减少 DOM 节点

### 代码组织
1. 相关代码放在同一目录
2. 使用 index.ts 统一导出
3. 类型定义集中在 types.ts
4. 常量集中在 constants 目录
