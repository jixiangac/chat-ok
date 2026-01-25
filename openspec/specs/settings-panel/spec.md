# settings-panel Specification

## Purpose
TBD - created by archiving change unified-settings-panel. Update Purpose after archive.
## Requirements
### Requirement: 统一设置面板入口
系统 SHALL 提供一个统一的设置面板入口，用户可以通过点击设置图标打开全屏设置面板。

#### Scenario: 打开设置面板
- **WHEN** 用户点击设置图标
- **THEN** 系统应当使用 `open.tsx` 和 `pop.tsx` 打开全屏弹窗
- **AND** 弹窗应当显示设置主页面
- **AND** 弹窗应当包含关闭按钮

#### Scenario: 关闭设置面板
- **WHEN** 用户点击关闭按钮或点击遮罩层
- **THEN** 系统应当关闭设置弹窗
- **AND** 返回到之前的页面状态

### Requirement: 设置主页面布局

设置主页面 SHALL 采用分组列表的形式，清晰展示所有设置选项，包括归档任务入口。

#### Scenario: 显示开发者分组
- **WHEN** 设置主页面加载完成
- **THEN** 系统应当显示"开发者"分组标题
- **AND** 分组下应当包含"归档任务"、"数据管理"、"日期测试"三个列表项
- **AND** "归档任务"应当显示图标、标题和右侧箭头

---

### Requirement: 页面栈导航系统
系统 SHALL 实现页面栈管理，支持在同一弹窗内进行多级页面导航。

#### Scenario: 进入子页面
- **WHEN** 用户点击可导航的列表项
- **THEN** 系统应当在当前弹窗内切换到对应的子页面
- **AND** 应当显示页面切换动画
- **AND** 子页面应当显示返回按钮

#### Scenario: 返回上一页
- **WHEN** 用户点击返回按钮
- **THEN** 系统应当返回到上一个页面
- **AND** 应当显示返回动画
- **AND** 如果已经在主页面，返回按钮应当变为关闭按钮

#### Scenario: 左滑手势返回（可选）
- **WHEN** 用户在子页面进行左滑手势
- **AND** 滑动距离超过阈值（如 100px）
- **THEN** 系统应当触发返回操作
- **AND** 返回到上一个页面

### Requirement: 子页面布局结构
所有子页面 SHALL 采用统一的布局结构，包含头图、标题和内容区域。

#### Scenario: 子页面基本布局
- **WHEN** 子页面加载完成
- **THEN** 页面顶部应当显示头图区域
- **AND** 头图下方应当显示标题和描述
- **AND** 标题下方应当显示可滚动的内容区域
- **AND** 布局应当参考今日必须完成的界面设计

#### Scenario: 子页面头部导航
- **WHEN** 子页面显示
- **THEN** 左上角应当显示返回按钮
- **AND** 中间应当显示页面标题
- **AND** 右上角可选显示其他操作按钮

### Requirement: 今日毕任务设置集成
今日毕任务设置 SHALL 支持两种使用场景：独立弹窗和设置子页面。

#### Scenario: 作为独立弹窗使用
- **WHEN** 系统自动触发今日毕任务设置
- **THEN** 应当使用原有的独立弹窗方式打开
- **AND** 保持原有的交互逻辑和样式

#### Scenario: 作为设置子页面使用
- **WHEN** 用户从设置主页面点击"今日毕任务设置"
- **THEN** 应当在设置弹窗内切换到今日毕任务子页面
- **AND** 复用相同的 UI 组件和逻辑
- **AND** 显示返回按钮而非关闭按钮

### Requirement: 主题设置子页面
系统 SHALL 提供主题设置子页面，整合现有的主题配置功能。

#### Scenario: 显示主题设置
- **WHEN** 用户点击"主题设置"列表项
- **THEN** 系统应当切换到主题设置子页面
- **AND** 显示所有可用的主题选项
- **AND** 保持原有的主题切换功能

#### Scenario: 主题设置布局
- **WHEN** 主题设置子页面加载
- **THEN** 应当显示头图区域
- **AND** 显示"主题配色"标题
- **AND** 内容区域显示主题选择器

### Requirement: 标签管理子页面
系统 SHALL 提供标签管理子页面，整合现有的标签配置功能。

#### Scenario: 显示标签管理
- **WHEN** 用户点击"标签管理"列表项
- **THEN** 系统应当切换到标签管理子页面
- **AND** 显示所有已创建的标签
- **AND** 保持原有的标签增删改功能

#### Scenario: 标签管理布局
- **WHEN** 标签管理子页面加载
- **THEN** 应当显示头图区域
- **AND** 显示"标签设置"标题
- **AND** 内容区域显示标签列表和操作按钮

