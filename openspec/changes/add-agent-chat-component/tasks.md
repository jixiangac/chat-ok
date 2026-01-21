# Tasks: Add Agent Chat Component (Based on @openai/agents)

## Phase 1: 环境准备

- [ ] **T1.1** 安装 `@openai/agents` 和 `openai` 依赖
- [ ] **T1.2** 创建 `src/pages/dc/agent/` 目录结构
- [ ] **T1.3** 配置常量 `constants/index.ts`（API 配置、多角色 Prompt）
- [ ] **T1.4** 定义类型 `types/index.ts`（包含结构化输出类型）

## Phase 2: Agent 层实现

- [ ] **T2.1** 实现 `hooks/useAgent.ts` - 配置 iflow.cn Client + 多角色 Agent 工厂
- [ ] **T2.2** 实现 `hooks/useStreamChat.ts` - 流式对话 + 结构化输出解析

## Phase 3: UI 组件开发 (fullmoon 风格)

- [ ] **T3.1** 实现 `components/MessageBubble/` - 消息气泡组件
  - 用户消息：右侧黑色背景、白色文字、大圆角
  - AI 消息：左侧透明背景、纯文本
  - 流式输出状态（光标闪烁）
  
- [ ] **T3.2** 实现 `components/MessageList/` - 消息列表组件
  - 自动滚动到底部
  - 空状态展示
  
- [ ] **T3.3** 实现 `components/ChatInput/` - 输入框组件
  - pill 形状浅灰背景
  - 圆形发送按钮
  - 流式中显示停止按钮

- [ ] **T3.4** 实现 `components/ActionPreview/` - 结构化输出预览组件
  - 任务配置预览卡片
  - 清单项预览列表
  - 确认/取消按钮

## Phase 4: 主组件集成

- [ ] **T4.1** 实现 `AgentChat.tsx` - 主组件
  - 支持 role prop 切换角色
  - onStructuredOutput 回调
  - 状态管理与错误处理
  
- [ ] **T4.2** 创建 `index.tsx` 统一导出

## Phase 5: 入口集成

- [ ] **T5.1** 首页小精灵入口（通用聊天角色）
- [ ] **T5.2** CreateTaskModal AI 切换入口（任务创建角色）
- [ ] **T5.3** 清单界面 AI 入口（清单梳理角色）

## Phase 6: 验证

- [ ] **T6.1** 流式输出功能验证
- [ ] **T6.2** 结构化输出解析验证
- [ ] **T6.3** 各角色场景验证

## Dependencies

```
T1.1 → T1.2 → T1.3 → T1.4 (顺序依赖)
T1.4 → T2.1 → T2.2 (Agent 层依赖类型)
T2.2 → T4.1 (Hook 完成后集成)
T3.1 + T3.2 + T3.3 + T3.4 → T4.1 (组件完成后集成)
Phase 1-4 → Phase 5 (入口集成依赖组件完成)
Phase 5 → Phase 6 (验证依赖全部完成)
```

## Parallelizable Work

以下任务可并行进行：
- T2.1 + T3.1 + T3.2 + T3.3 + T3.4（Agent 层和 UI 层独立开发）
- T5.1 + T5.2 + T5.3（三个入口独立开发）

## 依赖包

```json
{
  "@openai/agents": "latest",
  "openai": "^4.x",
  "zod": "^4.x"
}
```

安装命令：
```bash
npm install @openai/agents openai zod
```
