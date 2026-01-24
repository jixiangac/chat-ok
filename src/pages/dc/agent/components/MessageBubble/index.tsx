/**
 * 消息气泡组件
 * 用户消息使用奶油风随机配色，AI 消息使用半透明毛玻璃效果
 * AI 消息使用 ReactMarkdown 渲染 Markdown
 * AI 消息会过滤掉隐藏的 JSON 配置内容
 * AI 消息支持显示推荐追问问题
 */

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { filterHiddenContent, parseSuggestedQuestions } from '../../hooks';
import type { MessageBubbleProps } from '../../types';
import { LoadingText } from '../LoadingText';
import { SuggestedQuestions } from '../SuggestedQuestions';
import styles from './styles.module.css';

// 奶油风用户气泡配色（浅色 -> 深色渐变）
const USER_BUBBLE_COLORS = [
  { from: '#F6EFEF', to: '#E0CEC6' }, // 奶油粉 -> 淡玫瑰
  { from: '#F1F1E8', to: '#D6CBBD' }, // 奶油绿 -> 暖灰
  { from: '#F2F0EB', to: '#D6CBBD' }, // 奶油灰 -> 暖灰
  { from: '#E6D6BB', to: '#D5C4C0' }, // 复古米 -> 肉桂粉
  { from: '#E8E1B8', to: '#D6CBBD' }, // 奶油黄 -> 暖灰
];

// 根据消息 ID 生成稳定的颜色索引
function getColorIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % USER_BUBBLE_COLORS.length;
}

export function MessageBubble({ message, role, isLatest, onSuggestedQuestion }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';
  const isComplete = message.status === 'complete';

  // 用户消息使用基于 ID 的稳定随机颜色
  const userBubbleStyle = useMemo(() => {
    if (!isUser) return undefined;
    const colorIndex = getColorIndex(message.id);
    const color = USER_BUBBLE_COLORS[colorIndex];
    return {
      background: `linear-gradient(135deg, ${color.from} 0%, ${color.to} 100%)`,
      boxShadow: `0 2px 6px rgba(214, 203, 189, 0.3)`,
    };
  }, [isUser, message.id]);

  // AI 消息过滤掉隐藏的配置内容
  const displayContent = useMemo(() => {
    if (isUser) return message.content;
    return filterHiddenContent(message.content);
  }, [isUser, message.content]);

  // AI 消息解析推荐追问问题（仅完成状态时解析）
  const suggestedQuestions = useMemo(() => {
    if (isUser || !isComplete) return [];
    return parseSuggestedQuestions(message.content);
  }, [isUser, isComplete, message.content]);

  // 等待中状态：正在流式输出但可见内容为空
  // 注意：必须用 displayContent 判断，因为 message.content 可能包含隐藏配置
  const isWaiting = isStreaming && !displayContent.trim();

  // 内容为空时不渲染气泡（避免空气泡）
  // 但流式输出中允许显示空内容（等待内容填充）
  // 错误状态下必须显示，即使内容为空
  if (!displayContent.trim() && !isStreaming && !isError) {
    return null;
  }

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}
      data-status={message.status}
    >
      <div className={`${styles.content} ${isError ? styles.errorContent : ''}`} style={userBubbleStyle}>
        {isError ? (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{displayContent || '请求失败，请稍后重试'}</span>
          </div>
        ) : isUser ? (
          displayContent
        ) : isWaiting ? (
          <LoadingText messageId={message.id} role={role} />
        ) : (
          <>
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
            </div>
            {/* 推荐追问（仅最后一条 AI 消息时显示） */}
            {suggestedQuestions.length > 0 && isLatest && (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onQuestionClick={(q) => onSuggestedQuestion?.(q)}
              />
            )}
          </>
        )}
        {isStreaming && !isWaiting && <span className={styles.cursor}>|</span>}
      </div>
    </div>
  );
}

export default MessageBubble;
