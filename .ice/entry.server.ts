import './env.server';
import * as runtime from '@ice/runtime/server';
import * as app from '@/app';
import Document from '@/document';
import type { RenderMode, DistType } from '@ice/runtime';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
// @ts-ignore
import assetsManifest from 'virtual:assets-manifest.json';
import createRoutes from './routes';
import routesConfig from './routes-config.bundle.mjs';

// Do not inject runtime modules when render mode is document only.
const commons = [];
const statics = [];
const runtimeModules = { commons, statics };

const getRouterBasename = () => {
  const appConfig = runtime.getAppConfig(app);
  return appConfig?.router?.basename ?? "/" ?? '';
}

const setRuntimeEnv = (renderMode) => {
  if (renderMode === 'SSG') {
    process.env.ICE_CORE_SSG = 'true';
  } else {
    process.env.ICE_CORE_SSR = 'true';
  }
}

interface RenderOptions {
  documentOnly?: boolean;
  renderMode?: RenderMode;
  basename?: string;
  serverOnlyBasename?: string;
  routePath?: string;
  disableFallback?: boolean;
  distType?: DistType;
  publicPath?: string;
  serverData?: any;
  streamOptions?: RenderToPipeableStreamOptions;
}

export async function renderToHTML(requestContext, options: RenderOptions = {}) {
  const { renderMode = 'SSR' } = options;
  setRuntimeEnv(renderMode);

  const mergedOptions = mergeOptions(options);
  return await runtime.renderToHTML(requestContext, mergedOptions);
}

export async function renderToResponse(requestContext, options: RenderOptions = {}) {
  const { renderMode = 'SSR' } = options;
  setRuntimeEnv(renderMode);

  const mergedOptions = mergeOptions(options);
  return runtime.renderToResponse(requestContext, mergedOptions);
}


function mergeOptions(options) {
  const { renderMode = 'SSR', basename, publicPath } = options;

  if (publicPath) {
    assetsManifest.publicPath = publicPath;
  }

  return {
    ...options,
    app,
    assetsManifest,
    createRoutes,
    runtimeModules,
    Document,
    basename: basename || getRouterBasename(),
    renderMode,
    routesConfig,
    runtimeOptions: {
            },
  };
}
