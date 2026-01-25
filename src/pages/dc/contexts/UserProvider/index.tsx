/**
 * UserProvider - 用户信息管理
 * 管理用户信息、等级、今日必完成、一日清单等
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type {
  UserContextValue,
  UserData,
  UserProfile,
  TodayMustComplete,
  DailyChecklist
} from './types';
import { defaultUserData, LEVEL_CONFIG } from './types';
import { loadUserData, saveUserData, getTodayDateString, isYesterday } from './storage';
import { DATE_CHANGE_EVENT } from '../AppProvider';
import {
  saveTodayMustCompleteState as saveTodayMustCompleteToLegacy,
} from '../../utils/todayMustCompleteStorage';

// 创建 Context
const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

// 计算等级信息
const calculateLevel = (experience: number) => {
  let currentLevel = LEVEL_CONFIG[0];
  let nextLevel = LEVEL_CONFIG[1];
  
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (experience >= LEVEL_CONFIG[i].exp) {
      currentLevel = LEVEL_CONFIG[i];
      nextLevel = LEVEL_CONFIG[i + 1] || LEVEL_CONFIG[i];
      break;
    }
  }
  
  return {
    current: currentLevel.level,
    experience,
    nextLevelExp: nextLevel.exp,
    title: currentLevel.title,
  };
};

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const loaded = loadUserData();

    // 检查并重置过期的今日必完成
    const today = getTodayDateString();
    if (loaded.todayMustComplete.date !== today) {
      loaded.todayMustComplete = {
        date: today,
        taskIds: [],
        skipped: false,
        hasShownModal: false,
        readOnly: false,
      };
    }

    // 检查并重置过期的一日清单
    if (loaded.dailyChecklist.date !== today) {
      loaded.dailyChecklist = {
        date: today,
        taskIds: [],
        completedIds: [],
      };
    }

    // 检查连续打卡
    if (loaded.stats.lastActiveDate && !isYesterday(loaded.stats.lastActiveDate)) {
      // 如果上次活跃不是昨天，重置连续天数
      if (loaded.stats.lastActiveDate !== today) {
        loaded.stats.currentStreak = 0;
      }
    }

    setUserData(loaded);
    saveUserData(loaded);

    // 同步写入 legacy 存储，确保奖励计算能正确读取
    saveTodayMustCompleteToLegacy({
      date: loaded.todayMustComplete.date,
      taskIds: loaded.todayMustComplete.taskIds,
      skipped: loaded.todayMustComplete.skipped,
      hasShownModal: loaded.todayMustComplete.hasShownModal,
    });
  }, []);

  // 监听日期变化事件（包括测试日期变化）
  useEffect(() => {
    const handleDateChange = () => {
      const today = getTodayDateString();

      setUserData(prev => {
        // 检查今日必完成的日期是否过期
        if (prev.todayMustComplete.date !== today) {
          const newTodayMustComplete = {
            date: today,
            taskIds: [],
            skipped: false,
            hasShownModal: false,
            readOnly: false,
          };

          const newData = {
            ...prev,
            todayMustComplete: newTodayMustComplete,
            // 同时重置一日清单
            dailyChecklist: prev.dailyChecklist.date !== today ? {
              date: today,
              taskIds: [],
              completedIds: [],
            } : prev.dailyChecklist,
          };
          saveUserData(newData);

          // 同步重置 legacy 存储
          saveTodayMustCompleteToLegacy({
            date: today,
            taskIds: [],
            skipped: false,
            hasShownModal: false,
          });

          return newData;
        }
        return prev;
      });
    };

    window.addEventListener(DATE_CHANGE_EVENT, handleDateChange);
    return () => {
      window.removeEventListener(DATE_CHANGE_EVENT, handleDateChange);
    };
  }, []);

  // 更新用户信息
  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        profile: { ...prev.profile, ...profile },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 更新今日必完成
  const updateTodayMustComplete = useCallback((data: Partial<TodayMustComplete>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        todayMustComplete: { ...prev.todayMustComplete, ...data },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 设置今日必完成任务
  const setTodayMustCompleteTasks = useCallback((taskIds: string[]) => {
    const today = getTodayDateString();
    const newTodayMustComplete = {
      date: today,
      taskIds: taskIds.slice(0, 3), // 最多3个
      skipped: false,
      hasShownModal: true,
      readOnly: true, // 设置任务后进入只读模式
    };

    setUserData(prev => {
      const newData = {
        ...prev,
        todayMustComplete: newTodayMustComplete,
      };
      saveUserData(newData);
      return newData;
    });

    // 同步写入 legacy 存储 (dc_today_must_complete)，供奖励计算使用
    saveTodayMustCompleteToLegacy({
      date: today,
      taskIds: taskIds.slice(0, 3),
      skipped: false,
      hasShownModal: true,
    });
  }, []);

  // 跳过今日必完成
  const skipTodayMustComplete = useCallback(() => {
    const today = getTodayDateString();
    setUserData(prev => {
      const newData = {
        ...prev,
        todayMustComplete: {
          date: today,
          taskIds: [],
          skipped: true,
          hasShownModal: true,
          readOnly: false, // 跳过不设置只读模式
        },
      };
      saveUserData(newData);
      return newData;
    });

    // 同步写入 legacy 存储
    saveTodayMustCompleteToLegacy({
      date: today,
      taskIds: [],
      skipped: true,
      hasShownModal: true,
    });
  }, []);

  // 标记今日必完成弹窗已显示
  const markTodayMustCompleteShown = useCallback(() => {
    setUserData(prev => {
      const newData = {
        ...prev,
        todayMustComplete: { ...prev.todayMustComplete, hasShownModal: true },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 设置今日必完成只读模式
  const setTodayMustCompleteReadOnly = useCallback((readOnly: boolean) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        todayMustComplete: { ...prev.todayMustComplete, readOnly },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 检查是否需要显示今日必完成弹窗
  const checkAndShowTodayMustComplete = useCallback((): boolean => {
    const today = getTodayDateString();
    const { date, hasShownModal, skipped, taskIds } = userData.todayMustComplete;
    
    // 如果是今天且未显示过弹窗且未跳过且未选择任务
    if (date === today && !hasShownModal && !skipped && taskIds.length === 0) {
      return true;
    }
    
    return false;
  }, [userData.todayMustComplete]);

  // 更新一日清单
  const updateDailyChecklist = useCallback((data: Partial<DailyChecklist>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        dailyChecklist: { ...prev.dailyChecklist, ...data },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 添加到一日清单
  const addToDailyChecklist = useCallback((taskId: string) => {
    setUserData(prev => {
      if (prev.dailyChecklist.taskIds.includes(taskId)) {
        return prev;
      }
      const newData = {
        ...prev,
        dailyChecklist: {
          ...prev.dailyChecklist,
          taskIds: [...prev.dailyChecklist.taskIds, taskId],
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 从一日清单移除
  const removeFromDailyChecklist = useCallback((taskId: string) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        dailyChecklist: {
          ...prev.dailyChecklist,
          taskIds: prev.dailyChecklist.taskIds.filter(id => id !== taskId),
          completedIds: prev.dailyChecklist.completedIds.filter(id => id !== taskId),
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 标记一日清单任务完成
  const markDailyChecklistCompleted = useCallback((taskId: string) => {
    setUserData(prev => {
      if (prev.dailyChecklist.completedIds.includes(taskId)) {
        return prev;
      }
      const newData = {
        ...prev,
        dailyChecklist: {
          ...prev.dailyChecklist,
          completedIds: [...prev.dailyChecklist.completedIds, taskId],
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 添加经验
  const addExperience = useCallback((exp: number) => {
    setUserData(prev => {
      const newExperience = prev.level.experience + exp;
      const newLevel = calculateLevel(newExperience);
      const newData = {
        ...prev,
        level: newLevel,
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 增加完成任务数
  const incrementTasksCompleted = useCallback(() => {
    setUserData(prev => {
      const newData = {
        ...prev,
        stats: {
          ...prev.stats,
          totalTasksCompleted: prev.stats.totalTasksCompleted + 1,
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 更新连续天数
  const updateStreak = useCallback(() => {
    const today = getTodayDateString();
    setUserData(prev => {
      const lastActive = prev.stats.lastActiveDate;
      let newStreak = prev.stats.currentStreak;
      
      if (lastActive !== today) {
        if (isYesterday(lastActive)) {
          newStreak += 1;
        } else if (lastActive !== today) {
          newStreak = 1;
        }
      }
      
      const newData = {
        ...prev,
        stats: {
          ...prev.stats,
          currentStreak: newStreak,
          longestStreak: Math.max(prev.stats.longestStreak, newStreak),
          lastActiveDate: today,
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 增加打卡次数
  const incrementCheckIns = useCallback(() => {
    setUserData(prev => {
      const newData = {
        ...prev,
        stats: {
          ...prev.stats,
          totalCheckIns: prev.stats.totalCheckIns + 1,
        },
      };
      saveUserData(newData);
      return newData;
    });
  }, []);

  // 刷新用户数据
  const refreshUserData = useCallback(() => {
    const loaded = loadUserData();
    setUserData(loaded);
  }, []);

  const value: UserContextValue = {
    userData,
    profile: userData.profile,
    level: userData.level,
    todayMustComplete: userData.todayMustComplete,
    dailyChecklist: userData.dailyChecklist,
    stats: userData.stats,
    updateProfile,
    updateTodayMustComplete,
    setTodayMustCompleteTasks,
    skipTodayMustComplete,
    markTodayMustCompleteShown,
    setTodayMustCompleteReadOnly,
    checkAndShowTodayMustComplete,
    updateDailyChecklist,
    addToDailyChecklist,
    removeFromDailyChecklist,
    markDailyChecklistCompleted,
    addExperience,
    incrementTasksCompleted,
    updateStreak,
    incrementCheckIns,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * 使用用户数据的 Hook
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// 导出类型
export type { 
  UserData, 
  UserProfile, 
  UserLevel, 
  TodayMustComplete, 
  DailyChecklist, 
  UserStats 
} from './types';





