import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import * as dc_detail_CheckInRecordPanel from '@/pages/dc/detail/CheckInRecordPanel';
import * as dc_detail_CycleSummaryDialog from '@/pages/dc/detail/CycleSummaryDialog';
import * as dc_detail_CurrentCyclePanel from '@/pages/dc/detail/CurrentCyclePanel';
import * as dc_detail_ProgressSection from '@/pages/dc/detail/ProgressSection';
import * as dc_card_MainlineTaskCard from '@/pages/dc/card/MainlineTaskCard';
import * as dc_card_SidelineTaskCard from '@/pages/dc/card/SidelineTaskCard';
import * as dc_utils_cycleCalculator from '@/pages/dc/utils/cycleCalculator';
import * as dc_detail_GoalHeader from '@/pages/dc/detail/GoalHeader';
import * as dc_CreateGoalModal from '@/pages/dc/CreateGoalModal';
import * as dc_detail_example from '@/pages/dc/detail/example';
import * as dc_detail_TabBar from '@/pages/dc/detail/TabBar';
import * as dc_detail_hooks from '@/pages/dc/detail/hooks';
import * as dc_detail from '@/pages/dc/detail/index';
import * as dc_detail_types from '@/pages/dc/detail/types';
import * as dc_card from '@/pages/dc/card/index';
import * as stock_self from '@/pages/stock_self';
import * as aloglist from '@/pages/aloglist';
import * as dc_types from '@/pages/dc/types';
import * as aitrend from '@/pages/aitrend';
import * as apply from '@/pages/apply';
import * as image from '@/pages/image';
import * as _ from '@/pages/index';
import * as intro from '@/pages/intro';
import * as stock from '@/pages/stock';
import * as demo from '@/pages/demo';
import * as open from '@/pages/open';
import * as pop from '@/pages/pop';

