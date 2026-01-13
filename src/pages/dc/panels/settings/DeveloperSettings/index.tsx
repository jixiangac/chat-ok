/**
 * 开发者模式设置组件
 */

import { useState, useCallback } from 'react';
import { ChevronLeft, Download, Upload, Copy, FileText, Code } from 'lucide-react';
import { Toast, Dialog, TextArea } from 'antd-mobile';
import { useTaskContext } from '../../../contexts';
import {
  exportAllTasks,
  importAllTasks,
  importSingleTask,
  copyToClipboard
} from '../../../utils';
import './index.css';

interface DeveloperSettingsProps {
  onBack: () => void;
}

export default function DeveloperSettings({ onBack }: DeveloperSettingsProps) {
  const { refreshTasks, tasks } = useTaskContext();
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [singleImportDialogVisible, setSingleImportDialogVisible] = useState(false);
  const [importText, setImportText] = useState('');

  // 导出所有任务数据
  const handleExportAll = useCallback(async () => {
    const data = exportAllTasks();
    const success = await copyToClipboard(data);
    if (success) {
      Toast.show({
        icon: 'success',
        content: `已复制 ${tasks.length} 个任务数据到剪贴板`,
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '复制失败，请重试',
      });
    }
  }, [tasks.length]);

  // 导入所有任务数据
  const handleImportAll = useCallback(() => {
    setImportText('');
    setImportDialogVisible(true);
  }, []);

  // 确认导入所有任务
  const handleConfirmImportAll = useCallback(async () => {
    if (!importText.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入要导入的数据',
      });
      return;
    }

    const result = await Dialog.confirm({
      content: '导入将覆盖所有现有任务数据，确定继续吗？',
    });

    if (result) {
      const importResult = importAllTasks(importText);
      if (importResult.success) {
        Toast.show({
          icon: 'success',
          content: importResult.message,
        });
        setImportDialogVisible(false);
        setImportText('');
        refreshTasks();
      } else {
        Toast.show({
          icon: 'fail',
          content: importResult.message,
        });
      }
    }
  }, [importText, refreshTasks]);

  // 导入单个任务
  const handleImportSingle = useCallback(() => {
    setImportText('');
    setSingleImportDialogVisible(true);
  }, []);

  // 确认导入单个任务
  const handleConfirmImportSingle = useCallback(() => {
    if (!importText.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入要导入的任务数据',
      });
      return;
    }

    const result = importSingleTask(importText);
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: result.message,
      });
      setSingleImportDialogVisible(false);
      setImportText('');
      refreshTasks();
    } else {
      Toast.show({
        icon: 'fail',
        content: result.message,
      });
    }
  }, [importText, refreshTasks]);

  return (
    <div className="developer-settings">
      <div className="developer-settings-header">
        <button className="developer-settings-back" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <h3 className="developer-settings-title">开发者模式</h3>
      </div>

      <div className="developer-settings-content">
        <div className="developer-settings-section">
          <div className="developer-settings-section-title">
            <Code size={16} />
            <span>数据管理</span>
          </div>
          
          <div className="developer-settings-item" onClick={handleExportAll}>
            <div className="developer-settings-item-left">
              <Download size={18} />
              <div className="developer-settings-item-info">
                <span className="developer-settings-item-title">导出所有任务</span>
                <span className="developer-settings-item-desc">一键复制所有 dc_tasks 数据到剪贴板</span>
              </div>
            </div>
            <Copy size={16} className="developer-settings-item-action" />
          </div>

          <div className="developer-settings-item" onClick={handleImportAll}>
            <div className="developer-settings-item-left">
              <Upload size={18} />
              <div className="developer-settings-item-info">
                <span className="developer-settings-item-title">导入所有任务</span>
                <span className="developer-settings-item-desc">覆盖导入所有 dc_tasks 数据</span>
              </div>
            </div>
          </div>

          <div className="developer-settings-item" onClick={handleImportSingle}>
            <div className="developer-settings-item-left">
              <FileText size={18} />
              <div className="developer-settings-item-info">
                <span className="developer-settings-item-title">导入单个任务</span>
                <span className="developer-settings-item-desc">添加或更新单个任务数据</span>
              </div>
            </div>
          </div>
        </div>

        <div className="developer-settings-info">
          <p>当前任务数量：{tasks.length} 个</p>
          <p className="developer-settings-tip">
            提示：导出的数据为 JSON 格式，可用于备份或迁移数据。
          </p>
        </div>
      </div>

      {/* 导入所有任务弹窗 */}
      <Dialog
        visible={importDialogVisible}
        title="导入所有任务"
        content={
          <div className="developer-import-dialog">
            <TextArea
              placeholder='请粘贴要导入的 JSON 数据，格式：{"tasks": [...]}'
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
            onClick: () => {
              setImportDialogVisible(false);
              setImportText('');
            },
          },
          {
            key: 'confirm',
            text: '导入',
            bold: true,
            onClick: handleConfirmImportAll,
          },
        ]}
      />

      {/* 导入单个任务弹窗 */}
      <Dialog
        visible={singleImportDialogVisible}
        title="导入单个任务"
        content={
          <div className="developer-import-dialog">
            <TextArea
              placeholder='请粘贴要导入的任务 JSON 数据，格式：{"task": {...}} 或直接 {...}'
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
            onClick: () => {
              setSingleImportDialogVisible(false);
              setImportText('');
            },
          },
          {
            key: 'confirm',
            text: '导入',
            bold: true,
            onClick: handleConfirmImportSingle,
          },
        ]}
      />
    </div>
  );
}
