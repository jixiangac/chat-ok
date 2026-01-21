# Spec: create-task-modal

创建任务弹窗的交互和 UI 规格定义。

---

## ADDED Requirements

### Requirement: 全屏整屏横移交互模式

创建任务弹窗 **SHALL** 采用全屏整屏横移的交互模式，与设置页面保持一致。

#### Scenario: 打开创建任务弹窗

- **Given** 用户在主页面
- **When** 用户点击创建任务按钮
- **Then** 创建任务面板从屏幕右侧滑入，覆盖整个屏幕
- **And** 动画时长为 400ms，使用 ease-out 缓动

#### Scenario: 关闭创建任务弹窗

- **Given** 用户在创建任务面板的第一个页面
- **When** 用户点击返回按钮或向右滑动
- **Then** 面板向右滑出，返回主页面
- **And** 动画时长为 400ms，使用 ease-in 缓动

---

### Requirement: 页面栈管理

创建任务流程 **SHALL** 使用页面栈管理，支持多级页面导航。

#### Scenario: 进入下一步

- **Given** 用户在周期设置页面
- **When** 用户点击下一步按钮
- **Then** 类型选择页面从右侧滑入
- **And** 周期设置页面缩小并向左偏移作为背景

#### Scenario: 返回上一步

- **Given** 用户在类型选择页面
- **When** 用户点击返回按钮
- **Then** 类型选择页面向右滑出
- **And** 周期设置页面恢复为活动状态

---

### Requirement: 手势滑动返回

创建任务弹窗 **SHALL** 支持手势滑动返回上一步。

#### Scenario: 滑动返回上一步

- **Given** 用户在类型选择页面或配置页面
- **When** 用户从屏幕左边缘向右滑动
- **Then** 页面跟随手指移动
- **And** 滑动距离超过阈值时返回上一步

#### Scenario: 滑动关闭弹窗

- **Given** 用户在创建任务的第一个页面
- **When** 用户从屏幕左边缘向右滑动
- **Then** 整个弹窗向右滑出并关闭

---

### Requirement: SubPageLayout 页面布局

每个步骤页面 **SHALL** 使用 SubPageLayout 布局，包含头图、标题和内容区。

#### Scenario: 周期设置页面布局

- **Given** 用户打开创建任务弹窗
- **When** 周期设置页面显示
- **Then** 页面顶部显示头图区域
- **And** 头图上方有返回按钮
- **And** 头图下方显示标题和描述文字

#### Scenario: 类型选择页面布局

- **Given** 用户进入类型选择步骤
- **When** 类型选择页面显示
- **Then** 页面采用相同的 SubPageLayout 布局
- **And** 标题为任务类型

---

### Requirement: SettingsListItem 选项样式

配置选项 **SHALL** 使用 SettingsListItem 组件样式，保持与设置页面一致。

#### Scenario: 总时长选项显示

- **Given** 用户在周期设置页面
- **When** 查看总时长选项
- **Then** 每个选项使用白色圆角卡片样式
- **And** 左侧显示图标，中间显示标题和描述
- **And** 选中项右侧显示勾选图标

#### Scenario: 选项点击反馈

- **Given** 用户在周期设置页面
- **When** 用户点击某个总时长选项
- **Then** 卡片有轻微缩放反馈
- **And** 选中状态立即切换

---

### Requirement: 翻书动画效果

列表项 **SHALL** 支持翻书动画，提供交错入场效果。

#### Scenario: 页面加载时的翻书动画

- **Given** 用户进入某个步骤页面
- **When** 页面内容加载
- **Then** 列表项依次以翻书动画入场
- **And** 每项间隔 60ms
- **And** 动画从顶部翻转入场

#### Scenario: 减少动画偏好

- **Given** 用户系统设置了减少动画偏好
- **When** 页面加载
- **Then** 跳过翻书动画，直接显示内容

---

### Requirement: BottomFixedButton 底部按钮

每个页面底部 **SHALL** 有固定的操作按钮。

#### Scenario: 下一步按钮

- **Given** 用户在周期设置或类型选择页面
- **When** 查看页面底部
- **Then** 显示固定的下一步按钮
- **And** 按钮样式为主色填充

#### Scenario: 创建任务按钮

- **Given** 用户在配置页面
- **When** 查看页面底部
- **Then** 显示创建任务按钮
- **And** 点击后触发任务创建

#### Scenario: 按钮禁用状态

- **Given** 用户在类型选择页面且未选择类型
- **When** 查看下一步按钮
- **Then** 按钮显示为禁用状态
- **And** 点击无响应

---

### Requirement: CSS Modules 样式方案

所有样式 **SHALL** 使用 CSS Modules 实现，避免内联样式。

#### Scenario: 样式文件结构

- **Given** CreateTaskModal 组件目录
- **When** 查看文件结构
- **Then** 每个页面组件有对应的 styles.module.css 文件
- **And** 类名使用语义化命名

#### Scenario: 样式复用

- **Given** 需要使用设置页面的样式
- **When** 编写样式代码
- **Then** 应复用设置页面的 CSS 变量和动画关键帧
- **And** 保持视觉一致性

---

## ADDED Requirements

### Requirement: 保持现有功能

重新设计后 **SHALL** 保持所有现有功能不变。

#### Scenario: 主线任务创建

- **Given** 用户没有主线任务
- **When** 完成创建流程
- **Then** 成功创建主线任务
- **And** 扣除相应灵玉

#### Scenario: 支线任务创建

- **Given** 用户已有主线任务
- **When** 完成创建流程
- **Then** 成功创建支线任务
- **And** 自动分配下一个可用的主题色

#### Scenario: 灵玉不足提示

- **Given** 用户灵玉余额不足
- **When** 尝试创建任务
- **Then** 显示余额不足的 Toast 提示
- **And** 不执行创建操作

#### Scenario: 创建成功动画

- **Given** 任务创建成功
- **When** 弹窗关闭
- **Then** 触发彩纸庆祝动画
