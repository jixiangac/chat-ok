# Tasks: 优化设置界面动画效果

## 1. 基础动画组件开发

- [x] 1.1 创建页面切换动画组件 `PageTransition`
  - 实现从右侧滑入/滑出的 CSS 动画
  - 支持 iOS 风格的卡片堆叠效果（当前页面缩小到 95% 并向左偏移）
  - 动画时长与纪念日界面保持一致（约 400ms）
  - **实现**: 在 `animations/index.css` 中定义动画样式，在 `UnifiedSettingsPanel` 中集成

- [x] 1.2 创建手势支持 Hook `useSwipeBack`
  - 使用原生 touch 事件实现
  - 支持向右滑动手势返回
  - 滑动距离超过阈值（100px）时触发返回
  - 只响应从左边缘（< 50px）开始的滑动
  - **实现**: `hooks/useSwipeBack.ts`

- [x] 1.3 创建列表项翻书动画样式
  - 复用纪念日界面的 `flipIn` 动画（rotateX 从 -90deg 到 0deg）
  - 支持延迟入场（每个 item 延迟 60ms）
  - **实现**: 在 `animations/index.css` 和 `SettingsListItem/styles.module.css` 中定义

## 2. 设置面板入口改造

- [x] 2.1 修改设置面板打开方式
  - 将现有弹窗改为整屏横移效果
  - 不使用遮罩层（全屏覆盖）
  - 返回按钮放在左上角
  - **实现**: 更新 `UnifiedSettingsPanel/styles.module.css`

- [x] 2.2 更新 `UnifiedSettingsPanel` 组件
  - 集成页面切换动画组件
  - 集成手势返回支持
  - **实现**: 更新 `UnifiedSettingsPanel/index.tsx`

## 3. 子页面切换动画

- [x] 3.1 更新 `SubPageLayout` 组件
  - 实现 iOS 卡片堆叠效果
  - 进入子页面时：当前页面缩小到 95% 并向左偏移，新页面从右侧滑入
  - 返回时：反向动画
  - **实现**: 在 `UnifiedSettingsPanel` 中通过页面栈管理实现

- [x] 3.2 更新页面栈管理 Hook `usePageStack`
  - 支持动画状态管理
  - 支持手势返回集成
  - **实现**: 在 `UnifiedSettingsPanel` 中添加 `pageAnimationState` 状态管理

## 4. 设置列表项动画

- [x] 4.1 更新 `SettingsListItem` 组件
  - 添加翻书入场动画
  - 支持动画延迟参数
  - **实现**: 添加 `animated` 和 `animationIndex` 属性

- [x] 4.2 更新 `SettingsSection` 组件
  - 为子项传递动画延迟索引
  - **实现**: 通过 `animationIndex` 属性在父组件中管理

- [x] 4.3 更新 `SettingsMainPage` 组件
  - 应用列表项翻书动画
  - **实现**: 为每个 `SettingsListItem` 添加 `animated` 和 `animationIndex` 属性

## 5. 标签设置页面改造

- [x] 5.1 修改 `TagSettings` 组件
  - 将"添加标签"按钮移至底部固定位置
  - 点击后使用底部弹窗（Popup）显示创建表单
  - 保持现有表单内容和逻辑
  - **实现**: 使用 antd-mobile 的 `Popup` 组件，添加底部固定按钮

- [x] 5.2 更新 `TagSettingsPage` 组件
  - 集成底部固定按钮布局
  - **实现**: 在 `TagSettings` 组件中直接实现

## 6. 主题设置页面改造

- [x] 6.1 修改 `ThemeSettings` 组件
  - 添加底部固定"保存"按钮
  - 修改主题切换逻辑：预览时不立即生效，点击保存后才全局生效
  - 返回时直接放弃未保存的修改
  - **实现**: 添加 `previewTheme` 状态，底部固定保存按钮

- [x] 6.2 更新 `ThemeSettingsPage` 组件
  - 集成底部固定按钮布局
  - **实现**: 在 `ThemeSettings` 组件中直接实现

## 7. 样式和动画优化

- [x] 7.1 创建统一的动画样式文件
  - 定义 `flipIn` 动画关键帧
  - 定义页面切换动画关键帧
  - 定义卡片堆叠动画关键帧
  - **实现**: `animations/index.css`

- [x] 7.2 优化动画性能
  - 使用 `transform` 和 `opacity` 实现动画（GPU 加速）
  - 使用 `will-change` 提示浏览器优化
  - **实现**: 在所有动画样式中使用 `transform`、`opacity` 和 `will-change`

## 8. 测试和验收

- [ ] 8.1 功能测试
  - 验证设置面板整屏横移效果
  - 验证子页面卡片堆叠效果
  - 验证列表项翻书动画
  - 验证手势返回功能

- [ ] 8.2 交互测试
  - 验证标签设置底部新增按钮和弹窗
  - 验证主题设置保存按钮逻辑
  - 验证返回时放弃修改的行为

- [ ] 8.3 兼容性测试
  - 验证不同屏幕尺寸的适配
  - 验证动画流畅度

## 实现文件清单

### 新增文件
- `src/pages/dc/panels/settings/animations/index.css` - 统一动画样式
- `src/pages/dc/panels/settings/hooks/useSwipeBack.ts` - 手势返回 Hook
- `src/pages/dc/panels/settings/components/BottomFixedButton/index.tsx` - 底部固定按钮组件
- `src/pages/dc/panels/settings/components/BottomFixedButton/styles.module.css` - 底部固定按钮样式

### 修改文件
- `src/pages/dc/panels/settings/hooks/index.ts` - 导出 useSwipeBack
- `src/pages/dc/panels/settings/components/index.ts` - 导出 BottomFixedButton
- `src/pages/dc/panels/settings/components/SettingsListItem/index.tsx` - 添加动画支持
- `src/pages/dc/panels/settings/components/SettingsListItem/styles.module.css` - 添加翻书动画
- `src/pages/dc/panels/settings/UnifiedSettingsPanel/index.tsx` - 整屏横移和页面栈动画
- `src/pages/dc/panels/settings/UnifiedSettingsPanel/styles.module.css` - 面板动画样式
- `src/pages/dc/panels/settings/pages/SettingsMainPage/index.tsx` - 列表项动画
- `src/pages/dc/panels/settings/TagSettings/index.tsx` - 底部固定按钮和弹窗
- `src/pages/dc/panels/settings/TagSettings/index.css` - 底部固定按钮样式
- `src/pages/dc/panels/settings/ThemeSettings/index.tsx` - 预览模式和保存按钮
- `src/pages/dc/panels/settings/ThemeSettings/index.css` - 底部固定按钮样式
