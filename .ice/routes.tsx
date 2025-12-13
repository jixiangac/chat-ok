import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import type { CreateRoutes } from '@ice/runtime';
import * as dc_happy_GoalDetailModal from '@/pages/dc/happy/GoalDetailModal/index';
import * as dc_happy_TripDetailModal from '@/pages/dc/happy/TripDetailModal/index';
import * as dc_detail_ChecklistCyclePanel from '@/pages/dc/detail/ChecklistCyclePanel';
import * as dc_detail_CheckInRecordPanel from '@/pages/dc/detail/CheckInRecordPanel';
import * as dc_detail_CycleSummaryDialog from '@/pages/dc/detail/CycleSummaryDialog';
import * as dc_detail_HistoryRecordPanel from '@/pages/dc/detail/HistoryRecordPanel';
import * as dc_detail_CalendarViewPanel from '@/pages/dc/detail/CalendarViewPanel';
import * as dc_detail_CheckInCyclePanel from '@/pages/dc/detail/CheckInCyclePanel';
import * as dc_detail_CurrentCyclePanel from '@/pages/dc/detail/CurrentCyclePanel';
import * as dc_detail_HistoryCyclePanel from '@/pages/dc/detail/HistoryCyclePanel';
import * as dc_detail_NumericCyclePanel from '@/pages/dc/detail/NumericCyclePanel';
import * as dc_utils_mainlineTaskHelper from '@/pages/dc/utils/mainlineTaskHelper';
import * as dc_CreateMainlineTaskModal from '@/pages/dc/CreateMainlineTaskModal';
import * as dc_CreateSidelineTaskModal from '@/pages/dc/CreateSidelineTaskModal';
import * as dc_detail_ProgressSection from '@/pages/dc/detail/ProgressSection';
import * as dc_detail_RecordDataModal from '@/pages/dc/detail/RecordDataModal';
import * as dc_happy_TripSummaryModal from '@/pages/dc/happy/TripSummaryModal';
import * as dc_card_MainlineTaskCard from '@/pages/dc/card/MainlineTaskCard';
import * as dc_card_SidelineTaskCard from '@/pages/dc/card/SidelineTaskCard';
import * as dc_happy_CreateTripModal from '@/pages/dc/happy/CreateTripModal';
import * as dc_happy_VacationContent from '@/pages/dc/happy/VacationContent';
import * as dc_utils_cycleCalculator from '@/pages/dc/utils/cycleCalculator';
import * as dc_context_TaskContext from '@/pages/dc/context/TaskContext';
import * as dc_happy_AddGoalModal from '@/pages/dc/happy/AddGoalModal';
import * as dc_detail_GoalHeader from '@/pages/dc/detail/GoalHeader';
import * as dc_CreateGoalModal from '@/pages/dc/CreateGoalModal';
import * as dc_detail_example from '@/pages/dc/detail/example';
import * as dc_happy_GoalCard from '@/pages/dc/happy/GoalCard';
import * as dc_happy_TripList from '@/pages/dc/happy/TripList';
import * as dc_context from '@/pages/dc/context/index';
import * as dc_detail_TabBar from '@/pages/dc/detail/TabBar';
import * as dc_happy_DayTabs from '@/pages/dc/happy/DayTabs';
import * as dc_happy_storage from '@/pages/dc/happy/storage';
import * as dc_detail_hooks from '@/pages/dc/detail/hooks';
import * as dc_detail from '@/pages/dc/detail/index';
import * as dc_detail_types from '@/pages/dc/detail/types';
import * as dc_happy_types from '@/pages/dc/happy/types';
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

