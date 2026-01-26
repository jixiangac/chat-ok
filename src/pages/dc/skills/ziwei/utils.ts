/**
 * 紫微斗数命盘计算工具
 * 基于简化算法，仅供娱乐参考
 */

import type { BirthInfo, ChartData, Palace, PalaceKey } from './types';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  CITY_COORDINATES,
  HOUR_TO_BRANCH,
  PALACE_NAMES,
  MAJOR_STARS,
  WUXING_JU,
} from './constants';

// 农历数据（简化版，1900-2100年）
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
];

/**
 * 获取农历某年的闰月，0表示没有闰月
 */
function getLeapMonth(year: number): number {
  const idx = year - 1900;
  if (idx < 0 || idx >= LUNAR_INFO.length) return 0;
  return LUNAR_INFO[idx] & 0xf;
}

/**
 * 获取农历某年闰月的天数
 */
function getLeapDays(year: number): number {
  const leapMonth = getLeapMonth(year);
  if (leapMonth === 0) return 0;
  const idx = year - 1900;
  return (LUNAR_INFO[idx] & 0x10000) ? 30 : 29;
}

/**
 * 获取农历某年某月的天数
 */
function getLunarMonthDays(year: number, month: number): number {
  const idx = year - 1900;
  if (idx < 0 || idx >= LUNAR_INFO.length) return 30;
  return (LUNAR_INFO[idx] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 获取农历某年的总天数
 */
function getLunarYearDays(year: number): number {
  let days = 0;
  for (let i = 1; i <= 12; i++) {
    days += getLunarMonthDays(year, i);
  }
  return days + getLeapDays(year);
}

/**
 * 阳历转农历（简化版）
 */
function solarToLunar(year: number, month: number, day: number): {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
} {
  // 计算距离1900年1月31日（农历正月初一）的天数
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);

  let lunarYear = 1900;
  let lunarMonth = 1;
  let lunarDay = 1;
  let isLeap = false;

  // 计算年份
  while (offset >= getLunarYearDays(lunarYear)) {
    offset -= getLunarYearDays(lunarYear);
    lunarYear++;
    if (lunarYear > 2100) break;
  }

  // 计算月份
  const leapMonth = getLeapMonth(lunarYear);
  let monthDays: number;

  for (let i = 1; i <= 12; i++) {
    // 闰月
    if (leapMonth > 0 && i === leapMonth + 1 && !isLeap) {
      monthDays = getLeapDays(lunarYear);
      isLeap = true;
      i--;
    } else {
      monthDays = getLunarMonthDays(lunarYear, i);
    }

    if (offset < monthDays) {
      lunarMonth = i;
      lunarDay = offset + 1;
      break;
    }

    offset -= monthDays;
    if (isLeap && i === leapMonth + 1) {
      isLeap = false;
    }
  }

  return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
}

/**
 * 农历转阳历（简化版）
 */
function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap: boolean = false
): { year: number; month: number; day: number } {
  // 从1900年1月31日（农历正月初一）开始计算
  let offset = 0;

  // 累加年份的天数
  for (let y = 1900; y < lunarYear; y++) {
    offset += getLunarYearDays(y);
  }

  // 累加月份的天数
  const leapMonth = getLeapMonth(lunarYear);
  for (let m = 1; m < lunarMonth; m++) {
    offset += getLunarMonthDays(lunarYear, m);
    // 如果该年有闰月且在当前月之前
    if (leapMonth > 0 && m === leapMonth) {
      offset += getLeapDays(lunarYear);
    }
  }

  // 如果当前月是闰月之后的月份，需要加上闰月天数
  if (leapMonth > 0 && lunarMonth > leapMonth) {
    // 已经在循环中处理
  }

  // 如果是闰月本身
  if (isLeap && lunarMonth === leapMonth) {
    offset += getLunarMonthDays(lunarYear, lunarMonth);
  }

  // 加上日数
  offset += lunarDay - 1;

  // 从基准日期计算
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(baseDate.getTime() + offset * 86400000);

  return {
    year: targetDate.getFullYear(),
    month: targetDate.getMonth() + 1,
    day: targetDate.getDate(),
  };
}

/**
 * 计算真太阳时校正
 */
