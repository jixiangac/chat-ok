# memorial-panel Specification

## Purpose
TBD - created by archiving change add-memorial-panel. Update Purpose after archive.
## Requirements
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

系统 **SHALL** 支持用户通过步骤式流程创建纪念日，并消耗灵玉。

#### Scenario: 步骤式创建纪念日

**Given** 用户在纪念日面板点击添加按钮
**When** 创建弹窗打开
**Then** 显示步骤式创建流程：
- 第 1 步：名称 + 日期输入
- 第 2 步：背景选择（图片/渐变/纯色）
- 第 3 步：预览面板

#### Scenario: 第 1 步 - 基本信息

**Given** 用户在创建流程第 1 步
**When** 页面显示
**Then** 显示：
- 名称输入框（必填）
- 日期选择器（必填）
- 「下一步」按钮

#### Scenario: 第 2 步 - 背景选择

**Given** 用户在创建流程第 2 步
**When** 页面显示
**Then** 显示：
- 纯色选项列表
- 渐变选项列表
- 图片上传入口
- 「返回」和「下一步」按钮

#### Scenario: 第 3 步 - 预览确认

**Given** 用户在创建流程第 3 步
**When** 页面显示
**Then** 显示：
- 纪念日卡片预览效果
- 显示消耗提示「将消耗 50 灵玉」
- 「返回」和「确认创建」按钮

#### Scenario: 创建纪念日消耗灵玉

**Given** 用户在第 3 步点击「确认创建」
**When** 用户灵玉余额 >= 50
**Then**
- 扣除 50 灵玉
- 创建纪念日并保存到 localStorage
- 关闭创建弹窗
- 显示成功 Toast

#### Scenario: 创建纪念日灵玉不足

**Given** 用户在第 3 步点击「确认创建」
**When** 用户灵玉余额 < 50
**Then** 显示灵玉不足提示弹窗
**And** 不执行创建操作

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

