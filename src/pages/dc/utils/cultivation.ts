/**
 * 修仙等级体系工具函数
 */

import {
  RealmType,
  StageType,
  LianqiLayer,
  REALM_CONFIG,
  STAGE_CONFIG,
  LIANQI_LAYER_NAMES,
  REALM_ORDER,
  STAGE_ORDER,
  getExpCap,
  getAllLevelExpCaps,
} from '../constants/cultivation';
import type {
  CultivationData,
  CurrentLevelInfo,
  SeclusionInfo,
} from '../types/cultivation';

/**
 * 获取等级显示名称
 */
export function getLevelDisplayName(
  realm: RealmType,
  stage: StageType | null,
  layer: LianqiLayer | null
): string {
  const realmInfo = REALM_CONFIG[realm];
  
  if (realm === 'LIANQI' && layer !== null) {
    return `${realmInfo.name} ${LIANQI_LAYER_NAMES[layer]}`;
  }
  
  if (stage !== null) {
    return `${realmInfo.name} ${STAGE_CONFIG[stage].name}`;
  }
  
  return realmInfo.name;
}

/**
 * 获取当前等级的修为上限
 */
export function getCurrentExpCap(data: CultivationData): number {
  return getExpCap(data.realm, data.stage, data.layer);
}

/**
 * 计算当前等级信息
 */
export function getCurrentLevelInfo(data: CultivationData): CurrentLevelInfo {
  const realmInfo = REALM_CONFIG[data.realm];
  const expCap = getCurrentExpCap(data);
  const progress = Math.min(100, (data.currentExp / expCap) * 100);
  const canBreakthrough = data.currentExp >= expCap;
  
  // 检查是否是最高等级
  const isMaxLevel = data.realm === 'DUJIE' && data.stage === 'PERFECT';
  
  // 获取下一等级信息
  let nextLevel: CurrentLevelInfo['nextLevel'] = null;
  if (!isMaxLevel) {
    const next = getNextLevel(data.realm, data.stage, data.layer);
    if (next) {
      nextLevel = {
        realm: next.realm,
        stage: next.stage,
        layer: next.layer,
        displayName: getLevelDisplayName(next.realm, next.stage, next.layer),
      };
    }
  }
  
  return {
    realm: data.realm,
    stage: data.stage,
    layer: data.layer,
    displayName: getLevelDisplayName(data.realm, data.stage, data.layer),
    color: realmInfo.color,
    colorLight: realmInfo.colorLight,
    currentExp: data.currentExp,
    expCap,
    progress,
    canBreakthrough,
    isMaxLevel,
    nextLevel,
  };
}

/**
 * 获取下一等级
 */
export function getNextLevel(
  realm: RealmType,
  stage: StageType | null,
  layer: LianqiLayer | null
): { realm: RealmType; stage: StageType | null; layer: LianqiLayer | null } | null {
  // 炼气期
  if (realm === 'LIANQI' && layer !== null) {
    if (layer < 13) {
      return { realm: 'LIANQI', stage: null, layer: (layer + 1) as LianqiLayer };
    }
    // 炼气期满，进入筑基期
    return { realm: 'ZHUJI', stage: 'EARLY', layer: null };
  }
  
  // 其他境界
  if (stage !== null) {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    if (stageIndex < STAGE_ORDER.length - 1) {
      // 同境界下一阶段
      return { realm, stage: STAGE_ORDER[stageIndex + 1], layer: null };
    }
    
    // 当前境界大圆满，进入下一境界
    const realmIndex = REALM_ORDER.indexOf(realm);
    if (realmIndex < REALM_ORDER.length - 1) {
      return { realm: REALM_ORDER[realmIndex + 1], stage: 'EARLY', layer: null };
    }
  }
  
  // 已是最高等级
  return null;
}

/**
 * 获取上一等级
 */
export function getPreviousLevel(
  realm: RealmType,
  stage: StageType | null,
  layer: LianqiLayer | null
): { realm: RealmType; stage: StageType | null; layer: LianqiLayer | null } | null {
  // 炼气期第一层，无法降级
  if (realm === 'LIANQI' && layer === 1) {
    return null;
  }
  
  // 炼气期
  if (realm === 'LIANQI' && layer !== null && layer > 1) {
    return { realm: 'LIANQI', stage: null, layer: (layer - 1) as LianqiLayer };
  }
  
  // 筑基期初期，降到炼气期13层
  if (realm === 'ZHUJI' && stage === 'EARLY') {
    return { realm: 'LIANQI', stage: null, layer: 13 };
  }
  
  // 其他境界
  if (stage !== null) {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    if (stageIndex > 0) {
      // 同境界上一阶段
      return { realm, stage: STAGE_ORDER[stageIndex - 1], layer: null };
    }
    
    // 当前境界初期，降到上一境界大圆满
    const realmIndex = REALM_ORDER.indexOf(realm);
    if (realmIndex > 1) {
      return { realm: REALM_ORDER[realmIndex - 1], stage: 'PERFECT', layer: null };
    }
  }
  
  return null;
}

/**
 * 检查是否跨大境界降级
 */
export function isCrossRealmDemotion(
  fromRealm: RealmType,
  toRealm: RealmType
): boolean {
  return fromRealm !== toRealm;
}

/**
 * 计算闭关信息
 */
