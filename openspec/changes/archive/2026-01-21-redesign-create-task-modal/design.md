# Design: 重新设计创建任务弹窗

## 架构概览

```
CreateTaskModal/
├── index.tsx                    # 主入口，页面栈管理
├── styles.module.css            # 全局样式
├── types.ts                     # 类型定义（保留）
├── constants.ts                 # 常量定义（保留）
├── pages/                       # 页面组件
│   ├── index.ts                 # 统一导出
│   ├── CycleSettingsPage/       # 周期设置
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── TypeSelectPage/          # 类型选择
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── ConfigPage/              # 具体配置
│       ├── index.tsx
│       └── styles.module.css
└── components/                  # 子组件
    ├── index.ts
    ├── TaskTypeCard/            # 任务类型卡片
    ├── CyclePreview/            # 周期预览
    └── OptionGrid/              # 选项网格
```

## 页面流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  CycleSettings  │ ──► │   TypeSelect    │ ──► │    ConfigPage   │
│     Page        │     │     Page        │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
   周期设置                类型选择                具体配置

   - 总时长               - 数值型               - 任务标题
   - 周期长度             - 清单型               - 类型专属配置
   - 起始时间             - 打卡型               - 确认创建
```

## 组件设计

### 1. 主入口组件（index.tsx）

```tsx
interface CreateTaskModalState {
  // 周期设置
  totalDays: number;
  cycleDays: number;
  startDate: string;

  // 类型选择
  selectedType: MainlineTaskType | null;

  // 具体配置（各类型专属）
  taskTitle: string;
  numericConfig: NumericConfig;
  checklistConfig: ChecklistConfig;
  checkInConfig: CheckInConfig;
}

