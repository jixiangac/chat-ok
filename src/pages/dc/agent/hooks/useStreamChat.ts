/**
 * 流式对话 Hook
 * 使用 OpenAI SDK 的 Chat Completions API 实现流式输出
 */

import { useState, useRef, useCallback } from 'react';
import type { Message, StructuredOutput } from '../types';
import { client } from './useAgent';
import { API_CONFIG, ROLE_PROMPTS, type AgentRole } from '../constants';

/**
 * 从消息内容中解析结构化输出
 */
function parseStructuredOutput(content: string): StructuredOutput | null {
  // 匹配 JSON 代码块
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (parsed.type === 'TASK_CONFIG' || parsed.type === 'CHECKLIST_ITEMS') {
      return parsed as StructuredOutput;
    }
  } catch {
    // 解析失败，返回 null
  }
  return null;
}

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

      // 使用 OpenAI SDK 调用 Chat Completions API
      const stream = await client.chat.completions.create({
        model: API_CONFIG.model,
        messages: chatMessages,
        stream: true,
      }, {
        signal: abortControllerRef.current.signal,
      });

      // 处理流式输出
      let fullContent = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
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
      }

      // 完成
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.id === aiMessageId) {
          lastMsg.status = 'complete';
          lastMsg.content = fullContent || lastMsg.content;

          // 尝试解析结构化输出
          const structuredOutput = parseStructuredOutput(lastMsg.content);
          if (structuredOutput && onStructuredOutput) {
            onStructuredOutput(structuredOutput);
          }
        }
        return updated;
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // 用户主动中断
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === aiMessageId) {
            lastMsg.status = 'complete';
          }
          return updated;
        });
      } else {
        // 其他错误
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
  }, [messages, systemPrompt, onStructuredOutput]);

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