export function getSeclusionInfo(data: CultivationData): SeclusionInfo | null {
  if (!data.seclusion || !data.seclusion.active) {
    return null;
  }
  
  const { seclusion } = data;
  const startDate = new Date(seclusion.startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, 15 - daysPassed);
  
  const progress = Math.min(100, (data.currentExp / seclusion.targetExp) * 100);
  const isTargetReached = data.currentExp >= seclusion.targetExp;
  
  const originalLevelName = getLevelDisplayName(
    seclusion.originalRealm,
    seclusion.originalStage,
    seclusion.originalLayer
  );
  
  return {
    active: true,
    remainingDays,
    currentExp: data.currentExp,
    targetExp: seclusion.targetExp,
    progress,
    isTargetReached,
    originalLevelName,
  };
}

/**
 * 获取等级索引（用于比较等级高低）
 */
export function getLevelIndex(
  realm: RealmType,
  stage: StageType | null,
  layer: LianqiLayer | null
): number {
  const levels = getAllLevelExpCaps();
  const index = levels.findIndex(l => 
    l.realm === realm && l.stage === stage && l.layer === layer
  );
  return index;
}

/**
 * 比较两个等级
 * 返回: 1 表示 a > b, -1 表示 a < b, 0 表示相等
 */
export function compareLevels(
  a: { realm: RealmType; stage: StageType | null; layer: LianqiLayer | null },
  b: { realm: RealmType; stage: StageType | null; layer: LianqiLayer | null }
): number {
  const indexA = getLevelIndex(a.realm, a.stage, a.layer);
  const indexB = getLevelIndex(b.realm, b.stage, b.layer);
  
  if (indexA > indexB) return 1;
  if (indexA < indexB) return -1;
  return 0;
}

/**
 * 生成唯一 ID
 */
export function generateCultivationId(): string {
  return `cult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取当前周的 key（用于历史记录存储）
 */
export function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

/**
 * 格式化修为数值
 */
export function formatExp(exp: number): string {
  if (exp >= 10000) {
    return `${(exp / 10000).toFixed(1)}万`;
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}千`;
  }
  return exp.toString();
}

/**
 * 获取境界图标 SVG 路径
 */
export function getRealmIconPath(realm: RealmType): string {
  const iconMap: Record<RealmType, string> = {
    LIANQI: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', // 叶子
    ZHUJI: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z', // 山
    JIEDAN: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z', // 宝石
    YUANYING: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z', // 圆
    HUASHEN: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', // 星
    LIANXU: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z', // 漩涡
    HETI: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z', // 阴阳
    DACHENG: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', // 大星
    DUJIE: 'M7 2v11h3v9l7-12h-4l4-8z', // 闪电
  };
  return iconMap[realm];
}

// ============ 修仙角色图片配置 ============

/** 修仙角色图片 URL 配置 */
export const CULTIVATION_IMAGES = {
  /** 炼气期第一层 */
  LIANQI_1: 'https://img.alicdn.com/imgextra/i4/O1CN01AJt8Vy1Z8kj4Wy2HF_!!6000000003150-2-tps-1080-1080.png',
  /** 炼气期第二层及以上 */
  LIANQI_2_PLUS: 'https://img.alicdn.com/imgextra/i3/O1CN01oJNcMp1pVE0mZXmZN_!!6000000005365-2-tps-1080-1080.png',
  /** 筑基期 */
  ZHUJI: 'https://img.alicdn.com/imgextra/i1/O1CN01tICvnF1fyP5QrvrmT_!!6000000004075-2-tps-1080-1080.png',
  /** 结丹期 */
  JIEDAN: 'https://img.alicdn.com/imgextra/i4/O1CN01PgwI9x1iAQibYKdsS_!!6000000004372-2-tps-1080-1080.png',
  /** 元婴初期 */
  YUANYING_EARLY: 'https://img.alicdn.com/imgextra/i2/O1CN01UIVfWz1Kgu1Nw0g60_!!6000000001194-2-tps-1080-1080.png',
  /** 元婴中期及以后（包括化神、炼虚、合体、大乘、渡劫） */
  YUANYING_MIDDLE_PLUS: 'https://img.alicdn.com/imgextra/i2/O1CN01zaGwe61Zge2E0JtNi_!!6000000003224-2-tps-1080-1080.png',
} as const;

/**
 * 根据修仙等级获取对应的角色图片
 * @param realm 境界
 * @param stage 阶段（筑基期及以上）
 * @param layer 层数（炼气期）
 * @returns 对应的图片 URL
 */
export function getCultivationImage(
  realm: RealmType,
  stage: StageType | null,
  layer: LianqiLayer | null
): string {
  // 炼气期
  if (realm === 'LIANQI') {
    if (layer === 1) {
      return CULTIVATION_IMAGES.LIANQI_1;
    }
    return CULTIVATION_IMAGES.LIANQI_2_PLUS;
  }

  // 筑基期
  if (realm === 'ZHUJI') {
    return CULTIVATION_IMAGES.ZHUJI;
  }

  // 结丹期
  if (realm === 'JIEDAN') {
    return CULTIVATION_IMAGES.JIEDAN;
  }

  // 元婴期
  if (realm === 'YUANYING') {
    if (stage === 'EARLY') {
      return CULTIVATION_IMAGES.YUANYING_EARLY;
    }
    return CULTIVATION_IMAGES.YUANYING_MIDDLE_PLUS;
  }

  // 化神期及以上（化神、炼虚、合体、大乘、渡劫）
  return CULTIVATION_IMAGES.YUANYING_MIDDLE_PLUS;
}

/**
 * 根据修仙数据获取对应的角色图片
 * @param data 修仙数据
 * @returns 对应的图片 URL
 */
export function getCultivationImageFromData(data: CultivationData): string {
  return getCultivationImage(data.realm, data.stage, data.layer);
}
