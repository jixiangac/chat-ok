# agent-chat Specification

## Purpose
TBD - created by archiving change add-agent-chat-component. Update Purpose after archive.
## Requirements
### Requirement: 流式对话能力

Agent Chat 组件 **MUST** 支持与 AI 的流式对话交互。

#### Scenario: 用户发送消息并接收流式回复

**Given** 用户在输入框中输入了内容  
**When** 用户点击发送按钮或按下回车键  
**Then** 消息立即显示在对话区域右侧  
**And** AI 回复区域显示加载状态  
**And** AI 回复内容逐字/逐段实时显示  
**And** 完成后加载状态消失

#### Scenario: 用户中断正在生成的回复

**Given** AI 正在流式输出回复  
**When** 用户点击停止按钮  
**Then** 流式输出立即停止  
**And** 已输出的内容保留显示  
**And** 可以继续发送新消息

### Requirement: 消息持久化

对话历史 **MUST** 持久化存储，重新打开后可恢复。

#### Scenario: 历史消息加载

**Given** 用户之前有过对话记录  
**When** 用户重新打开 Chat 组件  
**Then** 之前的对话历史自动加载显示

#### Scenario: 清空对话历史

**Given** 存在历史对话记录  
**When** 用户触发清空操作  
**Then** 所有历史消息被删除  
**And** 存储中的记录被清除

### Requirement: 容器自适应

组件 **MUST** 能够适应不同尺寸的容器。

#### Scenario: 小尺寸容器

**Given** 容器宽度为 320px，高度为 400px  
**When** AgentChat 组件渲染在该容器中  
**Then** 组件正常显示，无溢出或错位  
**And** 消息列表可滚动  
**And** 输入框正常可用

#### Scenario: 全屏容器

**Given** 容器占据整个视口  
**When** AgentChat 组件渲染在该容器中  
**Then** 组件充满容器  
**And** 消息和输入框合理布局

### Requirement: 多角色支持

组件 **MUST** 支持三种预定义角色。

#### Scenario: 通用聊天角色（小精灵唤起）

**Given** 用户点击首页小精灵  
**When** Agent Chat 以 role="general" 打开  
**Then** AI 以修仙向导/系统客服角色回复  
**And** 可介绍修仙等级、灵玉系统、打卡机制等

#### Scenario: 任务创建角色

**Given** 用户在 CreateTaskModal 内点击 "AI 帮我创建"  
**When** Agent Chat 以 role="taskCreator" 打开  
**Then** AI 以任务规划助手角色回复  
**And** 引导用户明确目标、推荐任务类型、设定周期

#### Scenario: 清单梳理角色

**Given** 用户在清单界面点击 AI 入口  
**When** Agent Chat 以 role="checklistHelper" 打开  
**Then** AI 以清单梳理助手角色回复  
**And** 帮助拆解目标为具体清单项

### Requirement: 结构化输出能力

任务创建和清单梳理角色 **MUST** 能输出结构化 JSON。

#### Scenario: 输出任务配置

**Given** 任务创建角色与用户完成对话  
**When** 用户确认任务信息  
**Then** AI 输出 TASK_CONFIG JSON  
**And** 触发 onStructuredOutput 回调  
**And** 显示任务预览卡片  
**And** 用户确认后直接创建任务

#### Scenario: 输出清单项

**Given** 清单梳理角色与用户完成对话  
**When** 用户确认清单内容  
**Then** AI 输出 CHECKLIST_ITEMS JSON  
**And** 触发 onStructuredOutput 回调  
**And** 显示清单项预览列表  
**And** 用户确认后批量添加到清单

### Requirement: 可定制角色

组件 **MUST** 支持通过 System Prompt 自定义 AI 角色行为。

#### Scenario: 使用默认任务助手角色

**Given** 未提供自定义 systemPrompt 配置  
**When** 用户发送消息  
**Then** AI 以任务助手角色回复  
**And** 回复聚焦于任务创建和规划

#### Scenario: 使用自定义角色

**Given** 提供了自定义 systemPrompt: "你是一个健身教练"  
**When** 用户发送消息  
**Then** AI 以健身教练角色回复

### Requirement: 错误处理

网络或 API 错误时 **MUST** 优雅处理并给用户反馈。

#### Scenario: 网络错误

**Given** 网络连接不可用  
**When** 用户发送消息  
**Then** 显示友好的错误提示  
**And** 用户可以重试发送

#### Scenario: API 错误

**Given** API 返回错误响应  
**When** 用户发送消息  
**Then** 显示错误提示  
**And** 错误消息包含可操作的建议

### Requirement: 通用聊天任务卡片自动打开创建界面

当用户**明确表达创建任务意图**时，AI（general 角色）**SHALL** 支持输出任务配置，用户点击确认后自动打开创建任务界面。

#### Scenario: AI 不得擅自推荐任务配置

**Given** 用户在通用聊天（general 角色）与 AI 对话
**When** 用户未明确表达创建任务的意图
**Then** AI 不应当主动输出 TASK_CONFIG 结构化数据
**And** AI 可以通过文字描述任务相关内容，但不触发创建流程

#### Scenario: 用户明确要求创建任务

**Given** 用户在通用聊天（general 角色）与 AI 对话
**When** 用户明确表达创建任务意图（如“帮我创建一个任务”、“我想新建一个目标”、“给我建个打卡任务”等）
**Then** AI 输出 TASK_CONFIG 类型的结构化数据
**And** 显示任务配置预览卡片

#### Scenario: 用户确认 AI 推荐的任务配置

**Given** AI 已输出 TASK_CONFIG 类型的结构化数据
**When** 用户点击「使用此配置」按钮
**Then** 系统自动打开 CreateTaskModal
**And** 预填 AI 推荐的配置参数（任务类型、周期、目标值等）
**And** 用户可在弹窗中修改配置后确认创建

#### Scenario: 通用聊天未打开创建任务窗口时的处理

**Given** 用户在首页通过小精灵进入通用聊天
**And** 此时 CreateTaskModal 未打开
**When** AI 输出 TASK_CONFIG 并用户点击确认
**Then** 系统在 DCPage 层面打开 CreateTaskModal
**And** 关闭通用聊天 Popup（或保持打开，根据 UX 决定）

