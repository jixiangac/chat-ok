/**
 * 配置页面
 * 步骤 3：完善任务的详细信息
 */

import React, { useState } from 'react';
import { Popup } from 'antd-mobile';
import { X, Sparkles } from 'lucide-react';
import { OptionGrid, BottomNavigation } from '../../components';
import { DIRECTION_OPTIONS, CHECK_IN_TYPE_OPTIONS, CHECKLIST_TEMPLATES } from '../../constants';
import { SPIRIT_JADE_COST } from '../../../../constants/spiritJade';
import { calculateDailyPointsCap } from '../../../../utils/spiritJadeCalculator';
import type { CreateTaskModalState } from '../../modalTypes';
import type { NumericDirection, CheckInUnit } from '../../../../types';
import styles from './styles.module.css';

// 图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

export interface ConfigPageProps {
  state: CreateTaskModalState;
  setState: React.Dispatch<React.SetStateAction<CreateTaskModalState>>;
  onSubmit: () => void;
  onBack: () => void;
  taskCategory: 'MAINLINE' | 'SIDELINE';
}

const ConfigPage: React.FC<ConfigPageProps> = ({
  state,
  setState,
  onSubmit,
  onBack,
  taskCategory,
}) => {
  const cycleInfo = {
    totalCycles: Math.floor(state.totalDays / state.cycleDays),
  };

  // 灵石消耗
  const spiritJadeCost = taskCategory === 'MAINLINE'
    ? SPIRIT_JADE_COST.CREATE_MAINLINE_TASK
    : SPIRIT_JADE_COST.CREATE_SIDELINE_TASK;

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
          <button
            className={styles.templateButton}
            onClick={() => setTemplatePopupVisible(true)}
          >
            <Sparkles size={14} />
            选择模版
          </button>
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

        <div className={styles.checklistHint}>
          已填写 {filledCount} 项{filledCount < 5 ? `，至少需要 5 项` : ''}
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
    switch (state.selectedType) {
      case 'NUMERIC':
        return renderNumericConfig();
      case 'CHECKLIST':
        return renderChecklistConfig();
      case 'CHECK_IN':
        return renderCheckInConfig();
      default:
        return null;
    }
  };

  // 计算预计收益
  const taskType = taskCategory === 'MAINLINE' ? 'mainline' : 'sidelineA';
  // 对于打卡型任务使用选择的打卡类型，其他类型默认使用 TIMES
  const checkInUnit: CheckInUnit = state.selectedType === 'CHECK_IN'
    ? state.checkInUnit
    : 'TIMES';
  const dailyCap = calculateDailyPointsCap(taskType, checkInUnit);

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

  const isValid = state.taskTitle.trim().length > 0;

  // 灵石消耗提示
  const costHint = (
    <span className={styles.costHint}>
      <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.costIcon} />
      创建需消耗 {spiritJadeCost} 灵玉
    </span>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 任务名称 - 突出显示 */}
        <div className={styles.nameSection}>
          <input
            type="text"
            placeholder="给任务起个名字"
            value={state.taskTitle}
            onChange={(e) => setState(s => ({ ...s, taskTitle: e.target.value }))}
            className={styles.nameInput}
            autoFocus
          />
        </div>

        {renderConfig()}

        {/* 预览 */}
        {renderPreview()}
      </div>

      <BottomNavigation
        onBack={onBack}
        onNext={onSubmit}
        nextText="创建任务"
        nextDisabled={!isValid}
        hint={costHint}
      />

      {/* 清单模版弹窗 */}
      {renderTemplatePopup()}
    </div>
  );
};

export default ConfigPage;
