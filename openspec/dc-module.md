# DC 模块 - 任务管理系统规范

> **路径**: `src/pages/dc/`
> 
> DC 模块是一个独立的 App 风格应用，拥有完整的设计系统和架构规范。在处理 DC 相关功能时，请严格遵循以下规范。

## 模块目录结构

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

## 设计规范

### 视觉风格
- **设计语言**: Notion 风格，简洁、留白、轻量
- **主色调**: 黑白灰为主，彩色用于强调
- **圆角**: 8px-12px（卡片）、20px（底部抽屉）、26px（按钮）
- **阴影**: 极少使用，主要依靠边框区分层级
- **边框**: `rgba(55, 53, 47, 0.09)` 或 `#f0f0f0`

### 配色系统

```typescript
// 主题色 - 支线任务使用
const SIDELINE_THEME_COLORS = [
  '#F6EFEF', // 奶油粉
  '#E0CEC6', // 淡玫瑰
  '#F1F1E8', // 奶油绿
  '#B9C9B9', // 薄荷绿
  '#E7E6ED', // 淡紫
  '#C0BDD1', // 紫灰
  '#F2F0EB', // 奶油灰
  '#D6CBBD', // 暖灰
  '#EAECEF', // 淡蓝灰
  '#B8BCC1', // 银灰
  '#C6DDE5', // 日式青
  '#E8E1B8', // 奶油黄
  '#B3BEE5', // 淡紫蓝
  '#E6D6BB', // 复古米
  '#D5C4C0', // 肉桂粉
  '#C9D4C9', // 鼠尾草绿
  '#D4D1E0', // 薰衣草紫
  '#E0DDD5', // 亚麻灰
  '#D1D8E0', // 雾霹蓝
  '#D5E0E0', // 淡青
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

### 间距规范
- **页面内边距**: 16px-24px
- **卡片内边距**: 16px
- **组件间距**: 8px-16px
- **标题与内容间距**: 8px-16px

### 字体规范
- **标题**: 15px-18px, font-weight: 500
- **正文**: 13px-14px, font-weight: 400
- **辅助文字**: 11px-12px
- **行高**: 1.4-1.5

## 核心类型定义

```typescript
// 任务类型
type TaskType = 'mainline' | 'sidelineA' | 'sidelineB';
type MainlineTaskType = 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';

// 任务接口
interface Task {
  id: string;
  title: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  type: TaskType;
  cycle?: string;
  completed?: boolean;
  
  // 主线任务特定字段
  mainlineType?: MainlineTaskType;
  mainlineTask?: MainlineTask;
  
  // 详情页需要的字段
  icon?: string;
  encouragement?: string;
  startDate?: string;
  cycleDays?: number;
  totalCycles?: number;
  
  // 支线任务主题色（创建时分配，固定不变）
  themeColor?: string;
}

// 主线任务
interface MainlineTask {
  id: string;
  mainlineType: MainlineTaskType;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DOWNGRADED' | 'PAUSED';
  createdAt: string;
  startDate?: string;
  
  cycleConfig: CycleConfig;
  progress: ProgressInfo;
  
  // 类型特定配置
  numericConfig?: NumericConfig;
  checklistConfig?: ChecklistConfig;
  checkInConfig?: CheckInConfig;
  
  history?: Array<{
    date: string;
    type: string;
    value?: any;
    note?: string;
  }>;
}

// 周期配置
interface CycleConfig {
  totalDurationDays: number;
  cycleLengthDays: number;
  totalCycles: number;
  currentCycle: number;
}

// 进度信息
interface ProgressInfo {
  totalPercentage: number;
  currentCyclePercentage: number;
  currentCycleStart?: number | string;
  currentCycleTarget?: number | string;
  currentCycleAchieved?: number;
  currentCycleRemaining?: number;
}

// 数值型任务配置
interface NumericConfig {
  direction: 'INCREASE' | 'DECREASE';
  unit: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  perCycleTarget: number;
  perDayAverage: number;
}

// 清单型任务配置
interface ChecklistConfig {
  totalItems: number;
  completedItems: number;
  perCycleTarget: number;
  items: ChecklistItem[];
}

