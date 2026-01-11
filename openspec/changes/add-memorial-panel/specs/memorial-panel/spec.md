# Spec: 纪念日面板

## 概述

纪念日面板是 DC 模块的一个功能面板，允许用户创建和管理纪念日，支持正计时和倒计时显示。

---

## ADDED Requirements

### Requirement: 纪念日数据模型

系统 **SHALL** 定义纪念日数据结构。

#### Scenario: 创建纪念日数据

**Given** 用户填写纪念日信息
**When** 保存纪念日
**Then** 系统创建包含以下字段的纪念日对象：
- `id`: 唯一标识符
- `name`: 纪念日名称
- `date`: 日期 (YYYY-MM-DD)
- `icon`: lucide-react 图标名称
- `iconColor`: 图标颜色（蜡笔风格）
- `note`: 备注说明（可选）
- `background`: 背景设置（类型 + 值）
- `isPinned`: 是否置顶
- `pinnedAt`: 置顶时间戳（可选）
- `createdAt`: 创建时间戳
- `updatedAt`: 更新时间戳

---

### Requirement: 纪念日 CRUD 操作

系统 **SHALL** 支持用户创建、读取、更新、删除纪念日。

#### Scenario: 创建纪念日

**Given** 用户在纪念日面板
**When** 用户点击添加按钮并填写表单
**Then** 系统创建新的纪念日并保存到 localStorage

#### Scenario: 编辑纪念日

**Given** 用户查看纪念日详情
**When** 用户点击编辑按钮并修改信息
**Then** 系统更新纪念日数据

#### Scenario: 删除纪念日

**Given** 用户查看纪念日详情
**When** 用户点击删除按钮并确认
**Then** 系统删除该纪念日

---

### Requirement: 正计时和倒计时显示

系统 **SHALL** 自动根据日期判断显示正计时或倒计时。

#### Scenario: 过去日期显示正计时

**Given** 纪念日日期为过去的日期
**When** 显示纪念日
**Then** 显示"已 X 天"格式

#### Scenario: 未来日期显示倒计时

**Given** 纪念日日期为未来的日期
**When** 显示纪念日
**Then** 显示"还有 X 天"格式

#### Scenario: 今天日期显示特殊文案

**Given** 纪念日日期为今天
**When** 显示纪念日
**Then** 显示"今天"

---

### Requirement: 天数格式切换

系统 **SHALL** 支持用户切换天数的显示格式。

#### Scenario: 循环切换格式

**Given** 用户在详情页查看天数
**When** 用户点击天数区域
**Then** 格式按以下顺序循环切换：
1. 天数（如：365 天）
2. 月+天（如：12 个月 5 天）
3. 年+月+天（如：1 年 0 个月 5 天）

#### Scenario: 记忆用户偏好

**Given** 用户切换了天数格式
**When** 用户下次打开详情页
**Then** 显示上次选择的格式

---

### Requirement: 置顶功能

系统 **SHALL** 支持用户置顶重要的纪念日。

#### Scenario: 置顶纪念日

**Given** 用户查看纪念日详情
**When** 用户点击置顶按钮
**Then** 该纪念日被置顶，记录置顶时间

#### Scenario: 取消置顶

**Given** 用户查看已置顶的纪念日详情
**When** 用户点击取消置顶按钮
**Then** 该纪念日取消置顶

#### Scenario: 置顶排序

**Given** 存在多个置顶的纪念日
**When** 显示纪念日列表
**Then** 置顶的纪念日按置顶时间倒序排列在最前面

---

### Requirement: 列表排序

系统 **SHALL** 按特定规则对纪念日列表进行排序。

#### Scenario: 默认排序规则

**Given** 存在多个纪念日
**When** 显示纪念日列表
**Then** 按以下规则排序：
1. 置顶的纪念日优先（按置顶时间倒序）
2. 非置顶的按创建时间倒序

---

### Requirement: 图标选择

系统 **SHALL** 支持用户为纪念日选择图标。

#### Scenario: 选择预设图标

**Given** 用户创建或编辑纪念日
**When** 用户打开图标选择器
**Then** 显示 lucide-react 预设图标列表，每个图标有蜡笔风格默认颜色

#### Scenario: 自定义图标颜色

**Given** 用户选择了图标
**When** 用户选择颜色
**Then** 图标使用用户选择的蜡笔风格颜色

---

### Requirement: 背景设置

系统 **SHALL** 支持用户为纪念日详情页设置背景。

#### Scenario: 选择纯色背景

**Given** 用户创建或编辑纪念日
**When** 用户选择纯色背景
**Then** 详情页使用该纯色作为背景

#### Scenario: 选择渐变背景

**Given** 用户创建或编辑纪念日
**When** 用户选择渐变背景
**Then** 详情页使用该渐变作为背景

#### Scenario: 上传图片背景

**Given** 用户创建或编辑纪念日
**When** 用户上传图片
**Then** 图片被压缩并存储为 base64，详情页使用该图片作为背景

---

### Requirement: 空状态处理

系统 **SHALL** 在没有纪念日时显示引导内容。

#### Scenario: 显示示例卡片

**Given** 用户没有创建任何纪念日
**When** 用户进入纪念日面板
**Then** 显示示例卡片引导用户创建

---

### Requirement: 数据持久化

系统 **SHALL** 使用 localStorage 存储纪念日数据。

#### Scenario: 保存数据

**Given** 用户创建或修改纪念日
**When** 操作完成
**Then** 数据保存到 localStorage（键：`dc_memorials`）

#### Scenario: 加载数据

**Given** 用户打开纪念日面板
**When** 面板初始化
**Then** 从 localStorage 加载纪念日数据

#### Scenario: 格式偏好持久化

**Given** 用户切换天数显示格式
**When** 切换完成
**Then** 偏好保存到 localStorage（键：`dc_memorial_date_format`）

---

## 相关能力

- DC 模块任务管理系统
- localStorage 数据持久化
- lucide-react 图标库
