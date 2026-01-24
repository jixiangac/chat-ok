## 1. 通用聊天 - 任务卡片自动打开创建界面 X

- [x] 1.1 更新 general 角色的 System Prompt，明确 AI 行为约束（仅用户明确要求时才输出 TASK_CONFIG）
- [x] 1.2 在 AgentChat 组件中为 general 角色添加 onStructuredOutput 回调支持
- [x] 1.3 在 DCPage 主页面添加状态管理，监听 general 角色的 TASK_CONFIG 输出
- [x] 1.4 实现自动打开 CreateTaskModal 并预填配置的逻辑
- [x] 1.5 测试：用户明确要求创建任务 → AI 输出配置 → 点击确认 → 自动打开创建弹窗
- [x] 1.6 测试：用户闲聊/询问时 AI 不应主动推荐任务配置

## 2. 清单类详情页重构 

- [x] 2.1 修改 detail/index.tsx 中 renderProgressVisual，CHECKLIST 类型返回 null（不显示水杯）
- [x] 2.2 重构 ChecklistCyclePanel 组件，移除​「进行中」「下周期预计」区块，保留当前周期清单
- [x] 2.3 使用 antd-mobile SwipeAction 包裹清单项，实现右滑显示「移到下周期」按钮
- [x] 2.4 创建 ChecklistConfirmDialog 组件（支线风格二次确认弹窗）- 使用 antd-mobile Dialog.confirm
- [x] 2.5 实现「移到下周期」二次确认流程（显示灵玉消耗 2）
- [x] 2.6 实现清单项延后逻辑：扣除灵玉 + 修改 cycle 字段 + 刷新列表
- [x] 2.7 在清单列表末尾添加「+ 加入更多清单...」入口
- [x] 2.8 创建 AddChecklistPopup 组件，展示非当前周期、未完成的清单项 - 使用 antd-mobile Popup
- [x] 2.9 实现「加入当前周期」二次确认流程（显示灵玉消耗 1）
- [x] 2.10 实现加入逻辑：扣除灵玉 + 修改 cycle 字段 + 刷新列表
- [x] 2.11 测试：清单打勾、右滑延后、加入更多、灵玉不足提示

## 3. 归档历史功能增强 X

- [x] 3.1 修改 ArchivePage 点击任务后调用 setSelectedTaskId 打开详情 - 使用本地状态 + GoalDetailModal
- [x] 3.2 在 GoalDetailModal 中添加 isReadOnly 属性支持
- [x] 3.3 只读模式下隐藏：打卡按钮、编辑按钮、更多菜单中的操作项
- [x] 3.4 只读模式下保留：周期计划入口、历史记录入口、所有数据展示
- [x] 3.5 测试：归档任务点击 → 打开只读详情页 → 可查看历史和计划

## 4. 纪念日新增界面优化

- [x] 4.1 创建 CreateMemorialModal 组件，采用步骤式页面栈设计
- [x] 4.2 实现第 1 步页面：名称输入 + 日期选择
- [x] 4.3 实现第 2 步页面：图片背景选择（纯色/渐变/上传图片）
- [x] 4.4 实现第 3 步页面：预览面板（展示纪念日卡片预览效果）
- [x] 4.5 集成灵玉消耗逻辑（固定 50 灵玉）
- [x] 4.6 添加灵玉不足提示弹窗
- [x] 4.7 替换原有的纪念日创建入口
- [x] 4.8 测试：完整创建流程、灵玉扣减、不足提示

## 5. 主线任务转支线任务

- [x] 5.1 在 DetailHeader 更多菜单中添加「转为支线」选项（仅主线任务显示）
- [x] 5.2 创建 ConvertToSidelinePopup 确认弹窗（支线区域风格）- 使用 antd-mobile Dialog.confirm
- [x] 5.3 实现主线转支线逻辑：仅修改 type 为 sidelineA，保留所有数据
- [x] 5.4 集成灵玉消耗逻辑（固定 50 灵玉）
- [x] 5.5 添加灵玉不足提示
- [x] 5.6 在 TaskContext 中添加 convertToSideline 方法 - 直接使用 updateTask
- [x] 5.7 测试：主线任务转支线、灵玉扣减、数据完整性

## 6. 打卡奖励上限 BUG 修复

- [x] 6.1 分析当前奖励发放逻辑，定位上限检查缺失的位置
- [x] 6.2 在 spiritJadeCalculator 中添加每日奖励累计追踪 - 创建 dailyRewardTracker.ts
- [x] 6.3 修改奖励发放逻辑：达到上限后返回 0 但允许打卡继续
- [x] 6.4 添加 Toast 提示用户「今日奖励已达上限，继续打卡不再获得奖励」
- [x] 6.5 测试：连续打卡直到超限 → 确认不再发放 → 确认可继续打卡

## 7. 灵玉明细页面手势返回 BUG 修复

- [x] 7.1 移除 SpiritJadePage 中自实现的手势逻辑（handleTouchStart/Move/End）
- [x] 7.2 引入并使用 useSwipeBack hook
- [x] 7.3 调整页面容器绑定 pageRef
- [x] 7.4 测试：确认手势滑动效果与设置子页面一致

## 8. 验证与收尾

- [x] 8.1 集成测试：所有功能协同工作
- [x] 8.2 UI 一致性检查：确保新增组件符合设计规范
- [x] 8.3 性能检查：确保无明显卡顿
