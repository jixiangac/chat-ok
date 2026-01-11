/**
 * 图标选择器组件 - 性能优化版本
 */

import React, { memo, useMemo, useCallback } from 'react';
import { PRESET_ICONS, CRAYON_COLORS, getIconConfig, type IconConfig } from '../../constants';
import styles from './styles.module.css';

// ============ 子组件：图标按钮 ============
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

// ============ 子组件：颜色按钮 ============
interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const ColorButton = memo(function ColorButton({
  color,
  isSelected,
  onClick,
}: ColorButtonProps) {
  return (
    <button
      className={`${styles.colorButton} ${isSelected ? styles.selected : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      type="button"
    />
  );
});

// ============ 主组件：图标选择器 ============
interface IconPickerProps {
  selectedIcon: string;
  selectedColor: string;
  onIconChange: (iconName: string) => void;
  onColorChange: (color: string) => void;
}

export function IconPicker({
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
}: IconPickerProps) {
  // 获取当前选中的图标配置
  const currentIconConfig = useMemo(() => {
    return getIconConfig(selectedIcon) || PRESET_ICONS[0];
  }, [selectedIcon]);

  const PreviewIcon = currentIconConfig.component;

  // 使用 useCallback 优化点击事件处理
  const handleIconClick = useCallback((iconName: string) => {
    onIconChange(iconName);
  }, [onIconChange]);

  const handleColorClick = useCallback((color: string) => {
    onColorChange(color);
  }, [onColorChange]);

  return (
    <div className={styles.container}>
      {/* 预览 */}
      <div className={styles.preview}>
        <div
          className={styles.previewIcon}
          style={{ backgroundColor: `${selectedColor}33` }}
        >
          <PreviewIcon size={32} color={selectedColor} strokeWidth={1.5} />
        </div>
      </div>

      {/* 图标选择 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>选择图标</div>
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
      </div>

      {/* 颜色选择 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>选择颜色</div>
        <div className={styles.colorGrid}>
          {CRAYON_COLORS.map((color) => (
            <ColorButton
              key={color}
              color={color}
              isSelected={color === selectedColor}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconPicker;
