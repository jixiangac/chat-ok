# Tasks: 统一归档页面与灵玉界面风格

## Phase 1: 归档页面重构

### Task 1.1: 创建归档子页面组件
- [ ] 在 `src/pages/dc/panels/settings/pages/` 下创建 `ArchivePage/` 目录
- [ ] 创建 `ArchivePage/index.tsx`，使用 SubPageLayout 布局
- [ ] 创建 `ArchivePage/styles.module.css`，包含 Tab 筛选样式
- [ ] 迁移现有归档页面的任务列表和筛选逻辑
- [ ] 将筛选栏改为标签管理风格的 Tab 切换

### Task 1.2: 在设置面板添加归档入口
- [ ] 修改 `SettingsMainPage/index.tsx`，在开发者分组添加"归档任务"列表项
- [ ] 修改 `UnifiedSettingsPanel/index.tsx`，添加 `archive` 路由映射
- [ ] 修改 `pages/index.ts`，导出 ArchivePage

### Task 1.3: 移除主页面归档入口
- [ ] 修改 `src/pages/dc/index.tsx`，移除顶部 Archive 图标按钮
- [ ] 移除 `openArchive`、`closeArchive` 相关逻辑
- [ ] 移除 `showArchive` 状态的全屏弹窗渲染

### Task 1.4: 清理废弃代码
- [ ] 检查 UIProvider 中是否可移除 `showArchive` 状态
- [ ] 检查并清理原归档页面相关的未使用代码

---

## Phase 2: 灵玉界面重构

### Task 2.1: 创建灵玉全屏页面组件
- [ ] 在 `src/pages/dc/viewmodel/` 下创建 `SpiritJadePage/` 目录
- [ ] 创建 `SpiritJadePage/index.tsx`，包含：
  - 使用 SubPageLayout 布局
  - 余额概览区域
  - 变动记录列表
  - 右滑进入动画
  - 手势返回支持
- [ ] 创建 `SpiritJadePage/styles.module.css`

### Task 2.2: 替换灵玉入口逻辑
- [ ] 修改 `src/pages/dc/index.tsx`：
  - 保持灵玉图标点击入口
  - 替换 SpiritJadeHistoryPopup 为 SpiritJadePage
- [ ] 确保动画与设置面板一致

### Task 2.3: 清理废弃组件
- [ ] 删除 `src/pages/dc/components/SpiritJadeHistoryPopup/` 目录
- [ ] 修改 `src/pages/dc/components/index.ts`，移除 SpiritJadeHistoryPopup 导出

---

## Phase 3: 验证与完善

### Task 3.1: 功能验证
- [ ] 验证归档入口从设置面板可正常访问
- [ ] 验证归档页面筛选功能正常
- [ ] 验证归档任务点击可打开任务详情
- [ ] 验证灵玉页面余额和记录显示正确
- [ ] 验证手势返回正常工作

### Task 3.2: 动画验证
- [ ] 验证归档页面进入/退出动画流畅
- [ ] 验证灵玉页面进入/退出动画流畅
- [ ] 验证与设置子页面动画风格一致

### Task 3.3: 样式微调
- [ ] 确认头图选择合适
- [ ] 确认 Tab 筛选样式与标签管理一致
- [ ] 确认整体视觉风格统一

---

## Dependencies

- Task 1.2 依赖 Task 1.1 完成
- Task 1.3 依赖 Task 1.2 完成
- Task 2.2 依赖 Task 2.1 完成
- Phase 3 依赖 Phase 1 和 Phase 2 完成

## Parallelizable Work

- Phase 1 和 Phase 2 可并行进行
- Task 1.1 和 Task 2.1 可并行进行
