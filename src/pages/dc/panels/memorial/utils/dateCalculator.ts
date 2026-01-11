/**
 * 日期计算工具
 */

import dayjs from 'dayjs';
import type { DateDisplayFormat } from '../types';

// 结构化的天数显示数据
export interface DaysDisplayData {
  items: Array<{
    number: number;
    unit: string;
  }>;
  isPast: boolean;
}

/**
 * 计算目标日期与今天的天数差
 * 正数表示过去的日期（正计时），负数表示未来的日期（倒计时）
 */
export function calculateDays(targetDate: string): number {
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');
  return today.diff(target, 'day');
}

/**
 * 判断是否为今天
 */
export function isToday(targetDate: string): boolean {
  return dayjs(targetDate).isSame(dayjs(), 'day');
}

/**
 * 判断是否为过去的日期
 */
export function isPast(targetDate: string): boolean {
  return dayjs(targetDate).isBefore(dayjs(), 'day');
}

/**
 * 判断是否为未来的日期
 */
export function isFuture(targetDate: string): boolean {
  return dayjs(targetDate).isAfter(dayjs(), 'day');
}

/**
 * 格式化天数显示（不含前缀）
 */
export function formatDays(days: number, format: DateDisplayFormat): string {
  const absDays = Math.abs(days);

  switch (format) {
    case 'days':
      return `${absDays} 天`;

    case 'monthsDays': {
      const months = Math.floor(absDays / 30);
      const remainingDays = absDays % 30;
      if (months === 0) return `${remainingDays} 天`;
      if (remainingDays === 0) return `${months} 个月`;
      return `${months} 个月 ${remainingDays} 天`;
    }

    case 'yearsMonthsDays': {
      const years = Math.floor(absDays / 365);
      const remainingAfterYears = absDays % 365;
      const months = Math.floor(remainingAfterYears / 30);
      const remainingDays = remainingAfterYears % 30;

      const parts: string[] = [];
      if (years > 0) parts.push(`${years} 年`);
      if (months > 0) parts.push(`${months} 个月`);
      if (remainingDays > 0 || parts.length === 0) parts.push(`${remainingDays} 天`);

      return parts.join(' ');
    }

    default:
      return `${absDays} 天`;
  }
}

/**
 * 获取单位的单复数形式
 */
function getUnitText(value: number, singular: string, plural: string): string {
  return value === 1 ? singular : plural;
}

/**
 * 获取结构化的天数显示数据（用于详情页大字显示）
 */
export function getStructuredDaysData(targetDate: string, format: DateDisplayFormat): DaysDisplayData | null {
  if (isToday(targetDate)) {
    return null; // 今天返回 null，由调用方特殊处理
  }

  const days = calculateDays(targetDate);
  const absDays = Math.abs(days);
  const isPast = days > 0;

  switch (format) {
    case 'days':
      return {
        items: [{ number: absDays, unit: getUnitText(absDays, 'DAY', 'DAYS') }],
        isPast,
      };

    case 'monthsDays': {
      const months = Math.floor(absDays / 30);
      const remainingDays = absDays % 30;
      const items: Array<{ number: number; unit: string }> = [];
      
      if (months > 0) items.push({ number: months, unit: getUnitText(months, 'MONTH', 'MONTHS') });
      if (remainingDays > 0 || items.length === 0) items.push({ number: remainingDays, unit: getUnitText(remainingDays, 'DAY', 'DAYS') });
      
      return { items, isPast };
    }

    case 'yearsMonthsDays': {
      const years = Math.floor(absDays / 365);
      const remainingAfterYears = absDays % 365;
      const months = Math.floor(remainingAfterYears / 30);
      const remainingDays = remainingAfterYears % 30;

      const items: Array<{ number: number; unit: string }> = [];
      if (years > 0) items.push({ number: years, unit: getUnitText(years, 'YEAR', 'YEARS') });
      if (months > 0) items.push({ number: months, unit: getUnitText(months, 'MONTH', 'MONTHS') });
      if (remainingDays > 0 || items.length === 0) items.push({ number: remainingDays, unit: getUnitText(remainingDays, 'DAY', 'DAYS') });

      return { items, isPast };
    }

    default:
      return { items: [{ number: absDays, unit: getUnitText(absDays, 'DAY', 'DAYS') }], isPast };
  }
}

/**
 * 获取显示文本（包含正计时/倒计时前缀）
 */
export function getDaysDisplayText(targetDate: string, format: DateDisplayFormat): string {
  if (isToday(targetDate)) {
    return '今天';
  }

  const days = calculateDays(targetDate);
  const formattedDays = formatDays(days, format);

  if (days > 0) {
    return `已 ${formattedDays}`;
  } else {
    return `还有 ${formattedDays}`;
  }
}

/**
 * 获取简短的天数显示（用于列表卡片）
 */
export function getShortDaysText(targetDate: string): string {
  if (isToday(targetDate)) {
    return '今天';
  }

  const days = calculateDays(targetDate);
  const absDays = Math.abs(days);

  if (days > 0) {
    return `已 ${absDays} 天`;
  } else {
    return `还有 ${absDays} 天`;
  }
}

/**
 * 获取下一个日期格式（循环切换）
 */
export function getNextDateFormat(current: DateDisplayFormat): DateDisplayFormat {
  const formats: DateDisplayFormat[] = ['days', 'monthsDays', 'yearsMonthsDays'];
  const currentIndex = formats.indexOf(current);
  const nextIndex = (currentIndex + 1) % formats.length;
  return formats[nextIndex];
}

/**
 * 格式化日期为显示字符串
 */
export function formatDate(date: string): string {
  return dayjs(date).format('YYYY年M月D日');
}


