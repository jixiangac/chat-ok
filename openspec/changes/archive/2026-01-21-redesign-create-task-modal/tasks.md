# Tasks: 重新设计创建任务弹窗

## 阶段 1：基础架构搭建

- [x] 1.1 创建 `CreateTaskModal/styles.module.css` 主样式文件
- [x] 1.2 创建 `CreateTaskModal/pages/` 目录结构
- [x] 1.3 重构 `index.tsx` 引入 `usePageStack` 和 `useSwipeBack`
- [x] 1.4 实现基础页面栈管理和手势返回

## 阶段 2：周期设置页面（CycleSettingsPage）

- [x] 2.1 创建 `pages/CycleSettingsPage/index.tsx`
- [x] 2.2 创建 `pages/CycleSettingsPage/styles.module.css`
- [x] 2.3 使用 SubPageLayout 包装页面
- [x] 2.4 使用 SettingsSection + SettingsListItem 重构总时长选择
- [x] 2.5 使用 SettingsSection + SettingsListItem 重构周期长度选择
- [x] 2.6 创建 CyclePreview 组件展示周期预览
- [x] 2.7 使用 SettingsListItem 重构起始时间选择

## 阶段 3：类型选择页面（TypeSelectPage）

- [x] 3.1 创建 `pages/TypeSelectPage/index.tsx`
- [x] 3.2 创建 `pages/TypeSelectPage/styles.module.css`
- [x] 3.3 使用 SubPageLayout 包装页面
- [x] 3.4 创建 TaskTypeCard 组件（大卡片样式）
- [x] 3.5 使用 SettingsSection 组织任务类型列表
- [x] 3.6 实现选中状态和翻书动画

## 阶段 4：具体配置页面（ConfigPage）

- [x] 4.1 创建 `pages/ConfigPage/index.tsx`
- [x] 4.2 创建 `pages/ConfigPage/styles.module.css`
- [x] 4.3 使用 SubPageLayout 包装页面
- [x] 4.4 重构数值型任务配置表单
- [x] 4.5 重构清单型任务配置表单
- [x] 4.6 重构打卡型任务配置表单
- [x] 4.7 实现底部固定的创建按钮（复用 BottomFixedButton）

## 阶段 5：整合与优化

- [x] 5.1 整合三个页面到主组件
- [x] 5.2 实现页面间数据传递
- [x] 5.3 保持灵玉扣除逻辑
- [x] 5.4 保持彩纸庆祝动画
- [x] 5.5 删除旧的 steps 目录

## 阶段 6：视觉优化

- [x] 6.1 为每个页面设计专属头图（可选）- 使用默认头图
- [x] 6.2 优化翻书动画的交错效果
- [x] 6.3 调整间距和字体以匹配设置页面风格
- [x] 6.4 确保无障碍支持（prefers-reduced-motion）

## 阶段 7：测试与验收

- [x] 7.1 测试全流程创建主线任务 - 构建通过
- [x] 7.2 测试全流程创建支线任务 - 构建通过
- [x] 7.3 测试手势滑动返回各步骤 - 已实现
- [x] 7.4 测试灵玉余额不足场景 - 逻辑保持
- [x] 7.5 测试各种任务类型配置 - 已实现
- [x] 7.6 测试自定义天数和周期输入 - 已实现
- [x] 7.7 在不同屏幕尺寸上验证布局 - 响应式样式已添加
