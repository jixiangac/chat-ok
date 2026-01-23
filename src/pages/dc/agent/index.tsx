/**
 * Agent Chat 模块统一导出
 */

// 主组件
export { AgentChat } from './AgentChat';
export { default } from './AgentChat';

// 子组件
export { MessageBubble, MessageList, ChatInput, ActionPreview, AgentChatPopup } from './components';

// Hooks
export { useAgent, useStreamChat, createAgent } from './hooks';

// 类型
export type {
  Message,
  MessageRole,
  MessageStatus,
  StructuredOutput,
  StructuredOutputType,
  TaskConfigData,
  NumericConfigData,
  CheckInConfigData,
  ChecklistItemsData,
  ChecklistItemData,
  AgentChatProps,
  ChatInputProps,
  MessageBubbleProps,
  MessageListProps,
  ActionPreviewProps,
} from './types';

// 常量
export { API_CONFIG, ROLE_PROMPTS, type AgentRole } from './constants';
