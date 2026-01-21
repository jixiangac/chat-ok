/**
 * AgentChat 弹窗封装组件
 * 提供全屏弹窗展示 AgentChat 的能力
 */

import { Popup, SafeArea } from 'antd-mobile';
import { AgentChat } from '../../AgentChat';
import type { AgentRole } from '../../constants';
import type { StructuredOutput } from '../../types';
import styles from './styles.module.css';

interface AgentChatPopupProps {
  /** 是否显示 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** AI 角色类型 */
  role: AgentRole;
  /** 结构化输出回调 */
  onStructuredOutput?: (output: StructuredOutput) => void;
  /** 输入框占位文字 */
  placeholder?: string;
}

export function AgentChatPopup({
  visible,
  onClose,
  role,
  onStructuredOutput,
  placeholder = 'message',
}: AgentChatPopupProps) {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyClassName={styles.popupBody}
      destroyOnClose
    >
      <div className={styles.container}>
        <AgentChat
          role={role}
          onClose={onClose}
          onStructuredOutput={onStructuredOutput}
          placeholder={placeholder}
        />
        <SafeArea position="bottom" />
      </div>
    </Popup>
  );
}

export default AgentChatPopup;
