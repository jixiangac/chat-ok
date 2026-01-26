/**
 * 紫微斗数命盘图组件
 * 传统十二宫格布局，支持点击查看宫位详情
 * 支持十二宫格随机顺序弹出动画
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ZiweiChartProps, PalaceKey, Palace } from '../../types';
import { PALACE_NAMES, EARTHLY_BRANCHES } from '../../constants';
import { getPalaceSummary } from '../../utils';
import styles from '../../styles.module.css';

// 太极图 SVG
const TAIJI_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01rsx1k21rO10eJEV9y_!!6000000005620-2-tps-1080-966.png';

// 弹窗头图（参考 RewardToast 随机头图）
const MODAL_HEADER_IMAGES = [
  'https://gw.alicdn.com/imgextra/i1/O1CN01XzO7G31iDdUXu3ZLf_!!6000000004379-2-tps-1080-1004.png',
  'https://gw.alicdn.com/imgextra/i2/O1CN01UPJlbL229K4qqUhj7_!!6000000007077-2-tps-1080-978.png',
];

// 宫位在 4x4 网格中的位置映射（传统命盘布局）
const PALACE_GRID_POSITIONS: Array<{
  row: number;
  col: number;
  branchIndex: number;
}> = [
  // 顶行（从左到右）：寅 卯 辰 巳
  { row: 0, col: 0, branchIndex: 2 },  // 寅
  { row: 0, col: 1, branchIndex: 3 },  // 卯
  { row: 0, col: 2, branchIndex: 4 },  // 辰
  { row: 0, col: 3, branchIndex: 5 },  // 巳
  // 右列：午 未
  { row: 1, col: 3, branchIndex: 6 },  // 午
  { row: 2, col: 3, branchIndex: 7 },  // 未
  // 底行（从右到左）：申 酉 戌 亥
  { row: 3, col: 3, branchIndex: 8 },  // 申
  { row: 3, col: 2, branchIndex: 9 },  // 酉
  { row: 3, col: 1, branchIndex: 10 }, // 戌
  { row: 3, col: 0, branchIndex: 11 }, // 亥
  // 左列：子 丑
  { row: 2, col: 0, branchIndex: 0 },  // 子
  { row: 1, col: 0, branchIndex: 1 },  // 丑
];

// 宫位键名顺序
const PALACE_KEYS: PalaceKey[] = [
  'ming', 'fumu', 'fude', 'tianzhai', 'shiye', 'jiaoyou',
  'qianyi', 'jie', 'caibo', 'zinv', 'fuqi', 'xiongdi',
];

// 获取四化样式类
function getHuaClass(hua: string): string {
  if (hua.includes('禄')) return styles.huaLu;
  if (hua.includes('权')) return styles.huaQuan;
  if (hua.includes('科')) return styles.huaKe;
  if (hua.includes('忌')) return styles.huaJi;
  return '';
}

// 获取四化标签样式
function getHuaTagClass(hua: string): string {
  if (hua.includes('禄')) return styles.starTagHuaLu;
  if (hua.includes('权')) return styles.starTagHuaQuan;
  if (hua.includes('科')) return styles.starTagHuaKe;
  if (hua.includes('忌')) return styles.starTagHuaJi;
  return '';
}

// 宫位详情弹窗
interface PalaceModalProps {
  palace: Palace;
  palaceKey: PalaceKey;
  visible: boolean;
  onClose: () => void;
}

function PalaceModal({ palace, palaceKey, visible, onClose }: PalaceModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  // 随机选择头图
  const headerImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MODAL_HEADER_IMAGES.length);
    return MODAL_HEADER_IMAGES[randomIndex];
  }, []);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!visible) return null;

  const interpretation = getPalaceSummary(palace, palaceKey);

  return createPortal(
    <div
      className={`${styles.palaceModalOverlay} ${isLeaving ? styles.leaving : ''}`}
      onClick={handleClose}
    >
      <div className={styles.palaceModalContent} onClick={e => e.stopPropagation()}>
        {/* 头部图片 - 参考 RewardToast */}
        <div className={styles.palaceModalHeader}>
          <button className={styles.palaceModalCloseBtn} onClick={handleClose}>
            <X size={20} />
          </button>
          <img
            src={headerImage}
            alt="宫位"
            className={styles.palaceModalHeaderImage}
          />
        </div>

        {/* 标题区 */}
        <div className={styles.palaceModalTitleSection}>
          <h2 className={styles.palaceModalTitle}>
            {palace.name}
          </h2>
          <p className={styles.palaceModalBranch}>
            {palace.earthlyBranch}宫
          </p>
        </div>

        {/* 内容 */}
        <div className={styles.palaceModalBody}>
          {/* 主星 */}
          {palace.stars.major.length > 0 && (
            <div className={styles.palaceSection}>
              <div className={styles.palaceSectionTitle}>
                ⭐ 主星（十四正曜）
              </div>
              <div className={styles.starTags}>
                {palace.stars.major.map((star) => (
                  <span key={star} className={`${styles.starTag} ${styles.starTagMajor}`}>
                    {star}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 辅星 */}
          {palace.stars.minor.length > 0 && (
            <div className={styles.palaceSection}>
              <div className={styles.palaceSectionTitle}>
                🔵 辅星（六吉六煞等）
              </div>
              <div className={styles.starTags}>
                {palace.stars.minor.map((star) => (
                  <span key={star} className={`${styles.starTag} ${styles.starTagMinor}`}>
                    {star}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 四化 */}
          {palace.stars.hua.length > 0 && (
            <div className={styles.palaceSection}>
              <div className={styles.palaceSectionTitle}>
                ✨ 四化
              </div>
              <div className={styles.starTags}>
                {palace.stars.hua.map((hua) => (
                  <span key={hua} className={`${styles.starTag} ${getHuaTagClass(hua)}`}>
                    {hua}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 宫位解读 */}
          <div className={styles.palaceSection}>
            <div className={styles.palaceSectionTitle}>
              📖 宫位解读
            </div>
            <div className={styles.palaceInterpretation}>
              {interpretation}
            </div>
          </div>

          {/* 命盘说明 */}
          <div className={styles.chartLegend}>
            <div className={styles.legendTitle}>
              📋 命盘说明
            </div>
            <div className={styles.legendList}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotMajor}`} />
                主星（十四正曜）
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotMinor}`} />
                辅星（六吉六煞等）
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotHuaLu}`} />
                化禄（财富）
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotHuaQuan}`} />
                化权（权力）
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotHuaKe}`} />
                化科（名声）
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendDotHuaJi}`} />
                化忌（阻碍）
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ZiweiChart({ chartData, skipAnimation = false }: ZiweiChartProps) {
  const { palaces, lunarDate, solarDate, yearGanZhi, wuxingju, birthInfo, mingGongIndex } = chartData;
  const [selectedPalace, setSelectedPalace] = useState<{ palace: Palace; key: PalaceKey } | null>(null);

  // 宫位动画状态
  const [visiblePalaces, setVisiblePalaces] = useState<Set<number>>(() => {
    // 如果跳过动画，初始就全部显示
    if (skipAnimation) {
      return new Set(Array.from({ length: 12 }, (_, i) => i));
    }
    return new Set();
  });
  const [centerVisible, setCenterVisible] = useState(skipAnimation);
  const animationInitialized = useRef(skipAnimation);

  // 随机顺序弹出动画（仅在需要动画时执行）
  useEffect(() => {
    if (animationInitialized.current) return;
    animationInitialized.current = true;

    // 生成随机顺序的宫位索引（0-11）
    const indices = Array.from({ length: 12 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // 先显示中心区域
    setTimeout(() => {
      setCenterVisible(true);
    }, 100);

    // 依次显示每个宫位
    indices.forEach((palaceIndex, order) => {
      setTimeout(() => {
        setVisiblePalaces(prev => new Set([...prev, palaceIndex]));
      }, 200 + order * 80); // 每个宫位间隔 80ms
    });
  }, []);

  // 格式化日期显示
  const formatDateDisplay = () => {
    if (birthInfo.dateType === 'solar') {
      // 阳历输入：显示「公历日期 + 农历日期」
      return (
        <>
          {solarDate.year}年{solarDate.month}月{solarDate.day}日<br />
          农历{lunarDate.month}月{lunarDate.day}日
        </>
      );
    } else {
      // 阴历输入：显示农历日期
      return `农历${lunarDate.year}年${lunarDate.month}月${lunarDate.day}日`;
    }
  };

  // 根据命宫索引计算各宫位在十二地支中的位置
  const getPalaceAtBranch = useCallback((branchIndex: number): { palace: Palace; key: PalaceKey } | null => {
    // 找到对应的宫位
    const palaceKeyIndex = PALACE_KEYS.findIndex((_, idx) => {
      const targetBranchIndex = (mingGongIndex + idx) % 12;
      return targetBranchIndex === branchIndex;
    });

    if (palaceKeyIndex === -1) return null;

    const palaceKey = PALACE_KEYS[palaceKeyIndex];
    return { palace: palaces[palaceKey], key: palaceKey };
  }, [palaces, mingGongIndex]);

  // 渲染宫位单元格
  const renderPalaceCell = (branchIndex: number, gridIndex: number) => {
    const palaceInfo = getPalaceAtBranch(branchIndex);
    if (!palaceInfo) return null;

    const { palace, key } = palaceInfo;
    const isVisible = visiblePalaces.has(gridIndex);

    // 辅星和四化合并显示
    const minorAndHua = [
      ...palace.stars.minor.slice(0, 2),
      ...palace.stars.hua,
    ];

    return (
      <div
        className={`${styles.palaceCell} ${isVisible ? styles.palaceCellVisible : styles.palaceCellHidden}`}
        onClick={() => setSelectedPalace(palaceInfo)}
      >
        <div className={styles.palaceCellHeader}>
          <span className={styles.palaceName}>{palace.name}</span>
          <span className={styles.palaceBranch}>{palace.earthlyBranch}</span>
        </div>
        <div className={styles.starsContainer}>
          {/* 左侧：主星 */}
          <div className={styles.starsLeft}>
            {palace.stars.major.slice(0, 2).map((star) => (
              <div key={star} className={`${styles.starItem} ${styles.major}`}>
                {star}
              </div>
            ))}
          </div>
          {/* 右侧：辅星 + 四化 */}
          {minorAndHua.length > 0 && (
            <div className={styles.starsRight}>
              {palace.stars.minor.slice(0, 2).map((star) => (
                <div key={star} className={styles.starItemSmall}>
                  {star}
                </div>
              ))}
              {palace.stars.hua.map((hua) => (
                <div key={hua} className={`${styles.starItemSmall} ${getHuaClass(hua)}`}>
                  {hua}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 生成 4x4 网格
  const renderGrid = () => {
    const cells: (JSX.Element | null)[] = [];
    let palaceGridIndex = 0; // 用于追踪宫位的网格索引

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const key = row * 4 + col;

        // 中间 2x2 区域
        if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
          if (row === 1 && col === 1) {
            // 渲染中心信息（带动画）
            cells.push(
              <div
                key={key}
                className={`${styles.centerInfo} ${centerVisible ? styles.centerInfoVisible : styles.centerInfoHidden}`}
              >
                <img src={TAIJI_ICON} alt="太极" className={styles.centerIcon} />
                <div className={styles.centerTitle}>紫微命盘</div>
                <div className={styles.centerDetail}>
                  {birthInfo.gender === 'male' ? '乾造' : '坤造'}<br />
                  {formatDateDisplay()}<br />
                  {yearGanZhi}年 · {wuxingju}
                </div>
              </div>
            );
          } else {
            // 跳过其他中心格子
            cells.push(null);
          }
          continue;
        }

        // 找到这个位置对应的地支
        const posInfo = PALACE_GRID_POSITIONS.find(p => p.row === row && p.col === col);
        if (posInfo) {
          const currentGridIndex = palaceGridIndex;
          palaceGridIndex++;
          cells.push(
            <div key={key}>
              {renderPalaceCell(posInfo.branchIndex, currentGridIndex)}
            </div>
          );
        } else {
          cells.push(<div key={key} />);
        }
      }
    }

    return cells.filter(cell => cell !== null);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartDisclaimer}>
        ✨ 仅供娱乐参考，不构成任何决策依据
      </div>
      <div className={styles.chartGrid}>
        {renderGrid()}
      </div>
      <div className={styles.chartHint}>
        👆 点击宫位查看详细星曜信息
      </div>

      {/* 宫位详情弹窗 */}
      {selectedPalace && (
        <PalaceModal
          palace={selectedPalace.palace}
          palaceKey={selectedPalace.key}
          visible={!!selectedPalace}
          onClose={() => setSelectedPalace(null)}
        />
      )}
    </div>
  );
}
