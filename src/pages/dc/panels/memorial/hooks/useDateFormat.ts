/**
 * 日期格式切换 Hook - 性能优化版本
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DateDisplayFormat } from '../types';
import { loadDateFormat, saveDateFormat } from '../storage';
import { getNextDateFormat } from '../utils';

interface UseDateFormatReturn {
  format: DateDisplayFormat;
  toggleFormat: () => void;
  setFormat: (format: DateDisplayFormat) => void;
}

export function useDateFormat(): UseDateFormatReturn {
  const [format, setFormatState] = useState<DateDisplayFormat>('days');
  const isInitializedRef = useRef(false);

  // 初始化加载（只执行一次）
  useEffect(() => {
    if (!isInitializedRef.current) {
      const savedFormat = loadDateFormat();
      setFormatState(savedFormat);
      isInitializedRef.current = true;
    }
  }, []);

  // 设置格式并异步保存（不阻塞 UI）
  const setFormat = useCallback((newFormat: DateDisplayFormat) => {
    setFormatState(newFormat);
    // 使用 requestIdleCallback 在空闲时保存
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => saveDateFormat(newFormat), { timeout: 500 });
    } else {
      setTimeout(() => saveDateFormat(newFormat), 0);
    }
  }, []);

  // 循环切换格式 - 使用函数式更新避免依赖 format
  const toggleFormat = useCallback(() => {
    setFormatState(currentFormat => {
      const nextFormat = getNextDateFormat(currentFormat);
      // 异步保存
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => saveDateFormat(nextFormat), { timeout: 500 });
      } else {
        setTimeout(() => saveDateFormat(nextFormat), 0);
      }
      return nextFormat;
    });
  }, []);

  return {
    format,
    toggleFormat,
    setFormat,
  };
}
