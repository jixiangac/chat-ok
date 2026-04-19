// @ts-nocheck
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  SpinLoading,
  Tag,
  Toast,
  Input,
  Button,
  Switch,
  Dialog,
  Popup,
  Selector,
  Space,
} from 'antd-mobile';
import { X, Plus, Trash2, Edit2, Brain, Lock, Unlock } from 'lucide-react';
import styles from './index.module.css';

const API_BASE = 'https://newdemo.jixiang.chat/proxyhttp';
const BASE_PARAMS = { apitype: 'ai_skill_watch', apitag: 'CHATGPT' };

const fetchWatchList = async (filters = {}) => {
  const res = await axios.get(API_BASE, {
    params: { ...BASE_PARAMS, action: 'list', ...filters },
  });
  return res.data;
};

const createWatch = async (params) => {
  const res = await axios.get(API_BASE, {
    params: { ...BASE_PARAMS, action: 'create', ...params },
  });
  return res.data;
};

const updateWatch = async (id, params) => {
  const res = await axios.get(API_BASE, {
    params: { ...BASE_PARAMS, action: 'update', id, ...params },
  });
  return res.data;
};

const removeWatch = async (id) => {
  const res = await axios.get(API_BASE, {
    params: { ...BASE_PARAMS, action: 'remove', id },
  });
  return res.data;
};

const EMPTY_FORM = {
  ins_id: '',
  pos_side: '',
  tp_ratio: '',
  level: '',
  strategy_prob: '',
  tips: '',
};

const POS_OPTIONS = [
  { label: '做多', value: 'long' },
  { label: '做空', value: 'short' },
];

const WatchForm = ({ formData, setFormData, onSubmit, onCancel, isEdit, submitting }) => {
  return (
    <>
      <div className={styles.aiWatchForm}>
        <div className={styles.aiWatchFormItem}>
          <label>合约 ID</label>
          <Input
            placeholder="如 SOL-USDT-SWAP"
            value={formData.ins_id}
            onChange={(v) => setFormData({ ...formData, ins_id: v })}
            disabled={isEdit}
          />
        </div>
        <div className={styles.aiWatchFormItem}>
          <label>方向</label>
          <Selector
            columns={2}
            options={POS_OPTIONS}
            value={formData.pos_side ? [formData.pos_side] : []}
            onChange={(v) => setFormData({ ...formData, pos_side: v[0] || '' })}
          />
        </div>
        <div className={styles.aiWatchFormItem}>
          <label>止盈比例 (%)</label>
          <Input
            placeholder="如 2，表示盈利≥2%触发止盈"
            value={formData.tp_ratio}
            onChange={(v) => setFormData({ ...formData, tp_ratio: v })}
            type="number"
          />
        </div>
        <div className={styles.aiWatchFormItem}>
          <label>下单倍数</label>
          <Input
            placeholder="如 1.5，表示挂单数量×1.5"
            value={formData.level}
            onChange={(v) => setFormData({ ...formData, level: v })}
            type="number"
          />
        </div>
        <div className={styles.aiWatchFormItem}>
          <label>策略概率 (0-100)</label>
          <Input
            placeholder="AI 权重参考值"
            value={formData.strategy_prob}
            onChange={(v) => setFormData({ ...formData, strategy_prob: v })}
            type="number"
          />
        </div>
        <div className={styles.aiWatchFormItem}>
          <label>备注</label>
          <Input
            placeholder="可选备注"
            value={formData.tips}
            onChange={(v) => setFormData({ ...formData, tips: v })}
          />
        </div>
      </div>
      <div className={styles.aiWatchFormFooter}>
        <Button block onClick={onCancel} disabled={submitting}>
          取消
        </Button>
        <Button block color="primary" onClick={onSubmit} loading={submitting}>
          {isEdit ? '保存' : '添加'}
        </Button>
      </div>
    </>
  );
};

const WatchItem = ({ item, onEdit, onRemove, onToggleStatus, editMode }) => {
  const isActive = item.status === 'active';
  return (
    <div className={styles.aiWatchItem}>
      <div className={styles.aiWatchItemTop}>
        <span className={styles.aiWatchItemName}>{item.ins_id}</span>
        {item.pos_side && (
          <Tag color={item.pos_side === 'long' ? '#e8f5e9' : '#fce4ec'}
            style={{ color: item.pos_side === 'long' ? '#2e7d32' : '#c62828', '--border-radius': '4px' }}>
            {item.pos_side === 'long' ? '做多' : '做空'}
          </Tag>
        )}
        {editMode && (
          <Switch
            checked={isActive}
            onChange={(checked) => onToggleStatus(item, checked ? 'active' : 'paused')}
            style={{ '--height': '22px', '--width': '40px' }}
          />
        )}
      </div>
      <div className={styles.aiWatchItemMeta}>
        {item.tp_ratio && <span>止盈 {item.tp_ratio}%</span>}
        {item.level && <span>倍数 {item.level}x</span>}
        {item.strategy_prob && <span>概率 {item.strategy_prob}</span>}
      </div>
      {item.tips && (
        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{item.tips}</div>
      )}
      {editMode && (
        <div className={styles.aiWatchItemActions}>
          <button onClick={() => onEdit(item)}>
            <Edit2 size={14} /> 编辑
          </button>
          <button onClick={() => onRemove(item)} style={{ color: '#e57373' }}>
            <Trash2 size={14} /> 删除
          </button>
        </div>
      )}
    </div>
  );
};