const createRoutes: CreateRoutes = ({
  requestContext,
  renderMode,
}) => ([
  {
    path: 'dc/happy/GoalDetailModal',
    async lazy() {
      ;
      return {
        ...dc_happy_GoalDetailModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/GoalDetailModal',
          isLayout: false,
          routeExports: dc_happy_GoalDetailModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/GoalDetailModal',
          requestContext,
          renderMode,
          module: dc_happy_GoalDetailModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-goaldetailmodal-index',
    index: true,
    id: 'dc/happy/GoalDetailModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/happy/TripDetailModal',
    async lazy() {
      ;
      return {
        ...dc_happy_TripDetailModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/TripDetailModal',
          isLayout: false,
          routeExports: dc_happy_TripDetailModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/TripDetailModal',
          requestContext,
          renderMode,
          module: dc_happy_TripDetailModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-tripdetailmodal-index',
    index: true,
    id: 'dc/happy/TripDetailModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/ChecklistCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_detail_ChecklistCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/ChecklistCyclePanel',
          isLayout: false,
          routeExports: dc_detail_ChecklistCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/ChecklistCyclePanel',
          requestContext,
          renderMode,
          module: dc_detail_ChecklistCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-checklistcyclepanel',
    index: undefined,
    id: 'dc/detail/ChecklistCyclePanel',
    exact: true,
    exports: ["default"],
  },{
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
    path: 'dc/detail/HistoryRecordPanel',
    async lazy() {
      ;
      return {
        ...dc_detail_HistoryRecordPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/HistoryRecordPanel',
          isLayout: false,
          routeExports: dc_detail_HistoryRecordPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/HistoryRecordPanel',
          requestContext,
          renderMode,
          module: dc_detail_HistoryRecordPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-historyrecordpanel',
    index: undefined,
    id: 'dc/detail/HistoryRecordPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/CalendarViewPanel',
    async lazy() {
      ;
      return {
        ...dc_detail_CalendarViewPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/CalendarViewPanel',
          isLayout: false,
          routeExports: dc_detail_CalendarViewPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/CalendarViewPanel',
          requestContext,
          renderMode,
          module: dc_detail_CalendarViewPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-calendarviewpanel',
    index: undefined,
    id: 'dc/detail/CalendarViewPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/CheckInCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_detail_CheckInCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/CheckInCyclePanel',
          isLayout: false,
          routeExports: dc_detail_CheckInCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/CheckInCyclePanel',
          requestContext,
          renderMode,
          module: dc_detail_CheckInCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-checkincyclepanel',
    index: undefined,
    id: 'dc/detail/CheckInCyclePanel',
    exact: true,
    exports: ["default"],
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
    path: 'dc/detail/HistoryCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_detail_HistoryCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/HistoryCyclePanel',
          isLayout: false,
          routeExports: dc_detail_HistoryCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/HistoryCyclePanel',
          requestContext,
          renderMode,
          module: dc_detail_HistoryCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-historycyclepanel',
    index: undefined,
    id: 'dc/detail/HistoryCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/detail/NumericCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_detail_NumericCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/NumericCyclePanel',
          isLayout: false,
          routeExports: dc_detail_NumericCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/NumericCyclePanel',
          requestContext,
          renderMode,
          module: dc_detail_NumericCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-numericcyclepanel',
    index: undefined,
    id: 'dc/detail/NumericCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/utils/mainlineTaskHelper',
    async lazy() {
      ;
      return {
        ...dc_utils_mainlineTaskHelper,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/mainlineTaskHelper',
          isLayout: false,
          routeExports: dc_utils_mainlineTaskHelper,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/mainlineTaskHelper',
          requestContext,
          renderMode,
          module: dc_utils_mainlineTaskHelper,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-mainlinetaskhelper',
    index: undefined,
    id: 'dc/utils/mainlineTaskHelper',
    exact: true,
    exports: ["calculateCheckInProgress","calculateChecklistProgress","calculateNumericProgress","calculateRemainingDays","isTodayCheckedIn","updateMainlineTaskProgress"],
  },{
    path: 'dc/CreateMainlineTaskModal',
    async lazy() {
      ;
      return {
        ...dc_CreateMainlineTaskModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/CreateMainlineTaskModal',
          isLayout: false,
          routeExports: dc_CreateMainlineTaskModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/CreateMainlineTaskModal',
          requestContext,
          renderMode,
          module: dc_CreateMainlineTaskModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-createmainlinetaskmodal',
    index: undefined,
    id: 'dc/CreateMainlineTaskModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/CreateSidelineTaskModal',
    async lazy() {
      ;
      return {
        ...dc_CreateSidelineTaskModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/CreateSidelineTaskModal',
          isLayout: false,
          routeExports: dc_CreateSidelineTaskModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/CreateSidelineTaskModal',
          requestContext,
          renderMode,
          module: dc_CreateSidelineTaskModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-createsidelinetaskmodal',
    index: undefined,
    id: 'dc/CreateSidelineTaskModal',
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
    path: 'dc/detail/RecordDataModal',
    async lazy() {
      ;
      return {
        ...dc_detail_RecordDataModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/detail/RecordDataModal',
          isLayout: false,
          routeExports: dc_detail_RecordDataModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/detail/RecordDataModal',
          requestContext,
          renderMode,
          module: dc_detail_RecordDataModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-detail-recorddatamodal',
    index: undefined,
    id: 'dc/detail/RecordDataModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/happy/TripSummaryModal',
    async lazy() {
      ;
      return {
        ...dc_happy_TripSummaryModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/TripSummaryModal',
          isLayout: false,
          routeExports: dc_happy_TripSummaryModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/TripSummaryModal',
          requestContext,
          renderMode,
          module: dc_happy_TripSummaryModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-tripsummarymodal',
    index: undefined,
    id: 'dc/happy/TripSummaryModal',
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
    path: 'dc/happy/CreateTripModal',
    async lazy() {
      ;
      return {
        ...dc_happy_CreateTripModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/CreateTripModal',
          isLayout: false,
          routeExports: dc_happy_CreateTripModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/CreateTripModal',
          requestContext,
          renderMode,
          module: dc_happy_CreateTripModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-createtripmodal',
    index: undefined,
    id: 'dc/happy/CreateTripModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/happy/VacationContent',
    async lazy() {
      ;
      return {
        ...dc_happy_VacationContent,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/VacationContent',
          isLayout: false,
          routeExports: dc_happy_VacationContent,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/VacationContent',
          requestContext,
          renderMode,
          module: dc_happy_VacationContent,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-vacationcontent',
    index: undefined,
    id: 'dc/happy/VacationContent',
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
    path: 'dc/context/TaskContext',
    async lazy() {
      ;
      return {
        ...dc_context_TaskContext,
        Component: () => WrapRouteComponent({
          routeId: 'dc/context/TaskContext',
          isLayout: false,
          routeExports: dc_context_TaskContext,
        }),
        loader: createRouteLoader({
          routeId: 'dc/context/TaskContext',
          requestContext,
          renderMode,
          module: dc_context_TaskContext,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-context-taskcontext',
    index: undefined,
    id: 'dc/context/TaskContext',
    exact: true,
    exports: ["TaskProvider","default","useTaskContext"],
  },{
    path: 'dc/happy/AddGoalModal',
    async lazy() {
      ;
      return {
        ...dc_happy_AddGoalModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/AddGoalModal',
          isLayout: false,
          routeExports: dc_happy_AddGoalModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/AddGoalModal',
          requestContext,
          renderMode,
          module: dc_happy_AddGoalModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-addgoalmodal',
    index: undefined,
    id: 'dc/happy/AddGoalModal',
    exact: true,
    exports: ["default"],
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
    path: 'dc/happy/GoalCard',
    async lazy() {
      ;
      return {
        ...dc_happy_GoalCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/GoalCard',
          isLayout: false,
          routeExports: dc_happy_GoalCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/GoalCard',
          requestContext,
          renderMode,
          module: dc_happy_GoalCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-goalcard',
    index: undefined,
    id: 'dc/happy/GoalCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/happy/TripList',
    async lazy() {
      ;
      return {
        ...dc_happy_TripList,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/TripList',
          isLayout: false,
          routeExports: dc_happy_TripList,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/TripList',
          requestContext,
          renderMode,
          module: dc_happy_TripList,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-triplist',
    index: undefined,
    id: 'dc/happy/TripList',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/context',
    async lazy() {
      ;
      return {
        ...dc_context,
        Component: () => WrapRouteComponent({
          routeId: 'dc/context',
          isLayout: false,
          routeExports: dc_context,
        }),
        loader: createRouteLoader({
          routeId: 'dc/context',
          requestContext,
          renderMode,
          module: dc_context,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-context-index',
    index: true,
    id: 'dc/context',
    exact: true,
    exports: [],
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
    path: 'dc/happy/DayTabs',
    async lazy() {
      ;
      return {
        ...dc_happy_DayTabs,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/DayTabs',
          isLayout: false,
          routeExports: dc_happy_DayTabs,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/DayTabs',
          requestContext,
          renderMode,
          module: dc_happy_DayTabs,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-daytabs',
    index: undefined,
    id: 'dc/happy/DayTabs',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/happy/storage',
    async lazy() {
      ;
      return {
        ...dc_happy_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/storage',
          isLayout: false,
          routeExports: dc_happy_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/storage',
          requestContext,
          renderMode,
          module: dc_happy_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-storage',
    index: undefined,
    id: 'dc/happy/storage',
    exact: true,
    exports: ["addGoalToSchedule","calculateTripStats","completeGoal","createTrip","deleteGoal","deleteTrip","getTrip","loadTrips","loadVacationState","saveTrips","saveVacationState","updateGoal","updateTrip"],
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
    path: 'dc/happy/types',
    async lazy() {
      ;
      return {
        ...dc_happy_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/happy/types',
          isLayout: false,
          routeExports: dc_happy_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/happy/types',
          requestContext,
          renderMode,
          module: dc_happy_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-happy-types',
    index: undefined,
    id: 'dc/happy/types',
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
export default createRoutes;
