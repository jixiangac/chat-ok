# 设计文档：纪念日面板性能优化

## 1. 架构概述

### 当前架构问题

```
MemorialPanel
├── useMemorials (每次操作全量排序)
├── MemorialCard[] (无虚拟化)
├── CreateMemorialModal (同步加载所有子组件)
│   ├── IconPicker (25个图标同步渲染)
│   └── BackgroundPicker (图片压缩阻塞主线程)
└── MemorialDetail
```

### 优化后架构

```
MemorialPanel
├── useMemorials (增量更新 + 缓存排序)
├── MemorialCard[] (memo优化 + 可选虚拟列表)
├── CreateMemorialModal (懒加载子组件)
│   ├── Suspense
│   │   ├── IconPicker (memo优化 + 懒加载)
│   │   └── BackgroundPicker (Web Worker压缩)
└── MemorialDetail
```

## 2. 组件优化详细设计

### 2.0 替换 CalendarPicker 为 DatePicker（最高优先级）

#### 问题分析
- `CalendarPicker` 组件渲染完整的日历网格视图
- 每个月份包含 42 个日期单元格（6行 x 7列）
- 切换月份时需要重新渲染整个日历
- 日期范围设置为 1900-2100 年，计算量大

#### 解决方案

将 `CalendarPicker` 替换为 `DatePicker`，使用滚轮选择模式：

```tsx
// 修改前
import { CalendarPicker } from 'antd-mobile';

<CalendarPicker
  visible={calendarVisible}
  onClose={() => setCalendarVisible(false)}
  selectionMode="single"
  defaultValue={date}
  min={new Date(1900, 0, 1)}
  max={new Date(2100, 11, 31)}
  onConfirm={handleDateConfirm}
/>

// 修改后
import { DatePicker } from 'antd-mobile';

<DatePicker
  visible={calendarVisible}
  onClose={() => setCalendarVisible(false)}
  precision="day"
  value={date}
  min={new Date(1900, 0, 1)}
  max={new Date(2100, 11, 31)}
  onConfirm={handleDateConfirm}
/>
```

#### 优势
- `DatePicker` 使用滚轮选择，只渲染可见的选项
- DOM 节点数量大幅减少（从 42+ 减少到约 15 个）
- 滚动切换更流畅，无需重新渲染整个视图
- 用户体验更接近原生日期选择器

### 2.1 IconPicker 优化

#### 问题分析
- 25 个 Lucide 图标组件在每次渲染时都会重新创建
- 点击事件处理函数未使用 useCallback

#### 解决方案

```tsx
// 1. 创建 IconButton 子组件并使用 memo
interface IconButtonProps {
  icon: IconConfig;
  isSelected: boolean;
  selectedColor: string;
  onClick: () => void;
}

const IconButton = memo(function IconButton({
  icon,
  isSelected,
  selectedColor,
  onClick,
}: IconButtonProps) {
  const IconComponent = icon.component;
  return (
    <button
      className={`${styles.iconButton} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      type="button"
    >
      <IconComponent
        size={24}
        color={isSelected ? selectedColor : 'rgba(55, 53, 47, 0.65)'}
        strokeWidth={1.5}
      />
    </button>
  );
});

// 2. 在 IconPicker 中使用 useCallback
export function IconPicker({ selectedIcon, selectedColor, onIconChange, onColorChange }) {
  const handleIconClick = useCallback((iconName: string) => {
    onIconChange(iconName);
  }, [onIconChange]);

  const handleColorClick = useCallback((color: string) => {
    onColorChange(color);
  }, [onColorChange]);

  return (
    <div className={styles.iconGrid}>
      {PRESET_ICONS.map((icon) => (
        <IconButton
          key={icon.name}
          icon={icon}
          isSelected={icon.name === selectedIcon}
          selectedColor={selectedColor}
          onClick={() => handleIconClick(icon.name)}
        />
      ))}
    </div>
  );
}
```

### 2.2 CreateMemorialModal 懒加载

#### 解决方案

```tsx
import React, { Suspense, lazy } from 'react';

