import { useState } from 'react';
import { X, ChevronRight, Palette, Target, Eye, Tag, Code } from 'lucide-react';
import ThemeSettings from './ThemeSettings';
import TagSettings from './TagSettings';
import DeveloperSettings from './DeveloperSettings';
import { canOpenModalForEdit, canOpenModalForView } from '@/pages/dc/utils/todayMustCompleteStorage';
import { getDeveloperMode, setDeveloperMode } from '@/pages/dc/utils/developerStorage';
import './index.css';

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
  onOpenTodayMustComplete?: (readOnly?: boolean) => void;
  onTagDeleted?: (tagId: string) => void;
}

type SettingsPage = 'main' | 'theme' | 'tags' | 'developer';

export default function Settings({ visible, onClose, onOpenTodayMustComplete, onTagDeleted }: SettingsProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('main');
  const [developerMode, setDeveloperModeState] = useState(getDeveloperMode);
  const canEdit = canOpenModalForEdit();
  const canView = canOpenModalForView();

  if (!visible) return null;

  const handleBack = () => {
    if (currentPage === 'main') {
      onClose();
    } else {
      setCurrentPage('main');
    }
  };

  // 切换开发者模式
  const handleToggleDeveloperMode = () => {
    const newValue = !developerMode;
    setDeveloperMode(newValue);
    setDeveloperModeState(newValue);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'theme': return '主题配色';
      case 'tags': return '标签设置';
      case 'developer': return '开发者模式';
      default: return '设置';
    }
  };

  const renderContent = () => {
    if (currentPage === 'theme') {
      return <ThemeSettings onBack={() => setCurrentPage('main')} />;
    }
    
    if (currentPage === 'tags') {
      return <TagSettings onBack={() => setCurrentPage('main')} onTagDeleted={onTagDeleted} />;
    }

    if (currentPage === 'developer') {
      return <DeveloperSettings onBack={() => setCurrentPage('main')} />;
    }

    const handleTodayMustCompleteEdit = () => {
      if (onOpenTodayMustComplete) {
        onClose();
        onOpenTodayMustComplete(false);
      }
    };

    const handleTodayMustCompleteView = () => {
      if (onOpenTodayMustComplete) {
        onClose();
        onOpenTodayMustComplete(true);
      }
    };

    return (
      <div className="settings-main">
        <div 
          className="settings-item"
          onClick={() => setCurrentPage('theme')}
        >
          <div className="settings-item-left">
            <Palette size={20} />
            <span>主题配色</span>
          </div>
          <ChevronRight size={20} color="#999" />
        </div>
        
        <div 
          className="settings-item"
          onClick={() => setCurrentPage('tags')}
        >
          <div className="settings-item-left">
            <Tag size={20} />
            <span>标签设置</span>
          </div>
          <ChevronRight size={20} color="#999" />
        </div>
        
        {canEdit && (
          <div 
            className="settings-item"
            onClick={handleTodayMustCompleteEdit}
          >
            <div className="settings-item-left">
              <Target size={20} />
              <span>设置今日必须完成</span>
            </div>
            <ChevronRight size={20} color="#999" />
          </div>
        )}

        {canView && (
          <div 
            className="settings-item"
            onClick={handleTodayMustCompleteView}
          >
            <div className="settings-item-left">
              <Eye size={20} />
              <span>查看今日必须完成</span>
            </div>
            <ChevronRight size={20} color="#999" />
          </div>
        )}

        {/* 分隔线 */}
        <div className="settings-divider" />

        {/* 开发者模式开关 */}
        <div 
          className="settings-item"
          onClick={handleToggleDeveloperMode}
        >
          <div className="settings-item-left">
            <Code size={20} />
            <span>开发者模式</span>
          </div>
          <div className={`settings-switch ${developerMode ? 'active' : ''}`}>
            <div className="settings-switch-thumb" />
          </div>
        </div>

        {/* 开发者模式入口（仅在开启时显示） */}
        {developerMode && (
          <div 
            className="settings-item settings-item-sub"
            onClick={() => setCurrentPage('developer')}
          >
            <div className="settings-item-left">
              <span>数据管理</span>
            </div>
            <ChevronRight size={20} color="#999" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div 
        className="settings-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">
            {getPageTitle()}
          </h2>
          <button 
            className="settings-close-btn"
            onClick={handleBack}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

