# create-task-modal Specification

## Purpose
TBD - created by archiving change redesign-create-task-modal. Update Purpose after archive.
## Requirements
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

