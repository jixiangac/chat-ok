import { useCallback, RefObject } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiOptions {
  /** 粒子数量，默认 50 */
  particleCount?: number;
  /** 扩散角度，默认 60 */
  spread?: number;
  /** 颜色数组 */
  colors?: string[];
  /** 动画帧数，默认 200 */
  ticks?: number;
  /** 重力，默认 1.2 */
  gravity?: number;
  /** 衰减率，默认 0.94 */
  decay?: number;
  /** 初始速度，默认 30 */
  startVelocity?: number;
  /** 形状，默认 ['circle'] */
  shapes?: ('circle' | 'square')[];
}

const DEFAULT_OPTIONS: ConfettiOptions = {
  particleCount: 50,
  spread: 60,
  colors: [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--secondary))',
    'hsl(var(--muted))'
  ],
  ticks: 200,
  gravity: 1.2,
  decay: 0.94,
  startVelocity: 30,
  shapes: ['circle']
};

/**
 * 彩纸效果 Hook
 * @param elementRef 可选的元素引用，用于确定彩纸发射的起始位置
 * @param options 可选的配置项
 * @returns triggerConfetti 函数
 */
export function useConfetti(
  elementRef?: RefObject<HTMLElement | null>,
  options?: ConfettiOptions
) {
  const triggerConfetti = useCallback(() => {
    // 计算发射位置
    let x = 0.5;
    let y = 0.9;

    if (elementRef?.current) {
      const rect = elementRef.current.getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }

    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    // 创建 confetti 实例
    const myConfetti = confetti.create(canvas, { resize: true });

    // 合并配置
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // 触发彩纸效果
    myConfetti({
      particleCount: mergedOptions.particleCount,
      spread: mergedOptions.spread,
      origin: { x, y },
      colors: mergedOptions.colors,
      ticks: mergedOptions.ticks,
      gravity: mergedOptions.gravity,
      decay: mergedOptions.decay,
      startVelocity: mergedOptions.startVelocity,
      shapes: mergedOptions.shapes
    }).then(() => {
      document.body.removeChild(canvas);
    });
  }, [elementRef, options]);

  return { triggerConfetti };
}

