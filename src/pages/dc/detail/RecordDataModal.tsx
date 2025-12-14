import { useState, useEffect } from 'react';
import { Popup } from 'antd-mobile';
import { Plus, Minus, FileText, Check } from 'lucide-react';
import { useTheme } from '../settings/theme';
import styles from '../css/RecordDataModal.module.css';

type InputMode = 'direct' | 'delta';
type DeltaSign = 'plus' | 'minus';

interface RecordDataModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: number, note?: string) => void;
  currentValue: number;
  unit: string;
  direction: 'INCREASE' | 'DECREASE';
  loading?: boolean;
}

export default function RecordDataModal({
  visible,
  onClose,
  onSubmit,
  currentValue,
  unit,
  direction,
  loading
}: RecordDataModalProps) {
  const { themeColors } = useTheme();
  const [inputMode, setInputMode] = useState<InputMode>('direct');
  const [value, setValue] = useState<string>(currentValue.toString());
  const [deltaValue, setDeltaValue] = useState<string>('');
  // 根据目标方向设置默认符号：增加目标默认+，减少目标默认-
  const [deltaSign, setDeltaSign] = useState<DeltaSign>(direction === 'INCREASE' ? 'plus' : 'minus');
  const [note, setNote] = useState('');
  
  // 根据输入模式计算最终值
  const getFinalValue = (): number => {
    if (inputMode === 'direct') {
      return parseFloat(value) || 0;
    } else {
      const delta = parseFloat(deltaValue) || 0;
      return deltaSign === 'plus' ? currentValue + delta : currentValue - delta;
    }
  };
  
  const finalValue = getFinalValue();
  const change = finalValue - currentValue;
  const isPositiveChange = direction === 'DECREASE' ? change < 0 : change > 0;
  
  const handleSubmit = () => {
    if (isNaN(finalValue)) return;
    onSubmit(finalValue, note || undefined);
    resetForm();
  };
  
  const resetForm = () => {
    setValue('');
    setDeltaValue('');
    // 根据目标方向设置默认符号：增加目标默认+，减少目标默认-
    setDeltaSign(direction === 'INCREASE' ? 'plus' : 'minus');
    setNote('');
    setInputMode('delta');
  };
  
  // 每次打开弹窗时重置表单
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position='bottom'
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '20px 24px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        boxSizing: 'border-box',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>记录{direction === 'DECREASE' ? '体重' : ''}数据</span>
          <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>
        
        {/* 输入模式切换 */}
        <div className={styles.modeSwitch}>
          <button 
            className={`${styles.modeBtn} ${inputMode === 'delta' ? styles.active : ''}`}
            onClick={() => setInputMode('delta')}
          >
            填写差值
          </button>
          <button 
            className={`${styles.modeBtn} ${inputMode === 'direct' ? styles.active : ''}`}
            onClick={() => setInputMode('direct')}
          >
            直接填值
          </button>
        </div>
        
        {inputMode === 'direct' ? (
          <div className={styles.inputGroup}>
            <label className={styles.label}>最新{direction === 'DECREASE' ? '体重' : '数值'}</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.input}
                step="0.1"
              />
              <span className={styles.unit}>{unit}</span>
            </div>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label className={styles.label}>变化值（当前: {currentValue}{unit}）</label>
            <div className={styles.deltaInputWrapper}>
              <div className={styles.signButtons}>
                <button 
                  className={`${styles.signBtn} ${deltaSign === 'minus' ? styles.activeMinus : ''}`}
                  onClick={() => setDeltaSign('minus')}
                >
                  <Minus size={16} />
                </button>
                <button 
                  className={`${styles.signBtn} ${deltaSign === 'plus' ? styles.activePlus : ''}`}
                  onClick={() => setDeltaSign('plus')}
                >
                  <Plus size={16} />
                </button>
              </div>
              <input
                type="number"
                value={deltaValue}
                onChange={(e) => setDeltaValue(e.target.value)}
                className={styles.input}
                placeholder="输入变化量"
                step="0.1"
              />
              <span className={styles.unit}>{unit}</span>
            </div>
            {deltaValue && (
              <div className={styles.resultPreview}>
                计算结果: {currentValue} {deltaSign === 'plus' ? '+' : '-'} {deltaValue} = <strong>{finalValue.toFixed(1)}{unit}</strong>
              </div>
            )}
          </div>
        )}
        
        {change !== 0 && (
          <div className={`${styles.changeHint} ${isPositiveChange ? styles.positive : styles.negative}`}>
            与上次对比: {change > 0 ? '+' : ''}{change.toFixed(1)}{unit} {isPositiveChange && <Check size={14} style={{ marginLeft: 4 }} />}
          </div>
        )}
        
        <div className={styles.inputGroup}>
          <label className={styles.label}><FileText size={14} style={{ marginRight: 4 }} /> 备注（可选）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={styles.textarea}
            placeholder="记录一些心得..."
            rows={3}
          />
        </div>
        
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={handleClose}>取消</button>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={loading || isNaN(finalValue)}
            style={{ backgroundColor: (loading || isNaN(finalValue)) ? '#ccc' : themeColors.primary }}
          >
            {loading ? '记录中...' : '确认记录'}
          </button>
        </div>
      </div>
    </Popup>
  );
}