### Requirement: 开发者数据管理
系统 SHALL 提供数据管理功能，支持导入导出各类数据。

#### Scenario: 显示数据管理页面
- **WHEN** 用户点击"数据管理"列表项
- **THEN** 系统应当切换到数据管理子页面
- **AND** 显示所有可管理的数据类型
- **AND** 包含：标签、任务、度假、纪念日、偏好状态

#### Scenario: 导出数据
- **WHEN** 用户点击某个数据类型的"导出"按钮
- **THEN** 系统应当读取对应的 localStorage 数据
- **AND** 按照现有任务数据的方式进行导出
- **AND** 提供文件下载或文本复制功能

#### Scenario: 导入数据
- **WHEN** 用户点击某个数据类型的"导入"按钮
- **THEN** 系统应当显示导入界面
- **AND** 按照现有任务数据的方式进行导入
- **AND** 支持文件上传或文本粘贴
- **AND** 导入前应当显示确认弹窗

#### Scenario: 数据管理布局
- **WHEN** 数据管理子页面加载
- **THEN** 应当显示头图区域
- **AND** 显示"数据管理"标题
- **AND** 内容区域显示数据类型列表
- **AND** 每个数据类型包含导入和导出按钮

### Requirement: 视觉样式规范
所有设置相关界面 SHALL 遵循统一的视觉规范，完全复刻参考设计。

#### Scenario: 分组标题样式
- **WHEN** 显示分组标题
- **THEN** 字体大小应当为 12px
- **AND** 颜色应当为 rgba(55, 53, 47, 0.5)
- **AND** 内边距应当为 16px 16px 8px

#### Scenario: 列表项样式
- **WHEN** 显示列表项
- **THEN** 背景应当为白色
- **AND** 圆角应当为 12px
- **AND** 内边距应当为 16px
- **AND** 外边距应当为 0 16px 8px
- **AND** 应当包含左侧图标和右侧箭头

#### Scenario: 今日毕任务高亮样式
- **WHEN** 显示今日毕任务列表项
- **THEN** 背景应当使用渐变色
- **AND** 渐变方向为 135deg
- **AND** 起始色为 #667eea，结束色为 #764ba2
- **AND** 文字颜色应当为白色

#### Scenario: 子页面头图样式
- **WHEN** 显示子页面头图
- **THEN** 应当使用固定高度
- **AND** 图片应当完整显示
- **AND** 参考今日必须完成的头图样式

### Requirement: 场景管理占位
系统 SHALL 显示场景管理相关的列表项，但暂不实现实际功能。

#### Scenario: 显示场景管理列表项
- **WHEN** 设置主页面显示场景管理分组
- **THEN** 应当显示四个模式的列表项
- **AND** 列表项应当使用正常样式（非高亮）
- **AND** 列表项暂时不可点击

#### Scenario: 点击场景管理列表项
- **WHEN** 用户尝试点击场景管理列表项
- **THEN** 系统不应当有任何响应
- **OR** 可选显示"功能开发中"提示

### Requirement: 响应式适配
设置面板 SHALL 适配不同的屏幕尺寸和设备。

#### Scenario: 移动端适配
- **WHEN** 在移动设备上打开设置面板
- **THEN** 弹窗应当占据全屏
- **AND** 所有元素应当正确显示
- **AND** 触摸交互应当流畅

#### Scenario: 不同屏幕尺寸
- **WHEN** 在不同尺寸的屏幕上显示
- **THEN** 布局应当自适应调整
- **AND** 文字和图标应当保持清晰
- **AND** 间距应当按比例缩放

### Requirement: 设置面板入口动画
设置面板 SHALL 使用整屏横移效果打开和关闭，提供流畅的页面切换体验。

#### Scenario: 打开设置面板动画
- **WHEN** 用户点击设置图标打开设置面板
- **THEN** 面板应当从右侧滑入
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-out 缓动函数

#### Scenario: 关闭设置面板动画
- **WHEN** 用户关闭设置面板
- **THEN** 面板应当向右侧滑出
- **AND** 动画时长应当为 400ms
- **AND** 使用 ease-in 缓动函数

### Requirement: 子页面切换动画
子页面切换 SHALL 实现 iOS 风格的卡片堆叠效果（Dimensional Layering）。

#### Scenario: 进入子页面动画
- **WHEN** 用户点击列表项进入子页面
- **THEN** 当前页面应当缩小到 95% 并向左偏移 5%
- **AND** 新页面应当从右侧滑入
- **AND** 使用 z-index 管理页面层级
- **AND** 添加阴影提升层次感

