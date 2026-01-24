import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Check, Clock, Hash, TrendingUp, TrendingDown, CheckSquare } from 'lucide-react';
import { getCurrentDate } from '../../../../utils';
import { getTodayTaskReward } from '../../../../utils/dailyRewardTracker';
import { calculateDailyPointsCap } from '../../../../utils/spiritJadeCalculator';
import type { Task, ValueUpdateLog, TaskType, CheckInUnit } from '../../../../types';
import styles from './styles.module.css';

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
// 修为图标（与 RewardToast 保持一致）
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

interface ActivityRecordPanelProps {
  goal: Task;
  /** 是否只显示今天的记录 */
  todayOnly?: boolean;
}

/**
 * 变动记录面板
 * 显示任务的所有变动记录（打卡记录或数值变动记录）
 */
export default function ActivityRecordPanel({ goal, todayOnly = false }: ActivityRecordPanelProps) {
  const category = goal.category;
  const today = getCurrentDate(goal);

  // 计算今日奖励进度
  const rewardProgress = useMemo(() => {
    const taskType = goal.type as TaskType;
    const checkInUnit = (goal.checkInConfig?.unit || 'TIMES') as CheckInUnit;

    // 获取每日上限
    const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);

    // 获取今日已获得的奖励
    const todayReward = getTodayTaskReward(goal.id);

    // 判断是否达到上限
    const isJadeComplete = todayReward.spiritJade >= dailyCap.spiritJade;
    const isCultivationComplete = todayReward.cultivation >= dailyCap.cultivation;

    return {
      jade: { current: todayReward.spiritJade, max: dailyCap.spiritJade },
      cultivation: { current: todayReward.cultivation, max: dailyCap.cultivation },
      isComplete: isJadeComplete && isCultivationComplete,
    };
  }, [goal.id, goal.type, goal.checkInConfig?.unit]);
  
  // 打卡类型：从 checkInConfig.records 中提取所有打卡记录
  const checkInRecords = useMemo(() => {
    if (category !== 'CHECK_IN') return [];
    
    const records = goal.checkInConfig?.records || [];
    const allEntries: Array<{
      id: string;
      date: string;
      time: string;
      timestamp: number;
      value: number;
      note?: string;
    }> = [];
    
    records.forEach(record => {
      // 如果只显示今天的记录，过滤掉非今天的
      if (todayOnly && record.date !== today) return;
      
      // 只要有 entries 就显示，不需要 checked 为 true
      if (record.entries && record.entries.length > 0) {
        record.entries.forEach(entry => {
          allEntries.push({
            id: entry.id,
            date: record.date,
            time: entry.time,
            timestamp: dayjs(`${record.date} ${entry.time}`).valueOf(),
            value: entry.value || 1,
            note: entry.note
          });
        });
      }
    });
    
    // 按时间戳降序排序
    return allEntries.sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.checkInConfig?.records, category, todayOnly, today]);
  
  // 数值类型：从 activities 中提取数值更新记录
  const numericRecords = useMemo(() => {
    if (category !== 'NUMERIC') return [];

    let activities = goal.activities
      .filter((a): a is ValueUpdateLog => a.type === 'UPDATE_VALUE');
    console.log(activities, goal, todayOnly,today,'activities')
    // 如果只显示今天的记录，过滤掉非今天的
    if (todayOnly) {
      activities = activities.filter(a => dayjs(a.date).format('YYYY-MM-DD') === today);
    }

    return activities
      .map(a => ({
        id: a.id,
        date: a.date,
        timestamp: a.timestamp,
        value: a.newValue,
        change: a.delta,
        note: a.note
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.activities, category, todayOnly, today]);

  // 清单类型：从 checklistConfig.items 中提取已完成的清单项记录
  const checklistRecords = useMemo(() => {
    if (category !== 'CHECKLIST') return [];

    const items = goal.checklistConfig?.items || [];
    let completedItems = items
      .filter(item => item.status === 'COMPLETED' && item.completedAt)
      .map(item => ({
        id: item.id,
        title: item.title,
        completedAt: item.completedAt!,
        timestamp: dayjs(item.completedAt).valueOf(),
        cycle: item.cycle,
      }));

    // 如果只显示今天的记录，过滤掉非今天的
    if (todayOnly) {
      completedItems = completedItems.filter(item =>
        dayjs(item.completedAt).format('YYYY-MM-DD') === today
      );
    }

    // 按完成时间降序排序
    return completedItems.sort((a, b) => b.timestamp - a.timestamp);
  }, [goal.checklistConfig?.items, category, todayOnly, today]);
  
  const config = goal.checkInConfig;
  const numericConfig = goal.numericConfig;
  const unit = config?.unit || 'TIMES';
  const valueUnit = config?.valueUnit || '个';
  const isDecrease = numericConfig?.direction === 'DECREASE';
  
  // 格式化值显示
  const formatValue = (value: number) => {
    if (unit === 'TIMES') return `${value}次`;
    if (unit === 'DURATION') return `${value}分钟`;
    return `${value}${valueUnit}`;
  };
  
  // 空状态
  const isEmpty = category === 'CHECK_IN'
    ? checkInRecords.length === 0
    : category === 'CHECKLIST'
      ? checklistRecords.length === 0
      : numericRecords.length === 0;

  // 渲染今日奖励（仅在 todayOnly 模式下显示）
  const renderRewardProgress = () => {
    if (!todayOnly) return null;

    return (
      <div className={styles.rewardProgress}>
        <span className={styles.rewardLabel}>今日奖励</span>
        <div className={styles.rewardItems}>
          <div className={styles.rewardItem}>
            <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
            <span className={rewardProgress.jade.current >= rewardProgress.jade.max ? styles.rewardComplete : ''}>
              {rewardProgress.jade.current}
            </span>
            <span className={styles.rewardSeparator}>/</span>
            <span className={styles.rewardMax}>{rewardProgress.jade.max}</span>
          </div>
          <div className={styles.rewardItem}>
            <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
            <span className={rewardProgress.cultivation.current >= rewardProgress.cultivation.max ? styles.rewardComplete : ''}>
              {rewardProgress.cultivation.current}
            </span>
            <span className={styles.rewardSeparator}>/</span>
            <span className={styles.rewardMax}>{rewardProgress.cultivation.max}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isEmpty) {
    return (
      <div className={styles.container}>
        {renderRewardProgress()}
        <div className={styles.empty}>
          <img 
            src="https://img.alicdn.com/imgextra/i2/O1CN01MyXN5T1zlO9AGpYij_!!6000000006754-2-tps-1080-1014.png" 
            alt="暂无数据" 
            className={styles.emptyIcon}
          />
          <div className={styles.emptyHint}>
            {todayOnly ? '今日暂无记录' : '暂无变动记录'}
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染清单完成记录
  if (category === 'CHECKLIST') {
    return (
      <div className={styles.container}>
        {renderRewardProgress()}
        <div className={styles.listContainer}>
          {checklistRecords.map((record, index) => (
            <div key={record.id || index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.positive}`}>
                  <CheckSquare size={18} />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>
                    {record.title}
                  </div>
                  <div className={styles.cardSubtitle}>
                    {dayjs(record.completedAt).format('HH:mm')}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={`${styles.cardValue} ${styles.positive}`}>
                    ✓ 完成
                  </div>
                  <div className={styles.cardTag}>
                    第 {record.cycle} 周期
                  </div>
                </div>
              </div>
              {!todayOnly && (
                <div className={styles.cardFooter}>
                  完成于 {dayjs(record.completedAt).format('YYYY-MM-DD (ddd)')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 渲染打卡记录
  if (category === 'CHECK_IN') {
    return (
      <div className={styles.container}>
        {renderRewardProgress()}
        <div className={styles.listContainer}>
          {checkInRecords.map((record, index) => (
            <div key={record.id || index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {unit === 'DURATION' ? <Clock size={18} /> : 
                   unit === 'QUANTITY' ? <Hash size={18} /> : 
                   <Check size={18} />}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>
                    {unit === 'DURATION' ? '时长记录' : 
                     unit === 'QUANTITY' ? '数量记录' : 
                     '打卡记录'}
                  </div>
                  <div className={styles.cardSubtitle}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.cardValue}>
                    +{formatValue(record.value)}
                  </div>
                  <div className={styles.cardTag}>
                    {unit === 'DURATION' ? '时长' : 
                     unit === 'QUANTITY' ? '数量' : 
                     '次数'}
                  </div>
                </div>
              </div>
              {record.note && (
                <div className={styles.cardNote}>{record.note}</div>
              )}
              {!todayOnly && (
                <div className={styles.cardFooter}>
                  记录于 {dayjs(record.date).format('YYYY-MM-DD')} ({dayjs(record.date).format('ddd')})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // 渲染数值记录
  return (
    <div className={styles.container}>
      {renderRewardProgress()}
      <div className={styles.listContainer}>
        {numericRecords.map((record, index) => {
          const changeValue = record.change || 0;
          const isPositive = isDecrease ? changeValue < 0 : changeValue > 0;
          
          return (
            <div key={record.id || index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${isPositive ? styles.positive : styles.negative}`}>
                  {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>
                    {isPositive ? (isDecrease ? '减少' : '增加') : (isDecrease ? '增加' : '减少')}记录
                  </div>
                  <div className={styles.cardSubtitle}>
                    {dayjs(record.timestamp).format('HH:mm')}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={`${styles.cardValue} ${isPositive ? styles.positive : styles.negative}`}>
                    {record.value?.toLocaleString()}{numericConfig?.unit || ''}
                  </div>
                  <div className={styles.cardTag}>
                    {changeValue > 0 ? '+' : ''}{changeValue.toLocaleString()}
                  </div>
                </div>
              </div>
              {record.note && (
                <div className={styles.cardNote}>{record.note}</div>
              )}
              {!todayOnly && (
                <div className={styles.cardFooter}>
                  记录于 {dayjs(record.timestamp).format('YYYY-MM-DD (ddd)')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ActivityRecordPanel };