export function calculateTrueSolarTime(
  hour: number,
  minute: number,
  city: string,
  date: Date
): { hour: number; minute: number } {
  const coords = CITY_COORDINATES[city] || CITY_COORDINATES['\u5317\u4eac'] || { lng: 116.4074, lat: 39.9042 };

  // 经度差异时间校正（每15度差1小时，每度差4分钟）
  // 标准时区为东八区（120度）
  const lngDiff = coords.lng - 120;
  const lngCorrection = lngDiff * 4; // 分钟

  // 简化的时差方程（忽略复杂的天文计算）
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const equationOfTime =
    9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // 总校正分钟数
  const totalCorrection = lngCorrection + equationOfTime;

  // 应用校正
  let totalMinutes = hour * 60 + minute + totalCorrection;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;

  return {
    hour: Math.floor(totalMinutes / 60),
    minute: Math.floor(totalMinutes % 60),
  };
}

/**
 * 获取年干支
 */
function getYearGanZhi(lunarYear: number): string {
  const stemIndex = (lunarYear - 4) % 10;
  const branchIndex = (lunarYear - 4) % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

/**
 * 获取月干支
 */
function getMonthGanZhi(lunarYear: number, lunarMonth: number): string {
  // 月干 = (年干 * 2 + 月数) % 10
  const yearStemIndex = (lunarYear - 4) % 10;
  const monthStemIndex = (yearStemIndex * 2 + lunarMonth) % 10;
  // 月支固定：正月寅，二月卯...
  const monthBranchIndex = (lunarMonth + 1) % 12;
  return HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranchIndex];
}

/**
 * 获取日干支（简化版）
 */
function getDayGanZhi(year: number, month: number, day: number): string {
  // 使用1900年1月1日为基准（甲戌日）
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const days = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);

  const stemIndex = (days + 10) % 10;
  const branchIndex = (days + 10) % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

/**
 * 获取时干支
 */
function getHourGanZhi(dayStem: string, hour: number): string {
  const hourBranchIndex = HOUR_TO_BRANCH[hour] ?? 0;
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem[0]);

  // 时干 = (日干序号 * 2 + 时支序号) % 10
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;

  return HEAVENLY_STEMS[hourStemIndex] + EARTHLY_BRANCHES[hourBranchIndex];
}

/**
 * 计算命宫位置
 */
function calculateMingGongIndex(lunarMonth: number, hourBranchIndex: number): number {
  // 命宫 = 寅起正月，逆数生月，顺数生时
  // 公式：命宫地支 = (14 - 月 + 时) % 12
  // 寅为起点（索引2）
  return (14 - lunarMonth + hourBranchIndex) % 12;
}

/**
 * 计算身宫位置
 */
function calculateShenGongIndex(lunarMonth: number, hourBranchIndex: number): number {
  // 身宫 = 寅起正月，顺数生月，顺数生时
  return (lunarMonth + hourBranchIndex + 2) % 12;
}

/**
 * 计算五行局
 */