#### Scenario: 返回上一页动画
- **WHEN** 用户点击返回按钮
- **THEN** 当前页面应当向右滑出
- **AND** 背景页面应当恢复到 100% 并回到原位
- **AND** 动画应当流畅过渡

### Requirement: 设置列表项入场动画
设置列表项 SHALL 使用翻书效果入场，提供生动的视觉体验。

#### Scenario: 列表项翻书动画
- **WHEN** 设置主页面加载完成
- **THEN** 列表项应当使用 flipIn 动画入场
- **AND** 动画应当从 rotateX(-90deg) 过渡到 rotateX(0deg)
- **AND** 使用交错动画，每项延迟 60ms
- **AND** 最多同时动画 5 个列表项

### Requirement: 手势返回支持
系统 SHALL 支持向右滑动手势返回上一页。

#### Scenario: 手势返回触发
- **WHEN** 用户在子页面从左边缘（< 50px）向右滑动
- **AND** 滑动距离超过阈值（100px）
- **THEN** 系统应当触发返回操作
- **AND** 显示返回动画

#### Scenario: 手势返回取消
- **WHEN** 用户滑动距离未超过阈值
- **THEN** 页面应当回弹到原位
- **AND** 不触发返回操作

### Requirement: 标签设置底部操作
标签设置页面 SHALL 将新增按钮固定在底部，使用弹窗方式创建标签。

#### Scenario: 显示底部新增按钮
- **WHEN** 标签设置页面加载
- **THEN** 底部应当显示固定的"新增标签"按钮
- **AND** 按钮应当考虑安全区域（Safe Area）

#### Scenario: 点击新增按钮
- **WHEN** 用户点击"新增标签"按钮
- **THEN** 应当从底部弹出创建表单
- **AND** 使用 Popup 组件显示

### Requirement: 主题设置保存机制
主题设置 SHALL 支持预览模式，修改后需点击保存才生效。

#### Scenario: 主题预览
- **WHEN** 用户选择不同的主题
- **THEN** 应当立即显示预览效果
- **AND** 不影响全局主题设置

#### Scenario: 保存主题
- **WHEN** 用户点击底部"保存"按钮
- **THEN** 应当将预览的主题应用到全局
- **AND** 关闭设置页面

#### Scenario: 放弃修改
- **WHEN** 用户点击返回按钮
- **THEN** 应当放弃未保存的修改
- **AND** 恢复原有主题

### Requirement: Developer Options Section
The system SHALL provide a developer options section in settings for testing purposes.

#### Scenario: Display developer options
- **WHEN** user opens settings panel
- **THEN** system displays a "开发者选项" (Developer Options) section

#### Scenario: Show current date
- **WHEN** developer options section is visible
- **THEN** system displays the current effective date in YYYY-MM-DD format
- **AND** indicates whether it's a real date or test date

### Requirement: Date Test Controls
The system SHALL provide controls for testing date-related functionality.

#### Scenario: Date picker display
- **WHEN** developer options section is visible
- **THEN** system displays a date picker for selecting test date

#### Scenario: Set test date button
- **WHEN** user selects a date and clicks "设置测试日期" (Set Test Date)
- **THEN** system stores the selected date as test date
- **AND** displays confirmation message

#### Scenario: Clear test date button
- **WHEN** user clicks "清除测试日期" (Clear Test Date)
- **THEN** system removes the test date
- **AND** reverts to using real system date
- **AND** displays confirmation message

#### Scenario: Trigger date change button
- **WHEN** user clicks "触发日期变更" (Trigger Date Change)
- **THEN** system executes the daily reset process
- **AND** displays the reset results (tasks reset count, cycles advanced count)

### Requirement: Date Test Visual Feedback
The system SHALL provide visual feedback for date test operations.

#### Scenario: Test date indicator
- **WHEN** a test date is active
- **THEN** system displays a warning badge indicating test mode is active

#### Scenario: Reset results display
- **WHEN** date change is triggered
- **THEN** system displays:
  - Number of tasks with todayProgress reset
  - Number of tasks with cycle advanced
  - Cache clear status

### Requirement: 归档子页面

系统 SHALL 在设置面板中提供归档任务子页面，用户可以查看和管理已归档的任务。

#### Scenario: 进入归档页面
- **WHEN** 用户在设置主页面点击"归档任务"列表项
- **THEN** 系统应当在设置弹窗内切换到归档子页面
- **AND** 应当显示页面切换动画
- **AND** 子页面应当显示返回按钮

#### Scenario: 归档页面布局
- **WHEN** 归档子页面加载完成
- **THEN** 页面应当使用 SubPageLayout 布局
- **AND** 顶部应当显示头图区域
- **AND** 头图下方应当显示"归档任务"标题和描述
- **AND** 内容区域应当显示筛选 Tab 和任务列表

