/**
 * 数据管理子页面
 * 支持多种数据类型的导入导出
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Download, Upload, Database, Tag, Umbrella, Heart, Settings, Wrench, RefreshCw, Archive } from 'lucide-react';
import { Toast, Dialog, TextArea } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import {
  DataType,
  DATA_TYPE_CONFIG,
  exportToClipboard,
  importData,
  getDataStats,
  repairTaskProgressData,
  migrateToNewFormat,
} from '@/pages/dc/utils/dataExportImport';
import { migrateOldArchivedTasks, getArchiveStats } from '@/pages/dc/utils/archiveStorage';
import styles from './styles.module.css';

// 数据管理头图
const DATA_HEADER_IMAGE = 'https://img.alicdn.com/imgextra/i4/O1CN01v4XwU51lD7taaUmq1_!!6000000004784-2-tps-1080-724.png';
const DATA_HEADER_BACKGROUND = 'linear-gradient(135deg, #F0E6F6 0%, #E0D4EC 100%)';

export interface DataManagementPageProps {
  /** 返回上一页 */
  onBack: () => void;
  /** 数据变更回调 */
  onDataChanged?: () => void;
}

// 数据类型图标映射
const DATA_TYPE_ICONS: Record<DataType, React.ReactNode> = {
  tasks: <Database size={18} />,
  tags: <Tag size={18} />,
  vacation: <Umbrella size={18} />,
  memorial: <Heart size={18} />,
  preferences: <Settings size={18} />,
};

