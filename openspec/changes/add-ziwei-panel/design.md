# Design: 紫微斗数命盘面板

## Context

紫微斗数是中国传统命理学的重要分支，通过出生时间推演命盘，分析人的命运走向。本设计将传统的紫微斗数排盘逻辑与现代 AI 分析能力结合，创建一个既专业又有趣的命理工具。

**参考实现**: `wiki/sm.js` - 一个完整的紫微斗数 React 应用

**约束条件**:
- 必须在 `src/pages/dc/` 目录下实现
- 复用现有的 `AgentChat` 组件
- 遵循 DC 模块的设计规范（Notion 风格）
- 命盘计算在前端完成，不依赖后端 API

## 入口设计

**位置**: 紧贴纪念日图标下方（在 `spriteSection` 区域 right: 13px）

**图标**: `https://gw.alicdn.com/imgextra/i1/O1CN01rsx1k21rO10eJEV9y_!!6000000005620-2-tps-1080-966.png`

**尺寸**: 40x40px（与纪念日图标一致）

```css
.ziweiWrapper {
  position: absolute;
  right: 13px;
  top: 72px; /* 纪念日图标(28px) + 图标高度(40px) + 间距(4px) */
}
```

## 弹窗设计

**类型**: antd-mobile `Popup` 组件，position="bottom"

**高度**: 85vh（与创建任务弹窗一致）

**样式**: **完全复用 `CreateTaskModal` 的样式**（白色背景、简约风格、分步指示器）

## 4步页面流程

| 步骤 | 页面 | 内容 |
|------|------|------|
| **第1步** | 介绍页 IntroPage | 动态展示命盘特点 + “开始排盘”按钮 |
| **第2步** | 输入页 BirthFormPage | 日期类型、出生日期时间、城市、性别 |
| **第3步** | 结果页 ChartResultPage | 命盘图（仅概览不可点）+ Tab分类报告（财运/感情/事业）|
| **第4步** | 分析页 AnalysisPage | AI分析对话（命盘数据作为系统提示词）|

## 出生信息表单（同 sm.js）

| 字段 | 类型 | 说明 |
|------|------|------|
| dateType | 'solar' \| 'lunar' | 日期类型：阳历/阴历 |
| year | number | 出生年 (1900-2100) |
| month | number | 出生月 (1-12) |
| day | number | 出生日 (1-31) |
| hour | number | 出生时 (0-23) |
| minute | number | 出生分 (0-59) |
| city | string | 出生城市（用于真太阳时校正） |
| gender | 'male' \| 'female' | 性别：男/女 |

## Goals / Non-Goals

### Goals
- 提供准确的紫微斗数命盘排盘功能
- 支持真太阳时校正
- 提供直观的命盘可视化界面
- 整合 AI Chat 实现智能解读
- 支持格式化报告和自由对话两种分析模式

### Non-Goals
- 不实现完整的紫微斗数专业算法（使用简化版本）
- 不提供大运、流年等高级功能（初期版本）
- 不做付费功能
- 不存储用户命盘数据到服务器

## Decisions

### 1. 命盘计算策略

**Decision**: 采用前端本地计算，参考 sm.js 的简化算法

**Rationale**: 
- 减少服务器依赖，提升响应速度
- 用户隐私保护，出生信息不上传
- sm.js 已有可用的实现参考

**Implementation**:
```typescript
// utils/ziwei.ts
interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: string;
  gender: 'male' | 'female';
}

interface ChartData {
  birthInfo: BirthInfo;
  trueSolarTime: { hour: number; minute: number };
  mingGongIndex: number;
  palaces: Record<PalaceKey, Palace>;
}

// 真太阳时校正
function calculateTrueSolarTime(birthInfo: BirthInfo): { hour: number; minute: number };

// 命宫计算
function calculateMingGongIndex(birthInfo: BirthInfo): number;

// 生成完整命盘
function generateChart(birthInfo: BirthInfo): ChartData;
```

### 2. UI 组件架构

**Decision**: 作为独立技能模块放在 `dc/skills/ziwei/` 目录