// 懒加载组件
const IconPicker = lazy(() => import('../IconPicker'));
const BackgroundPicker = lazy(() => import('../BackgroundPicker'));

// 加载骨架屏
function PickerSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.skeletonItem} />
        ))}
      </div>
    </div>
  );
}

export function CreateMemorialModal({ visible, onClose, onSubmit, editingMemorial }) {
  // ... 其他代码

  return (
    <div className={styles.modal}>
      {/* 图标选择 - 懒加载 */}
      <Suspense fallback={<PickerSkeleton />}>
        <IconPicker
          selectedIcon={icon}
          selectedColor={iconColor}
          onIconChange={setIcon}
          onColorChange={setIconColor}
        />
      </Suspense>

      {/* 背景选择 - 懒加载 */}
      <Suspense fallback={<PickerSkeleton />}>
        <BackgroundPicker value={background} onChange={setBackground} />
      </Suspense>
    </div>
  );
}
```

### 2.3 BackgroundPicker 图片压缩优化

#### Web Worker 实现

```ts
// workers/imageCompressor.worker.ts
self.onmessage = async (e: MessageEvent) => {
  const { imageData, maxSize, quality } = e.data;
  
  // 创建 OffscreenCanvas
  const img = await createImageBitmap(await fetch(imageData).then(r => r.blob()));
  
  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = (height * maxSize) / width;
    width = maxSize;
  } else if (height > maxSize) {
    width = (width * maxSize) / height;
    height = maxSize;
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, width, height);

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  const reader = new FileReader();
  reader.onload = () => {
    self.postMessage({ result: reader.result });
  };
  reader.readAsDataURL(blob);
};
```

#### 组件集成

```tsx
// hooks/useImageCompressor.ts
export function useImageCompressor() {
  const workerRef = useRef<Worker | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/imageCompressor.worker.ts', import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  const compress = useCallback((imageData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsCompressing(true);
      workerRef.current.onmessage = (e) => {
        setIsCompressing(false);
        resolve(e.data.result);
      };
      workerRef.current.onerror = (e) => {
        setIsCompressing(false);
        reject(e);
      };
      workerRef.current.postMessage({
        imageData,
        maxSize: 800,
        quality: 0.8,
      });
    });
  }, []);

  return { compress, isCompressing };
}
```

### 2.5 纪念日模式专属精灵图片

#### 需求
纪念日/度假模式下，`randomizeSpriteImage` 应使用专属的图片列表，而非基于时间段的默认图片。

#### 实现方案

1. 在 `sprites.ts` 中添加纪念日专属图片常量：

```typescript
// src/pages/dc/constants/sprites.ts

/**
 * 纪念日模式专属精灵图片
 */
export const MEMORIAL_SPRITE_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01F8l0Tl1mu0awjBaMv_!!6000000005013-2-tps-1080-913.png',
  'https://img.alicdn.com/imgextra/i2/O1CN014inOqq1ir1YDFC7dU_!!6000000004465-2-tps-1080-1001.png',
  'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01z4bPnp1KoEM5j3N5E_!!6000000001210-2-tps-1080-932.png',
  'https://img.alicdn.com/imgextra/i4/O1CN014kAwOY1Rgd5shGzLy_!!6000000002141-2-tps-1080-994.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01CnFOKB1m1xrK7E2dG_!!6000000004895-2-tps-1080-947.png',
  'https://img.alicdn.com/imgextra/i1/O1CN01QGHKyK1d27S1IWGBA_!!6000000003677-2-tps-1080-948.png'
];

/**
 * 度假模式专属精灵图片
 */
