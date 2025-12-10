/**
 * 目标详情组件使用示例
 * 
 * 这个文件展示了如何在实际项目中使用 GoalDetailModal 组件
 */

import { useState } from 'react';
import GoalDetailModal from './index';

export default function GoalDetailExample() {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState('');
  
  // 模拟目标数据
  const mockGoals = [
    {
      id: 'goal-1',
      title: '每天阅读30分钟',
      icon: '📚',
      encouragement: '读书使人充实，讨论使人机智',
      type: 'mainline' as const,
      totalDays: 365,
      cycleDays: 10,
      totalCycles: 36,
      minCheckInsPerCycle: 3,
      startDate: '2025-01-01',
      checkIns: [
        { id: '1', date: '2025-01-02', timestamp: 1704153600000 },
        { id: '2', date: '2025-01-05', timestamp: 1704412800000 },
        { id: '3', date: '2025-01-08', timestamp: 1704672000000 }
      ]
    },
    {
      id: 'goal-2',
      title: '每周健身3次',
      icon: '💪',
      encouragement: '健康是革命的本钱',
      type: 'sidelineA' as const,
      priority: 'high' as const,
      totalDays: 90,
      cycleDays: 7,
      totalCycles: 12,
      minCheckInsPerCycle: 3,
      startDate: '2025-01-01',
      checkIns: [
        { id: '1', date: '2025-01-01', timestamp: 1704067200000 },
        { id: '2', date: '2025-01-03', timestamp: 1704240000000 }
      ]
    }
  ];
  
  // 保存模拟数据到 localStorage（仅用于演示）
  const initMockData = () => {
    localStorage.setItem('dc_tasks', JSON.stringify(mockGoals));
    alert('模拟数据已初始化！');
  };
  
  const handleGoalClick = (goalId: string) => {
    setSelectedGoalId(goalId);
    setDetailVisible(true);
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
        目标详情组件示例
      </h1>
      
      {/* 初始化按钮 */}
      <button
        onClick={initMockData}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4a9eff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        初始化模拟数据
      </button>
      
      {/* 目标列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockGoals.map(goal => (
          <div
            key={goal.id}
            onClick={() => handleGoalClick(goal.id)}
            style={{
              padding: '16px',
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f8f8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{goal.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {goal.title}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {goal.type === 'mainline' ? '🔴 主线任务' : 
                   goal.type === 'sidelineA' ? '🟡 支线任务A' : '🟢 支线任务B'}
                  {' • '}
                  {goal.checkIns?.length || 0} 次打卡
                </div>
              </div>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 详情弹窗 */}
      <GoalDetailModal
        visible={detailVisible}
        goalId={selectedGoalId}
        onClose={() => setDetailVisible(false)}
      />
      
      {/* 使用说明 */}
      <div style={{
        marginTop: '40px',
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderRadius: '12px',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          💡 使用说明
        </h3>
        <ol style={{ paddingLeft: '20px', margin: 0 }}>
          <li>点击"初始化模拟数据"按钮，将示例数据保存到 localStorage</li>
          <li>点击任意目标卡片，打开详情弹窗</li>
          <li>查看顶部的打卡进度统计（本周期和总体进度）</li>
          <li>切换Tab查看"当前周期"详情或"打卡记录"列表</li>
          <li>当前周期显示周期时间、打卡进度、剩余天数等信息</li>
          <li>打卡记录按日期分组显示所有打卡历史</li>
        </ol>
      </div>
    </div>
  );
}

