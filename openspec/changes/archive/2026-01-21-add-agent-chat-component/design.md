# Design: Agent Chat Component

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AgentChat (容器)                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │              MessageList (消息列表)              │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  MessageBubble (AI)     流式渲染区域     │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  MessageBubble (User)                   │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │              ChatInput (输入区域)                │    │
│  │  [  输入框  ] [发送/停止]                       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/pages/dc/agent/
├── index.tsx                 # 统一导出
├── AgentChat.tsx             # 主组件
├── components/
│   ├── index.ts
│   ├── MessageList/
│   │   ├── index.tsx         # 消息列表组件
│   │   └── styles.module.css
│   ├── MessageBubble/
│   │   ├── index.tsx         # 消息气泡组件
│   │   └── styles.module.css
│   └── ChatInput/
│       ├── index.tsx         # 输入框组件
│       └── styles.module.css
├── hooks/
│   ├── index.ts
│   ├── useAgent.ts           # Agent 初始化 Hook
│   └── useStreamChat.ts      # 流式对话 Hook
├── constants/
│   └── index.ts              # API 配置、默认 prompt
└── types/
    └── index.ts              # 类型定义
```

## Core Implementation

### 1. 配置自定义 OpenAI Client (iflow.cn)

```typescript
// hooks/useAgent.ts
import { OpenAI } from 'openai';
import { Agent, setDefaultOpenAIClient } from '@openai/agents';
import { API_CONFIG, DEFAULT_SYSTEM_PROMPT } from '../constants';

// 配置 iflow.cn API
const client = new OpenAI({
  baseURL: API_CONFIG.baseURL,
  apiKey: API_CONFIG.apiKey,
  dangerouslyAllowBrowser: true, // 浏览器端使用
});

setDefaultOpenAIClient(client);

export function createTaskAgent(systemPrompt?: string) {
  return new Agent({
    name: 'TaskAssistant',
    model: API_CONFIG.model,
    instructions: systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
  });
}
```

### 2. 流式对话 Hook

```typescript
// hooks/useStreamChat.ts
import { useState, useRef, useCallback } from 'react';
import { run } from '@openai/agents';
import type { Message } from '../types';
import { createTaskAgent } from './useAgent';

export function useStreamChat(systemPrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const agentRef = useRef(createTaskAgent(systemPrompt));

  const sendMessage = useCallback(async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    // 创建 AI 消息占位
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'streaming',
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsStreaming(true);

    try {
      // 使用 @openai/agents 运行
      const result = await run(agentRef.current, content, {
        stream: true,
        onToken: (token: string) => {
          // 流式更新 AI 消息
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content += token;
            }
            return updated;
          });
        },
      });

      // 完成
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.status = 'complete';
          lastMsg.content = result.finalOutput || lastMsg.content;
        }
        return updated;
      });
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.status = 'error';
          lastMsg.content = '抱歉，发生了错误，请重试';
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, sendMessage, stopStreaming, isStreaming };
}
```

### 3. 主组件

```typescript
// AgentChat.tsx
import { useRef, useEffect } from 'react';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { useStreamChat } from './hooks';
import styles from './styles.module.css';

interface AgentChatProps {
  systemPrompt?: string;
  className?: string;
}

export function AgentChat({ systemPrompt, className }: AgentChatProps) {
  const { messages, sendMessage, stopStreaming, isStreaming } = useStreamChat(systemPrompt);
  const listRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <MessageList ref={listRef} messages={messages} />
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder="message"
      />
    </div>
  );
}
```

## Constants

```typescript
// constants/index.ts

export const API_CONFIG = {
  baseURL: 'https://apis.iflow.cn/v1',
  model: 'qwen3-max',
  apiKey: 'sk-0845253d20ac7c4eaddfae73057db5ae',
};

// 角色类型
export type AgentRole = 'general' | 'taskCreator' | 'checklistHelper';

