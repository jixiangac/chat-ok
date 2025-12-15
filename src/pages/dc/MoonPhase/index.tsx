import { useMemo } from 'react';
import styles from './MoonPhase.module.css';

type MoonPhaseType = 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous' | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

export default function MoonPhase() {
  // 根据当前时间计算月相
  const moonPhase = useMemo((): MoonPhaseType => {
    const now = new Date();
    const hour = now.getHours();
    
    // 根据一天中的时间段显示不同月相
    // 0-3: 新月
    // 3-6: 蛾眉月（上弦）
    // 6-9: 上弦月
    // 9-12: 盈凸月
    // 12-15: 满月
    // 15-18: 亏凸月
    // 18-21: 下弦月
    // 21-24: 残月
    if (hour >= 0 && hour < 3) return 'new';
    if (hour >= 3 && hour < 6) return 'waxingCrescent';
    if (hour >= 6 && hour < 9) return 'firstQuarter';
    if (hour >= 9 && hour < 12) return 'waxingGibbous';
    if (hour >= 12 && hour < 15) return 'full';
    if (hour >= 15 && hour < 18) return 'waningGibbous';
    if (hour >= 18 && hour < 21) return 'lastQuarter';
    return 'waningCrescent';
  }, []);

  // 根据月相渲染不同的SVG
  const renderMoon = () => {
    const baseColor = '#e8e8ec';
    const shadowColor = '#c0c0c8';
    
    switch (moonPhase) {
      case 'new':
        // 新月 - 只有轮廓
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <circle cx="20" cy="20" r="16" fill="none" stroke={shadowColor} strokeWidth="1" />
            <circle cx="20" cy="20" r="15" fill="#f8f8f8" opacity="0.3" />
          </svg>
        );
      
      case 'waxingCrescent':
        // 蛾眉月（右侧亮）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="crescentClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={shadowColor} opacity="0.4" />
            <ellipse cx="14" cy="20" rx="11" ry="15" fill={baseColor} clipPath="url(#crescentClip)" />
          </svg>
        );
      
      case 'firstQuarter':
        // 上弦月（右半亮）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="quarterClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={shadowColor} opacity="0.4" />
            <rect x="20" y="5" width="15" height="30" fill={baseColor} clipPath="url(#quarterClip)" />
          </svg>
        );
      
      case 'waxingGibbous':
        // 盈凸月（大部分亮，左侧小暗）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="gibbousClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={baseColor} />
            <ellipse cx="12" cy="20" rx="6" ry="15" fill={shadowColor} opacity="0.4" clipPath="url(#gibbousClip)" />
          </svg>
        );
      
      case 'full':
        // 满月
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <circle cx="20" cy="20" r="15" fill={baseColor} />
            {/* 月球表面纹理 */}
            <circle cx="14" cy="16" r="3" fill={shadowColor} opacity="0.2" />
            <circle cx="24" cy="22" r="2" fill={shadowColor} opacity="0.15" />
            <circle cx="18" cy="26" r="2.5" fill={shadowColor} opacity="0.18" />
          </svg>
        );
      
      case 'waningGibbous':
        // 亏凸月（大部分亮，右侧小暗）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="waningGibbousClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={baseColor} />
            <ellipse cx="28" cy="20" rx="6" ry="15" fill={shadowColor} opacity="0.4" clipPath="url(#waningGibbousClip)" />
          </svg>
        );
      
      case 'lastQuarter':
        // 下弦月（左半亮）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="lastQuarterClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={shadowColor} opacity="0.4" />
            <rect x="5" y="5" width="15" height="30" fill={baseColor} clipPath="url(#lastQuarterClip)" />
          </svg>
        );
      
      case 'waningCrescent':
        // 残月（左侧亮）
        return (
          <svg viewBox="0 0 40 40" className={styles.moonSvg}>
            <defs>
              <clipPath id="waningCrescentClip">
                <circle cx="20" cy="20" r="15" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="15" fill={shadowColor} opacity="0.4" />
            <ellipse cx="26" cy="20" rx="11" ry="15" fill={baseColor} clipPath="url(#waningCrescentClip)" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.moonContainer}>
      {renderMoon()}
    </div>
  );
}
