/**
 * 流式对话 Hook
 * 使用原生 fetch 实现流式输出
 * 支持 OpenAI Tools (Function Calling) 实现追问功能
 */

import { useState, useRef, useCallback } from 'react';
import type { Message, StructuredOutput, FollowupQuestionData } from '../types';
import { API_CONFIG, ROLE_PROMPTS, type AgentRole } from '../constants';

// API 端点
const API_URL = 'https://apis.iflow.cn/v1/chat/completions';

/**
 * 定义追问工具 - OpenAI Function Calling 格式
 * 支持单问题和多问题两种模式
 */
const FOLLOWUP_TOOL = {
  type: 'function' as const,
  function: {
    name: 'ask_followup_question',
    description: '向用户提问收集信息。支持多问题一次性收集。【重要】体重类问题选项必须用「斤」（如100-120斤），禁止用kg/公斤！',
    parameters: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          description: '问题列表。可以是单个问题或多个问题。多问题时用户需要全部回答后才能提交。',
          items: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: '问题文本',
              },
              options: {
                type: 'array',
                description: '供用户选择的选项列表（2-4个选项）',
                items: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string',
                      description: '选项显示文字',
                    },
                    value: {
                      type: 'string',
                      description: '用户选择后发送的内容',
                    },
                  },
                  required: ['label', 'value'],
                },
                minItems: 2,
                maxItems: 4,
              },
            },
            required: ['question', 'options'],
          },
          minItems: 1,
          maxItems: 5,
        },
        // 兼容旧版单问题格式
        question: {
          type: 'string',
          description: '【兼容旧版】单个问题文本。建议使用 questions 数组代替。',
        },
        options: {
          type: 'array',
          description: '【兼容旧版】单个问题的选项列表。建议使用 questions 数组代替。',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              value: { type: 'string' },
            },
            required: ['label', 'value'],
          },
        },
      },
      required: [],
    },
  },
};

/**
 * 定义任务配置工具
 */
const TASK_CONFIG_TOOL = {
  type: 'function' as const,
  function: {
    name: 'submit_task_config',
    description: '当收集到足够信息后，提交任务配置。配置会展示给用户确认。',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '任务名称' },
        category: {
          type: 'string',
          enum: ['NUMERIC', 'CHECKLIST', 'CHECK_IN'],
          description: '任务类型：NUMERIC=数值型, CHECKLIST=清单型, CHECK_IN=打卡型'
        },
        totalDays: {
          type: 'number',
          enum: [30, 90, 180, 365],
          description: '总天数，只能是30/90/180/365之一'
        },
        cycleDays: {
          type: 'number',
          enum: [10, 15, 30],
          description: '考核周期天数，只能是10/15/30之一'
        },
        numericConfig: {
          type: 'object',
          description: '数值型任务配置（category=NUMERIC 时必填！）必须包含完整的 direction/unit/startValue/targetValue',
          properties: {
            direction: { type: 'string', enum: ['INCREASE', 'DECREASE'], description: '增减方向：INCREASE=增加, DECREASE=减少' },
            unit: { type: 'string', description: '单位，如：斤、元、公里、本' },
            startValue: { type: 'number', description: '起始值' },
            targetValue: { type: 'number', description: '目标值' },
          },
          required: ['direction', 'unit', 'startValue', 'targetValue'],
        },
        checklistItems: {
          type: 'array',
          description: '清单项目列表（category=CHECKLIST 时必填！）必须提供 ≥10 个具体有价值的清单项目',
          items: { type: 'string' },
          minItems: 10,
        },
        checkInConfig: {
          type: 'object',
          description: '打卡型任务配置（category=CHECK_IN 时必填！）',
          properties: {
            unit: { type: 'string', enum: ['TIMES', 'DURATION', 'QUANTITY'], description: '打卡类型：TIMES=次数, DURATION=时长(分钟), QUANTITY=数量' },
            dailyMax: { type: 'number', description: '每日目标值' },
            valueUnit: { type: 'string', description: '单位（QUANTITY类型时使用，如：个、篇、km）' },
          },
          required: ['unit', 'dailyMax'],
        },
      },
      required: ['title', 'category', 'totalDays', 'cycleDays'],
    },
  },
};

