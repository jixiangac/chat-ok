/**
 * 消息列表组件
 * 支持自动滚动到底部、欢迎界面、快捷问话
 */

import { forwardRef, useEffect, useRef } from 'react';
import { MessageBubble } from '../MessageBubble';
import type { MessageListProps } from '../../types';
import styles from './styles.module.css';

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, welcomeImage, quickQuestions, onQuickQuestion }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const actualRef = (ref as React.RefObject<HTMLDivElement>) || containerRef;

    // 自动滚动到底部
    useEffect(() => {
      if (actualRef.current) {
        actualRef.current.scrollTop = actualRef.current.scrollHeight;
      }
    }, [messages, actualRef]);

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
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
    );
  }
);

export default MessageList;
