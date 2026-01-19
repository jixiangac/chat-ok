/**
 * TodayProgress 组件
 * 直接消费 SceneProvider 数据
 */

import { SafeArea } from 'antd-mobile';
import { useScene, useModal, UI_KEYS } from '../../contexts';
import RandomTaskPicker from '../RandomTaskPicker';
import DailyViewPopup from '../DailyViewPopup';
import './index.css';

export default function TodayProgress() {
  const { normal } = useScene();
  // 使用 UIProvider 管理一日清单弹窗状态
  const { visible: showDailyView, open: openDailyView, close: closeDailyView } = useModal(UI_KEYS.MODAL_DAILY_VIEW_VISIBLE);

  // 从 SceneProvider 获取预计算的数据
  const { todayProgress } = normal;

  return (
    <>
      <div className="today-progress-wrapper">
        <div className="today-progress-container">
          <div 
            className="today-progress-section"
            onClick={openDailyView}
            style={{ cursor: 'pointer' }}
          >
            <div className="today-progress-label">今日完成率</div>
            <div className="today-progress-value">{todayProgress.percentage}%</div>
          </div>
        
          <div className="today-progress-try-luck">
            <RandomTaskPicker />
          </div>
        </div>
        <SafeArea position="bottom" />
      </div>

      {/* 一日视图弹窗 */}
      <DailyViewPopup
        visible={showDailyView}
        onClose={closeDailyView}
      />
    </>
  );
}


