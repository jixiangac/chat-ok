/**
 * 背景选择器组件 - 性能优化版本
 */

import React, { useState, useRef, useCallback, memo, useMemo } from 'react';
import { Upload, X } from 'lucide-react';
import type { MemorialBackground } from '../../types';
import { COLOR_BACKGROUNDS, GRADIENT_BACKGROUNDS, getBackgroundStyle, type BackgroundOption } from '../../constants';
import styles from './styles.module.css';

type TabType = 'color' | 'gradient' | 'image';

// ============ 子组件：背景按钮 ============
interface BgButtonProps {
  bg: BackgroundOption;
  isSelected: boolean;
  onClick: () => void;
}

const BgButton = memo(function BgButton({ bg, isSelected, onClick }: BgButtonProps) {
  const style = bg.type === 'gradient' 
    ? { background: bg.value } 
    : { backgroundColor: bg.value };
  
  return (
    <button
      className={`${styles.bgButton} ${isSelected ? styles.selected : ''}`}
      style={style}
      onClick={onClick}
      type="button"
      title={bg.label}
    />
  );
});

// ============ 子组件：标签按钮 ============
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = memo(function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
});

// ============ 主组件：背景选择器 ============
interface BackgroundPickerProps {
  value: MemorialBackground;
  onChange: (background: MemorialBackground) => void;
  /** 仅显示纯色选项（隐藏渐变和图片选项卡） */
  solidOnly?: boolean;
}

export function BackgroundPicker({ value, onChange, solidOnly = false }: BackgroundPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(solidOnly ? 'color' : (value.type === 'image' ? 'image' : value.type));
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 异步压缩图片（使用 requestIdleCallback 避免阻塞主线程）
  const compressImageAsync = useCallback((dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 使用 requestIdleCallback 在空闲时执行压缩
        const doCompress = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let { width, height } = img;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(doCompress, { timeout: 1000 });
        } else {
          setTimeout(doCompress, 0);
        }
      };
      img.src = dataUrl;
    });
  }, []);

  // 处理图片上传
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      // 检查文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }

      setIsCompressing(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        try {
          const compressedData = await compressImageAsync(result);
          onChange({ type: 'image', value: compressedData });
        } finally {
          setIsCompressing(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange, compressImageAsync]
  );

  // 移除图片
  const handleRemoveImage = useCallback(() => {
    onChange({ type: 'color', value: '#FFF5F5' });
    setActiveTab('color');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // 处理颜色选择
  const handleColorSelect = useCallback((bgValue: string) => {
    onChange({ type: 'color', value: bgValue });
  }, [onChange]);

  // 处理渐变选择
  const handleGradientSelect = useCallback((bgValue: string) => {
    onChange({ type: 'gradient', value: bgValue });
  }, [onChange]);

  // 处理标签切换
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // 预览样式
  const previewStyle = useMemo(() => getBackgroundStyle(value), [value]);

  // 渲染预览
  const renderPreview = () => (
    <div className={styles.preview} style={previewStyle}>
      <span className={styles.previewText}>预览效果</span>
    </div>
  );

  // 渲染颜色选择
  const renderColorPicker = () => (
    <div className={styles.grid}>
      {COLOR_BACKGROUNDS.map((bg) => (
        <BgButton
          key={bg.value}
          bg={bg}
          isSelected={value.type === 'color' && value.value === bg.value}
          onClick={() => handleColorSelect(bg.value)}
        />
      ))}
    </div>
  );

  // 渲染渐变选择
  const renderGradientPicker = () => (
    <div className={styles.grid}>
      {GRADIENT_BACKGROUNDS.map((bg) => (
        <BgButton
          key={bg.value}
          bg={bg}
          isSelected={value.type === 'gradient' && value.value === bg.value}
          onClick={() => handleGradientSelect(bg.value)}
        />
      ))}
    </div>
  );

  // 渲染图片上传
  const renderImagePicker = () => {
    if (value.type === 'image' && value.value) {
      return (
        <div className={styles.imagePreview}>
          <img src={value.value} alt="背景图片" />
          <button
            className={styles.removeButton}
            onClick={handleRemoveImage}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      );
    }

    return (
      <div
        className={styles.uploadArea}
        onClick={() => fileInputRef.current?.click()}
      >
        {isCompressing ? (
          <>
            <div className={styles.spinner} />
            <span className={styles.uploadText}>正在压缩图片...</span>
          </>
        ) : (
          <>
            <Upload size={24} className={styles.uploadIcon} />
            <span className={styles.uploadText}>点击上传图片</span>
            <span className={styles.uploadHint}>支持 JPG、PNG，最大 5MB</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.hiddenInput}
          disabled={isCompressing}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 预览 - solidOnly 模式下不显示预览 */}
      {!solidOnly && renderPreview()}

      {/* 标签页 - solidOnly 模式下不显示标签页 */}
      {!solidOnly && (
        <div className={styles.tabs}>
          <TabButton
            label="纯色"
            isActive={activeTab === 'color'}
            onClick={() => handleTabChange('color')}
          />
          <TabButton
            label="渐变"
            isActive={activeTab === 'gradient'}
            onClick={() => handleTabChange('gradient')}
          />
          <TabButton
            label="图片"
            isActive={activeTab === 'image'}
            onClick={() => handleTabChange('image')}
          />
        </div>
      )}

      {/* 内容 */}
      {activeTab === 'color' && renderColorPicker()}
      {!solidOnly && activeTab === 'gradient' && renderGradientPicker()}
      {!solidOnly && activeTab === 'image' && renderImagePicker()}
    </div>
  );
}

export default BackgroundPicker;
