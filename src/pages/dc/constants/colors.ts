/**
 * 支线任务主题色列表
 * 基于用户提供的配色图，用于支线任务卡片的背景色
 */
export const SIDELINE_THEME_COLORS = [
  '#F6EFEF', // 奶油粉
  '#E0CEC6', // 淡玫瑰
  '#F1F1E8', // 奶油绿
  '#B9C9B9', // 薄荷绿
  '#E7E6ED', // 淡紫
  '#C0BDD1', // 紫灰
  '#F2F0EB', // 奶油灰
  '#D6CBBD', // 暖灰
  '#EAECEF', // 淡蓝灰
  '#B8BCC1', // 银灰
  '#C6DDE5', // 日式青
  '#E8E1B8', // 奶油黄
  '#B3BEE5', // 淡紫蓝
  '#E6D6BB', // 复古米
  '#D5C4C0', // 肉桂粉
  '#C9D4C9', // 鼠尾草绿
  '#D4D1E0', // 薰衣草紫
  '#E0DDD5', // 亚麻灰
  '#D1D8E0', // 雾霹蓝
  '#D5E0E0', // 淡青
];

/**
 * 欠账快照配色方案
 */
export const DEBT_COLOR_SCHEMES = [
  // 奶油粉 -> 淡玫瑰
  { bgColor: 'rgba(246, 239, 239, 0.6)', progressColor: 'linear-gradient(90deg, #F6EFEF 0%, #E0CEC6 100%)', borderColor: '#E0CEC6' },
  // 奶油绿 -> 薄荷绿
  { bgColor: 'rgba(241, 241, 232, 0.6)', progressColor: 'linear-gradient(90deg, #F1F1E8 0%, #B9C9B9 100%)', borderColor: '#B9C9B9' },
  // 淡紫 -> 紫灰
  { bgColor: 'rgba(231, 230, 237, 0.6)', progressColor: 'linear-gradient(90deg, #E7E6ED 0%, #C0BDD1 100%)', borderColor: '#C0BDD1' },
  // 淡蓝灰 -> 银灰
  { bgColor: 'rgba(234, 236, 239, 0.6)', progressColor: 'linear-gradient(90deg, #EAECEF 0%, #B8BCC1 100%)', borderColor: '#B8BCC1' },
];

/**
 * 随机获取一个欠账配色方案
 */
export function getRandomDebtColorScheme() {
  return DEBT_COLOR_SCHEMES[Math.floor(Math.random() * DEBT_COLOR_SCHEMES.length)];
}

/**
 * 获取下一个可用的主题色（避免与现有任务重复）
 */
export function getNextThemeColor(usedColors: (string | undefined)[]): string {
  const validUsedColors = usedColors.filter(Boolean) as string[];
  
  // 找到第一个未使用的颜色
  for (const color of SIDELINE_THEME_COLORS) {
    if (!validUsedColors.includes(color)) {
      return color;
    }
  }
  
  // 如果所有颜色都用过了，循环使用
  return SIDELINE_THEME_COLORS[validUsedColors.length % SIDELINE_THEME_COLORS.length];
}

/**
 * 颜色配对映射（浅色 -> 深色）
 * 用于生成渐变背景
 */
export const COLOR_PAIRS: Record<string, string> = {
  '#F6EFEF': '#E0CEC6', // 奶油粉 -> 淡玫瑰
  '#E0CEC6': '#F6EFEF', // 淡玫瑰 -> 奶油粉
  '#F1F1E8': '#B9C9B9', // 奶油绿 -> 薄荷绿
  '#B9C9B9': '#F1F1E8', // 薄荷绿 -> 奶油绿
  '#E7E6ED': '#C0BDD1', // 淡紫 -> 紫灰
  '#C0BDD1': '#E7E6ED', // 紫灰 -> 淡紫
  '#F2F0EB': '#D6CBBD', // 奶油灰 -> 暖灰
  '#D6CBBD': '#F2F0EB', // 暖灰 -> 奶油灰
  '#EAECEF': '#B8BCC1', // 淡蓝灰 -> 银灰
  '#B8BCC1': '#EAECEF', // 银灰 -> 淡蓝灰
  '#C6DDE5': '#E8E1B8', // 日式青 -> 奶油黄
  '#E8E1B8': '#C6DDE5', // 奶油黄 -> 日式青
  '#B3BEE5': '#E6D6BB', // 淡紫蓝 -> 复古米
  '#E6D6BB': '#B3BEE5', // 复古米 -> 淡紫蓝
  '#D5C4C0': '#C9D4C9', // 肉桂粉 -> 鼠尾草绿
  '#C9D4C9': '#D5C4C0', // 鼠尾草绿 -> 肉桂粉
  '#D4D1E0': '#E0DDD5', // 薰衣草紫 -> 亚麻灰
  '#E0DDD5': '#D4D1E0', // 亚麻灰 -> 薰衣草紫
  '#D1D8E0': '#D5E0E0', // 雾霹蓝 -> 淡青
  '#D5E0E0': '#D1D8E0', // 淡青 -> 雾霹蓝
};

/**
 * 获取颜色的配对色（用于渐变）
 */
export function getColorPair(color: string): string {
  return COLOR_PAIRS[color.toUpperCase()] || color;
}

