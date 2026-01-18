# Tasks: 趣味视觉进度组件 - 鸭子剪影

## Phase 1: 基础组件实现

### Task 1: 创建 DuckSilhouette SVG 组件
- [ ] 绘制鸭子 SVG 路径（使用 Figma/Illustrator）
- [ ] 创建 `src/pages/dc/components/DuckWaterProgress/DuckSilhouette.tsx`
- [ ] 定义 `clipPath` 用于水波裁剪
- [ ] 添加响应式尺寸支持（small/medium/large）
- [ ] 验证在不同屏幕尺寸下的显示效果

**AC（验收标准）：**
- 鸭子剪影清晰可辨，符合浅系简约风格
- SVG 路径优化，文件大小 < 2KB
- 在 200px、240px、280px 容器中显示正常

---

### Task 2: 实现 WaterWave 水波动画组件
- [ ] 创建 `src/pages/dc/components/DuckWaterProgress/WaterWave.tsx`
- [ ] 使用 framer-motion 实现波浪晃动动画
- [ ] 设置固定颜色 `#A8D8EA`（奶油蓝）
- [ ] 优化动画性能（GPU 加速、will-change）
- [ ] 测试动画流畅度（60fps）

**AC：**
- 水波动画自然流畅，无卡顿
- 波浪循环动画持续时间 3s
- 使用 Chrome DevTools Performance 验证 >= 60fps

---

### Task 3: 实现 DuckWaterProgress 主组件
- [ ] 创建 `src/pages/dc/components/DuckWaterProgress/index.tsx`
- [ ] 集成 DuckSilhouette 和 WaterWave
- [ ] 实现水位上升动画（300ms ease-out）
- [ ] 添加进度数值显示（当前值/目标值 单位）
- [ ] 添加差值显示（还差 XXX）
- [ ] 创建 `styles.module.css` 样式文件

**AC：**
- 水位高度准确反映进度百分比（0-100%）
- 进度变化时水位平滑上升
- 进度数值和差值计算正确

---

### Task 4: 添加完成庆祝动画
- [ ] 在 DuckWaterProgress 中集成 canvas-confetti
- [ ] 当进度达到 100% 时触发撒花效果
- [ ] 配置 confetti 参数（粒子数、扩散范围、起点）
- [ ] 防止重复触发（添加状态标记）

**AC：**
- 进度首次达到 100% 时自动触发撒花
- 撒花效果自然且不影响性能
- 不会在同一次打开详情页内重复触发

---

## Phase 2: 集成到详情页

### Task 5: 扩展 Task 类型定义
- [ ] 修改 `src/pages/dc/types.ts`
- [ ] 在 `CheckInConfig` 中添加 `quickActions` 字段
- [ ] 定义 `QuickAction` 类型
- [ ] 更新 TypeScript 类型文档

```typescript
interface QuickAction {
  label: string;
  value?: number;
  action?: 'fillToTarget' | 'openModal';
}

interface CheckInConfig {
  // ... 现有字段
  quickActions?: QuickAction[];
}
```

**AC：**
- 类型定义完整且无 TS 错误
- 现有代码不受影响（可选字段）

---

### Task 6: 实现图标映射逻辑
- [ ] 在 `src/pages/dc/panels/detail/index.tsx` 中添加 `selectProgressComponent` 函数
- [ ] 建立 category → 组件 映射表
- [ ] 处理默认情况（未匹配时使用 CoffeeCupProgress）
- [ ] 添加单元测试验证映射逻辑

**AC：**
- `category: 'water'` 渲染 DuckWaterProgress
- 其他 category 渲染 CoffeeCupProgress
- 未定义 category 时渲染 CoffeeCupProgress

---

### Task 7: 创建 QuickActionButtons 组件
- [ ] 创建 `src/pages/dc/components/QuickActionButtons/index.tsx`
- [ ] 实现按钮网格布局（2 列 3 行）
- [ ] 处理按钮点击事件（累加、一键填满、手动输入）
- [ ] 添加禁用状态样式
- [ ] 创建样式文件

**AC：**
- 按钮根据 `quickActions` 配置动态渲染
- 点击数值按钮触发累加操作
- 点击"一键填满"设置为目标值
- 点击"手动输入"打开弹窗

---

### Task 8: 集成 QuickActionButtons 到详情页
- [ ] 在 `src/pages/dc/panels/detail/index.tsx` 中添加 `<QuickActionButtons />`
- [ ] 实现 `handleQuickAction` 回调
- [ ] 处理"一键填满"逻辑（读取 cycleTargetValue）
- [ ] 处理"手动输入"逻辑（打开现有 CheckInModal）
- [ ] 添加 loading 状态

