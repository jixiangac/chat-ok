## MODIFIED Requirements

### Requirement: 页面整体布局

系统 **SHALL** 采用单屏聚焦布局，从上到下依次为：顶部栏、今日进度卡片、周期进展卡片、二级入口。

#### Scenario: 页面结构

- **GIVEN** 用户打开任务详情页
- **WHEN** 页面加载完成
- **THEN** 页面从上到下显示：顶部栏（48px）、今日进度卡片、周期进展卡片、二级入口、SafeArea

#### Scenario: 单屏展示

- **GIVEN** 用户在任意屏幕尺寸设备上
- **WHEN** 查看详情页
- **THEN** 所有核心内容一屏展示，无需滚动

---

### Requirement: CHECK_IN 类型 - 咖啡杯视觉

系统 **SHALL** 为打卡型任务使用咖啡杯水位隐喻展示进度。

#### Scenario: 咖啡杯布局

- **GIVEN** 任务类型为 CHECK_IN
- **WHEN** 显示今日进度卡片
- **THEN** 显示咖啡杯图形（水位高度=周期完成度）、今日进度条、打卡按钮

#### Scenario: 水位动画

- **GIVEN** 用户完成打卡
- **WHEN** 打卡成功
- **THEN** 今日进度条增长动画、咖啡杯水位上涨动画、触发 confetti 彩纸效果

---

### Requirement: NUMERIC 增加型 - 杯子注水视觉

系统 **SHALL** 为数值增加型任务使用杯子注水隐喻。

#### Scenario: 注水杯布局

- **GIVEN** 任务类型为 NUMERIC 且方向为增加（INCREASE）
- **WHEN** 显示今日进度卡片
- **THEN** 显示杯子图形、当前数值、趋势指示、「记录新数据」按钮

#### Scenario: 注水动画

- **GIVEN** 用户记录新数据
- **WHEN** 数据保存成功
- **THEN** 水位上涨动画，水滴落入效果

---

### Requirement: NUMERIC 减少型 - 冰块融化视觉

系统 **SHALL** 为数值减少型任务使用冰块融化隐喻。

#### Scenario: 冰块布局

- **GIVEN** 任务类型为 NUMERIC 且方向为减少（DECREASE）
- **WHEN** 显示今日进度卡片
- **THEN** 显示冰块图形（大小=剩余比例）、水滴效果、当前数值、趋势指示、「记录新数据」按钮

#### Scenario: 融化动画

- **GIVEN** 用户记录新数据且数值减少
- **WHEN** 数据保存成功
- **THEN** 冰块缩小动画，水滴滴落效果

---

### Requirement: 二级入口

系统 **SHALL** 提供简约的二级页面入口。

#### Scenario: 二级入口布局

- **GIVEN** 详情页显示
- **WHEN** 查看二级入口区域
- **THEN** 显示横向排列的「记录」和「计划」两个入口

#### Scenario: 进入记录页

- **GIVEN** 用户点击「记录」入口
- **WHEN** 页面跳转
- **THEN** 打开全屏 Popup，显示 CheckInHistoryPanel 内容

#### Scenario: 进入计划页

- **GIVEN** 用户点击「计划」入口
- **WHEN** 页面跳转
- **THEN** 打开全屏 Popup，显示 HistoryCyclePanel 内容

---

## REMOVED Requirements

### Requirement: Tab 切换系统

**Reason**: 简化为单屏聚焦设计，不再需要多 Tab 切换
**Migration**: 原 Tab 内容整合到单屏布局，历史记录和周期计划移至二级页面
