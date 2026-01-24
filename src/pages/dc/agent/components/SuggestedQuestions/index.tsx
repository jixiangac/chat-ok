/**
 * 推荐追问组件
 * 在 AI 回复末尾显示 1-2 个推荐问题，用户可点击直接发送
 */

import { MessageCircle, ChevronRight } from 'lucide-react';
import styles from './styles.module.css';

interface SuggestedQuestionsProps {
  /** 推荐问题列表 */
  questions: string[];
  /** 点击问题回调 */
  onQuestionClick: (question: string) => void;
}

export function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
  if (!questions.length) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>推荐追问</div>
      <div className={styles.list}>
        {questions.map((question, index) => (
          <button
            key={index}
            className={styles.questionBtn}
            onClick={() => onQuestionClick(question)}
          >
            <MessageCircle size={16} className={styles.icon} />
            <span className={styles.text}>{question}</span>
            <ChevronRight size={16} className={styles.arrow} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
