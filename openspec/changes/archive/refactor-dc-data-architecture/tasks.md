# DC 模块数据架构重构 - 任务清单

## 1. 阶段一：基础设施

### 1.1 创建 AppProvider
- [x] 1.1.1 创建 `contexts/AppProvider/types.ts` - 类型定义
- [x] 1.1.2 创建 `contexts/AppProvider/storage.ts` - 存储逻辑
- [x] 1.1.3 创建 `contexts/AppProvider/index.tsx` - Provider 实现
- [x] 1.1.4 迁移 ThemeContext 功能到 AppProvider

### 1.2 创建 UIProvider
- [x] 1.2.1 创建 `contexts/UIProvider/types.ts` - 类型定义
- [x] 1.2.2 创建 `contexts/UIProvider/keys.ts` - Key 常量
- [x] 1.2.3 创建 `contexts/UIProvider/index.tsx` - KV 存储实现
- [x] 1.2.4 创建 `contexts/UIProvider/hooks.ts` - 便捷 Hooks

## 2. 阶段二：核心功能

### 2.1 创建 WorldProvider
- [x] 2.1.1 创建 `contexts/WorldProvider/types.ts` - 类型定义
- [x] 2.1.2 创建 `contexts/WorldProvider/index.tsx` - Provider 实现（预留）

### 2.2 创建 UserProvider
- [x] 2.2.1 创建 `contexts/UserProvider/types.ts` - 类型定义
- [x] 2.2.2 创建 `contexts/UserProvider/storage.ts` - 存储逻辑
- [x] 2.2.3 创建 `contexts/UserProvider/index.tsx` - Provider 实现

### 2.3 创建 SceneProvider
- [x] 2.3.1 创建 `contexts/SceneProvider/types.ts` - 类型定义
- [x] 2.3.2 创建 `contexts/SceneProvider/indexBuilder.ts` - 索引构建器
- [x] 2.3.3 创建 `contexts/SceneProvider/cacheManager.ts` - 缓存管理器
- [x] 2.3.4 创建 `contexts/SceneProvider/storage.ts` - 存储逻辑
- [x] 2.3.5 创建 `contexts/SceneProvider/index.tsx` - Provider 实现

### 2.4 重构 TaskProvider
- [x] 2.4.1 创建 `contexts/TaskProvider/types.ts` - 类型定义
- [ ] 2.4.2 创建 `contexts/TaskProvider/validators.ts` - 验证器（待完善）
- [ ] 2.4.3 创建 `contexts/TaskProvider/calculators/` - 计算器模块（待完善）
- [x] 2.4.4 创建 `contexts/TaskProvider/index.tsx` - Provider 实现

## 3. 阶段三：集成和迁移

### 3.1 更新入口文件
- [x] 3.1.1 更新 `contexts/index.ts` - 统一导出
- [x] 3.1.2 更新 `index.tsx` - Provider 层级包装

### 3.2 数据迁移
- [x] 3.2.1 创建数据迁移脚本（已在 SceneProvider/storage.ts 中实现）
- [x] 3.2.2 迁移现有任务数据到新结构（自动迁移）

### 3.3 组件适配
- [ ] 3.3.1 更新 panels 使用新 Context
- [ ] 3.3.2 更新 components 使用新 Context
- [ ] 3.3.3 更新 hooks 使用新 Context

## 4. 阶段四：清理和优化

### 4.1 清理旧代码
- [ ] 4.1.1 删除旧的 TaskContext.tsx
- [ ] 4.1.2 删除旧的 ThemeContext.tsx
- [ ] 4.1.3 删除旧的 UIStateContext.tsx

### 4.2 测试和优化
- [ ] 4.2.1 功能测试
- [ ] 4.2.2 性能测试
- [ ] 4.2.3 优化缓存策略

