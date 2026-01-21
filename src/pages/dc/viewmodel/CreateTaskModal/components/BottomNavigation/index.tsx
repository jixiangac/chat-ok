/**
 * BottomNavigation - 底部双按钮导航
 * 支持上一步/下一步，以及额外信息显示
 */

import React from 'react';
import styles from './styles.module.css';

export interface BottomNavigationProps {
  /** 上一步点击 */
  onBack?: () => void;
  /** 上一步文案 */
  backText?: string;
  /** 下一步点击 */
  onNext: () => void;
  /** 下一步文案 */
  nextText?: string;
  /** 下一步是否禁用 */
  nextDisabled?: boolean;
  /** 提示信息（显示在按钮上方） */
  hint?: React.ReactNode;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onBack,
  backText = '上一步',
  onNext,
  nextText = '下一步',
  nextDisabled = false,
  hint,
}) => {
  // 只有下一步按钮时，使用全宽样式
  const isSingleButton = !onBack;

  return (
    <div className={styles.container}>
      {hint && <div className={styles.hint}>{hint}</div>}
      <div className={`${styles.buttons} ${isSingleButton ? styles.singleButton : ''}`}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            {backText}
          </button>
        )}
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextText}
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
