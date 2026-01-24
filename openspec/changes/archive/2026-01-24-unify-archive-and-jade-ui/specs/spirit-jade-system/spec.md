# spirit-jade-system Spec Delta

## MODIFIED Requirements

### Requirement: Reward Toast Display

系统 SHALL 在用户获得灵玉时显示 Toast 提示，支持合并多个奖励。

#### Scenario: 获得灵玉时显示 Toast
- **WHEN** 用户通过打卡、周期完成等方式获得灵玉
- **THEN** 系统应当显示 Toast 通知灵玉获得数量
- **AND** Toast 从顶部滑入并在 2-3 秒后自动消失

---

## REMOVED Requirements

### ~~Requirement: Spirit Jade History Popup~~

移除原有的居中小弹窗展示方式，改为全屏页面。

---

## ADDED Requirements

### Requirement: 灵玉明细全屏页面

系统 SHALL 提供全屏的灵玉明细页面，使用与设置子页面一致的布局风格。

#### Scenario: 打开灵玉明细页面
- **WHEN** 用户点击主页面顶部的灵玉图标
- **THEN** 系统应当从右侧滑入全屏灵玉明细页面
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-out 缓动函数

#### Scenario: 灵玉页面布局
- **WHEN** 灵玉明细页面打开
- **THEN** 页面应当使用 SubPageLayout 布局
- **AND** 顶部应当显示灵玉主题头图
- **AND** 头图下方应当显示"灵玉明细"标题和描述
- **AND** 内容区域应当显示余额概览和变动记录

#### Scenario: 余额概览展示
- **WHEN** 灵玉明细页面显示余额概览区域
- **THEN** 应当显示当前余额，包含灵玉图标和数值
- **AND** 应当显示累计获得金额（绿色上箭头）
- **AND** 应当显示累计消耗金额（红色下箭头）

#### Scenario: 变动记录列表
- **WHEN** 灵玉明细页面显示变动记录区域
- **THEN** 应当显示"变动记录"分组标题
- **AND** 记录应当按时间倒序排列
- **AND** 每条记录应当显示来源、描述、时间和金额
- **AND** 获得金额显示为绿色带加号
- **AND** 消耗金额显示为红色带减号

#### Scenario: 空状态展示
- **WHEN** 没有灵玉变动记录
- **THEN** 应当显示"暂无记录"提示

#### Scenario: 关闭灵玉页面
- **WHEN** 用户点击返回按钮
- **THEN** 页面应当向右侧滑出
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-in 缓动函数

#### Scenario: 手势返回
- **WHEN** 用户从左边缘（< 50px）向右滑动
- **AND** 滑动距离超过阈值（100px）
- **THEN** 系统应当触发返回操作
- **AND** 关闭灵玉明细页面
