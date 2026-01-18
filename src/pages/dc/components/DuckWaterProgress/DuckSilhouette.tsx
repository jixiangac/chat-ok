/**
 * 鸭子剪影 SVG 组件
 * 参考喝水打卡应用的可爱鸭子设计
 */

interface DuckSilhouetteProps {
  /** 背景颜色（未填充部分） */
  backgroundColor?: string;
  /** 自定义类名 */
  className?: string;
}

export default function DuckSilhouette({ 
  backgroundColor = '#E3EEF3',
  className 
}: DuckSilhouetteProps) {
  return (
    <svg 
      viewBox="0 0 280 320" 
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* 鸭子形状的 clipPath，用于水波裁剪 */}
        <clipPath id="duck-clip-path">
          <path d={DUCK_PATH} />
        </clipPath>
      </defs>
      
      {/* 鸭子剪影背景 */}
      <path d={DUCK_PATH} fill={backgroundColor} />
    </svg>
  );
}

/**
 * 鸭子 SVG 路径
 * 设计说明：
 * - 整体尺寸：280x320
 * - 可爱的鸭子造型：圆润的头部、小嘴巴、胖胖的身体
 * - 简约剪影风格
 */
export const DUCK_PATH = `
  M140,30
  C100,30 70,60 70,100
  C70,130 90,155 120,165
  L120,175
  C60,185 30,230 30,280
  C30,310 60,320 100,320
  L180,320
  C220,320 250,310 250,280
  C250,230 220,185 160,175
  L160,165
  C190,155 210,130 210,100
  C210,60 180,30 140,30
  Z
  M105,80
  C110,80 115,85 115,90
  C115,95 110,100 105,100
  C100,100 95,95 95,90
  C95,85 100,80 105,80
  Z
  M60,110
  L30,105
  C25,105 20,110 25,115
  L55,125
  C60,127 65,122 60,117
  L60,110
  Z
`.trim();

// 用于 clip-path 的路径（归一化到 0-1 范围）
export const DUCK_CLIP_PATH_NORMALIZED = `
  M0.5,0.094
  C0.357,0.094 0.25,0.188 0.25,0.313
  C0.25,0.406 0.321,0.484 0.429,0.516
  L0.429,0.547
  C0.214,0.578 0.107,0.719 0.107,0.875
  C0.107,0.969 0.214,1 0.357,1
  L0.643,1
  C0.786,1 0.893,0.969 0.893,0.875
  C0.893,0.719 0.786,0.578 0.571,0.547
  L0.571,0.516
  C0.679,0.484 0.75,0.406 0.75,0.313
  C0.75,0.188 0.643,0.094 0.5,0.094
  Z
`.trim();

export { DuckSilhouette };
