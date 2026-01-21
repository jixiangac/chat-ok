# Agent Chat Capability Spec

## Overview

Agent Chat 是一个多角色 AI 对话组件，支持流式输出和结构化输出，可通过三种唤起模式集成到 DC 模块中。

## 唤起模式

| 模式 | 入口 | 角色 | 输出能力 |
|------|------|------|----------|
| 通用聊天 | 首页小精灵 | 修仙向导/系统客服 | 纯文本 |
| 任务创建 | CreateTaskModal 内 | 任务规划助手 | TaskConfig JSON → 预览 → 确认 |
| 清单梳理 | 清单界面 AI 入口 | 清单梳理助手 | ChecklistItems JSON → 预览 → 确认 |

## ADDED Requirements

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

## Component API

```typescript
interface AgentChatProps {
  /** AI 角色类型 */
  role: 'general' | 'taskCreator' | 'checklistHelper';
  /** 自定义样式类名 */
  className?: string;
  /** 结构化输出回调（任务配置/清单项） */
  onStructuredOutput?: (output: StructuredOutput) => void;
  /** 输入框占位文字 */
  placeholder?: string;
  /** 存储 key，区分不同场景的历史记录 */
  storageKey?: string;
}

interface StructuredOutput {
  type: 'TASK_CONFIG' | 'CHECKLIST_ITEMS';
  data: TaskConfig | ChecklistItems;
}

interface TaskConfig {
  title: string;
  category: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
  totalDays: number;
  cycleDays: number;
  config: Record<string, any>;
}

interface ChecklistItems {
  items: Array<{ title: string }>;
}
```

## Related Capabilities

- CreateTaskModal（任务创建入口）
- Checklist Detail（清单梳理入口）
- Home Sprite（通用聊天入口）
