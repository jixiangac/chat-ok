/**
 * 调试页面组件
 * 用于调试灵玉、修为数值和管理缓存
 */

import React, { useState, useCallback, useMemo, useReducer } from 'react';
import { Gem, Zap, AlertCircle, Plus, Minus, RotateCcw, Trash2, Database, RefreshCw, Skull } from 'lucide-react';
import { Toast, Input, Dialog } from 'antd-mobile';
import { SubPageLayout } from '../../components';
import { useCultivation } from '@/pages/dc/contexts';
import { clearDailyViewCache, clearRefreshStatus } from '@/pages/dc/utils/dailyViewCache';
import { clearCultivationData, clearSpiritJadeData } from '@/pages/dc/contexts/CultivationProvider/storage';
import { clearSceneData } from '@/pages/dc/contexts/SceneProvider/storage';
import styles from './styles.module.css';

export interface DebugPageProps {
  /** 返回上一页 */
  onBack: () => void;
}

// 灵玉图标
const SPIRIT_JADE_ICON = 'https://gw.alicdn.com/imgextra/i1/O1CN01dUkd0B1UxywsCCzXY_!!6000000002585-2-tps-1080-992.png';
// 修为图标
const CULTIVATION_ICON = 'https://gw.alicdn.com/imgextra/i3/O1CN01i3fa4U1waRq3yx5Ya_!!6000000006324-2-tps-1080-1034.png';

// Tab 类型
type DebugTab = 'jade' | 'cultivation' | 'cache';

// 缓存项定义
interface CacheItem {
  id: string;
  name: string;
  description: string;
  storageKeys: string[];
  clearFn?: () => void;
}

