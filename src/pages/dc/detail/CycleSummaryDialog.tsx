import { Dialog, TextArea, Toast } from 'antd-mobile';
import styles from '../css/CycleSummaryDialog.module.css';

export function showCycleSummaryDialog(
  cycleNumber: number, 
  onSave: (summary: string) => void
) {
  let summaryText = '';
  
  Dialog.confirm({
    title: `🎉 第${cycleNumber}周期完成！`,
    content: (
      <div className={styles.content}>
        <div className={styles.label}>
          写一句话总结这个周期：
        </div>
        <TextArea
          placeholder='例如：坚持的力量超乎想象'
          maxLength={100}
          rows={3}
          showCount
          onChange={(val) => summaryText = val}
          style={{
            '--font-size': '14px'
          } as any}
        />
      </div>
    ),
    confirmText: '保存总结',
    cancelText: '跳过',
    onConfirm: () => {
      if (summaryText.trim()) {
        onSave(summaryText);
        Toast.show({
          icon: 'success',
          content: '总结已保存'
        });
      }
    }
  });
}
