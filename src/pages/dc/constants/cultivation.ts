/**
 * 修仙等级体系常量配置
 * 基于《凡人修仙传》的修炼体系
 */

// ============ 境界类型 ============

/** 大境界类型 */
export type RealmType = 
  | 'LIANQI'    // 炼气期
  | 'ZHUJI'     // 筑基期
  | 'JIEDAN'    // 结丹期
  | 'YUANYING'  // 元婴期
  | 'HUASHEN'   // 化神期
  | 'LIANXU'    // 炼虚期
  | 'HETI'      // 合体期
  | 'DACHENG'   // 大乘期
  | 'DUJIE';    // 渡劫期

/** 阶段类型（筑基期及以上） */
export type StageType = 
  | 'EARLY'     // 初期
  | 'MIDDLE'    // 中期
  | 'LATE'      // 后期
  | 'PEAK'      // 巅峰
  | 'PERFECT';  // 大圆满

/** 炼气期层数 (1-13) */
export type LianqiLayer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

// ============ 境界配置 ============

/** 境界信息 */
export interface RealmInfo {
  type: RealmType;
  name: string;
  shortName: string;
  color: string;
  colorLight: string;
  icon: string;
  order: number;
}

/** 所有境界配置 */
export const REALM_CONFIG: Record<RealmType, RealmInfo> = {
  LIANQI: {
    type: 'LIANQI',
    name: '炼气期',
    shortName: '炼气',
    color: '#22C55E',
    colorLight: '#86EFAC',
    icon: 'leaf',
    order: 1,
  },
  ZHUJI: {
    type: 'ZHUJI',
    name: '筑基期',
    shortName: '筑基',
    color: '#0EA5E9',
    colorLight: '#7DD3FC',
    icon: 'mountain',
    order: 2,
  },
  JIEDAN: {
    type: 'JIEDAN',
    name: '结丹期',
    shortName: '结丹',
    color: '#A855F7',
    colorLight: '#D8B4FE',
    icon: 'gem',
    order: 3,
  },
  YUANYING: {
    type: 'YUANYING',
    name: '元婴期',
    shortName: '元婴',
    color: '#EC4899',
    colorLight: '#F9A8D4',
    icon: 'baby',
    order: 4,
  },
  HUASHEN: {
    type: 'HUASHEN',
    name: '化神期',
    shortName: '化神',
    color: '#EAB308',
    colorLight: '#FDE047',
    icon: 'sparkles',
    order: 5,
  },
  LIANXU: {
    type: 'LIANXU',
    name: '炼虚期',
    shortName: '炼虚',
    color: '#8B5CF6',
    colorLight: '#C4B5FD',
    icon: 'spiral',
    order: 6,
  },
  HETI: {
    type: 'HETI',
    name: '合体期',
    shortName: '合体',
    color: '#06B6D4',
    colorLight: '#67E8F9',
    icon: 'yinyang',
    order: 7,
  },
  DACHENG: {
    type: 'DACHENG',
    name: '大乘期',
    shortName: '大乘',
    color: '#F97316',
    colorLight: '#FDBA74',
    icon: 'star',
    order: 8,
  },
  DUJIE: {
    type: 'DUJIE',
    name: '渡劫期',
    shortName: '渡劫',
    color: '#FBBF24',
    colorLight: '#FDE68A',
    icon: 'lightning',
    order: 9,
  },
};

/** 阶段配置 */
export const STAGE_CONFIG: Record<StageType, { name: string; order: number }> = {
  EARLY: { name: '初期', order: 1 },
  MIDDLE: { name: '中期', order: 2 },
  LATE: { name: '后期', order: 3 },
  PEAK: { name: '巅峰', order: 4 },
  PERFECT: { name: '大圆满', order: 5 },
};

/** 炼气期层数名称 */
export const LIANQI_LAYER_NAMES: Record<LianqiLayer, string> = {
  1: '第一层',
  2: '第二层',
  3: '第三层',
  4: '第四层',
  5: '第五层',
  6: '第六层',
  7: '第七层',
  8: '第八层',
  9: '第九层',
  10: '第十层',
  11: '第十一层',
  12: '第十二层',
  13: '第十三层',
};

// ============ 修为配置 ============

/** 炼气期基础修为值 */
export const BASE_CULTIVATION = 100;

/** 炼气期每层增长率 */
export const LIANQI_GROWTH_RATE = 0.05;

/** 跨大境界增长率 */
export const REALM_GROWTH_RATE = 0.15;

/** 同境界内阶段增长率 */
export const STAGE_GROWTH_RATE = 0.10;

/** 任务修为获取配置 */
export const TASK_EXP_CONFIG = {
  NUMERIC: 10,    // 数值型任务每次打卡
  CHECKLIST: 5,   // 清单型任务每项完成
  CHECK_IN: 8,    // 打卡型任务每次打卡
};