## 目录结构

```
src/pages/dc/skills/ziwei/
├── index.tsx                    # 主入口 ZiweiPanel
├── types.ts                     # 类型定义
├── constants.ts                 # 常量（星曜、地支、城市经纬度）
├── utils.ts                     # 命盘计算工具
├── styles.module.css            # 样式（参考 CreateTaskModal 样式）
├── pages/                       # 页面组件
│   ├── IntroPage.tsx            # 第1步：介绍页
│   ├── BirthFormPage.tsx        # 第2步：输入页
│   ├── ChartResultPage.tsx      # 第3步：结果页
│   └── AnalysisPage.tsx         # 第4步：AI分析页
└── components/                  # 子组件
    ├── ZiweiChart/              # 命盘图（12宫格）
    └── ZiweiAnalysisReport/     # Tab分类报告
```

## 组件架构

```
ZiweiPanel (主弹窗 - 强制参考 CreateTaskModal 样式)
├── StepProgressBar (参考创建任务的分步指示器 - 4步)
├── IntroPage (第1步：介绍页)
│   ├── 动态展示命盘特点
│   └── BottomNavigation (参考创建任务的底部导航)
├── BirthFormPage (第2步：输入页 - 参考创建任务的表单样式)
│   ├── 日期类型切换（阳历/阴历）
│   ├── 出生日期选择（年/月/日）
│   ├── 出生时间选择（时/分）
│   ├── 出生城市选择
│   ├── 性别选择（男/女）
│   └── BottomNavigation
├── ChartResultPage (第3步：结果页)
│   ├── ZiweiChart (传统12宫格 - 仅概览不可点)
│   ├── Tab分类报告（财运/感情/事业）
│   └── BottomNavigation (“保存命盘” + “AI分析”)
└── AnalysisPage (第4步：AI分析页 - 参考 AgentChat 样式)
    └── AgentChat (命盘数据注入系统提示词)
```

### 3. 状态管理

**Decision**: 使用本地状态 + localStorage 持久化（仅保存最近一次）

**保存时机**: 用户手动点击“保存命盘”按钮

**Rationale**:
- 命盘数据相对简单，不需要复杂的状态管理
- localStorage 可保存用户上次排盘结果
- 手动保存让用户有控制权

```typescript
// 存储结构 - 仅保存最近一次
interface ZiweiStorage {
  birthInfo: BirthInfo | null;
  chartData: ChartData | null;
  lastGeneratedAt: string | null;
}

const STORAGE_KEY = 'dc_ziwei_data';
```

### 4. AI 分析集成

**Decision**: 复用 AgentChatPopup，新增 `ziweiAnalyst` 角色

**AI 角色人设**: 专业严谨的命理分析师
- 客观详尽，注重数据
- 结合传统命理学知识
- 给出实用建议

**API**: 使用现有的 iflow.cn 线路

**灵玉消耗**: 
- 排盘免费
- AI 分析每次消耗 **100 灵玉**

**Implementation**:
```typescript
// 在 agent/constants.ts 中添加新角色
export const ROLE_PROMPTS = {
  // ... 现有角色
  ziweiAnalyst: `<role>紫微斗数命理分析师</role>
  
<persona>
你是一位资深的紫微斗数命理分析师，擅长解读命盘。你的分析客观严谨，
注重数据和逻辑推演，同时给出实用的建议。
</persona>

