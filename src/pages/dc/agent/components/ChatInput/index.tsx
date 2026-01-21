/**
 * 聊天输入框组件
 * fullmoon 风格：pill 形状浅灰背景，圆形发送按钮
 */

import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, Square } from 'lucide-react';
import type { ChatInputProps } from '../../types';
import styles from './styles.module.css';

export function ChatInput({
  onSend,
  onStop,
  isStreaming = false,
  placeholder = 'message',
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // 自动调整高度
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !disabled && !isStreaming) {
      onSend(trimmed);
      setValue('');
      // 重置高度
      const textarea = document.querySelector(`.${styles.textarea}`) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }, [value, disabled, isStreaming, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleStop = useCallback(() => {
    onStop?.();
  }, [onStop]);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isStreaming}
          rows={1}
        />
        {isStreaming ? (
          <button
            type="button"
            className={`${styles.button} ${styles.stopButton}`}
            onClick={handleStop}
            aria-label="停止生成"
          >
            <Square size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            aria-label="发送"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
