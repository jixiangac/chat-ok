/**
 * 灵玉不足提示弹窗组件
 * 当用户灵玉余额不足以创建任务时显示
 */

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './styles.module.css';

// IP 图片地址（随机显示）
const HEADER_IMAGES = [
  'https://gw.alicdn.com/imgextra/i1/O1CN01kx3Cwe1zWH4sFTgYK_!!6000000006721-2-tps-1080-1025.png',
  'https://gw.alicdn.com/imgextra/i2/O1CN017U7FhC1g8wCICidWH_!!6000000004098-2-tps-1080-1020.png',
];
// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

interface InsufficientJadePopupProps {
  visible: boolean;
  currentBalance: number;
  requiredAmount: number;
  onClose: () => void;
  onConfirm?: () => void;
}

const InsufficientJadePopup: React.FC<InsufficientJadePopupProps> = ({
  visible,
  currentBalance,
  requiredAmount,
  onClose,
  onConfirm,
}) => {
  // 随机选择一张头图（组件挂载时确定，避免重渲染时切换）
  const headerImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * HEADER_IMAGES.length);
    return HEADER_IMAGES[randomIndex];
  }, []);

  if (!visible) return null;

  const shortage = requiredAmount - currentBalance;

  // 使用 Portal 渲染到 body 下
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* 顶部图片 */}
        <div className={styles.headerImage}>
          {/* 右上角关闭按钮 */}
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
          <img
            src={headerImage}
            alt="灵玉不足"
            className={styles.headerImg}
          />
        </div>

        {/* 内容区域 */}
        <div className={styles.contentSection}>
          <h2 className={styles.title}>灵玉不足</h2>
          <p className={styles.subtitle}>别灰心，修仙之路需要一步步来~</p>

          {/* 灵玉信息 */}
          <div className={styles.jadeInfo}>
            <div className={styles.jadeRow}>
              <span className={styles.jadeLabel}>当前余额</span>
              <span className={styles.jadeValue}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.jadeIcon} />
                {currentBalance}
              </span>
            </div>
            <div className={styles.jadeRow}>
              <span className={styles.jadeLabel}>需要消耗</span>
              <span className={styles.jadeValue}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.jadeIcon} />
                {requiredAmount}
              </span>
            </div>
            <div className={styles.jadeDivider} />
            <div className={styles.jadeRow}>
              <span className={styles.jadeLabel}>还差</span>
              <span className={`${styles.jadeValue} ${styles.shortage}`}>
                <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.jadeIcon} />
                {shortage}
              </span>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={onConfirm || onClose}>
            我知道啦
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InsufficientJadePopup;
