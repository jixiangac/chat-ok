import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',

    // 全局变量
    globals: true,

    // 包含的测试文件
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // 排除的文件
    exclude: ['node_modules', 'dist', '.ice'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 只统计已有测试的文件
      include: [
        'src/pages/dc/utils/checkInHelper.ts',
        'src/pages/dc/utils/todayProgressCalculator.ts',
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/**/__tests__/**',
      ],
      // 覆盖率阈值（仅针对已测试的文件）
      thresholds: {
        lines: 85,
        functions: 90,
        branches: 75,
        statements: 85,
      },
    },

    // 设置超时时间
    testTimeout: 10000,

    // 类型检查
    typecheck: {
      enabled: false,
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
