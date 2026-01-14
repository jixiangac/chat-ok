/**
 * 数据管理子页面
 * 支持多种数据类型的导入导出
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Download, Upload, Database, Tag, Umbrella, Heart, Settings } from 'lucide-react';
import { Toast, Dialog, TextArea } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import {
  DataType,
  DATA_TYPE_CONFIG,
  exportToClipboard,
  importData,
  getDataStats,
} from '@/pages/dc/utils/dataExportImport';
import styles from './styles.module.css';

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

  return (
    <SubPageLayout
      title="数据管理"
      description="导入导出应用数据，用于备份或迁移"
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