export default ({
  requestContext,
  renderMode,
}) => ([
  {
    path: 'dc/detail/CheckInRecordPanel',
    async lazy() {
      ;
      return {
        ...dc_detail_CheckInRecordPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/CheckInRecordPanel',
          isLayout: false,
          routeExports: dc_detail_CheckInRecordPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/CheckInRecordPanel',
          requestContext,
          renderMode,
          module: dc_detail_CheckInRecordPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-checkinrecordpanel',
    index: undefined,
    id: 'dc/detail/CheckInRecordPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/CycleSummaryDialog',
    async lazy() {
      ;
      return {
        ...dc_detail_CycleSummaryDialog,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/CycleSummaryDialog',
          isLayout: false,
          routeExports: dc_detail_CycleSummaryDialog,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/CycleSummaryDialog',
          requestContext,
          renderMode,
          module: dc_detail_CycleSummaryDialog,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-cyclesummarydialog',
    index: undefined,
    id: 'dc/detail/CycleSummaryDialog',
    exact: true,
    exports: ["showCycleSummaryDialog"],
  },{
    path: 'dc/detail/CurrentCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_detail_CurrentCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/CurrentCyclePanel',
          isLayout: false,
          routeExports: dc_detail_CurrentCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/CurrentCyclePanel',
          requestContext,
          renderMode,
          module: dc_detail_CurrentCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-currentcyclepanel',
    index: undefined,
    id: 'dc/detail/CurrentCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/ProgressSection',
    async lazy() {
      ;
      return {
        ...dc_detail_ProgressSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/ProgressSection',
          isLayout: false,
          routeExports: dc_detail_ProgressSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/ProgressSection',
          requestContext,
          renderMode,
          module: dc_detail_ProgressSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-progresssection',
    index: undefined,
    id: 'dc/detail/ProgressSection',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/card/MainlineTaskCard',
    async lazy() {
      ;
      return {
        ...dc_card_MainlineTaskCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/card/MainlineTaskCard',
          isLayout: false,
          routeExports: dc_card_MainlineTaskCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/card/MainlineTaskCard',
          requestContext,
          renderMode,
          module: dc_card_MainlineTaskCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-card-mainlinetaskcard',
    index: undefined,
    id: 'dc/card/MainlineTaskCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/card/SidelineTaskCard',
    async lazy() {
      ;
      return {
        ...dc_card_SidelineTaskCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/card/SidelineTaskCard',
          isLayout: false,
          routeExports: dc_card_SidelineTaskCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/card/SidelineTaskCard',
          requestContext,
          renderMode,
          module: dc_card_SidelineTaskCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-card-sidelinetaskcard',
    index: undefined,
    id: 'dc/card/SidelineTaskCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/utils/cycleCalculator',
    async lazy() {
      ;
      return {
        ...dc_utils_cycleCalculator,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/cycleCalculator',
          isLayout: false,
          routeExports: dc_utils_cycleCalculator,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/cycleCalculator',
          requestContext,
          renderMode,
          module: dc_utils_cycleCalculator,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-cyclecalculator',
    index: undefined,
    id: 'dc/utils/cycleCalculator',
    exact: true,
    exports: ["CycleCalculator"],
  },{
    path: 'dc/detail/GoalHeader',
    async lazy() {
      ;
      return {
        ...dc_detail_GoalHeader,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/GoalHeader',
          isLayout: false,
          routeExports: dc_detail_GoalHeader,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/GoalHeader',
          requestContext,
          renderMode,
          module: dc_detail_GoalHeader,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-goalheader',
    index: undefined,
    id: 'dc/detail/GoalHeader',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/CreateGoalModal',
    async lazy() {
      ;
      return {
        ...dc_CreateGoalModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/CreateGoalModal',
          isLayout: false,
          routeExports: dc_CreateGoalModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/CreateGoalModal',
          requestContext,
          renderMode,
          module: dc_CreateGoalModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-creategoalmodal',
    index: undefined,
    id: 'dc/CreateGoalModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/example',
    async lazy() {
      ;
      return {
        ...dc_detail_example,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/example',
          isLayout: false,
          routeExports: dc_detail_example,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/example',
          requestContext,
          renderMode,
          module: dc_detail_example,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-example',
    index: undefined,
    id: 'dc/detail/example',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/TabBar',
    async lazy() {
      ;
      return {
        ...dc_detail_TabBar,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/TabBar',
          isLayout: false,
          routeExports: dc_detail_TabBar,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/TabBar',
          requestContext,
          renderMode,
          module: dc_detail_TabBar,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-tabbar',
    index: undefined,
    id: 'dc/detail/TabBar',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/hooks',
    async lazy() {
      ;
      return {
        ...dc_detail_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/hooks',
          isLayout: false,
          routeExports: dc_detail_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/hooks',
          requestContext,
          renderMode,
          module: dc_detail_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-hooks',
    index: undefined,
    id: 'dc/detail/hooks',
    exact: true,
    exports: ["getCurrentCycle","useGoalDetail"],
  },{
    path: 'dc/detail',
    async lazy() {
      ;
      return {
        ...dc_detail,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail',
          isLayout: false,
          routeExports: dc_detail,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail',
          requestContext,
          renderMode,
          module: dc_detail,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-index',
    index: true,
    id: 'dc/detail',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/types',
    async lazy() {
      ;
      return {
        ...dc_detail_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/types',
          isLayout: false,
          routeExports: dc_detail_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/types',
          requestContext,
          renderMode,
          module: dc_detail_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-types',
    index: undefined,
    id: 'dc/detail/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/card',
    async lazy() {
      ;
      return {
        ...dc_card,
        Component: () => WrapRouteComponent({
          routeId: 'dc/card',
          isLayout: false,
          routeExports: dc_card,
        }),
        loader: createRouteLoader({
          routeId: 'dc/card',
          requestContext,
          renderMode,
          module: dc_card,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-card-index',
    index: true,
    id: 'dc/card',
    exact: true,
    exports: ["MainlineTaskCard","SidelineTaskCard"],
  },{
    path: 'stock_self',
    async lazy() {
      ;
      return {
        ...stock_self,
        Component: () => WrapRouteComponent({
          routeId: 'stock_self',
          isLayout: false,
          routeExports: stock_self,
        }),
        loader: createRouteLoader({
          routeId: 'stock_self',
          requestContext,
          renderMode,
          module: stock_self,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'stock_self',
    index: undefined,
    id: 'stock_self',
    exact: true,
    exports: ["default"],
  },{
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
    path: 'dc/types',
    async lazy() {
      ;
      return {
        ...dc_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/types',
          isLayout: false,
          routeExports: dc_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/types',
          requestContext,
          renderMode,
          module: dc_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-types',
    index: undefined,
    id: 'dc/types',
    exact: true,
    exports: [],
  },{
    path: 'aitrend',
    async lazy() {
      ;
      return {
        ...aitrend,
        Component: () => WrapRouteComponent({
          routeId: 'aitrend',
          isLayout: false,
          routeExports: aitrend,
        }),
        loader: createRouteLoader({
          routeId: 'aitrend',
          requestContext,
          renderMode,
          module: aitrend,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'aitrend',
    index: undefined,
    id: 'aitrend',
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
    path: 'image',
    async lazy() {
      ;
      return {
        ...image,
        Component: () => WrapRouteComponent({
          routeId: 'image',
          isLayout: false,
          routeExports: image,
        }),
        loader: createRouteLoader({
          routeId: 'image',
          requestContext,
          renderMode,
          module: image,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'image',
    index: undefined,
    id: 'image',
    exact: true,
    exports: ["commonList","fufeiList","hezuoList","imagelist","tiyanList","yaoqingList"],
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
    path: 'intro',
    async lazy() {
      ;
      return {
        ...intro,
        Component: () => WrapRouteComponent({
          routeId: 'intro',
          isLayout: false,
          routeExports: intro,
        }),
        loader: createRouteLoader({
          routeId: 'intro',
          requestContext,
          renderMode,
          module: intro,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'intro',
    index: undefined,
    id: 'intro',
    exact: true,
    exports: ["default","lorem"],
  },{
    path: 'stock',
    async lazy() {
      ;
      return {
        ...stock,
        Component: () => WrapRouteComponent({
          routeId: 'stock',
          isLayout: false,
          routeExports: stock,
        }),
        loader: createRouteLoader({
          routeId: 'stock',
          requestContext,
          renderMode,
          module: stock,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'stock',
    index: undefined,
    id: 'stock',
    exact: true,
    exports: ["default"],
  },{
    path: 'demo',
    async lazy() {
      ;
      return {
        ...demo,
        Component: () => WrapRouteComponent({
          routeId: 'demo',
          isLayout: false,
          routeExports: demo,
        }),
        loader: createRouteLoader({
          routeId: 'demo',
          requestContext,
          renderMode,
          module: demo,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'demo',
    index: undefined,
    id: 'demo',
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