function calculateWuxingJu(mingGongBranchIndex: number, yearStemIndex: number): string {
  // 简化的五行局计算
  const table: Record<number, Record<number, number>> = {
    0: { 0: 0, 1: 2, 2: 1, 3: 3, 4: 4, 5: 0, 6: 2, 7: 1, 8: 3, 9: 4 }, // 子
    1: { 0: 2, 1: 0, 2: 3, 3: 1, 4: 4, 5: 2, 6: 0, 7: 3, 8: 1, 9: 4 }, // 丑
    2: { 0: 1, 1: 3, 2: 4, 3: 0, 4: 2, 5: 1, 6: 3, 7: 4, 8: 0, 9: 2 }, // 寅
    3: { 0: 3, 1: 1, 2: 4, 3: 2, 4: 0, 5: 3, 6: 1, 7: 4, 8: 2, 9: 0 }, // 卯
    4: { 0: 4, 1: 4, 2: 0, 3: 0, 4: 1, 5: 4, 6: 4, 7: 0, 8: 0, 9: 1 }, // 辰
    5: { 0: 0, 1: 2, 2: 1, 3: 3, 4: 4, 5: 0, 6: 2, 7: 1, 8: 3, 9: 4 }, // 巳
    6: { 0: 2, 1: 0, 2: 3, 3: 1, 4: 4, 5: 2, 6: 0, 7: 3, 8: 1, 9: 4 }, // 午
    7: { 0: 1, 1: 3, 2: 4, 3: 0, 4: 2, 5: 1, 6: 3, 7: 4, 8: 0, 9: 2 }, // 未
    8: { 0: 3, 1: 1, 2: 4, 3: 2, 4: 0, 5: 3, 6: 1, 7: 4, 8: 2, 9: 0 }, // 申
    9: { 0: 4, 1: 4, 2: 0, 3: 0, 4: 1, 5: 4, 6: 4, 7: 0, 8: 0, 9: 1 }, // 酉
    10: { 0: 0, 1: 2, 2: 1, 3: 3, 4: 4, 5: 0, 6: 2, 7: 1, 8: 3, 9: 4 }, // 戌
    11: { 0: 2, 1: 0, 2: 3, 3: 1, 4: 4, 5: 2, 6: 0, 7: 3, 8: 1, 9: 4 }, // 亥
  };

  const juIndex = table[mingGongBranchIndex]?.[yearStemIndex] ?? 0;
  return WUXING_JU[juIndex];
}

/**
 * 安排主星（简化版）
 */
function arrangeMajorStars(
  lunarDay: number,
  wuxingJu: string,
  mingGongIndex: number
): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) {
    result[i] = [];
  }

  // 简化的紫微星安排逻辑
  // 根据五行局和生日计算紫微星位置
  const juNum = parseInt(wuxingJu.match(/\d/)?.[0] || '2');
  const ziweiPos = (Math.floor((lunarDay - 1) / juNum) + mingGongIndex + 2) % 12;

  // 紫微星系
  result[ziweiPos].push('紫微');
  result[(ziweiPos + 11) % 12].push('天机');
  result[(ziweiPos + 9) % 12].push('太阳');
  result[(ziweiPos + 8) % 12].push('武曲');
  result[(ziweiPos + 7) % 12].push('天同');
  result[(ziweiPos + 4) % 12].push('廉贞');

  // 天府星系（与紫微对称）
  const tianfuPos = (12 - ziweiPos + 4) % 12;
  result[tianfuPos].push('天府');
  result[(tianfuPos + 1) % 12].push('太阴');
  result[(tianfuPos + 2) % 12].push('贪狼');
  result[(tianfuPos + 3) % 12].push('巨门');
  result[(tianfuPos + 4) % 12].push('天相');
  result[(tianfuPos + 5) % 12].push('天梁');
  result[(tianfuPos + 6) % 12].push('七杀');
  result[(tianfuPos + 10) % 12].push('破军');

  return result;
}

/**
 * 安排辅星（简化版）
 */
function arrangeMinorStars(
  yearStemIndex: number,
  hourBranchIndex: number
): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) {
    result[i] = [];
  }

  // 文昌文曲
  const wenchangPos = (10 - hourBranchIndex + 12) % 12;
  const wenquPos = (hourBranchIndex + 4) % 12;
  result[wenchangPos].push('文昌');
  result[wenquPos].push('文曲');

  // 左辅右弼
  result[(hourBranchIndex + 4) % 12].push('左辅');
  result[(10 - hourBranchIndex + 12) % 12].push('右弼');

  // 天魁天钺（根据年干）
  const tiankuiTable = [1, 0, 11, 11, 1, 0, 7, 6, 3, 3];
  const tianyueTable = [7, 8, 9, 9, 7, 8, 1, 2, 5, 5];
  result[tiankuiTable[yearStemIndex]].push('天魁');
  result[tianyueTable[yearStemIndex]].push('天钺');

  // 禄存
  const lucunTable = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  result[lucunTable[yearStemIndex]].push('禄存');

  return result;
}

/**
 * 安排四化（简化版）
 */
