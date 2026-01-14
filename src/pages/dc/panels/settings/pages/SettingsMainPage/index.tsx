/**
 * 设置主页面组件
 * 显示所有设置分组和列表项
 */

import React from 'react';
import { Target, Palette, Tag, Sun, Umbrella, Heart, Flag, Database } from 'lucide-react';
import { SettingsSection, SettingsListItem } from '../../components';
import { canOpenModalForEdit, canOpenModalForView } from '@/pages/dc/utils/todayMustCompleteStorage';
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
            onClick={handleTodayMustCompleteClick}
          />
        )}
        
        <SettingsListItem
          icon={<Palette size={18} />}
          title="主题设置"
          description="自定义应用主题配色"
          onClick={() => onNavigate('theme', '主题设置')}
        />
        
        <SettingsListItem
          icon={<Tag size={18} />}
          title="标签管理"
          description="管理任务标签分类"
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
        />
        
        <SettingsListItem
          icon={<Umbrella size={18} />}
          title="度假模式"
          description="旅行计划管理"
          disabled
          showArrow={false}
        />
        
        <SettingsListItem
          icon={<Heart size={18} />}
          title="纪念日模式"
          description="重要日期记录"
          disabled
          showArrow={false}
        />
        
        <SettingsListItem
          icon={<Flag size={18} />}
          title="OKR模式"
          description="目标与关键结果"
          disabled
          showArrow={false}
        />
      </SettingsSection>

      {/* 开发者 */}
      <SettingsSection title="开发者">
        <SettingsListItem
          icon={<Database size={18} />}
          title="数据管理"
          description="导入导出应用数据"
          onClick={() => onNavigate('data', '数据管理')}
        />
      </SettingsSection>
    </div>
  );
};

export default SettingsMainPage;
