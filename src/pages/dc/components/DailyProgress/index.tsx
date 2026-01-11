import { useState, useMemo } from 'react';
import { ChevronRight, Shield, RefreshCw, Calendar } from 'lucide-react';
import { useTaskContext } from '../../contexts';
import { MainlineTaskCard } from '../card';
import { Task } from '../../types';
import dayjs from 'dayjs';
import './index.css';

interface DailyProgressProps {
  onTaskClick?: (taskId: string) => void;
}

// 老黄历运势数据
const FORTUNE_LIST = [
  { fortune: '大吉', advice: '诸事皆宜，把握机会', color: '#c41d7f' },
  { fortune: '中吉', advice: '稳中求进，循序渐进', color: '#d48806' },
  { fortune: '小吉', advice: '谨慎行事，稳扎稳打', color: '#389e0d' },
  { fortune: '吉', advice: '平稳顺遂，按部就班', color: '#1890ff' },
  { fortune: '末吉', advice: '韬光养晦，静待时机', color: '#722ed1' },
];

// 根据日期生成当日运势（伪随机，同一天结果相同）
const getTodayFortune = () => {
  const today = dayjs().format('YYYYMMDD');
  const seed = parseInt(today, 10);
  const index = seed % FORTUNE_LIST.length;
  return FORTUNE_LIST[index];
};

