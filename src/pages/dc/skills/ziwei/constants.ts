/**
 * 紫微斗数常量定义
 */

import type { PalaceKey } from './types';

// 十天干
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二地支
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二生肖
export const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 十二宫位名称
export const PALACE_NAMES: Record<PalaceKey, string> = {
  ming: '命宫',
  xiongdi: '兄弟',
  fuqi: '夫妻',
  zinv: '子女',
  caibo: '财帛',
  jie: '疾厄',
  qianyi: '迁移',
  jiaoyou: '交友',
  shiye: '事业',
  tianzhai: '田宅',
  fude: '福德',
  fumu: '父母',
};

// 宫位顺序（逆时针，从寅宫开始）
export const PALACE_ORDER: PalaceKey[] = [
  'ming', 'fumu', 'fude', 'tianzhai', 'shiye', 'jiaoyou',
  'qianyi', 'jie', 'caibo', 'zinv', 'fuqi', 'xiongdi',
];

// 十四主星
export const MAJOR_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// 辅星
export const MINOR_STARS = [
  '文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '擎羊', '陀罗', '火星', '铃星', '天空', '地劫',
  '禄存', '天马', '红鸾', '天喜', '孤辰', '寡宿',
];

// 四化
export const HUA_STARS = ['化禄', '化权', '化科', '化忌'];

// 五行局
export const WUXING_JU = ['水二局', '木三局', '金四局', '土五局', '火六局'];

// 时辰对照（24小时制 -> 地支时辰）
export const HOUR_TO_BRANCH: Record<number, number> = {
  23: 0, 0: 0,   // 子时 23:00-01:00
  1: 1, 2: 1,    // 丑时 01:00-03:00
  3: 2, 4: 2,    // 寅时 03:00-05:00
  5: 3, 6: 3,    // 卯时 05:00-07:00
  7: 4, 8: 4,    // 辰时 07:00-09:00
  9: 5, 10: 5,   // 巳时 09:00-11:00
  11: 6, 12: 6,  // 午时 11:00-13:00
  13: 7, 14: 7,  // 未时 13:00-15:00
  15: 8, 16: 8,  // 申时 15:00-17:00
  17: 9, 18: 9,  // 酉时 17:00-19:00
  19: 10, 20: 10, // 戌时 19:00-21:00
  21: 11, 22: 11, // 亥时 21:00-23:00
};

// 时辰数据（名称 + 时间范围）
export const HOUR_DATA = [
  { name: '子时', time: '23:00-01:00', alias: '夜半' },
  { name: '丑时', time: '01:00-03:00', alias: '鸡鸣' },
  { name: '寅时', time: '03:00-05:00', alias: '平旦' },
  { name: '卯时', time: '05:00-07:00', alias: '日出' },
  { name: '辰时', time: '07:00-09:00', alias: '食时' },
  { name: '巳时', time: '09:00-11:00', alias: '隅中' },
  { name: '午时', time: '11:00-13:00', alias: '日中' },
  { name: '未时', time: '13:00-15:00', alias: '日昳' },
  { name: '申时', time: '15:00-17:00', alias: '晡时' },
  { name: '酉时', time: '17:00-19:00', alias: '日入' },
  { name: '戌时', time: '19:00-21:00', alias: '黄昏' },
  { name: '亥时', time: '21:00-23:00', alias: '人定' },
];

// 时辰名称（兼容旧接口）
export const HOUR_NAMES = HOUR_DATA.map(h => `${h.name} ${h.time}`);

// 城市数据已迁移到 cityData.ts，这里导出兼容接口
export { PROVINCE_CITY_DATA, FLAT_CITY_LIST, CITY_MAP, getCityInfo, searchCities } from './cityData';
export type { CityInfo, ProvinceData } from './cityData';

// 兼容旧接口：城市坐标映射
import { FLAT_CITY_LIST } from './cityData';
export const CITY_COORDINATES: Record<string, { lng: number; lat: number; name: string }> = 
  FLAT_CITY_LIST.reduce((acc, city) => {
    // 使用城市名作为key（兼容旧代码）
    const key = city.name;
    acc[key] = { lng: city.lng, lat: city.lat, name: city.name };
    return acc;
  }, {} as Record<string, { lng: number; lat: number; name: string }>);

// 城市列表（用于下拉选择，兼容旧接口）
export const CITY_LIST = FLAT_CITY_LIST.map((city) => ({
  key: city.name,
  name: city.name,
  province: city.province,
}));

