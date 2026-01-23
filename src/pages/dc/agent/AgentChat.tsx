/**
 * AgentChat 主组件
 * 支持多角色切换、流式输出、结构化输出回调
 */

import { useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { MessageList, ChatInput } from './components';
import { useStreamChat } from './hooks';
import { WELCOME_CONFIGS } from './constants';
import type { AgentChatProps, StructuredOutput } from './types';
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
}: AgentChatProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, stopStreaming, isStreaming } = useStreamChat({
    role,
  });

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

  // 快捷问话点击处理
  const handleQuickQuestion = useCallback((question: string) => {
    sendMessage(question);
  }, [sendMessage]);

  // 追问回答处理
  const handleFollowupAnswer = useCallback((answer: string) => {
    sendMessage(answer);
  }, [sendMessage]);

  // ActionPreview 确认处理
  const handleActionConfirm = useCallback((output: StructuredOutput) => {
    onStructuredOutput?.(output);
  }, [onStructuredOutput]);

  // ActionPreview 取消处理（目前仅记录，不做额外操作）
  const handleActionCancel = useCallback((_messageId: string) => {
    // 可以在这里添加取消后的逻辑，比如从消息列表中移除该消息
  }, []);

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
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder={placeholder}
        disabled={false}
      />
    </div>
  );
}

export default AgentChat;