export default function DailyProgress({ onTaskClick }: DailyProgressProps) {
  const { tasks } = useTaskContext();
  const [showFortune, setShowFortune] = useState(false);
  const [quickTaskStartIndex, setQuickTaskStartIndex] = useState(0);
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);

  // 小精灵图片配置
  const SPRITE_IMAGES = {
    morning: [
      'https://img.alicdn.com/imgextra/i1/O1CN01D7qMyZ1Yzanp7cvn1_!!6000000003130-2-tps-1080-938.png',
      'https://img.alicdn.com/imgextra/i3/O1CN01L8CqQY1rlNCp99Pt4_!!6000000005671-2-tps-1406-1260.png'
    ],
    afternoon: [
      'https://img.alicdn.com/imgextra/i3/O1CN01J34xYC1WIQEsC45B7_!!6000000002765-2-tps-1264-848.png'
    ],
    evening: [
      'https://img.alicdn.com/imgextra/i4/O1CN01AM78k01vhUJCsV32R_!!6000000006204-2-tps-2528-1696.png',
      'https://img.alicdn.com/imgextra/i2/O1CN01kfj2r71l0Io0gAsQ6_!!6000000004756-2-tps-1264-848.png'
    ]
  };

  // 获取当前时间段的小精灵图片
  const getCurrentSpriteImage = () => {
    const hour = new Date().getHours();
    let timeSlot: 'morning' | 'afternoon' | 'evening';
    
    if (hour >= 6 && hour < 12) {
      timeSlot = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeSlot = 'afternoon';
    } else {
      timeSlot = 'evening';
    }
    
    const images = SPRITE_IMAGES[timeSlot];
    return images[currentSpriteIndex % images.length];
  };

  // 随机切换小精灵图片
  const randomizeSpriteImage = () => {
    const hour = new Date().getHours();
    let timeSlot: 'morning' | 'afternoon' | 'evening';
    
    if (hour >= 6 && hour < 12) {
      timeSlot = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeSlot = 'afternoon';
    } else {
      timeSlot = 'evening';
    }
    
    const images = SPRITE_IMAGES[timeSlot];
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentSpriteIndex(randomIndex);
  };

  // 获取活跃任务
  const activeTasks = useMemo(() => 
    tasks.filter(t => (t as any).status !== 'archived'),
    [tasks]
  );

  // 获取支线任务
  const sidelineTasks = useMemo(() => 
    activeTasks.filter(t => t.type === 'sidelineA' || t.type === 'sidelineB'),
    [activeTasks]
  );

  // 获取主线任务
  const mainlineTask = useMemo(() => 
    activeTasks.find(t => t.type === 'mainline'),
    [activeTasks]
  );

  // 计算今日完成率
  const todayProgress = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    
    if (activeTasks.length === 0) return 0;

    let completedCount = 0;
    activeTasks.forEach(task => {
      const mainlineTaskData = task.mainlineTask;
      // 检查打卡记录
      if (mainlineTaskData?.checkInConfig?.records) {
        const todayRecord = mainlineTaskData.checkInConfig.records.find(r => r.date === today);
        if (todayRecord?.checked) {
          completedCount++;
          return;
        }
      }
      // 检查数值型任务今日是否有更新
      if (mainlineTaskData?.numericConfig) {
        const history = mainlineTaskData.history || [];
        const todayHistory = history.find(h => dayjs(h.date).format('YYYY-MM-DD') === today);
        if (todayHistory) {
          completedCount++;
          return;
        }
      }
      // 检查旧版checkIns
      if (task.checkIns?.some(c => dayjs(c.date).format('YYYY-MM-DD') === today)) {
        completedCount++;
      }
    });

    return Math.round((completedCount / activeTasks.length) * 100);
  }, [activeTasks]);

  // 获取当前显示的6个支线任务
  const displayedSidelineTasks = useMemo(() => {
    if (sidelineTasks.length <= 6) return sidelineTasks;
    const result: Task[] = [];
    for (let i = 0; i < 6; i++) {
      const index = (quickTaskStartIndex + i) % sidelineTasks.length;
      result.push(sidelineTasks[index]);
    }
    return result;
  }, [sidelineTasks, quickTaskStartIndex]);

  // 换一换
  const handleRefresh = () => {
    if (sidelineTasks.length > 6) {
      setQuickTaskStartIndex(prev => (prev + 6) % sidelineTasks.length);
    }
  };

  // 检查任务今日是否已完成
  const isTodayCompleted = (task: Task) => {
    const today = dayjs().format('YYYY-MM-DD');
    const mainlineTaskData = task.mainlineTask;
    if (mainlineTaskData?.checkInConfig?.records) {
      const todayRecord = mainlineTaskData.checkInConfig.records.find(r => r.date === today);
      if (todayRecord?.checked) return true;
    }
    if (mainlineTaskData?.numericConfig) {
      const history = mainlineTaskData.history || [];
      if (history.some(h => dayjs(h.date).format('YYYY-MM-DD') === today)) return true;
    }
    if (task.checkIns?.some(c => dayjs(c.date).format('YYYY-MM-DD') === today)) {
      return true;
    }
    return false;
  };

  const todayFortune = getTodayFortune();

  return (
    <div className="daily-progress">
      {/* 小精灵区域 */}
      <div className="daily-progress-sprite">
        <img 
          src={getCurrentSpriteImage()}
          alt="小精灵"
          className="daily-progress-sprite-img"
        />
        {/* 老黄历挂件 */}
        <button 
          className="daily-progress-almanac-btn" 
          onClick={() => {
            setShowFortune(!showFortune);
            randomizeSpriteImage();
          }}
          title="今日运势"
        >
          <Calendar size={20} />
        </button>
        {/* 运势弹窗 */}
        {showFortune && (
          <div className="daily-progress-fortune-popup">
            <div 
              className="daily-progress-fortune-title"
              style={{ color: todayFortune.color }}
            >
              {todayFortune.fortune}
            </div>
            <div className="daily-progress-fortune-advice">
              {todayFortune.advice}
            </div>
          </div>
        )}
      </div>

      {/* 完成率 */}
      <div className="daily-progress-rate">
        <span className="daily-progress-rate-number">{todayProgress}%</span>
        <span className="daily-progress-rate-label">今日完成率</span>
      </div>

      {/* 快捷任务按钮 - 来自支线任务 */}
      <div className="daily-progress-quick-tasks">
        {displayedSidelineTasks.map(task => (
          <button
            key={task.id}
            className={`daily-progress-quick-btn ${isTodayCompleted(task) ? 'completed' : ''}`}
            onClick={() => onTaskClick?.(task.id)}
          >
            + {task.title}
          </button>
        ))}
        {sidelineTasks.length === 0 && (
          <div className="daily-progress-empty-hint">暂无支线任务</div>
        )}
      </div>

      {/* 提示文字或换一换 */}
      {sidelineTasks.length > 6 ? (
        <button className="daily-progress-refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={14} />
          换一换
        </button>
      ) : (
        <span className="daily-progress-hint">点击快速记录今日任务完成情况</span>
      )}

      {/* 任务详情查看 */}
      <button className="daily-progress-detail-link" onClick={() => onTaskClick?.('')}>
        任务详情查看
      </button>

      {/* 主线任务卡片 */}
      {mainlineTask ? (
        <div className="daily-progress-mainline-card">
          <MainlineTaskCard 
            task={mainlineTask} 
            onClick={() => onTaskClick?.(mainlineTask.id)}
          />
        </div>
      ) : (
        <div className="daily-progress-mainline" onClick={() => onTaskClick?.('')}>
          <div className="daily-progress-mainline-left">
            <Shield size={20} className="daily-progress-mainline-icon" />
            <span className="daily-progress-mainline-title">主线任务</span>
          </div>
          <div className="daily-progress-mainline-right">
            <span className="daily-progress-mainline-count">0</span>
            <ChevronRight size={20} className="daily-progress-mainline-arrow" />
          </div>
        </div>
      )}
    </div>
  );
}
