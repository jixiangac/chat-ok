/**
 * 配置页面
 * 步骤 3：完善任务的详细信息
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Popup, Dialog, Toast } from 'antd-mobile';
import { X, Sparkles } from 'lucide-react';
import { OptionGrid, BottomNavigation } from '../../components';
import { DIRECTION_OPTIONS, CHECK_IN_TYPE_OPTIONS, CHECKLIST_TEMPLATES } from '../../constants';
import {
  calculateDailyPointsCap,
  calculateTaskCreationCostWithDiscount,
  calculateTotalCompletionReward,
} from '../../../../utils/spiritJadeCalculator';
import { useScene } from '../../../../contexts';
import { AgentChatPopup, type StructuredOutput, type ChecklistItemsData, type TaskConfigData, type UserBaseInfo } from '../../../../agent';
import { useCultivation } from '../../../../contexts';
import { getCurrentLevelInfo } from '../../../../utils/cultivation';
import type { CreateTaskModalState } from '../../modalTypes';
import type { NumericDirection, CheckInUnit, Category } from '../../../../types';
import styles from './styles.module.css';

// 根据任务类型获取 AI 提示语
const getAIPlaceholder = (taskType: string | null, taskTitle: string) => {
  const titleHint = taskTitle ? `「${taskTitle}」` : '这个目标';
  switch (taskType) {
    case 'NUMERIC':
      return `帮我配置${titleHint}的数值目标，比如单位、起始值和目标值...`;
    case 'CHECKLIST':
      return `帮我拆解${titleHint}需要完成的清单项目...`;
    case 'CHECK_IN':
      return `帮我设置${titleHint}的打卡规则，比如每天几次、每次多长时间...`;
    default:
      return '告诉我你想达成什么目标，我来帮你配置...';
  }
};

// 图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

export interface ConfigPageProps {
  state: CreateTaskModalState;
  setState: React.Dispatch<React.SetStateAction<CreateTaskModalState>>;
  onNext?: () => void;
  onSubmit?: () => void;
  onBack: () => void;
  taskCategory: 'MAINLINE' | 'SIDELINE';
}

const ConfigPage: React.FC<ConfigPageProps> = ({
  state,
  setState,
  onNext,
  onSubmit,
  onBack,
  taskCategory,
}) => {
  // 修仙数据（用于 AI 对话）
  const { data: cultivationData, spiritJadeData } = useCultivation();

  // 获取任务数据用于折扣计算
  const { normal } = useScene();
  const { hasMainlineTask, sidelineTasks, archivedTasks } = normal;
  const hasSideline = sidelineTasks.length > 0;

  // 构建 AI 对话所需的用户基础信息
  const userInfo: UserBaseInfo = useMemo(() => {
    const levelInfo = getCurrentLevelInfo(cultivationData);
    return {
      spiritJade: spiritJadeData.balance,
      cultivation: cultivationData.currentExp,
      cultivationLevel: levelInfo.displayName,
    };
  }, [cultivationData, spiritJadeData.balance]);

  const cycleInfo = {
    totalCycles: Math.floor(state.totalDays / state.cycleDays),
  };

  // 计算每日积分上限
  const isMainline = taskCategory === 'MAINLINE';
  const taskType = isMainline ? 'mainline' : 'sidelineA';
  const checkInUnitForCalc: CheckInUnit = state.selectedType === 'CHECK_IN'
    ? state.checkInUnit
    : 'TIMES';
  const dailyCapForCost = calculateDailyPointsCap(taskType, checkInUnitForCalc);

  // 计算100%完成可获得的总灵玉
  const totalCompletionReward = calculateTotalCompletionReward(dailyCapForCost, state.totalDays);

  // 动态计算灵玉消耗（含折扣）
  const discount = calculateTaskCreationCostWithDiscount(
    totalCompletionReward,
    isMainline,
    hasMainlineTask,
    hasSideline,
    archivedTasks
  );

  // 方向选项
  const directionOptions = DIRECTION_OPTIONS.map(option => ({
    label: option.label,
    selected: state.numericDirection === option.value,
    onClick: () => setState(s => ({ ...s, numericDirection: option.value as NumericDirection })),
  }));

  // 打卡类型选项
  const checkInOptions = CHECK_IN_TYPE_OPTIONS.map(option => ({
    label: option.label,
    description: option.desc,
    selected: state.checkInUnit === option.value,
    onClick: () => setState(s => ({ ...s, checkInUnit: option.value as CheckInUnit })),
  }));

  const renderNumericConfig = () => (
    <>
      {/* 变化方向 - 两列 */}
      <OptionGrid
        title="目标方向"
        options={directionOptions}
        columns={2}
      />

      {/* 单位和数值 - 紧凑输入 */}
      <div className={styles.inputGroup}>
        <div className={styles.sectionTitle}>数值设置</div>
        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label className={styles.inputLabel}>单位</label>
            <input
              type="text"
              placeholder="斤、元、本"
              value={state.numericUnit}
              onChange={(e) => setState(s => ({ ...s, numericUnit: e.target.value }))}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label className={styles.inputLabel}>起始值</label>
            <input
              type="number"
              placeholder="0"
              value={state.startValue}
              onChange={(e) => setState(s => ({ ...s, startValue: e.target.value }))}
              className={styles.input}
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.inputLabel}>目标值</label>
            <input
              type="number"
              placeholder="100"
              value={state.targetValue}
              onChange={(e) => setState(s => ({ ...s, targetValue: e.target.value }))}
              className={styles.input}
            />
          </div>
        </div>
      </div>
    </>
  );

  // 清单模版弹窗状态
  const [templatePopupVisible, setTemplatePopupVisible] = useState(false);
  // 当前预览的模版
  const [previewTemplate, setPreviewTemplate] = useState<typeof CHECKLIST_TEMPLATES[0] | null>(null);
  // AI 生成清单弹窗状态
  const [aiChatVisible, setAiChatVisible] = useState(false);
  // AI 配置助手弹窗状态（用于名称输入后的智能配置）
  const [aiConfigVisible, setAiConfigVisible] = useState(false);
  // AI 提示显示状态（延迟 500ms 后显示）
  const [showAiHint, setShowAiHint] = useState(false);

  // 判断配置是否已完成（根据不同类型）
  const isConfigComplete = (() => {
    if (!state.taskTitle.trim()) return false;

    switch (state.selectedType) {
      case 'NUMERIC':
        return !!(state.numericUnit && state.startValue && state.targetValue);
      case 'CHECKLIST':
        const filledItems = state.checklistItems.filter(item => item.trim()).length;
        return filledItems >= 5;
      case 'CHECK_IN':
        if (state.checkInUnit === 'TIMES') {
          return !!(state.dailyMaxTimes);
        } else if (state.checkInUnit === 'DURATION') {
          return !!(state.dailyTargetMinutes);
        } else if (state.checkInUnit === 'QUANTITY') {
          return !!(state.valueUnit && state.dailyTargetValue);
        }
        return true;
      default:
        return false;
    }
  })();

  // 输入名称后延迟显示 AI 提示（配置完成后隐藏）
  useEffect(() => {
    if (state.taskTitle.trim() && !isConfigComplete) {
      const timer = setTimeout(() => {
        setShowAiHint(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowAiHint(false);
    }
  }, [state.taskTitle, isConfigComplete]);

  // 处理 AI 生成的清单项
  const handleAIChecklistOutput = (output: StructuredOutput) => {
    if (output.type === 'CHECKLIST_ITEMS') {
      const data = output.data as ChecklistItemsData;
      const newItems = data.items.map(item => item.title);
      // 确保至少有空位可以继续填写
      while (newItems.length < 6) {
        newItems.push('');
      }
      setState(s => ({
        ...s,
        checklistItems: newItems,
        totalItems: String(data.items.length)
      }));
      setAiChatVisible(false);
    }
  };

  // 处理 AI 配置助手的输出（智能填充任务配置）
  const handleAIConfigOutput = (output: StructuredOutput) => {
    if (output.type === 'TASK_CONFIG') {
      const config = output.data as TaskConfigData;

      // 基础配置 - 根据 AI 推荐的类型覆盖当前选择
      const updates: Partial<CreateTaskModalState> = {
        totalDays: config.totalDays || state.totalDays,
        cycleDays: config.cycleDays || state.cycleDays,
      };

      // 如果 AI 推荐的类型与当前不同，更新任务类型
      if (config.category && config.category !== state.selectedType) {
        updates.selectedType = config.category as Category;
      }

      // 根据 AI 推荐的 category 来应用对应配置（而非当前选择的类型）
      const targetType = (config.category || state.selectedType) as Category | null;

      // 数值型配置
      if (config.numericConfig && targetType === 'NUMERIC') {
        updates.numericDirection = config.numericConfig.direction;
        updates.numericUnit = config.numericConfig.unit;
        updates.startValue = String(config.numericConfig.startValue);
        updates.targetValue = String(config.numericConfig.targetValue);
      }

      // 清单型配置
      if (config.checklistItems && targetType === 'CHECKLIST') {
        const newItems = [...config.checklistItems];
        while (newItems.length < 6) {
          newItems.push('');
        }
        updates.checklistItems = newItems;
        updates.totalItems = String(config.checklistItems.length);
      }

      // 打卡型配置
      if (config.checkInConfig && targetType === 'CHECK_IN') {
        updates.checkInUnit = config.checkInConfig.unit;
        if (config.checkInConfig.unit === 'TIMES' && config.checkInConfig.dailyMax) {
          updates.dailyMaxTimes = String(config.checkInConfig.dailyMax);
        }
        if (config.checkInConfig.unit === 'DURATION' && config.checkInConfig.dailyMax) {
          updates.dailyTargetMinutes = String(config.checkInConfig.dailyMax);
        }
        if (config.checkInConfig.unit === 'QUANTITY') {
          if (config.checkInConfig.valueUnit) {
            updates.valueUnit = config.checkInConfig.valueUnit;
          }
          if (config.checkInConfig.dailyMax) {
            updates.dailyTargetValue = String(config.checkInConfig.dailyMax);
          }
        }
      }

      setState(s => ({ ...s, ...updates }));
      setAiConfigVisible(false);
      // 直接跳转到周期配置页面
      onNext?.();
    }
    // 也处理清单类型的输出
    if (output.type === 'CHECKLIST_ITEMS') {
      handleAIChecklistOutput(output);
      setAiConfigVisible(false);
      // 直接跳转到周期配置页面
      onNext?.();
    }
  };

  // 计算需要显示的输入框数量（至少5个，每填一个多显示一个）
  const getVisibleInputCount = () => {
    const filledCount = state.checklistItems.filter(item => item.trim()).length;
    return Math.max(5, filledCount + 1);
  };

  // 更新清单项
  const updateChecklistItem = (index: number, value: string) => {
    const newItems = [...state.checklistItems];
    newItems[index] = value;

    // 如果填满了当前的输入框，扩展数组
    const visibleCount = getVisibleInputCount();
    while (newItems.length < visibleCount + 1) {
      newItems.push('');
    }

    setState(s => ({ ...s, checklistItems: newItems }));
  };

  // 点击模版卡片 - 进入预览
  const handleTemplateCardClick = (template: typeof CHECKLIST_TEMPLATES[0]) => {
    setPreviewTemplate(template);
  };

  // 确认选择模版
  const handleConfirmTemplate = () => {
    if (!previewTemplate) return;

    // 用模版的项目填充清单
    const newItems = [...previewTemplate.items];
    // 确保至少有5个空位可以继续填写
    while (newItems.length < 6) {
      newItems.push('');
    }

    setState(s => ({
      ...s,
      taskTitle: previewTemplate.title, // 直接使用模版标题
      checklistItems: newItems,
      totalItems: String(previewTemplate.items.length)
    }));
    setPreviewTemplate(null);
    setTemplatePopupVisible(false);
  };

  // 取消预览
  const handleCancelPreview = () => {
    setPreviewTemplate(null);
  };

  const renderChecklistConfig = () => {
    const visibleCount = getVisibleInputCount();
    const filledCount = state.checklistItems.filter(item => item.trim()).length;

    return (
      <div className={styles.inputGroup}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>清单项目</div>
          <div className={styles.sectionActions}>
            <button
              className={styles.aiButton}
              onClick={() => setAiChatVisible(true)}
            >
              <Sparkles size={14} />
              AI 生成
            </button>
            <button
              className={styles.templateButton}
              onClick={() => setTemplatePopupVisible(true)}
            >
              <Sparkles size={14} />
              选择模版
            </button>
          </div>
        </div>

        <div className={styles.checklistInputs}>
          {state.checklistItems.slice(0, visibleCount).map((item, index) => (
            <div key={index} className={styles.checklistInputRow}>
              <span className={styles.checklistIndex}>{index + 1}</span>
              <input
                type="text"
                placeholder={`输入第 ${index + 1} 项内容`}
                value={item}
                onChange={(e) => updateChecklistItem(index, e.target.value)}
                className={styles.checklistInput}
              />
            </div>
          ))}
        </div>

        <div className={styles.checklistHintRow}>
          <div className={styles.checklistHint}>
            已填写 {filledCount} 项{filledCount < 5 ? `，至少需要 5 项` : ''}
          </div>
          {filledCount > 0 && (
            <button
              className={styles.clearAllBtn}
              onClick={() => {
                Dialog.confirm({
                  title: '清空所有',
                  content: '确定要清空所有已填写的清单项吗？',
                  confirmText: '确定清空',
                  cancelText: '取消',
                  onConfirm: () => {
                    setState(s => ({
                      ...s,
                      checklistItems: Array(20).fill(''),
                    }));
                  },
                });
              }}
            >
              清空所有
            </button>
          )}
        </div>
      </div>
    );
  };

  // 清单模版选择弹窗
  const renderTemplatePopup = () => (
    <Popup
      visible={templatePopupVisible}
      onMaskClick={() => {
        setPreviewTemplate(null);
        setTemplatePopupVisible(false);
      }}
      position="bottom"
      bodyClassName={styles.templatePopup}
    >
      {/* 双层页面容器 */}
      <div className={styles.templateContainer}>
        {/* 第一层：模版列表 */}
        <div className={`${styles.templatePage} ${previewTemplate ? styles.templatePageShrink : ''}`}>
          <div className={styles.templateHeader}>
            <button
              className={styles.templateCloseBtn}
              onClick={() => setTemplatePopupVisible(false)}
            >
              <X size={20} />
            </button>
            <span className={styles.templateTitle}>选择模版</span>
            <div className={styles.templateSpacer} />
          </div>

          <div className={styles.templateGrid}>
            {CHECKLIST_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={styles.templateCard}
                onClick={() => handleTemplateCardClick(template)}
              >
                <div className={styles.templateCardTitle}>{template.title}</div>
                <div className={styles.templateCardItems}>
                  {template.items.slice(0, 5).map((item, index) => (
                    <div key={index} className={styles.templateCardItem}>{item}</div>
                  ))}
                  {template.items.length > 5 && (
                    <div className={styles.templateCardMore}>
                      ...共 {template.items.length} 项
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 第二层：模版详情 */}
        <div className={`${styles.templateDetailPage} ${previewTemplate ? styles.templateDetailPageShow : ''}`}>
          {previewTemplate && (
            <>
              <div className={styles.templateDetailHeader}>
                <button
                  className={styles.templateCloseBtn}
                  onClick={handleCancelPreview}
                >
                  <X size={20} />
                </button>
                <span className={styles.templateTitle}>{previewTemplate.title}</span>
                <div className={styles.templateSpacer} />
              </div>

              <div className={styles.templateDetailContent}>
                <div className={styles.templateDetailCount}>
                  共 {previewTemplate.items.length} 项
                </div>
                <div className={styles.templateDetailList}>
                  {previewTemplate.items.map((item, index) => (
                    <div key={index} className={styles.templateDetailItem}>
                      <span className={styles.templateDetailIndex}>{index + 1}</span>
                      <span className={styles.templateDetailText}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.templateDetailFooter}>
                <button
                  className={styles.templateCancelBtn}
                  onClick={handleCancelPreview}
                >
                  取消
                </button>
                <button
                  className={styles.templateConfirmBtn}
                  onClick={handleConfirmTemplate}
                >
                  使用此模版
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Popup>
  );

  // 类型说明
  const TYPE_DESCRIPTIONS: Record<string, { title: string; tips: string[] }> = {
    NUMERIC: {
      title: '数值型任务',
      tips: [
        '适合有明确数字目标的任务',
        '例如：减重5kg、存钱10000元、跑步100公里',
        '每日记录数值变化，系统自动计算进度',
      ],
    },
    CHECKLIST: {
      title: '清单型任务',
      tips: [
        '适合有多个子项需要逐一完成的任务',
        '例如：阅读书单、学习课程、旅行计划',
        '每完成一项打勾，清晰追踪进度',
      ],
    },
    CHECK_IN: {
      title: '打卡型任务',
      tips: [
        '适合需要每日坚持的习惯养成',
        '例如：每天运动、学习英语、早起打卡',
        '支持次数、时长、数值三种记录方式',
      ],
    },
  };

  const renderTypeTips = () => {
    const typeInfo = TYPE_DESCRIPTIONS[state.selectedType || 'CHECK_IN'];
    return (
      <div className={styles.typeTips}>
        <div className={styles.typeTipsTitle}>{typeInfo.title}</div>
        <ul className={styles.typeTipsList}>
          {typeInfo.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCheckInConfig = () => (
    <>
      {/* 打卡类型 - 三列 */}
      <OptionGrid
        title="打卡类型"
        options={checkInOptions}
        columns={3}
      />

      {/* 详细设置 */}
      {state.checkInUnit === 'TIMES' && (
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>次数设置</div>
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>每日最大</label>
              <input
                type="number"
                placeholder="1"
                value={state.dailyMaxTimes}
                onChange={(e) => setState(s => ({ ...s, dailyMaxTimes: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>周期目标</label>
              <input
                type="number"
                placeholder={`${state.cycleDays * parseInt(state.dailyMaxTimes || '1')}`}
                value={state.cycleTargetTimes}
                onChange={(e) => setState(s => ({ ...s, cycleTargetTimes: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {state.checkInUnit === 'DURATION' && (
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>时长设置（分钟）</div>
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>每日目标</label>
              <input
                type="number"
                placeholder="15"
                value={state.dailyTargetMinutes}
                onChange={(e) => setState(s => ({ ...s, dailyTargetMinutes: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>周期目标</label>
              <input
                type="number"
                placeholder={`${state.cycleDays * parseInt(state.dailyTargetMinutes || '15')}`}
                value={state.cycleTargetMinutes}
                onChange={(e) => setState(s => ({ ...s, cycleTargetMinutes: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {state.checkInUnit === 'QUANTITY' && (
        <div className={styles.inputGroup}>
          <div className={styles.sectionTitle}>数值设置</div>
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>单位</label>
              <input
                type="text"
                placeholder="个、篇、km"
                value={state.valueUnit}
                onChange={(e) => setState(s => ({ ...s, valueUnit: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>每日目标</label>
              <input
                type="number"
                placeholder="0"
                value={state.dailyTargetValue}
                onChange={(e) => setState(s => ({ ...s, dailyTargetValue: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.inputField}>
              <label className={styles.inputLabel}>周期目标</label>
              <input
                type="number"
                placeholder={`${state.cycleDays * parseFloat(state.dailyTargetValue || '0')}`}
                value={state.cycleTargetValue}
                onChange={(e) => setState(s => ({ ...s, cycleTargetValue: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderConfig = () => {
    let configContent = null;
    switch (state.selectedType) {
      case 'NUMERIC':
        configContent = renderNumericConfig();
        break;
      case 'CHECKLIST':
        configContent = renderChecklistConfig();
        break;
      case 'CHECK_IN':
        configContent = renderCheckInConfig();
        break;
      default:
        break;
    }
    return (
      <>
        {configContent}
        {renderTypeTips()}
      </>
    );
  };

  // 计算预计收益（复用前面的 dailyCapForCost）
  const dailyCap = dailyCapForCost;

  // 预览信息 - 和 CyclePreview 风格一致
  const renderPreview = () => {
    const taskTypeName = state.selectedType === 'NUMERIC' ? '数值型'
      : state.selectedType === 'CHECKLIST' ? '清单型' : '打卡型';

    // 预估总收益（假设100%完成）
    const totalSpiritJade = dailyCap.spiritJade * state.totalDays;
    const totalCultivation = dailyCap.cultivation * state.totalDays;

    return (
      <div className={styles.preview}>
        <div className={styles.previewTitle}>
          {state.taskTitle || '未命名任务'}
        </div>
        <div className={styles.previewDetails}>
          <div>任务类型：{taskTypeName}</div>
          <div>总时长：{state.totalDays} 天</div>
          <div>周期：{state.cycleDays} 天 × {cycleInfo.totalCycles} 周期</div>
        </div>

        {/* 预计收益 - 卡片式布局 */}
        <div className={styles.rewardSection}>
          <div className={styles.rewardTitle}>预计收益</div>

          {/* 每日收益卡片 */}
          <div className={styles.rewardCards}>
            <div className={styles.rewardCard}>
              <div className={styles.cardHeader}>每日最高</div>
              <div className={styles.cardContent}>
                <div className={styles.rewardRow}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
                  <span className={styles.rewardNumber}>{dailyCap.spiritJade}</span>
                  <span className={styles.rewardName}>灵玉</span>
                </div>
                <div className={styles.rewardRow}>
                  <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
                  <span className={styles.rewardNumber}>{dailyCap.cultivation}</span>
                  <span className={styles.rewardName}>修为</span>
                </div>
              </div>
            </div>

            <div className={styles.rewardCard}>
              <div className={styles.cardHeader}>100%完成任务至少获得</div>
              <div className={styles.cardContent}>
                <div className={styles.rewardRow}>
                  <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.rewardIcon} />
                  <span className={styles.rewardNumber}>{totalSpiritJade}</span>
                  <span className={styles.rewardName}>灵玉</span>
                </div>
                <div className={styles.rewardRow}>
                  <img src={CULTIVATION_ICON} alt="修为" className={styles.rewardIcon} />
                  <span className={styles.rewardNumber}>{totalCultivation}</span>
                  <span className={styles.rewardName}>修为</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rewardHint}>
            预估收益按100%完成计算，实际按完成比例发放
          </div>
        </div>
      </div>
    );
  };

  // 处理下一步按钮点击 - 包含校验逻辑
  const handleNext = useCallback(() => {
    // 数值型任务校验：增减方向与起始/目标值关系
    if (state.selectedType === 'NUMERIC') {
      const start = parseFloat(state.startValue);
      const target = parseFloat(state.targetValue);

      if (!isNaN(start) && !isNaN(target)) {
        // 注意：方向值是大写的 INCREASE / DECREASE
        if (state.numericDirection === 'INCREASE' && target <= start) {
          Toast.show({
            icon: 'fail',
            content: '增加方向时，目标值需要大于起始值',
          });
          return;
        }
        if (state.numericDirection === 'DECREASE' && target >= start) {
          Toast.show({
            icon: 'fail',
            content: '减少方向时，目标值需要小于起始值',
          });
          return;
        }
      }
    }

    // 校验通过，继续下一步
    onNext?.();
  }, [state.selectedType, state.numericDirection, state.startValue, state.targetValue, onNext]);

  // 灵石消耗提示
  const costHint = (
    <span className={styles.costHint}>
      <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.costIcon} />
      创建需消耗{' '}
      {discount.hasDiscount ? (
        <>
          <span className={styles.originalCost}>{discount.originalCost}</span>
          <span className={styles.discountedCost}>{discount.discountedCost}</span>
        </>
      ) : (
        <span>{discount.discountedCost}</span>
      )}
      {' '}灵玉
    </span>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 任务名称 - 带 AI 辅助按钮 */}
        <div className={styles.nameSection}>
          <div className={styles.nameInputWrapper}>
            <input
              type="text"
              placeholder="给任务起个名字"
              value={state.taskTitle}
              onChange={(e) => setState(s => ({ ...s, taskTitle: e.target.value }))}
              className={styles.nameInput}
            />
            {/* 输入名称后延迟显示 AI 提示，配置完成后隐藏，无名称时隐藏按钮 */}
            {!isConfigComplete && state.taskTitle.trim() && (
              <>
                <span className={`${styles.aiHint} ${showAiHint ? styles.aiHintVisible : ''}`}>
                  AI 快速生成 →
                </span>
                <button
                  className={styles.nameAiButton}
                  onClick={() => setAiConfigVisible(true)}
                  title="AI 智能配置"
                >
                  <Sparkles size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {renderConfig()}
      </div>

      <BottomNavigation
        onBack={onBack}
        onNext={onNext ? handleNext : onSubmit!}
        nextText="下一步"
        nextDisabled={!isConfigComplete}
      />

      {/* 清单模版弹窗 */}
      {renderTemplatePopup()}

      {/* AI 生成清单弹窗 */}
      <AgentChatPopup
        visible={aiChatVisible}
        onClose={() => setAiChatVisible(false)}
        role="checklistHelper"
        placeholder="告诉我你想完成什么目标，我来帮你拆解成清单..."
        onStructuredOutput={handleAIChecklistOutput}
        userInfo={userInfo}
      />

      {/* AI 配置助手弹窗 - 智能填充任务配置 */}
      <AgentChatPopup
        visible={aiConfigVisible}
        onClose={() => setAiConfigVisible(false)}
        role={state.selectedType === 'CHECKLIST' ? 'checklistHelper' : 'taskConfigHelper'}
        placeholder={"和我说说吧 (๑•̀ㅂ•́)و✧"}
        onStructuredOutput={handleAIConfigOutput}
        initialMessage={state.taskTitle ? `我要创建一个${
          state.selectedType === 'NUMERIC' ? '数值型' :
          state.selectedType === 'CHECKLIST' ? '清单型' : '打卡型'
        }任务，名称是「${state.taskTitle}」，请帮我配置合理的参数。` : undefined}
        userInfo={userInfo}
      />
    </div>
  );
};

export default ConfigPage;
