/**
 * 消息列表组件
 * 支持自动滚动到底部、欢迎界面、快捷问话
 * 支持不同类型消息的渲染（文本、追问）
 */

import { forwardRef, useEffect, useRef } from 'react';
import { MessageBubble } from '../MessageBubble';
import { FollowupQuestion } from '../FollowupQuestion';
import { ActionPreview } from '../ActionPreview';
import type { MessageListProps, Message } from '../../types';
import styles from './styles.module.css';

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, welcomeImage, quickQuestions, onQuickQuestion, onFollowupAnswer, onActionConfirm, onActionCancel, role }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const actualRef = (ref as React.RefObject<HTMLDivElement>) || containerRef;

    // 自动滚动到底部
    useEffect(() => {
      if (actualRef.current) {
        actualRef.current.scrollTop = actualRef.current.scrollHeight;
      }
    }, [messages, actualRef]);

    // 渲染单条消息
    const renderMessage = (message: Message, index: number) => {
      const isLastMessage = index === messages.length - 1;

      // 追问类型消息（只有最后一条才可交互）
      if (message.type === 'followup' && message.followupData) {
        return (
          <FollowupQuestion
            key={message.id}
            data={message.followupData}
            onAnswer={(answer) => onFollowupAnswer?.(answer)}
            onCancel={() => {/* 暂不处理取消 */}}
            disabled={!isLastMessage}
          />
        );
      }
      // 操作预览类型消息（只有最后一条才显示按钮）
      if (message.type === 'action_preview' && message.actionPreviewData) {
        const actionData = message.actionPreviewData;
        return (
          <ActionPreview
            key={message.id}
            output={actionData}
            onConfirm={() => onActionConfirm?.(actionData)}
            onCancel={() => onActionCancel?.(message.id)}
            showActions={isLastMessage}
          />
        );
      }
      // 普通文本消息
      return <MessageBubble key={message.id} message={message} role={role} />;
    };

    // 空状态 - 显示欢迎界面
    if (messages.length === 0) {
      return (
        <div ref={actualRef} className={styles.container}>
          <div className={styles.welcome}>
            {/* 欢迎图片 */}
            {welcomeImage && (
              <div className={styles.welcomeImageWrapper}>
                <img
                  src={welcomeImage}
                  alt="欢迎"
                  className={styles.welcomeImage}
                />
              </div>
            )}

            {/* 快捷问话 */}
            {quickQuestions && quickQuestions.length > 0 && (
              <div className={styles.quickQuestions}>
                <div className={styles.quickQuestionsTitle}>试试这样问我：</div>
                <div className={styles.quickQuestionsList}>
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className={styles.quickQuestionBtn}
                      onClick={() => onQuickQuestion?.(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={actualRef} className={styles.container}>
        <div className={styles.messageList}>
          {messages.map((message, index) => renderMessage(message, index))}
        </div>
      </div>
    );
  }
);

export default MessageList;
