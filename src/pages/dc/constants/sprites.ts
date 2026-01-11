/**
 * 小精灵图片配置
 * 根据不同时间段显示不同的小精灵图片
 */
export const SPRITE_IMAGES = {
  morning: [
    'https://img.alicdn.com/imgextra/i1/O1CN01D7qMyZ1Yzanp7cvn1_!!6000000003130-2-tps-1080-938.png',
    'https://img.alicdn.com/imgextra/i3/O1CN01L8CqQY1rlNCp99Pt4_!!6000000005671-2-tps-1406-1260.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01v4XwU51lD7taaUmq1_!!6000000004784-2-tps-1080-724.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01R0uIFN1D0a6rajp99_!!6000000000154-2-tps-1080-820.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01lmaP8j1hurFaAFYDn_!!6000000004338-2-tps-1080-960.png'
  ],
  afternoon: [
    'https://img.alicdn.com/imgextra/i3/O1CN01J34xYC1WIQEsC45B7_!!6000000002765-2-tps-1264-848.png',
    'https://img.alicdn.com/imgextra/i1/O1CN013gAALL1jTxDT1kcBK_!!6000000004550-2-tps-1080-911.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01DwFMrL1SiI9AaAtrn_!!6000000002280-2-tps-1080-724.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01TuNL2z1IrmBuuzpmR_!!6000000000947-2-tps-1080-831.png'
  ],
  evening: [
    'https://img.alicdn.com/imgextra/i1/O1CN01UxBnwA1zGhbo1Ouqo_!!6000000006687-2-tps-1080-885.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01bWibXF1sNO4zV86yT_!!6000000005754-2-tps-1080-927.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01kmxbMh1wcjojgkCmS_!!6000000006329-2-tps-1080-962.png',
    'https://img.alicdn.com/imgextra/i3/O1CN01Joonce1KKv0ZejYGw_!!6000000001146-2-tps-1080-897.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01Lb61F91Wo1ZEvQxIX_!!6000000002834-2-tps-1080-841.png'
  ],
  night: [
    'https://img.alicdn.com/imgextra/i4/O1CN01AM78k01vhUJCsV32R_!!6000000006204-2-tps-2528-1696.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01zZ29ix1dNe48XJPxk_!!6000000003724-2-tps-1080-902.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01kfj2r71l0Io0gAsQ6_!!6000000004756-2-tps-1264-848.png',
    'https://img.alicdn.com/imgextra/i4/O1CN0178ybi729bRhldc1oz_!!6000000008086-2-tps-1080-854.png'
  ]
};

/**
 * 获取当前时间段
 */
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export function getCurrentTimeSlot(): TimeSlot {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else if (hour >= 18 && hour < 20) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * 纪念日模式专属精灵图片
 */
export const MEMORIAL_SPRITE_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01F8l0Tl1mu0awjBaMv_!!6000000005013-2-tps-1080-913.png',
  'https://img.alicdn.com/imgextra/i2/O1CN014inOqq1ir1YDFC7dU_!!6000000004465-2-tps-1080-1001.png',
  'https://img.alicdn.com/imgextra/i3/O1CN010etw8y22Bc3SeGWsQ_!!6000000007082-2-tps-1080-944.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01z4bPnp1KoEM5j3N5E_!!6000000001210-2-tps-1080-932.png',
  'https://img.alicdn.com/imgextra/i4/O1CN014kAwOY1Rgd5shGzLy_!!6000000002141-2-tps-1080-994.png',
];

/**
 * 度假模式专属精灵图片
 */
export const VACATION_SPRITE_IMAGES = [
  'https://img.alicdn.com/imgextra/i2/O1CN01W4MwCM1qOBXJfTbyJ_!!6000000005485-2-tps-1080-850.png',
  'https://img.alicdn.com/imgextra/i3/O1CN01Y3uIe11K90i2oxIab_!!6000000001120-2-tps-1080-964.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01LPseEd1eyZcGyNuJm_!!6000000003940-2-tps-1080-792.png',
  'https://img.alicdn.com/imgextra/i2/O1CN01TAuVKv1wfUC51TPIv_!!6000000006335-2-tps-1080-831.png',
];

// 保持向后兼容
export const TRIP_SPRITE_IMAGES = VACATION_SPRITE_IMAGES;

/**
 * 空状态占位图
 */
export const EMPTY_STATE_IMAGE = 'https://img.alicdn.com/imgextra/i4/O1CN01yTnklC1ia4tDwlksJ_!!6000000004428-2-tps-2528-1696.png';
