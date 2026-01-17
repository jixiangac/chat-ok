## 1. 基础架构

- [x] 1.1 定义修仙等级相关类型 (`src/pages/dc/types/cultivation.ts`)
  - RealmType: 9 大境界枚举
  - StageType: 阶段枚举（初期/中期/后期/巅峰/大圆满 + 炼气层数）
  - CultivationData: 修炼数据接口
  - CultivationRecord: 修为记录接口
  - CultivationHistory: 历史记录接口
  - SeclusionState: 闭关状态接口
  - CurrentLevelInfo: 当前等级信息接口

- [x] 1.2 创建修为计算工具 (`src/pages/dc/utils/cultivation.ts`)
  - getLevelDisplayName(): 获取等级显示名称
  - getCurrentExpCap(): 获取当前等级修为上限
  - getCurrentLevelInfo(): 计算当前等级信息
  - getNextLevel(): 获取下一等级
  - getPreviousLevel(): 获取上一等级
  - isCrossRealmDemotion(): 检查是否跨大境界降级
  - getSeclusionInfo(): 计算闭关信息
  - getLevelIndex(): 获取等级索引
  - compareLevels(): 比较两个等级
  - formatExp(): 格式化修为数值
  - getWeekKey(): 获取周 key

- [x] 1.3 创建境界常量配置 (`src/pages/dc/constants/cultivation.ts`)
  - REALM_CONFIG: 境界配置（名称、颜色、图标）
  - STAGE_CONFIG: 阶段配置
  - LIANQI_LAYER_NAMES: 炼气期层数名称
  - TASK_EXP_CONFIG: 任务类型修为配置
  - CYCLE_REWARD_CONFIG: 周期奖励配置
  - PENALTY_CONFIG: 惩罚分档配置
  - SECLUSION_CONFIG: 闭关配置
  - getExpCap(): 修为上限计算函数
  - getAllLevelExpCaps(): 获取所有等级修为范围

## 2. 状态管理

- [x] 2.1 创建 CultivationContext (`src/pages/dc/contexts/CultivationProvider/`)
  - CultivationProvider 组件
  - useCultivation hook
  - types.ts: 类型定义
  - storage.ts: 数据持久化

- [x] 2.2 实现数据持久化
  - loadCultivationData(): 加载修仙数据
  - saveCultivationData(): 保存修仙数据
  - loadCultivationHistory(): 加载历史记录
  - saveCultivationHistory(): 保存历史记录
  - clearCultivationData(): 清除数据
  - exportCultivationData(): 导出数据
  - importCultivationData(): 导入数据

- [x] 2.3 实现修为变动方法
  - addExp(): 增加修为
  - reduceExp(): 扣除修为（含降级逻辑）
  - gainExpFromCheckIn(): 任务打卡获得修为
  - applyCycleReward(): 周期结算奖励
  - applyCyclePenalty(): 周期结算惩罚
  - breakthrough(): 执行突破
  - checkSeclusionEnd(): 检查闭关结果

## 3. 任务系统集成

- [ ] 3.1 任务打卡集成修为获取
  - 数值型任务打卡 → +10 修为
  - 清单型任务完成项 → +5 修为
  - 打卡型任务打卡 → +8 修为
  - 记录到历史

- [ ] 3.2 周期结算集成
  - 完成度 ≥30% → 发放奖励修为
  - 完成度 100% → 额外 +20% 加成
  - 完成度 <30% → 扣除修为（按境界分档）
  - 记录到历史

- [ ] 3.3 闭关状态检查
  - 每日检查闭关是否到期
  - 到期后判定成功/失败
  - 失败执行降级

## 4. 修炼面板 UI

- [x] 4.1 创建修炼面板组件 (`src/pages/dc/panels/cultivation/`)
  - CultivationPanel 主组件
  - 全屏覆盖布局
  - 进入/退出动画
  - styles.module.css 样式文件

- [x] 4.2 面板内容区域
  - 顶部：返回按钮 + 详情按钮
  - 境界徽章：境界名称 + 阶段显示 + 图标
  - 中部：打坐人物 SVG 展示区
  - 下部：修为进度条 + 数值
  - 统计卡片：累计修为 + 突破次数
  - 底部：突破按钮
  - 闭关状态横幅

