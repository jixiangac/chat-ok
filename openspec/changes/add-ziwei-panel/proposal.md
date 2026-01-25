# Change: 添加紫微斗数命盘面板

## Why

用户需要一个基于紫微斗数的命理分析工具，结合现有的 AI Chat 能力，提供专业的命盘排盘和深度解读功能。这是一个独立的功能模块，可作为 DC 系统的特色玩法入口，增强用户体验和系统的趣味性。

参考 `wiki/sm.js` 中的紫微斗数应用实现，复刻并增强其功能，与现有的 Agent Chat 能力深度整合。

## What Changes

### 新增功能
- **出生信息输入**：支持年月日时分、出生城市、性别选择
- **命盘排盘计算**：
  - 真太阳时校正（基于城市经纬度）
  - 十二宫位计算（命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、事业、田宅、福德、父母）
  - 星曜分配（十四主星、辅星、四化星）
- **命盘可视化**：传统十二宫格局展示，支持点击查看宫位详情
- **AI 分析模块**：
  - 格式化报告（财官分析、情感分析）
  - 自由对话模式（基于命盘数据与 AI 互动）
  - 两者结合，提供深度解读

### 新增组件
- `components/ZiweiBirthForm/` - 出生信息输入表单
- `components/ZiweiChart/` - 命盘可视化组件
- `components/ZiweiPalaceDetail/` - 宫位详情展示
- `components/ZiweiAnalysisReport/` - 格式化分析报告
- `panels/ZiweiPanel/` - 紫微斗数主面板

### 新增工具/常量
- `utils/ziwei.ts` - 命盘计算核心算法
- `constants/ziwei.ts` - 星曜、地支、城市等常量数据
- `types/ziwei.ts` - 紫微斗数相关类型定义

## Impact

- **Affected specs**: 新增 `ziwei-panel` 规格
- **Affected code**: 
  - `src/pages/dc/panels/` - 新增 ZiweiPanel
  - `src/pages/dc/components/` - 新增多个紫微相关组件
  - `src/pages/dc/utils/` - 新增命盘计算工具
  - `src/pages/dc/constants/` - 新增星曜常量
  - `src/pages/dc/types/` - 新增类型定义
- **Dependencies**: 复用现有的 `AgentChat` 组件实现 AI 对话功能
