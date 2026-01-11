/**
 * Detail 面板相关常量
 */

// 进度阶段图片配置（进行中）
export const PROGRESS_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01lbaPb71byAPZUhGyr_!!6000000003533-2-tps-1409-1248.png', // 0-20%
  'https://img.alicdn.com/imgextra/i4/O1CN01Fj0ix31kYp2Hctyjg_!!6000000004696-2-tps-820-810.png',   // 20-40%
  'https://img.alicdn.com/imgextra/i4/O1CN01DBSRcZ1EtpUw4LYt1_!!6000000000410-2-tps-786-599.png',   // 40-60%
  'https://img.alicdn.com/imgextra/i4/O1CN01hZns3k1uu1WmQmkZ2_!!6000000006096-2-tps-1056-992.png',  // 60-80%
  'https://img.alicdn.com/imgextra/i2/O1CN01msiq0R1rS8Z6jGJ1P_!!6000000005629-2-tps-2528-1696.png', // 80-100%
];

// 计划结束后的完成度图片配置
export const COMPLETION_IMAGES = {
  perfect: 'https://img.alicdn.com/imgextra/i4/O1CN01F6mnTB1EYIsoD561E_!!6000000000363-2-tps-1546-1128.png', // 100%
  excellent: 'https://img.alicdn.com/imgextra/i1/O1CN01NYxRqC1IVnARBv0Fg_!!6000000000899-2-tps-820-810.png', // 80%+
  good: 'https://img.alicdn.com/imgextra/i2/O1CN01lbaPb71byAPZUhGyr_!!6000000003533-2-tps-1409-1248.png',
  nook: 'https://img.alicdn.com/imgextra/i2/O1CN01If1G3b1MgYx39T1Hf_!!6000000001464-2-tps-1389-1229.png',    // 50%+
  fair: 'https://img.alicdn.com/imgextra/i1/O1CN01SRiffz1vcuLIJzIIk_!!6000000006194-2-tps-1456-1285.png',    // 40%+
  poor: 'https://img.alicdn.com/imgextra/i2/O1CN01x4uEXd21IC7oS7CLR_!!6000000006961-2-tps-1494-1322.png',    // 30%+
  bad: 'https://img.alicdn.com/imgextra/i4/O1CN01NC5Fmh1rQIysmewqD_!!6000000005625-2-tps-928-845.png',       // 5-30%
  terrible: 'https://img.alicdn.com/imgextra/i2/O1CN01BA0NSS247boF4jf09_!!6000000007344-2-tps-1056-992.png', // <5%
};

// 根据进度获取对应图片（进行中）
export const getProgressImage = (progress: number): string => {
  if (progress < 20) return PROGRESS_IMAGES[0];
  if (progress < 40) return PROGRESS_IMAGES[1];
  if (progress < 60) return PROGRESS_IMAGES[2];
  if (progress < 80) return PROGRESS_IMAGES[3];
  return PROGRESS_IMAGES[4];
};

// 根据最终完成度获取对应图片（计划结束后）
export const getCompletionImage = (completionRate: number): string => {
  if (completionRate >= 100) return COMPLETION_IMAGES.perfect;
  if (completionRate >= 80) return COMPLETION_IMAGES.excellent;
  if (completionRate >= 70) return COMPLETION_IMAGES.good;
  if (completionRate >= 50) return COMPLETION_IMAGES.nook;
  if (completionRate >= 40) return COMPLETION_IMAGES.fair;
  if (completionRate >= 30) return COMPLETION_IMAGES.poor;
  if (completionRate >= 5) return COMPLETION_IMAGES.bad;
  return COMPLETION_IMAGES.terrible;
};

// Tab 配置
export const TAB_KEYS = {
  TARGETS: 'targets',
  RECORDS: 'records',
  HISTORY: 'history',
  CURRENT: 'current',
  ALL: 'all',
  CYCLE: 'cycle',
  CALENDAR: 'calendar',
} as const;

// 默认 Tab
export const DEFAULT_TABS = {
  NUMERIC: TAB_KEYS.TARGETS,
  CHECKLIST: TAB_KEYS.CURRENT,
  CHECK_IN: TAB_KEYS.CYCLE,
} as const;
