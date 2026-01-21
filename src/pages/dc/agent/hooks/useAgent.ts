/**
 * Agent 初始化 Hook
 * 配置 iflow.cn API Client 和多角色 Agent 工厂
 */

import { useMemo } from 'react';
import { OpenAI } from 'openai';
import { Agent, setDefaultOpenAIClient } from '@openai/agents';
import { API_CONFIG, ROLE_PROMPTS, type AgentRole } from '../constants';

// 构建完整的 baseURL（OpenAI SDK 需要绝对 URL）
function getBaseURL() {
  // 浏览器环境：使用当前域名 + 代理路径
  // if (typeof window !== 'undefined') {
  //   return `${window.location.origin}${API_CONFIG.baseURL}`;
  // }
  // SSR 环境：直接使用原始 API
  return 'https://apis.iflow.cn/v1';
}

// 创建并配置 OpenAI Client
const client = new OpenAI({
  baseURL: getBaseURL(),
  apiKey: API_CONFIG.apiKey,
  dangerouslyAllowBrowser: true, // 浏览器端使用
});

// 设置为默认 Client
setDefaultOpenAIClient(client);

/**
 * 创建指定角色的 Agent
 */
export function createAgent(role: AgentRole, customPrompt?: string): Agent {
  const instructions = customPrompt ?? ROLE_PROMPTS[role];

  return new Agent({
    name: `${role}Assistant`,
    model: API_CONFIG.model,
    instructions,
  });
}

/**
 * useAgent Hook
 * 返回指定角色的 Agent 实例
 */
export function useAgent(role: AgentRole, customPrompt?: string) {
  const agent = useMemo(() => {
    return createAgent(role, customPrompt);
  }, [role, customPrompt]);

  return { agent, client };
}

export { client };
