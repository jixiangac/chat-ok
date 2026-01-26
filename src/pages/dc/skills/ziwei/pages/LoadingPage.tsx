/**
 * 紫微斗数命盘生成 loading 页面
 * 优雅的八卦/太极风格加载动画
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import styles from '../styles.module.css';

interface LoadingPageProps {
  onComplete?: () => void;
}

// 加载提示语
const LOADING_TIPS = [
  '推演天干地支...',
  '安排紫微星入宫...',
  '计算命宫身宫...',
  '排布十四主星...',
  '安放辅星煞星...',
  '推演四化飞星...',
  '生成命盘格局...',
];

// 八卦符号
const BAGUA_SYMBOLS = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeSymbol, setActiveSymbol] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasStarted = useRef(false);

  // 随机排列八卦
  const shuffledBagua = useMemo(() => {
    const arr = [...BAGUA_SYMBOLS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // 保持 onComplete 引用最新
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // 随机延迟 3-5 秒
    const totalDuration = 3000 + Math.random() * 2000;
    const intervalTime = totalDuration / 100;

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 300);
      }
    }, intervalTime);

    // 切换提示语
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 500);

    // 八卦符号轮转
    const symbolInterval = setInterval(() => {
      setActiveSymbol((prev) => (prev + 1) % 8);
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
      clearInterval(symbolInterval);
    };
  }, []);

  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingContent}>
        {/* 八卦环绕太极 */}
        <div className={styles.cosmicContainer}>
          {/* 八卦符号环 */}
          <div className={styles.baguaRing}>
            {shuffledBagua.map((symbol, index) => (
              <div
                key={index}
                className={`${styles.baguaSymbol} ${index === activeSymbol ? styles.baguaActive : ''}`}
                style={{
                  transform: `rotate(${index * 45}deg) translateY(-60px) rotate(-${index * 45}deg)`,
                }}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* 中心太极 */}
          <div className={styles.taijiCenter}>
            <img
              src="https://gw.alicdn.com/imgextra/i1/O1CN01rsx1k21rO10eJEV9y_!!6000000005620-2-tps-1080-966.png"
              alt="推演中"
              className={styles.taijiSpinning}
            />
          </div>

          {/* 光晕效果 */}
          <div className={styles.cosmicGlow} />
        </div>

        {/* 提示文字 */}
        <div className={styles.loadingTipContainer}>
          <span className={styles.loadingTipText} key={tipIndex}>
            {LOADING_TIPS[tipIndex]}
          </span>
        </div>

        {/* 进度指示 */}
        <div className={styles.progressContainer}>
          <div className={styles.progressDots}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={styles.progressDot}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className={styles.progressPercent}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