/**
 * 定义清单项工具
 */
const CHECKLIST_ITEMS_TOOL = {
  type: 'function' as const,
  function: {
    name: 'submit_checklist_items',
    description: '提交清单项目列表，展示给用户确认后添加到任务中。',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          description: '清单项目列表',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: '清单项标题' },
            },
            required: ['title'],
          },
        },
      },
      required: ['items'],
    },
  },
};

// 所有可用工具
const AVAILABLE_TOOLS = [FOLLOWUP_TOOL, TASK_CONFIG_TOOL, CHECKLIST_ITEMS_TOOL];

/**
 * 从消息内容中解析结构化输出（向后兼容）
 */
function parseStructuredOutput(content: string): StructuredOutput | null {
  const validTypes = ['TASK_CONFIG', 'CHECKLIST_ITEMS', 'FOLLOWUP_QUESTION'];

  // 优先匹配 hidden 标签中的 JSON
  const hiddenMatch = content.match(/<hidden>\s*```json\s*([\s\S]*?)\s*```\s*<\/hidden>/);
  if (hiddenMatch) {
    try {
      const parsed = JSON.parse(hiddenMatch[1]);
      if (validTypes.includes(parsed.type)) {
        return parsed as StructuredOutput;
      }
    } catch {
      // 解析失败，继续尝试其他格式
    }
  }

  // 向后兼容：匹配普通 JSON 代码块
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (validTypes.includes(parsed.type)) {
      return parsed as StructuredOutput;
    }
  } catch {
    // 解析失败，返回 null
  }
  return null;
}

/**
 * 过滤掉消息中的隐藏内容和推荐问题标签（用于显示）
 */
function filterHiddenContent(content: string): string {
  return content
    .replace(/<hidden>[\s\S]*?<\/hidden>/g, '')
    .replace(/<suggested-questions>[\s\S]*?<\/suggested-questions>/g, '')
    .trim();
}

/**
 * 从消息内容中解析推荐追问问题
 * 格式：<suggested-questions>问题1|问题2</suggested-questions>
 */
function parseSuggestedQuestions(content: string): string[] {
  const match = content.match(/<suggested-questions>([\s\S]*?)<\/suggested-questions>/);
  if (!match) return [];

  const questionsText = match[1].trim();
  if (!questionsText) return [];

  // 支持 | 或换行分隔
  const questions = questionsText
    .split(/[|\n]/)
    .map(q => q.trim())
    .filter(q => q.length > 0)
    .slice(0, 3); // 最多 3 个推荐问题

  return questions;
}

// 导出过滤函数和解析函数供其他组件使用
export { filterHiddenContent, parseSuggestedQuestions };

/**
 * 尝试修复常见的 JSON 格式错误
 * 例如：{"numericConfig": , "direction": ...} 这种空值情况
 */
function tryFixMalformedJson(jsonStr: string): Record<string, unknown> | null {
  try {
    // 1. 修复 `: ,` 空值问题 - 替换为 null 或移除该字段
    let fixed = jsonStr.replace(/:\s*,/g, ': null,');

    // 2. 修复末尾 `: }` 空值问题
    fixed = fixed.replace(/:\s*}/g, ': null}');

    // 3. 修复嵌套对象结构错误（如 numericConfig 应该包含其他字段但被拆散了）
    // 检测到 numericConfig 后面紧跟着应该属于它的字段
    const numericConfigMatch = fixed.match(/"numericConfig"\s*:\s*null\s*,\s*"direction"/);
    if (numericConfigMatch) {
      // 重构 numericConfig 对象
      fixed = fixed.replace(
        /"numericConfig"\s*:\s*null\s*,\s*"direction"\s*:\s*"([^"]+)"\s*,\s*"unit"\s*:\s*"([^"]+)"\s*,\s*"startValue"\s*:\s*"?(\d+)"?\s*,\s*"targetValue"\s*:\s*"?(\d+)"?/,
        '"numericConfig": {"direction": "$1", "unit": "$2", "startValue": $3, "targetValue": $4}'
      );
    }

    // 4. 尝试解析修复后的 JSON
    const parsed = JSON.parse(fixed);
    return parsed;
  } catch {
    // 尝试更激进的修复策略
    try {
      // 移除导致问题的字段
      let fixed = jsonStr.replace(/"numericConfig"\s*:\s*,/g, '');
      fixed = fixed.replace(/,\s*,/g, ','); // 移除连续逗号
      fixed = fixed.replace(/,\s*}/g, '}'); // 移除末尾多余逗号
      fixed = fixed.replace(/{\s*,/g, '{'); // 移除开头多余逗号

      const parsed = JSON.parse(fixed);
      return parsed;
    } catch {
      return null;
    }
  }
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