// 年份范围
export const YEAR_RANGE = {
  min: 1900,
  max: 2100,
};

// 步骤进度映射
export const PAGE_STEP_MAP: Record<string, number> = {
  intro: 1,
  input: 2,
  loading: 2, // loading 属于 input 步骤的一部分
  result: 3,
  analysis: 4,
};

// 本地存储键名
export const STORAGE_KEY = 'dc_ziwei_data';

// 紫微入口图标
export const ZIWEI_ICON_URL = 'https://gw.alicdn.com/imgextra/i1/O1CN01rsx1k21rO10eJEV9y_!!6000000005620-2-tps-1080-966.png';

// 紫微主星亮度等级
export const STAR_BRIGHTNESS: Record<string, Record<string, string>> = {
  '紫微': { '子': '旺', '丑': '旺', '寅': '平', '卯': '平', '辰': '旺', '巳': '庙', '午': '旺', '未': '旺', '申': '平', '酉': '平', '戌': '旺', '亥': '庙' },
  '天机': { '子': '庙', '丑': '陷', '寅': '平', '卯': '庙', '辰': '旺', '巳': '平', '午': '庙', '未': '陷', '申': '平', '酉': '庙', '戌': '旺', '亥': '平' },
  '太阳': { '子': '陷', '丑': '陷', '寅': '平', '卯': '庙', '辰': '旺', '巳': '庙', '午': '庙', '未': '旺', '申': '平', '酉': '陷', '戌': '陷', '亥': '陷' },
  '武曲': { '子': '旺', '丑': '庙', '寅': '平', '卯': '平', '辰': '旺', '巳': '平', '午': '旺', '未': '庙', '申': '平', '酉': '平', '戌': '旺', '亥': '平' },
  '天同': { '子': '庙', '丑': '平', '寅': '陷', '卯': '平', '辰': '平', '巳': '庙', '午': '陷', '未': '平', '申': '陷', '酉': '平', '戌': '平', '亥': '庙' },
  '廉贞': { '子': '平', '丑': '平', '寅': '庙', '卯': '陷', '辰': '平', '巳': '陷', '午': '平', '未': '平', '申': '庙', '酉': '陷', '戌': '平', '亥': '陷' },
  '天府': { '子': '庙', '丑': '旺', '寅': '庙', '卯': '旺', '辰': '庙', '巳': '旺', '午': '庙', '未': '旺', '申': '庙', '酉': '旺', '戌': '庙', '亥': '旺' },
  '太阴': { '子': '庙', '丑': '庙', '寅': '旺', '卯': '平', '辰': '陷', '巳': '陷', '午': '陷', '未': '陷', '申': '平', '酉': '旺', '戌': '庙', '亥': '庙' },
  '贪狼': { '子': '庙', '丑': '平', '寅': '庙', '卯': '平', '辰': '旺', '巳': '平', '午': '庙', '未': '平', '申': '旺', '酉': '平', '戌': '庙', '亥': '平' },
  '巨门': { '子': '旺', '丑': '庙', '寅': '平', '卯': '庙', '辰': '平', '巳': '陷', '午': '旺', '未': '庙', '申': '平', '酉': '庙', '戌': '平', '亥': '陷' },
  '天相': { '子': '庙', '丑': '庙', '寅': '平', '卯': '庙', '辰': '平', '巳': '平', '午': '庙', '未': '庙', '申': '平', '酉': '庙', '戌': '平', '亥': '平' },
  '天梁': { '子': '庙', '丑': '庙', '寅': '平', '卯': '庙', '辰': '陷', '巳': '庙', '午': '庙', '未': '庙', '申': '平', '酉': '庙', '戌': '陷', '亥': '庙' },
  '七杀': { '子': '庙', '丑': '旺', '寅': '庙', '卯': '旺', '辰': '平', '巳': '平', '午': '庙', '未': '旺', '申': '庙', '酉': '旺', '戌': '平', '亥': '平' },
  '破军': { '子': '旺', '丑': '平', '寅': '平', '卯': '陷', '辰': '旺', '巳': '平', '午': '旺', '未': '平', '申': '平', '酉': '陷', '戌': '旺', '亥': '平' },
};

// 分析报告 Tab 配置
export const ANALYSIS_TABS = [
  { key: 'wealth', label: '财运分析', icon: '💰' },
  { key: 'emotion', label: '感情分析', icon: '❤️' },
  { key: 'career', label: '事业分析', icon: '💼' },
] as const;
