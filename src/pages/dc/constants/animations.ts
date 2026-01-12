/**
 * 动画配置常量
 * 基于 Framer Motion，符合 Notion 风格的优雅细腻动画
 */

import type { Variants, Transition } from 'framer-motion';

// ============ 基础过渡配置 ============

/** 弹簧动画 - 用于弹窗等需要弹性效果的场景 */
export const springTransition: Transition = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
};

/** 平滑过渡 - 用于一般的淡入淡出 */
export const smoothTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
};

/** 快速过渡 - 用于退出动画 */
export const quickTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

// ============ 弹窗动画 ============

/** 底部弹窗动画变体 */
export const modalVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: quickTransition,
  },
};

/** 弹窗遮罩动画变体 */
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ============ 步骤切换动画 ============

/** 步骤切换动画变体 - 需要传入 direction 参数 */
export const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: smoothTransition,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: quickTransition,
  }),
};

// ============ 卡片动画 ============

/** 任务卡片动画变体 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

/** 网格项动画变体 - 用于支线任务网格 */
export const gridItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.25,
      ease: 'easeOut',
    },
  }),
};

// ============ 选项动画 ============

/** 选项选择动画变体 */
export const optionVariants: Variants = {
  unselected: {
    scale: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  selected: {
    scale: 1,
    borderColor: 'var(--adm-color-primary)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.97,
  },
};

// ============ 列表动画 ============

/** 列表容器动画变体 */
export const listContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/** 列表项动画变体 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// ============ 淡入淡出动画 ============

/** 简单淡入淡出变体 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    transition: quickTransition,
  },
};

/** 缩放淡入淡出变体 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: quickTransition,
  },
};

// ============ 抽屉动画 ============

/** 右侧抽屉动画变体 */
export const drawerRightVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: quickTransition,
  },
};

/** 左侧抽屉动画变体 */
export const drawerLeftVariants: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: quickTransition,
  },
};

// ============ 动画配置 ============

/** 是否启用动画（可用于性能降级） */
export const ANIMATION_ENABLED = true;

/** 是否尊重用户的减少动画偏好 */
export const RESPECT_REDUCED_MOTION = true;
