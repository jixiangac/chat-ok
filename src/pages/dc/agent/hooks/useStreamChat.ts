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
 */
const FOLLOWUP_TOOL = {
  type: 'function' as const,
  function: {
    name: 'ask_followup_question',
    description: '当需要用户补充更多信息或从多个选项中做选择时，使用此工具向用户提问。会在界面上展示选项让用户点击选择。',
    parameters: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: '向用户提出的问题',
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
        allowCustom: {
          type: 'boolean',
          description: '是否允许用户自定义输入，默认为 true',
          default: true,
        },
      },
      required: ['question', 'options'],
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
        totalDays: { type: 'number', description: '总天数' },
        cycleDays: { type: 'number', description: '考核周期天数' },
        numericConfig: {
          type: 'object',
          description: '数值型任务配置（仅 category=NUMERIC 时使用）',
          properties: {
            direction: { type: 'string', enum: ['INCREASE', 'DECREASE'] },
            unit: { type: 'string' },
            startValue: { type: 'number' },
            targetValue: { type: 'number' },
          },
        },
        checklistItems: {
          type: 'array',
          description: '清单项目（仅 category=CHECKLIST 时使用）',
          items: { type: 'string' },
        },
        checkInConfig: {
          type: 'object',
          description: '打卡型任务配置（仅 category=CHECK_IN 时使用）',
          properties: {
            unit: { type: 'string', enum: ['TIMES', 'DURATION', 'QUANTITY'] },
            dailyMax: { type: 'number' },
            valueUnit: { type: 'string' },
          },
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
 * 过滤掉消息中的隐藏内容（用于显示）
 */
function filterHiddenContent(content: string): string {
  return content.replace(/<hidden>[\s\S]*?<\/hidden>/g, '').trim();
}

// 导出过滤函数供其他组件使用
export { filterHiddenContent };

interface UseStreamChatOptions {
  role: AgentRole;
  customPrompt?: string;
  onStructuredOutput?: (output: StructuredOutput) => void;
}

export function useStreamChat(options: UseStreamChatOptions) {
  const { role, customPrompt, onStructuredOutput } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 获取当前角色的 system prompt
  const systemPrompt = customPrompt ?? ROLE_PROMPTS[role];

  /**
   * 处理工具调用结果
   */
  const handleToolCall = useCallback((toolName: string, args: Record<string, unknown>) => {
    if (toolName === 'ask_followup_question') {
      // 追问工具 - 添加追问消息到列表
      const followupData: FollowupQuestionData = {
        questions: [{
          question: args.question as string,
          options: args.options as Array<{ label: string; value: string }>,
          allowCustom: args.allowCustom !== false,
        }],
      };
      // 添加追问类型的消息
      const followupMessage: Message = {
        id: `followup_${Date.now()}`,
        role: 'assistant',
        content: args.question as string,
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
        throw new Error(`API error: ${response.status}`);
      }

      // 处理流式输出 (SSE)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';
      const toolCalls: Array<{ id: string; name: string; arguments: string }> = [];

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
          } catch (e) {
            console.log('SSE parse error:', data, e);
          }
        }
      }

      // 完成后处理
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.id === aiMessageId) {
          lastMsg.status = 'complete';
          lastMsg.content = fullContent || lastMsg.content;

          // 处理工具调用
          if (toolCalls.length > 0) {
            for (const tc of toolCalls) {
              if (tc.name && tc.arguments) {
                try {
                  const args = JSON.parse(tc.arguments);
                  handleToolCall(tc.name, args);
                } catch (e) {
                  console.error('Tool call parse error:', e);
                }
              }
            }
          } else {
            // 向后兼容：尝试从文本中解析结构化输出
            const structuredOutput = parseStructuredOutput(lastMsg.content);
            if (structuredOutput && onStructuredOutput) {
              onStructuredOutput(structuredOutput);
            }
          }
        }
        return updated;
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === aiMessageId) {
            lastMsg.status = 'complete';
          }
          return updated;
        });
      } else {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === aiMessageId) {
            lastMsg.status = 'error';
            lastMsg.content = '抱歉，发生了错误，请重试';
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
  };
}