<style>
- 专业严谨，有理有据
- 解读命盘时引用具体星曜和宫位
- 给出切实可行的建议
- 适度结合现代生活场景
</style>`,
};

// 在使用时传入命盘上下文
<AgentChatPopup
  role="ziweiAnalyst"
  placeholder="问问关于你命盘的问题..."
  userInfo={{
    ...baseInfo,
    chartData: currentChartData, // 注入命盘数据
  }}
/>
```
```

### 5. 视觉设计

**Decision**: 强制参考创建任务弹窗样式（保持 UI 一致性）

**Rationale**:
- 保持与 DC 主界面风格一致
- 参考现有样式的设计语言（间距、颜色、圆角等）
- 用户体验统一

**强制参考列表**:

| 组件/样式 | 参考来源 |
|---------|------|
| Popup 弹窗 | 参考 CreateTaskModal 的 popupBody（85vh） |
| Header 头部 | 参考 CreateTaskModal 的 header |
| StepProgressBar | 参考创建任务的分步指示器样式 |
| BottomNavigation | 参考创建任务的底部导航样式 |
| 表单输入框 | 参考 CreateTaskModal 的 inputGroup/input |
| 按钮切换组 | 参考 CreateTaskModal 的 buttonGroup |
| 选择器入口 | 参考 CreateTaskModal 的 selectorEntry |
| AI 对话 | 参考 AgentChat 组件样式 |

## Component Interfaces

### ZiweiPanel

```typescript
interface ZiweiPanelProps {
  visible: boolean;
  onClose: () => void;
}

// 内部状态 - 4步流程
type ZiweiStep = 'intro' | 'input' | 'result' | 'analysis';

// 页面步骤映射
const PAGE_STEP_MAP = {
  intro: 1,
  input: 2,
  result: 3,
  analysis: 4,
};
```

### ZiweiBirthForm

```typescript
interface ZiweiBirthFormProps {
  initialValues?: Partial<BirthInfo>;
  onSubmit: (birthInfo: BirthInfo) => void;
  loading?: boolean;
}
```

### ZiweiChart

```typescript
interface ZiweiChartProps {
  chartData: ChartData;
  // 仅概览不可点，不需要点击事件
}
```

### ChartResultPage

```typescript
interface ChartResultPageProps {
  chartData: ChartData;
  onSave: () => void;           // 手动保存
  onAIAnalysis: () => void;     // 进入AI分析
  onBack: () => void;
}

// Tab分类
type AnalysisTab = 'wealth' | 'emotion' | 'career';
```

### ZiweiAnalysisReport

```typescript
interface ZiweiAnalysisReportProps {
  chartData: ChartData;
  activeTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
}
```

### IntroPage

```typescript
interface IntroPageProps {
  onStart: () => void;  // 点击“开始排盘”
}
```

## Data Models

### 十二宫位

```typescript
type PalaceKey = 
  | 'ming'      // 命宫
  | 'xiongdi'   // 兄弟
  | 'fuqi'      // 夫妻
  | 'zinv'      // 子女
  | 'caibo'     // 财帛
  | 'jie'       // 疾厄
  | 'qianyi'    // 迁移
  | 'jiaoyou'   // 交友
  | 'shiye'     // 事业
  | 'tianzhai'  // 田宅
  | 'fude'      // 福德
  | 'fumu';     // 父母

interface Palace {
  earthlyBranch: string;  // 地支
  stars: {
    major: string[];      // 主星
    minor: string[];      // 辅星
    hua: string[];        // 四化星
  };
}
```

### 星曜数据

```typescript
// 十四主星
const MAJOR_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
];

// 辅星
const MINOR_STARS = [
  '文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '擎羊', '陀罗', '火星', '铃星', '天空', '地劫',
  '禄存', '天马', '红鸾', '天喜', '孤辰', '寡宿'
];

// 四化
const HUA_STARS = ['化禄', '化权', '化科', '化忌'];

// 十二地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
```

## Risks / Trade-offs

### Risk 1: 命盘算法精确性
- **风险**: 简化算法可能不够专业
- **缓解**: 明确声明"仅供娱乐参考"，不做专业命理工具定位

### Risk 2: AI 分析质量
- **风险**: AI 可能生成不准确或矛盾的命理解读
- **缓解**: 设计结构化的 prompt，限定回复范围；提供"查看推演逻辑"功能

### Risk 3: 用户隐私
- **风险**: 出生信息是敏感数据
- **缓解**: 纯前端计算，不上传服务器；localStorage 存储可随时清除

## Migration Plan

无迁移需求，这是一个全新功能。

## Open Questions

1. 是否需要添加“大运”、“流年”等高级功能？（建议后续版本考虑）
2. 是否需要分享命盘功能？（可生成图片分享）