const AIWatchPanel = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await fetchWatchList();
      setList(res.success ? res.data || [] : []);
    } catch {
      Toast.show({ icon: 'fail', content: '加载失败' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setEditingId(null);
      setEditMode(false);
      loadList();
    }
  }, [visible]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      ins_id: item.ins_id || '',
      pos_side: item.pos_side || '',
      tp_ratio: item.tp_ratio || '',
      level: item.level || '',
      strategy_prob: item.strategy_prob || '',
      tips: item.tips || '',
    });
  };

  const handleAddNew = () => {
    setEditingId(-1);
    setFormData({ ...EMPTY_FORM });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (editingId === -1 && !formData.ins_id) {
      Toast.show({ icon: 'fail', content: '请填写合约 ID' });
      return;
    }
    setSubmitting(true);
    try {
      const params = {};
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== '' && v != null) params[k] = v;
      });

      if (editingId === -1) {
        const res = await createWatch(params);
        if (res.success) {
          Toast.show({ icon: 'success', content: '添加成功' });
        } else {
          Toast.show({ icon: 'fail', content: res.msg || '添加失败' });
          return;
        }
      } else {
        delete params.ins_id;
        const res = await updateWatch(editingId, params);
        if (res.success) {
          Toast.show({ icon: 'success', content: '保存成功' });
        } else {
          Toast.show({ icon: 'fail', content: res.msg || '保存失败' });
          return;
        }
      }
      setEditingId(null);
      loadList();
    } catch {
      Toast.show({ icon: 'fail', content: '操作失败' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (item) => {
    Dialog.confirm({
      content: `确认删除 ${item.ins_id} 的监控配置？`,
      onConfirm: async () => {
        try {
          const res = await removeWatch(item.id);
          if (res.success) {
            Toast.show({ icon: 'success', content: '已删除' });
            setList((prev) => prev.filter((i) => i.id !== item.id));
          } else {
            Toast.show({ icon: 'fail', content: res.msg || '删除失败' });
          }
        } catch {
          Toast.show({ icon: 'fail', content: '删除失败' });
        }
      },
    });
  };

  const handleToggleStatus = async (item, newStatus) => {
    const prev = list.map((i) => ({ ...i }));
    setList((l) => l.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));
    try {
      const res = await updateWatch(item.id, { status: newStatus });
      if (!res.success) {
        setList(prev);
        Toast.show({ icon: 'fail', content: '操作失败' });
      }
    } catch {
      setList(prev);
      Toast.show({ icon: 'fail', content: '操作失败' });
    }
  };

  const renderContent = () => {
    if (editingId !== null) {
      return (
        <WatchForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={editingId !== -1}
          submitting={submitting}
        />
      );
    }

    return (
      <>
        <div className={styles.aiWatchContent}>
          {loading ? (
            <div className={styles.aiWatchEmpty}>
              <SpinLoading color="primary" />
            </div>
          ) : list.length === 0 ? (
            <div className={styles.aiWatchEmpty}>
              <Brain size={40} color="#ddd" />
              <span style={{ marginTop: 12 }}>暂无监控配置</span>
            </div>
          ) : (
            list.map((item) => (
              <WatchItem
                key={item.id}
                item={item}
                editMode={editMode}
                onEdit={handleEdit}
                onRemove={handleRemove}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
        {!loading && editMode && (
          <div className={styles.aiWatchAddBtn}>
            <Button block color="primary" fill="outline" onClick={handleAddNew}>
              <Plus size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              添加监控
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      destroyOnClose
    >
      <div className={styles.aiWatchHeader}>
        <button onClick={() => editingId !== null ? setEditingId(null) : onClose()}>
          <X size={22} />
        </button>
        <h3>{editingId === null ? 'AI 监控设置' : editingId === -1 ? '添加监控' : '编辑监控'}</h3>
        {editingId === null ? (
          <button onClick={() => setEditMode(!editMode)} style={{ color: editMode ? '#1677ff' : '#999' }}>
            {editMode ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>
      {renderContent()}
    </Popup>
  );
};

export default AIWatchPanel;
