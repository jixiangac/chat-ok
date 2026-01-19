import React, { useMemo, useRef } from 'react';
import styles from './styles.module.css';
import { formatDisplayNumber } from '../../../../utils';
import { RiveWatering, CoffeeCupSvg, DieCat, RiveCuteing } from '../../../../riv';

export interface WaterCupProgressProps {
  /** 周期进度百分比 (0-100) */
  progress: number;
  /** 当前值 */
  currentValue: number;
  /** 目标值 */
  targetValue: number;
  /** 单位 */
  unit?: string;
  /** 是否显示动画 */
  animate?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 杯身颜色 */
  cupColor?: string;
  /** 液体颜色 */
  liquidColor?: string;
  /** 目标方向：INCREASE 增加型，DECREASE 减少型 */
  direction?: 'INCREASE' | 'DECREASE';
  /** 起始值（用于计算进度） */
  startValue?: number;
  /** 任务类型 */
  category: 'NUMERIC' | 'CHECK_IN' | 'CHECK_IN_DURATION' | 'CHECK_IN_TIMES' | 'CHECK_IN_QUANTITY';
  isPlanEnded: boolean;
}

/**
 * 水杯进度组件
 * 根据任务类型显示不同的可视化组件：
 * - NUMERIC: 咖啡杯 SVG 组件
 * - CHECK_IN: Rive 浇水动画组件
 */
export default function WaterCupProgress({
  progress,
  currentValue,
  targetValue,
  unit = '',
  animate = true,
  size = 'medium',
  cupColor = '#F5E6E0',
  liquidColor = '#C4A08A',
  direction = 'INCREASE',
  startValue = 0,
  category = 'NUMERIC',
  isPlanEnded = false
}: WaterCupProgressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
    
  // 计算剩余差值
  const remaining = useMemo(() => {
    return Math.abs(targetValue - currentValue);
  }, [targetValue, currentValue]);

  // 判断是否已达成目标 - 根据方向判断
  const isGoalReached = useMemo(() => {
    const isDecrease = direction === 'DECREASE';
    if (isDecrease) {
      // 减少型：当前值 <= 目标值 表示达成
      return currentValue <= targetValue;
    } else {
      // 增加型：当前值 >= 目标值 表示达成
      return currentValue >= targetValue;
    }
  }, [currentValue, targetValue, direction]);

  const sizeClass = styles[size] || styles.medium;

  const marginleftStyle = useMemo(() => {
    if (category === 'CHECK_IN_QUANTITY') {
      return {
        marginLeft: '9px',
        marginBottom: '10px',
        width: '330px',
        height: '280px',
        marginTop: '10px'
      };
    } else if (category === 'CHECK_IN_TIMES' || category === 'CHECK_IN_DURATION') {
      return {
        marginLeft: '2px',
        marginBottom: '10px',
        width: '330px',
        height: '280px',
        marginTop: '10px'
      };
    } else if (category === 'NUMERIC') {
      return {
        marginLeft: '52px',
        marginBottom: '24px',
        marginTop: '20px'
      };
    }
    return {
      marginLeft: '22px'
    };
  }, [category]);

  const DomWaterCup = useMemo(() => {
    if ( isPlanEnded && progress < 100 ) {
      return <DieCat progress={progress} />;
    }
    if (category === 'CHECK_IN_QUANTITY') {
      return <RiveCuteing progress={progress} />;
    } else if ( category === 'CHECK_IN_TIMES' || category === 'CHECK_IN_DURATION') {
      return <RiveWatering progress={progress} />;
    } else if (category === 'NUMERIC') {
      return (
        <CoffeeCupSvg
          progress={progress}
          cupColor={cupColor}
          liquidColor={liquidColor}
          animate={animate}
          className={styles.cupSvg}
          liquidClassName={styles.liquid}
          waveOverlayClassName={styles.waveOverlay}
          fluidOverlayClassName={styles.fluidOverlay}
          energyGlowClassName={styles.energyGlow}
        />
      );
    }
    return <></>;
  }, [category, progress, isPlanEnded, cupColor, liquidColor, animate]);

  return (
    <div ref={containerRef} className={`${styles.container} ${sizeClass}`}>
      {/* 咖啡杯 SVG - 极简扁平风格 */}
      <div className={styles.cupContainer} style={marginleftStyle}>
        {DomWaterCup}
      </div>

      {/* 进度信息 */}
      <div className={styles.progressInfo}>
        {/* 主进度数字 */}
        <div className={styles.mainValue}>{formatDisplayNumber(currentValue)}</div>
        
        {/* 目标和差值 */}
        <div className={styles.subInfo}>
          /{formatDisplayNumber(targetValue)} {unit}
          {isGoalReached 
            ? `，已达成目标` 
            : `，还差 ${formatDisplayNumber(remaining)} ${unit}`
          }
        </div>
      </div>
    </div>
  );
}

export { WaterCupProgress };
