# normal-panel Specification

## Purpose
TBD - created by archiving change optimize-normal-panel-ux. Update Purpose after archive.
## Requirements
### Requirement: 支线任务网格响应式显示

系统 **SHALL** 根据屏幕高度动态计算支线任务的显示数量。

#### Scenario: 小屏幕设备显示较少任务

**GIVEN** 用户在小屏幕移动设备上访问常规面板
**WHEN** 系统计算可用屏幕高度
**THEN** 支线任务网格显示适合屏幕高度的任务数量（最少1行2个，最多3行6个）

#### Scenario: 大屏幕设备显示更多任务

**GIVEN** 用户在大屏幕设备上访问常规面板
**WHEN** 系统计算可用屏幕高度
**THEN** 支线任务网格显示最多3行6个任务

#### Scenario: 保留现有查看更多方式

**GIVEN** 支线任务总数超过显示数量
**WHEN** 用户需要查看所有任务
**THEN** 可以通过"所有支线"按钮查看完整列表

---

### Requirement: 创建任务弹窗移动端适配

系统 **SHALL** 确保创建任务弹窗在移动端正确显示，无横向滚动条。

#### Scenario: 弹窗内容适配小屏幕

**GIVEN** 用户在移动设备上打开创建任务弹窗
**WHEN** 弹窗显示任何步骤的内容
**THEN** 所有内容在屏幕宽度内正确显示，无横向滚动条

#### Scenario: 周期设定步骤响应式布局

**GIVEN** 用户在创建任务弹窗的周期设定步骤
**WHEN** 屏幕宽度小于375px
**THEN** 总时长选项使用单列布局

#### Scenario: 类型选择步骤响应式布局

**GIVEN** 用户在创建任务弹窗的类型选择步骤
**WHEN** 在移动设备上显示
**THEN** 任务类型卡片垂直排列，内容完整显示

#### Scenario: 配置步骤响应式布局

**GIVEN** 用户在创建任务弹窗的配置步骤
**WHEN** 屏幕宽度小于375px
**THEN** 表单输入框和按钮使用响应式布局，避免横向溢出

#### Scenario: 打卡类型选择响应式布局

**GIVEN** 用户在打卡型任务配置中选择打卡类型
**WHEN** 屏幕宽度小于375px
**THEN** 3列网格自动调整为2列或单列布局

---

### Requirement: 页面切换动画

系统 **SHALL** 为常规面板的交互提供流畅的动画效果。

#### Scenario: 弹窗打开动画

**GIVEN** 用户点击创建任务按钮
**WHEN** 弹窗开始显示
**THEN** 弹窗从底部滑入，带有淡入效果，使用弹簧物理动画

#### Scenario: 弹窗关闭动画

**GIVEN** 用户关闭创建任务弹窗
**WHEN** 弹窗开始隐藏
**THEN** 弹窗向底部滑出，带有淡出效果

#### Scenario: 步骤切换动画

**GIVEN** 用户在创建任务弹窗中切换步骤
**WHEN** 点击"下一步"或"上一步"
**THEN** 当前步骤淡出并滑出，新步骤淡入并滑入，方向与导航方向一致

#### Scenario: 任务卡片交互动画

**GIVEN** 用户与任务卡片交互
**WHEN** 悬停或点击任务卡片
**THEN** 卡片有轻微的缩放和阴影变化动画

#### Scenario: 支线任务网格进入动画

**GIVEN** 支线任务网格首次加载
**WHEN** 任务卡片显示
**THEN** 卡片依次淡入并从下方滑入，有轻微的延迟错开效果

---

### Requirement: 动画性能优化

系统 **SHALL** 确保动画在移动设备上流畅运行。

#### Scenario: 使用GPU加速

**GIVEN** 系统实现动画效果
**WHEN** 动画执行
**THEN** 仅使用 transform 和 opacity 属性，触发 GPU 加速

#### Scenario: 避免布局抖动

**GIVEN** 动画正在执行
**WHEN** 元素位置或大小变化
**THEN** 不触发页面重排，保持布局稳定

#### Scenario: 低端设备动画降级

**GIVEN** 用户在低端移动设备上访问
**WHEN** 系统检测到性能限制
**THEN** 简化动画效果或使用 prefers-reduced-motion 媒体查询

---

### Requirement: 移动端触摸优化

系统 **SHALL** 优化移动端的触摸交互体验。

#### Scenario: 按钮触摸区域

**GIVEN** 用户在移动设备上操作
**WHEN** 点击按钮或交互元素
**THEN** 触摸区域至少为 44x44px，符合移动端可访问性标准

#### Scenario: 表单输入优化

**GIVEN** 用户在移动设备上填写表单
**WHEN** 聚焦输入框
**THEN** 输入框有明显的焦点状态，键盘弹出不遮挡内容

#### Scenario: 抽屉手势优化

**GIVEN** 用户打开支线任务抽屉
**WHEN** 在移动设备上操作
**THEN** 抽屉支持下滑关闭手势，动画流畅自然

---

### Requirement: 响应式间距和字体

系统 **SHALL** 根据屏幕尺寸调整间距和字体大小。

#### Scenario: 小屏幕间距调整

**GIVEN** 用户在小屏幕设备上访问
**WHEN** 显示常规面板内容
**THEN** 内边距和间距适当减小，保持内容可读性

#### Scenario: 字体大小适配

**GIVEN** 用户在移动设备上访问
**WHEN** 显示文本内容
**THEN** 字体大小在小屏幕上保持可读（最小12px）

#### Scenario: 弹窗内边距适配

**GIVEN** 创建任务弹窗在移动设备上显示
**WHEN** 屏幕宽度小于375px
**THEN** 弹窗内边距从24px减小到16px

---

