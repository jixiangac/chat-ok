# Design: 趣味视觉进度组件 - 鸭子剪影

## Architecture Overview

```
┌──────────────────────────────────────────┐
│         TaskDetailPanel                  │
│  ┌────────────────────────────────────┐  │
│  │  根据 task.category 选择组件       │  │
│  │                                    │  │
│  │  if category === 'water':         │  │
│  │    → <DuckWaterProgress />        │  │
│  │  else:                            │  │
│  │    → <CoffeeCupProgress />        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  <QuickActionButtons />            │  │
│  │  - 根据 checkInConfig 渲染按钮     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  <TodayRecordButton />             │  │
│  │  - 渐变色进度条样式                 │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Component Design

### 1. DuckWaterProgress 组件

**职责：**展示鸭子剪影 + 水波进度的视觉化效果

**Props：**
```typescript
interface DuckWaterProgressProps {
  /** 周期进度百分比 (0-100) */
  progress: number;
  /** 当前值 */
  currentValue: number;
  /** 目标值 */
  targetValue: number;
  /** 单位 */
  unit: string;
  /** 是否触发动画 */
  animate?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
}
```

**内部结构：**
```tsx
<div className="container">
  {/* 鸭子剪影 SVG */}
  <DuckSilhouette className="silhouette" />
  
  {/* 水波填充（使用 clip-path） */}
  <motion.div 
    className="water"
    style={{ 
      clipPath: 'url(#duck-clip)',
      height: `${progress}%` 
    }}
  >
    <WaterWave />
  </motion.div>
  
  {/* 进度数值 */}
  <div className="progressText">
    <span>{currentValue}</span>
    <span className="separator">/</span>
    <span>{targetValue} {unit}</span>
  </div>
  
  {/* 差值提示 */}
  <div className="diffText">
    还差 {targetValue - currentValue} {unit}
  </div>
