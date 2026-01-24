## ADDED Requirements

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
