/**
 * 主题设置组件
 * 支持预览模式，点击保存才生效
 * 底部固定保存按钮（固定颜色，不随主题变化）
 */

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { SafeArea } from 'antd-mobile';
import { useTheme, themePresets, ThemeKey } from '../theme';
import './index.css';

interface ThemeSettingsProps {
  onBack: () => void;
}

export default function ThemeSettings({ onBack }: ThemeSettingsProps) {
  const { currentTheme, setTheme } = useTheme();
  
  // 预览主题（本地状态，未保存）
  const [previewTheme, setPreviewTheme] = useState<ThemeKey>(currentTheme);
  
  // 是否有未保存的更改
  const hasChanges = previewTheme !== currentTheme;

  // 初始化预览主题
  useEffect(() => {
    setPreviewTheme(currentTheme);
  }, [currentTheme]);

  // 处理主题选择（仅预览）
  const handleThemeSelect = (key: ThemeKey) => {
    setPreviewTheme(key);
  };

  // 保存主题
  const handleSave = () => {
    setTheme(previewTheme);
    onBack();
  };

  const themeEntries = Object.entries(themePresets) as [ThemeKey, typeof themePresets.default][];

  return (
    <div className="theme-settings theme-settings-with-bottom">
      {/* 主题颜色网格选择 */}
      <div className="theme-color-grid">
        {themeEntries.map(([key, theme]) => (
          <div
            key={key}
            className={`theme-color-card ${previewTheme === key ? 'selected' : ''}`}
            onClick={() => handleThemeSelect(key)}
          >
            <div 
              className="theme-color-circle"
              style={{ backgroundColor: theme.primary }}
            >
              {previewTheme === key && (
                <Check size={16} color="white" />
              )}
            </div>
            <span className="theme-color-name">{theme.name}</span>
          </div>
        ))}
      </div>

      {/* 预览区域 */}
      <div className="theme-preview-section">
        <p className="theme-preview-label">预览效果</p>
        <div className="theme-preview-card">
          <div className="theme-preview-buttons">
            <button 
              className="theme-preview-btn primary"
              style={{ 
                backgroundColor: themePresets[previewTheme].primary,
                borderColor: themePresets[previewTheme].primary
              }}
            >
              主要按钮
            </button>
            <button 
              className="theme-preview-btn outline"
              style={{ 
                color: themePresets[previewTheme].primary,
                borderColor: themePresets[previewTheme].primary
              }}
            >
              次要按钮
            </button>
          </div>
          <div 
            className="theme-preview-accent"
            style={{ backgroundColor: themePresets[previewTheme].primary }}
          />
        </div>
        {hasChanges && (
          <p className="theme-preview-hint">
            点击保存按钮应用主题更改
          </p>
        )}
      </div>

      {/* 底部固定保存按钮 - 使用固定颜色，不随主题变化 */}
      <div className="theme-settings-bottom-fixed">
        <button 
          className={`theme-settings-save-btn ${hasChanges ? 'active' : ''}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          {hasChanges ? '保存更改' : '未修改'}
        </button>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}
