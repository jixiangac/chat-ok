/**
 * AgentChat 主组件
 * 支持多角色切换、流式输出、结构化输出回调
 * 集成 token 消耗和灵玉扣减机制
 */

import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { MessageList, ChatInput } from './components';
import { useStreamChat, useAITokenCost } from './hooks';
import { WELCOME_CONFIGS } from './constants';
import { useCultivation, useScene } from '../contexts';
import { InsufficientJadePopup } from '../components';
import type { AgentChatProps, StructuredOutput, MultiAnswerResult, UserTaskContext, TaskSummary } from './types';
import type { Task } from '../types';
import styles from './AgentChat.module.css';

// 角色标题映射
const ROLE_TITLES: Record<string, string> = {
  general: '小精灵',
  taskCreator: '任务助手',
  checklistHelper: '清单助手',
  taskConfigHelper: '配置助手',
  ziweiAnalyst: '命理分析师',
};

/**
 * 将 Task 转换为 TaskSummary（用于 AI 上下文）
 */
function taskToSummary(task: Task, isTodayCompleted: (t: Task) => boolean): TaskSummary {
  const todayCompleted = isTodayCompleted(task);

  // 构建今日进度描述
  let todayProgressDesc = '';
  if (task.todayProgress) {
    if (task.category === 'CHECK_IN') {
      todayProgressDesc = `已打卡 ${task.todayProgress.todayCount} 次`;
    } else if (task.category === 'CHECKLIST') {
      // 清单型使用 todayCount 表示已完成项数
      todayProgressDesc = `已完成 ${task.todayProgress.todayCount} 项`;
    } else if (task.category === 'NUMERIC') {
      const unit = task.numericConfig?.unit || '';
      todayProgressDesc = `当前 ${task.todayProgress.todayValue}${unit}`;
    }
  }

  // 构建数值型进度描述
  let numericProgress = '';
  if (task.category === 'NUMERIC' && task.numericConfig) {
    const { startValue, targetValue, unit, direction, currentValue } = task.numericConfig;
    const arrow = direction === 'DECREASE' ? '→' : '→';
    numericProgress = `${currentValue ?? startValue}${unit} ${arrow} ${targetValue}${unit}`;
  }

  // 计算总体进度百分比
  let overallProgressPercent: number | undefined;
  if (task.progress?.totalPercentage !== undefined) {
    overallProgressPercent = Math.round(task.progress.totalPercentage);
  }

  // 当前周期信息
  let currentCycleInfo = '';
  if (task.cycle) {
    // 根据开始日期和周期天数计算当前周期和天数
    const startDate = task.time?.startDate;
    if (startDate) {
      const start = new Date(startDate);
      const now = new Date();
      const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDays = task.cycle.cycleDays || 10;
      const currentCycle = Math.floor(daysPassed / cycleDays) + 1;
      const cycleDay = (daysPassed % cycleDays) + 1;
      currentCycleInfo = `第${currentCycle}周期 第${cycleDay}天`;
    }
  }

  return {
    id: task.id,
    title: task.title,
    type: task.type,
    category: task.category,
    status: task.status,
    totalDays: task.cycle?.totalDays ?? 30,
    cycleDays: task.cycle?.cycleDays ?? 10,
    startDate: task.time?.startDate ?? '',
    currentCycleInfo,
    todayCompleted,
    todayProgressDesc,
    overallProgressPercent,
    numericProgress,
  };
}

