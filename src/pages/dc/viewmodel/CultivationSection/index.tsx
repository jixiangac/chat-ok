/**
 * 修炼区域组件
 * 在主页面展示修炼入口，点击打开修炼面板
 */

import { memo, useState, useCallback } from 'react';
import { useCultivation } from '../../contexts/CultivationProvider';
import { CultivationEntry } from '../../components/CultivationEntry';
import CultivationPanel from '../../panels/cultivation';
import styles from './styles.module.css';

export interface CultivationSectionProps {
  /** 紧凑模式 */
  compact?: boolean;
  /** 自定义类名 */
  className?: string;
}

function CultivationSectionComponent({ 
  compact = false, 
  className 
}: CultivationSectionProps) {
  const { data, breakthrough, loading } = useCultivation();
  const [showPanel, setShowPanel] = useState(false);

  // 打开修炼面板
  const handleOpenPanel = useCallback(() => {
    setShowPanel(true);
  }, []);

  // 关闭修炼面板
  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
  }, []);

  // 处理突破
  const handleBreakthrough = useCallback(() => {
    const result = breakthrough();
    if (result.success) {
      // 可以在这里添加突破成功的提示或动画
      console.log(result.message);
    }
  }, [breakthrough]);

  // 加载中状态
  if (loading) {
    return (
      <div className={`${styles.section} ${className || ''}`}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.section} ${className || ''}`}>
        <CultivationEntry
          data={data}
          onClick={handleOpenPanel}
          compact={compact}
        />
      </div>

      {/* 修炼面板 */}
      {showPanel && (
        <CultivationPanel
          data={data}
          onClose={handleClosePanel}
          onBreakthrough={handleBreakthrough}
        />
      )}
    </>
  );
}

export const CultivationSection = memo(CultivationSectionComponent);
export default CultivationSection;

