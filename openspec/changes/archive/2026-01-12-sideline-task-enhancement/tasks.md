# Tasks: 支线任务视图增强

## 阶段一：基础设施 (优先级: 高) ✅

### 1.1 类型定义扩展
- [x] 在 `types.ts` 中添加 `TaskTag` 接口
- [x] 在 `Task` 接口中添加 `tagId` 字段
- [x] 添加 `TodayMustComplete` 状态类型
- [x] 添加 `ViewMode` 类型 ('default' | 'group')

### 1.2 存储工具函数
- [x] 创建 `src/pages/dc/utils/tagStorage.ts` - 标签存储工具
- [x] 创建 `src/pages/dc/utils/todayMustCompleteStorage.ts` - 今日必须完成状态存储

## 阶段二：滚动条优化 (优先级: 高) ✅

### 2.1 结构修改
- [x] 修改 `src/pages/dc/index.tsx`，添加 `.tabContent` 包装层包裹 `{renderTabContent()}`

### 2.2 CSS 样式修改
- [x] 修改 `DCPage.module.css` 中的 `.content` 样式，设置 `overflow: hidden` 和 `display: flex`
- [x] 添加 `.tabContent` 样式，设置为唯一的滚动容器 (`overflow-y: auto`)
- [x] 修改 `.contentWithBottomBar` 样式，将 `padding-bottom` 移到 `.tabContent` 上

### 2.3 面板样式检查
- [x] 检查 `src/pages/dc/panels/normal/styles.module.css`，移除可能的 overflow 设置
- [x] 检查 `src/pages/dc/panels/happy/index.tsx`，移除可能的 overflow 设置
- [x] 检查 `src/pages/dc/panels/memorial/styles.module.css`，移除可能的 overflow 设置

## 阶段三：今日必须完成功能 (优先级: 高) ✅

### 3.1 弹窗组件开发
- [x] 创建 `src/pages/dc/components/TodayMustCompleteModal/index.tsx`
- [x] 创建 `src/pages/dc/components/TodayMustCompleteModal/styles.module.css`
- [x] 实现顶部卡片图片展示
- [x] 实现两行横向滚动的任务选择列表
- [x] 实现已选择任务的展示和删除功能
- [x] 实现最多选择3个任务的限制

### 3.2 触发逻辑
- [x] 创建 `src/pages/dc/hooks/useTodayMustComplete.ts`
- [x] 实现8点后首次打开检测逻辑
- [x] 实现跳过后当天不再提醒的逻辑
- [x] 实现跨天自动重置逻辑

### 3.3 置顶显示
- [x] 修改 `useTaskSort.ts`，添加今日必须完成任务的置顶排序
- [x] 在 `SidelineTaskCard` 中添加今日必须完成的视觉标识

### 3.4 设置面板入口
- [x] 在设置面板中添加"设置今日必须完成任务"入口
- [x] 入口仅在当天未设置过时显示
- [x] 点击后打开 TodayMustCompleteModal 弹窗

### 3.5 集成
- [x] 在 `NormalPanel` 中集成弹窗触发逻辑
- [x] 在 `index.tsx` 中添加弹窗组件

## 阶段四：标签功能 (优先级: 中) ✅

### 4.1 标签选择器组件
- [x] 创建 `src/pages/dc/components/TagSelector/index.tsx`
- [x] 创建 `src/pages/dc/components/TagSelector/styles.module.css`
- [x] 实现已有标签列表展示
- [x] 实现新建标签功能
- [x] 实现标签颜色自动分配

### 4.2 标签颜色系统
- [x] 在 `utils/tagStorage.ts` 中添加标签颜色配置
- [x] 实现颜色自动分配算法

### 4.3 标签数据管理
- [x] 在 `utils/tagStorage.ts` 中实现标签的 CRUD 操作

## 阶段五：支线任务编辑功能 (优先级: 中) ✅

### 5.1 编辑弹窗组件
- [x] 创建 `src/pages/dc/components/SidelineTaskEditModal/index.tsx`
- [x] 创建 `src/pages/dc/components/SidelineTaskEditModal/styles.module.css`
- [x] 实现任务名称编辑
- [x] 集成标签选择器

### 5.2 详情页集成
- [x] 在 `GoalHeader` 中实现编辑按钮点击事件
- [x] 在详情页中添加编辑弹窗

### 5.3 数据更新
- [x] 使用 `TaskContext` 中的 `updateTask` 方法
- [x] 实现编辑后的数据持久化

## 阶段六：Group 模式 (优先级: 中) ✅

### 6.1 Group 卡片组件
- [x] 创建 `src/pages/dc/components/GroupCard/index.tsx`
- [x] 创建 `src/pages/dc/components/GroupCard/styles.module.css`
- [x] 实现标签名 + 进度 + 图标的展示
- [x] 实现进度计算逻辑

### 6.2 Group 模式网格
- [x] 创建 `src/pages/dc/components/GroupModeGrid/index.tsx`
- [x] 创建 `src/pages/dc/components/GroupModeGrid/styles.module.css`
- [x] 实现按标签分组的网格布局

