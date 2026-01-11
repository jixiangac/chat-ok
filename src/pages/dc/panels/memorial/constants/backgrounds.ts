/**
 * 背景配置
 */

import type { MemorialBackground } from '../types';

export interface BackgroundOption {
  type: 'color' | 'gradient';
  value: string;
  label: string;
}

// 预设纯色背景
export const COLOR_BACKGROUNDS: BackgroundOption[] = [
  { type: 'color', value: '#FFF5F5', label: '淡粉' },
  { type: 'color', value: '#F0FFF4', label: '淡绿' },
  { type: 'color', value: '#EBF8FF', label: '淡蓝' },
  { type: 'color', value: '#FFFAF0', label: '淡橙' },
  { type: 'color', value: '#FAF5FF', label: '淡紫' },
  { type: 'color', value: '#FFFFF0', label: '淡黄' },
  { type: 'color', value: '#F7FAFC', label: '淡灰' },
  { type: 'color', value: '#FFFFFF', label: '纯白' },
];

// 预设渐变背景
export const GRADIENT_BACKGROUNDS: BackgroundOption[] = [
  { type: 'gradient', value: 'linear-gradient(135deg, #FFF5F5 0%, #FFE4E6 100%)', label: '粉色渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)', label: '蓝色渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #F0FFF4 0%, #C6F6D5 100%)', label: '绿色渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FFFAF0 0%, #FEEBC8 100%)', label: '橙色渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FAF5FF 0%, #E9D8FD 100%)', label: '紫色渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FFF5F5 0%, #EBF8FF 100%)', label: '粉蓝渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #F0FFF4 0%, #FFFAF0 100%)', label: '绿橙渐变' },
  { type: 'gradient', value: 'linear-gradient(135deg, #EBF8FF 0%, #FAF5FF 100%)', label: '蓝紫渐变' },
];

// 所有预设背景
export const ALL_BACKGROUNDS: BackgroundOption[] = [...COLOR_BACKGROUNDS, ...GRADIENT_BACKGROUNDS];

// 获取默认背景
export function getDefaultBackground(): MemorialBackground {
  return {
    type: 'color',
    value: '#FFF5F5',
  };
}

// 根据背景值获取 CSS 样式
export function getBackgroundStyle(background: MemorialBackground): React.CSSProperties {
  switch (background.type) {
    case 'color':
      return { backgroundColor: background.value };
    case 'gradient':
      return { background: background.value };
    case 'image':
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    default:
      return { backgroundColor: '#FFF5F5' };
  }
}

/**
 * 判断背景是否为深色（需要使用白色文字）
 * 图片背景视为深色，纯色和渐变背景视为浅色
 */
export function isDarkBackground(background: MemorialBackground): boolean {
  return background.type === 'image';
}

