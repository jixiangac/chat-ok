/**
 * 任务预览组件
 * 显示任务信息和预计收益
 */

import React from 'react';
import type { CreateTaskModalState } from '../../modalTypes';
import { calculateDailyPointsCap } from '@/pages/dc/utils/spiritJadeCalculator';
import styles from './styles.module.css';

// 图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

export interface TaskPreviewProps {
  state: CreateTaskModalState;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ state }) => {
  const taskTypeName = state.selectedType === 'NUMERIC' ? '数值型'
    : state.selectedType === 'CHECKLIST' ? '清单型' : '打卡型';

  const cycleCount = Math.floor(state.totalDays / state.cycleDays);

  // 计算每日收益上限
  const taskType = state.selectedType || 'CHECK_IN';
  const checkInUnit = state.checkInConfig?.unit || 'count';
  const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);

  // 预估总收益（假设100%完成）
  const totalSpiritJade = dailyCap.spiritJade * state.totalDays;
  const totalCultivation = dailyCap.cultivation * state.totalDays;

  return (
    <div className={styles.container}>
      <div className={styles.previewTitle}>
        {state.taskTitle || '未命名任务'}
      </div>
      <div className={styles.previewDetails}>
        <div>任务类型：{taskTypeName}</div>
        <div>总时长：{state.totalDays} 天</div>
        <div>周期：{state.cycleDays} 天 × {cycleCount} 周期</div>
        {/* 数值型任务显示目标变化 */}
        {state.selectedType === 'NUMERIC' && state.numericUnit && (
          <>
            <div className={styles.divider} />
            <div>
              目标方向：{state.numericDirection === 'DECREASE' ? '减少' : '增加'}
            </div>
            <div>
              目标变化：{state.startValue}{state.numericUnit} → {state.targetValue}{state.numericUnit}
              （{state.numericDirection === 'DECREASE' ? '减少' : '增加'} {Math.abs(Number(state.targetValue) - Number(state.startValue))}{state.numericUnit}）
            </div>
          </>
        )}
        {/* 打卡型任务显示打卡类型和每日目标 */}
        {state.selectedType === 'CHECK_IN' && (
          <>
            <div className={styles.divider} />
            <div>
              打卡类型：{state.checkInUnit === 'TIMES' ? '次数' : state.checkInUnit === 'DURATION' ? '时长' : '数量'}
            </div>
            <div>
              每日目标：{
                state.checkInUnit === 'TIMES' ? `${state.dailyMaxTimes || 1}次` :
                state.checkInUnit === 'DURATION' ? `${state.dailyTargetMinutes || 15}分钟` :
                `${state.dailyTargetValue || 0}${state.valueUnit || '个'}`
              }
            </div>
          </>
        )}
        {/* 清单型任务显示项目数量 */}
        {state.selectedType === 'CHECKLIST' && (
          <>
            <div className={styles.divider} />
            <div>
              清单项数：{state.checklistItems.filter(item => item.trim()).length} 项
            </div>
          </>
        )}
      </div>

      {/* 预计收益 - 卡片式布局 */}
      <div className={styles.rewardSection}>
        <div className={styles.rewardTitle}>预计收益</div>

        {/* 每日收益卡片 */}
        <div className={styles.rewardCards}>
          <div className={styles.rewardCard}>
            <div className={styles.cardHeader}>每日最高</div>
            <div className={styles.cardContent}>
              <div className={styles.rewardRow}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
                <span className={styles.rewardNumber}>{dailyCap.spiritJade}</span>
                <span className={styles.rewardName}>灵玉</span>
              </div>
              <div className={styles.rewardRow}>
                <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
                <span className={styles.rewardNumber}>{dailyCap.cultivation}</span>
                <span className={styles.rewardName}>修为</span>
              </div>
            </div>
          </div>

          <div className={styles.rewardCard}>
            <div className={styles.cardHeader}>100%完成任务至少获得</div>
            <div className={styles.cardContent}>
              <div className={styles.rewardRow}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
                <span className={styles.rewardNumber}>{totalSpiritJade}</span>
                <span className={styles.rewardName}>灵玉</span>
              </div>
              <div className={styles.rewardRow}>
                <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
                <span className={styles.rewardNumber}>{totalCultivation}</span>
                <span className={styles.rewardName}>修为</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rewardHint}>
          预估收益按100%完成计算，实际按完成比例发放
        </div>
      </div>
    </div>
  );
};

export default TaskPreview;