**AC：**
- 快捷按钮正确显示在进度组件下方
- 点击按钮后正确调用 `taskCheckIn`
- 操作成功后触发水位上升动画
- 操作失败时显示错误 Toast

---

### Task 9: 改造底部二级入口为简约按钮
- [ ] 修改 `src/pages/dc/panels/detail/components/SecondaryNav` 样式
- [ ] 参考 `SidelineTaskGrid` 的按钮样式（background: none, border: none）
- [ ] 使用 framer-motion 添加 hover 和 tap 交互
- [ ] 横向居中布局，间距 20px
- [ ] 移除原有的卡片背景和边框

**AC：**
- 按钮为简约的文字按钮，颜色 #9b9b9b
- hover 时颜色变深为 #666
- 点击时有 scale(0.95) 动画
- 点击后正常打开对应的子页面

---

## Phase 3: 数据配置与测试

### Task 10: 创建任务时添加默认 quickActions
- [ ] 修改 `src/pages/dc/contexts/TaskProvider/index.tsx` 中的 `createTask` 函数
- [ ] 为 `category: 'water'` 任务添加默认快捷按钮配置
- [ ] 确保配置可序列化（保存到 localStorage）

**AC：**
- 新建 category='water' 任务时自动添加 6 个快捷按钮
- 配置正确保存到 localStorage
- 任务详情页正确读取并显示按钮

---

### Task 11: 单元测试
- [ ] 编写 DuckWaterProgress 单元测试
- [ ] 编写 QuickActionButtons 单元测试
- [ ] 编写 selectProgressComponent 单元测试
- [ ] 测试边界情况（进度 0%、100%、超过 100%）

**AC：**
- 所有测试用例通过
- 代码覆盖率 >= 80%

---

### Task 12: 集成测试
- [ ] 创建测试任务（category='water'）
- [ ] 验证鸭子剪影正确显示
- [ ] 验证快捷按钮正确工作
- [ ] 验证水位动画流畅
- [ ] 验证完成时撒花效果
- [ ] 验证在不同设备上的显示效果（iOS/Android/PC）

**AC：**
- 所有交互流程正常工作
- 无性能问题（60fps）
- 无视觉错位或样式问题

---

### Task 13: 性能优化
- [ ] 使用 Chrome DevTools 分析动画性能
- [ ] 优化 SVG 路径（减少节点数）
- [ ] 添加 `will-change` CSS 属性
- [ ] 使用 `transform: translateZ(0)` 启用 GPU 加速
- [ ] 限制 confetti 触发频率（防抖）

**AC：**
- 动画帧率稳定在 60fps
- 组件加载时间 < 100ms
- 内存占用无异常增长

---

### Task 14: 文档和代码审查
- [ ] 为新组件添加 JSDoc 注释
- [ ] 更新 `src/pages/dc/components/index.ts` 导出
- [ ] 添加 Storybook 故事（可选）
- [ ] 进行代码审查

**AC：**
- 所有公开 API 有清晰注释
- 代码符合项目规范（ESLint 通过）
- 通过代码审查

---

## 依赖关系

```
Task 1 (SVG) → Task 3 (主组件)
Task 2 (动画) → Task 3 (主组件)
Task 3 → Task 4 (庆祝动画)
Task 5 (类型) → Task 7 (按钮组件)
Task 3 + Task 4 → Task 6 (集成)
Task 7 → Task 8 (集成)
Task 6 + Task 8 + Task 9 → Task 12 (测试)
```

## 可并行任务

- Task 1 和 Task 2 可并行
- Task 5 和 Task 1-4 可并行
- Task 11 可与 Task 10 并行

## 验证清单

完成所有任务后，进行以下最终验证：

- [ ] 新建 category='water' 的打卡任务
- [ ] 鸭子剪影正确显示，灰色背景，奶油蓝水波
- [ ] 点击"50ml"按钮，水位上升动画流畅
- [ ] 进度数值更新正确（455 / 2000 ml，还差 1545 ml）
- [ ] 连续点击多个按钮，水位持续上升
- [ ] 点击"一键填满"，水位跳到 100%，触发撒花
- [ ] 点击"手动输入"，弹出输入弹窗
- [ ] 当日记录按钮显示渐变色进度条
- [ ] 在 iPhone SE、iPhone 14、iPad 上测试显示正常
- [ ] 无控制台报错
- [ ] 性能监控无警告
