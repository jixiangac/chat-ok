/**
 * 调试页面组件
 * 用于调试灵玉和修为数值
 */

import React, { useState, useCallback } from 'react';
import { Gem, Zap, AlertCircle, Plus, Minus, RotateCcw } from 'lucide-react';
import { Toast, Input } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import { useCultivation } from '@/pages/dc/contexts';
import styles from './styles.module.css';

export interface DebugPageProps {
  /** 返回上一页 */
  onBack: () => void;
}

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
// 修为图标
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

const DebugPage: React.FC<DebugPageProps> = ({ onBack }) => {
  const {
    spiritJadeData,
    levelInfo,
    data,
    debugSetSpiritJade,
    debugSetExp,
  } = useCultivation();

  // 灵玉输入状态
  const [jadeInput, setJadeInput] = useState(String(spiritJadeData.balance));
  // 修为输入状态
  const [expInput, setExpInput] = useState(String(data.currentExp));

  // 处理灵玉快捷增减
  const handleJadeQuickChange = useCallback((delta: number) => {
    const newValue = Math.max(0, spiritJadeData.balance + delta);
    debugSetSpiritJade(newValue);
    setJadeInput(String(newValue));
    Toast.show({
      content: `灵玉已设置为 ${newValue}`,
      position: 'bottom',
    });
  }, [spiritJadeData.balance, debugSetSpiritJade]);

  // 处理灵玉设置
  const handleSetJade = useCallback(() => {
    const value = parseInt(jadeInput, 10);
    if (isNaN(value) || value < 0) {
      Toast.show({
        icon: 'fail',
        content: '请输入有效的正整数',
      });
      return;
    }
    debugSetSpiritJade(value);
    Toast.show({
      content: `灵玉已设置为 ${value}`,
      position: 'bottom',
    });
  }, [jadeInput, debugSetSpiritJade]);

  // 处理灵玉归零
  const handleResetJade = useCallback(() => {
    debugSetSpiritJade(0);
    setJadeInput('0');
    Toast.show({
      content: '灵玉已归零',
      position: 'bottom',
    });
  }, [debugSetSpiritJade]);

  // 处理修为设置
  const handleSetExp = useCallback(() => {
    const value = parseInt(expInput, 10);
    if (isNaN(value) || value < 0) {
      Toast.show({
        icon: 'fail',
        content: '请输入有效的正整数',
      });
      return;
    }
    debugSetExp(value);
    Toast.show({
      content: `修为已设置为 ${value}`,
      position: 'bottom',
    });
  }, [expInput, debugSetExp]);

  // 处理修为快捷增减
  const handleExpQuickChange = useCallback((delta: number) => {
    const newValue = Math.max(0, data.currentExp + delta);
    debugSetExp(newValue);
    setExpInput(String(newValue));
    Toast.show({
      content: `修为已设置为 ${newValue}`,
      position: 'bottom',
    });
  }, [data.currentExp, debugSetExp]);

  // 处理修为归零
  const handleResetExp = useCallback(() => {
    debugSetExp(0);
    setExpInput('0');
    Toast.show({
      content: '修为已归零',
      position: 'bottom',
    });
  }, [debugSetExp]);

  return (
    <SubPageLayout title="调试" onBack={onBack}>
      <div className={styles.container}>
        {/* 警告提示 */}
        <div className={styles.warningCard}>
          <AlertCircle size={20} className={styles.warningIcon} />
          <div className={styles.warningText}>
            <p className={styles.warningTitle}>开发者功能</p>
            <p className={styles.warningDesc}>
              直接修改灵玉和修为数值，仅用于测试目的。所有操作会记录到历史。
            </p>
          </div>
        </div>

        {/* 灵玉调试 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.titleIcon} />
            灵玉调试
          </h3>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>当前余额</span>
              <span className={styles.infoValue}>{spiritJadeData.balance}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>累计获得</span>
              <span className={styles.infoValue}>{spiritJadeData.totalEarned}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>累计消耗</span>
              <span className={styles.infoValue}>{spiritJadeData.totalSpent}</span>
            </div>
          </div>

          <div className={styles.inputCard}>
            <div className={styles.inputRow}>
              <Input
                className={styles.input}
                type="number"
                value={jadeInput}
                onChange={setJadeInput}
                placeholder="输入灵玉数量"
              />
              <button className={styles.setButton} onClick={handleSetJade}>
                设置
              </button>
            </div>
            <div className={styles.quickButtons}>
              <button className={styles.quickButton} onClick={() => handleJadeQuickChange(100)}>
                <Plus size={14} /> 100
              </button>
              <button className={styles.quickButton} onClick={() => handleJadeQuickChange(500)}>
                <Plus size={14} /> 500
              </button>
              <button className={styles.quickButton} onClick={() => handleJadeQuickChange(1000)}>
                <Plus size={14} /> 1000
              </button>
              <button className={styles.quickButton} onClick={() => handleJadeQuickChange(-100)}>
                <Minus size={14} /> 100
              </button>
              <button className={`${styles.quickButton} ${styles.resetButton}`} onClick={handleResetJade}>
                <RotateCcw size={14} /> 归零
              </button>
            </div>
          </div>
        </div>

        {/* 修为调试 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <img src={CULTIVATION_ICON} alt="修为" className={styles.titleIcon} />
            修为调试
          </h3>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>当前等级</span>
              <span className={styles.infoValue} style={{ color: levelInfo.color }}>
                {levelInfo.displayName}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>当前修为</span>
              <span className={styles.infoValue}>{data.currentExp} / {levelInfo.expCap}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>进度</span>
              <span className={styles.infoValue}>{levelInfo.progress.toFixed(1)}%</span>
            </div>
          </div>

          <div className={styles.inputCard}>
            <div className={styles.inputRow}>
              <Input
                className={styles.input}
                type="number"
                value={expInput}
                onChange={setExpInput}
                placeholder="输入修为数值"
              />
              <button className={styles.setButton} onClick={handleSetExp}>
                设置
              </button>
            </div>
            <div className={styles.quickButtons}>
              <button className={styles.quickButton} onClick={() => handleExpQuickChange(100)}>
                <Plus size={14} /> 100
              </button>
              <button className={styles.quickButton} onClick={() => handleExpQuickChange(500)}>
                <Plus size={14} /> 500
              </button>
              <button className={styles.quickButton} onClick={() => handleExpQuickChange(1000)}>
                <Plus size={14} /> 1000
              </button>
              <button className={styles.quickButton} onClick={() => handleExpQuickChange(-100)}>
                <Minus size={14} /> 100
              </button>
              <button className={`${styles.quickButton} ${styles.resetButton}`} onClick={handleResetExp}>
                <RotateCcw size={14} /> 归零
              </button>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>使用说明</h3>
          <div className={styles.helpCard}>
            <ul className={styles.helpList}>
              <li>修改灵玉：直接输入数值或使用快捷按钮增减</li>
              <li>修改修为：设置后会自动计算并更新等级</li>
              <li>所有修改都会记录到历史，标记为调试操作</li>
              <li>修为设置会清除闭关状态</li>
            </ul>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
};

export default DebugPage;
