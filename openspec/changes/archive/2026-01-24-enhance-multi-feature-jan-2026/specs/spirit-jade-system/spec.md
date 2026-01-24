## ADDED Requirements

### Requirement: 清单项操作灵玉消耗

系统 **SHALL** 在清单项添加和延后操作时消耗灵玉。

#### Scenario: 添加清单项到当前周期消耗

- **WHEN** 用户将清单项添加到当前周期
- **THEN** 扣除 1 灵玉
- **AND** 记录消耗历史（来源：清单项添加）

#### Scenario: 延后清单项到下一周期消耗

- **WHEN** 用户将清单项延后到下一周期
- **THEN** 扣除 2 灵玉
- **AND** 记录消耗历史（来源：清单项延后）

---

### Requirement: 纪念日创建灵玉消耗

系统 **SHALL** 在创建纪念日时消耗灵玉。

#### Scenario: 纪念日创建消耗

- **WHEN** 用户确认创建纪念日
- **THEN** 扣除 50 灵玉
- **AND** 记录消耗历史（来源：创建纪念日）

---

### Requirement: 主线转支线灵玉消耗

系统 **SHALL** 在主线任务转为支线任务时消耗灵玉。

#### Scenario: 主线转支线消耗

- **WHEN** 用户确认将主线任务转为支线
- **THEN** 扣除 50 灵玉
- **AND** 记录消耗历史（来源：主线转支线）

---

## MODIFIED Requirements

### Requirement: Points Acquisition from Check-in

系统 **SHALL** 在打卡时根据每日奖励上限控制奖励发放。

#### Scenario: 每日奖励上限检查

- **WHEN** 用户完成打卡且计算出应得奖励
- **AND** 该任务今日已获得奖励达到每日上限
- **THEN** 不再发放奖励（灵玉和修为均为 0）
- **AND** 打卡操作正常完成
- **AND** 显示 Toast 提示「今日奖励已达上限，继续打卡不再获得奖励」

#### Scenario: 未达上限正常发放

- **WHEN** 用户完成打卡且计算出应得奖励
- **AND** 该任务今日已获得奖励未达到每日上限
- **THEN** 正常发放奖励
- **AND** 累计该任务今日已发放奖励

#### Scenario: 部分发放（接近上限）

- **WHEN** 用户完成打卡且计算出应得奖励 R
- **AND** 该任务今日已获得奖励为 A，上限为 C
- **AND** A + R > C
- **THEN** 实际发放 C - A（发放至上限）
- **AND** 显示实际获得的奖励数量

---

### Requirement: 灵玉明细全屏页面

系统 **SHALL** 使用与设置子页面一致的手势返回实现。

#### Scenario: 使用统一的手势返回 Hook

- **WHEN** 灵玉明细页面实现手势返回
- **THEN** 应当使用 useSwipeBack hook（来自 settings/hooks）
- **AND** 不应当自实现手势逻辑

#### Scenario: 手势滑动实时跟手

- **WHEN** 用户从左边缘（< 50px）开始向右滑动
- **THEN** 页面应当实时跟随手指位移
- **AND** 滑动时应当禁用 transition 动画（直接设置 transform）

#### Scenario: 手势返回触发

- **WHEN** 滑动距离超过阈值（100px）
- **AND** 用户释放手指
- **THEN** 页面应当平滑滑出并关闭

#### Scenario: 手势回弹

- **WHEN** 滑动距离未超过阈值（100px）
- **AND** 用户释放手指
- **THEN** 页面应当平滑回弹到原位
- **AND** 不触发关闭操作
