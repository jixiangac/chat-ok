// 欠账快照配色方案
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

// 随机获取一个配色方案
export const getRandomColorScheme = () => {
  return DEBT_COLOR_SCHEMES[Math.floor(Math.random() * DEBT_COLOR_SCHEMES.length)];
};
