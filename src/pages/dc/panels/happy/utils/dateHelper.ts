// 日期相关工具函数
import { Trip } from '../types';

/**
 * 格式化日期为 "M月D日" 格式
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 格式化日期为 "YYYY-MM-DD" 格式
 */
export const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 获取今天的日期（不含时间）
 */
export const getToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * 获取日期（不含时间）
 */
export const getDateOnly = (dateStr: string): Date => {
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * 计算两个日期之间的天数差
 */
export const getDaysDiff = (date1: string, date2: string): number => {
  const d1 = getDateOnly(date1);
  const d2 = getDateOnly(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
};

/**
 * 判断日期是否在范围内
 */
export const isDateInRange = (date: string, start: string, end: string): boolean => {
  const d = getDateOnly(date);
  const s = getDateOnly(start);
  const e = getDateOnly(end);
  return d >= s && d <= e;
};

/**
 * 计算行程结束日期
 */
export const getTripEndDate = (trip: Trip): Date => {
  const startDate = getDateOnly(trip.startDate);
  return new Date(startDate.getTime() + (trip.totalDays - 1) * 24 * 60 * 60 * 1000);
};

/**
 * 判断行程是否正在进行中
 */
export const isTripActive = (trip: Trip): boolean => {
  const today = getToday();
  const startDate = getDateOnly(trip.startDate);
  const endDate = getTripEndDate(trip);
  return today >= startDate && today <= endDate;
};

/**
 * 判断行程是否即将开始（3天内）
 */
export const isTripUpcoming = (trip: Trip, daysAhead: number = 3): boolean => {
  const today = getToday();
  const startDate = getDateOnly(trip.startDate);
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return startDate > today && startDate <= futureDate;
};

/**
 * 判断行程是否已过期
 */
export const isTripExpired = (trip: Trip): boolean => {
  const today = getToday();
  const endDate = getTripEndDate(trip);
  return today > endDate;
};

/**
 * 计算今天是行程的第几天（从0开始）
 */
export const getTripDayIndex = (trip: Trip): number => {
  const today = getToday();
  const startDate = getDateOnly(trip.startDate);
  return Math.floor((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
};
