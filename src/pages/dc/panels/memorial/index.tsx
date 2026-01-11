/**
 * 纪念日面板
 */

import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Plus, Heart, Cake, Baby } from 'lucide-react';
import { useMemorials } from './hooks';
import { MemorialCard, CreateMemorialModal, MemorialDetail, VirtualMemorialList, MemorialListSkeleton } from './components';
import type { Memorial, CreateMemorialInput } from './types';
import { useSpriteImage } from '../../hooks';
import styles from './styles.module.css';

export interface MemorialPanelRef {
  triggerAdd: () => void;
}

interface MemorialPanelProps {
  onAddClick?: () => void;
}

const MemorialPanel = forwardRef<MemorialPanelRef, MemorialPanelProps>(({ onAddClick }, ref) => {
  const {
    memorials,
    loading,
    addMemorial,
    updateMemorial,
    deleteMemorial,
    togglePin,
    getMemorialById,
  } = useMemorials();

  // 使用纪念日专属精灵图片（会自动根据全局 activeTab 显示对应图片）
  const { getCurrentSpriteImage, randomizeSpriteImage } = useSpriteImage();

  // 弹窗状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMemorialId, setSelectedMemorialId] = useState<string | null>(null);
  const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAdd: () => {
      setShowCreateModal(true);
    }
  }));

  // 获取当前选中的纪念日
  const selectedMemorial = selectedMemorialId ? getMemorialById(selectedMemorialId) : null;

  // 处理创建纪念日
  const handleCreate = useCallback(
    (data: CreateMemorialInput) => {
      if (editingMemorial) {
        // 编辑模式
        updateMemorial(editingMemorial.id, data);
        setEditingMemorial(null);
      } else {
        // 创建模式
        addMemorial(data);
      }
      setShowCreateModal(false);
    },
    [addMemorial, updateMemorial, editingMemorial]
  );

  // 处理编辑
  const handleEdit = useCallback(() => {
    if (selectedMemorial) {
      setEditingMemorial(selectedMemorial);
      setSelectedMemorialId(null);
      setShowCreateModal(true);
    }
  }, [selectedMemorial]);

  // 处理删除
  const handleDelete = useCallback(() => {
    if (selectedMemorialId) {
      deleteMemorial(selectedMemorialId);
      setSelectedMemorialId(null);
    }
  }, [selectedMemorialId, deleteMemorial]);

  // 处理置顶
  const handleTogglePin = useCallback(() => {
    if (selectedMemorialId) {
      togglePin(selectedMemorialId);
    }
  }, [selectedMemorialId, togglePin]);

  // 关闭创建弹窗
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingMemorial(null);
  }, []);

  // 渲染空状态
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      {/* 示例卡片 */}
      <div className={styles.exampleCards}>
        <div className={styles.exampleCard}>
          <div
            className={styles.exampleIconWrapper}
            style={{ backgroundColor: '#E8B4B833' }}
          >
            <Heart size={24} color="#E8B4B8" strokeWidth={1.5} />
          </div>
          <div className={styles.exampleContent}>
            <h3 className={styles.exampleName}>结婚纪念日</h3>
            <div className={styles.exampleDate}>2020年1月1日</div>
          </div>
          <span className={styles.exampleDays}>已 1836 天</span>
        </div>

        <div className={styles.exampleCard}>
          <div
            className={styles.exampleIconWrapper}
            style={{ backgroundColor: '#A8D8EA33' }}
          >
            <Baby size={24} color="#A8D8EA" strokeWidth={1.5} />
          </div>
          <div className={styles.exampleContent}>
            <h3 className={styles.exampleName}>宝宝出生</h3>
            <div className={styles.exampleDate}>2023年6月15日</div>
          </div>
          <span className={styles.exampleDays}>已 575 天</span>
        </div>

        <div className={styles.exampleCard}>
          <div
            className={styles.exampleIconWrapper}
            style={{ backgroundColor: '#EAD2AC33' }}
          >
            <Cake size={24} color="#EAD2AC" strokeWidth={1.5} />
          </div>
          <div className={styles.exampleContent}>
            <h3 className={styles.exampleName}>生日</h3>
            <div className={styles.exampleDate}>2025年3月20日</div>
          </div>
          <span className={styles.exampleDays}>还有 68 天</span>
        </div>
      </div>

      <div className={styles.emptyTitle}>记录重要的日子</div>
      <div className={styles.emptyDescription}>
        创建纪念日，记录那些值得铭记的时刻
      </div>
      <button
        className={styles.addButton}
        onClick={() => setShowCreateModal(true)}
        type="button"
      >
        <Plus size={18} />
        创建纪念日
      </button>
    </div>
  );

  // 渲染纪念日列表
  const renderMemorialList = () => (
    <div className={styles.listSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>纪念日</h2>
      </div>
      {loading ? (
        <MemorialListSkeleton count={5} />
      ) : (
        <VirtualMemorialList
          memorials={memorials}
          onMemorialClick={setSelectedMemorialId}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 内容区域 */}
      {memorials.length === 0 ? renderEmptyState() : renderMemorialList()}

      {/* 创建/编辑弹窗 */}
      <CreateMemorialModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreate}
        editingMemorial={editingMemorial}
      />

      {/* 详情弹窗 */}
      {selectedMemorial && (
        <MemorialDetail
          memorial={selectedMemorial}
          visible={!!selectedMemorialId}
          onClose={() => setSelectedMemorialId(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
        />
      )}
    </div>
  );
});

MemorialPanel.displayName = 'MemorialPanel';

export default MemorialPanel;

