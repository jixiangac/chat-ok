# Change: 增强追问组件支持多问题队列 & 优化配置助手设定

## Why

当前 FollowupQuestion 组件仅支持展示单个问题，无法满足 AI 需要连续采集多个用户意图的场景。同时，配置助手的回复存在冗余废话、不够精准的问题，需要优化 prompt 设定，让助手更智能地帮助用户完成任务配置。

## What Changes

### UI 组件增强
- 支持多问题队列，垂直列表滚动展示所有问题
- 点击选项后自动平滑滚动到下一题
- 顶部右上角显示进度指示 “1 / N”
- 选项前增加序号标识（A/B/C/D）
- 已答题目保留全部选项显示，选中项背景高亮
- 所有问题答完后统一提交（底部固定确认按钮，答完才可用）
- 提交前可点击已答卡片修改选择，提交后不可改
- 单题情况保持现有简化样式
- 固定最大高度，超出内部滚动
- 移除自定义输入功能

### 配置助手 Prompt 优化
- 精准拆解任务核心属性，不说废话，直出配置结果
- 增加 few-shot 案例，覆盖不同任务类型场景（数值型、清单型、打卡型）
- 单位智能选择：减肥用“斤”、距离用“公里”等贴合场景
- 模糊需求先澄清再推荐：遇到无法直接拆解的目标（如“摄影”），先追问用户具体想达成什么
- **有人情味的鼓励者**：在关键节点给予用户情绪价值，让用户感受到支持和鼓励

### 创建任务流程优化
- 每个步骤的“下一步/创建”按钮在配置未完成时禁用
- 周期设定步：总天数和周期天数需有效才能下一步
- 类型选择步：已有禁用逻辑（未选择时禁用）
- 配置步：根据任务类型验证必填项，完成后才能创建

### 创建任务灵玉消耗计算
- **主线任务**：100%完成任务的灵玉数量 × 0.2，取整到十位（如 511→510，655→650），范围 500~1000
- **支线任务**：100%完成任务的灵玉数量 × 0.15，取整到十位，范围 200~500

## Impact

- Affected specs: `agent-chat`, `create-task-modal`, `spirit-jade-system`
- Affected code: 
  - `src/pages/dc/agent/components/FollowupQuestion/index.tsx`
  - `src/pages/dc/agent/components/FollowupQuestion/styles.module.css`
  - `src/pages/dc/agent/types/index.ts`（可能需要扩展类型）
  - `src/pages/dc/agent/constants/prompts.ts`（配置助手 prompt 优化）
  - `src/pages/dc/components/CreateMainlineTaskModal/index.tsx`（按钮禁用逻辑）
  - `src/pages/dc/utils/spiritJadeCalculator.ts`（创建消耗计算）