function arrangeHuaStars(
  yearStemIndex: number,
  majorStarsMap: Record<number, string[]>
): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) {
    result[i] = [];
  }

  // 四化表（年干对应的化禄、化权、化科、化忌星）
  const huaTable: Record<number, string[]> = {
    0: ['廉贞', '破军', '武曲', '太阳'], // 甲
    1: ['天机', '天梁', '紫微', '太阴'], // 乙
    2: ['天同', '天机', '文昌', '廉贞'], // 丙
    3: ['太阴', '天同', '天机', '巨门'], // 丁
    4: ['贪狼', '太阴', '右弼', '天机'], // 戊
    5: ['武曲', '贪狼', '天梁', '文曲'], // 己
    6: ['太阳', '武曲', '太阴', '天同'], // 庚
    7: ['巨门', '太阳', '文曲', '文昌'], // 辛
    8: ['天梁', '紫微', '左辅', '武曲'], // 壬
    9: ['破军', '巨门', '太阴', '贪狼'], // 癸
  };

  const huaNames = ['化禄', '化权', '化科', '化忌'];
  const targetStars = huaTable[yearStemIndex] || huaTable[0];

  // 找到对应星曜的位置并添加四化
  targetStars.forEach((starName, huaIndex) => {
    for (let i = 0; i < 12; i++) {
      if (majorStarsMap[i]?.includes(starName)) {
        result[i].push(huaNames[huaIndex]);
        break;
      }
    }
  });

  return result;
}

/**
 * 生成完整命盘
 * - 阳历输入：转换成农历进行排盘
 * - 阴历输入：直接用农历排盘
 */
export function generateChart(birthInfo: BirthInfo): ChartData {
  // 处理日期转换
  let lunarDate: { year: number; month: number; day: number; isLeap: boolean };
  let solarDateObj: { year: number; month: number; day: number };

  if (birthInfo.dateType === 'solar') {
    // 阳历输入：公历日期就是用户输入，需要转换成农历用于排盘
    solarDateObj = {
      year: birthInfo.year,
      month: birthInfo.month,
      day: birthInfo.day,
    };
    lunarDate = solarToLunar(birthInfo.year, birthInfo.month, birthInfo.day);
  } else {
    // 阴历输入：农历日期就是用户输入，需要转换成公历用于真太阳时计算
    lunarDate = {
      year: birthInfo.year,
      month: birthInfo.month,
      day: birthInfo.day,
      isLeap: false,
    };
    solarDateObj = lunarToSolar(birthInfo.year, birthInfo.month, birthInfo.day);
  }

  // 计算真太阳时（使用公历日期）
  const solarDate = new Date(solarDateObj.year, solarDateObj.month - 1, solarDateObj.day);
  const trueSolarTime = calculateTrueSolarTime(
    birthInfo.hour,
    birthInfo.minute,
    birthInfo.city,
    solarDate
  );

  // 获取时辰地支索引
  const hourBranchIndex = HOUR_TO_BRANCH[trueSolarTime.hour] ?? 0;

  // 计算干支
  const yearGanZhi = getYearGanZhi(lunarDate.year);
  const monthGanZhi = getMonthGanZhi(lunarDate.year, lunarDate.month);
  const dayGanZhi = getDayGanZhi(birthInfo.year, birthInfo.month, birthInfo.day);
  const hourGanZhi = getHourGanZhi(dayGanZhi, trueSolarTime.hour);

  // 年干索引
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearGanZhi[0]);

  // 计算命宫和身宫
  const mingGongIndex = calculateMingGongIndex(lunarDate.month, hourBranchIndex);
  const shenGongIndex = calculateShenGongIndex(lunarDate.month, hourBranchIndex);

  // 计算五行局
  const wuxingju = calculateWuxingJu(mingGongIndex, yearStemIndex);

  // 安排星曜
  const majorStarsMap = arrangeMajorStars(lunarDate.day, wuxingju, mingGongIndex);
  const minorStarsMap = arrangeMinorStars(yearStemIndex, hourBranchIndex);
  const huaStarsMap = arrangeHuaStars(yearStemIndex, majorStarsMap);

  // 构建十二宫位
  const palaceKeys: PalaceKey[] = [
    'ming', 'fumu', 'fude', 'tianzhai', 'shiye', 'jiaoyou',
    'qianyi', 'jie', 'caibo', 'zinv', 'fuqi', 'xiongdi',
  ];

  const palaces: Record<PalaceKey, Palace> = {} as Record<PalaceKey, Palace>;

  palaceKeys.forEach((key, index) => {
    const palaceIndex = (mingGongIndex + index) % 12;
    palaces[key] = {
      name: PALACE_NAMES[key],
      earthlyBranch: EARTHLY_BRANCHES[palaceIndex],
      stars: {
        major: majorStarsMap[palaceIndex] || [],
        minor: minorStarsMap[palaceIndex] || [],
        hua: huaStarsMap[palaceIndex] || [],
      },
    };
  });

  return {
    birthInfo,
    trueSolarTime,
    lunarDate,
    solarDate: solarDateObj,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
    mingGongIndex,
    shenGongIndex,
    wuxingju,
    palaces,
  };
}

