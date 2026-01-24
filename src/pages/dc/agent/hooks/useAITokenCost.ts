/**
 * AI 对话 Token 消耗管理 Hook
 *
 * 规则：
 * - 累计 completionTokens
 * - 每累计 10000 tokens 消耗 10 个灵玉
 * - 超过 10000 时随机触发扣减（避免每次都在固定点扣减）
 * - 灵玉不足 10 个时扣除剩余的
 * - 灵玉为 0 时不能发起新对话
 */

import { useState, useCallback, useEffect } from 'react';

// 存储 key
const STORAGE_KEY = 'ai_token_accumulator';

// 消耗规则
const TOKENS_PER_CHARGE = 3000; // 每 3000 tokens
const JADE_COST_PER_CHARGE = 5; // 消耗 5 灵玉

interface TokenAccumulator {
  /** 累计的 completion tokens */
  accumulatedTokens: number;
  /** 总共消耗的 tokens（历史记录） */
  totalConsumedTokens: number;
  /** 总共扣除的灵玉 */
  totalSpentJade: number;
  /** 上次更新时间 */
  lastUpdated: string;
}

interface UseAITokenCostOptions {
  /** 当前灵玉余额 */
  spiritJadeBalance: number;
  /** 消耗灵玉的函数 */
  spendSpiritJade: (params: {
    amount: number;
    source: string;
    description?: string;
  }) => boolean;
}

interface UseAITokenCostReturn {
  /** 当前累计的 tokens */
  accumulatedTokens: number;
  /** 是否可以发起对话（灵玉 > 0） */
  canChat: boolean;
  /** 添加 completion tokens 并检查是否需要扣减 */
  addCompletionTokens: (tokens: number) => void;
  /** 获取统计信息 */
  getStats: () => TokenAccumulator;
}

// 从 localStorage 读取累计数据
function loadAccumulator(): TokenAccumulator {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load token accumulator:', e);
  }
  return {
    accumulatedTokens: 0,
    totalConsumedTokens: 0,
    totalSpentJade: 0,
    lastUpdated: new Date().toISOString(),
  };
}

// 保存累计数据到 localStorage
function saveAccumulator(data: TokenAccumulator) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save token accumulator:', e);
  }
}

export function useAITokenCost(options: UseAITokenCostOptions): UseAITokenCostReturn {
  const { spiritJadeBalance, spendSpiritJade } = options;

  const [accumulator, setAccumulator] = useState<TokenAccumulator>(loadAccumulator);

  // 是否可以发起对话
  const canChat = spiritJadeBalance > 0;

  // 添加 completion tokens 并检查是否需要扣减
  const addCompletionTokens = useCallback((tokens: number) => {
    setAccumulator(prev => {
      const newAccumulated = prev.accumulatedTokens + tokens;
      const newTotalConsumed = prev.totalConsumedTokens + tokens;

      // 检查是否达到扣减阈值
      if (newAccumulated >= TOKENS_PER_CHARGE) {
        // 随机触发：超过阈值后有 30% 概率立即扣减，或者超过 1.5 倍阈值时必定扣减
        const shouldCharge = newAccumulated >= TOKENS_PER_CHARGE * 1.5 || Math.random() < 0.3;

        if (shouldCharge) {
          // 计算需要扣减多少灵玉
          const chargeTimes = Math.floor(newAccumulated / TOKENS_PER_CHARGE);
          let jadeToSpend = chargeTimes * JADE_COST_PER_CHARGE;

          // 如果灵玉不足，扣除剩余的
          if (jadeToSpend > spiritJadeBalance) {
            jadeToSpend = spiritJadeBalance;
          }

          if (jadeToSpend > 0) {
            const success = spendSpiritJade({
              amount: jadeToSpend,
              source: 'AI_CHAT',
              description: `AI 对话消耗 (${newAccumulated} tokens)`,
            });

            if (success) {
              console.log(`💎 AI 对话扣减 ${jadeToSpend} 灵玉 (累计 ${newAccumulated} tokens)`);

              // 扣减后重置累计值（保留余数）
              const remainingTokens = newAccumulated % TOKENS_PER_CHARGE;
              const updated: TokenAccumulator = {
                accumulatedTokens: remainingTokens,
                totalConsumedTokens: newTotalConsumed,
                totalSpentJade: prev.totalSpentJade + jadeToSpend,
                lastUpdated: new Date().toISOString(),
              };
              saveAccumulator(updated);
              return updated;
            }
          }
        }
      }

      // 不扣减，只更新累计值
      const updated: TokenAccumulator = {
        ...prev,
        accumulatedTokens: newAccumulated,
        totalConsumedTokens: newTotalConsumed,
        lastUpdated: new Date().toISOString(),
      };
      saveAccumulator(updated);
      return updated;
    });
  }, [spiritJadeBalance, spendSpiritJade]);

  // 获取统计信息
  const getStats = useCallback(() => accumulator, [accumulator]);

  return {
    accumulatedTokens: accumulator.accumulatedTokens,
    canChat,
    addCompletionTokens,
    getStats,
  };
}

export default useAITokenCost;
