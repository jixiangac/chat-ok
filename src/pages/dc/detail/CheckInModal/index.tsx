import { useState } from 'react';
import { Popup } from 'antd-mobile';
import { Clock, Hash, Check, Plus, Minus } from 'lucide-react';
import type { CheckInUnit } from '../../types';
import { useTheme } from '../../settings/theme';
import styles from './styles.module.css';

interface CheckInModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value?: number, note?: string) => void;
  unit: CheckInUnit;
  loading?: boolean;
  // 时长型配置
  quickDurations?: number[];
  dailyTargetMinutes?: number;
  // 数值型配置
  valueUnit?: string;
  dailyTargetValue?: number;
  // 今日已完成
  todayValue?: number;
}

export default function CheckInModal({
  visible,
  onClose,
  onSubmit,
  unit,
  loading = false,
  quickDurations = [5, 10, 15],
  dailyTargetMinutes = 15,
  valueUnit = '个',
  dailyTargetValue = 0,
  todayValue = 0
}: CheckInModalProps) {
  const { themeColors } = useTheme();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (unit === 'TIMES') {
      onSubmit(1, note || undefined);
    } else if (unit === 'DURATION') {
      const duration = selectedDuration || parseInt(customDuration) || 0;
      if (duration > 0) {
        onSubmit(duration, note || undefined);
      }
    } else if (unit === 'QUANTITY') {
      const value = parseFloat(inputValue) || 0;
      if (value > 0) {
        onSubmit(value, note || undefined);
      }
    }
    // 重置状态
    setSelectedDuration(null);
    setCustomDuration('');
    setInputValue('');
    setNote('');
  };

  const handleClose = () => {
    setSelectedDuration(null);
    setCustomDuration('');
    setInputValue('');
    setNote('');
    onClose();
  };

  // 次数型打卡 - 直接打卡
  if (unit === 'TIMES') {
    return (
      <Popup
        visible={visible}
        onMaskClick={handleClose}
        position="bottom"
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))'
        }}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Check size={24} />
            <span>确认打卡</span>
          </div>
          <div className={styles.description}>
            点击确认完成本次打卡
          </div>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: loading ? '#ccc' : themeColors.primary }}
          >
            {loading ? '打卡中...' : '确认打卡'}
          </button>
        </div>
      </Popup>
    );
  }

  // 时长型打卡
  if (unit === 'DURATION') {
    const remainingMinutes = Math.max(0, dailyTargetMinutes - todayValue);
    
    return (
      <Popup
        visible={visible}
        onMaskClick={handleClose}
        position="bottom"
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Clock size={24} />
            <span>记录时长</span>
          </div>
          
          <div className={styles.todayInfo}>
            今日已完成 {todayValue} 分钟，目标 {dailyTargetMinutes} 分钟
          </div>
          
          <div className={styles.quickOptions}>
            {quickDurations.map(duration => (
              <button
                key={duration}
                className={`${styles.quickOption} ${selectedDuration === duration ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedDuration(duration);
                  setCustomDuration('');
                }}
              >
                {duration}分钟
              </button>
            ))}
          </div>
          
          <div className={styles.customInput}>
            <span className={styles.inputLabel}>自定义时长</span>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(e.target.value);
                  setSelectedDuration(null);
                }}
                placeholder="输入分钟数"
                className={styles.input}
              />
              <span className={styles.inputUnit}>分钟</span>
            </div>
          </div>
          
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || (!selectedDuration && !customDuration)}
            style={{ backgroundColor: (loading || (!selectedDuration && !customDuration)) ? '#ccc' : themeColors.primary }}
          >
            {loading ? '记录中...' : `记录 ${selectedDuration || customDuration || 0} 分钟`}
          </button>
        </div>
      </Popup>
    );
  }

  // 数值型打卡
  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))'
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Hash size={24} />
          <span>记录数值</span>
        </div>
        
        {dailyTargetValue > 0 && (
          <div className={styles.todayInfo}>
            今日已完成 {todayValue} {valueUnit}，目标 {dailyTargetValue} {valueUnit}
          </div>
        )}
        
        <div className={styles.valueInputSection}>
          <div className={styles.valueControls}>
            <button
              className={styles.controlButton}
              onClick={() => {
                const current = parseFloat(inputValue) || 0;
                if (current > 1) setInputValue(String(current - 1));
              }}
            >
              <Minus size={20} />
            </button>
            <div className={styles.valueDisplay}>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
                className={styles.valueInput}
              />
              <span className={styles.valueUnit}>{valueUnit}</span>
            </div>
            <button
              className={styles.controlButton}
              onClick={() => {
                const current = parseFloat(inputValue) || 0;
                setInputValue(String(current + 1));
              }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        
        <div className={styles.quickValues}>
          {[1, 5, 10].map(val => (
            <button
              key={val}
              className={styles.quickValue}
              onClick={() => setInputValue(String(val))}
            >
              +{val}
            </button>
          ))}
        </div>
        
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading || !inputValue || parseFloat(inputValue) <= 0}
          style={{ backgroundColor: (loading || !inputValue || parseFloat(inputValue) <= 0) ? '#ccc' : themeColors.primary }}
        >
          {loading ? '记录中...' : `记录 ${inputValue || 0} ${valueUnit}`}
        </button>
      </div>
    </Popup>
  );
}
