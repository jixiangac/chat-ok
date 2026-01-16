/**
 * 数据迁移弹窗组件
 * 用于将旧版数据迁移到新版格式
 */

import { useState, useEffect } from 'react';
import { Popup, Button, ProgressBar, Toast } from 'antd-mobile';
import { AlertCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { TaskMigration } from '../../utils/migration';
import type { MigrationResult } from '../../types';
import styles from './styles.module.css';

interface MigrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MigrationModal({ visible, onClose, onSuccess }: MigrationModalProps) {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [step, setStep] = useState<'confirm' | 'migrating' | 'result'>('confirm');

  // 重置状态
  useEffect(() => {
    if (visible) {
      setStep('confirm');
      setResult(null);
      setMigrating(false);
    }
  }, [visible]);

  const handleMigrate = async () => {
    setMigrating(true);
    setStep('migrating');

    try {
      const migrationResult = await TaskMigration.migrate();
      setResult(migrationResult);
      setStep('result');

      if (migrationResult.success && migrationResult.failedCount === 0) {
        Toast.show({
          icon: 'success',
          content: `迁移成功！共迁移 ${migrationResult.migratedCount} 个任务`,
        });
      } else if (migrationResult.success) {
        Toast.show({
          icon: 'success',
          content: `迁移完成，${migrationResult.migratedCount} 成功，${migrationResult.failedCount} 失败`,
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: '迁移失败，请查看详情',
        });
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '迁移过程出错',
      });
      setStep('result');
      setResult({
        success: false,
        migratedCount: 0,
        failedCount: 0,
        errors: [{ taskId: 'SYSTEM', error: '迁移过程出错' }],
      });
    } finally {
      setMigrating(false);
    }
  };

  const handleRollback = () => {
    const success = TaskMigration.rollback();
    if (success) {
      Toast.show({ icon: 'success', content: '已回滚到旧版本' });
      onClose();
    } else {
      Toast.show({ icon: 'fail', content: '回滚失败，备份数据不存在' });
    }
  };

  const handleComplete = () => {
    if (result?.success) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={() => {
        if (!migrating) {
          onClose();
        }
      }}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '24px',
        minHeight: '50vh',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <div className={styles.container}>
        {/* 标题 */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 'confirm' && '数据格式升级'}
            {step === 'migrating' && '正在迁移...'}
            {step === 'result' && (result?.success ? '迁移完成' : '迁移失败')}
          </h2>
        </div>

        {/* 确认步骤 */}
        {step === 'confirm' && (
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <AlertCircle size={48} color="#faad14" />
            </div>
            <p className={styles.description}>
              检测到旧版本数据格式，需要升级到新版本以获得更好的体验。
            </p>
            <div className={styles.infoBox}>
              <h4>升级内容：</h4>
              <ul>
                <li>统一的任务数据结构</li>
                <li>更精确的进度计算</li>
                <li>类型化的活动日志</li>
                <li>优化的周期管理</li>
              </ul>
            </div>
            <div className={styles.warningBox}>
              <p>⚠️ 迁移前会自动备份原数据，可随时回滚</p>
            </div>
            <div className={styles.actions}>
              <Button
                block
                color="primary"
                size="large"
                onClick={handleMigrate}
              >
                开始升级
              </Button>
              <Button
                block
                fill="none"
                size="large"
                onClick={onClose}
                style={{ marginTop: '12px' }}
              >
                稍后再说
              </Button>
            </div>
          </div>
        )}

        {/* 迁移中 */}
        {step === 'migrating' && (
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <RefreshCw size={48} color="#1890ff" className={styles.spinning} />
            </div>
            <p className={styles.description}>
              正在迁移数据，请勿关闭页面...
            </p>
            <ProgressBar
              percent={100}
              style={{
                '--fill-color': '#1890ff',
                marginTop: '24px',
              }}
            />
          </div>
        )}

        {/* 结果 */}
        {step === 'result' && result && (
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              {result.success ? (
                <CheckCircle size={48} color="#52c41a" />
              ) : (
                <AlertCircle size={48} color="#ff4d4f" />
              )}
            </div>

            <div className={styles.resultStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>成功</span>
                <span className={styles.statValue} style={{ color: '#52c41a' }}>
                  {result.migratedCount}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>失败</span>
                <span className={styles.statValue} style={{ color: '#ff4d4f' }}>
                  {result.failedCount}
                </span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className={styles.errorBox}>
                <h4>错误详情：</h4>
                <div className={styles.errorList}>
                  {result.errors.map((err, idx) => (
                    <div key={idx} className={styles.errorItem}>
                      <span className={styles.errorTaskId}>{err.taskId}</span>
                      <span className={styles.errorMessage}>{err.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <Button
                block
                color="primary"
                size="large"
                onClick={handleComplete}
              >
                {result.success ? '完成' : '关闭'}
              </Button>
              {result.backup && (
                <Button
                  block
                  color="warning"
                  fill="outline"
                  size="large"
                  onClick={handleRollback}
                  style={{ marginTop: '12px' }}
                >
                  <ArrowLeft size={16} style={{ marginRight: '4px' }} />
                  回滚到旧版本
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
}
