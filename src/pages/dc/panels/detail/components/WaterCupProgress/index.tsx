import { useEffect, useState } from 'react';
import styles from './styles.module.css';

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
}

/**
 * 咖啡杯进度组件 - 极简扁平风格
 * 参考设计：宽矮的 U 形马克杯，实心填充，无描边
 */
export default function WaterCupProgress({
  progress,
  currentValue,
  targetValue,
  unit = '',
  animate = true,
  size = 'medium',
  cupColor = '#F5E6E0',
  liquidColor = '#C4A08A'
}: WaterCupProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // 进度变化时触发动画
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animate]);

  // 液体高度百分比
  const liquidHeight = Math.max(0, Math.min(100, displayProgress));
  
  // SVG 尺寸和计算 - 调整使杯子居中
  const cupWidth = 270;
  const cupHeight = 280;
  const cornerRadius = 100; // 底部圆角半径
  const topRadius = 16; // 顶部小圆角
  const handleWidth = 55; // 把手宽度
  const totalWidth = cupWidth + handleWidth; // 总宽度
  const offsetX = 0; // 杯子起始 X 偏移
  
  // 液体的 Y 位置计算
  const liquidMaxHeight = cupHeight - 15; // 液体最大高度
  const liquidActualHeight = liquidMaxHeight * liquidHeight / 100;
  const liquidY = cupHeight - liquidActualHeight + 5;

  const sizeClass = styles[size] || styles.medium;

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      {/* 咖啡杯 SVG - 极简扁平风格 */}
      <div className={styles.cupContainer}>
        <svg 
          viewBox={`0 0 ${totalWidth} ${cupHeight + 10}`}
          className={styles.cupSvg}
        >
          <defs>
            {/* 杯子内部裁剪区域 */}
            <clipPath id="cupInterior">
              <path d={`
                M ${offsetX + 7} ${topRadius + 5}
                Q ${offsetX + 7} 10, ${offsetX + topRadius} 10
                L ${offsetX + cupWidth - topRadius} 10
                Q ${offsetX + cupWidth - 7} 10, ${offsetX + cupWidth - 7} ${topRadius + 5}
                L ${offsetX + cupWidth - 7} ${cupHeight - cornerRadius}
                Q ${offsetX + cupWidth - 7} ${cupHeight}, ${offsetX + cupWidth - cornerRadius} ${cupHeight}
                L ${offsetX + cornerRadius} ${cupHeight}
                Q ${offsetX + 7} ${cupHeight}, ${offsetX + 7} ${cupHeight - cornerRadius}
                Z
              `} />
            </clipPath>
          </defs>

          {/* 杯身背景 - 宽矮的 U 形 */}
          <path
            d={`
              M ${offsetX} ${topRadius + 5}
              Q ${offsetX} 5, ${offsetX + topRadius} 5
              L ${offsetX + cupWidth - topRadius} 5
              Q ${offsetX + cupWidth} 5, ${offsetX + cupWidth} ${topRadius + 5}
              L ${offsetX + cupWidth} ${cupHeight - cornerRadius}
              Q ${offsetX + cupWidth} ${cupHeight + 5}, ${offsetX + cupWidth - cornerRadius} ${cupHeight + 5}
              L ${offsetX + cornerRadius} ${cupHeight + 5}
              Q ${offsetX} ${cupHeight + 5}, ${offsetX} ${cupHeight - cornerRadius}
              Z
            `}
            fill={cupColor}
          />

          {/* 把手 - 小巧的 D 形 */}
          <path
            d={`
              M ${offsetX + cupWidth - 2} 75
              Q ${offsetX + cupWidth + handleWidth - 5} 75, ${offsetX + cupWidth + handleWidth - 5} 145
              Q ${offsetX + cupWidth + handleWidth - 5} 215, ${offsetX + cupWidth - 2} 215
              L ${offsetX + cupWidth - 2} 190
              Q ${offsetX + cupWidth + 25} 190, ${offsetX + cupWidth + 25} 145
              Q ${offsetX + cupWidth + 25} 100, ${offsetX + cupWidth - 2} 100
              Z
            `}
            fill={cupColor}
          />

          {/* 液体填充 */}
          <g clipPath="url(#cupInterior)">
            <rect
              x={offsetX}
              y={liquidY}
              width={cupWidth}
              height={liquidActualHeight + 20}
              fill={liquidColor}
              className={styles.liquid}
            />
          </g>
        </svg>
      </div>

      {/* 进度数值 */}
      <div className={styles.valueContainer}>
        <span className={styles.currentValue}>{currentValue}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  );
}

export { WaterCupProgress };