</div>
```

### 2. DuckSilhouette 组件

**职责：**提供鸭子 SVG 剪影路径

```tsx
export function DuckSilhouette() {
  return (
    <svg viewBox="0 0 200 200" className="silhouette">
      <defs>
        <clipPath id="duck-clip">
          <path d="M100,40 C120,40 135,55 135,75 C135,85 130,93 122,98 L122,140 C122,160 110,175 95,180 L105,180 C108,185 105,190 100,190 C95,190 92,185 95,180 L85,180 C70,175 58,160 58,140 L58,98 C50,93 45,85 45,75 C45,55 60,40 80,40 C85,40 89,41 93,43 C96,41 98,40 100,40 Z" />
        </clipPath>
      </defs>
      
      {/* 灰色剪影背景 */}
      <use href="#duck-clip" fill="#E8E8E8" />
    </svg>
  );
}
```

### 3. WaterWave 组件

**职责：**实现水波晃动动画

```tsx
export function WaterWave() {
  return (
    <div className="waveContainer">
      <motion.svg
        viewBox="0 0 100 20"
        className="wave"
        animate={{
          x: [0, -25, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <path
          d="M0,10 Q12.5,5 25,10 T50,10 T75,10 T100,10 T125,10 L125,20 L0,20 Z"
          fill="#A8D8EA"
        />
      </motion.svg>
    </div>
  );
}
```

### 4. SecondaryNav 按钮组件（重新设计）

**职责：**提供简约的二级入口按钮，参考支线任务区域样式

```tsx
interface SecondaryNavProps {
  onRecordsClick?: () => void;
  onHistoryClick?: () => void;
  taskType?: 'CHECK_IN' | 'NUMERIC' | 'CHECKLIST';
}

export function SecondaryNav({ onRecordsClick, onHistoryClick, taskType }: SecondaryNavProps) {
  // 按钮基础样式（与 SidelineTaskGrid 保持一致）
  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#9b9b9b',
    cursor: 'pointer',
    padding: '8px 12px',
    textDecoration: 'none',
    transition: 'color 0.2s ease, transform 0.2s ease',
    borderRadius: '8px',
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '16px'
      }}
    >
      <motion.button
        onClick={onRecordsClick}
        whileHover={{ color: '#666' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
      >
        变动记录
      </motion.button>
      
      <motion.button
        onClick={onHistoryClick}
        whileHover={{ color: '#666' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
      >
        周期计划
      </motion.button>
    </motion.div>
  );
}
```

## Data Flow

### 组件选择逻辑

```typescript
// src/pages/dc/panels/detail/index.tsx

// CHECK_IN 类型统一使用 DuckWaterProgress
function renderProgressVisual() {
  if (taskCategory === 'CHECK_IN') {
    return <DuckWaterProgress progress={progress} {...props} />;
  }
  // NUMERIC 类型保持现有逻辑（WaterCupProgress / IceMeltProgress）
  // ...
}
```

### 快捷按钮配置

```typescript
// src/pages/dc/contexts/TaskProvider/index.tsx

// 创建任务时设置默认快捷按钮
function createTask(data: TaskCreateData) {
  const task: Task = {
    // ... 其他字段
    checkInConfig: {
      // ... 其他配置
      // CHECK_IN 类型默认添加快捷按钮
      quickActions: data.category === 'CHECK_IN' 
        ? [
            { label: '50ml', value: 50 },
            { label: '100ml', value: 100 },
            { label: '200ml', value: 200 },
            { label: '500ml', value: 500 },
            { label: '一键填满', action: 'fillToTarget' },
            { label: '手动输入', action: 'openModal' }
          ]
        : undefined
    }
  };
  
  return task;
}
```

### 按钮点击处理

```typescript
// src/pages/dc/panels/detail/index.tsx

const handleQuickAction = useCallback(async (value?: number, action?: string) => {
  if (!taskId) return;
  
  if (action === 'fillToTarget') {
    // 一键填满
    const targetValue = task.progress.cycleTargetValue;
    await taskCheckIn(taskId, Number(targetValue));
  } else if (action === 'openModal') {
    // 手动输入
    setShowCheckInModal(true);
  } else if (value) {
    // 快捷数值
    await taskCheckIn(taskId, value);
  }
  
  // 触发动画
  triggerConfetti();
  refreshTasks();
}, [taskId, task, taskCheckIn, triggerConfetti, refreshTasks]);
```

## Visual Design

### 颜色规范

```css
:root {
  /* 鸭子剪影 */
  --duck-silhouette: #E8E8E8;
  
  /* 水波颜色（奶油蓝） */
  --water-fill: #A8D8EA;
  
  /* 进度文字 */
  --progress-text: #1D1D1F;
  --progress-muted: rgba(55, 53, 47, 0.5);
  
  /* 按钮渐变（今日毕配色） */
  --button-gradient: linear-gradient(135deg, #667eea, #764ba2);
}
```

### 动画时序

```typescript
// 水位上升
const WATER_RISE_DURATION = 300; // ms
const WATER_RISE_EASING = 'ease-out';

// 水面晃动
const WAVE_DURATION = 3000; // ms
const WAVE_AMPLITUDE = 5; // px

// 撒花庆祝
const CONFETTI_DELAY = 200; // 水位动画结束后触发
```

### 响应式设计

```css
/* 小屏幕（< 375px） */
.container.small {
  width: 200px;
  height: 200px;
}

/* 中屏幕（375px - 414px） */
.container.medium {
  width: 240px;
  height: 240px;
}

/* 大屏幕（> 414px） */
.container.large {
  width: 280px;
  height: 280px;
}
```

## Performance Considerations

### SVG 优化

- 使用 `<use>` 元素复用路径，减少 DOM 节点
- 使用 CSS `will-change` 提示浏览器优化动画
- 避免在动画中使用复杂的 `filter` 和 `blur`

### 动画性能

```css
/* 使用 GPU 加速 */
.water {
  transform: translateZ(0);
  will-change: height;
}

.wave {
  transform: translateZ(0);
  will-change: transform;
}
```

### 内存管理

- 组件卸载时清理动画定时器
- 使用 `requestAnimationFrame` 而非 `setInterval`
- 避免在快速点击时重复触发 confetti

## Testing Strategy

### 单元测试

```typescript
describe('DuckWaterProgress', () => {
  it('should render with correct progress', () => {
    const { container } = render(
      <DuckWaterProgress progress={50} currentValue={1000} targetValue={2000} unit="ml" />
    );
    expect(container.querySelector('.water')).toHaveStyle({ height: '50%' });
  });
  
  it('should trigger animation when progress changes', async () => {
    const { rerender } = render(
      <DuckWaterProgress progress={30} currentValue={600} targetValue={2000} unit="ml" animate />
    );
    rerender(
      <DuckWaterProgress progress={50} currentValue={1000} targetValue={2000} unit="ml" animate />
    );
    // 验证动画触发
  });
});
```

### 视觉回归测试

- 使用 Storybook 展示不同进度状态
- 截图对比确保视觉一致性

### 性能测试

- 使用 Chrome DevTools Performance 分析动画帧率
- 确保在低端设备上也能保持 60fps

## Migration Plan

### 向后兼容

- 现有任务的 `category` 字段默认为 `'coffee'`，继续使用咖啡杯组件
- 新增的 `quickActions` 字段为可选，不影响现有数据

### 数据迁移

不需要数据迁移，因为：
1. 新增字段都是可选的
2. 默认行为与现有一致

## Future Enhancements

1. **更多图标类型**：跑鞋、书本、闹钟等
2. **自定义配色**：允许用户选择水波颜色
3. **主题联动**：根据任务标签自动选择图标
4. **趣味音效**：打卡时播放水滴声