### 6.3 Group 详情弹窗
- [x] 创建 `src/pages/dc/components/GroupDetailPopup/index.tsx`
- [x] 实现点击 Group 卡片后的任务列表弹窗
- [x] 复用现有的 SidelineTaskCard 组件

### 6.4 模式切换
- [x] 在 `NormalPanel` 中添加模式切换图标
- [x] 实现模式切换逻辑
- [x] 实现无标签时隐藏切换图标的逻辑
- [ ] 实现删除所有标签后自动切换回默认模式（待后续优化）

### 6.5 状态管理
- [x] 在 `NormalPanel` 中使用 useState 管理视图模式状态
- [ ] 实现模式状态的持久化（待后续优化）

## 阶段七：测试与优化 (优先级: 高)

### 7.1 功能测试
- [ ] 测试滚动条在各种场景下的表现
- [ ] 测试今日必须完成功能的完整流程
- [ ] 测试标签功能的创建、选择、删除
- [ ] 测试 Group 模式的切换和显示
- [ ] 测试编辑功能的数据持久化

### 7.2 边缘情况测试
- [ ] 测试无任务时的空状态
- [ ] 测试任务数量很少时的显示
- [ ] 测试跨天场景
- [ ] 测试数据迁移（旧数据兼容）

### 7.3 性能优化
- [ ] 检查组件重渲染情况
- [ ] 优化大量任务时的渲染性能

## 依赖关系

```
阶段一 (类型定义) ✅
    ↓
阶段二 (滚动条优化) ✅ - 可并行
    ↓
阶段三 (今日必须完成) ✅ ← 依赖阶段一
    ↓
阶段四 (标签功能) ✅ ← 依赖阶段一
    ↓
阶段五 (编辑功能) ✅ ← 依赖阶段四
    ↓
阶段六 (Group 模式) ✅ ← 依赖阶段四、五
    ↓
阶段七 (测试优化) - 待进行
```

## 预估工时

| 阶段 | 预估时间 | 状态 |
|------|----------|------|
| 阶段一：基础设施 | 1小时 | ✅ 完成 |
| 阶段二：滚动条优化 | 0.5小时 | ✅ 完成 |
| 阶段三：今日必须完成 | 3小时 | ✅ 完成 |
| 阶段四：标签功能 | 2小时 | ✅ 完成 |
| 阶段五：编辑功能 | 1.5小时 | ✅ 完成 |
| 阶段六：Group 模式 | 3小时 | ✅ 完成 |
| 阶段七：测试优化 | 2小时 | 待进行 |
| **总计** | **13小时** | |

## 新增文件清单

### 组件
- `src/pages/dc/components/TodayMustCompleteModal/index.tsx`
- `src/pages/dc/components/TodayMustCompleteModal/styles.module.css`
- `src/pages/dc/components/TagSelector/index.tsx`
- `src/pages/dc/components/TagSelector/styles.module.css`
- `src/pages/dc/components/SidelineTaskEditModal/index.tsx`
- `src/pages/dc/components/SidelineTaskEditModal/styles.module.css`
- `src/pages/dc/components/GroupCard/index.tsx`
- `src/pages/dc/components/GroupCard/styles.module.css`
- `src/pages/dc/components/GroupModeGrid/index.tsx`
- `src/pages/dc/components/GroupModeGrid/styles.module.css`
- `src/pages/dc/components/GroupDetailPopup/index.tsx`
- `src/pages/dc/components/GroupDetailPopup/styles.module.css`

### 工具函数
- `src/pages/dc/utils/tagStorage.ts`
- `src/pages/dc/utils/todayMustCompleteStorage.ts`

### Hooks
- `src/pages/dc/hooks/useTodayMustComplete.ts`

## 修改文件清单

- `src/pages/dc/types.ts` - 添加类型定义
- `src/pages/dc/utils/index.ts` - 导出新工具函数
- `src/pages/dc/hooks/index.ts` - 导出新 hook
- `src/pages/dc/hooks/useTaskSort.ts` - 添加今日必须完成排序
- `src/pages/dc/index.tsx` - 滚动条优化结构
- `src/pages/dc/css/DCPage.module.css` - 滚动条样式
- `src/pages/dc/css/SidelineTaskCard.module.css` - 今日必须完成标识样式
- `src/pages/dc/components/card/SidelineTaskCard.tsx` - 今日必须完成标识
- `src/pages/dc/panels/settings/index.tsx` - 设置面板入口
- `src/pages/dc/panels/normal/index.tsx` - 集成所有功能
- `src/pages/dc/panels/normal/styles.module.css` - 视图切换按钮样式
- `src/pages/dc/panels/detail/index.tsx` - 编辑弹窗集成
- `src/pages/dc/panels/detail/types.ts` - 添加 onEdit 回调
- `src/pages/dc/panels/detail/components/GoalHeader/index.tsx` - 编辑按钮事件