/** 任务摘要信息（用于 AI 上下文） */
export interface TaskSummary {
  /** 任务 ID */
  id: string;
  /** 任务标题 */
  title: string;
  /** 任务类型：mainline=主线, sidelineA/B=支线 */
  type: 'mainline' | 'sidelineA' | 'sidelineB';
  /** 任务分类 */
  category: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN';
  /** 任务状态 */
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  /** 总天数 */
  totalDays: number;
  /** 周期天数 */
  cycleDays: number;
  /** 开始日期 */
  startDate: string;
  /** 当前周期进度（如：第2周期，第5天） */
  currentCycleInfo?: string;
  /** 今日是否已完成 */
  todayCompleted?: boolean;
  /** 今日进度描述（如："已打卡2次"、"已完成3/5项"） */
  todayProgressDesc?: string;
  /** 总体进度百分比 */
  overallProgressPercent?: number;
  /** 数值型：当前值 → 目标值 */
  numericProgress?: string;
}

/** 用户任务上下文 */
export interface UserTaskContext {
  /** 所有进行中的任务列表（主线 + 支线） */
  activeTasks: TaskSummary[];
  /** 主线任务列表 */
  mainlineTasks?: TaskSummary[];
  /** 支线任务列表 */
  sidelineTasks?: TaskSummary[];
  /** 今日一日清单中的任务 */
  dailyTasks?: TaskSummary[];
  /** 今日待完成任务数 */
  todayPendingCount: number;
  /** 今日已完成任务数 */
  todayCompletedCount: number;
  /** 今日完成率百分比 */
  todayProgressPercentage?: number;
  /** 连续打卡天数（可选） */
  streakDays?: number;
}

interface UseStreamChatOptions {
  role: AgentRole;
  customPrompt?: string;
  onStructuredOutput?: (output: StructuredOutput) => void;
  /** 用户基础信息，用于 AI 了解用户状态 */
  userInfo?: UserBaseInfo;
  /** 用户任务上下文，用于 AI 了解任务进度（仅 general 角色使用） */
  taskContext?: UserTaskContext;
  /** 额外上下文（附加到系统提示词末尾，如紫微命盘数据） */
  extraContext?: string;
}

/**
 * 生成用户信息的系统提示词（使用 XML 格式，便于 AI 理解）
 */
function generateUserInfoPrompt(userInfo?: UserBaseInfo): string {
  if (!userInfo) return '';
  return `

<user-info>
  <nickname>${userInfo.nickname || '修仙者'}</nickname>
  <spirit-jade>${userInfo.spiritJade}</spirit-jade>
  <cultivation>${userInfo.cultivation}</cultivation>
  <level>${userInfo.cultivationLevel}</level>
</user-info>

`;
}

/**
 * 生成任务上下文提示词（仅 general 角色使用）
 * 使用自然语言描述，结构化呈现主线/支线/今日任务
 */