/**
 * 格式化命盘数据为 AI 分析用的文本
 */
export function formatChartForAI(chartData: ChartData): string {
  const { birthInfo, lunarDate, yearGanZhi, wuxingju, palaces } = chartData;

  let text = `【命盘信息】\n`;
  text += `出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}时${birthInfo.minute}分\n`;
  text += `农历：${lunarDate.year}年${lunarDate.month}月${lunarDate.day}日${lunarDate.isLeap ? '（闰月）' : ''}\n`;
  text += `性别：${birthInfo.gender === 'male' ? '男' : '女'}\n`;
  text += `年干支：${yearGanZhi}\n`;
  text += `五行局：${wuxingju}\n\n`;

  text += `【十二宫位】\n`;
  Object.entries(palaces).forEach(([key, palace]) => {
    const stars = [
      ...palace.stars.major,
      ...palace.stars.minor.slice(0, 3),
      ...palace.stars.hua,
    ].join('、');
    text += `${palace.name}（${palace.earthlyBranch}）：${stars || '无主星'}\n`;
  });

  return text;
}

/**
 * 获取宫位简要解读
 */
export function getPalaceSummary(palace: Palace, palaceKey: PalaceKey): string {
  const majorStar = palace.stars.major[0];
  if (!majorStar) return '此宫无主星坐守，需借对宫星曜论断。';

  const summaries: Record<string, Record<PalaceKey, string>> = {
    '紫微': {
      ming: '帝星坐命，天生具有领袖气质，做事有魄力，但需防骄傲自大。',
      caibo: '财运亨通，适合从事管理或高层职位，容易获得他人信任。',
      shiye: '事业运佳，有机会成为行业领袖，适合自主创业或担任要职。',
      fuqi: '对感情要求较高，配偶往往有一定社会地位。',
      fude: '内心追求完美，精神层面丰富，晚年福泽深厚。',
      fumu: '与父母关系不错，家庭背景较好，能得长辈帮助。',
      xiongdi: '兄弟姐妹中可能有出众者，手足之间可互相提携。',
      zinv: '子女有出息，可能在事业上有所成就。',
      jie: '身体素质不错，但需注意心血管方面的保养。',
      qianyi: '外出发展运势佳，适合在大城市或国外发展。',
      jiaoyou: '朋友圈层次较高，能结交权贵人物。',
      tianzhai: '房产运不错，有机会拥有较好的住宅。',
    },
    '天机': {
      ming: '聪明机智，善于思考和谋划，但有时想得太多反而犹豫不决。',
      caibo: '财运起伏，善于理财规划，但不宜投机冒险。',
      shiye: '适合从事策划、咨询、技术类工作，需要动脑的职业。',
      fuqi: '配偶聪慧，婚姻中需要多沟通理解。',
      fude: '思维活跃，精神世界丰富，但容易想太多而焦虑。',
      fumu: '与父母沟通顺畅，能得到智慧的指导。',
      xiongdi: '兄弟姐妹聪明，但可能意见不一。',
      zinv: '子女聪颖好学，有学术天赋。',
      jie: '需注意神经系统和肝胆方面的健康。',
      qianyi: '适合外出发展，善于适应新环境。',
      jiaoyou: '朋友多为知识分子，交友广泛。',
      tianzhai: '对居住环境要求较高，喜欢整洁有序。',
    },
  };

  return summaries[majorStar]?.[palaceKey] || `${majorStar}坐守${palace.name}，具有该星曜的典型特质。`;
}
