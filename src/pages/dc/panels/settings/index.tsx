import { useState } from 'react';
import { X, ChevronRight, Palette, Target, Eye } from 'lucide-react';
import ThemeSettings from './ThemeSettings';
import { canOpenModalForEdit, canOpenModalForView } from '../../utils/todayMustCompleteStorage';
import './index.css';

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
  onOpenTodayMustComplete?: (readOnly?: boolean) => void;
}

type SettingsPage = 'main' | 'theme';

export default function Settings({ visible, onClose, onOpenTodayMustComplete }: SettingsProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('main');
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

  const renderContent = () => {
    if (currentPage === 'theme') {
      return <ThemeSettings onBack={() => setCurrentPage('main')} />;
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
            {currentPage === 'main' ? '设置' : '主题配色'}
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


