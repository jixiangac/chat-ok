# Proposal: Add Agent Chat Component

## Summary

在 `src/pages/dc/` 目录下创建独立的 `agent/` 模块，基于 OpenAI 官方 **@openai/agents** 框架实现 AI Chat 组件。该组件支持流式输出，采用 fullmoon 风格自建 UI，使用 iflow.cn API 提供 AI 对话能力。

## Open Source Solution

采用 [@openai/agents](https://github.com/openai/openai-agents-js) 作为 Agent 框架：

| 特性 | 说明 |
|------|------|
| 官方维护 | OpenAI 官方 SDK |
| 流式输出 | 内置支持 |
| 自定义 baseURL | 支持对接 iflow.cn API |
| 工具调用 | 内置 tool 支持 |
| 多 Agent | 支持 handoffs 切换 |
| 类型安全 | TypeScript + Zod |

**为什么选择 @openai/agents？**
- OpenAI 官方维护，稳定可靠
- 支持自定义 baseURL，可对接 iflow.cn
- 工具调用、流式输出开箱即用
- 为后续扩展（多 Agent、MCP）打下基础

## Motivation

当前 DC 模块缺少 AI 辅助能力。通过引入 AI Chat 组件，可以：
1. 为用户提供任务创建的智能辅助
2. 提供一个可复用的 AI 对话基础设施
3. 增强用户体验，降低任务创建的认知负担

**为什么选择 @openai/agents + 自建 UI？**
- 官方 SDK，稳定性有保障
- 轻量级，不引入重型 UI 库
- 完全控制 UI 样式，匹配 fullmoon 风格
- 为后续工具调用、多 Agent 扩展预留接口

## Requirements

### 功能需求

| 需求 | 描述 |
|------|------|
| 流式输出 | 实时逐字显示 AI 回复，提供流畅的对话体验 |
| 气泡式消息 | 左 AI 右用户的聊天气泡布局 |
| 持久化存储 | 使用 localforage 保存对话历史 |
| 单会话模式 | 保持一个连续对话上下文 |
| 多角色支持 | 支持不同场景的专属 AI 角色 |
| 容器自适应 | 作为独立组件，适应任意容器尺寸 |

### 唤起模式（三种场景）

| 模式 | 入口 | 角色定位 | 输出能力 |
|------|------|----------|----------|
| **通用聊天** | 首页小精灵 | 修仙体系向导、系统介绍、闲聊 | 纯文本对话 |
| **任务创建** | 创建任务弹窗切换 | 任务规划助手 | 输出任务配置 JSON → 预览界面 → 确认创建 |
| **清单梳理** | 清单界面 AI 入口 | 清单梳理助手 | 输出清单项数组 → 确认后添加到列表 |

### 各角色详细设计

#### 1️⃣ 通用聊天角色（小精灵唤起）

```
入口：首页小精灵点击
角色：修仙体系向导/系统客服
能力：
  - 介绍修仙等级体系、灵玉系统
  - 解答打卡、周期、任务类型等问题
  - 日常闲聊、励志鸡汤
输出：纯文本
```

#### 2️⃣ 任务创建角色（CreateTaskModal 内切换）

```
入口：CreateTaskModal 内的 "AI 帮我创建" 按钮
角色：任务规划助手
能力：
  - 引导用户明确目标
  - 推荐任务类型（数值/清单/打卡）
  - 设定周期和时间规划
输出：
  - 结构化 TaskConfig JSON
  - 弹出任务预览卡片
  - 用户确认后直接创建任务
```

#### 3️⃣ 清单梳理角色（清单界面入口）

```
入口：清单任务详情页的 AI 入口按钮
角色：清单梳理助手
能力：
  - 帮用户拆解目标为具体清单项
  - 优化清单项的描述
  - 合理排序和分组
输出：
  - 结构化清单项数组
  - 显示预览列表
  - 用户确认后批量添加到清单
```

### 技术需求

| 需求 | 描述 |
|------|------|
| API 集成 | 使用 iflow.cn OpenAI 兼容 API |
| 模型配置 | 默认使用 qwen3-max |
| 错误处理 | 网络错误、API 错误的优雅处理 |
| 中断支持 | 支持中断正在生成的回复 |

## User Experience

### 交互流程

```
用户打开 Chat → 显示历史消息（如有）→ 输入问题 → 发送
                                           ↓
AI 头像 + "思考中..." → 流式输出回复 → 完成显示
```

### UI 设计要点

1. **输入框**：类似千问/ChatGPT，底部固定，支持多行输入
2. **消息气泡**：圆角气泡，AI 靠左（浅灰底），用户靠右（主题色底）
3. **加载状态**：打字机动画或 "···" 跳动效果
4. **整体风格**：延续 CreateTaskModal 的 Notion 风格

## Scope

### In Scope

- Agent Chat 核心组件
- 流式输出实现
- 消息持久化
- 任务助手 System Prompt 预设
- 基础错误处理

### Out of Scope

- 多会话切换
- Markdown 渲染（后续迭代）
- 消息搜索
- 语音输入

## API Configuration

```typescript
// iflow.cn API 配置
const API_CONFIG = {
  baseURL: 'https://apis.iflow.cn/v1',
  endpoint: '/chat/completions',
  model: 'qwen3-max',
  apiKey: 'sk-0845253d20ac7c4eaddfae73057db5ae',
};
```

## Deliverables

1. `src/pages/dc/agent/` 目录结构
2. AgentChat 核心组件
3. 流式输出 Hook
4. 消息存储服务
5. 任务助手预设角色

## Success Criteria

- [ ] 能够正常发送消息并获得 AI 回复
- [ ] 流式输出流畅，无明显卡顿
- [ ] 关闭后重新打开，历史消息保留
- [ ] 组件能够在不同尺寸容器中正常显示
