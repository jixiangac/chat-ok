/**
 * AI Loading 状态文字组件
 * 根据不同角色显示不同风格的等待提示
 * - 配置助手/清单助手：严肃专业风格
 * - 通用聊天（小精灵）：算命大师风格，故作玄虚、俏皮、逗比
 */

import { useState, useEffect, useMemo } from 'react';
import type { AgentRole } from '../../constants';
import styles from './styles.module.css';

// ==================== 严肃专业风格（配置助手/任务创建/清单助手）====================
const PROFESSIONAL_TEXTS = [
  '🤔 思考中...',
  '📝 整理信息中...',
  '⚙️ 分析需求中...',
  '🔍 梳理方案中...',
  '📊 规划配置中...',
  '🎯 确认细节中...',
  '💡 优化方案中...',
  '📋 整合数据中...',
];

// ==================== 算命大师风格（通用聊天/小精灵）====================
// 玄虚类 - 故作高深
const MYSTIC_TEXTS = [
  '🔮 掐指一算...',
  '✨ 天机显现中...',
  '🌙 夜观星象...',
  '📿 卜算命理中...',
  '🎴 翻阅天书...',
  '🌌 参悟玄机中...',
  '⚡ 接收仙人电波...',
  '🏔️ 问道昆仑中...',
];

// 俏皮类 - 可爱有趣
const PLAYFUL_TEXTS = [
  '🐱 喵喵思考中...',
  '🌸 等我一下下~',
  '🧁 甜甜的答案制作中...',
  '🎀 正在包装天机...',
  '🦋 蝴蝶送信中...',
  '🌈 彩虹马上降临...',
  '🍵 泡杯茶的功夫...',
  '🧚 精灵施法中...',
];

// 逗比类 - 幽默搞笑
const FUNNY_TEXTS = [
  '🔄 CPU 冒烟了...',
  '🎲 掷骰子问苍天...',
  '🏃 神经元起飞中...',
  '🎹 脑内 BGM 响起...',
  '🎭 召唤戏精上身...',
  '🦄 骑独角兽找答案...',
  '🍜 吃碗面再说...',
  '🛸 外星人传输中...',
  '🐢 乌龟驮着答案来了...',
  '💤 差点睡着了抱歉...',
];

// 通用/小精灵角色使用的所有文字（混合风格）
const GENERAL_LOADING_TEXTS = [
  ...MYSTIC_TEXTS,
  ...PLAYFUL_TEXTS,
  ...FUNNY_TEXTS,
];

// 根据角色获取对应的文字列表
function getLoadingTexts(role?: AgentRole): string[] {
  switch (role) {
    case 'taskCreator':
    case 'taskConfigHelper':
    case 'checklistHelper':
      return PROFESSIONAL_TEXTS;
    case 'general':
    default:
      return GENERAL_LOADING_TEXTS;
  }
}

// 根据消息 ID 生成稳定的初始索引
function getInitialIndex(id: string, textsLength: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % textsLength;
}

interface LoadingTextProps {
  messageId?: string;  // 用于生成稳定的初始文字
  interval?: number;   // 切换间隔，默认 2500ms
  role?: AgentRole;    // AI 角色，用于决定文字风格
}

export function LoadingText({ messageId = '', interval = 2500, role }: LoadingTextProps) {
  // 根据角色获取对应的文字列表
  const loadingTexts = useMemo(() => getLoadingTexts(role), [role]);

  // 根据消息 ID 决定初始文字，保证同一条消息初始显示相同
  const initialIndex = useMemo(
    () => getInitialIndex(messageId, loadingTexts.length),
    [messageId, loadingTexts.length]
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // 先触发淡出
      setIsTransitioning(true);

      // 淡出后切换文字
      setTimeout(() => {
        setCurrentIndex((prev) => {
          // 随机选择下一个，但避免重复
          let next = Math.floor(Math.random() * loadingTexts.length);
          while (next === prev && loadingTexts.length > 1) {
            next = Math.floor(Math.random() * loadingTexts.length);
          }
          return next;
        });
        setIsTransitioning(false);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, loadingTexts.length]);

  return (
    <span className={`${styles.loadingText} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
      {loadingTexts[currentIndex]}
    </span>
  );
}

export default LoadingText;
