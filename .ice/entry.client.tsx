
import '@ice/runtime/polyfills/signal';
import { createElement, Fragment } from 'react';
import { runClientApp, getAppConfig } from '@ice/runtime';
import { commons, statics } from './runtimeModules';
import * as app from '@/app';
import createRoutes from './routes';

const getRouterBasename = () => {
  const appConfig = getAppConfig(app);
  return appConfig?.router?.basename ?? "/" ?? '';
}
// Add react fragment for split chunks of app.
// Otherwise chunk of route component will pack @ice/jsx-runtime and depend on framework bundle.
const App = <></>;

let dataLoaderFetcher = (options) => {
  return window.fetch(options.url, options);
}

let dataLoaderDecorator = (dataLoader) => {
  return dataLoader;
}

const render = (customOptions: Record<string, any> = {}) => {
  const appProps = {
    app,
    runtimeModules: {
      commons,
      statics,
    },
    createRoutes,
    basename: getRouterBasename(),
    hydrate: false,
    memoryRouter: false,
    dataLoaderFetcher,
    dataLoaderDecorator,
    ...customOptions,
    runtimeOptions: {
          ...customOptions.runtimeOptions,
    },
  };
  return runClientApp(appProps);
};

render();

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
