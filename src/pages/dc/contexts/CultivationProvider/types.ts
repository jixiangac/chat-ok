/**
 * CultivationProvider 类型定义
 */

import type { RealmType, StageType, LianqiLayer } from '../../constants/cultivation';
import type { 
  CultivationData, 
  CultivationRecord, 
  CultivationHistory,
  CurrentLevelInfo,
  SeclusionInfo,
  CultivationRecordType
} from '../../types/cultivation';

/** 修为变动参数 */
export interface ExpChangeParams {
  /** 变动量 */
  amount: number;
  /** 变动类型 */
  type: CultivationRecordType;
  /** 关联任务 ID */
  taskId?: string;
  /** 关联任务标题 */
  taskTitle?: string;
  /** 描述 */
  description?: string;
}

/** 突破结果 */
export interface BreakthroughResult {
  success: boolean;
  message: string;
  newLevel?: {
    realm: RealmType;
    stage: StageType | null;
    layer: LianqiLayer | null;
    displayName: string;
  };
}

/** 闭关结果 */
export interface SeclusionResult {
  success: boolean;
  message: string;
  /** 是否保级成功 */
  preserved?: boolean;
  /** 降级后的等级 */
  demotedLevel?: {
    realm: RealmType;
    stage: StageType | null;
    layer: LianqiLayer | null;
    displayName: string;
  };
}

/** CultivationContext 值 */
export interface CultivationContextValue {
  // ========== 数据 ==========
  /** 修仙数据 */
  data: CultivationData;
  /** 当前等级信息（计算后） */
  levelInfo: CurrentLevelInfo;
  /** 闭关信息（计算后） */
  seclusionInfo: SeclusionInfo | null;
  /** 修为历史记录 */
  history: CultivationHistory;
  /** 是否正在加载 */
  loading: boolean;

  // ========== 修为操作 ==========
  /** 增加修为 */
  addExp: (params: ExpChangeParams) => void;
  /** 减少修为 */
  reduceExp: (params: ExpChangeParams) => void;
  /** 任务打卡获得修为 */
  gainExpFromCheckIn: (taskId: string, taskTitle: string, taskCategory: 'NUMERIC' | 'CHECKLIST' | 'CHECK_IN') => void;
  /** 周期结算奖励 */
  applyCycleReward: (completionRate: number, baseExp: number) => void;
  /** 周期结算惩罚 */
  applyCyclePenalty: () => void;

  // ========== 境界操作 ==========
  /** 突破 */
  breakthrough: () => BreakthroughResult;
  /** 检查并处理闭关结束 */
  checkSeclusionEnd: () => SeclusionResult | null;

  // ========== 历史记录 ==========
  /** 获取指定周的历史记录 */
  getWeekHistory: (weekKey: string) => CultivationRecord[];
  /** 获取最近的历史记录 */
  getRecentHistory: (limit?: number) => CultivationRecord[];

  // ========== 数据管理 ==========
  /** 重置数据 */
  resetData: () => void;
  /** 导出数据 */
  exportData: () => string;
  /** 导入数据 */
  importData: (jsonString: string) => boolean;
}
