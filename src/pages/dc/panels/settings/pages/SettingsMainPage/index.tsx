/**
 * 设置主页面组件
 * 显示所有设置分组和列表项
 * 支持列表项翻书动画
 */

import React, { useState, useCallback } from 'react';
import { Target, Palette, Tag, Sun, Umbrella, Heart, Flag, Database, CheckCircle2, Circle, Calendar, Archive, Bug, Power } from 'lucide-react';
import { SettingsSection, SettingsListItem } from '../../components';
import { useUser } from '@/pages/dc/contexts';
import { getCurrentDate, getDeveloperMode, setDeveloperMode } from '@/pages/dc/utils';
import styles from './styles.module.css';

export interface SettingsMainPageProps {
  /** 导航到子页面 */
  onNavigate: (pageId: string, title: string) => void;
  /** 打开今日毕任务 */
  onOpenTodayMustComplete?: (readOnly?: boolean) => void;
}

const SettingsMainPage: React.FC<SettingsMainPageProps> = ({
  onNavigate,
  onOpenTodayMustComplete,
}) => {
  const { todayMustComplete } = useUser();

  // 开发者模式状态
  const [isDeveloperMode, setIsDeveloperMode] = useState(() => getDeveloperMode());

  // 处理关闭开发者模式
  const handleCloseDeveloperMode = useCallback(() => {
    setDeveloperMode(false);
    setIsDeveloperMode(false);
  }, []);
  
  // 判断是否是今天的数据
  const today = getCurrentDate();
  const isToday = todayMustComplete.date === today;
  
  const taskIds = todayMustComplete.taskIds;
  const taskCount = taskIds.length;
  
  // 今天是否已设置过（有任务就算设置过）
  const hasSetToday = isToday && taskCount > 0;
  // 是否可以编辑（今天没设置过才能编辑）
  const canEdit = !hasSetToday;

  // 处理今日毕任务点击 - 始终可以打开
  const handleTodayMustCompleteClick = () => {
    if (onOpenTodayMustComplete) {
      // 今天没设置过可编辑，设置过只读查看
      onOpenTodayMustComplete(!canEdit);
    }
  };

  // 获取今日毕任务的描述
  const getTodayMustCompleteDescription = () => {
    if (canEdit) {
      return '设置今天要重点完成的任务';
    }
    if (taskCount > 0) {
      return '查看今日已设置的任务';
    }
    return '今日已设置完成';
  };

  // 获取今日毕任务的状态标签（使用图标）
  const getTodayMustCompleteStatusTag = () => {
    if (taskCount > 0) {
      // 已设置，显示图标和个数
      return (
        <span className={styles.statusTagDone}>
          <CheckCircle2 size={14} />
          <span>{taskCount}</span>
        </span>
      );
    }
    if (canEdit) {
      // 未设置，显示空心圆
      return (
        <span className={styles.statusTagPending}>
          <Circle size={14} />
        </span>
      );
    }
    return null;
  };

  // 动画索引计数器
  let animationIndex = 0;

  return (
    <div className={styles.container}>
      {/* 基础设置 */}
      <SettingsSection title="基础设置">

        {/* 今日毕任务 - 特殊高亮样式 */}
        <SettingsListItem
          icon={<Target size={18} />}
          title="今日毕任务"
          description={getTodayMustCompleteDescription()}
          highlight
          animated
          animationIndex={animationIndex++}
          rightContent={getTodayMustCompleteStatusTag()}
          onClick={handleTodayMustCompleteClick}
        />

        <SettingsListItem
          icon={<Palette size={18} />}
          title="主题设置"
          description="自定义应用主题配色"
          animated
          animationIndex={animationIndex++}
          onClick={() => onNavigate('theme', '主题设置')}
        />

        <SettingsListItem
          icon={<Tag size={18} />}
          title="标签管理"
          description="管理任务标签分类"
          animated
          animationIndex={animationIndex++}
          onClick={() => onNavigate('tags', '标签管理')}
        />
      </SettingsSection>

      {/* 场景管理 */}
      <SettingsSection title="场景管理">
        <SettingsListItem
          icon={<Sun size={18} />}
          title="常规模式"
          description="日常任务管理"
          disabled
          showArrow={false}
          animated
          animationIndex={animationIndex++}
        />

        <SettingsListItem
          icon={<Umbrella size={18} />}
          title="度假模式"
          description="旅行计划管理"
          disabled
          showArrow={false}
          animated
          animationIndex={animationIndex++}
        />

        <SettingsListItem
          icon={<Heart size={18} />}
          title="纪念日模式"
          description="重要日期记录"
          disabled
          showArrow={false}
          animated
          animationIndex={animationIndex++}
        />

        <SettingsListItem
          icon={<Flag size={18} />}
          title="OKR模式"
          description="目标与关键结果"
          disabled
          showArrow={false}
          animated
          animationIndex={animationIndex++}
        />
      </SettingsSection>

      {/* 开发者 */}
      <SettingsSection title="开发者">
        <SettingsListItem
          icon={<Archive size={18} />}
          title="归档历史"
          description="查看已归档的任务"
          animated
          animationIndex={animationIndex++}
          onClick={() => onNavigate('archive', '归档历史')}
        />

        <SettingsListItem
          icon={<Database size={18} />}
          title="数据管理"
          description="导入导出应用数据"
          animated
          animationIndex={animationIndex++}
          onClick={() => onNavigate('data', '数据管理')}
        />

        {/* 日期测试 - 仅开发者模式可见 */}
        {isDeveloperMode && (
          <SettingsListItem
            icon={<Calendar size={18} />}
            title="日期测试"
            description="测试日期变更逻辑"
            animated
            animationIndex={animationIndex++}
            onClick={() => onNavigate('dateTest', '日期测试')}
          />
        )}

        {/* 调试 - 仅开发者模式可见 */}
        {isDeveloperMode && (
          <SettingsListItem
            icon={<Bug size={18} />}
            title="调试"
            description="灵玉和修为调试"
            animated
            animationIndex={animationIndex++}
            onClick={() => onNavigate('debug', '调试')}
          />
        )}

        {/* 关闭调试 - 仅开发者模式可见 */}
        {isDeveloperMode && (
          <SettingsListItem
            icon={<Power size={18} />}
            title="关闭调试"
            description="关闭开发者模式"
            animated
            animationIndex={animationIndex++}
            onClick={handleCloseDeveloperMode}
          />
        )}
      </SettingsSection>
    </div>
  );
};

export default SettingsMainPage;