// 各角色 System Prompt
export const ROLE_PROMPTS: Record<AgentRole, string> = {
  // 1️⃣ 通用聊天角色（小精灵唤起）
  general: `你是「凝神」修仙系统的向导精灵，负责解答用户关于系统的问题和日常闲聊。

你熟悉：
- 修仙等级体系（练气、筑基、开光、结丹、元婴、化神、练虚、合体、大乘、渡劫）
- 灵玉系统（创建任务消耗、完成任务获得）
- 打卡、周期、任务类型（数值/清单/打卡）
- 主线/支线任务的区别

回复风格：
- 简洁有趣，偶尔用修仙用语
- 遇到不懂的问题可以幽默回应
- 鼓励用户坚持打卡`,

  // 2️⃣ 任务创建角色
  taskCreator: `你是任务规划助手，帮助用户创建和规划任务。

工作流程：
1. 询问用户想达成的目标
2. 分析并推荐合适的任务类型：
   - 数值型：适合可量化目标（如减重5kg、存钱10000元）
   - 清单型：适合有明确子项的目标（如读完10本书）
   - 打卡型：适合习惯养成（如每天运动、学习英语）
3. 帮助设定合理的周期和时间规划
4. 生成任务配置

当用户确认好任务信息后，输出以下 JSON 格式：
\`\`\`json
{
  "type": "TASK_CONFIG",
  "data": {
    "title": "任务标题",
    "category": "NUMERIC" | "CHECKLIST" | "CHECK_IN",
    "totalDays": 30,
    "cycleDays": 7,
    "config": { ... }
  }
}
\`\`\``,

  // 3️⃣ 清单梳理角色
  checklistHelper: `你是清单梳理助手，帮助用户拆解目标为具体的清单项。

工作流程：
1. 了解用户的目标或任务
2. 帮助拆解为具体可执行的清单项
3. 优化清单项描述，确保清晰可操作
4. 合理排序

当用户确认清单后，输出以下 JSON 格式：
\`\`\`json
{
  "type": "CHECKLIST_ITEMS",
  "data": {
    "items": [
      { "title": "清单项1" },
      { "title": "清单项2" },
      ...
    ]
  }
}
\`\`\``,
};
```

## UI Design Reference (fullmoon style)

参考 fullmoon 应用的极简黑白设计风格：

![UI Reference](/Users/weidawubidejiyang/Library/Application Support/Qoder/SharedClientCache/cache/images/279e3980/6ade7qxr-94e556a7.png)

### 核心 UI 特点

| 元素 | 样式描述 |
|------|----------|
| 整体背景 | 纯白 #ffffff |
| 用户消息 | 右侧对齐，黑色背景 (#000)，白色文字，大圆角 |
| AI 消息 | 左侧对齐，**无背景/透明**，纯文本显示，支持 Markdown |
| 输入框 | 底部固定，浅灰背景，圆角，左侧展开图标，右侧发送按钮 |
| 顶部栏 | 左侧列表图标，右侧设置图标 |

### 色彩方案

```css
/* fullmoon 风格色彩 */
--bg-primary: #ffffff;           /* 主背景 */
--bg-secondary: #f5f5f5;         /* 输入框背景 */
--text-primary: #000000;         /* 主文字 */
--text-secondary: #666666;       /* 次要文字 */
--bubble-user-bg: #000000;       /* 用户气泡背景 */
--bubble-user-text: #ffffff;     /* 用户气泡文字 */
--bubble-ai-bg: transparent;     /* AI 无背景 */
```

### 间距与尺寸

| 元素 | 尺寸 |
|------|------|
| 用户气泡圆角 | 20px |
| 气泡内边距 | 12px 16px |
| 消息间距 | 16px |
| 输入框高度 | 44px |
| 输入框圆角 | 22px (pill 形状) |
| 发送按钮 | 32px × 32px 圆形 |

## Notion Theme Customization

assistant-ui 支持通过 CSS 变量覆盖主题，按 fullmoon 风格定制：

```css
/* theme/fullmoon-theme.css */

/* 全局容器 */
.agent-chat-container {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Thread 容器 */
[data-assistant-ui-thread] {
  --aui-background: #ffffff;
  --aui-foreground: #000000;
  --aui-muted: #666666;
  --aui-border: #e5e5e5;
  --aui-radius: 20px;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 用户消息 - 右侧黑色气泡 */
[data-assistant-ui-user-message] {
  background: #000000;
  color: #ffffff;
  border-radius: 20px;
  padding: 12px 16px;
  max-width: 80%;
  margin-left: auto;
}

/* AI 消息 - 左侧无背景纯文本 */
[data-assistant-ui-assistant-message] {
  background: transparent;
  color: #000000;
  padding: 8px 0;
  max-width: 100%;
  line-height: 1.6;
}

/* AI 消息内的 Markdown 样式 */
[data-assistant-ui-assistant-message] strong {
  font-weight: 600;
}

[data-assistant-ui-assistant-message] ol,
[data-assistant-ui-assistant-message] ul {
  padding-left: 20px;
  margin: 8px 0;
}

/* 输入框容器 */
[data-assistant-ui-composer] {
  background: #f5f5f5;
  border: none;
  border-radius: 22px;
  padding: 6px 6px 6px 16px;
  margin: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 输入框 */
[data-assistant-ui-composer] textarea {
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  color: #000000;
}

[data-assistant-ui-composer] textarea::placeholder {
  color: #999999;
}

/* 发送按钮 - 圆形 */
[data-assistant-ui-composer] button[type="submit"] {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e5e5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

[data-assistant-ui-composer] button[type="submit"]:hover {
  background: #d0d0d0;
}

[data-assistant-ui-composer] button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Integration Example

```tsx
// 示例 1：通用聊天（小精灵唤起）
import { AgentChat } from '../agent';

function SpriteChat() {
  return (
    <AgentChat
      role="general"
      className="sprite-chat"
    />
  );
}

// 示例 2：任务创建助手
import { AgentChat } from '../agent';

function TaskCreatorChat({ onTaskConfig }) {
  return (
    <AgentChat
      role="taskCreator"
      onStructuredOutput={(output) => {
        if (output.type === 'TASK_CONFIG') {
          onTaskConfig(output.data);  // 弹出预览界面
        }
      }}
    />
  );
}

// 示例 3：清单梳理助手
import { AgentChat } from '../agent';

function ChecklistHelperChat({ onChecklistItems }) {
  return (
    <AgentChat
      role="checklistHelper"
      onStructuredOutput={(output) => {
        if (output.type === 'CHECKLIST_ITEMS') {
          onChecklistItems(output.data.items);  // 显示预览列表
        }
      }}
    />
  );
}
```

## Component Props

```typescript
interface AgentChatProps {
  /** AI 角色类型 */
  role: 'general' | 'taskCreator' | 'checklistHelper';
  /** 自定义样式 */
  className?: string;
  /** 结构化输出回调（任务配置/清单项） */
  onStructuredOutput?: (output: StructuredOutput) => void;
  /** 占位文字 */
  placeholder?: string;
}

interface StructuredOutput {
  type: 'TASK_CONFIG' | 'CHECKLIST_ITEMS';
  data: TaskConfig | ChecklistItems;
}
```

## Dependencies

```json
{
  "@openai/agents": "latest",
  "openai": "^4.x",
  "zod": "^4.x"
}
```

安装命令：
```bash
npm install @openai/agents openai zod
```
