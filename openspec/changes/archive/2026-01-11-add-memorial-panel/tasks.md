# Tasks: 添加纪念日面板

## 任务列表

### 阶段 1: 基础架构 (Day 1)

- [x] **T1.1** 创建类型定义文件 `types.ts`
  - 定义 `Memorial` 接口
  - 定义 `MemorialBackground` 接口
  - 定义日期格式枚举
  - **验证**: TypeScript 编译通过 ✅

- [x] **T1.2** 创建存储工具 `storage.ts`
  - 实现 `loadMemorials()` 函数
  - 实现 `saveMemorials()` 函数
  - 实现 `loadDateFormat()` 函数
  - 实现 `saveDateFormat()` 函数
  - **验证**: 手动测试存储读写 ✅

- [x] **T1.3** 创建日期计算工具 `utils/dateCalculator.ts`
  - 实现 `calculateDays()` 函数（计算天数差）
  - 实现 `formatDays()` 函数（格式化天数显示）
  - 实现 `isToday()` 函数
  - 实现 `isPast()` 函数
  - **验证**: 编译通过 ✅

### 阶段 2: 常量配置 (Day 1)

- [x] **T2.1** 创建图标配置 `constants/icons.ts`
  - 定义预设图标列表（lucide-react 图标名称）
  - 定义蜡笔风格颜色配置
  - **验证**: 图标可正常渲染 ✅

- [x] **T2.2** 创建背景配置 `constants/backgrounds.ts`
  - 定义预设纯色背景列表
  - 定义预设渐变背景列表
  - **验证**: 背景样式正确显示 ✅

### 阶段 3: 核心 Hooks (Day 2)

- [x] **T3.1** 创建 `hooks/useMemorials.ts`
  - 实现纪念日列表状态管理
  - 实现 `addMemorial()` 函数
  - 实现 `updateMemorial()` 函数
  - 实现 `deleteMemorial()` 函数
  - 实现 `togglePin()` 函数
  - 实现排序逻辑（置顶优先，创建时间倒序）
  - **验证**: CRUD 操作正常工作 ✅

- [x] **T3.2** 创建 `hooks/useDateFormat.ts`
  - 实现日期格式状态管理
  - 实现格式切换逻辑（循环切换）
  - 实现偏好持久化
  - **验证**: 格式切换正常，刷新后保持偏好 ✅

### 阶段 4: 基础组件 (Day 2-3)

- [x] **T4.1** 创建 `components/MemorialCard/`
  - 实现单列卡片布局
  - 显示图标（蜡笔彩色风格）
  - 显示名称
  - 显示天数（正计时/倒计时/今天）
  - 支持点击事件
  - **验证**: 卡片样式符合设计规范 ✅

- [x] **T4.2** 创建 `components/IconPicker/`
  - 实现图标网格展示
  - 实现图标选择交互
  - 实现颜色选择
  - **验证**: 图标选择器正常工作 ✅

- [x] **T4.3** 创建 `components/BackgroundPicker/`
  - 实现纯色选择
  - 实现渐变选择
  - 实现图片上传（base64 存储）
  - **验证**: 背景选择器正常工作 ✅

### 阶段 5: 创建/编辑弹窗 (Day 3)

- [x] **T5.1** 创建 `components/CreateMemorialModal/`
  - 实现表单布局
  - 集成日期选择器
  - 集成图标选择器
  - 集成背景选择器
  - 实现表单验证
  - 支持创建和编辑模式
  - **验证**: 创建和编辑流程正常 ✅

### 阶段 6: 详情弹窗 (Day 4)

- [x] **T6.1** 创建 `components/MemorialDetail/`
  - 实现全屏弹窗布局
  - 显示自定义背景
  - 显示大字体天数（可点击切换格式）
  - 显示名称、日期、备注
  - 实现编辑按钮
  - 实现删除按钮（带确认）
  - 实现置顶/取消置顶按钮
  - **验证**: 详情页功能完整 ✅

### 阶段 7: 面板集成 (Day 4)

- [x] **T7.1** 创建面板入口 `index.tsx`
  - 实现与"常规"Tab 一致的布局
  - 集成装饰图区域
  - 集成纪念日列表
  - 实现空状态（示例卡片）
  - 集成创建弹窗
  - 集成详情弹窗
  - **验证**: 面板整体功能正常 ✅

- [x] **T7.2** 修改 `src/pages/dc/index.tsx`
  - 导入 MemorialPanel 组件
  - 替换 `renderUnderConstruction()` 为 MemorialPanel
  - **验证**: Tab 切换正常，纪念日面板显示 ✅

### 阶段 8: 优化与测试 (Day 5)

- [x] **T8.1** 样式优化
  - 确保与 DC 模块设计规范一致
  - 响应式适配
  - 动画过渡效果
  - **验证**: 视觉效果符合预期 ✅

- [x] **T8.2** 边界情况测试
  - 测试今天日期显示
  - 测试空状态
  - 测试大量数据性能
  - 测试数据持久化
  - **验证**: 编译成功，所有边界情况处理正确 ✅

## 依赖关系

```
T1.1 ─┬─> T1.2 ─> T3.1
      │
      └─> T1.3 ─> T3.2
      
T2.1 ─> T4.2 ─┐
              ├─> T5.1 ─> T7.1 ─> T7.2
T2.2 ─> T4.3 ─┘
              
T4.1 ─> T6.1 ─> T7.1
```

## 完成状态

✅ **所有任务已完成** - 2026/1/11

### 创建的文件列表

```
src/pages/dc/panels/memorial/
├── index.tsx                    # 面板入口
├── types.ts                     # 类型定义
├── storage.ts                   # 存储工具
├── styles.module.css            # 面板样式
├── components/
│   ├── index.ts                 # 统一导出
│   ├── MemorialCard/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── MemorialDetail/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── CreateMemorialModal/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── IconPicker/
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── BackgroundPicker/
│       ├── index.tsx
│       └── styles.module.css
├── hooks/
│   ├── index.ts
│   ├── useMemorials.ts
│   └── useDateFormat.ts
├── utils/
│   ├── index.ts
│   └── dateCalculator.ts
└── constants/
    ├── index.ts
    ├── icons.ts
    └── backgrounds.ts
```

### 修改的文件

- `src/pages/dc/index.tsx` - 导入并集成 MemorialPanel
