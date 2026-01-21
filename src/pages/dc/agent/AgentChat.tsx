/**
 * AgentChat 主组件
 * 支持多角色切换、流式输出、结构化输出回调
 */

import { useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { MessageList, ChatInput, ActionPreview } from './components';
import { useStreamChat } from './hooks';
import { WELCOME_CONFIGS } from './constants';
import type { AgentChatProps, StructuredOutput } from './types';
import styles from './AgentChat.module.css';

// 角色标题映射
const ROLE_TITLES: Record<string, string> = {
  general: '小精灵',
  taskCreator: '任务助手',
  checklistHelper: '清单助手',
};

export function AgentChat({
  role,
  className,
  onStructuredOutput,
  placeholder = 'message',
  onClose,
  hideHeader = false,
}: AgentChatProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pendingOutput, setPendingOutput] = useState<StructuredOutput | null>(null);

  // 处理结构化输出
  const handleStructuredOutput = useCallback((output: StructuredOutput) => {
    setPendingOutput(output);
  }, []);

  const { messages, sendMessage, stopStreaming, isStreaming } = useStreamChat({
    role,
    onStructuredOutput: handleStructuredOutput,
  });

  // 获取当前角色的欢迎配置
  const welcomeConfig = WELCOME_CONFIGS[role];

  // 快捷问话点击处理
  const handleQuickQuestion = useCallback((question: string) => {
    sendMessage(question);
  }, [sendMessage]);

  // 确认结构化输出
  const handleConfirm = useCallback(() => {
    if (pendingOutput && onStructuredOutput) {
      onStructuredOutput(pendingOutput);
    }
    setPendingOutput(null);
  }, [pendingOutput, onStructuredOutput]);

  // 取消结构化输出
  const handleCancel = useCallback(() => {
    setPendingOutput(null);
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

      {/* 消息列表 */}
      <MessageList
        ref={listRef}
        messages={messages}
        welcomeImage={welcomeConfig?.image}
        quickQuestions={welcomeConfig?.quickQuestions}
        onQuickQuestion={handleQuickQuestion}
      />

      {/* 结构化输出预览 */}
      {pendingOutput && (
        <ActionPreview
          output={pendingOutput}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {/* 输入框 */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder={placeholder}
        disabled={!!pendingOutput}
      />
    </div>
  );
}

export default AgentChat;
