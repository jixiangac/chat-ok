/**
 * 缓存管理器
 * 用于管理场景数据的缓存
 */

import type { SceneType, CacheEntry } from './types';

export class CacheManager {
  private cache: Map<string, Map<string, CacheEntry<any>>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * 获取缓存
   */
  get<T>(scene: SceneType, key: string): T | undefined {
    const sceneCache = this.cache.get(scene);
    if (!sceneCache) return undefined;

    const entry = sceneCache.get(key);
    if (!entry) return undefined;

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      sceneCache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * 设置缓存
   */
  set<T>(scene: SceneType, key: string, value: T, ttl?: number): void {
    if (!this.cache.has(scene)) {
      this.cache.set(scene, new Map());
    }

    const sceneCache = this.cache.get(scene)!;
    sceneCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * 删除缓存
   */
  delete(scene: SceneType, key: string): void {
    const sceneCache = this.cache.get(scene);
    if (sceneCache) {
      sceneCache.delete(key);
    }
  }

  /**
   * 清除场景缓存
   */
  clearScene(scene: SceneType): void {
    this.cache.delete(scene);
  }

  /**
   * 清除所有缓存
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(scene: SceneType, key: string): boolean {
    const value = this.get(scene, key);
    return value !== undefined;
  }

  /**
   * 获取缓存统计
   */
  getStats(scene?: SceneType) {
    if (scene) {
      const sceneCache = this.cache.get(scene);
      return {
        scene,
        size: sceneCache?.size || 0,
        keys: sceneCache ? Array.from(sceneCache.keys()) : [],
      };
    }

    return Array.from(this.cache.entries()).map(([sceneName, cache]) => ({
      scene: sceneName,
      size: cache.size,
      keys: Array.from(cache.keys()),
    }));
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((sceneCache, scene) => {
      sceneCache.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          sceneCache.delete(key);
        }
      });
      // 如果场景缓存为空，删除场景
      if (sceneCache.size === 0) {
        this.cache.delete(scene);
      }
    });
  }
}

// 创建全局缓存管理器实例
export const globalCacheManager = new CacheManager();
