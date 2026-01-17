/**
 * 日期测试页面组件
 * 用于开发者测试日期变更逻辑
 */

import React, { useState, useCallback } from 'react';
import { Calendar, RefreshCw, Trash2, Play, AlertCircle } from 'lucide-react';
import { DatePicker, Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { SubPageLayout } from '../../components';
import { useApp } from '@/pages/dc/contexts';
import styles from './styles.module.css';

export interface DateTestPageProps {
  /** 返回上一页 */
  onBack: () => void;
}

const DateTestPage: React.FC<DateTestPageProps> = ({ onBack }) => {
  const { systemDate, testDate, setTestDate, clearTestDate, triggerDateChange } = useApp();
  
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    testDate ? new Date(testDate) : new Date()
  );

  // 处理设置测试日期
  const handleSetTestDate = useCallback(() => {
    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
    const success = setTestDate(dateStr);
    if (success) {
      Toast.show({
        content: `测试日期已设置为 ${dateStr}`,
        position: 'bottom',
      });
    } else {
      Toast.show({
        content: '设置测试日期失败',
        position: 'bottom',
      });
    }
  }, [selectedDate, setTestDate]);

  // 处理清除测试日期
  const handleClearTestDate = useCallback(() => {
    clearTestDate();
    setSelectedDate(new Date());
    Toast.show({
      content: '已恢复使用真实日期',
      position: 'bottom',
    });
  }, [clearTestDate]);

  // 处理触发日期变更
  const handleTriggerDateChange = useCallback(() => {
    triggerDateChange();
    Toast.show({
      content: '已触发日期变更事件',
      position: 'bottom',
    });
  }, [triggerDateChange]);

  // 处理日期选择确认
  const handleDateConfirm = useCallback((date: Date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  }, []);

  return (
    <SubPageLayout title="日期测试" onBack={onBack}>
      <div className={styles.container}>
        {/* 警告提示 */}
        <div className={styles.warningCard}>
          <AlertCircle size={20} className={styles.warningIcon} />
          <div className={styles.warningText}>
            <p className={styles.warningTitle}>开发者功能</p>
            <p className={styles.warningDesc}>
              此功能仅用于测试日期变更逻辑，设置测试日期后系统将使用该日期进行计算。
            </p>
          </div>
        </div>

        {/* 当前日期信息 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>当前日期状态</h3>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>系统日期</span>
              <span className={styles.infoValue}>{systemDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>真实日期</span>
              <span className={styles.infoValue}>{dayjs().format('YYYY-MM-DD')}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>测试日期</span>
              <span className={`${styles.infoValue} ${testDate ? styles.testActive : ''}`}>
                {testDate || '未设置'}
              </span>
            </div>
          </div>
        </div>

        {/* 日期选择 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>设置测试日期</h3>
          <div className={styles.datePickerCard}>
            <div 
              className={styles.dateDisplay}
              onClick={() => setDatePickerVisible(true)}
            >
              <Calendar size={20} className={styles.calendarIcon} />
              <span className={styles.dateText}>
                {dayjs(selectedDate).format('YYYY年MM月DD日')}
              </span>
            </div>
            <button 
              className={styles.setButton}
              onClick={handleSetTestDate}
            >
              设置
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>操作</h3>
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={handleTriggerDateChange}
            >
              <Play size={18} />
              <span>触发日期变更</span>
            </button>
            <button 
              className={`${styles.actionButton} ${styles.clearButton}`}
              onClick={handleClearTestDate}
              disabled={!testDate}
            >
              <Trash2 size={18} />
              <span>清除测试日期</span>
            </button>
          </div>
        </div>

        {/* 说明 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>使用说明</h3>
          <div className={styles.helpCard}>
            <ol className={styles.helpList}>
              <li>选择一个测试日期并点击"设置"</li>
              <li>点击"触发日期变更"模拟跨天</li>
              <li>观察任务数据是否正确重置</li>
              <li>测试完成后点击"清除测试日期"恢复正常</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 日期选择器 */}
      <DatePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        value={selectedDate}
        min={new Date(2020, 0, 1)}
        max={new Date(2030, 11, 31)}
      />
    </SubPageLayout>
  );
};

export default DateTestPage;
