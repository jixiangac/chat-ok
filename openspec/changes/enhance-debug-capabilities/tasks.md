## 0. 开发者模式解锁机制

- [ ] 0.1 创建开发者模式工具函数
  - 新建 `src/pages/dc/utils/developerMode.ts`
  - 实现 getDeveloperMode / setDeveloperMode / toggleDeveloperMode
  - 存储 key: `dc_developer_mode`

- [ ] 0.2 在「数据管理」页面实现解锁机制
  - 在「偏好设置」区域添加点击计数器
  - 2秒内点击 10 次触发弹窗
  - 弹出密码输入框
  - 密码错误 Toast 提示，最多尝试 3 次
  - 超过 3 次关闭弹窗，需重新触发彩蛋
  - 输入 `jixiangac` 后解锁并持久化（无提示，直接显示新入口）

- [ ] 0.3 在「数据管理」页面添加关闭入口
  - 解锁后显示「关闭调试」条目
  - 点击后关闭开发者模式

## 1. 任务详情调试 Bug 修复

- [ ] 1.1 排查并修复周期进展天数不更新问题
  - 检查 `remainingDays` 计算逻辑
  - 确保使用模拟日期计算

- [ ] 1.2 排查并修复当日记录奖励计算问题
  - 检查奖励计算是否使用模拟日期
  - 检查每日上限检查是否基于模拟日期

- [ ] 1.3 排查并修复新记录不出现在当日记录问题
  - 检查记录日期是否使用 getSimulatedToday
  - 检查时间戳是否使用 getSimulatedTimestamp

- [ ] 1.4 调试按钮可见性控制
  - 在 DetailHeader 中根据开发者模式控制显示
  - 默认隐藏 debugNextDay/debugNextCycle 按钮

## 2. 灵玉和修为调试功能

- [ ] 2.1 扩展 CultivationProvider 类型定义
  - 在 `types.ts` 中新增 `debugSetSpiritJade` 方法签名
  - 在 `types.ts` 中新增 `debugSetExp` 方法签名

- [ ] 2.2 实现 debugSetSpiritJade 方法
  - 直接设置灵玉余额
  - 更新 totalEarned/totalSpent
  - 记录调试历史（source='DEBUG_SET'）

- [ ] 2.3 实现 calculateLevelFromExp 工具函数
  - 根据修为值反推等级
  - 复用现有的 getExpCap 等函数
  - 添加到 `utils/cultivation.ts`

- [ ] 2.4 实现 debugSetExp 方法
  - 直接设置修为值
  - 自动计算并更新等级
  - 清除闭关状态
  - 记录调试历史（type='DEBUG'）

- [ ] 2.5 创建统一调试页面
  - 新建 `src/pages/dc/panels/settings/pages/DebugPage/`
  - 包含灵玉调试模块：显示余额、数字输入、快捷按钮
  - 包含修为调试模块：显示修为/等级、数字输入、等级预览
  - 操作后显示 Toast 反馈

- [ ] 2.6 集成到设置面板
  - 在 SettingsMainPage 开发者分组添加「调试」入口（解锁后可见）
  - 在 UnifiedSettingsPanel 注册页面路由

## 3. 验证测试

- [ ] 3.1 验证解锁机制
  - 在偏好设置快速点击 10 次
  - 输入错误密码，提示错误
  - 错误 3 次后关闭弹窗
  - 输入正确密码解锁（无提示，直接显示新入口）
  - 关闭后调试入口隐藏

- [ ] 3.2 验证任务详情调试
  - 创建测试任务
  - 测试 debugNextDay 周期进展更新
  - 测试 debugNextDay 当日记录正确
  - 测试 debugNextCycle 跳转到下一周期第一天

- [ ] 3.3 验证灵玉和修为调试
  - 设置灵玉为指定数值
  - 设置修为触发升级/降级
  - 检查历史记录正确
  - 检查 UI 实时更新