function generateTaskContextPrompt(taskContext?: UserTaskContext): string {
  if (!taskContext) return '';

  const {
    mainlineTasks = [],
    sidelineTasks = [],
    dailyTasks = [],
    todayPendingCount,
    todayCompletedCount,
    todayProgressPercentage = 0,
    streakDays,
  } = taskContext;

  // 判断是否有任务
  const hasAnyTask = mainlineTasks.length > 0 || sidelineTasks.length > 0;

  if (!hasAnyTask) {
    return `

【用户任务情况】
用户当前没有进行中的任务。如果用户询问任务相关问题，可以友好地引导用户创建新任务。

`;
  }

  // 生成日期
  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  // 辅助函数：生成单个任务的描述
  const describeTask = (task: TaskSummary): string => {
    const categoryLabel = task.category === 'NUMERIC' ? '数值型' : task.category === 'CHECKLIST' ? '清单型' : '打卡型';
    const statusEmoji = task.todayCompleted ? '✅' : '⏳';
    const statusText = task.todayCompleted ? '今日已完成' : '今日待完成';

    let details = `  ▸ 「${task.title}」（${categoryLabel}）`;
    details += `\n    ${statusEmoji} ${statusText}`;
    if (task.todayProgressDesc) {
      details += ` | ${task.todayProgressDesc}`;
    }
    if (task.numericProgress) {
      details += `\n    目标进度：${task.numericProgress}`;
    }
    if (task.overallProgressPercent !== undefined) {
      details += ` | 总体 ${task.overallProgressPercent}%`;
    }
    if (task.currentCycleInfo) {
      details += `\n    周期：${task.currentCycleInfo}`;
    }
    return details;
  };

  // 生成主线任务描述
  let mainlineSection = '';
  if (mainlineTasks.length > 0) {
    const mainlineDescriptions = mainlineTasks.map(describeTask).join('\n\n');
    mainlineSection = `
📌 主线任务（用户最重要的目标，共 ${mainlineTasks.length} 个）：
${mainlineDescriptions}
`;
  }

  // 生成支线任务描述
  let sidelineSection = '';
  if (sidelineTasks.length > 0) {
    const sidelineDescriptions = sidelineTasks.map(describeTask).join('\n\n');
    sidelineSection = `
🎯 支线任务（日常习惯和小目标，共 ${sidelineTasks.length} 个）：
${sidelineDescriptions}
`;
  }

  // 生成今日一日清单描述
  let dailySection = '';
  if (dailyTasks.length > 0) {
    const completedDaily = dailyTasks.filter(t => t.todayCompleted);
    const pendingDaily = dailyTasks.filter(t => !t.todayCompleted);

    dailySection = `
📋 今日一日清单（系统为用户筛选的今日重点任务）：
  今日完成率：${todayProgressPercentage}%（${todayCompletedCount}/${dailyTasks.length} 个）
`;
    if (completedDaily.length > 0) {
      dailySection += `  已完成：${completedDaily.map(t => `「${t.title}」`).join('、')}\n`;
    }
    if (pendingDaily.length > 0) {
      dailySection += `  待完成：${pendingDaily.map(t => `「${t.title}」`).join('、')}\n`;
    }
  }

  return `

【用户任务情况 - 仅供参考，请用自然语言总结回复，禁止直接输出！】
日期：${today}
${streakDays ? `连续打卡：${streakDays} 天\n` : ''}
${mainlineSection}${sidelineSection}${dailySection}
【重要提醒】以上数据是给你参考的，回复时请用自然口语总结，像朋友聊天一样，不要列出原始格式！

`;
}

