import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import * as aloglist from '@/pages/aloglist';
import * as apply from '@/pages/apply';
import * as _ from '@/pages/index';
import * as open from '@/pages/open';
import * as pop from '@/pages/pop';

export default ({
  requestContext,
  renderMode,
}) => ([
  {
    path: 'aloglist',
    async lazy() {
      ;
      return {
        ...aloglist,
        Component: () => WrapRouteComponent({
          routeId: 'aloglist',
          isLayout: false,
          routeExports: aloglist,
        }),
        loader: createRouteLoader({
          routeId: 'aloglist',
          requestContext,
          renderMode,
          module: aloglist,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'aloglist',
    index: undefined,
    id: 'aloglist',
    exact: true,
    exports: ["default"],
  },{
    path: 'apply',
    async lazy() {
      ;
      return {
        ...apply,
        Component: () => WrapRouteComponent({
          routeId: 'apply',
          isLayout: false,
          routeExports: apply,
        }),
        loader: createRouteLoader({
          routeId: 'apply',
          requestContext,
          renderMode,
          module: apply,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'apply',
    index: undefined,
    id: 'apply',
    exact: true,
    exports: ["default"],
  },{
    path: '',
    async lazy() {
      ;
      return {
        ..._,
        Component: () => WrapRouteComponent({
          routeId: '/',
          isLayout: false,
          routeExports: _,
        }),
        loader: createRouteLoader({
          routeId: '/',
          requestContext,
          renderMode,
          module: _,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'index',
    index: true,
    id: '/',
    exact: true,
    exports: ["default"],
  },{
    path: 'open',
    async lazy() {
      ;
      return {
        ...open,
        Component: () => WrapRouteComponent({
          routeId: 'open',
          isLayout: false,
          routeExports: open,
        }),
        loader: createRouteLoader({
          routeId: 'open',
          requestContext,
          renderMode,
          module: open,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'open',
    index: undefined,
    id: 'open',
    exact: true,
    exports: ["default"],
  },{
    path: 'pop',
    async lazy() {
      ;
      return {
        ...pop,
        Component: () => WrapRouteComponent({
          routeId: 'pop',
          isLayout: false,
          routeExports: pop,
        }),
        loader: createRouteLoader({
          routeId: 'pop',
          requestContext,
          renderMode,
          module: pop,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'pop',
    index: undefined,
    id: 'pop',
    exact: true,
    exports: ["default"],
  },
]);
