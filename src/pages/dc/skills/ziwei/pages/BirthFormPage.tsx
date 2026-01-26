/**
 * 紫微斗数出生信息输入页
 */

import { useState, useCallback, useMemo } from 'react';
import { Picker, SafeArea } from 'antd-mobile';
import { ChevronRight } from 'lucide-react';
import type { BirthFormPageProps, BirthInfo, DateType, Gender } from '../types';
import { YEAR_RANGE, HOUR_DATA, PROVINCE_CITY_DATA, getCityInfo } from '../constants';
import styles from '../styles.module.css';

// 比较当前表单数据和上次生成的数据是否相同
function isFormDataSame(
  formData: { dateType: DateType; year: number; month: number; day: number; hourIndex: number; city: string; gender: Gender },
  lastInfo: BirthInfo | null | undefined,
  hourIndexToHour: (index: number) => number
): boolean {
  if (!lastInfo) return false;
  return (
    formData.dateType === lastInfo.dateType &&
    formData.year === lastInfo.year &&
    formData.month === lastInfo.month &&
    formData.day === lastInfo.day &&
    hourIndexToHour(formData.hourIndex) === lastInfo.hour &&
    formData.city === lastInfo.city &&
    formData.gender === lastInfo.gender
  );
}

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

// 生成时辰选项（简洁单行：时辰名 + 时间范围）
const hourColumns = [
  HOUR_DATA.map((hour, index) => ({
    label: `${hour.name} ${hour.time}`,
    value: index,
  })),
];

// 生成省份-城市两级联动选项
const generateCityColumns = (provinceIndex: number) => {
  const provinceColumn = PROVINCE_CITY_DATA.map((p, idx) => ({
    label: p.name,
    value: idx,
  }));
  
  const cityColumn = PROVINCE_CITY_DATA[provinceIndex]?.cities.map((c) => ({
    label: c.name,
    value: c.name,
  })) || [];
  
  return [provinceColumn, cityColumn];
};

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

export default function BirthFormPage({
  initialValues,
  onSubmit,
  onBack,
  loading = false,
  costAmount = 0,
  jadeBalance = 0,
  hasExistingChart = false,
  lastGeneratedInfo = null,
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
  const [city, setCity] = useState<string>(initialValues?.city || '北京');
  // 省份索引（用于两级联动）
  const [provinceIndex, setProvinceIndex] = useState<number>(() => {
    // 根据当前城市查找省份索引
    const cityInfo = getCityInfo(initialValues?.city || '北京');
    if (cityInfo) {
      const idx = PROVINCE_CITY_DATA.findIndex(p => p.name === cityInfo.province);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [gender, setGender] = useState<Gender>(initialValues?.gender || 'male');

  // Picker 可见状态
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [hourPickerVisible, setHourPickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  // 获取城市显示名称（带省份）
  const getCityDisplayName = useCallback((cityName: string) => {
    const cityInfo = getCityInfo(cityName);
    if (cityInfo) {
      return `${cityInfo.province} - ${cityInfo.name}`;
    }
    return cityName || '北京';
  }, []);

  // 时辰索引转换为小时
  const hourIndexToHour = (index: number): number => {
    // 子时 (0) -> 23点，丑时 (1) -> 1点，...
    if (index === 0) return 23;
    return index * 2 - 1;
  };

  // 判断当前表单数据是否和上次生成的数据相同
  const isDataUnchanged = useMemo(() => {
    if (!hasExistingChart || !lastGeneratedInfo) return false;
    return isFormDataSame(
      { dateType, year, month, day, hourIndex, city, gender },
      lastGeneratedInfo,
      hourIndexToHour
    );
  }, [hasExistingChart, lastGeneratedInfo, dateType, year, month, day, hourIndex, city, gender]);

  // 是否需要消耗灵玉（数据变化时需要）
  const needCost = !isDataUnchanged;
  // 灵玉是否足够
  const hasEnoughJade = jadeBalance >= costAmount;
  // 按钮文案
  const buttonText = loading ? '正在生成...' : (isDataUnchanged ? '查看命盘' : '生成命盘');

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
            <span className={styles.selectorValue}>
              {HOUR_DATA[hourIndex].name} {HOUR_DATA[hourIndex].time}
            </span>
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
            <span className={styles.selectorValue}>{getCityDisplayName(city)}</span>
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

      {/* 底部导航（完全复刻 BottomNavigation） */}
      <div className={styles.bottomNav}>
        {/* 灵玉消耗提示（仅在需要消耗且数据有变化时显示） */}
        {needCost && costAmount > 0 && (
          <div className={styles.costHintRow}>
            <span className={styles.costHint}>
              <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.costIcon} />
              生成需消耗 <span className={styles.costAmount}>{costAmount}</span> 灵玉
              {!hasEnoughJade && (
                <span className={styles.insufficientHint}>（灵玉不足）</span>
              )}
            </span>
          </div>
        )}
        <div className={styles.navButtonRow}>
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary} ${styles.navButtonFull}`}
            onClick={handleSubmit}
            disabled={loading || (needCost && !hasEnoughJade)}
          >
            {buttonText}
          </button>
        </div>
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
        columns={generateCityColumns(provinceIndex)}
        value={[provinceIndex, city]}
        onSelect={(val) => {
          // 当省份变化时，更新城市列表
          const newProvinceIndex = val[0] as number;
          if (newProvinceIndex !== provinceIndex) {
            setProvinceIndex(newProvinceIndex);
          }
        }}
        onConfirm={(val) => {
          setProvinceIndex(val[0] as number);
          setCity(val[1] as string);
        }}
      />
    </div>
  );
}