const DebugPage: React.FC<DebugPageProps> = ({ onBack }) => {
  const {
    spiritJadeData,
    levelInfo,
    data,
    debugSetSpiritJade,
    debugSetExp,
  } = useCultivation();

  // 当前 Tab
  const [activeTab, setActiveTab] = useState<DebugTab>('jade');
  // 灵玉输入状态
  const [jadeInput, setJadeInput] = useState(String(spiritJadeData.balance));
  // 修为输入状态
  const [expInput, setExpInput] = useState(String(data.currentExp));
  // 强制刷新缓存大小显示
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // 缓存项列表
  const cacheItems: CacheItem[] = useMemo(() => [
    {
      id: 'dailyView',
      name: '一日清单缓存',
      description: '清理今日筛选结果缓存，下次打开会重新生成',
      storageKeys: ['dc_daily_view_cache', 'dc_daily_view_refresh'],
      clearFn: () => {
        clearDailyViewCache();
        clearRefreshStatus();
      },
    },
    {
      id: 'dailyReward',
      name: '每日奖励追踪',
      description: '清理任务每日奖励上限记录',
      storageKeys: ['dc_daily_reward_tracker'],
    },
    {
      id: 'dailyCompleteReward',
      name: '清单完成奖励',
      description: '清理一日清单完成奖励领取状态',
      storageKeys: ['dc_daily_complete_reward'],
    },
    {
      id: 'spiritJadeHistory',
      name: '灵玉历史记录',
      description: '清理灵玉变动历史（不影响当前余额）',
      storageKeys: ['dc_points_history'],
    },
    {
      id: 'cultivationHistory',
      name: '修为历史记录',
      description: '清理修为变动历史（不影响当前修为）',
      storageKeys: ['dc_cultivation_history'],
    },
    {
      id: 'allCultivationData',
      name: '全部修仙数据',
      description: '⚠️ 危险：清除修为、灵玉等所有修仙进度',
      storageKeys: ['dc_cultivation_data', 'dc_cultivation_history', 'dc_spirit_jade_data', 'dc_points_history', 'dc_daily_complete_reward'],
      clearFn: () => {
        clearCultivationData();
        clearSpiritJadeData();
      },
    },
  ], []);

  // 获取缓存大小估算
  const getCacheSize = useCallback((keys: string[]): string => {
    try {
      let totalSize = 0;
      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length * 2; // UTF-16 编码，每字符2字节
        }
      }
      if (totalSize === 0) return '空';
      if (totalSize < 1024) return `${totalSize} B`;
      if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
      return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return '未知';
    }
  }, []);

  // 处理灵玉快捷增减
  const handleJadeQuickChange = useCallback((delta: number) => {
    const newValue = Math.max(0, spiritJadeData.balance + delta);
    debugSetSpiritJade(newValue);
    setJadeInput(String(newValue));
    Toast.show({
      content: `灵玉已设置为 ${newValue}`,
      position: 'bottom',
    });
  }, [spiritJadeData.balance, debugSetSpiritJade]);

  // 处理灵玉设置
  const handleSetJade = useCallback(() => {
    const value = parseInt(jadeInput, 10);
    if (isNaN(value) || value < 0) {
      Toast.show({
        icon: 'fail',
        content: '请输入有效的正整数',
      });
      return;
    }
    debugSetSpiritJade(value);
    Toast.show({
      content: `灵玉已设置为 ${value}`,
      position: 'bottom',
    });
  }, [jadeInput, debugSetSpiritJade]);

  // 处理灵玉归零
  const handleResetJade = useCallback(() => {
    debugSetSpiritJade(0);
    setJadeInput('0');
    Toast.show({
      content: '灵玉已归零',
      position: 'bottom',
    });
  }, [debugSetSpiritJade]);

  // 处理修为设置
  const handleSetExp = useCallback(() => {
    const value = parseInt(expInput, 10);
    if (isNaN(value) || value < 0) {
      Toast.show({
        icon: 'fail',
        content: '请输入有效的正整数',
      });
      return;
    }
    debugSetExp(value);
    Toast.show({
      content: `修为已设置为 ${value}`,
      position: 'bottom',
    });
  }, [expInput, debugSetExp]);

  // 处理修为快捷增减
  const handleExpQuickChange = useCallback((delta: number) => {
    const newValue = Math.max(0, data.currentExp + delta);
    debugSetExp(newValue);
    setExpInput(String(newValue));
    Toast.show({
      content: `修为已设置为 ${newValue}`,
      position: 'bottom',
    });
  }, [data.currentExp, debugSetExp]);

  // 处理修为归零
  const handleResetExp = useCallback(() => {
    debugSetExp(0);
    setExpInput('0');
    Toast.show({
      content: '修为已归零',
      position: 'bottom',
    });
  }, [debugSetExp]);

  // 处理清理单个缓存
  const handleClearCache = useCallback(async (item: CacheItem) => {
    const isDangerous = item.id === 'allCultivationData';

    const result = await Dialog.confirm({
      title: isDangerous ? '⚠️ 危险操作' : '确认清理',
      content: isDangerous
        ? `即将清除【${item.name}】，此操作不可恢复！清除后将刷新页面。确定继续？`
        : `确定要清理【${item.name}】吗？`,
      confirmText: isDangerous ? '确定清除' : '确定',
      cancelText: '取消',
    });

    if (result) {
      try {
        if (item.clearFn) {
          item.clearFn();
        } else {
          for (const key of item.storageKeys) {
            localStorage.removeItem(key);
          }
        }

        // 危险操作需要刷新页面才能让 Context 重新加载
        if (isDangerous) {
          Toast.show({
            icon: 'success',
            content: `${item.name} 已清理，即将刷新页面...`,
            position: 'bottom',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Toast.show({
            icon: 'success',
            content: `${item.name} 已清理`,
            position: 'bottom',
          });
          // 强制刷新缓存大小显示
          forceUpdate();
        }
      } catch (error) {
        Toast.show({
          icon: 'fail',
          content: '清理失败',
        });
      }
    }
  }, []);

  // 处理一键清理所有缓存（除了危险项）
  const handleClearAllSafeCache = useCallback(async () => {
    const result = await Dialog.confirm({
      title: '一键清理缓存',
      content: '将清理一日清单缓存、每日奖励追踪、清单完成奖励状态。不会影响灵玉余额和修为进度。确定继续？',
      confirmText: '确定',
      cancelText: '取消',
    });

    if (result) {
      try {
        // 清理一日清单缓存
        clearDailyViewCache();
        clearRefreshStatus();
        // 清理每日奖励追踪
        localStorage.removeItem('dc_daily_reward_tracker');
        // 清理清单完成奖励状态
        localStorage.removeItem('dc_daily_complete_reward');

        Toast.show({
          icon: 'success',
          content: '缓存已清理，重新打开一日清单即可生效',
          position: 'bottom',
        });
        // 强制刷新缓存大小显示
        forceUpdate();
      } catch (error) {
        Toast.show({
          icon: 'fail',
          content: '清理失败',
        });
      }
    }
  }, []);

  // 处理一键清理所有持久化数据
  const handleClearAllPersistence = useCallback(async () => {
    // 第一次确认
    const firstConfirm = await Dialog.confirm({
      title: '☠️ 极端危险操作',
      content: '此操作将清除所有本地数据，包括任务、修仙进度、设置等。此操作不可恢复！确定继续？',
      confirmText: '我了解风险',
      cancelText: '取消',
    });

    if (!firstConfirm) return;

    // 第二次确认：需要输入密码
    const password = await new Promise<string | null>((resolve) => {
      Dialog.confirm({
        title: '🔐 安全验证',
        content: (
          <div style={{ marginTop: 12 }}>
            <p style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>
              请输入验证码确认操作：
            </p>
            <Input
              id="clear-all-password"
              placeholder="输入验证码"
              style={{ '--font-size': '15px' } as React.CSSProperties}
              autoFocus
            />
          </div>
        ),
        confirmText: '确认清除',
        cancelText: '取消',
        onConfirm: () => {
          const input = document.getElementById('clear-all-password') as HTMLInputElement;
          resolve(input?.value || '');
        },
        onCancel: () => resolve(null),
      });
    });

    if (password === null) return;

    // 验证密码
    if (password !== 'jixiangac') {
      Toast.show({
        icon: 'fail',
        content: '验证码错误',
      });
      return;
    }

    try {
      // 获取所有 dc_ 开头的 localStorage 键
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dc_')) {
          keysToRemove.push(key);
        }
      }

      // 清除所有键
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      Toast.show({
        icon: 'success',
        content: `已清除 ${keysToRemove.length} 项数据，即将刷新页面...`,
        position: 'bottom',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '清理失败',
      });
    }
  }, []);

  // Tab 配置
  const tabs = [
    { key: 'jade' as DebugTab, label: '灵玉', icon: <img src={SPIRIT_JADE_ICON} alt="灵玉" className={styles.tabIcon} /> },
    { key: 'cultivation' as DebugTab, label: '修为', icon: <img src={CULTIVATION_ICON} alt="修为" className={styles.tabIcon} /> },
    { key: 'cache' as DebugTab, label: '缓存', icon: <Database size={16} /> },
  ];

  return (
    <SubPageLayout title="调试" onBack={onBack}>
      <div className={styles.container}>
        {/* 警告提示 */}
        <div className={styles.warningCard}>
          <AlertCircle size={20} className={styles.warningIcon} />
          <div className={styles.warningText}>
            <p className={styles.warningTitle}>开发者功能</p>
            <p className={styles.warningDesc}>
              直接修改数值或清理缓存，仅用于测试目的。
            </p>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 灵玉调试 Tab */}
        {activeTab === 'jade' && (
          <div className={styles.tabContent}>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>当前余额</span>
                <span className={styles.infoValue}>{spiritJadeData.balance}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>累计获得</span>
                <span className={styles.infoValue}>{spiritJadeData.totalEarned}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>累计消耗</span>
                <span className={styles.infoValue}>{spiritJadeData.totalSpent}</span>
              </div>
            </div>

            <div className={styles.inputCard}>
              <div className={styles.inputRow}>
                <Input
                  className={styles.input}
                  type="number"
                  value={jadeInput}
                  onChange={setJadeInput}
                  placeholder="输入灵玉数量"
                />
                <button className={styles.setButton} onClick={handleSetJade}>
                  设置
                </button>
              </div>
              <div className={styles.quickButtons}>
                <button className={styles.quickButton} onClick={() => handleJadeQuickChange(100)}>
                  <Plus size={14} /> 100
                </button>
                <button className={styles.quickButton} onClick={() => handleJadeQuickChange(500)}>
                  <Plus size={14} /> 500
                </button>
                <button className={styles.quickButton} onClick={() => handleJadeQuickChange(1000)}>
                  <Plus size={14} /> 1000
                </button>
                <button className={styles.quickButton} onClick={() => handleJadeQuickChange(-100)}>
                  <Minus size={14} /> 100
                </button>
                <button className={`${styles.quickButton} ${styles.resetButton}`} onClick={handleResetJade}>
                  <RotateCcw size={14} /> 归零
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 修为调试 Tab */}
        {activeTab === 'cultivation' && (
          <div className={styles.tabContent}>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>当前等级</span>
                <span className={styles.infoValue} style={{ color: levelInfo.color }}>
                  {levelInfo.displayName}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>当前修为</span>
                <span className={styles.infoValue}>{data.currentExp} / {levelInfo.expCap}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>进度</span>
                <span className={styles.infoValue}>{levelInfo.progress.toFixed(1)}%</span>
              </div>
            </div>

            <div className={styles.inputCard}>
              <div className={styles.inputRow}>
                <Input
                  className={styles.input}
                  type="number"
                  value={expInput}
                  onChange={setExpInput}
                  placeholder="输入修为数值"
                />
                <button className={styles.setButton} onClick={handleSetExp}>
                  设置
                </button>
              </div>
              <div className={styles.quickButtons}>
                <button className={styles.quickButton} onClick={() => handleExpQuickChange(100)}>
                  <Plus size={14} /> 100
                </button>
                <button className={styles.quickButton} onClick={() => handleExpQuickChange(500)}>
                  <Plus size={14} /> 500
                </button>
                <button className={styles.quickButton} onClick={() => handleExpQuickChange(1000)}>
                  <Plus size={14} /> 1000
                </button>
                <button className={styles.quickButton} onClick={() => handleExpQuickChange(-100)}>
                  <Minus size={14} /> 100
                </button>
                <button className={`${styles.quickButton} ${styles.resetButton}`} onClick={handleResetExp}>
                  <RotateCcw size={14} /> 归零
                </button>
              </div>
            </div>

            <div className={styles.helpCard}>
              <ul className={styles.helpList}>
                <li>设置后会自动计算并更新等级</li>
                <li>修为设置会清除闭关状态</li>
              </ul>
            </div>
          </div>
        )}

        {/* 缓存管理 Tab */}
        {activeTab === 'cache' && (
          <div className={styles.tabContent}>
            {/* 一键清理按钮 */}
            <button className={styles.clearAllButton} onClick={handleClearAllSafeCache}>
              <RefreshCw size={18} />
              <span>一键清理每日缓存</span>
            </button>

            {/* 缓存项列表 */}
            <div className={styles.cacheList}>
              {cacheItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.cacheItem} ${item.id === 'allCultivationData' ? styles.cacheItemDanger : ''}`}
                >
                  <div className={styles.cacheItemInfo}>
                    <div className={styles.cacheItemHeader}>
                      <span className={styles.cacheItemName}>{item.name}</span>
                      <span className={styles.cacheItemSize}>{getCacheSize(item.storageKeys)}</span>
                    </div>
                    <p className={styles.cacheItemDesc}>{item.description}</p>
                  </div>
                  <button
                    className={`${styles.cacheItemClearBtn} ${item.id === 'allCultivationData' ? styles.cacheItemClearBtnDanger : ''}`}
                    onClick={() => handleClearCache(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.helpCard}>
              <ul className={styles.helpList}>
                <li>一键清理：清除每日相关缓存，不影响进度</li>
                <li>单独清理：针对特定缓存进行清理</li>
                <li>红色项为危险操作，会清除进度数据</li>
              </ul>
            </div>

            {/* 极端危险：一键清理所有持久化 */}
            <div className={styles.dangerZone}>
              <div className={styles.dangerZoneHeader}>
                <Skull size={16} />
                <span>危险区域</span>
              </div>
              <button className={styles.clearAllPersistenceButton} onClick={handleClearAllPersistence}>
                <Skull size={18} />
                <span>一键清理所有持久化数据</span>
              </button>
              <p className={styles.dangerZoneDesc}>
                清除所有 dc_ 开头的本地存储数据，包括任务、设置、进度等。需要输入验证码确认。
              </p>
            </div>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
};

export default DebugPage;
