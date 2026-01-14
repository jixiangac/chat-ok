/**
 * 设置主页面组件
 * 显示所有设置分组和列表项
 * 支持列表项翻书动画
 */

import React from 'react';
import { Target, Palette, Tag, Sun, Umbrella, Heart, Flag, Database, CheckCircle2, Circle } from 'lucide-react';
import { SettingsSection, SettingsListItem } from '../../components';
import { canOpenModalForEdit, canOpenModalForView, getTodayMustCompleteTaskIds } from '@/pages/dc/utils/todayMustCompleteStorage';
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
  const canEdit = canOpenModalForEdit();
  const canView = canOpenModalForView();
  const taskIds = getTodayMustCompleteTaskIds();
  const taskCount = taskIds.length;

  // 处理今日毕任务点击
  const handleTodayMustCompleteClick = () => {
    if (canEdit && onOpenTodayMustComplete) {
      onOpenTodayMustComplete(false);
    } else if (canView && onOpenTodayMustComplete) {
      onOpenTodayMustComplete(true);
    }
  };

  // 获取今日毕任务的描述
  const getTodayMustCompleteDescription = () => {
    if (canEdit) {
      return '设置今天要重点完成的任务';
    }
    if (canView) {
      return '查看今日已设置的任务';
    }
    return '今日已设置完成';
  };

  // 获取今日毕任务的状态标签（使用图标）
  const getTodayMustCompleteStatusTag = () => {
    if (canView && taskCount > 0) {
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
        {(canEdit || canView) && (
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
        )}
        
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
          icon={<Database size={18} />}
          title="数据管理"
          description="导入导出应用数据"
          animated
          animationIndex={animationIndex++}
          onClick={() => onNavigate('data', '数据管理')}
        />
      </SettingsSection>
    </div>
  );
};

export default SettingsMainPage;