#### Scenario: 归档页面任务类型筛选
- **WHEN** 归档子页面显示筛选区域
- **THEN** 应当显示任务类型 Tab：全部、主线、支线
- **AND** Tab 样式应当与标签管理页面一致（圆角按钮 + 白色背景高亮）
- **AND** 默认选中"全部"Tab

#### Scenario: 归档页面完成状态筛选
- **WHEN** 归档子页面显示筛选区域
- **THEN** 应当显示完成状态 Tab：已完成、未完成
- **AND** Tab 样式应当与任务类型筛选一致
- **AND** 默认显示所有状态

#### Scenario: 归档任务列表展示
- **WHEN** 用户应用筛选条件
- **THEN** 系统应当根据筛选条件过滤归档任务
- **AND** 每个任务卡片应当显示任务标题、类型标签、进度信息
- **AND** 空状态时应当显示"暂无归档任务"提示

#### Scenario: 归档任务点击
- **WHEN** 用户点击某个归档任务卡片
- **THEN** 系统应当打开该任务的详情页面

### Requirement: 开发者模式解锁机制

系统 **SHALL** 实现隐藏的开发者模式解锁机制，通过彩蛋方式触发。

#### Scenario: 彩蛋触发

**GIVEN** 用户在「数据管理」页面的「偏好设置」区域
**WHEN** 用户在 2 秒内快速点击 10 次
**THEN** 系统弹出密码输入框

#### Scenario: 密码验证成功

**GIVEN** 密码输入框已弹出
**WHEN** 用户输入 `jixiangac` 并确认
**THEN** 系统应当：
- 开启开发者模式
- 将解锁状态持久化到 localStorage（key: `dc_developer_mode`）
- 显示 Toast 提示「开发者模式已开启」
- 关闭输入框

#### Scenario: 密码验证失败

**GIVEN** 密码输入框已弹出
**WHEN** 用户输入错误密码并确认
**THEN** 系统应当：
- 显示错误提示
- 保持输入框打开
- 不改变开发者模式状态

#### Scenario: 点击计数重置

**GIVEN** 用户开始快速点击
**WHEN** 距离第一次点击超过 2 秒但未达到 10 次
**THEN** 系统重置点击计数器

### Requirement: 开发者模式关闭入口

系统 **SHALL** 在开发者模式开启后提供关闭入口。

#### Scenario: 显示关闭入口

**GIVEN** 开发者模式已开启
**WHEN** 用户打开「数据管理」页面
**THEN** 显示「关闭调试」条目

#### Scenario: 关闭开发者模式

**GIVEN** 「关闭调试」条目可见
**WHEN** 用户点击「关闭调试」
**THEN** 系统应当：
- 关闭开发者模式
- 更新 localStorage 状态
- 显示 Toast 提示「调试模式已关闭」
- 隐藏所有调试相关入口

### Requirement: 调试入口可见性控制

系统 **SHALL** 根据开发者模式状态控制调试相关入口的可见性。

#### Scenario: 开发者模式关闭时

**GIVEN** 开发者模式未开启
**WHEN** 用户打开设置面板
**THEN** 以下入口不可见：
- 「日期测试」
- 「灵玉调试」
- 「修为调试」
- 「关闭调试」

#### Scenario: 开发者模式开启时

**GIVEN** 开发者模式已开启
**WHEN** 用户打开设置面板
**THEN** 以下入口可见：
- 「日期测试」
- 「灵玉调试」
- 「修为调试」
- 「关闭调试」

### Requirement: 灵玉调试页面

系统 **SHALL** 在开发者模式下提供灵玉数量直接设置页面。

#### Scenario: 灵玉调试页面入口

**GIVEN** 开发者模式已开启
**WHEN** 用户点击「灵玉调试」入口
**THEN** 跳转到灵玉调试子页面

#### Scenario: 灵玉调试页面内容

**GIVEN** 用户进入灵玉调试页面
**WHEN** 页面渲染完成
**THEN** 显示：
- 当前灵玉余额
- 数字输入框（可直接设置目标值）
- 快捷按钮：+100、+500、+1000、-100、归零

### Requirement: 修为调试页面

系统 **SHALL** 在开发者模式下提供修为数值直接设置页面。

#### Scenario: 修为调试页面入口

**GIVEN** 开发者模式已开启
**WHEN** 用户点击「修为调试」入口
**THEN** 跳转到修为调试子页面

#### Scenario: 修为调试页面内容

**GIVEN** 用户进入修为调试页面
**WHEN** 页面渲染完成
**THEN** 显示：
- 当前修为值
- 当前等级名称
- 数字输入框（可直接设置目标修为）
- 等级变化预览（当前等级 → 目标等级）

