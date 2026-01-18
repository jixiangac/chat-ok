import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface CoffeeCupSvgProps {
  /** 进度百分比 (0-100) */
  progress: number;
  /** 杯身颜色 */
  cupColor?: string;
  /** 液体颜色 */
  liquidColor?: string;
  /** 是否显示动画 */
  animate?: boolean;
  /** CSS 类名 */
  className?: string;
  /** 液体样式类名 */
  liquidClassName?: string;
  /** 波浪叠加层样式类名 */
  waveOverlayClassName?: string;
  /** 流体叠加层样式类名 */
  fluidOverlayClassName?: string;
  /** 能量光晕样式类名 */
  energyGlowClassName?: string;
}

/**
 * 咖啡杯 SVG 组件 - 极简扁平风格
 * 宽矮的 U 形马克杯，带液体填充和波动效果
 */
export default function CoffeeCupSvg({
  progress,
  cupColor = '#F5E6E0',
  liquidColor = '#C4A08A',
  animate = true,
  className,
  liquidClassName,
  waveOverlayClassName,
  fluidOverlayClassName,
  energyGlowClassName,
}: CoffeeCupSvgProps) {
  const [wavePhase, setWavePhase] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // 进度变化时触发动画
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
        if (isInitialRender) {
          setIsInitialRender(false);
        }
      }, isInitialRender ? 100 : 50);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
      setIsInitialRender(false);
    }
  }, [progress, animate, isInitialRender]);

  // 波动动画 - 持续更新相位
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // SVG 尺寸和计算 - 调整使杯子居中
  const cupWidth = 270;
  const cupHeight = 280;
  const cornerRadius = 100; // 底部圆角半径
  const topRadius = 16; // 顶部小圆角
  const handleWidth = 55; // 把手宽度
  const totalWidth = cupWidth + handleWidth; // 总宽度
  const offsetX = 0; // 杯子起始 X 偏移

  // 液体的 Y 位置计算 - 精确按比例
  const cupInteriorTop = topRadius + 5; // 21
  const cupInteriorBottom = cupHeight; // 280
  const cupInteriorHeight = cupInteriorBottom - cupInteriorTop; // 259 可用高度

  // 根据进度计算液体高度和位置
  const liquidHeight = Math.max(0, Math.min(100, displayProgress));
  const liquidActualHeight = cupInteriorHeight * (liquidHeight / 100);
  // 液体顶部 Y 坐标：从底部往上计算
  const liquidY = cupInteriorBottom - liquidActualHeight;

  // 生成动态波浪路径
  const generateWavePath = useMemo(() => {
    const phase = wavePhase * (Math.PI / 180);
    const waveHeight = 6;
    const points: string[] = [];

    // 从左到右生成波浪点
    for (let x = 0; x <= cupWidth; x += 5) {
      const normalizedX = x / cupWidth;
      const y = Math.sin(normalizedX * Math.PI * 3 + phase) * waveHeight +
                Math.sin(normalizedX * Math.PI * 5 + phase * 1.3) * (waveHeight * 0.5);
      points.push(`${offsetX + x},${liquidY + y}`);
    }

    // 构建完整路径：波浪顶部 -> 右边 -> 底部 -> 左边
    return `M ${offsetX},${cupHeight + 20} ` +
           `L ${offsetX},${liquidY} ` +
           `L ${points.join(' L ')} ` +
           `L ${offsetX + cupWidth},${liquidY} ` +
           `L ${offsetX + cupWidth},${cupHeight + 20} Z`;
  }, [wavePhase, liquidY, cupWidth, cupHeight, offsetX]);

  // 生成第二层波浪（相位偏移）
  const generateWavePath2 = useMemo(() => {
    const phase = (wavePhase + 120) * (Math.PI / 180);
    const waveHeight = 4;
    const points: string[] = [];

    for (let x = 0; x <= cupWidth; x += 5) {
      const normalizedX = x / cupWidth;
      const y = Math.sin(normalizedX * Math.PI * 2.5 + phase) * waveHeight +
                Math.sin(normalizedX * Math.PI * 4 + phase * 0.8) * (waveHeight * 0.6);
      points.push(`${offsetX + x},${liquidY + y + 3}`);
    }

    return `M ${offsetX},${cupHeight + 20} ` +
           `L ${offsetX},${liquidY + 3} ` +
           `L ${points.join(' L ')} ` +
           `L ${offsetX + cupWidth},${liquidY + 3} ` +
           `L ${offsetX + cupWidth},${cupHeight + 20} Z`;
  }, [wavePhase, liquidY, cupWidth, cupHeight, offsetX]);

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${cupHeight + 10}`}
      className={className}
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

        {/* 流体渐变 - Apple Music 风格 */}
        <linearGradient id="fluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>

        {/* 能量光晕渐变 */}
        <radialGradient id="energyGlow" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* 底部深色渐变 */}
        <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={liquidColor} />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
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

      {/* 液体填充 - 带波动效果 */}
      <g clipPath="url(#cupInterior)">
        {/* 主液体层 - 带波浪 */}
        <motion.path
          d={generateWavePath}
          fill={liquidColor}
          initial={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            duration: isInitialRender ? 1.2 : 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={liquidClassName}
        />

        {/* 第二层波浪 - 半透明叠加 */}
        <motion.path
          d={generateWavePath2}
          fill="rgba(255,255,255,0.12)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={waveOverlayClassName}
        />

        {/* 流体渐变层 - Apple Music 风格光泽 */}
        <motion.rect
          x={offsetX}
          y={liquidY - 10}
          width={cupWidth}
          height={liquidActualHeight + 30}
          fill="url(#fluidGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={fluidOverlayClassName}
        />

        {/* 能量光晕层 - 呼吸效果 */}
        <motion.ellipse
          cx={offsetX + cupWidth / 2}
          cy={liquidY + liquidActualHeight * 0.25}
          rx={cupWidth * 0.35}
          ry={Math.max(20, liquidActualHeight * 0.2)}
          fill="url(#energyGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={energyGlowClassName}
        />
      </g>
    </svg>
  );
}

export { CoffeeCupSvg };
