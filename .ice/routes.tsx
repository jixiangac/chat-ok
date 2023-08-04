import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
export default ({
  requestContext,
  renderMode,
}) => ([
  {
    path: '',
    async lazy() {
      const componentModule = await import(/* webpackChunkName: "p_index" */ '@/pages/index');
      return {
        ...componentModule,
        Component: () => WrapRouteComponent({
          routeId: '/',
          isLayout: false,
          routeExports: componentModule,
        }),
        loader: createRouteLoader({
          routeId: '/',
          requestContext,
          renderMode,
          module: componentModule,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'index',
    index: true,
    id: '/',
    exact: true,
    exports: ["default"],
  },
]);
