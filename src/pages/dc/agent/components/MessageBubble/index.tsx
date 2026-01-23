/**
 * 消息气泡组件
 * 用户消息使用奶油风随机配色，AI 消息使用半透明毛玻璃效果
 * AI 消息使用 ReactMarkdown 渲染 Markdown
 * AI 消息会过滤掉隐藏的 JSON 配置内容
 */

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { filterHiddenContent } from '../../hooks';
import type { MessageBubbleProps } from '../../types';
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

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';

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

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}
      data-status={message.status}
    >
      <div className={styles.content} style={userBubbleStyle}>
        {isUser ? (
          displayContent
        ) : (
          <div className={styles.markdown}>
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}
        {isStreaming && <span className={styles.cursor}>|</span>}
      </div>
      {isError && <div className={styles.errorHint}>发送失败</div>}
    </div>
  );
}

export default MessageBubble;
