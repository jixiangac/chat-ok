/**
 * AgentChat 主组件
 * 支持多角色切换、流式输出、结构化输出回调
 * 集成 token 消耗和灵玉扣减机制
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { MessageList, ChatInput } from './components';
import { useStreamChat, useAITokenCost } from './hooks';
import { WELCOME_CONFIGS } from './constants';
import { useCultivation } from '../contexts';
import { InsufficientJadePopup } from '../components';
import type { AgentChatProps, StructuredOutput, MultiAnswerResult } from './types';
import styles from './AgentChat.module.css';

// 角色标题映射
const ROLE_TITLES: Record<string, string> = {
  general: '小精灵',
  taskCreator: '任务助手',
  checklistHelper: '清单助手',
  taskConfigHelper: '配置助手',
};

export function AgentChat({
  role,
  className,
  onStructuredOutput,
  placeholder = 'message',
  onClose,
  hideHeader = false,
  initialMessage,
  userInfo,
}: AgentChatProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // 灵玉系统
  const { spiritJadeData, spendSpiritJade } = useCultivation();

  // 灵玉不足弹窗
  const [insufficientJadeVisible, setInsufficientJadeVisible] = useState(false);

  // 流式对话
  const { messages, sendMessage, stopStreaming, isStreaming, tokenUsage } = useStreamChat({
    role,
    userInfo,
  });

  // Token 消耗管理
  const { canChat, addCompletionTokens, accumulatedTokens } = useAITokenCost({
    spiritJadeBalance: spiritJadeData.balance,
    spendSpiritJade,
  });

  // 监听 tokenUsage 变化，累计 completionTokens
  useEffect(() => {
    if (tokenUsage && tokenUsage.completionTokens > 0) {
      addCompletionTokens(tokenUsage.completionTokens);
    }
  }, [tokenUsage, addCompletionTokens]);

  // 自动发送初始消息
  const initialMessageSentRef = useRef(false);
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current && messages.length === 0) {
      initialMessageSentRef.current = true;
      // 延迟发送，确保组件已完全渲染
      const timer = setTimeout(() => {
        sendMessage(initialMessage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialMessage, messages.length, sendMessage]);

  // 获取当前角色的欢迎配置
  const welcomeConfig = WELCOME_CONFIGS[role];

  // 包装发送消息，检查灵玉是否充足
  const handleSendMessage = useCallback((content: string) => {
    if (!canChat) {
      setInsufficientJadeVisible(true);
      return;
    }
    sendMessage(content);
  }, [canChat, sendMessage]);

  // 快捷问话点击处理
  const handleQuickQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  // 追问回答处理（支持单问题 string 和多问题 MultiAnswerResult）
  const handleFollowupAnswer = useCallback((answer: string | MultiAnswerResult) => {
    if (!canChat) {
      setInsufficientJadeVisible(true);
      return;
    }
    if (typeof answer === 'string') {
      sendMessage(answer);
    } else {
      // 多问题模式：使用汇总字符串发送
      sendMessage(answer.summary);
    }
  }, [canChat, sendMessage]);

  // ActionPreview 确认处理
  const handleActionConfirm = useCallback((output: StructuredOutput) => {
    onStructuredOutput?.(output);
  }, [onStructuredOutput]);

  // ActionPreview 取消处理 - 发送消息让 AI 继续对话
  const handleActionCancel = useCallback((_messageId: string) => {
    // 发送取消反馈，让 AI 继续讨论新的计划
    sendMessage('我想调整一下方案，请帮我重新规划');
  }, [sendMessage]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 头部 - 可隐藏 */}
      {!hideHeader && (
        <div className={styles.header}>
          <div className={styles.title}>{ROLE_TITLES[role] || '对话'}</div>
          {onClose && (
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* 消息列表 - 包含追问 UI 和 ActionPreview */}
      <MessageList
        ref={listRef}
        messages={messages}
        welcomeImage={welcomeConfig?.image}
        quickQuestions={welcomeConfig?.quickQuestions}
        onQuickQuestion={handleQuickQuestion}
        onFollowupAnswer={handleFollowupAnswer}
        onActionConfirm={handleActionConfirm}
        onActionCancel={handleActionCancel}
      />

      {/* 输入框 */}
      <ChatInput
        onSend={handleSendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder={canChat ? placeholder : '灵玉不足，无法发起对话'}
        disabled={!canChat}
      />

      {/* 灵玉不足弹窗 */}
      <InsufficientJadePopup
        visible={insufficientJadeVisible}
        currentBalance={spiritJadeData.balance}
        requiredAmount={5}
        onClose={() => setInsufficientJadeVisible(false)}
      />
    </div>
  );
}

export default AgentChat;
