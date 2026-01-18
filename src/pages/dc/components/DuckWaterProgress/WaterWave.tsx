import { motion } from 'framer-motion';

/**
 * 水波动画组件
 * 简洁的水面波浪效果
 */

interface WaterWaveProps {
  /** 水波颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
}

export default function WaterWave({ 
  color = '#4FC3F7',
  className 
}: WaterWaveProps) {
  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: color,
      }}
    >
      {/* 波浪效果 */}
      <motion.div
        style={{
          position: 'absolute',
          top: -8,
          left: '-50%',
          width: '200%',
          height: 20,
        }}
        animate={{
          x: ['0%', '-25%', '0%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg
          viewBox="0 0 400 20"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <path
            d="M0,10 Q25,5 50,10 T100,10 T150,10 T200,10 T250,10 T300,10 T350,10 T400,10 L400,20 L0,20 Z"
            fill={color}
          />
        </svg>
      </motion.div>

      {/* 第二层波浪（增加层次感） */}
      <motion.div
        style={{
          position: 'absolute',
          top: -5,
          left: '-50%',
          width: '200%',
          height: 15,
          opacity: 0.7,
        }}
        animate={{
          x: ['-25%', '0%', '-25%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg
          viewBox="0 0 400 15"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <path
            d="M0,8 Q20,4 40,8 T80,8 T120,8 T160,8 T200,8 T240,8 T280,8 T320,8 T360,8 T400,8 L400,15 L0,15 Z"
            fill={color}
          />
        </svg>
      </motion.div>
    </div>
  );
}

export { WaterWave };
