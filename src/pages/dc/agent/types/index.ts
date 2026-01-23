/**
 * Agent Chat 类型定义
 */

import type { AgentRole } from '../constants';

// 消息状态
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

// 消息角色
export type MessageRole = 'user' | 'assistant' | 'system';

// 消息类型
export type MessageType = 'text' | 'followup' | 'action_preview';

// 结构化输出类型
export type StructuredOutputType = 'TASK_CONFIG' | 'CHECKLIST_ITEMS' | 'FOLLOWUP_QUESTION';

// 追问问题类型
export interface FollowupQuestion {
  question: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

// 追问数据结构
export interface FollowupQuestionData {
  questions: FollowupQuestion[];
}

// 多问题答案结果（用于统一提交回调）
export interface MultiAnswerResult {
  /** 每个问题的答案，key 为问题索引 */
  answers: Record<number, string>;
  /** 汇总的答案字符串（用于发送给 AI） */
  summary: string;
}

// 数值型配置
export interface NumericConfigData {
  direction: 'INCREASE' | 'DECREASE';
  unit: string;
  startValue: number;
  targetValue: number;
}

// 打卡型配置
export interface CheckInConfigData {
  unit: 'TIMES' | 'DURATION' | 'QUANTITY';
  dailyMax?: number;
  valueUnit?: string;
}

// 任务配置结构
export interface TaskConfigData {
  title: string;
  category: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
  totalDays: number;
  cycleDays: number;
  config?: Record<string, unknown>;
  // 扩展配置字段
  numericConfig?: NumericConfigData;
  checklistItems?: string[];
  checkInConfig?: CheckInConfigData;
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
  data: TaskConfigData | ChecklistItemsData | FollowupQuestionData;
}

// 单条消息
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  /** 消息类型，默认为 text */
  type?: MessageType;
  /** 追问数据（当 type 为 followup 时使用） */
  followupData?: FollowupQuestionData;
  /** 操作预览数据（当 type 为 action_preview 时使用） */
  actionPreviewData?: StructuredOutput;
}

/** 用户基础信息 */
export interface UserBaseInfo {
  /** 当前灵玉值 */
  spiritJade: number;
  /** 当前修为值 */
  cultivation: number;
  /** 当前修仙等级名称 */
  cultivationLevel: string;
  /** 用户昵称 */
  nickname?: string;
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
  /** 初始消息（自动发送） */
  initialMessage?: string;
  /** 用户基础信息，用于 AI 了解用户状态 */
  userInfo?: UserBaseInfo;
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
  /** 追问选项点击回调（单问题返回 string，多问题返回 MultiAnswerResult） */
  onFollowupAnswer?: (answer: string | MultiAnswerResult) => void;
  /** ActionPreview 确认回调 */
  onActionConfirm?: (output: StructuredOutput) => void;
  /** ActionPreview 取消回调 */
  onActionCancel?: (messageId: string) => void;
}

// ActionPreview 组件 Props
export interface ActionPreviewProps {
  output: StructuredOutput;
  onConfirm: () => void;
  onCancel: () => void;
  /** 是否显示操作按钮（后续有新消息时隐藏） */
  showActions?: boolean;
}