const DataManagementPage: React.FC<DataManagementPageProps> = ({
  onBack,
  onDataChanged,
}) => {
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [importDataType, setImportDataType] = useState<DataType | null>(null);
  const [importText, setImportText] = useState('');

  // 获取所有数据类型的统计信息
  const dataStats = useMemo(() => {
    const stats: Record<DataType, { count: number; size: string }> = {} as any;
    (Object.keys(DATA_TYPE_CONFIG) as DataType[]).forEach(type => {
      stats[type] = getDataStats(type);
    });
    return stats;
  }, []);

  // 处理导出
  const handleExport = useCallback(async (dataType: DataType) => {
    const success = await exportToClipboard(dataType);
    if (success) {
      Toast.show({
        icon: 'success',
        content: `${DATA_TYPE_CONFIG[dataType].label}已复制到剪贴板`,
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '复制失败，请重试',
      });
    }
  }, []);

  // 打开导入弹窗
  const handleOpenImport = useCallback((dataType: DataType) => {
    setImportDataType(dataType);
    setImportText('');
    setImportDialogVisible(true);
  }, []);

  // 确认导入
  const handleConfirmImport = useCallback(async () => {
    if (!importDataType || !importText.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入要导入的数据',
      });
      return;
    }

    const result = await Dialog.confirm({
      content: `导入将覆盖现有的${DATA_TYPE_CONFIG[importDataType].label}，确定继续吗？`,
    });

    if (result) {
      const importResult = importData(importDataType, importText);
      if (importResult.success) {
        Toast.show({
          icon: 'success',
          content: importResult.message,
        });
        setImportDialogVisible(false);
        setImportText('');
        setImportDataType(null);
        onDataChanged?.();
      } else {
        Toast.show({
          icon: 'fail',
          content: importResult.message,
        });
      }
    }
  }, [importDataType, importText, onDataChanged]);

  // 关闭导入弹窗
  const handleCloseImport = useCallback(() => {
    setImportDialogVisible(false);
    setImportText('');
    setImportDataType(null);
  }, []);

  // 处理一键修复数据
  const handleRepairData = useCallback(async () => {
    const result = await Dialog.confirm({
      content: '将重新计算所有任务的进度数据（周期完成率、总完成率），确定继续吗？',
    });

    if (result) {
      const repairResult = repairTaskProgressData();
      if (repairResult.success) {
        Toast.show({
          icon: 'success',
          content: repairResult.message,
        });
        onDataChanged?.();
      } else {
        Toast.show({
          icon: 'fail',
          content: repairResult.message,
        });
      }
    }
  }, [onDataChanged]);

  // 处理迁移到新格式
  const handleMigrateToNewFormat = useCallback(async () => {
    const result = await Dialog.confirm({
      content: '将把所有旧格式任务数据迁移到新的 v2 格式。迁移前会自动备份旧数据，迁移成功后页面将自动刷新。确定继续吗？',
    });

    if (result) {
      Toast.show({
        icon: 'loading',
        content: '正在迁移...',
        duration: 0,
      });
      
      const migrateResult = await migrateToNewFormat();
      Toast.clear();
      
      if (migrateResult.success) {
        if (migrateResult.migratedCount > 0) {
          Toast.show({
            icon: 'success',
            content: `${migrateResult.message}，页面将自动刷新...`,
          });
          // 延迟刷新页面，让用户看到成功提示
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          Toast.show({
            icon: 'success',
            content: migrateResult.message,
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: migrateResult.message,
        });
      }
    }
  }, [onDataChanged]);

  // 处理迁移归档任务
  const handleMigrateArchivedTasks = useCallback(async () => {
    const result = await Dialog.confirm({
      content: '将把主存储中已归档的任务迁移到独立的归档存储，确定继续吗？',
    });

    if (result) {
      const migrateResult = migrateOldArchivedTasks();
      if (migrateResult.success) {
        Toast.show({
          icon: 'success',
          content: migrateResult.message,
        });
        onDataChanged?.();
      } else {
        Toast.show({
          icon: 'fail',
          content: migrateResult.message,
        });
      }
    }
  }, [onDataChanged]);

  return (
    <SubPageLayout
      title="数据管理"
      description="导入导出应用数据，用于备份或迁移"
      headerImage={DATA_HEADER_IMAGE}
      headerBackground={DATA_HEADER_BACKGROUND}
      onBack={onBack}
    >
      <div className={styles.container}>
        {(Object.keys(DATA_TYPE_CONFIG) as DataType[]).map(dataType => {
          const config = DATA_TYPE_CONFIG[dataType];
          const stats = dataStats[dataType];

          return (
            <div key={dataType} className={styles.dataItem}>
              <div className={styles.dataInfo}>
                <div className={styles.dataIcon}>
                  {DATA_TYPE_ICONS[dataType]}
                </div>
                <div className={styles.dataText}>
                  <span className={styles.dataLabel}>{config.label}</span>
                  <span className={styles.dataDesc}>{config.description}</span>
                  <span className={styles.dataStats}>
                    {stats.count > 0 ? `${stats.count} 条记录 · ${stats.size}` : '暂无数据'}
                  </span>
                </div>
              </div>
              <div className={styles.dataActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleExport(dataType)}
                  title="导出"
                >
                  <Download size={16} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleOpenImport(dataType)}
                  title="导入"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {/* 数据修复区域 */}
        <div className={styles.repairSection}>
          <div className={styles.repairHeader}>
            <Wrench size={18} />
            <span>数据修复</span>
          </div>
          <div className={styles.repairItem}>
            <div className={styles.repairInfo}>
              <span className={styles.repairLabel}>一键修复进度数据</span>
              <span className={styles.repairDesc}>重新计算所有任务的周期完成率和总完成率</span>
            </div>
            <button
              className={styles.repairButton}
              onClick={handleRepairData}
            >
              修复
            </button>
          </div>
          <div className={styles.repairItem}>
            <div className={styles.repairInfo}>
              <span className={styles.repairLabel}>迁移到新格式</span>
              <span className={styles.repairDesc}>将旧版任务数据迁移到 v2 新格式（推荐）</span>
            </div>
            <button
              className={`${styles.repairButton} ${styles.migrateButton}`}
              onClick={handleMigrateToNewFormat}
            >
              <RefreshCw size={14} /> 迁移
            </button>
          </div>
          <div className={styles.repairItem}>
            <div className={styles.repairInfo}>
              <span className={styles.repairLabel}>迁移归档任务</span>
              <span className={styles.repairDesc}>将已归档任务移动到独立存储，减少主数据体积</span>
            </div>
            <button
              className={styles.repairButton}
              onClick={handleMigrateArchivedTasks}
            >
              <Archive size={14} /> 迁移
            </button>
          </div>
        </div>

        <div className={styles.tips}>
          <p>提示：</p>
          <ul>
            <li>导出的数据为 JSON 格式，可用于备份或迁移</li>
            <li>导入数据会覆盖现有数据，请谨慎操作</li>
            <li>建议在导入前先导出备份</li>
          </ul>
        </div>
      </div>

      {/* 导入弹窗 */}
      <Dialog
        visible={importDialogVisible}
        title={`导入${importDataType ? DATA_TYPE_CONFIG[importDataType].label : ''}`}
        content={
          <div className={styles.importDialog}>
            <TextArea
              placeholder="请粘贴要导入的 JSON 数据"
              value={importText}
              onChange={setImportText}
              rows={8}
              style={{ width: '100%' }}
            />
          </div>
        }
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: handleCloseImport,
          },
          {
            key: 'confirm',
            text: '导入',
            bold: true,
            onClick: handleConfirmImport,
          },
        ]}
      />
    </SubPageLayout>
  );
};

export default DataManagementPage;





