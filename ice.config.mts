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
  sourceMap: true,
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
  }
  // plugins: [def()],
}));