- [x] 4.3 使用 ui-ux-pro-max 打磨
  - 参考图1图2布局
  - 参考图3简约质感
  - 浅色背景 (#F8FAFC) + 圆角卡片 (16-20px)
  - 流畅动画交互 (slideUp, fadeInScale)
  - 响应式设计
  - 无障碍支持 (prefers-reduced-motion)

- [x] 4.4 创建修炼入口组件 (`src/pages/dc/components/CultivationEntry/`)
  - CultivationEntry 组件
  - 显示当前境界和修为进度
  - 紧凑模式支持
  - 点击打开修炼面板

- [x] 4.5 创建修炼区域 viewmodel (`src/pages/dc/viewmodel/CultivationSection/`)
  - CultivationSection 组件
  - 消费 CultivationProvider 数据
  - 管理面板显示状态

- [x] 4.6 主页下拉触发集成
  - usePullToReveal Hook 实现下拉手势检测
  - PullIndicator 组件显示下拉进度
  - 阻尼效果（拉得越远阻力越大）
  - 阈值触发（100px）
  - 圆形进度环 + 箭头旋转动画
  - 集成到 DCPage 主页面
  - CultivationProvider 添加到 Provider 层级

## 5. 突破与降级

- [x] 5.1 突破功能
  - 突破按钮（修为满时显示）
  - breakthrough() 方法实现
  - 更新境界数据
  - 添加历史记录

- [x] 5.2 降级逻辑
  - 小阶段直接降级（保留80%修为）
  - 跨大境界触发闭关保护
  - 闭关失败后降级（保留50%修为）

## 6. 历史记录

- [x] 6.1 修为历史存储
  - 按周分 key 存储 (getWeekKey)
  - 记录类型、数量、来源
  - 定期清理旧数据（保留 12 周）
  - getWeekHistory(): 获取指定周历史
  - getRecentHistory(): 获取最近历史

- [ ] 6.2 历史查看入口（可选，后续迭代）
  - 历史列表展示
  - 按周筛选

## 7. 验证与测试

- [ ] 7.1 手动测试用例
  - 新用户初始化
  - 打卡获得修为
  - 周期结算奖惩
  - 突破晋升
  - 降级与闭关保护

- [ ] 7.2 边界情况验证
  - 修为不会负数
  - 最高境界处理
  - 最低境界处理
  - 闭关期间的各种操作

## 已创建的文件清单

### 常量配置
- `src/pages/dc/constants/cultivation.ts` - 境界配置、修为计算

### 类型定义
- `src/pages/dc/types/cultivation.ts` - 修仙数据类型
- `src/pages/dc/types/index.ts` - 类型导出

### 工具函数
- `src/pages/dc/utils/cultivation.ts` - 等级计算、进度计算

### Context
- `src/pages/dc/contexts/CultivationProvider/index.tsx` - Provider 组件
- `src/pages/dc/contexts/CultivationProvider/types.ts` - Context 类型
- `src/pages/dc/contexts/CultivationProvider/storage.ts` - 数据持久化

### UI 组件
- `src/pages/dc/panels/cultivation/index.tsx` - 修炼面板
- `src/pages/dc/panels/cultivation/styles.module.css` - 面板样式
- `src/pages/dc/components/CultivationEntry/index.tsx` - 修炼入口
- `src/pages/dc/components/CultivationEntry/styles.module.css` - 入口样式
- `src/pages/dc/viewmodel/CultivationSection/index.tsx` - 修炼区域
- `src/pages/dc/viewmodel/CultivationSection/styles.module.css` - 区域样式

### Hooks
- `src/pages/dc/hooks/usePullToReveal.ts` - 下拉触发 Hook
- `src/pages/dc/hooks/index.ts` - Hooks 导出

### 下拉指示器
- `src/pages/dc/components/PullIndicator/index.tsx` - 下拉指示器组件
- `src/pages/dc/components/PullIndicator/styles.module.css` - 指示器样式

### 设计文档
- `openspec/changes/add-cultivation-level-system/ui-design.md` - UI 设计规范

