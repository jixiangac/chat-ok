import { useRef, useEffect, useState } from 'react';
import { CheckCircle, Hash, Clock, Calculator, BarChart3 } from 'lucide-react';
import { CHECK_IN_TYPE_OPTIONS } from '../../constants';
import type { HighlightStyle, CycleInfo } from '../../types';
import type { CheckInUnit } from '../../../../types';

interface CheckInConfigProps {
  checkInUnit: CheckInUnit;
  setCheckInUnit: (unit: CheckInUnit) => void;
  cycleDays: number;
  cycleInfo: CycleInfo;
  // 次数型
  dailyMaxTimes: string;
  setDailyMaxTimes: (times: string) => void;
  cycleTargetTimes: string;
  setCycleTargetTimes: (times: string) => void;
  // 时长型
  dailyTargetMinutes: string;
  setDailyTargetMinutes: (minutes: string) => void;
  cycleTargetMinutes: string;
  setCycleTargetMinutes: (minutes: string) => void;
  // 数值型
  dailyTargetValue: string;
  setDailyTargetValue: (value: string) => void;
  cycleTargetValue: string;
  setCycleTargetValue: (value: string) => void;
  valueUnit: string;
  setValueUnit: (unit: string) => void;
}

export default function CheckInConfig({
  checkInUnit,
  setCheckInUnit,
  cycleDays,
  cycleInfo,
  dailyMaxTimes,
  setDailyMaxTimes,
  cycleTargetTimes,
  setCycleTargetTimes,
  dailyTargetMinutes,
  setDailyTargetMinutes,
  cycleTargetMinutes,
  setCycleTargetMinutes,
  dailyTargetValue,
  setDailyTargetValue,
  cycleTargetValue,
  setCycleTargetValue,
  valueUnit,
  setValueUnit
}: CheckInConfigProps) {
  const checkInTypeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [checkInTypeHighlight, setCheckInTypeHighlight] = useState<HighlightStyle>({ top: 0, left: 0, height: 0, width: 0 });

  // 计算打卡类型高亮框位置
  useEffect(() => {
    const selectedIndex = CHECK_IN_TYPE_OPTIONS.findIndex(opt => opt.value === checkInUnit);
    if (selectedIndex >= 0 && checkInTypeRefs.current[selectedIndex]) {
      const card = checkInTypeRefs.current[selectedIndex];
      if (card) {
        setCheckInTypeHighlight({
          top: card.offsetTop,
          left: card.offsetLeft,
          height: card.offsetHeight,
          width: card.offsetWidth
        });
      }
    }
  }, [checkInUnit]);

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={16} /> 选择打卡类型
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {CHECK_IN_TYPE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              ref={el => checkInTypeRefs.current[index] = el}
              onClick={() => setCheckInUnit(option.value)}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #9ca3af',
                padding: '16px 8px',
                borderRadius: '16px',
                backgroundColor: 'white',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                {option.label}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {option.desc}
              </div>
            </button>
          ))}
          
          {/* 选中高亮边框 */}
          <div style={{
            width: `${checkInTypeHighlight.width}px`,
            height: `${checkInTypeHighlight.height}px`,
            position: 'absolute',
            top: `${checkInTypeHighlight.top}px`,
            left: `${checkInTypeHighlight.left}px`,
            borderRadius: '16px',
            pointerEvents: 'none',
            transition: 'top 0.3s, left 0.3s, height 0.3s, width 0.3s',
            opacity: 1,
            boxShadow: 'inset 0 0 0 3px #000'
          }} />
        </div>
        
        {/* 次数型打卡配置 */}
        {checkInUnit === 'TIMES' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Hash size={14} /> 次数型打卡设置
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日打卡上限</div>
                <input
                  type="number"
                  value={dailyMaxTimes}
                  onChange={(e) => setDailyMaxTimes(e.target.value)}
                  placeholder="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总次数目标</div>
                <input
                  type="number"
                  value={cycleTargetTimes}
                  onChange={(e) => setCycleTargetTimes(e.target.value)}
                  placeholder={`${cycleDays * (parseInt(dailyMaxTimes) || 1)}`}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              默认周期目标 = 天数 × 单日上限 = {cycleDays * (parseInt(dailyMaxTimes) || 1)} 次
            </div>
          </div>
        )}
        
        {/* 时长型打卡配置 */}
        {checkInUnit === 'DURATION' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> 时长型打卡设置
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日目标时长(分钟)</div>
                <input
                  type="number"
                  value={dailyTargetMinutes}
                  onChange={(e) => setDailyTargetMinutes(e.target.value)}
                  placeholder="15"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总时长目标(分钟)</div>
                <input
                  type="number"
                  value={cycleTargetMinutes}
                  onChange={(e) => setCycleTargetMinutes(e.target.value)}
                  placeholder={`${cycleDays * (parseInt(dailyTargetMinutes) || 15)}`}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              打卡时可选择 5/10/15 分钟或自定义时长
            </div>
          </div>
        )}
        
        {/* 数值型打卡配置 */}
        {checkInUnit === 'QUANTITY' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} /> 数值型打卡设置
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>单日目标数值</div>
                <input
                  type="number"
                  value={dailyTargetValue}
                  onChange={(e) => setDailyTargetValue(e.target.value)}
                  placeholder="10"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>数值单位</div>
                <input
                  type="text"
                  value={valueUnit}
                  onChange={(e) => setValueUnit(e.target.value)}
                  placeholder="个"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>周期总目标数值</div>
              <input
                type="number"
                value={cycleTargetValue}
                onChange={(e) => setCycleTargetValue(e.target.value)}
                placeholder={`${cycleDays * (parseFloat(dailyTargetValue) || 0)}`}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* 自动规划预览 */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#37352f', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart3 size={16} /> 系统自动规划
        </div>
        <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: '1.8' }}>
          {checkInUnit === 'TIMES' && (
            <>
              • 单日打卡上限：{parseInt(dailyMaxTimes) || 1} 次<br/>
              • 每周期目标：{cycleTargetTimes || (cycleDays * (parseInt(dailyMaxTimes) || 1))} 次<br/>
              • 预计总打卡：{cycleInfo.totalCycles * (parseInt(cycleTargetTimes) || (cycleDays * (parseInt(dailyMaxTimes) || 1)))} 次
            </>
          )}
          {checkInUnit === 'DURATION' && (
            <>
              • 单日目标时长：{parseInt(dailyTargetMinutes) || 15} 分钟<br/>
              • 每周期目标：{cycleTargetMinutes || (cycleDays * (parseInt(dailyTargetMinutes) || 15))} 分钟<br/>
              • 预计总时长：{cycleInfo.totalCycles * (parseInt(cycleTargetMinutes) || (cycleDays * (parseInt(dailyTargetMinutes) || 15)))} 分钟
            </>
          )}
          {checkInUnit === 'QUANTITY' && dailyTargetValue && (
            <>
              • 单日目标：{parseFloat(dailyTargetValue)} {valueUnit}<br/>
              • 每周期目标：{cycleTargetValue || (cycleDays * parseFloat(dailyTargetValue))} {valueUnit}<br/>
              • 预计总目标：{cycleInfo.totalCycles * (parseFloat(cycleTargetValue) || (cycleDays * parseFloat(dailyTargetValue)))} {valueUnit}
            </>
          )}
        </div>
      </div>
    </>
  );
}
