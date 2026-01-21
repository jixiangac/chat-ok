import { useState } from 'react';
import { CheckCircle, FileText, ClipboardList, Calendar, Square, CheckSquare, Sparkles } from 'lucide-react';
import type { Task, ChecklistItem } from '../../../../types';
import type { CurrentCycleInfo } from '../../types';
import { AgentChatPopup, type StructuredOutput, type ChecklistItemsData } from '../../../../agent';
import styles from '../../../../css/ChecklistCyclePanel.module.css';

interface ChecklistCyclePanelProps {
  goal: Task;
  cycle: CurrentCycleInfo;
  onUpdateProgress: (itemId: string) => void;
  onAddChecklistItems?: (items: { title: string }[]) => void;
}

export default function ChecklistCyclePanel({
  goal,
  cycle,
  onUpdateProgress,
  onAddChecklistItems
}: ChecklistCyclePanelProps) {
  const [showAIChat, setShowAIChat] = useState(false);
  const config = goal.checklistConfig;
  
  if (!config) {
    return <div className={styles.container}>清单配置缺失</div>;
  }
  
  const items = config.items || [];
  const completedItems = items.filter(item => item.status === 'COMPLETED');
  const inProgressItems = items.filter(item => item.status === 'IN_PROGRESS');
  const pendingItems = items.filter(item => item.status === 'PENDING');
  
  // 本周期的清单项
  const cycleItems = items.filter(item => item.cycle === cycle.cycleNumber);
  const cycleCompleted = cycleItems.filter(item => item.status === 'COMPLETED').length;
  
  const renderItem = (item: ChecklistItem) => {
    const isCompleted = item.status === 'COMPLETED';
    const isInProgress = item.status === 'IN_PROGRESS';
    
    return (
      <div 
        key={item.id} 
        className={`${styles.listItem} ${isCompleted ? styles.completed : ''}`}
        onClick={() => onUpdateProgress(item.id)}
      >
        <div className={styles.itemCheckbox}>
          {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemTitle}>{item.title}</div>
          {item.subProgress && (
            <div className={styles.itemProgress}>
              进度: {item.subProgress.current}/{item.subProgress.total}
              {item.subProgress.type === 'PAGES' ? '页' : ''}
              {isCompleted && <CheckCircle size={14} style={{ marginLeft: 4 }} />}
            </div>
          )}
          {item.completedAt && (
            <div className={styles.itemMeta}>
              完成时间: {item.completedAt}
            </div>
          )}
        </div>
        {!isCompleted && (
          <div className={styles.itemAction}>
            {isInProgress ? '进行中' : '待开始'}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={styles.container}>
      {/* 本周期清单 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>📚</span>
          <span className={styles.sectionTitle}>本周期清单 ({cycleCompleted}/{config.perCycleTarget})</span>
        </div>
        
        <div className={styles.listContainer}>
          {cycleItems.length > 0 ? (
            cycleItems.map(renderItem)
          ) : (
            <div className={styles.emptyHint}>本周期暂无清单项</div>
          )}
        </div>
      </div>
      
      {/* 进行中的项目 */}
      {inProgressItems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FileText size={16} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>进行中</span>
          </div>
          <div className={styles.listContainer}>
            {inProgressItems.map(renderItem)}
          </div>
        </div>
      )}
      
      {/* 下周期预计 */}
      {pendingItems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <ClipboardList size={16} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>下周期预计</span>
          </div>
          <div className={styles.listContainer}>
            {pendingItems.slice(0, 2).map(renderItem)}
          </div>
        </div>
      )}
      
      {/* 周期时间 */}
      <div className={styles.timeRange}>
        <Calendar size={14} className={styles.timeIcon} />
        <span>本周期: {cycle.startDate} - {cycle.endDate}</span>
      </div>

      {/* AI 辅助按钮 */}
      {onAddChecklistItems && (
        <button
          className={styles.aiButton}
          onClick={() => setShowAIChat(true)}
        >
          <Sparkles size={16} />
          <span>AI 帮我梳理清单</span>
        </button>
      )}

      {/* AI 清单助手弹窗 */}
      <AgentChatPopup
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        role="checklistHelper"
        placeholder="告诉我你的目标，我来帮你拆解..."
        onStructuredOutput={(output: StructuredOutput) => {
          if (output.type === 'CHECKLIST_ITEMS' && onAddChecklistItems) {
            const data = output.data as ChecklistItemsData;
            onAddChecklistItems(data.items);
            setShowAIChat(false);
          }
        }}
      />
    </div>
  );
}
