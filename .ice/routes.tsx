import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import type { CreateRoutes } from '@ice/runtime';
import * as dc_components_CreateMainlineTaskModal_steps_configs_ChecklistConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig';
import * as dc_components_CreateMainlineTaskModal_steps_configs_CheckInConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig';
import * as dc_components_CreateMainlineTaskModal_steps_configs_NumericConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig';
import * as dc_panels_memorial_components_CreateMemorialModal_LoadingSkeleton from '@/pages/dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton';
import * as dc_components_CreateGoalModal_components_EncouragementInput from '@/pages/dc/components/CreateGoalModal/components/EncouragementInput';
import * as dc_components_CreateGoalModal_components_DurationSelector from '@/pages/dc/components/CreateGoalModal/components/DurationSelector';
import * as dc_components_CreateGoalModal_components_PrioritySelector from '@/pages/dc/components/CreateGoalModal/components/PrioritySelector';
import * as dc_components_CreateGoalModal_components_RulesExplanation from '@/pages/dc/components/CreateGoalModal/components/RulesExplanation';
import * as dc_components_CreateGoalModal_components_TaskTypeSelector from '@/pages/dc/components/CreateGoalModal/components/TaskTypeSelector';
import * as dc_panels_memorial_components_MemorialCardSkeleton from '@/pages/dc/panels/memorial/components/MemorialCardSkeleton/index';
import * as dc_panels_memorial_components_MemorialListSkeleton from '@/pages/dc/panels/memorial/components/MemorialListSkeleton/index';
import * as dc_panels_memorial_components_CreateMemorialModal from '@/pages/dc/panels/memorial/components/CreateMemorialModal/index';
import * as dc_panels_memorial_components_VirtualMemorialList from '@/pages/dc/panels/memorial/components/VirtualMemorialList/index';
import * as dc_components_CreateGoalModal_components_CycleSelector from '@/pages/dc/components/CreateGoalModal/components/CycleSelector';
import * as dc_components_CreateMainlineTaskModal_steps_ConfigStep from '@/pages/dc/components/CreateMainlineTaskModal/steps/ConfigStep';
import * as dc_components_CreateGoalModal_components_CyclePreview from '@/pages/dc/components/CreateGoalModal/components/CyclePreview';
import * as dc_components_CreateGoalModal_components_DateSelector from '@/pages/dc/components/CreateGoalModal/components/DateSelector';
import * as dc_components_CreateGoalModal_components_IconSelector from '@/pages/dc/components/CreateGoalModal/components/IconSelector';
import * as dc_components_CreateGoalModal_components_PopularGoals from '@/pages/dc/components/CreateGoalModal/components/PopularGoals';
import * as dc_components_CreateGoalModal_components_WarningAlert from '@/pages/dc/components/CreateGoalModal/components/WarningAlert';
import * as dc_components_CreateMainlineTaskModal_steps_CycleStep from '@/pages/dc/components/CreateMainlineTaskModal/steps/CycleStep';
import * as dc_panels_detail_components_CheckInHistoryPanel from '@/pages/dc/panels/detail/components/CheckInHistoryPanel/index';
import * as dc_panels_detail_components_ChecklistCyclePanel from '@/pages/dc/panels/detail/components/ChecklistCyclePanel/index';
import * as dc_components_CreateMainlineTaskModal_steps_TypeStep from '@/pages/dc/components/CreateMainlineTaskModal/steps/TypeStep';
import * as dc_panels_detail_components_CheckInRecordPanel from '@/pages/dc/panels/detail/components/CheckInRecordPanel/index';
import * as dc_panels_detail_components_CycleSummaryDialog from '@/pages/dc/panels/detail/components/CycleSummaryDialog/index';
import * as dc_panels_detail_components_HistoryRecordPanel from '@/pages/dc/panels/detail/components/HistoryRecordPanel/index';
import * as dc_panels_memorial_components_BackgroundPicker from '@/pages/dc/panels/memorial/components/BackgroundPicker/index';
import * as dc_panels_detail_components_CalendarViewPanel from '@/pages/dc/panels/detail/components/CalendarViewPanel/index';
import * as dc_panels_detail_components_CheckInCyclePanel from '@/pages/dc/panels/detail/components/CheckInCyclePanel/index';
import * as dc_panels_detail_components_CurrentCyclePanel from '@/pages/dc/panels/detail/components/CurrentCyclePanel/index';
import * as dc_panels_detail_components_HistoryCyclePanel from '@/pages/dc/panels/detail/components/HistoryCyclePanel/index';
import * as dc_panels_detail_components_NumericCyclePanel from '@/pages/dc/panels/detail/components/NumericCyclePanel/index';
import * as dc_panels_memorial_components_MemorialDetail from '@/pages/dc/panels/memorial/components/MemorialDetail/index';
import * as dc_components_CreateMainlineTaskModal_steps from '@/pages/dc/components/CreateMainlineTaskModal/steps/index';
import * as dc_panels_detail_components_ProgressSection from '@/pages/dc/panels/detail/components/ProgressSection/index';
import * as dc_panels_detail_components_RecordDataModal from '@/pages/dc/panels/detail/components/RecordDataModal/index';
import * as dc_panels_happy_components_TripSummaryModal from '@/pages/dc/panels/happy/components/TripSummaryModal/index';
import * as dc_panels_happy_components_CreateTripModal from '@/pages/dc/panels/happy/components/CreateTripModal/index';
import * as dc_panels_happy_components_GoalDetailModal from '@/pages/dc/panels/happy/components/GoalDetailModal/index';
import * as dc_panels_happy_components_TripDetailModal from '@/pages/dc/panels/happy/components/TripDetailModal/index';
import * as dc_panels_happy_components_VacationContent from '@/pages/dc/panels/happy/components/VacationContent/index';
import * as dc_panels_memorial_components_MemorialCard from '@/pages/dc/panels/memorial/components/MemorialCard/index';
import * as dc_components_CreateMainlineTaskModal_constants from '@/pages/dc/components/CreateMainlineTaskModal/constants';
import * as dc_components_CreateGoalModal_components from '@/pages/dc/components/CreateGoalModal/components/index';
import * as dc_panels_detail_components_CheckInModal from '@/pages/dc/panels/detail/components/CheckInModal/index';
import * as dc_panels_memorial_components_IconPicker from '@/pages/dc/panels/memorial/components/IconPicker/index';
import * as dc_panels_happy_components_AddGoalModal from '@/pages/dc/panels/happy/components/AddGoalModal/index';
import * as dc_panels_detail_components_GoalHeader from '@/pages/dc/panels/detail/components/GoalHeader/index';
import * as dc_panels_happy_components_TripList_TripCard from '@/pages/dc/panels/happy/components/TripList/TripCard';
import * as dc_components_CreateMainlineTaskModal from '@/pages/dc/components/CreateMainlineTaskModal/index';
import * as dc_components_CreateMainlineTaskModal_types from '@/pages/dc/components/CreateMainlineTaskModal/types';
import * as dc_components_shared_CircleProgress from '@/pages/dc/components/shared/CircleProgress/index';
import * as dc_panels_happy_components_GoalCard from '@/pages/dc/panels/happy/components/GoalCard/index';
import * as dc_panels_happy_components_TripList from '@/pages/dc/panels/happy/components/TripList/index';
import * as dc_panels_detail_components_TabBar from '@/pages/dc/panels/detail/components/TabBar/index';
import * as dc_panels_happy_components_DayTabs from '@/pages/dc/panels/happy/components/DayTabs/index';
import * as dc_panels_happy_contexts_VacationContext from '@/pages/dc/panels/happy/contexts/VacationContext';
import * as dc_panels_memorial_constants_backgrounds from '@/pages/dc/panels/memorial/constants/backgrounds';
import * as dc_components_CreateGoalModal_constants from '@/pages/dc/components/CreateGoalModal/constants';
import * as dc_panels_happy_hooks_useTripNavigation from '@/pages/dc/panels/happy/hooks/useTripNavigation';
import * as dc_panels_memorial_utils_dateCalculator from '@/pages/dc/panels/memorial/utils/dateCalculator';
import * as dc_components_shared_ProgressBar from '@/pages/dc/components/shared/ProgressBar/index';
import * as dc_panels_memorial_hooks_useDateFormat from '@/pages/dc/panels/memorial/hooks/useDateFormat';
import * as dc_panels_settings_ThemeSettings from '@/pages/dc/panels/settings/ThemeSettings/index';
import * as dc_panels_memorial_hooks_useMemorials from '@/pages/dc/panels/memorial/hooks/useMemorials';
import * as dc_components_RandomTaskPicker from '@/pages/dc/components/RandomTaskPicker/index';
import * as dc_components_SidelineTaskGrid from '@/pages/dc/components/SidelineTaskGrid/index';
import * as dc_panels_detail_hooks_checkInStatus from '@/pages/dc/panels/detail/hooks/checkInStatus';
import * as dc_panels_happy_utils_scheduleHelper from '@/pages/dc/panels/happy/utils/scheduleHelper';
import * as dc_components_CreateGoalModal from '@/pages/dc/components/CreateGoalModal/index';
import * as dc_components_CreateGoalModal_types from '@/pages/dc/components/CreateGoalModal/types';
import * as dc_components_card_MainlineTaskCard from '@/pages/dc/components/card/MainlineTaskCard';
import * as dc_components_card_SidelineTaskCard from '@/pages/dc/components/card/SidelineTaskCard';
import * as dc_components_shared_StatCard from '@/pages/dc/components/shared/StatCard/index';
import * as dc_panels_memorial_components from '@/pages/dc/panels/memorial/components/index';
import * as dc_panels_memorial_constants_icons from '@/pages/dc/panels/memorial/constants/icons';
import * as dc_panels_memorial_constants from '@/pages/dc/panels/memorial/constants/index';
import * as dc_components_DailyProgress from '@/pages/dc/components/DailyProgress/index';
import * as dc_components_TodayProgress from '@/pages/dc/components/TodayProgress/index';
import * as dc_panels_detail_components from '@/pages/dc/panels/detail/components/index';
import * as dc_panels_happy_hooks_useSchedule from '@/pages/dc/panels/happy/hooks/useSchedule';
import * as dc_components_ThemedButton from '@/pages/dc/components/ThemedButton/index';
import * as dc_panels_detail_constants from '@/pages/dc/panels/detail/constants/index';
import * as dc_panels_detail_hooks_constants from '@/pages/dc/panels/detail/hooks/constants';
import * as dc_panels_detail_hooks_dateUtils from '@/pages/dc/panels/detail/hooks/dateUtils';
import * as dc_panels_happy_components from '@/pages/dc/panels/happy/components/index';
import * as dc_panels_happy_utils_dateHelper from '@/pages/dc/panels/happy/utils/dateHelper';
import * as dc_panels_happy_contexts from '@/pages/dc/panels/happy/contexts/index';
import * as dc_panels_happy_hooks_useGoals from '@/pages/dc/panels/happy/hooks/useGoals';
import * as dc_panels_happy_hooks_useTrips from '@/pages/dc/panels/happy/hooks/useTrips';
import * as dc_panels_memorial_hooks from '@/pages/dc/panels/memorial/hooks/index';
import * as dc_panels_memorial_utils from '@/pages/dc/panels/memorial/utils/index';
import * as dc_panels_settings_theme from '@/pages/dc/panels/settings/theme/index';
import * as dc_components_MoonPhase from '@/pages/dc/components/MoonPhase/index';
import * as dc_panels_detail_hooks from '@/pages/dc/panels/detail/hooks';
import * as dc_panels_detail_utils from '@/pages/dc/panels/detail/utils/index';
import * as dc_panels_happy_hooks from '@/pages/dc/panels/happy/hooks/index';
import * as dc_panels_happy_utils from '@/pages/dc/panels/happy/utils/index';
import * as dc_utils_mainlineTaskHelper from '@/pages/dc/utils/mainlineTaskHelper';
import * as dc_utils_progressCalculator from '@/pages/dc/utils/progressCalculator';
import * as dc_components_shared from '@/pages/dc/components/shared/index';
import * as dc_contexts_UIStateContext from '@/pages/dc/contexts/UIStateContext';
import * as dc_panels_memorial_storage from '@/pages/dc/panels/memorial/storage';
import * as dc_components_card from '@/pages/dc/components/card/index';
import * as dc_contexts_ThemeContext from '@/pages/dc/contexts/ThemeContext';
import * as dc_panels_memorial from '@/pages/dc/panels/memorial/index';
import * as dc_panels_memorial_types from '@/pages/dc/panels/memorial/types';
import * as dc_panels_settings from '@/pages/dc/panels/settings/index';
import * as dc_utils_cycleCalculator from '@/pages/dc/utils/cycleCalculator';
import * as dc_contexts_TaskContext from '@/pages/dc/contexts/TaskContext';
import * as dc_hooks_useSpriteImage from '@/pages/dc/hooks/useSpriteImage';
import * as dc_panels_archive from '@/pages/dc/panels/archive/index';
import * as dc_panels_happy_storage from '@/pages/dc/panels/happy/storage';
import * as dc_panels_detail from '@/pages/dc/panels/detail/index';
import * as dc_panels_detail_types from '@/pages/dc/panels/detail/types';
import * as dc_panels_normal from '@/pages/dc/panels/normal/index';
import * as dc_panels_happy from '@/pages/dc/panels/happy/index';
import * as dc_panels_happy_types from '@/pages/dc/panels/happy/types';
import * as dc_constants_sprites from '@/pages/dc/constants/sprites';
import * as dc_hooks_useProgress from '@/pages/dc/hooks/useProgress';
import * as dc_hooks_useTaskSort from '@/pages/dc/hooks/useTaskSort';
import * as dc_components from '@/pages/dc/components/index';
import * as dc_constants_colors from '@/pages/dc/constants/colors';
import * as dc_constants from '@/pages/dc/constants/index';
import * as dc_contexts from '@/pages/dc/contexts/index';
import * as dc_panels from '@/pages/dc/panels/index';
import * as dc_hooks from '@/pages/dc/hooks/index';
import * as dc_utils from '@/pages/dc/utils/index';
import * as stock_self from '@/pages/stock_self';
import * as aloglist from '@/pages/aloglist';
import * as dc from '@/pages/dc/index';
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
    path: 'dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_configs_ChecklistConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_configs_ChecklistConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_configs_ChecklistConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-configs-checklistconfig',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_configs_CheckInConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_configs_CheckInConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_configs_CheckInConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-configs-checkinconfig',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_configs_NumericConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_configs_NumericConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_configs_NumericConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-configs-numericconfig',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_CreateMemorialModal_LoadingSkeleton,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton',
          isLayout: false,
          routeExports: dc_panels_memorial_components_CreateMemorialModal_LoadingSkeleton,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_CreateMemorialModal_LoadingSkeleton,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-creatememorialmodal-loadingskeleton',
    index: undefined,
    id: 'dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton',
    exact: true,
    exports: ["LoadingSkeleton"],
  },{
    path: 'dc/components/CreateGoalModal/components/EncouragementInput',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_EncouragementInput,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/EncouragementInput',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_EncouragementInput,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/EncouragementInput',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_EncouragementInput,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-encouragementinput',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/EncouragementInput',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/DurationSelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_DurationSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/DurationSelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_DurationSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/DurationSelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_DurationSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-durationselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/DurationSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/PrioritySelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_PrioritySelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/PrioritySelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_PrioritySelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/PrioritySelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_PrioritySelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-priorityselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/PrioritySelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/RulesExplanation',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_RulesExplanation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/RulesExplanation',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_RulesExplanation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/RulesExplanation',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_RulesExplanation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-rulesexplanation',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/RulesExplanation',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/TaskTypeSelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_TaskTypeSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/TaskTypeSelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_TaskTypeSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/TaskTypeSelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_TaskTypeSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-tasktypeselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/TaskTypeSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/components/MemorialCardSkeleton',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_MemorialCardSkeleton,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/MemorialCardSkeleton',
          isLayout: false,
          routeExports: dc_panels_memorial_components_MemorialCardSkeleton,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/MemorialCardSkeleton',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_MemorialCardSkeleton,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-memorialcardskeleton-index',
    index: true,
    id: 'dc/panels/memorial/components/MemorialCardSkeleton',
    exact: true,
    exports: ["MemorialCardSkeleton","default"],
  },{
    path: 'dc/panels/memorial/components/MemorialListSkeleton',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_MemorialListSkeleton,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/MemorialListSkeleton',
          isLayout: false,
          routeExports: dc_panels_memorial_components_MemorialListSkeleton,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/MemorialListSkeleton',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_MemorialListSkeleton,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-memoriallistskeleton-index',
    index: true,
    id: 'dc/panels/memorial/components/MemorialListSkeleton',
    exact: true,
    exports: ["MemorialListSkeleton","default"],
  },{
    path: 'dc/panels/memorial/components/CreateMemorialModal',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_CreateMemorialModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/CreateMemorialModal',
          isLayout: false,
          routeExports: dc_panels_memorial_components_CreateMemorialModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/CreateMemorialModal',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_CreateMemorialModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-creatememorialmodal-index',
    index: true,
    id: 'dc/panels/memorial/components/CreateMemorialModal',
    exact: true,
    exports: ["CreateMemorialModal","default"],
  },{
    path: 'dc/panels/memorial/components/VirtualMemorialList',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_VirtualMemorialList,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/VirtualMemorialList',
          isLayout: false,
          routeExports: dc_panels_memorial_components_VirtualMemorialList,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/VirtualMemorialList',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_VirtualMemorialList,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-virtualmemoriallist-index',
    index: true,
    id: 'dc/panels/memorial/components/VirtualMemorialList',
    exact: true,
    exports: ["VirtualMemorialList","default"],
  },{
    path: 'dc/components/CreateGoalModal/components/CycleSelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_CycleSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/CycleSelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_CycleSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/CycleSelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_CycleSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-cycleselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/CycleSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps/ConfigStep',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_ConfigStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/ConfigStep',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_ConfigStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/ConfigStep',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_ConfigStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-configstep',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/ConfigStep',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/CyclePreview',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_CyclePreview,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/CyclePreview',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_CyclePreview,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/CyclePreview',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_CyclePreview,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-cyclepreview',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/CyclePreview',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/DateSelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_DateSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/DateSelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_DateSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/DateSelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_DateSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-dateselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/DateSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/IconSelector',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_IconSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/IconSelector',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_IconSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/IconSelector',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_IconSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-iconselector',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/IconSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/PopularGoals',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_PopularGoals,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/PopularGoals',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_PopularGoals,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/PopularGoals',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_PopularGoals,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-populargoals',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/PopularGoals',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/components/WarningAlert',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components_WarningAlert,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components/WarningAlert',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components_WarningAlert,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components/WarningAlert',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components_WarningAlert,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-warningalert',
    index: undefined,
    id: 'dc/components/CreateGoalModal/components/WarningAlert',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps/CycleStep',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_CycleStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/CycleStep',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_CycleStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/CycleStep',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_CycleStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-cyclestep',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/CycleStep',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/CheckInHistoryPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CheckInHistoryPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CheckInHistoryPanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_CheckInHistoryPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CheckInHistoryPanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CheckInHistoryPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-checkinhistorypanel-index',
    index: true,
    id: 'dc/panels/detail/components/CheckInHistoryPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/ChecklistCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_ChecklistCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/ChecklistCyclePanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_ChecklistCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/ChecklistCyclePanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_ChecklistCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-checklistcyclepanel-index',
    index: true,
    id: 'dc/panels/detail/components/ChecklistCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps/TypeStep',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps_TypeStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/TypeStep',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps_TypeStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps/TypeStep',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps_TypeStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-typestep',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/steps/TypeStep',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/CheckInRecordPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CheckInRecordPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CheckInRecordPanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_CheckInRecordPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CheckInRecordPanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CheckInRecordPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-checkinrecordpanel-index',
    index: true,
    id: 'dc/panels/detail/components/CheckInRecordPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/CycleSummaryDialog',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CycleSummaryDialog,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CycleSummaryDialog',
          isLayout: false,
          routeExports: dc_panels_detail_components_CycleSummaryDialog,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CycleSummaryDialog',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CycleSummaryDialog,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-cyclesummarydialog-index',
    index: true,
    id: 'dc/panels/detail/components/CycleSummaryDialog',
    exact: true,
    exports: ["showCycleSummaryDialog"],
  },{
    path: 'dc/panels/detail/components/HistoryRecordPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_HistoryRecordPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/HistoryRecordPanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_HistoryRecordPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/HistoryRecordPanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_HistoryRecordPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-historyrecordpanel-index',
    index: true,
    id: 'dc/panels/detail/components/HistoryRecordPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/components/BackgroundPicker',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_BackgroundPicker,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/BackgroundPicker',
          isLayout: false,
          routeExports: dc_panels_memorial_components_BackgroundPicker,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/BackgroundPicker',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_BackgroundPicker,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-backgroundpicker-index',
    index: true,
    id: 'dc/panels/memorial/components/BackgroundPicker',
    exact: true,
    exports: ["BackgroundPicker","default"],
  },{
    path: 'dc/panels/detail/components/CalendarViewPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CalendarViewPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CalendarViewPanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_CalendarViewPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CalendarViewPanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CalendarViewPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-calendarviewpanel-index',
    index: true,
    id: 'dc/panels/detail/components/CalendarViewPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/CheckInCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CheckInCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CheckInCyclePanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_CheckInCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CheckInCyclePanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CheckInCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-checkincyclepanel-index',
    index: true,
    id: 'dc/panels/detail/components/CheckInCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/CurrentCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CurrentCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CurrentCyclePanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_CurrentCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CurrentCyclePanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CurrentCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-currentcyclepanel-index',
    index: true,
    id: 'dc/panels/detail/components/CurrentCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/HistoryCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_HistoryCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/HistoryCyclePanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_HistoryCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/HistoryCyclePanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_HistoryCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-historycyclepanel-index',
    index: true,
    id: 'dc/panels/detail/components/HistoryCyclePanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/NumericCyclePanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_NumericCyclePanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/NumericCyclePanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_NumericCyclePanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/NumericCyclePanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_NumericCyclePanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-numericcyclepanel-index',
    index: true,
    id: 'dc/panels/detail/components/NumericCyclePanel',
    exact: true,
    exports: ["NumericCyclePanel","default"],
  },{
    path: 'dc/panels/memorial/components/MemorialDetail',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_MemorialDetail,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/MemorialDetail',
          isLayout: false,
          routeExports: dc_panels_memorial_components_MemorialDetail,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/MemorialDetail',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_MemorialDetail,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-memorialdetail-index',
    index: true,
    id: 'dc/panels/memorial/components/MemorialDetail',
    exact: true,
    exports: ["MemorialDetail","default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/steps',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_steps,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/steps',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_steps,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/steps',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_steps,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-steps-index',
    index: true,
    id: 'dc/components/CreateMainlineTaskModal/steps',
    exact: true,
    exports: ["ConfigStep","CycleStep","TypeStep"],
  },{
    path: 'dc/panels/detail/components/ProgressSection',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_ProgressSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/ProgressSection',
          isLayout: false,
          routeExports: dc_panels_detail_components_ProgressSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/ProgressSection',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_ProgressSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-progresssection-index',
    index: true,
    id: 'dc/panels/detail/components/ProgressSection',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/RecordDataModal',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_RecordDataModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/RecordDataModal',
          isLayout: false,
          routeExports: dc_panels_detail_components_RecordDataModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/RecordDataModal',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_RecordDataModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-recorddatamodal-index',
    index: true,
    id: 'dc/panels/detail/components/RecordDataModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/TripSummaryModal',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_TripSummaryModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/TripSummaryModal',
          isLayout: false,
          routeExports: dc_panels_happy_components_TripSummaryModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/TripSummaryModal',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_TripSummaryModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-tripsummarymodal-index',
    index: true,
    id: 'dc/panels/happy/components/TripSummaryModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/CreateTripModal',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_CreateTripModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/CreateTripModal',
          isLayout: false,
          routeExports: dc_panels_happy_components_CreateTripModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/CreateTripModal',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_CreateTripModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-createtripmodal-index',
    index: true,
    id: 'dc/panels/happy/components/CreateTripModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/GoalDetailModal',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_GoalDetailModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/GoalDetailModal',
          isLayout: false,
          routeExports: dc_panels_happy_components_GoalDetailModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/GoalDetailModal',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_GoalDetailModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-goaldetailmodal-index',
    index: true,
    id: 'dc/panels/happy/components/GoalDetailModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/TripDetailModal',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_TripDetailModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/TripDetailModal',
          isLayout: false,
          routeExports: dc_panels_happy_components_TripDetailModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/TripDetailModal',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_TripDetailModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-tripdetailmodal-index',
    index: true,
    id: 'dc/panels/happy/components/TripDetailModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/VacationContent',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_VacationContent,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/VacationContent',
          isLayout: false,
          routeExports: dc_panels_happy_components_VacationContent,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/VacationContent',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_VacationContent,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-vacationcontent-index',
    index: true,
    id: 'dc/panels/happy/components/VacationContent',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/components/MemorialCard',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_MemorialCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/MemorialCard',
          isLayout: false,
          routeExports: dc_panels_memorial_components_MemorialCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/MemorialCard',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_MemorialCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-memorialcard-index',
    index: true,
    id: 'dc/panels/memorial/components/MemorialCard',
    exact: true,
    exports: ["MemorialCard","default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/constants',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/constants',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/constants',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-constants',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/constants',
    exact: true,
    exports: ["CHECK_IN_TYPE_OPTIONS","CYCLE_LENGTH_OPTIONS","DIRECTION_OPTIONS","TASK_TYPE_OPTIONS","TOTAL_DURATION_OPTIONS"],
  },{
    path: 'dc/components/CreateGoalModal/components',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/components',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/components',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-components-index',
    index: true,
    id: 'dc/components/CreateGoalModal/components',
    exact: true,
    exports: ["CyclePreview","CycleSelector","DateSelector","DurationSelector","EncouragementInput","IconSelector","PopularGoals","PrioritySelector","RulesExplanation","TaskTypeSelector","WarningAlert"],
  },{
    path: 'dc/panels/detail/components/CheckInModal',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CheckInModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CheckInModal',
          isLayout: false,
          routeExports: dc_panels_detail_components_CheckInModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CheckInModal',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CheckInModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-checkinmodal-index',
    index: true,
    id: 'dc/panels/detail/components/CheckInModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/components/IconPicker',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components_IconPicker,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components/IconPicker',
          isLayout: false,
          routeExports: dc_panels_memorial_components_IconPicker,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components/IconPicker',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components_IconPicker,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-iconpicker-index',
    index: true,
    id: 'dc/panels/memorial/components/IconPicker',
    exact: true,
    exports: ["IconPicker","default"],
  },{
    path: 'dc/panels/happy/components/AddGoalModal',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_AddGoalModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/AddGoalModal',
          isLayout: false,
          routeExports: dc_panels_happy_components_AddGoalModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/AddGoalModal',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_AddGoalModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-addgoalmodal-index',
    index: true,
    id: 'dc/panels/happy/components/AddGoalModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/GoalHeader',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_GoalHeader,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/GoalHeader',
          isLayout: false,
          routeExports: dc_panels_detail_components_GoalHeader,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/GoalHeader',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_GoalHeader,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-goalheader-index',
    index: true,
    id: 'dc/panels/detail/components/GoalHeader',
    exact: true,
    exports: ["GoalHeader","default"],
  },{
    path: 'dc/panels/happy/components/TripList/TripCard',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_TripList_TripCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/TripList/TripCard',
          isLayout: false,
          routeExports: dc_panels_happy_components_TripList_TripCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/TripList/TripCard',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_TripList_TripCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-triplist-tripcard',
    index: undefined,
    id: 'dc/panels/happy/components/TripList/TripCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-index',
    index: true,
    id: 'dc/components/CreateMainlineTaskModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateMainlineTaskModal/types',
    async lazy() {
      ;
      return {
        ...dc_components_CreateMainlineTaskModal_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateMainlineTaskModal/types',
          isLayout: false,
          routeExports: dc_components_CreateMainlineTaskModal_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateMainlineTaskModal/types',
          requestContext,
          renderMode,
          module: dc_components_CreateMainlineTaskModal_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-createmainlinetaskmodal-types',
    index: undefined,
    id: 'dc/components/CreateMainlineTaskModal/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/components/shared/CircleProgress',
    async lazy() {
      ;
      return {
        ...dc_components_shared_CircleProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/shared/CircleProgress',
          isLayout: false,
          routeExports: dc_components_shared_CircleProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/shared/CircleProgress',
          requestContext,
          renderMode,
          module: dc_components_shared_CircleProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-shared-circleprogress-index',
    index: true,
    id: 'dc/components/shared/CircleProgress',
    exact: true,
    exports: ["CircleProgress","default"],
  },{
    path: 'dc/panels/happy/components/GoalCard',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_GoalCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/GoalCard',
          isLayout: false,
          routeExports: dc_panels_happy_components_GoalCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/GoalCard',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_GoalCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-goalcard-index',
    index: true,
    id: 'dc/panels/happy/components/GoalCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/TripList',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_TripList,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/TripList',
          isLayout: false,
          routeExports: dc_panels_happy_components_TripList,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/TripList',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_TripList,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-triplist-index',
    index: true,
    id: 'dc/panels/happy/components/TripList',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/TabBar',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_TabBar,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/TabBar',
          isLayout: false,
          routeExports: dc_panels_detail_components_TabBar,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/TabBar',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_TabBar,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-tabbar-index',
    index: true,
    id: 'dc/panels/detail/components/TabBar',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/components/DayTabs',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components_DayTabs,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components/DayTabs',
          isLayout: false,
          routeExports: dc_panels_happy_components_DayTabs,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components/DayTabs',
          requestContext,
          renderMode,
          module: dc_panels_happy_components_DayTabs,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-daytabs-index',
    index: true,
    id: 'dc/panels/happy/components/DayTabs',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/contexts/VacationContext',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_contexts_VacationContext,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/contexts/VacationContext',
          isLayout: false,
          routeExports: dc_panels_happy_contexts_VacationContext,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/contexts/VacationContext',
          requestContext,
          renderMode,
          module: dc_panels_happy_contexts_VacationContext,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-contexts-vacationcontext',
    index: undefined,
    id: 'dc/panels/happy/contexts/VacationContext',
    exact: true,
    exports: ["VacationProvider","default","useVacation"],
  },{
    path: 'dc/panels/memorial/constants/backgrounds',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_constants_backgrounds,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/constants/backgrounds',
          isLayout: false,
          routeExports: dc_panels_memorial_constants_backgrounds,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/constants/backgrounds',
          requestContext,
          renderMode,
          module: dc_panels_memorial_constants_backgrounds,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-constants-backgrounds',
    index: undefined,
    id: 'dc/panels/memorial/constants/backgrounds',
    exact: true,
    exports: ["ALL_BACKGROUNDS","COLOR_BACKGROUNDS","GRADIENT_BACKGROUNDS","getBackgroundStyle","getDefaultBackground"],
  },{
    path: 'dc/components/CreateGoalModal/constants',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/constants',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/constants',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-constants',
    index: undefined,
    id: 'dc/components/CreateGoalModal/constants',
    exact: true,
    exports: ["CYCLE_LENGTH_OPTIONS","ICONS","MIN_CHECK_INS_PER_CYCLE","POPULAR_GOALS","PRIORITY_OPTIONS","TASK_TYPES","TOTAL_DURATION_OPTIONS"],
  },{
    path: 'dc/panels/happy/hooks/useTripNavigation',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_hooks_useTripNavigation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/hooks/useTripNavigation',
          isLayout: false,
          routeExports: dc_panels_happy_hooks_useTripNavigation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/hooks/useTripNavigation',
          requestContext,
          renderMode,
          module: dc_panels_happy_hooks_useTripNavigation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-hooks-usetripnavigation',
    index: undefined,
    id: 'dc/panels/happy/hooks/useTripNavigation',
    exact: true,
    exports: ["default","useTripNavigation"],
  },{
    path: 'dc/panels/memorial/utils/dateCalculator',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_utils_dateCalculator,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/utils/dateCalculator',
          isLayout: false,
          routeExports: dc_panels_memorial_utils_dateCalculator,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/utils/dateCalculator',
          requestContext,
          renderMode,
          module: dc_panels_memorial_utils_dateCalculator,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-utils-datecalculator',
    index: undefined,
    id: 'dc/panels/memorial/utils/dateCalculator',
    exact: true,
    exports: ["calculateDays","formatDate","formatDays","getDaysDisplayText","getNextDateFormat","getShortDaysText","isFuture","isPast","isToday"],
  },{
    path: 'dc/components/shared/ProgressBar',
    async lazy() {
      ;
      return {
        ...dc_components_shared_ProgressBar,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/shared/ProgressBar',
          isLayout: false,
          routeExports: dc_components_shared_ProgressBar,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/shared/ProgressBar',
          requestContext,
          renderMode,
          module: dc_components_shared_ProgressBar,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-shared-progressbar-index',
    index: true,
    id: 'dc/components/shared/ProgressBar',
    exact: true,
    exports: ["ProgressBar","default"],
  },{
    path: 'dc/panels/memorial/hooks/useDateFormat',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_hooks_useDateFormat,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/hooks/useDateFormat',
          isLayout: false,
          routeExports: dc_panels_memorial_hooks_useDateFormat,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/hooks/useDateFormat',
          requestContext,
          renderMode,
          module: dc_panels_memorial_hooks_useDateFormat,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-hooks-usedateformat',
    index: undefined,
    id: 'dc/panels/memorial/hooks/useDateFormat',
    exact: true,
    exports: ["useDateFormat"],
  },{
    path: 'dc/panels/settings/ThemeSettings',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_ThemeSettings,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/ThemeSettings',
          isLayout: false,
          routeExports: dc_panels_settings_ThemeSettings,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/ThemeSettings',
          requestContext,
          renderMode,
          module: dc_panels_settings_ThemeSettings,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-themesettings-index',
    index: true,
    id: 'dc/panels/settings/ThemeSettings',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/hooks/useMemorials',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_hooks_useMemorials,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/hooks/useMemorials',
          isLayout: false,
          routeExports: dc_panels_memorial_hooks_useMemorials,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/hooks/useMemorials',
          requestContext,
          renderMode,
          module: dc_panels_memorial_hooks_useMemorials,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-hooks-usememorials',
    index: undefined,
    id: 'dc/panels/memorial/hooks/useMemorials',
    exact: true,
    exports: ["useMemorials"],
  },{
    path: 'dc/components/RandomTaskPicker',
    async lazy() {
      ;
      return {
        ...dc_components_RandomTaskPicker,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/RandomTaskPicker',
          isLayout: false,
          routeExports: dc_components_RandomTaskPicker,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/RandomTaskPicker',
          requestContext,
          renderMode,
          module: dc_components_RandomTaskPicker,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-randomtaskpicker-index',
    index: true,
    id: 'dc/components/RandomTaskPicker',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/SidelineTaskGrid',
    async lazy() {
      ;
      return {
        ...dc_components_SidelineTaskGrid,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/SidelineTaskGrid',
          isLayout: false,
          routeExports: dc_components_SidelineTaskGrid,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/SidelineTaskGrid',
          requestContext,
          renderMode,
          module: dc_components_SidelineTaskGrid,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-sidelinetaskgrid-index',
    index: true,
    id: 'dc/components/SidelineTaskGrid',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/hooks/checkInStatus',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_hooks_checkInStatus,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/hooks/checkInStatus',
          isLayout: false,
          routeExports: dc_panels_detail_hooks_checkInStatus,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/hooks/checkInStatus',
          requestContext,
          renderMode,
          module: dc_panels_detail_hooks_checkInStatus,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-hooks-checkinstatus',
    index: undefined,
    id: 'dc/panels/detail/hooks/checkInStatus',
    exact: true,
    exports: ["getTodayCheckInStatusForTask"],
  },{
    path: 'dc/panels/happy/utils/scheduleHelper',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_utils_scheduleHelper,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/utils/scheduleHelper',
          isLayout: false,
          routeExports: dc_panels_happy_utils_scheduleHelper,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/utils/scheduleHelper',
          requestContext,
          renderMode,
          module: dc_panels_happy_utils_scheduleHelper,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-utils-schedulehelper',
    index: undefined,
    id: 'dc/panels/happy/utils/scheduleHelper',
    exact: true,
    exports: ["getGoalBorderStyle","getGoalStatusColor","getScheduleStats","getScheduleStatusColor","hasFailedGoals","isScheduleCompleted","isScheduleExpired"],
  },{
    path: 'dc/components/CreateGoalModal',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-index',
    index: true,
    id: 'dc/components/CreateGoalModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/CreateGoalModal/types',
    async lazy() {
      ;
      return {
        ...dc_components_CreateGoalModal_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CreateGoalModal/types',
          isLayout: false,
          routeExports: dc_components_CreateGoalModal_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CreateGoalModal/types',
          requestContext,
          renderMode,
          module: dc_components_CreateGoalModal_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-creategoalmodal-types',
    index: undefined,
    id: 'dc/components/CreateGoalModal/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/components/card/MainlineTaskCard',
    async lazy() {
      ;
      return {
        ...dc_components_card_MainlineTaskCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/card/MainlineTaskCard',
          isLayout: false,
          routeExports: dc_components_card_MainlineTaskCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/card/MainlineTaskCard',
          requestContext,
          renderMode,
          module: dc_components_card_MainlineTaskCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-card-mainlinetaskcard',
    index: undefined,
    id: 'dc/components/card/MainlineTaskCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/card/SidelineTaskCard',
    async lazy() {
      ;
      return {
        ...dc_components_card_SidelineTaskCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/card/SidelineTaskCard',
          isLayout: false,
          routeExports: dc_components_card_SidelineTaskCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/card/SidelineTaskCard',
          requestContext,
          renderMode,
          module: dc_components_card_SidelineTaskCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-card-sidelinetaskcard',
    index: undefined,
    id: 'dc/components/card/SidelineTaskCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/shared/StatCard',
    async lazy() {
      ;
      return {
        ...dc_components_shared_StatCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/shared/StatCard',
          isLayout: false,
          routeExports: dc_components_shared_StatCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/shared/StatCard',
          requestContext,
          renderMode,
          module: dc_components_shared_StatCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-shared-statcard-index',
    index: true,
    id: 'dc/components/shared/StatCard',
    exact: true,
    exports: ["StatCard","StatCardGrid","default"],
  },{
    path: 'dc/panels/memorial/components',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/components',
          isLayout: false,
          routeExports: dc_panels_memorial_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/components',
          requestContext,
          renderMode,
          module: dc_panels_memorial_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-components-index',
    index: true,
    id: 'dc/panels/memorial/components',
    exact: true,
    exports: ["BackgroundPicker","CreateMemorialModal","IconPicker","MemorialCard","MemorialCardSkeleton","MemorialDetail","MemorialListSkeleton","VirtualMemorialList"],
  },{
    path: 'dc/panels/memorial/constants/icons',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_constants_icons,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/constants/icons',
          isLayout: false,
          routeExports: dc_panels_memorial_constants_icons,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/constants/icons',
          requestContext,
          renderMode,
          module: dc_panels_memorial_constants_icons,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-constants-icons',
    index: undefined,
    id: 'dc/panels/memorial/constants/icons',
    exact: true,
    exports: ["CRAYON_COLORS","PRESET_ICONS","getDefaultColor","getDefaultIcon","getIconConfig"],
  },{
    path: 'dc/panels/memorial/constants',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/constants',
          isLayout: false,
          routeExports: dc_panels_memorial_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/constants',
          requestContext,
          renderMode,
          module: dc_panels_memorial_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-constants-index',
    index: true,
    id: 'dc/panels/memorial/constants',
    exact: true,
    exports: [],
  },{
    path: 'dc/components/DailyProgress',
    async lazy() {
      ;
      return {
        ...dc_components_DailyProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/DailyProgress',
          isLayout: false,
          routeExports: dc_components_DailyProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/DailyProgress',
          requestContext,
          renderMode,
          module: dc_components_DailyProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-dailyprogress-index',
    index: true,
    id: 'dc/components/DailyProgress',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/TodayProgress',
    async lazy() {
      ;
      return {
        ...dc_components_TodayProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/TodayProgress',
          isLayout: false,
          routeExports: dc_components_TodayProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/TodayProgress',
          requestContext,
          renderMode,
          module: dc_components_TodayProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-todayprogress-index',
    index: true,
    id: 'dc/components/TodayProgress',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components',
          isLayout: false,
          routeExports: dc_panels_detail_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components',
          requestContext,
          renderMode,
          module: dc_panels_detail_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-index',
    index: true,
    id: 'dc/panels/detail/components',
    exact: true,
    exports: ["CalendarViewPanel","CheckInCyclePanel","CheckInHistoryPanel","CheckInModal","CheckInRecordPanel","ChecklistCyclePanel","CurrentCyclePanel","GoalHeader","HistoryCyclePanel","HistoryRecordPanel","NumericCyclePanel","ProgressSection","RecordDataModal","TabBar","showCycleSummaryDialog"],
  },{
    path: 'dc/panels/happy/hooks/useSchedule',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_hooks_useSchedule,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/hooks/useSchedule',
          isLayout: false,
          routeExports: dc_panels_happy_hooks_useSchedule,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/hooks/useSchedule',
          requestContext,
          renderMode,
          module: dc_panels_happy_hooks_useSchedule,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-hooks-useschedule',
    index: undefined,
    id: 'dc/panels/happy/hooks/useSchedule',
    exact: true,
    exports: ["default","useSchedule"],
  },{
    path: 'dc/components/ThemedButton',
    async lazy() {
      ;
      return {
        ...dc_components_ThemedButton,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/ThemedButton',
          isLayout: false,
          routeExports: dc_components_ThemedButton,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/ThemedButton',
          requestContext,
          renderMode,
          module: dc_components_ThemedButton,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-themedbutton-index',
    index: true,
    id: 'dc/components/ThemedButton',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/constants',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/constants',
          isLayout: false,
          routeExports: dc_panels_detail_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/constants',
          requestContext,
          renderMode,
          module: dc_panels_detail_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-constants-index',
    index: true,
    id: 'dc/panels/detail/constants',
    exact: true,
    exports: ["COMPLETION_IMAGES","DEFAULT_TABS","PROGRESS_IMAGES","TAB_KEYS","getCompletionImage","getProgressImage"],
  },{
    path: 'dc/panels/detail/hooks/constants',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_hooks_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/hooks/constants',
          isLayout: false,
          routeExports: dc_panels_detail_hooks_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/hooks/constants',
          requestContext,
          renderMode,
          module: dc_panels_detail_hooks_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-hooks-constants',
    index: undefined,
    id: 'dc/panels/detail/hooks/constants',
    exact: true,
    exports: ["DEBT_COLOR_SCHEMES","getRandomColorScheme"],
  },{
    path: 'dc/panels/detail/hooks/dateUtils',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_hooks_dateUtils,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/hooks/dateUtils',
          isLayout: false,
          routeExports: dc_panels_detail_hooks_dateUtils,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/hooks/dateUtils',
          requestContext,
          renderMode,
          module: dc_panels_detail_hooks_dateUtils,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-hooks-dateutils',
    index: undefined,
    id: 'dc/panels/detail/hooks/dateUtils',
    exact: true,
    exports: ["formatLocalDate","getCurrentCycle","getSimulatedToday","getSimulatedTodayDate"],
  },{
    path: 'dc/panels/happy/components',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/components',
          isLayout: false,
          routeExports: dc_panels_happy_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/components',
          requestContext,
          renderMode,
          module: dc_panels_happy_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-components-index',
    index: true,
    id: 'dc/panels/happy/components',
    exact: true,
    exports: ["AddGoalModal","CreateTripModal","DayTabs","GoalCard","GoalDetailModal","TripDetailModal","TripList","TripSummaryModal","VacationContent"],
  },{
    path: 'dc/panels/happy/utils/dateHelper',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_utils_dateHelper,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/utils/dateHelper',
          isLayout: false,
          routeExports: dc_panels_happy_utils_dateHelper,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/utils/dateHelper',
          requestContext,
          renderMode,
          module: dc_panels_happy_utils_dateHelper,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-utils-datehelper',
    index: undefined,
    id: 'dc/panels/happy/utils/dateHelper',
    exact: true,
    exports: ["formatDate","formatDateISO","getDateOnly","getDaysDiff","getToday","getTripDayIndex","getTripEndDate","isDateInRange","isTripActive","isTripExpired","isTripUpcoming"],
  },{
    path: 'dc/panels/happy/contexts',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_contexts,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/contexts',
          isLayout: false,
          routeExports: dc_panels_happy_contexts,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/contexts',
          requestContext,
          renderMode,
          module: dc_panels_happy_contexts,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-contexts-index',
    index: true,
    id: 'dc/panels/happy/contexts',
    exact: true,
    exports: ["VacationProvider","useVacation"],
  },{
    path: 'dc/panels/happy/hooks/useGoals',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_hooks_useGoals,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/hooks/useGoals',
          isLayout: false,
          routeExports: dc_panels_happy_hooks_useGoals,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/hooks/useGoals',
          requestContext,
          renderMode,
          module: dc_panels_happy_hooks_useGoals,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-hooks-usegoals',
    index: undefined,
    id: 'dc/panels/happy/hooks/useGoals',
    exact: true,
    exports: ["default","useGoals"],
  },{
    path: 'dc/panels/happy/hooks/useTrips',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_hooks_useTrips,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/hooks/useTrips',
          isLayout: false,
          routeExports: dc_panels_happy_hooks_useTrips,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/hooks/useTrips',
          requestContext,
          renderMode,
          module: dc_panels_happy_hooks_useTrips,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-hooks-usetrips',
    index: undefined,
    id: 'dc/panels/happy/hooks/useTrips',
    exact: true,
    exports: ["default","useTrips"],
  },{
    path: 'dc/panels/memorial/hooks',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/hooks',
          isLayout: false,
          routeExports: dc_panels_memorial_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/hooks',
          requestContext,
          renderMode,
          module: dc_panels_memorial_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-hooks-index',
    index: true,
    id: 'dc/panels/memorial/hooks',
    exact: true,
    exports: ["useDateFormat","useMemorials"],
  },{
    path: 'dc/panels/memorial/utils',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_utils,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/utils',
          isLayout: false,
          routeExports: dc_panels_memorial_utils,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/utils',
          requestContext,
          renderMode,
          module: dc_panels_memorial_utils,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-utils-index',
    index: true,
    id: 'dc/panels/memorial/utils',
    exact: true,
    exports: [],
  },{
    path: 'dc/panels/settings/theme',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_theme,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/theme',
          isLayout: false,
          routeExports: dc_panels_settings_theme,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/theme',
          requestContext,
          renderMode,
          module: dc_panels_settings_theme,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-theme-index',
    index: true,
    id: 'dc/panels/settings/theme',
    exact: true,
    exports: ["ThemeProvider","themePresets","useTheme"],
  },{
    path: 'dc/components/MoonPhase',
    async lazy() {
      ;
      return {
        ...dc_components_MoonPhase,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/MoonPhase',
          isLayout: false,
          routeExports: dc_components_MoonPhase,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/MoonPhase',
          requestContext,
          renderMode,
          module: dc_components_MoonPhase,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-moonphase-index',
    index: true,
    id: 'dc/components/MoonPhase',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/hooks',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/hooks',
          isLayout: false,
          routeExports: dc_panels_detail_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/hooks',
          requestContext,
          renderMode,
          module: dc_panels_detail_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-hooks',
    index: undefined,
    id: 'dc/panels/detail/hooks',
    exact: true,
    exports: ["formatLocalDate","getCurrentCycle","getSimulatedToday","getSimulatedTodayDate","getTodayCheckInStatusForTask","useGoalDetail"],
  },{
    path: 'dc/panels/detail/utils',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_utils,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/utils',
          isLayout: false,
          routeExports: dc_panels_detail_utils,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/utils',
          requestContext,
          renderMode,
          module: dc_panels_detail_utils,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-utils-index',
    index: true,
    id: 'dc/panels/detail/utils',
    exact: true,
    exports: ["formatLargeNumber","formatNumber","getDefaultTab","getTabsConfig","isCycleTab"],
  },{
    path: 'dc/panels/happy/hooks',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/hooks',
          isLayout: false,
          routeExports: dc_panels_happy_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/hooks',
          requestContext,
          renderMode,
          module: dc_panels_happy_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-hooks-index',
    index: true,
    id: 'dc/panels/happy/hooks',
    exact: true,
    exports: ["useGoals","useSchedule","useTripNavigation","useTrips"],
  },{
    path: 'dc/panels/happy/utils',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_utils,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/utils',
          isLayout: false,
          routeExports: dc_panels_happy_utils,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/utils',
          requestContext,
          renderMode,
          module: dc_panels_happy_utils,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-utils-index',
    index: true,
    id: 'dc/panels/happy/utils',
    exact: true,
    exports: [],
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
    exports: ["calculateCheckInProgress","calculateChecklistProgress","calculateCurrentCycleNumber","calculateNumericProgress","calculateRemainingDays","isTodayCheckedIn","updateMainlineTaskProgress"],
  },{
    path: 'dc/utils/progressCalculator',
    async lazy() {
      ;
      return {
        ...dc_utils_progressCalculator,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/progressCalculator',
          isLayout: false,
          routeExports: dc_utils_progressCalculator,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/progressCalculator',
          requestContext,
          renderMode,
          module: dc_utils_progressCalculator,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-progresscalculator',
    index: undefined,
    id: 'dc/utils/progressCalculator',
    exact: true,
    exports: ["calculateCheckInProgress","calculateChecklistProgress","calculateNumericProgress","formatLargeNumber","formatNumber","getEffectiveMainlineType"],
  },{
    path: 'dc/components/shared',
    async lazy() {
      ;
      return {
        ...dc_components_shared,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/shared',
          isLayout: false,
          routeExports: dc_components_shared,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/shared',
          requestContext,
          renderMode,
          module: dc_components_shared,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-shared-index',
    index: true,
    id: 'dc/components/shared',
    exact: true,
    exports: ["CircleProgress","ProgressBar","StatCard","StatCardGrid"],
  },{
    path: 'dc/contexts/UIStateContext',
    async lazy() {
      ;
      return {
        ...dc_contexts_UIStateContext,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UIStateContext',
          isLayout: false,
          routeExports: dc_contexts_UIStateContext,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UIStateContext',
          requestContext,
          renderMode,
          module: dc_contexts_UIStateContext,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-uistatecontext',
    index: undefined,
    id: 'dc/contexts/UIStateContext',
    exact: true,
    exports: ["UIStateProvider","default","useUIState"],
  },{
    path: 'dc/panels/memorial/storage',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/storage',
          isLayout: false,
          routeExports: dc_panels_memorial_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/storage',
          requestContext,
          renderMode,
          module: dc_panels_memorial_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-storage',
    index: undefined,
    id: 'dc/panels/memorial/storage',
    exact: true,
    exports: ["generateId","loadDateFormat","loadMemorials","saveDateFormat","saveMemorials"],
  },{
    path: 'dc/components/card',
    async lazy() {
      ;
      return {
        ...dc_components_card,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/card',
          isLayout: false,
          routeExports: dc_components_card,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/card',
          requestContext,
          renderMode,
          module: dc_components_card,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-card-index',
    index: true,
    id: 'dc/components/card',
    exact: true,
    exports: ["MainlineTaskCard","SidelineTaskCard"],
  },{
    path: 'dc/contexts/ThemeContext',
    async lazy() {
      ;
      return {
        ...dc_contexts_ThemeContext,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/ThemeContext',
          isLayout: false,
          routeExports: dc_contexts_ThemeContext,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/ThemeContext',
          requestContext,
          renderMode,
          module: dc_contexts_ThemeContext,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-themecontext',
    index: undefined,
    id: 'dc/contexts/ThemeContext',
    exact: true,
    exports: ["ThemeProvider","default","themePresets","useTheme"],
  },{
    path: 'dc/panels/memorial',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial',
          isLayout: false,
          routeExports: dc_panels_memorial,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial',
          requestContext,
          renderMode,
          module: dc_panels_memorial,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-index',
    index: true,
    id: 'dc/panels/memorial',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/memorial/types',
    async lazy() {
      ;
      return {
        ...dc_panels_memorial_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/memorial/types',
          isLayout: false,
          routeExports: dc_panels_memorial_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/memorial/types',
          requestContext,
          renderMode,
          module: dc_panels_memorial_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-memorial-types',
    index: undefined,
    id: 'dc/panels/memorial/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/panels/settings',
    async lazy() {
      ;
      return {
        ...dc_panels_settings,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings',
          isLayout: false,
          routeExports: dc_panels_settings,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings',
          requestContext,
          renderMode,
          module: dc_panels_settings,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-index',
    index: true,
    id: 'dc/panels/settings',
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
    path: 'dc/contexts/TaskContext',
    async lazy() {
      ;
      return {
        ...dc_contexts_TaskContext,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/TaskContext',
          isLayout: false,
          routeExports: dc_contexts_TaskContext,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/TaskContext',
          requestContext,
          renderMode,
          module: dc_contexts_TaskContext,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-taskcontext',
    index: undefined,
    id: 'dc/contexts/TaskContext',
    exact: true,
    exports: ["TaskProvider","default","useTaskContext"],
  },{
    path: 'dc/hooks/useSpriteImage',
    async lazy() {
      ;
      return {
        ...dc_hooks_useSpriteImage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/useSpriteImage',
          isLayout: false,
          routeExports: dc_hooks_useSpriteImage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/useSpriteImage',
          requestContext,
          renderMode,
          module: dc_hooks_useSpriteImage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-usespriteimage',
    index: undefined,
    id: 'dc/hooks/useSpriteImage',
    exact: true,
    exports: ["useSpriteImage"],
  },{
    path: 'dc/panels/archive',
    async lazy() {
      ;
      return {
        ...dc_panels_archive,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/archive',
          isLayout: false,
          routeExports: dc_panels_archive,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/archive',
          requestContext,
          renderMode,
          module: dc_panels_archive,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-archive-index',
    index: true,
    id: 'dc/panels/archive',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/happy/storage',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/storage',
          isLayout: false,
          routeExports: dc_panels_happy_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/storage',
          requestContext,
          renderMode,
          module: dc_panels_happy_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-storage',
    index: undefined,
    id: 'dc/panels/happy/storage',
    exact: true,
    exports: ["addGoalToSchedule","calculateTripStats","completeGoal","createTrip","deleteGoal","deleteTrip","getTrip","loadTrips","loadVacationState","saveTrips","saveVacationState","updateGoal","updateTrip"],
  },{
    path: 'dc/panels/detail',
    async lazy() {
      ;
      return {
        ...dc_panels_detail,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail',
          isLayout: false,
          routeExports: dc_panels_detail,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail',
          requestContext,
          renderMode,
          module: dc_panels_detail,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-index',
    index: true,
    id: 'dc/panels/detail',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/types',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/types',
          isLayout: false,
          routeExports: dc_panels_detail_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/types',
          requestContext,
          renderMode,
          module: dc_panels_detail_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-types',
    index: undefined,
    id: 'dc/panels/detail/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/panels/normal',
    async lazy() {
      ;
      return {
        ...dc_panels_normal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/normal',
          isLayout: false,
          routeExports: dc_panels_normal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/normal',
          requestContext,
          renderMode,
          module: dc_panels_normal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-normal-index',
    index: true,
    id: 'dc/panels/normal',
    exact: true,
    exports: [],
  },{
    path: 'dc/panels/happy',
    async lazy() {
      ;
      return {
        ...dc_panels_happy,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy',
          isLayout: false,
          routeExports: dc_panels_happy,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy',
          requestContext,
          renderMode,
          module: dc_panels_happy,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-index',
    index: true,
    id: 'dc/panels/happy',
    exact: true,
    exports: ["DayTabs","GoalCard","TripList","VacationContent","VacationProvider","default","useGoals","useSchedule","useTripNavigation","useTrips","useVacation"],
  },{
    path: 'dc/panels/happy/types',
    async lazy() {
      ;
      return {
        ...dc_panels_happy_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/happy/types',
          isLayout: false,
          routeExports: dc_panels_happy_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/happy/types',
          requestContext,
          renderMode,
          module: dc_panels_happy_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-happy-types',
    index: undefined,
    id: 'dc/panels/happy/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/constants/sprites',
    async lazy() {
      ;
      return {
        ...dc_constants_sprites,
        Component: () => WrapRouteComponent({
          routeId: 'dc/constants/sprites',
          isLayout: false,
          routeExports: dc_constants_sprites,
        }),
        loader: createRouteLoader({
          routeId: 'dc/constants/sprites',
          requestContext,
          renderMode,
          module: dc_constants_sprites,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-constants-sprites',
    index: undefined,
    id: 'dc/constants/sprites',
    exact: true,
    exports: ["EMPTY_STATE_IMAGE","MEMORIAL_SPRITE_IMAGES","SPRITE_IMAGES","TRIP_SPRITE_IMAGES","VACATION_SPRITE_IMAGES","getCurrentTimeSlot"],
  },{
    path: 'dc/hooks/useProgress',
    async lazy() {
      ;
      return {
        ...dc_hooks_useProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/useProgress',
          isLayout: false,
          routeExports: dc_hooks_useProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/useProgress',
          requestContext,
          renderMode,
          module: dc_hooks_useProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-useprogress',
    index: undefined,
    id: 'dc/hooks/useProgress',
    exact: true,
    exports: ["usePlanEndStatus","useProgress","useTodayCheckInStatus"],
  },{
    path: 'dc/hooks/useTaskSort',
    async lazy() {
      ;
      return {
        ...dc_hooks_useTaskSort,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/useTaskSort',
          isLayout: false,
          routeExports: dc_hooks_useTaskSort,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/useTaskSort',
          requestContext,
          renderMode,
          module: dc_hooks_useTaskSort,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-usetasksort',
    index: undefined,
    id: 'dc/hooks/useTaskSort',
    exact: true,
    exports: ["useTaskSort"],
  },{
    path: 'dc/components',
    async lazy() {
      ;
      return {
        ...dc_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components',
          isLayout: false,
          routeExports: dc_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components',
          requestContext,
          renderMode,
          module: dc_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-index',
    index: true,
    id: 'dc/components',
    exact: true,
    exports: ["CircleProgress","CreateGoalModal","CreateMainlineTaskModal","DailyProgress","MainlineTaskCard","MoonPhase","ProgressBar","RandomTaskPicker","SidelineTaskCard","SidelineTaskGrid","StatCard","StatCardGrid","ThemedButton","TodayProgress"],
  },{
    path: 'dc/constants/colors',
    async lazy() {
      ;
      return {
        ...dc_constants_colors,
        Component: () => WrapRouteComponent({
          routeId: 'dc/constants/colors',
          isLayout: false,
          routeExports: dc_constants_colors,
        }),
        loader: createRouteLoader({
          routeId: 'dc/constants/colors',
          requestContext,
          renderMode,
          module: dc_constants_colors,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-constants-colors',
    index: undefined,
    id: 'dc/constants/colors',
    exact: true,
    exports: ["DEBT_COLOR_SCHEMES","SIDELINE_THEME_COLORS","getNextThemeColor","getRandomDebtColorScheme"],
  },{
    path: 'dc/constants',
    async lazy() {
      ;
      return {
        ...dc_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/constants',
          isLayout: false,
          routeExports: dc_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/constants',
          requestContext,
          renderMode,
          module: dc_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-constants-index',
    index: true,
    id: 'dc/constants',
    exact: true,
    exports: ["DEBT_COLOR_SCHEMES","EMPTY_STATE_IMAGE","MEMORIAL_SPRITE_IMAGES","SIDELINE_THEME_COLORS","SPRITE_IMAGES","TRIP_SPRITE_IMAGES","VACATION_SPRITE_IMAGES","getCurrentTimeSlot","getNextThemeColor","getRandomDebtColorScheme"],
  },{
    path: 'dc/contexts',
    async lazy() {
      ;
      return {
        ...dc_contexts,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts',
          isLayout: false,
          routeExports: dc_contexts,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts',
          requestContext,
          renderMode,
          module: dc_contexts,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-index',
    index: true,
    id: 'dc/contexts',
    exact: true,
    exports: ["TaskProvider","ThemeProvider","UIStateProvider","themePresets","useTaskContext","useTheme","useUIState"],
  },{
    path: 'dc/panels',
    async lazy() {
      ;
      return {
        ...dc_panels,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels',
          isLayout: false,
          routeExports: dc_panels,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels',
          requestContext,
          renderMode,
          module: dc_panels,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-index',
    index: true,
    id: 'dc/panels',
    exact: true,
    exports: ["ArchiveList","GoalDetailModal","HappyPanel","Settings"],
  },{
    path: 'dc/hooks',
    async lazy() {
      ;
      return {
        ...dc_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks',
          isLayout: false,
          routeExports: dc_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks',
          requestContext,
          renderMode,
          module: dc_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-index',
    index: true,
    id: 'dc/hooks',
    exact: true,
    exports: ["formatLocalDate","getCurrentCycle","getSimulatedToday","getSimulatedTodayDate","getTodayCheckInStatusForTask","usePlanEndStatus","useProgress","useSpriteImage","useTaskSort","useTodayCheckInStatus"],
  },{
    path: 'dc/utils',
    async lazy() {
      ;
      return {
        ...dc_utils,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils',
          isLayout: false,
          routeExports: dc_utils,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils',
          requestContext,
          renderMode,
          module: dc_utils,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-index',
    index: true,
    id: 'dc/utils',
    exact: true,
    exports: ["CycleCalculator","calculateCheckInProgress","calculateCheckInProgressV2","calculateChecklistProgress","calculateChecklistProgressV2","calculateCurrentCycleNumber","calculateNumericProgress","calculateNumericProgressV2","calculateRemainingDays","formatLargeNumber","formatNumber","getEffectiveMainlineType","isTodayCheckedIn","updateMainlineTaskProgress"],
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
    path: 'dc',
    async lazy() {
      ;
      return {
        ...dc,
        Component: () => WrapRouteComponent({
          routeId: 'dc',
          isLayout: false,
          routeExports: dc,
        }),
        loader: createRouteLoader({
          routeId: 'dc',
          requestContext,
          renderMode,
          module: dc,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-index',
    index: true,
    id: 'dc',
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
