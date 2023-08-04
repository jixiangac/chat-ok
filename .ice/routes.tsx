import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import * as _ from '@/pages/index';

export default ({
  requestContext,
  renderMode,
}) => ([
  {
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
  },
]);
