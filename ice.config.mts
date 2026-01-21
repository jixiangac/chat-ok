import { defineConfig } from '@ice/app';
// import def from '@ali/ice-plugin-def';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  // Set your configs here.
  ssg: false,
  ssr: false,
  minify,
  codeSplitting: false,
  sourceMap: 'source-map',
  server: {
    onDemand: true,
    format: 'esm',
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
      // pathRewrite: { '^/api' : '' },
    },
    '/ai-api': {
      target: 'https://apis.iflow.cn',
      changeOrigin: true,
      pathRewrite: { '^/ai-api': '' },
      secure: true,
    },
  },
  // 排除测试文件和 fixtures 被路由系统解析
  routes: {
    ignoreFiles: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/__tests__/**',
    ],
  },
  // plugins: [def()],
}));

