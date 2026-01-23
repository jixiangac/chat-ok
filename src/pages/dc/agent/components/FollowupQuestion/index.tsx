/**
 * 追问组件
 * 显示 AI 的推荐追问选项，用户可以点击选项快速回复
 * 设计风格：列表卡片式，左侧消息图标，右侧箭头
 */

import { useState } from 'react';
import { MessageCircle, ChevronRight, Send, PenLine } from 'lucide-react';
import type { FollowupQuestionData } from '../../types';
import styles from './styles.module.css';

interface FollowupQuestionProps {
  data: FollowupQuestionData;
  onAnswer: (answer: string) => void;
  onCancel: () => void;
}

export function FollowupQuestion({ data, onAnswer, onCancel: _onCancel }: FollowupQuestionProps) {
  // onCancel 预留用于未来可能的关闭按钮
  void _onCancel;
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // 只处理第一个问题
  const question = data.questions[0];
  if (!question) return null;

  const handleOptionClick = (value: string) => {
    onAnswer(value);
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      onAnswer(customInput.trim());
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 问题标题 */}
      <div className={styles.header}>
        <span className={styles.title}>{question.question}</span>
      </div>

      {/* 选项列表 */}
      <div className={styles.optionList}>
        {question.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={styles.optionItem}
            onClick={() => handleOptionClick(option.value)}
          >
            <MessageCircle size={18} className={styles.optionIcon} />
            <span className={styles.optionText}>{option.label}</span>
            <ChevronRight size={18} className={styles.arrowIcon} />
          </button>
        ))}

        {/* 自定义输入选项 */}
        {question.allowCustom !== false && !showCustomInput && (
          <button
            type="button"
            className={`${styles.optionItem} ${styles.customOption}`}
            onClick={() => setShowCustomInput(true)}
          >
            <PenLine size={18} className={styles.optionIcon} />
            <span className={styles.optionText}>自定义回答...</span>
            <ChevronRight size={18} className={styles.arrowIcon} />
          </button>
        )}
      </div>

      {/* 自定义输入框 */}
      {showCustomInput && (
        <div className={styles.customInputWrapper}>
          <input
            type="text"
            className={styles.customInput}
            placeholder="输入你的回答..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            autoFocus
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleCustomSubmit}
            disabled={!customInput.trim()}
          >
            <Send size={16} />
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setShowCustomInput(false)}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}

export default FollowupQuestion;
