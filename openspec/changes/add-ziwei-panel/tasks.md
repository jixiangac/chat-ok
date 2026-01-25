## 1. 基础设施

- [x] 1.1 创建目录 `src/pages/dc/skills/ziwei/`
- [x] 1.2 创建类型定义 `skills/ziwei/types.ts`
- [x] 1.3 创建常量文件 `skills/ziwei/constants.ts`（星曜、地支、城市经纬度）
- [x] 1.4 创建命盘计算工具 `skills/ziwei/utils.ts`

## 2. 核心组件开发

- [x] 2.1 创建介绍页 `skills/ziwei/pages/IntroPage.tsx`（参考 BottomNavigation 样式）
- [x] 2.2 创建输入页 `skills/ziwei/pages/BirthFormPage.tsx`（参考创建任务表单样式）
- [x] 2.3 创建命盘图组件 `skills/ziwei/components/ZiweiChart/`（仅概览不可点）
- [x] 2.4 创建Tab报告组件 `skills/ziwei/components/ZiweiAnalysisReport/`
- [x] 2.5 创建结果页 `skills/ziwei/pages/ChartResultPage.tsx`

## 3. AI 分析模块

- [x] 3.1 新增 AI 角色 `ziweiAnalyst`（在 agent/constants.ts）
- [x] 3.2 创建分析页 `skills/ziwei/pages/AnalysisPage.tsx`（参考 AgentChat 样式）
- [x] 3.3 实现命盘数据注入系统提示词
- [x] 3.4 实现灵玉消耗（复用现有 AI Token 累计机制，与其他 AI 角色保持一致）

## 4. 主面板整合

- [x] 4.1 创建主面板 `skills/ziwei/index.tsx`（强制参考 CreateTaskModal 样式）
- [x] 4.2 创建样式文件 `skills/ziwei/styles.module.css`（参考创建任务样式）
- [x] 4.3 实现4步页面导航（参考 StepProgressBar）
- [x] 4.4 实现手动保存功能（localStorage）
- [x] 4.5 实现已保存命盘自动加载

## 5. 入口与完善

- [x] 5.1 在 DCPage 添加紫微入口图标（紧贴纪念日图标下方）
- [x] 5.2 添加加载状态和错误处理
- [x] 5.3 测试验证完整流程（构建通过）

## 6. UI优化（参考用户反馈）

- [x] 6.1 进度指示器改为长条形样式（参考 StepProgressBar）
- [x] 6.2 操作按钮固定在底部（bottomNav 样式）
- [x] 6.3 选项选择UI参考创建任务配置样式（toggleButton）
- [x] 6.4 命盘UI改为紫色渐变风格（chartGrid 紫色主题）
- [x] 6.5 宫位点击弹窗呈现解读（PalaceModal 参考 RewardToast）
- [x] 6.6 宫位解读数据实现（getPalaceSummary 函数）
- [x] 6.7 构建验证通过
