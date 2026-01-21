/**
 * 周期设置页面（现为最后一步）
 * 设定任务的总时长、周期长度和起始时间
 * 显示完整任务预览和预计收益
 */

import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { DatePicker } from 'antd-mobile';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';
import { CyclePreview, OptionGrid, BottomNavigation, TaskPreview } from '../../components';
import { TOTAL_DURATION_OPTIONS, CYCLE_LENGTH_OPTIONS } from '../../constants';
import { SPIRIT_JADE_COST } from '@/pages/dc/constants/spiritJade';
import type { CreateTaskModalState } from '../../modalTypes';
import styles from './styles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';

export interface CycleSettingsPageProps {
  state: CreateTaskModalState;
  setState: React.Dispatch<React.SetStateAction<CreateTaskModalState>>;
  onNext?: () => void;
  onSubmit?: () => void;
  onBack: () => void;
  taskCategory: 'MAINLINE' | 'SIDELINE';
}

const CycleSettingsPage: React.FC<CycleSettingsPageProps> = ({
  state,
  setState,
  onNext,
  onSubmit,
  onBack,
  taskCategory,
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const datePickerRef = useRef<DatePickerRef>(null);

  // 灵石消耗
  const spiritJadeCost = taskCategory === 'MAINLINE'
    ? SPIRIT_JADE_COST.CREATE_MAINLINE_TASK
    : SPIRIT_JADE_COST.CREATE_SIDELINE_TASK;

  const handleTotalDaysChange = (value: number) => {
    setState(s => ({
      ...s,
      totalDays: value,
      cycleDays: value === 365 ? 30 : s.cycleDays,
    }));
  };

  const handleCycleDaysChange = (value: number) => {
    setState(s => ({ ...s, cycleDays: value }));
  };

  const handleDateConfirm = (date: Date) => {
    setState(s => ({ ...s, startDate: dayjs(date).format('YYYY-MM-DD') }));
  };

  // 总时长选项
  const durationOptions = TOTAL_DURATION_OPTIONS.map(option => ({
    icon: <option.Icon size={22} />,
    label: option.label,
    selected: state.totalDays === option.value,
    onClick: () => handleTotalDaysChange(option.value),
  }));

  // 周期选项
  const cycleOptions = CYCLE_LENGTH_OPTIONS.map(option => ({
    label: option.label,
    description: option.description,
    selected: state.cycleDays === option.value,
    disabled: state.totalDays === 30 && option.value === 30,
    onClick: () => handleCycleDaysChange(option.value),
  }));

  // 日期范围
  const minDate = dayjs().subtract(7, 'day').toDate();
  const maxDate = dayjs().add(1, 'month').toDate();
  const currentDate = dayjs(state.startDate).toDate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 总时长 - 2x2 网格 */}
        <OptionGrid
          title="总时长"
          options={durationOptions}
          columns={2}
        />

        {/* 周期长度 - 3列网格 */}
        <OptionGrid
          title="周期长度"
          options={cycleOptions}
          columns={3}
        />
         {/* 起始时间 */}
        <div className={styles.dateSection}>
          <div className={styles.sectionTitle}>起始时间</div>
          <div
            className={styles.dateInputWrapper}
            onClick={() => setDatePickerVisible(true)}
          >
            <Calendar size={18} className={styles.dateIcon} />
            <span className={styles.dateValue}>
              {dayjs(state.startDate).format('YYYY年MM月DD日')}
            </span>
          </div>
          <div className={styles.dateHint}>
            可选择过去1周内或未来1个月内的日期
          </div>
        </div>

        {/* 周期预览 */}
        {/* <CyclePreview totalDays={state.totalDays} cycleDays={state.cycleDays} /> */}

        {/* 任务预览（包含预计收益）- 仅最后一步显示 */}
        {onSubmit && <TaskPreview state={state} />}

      </div>

      <BottomNavigation
        onBack={onBack}
        onNext={onSubmit || onNext}
        nextText={onSubmit ? "创建任务" : "下一步"}
        hint={onSubmit ? (
          <span className={styles.costHint}>
            <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.costIcon} />
            创建需消耗 {spiritJadeCost} 灵玉
          </span>
        ) : undefined}
      />

      {/* antd-mobile DatePicker */}
      <DatePicker
        ref={datePickerRef}
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        defaultValue={currentDate}
        min={minDate}
        max={maxDate}
        title="选择起始日期"
        confirmText="确定"
        cancelText="取消"
      />
    </div>
  );
};

export default CycleSettingsPage;
