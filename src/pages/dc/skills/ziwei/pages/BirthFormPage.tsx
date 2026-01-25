/**
 * 紫微斗数出生信息输入页
 */

import { useState, useCallback } from 'react';
import { Picker, SafeArea } from 'antd-mobile';
import { ChevronRight } from 'lucide-react';
import type { BirthFormPageProps, BirthInfo, DateType, Gender } from '../types';
import { CITY_LIST, YEAR_RANGE, HOUR_NAMES } from '../constants';
import styles from '../styles.module.css';

// 生成年份选项
const yearColumns = [
  Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => ({
    label: `${YEAR_RANGE.min + i}年`,
    value: YEAR_RANGE.min + i,
  })),
];

// 生成月份选项
const monthColumns = [
  Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i + 1,
  })),
];

// 生成日期选项
const dayColumns = [
  Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}日`,
    value: i + 1,
  })),
];

// 生成时辰选项
const hourColumns = [
  HOUR_NAMES.map((name, index) => ({
    label: name,
    value: index,
  })),
];

// 城市选项
const cityColumns = [
  CITY_LIST.map((city) => ({
    label: city.name,
    value: city.key,
  })),
];

export default function BirthFormPage({
  initialValues,
  onSubmit,
  onBack,
  loading = false,
}: BirthFormPageProps) {
  const currentYear = new Date().getFullYear();

  const [dateType, setDateType] = useState<DateType>(initialValues?.dateType || 'solar');
  const [year, setYear] = useState<number>(initialValues?.year || 1990);
  const [month, setMonth] = useState<number>(initialValues?.month || 1);
  const [day, setDay] = useState<number>(initialValues?.day || 1);
  const [hourIndex, setHourIndex] = useState<number>(
    initialValues?.hour !== undefined
      ? Math.floor(((initialValues.hour + 1) % 24) / 2)
      : 0
  );
  const [city, setCity] = useState<string>(initialValues?.city || 'beijing');
  const [gender, setGender] = useState<Gender>(initialValues?.gender || 'male');

  // Picker 可见状态
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [hourPickerVisible, setHourPickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  // 获取城市名称
  const getCityName = useCallback((cityKey: string) => {
    return CITY_LIST.find((c) => c.key === cityKey)?.name || '北京';
  }, []);

  // 时辰索引转换为小时
  const hourIndexToHour = (index: number): number => {
    // 子时 (0) -> 23点，丑时 (1) -> 1点，...
    if (index === 0) return 23;
    return index * 2 - 1;
  };

  // 提交表单
  const handleSubmit = useCallback(() => {
    const birthInfo: BirthInfo = {
      dateType,
      year,
      month,
      day,
      hour: hourIndexToHour(hourIndex),
      minute: 0,
      city,
      gender,
    };
    onSubmit(birthInfo);
  }, [dateType, year, month, day, hourIndex, city, gender, onSubmit]);

  return (
    <div className={styles.formPage}>
      <div className={styles.pageContent}>
        {/* 日期类型 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>日期类型</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.toggleButton} ${dateType === 'solar' ? styles.active : ''}`}
              onClick={() => setDateType('solar')}
            >
              阳历
            </button>
            <button
              className={`${styles.toggleButton} ${dateType === 'lunar' ? styles.active : ''}`}
              onClick={() => setDateType('lunar')}
            >
              阴历
            </button>
          </div>
        </div>

        {/* 出生信息 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            出生信息
            <span className={styles.inputLabelHint}>（{dateType === 'solar' ? '阳历' : '阴历'}）</span>
          </label>
          <div className={styles.datePickerRow}>
            <div className={styles.datePickerItem}>
              <div
                className={styles.selectorEntry}
                onClick={() => setYearPickerVisible(true)}
              >
                <span className={styles.selectorValue}>{year}年</span>
                <ChevronRight size={18} className={styles.selectorArrow} />
              </div>
            </div>
            <div className={styles.datePickerItem}>
              <div
                className={styles.selectorEntry}
                onClick={() => setMonthPickerVisible(true)}
              >
                <span className={styles.selectorValue}>{month}月</span>
                <ChevronRight size={18} className={styles.selectorArrow} />
              </div>
            </div>
            <div className={styles.datePickerItem}>
              <div
                className={styles.selectorEntry}
                onClick={() => setDayPickerVisible(true)}
              >
                <span className={styles.selectorValue}>{day}日</span>
                <ChevronRight size={18} className={styles.selectorArrow} />
              </div>
            </div>
          </div>
        </div>

        {/* 出生时辰 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>出生时辰</label>
          <div
            className={styles.selectorEntry}
            onClick={() => setHourPickerVisible(true)}
          >
            <span className={styles.selectorValue}>{HOUR_NAMES[hourIndex]}</span>
            <ChevronRight size={18} className={styles.selectorArrow} />
          </div>
        </div>

        {/* 出生城市 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            出生城市
            <span className={styles.inputLabelHint}>（用于真太阳时校正）</span>
          </label>
          <div
            className={styles.selectorEntry}
            onClick={() => setCityPickerVisible(true)}
          >
            <span className={styles.selectorValue}>{getCityName(city)}</span>
            <ChevronRight size={18} className={styles.selectorArrow} />
          </div>
        </div>

        {/* 性别 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>性别</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.toggleButton} ${gender === 'male' ? styles.active : ''}`}
              onClick={() => setGender('male')}
            >
              男
            </button>
            <button
              className={`${styles.toggleButton} ${gender === 'female' ? styles.active : ''}`}
              onClick={() => setGender('female')}
            >
              女
            </button>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className={styles.bottomNav}>
        <button
          className={`${styles.navButton} ${styles.navButtonSecondary}`}
          onClick={onBack}
        >
          返回
        </button>
        <button
          className={`${styles.navButton} ${styles.navButtonPrimary}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '正在生成...' : '生成命盘'}
        </button>
      </div>

      <SafeArea position="bottom" />

      {/* Pickers */}
      <Picker
        visible={yearPickerVisible}
        onClose={() => setYearPickerVisible(false)}
        columns={yearColumns}
        value={[year]}
        onConfirm={(val) => {
          setYear(val[0] as number);
        }}
      />
      <Picker
        visible={monthPickerVisible}
        onClose={() => setMonthPickerVisible(false)}
        columns={monthColumns}
        value={[month]}
        onConfirm={(val) => {
          setMonth(val[0] as number);
        }}
      />
      <Picker
        visible={dayPickerVisible}
        onClose={() => setDayPickerVisible(false)}
        columns={dayColumns}
        value={[day]}
        onConfirm={(val) => {
          setDay(val[0] as number);
        }}
      />
      <Picker
        visible={hourPickerVisible}
        onClose={() => setHourPickerVisible(false)}
        columns={hourColumns}
        value={[hourIndex]}
        onConfirm={(val) => {
          setHourIndex(val[0] as number);
        }}
      />
      <Picker
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
        columns={cityColumns}
        value={[city]}
        onConfirm={(val) => {
          setCity(val[0] as string);
        }}
      />
    </div>
  );
}
