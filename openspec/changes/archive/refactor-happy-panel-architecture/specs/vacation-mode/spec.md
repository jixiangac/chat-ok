## ADDED Requirements

### Requirement: VacationContext 状态管理
系统 SHALL 提供 VacationContext 来管理度假模式的全局状态，包括行程列表、当前行程、当前日程等。

#### Scenario: 初始化加载行程数据
- **WHEN** VacationProvider 组件挂载时
- **THEN** 自动从 localStorage 加载所有行程数据
- **AND** 自动选择即将开始或正在进行的行程

#### Scenario: 通过 Context 访问状态
- **WHEN** 子组件调用 useVacation hook
- **THEN** 返回当前的 trips、currentTrip、currentScheduleId 状态
- **AND** 返回所有操作方法（selectTrip、createTrip、deleteTrip 等）

### Requirement: useTrips Hook
系统 SHALL 提供 useTrips hook 封装行程的 CRUD 操作。

#### Scenario: 创建新行程
- **WHEN** 调用 createTrip 方法并传入行程数据
- **THEN** 创建新行程并保存到 localStorage
- **AND** 更新 trips 状态

#### Scenario: 删除行程
- **WHEN** 调用 deleteTrip 方法并传入行程 ID
- **THEN** 从 localStorage 删除该行程
- **AND** 更新 trips 状态
- **AND** 如果删除的是当前行程，清空 currentTrip

### Requirement: useSchedule Hook
系统 SHALL 提供 useSchedule hook 封装日程相关逻辑。

#### Scenario: 获取日程状态
- **WHEN** 调用 useSchedule 并传入当前行程
- **THEN** 返回当前日程对象
- **AND** 返回日程统计信息（总数、已完成、失败数、完成率）
- **AND** 返回日程是否过期的判断结果

#### Scenario: 自动定位当前日程
- **WHEN** 选择一个行程时
- **THEN** 根据当前日期自动定位到对应的日程
- **AND** 如果行程未开始，定位到准备日程或第一天

### Requirement: useGoals Hook
系统 SHALL 提供 useGoals hook 封装目标管理逻辑。

#### Scenario: 添加目标
- **WHEN** 调用 addGoal 方法并传入日程 ID 和目标数据
- **THEN** 在指定日程中添加新目标
- **AND** 按时间排序目标列表
- **AND** 保存到 localStorage

#### Scenario: 完成目标
- **WHEN** 调用 completeGoal 方法并传入目标 ID
- **THEN** 将目标状态更新为 completed
- **AND** 增加行程积分
- **AND** 检查日程是否全部完成
- **AND** 检查行程是否全部完成

### Requirement: 工具函数整合
系统 SHALL 提供统一的工具函数模块，消除重复代码。

#### Scenario: 判断日程是否过期
- **WHEN** 调用 isScheduleExpired 函数并传入日程对象
- **THEN** 根据日程日期与当前日期比较返回布尔值
- **AND** 如果日程没有日期属性，返回 false

#### Scenario: 计算日程统计
- **WHEN** 调用 getScheduleStats 函数并传入日程对象
- **THEN** 返回包含 total、completed、failed、rate 的统计对象

### Requirement: CSS Modules 样式规范
系统 SHALL 使用 CSS Modules 管理组件样式，遵循 DC 模块设计规范。

#### Scenario: 组件样式隔离
- **WHEN** 组件使用 CSS Modules 样式
- **THEN** 样式类名自动添加唯一后缀
- **AND** 不会与其他组件样式冲突

#### Scenario: 设计 Token 统一
- **WHEN** 定义组件样式时
- **THEN** 使用统一的颜色变量（--text-primary、--bg-card 等）
- **AND** 使用统一的间距变量（--spacing-sm、--spacing-md 等）
- **AND** 使用统一的圆角变量（--radius-sm、--radius-md 等）

## MODIFIED Requirements

### Requirement: 组件目录结构
系统 SHALL 按照 DC 模块标准组织 Happy Panel 的目录结构。

#### Scenario: 标准目录布局
- **WHEN** 查看 happy 目录结构时
- **THEN** 包含 components/ 子目录存放 UI 组件
- **AND** 包含 contexts/ 子目录存放 Context
- **AND** 包含 hooks/ 子目录存放自定义 Hooks
- **AND** 包含 utils/ 子目录存放工具函数
- **AND** 包含 index.tsx 作为模块入口

#### Scenario: 组件独立目录
- **WHEN** 查看 components/ 目录时
- **THEN** 每个复杂组件有独立目录
- **AND** 每个组件目录包含 index.tsx 和 styles.module.css
- **AND** 有 index.ts 统一导出所有组件