// 打卡型任务配置
interface CheckInConfig {
  unit: 'TIMES' | 'DURATION' | 'QUANTITY';
  allowMultiplePerDay: boolean;
  weekendExempt: boolean;
  perCycleTarget: number;
  currentStreak: number;
  longestStreak: number;
  checkInRate: number;
  records: CheckInRecord[];
}
```

## 组件规范

### 组件结构模板
```typescript
import { useState, useCallback, useMemo } from 'react';
import { useTaskContext, useTheme } from '../../contexts';
import type { Task } from '../../types';
import styles from './styles.module.css';

interface MyComponentProps {
  task: Task;
  onClick?: () => void;
}

export default function MyComponent({ task, onClick }: MyComponentProps) {
  // 1. Hooks 调用（必须在顶部，条件返回之前）
  const { updateTask } = useTaskContext();
  const { themeColors } = useTheme();
  const [state, setState] = useState(false);
  
  // 2. 计算属性（useMemo）
  const computedValue = useMemo(() => {
    // 计算逻辑
    return someValue;
  }, [dependencies]);
  
  // 3. 回调函数（useCallback）
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);
  
  // 4. 条件返回（如果需要）
  if (!task) return null;
  
  // 5. 渲染
  return (
    <div className={styles.container} onClick={handleClick}>
      {/* 内容 */}
    </div>
  );
}
```

### 样式编写规范
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

## 状态管理

### TaskContext 使用
```typescript
import { useTaskContext } from './contexts';

function MyComponent() {
  // 获取任务数据和操作方法
  const { 
    tasks,           // 任务列表
    addTask,         // 添加任务
    updateTask,      // 更新任务
    deleteTask,      // 删除任务
    refreshTasks,    // 刷新任务列表
    getTaskById      // 根据 ID 获取任务
  } = useTaskContext();

  // 添加任务
  addTask({
    id: Date.now().toString(),
    title: '新任务',
    type: 'mainline',
    progress: 0,
    currentDay: 0,
    totalDays: 30,
  });

  // 更新任务
  updateTask(taskId, { progress: 50 });

  // 删除任务
  deleteTask(taskId);
}
```

### 数据持久化
```typescript
// 使用 localStorage 存储
const STORAGE_KEY = 'dc_tasks';

const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};
```

## 交互规范

### 弹窗/面板
- 使用 `antd-mobile` 的 `Popup` 组件
- 底部弹出，圆角 16px-20px
- 最大高度 80vh-90vh
- 包含拖拽手柄（drawerHandle）

```typescript
<Popup
  visible={visible}
  onMaskClick={onClose}
  position='bottom'
  bodyStyle={{
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#f5f5f5'
  }}
>
  {/* 内容 */}
</Popup>
```

### 动画
- 过渡时间: 0.2s-0.3s
- 缓动函数: ease-out
- 进度条动画: `transition: width 0.3s ease`

### 反馈
- 使用 `canvas-confetti` 实现庆祝效果
- 使用 `Toast.show()` 显示操作结果
- 按钮禁用状态使用灰色背景 `#ccc`

```typescript
import confetti from 'canvas-confetti';
import { Toast } from 'antd-mobile';

// 庆祝效果
const triggerConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x: 0.5, y: 0.9 },
    colors: ["hsl(var(--primary))","hsl(var(--accent))"],
    ticks: 200,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle']
  });
};

// Toast 提示
Toast.show({ icon: 'success', content: '操作成功！' });
Toast.show({ icon: 'fail', content: '操作失败，请重试' });
```

## 最佳实践

### Hooks 规则
- 所有 Hooks 必须在组件顶部调用，条件返回之前
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存回调函数

### 性能优化
- 使用 `useMemo` 和 `useCallback` 避免不必要的重渲染
- 复杂计算放在 `useMemo` 中
- 事件处理函数使用 `useCallback` 包装

### 类型安全
- 为所有 Props 定义明确的 TypeScript 接口
- 使用 `type` 定义联合类型
- 使用 `interface` 定义对象类型

### 组件拆分
- 复杂组件拆分为多个子组件
- 每个组件职责单一
- 使用 `index.ts` 统一导出

### 样式隔离
- 使用 CSS Modules 避免全局样式污染
- 动态样式使用内联 style
- 主题相关样式使用 CSS 变量

### 统一导出
- 每个目录使用 `index.ts` 统一导出
- 导出时使用命名导出
- 类型使用 `export type` 导出