export function AgentChat({
  role,
  className,
  onStructuredOutput,
  placeholder = 'message',
  onClose,
  hideHeader = false,
  initialMessage,
  userInfo,
  taskContext: externalTaskContext,
  extraContext,
}: AgentChatProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // 灵玉系统
  const { spiritJadeData, spendSpiritJade } = useCultivation();

  // 场景数据（用于获取任务列表）
  const { normal, getTasksByIds } = useScene();

  // 构建任务上下文（自动从 SceneProvider 获取）
  const autoTaskContext = useMemo<UserTaskContext>(() => {
    const { mainlineTasks, sidelineTasks, todayProgress, dailyViewTaskIds, isTodayCompleted } = normal;

    // 转换主线任务为摘要
    const mainlineTaskSummaries: TaskSummary[] = mainlineTasks.map(task =>
      taskToSummary(task, isTodayCompleted)
    );

    // 转换支线任务为摘要
    const sidelineTaskSummaries: TaskSummary[] = sidelineTasks.map(task =>
      taskToSummary(task, isTodayCompleted)
    );

    // 合并所有任务摘要
    const allTaskSummaries = [...mainlineTaskSummaries, ...sidelineTaskSummaries];

    // 获取今日一日清单中的任务摘要
    const dailyTasks = getTasksByIds(dailyViewTaskIds);
    const dailyTaskSummaries: TaskSummary[] = dailyTasks.map(task =>
      taskToSummary(task, isTodayCompleted)
    );

    // 计算今日完成/待完成数量（基于一日清单）
    const todayCompletedCount = dailyTaskSummaries.filter(t => t.todayCompleted).length;
    const todayPendingCount = dailyTaskSummaries.filter(t => !t.todayCompleted).length;

    return {
      activeTasks: allTaskSummaries,
      mainlineTasks: mainlineTaskSummaries,
      sidelineTasks: sidelineTaskSummaries,
      dailyTasks: dailyTaskSummaries,
      todayCompletedCount,
      todayPendingCount,
      todayProgressPercentage: todayProgress.percentage,
    };
  }, [normal, getTasksByIds]);

  // 优先使用外部传入的 taskContext，否则使用自动获取的
  const taskContext = externalTaskContext ?? autoTaskContext;

  // 灵玉不足弹窗
  const [insufficientJadeVisible, setInsufficientJadeVisible] = useState(false);

  // 流式对话（general 角色时注入任务上下文）
  const { messages, sendMessage, stopStreaming, isStreaming, tokenUsage } = useStreamChat({
    role,
    userInfo,
    taskContext: role === 'general' ? taskContext : undefined,
    extraContext,
  });

  // Token 消耗管理
  const { canChat, addCompletionTokens } = useAITokenCost({
    spiritJadeBalance: spiritJadeData.balance,
    spendSpiritJade,
  });

  // 监听 tokenUsage 变化，累计 completionTokens
  useEffect(() => {
    if (tokenUsage && tokenUsage.completionTokens > 0) {
      addCompletionTokens(tokenUsage.completionTokens);
    }
  }, [tokenUsage, addCompletionTokens]);

  // 自动发送初始消息
  const initialMessageSentRef = useRef(false);
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current && messages.length === 0) {
      initialMessageSentRef.current = true;
      // 延迟发送，确保组件已完全渲染
      const timer = setTimeout(() => {
        sendMessage(initialMessage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialMessage, messages.length, sendMessage]);

  // 获取当前角色的欢迎配置
  const welcomeConfig = WELCOME_CONFIGS[role];

  // 包装发送消息，检查灵玉是否充足
  const handleSendMessage = useCallback((content: string) => {
    if (!canChat) {
      setInsufficientJadeVisible(true);
      return;
    }
    sendMessage(content);
  }, [canChat, sendMessage]);

  // 快捷问话点击处理
  const handleQuickQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  // 追问回答处理（支持单问题 string 和多问题 MultiAnswerResult）
  const handleFollowupAnswer = useCallback((answer: string | MultiAnswerResult) => {
    if (!canChat) {
      setInsufficientJadeVisible(true);
      return;
    }
    if (typeof answer === 'string') {
      sendMessage(answer);
    } else {
      // 多问题模式：使用汇总字符串发送
      sendMessage(answer.summary);
    }
  }, [canChat, sendMessage]);

  // ActionPreview 确认处理
  const handleActionConfirm = useCallback((output: StructuredOutput) => {
    onStructuredOutput?.(output);
  }, [onStructuredOutput]);

  // ActionPreview 取消处理 - 发送消息让 AI 继续对话
  const handleActionCancel = useCallback((_messageId: string) => {
    // 发送取消反馈，让 AI 继续讨论新的计划
    sendMessage('我想调整一下方案，请帮我重新规划');
  }, [sendMessage]);

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

      {/* 消息列表 - 包含追问 UI 和 ActionPreview */}
      <MessageList
        ref={listRef}
        messages={messages}
        welcomeImage={welcomeConfig?.image}
        quickQuestions={welcomeConfig?.quickQuestions}
        onQuickQuestion={handleQuickQuestion}
        onFollowupAnswer={handleFollowupAnswer}
        onActionConfirm={handleActionConfirm}
        onActionCancel={handleActionCancel}
        role={role}
      />

      {/* 输入框 */}
      <ChatInput
        onSend={handleSendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        placeholder={canChat ? placeholder : '灵玉不足，无法发起对话'}
        disabled={!canChat}
      />

      {/* 灵玉不足弹窗 */}
      <InsufficientJadePopup
        visible={insufficientJadeVisible}
        currentBalance={spiritJadeData.balance}
        requiredAmount={5}
        onClose={() => setInsufficientJadeVisible(false)}
      />
    </div>
  );
}

export default AgentChat;
