import { useState, useEffect, useMemo, useRef } from 'react';
import { Popup, SafeArea, Swiper } from 'antd-mobile';
import type { SwiperRef } from 'antd-mobile';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { useTheme } from '../../../../contexts';
import type { ChecklistItem } from '../../../../types';
import styles from '../../../../css/ChecklistRecordModal.module.css';

interface ChecklistRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: ChecklistItem) => void;
  pendingItems: ChecklistItem[];
  loading?: boolean;
}

export default function ChecklistRecordModal({
  visible,
  onClose,
  onSubmit,
  pendingItems,
  loading
}: ChecklistRecordModalProps) {
  const { themeColors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);

  // 当前选中的清单项
  const currentItem = useMemo(() => {
    if (pendingItems.length === 0) return null;
    return pendingItems[currentIndex] || pendingItems[0];
  }, [pendingItems, currentIndex]);

  // 每次打开弹窗时重置索引
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      // 重置 Swiper 到第一页
      setTimeout(() => {
        swiperRef.current?.swipeTo(0);
      }, 100);
    }
  }, [visible]);

  // 切换到上一个
  const handlePrev = () => {
    swiperRef.current?.swipePrev();
  };

  // 切换到下一个
  const handleNext = () => {
    swiperRef.current?.swipeNext();
  };

  // Swiper 索引变化
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  // 提交
  const handleSubmit = () => {
    if (currentItem) {
      onSubmit(currentItem);
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  if (pendingItems.length === 0) {
    return null;
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position='bottom'
      style={{ zIndex: 1200 }}
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '20px 24px 0',
        boxSizing: 'border-box',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>完成清单项</span>
          <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {/* 清单项显示区域 */}
        <div className={styles.itemSection}>
          <div className={styles.itemDisplay}>
            {/* 左箭头 */}
            <button
              className={`${styles.arrowBtn} ${currentIndex === 0 ? styles.disabled : ''}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>

            {/* 清单项内容 - 使用 Swiper */}
            <div className={styles.swiperWrapper}>
              <Swiper
                ref={swiperRef}
                indicator={() => null}
                onIndexChange={handleIndexChange}
                defaultIndex={0}
                loop={false}
                rubberband={true}
              >
                {pendingItems.map((item) => (
                  <Swiper.Item key={item.id}>
                    <div className={styles.itemContent}>
                      <div className={styles.itemIcon}>
                        <CheckSquare size={24} />
                      </div>
                      <div className={styles.itemTitle}>
                        {item.title}
                      </div>
                    </div>
                  </Swiper.Item>
                ))}
              </Swiper>
            </div>

            {/* 右箭头 */}
            <button
              className={`${styles.arrowBtn} ${currentIndex === pendingItems.length - 1 ? styles.disabled : ''}`}
              onClick={handleNext}
              disabled={currentIndex === pendingItems.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* 指示器点 */}
          {pendingItems.length > 1 && (
            <div className={styles.indicatorDots}>
              {pendingItems.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => swiperRef.current?.swipeTo(index)}
                />
              ))}
            </div>
          )}

          {/* 数字指示器 */}
          <div className={styles.indicator}>
            {currentIndex + 1} / {pendingItems.length}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={handleClose}>取消</button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading || !currentItem}
            style={{ backgroundColor: (loading || !currentItem) ? '#ccc' : themeColors.primary }}
          >
            {loading ? '处理中...' : '确认完成'}
          </button>
        </div>
      </div>
      <SafeArea position="bottom" />
    </Popup>
  );
}
