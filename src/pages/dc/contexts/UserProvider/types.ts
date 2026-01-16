/**
 * UserProvider 类型定义
 * 管理用户信息、等级、索引配置
 */

// 用户基础信息
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  joinDate: string;
}

// 等级信息
export interface UserLevel {
  current: number;
  experience: number;
  nextLevelExp: number;
  title: string;
}

// 今日必完成状态
export interface TodayMustComplete {
  date: string; // YYYY-MM-DD
  taskIds: string[];
  skipped: boolean;
  hasShownModal: boolean;
  readOnly: boolean; // 只读模式
}

// 一日清单
export interface DailyChecklist {
  date: string;
  taskIds: string[];
  completedIds: string[];
}

// 用户统计
export interface UserStats {
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastActiveDate: string;
}

// 完整用户数据
export interface UserData {
  profile: UserProfile;
  level: UserLevel;
  todayMustComplete: TodayMustComplete;
  dailyChecklist: DailyChecklist;
  stats: UserStats;
}

// 等级配置
export interface LevelConfigItem {
  level: number;
  exp: number;
  title: string;
}

export const LEVEL_CONFIG: LevelConfigItem[] = [
  { level: 1, exp: 0, title: '新手' },
  { level: 2, exp: 100, title: '入门' },
  { level: 3, exp: 300, title: '进阶' },
  { level: 4, exp: 600, title: '熟练' },
  { level: 5, exp: 1000, title: '专家' },
  { level: 6, exp: 1500, title: '大师' },
  { level: 7, exp: 2100, title: '宗师' },
  { level: 8, exp: 2800, title: '传奇' },
  { level: 9, exp: 3600, title: '神话' },
  { level: 10, exp: 4500, title: '至尊' },
];

// 默认用户数据
export const defaultUserData: UserData = {
  profile: {
    id: '',
    name: '用户',
    joinDate: new Date().toISOString(),
  },
  level: {
    current: 1,
    experience: 0,
    nextLevelExp: 100,
    title: '新手',
  },
  todayMustComplete: {
    date: '',
    taskIds: [],
    skipped: false,
    hasShownModal: false,
    readOnly: false,
  },
  dailyChecklist: {
    date: '',
    taskIds: [],
    completedIds: [],
  },
  stats: {
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    lastActiveDate: '',
  },
};

// Context 值类型
export interface UserContextValue {
  // 数据
  userData: UserData;
  
  // 快捷访问
  profile: UserProfile;
  level: UserLevel;
  todayMustComplete: TodayMustComplete;
  dailyChecklist: DailyChecklist;
  stats: UserStats;
  
  // 用户信息操作
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // 今日必完成操作
  updateTodayMustComplete: (data: Partial<TodayMustComplete>) => void;
  setTodayMustCompleteTasks: (taskIds: string[]) => void;
  skipTodayMustComplete: () => void;
  markTodayMustCompleteShown: () => void;
  setTodayMustCompleteReadOnly: (readOnly: boolean) => void;
  checkAndShowTodayMustComplete: () => boolean; // 检查并返回是否需要显示弹窗
  
  // 一日清单操作
  updateDailyChecklist: (data: Partial<DailyChecklist>) => void;
  addToDailyChecklist: (taskId: string) => void;
  removeFromDailyChecklist: (taskId: string) => void;
  markDailyChecklistCompleted: (taskId: string) => void;
  
  // 经验和等级
  addExperience: (exp: number) => void;
  
  // 统计更新
  incrementTasksCompleted: () => void;
  updateStreak: () => void;
  incrementCheckIns: () => void;
  
  // 刷新
  refreshUserData: () => void;
}




