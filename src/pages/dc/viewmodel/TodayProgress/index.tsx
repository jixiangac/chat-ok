/**
 * TodayProgress 组件
 * 直接消费 SceneProvider 数据
 */

import { useState } from 'react';
import { SafeArea } from 'antd-mobile';
import { useScene } from '../../contexts';
import RandomTaskPicker from '../RandomTaskPicker';
import DailyViewPopup from '../DailyViewPopup';
import './index.css';

export default function TodayProgress() {
  const { normal } = useScene();
  const [showDailyView, setShowDailyView] = useState(false);

  // 从 SceneProvider 获取预计算的数据
  const { todayProgress } = normal;

  return (
    <>
      <div className="today-progress-wrapper">
        <div className="today-progress-container">
          <div 
            className="today-progress-section"
            onClick={() => setShowDailyView(true)}
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
        onClose={() => setShowDailyView(false)}
      />
    </>
  );
}