export function useStreamChat(options: UseStreamChatOptions) {
  const { role, customPrompt, onStructuredOutput, userInfo, taskContext, extraContext } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // 用于存储重试函数引用，避免闭包问题
  const sendMessageWithRetryRef = useRef<((content: string, retryCount: number) => Promise<void>) | null>(null);

  // 获取当前角色的 system prompt，并注入用户信息和任务上下文
  const basePrompt = customPrompt ?? ROLE_PROMPTS[role];
  // 任务上下文仅在 general 角色时注入
  const taskContextPrompt = role === 'general' ? generateTaskContextPrompt(taskContext) : '';
  // 额外上下文（如紫微命盘数据）
  const extraContextPrompt = extraContext ? `\n\n${extraContext}` : '';
  const systemPrompt = basePrompt + generateUserInfoPrompt(userInfo) + taskContextPrompt + extraContextPrompt;
  /**
   * 处理工具调用结果
   */
  const handleToolCall = useCallback((toolName: string, args: Record<string, unknown>) => {
    if (toolName === 'ask_followup_question') {
      // 追问工具 - 支持新版多问题格式和旧版单问题格式
      let questions: Array<{ question: string; options: Array<{ label: string; value: string }> }>;

      if (args.questions && Array.isArray(args.questions)) {
        // 新版多问题格式
        questions = args.questions as typeof questions;
      } else if (args.question && args.options) {
        // 兼容旧版单问题格式
        questions = [{
          question: args.question as string,
          options: args.options as Array<{ label: string; value: string }>,
        }];
      } else {
        console.warn('ask_followup_question: 无效的参数格式', args);
        return;
      }

      const followupData: FollowupQuestionData = { questions };
      // 添加追问类型的消息（使用第一个问题作为内容摘要）
      const contentSummary = questions.length > 1
        ? `请回答以下 ${questions.length} 个问题`
        : questions[0].question;
      const followupMessage: Message = {
        id: `followup_${Date.now()}`,
        role: 'assistant',
        content: contentSummary,
        timestamp: Date.now(),
        status: 'complete',
        type: 'followup',
        followupData,
      };
      setMessages(prev => [...prev, followupMessage]);
    } else if (toolName === 'submit_task_config') {
      // 任务配置工具 - 添加操作预览消息到列表
      const output: StructuredOutput = {
        type: 'TASK_CONFIG',
        data: args as StructuredOutput['data'],
      };
      const actionMessage: Message = {
        id: `action_${Date.now()}`,
        role: 'assistant',
        content: '任务配置',
        timestamp: Date.now(),
        status: 'complete',
        type: 'action_preview',
        actionPreviewData: output,
      };
      setMessages(prev => [...prev, actionMessage]);
    } else if (toolName === 'submit_checklist_items') {
      // 清单项工具 - 添加操作预览消息到列表
      const output: StructuredOutput = {
        type: 'CHECKLIST_ITEMS',
        data: args as StructuredOutput['data'],
      };
      const actionMessage: Message = {
        id: `action_${Date.now()}`,
        role: 'assistant',
        content: '清单项',
        timestamp: Date.now(),
        status: 'complete',
        type: 'action_preview',
        actionPreviewData: output,
      };
      setMessages(prev => [...prev, actionMessage]);
    }
  }, []);

  // 内部函数：支持重试的消息发送
  const sendMessageWithRetry = useCallback(async (content: string, retryCount: number = 0) => {
    // 仅首次发送时添加用户消息
    if (retryCount === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);
    }

    // 创建 AI 消息占位
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'streaming',
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsStreaming(true);

    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 构建完整的对话历史
      const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
      ];

      // 添加历史消息
      messages.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });

      // 添加当前用户消息
      chatMessages.push({ role: 'user', content });

      // 使用原生 fetch 调用 API（带 tools）
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: chatMessages,
          tools: AVAILABLE_TOOLS,
          tool_choice: 'auto',
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMessage = `请求失败 (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {
          // 无法解析错误响应，使用默认消息
        }
        throw new Error(errorMessage);
      }

      // 处理流式输出 (SSE)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';
      const toolCalls: Array<{ id: string; name: string; arguments: string }> = [];
      let usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null = null;

      if (!reader) {
        throw new Error('No response body');
      }

      let readerDone = false;
      while (!readerDone) {
        const { done, value } = await reader.read();
        if (done) {
          readerDone = true;
          continue;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

          const data = trimmedLine.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const choice = parsed.choices?.[0];

            // 处理普通文本内容
            const delta = choice?.delta?.content;
            if (delta) {
              fullContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg.id === aiMessageId) {
                  lastMsg.content = fullContent;
                }
                return updated;
              });
            }

            // 处理工具调用
            const toolCallsDelta = choice?.delta?.tool_calls;
            if (toolCallsDelta) {
              for (const tc of toolCallsDelta) {
                const index = tc.index || 0;
                if (!toolCalls[index]) {
                  toolCalls[index] = { id: tc.id || '', name: '', arguments: '' };
                }
                if (tc.function?.name) {
                  toolCalls[index].name = tc.function.name;
                }
                if (tc.function?.arguments) {
                  toolCalls[index].arguments += tc.function.arguments;
                }
              }
            }

            // 捕获 usage 信息（通常在最后一个 chunk）
            if (parsed.usage) {
              usage = parsed.usage;
            }
          } catch (e) {
            console.log('SSE parse error:', data, e);
          }
        }
      }

      // 解析工具调用参数（在 setMessages 外部处理，避免嵌套状态更新问题）
      const parsedToolCalls: Array<{ name: string; args: Record<string, unknown> }> = [];
      let hasToolCallParseError = false;
      for (const tc of toolCalls) {
        if (tc.name && tc.arguments) {
          try {
            const args = JSON.parse(tc.arguments);
            parsedToolCalls.push({ name: tc.name, args });
          } catch (e) {
            // 尝试修复常见的 JSON 格式问题
            const fixedArgs = tryFixMalformedJson(tc.arguments);
            if (fixedArgs) {
              console.log('Tool call JSON fixed:', fixedArgs);
              parsedToolCalls.push({ name: tc.name, args: fixedArgs });
            } else {
              console.error('Tool call parse error:', e, tc.arguments);
              hasToolCallParseError = true;
            }
          }
        }
      }

      // 有工具调用但全部解析失败时，自动重试（最多重试一次）
      if (toolCalls.length > 0 && hasToolCallParseError && parsedToolCalls.length === 0 && retryCount < 1) {
        console.log('🔄 Tool call parse failed, auto retrying...', retryCount + 1);
        // 移除当前的 AI 消息占位，重新发送
        setMessages(prev => prev.filter(m => m.id !== aiMessageId));
        setIsStreaming(false);
        // 延迟后重试，使用 ref 调用避免闭包问题
        setTimeout(() => {
          sendMessageWithRetryRef.current?.(content, retryCount + 1);
        }, 500);
        return;
      }

      // 完成后处理 - 先更新消息状态
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.id === aiMessageId) {
          if (parsedToolCalls.length > 0) {
            // 有成功解析的工具调用，标记为完成
            lastMsg.status = 'complete';
            lastMsg.content = fullContent;
          } else if (toolCalls.length > 0 && hasToolCallParseError) {
            // 有工具调用但全部解析失败（重试后仍失败）
            lastMsg.status = 'error';
            lastMsg.content = '处理响应时出错，请重试';
          } else if (!fullContent.trim()) {
            // 没有工具调用，也没有内容返回 - 这是异常情况
            lastMsg.status = 'error';
            lastMsg.content = '服务暂时无法响应，请稍后重试';
          } else {
            // 正常情况：有文本内容返回
            lastMsg.status = 'complete';
            lastMsg.content = fullContent;
            // 向后兼容：尝试从文本中解析结构化输出
            const structuredOutput = parseStructuredOutput(lastMsg.content);
            if (structuredOutput && onStructuredOutput) {
              onStructuredOutput(structuredOutput);
            }
          }
        }
        return updated;
      });

      // 处理工具调用（使用 setTimeout 确保在前一个 setMessages 批量更新完成后执行）
      if (parsedToolCalls.length > 0) {
        setTimeout(() => {
          for (const tc of parsedToolCalls) {
            handleToolCall(tc.name, tc.args);
          }
        }, 0);
      }

      // 记录 token 使用量
      if (usage) {
        const usageData = {
          promptTokens: usage.prompt_tokens || 0,
          completionTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0,
        };
        setTokenUsage(usageData);
        console.log('📊 Token 使用量:', usageData);
      }
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === aiMessageId) {
            lastMsg.status = 'complete';
          }
          return updated;
        });
      } else {
        // 构建用户可读的错误信息
        let errorMessage = '请求失败，请稍后重试';
        if (err.message) {
          // 如果是网络错误
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            errorMessage = '网络连接失败，请检查网络后重试';
          } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            errorMessage = '请求超时，请稍后重试';
          } else {
            // 使用 API 返回的错误信息
            errorMessage = err.message;
          }
        }
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === aiMessageId) {
            lastMsg.status = 'error';
            lastMsg.content = errorMessage;
          }
          return updated;
        });
        console.error('Chat error:', error);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [messages, systemPrompt, onStructuredOutput, handleToolCall]);

  // 将函数保存到 ref，供重试时调用
  sendMessageWithRetryRef.current = sendMessageWithRetry;

  // 对外暴露的发送消息函数（无重试计数参数）
  const sendMessage = useCallback((content: string) => {
    return sendMessageWithRetry(content, 0);
  }, [sendMessageWithRetry]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    stopStreaming,
    clearMessages,
    isStreaming,
    tokenUsage,
  };
}
