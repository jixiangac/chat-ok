/**
 * 追问组件
 * 支持单问题和多问题队列两种模式
 * - 单问题：点击选项直接回调
 * - 多问题：垂直列表展示，统一提交
 * - 支持自定义输入（内嵌在选项位置）
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { FollowupQuestionData, MultiAnswerResult } from '../../types';
import styles from './styles.module.css';

interface FollowupQuestionProps {
  data: FollowupQuestionData;
  onAnswer: (answer: string | MultiAnswerResult) => void;
  onCancel: () => void;
  /** 是否已提交（外部控制锁定状态） */
  disabled?: boolean;
}

// 选项序号映射
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// 自定义输入的特殊标记前缀
const CUSTOM_PREFIX = '__CUSTOM__:';

export function FollowupQuestion({ data, onAnswer, onCancel: _onCancel, disabled = false }: FollowupQuestionProps) {
  void _onCancel;

  const questions = data.questions;
  const isMultiple = questions.length > 1;

  // 记录每个问题的选中答案
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // 当前聚焦的问题索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 是否已提交
  const [isSubmitted, setIsSubmitted] = useState(false);
  // 自定义输入状态：记录哪些问题正在自定义输入
  const [customInputActive, setCustomInputActive] = useState<Record<number, boolean>>({});
  // 自定义输入内容
  const [customInputValues, setCustomInputValues] = useState<Record<number, string>>({});

  // 问题卡片 refs，用于滚动定位
  const questionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // 输入框 refs
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  // 计算已回答的问题数量
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const isLocked = isSubmitted || disabled;

  // 处理选项点击
  const handleOptionClick = useCallback((questionIndex: number, value: string) => {
    if (isLocked) return;

    // 关闭该问题的自定义输入
    setCustomInputActive(prev => ({ ...prev, [questionIndex]: false }));

    // 单问题模式：直接回调
    if (!isMultiple) {
      onAnswer(value);
      return;
    }

    // 多问题模式：记录答案
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionIndex]: value };
      return newAnswers;
    });

    // 更新当前索引
    setCurrentIndex(questionIndex);

    // 如果不是最后一题，自动滚动到下一题
    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setTimeout(() => {
        const nextRef = questionRefs.current.get(nextIndex);
        if (nextRef) {
          nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setCurrentIndex(nextIndex);
        }
      }, 150);
    }
  }, [isLocked, isMultiple, onAnswer, questions.length]);

  // 处理自定义输入提交
  const handleCustomSubmit = useCallback((questionIndex: number) => {
    const value = customInputValues[questionIndex]?.trim();
    if (!value || isLocked) return;

    // 单问题模式：直接回调
    if (!isMultiple) {
      onAnswer(value);
      return;
    }

    // 多问题模式：记录自定义答案
    setAnswers(prev => ({ ...prev, [questionIndex]: `${CUSTOM_PREFIX}${value}` }));
    setCustomInputActive(prev => ({ ...prev, [questionIndex]: false }));

    // 如果不是最后一题，自动滚动到下一题
    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setTimeout(() => {
        const nextRef = questionRefs.current.get(nextIndex);
        if (nextRef) {
          nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setCurrentIndex(nextIndex);
        }
      }, 150);
    }
  }, [customInputValues, isLocked, isMultiple, onAnswer, questions.length]);

  // 处理确认提交
  const handleSubmit = useCallback(() => {
    if (!allAnswered || isLocked) return;

    // 构建汇总字符串（只包含回答，不包含问题）
    const summaryParts = questions.map((q, i) => {
      const answer = answers[i];
      // 检查是否是自定义答案
      if (answer.startsWith(CUSTOM_PREFIX)) {
        return answer.slice(CUSTOM_PREFIX.length);
      }
      const option = q.options.find(opt => opt.value === answer);
      return option?.label || answer;
    });

    const result: MultiAnswerResult = {
      answers,
      summary: summaryParts.join('；'),
    };

    setIsSubmitted(true);
    onAnswer(result);
  }, [allAnswered, isLocked, questions, answers, onAnswer]);

  // 单问题模式的自定义输入状态
  const [singleCustomActive, setSingleCustomActive] = useState(false);
  const [singleCustomValue, setSingleCustomValue] = useState('');
  const singleInputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (singleCustomActive && singleInputRef.current) {
      singleInputRef.current.focus();
    }
  }, [singleCustomActive]);

  // 单问题模式
  if (!isMultiple) {
    const question = questions[0];
    if (!question) return null;
    const customOptionIndex = question.options.length;

    return (
      <div className={`${styles.container} ${isLocked ? styles.locked : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>{question.question}</span>
        </div>
        <div className={styles.optionList}>
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={styles.optionItem}
              onClick={() => handleOptionClick(0, option.value)}
              disabled={isLocked}
            >
              <span className={styles.optionBadge}>{OPTION_LABELS[index]}</span>
              <span className={styles.optionText}>{option.label}</span>
            </button>
          ))}
          {/* 自定义输入选项 */}
          {!singleCustomActive ? (
            <button
              type="button"
              className={styles.optionItem}
              onClick={() => setSingleCustomActive(true)}
              disabled={isLocked}
            >
              <span className={styles.optionBadge}>{OPTION_LABELS[customOptionIndex]}</span>
              <span className={`${styles.optionText} ${styles.customPlaceholder}`}>或输入自定义答案</span>
            </button>
          ) : (
            <div className={`${styles.optionItem} ${styles.optionSelected}`}>
              <span className={`${styles.optionBadge} ${styles.badgeSelected}`}>{OPTION_LABELS[customOptionIndex]}</span>
              <input
                ref={singleInputRef}
                type="text"
                className={styles.inlineInput}
                placeholder="输入您的答案..."
                value={singleCustomValue}
                onChange={(e) => setSingleCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && singleCustomValue.trim()) {
                    onAnswer(singleCustomValue.trim());
                  }
                  if (e.key === 'Escape') {
                    setSingleCustomActive(false);
                    setSingleCustomValue('');
                  }
                }}
                onBlur={() => {
                  // 如果没有输入内容，失焦时关闭
                  if (!singleCustomValue.trim()) {
                    setSingleCustomActive(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 获取某个问题的答案显示文本
  const getAnswerDisplayText = (qIndex: number): string => {
    const selectedValue = answers[qIndex];
    if (!selectedValue) return '';

    // 检查是否是自定义答案
    if (selectedValue.startsWith(CUSTOM_PREFIX)) {
      return selectedValue.slice(CUSTOM_PREFIX.length);
    }

    // 查找对应的选项 label
    const question = questions[qIndex];
    const option = question.options.find(opt => opt.value === selectedValue);
    return option?.label || selectedValue;
  };

  // 已提交状态：显示简洁的问题+答案格式
  if (isLocked && allAnswered) {
    return (
      <div className={`${styles.container} ${styles.submittedContainer}`}>
        <div className={styles.submittedHeader}>
          <span className={styles.submittedIcon}>📋</span>
          <span className={styles.submittedTitle}>问题收集</span>
        </div>
        <div className={styles.submittedList}>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className={styles.submittedItem}>
              <div className={styles.submittedQuestion}>{question.question}</div>
              <div className={styles.submittedAnswer}>{getAnswerDisplayText(qIndex)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 多问题模式（未提交状态）
  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles.multiContainer}`}
    >
      {/* 固定头部：标题 + 进度指示器 */}
      <div className={styles.multiHeader}>
        <span className={styles.multiHeaderTitle}>请回答以下问题</span>
        <span className={styles.progressIndicator}>
          {answeredCount} / {questions.length}
        </span>
      </div>

      {/* 问题列表（可滚动区域） */}
      <div className={styles.questionList} ref={listRef}>
        {questions.map((question, qIndex) => {
          const selectedValue = answers[qIndex];
          const isAnswered = selectedValue !== undefined;
          const isCustomAnswer = selectedValue?.startsWith(CUSTOM_PREFIX);
          const customDisplayValue = isCustomAnswer ? selectedValue.slice(CUSTOM_PREFIX.length) : '';
          const isCustomInputOpen = customInputActive[qIndex];
          const customOptionIndex = question.options.length;

          return (
            <div
              key={qIndex}
              ref={(el) => {
                if (el) questionRefs.current.set(qIndex, el);
              }}
              className={`${styles.questionCard} ${isAnswered ? styles.questionAnswered : ''}`}
            >
              <div className={styles.questionTitle}>
                问题{qIndex + 1}：{question.question}
              </div>
              <div className={styles.optionList}>
                {question.options.map((option, oIndex) => {
                  // 当自定义输入激活时，常规选项不应显示选中状态
                  const isSelected = selectedValue === option.value && !isCustomInputOpen;

                  return (
                    <button
                      key={oIndex}
                      type="button"
                      className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                      onClick={() => handleOptionClick(qIndex, option.value)}
                      disabled={isLocked}
                    >
                      <span className={`${styles.optionBadge} ${isSelected ? styles.badgeSelected : ''}`}>
                        {OPTION_LABELS[oIndex]}
                      </span>
                      <span className={styles.optionText}>{option.label}</span>
                    </button>
                  );
                })}
                {/* 自定义输入选项 */}
                {!isCustomInputOpen ? (
                  <button
                    type="button"
                    className={`${styles.optionItem} ${isCustomAnswer ? styles.optionSelected : ''}`}
                    onClick={() => {
                      if (!isLocked) {
                        setCustomInputActive(prev => ({ ...prev, [qIndex]: true }));
                        // 如果已有自定义答案，预填充
                        if (isCustomAnswer) {
                          setCustomInputValues(prev => ({ ...prev, [qIndex]: customDisplayValue }));
                        }
                        // 延迟聚焦
                        setTimeout(() => {
                          inputRefs.current.get(qIndex)?.focus();
                        }, 50);
                      }
                    }}
                    disabled={isLocked}
                  >
                    <span className={`${styles.optionBadge} ${isCustomAnswer ? styles.badgeSelected : ''}`}>
                      {OPTION_LABELS[customOptionIndex]}
                    </span>
                    <span className={`${styles.optionText} ${!isCustomAnswer ? styles.customPlaceholder : ''}`}>
                      {isCustomAnswer ? customDisplayValue : '或输入自定义答案'}
                    </span>
                  </button>
                ) : (
                  <div className={`${styles.optionItem} ${styles.optionSelected}`}>
                    <span className={`${styles.optionBadge} ${styles.badgeSelected}`}>{OPTION_LABELS[customOptionIndex]}</span>
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current.set(qIndex, el);
                      }}
                      type="text"
                      className={styles.inlineInput}
                      placeholder="输入您的答案..."
                      value={customInputValues[qIndex] || ''}
                      onChange={(e) => setCustomInputValues(prev => ({ ...prev, [qIndex]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomSubmit(qIndex);
                        }
                        if (e.key === 'Escape') {
                          setCustomInputActive(prev => ({ ...prev, [qIndex]: false }));
                        }
                      }}
                      onBlur={() => {
                        // 如果有内容就提交，没内容就关闭
                        const value = customInputValues[qIndex]?.trim();
                        if (value) {
                          handleCustomSubmit(qIndex);
                        } else {
                          setCustomInputActive(prev => ({ ...prev, [qIndex]: false }));
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 确认提交按钮 */}
      <div className={styles.submitWrapper}>
        <button
          type="button"
          className={`${styles.submitButton} ${allAnswered ? styles.submitEnabled : ''}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          确认提交
        </button>
      </div>
    </div>
  );
}

export default FollowupQuestion;
