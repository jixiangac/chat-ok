# Tasks: 添加灵玉与修为双积分系统

## 1. 类型与常量定义

- [ ] 1.1 新增灵玉相关类型定义 (`src/pages/dc/types/spiritJade.ts`)
  - SpiritJadeData 接口
  - PointsRecord 接口
  - PointsSource 类型

- [ ] 1.2 新增积分配置常量 (`src/pages/dc/constants/spiritJade.ts`)
  - BASE_SPIRIT_JADE = 20
  - BASE_CULTIVATION = 10
  - CHECK_IN_UNIT_MULTIPLIER 打卡类型系数
  - TASK_TYPE_MULTIPLIER 任务类型系数
  - SPIRIT_JADE_COST 消耗配置
  - DAILY_VIEW_COMPLETE_REWARD 一日清单奖励
  - CYCLE_COMPLETE_BONUS_RATE 周期完成奖励率
  - ARCHIVE_REWARD 归档奖励配置

## 2. 工具函数

- [ ] 2.1 创建积分计算工具 (`src/pages/dc/utils/spiritJadeCalculator.ts`)
  - calculateDailyPointsCap(): 计算每日上限
  - distributeCheckInPoints(): 打卡积分分配
  - calculateDailyViewCompleteReward(): 一日清单完成奖励
  - calculateArchiveReward(): 归档总结奖励
  - calculateCycleCompleteBonus(): 周期完成额外奖励

## 3. 状态管理

- [ ] 3.1 扩展 CultivationProvider 或新建 SpiritJadeProvider
  - 灵玉数据存储与加载
  - addSpiritJade(): 增加灵玉
  - spendSpiritJade(): 消耗灵玉（含余额检查）
  - canSpend(): 检查是否可消费
  - 积分变动历史记录

- [ ] 3.2 实现数据持久化 (`src/pages/dc/contexts/.../storage.ts`)
  - loadSpiritJadeData(): 加载灵玉数据
  - saveSpiritJadeData(): 保存灵玉数据
  - initSpiritJadeData(): 初始化数据（新用户/迁移）

## 4. 任务打卡集成

- [ ] 4.1 修改打卡逻辑，同步发放灵玉和修为
  - 获取任务的每日上限
  - 计算完成比例
  - 检查是否为今日必须完成任务（+15%）
  - 调用 addSpiritJade + addExp

- [ ] 4.2 周期完成100%额外奖励
  - 检测周期完成状态
  - 发放上限积分 × 10%
  - 确保每周期仅发一次

## 5. 任务创建集成

- [ ] 5.1 创建任务前检查灵玉余额
  - 主线任务：检查 >= 500
  - 支线任务：检查 >= 200
  - 余额不足时禁止创建并提示

- [ ] 5.2 创建成功后扣除灵玉
  - 主线任务：-500 灵玉
  - 支线任务：-200 灵玉
  - 记录消耗日志

## 6. 一日清单集成

- [ ] 6.1 刷新按钮消耗灵玉
  - 点击前检查余额 >= 25
  - 余额不足时禁止刷新并提示
  - 刷新成功后 -25 灵玉

- [ ] 6.2 一日清单完成100%奖励
  - 检测完成状态（percentage === 100）
  - 根据任务数量计算奖励倍率
  - 发放灵石和修为
  - 确保每日仅发一次

## 7. 归档总结集成

- [ ] 7.1 归档时计算并发放奖励
  - 获取任务总完成率
  - 完成率 < 30% 不发放
  - 总值 = 每日上限 × 2
  - 按完成率比例分发

## 8. 奖励显化UI

- [ ] 8.1 创建 RewardToast 组件 (`src/pages/dc/components/RewardToast/`)
  - 单一奖励样式：简洁单行
  - 多重奖励样式：分条列出 + 合计行
  - 从顶部下滑出现动画
  - 数字滚动动画

- [ ] 8.2 创建奖励队列管理 Hook (`src/pages/dc/hooks/useRewardQueue.ts`)
  - collectReward(): 收集奖励项
  - flushRewards(): 统一显示并清空队列
  - 支持多个奖励合并显示

- [ ] 8.3 集成到打卡流程
  - 打卡后收集基础奖励
  - 检查并收集周期完成奖励
  - 检查并收集一日清单完成奖励
  - 统一弹出显示

- [ ] 8.4 集成到归档流程
  - 归档后显示奖励Toast

## 9. 其他UI（可选，后续迭代）

- [ ] 9.1 灵玉余额显示入口
- [ ] 9.2 积分变动历史查看

## 10. 验证

- [ ] 10.1 手动测试用例
  - 新用户初始化（灵玉=1000）
  - 创建任务消耗灵玉
  - 灵玉不足禁止创建
  - 打卡获得双积分
  - 今日必须完成任务额外+15%
  - 周期完成100%额外奖励
  - 一日清单完成奖励
  - 刷新一日清单消耗
  - 归档总结奖励

- [ ] 10.2 边界情况验证
  - 灵玉不会负数
  - 积分上限正确计算
  - 重复奖励防护
