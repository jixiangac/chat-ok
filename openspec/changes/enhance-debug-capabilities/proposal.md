# Change: 增强调试能力系统

## Why

当前系统的调试功能存在以下问题：
1. **任务详情调试存在 Bug**：debugNextDay 和 debugNextCycle 功能存在已知问题：
   - 周期进展的天数没有正确更新
   - 当日记录里的奖励计算不正确
   - 新记录数据不会出现在当日记录里
2. **灵玉调试缺失**：开发测试时无法快速设置灵玉数量，需要手动修改 localStorage
3. **修为调试缺失**：缺少直接设置修为数值的能力，且修为变更后需要手动触发等级检查
4. **调试入口暴露**：当前调试功能对所有用户可见，需要隐藏并设置解锁机制

## What Changes

### 1. 开发者模式解锁机制
- **默认隐藏**：所有调试功能默认不可见
- **彩蛋解锁**：在「数据管理」页面的「偏好设置」区域快速敲击 10 次
- **密码验证**：弹出输入框，输入 `jixiangac` 后正式开启开发者模式
  - 密码错误 Toast 提示，最多尝试 3 次
  - 超过 3 次关闭弹窗，需重新触发彩蛋
  - 解锁成功无提示，直接显示新入口
- **持久化存储**：解锁状态保存到 localStorage
- **关闭入口**：在「数据管理」页面添加「关闭调试」条目

### 2. 任务详情调试 Bug 修复
- **修复 debugNextDay**：
  - 周期进展天数正确更新
  - 当日记录使用模拟日期
  - 奖励计算基于模拟日期
- **修复 debugNextCycle**：
  - 默认跳到下一周期的第一天
  - 正确处理清单项迁移

### 3. 灵玉和修为调试（新增）
- 在设置面板的开发者选项中新增「调试」入口
- 包含灵玉调试模块：支持直接输入或快速增减灵玉数量
- 包含修为调试模块：支持自定义设置修为数量，自动触发等级更新
- 操作记录到历史，便于追踪

## Impact

- **影响的规范**:
  - `settings-panel` - 新增开发者模式解锁机制
  - `detail-panel` - 调试功能可见性控制 + Bug 修复
  - `spirit-jade-system` - 新增调试功能规范
  - `cultivation-system` - 新增调试功能规范

- **影响的代码**:
  - `src/pages/dc/contexts/TaskProvider/` - debugNextDay/debugNextCycle Bug 修复
  - `src/pages/dc/contexts/CultivationProvider/` - 新增 debugSetExp/debugSetSpiritJade 方法
  - `src/pages/dc/panels/settings/pages/DataManagementPage/` - 解锁机制 + 关闭入口
  - `src/pages/dc/panels/settings/pages/DebugPage/` - 新增统一调试页面
  - `src/pages/dc/panels/detail/` - 调试按钮可见性控制
  - `src/pages/dc/utils/developerMode.ts` - 开发者模式状态管理

- **用户体验**: 普通用户无感知，需要彩蛋解锁才能使用调试功能

- **数据迁移**: 无需迁移，调试功能不影响正式数据结构
