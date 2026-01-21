/**
 * 周期完成奖励状态存储
 * 追踪每个任务各周期的奖励领取状态
 */

const STORAGE_KEY = 'dc_cycle_complete_rewards';

interface CycleRewardRecord {
  taskId: string;
  cycleNumber: number;
  rewardedAt: string;
}

interface CycleRewardsData {
  records: CycleRewardRecord[];
  lastCleanedAt: string;
}

/**
 * 加载周期奖励数据
 */
function loadCycleRewardsData(): CycleRewardsData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('加载周期奖励数据失败:', e);
  }
  return { records: [], lastCleanedAt: new Date().toISOString() };
}

/**
 * 保存周期奖励数据
 */
function saveCycleRewardsData(data: CycleRewardsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存周期奖励数据失败:', e);
  }
}

/**
 * 检查指定任务的指定周期是否已领取奖励
 */
export function hasCycleRewardClaimed(taskId: string, cycleNumber: number): boolean {
  const data = loadCycleRewardsData();
  return data.records.some(r => r.taskId === taskId && r.cycleNumber === cycleNumber);
}

/**
 * 标记指定任务的指定周期已领取奖励
 */
export function markCycleRewardClaimed(taskId: string, cycleNumber: number): void {
  const data = loadCycleRewardsData();
  
  // 检查是否已存在
  if (data.records.some(r => r.taskId === taskId && r.cycleNumber === cycleNumber)) {
    return;
  }
  
  data.records.push({
    taskId,
    cycleNumber,
    rewardedAt: new Date().toISOString(),
  });
  
  saveCycleRewardsData(data);
}

/**
 * 获取指定任务已领取奖励的周期列表
 */
export function getClaimedCycles(taskId: string): number[] {
  const data = loadCycleRewardsData();
  return data.records
    .filter(r => r.taskId === taskId)
    .map(r => r.cycleNumber);
}

/**
 * 清除指定任务的奖励记录（任务归档时调用）
 */
export function clearTaskCycleRewards(taskId: string): void {
  const data = loadCycleRewardsData();
  data.records = data.records.filter(r => r.taskId !== taskId);
  saveCycleRewardsData(data);
}

/**
 * 清理过期的奖励记录（保留最近30天的记录）
 */
export function cleanExpiredCycleRewards(): void {
  const data = loadCycleRewardsData();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  data.records = data.records.filter(r => {
    const rewardedAt = new Date(r.rewardedAt);
    return rewardedAt >= thirtyDaysAgo;
  });
  data.lastCleanedAt = new Date().toISOString();
  
  saveCycleRewardsData(data);
}