export const TRIP_SPRITE_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01W4MwCM1qOBXJfTbyJ_!!6000000005485-2-tps-1080-850.png',
  'https://img.alicdn.com/imgextra/i3/O1CN01Y3uIe11K90i2oxIab_!!6000000001120-2-tps-1080-964.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01LPseEd1eyZcGyNuJm_!!6000000003940-2-tps-1080-792.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01TAuVKv1wfUC51TPIv_!!6000000006335-2-tps-1080-831.png'
];

```


2. 修改 `useSpriteImage` hook，支持模式参数：

```typescript
// src/pages/dc/hooks/useSpriteImage.ts

type SpriteMode = 'default' | 'memorial';

export function useSpriteImage(mode: SpriteMode = 'default') {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(-1);

  /**
   * 获取当前模式的图片列表
   */
  const getImagesList = useCallback(() => {
    if (mode === 'memorial') {
      return MEMORIAL_SPRITE_IMAGES;
    }
    const timeSlot = getCurrentTimeSlot();
    return SPRITE_IMAGES[timeSlot];
  }, [mode]);

  // ... 其余代码保持不变
}
```

3. 在纪念日面板中使用：

```typescript
// src/pages/dc/panels/memorial/index.tsx

export default function MemorialPanel() {
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage('memorial');
  // ...
}
```

### 2.6 useMemorials Hook 优化

#### 增量更新实现

```tsx
export function useMemorials(): UseMemorialsReturn {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  // 使用 useMemo 缓存排序结果
  const sortedMemorials = useMemo(() => {
    return sortMemorials(memorials);
  }, [memorials]);

  // 添加纪念日 - 增量更新
  const addMemorial = useCallback((data: CreateMemorialInput): Memorial => {
    const now = Date.now();
    const newMemorial: Memorial = {
      ...data,
      id: generateId(),
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setMemorials(prev => {
      const updated = [...prev, newMemorial];
      // 异步保存，不阻塞 UI
      requestIdleCallback(() => saveMemorials(sortMemorials(updated)));
      return updated;
    });

    return newMemorial;
  }, []);

  // 更新纪念日 - 增量更新
  const updateMemorial = useCallback((id: string, data: UpdateMemorialInput) => {
    setMemorials(prev => {
      const updated = prev.map(m =>
        m.id === id ? { ...m, ...data, updatedAt: Date.now() } : m
      );
      requestIdleCallback(() => saveMemorials(sortMemorials(updated)));
      return updated;
    });
  }, []);

  // 删除纪念日 - 增量更新
  const deleteMemorial = useCallback((id: string) => {
    setMemorials(prev => {
      const updated = prev.filter(m => m.id !== id);
      requestIdleCallback(() => saveMemorials(updated));
      return updated;
    });
  }, []);

  return {
    memorials: sortedMemorials,
    loading,
    addMemorial,
    updateMemorial,
    deleteMemorial,
    // ...
  };
}
```

## 3. 性能指标

### 优化前预估
- 弹窗打开时间：200-500ms
- 列表滚动帧率：30-45fps（大量数据时）
- 图片上传响应：界面冻结 1-3s

### 优化后目标
- 弹窗打开时间：< 100ms
- 列表滚动帧率：稳定 60fps
- 图片上传响应：界面保持响应

## 4. 兼容性考虑

### Web Worker 兼容性
- 现代浏览器均支持 Web Worker
- 降级方案：检测不支持时使用主线程压缩

```tsx
const supportsWorker = typeof Worker !== 'undefined';

const compress = supportsWorker
  ? compressWithWorker
  : compressInMainThread;
```

### React.lazy 兼容性
- React 16.6+ 支持
- 项目使用 React 18，完全兼容

## 5. 测试策略

### 单元测试
- 测试 useMemorials 的增量更新逻辑
- 测试图片压缩 Worker 的正确性

### 性能测试
- 使用 React DevTools Profiler 验证渲染次数
- 使用 Chrome Performance 面板验证帧率
- 使用 Lighthouse 验证整体性能分数

### 集成测试
- 验证所有现有功能正常工作
- 验证边界情况（空列表、大量数据等）
