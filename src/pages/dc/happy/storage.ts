// 度假模式数据存储工具
import dayjs from 'dayjs';
import { Trip, TripGoal, TripSchedule, VacationModeState } from './types';

const TRIPS_STORAGE_KEY = 'vacation_trips';
const VACATION_STATE_KEY = 'vacation_mode_state';

// 加载所有行程
export const loadTrips = (): Trip[] => {
  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load trips:', error);
    return [];
  }
};

// 保存所有行程
export const saveTrips = (trips: Trip[]) => {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Failed to save trips:', error);
  }
};

// 获取单个行程
export const getTrip = (tripId: string): Trip | null => {
  const trips = loadTrips();
  return trips.find(t => t.id === tripId) || null;
};

// 创建新行程
export const createTrip = (
  name: string,
  startDate: string,
  totalDays: number,
  hasPreparation: boolean
): Trip => {
  const now = new Date().toISOString();
  const schedules: TripSchedule[] = [];

  // 添加出发准备日程
  if (hasPreparation) {
    schedules.push({
      id: `prep_${Date.now()}`,
      type: 'preparation',
      label: '准备',
      goals: [],
      isCompleted: false
    });
  }

  // 添加每日日程
  const start = new Date(startDate);
  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i - 1);
    
    schedules.push({
      id: `day_${i}_${Date.now()}`,
      type: 'day',
      dayNumber: i,
      label: `D${i}`,
      date: dayjs(dayDate).format('YYYY-MM-DD'),
      goals: [],
      isCompleted: false
    });
  }

  const trip: Trip = {
    id: `trip_${Date.now()}`,
    name,
    startDate,
    totalDays,
    hasPreparation,
    schedules,
    createdAt: now,
    updatedAt: now,
    isCompleted: false,
    totalPoints: 0
  };

  const trips = loadTrips();
  trips.push(trip);
  saveTrips(trips);

  return trip;
};

// 更新行程
export const updateTrip = (tripId: string, updates: Partial<Trip>) => {
  const trips = loadTrips();
  const index = trips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveTrips(trips);
    return trips[index];
  }
  return null;
};

// 删除行程
export const deleteTrip = (tripId: string) => {
  const trips = loadTrips();
  const filtered = trips.filter(t => t.id !== tripId);
  saveTrips(filtered);
};

// 添加目标到日程
export const addGoalToSchedule = (
  tripId: string,
  scheduleId: string,
  goal: Omit<TripGoal, 'id' | 'status'>
): TripGoal | null => {
  const trips = loadTrips();
  const tripIndex = trips.findIndex(t => t.id === tripId);
  
  if (tripIndex === -1) return null;
  
  const scheduleIndex = trips[tripIndex].schedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) return null;

  const newGoal: TripGoal = {
    ...goal,
    id: `goal_${Date.now()}`,
    status: 'pending'
  };

  trips[tripIndex].schedules[scheduleIndex].goals.push(newGoal);
  // 按时间排序
  trips[tripIndex].schedules[scheduleIndex].goals.sort((a, b) => 
    a.time.localeCompare(b.time)
  );
  trips[tripIndex].updatedAt = new Date().toISOString();
  
  saveTrips(trips);
  return newGoal;
};

// 更新目标
export const updateGoal = (
  tripId: string,
  scheduleId: string,
  goalId: string,
  updates: Partial<TripGoal>
) => {
  const trips = loadTrips();
  const tripIndex = trips.findIndex(t => t.id === tripId);
  
  if (tripIndex === -1) return null;
  
  const scheduleIndex = trips[tripIndex].schedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) return null;

  const goalIndex = trips[tripIndex].schedules[scheduleIndex].goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) return null;

  trips[tripIndex].schedules[scheduleIndex].goals[goalIndex] = {
    ...trips[tripIndex].schedules[scheduleIndex].goals[goalIndex],
    ...updates
  };
  trips[tripIndex].updatedAt = new Date().toISOString();
  
  saveTrips(trips);
  return trips[tripIndex].schedules[scheduleIndex].goals[goalIndex];
};

// 删除目标
export const deleteGoal = (tripId: string, scheduleId: string, goalId: string) => {
  const trips = loadTrips();
  const tripIndex = trips.findIndex(t => t.id === tripId);
  
  if (tripIndex === -1) return;
  
  const scheduleIndex = trips[tripIndex].schedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) return;

  trips[tripIndex].schedules[scheduleIndex].goals = 
    trips[tripIndex].schedules[scheduleIndex].goals.filter(g => g.id !== goalId);
  trips[tripIndex].updatedAt = new Date().toISOString();
  
  saveTrips(trips);
};

// 完成目标
export const completeGoal = (tripId: string, scheduleId: string, goalId: string) => {
  const result = updateGoal(tripId, scheduleId, goalId, { status: 'completed' });
  if (result) {
    // 计算积分
    const trips = loadTrips();
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex !== -1) {
      trips[tripIndex].totalPoints += 10; // 完成目标 +10分
      
      // 检查日程是否全部完成
      const scheduleIndex = trips[tripIndex].schedules.findIndex(s => s.id === scheduleId);
      if (scheduleIndex !== -1) {
        const schedule = trips[tripIndex].schedules[scheduleIndex];
        const allCompleted = schedule.goals.every(g => g.status === 'completed');
        if (allCompleted && schedule.goals.length > 0) {
          trips[tripIndex].schedules[scheduleIndex].isCompleted = true;
          trips[tripIndex].totalPoints += 30; // 日程全完成 +30分
        }
      }
      
      // 检查行程是否全部完成
      const allSchedulesCompleted = trips[tripIndex].schedules.every(s => s.isCompleted);
      if (allSchedulesCompleted) {
        trips[tripIndex].isCompleted = true;
        trips[tripIndex].totalPoints += 100; // 行程全完成 +100分
      }
      
      saveTrips(trips);
    }
  }
  return result;
};

// 加载度假模式状态
export const loadVacationState = (): VacationModeState => {
  try {
    const stored = localStorage.getItem(VACATION_STATE_KEY);
    return stored ? JSON.parse(stored) : {
      isActive: false,
      currentTripId: null,
      currentScheduleId: null
    };
  } catch (error) {
    console.error('Failed to load vacation state:', error);
    return {
      isActive: false,
      currentTripId: null,
      currentScheduleId: null
    };
  }
};

// 保存度假模式状态
export const saveVacationState = (state: VacationModeState) => {
  try {
    localStorage.setItem(VACATION_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save vacation state:', error);
  }
};

// 计算行程统计
export const calculateTripStats = (trip: Trip) => {
  let totalGoals = 0;
  let completedGoals = 0;
  const dailyRates: { label: string; rate: number }[] = [];

  trip.schedules.forEach(schedule => {
    const scheduleTotal = schedule.goals.length;
    const scheduleCompleted = schedule.goals.filter(g => g.status === 'completed').length;
    
    totalGoals += scheduleTotal;
    completedGoals += scheduleCompleted;
    
    dailyRates.push({
      label: schedule.label,
      rate: scheduleTotal > 0 ? Math.round((scheduleCompleted / scheduleTotal) * 100) : 0
    });
  });

  return {
    totalGoals,
    completedGoals,
    completionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
    dailyRates
  };
};
