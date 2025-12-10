import type { CycleInfo, ValidationResult } from '../types';

/**
 * 周期计算工具类
 */
export class CycleCalculator {
  /**
   * 计算周期信息
   * @param totalDays 总天数
   * @param cycleDays 周期长度
   * @param minCheckIns 每周期最低打卡次数（默认3）
   * @returns 周期信息
   */
  static calculateCycleInfo(
    totalDays: number,
    cycleDays: number,
    minCheckIns: number = 3
  ): CycleInfo {
    const totalCycles = Math.floor(totalDays / cycleDays);
    const remainingDays = totalDays % cycleDays;
    const totalCheckInsNeeded = totalCycles * minCheckIns;
    const averageCheckInsPerWeek = Number(
      (totalCheckInsNeeded / (totalDays / 7)).toFixed(1)
    );
    
    return {
      totalCycles,
      remainingDays,
      totalCheckInsNeeded,
      averageCheckInsPerWeek
    };
  }
  
  /**
   * 验证周期配置
   * @param totalDays 总天数
   * @param cycleDays 周期长度
   * @returns 验证结果
   */
  static validateCycleConfig(
    totalDays: number,
    cycleDays: number
  ): ValidationResult {
    if (totalDays < cycleDays) {
      return {
        valid: false,
        message: '总时长必须大于周期长度'
      };
    }
    
    const totalCycles = Math.floor(totalDays / cycleDays);
    if (totalCycles < 1) {
      return {
        valid: false,
        message: '至少需要1个完整周期'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * 计算结束日期
   * @param startDate 开始日期
   * @param totalDays 总天数
   * @returns 结束日期（YYYY-MM-DD格式）
   */
  static calculateEndDate(startDate: string, totalDays: number): string {
    const end = new Date(startDate);
    end.setDate(end.getDate() + totalDays);
    return end.toISOString().split('T')[0];
  }
}
