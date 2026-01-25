/**
 * 紫微斗数类型定义
 */

// 性别
export type Gender = 'male' | 'female';

// 日期类型
export type DateType = 'solar' | 'lunar';

// 出生信息
export interface BirthInfo {
  dateType: DateType;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: string;
  gender: Gender;
}

// 十二宫位键名
export type PalaceKey =
  | 'ming'      // 命宫
  | 'xiongdi'   // 兄弟
  | 'fuqi'      // 夫妻
  | 'zinv'      // 子女
  | 'caibo'     // 财帛
  | 'jie'       // 疾厄
  | 'qianyi'    // 迁移
  | 'jiaoyou'   // 交友
  | 'shiye'     // 事业
  | 'tianzhai'  // 田宅
  | 'fude'      // 福德
  | 'fumu';     // 父母

// 宫位信息
export interface Palace {
  name: string;           // 宫位名称
  earthlyBranch: string;  // 地支
  stars: {
    major: string[];      // 主星
    minor: string[];      // 辅星
    hua: string[];        // 四化星
  };
}

// 命盘数据
export interface ChartData {
  birthInfo: BirthInfo;
  trueSolarTime: {
    hour: number;
    minute: number;
  };
  // 农历日期（用于排盘计算）
  lunarDate: {
    year: number;
    month: number;
    day: number;
    isLeap: boolean;
  };
  // 公历日期（阳历输入时就是用户输入，阴历输入时是转换后的）
  solarDate: {
    year: number;
    month: number;
    day: number;
  };
  yearGanZhi: string;     // 年干支
  monthGanZhi: string;    // 月干支
  dayGanZhi: string;      // 日干支
  hourGanZhi: string;     // 时干支
  mingGongIndex: number;  // 命宫位置索引 (0-11)
  shenGongIndex: number;  // 身宫位置索引 (0-11)
  wuxingju: string;       // 五行局
  palaces: Record<PalaceKey, Palace>;
}

// 分析报告标签页
export type AnalysisTab = 'wealth' | 'emotion' | 'career';

// 页面步骤
export type ZiweiStep = 'intro' | 'input' | 'result' | 'analysis';

// 本地存储结构
export interface ZiweiStorage {
  birthInfo: BirthInfo | null;
  chartData: ChartData | null;
  lastGeneratedAt: string | null;
}

// 面板属性
export interface ZiweiPanelProps {
  visible: boolean;
  onClose: () => void;
}

// 介绍页属性
export interface IntroPageProps {
  onStart: () => void;
}

// 出生信息输入页属性
export interface BirthFormPageProps {
  initialValues?: Partial<BirthInfo>;
  onSubmit: (birthInfo: BirthInfo) => void;
  onBack: () => void;
  loading?: boolean;
}

// 命盘结果页属性
export interface ChartResultPageProps {
  chartData: ChartData;
  onAIAnalysis: () => void;
  onBack: () => void;
}

// AI 分析页属性
export interface AnalysisPageProps {
  chartData: ChartData;
  onBack: () => void;
}

// 命盘图属性
export interface ZiweiChartProps {
  chartData: ChartData;
}

// 分析报告属性
export interface ZiweiAnalysisReportProps {
  chartData: ChartData;
  activeTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
}