/** 周期结算配置 */
export const CYCLE_REWARD_CONFIG = {
  threshold: 0.3,           // 30% 完成度触发奖励
  baseMultiplier: 1.0,      // 基础倍率
  fullCompletionBonus: 0.2, // 100% 完成额外 +20%
};

/** 修为惩罚配置（按境界） */
export const PENALTY_CONFIG: Record<RealmType, number> = {
  LIANQI: 5,
  ZHUJI: 10,
  JIEDAN: 15,
  YUANYING: 20,
  HUASHEN: 25,
  LIANXU: 30,
  HETI: 35,
  DACHENG: 40,
  DUJIE: 50,
};

/** 闭关保护配置 */
export const SECLUSION_CONFIG = {
  duration: 15,  // 闭关时长（天）
};

// ============ 修为范围计算 ============

/**
 * 计算炼气期某层的修为上限
 * @param layer 层数 1-13
 */
export function getLianqiExpCap(layer: LianqiLayer): number {
  let cap = BASE_CULTIVATION;
  for (let i = 1; i < layer; i++) {
    cap = Math.floor(cap * (1 + LIANQI_GROWTH_RATE));
  }
  return cap;
}

/**
 * 计算某境界某阶段的修为上限
 * @param realm 境界
 * @param stage 阶段（炼气期传 null）
 * @param layer 炼气期层数（非炼气期传 null）
 */
export function getExpCap(
  realm: RealmType, 
  stage: StageType | null, 
  layer: LianqiLayer | null
): number {
  if (realm === 'LIANQI' && layer !== null) {
    return getLianqiExpCap(layer);
  }

  // 获取炼气期13层的上限作为基础
  let cap = getLianqiExpCap(13);

  // 计算到当前境界需要经过多少个大境界
  const realmOrder = REALM_CONFIG[realm].order;
  for (let i = 2; i <= realmOrder; i++) {
    cap = Math.floor(cap * (1 + REALM_GROWTH_RATE));
    
    // 如果不是目标境界，还需要经过5个阶段
    if (i < realmOrder) {
      for (let j = 1; j < 5; j++) {
        cap = Math.floor(cap * (1 + STAGE_GROWTH_RATE));
      }
    }
  }

  // 计算当前境界内的阶段
  if (stage !== null) {
    const stageOrder = STAGE_CONFIG[stage].order;
    for (let i = 1; i < stageOrder; i++) {
      cap = Math.floor(cap * (1 + STAGE_GROWTH_RATE));
    }
  }

  return cap;
}

/**
 * 获取所有等级的修为范围
 * 返回一个数组，每个元素包含境界、阶段/层数、修为上限
 */
export function getAllLevelExpCaps(): Array<{
  realm: RealmType;
  stage: StageType | null;
  layer: LianqiLayer | null;
  expCap: number;
  displayName: string;
}> {
  const levels: Array<{
    realm: RealmType;
    stage: StageType | null;
    layer: LianqiLayer | null;
    expCap: number;
    displayName: string;
  }> = [];

  // 炼气期 13 层
  for (let i = 1; i <= 13; i++) {
    const layer = i as LianqiLayer;
    levels.push({
      realm: 'LIANQI',
      stage: null,
      layer,
      expCap: getLianqiExpCap(layer),
      displayName: `${REALM_CONFIG.LIANQI.name} ${LIANQI_LAYER_NAMES[layer]}`,
    });
  }

  // 筑基期及以上，每个境界5个阶段
  const realmsAfterLianqi: RealmType[] = [
    'ZHUJI', 'JIEDAN', 'YUANYING', 'HUASHEN', 
    'LIANXU', 'HETI', 'DACHENG', 'DUJIE'
  ];
  const stages: StageType[] = ['EARLY', 'MIDDLE', 'LATE', 'PEAK', 'PERFECT'];

  for (const realm of realmsAfterLianqi) {
    for (const stage of stages) {
      levels.push({
        realm,
        stage,
        layer: null,
        expCap: getExpCap(realm, stage, null),
        displayName: `${REALM_CONFIG[realm].name} ${STAGE_CONFIG[stage].name}`,
      });
    }
  }

  return levels;
}

// ============ 境界顺序 ============

/** 所有境界按顺序排列 */
export const REALM_ORDER: RealmType[] = [
  'LIANQI', 'ZHUJI', 'JIEDAN', 'YUANYING', 
  'HUASHEN', 'LIANXU', 'HETI', 'DACHENG', 'DUJIE'
];

/** 所有阶段按顺序排列 */
export const STAGE_ORDER: StageType[] = [
  'EARLY', 'MIDDLE', 'LATE', 'PEAK', 'PERFECT'
];
