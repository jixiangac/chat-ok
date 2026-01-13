# Change: 支线任务系统增强

## Why

当前支线任务系统存在以下问题：
1. GroupModeGrid 分组视图缺少任务完成进度的直观展示
2. 标签系统功能单一，只支持普通标签，无法满足按地点、心情等维度分类的需求
3. 缺少按地点筛选任务的能力，用户无法快速找到特定场景下可执行的任务
4. 缺少一日视图，用户无法直观地规划和查看当天的任务安排

## What Changes

### 1. GroupModeGrid 优化
- 在每个分组卡片的图标行最右侧显示任务完成数量（如 "2/5"）
- "完成"定义：当日完成100%的任务（打卡型完成今日目标次数/时长/数值）

### 2. 标签体系重构
- **BREAKING**: 完全替换现有标签系统
- 新增三类标签：普通标签、地点标签、心情标签
- 在设置页面新增"标签设置"入口，用于管理三类标签
- 使用 Tab + 图标 + 奶油风颜色（复用现有 colors.ts 配色）
- 标签由用户自行创建，存储到本地 localStorage
- 删除标签时提示用户确认，确认后移除所有任务关联

### 3. 任务编辑支持多类型标签
- 任务编辑弹窗支持选择普通标签、地点标签、心情标签三种类型
- 每个任务可以同时拥有不同类型的标签（每类最多一个）

### 4. SidelineTaskSection 地点筛选
- 在切换视图按钮左边新增地点筛选按钮（图标+文字）
- 筛选选项：全部 + 支线任务中已使用的地点标签列表
- 仅在列表模式（非 GroupModeGrid）下生效
- 筛选出带有对应地点标签的任务

### 5. 一日视图
- 点击"今日完成率"触发 Popup 弹窗
- 布局：标题"一日清单 / TODAY'S LIST" → 日期信息+今日标语+标签筛选 → 上午/下午/晚上三个时段
- 任务按原有顺序平均分配到三个时段，自动生成示意时间（整点）
- 完成的任务显示删除线，未完成的正常显示
- 点击任务打开详情页

## Impact

### Affected Specs
- `tag-system` - 新增标签体系规范
- `sideline-task` - 修改支线任务相关功能
- `daily-view` - 新增一日视图规范

### Affected Code
- `src/pages/dc/types.ts` - 新增标签类型定义
- `src/pages/dc/utils/tagStorage.ts` - 重构标签存储逻辑
- `src/pages/dc/components/GroupModeGrid/` - 添加完成数量显示
- `src/pages/dc/components/GroupCard/` - 添加完成数量显示
- `src/pages/dc/components/SidelineTaskSection/` - 添加地点筛选
- `src/pages/dc/components/SidelineTaskEditModal/` - 支持多类型标签
- `src/pages/dc/components/TagSelector/` - 重构为多类型标签选择器
- `src/pages/dc/components/TodayProgress/` - 添加一日视图触发
- `src/pages/dc/components/DailyViewPopup/` - 新增一日视图弹窗组件
- `src/pages/dc/panels/settings/` - 新增标签设置页面

### Migration
- 现有标签数据将被迁移为"普通标签"类型
- 任务的 `tagId` 字段将扩展为 `tags` 对象，包含 `normalTagId`、`locationTagId`、`moodTagId`
