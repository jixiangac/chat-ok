import { Check } from 'lucide-react';
import { useTheme, themePresets, ThemeKey } from '../theme';
import './index.css';

interface ThemeSettingsProps {
  onBack: () => void;
}

export default function ThemeSettings({ onBack }: ThemeSettingsProps) {
  const { currentTheme, setTheme } = useTheme();

  const themeEntries = Object.entries(themePresets) as [ThemeKey, typeof themePresets.default][];

  return (
    <div className="theme-settings">
      <div className="theme-list">
        {themeEntries.map(([key, theme]) => (
          <div
            key={key}
            className={`theme-item ${currentTheme === key ? 'active' : ''}`}
            onClick={() => setTheme(key)}
          >
            <div className="theme-item-left">
              <div 
                className="theme-color-preview"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="theme-name">{theme.name}</span>
            </div>
            {currentTheme === key && (
              <Check size={20} color={theme.primary} />
            )}
          </div>
        ))}
      </div>

      <div className="theme-preview-section">
        <p className="theme-preview-label">预览效果</p>
        <div className="theme-preview-buttons">
          <button 
            className="theme-preview-btn primary"
            style={{ 
              backgroundColor: themePresets[currentTheme].primary,
              borderColor: themePresets[currentTheme].primary
            }}
          >
            主要按钮
          </button>
          <button 
            className="theme-preview-btn outline"
            style={{ 
              color: themePresets[currentTheme].primary,
              borderColor: themePresets[currentTheme].primary
            }}
          >
            次要按钮
          </button>
        </div>
      </div>
    </div>
  );
}