function CreateTaskModal({ visible, onClose }) {
  const [state, setState] = useState<CreateTaskModalState>(...);
  const { currentPage, push, pop, canGoBack, reset } = usePageStack();

  // 手势支持
  const { pageRef } = useSwipeBack({
    onBack: () => handleBack(true),
    enabled: canGoBack,
  });

  // 页面渲染
  const renderPage = (pageId: string) => {
    switch (pageId) {
      case 'cycle':
        return <CycleSettingsPage state={state} setState={setState} onNext={() => push('type')} />;
      case 'type':
        return <TypeSelectPage state={state} setState={setState} onNext={() => push('config')} onBack={pop} />;
      case 'config':
        return <ConfigPage state={state} setState={setState} onSubmit={handleSubmit} onBack={pop} />;
    }
  };

  return createPortal(
    <div className={styles.panel}>
      <div className={styles.pageStack}>
        {stack.map((page, index) => (
          <div key={page.id} ref={getPageRef(index)} className={getPageLayerClass(index)}>
            {renderPage(page.id)}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
```

### 2. CycleSettingsPage

使用 SubPageLayout + SettingsSection + SettingsListItem：

```tsx
function CycleSettingsPage({ state, setState, onNext }) {
  return (
    <SubPageLayout
      title="周期设置"
      description="设定任务的总时长和周期"
      headerImage="/images/cycle-header.png"
      onBack={handleClose}
    >
      <div className={styles.content}>
        {/* 总时长 */}
        <SettingsSection title="总时长">
          {TOTAL_DURATION_OPTIONS.map((option, index) => (
            <SettingsListItem
              key={option.value}
              icon={<option.Icon size={18} />}
              title={option.label}
              description={option.description}
              animated
              animationIndex={index}
              rightContent={state.totalDays === option.value ? <Check size={18} /> : null}
              showArrow={false}
              onClick={() => setState(s => ({ ...s, totalDays: option.value }))}
            />
          ))}
        </SettingsSection>

        {/* 周期长度 */}
        <SettingsSection title="周期长度">
          {CYCLE_LENGTH_OPTIONS.map((option, index) => (
            <SettingsListItem
              key={option.value}
              title={option.label}
              description={option.description}
              animated
              animationIndex={index + 4}
              rightContent={state.cycleDays === option.value ? <Check size={18} /> : null}
              showArrow={false}
              onClick={() => setState(s => ({ ...s, cycleDays: option.value }))}
            />
          ))}
        </SettingsSection>

        {/* 周期预览 */}
        <CyclePreview
          totalDays={state.totalDays}
          cycleDays={state.cycleDays}
        />

        {/* 起始时间 */}
        <SettingsSection title="起始时间">
          <DatePicker
            value={state.startDate}
            onChange={(date) => setState(s => ({ ...s, startDate: date }))}
          />
        </SettingsSection>
      </div>

      <BottomFixedButton onClick={onNext}>
        下一步
      </BottomFixedButton>
    </SubPageLayout>
  );
}
```

### 3. TypeSelectPage

使用大卡片样式展示任务类型：

```tsx
function TypeSelectPage({ state, setState, onNext, onBack }) {
  return (
    <SubPageLayout
      title="任务类型"
      description="选择最适合你目标的任务模板"
      headerImage="/images/type-header.png"
      onBack={onBack}
    >
      <div className={styles.content}>
        <SettingsSection title="选择类型">
          {TASK_TYPE_OPTIONS.map((option, index) => (
            <TaskTypeCard
              key={option.type}
              icon={option.Icon}
              title={option.label}
              description={option.description}
              examples={option.examples}
              feature={option.feature}
              selected={state.selectedType === option.type}
              animated
              animationIndex={index}
              onClick={() => setState(s => ({ ...s, selectedType: option.type }))}
            />
          ))}
        </SettingsSection>
      </div>

      <BottomFixedButton
        onClick={onNext}
        disabled={!state.selectedType}
      >
        下一步
      </BottomFixedButton>
    </SubPageLayout>
  );
}
```

### 4. ConfigPage

根据选中的任务类型动态渲染配置表单：

```tsx
function ConfigPage({ state, setState, onSubmit, onBack }) {
  const renderConfig = () => {
    switch (state.selectedType) {
      case 'NUMERIC':
        return <NumericConfigForm state={state} setState={setState} />;
      case 'CHECKLIST':
        return <ChecklistConfigForm state={state} setState={setState} />;
      case 'CHECK_IN':
        return <CheckInConfigForm state={state} setState={setState} />;
    }
  };

  return (
    <SubPageLayout
      title="任务配置"
      description="完善任务的详细信息"
      headerImage="/images/config-header.png"
      onBack={onBack}
    >
      <div className={styles.content}>
        {/* 任务标题 - 通用 */}
        <SettingsSection title="任务名称">
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="给任务起个名字"
              value={state.taskTitle}
              onChange={(e) => setState(s => ({ ...s, taskTitle: e.target.value }))}
              className={styles.input}
            />
          </div>
        </SettingsSection>

        {/* 类型专属配置 */}
        {renderConfig()}
      </div>

      <BottomFixedButton onClick={onSubmit}>
        创建任务
      </BottomFixedButton>
    </SubPageLayout>
  );
}
```

## 样式规范

### 颜色

```css
/* 继承设置页面配色 */
--bg-page: #f7f7f5;
--bg-card: #ffffff;
--text-primary: rgb(55, 53, 47);
--text-secondary: rgba(55, 53, 47, 0.65);
--text-muted: rgba(55, 53, 47, 0.5);
--border-color: rgba(55, 53, 47, 0.09);
```

### 间距

```css
/* 继承设置页面间距 */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
```

### 圆角

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
```

## 动画

### 页面切换

复用设置页面的 `slideInFromRight` 和 `slideOutToRight` 动画。

### 翻书动画

复用设置页面的 `flipIn` 动画：

```css
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

## 状态管理

使用统一的 state 对象在页面间传递，避免 props drilling：

```tsx
// 状态提升到顶层
const [modalState, setModalState] = useState<CreateTaskModalState>(initialState);

// 通过 props 传递给子页面
<CycleSettingsPage state={modalState} setState={setModalState} />
```

## 依赖关系

```
CreateTaskModal
├── usePageStack (from settings/hooks)
├── useSwipeBack (from settings/hooks)
├── SubPageLayout (from settings/components)
├── SettingsSection (from settings/components)
├── SettingsListItem (from settings/components)
├── BottomFixedButton (from settings/components)
└── 共享样式 (from settings/animations)
```

## 迁移策略

1. **并行开发**：新版本在 `pages/` 目录开发，不影响现有 `steps/` 目录
2. **渐进替换**：先完成基础架构，再逐页迁移
3. **最后清理**：所有页面迁移完成后，删除 `steps/` 目录
