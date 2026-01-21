/**
 * Agent Chat 类型定义
 */

import type { AgentRole } from '../constants';

// 消息状态
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

// 消息角色
export type MessageRole = 'user' | 'assistant' | 'system';

// 单条消息
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
}

// 结构化输出类型
export type StructuredOutputType = 'TASK_CONFIG' | 'CHECKLIST_ITEMS';

// 任务配置结构
export interface TaskConfigData {
  title: string;
  category: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
  totalDays: number;
  cycleDays: number;
  config?: Record<string, unknown>;
}

// 清单项结构
export interface ChecklistItemData {
  title: string;
}

// 清单配置结构
export interface ChecklistItemsData {
  items: ChecklistItemData[];
}

// 结构化输出
export interface StructuredOutput {
  type: StructuredOutputType;
  data: TaskConfigData | ChecklistItemsData;
}

// AgentChat 组件 Props
export interface AgentChatProps {
  /** AI 角色类型 */
  role: AgentRole;
  /** 自定义样式 */
  className?: string;
  /** 结构化输出回调（任务配置/清单项） */
  onStructuredOutput?: (output: StructuredOutput) => void;
  /** 占位文字 */
  placeholder?: string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 隐藏头部（当外层已有标题时使用） */
  hideHeader?: boolean;
}

// 聊天输入组件 Props
export interface ChatInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

// 消息气泡组件 Props
export interface MessageBubbleProps {
  message: Message;
}

// 消息列表组件 Props
export interface MessageListProps {
  messages: Message[];
  /** 欢迎图片 URL */
  welcomeImage?: string;
  /** 快捷问话列表 */
  quickQuestions?: string[];
  /** 点击快捷问话回调 */
  onQuickQuestion?: (question: string) => void;
}

// ActionPreview 组件 Props
export interface ActionPreviewProps {
  output: StructuredOutput;
  onConfirm: () => void;
  onCancel: () => void;
}
