# Change: DC 模块数据架构重构

## Why

当前 DC 模块的数据架构存在以下问题：
1. **TaskContext 职责过重** - 混合了所有场景的任务数据，缺乏分类管理
2. **查询性能低** - 每次查询都需要遍历整个数组，O(n) 复杂度
3. **缺少缓存机制** - 相同的计算重复执行，浪费资源
4. **UI 状态未持久化** - Tab 状态、滚动位置等丢失
5. **缺少用户信息管理** - 今日必完成、一日清单等索引分散

## What Changes

### 新增 Provider 层级架构

```
AppProvider (系统配置)
  └─ WorldProvider (世界数据)
      └─ UserProvider (用户信息)
          └─ SceneProvider (场景数据 + 索引 + 缓存)
              └─ TaskProvider (任务操作 + 业务逻辑)
                  └─ UIProvider (UI状态 KV存储)
```

### 具体变更

1. **AppProvider** - 合并 ThemeContext，新增推送配置
2. **WorldProvider** - 新增，预留世界活动数据管理
3. **UserProvider** - 新增，管理用户信息和索引
4. **SceneProvider** - 新增，场景数据 + 索引 + 缓存
5. **TaskProvider** - 重构，专注单条任务操作
6. **UIProvider** - 新增，通用 KV 存储

### 性能优化

- 引入 Map 索引，实现 O(1) 查询
- 引入缓存层，避免重复计算
- 智能缓存失效策略

## Impact

- Affected specs: `normal-panel`, `settings-panel`, `daily-view`
- Affected code:
  - `src/pages/dc/contexts/` - 完全重构
  - `src/pages/dc/index.tsx` - 更新 Provider 包装
  - `src/pages/dc/panels/` - 更新 Context 引用
  - `src/pages/dc/components/` - 更新 Context 引用
