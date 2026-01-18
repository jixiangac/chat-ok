import { createRouteLoader, WrapRouteComponent, RouteErrorComponent } from '@ice/runtime';
import type { CreateRoutes } from '@ice/runtime';
import * as dc_components_CreateMainlineTaskModal_steps_configs_ChecklistConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/ChecklistConfig';
import * as dc_components_CreateMainlineTaskModal_steps_configs_CheckInConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/CheckInConfig';
import * as dc_components_CreateMainlineTaskModal_steps_configs_NumericConfig from '@/pages/dc/components/CreateMainlineTaskModal/steps/configs/NumericConfig';
import * as dc_panels_memorial_components_CreateMemorialModal_LoadingSkeleton from '@/pages/dc/panels/memorial/components/CreateMemorialModal/LoadingSkeleton';
import * as dc_components_CreateGoalModal_components_EncouragementInput from '@/pages/dc/components/CreateGoalModal/components/EncouragementInput';
import * as dc_viewmodel_CreateTaskModal_steps_configs_ChecklistConfig from '@/pages/dc/viewmodel/CreateTaskModal/steps/configs/ChecklistConfig';
import * as dc_components_CreateGoalModal_components_DurationSelector from '@/pages/dc/components/CreateGoalModal/components/DurationSelector';
import * as dc_components_CreateGoalModal_components_PrioritySelector from '@/pages/dc/components/CreateGoalModal/components/PrioritySelector';
import * as dc_components_CreateGoalModal_components_RulesExplanation from '@/pages/dc/components/CreateGoalModal/components/RulesExplanation';
import * as dc_components_CreateGoalModal_components_TaskTypeSelector from '@/pages/dc/components/CreateGoalModal/components/TaskTypeSelector';
import * as dc_panels_memorial_components_MemorialCardSkeleton from '@/pages/dc/panels/memorial/components/MemorialCardSkeleton/index';
import * as dc_panels_memorial_components_MemorialListSkeleton from '@/pages/dc/panels/memorial/components/MemorialListSkeleton/index';
import * as dc_viewmodel_CreateTaskModal_steps_configs_CheckInConfig from '@/pages/dc/viewmodel/CreateTaskModal/steps/configs/CheckInConfig';
import * as dc_viewmodel_CreateTaskModal_steps_configs_NumericConfig from '@/pages/dc/viewmodel/CreateTaskModal/steps/configs/NumericConfig';
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
import * as dc_panels_detail_components_ActivityRecordPanel from '@/pages/dc/panels/detail/components/ActivityRecordPanel/index';
import * as dc_panels_detail_components_CheckInHistoryPanel from '@/pages/dc/panels/detail/components/CheckInHistoryPanel/index';
import * as dc_panels_detail_components_ChecklistCyclePanel from '@/pages/dc/panels/detail/components/ChecklistCyclePanel/index';
import * as dc_panels_settings_components_BottomFixedButton from '@/pages/dc/panels/settings/components/BottomFixedButton/index';
import * as dc_components_CreateMainlineTaskModal_steps_TypeStep from '@/pages/dc/components/CreateMainlineTaskModal/steps/TypeStep';
import * as dc_panels_detail_components_CheckInRecordPanel from '@/pages/dc/panels/detail/components/CheckInRecordPanel/index';
import * as dc_panels_detail_components_CycleSummaryDialog from '@/pages/dc/panels/detail/components/CycleSummaryDialog/index';
import * as dc_panels_detail_components_HistoryRecordPanel from '@/pages/dc/panels/detail/components/HistoryRecordPanel/index';
import * as dc_panels_memorial_components_BackgroundPicker from '@/pages/dc/panels/memorial/components/BackgroundPicker/index';
import * as dc_panels_settings_components_SettingsListItem from '@/pages/dc/panels/settings/components/SettingsListItem/index';
import * as dc_panels_settings_pages_TodayMustCompletePage from '@/pages/dc/panels/settings/pages/TodayMustCompletePage/index';
import * as dc_panels_detail_components_CalendarViewPanel from '@/pages/dc/panels/detail/components/CalendarViewPanel/index';
import * as dc_panels_detail_components_CheckInCyclePanel from '@/pages/dc/panels/detail/components/CheckInCyclePanel/index';
import * as dc_panels_detail_components_CoffeeCupProgress from '@/pages/dc/panels/detail/components/CoffeeCupProgress/index';
import * as dc_panels_detail_components_HistoryCyclePanel from '@/pages/dc/panels/detail/components/HistoryCyclePanel/index';
import * as dc_panels_detail_components_NumericCyclePanel from '@/pages/dc/panels/detail/components/NumericCyclePanel/index';
import * as dc_panels_settings_components_SettingsSection from '@/pages/dc/panels/settings/components/SettingsSection/index';
import * as dc_panels_detail_components_PlanEndedSummary from '@/pages/dc/panels/detail/components/PlanEndedSummary/index';
import * as dc_panels_detail_components_TodayProgressBar from '@/pages/dc/panels/detail/components/TodayProgressBar/index';
import * as dc_panels_detail_components_WaterCupProgress from '@/pages/dc/panels/detail/components/WaterCupProgress/index';
import * as dc_panels_memorial_components_MemorialDetail from '@/pages/dc/panels/memorial/components/MemorialDetail/index';
import * as dc_components_CreateMainlineTaskModal_steps from '@/pages/dc/components/CreateMainlineTaskModal/steps/index';
import * as dc_panels_detail_components_ProgressSection from '@/pages/dc/panels/detail/components/ProgressSection/index';
import * as dc_panels_detail_components_RecordDataModal from '@/pages/dc/panels/detail/components/RecordDataModal/index';
import * as dc_panels_happy_components_TripSummaryModal from '@/pages/dc/panels/happy/components/TripSummaryModal/index';
import * as dc_panels_settings_components_SubPageLayout from '@/pages/dc/panels/settings/components/SubPageLayout/index';
import * as dc_panels_settings_pages_DataManagementPage from '@/pages/dc/panels/settings/pages/DataManagementPage/index';
import * as dc_panels_happy_components_CreateTripModal from '@/pages/dc/panels/happy/components/CreateTripModal/index';
import * as dc_panels_happy_components_GoalDetailModal from '@/pages/dc/panels/happy/components/GoalDetailModal/index';
import * as dc_panels_happy_components_TripDetailModal from '@/pages/dc/panels/happy/components/TripDetailModal/index';
import * as dc_panels_happy_components_VacationContent from '@/pages/dc/panels/happy/components/VacationContent/index';
import * as dc_panels_memorial_components_MemorialCard from '@/pages/dc/panels/memorial/components/MemorialCard/index';
import * as dc_panels_settings_pages_ThemeSettingsPage from '@/pages/dc/panels/settings/pages/ThemeSettingsPage/index';
import * as dc_components_CreateMainlineTaskModal_constants from '@/pages/dc/components/CreateMainlineTaskModal/constants';
import * as dc_panels_settings_pages_SettingsMainPage from '@/pages/dc/panels/settings/pages/SettingsMainPage/index';
import * as dc_components_CreateGoalModal_components from '@/pages/dc/components/CreateGoalModal/components/index';
import * as dc_components_DuckWaterProgress_DuckSilhouette from '@/pages/dc/components/DuckWaterProgress/DuckSilhouette';
import * as dc_panels_detail_components_CheckInModal from '@/pages/dc/panels/detail/components/CheckInModal/index';
import * as dc_panels_detail_components_DetailHeader from '@/pages/dc/panels/detail/components/DetailHeader/index';
import * as dc_panels_detail_components_SecondaryNav from '@/pages/dc/panels/detail/components/SecondaryNav/index';
import * as dc_panels_memorial_components_IconPicker from '@/pages/dc/panels/memorial/components/IconPicker/index';
import * as dc_panels_settings_pages_TagSettingsPage from '@/pages/dc/panels/settings/pages/TagSettingsPage/index';
import * as dc_panels_happy_components_AddGoalModal from '@/pages/dc/panels/happy/components/AddGoalModal/index';
import * as dc_panels_settings_UnifiedSettingsPanel from '@/pages/dc/panels/settings/UnifiedSettingsPanel/index';
import * as dc_viewmodel_CreateTaskModal_steps_ConfigStep from '@/pages/dc/viewmodel/CreateTaskModal/steps/ConfigStep';
import * as dc_panels_detail_components_GoalHeader from '@/pages/dc/panels/detail/components/GoalHeader/index';
import * as dc_panels_happy_components_TripList_TripCard from '@/pages/dc/panels/happy/components/TripList/TripCard';
import * as dc_viewmodel_CreateTaskModal_steps_CycleStep from '@/pages/dc/viewmodel/CreateTaskModal/steps/CycleStep';
import * as dc_components_CreateMainlineTaskModal from '@/pages/dc/components/CreateMainlineTaskModal/index';
import * as dc_components_CreateMainlineTaskModal_types from '@/pages/dc/components/CreateMainlineTaskModal/types';
import * as dc_panels_detail_components_CycleInfo from '@/pages/dc/panels/detail/components/CycleInfo/index';
import * as dc_panels_settings_pages_DateTestPage from '@/pages/dc/panels/settings/pages/DateTestPage/index';
import * as dc_viewmodel_CreateTaskModal_steps_TypeStep from '@/pages/dc/viewmodel/CreateTaskModal/steps/TypeStep';
import * as dc_components_DuckWaterProgress_WaterWave from '@/pages/dc/components/DuckWaterProgress/WaterWave';
import * as dc_components_SidelineTaskEditModal from '@/pages/dc/components/SidelineTaskEditModal/index';
import * as dc_components_shared_CircleProgress from '@/pages/dc/components/shared/CircleProgress/index';
import * as dc_panels_happy_components_GoalCard from '@/pages/dc/panels/happy/components/GoalCard/index';
import * as dc_panels_happy_components_TripList from '@/pages/dc/panels/happy/components/TripList/index';
import * as dc_viewmodel_TodayMustCompleteModal from '@/pages/dc/viewmodel/TodayMustCompleteModal/index';
import * as dc_components_SecondFloorIndicator from '@/pages/dc/components/SecondFloorIndicator/index';
import * as dc_panels_detail_components_TabBar from '@/pages/dc/panels/detail/components/TabBar/index';
import * as dc_panels_happy_components_DayTabs from '@/pages/dc/panels/happy/components/DayTabs/index';
import * as dc_panels_happy_contexts_VacationContext from '@/pages/dc/panels/happy/contexts/VacationContext';
import * as dc_panels_memorial_constants_backgrounds from '@/pages/dc/panels/memorial/constants/backgrounds';
import * as dc_viewmodel_CreateTaskModal_steps from '@/pages/dc/viewmodel/CreateTaskModal/steps/index';
import * as dc_components_CreateGoalModal_constants from '@/pages/dc/components/CreateGoalModal/constants';
import * as dc_contexts_CultivationProvider_storage from '@/pages/dc/contexts/CultivationProvider/storage';
import * as dc_panels_happy_hooks_useTripNavigation from '@/pages/dc/panels/happy/hooks/useTripNavigation';
import * as dc_panels_memorial_utils_dateCalculator from '@/pages/dc/panels/memorial/utils/dateCalculator';
import * as dc_viewmodel_AllSidelineTasksList from '@/pages/dc/viewmodel/AllSidelineTasksList/index';
import * as dc_components_QuickActionButtons from '@/pages/dc/components/QuickActionButtons/index';
import * as dc_components_shared_ProgressBar from '@/pages/dc/components/shared/ProgressBar/index';
import * as dc_contexts_SceneProvider_cacheManager from '@/pages/dc/contexts/SceneProvider/cacheManager';
import * as dc_contexts_SceneProvider_indexBuilder from '@/pages/dc/contexts/SceneProvider/indexBuilder';
import * as dc_panels_cultivation_SecondFloorPanel from '@/pages/dc/panels/cultivation/SecondFloorPanel';
import * as dc_panels_memorial_hooks_useDateFormat from '@/pages/dc/panels/memorial/hooks/useDateFormat';
import * as dc_panels_settings_ThemeSettings from '@/pages/dc/panels/settings/ThemeSettings/index';
import * as dc_viewmodel_CreateTaskModal_constants from '@/pages/dc/viewmodel/CreateTaskModal/constants';
import * as dc_viewmodel_MainlineTaskSection from '@/pages/dc/viewmodel/MainlineTaskSection/index';
import * as dc_viewmodel_SidelineTaskSection from '@/pages/dc/viewmodel/SidelineTaskSection/index';
import * as dc_components_DuckWaterProgress from '@/pages/dc/components/DuckWaterProgress/index';
import * as dc_contexts_CultivationProvider from '@/pages/dc/contexts/CultivationProvider/index';
import * as dc_contexts_CultivationProvider_types from '@/pages/dc/contexts/CultivationProvider/types';
import * as dc_panels_memorial_hooks_useMemorials from '@/pages/dc/panels/memorial/hooks/useMemorials';
import * as dc_panels_settings_hooks_usePageStack from '@/pages/dc/panels/settings/hooks/usePageStack';
import * as dc_panels_settings_hooks_useSwipeBack from '@/pages/dc/panels/settings/hooks/useSwipeBack';
import * as dc_viewmodel_CultivationSection from '@/pages/dc/viewmodel/CultivationSection/index';
import * as dc_components_CultivationEntry from '@/pages/dc/components/CultivationEntry/index';
import * as dc_components_GroupDetailPopup from '@/pages/dc/components/GroupDetailPopup/index';
import * as dc_panels_detail_hooks_checkInStatus from '@/pages/dc/panels/detail/hooks/checkInStatus';
import * as dc_panels_happy_utils_scheduleHelper from '@/pages/dc/panels/happy/utils/scheduleHelper';
import * as dc_panels_settings_TagSettings from '@/pages/dc/panels/settings/TagSettings/index';
import * as dc_components_CreateGoalModal from '@/pages/dc/components/CreateGoalModal/index';
import * as dc_components_CreateGoalModal_types from '@/pages/dc/components/CreateGoalModal/types';
import * as dc_components_card_MainlineTaskCard from '@/pages/dc/components/card/MainlineTaskCard';
import * as dc_components_card_SidelineTaskCard from '@/pages/dc/components/card/SidelineTaskCard';
import * as dc_components_shared_StatCard from '@/pages/dc/components/shared/StatCard/index';
import * as dc_panels_memorial_components from '@/pages/dc/panels/memorial/components/index';
import * as dc_panels_settings_components from '@/pages/dc/panels/settings/components/index';
import * as dc_viewmodel_RandomTaskPicker from '@/pages/dc/viewmodel/RandomTaskPicker/index';
import * as dc_viewmodel_SidelineTaskGrid from '@/pages/dc/viewmodel/SidelineTaskGrid/index';
import * as dc_components_LocationFilter from '@/pages/dc/components/LocationFilter/index';
import * as dc_components_MigrationModal from '@/pages/dc/components/MigrationModal/index';
import * as dc_panels_memorial_constants_icons from '@/pages/dc/panels/memorial/constants/icons';
import * as dc_panels_memorial_constants from '@/pages/dc/panels/memorial/constants/index';
import * as dc_viewmodel_CreateTaskModal from '@/pages/dc/viewmodel/CreateTaskModal/index';
import * as dc_viewmodel_CreateTaskModal_types from '@/pages/dc/viewmodel/CreateTaskModal/types';
import * as dc_components_DailyProgress from '@/pages/dc/components/DailyProgress/index';
import * as dc_components_PullIndicator from '@/pages/dc/components/PullIndicator/index';
import * as dc_contexts_SceneProvider_storage from '@/pages/dc/contexts/SceneProvider/storage';
import * as dc_panels_detail_components from '@/pages/dc/panels/detail/components/index';
import * as dc_panels_happy_hooks_useSchedule from '@/pages/dc/panels/happy/hooks/useSchedule';
import * as dc_utils_todayMustCompleteStorage from '@/pages/dc/utils/todayMustCompleteStorage';
import * as dc_viewmodel_DailyViewPopup from '@/pages/dc/viewmodel/DailyViewPopup/index';
import * as dc_components_ThemedButton from '@/pages/dc/components/ThemedButton/index';
import * as dc_contexts_UserProvider_storage from '@/pages/dc/contexts/UserProvider/storage';
import * as dc_panels_detail_constants from '@/pages/dc/panels/detail/constants/index';
import * as dc_panels_detail_hooks_constants from '@/pages/dc/panels/detail/hooks/constants';
import * as dc_panels_detail_hooks_dateUtils from '@/pages/dc/panels/detail/hooks/dateUtils';
import * as dc_panels_happy_components from '@/pages/dc/panels/happy/components/index';
import * as dc_panels_happy_utils_dateHelper from '@/pages/dc/panels/happy/utils/dateHelper';
import * as dc_viewmodel_GroupModeGrid from '@/pages/dc/viewmodel/GroupModeGrid/index';
import * as dc_viewmodel_TodayProgress from '@/pages/dc/viewmodel/TodayProgress/index';
import * as dc_components_TagSelector from '@/pages/dc/components/TagSelector/index';
import * as dc_contexts_AppProvider_storage from '@/pages/dc/contexts/AppProvider/storage';
import * as dc_contexts_SceneProvider from '@/pages/dc/contexts/SceneProvider/index';
import * as dc_contexts_SceneProvider_types from '@/pages/dc/contexts/SceneProvider/types';
import * as dc_contexts_WorldProvider from '@/pages/dc/contexts/WorldProvider/index';
import * as dc_contexts_WorldProvider_types from '@/pages/dc/contexts/WorldProvider/types';
import * as dc_contexts_TaskProvider from '@/pages/dc/contexts/TaskProvider/index';
import * as dc_contexts_TaskProvider_types from '@/pages/dc/contexts/TaskProvider/types';
import * as dc_contexts_UserProvider from '@/pages/dc/contexts/UserProvider/index';
import * as dc_contexts_UserProvider_types from '@/pages/dc/contexts/UserProvider/types';
import * as dc_panels_happy_contexts from '@/pages/dc/panels/happy/contexts/index';
import * as dc_panels_happy_hooks_useGoals from '@/pages/dc/panels/happy/hooks/useGoals';
import * as dc_panels_happy_hooks_useTrips from '@/pages/dc/panels/happy/hooks/useTrips';
import * as dc_panels_memorial_hooks from '@/pages/dc/panels/memorial/hooks/index';
import * as dc_panels_memorial_utils from '@/pages/dc/panels/memorial/utils/index';
import * as dc_panels_settings_hooks from '@/pages/dc/panels/settings/hooks/index';
import * as dc_panels_settings_pages from '@/pages/dc/panels/settings/pages/index';
import * as dc_contexts_AppProvider from '@/pages/dc/contexts/AppProvider/index';
import * as dc_contexts_AppProvider_types from '@/pages/dc/contexts/AppProvider/types';
import * as dc_hooks_usePullToSecondFloor from '@/pages/dc/hooks/usePullToSecondFloor';
import * as dc_hooks_useTodayMustComplete from '@/pages/dc/hooks/useTodayMustComplete';
import * as dc_contexts_UIProvider_hooks from '@/pages/dc/contexts/UIProvider/hooks';
import * as dc_contexts_UIProvider from '@/pages/dc/contexts/UIProvider/index';
import * as dc_contexts_UIProvider_types from '@/pages/dc/contexts/UIProvider/types';
import * as dc_panels_detail_hooks from '@/pages/dc/panels/detail/hooks';
import * as dc_panels_detail_utils from '@/pages/dc/panels/detail/utils/index';
import * as dc_viewmodel_GroupCard from '@/pages/dc/viewmodel/GroupCard/index';
import * as dc_viewmodel_MoonPhase from '@/pages/dc/viewmodel/MoonPhase/index';
import * as dc_contexts_UIProvider_keys from '@/pages/dc/contexts/UIProvider/keys';
import * as dc_panels_cultivation from '@/pages/dc/panels/cultivation/index';
import * as dc_panels_happy_hooks from '@/pages/dc/panels/happy/hooks/index';
import * as dc_panels_happy_utils from '@/pages/dc/panels/happy/utils/index';
import * as dc_utils_mainlineTaskHelper from '@/pages/dc/utils/mainlineTaskHelper';
import * as dc_utils_progressCalculator from '@/pages/dc/utils/progressCalculator';
import * as dc_components_shared from '@/pages/dc/components/shared/index';
import * as dc_panels_memorial_storage from '@/pages/dc/panels/memorial/storage';
import * as dc_utils_dataExportImport from '@/pages/dc/utils/dataExportImport';
import * as dc_utils_developerStorage from '@/pages/dc/utils/developerStorage';
import * as dc_components_card from '@/pages/dc/components/card/index';
import * as dc_constants_cultivation from '@/pages/dc/constants/cultivation';
import * as dc_hooks_usePullToReveal from '@/pages/dc/hooks/usePullToReveal';
import * as dc_panels_memorial from '@/pages/dc/panels/memorial/index';
import * as dc_panels_memorial_types from '@/pages/dc/panels/memorial/types';
import * as dc_utils_cycleCalculator from '@/pages/dc/utils/cycleCalculator';
import * as dc_utils_dailyViewFilter from '@/pages/dc/utils/dailyViewFilter';
import * as dc_constants_animations from '@/pages/dc/constants/animations';
import * as dc_hooks_useSpriteImage from '@/pages/dc/hooks/useSpriteImage';
import * as dc_panels_archive from '@/pages/dc/panels/archive/index';
import * as dc_panels_happy_storage from '@/pages/dc/panels/happy/storage';
import * as dc_utils_archiveStorage from '@/pages/dc/utils/archiveStorage';
import * as dc_utils_dailyDataReset from '@/pages/dc/utils/dailyDataReset';
import * as dc_utils_dailyViewCache from '@/pages/dc/utils/dailyViewCache';
import * as dc_panels_detail from '@/pages/dc/panels/detail/index';
import * as dc_panels_detail_types from '@/pages/dc/panels/detail/types';
import * as dc_panels_normal from '@/pages/dc/panels/normal/index';
import * as dc_panels_happy from '@/pages/dc/panels/happy/index';
import * as dc_panels_happy_types from '@/pages/dc/panels/happy/types';
import * as dc_constants_sprites from '@/pages/dc/constants/sprites';
import * as dc_hooks_useConfetti from '@/pages/dc/hooks/useConfetti';
import * as dc_hooks_useProgress from '@/pages/dc/hooks/useProgress';
import * as dc_hooks_useTaskSort from '@/pages/dc/hooks/useTaskSort';
import * as dc_types_cultivation from '@/pages/dc/types/cultivation';
import * as dc_utils_cultivation from '@/pages/dc/utils/cultivation';
import * as dc_utils_dateTracker from '@/pages/dc/utils/dateTracker';
import * as dc_components from '@/pages/dc/components/index';
import * as dc_constants_colors from '@/pages/dc/constants/colors';
import * as dc_riv_CoffeeCupSvg from '@/pages/dc/riv/CoffeeCupSvg';
import * as dc_riv_RiveWatering from '@/pages/dc/riv/RiveWatering';
import * as dc_utils_responsive from '@/pages/dc/utils/responsive';
import * as dc_utils_tagStorage from '@/pages/dc/utils/tagStorage';
import * as dc_constants from '@/pages/dc/constants/index';
import * as dc_riv_RiveCuteing from '@/pages/dc/riv/RiveCuteing';
import * as dc_utils_migration from '@/pages/dc/utils/migration';
import * as dc_viewmodel from '@/pages/dc/viewmodel/index';
import * as dc_contexts from '@/pages/dc/contexts/index';
import * as dc_panels from '@/pages/dc/panels/index';
import * as dc_hooks from '@/pages/dc/hooks/index';
import * as dc_types from '@/pages/dc/types';
import * as dc_utils from '@/pages/dc/utils/index';
import * as dc_riv_DieCat from '@/pages/dc/riv/DieCat';
import * as dc_riv from '@/pages/dc/riv/index';
import * as stock_self from '@/pages/stock_self';
import * as aloglist from '@/pages/aloglist';
import * as dc from '@/pages/dc/index';
import * as aitrend from '@/pages/aitrend';
import * as apply from '@/pages/apply';
import * as image from '@/pages/image';
import * as _ from '@/pages/index';
import * as intro from '@/pages/intro';
import * as quant from '@/pages/quant';
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
    path: 'dc/viewmodel/CreateTaskModal/steps/configs/ChecklistConfig',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_configs_ChecklistConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/ChecklistConfig',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_configs_ChecklistConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/ChecklistConfig',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_configs_ChecklistConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-configs-checklistconfig',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/configs/ChecklistConfig',
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
    path: 'dc/viewmodel/CreateTaskModal/steps/configs/CheckInConfig',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_configs_CheckInConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/CheckInConfig',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_configs_CheckInConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/CheckInConfig',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_configs_CheckInConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-configs-checkinconfig',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/configs/CheckInConfig',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/CreateTaskModal/steps/configs/NumericConfig',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_configs_NumericConfig,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/NumericConfig',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_configs_NumericConfig,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/configs/NumericConfig',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_configs_NumericConfig,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-configs-numericconfig',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/configs/NumericConfig',
    exact: true,
    exports: ["default"],
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
    path: 'dc/panels/detail/components/ActivityRecordPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_ActivityRecordPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/ActivityRecordPanel',
          isLayout: false,
          routeExports: dc_panels_detail_components_ActivityRecordPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/ActivityRecordPanel',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_ActivityRecordPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-activityrecordpanel-index',
    index: true,
    id: 'dc/panels/detail/components/ActivityRecordPanel',
    exact: true,
    exports: ["ActivityRecordPanel","default"],
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
    path: 'dc/panels/settings/components/BottomFixedButton',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_components_BottomFixedButton,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/components/BottomFixedButton',
          isLayout: false,
          routeExports: dc_panels_settings_components_BottomFixedButton,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/components/BottomFixedButton',
          requestContext,
          renderMode,
          module: dc_panels_settings_components_BottomFixedButton,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-components-bottomfixedbutton-index',
    index: true,
    id: 'dc/panels/settings/components/BottomFixedButton',
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
    path: 'dc/panels/settings/components/SettingsListItem',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_components_SettingsListItem,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/components/SettingsListItem',
          isLayout: false,
          routeExports: dc_panels_settings_components_SettingsListItem,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/components/SettingsListItem',
          requestContext,
          renderMode,
          module: dc_panels_settings_components_SettingsListItem,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-components-settingslistitem-index',
    index: true,
    id: 'dc/panels/settings/components/SettingsListItem',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/settings/pages/TodayMustCompletePage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_TodayMustCompletePage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/TodayMustCompletePage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_TodayMustCompletePage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/TodayMustCompletePage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_TodayMustCompletePage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-todaymustcompletepage-index',
    index: true,
    id: 'dc/panels/settings/pages/TodayMustCompletePage',
    exact: true,
    exports: ["default"],
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
    path: 'dc/panels/detail/components/CoffeeCupProgress',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CoffeeCupProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CoffeeCupProgress',
          isLayout: false,
          routeExports: dc_panels_detail_components_CoffeeCupProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CoffeeCupProgress',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CoffeeCupProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-coffeecupprogress-index',
    index: true,
    id: 'dc/panels/detail/components/CoffeeCupProgress',
    exact: true,
    exports: ["CoffeeCupProgress","default"],
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
    path: 'dc/panels/settings/components/SettingsSection',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_components_SettingsSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/components/SettingsSection',
          isLayout: false,
          routeExports: dc_panels_settings_components_SettingsSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/components/SettingsSection',
          requestContext,
          renderMode,
          module: dc_panels_settings_components_SettingsSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-components-settingssection-index',
    index: true,
    id: 'dc/panels/settings/components/SettingsSection',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/detail/components/PlanEndedSummary',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_PlanEndedSummary,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/PlanEndedSummary',
          isLayout: false,
          routeExports: dc_panels_detail_components_PlanEndedSummary,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/PlanEndedSummary',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_PlanEndedSummary,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-planendedsummary-index',
    index: true,
    id: 'dc/panels/detail/components/PlanEndedSummary',
    exact: true,
    exports: [],
  },{
    path: 'dc/panels/detail/components/TodayProgressBar',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_TodayProgressBar,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/TodayProgressBar',
          isLayout: false,
          routeExports: dc_panels_detail_components_TodayProgressBar,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/TodayProgressBar',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_TodayProgressBar,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-todayprogressbar-index',
    index: true,
    id: 'dc/panels/detail/components/TodayProgressBar',
    exact: true,
    exports: ["TodayProgressBar","default"],
  },{
    path: 'dc/panels/detail/components/WaterCupProgress',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_WaterCupProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/WaterCupProgress',
          isLayout: false,
          routeExports: dc_panels_detail_components_WaterCupProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/WaterCupProgress',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_WaterCupProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-watercupprogress-index',
    index: true,
    id: 'dc/panels/detail/components/WaterCupProgress',
    exact: true,
    exports: ["WaterCupProgress","default"],
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
    path: 'dc/panels/settings/components/SubPageLayout',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_components_SubPageLayout,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/components/SubPageLayout',
          isLayout: false,
          routeExports: dc_panels_settings_components_SubPageLayout,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/components/SubPageLayout',
          requestContext,
          renderMode,
          module: dc_panels_settings_components_SubPageLayout,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-components-subpagelayout-index',
    index: true,
    id: 'dc/panels/settings/components/SubPageLayout',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/panels/settings/pages/DataManagementPage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_DataManagementPage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/DataManagementPage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_DataManagementPage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/DataManagementPage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_DataManagementPage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-datamanagementpage-index',
    index: true,
    id: 'dc/panels/settings/pages/DataManagementPage',
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
    path: 'dc/panels/settings/pages/ThemeSettingsPage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_ThemeSettingsPage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/ThemeSettingsPage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_ThemeSettingsPage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/ThemeSettingsPage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_ThemeSettingsPage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-themesettingspage-index',
    index: true,
    id: 'dc/panels/settings/pages/ThemeSettingsPage',
    exact: true,
    exports: ["default"],
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
    path: 'dc/panels/settings/pages/SettingsMainPage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_SettingsMainPage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/SettingsMainPage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_SettingsMainPage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/SettingsMainPage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_SettingsMainPage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-settingsmainpage-index',
    index: true,
    id: 'dc/panels/settings/pages/SettingsMainPage',
    exact: true,
    exports: ["default"],
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
    path: 'dc/components/DuckWaterProgress/DuckSilhouette',
    async lazy() {
      ;
      return {
        ...dc_components_DuckWaterProgress_DuckSilhouette,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/DuckWaterProgress/DuckSilhouette',
          isLayout: false,
          routeExports: dc_components_DuckWaterProgress_DuckSilhouette,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/DuckWaterProgress/DuckSilhouette',
          requestContext,
          renderMode,
          module: dc_components_DuckWaterProgress_DuckSilhouette,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-duckwaterprogress-ducksilhouette',
    index: undefined,
    id: 'dc/components/DuckWaterProgress/DuckSilhouette',
    exact: true,
    exports: ["DUCK_CLIP_PATH_NORMALIZED","DUCK_PATH","DuckSilhouette","default"],
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
    path: 'dc/panels/detail/components/DetailHeader',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_DetailHeader,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/DetailHeader',
          isLayout: false,
          routeExports: dc_panels_detail_components_DetailHeader,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/DetailHeader',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_DetailHeader,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-detailheader-index',
    index: true,
    id: 'dc/panels/detail/components/DetailHeader',
    exact: true,
    exports: ["DetailHeader","default"],
  },{
    path: 'dc/panels/detail/components/SecondaryNav',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_SecondaryNav,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/SecondaryNav',
          isLayout: false,
          routeExports: dc_panels_detail_components_SecondaryNav,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/SecondaryNav',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_SecondaryNav,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-secondarynav-index',
    index: true,
    id: 'dc/panels/detail/components/SecondaryNav',
    exact: true,
    exports: ["SecondaryNav","default"],
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
    path: 'dc/panels/settings/pages/TagSettingsPage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_TagSettingsPage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/TagSettingsPage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_TagSettingsPage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/TagSettingsPage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_TagSettingsPage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-tagsettingspage-index',
    index: true,
    id: 'dc/panels/settings/pages/TagSettingsPage',
    exact: true,
    exports: ["default"],
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
    path: 'dc/panels/settings/UnifiedSettingsPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_UnifiedSettingsPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/UnifiedSettingsPanel',
          isLayout: false,
          routeExports: dc_panels_settings_UnifiedSettingsPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/UnifiedSettingsPanel',
          requestContext,
          renderMode,
          module: dc_panels_settings_UnifiedSettingsPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-unifiedsettingspanel-index',
    index: true,
    id: 'dc/panels/settings/UnifiedSettingsPanel',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/CreateTaskModal/steps/ConfigStep',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_ConfigStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/ConfigStep',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_ConfigStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/ConfigStep',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_ConfigStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-configstep',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/ConfigStep',
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
    path: 'dc/viewmodel/CreateTaskModal/steps/CycleStep',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_CycleStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/CycleStep',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_CycleStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/CycleStep',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_CycleStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-cyclestep',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/CycleStep',
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
    path: 'dc/panels/detail/components/CycleInfo',
    async lazy() {
      ;
      return {
        ...dc_panels_detail_components_CycleInfo,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/detail/components/CycleInfo',
          isLayout: false,
          routeExports: dc_panels_detail_components_CycleInfo,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/detail/components/CycleInfo',
          requestContext,
          renderMode,
          module: dc_panels_detail_components_CycleInfo,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-detail-components-cycleinfo-index',
    index: true,
    id: 'dc/panels/detail/components/CycleInfo',
    exact: true,
    exports: ["CycleInfo","default"],
  },{
    path: 'dc/panels/settings/pages/DateTestPage',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages_DateTestPage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages/DateTestPage',
          isLayout: false,
          routeExports: dc_panels_settings_pages_DateTestPage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages/DateTestPage',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages_DateTestPage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-datetestpage-index',
    index: true,
    id: 'dc/panels/settings/pages/DateTestPage',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/CreateTaskModal/steps/TypeStep',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps_TypeStep,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/TypeStep',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps_TypeStep,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps/TypeStep',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps_TypeStep,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-typestep',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/steps/TypeStep',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/DuckWaterProgress/WaterWave',
    async lazy() {
      ;
      return {
        ...dc_components_DuckWaterProgress_WaterWave,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/DuckWaterProgress/WaterWave',
          isLayout: false,
          routeExports: dc_components_DuckWaterProgress_WaterWave,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/DuckWaterProgress/WaterWave',
          requestContext,
          renderMode,
          module: dc_components_DuckWaterProgress_WaterWave,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-duckwaterprogress-waterwave',
    index: undefined,
    id: 'dc/components/DuckWaterProgress/WaterWave',
    exact: true,
    exports: ["WaterWave","default"],
  },{
    path: 'dc/components/SidelineTaskEditModal',
    async lazy() {
      ;
      return {
        ...dc_components_SidelineTaskEditModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/SidelineTaskEditModal',
          isLayout: false,
          routeExports: dc_components_SidelineTaskEditModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/SidelineTaskEditModal',
          requestContext,
          renderMode,
          module: dc_components_SidelineTaskEditModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-sidelinetaskeditmodal-index',
    index: true,
    id: 'dc/components/SidelineTaskEditModal',
    exact: true,
    exports: ["default"],
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
    path: 'dc/viewmodel/TodayMustCompleteModal',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_TodayMustCompleteModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/TodayMustCompleteModal',
          isLayout: false,
          routeExports: dc_viewmodel_TodayMustCompleteModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/TodayMustCompleteModal',
          requestContext,
          renderMode,
          module: dc_viewmodel_TodayMustCompleteModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-todaymustcompletemodal-index',
    index: true,
    id: 'dc/viewmodel/TodayMustCompleteModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/SecondFloorIndicator',
    async lazy() {
      ;
      return {
        ...dc_components_SecondFloorIndicator,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/SecondFloorIndicator',
          isLayout: false,
          routeExports: dc_components_SecondFloorIndicator,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/SecondFloorIndicator',
          requestContext,
          renderMode,
          module: dc_components_SecondFloorIndicator,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-secondfloorindicator-index',
    index: true,
    id: 'dc/components/SecondFloorIndicator',
    exact: true,
    exports: ["SecondFloorIndicator","default"],
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
    exports: ["ALL_BACKGROUNDS","COLOR_BACKGROUNDS","GRADIENT_BACKGROUNDS","getBackgroundStyle","getDefaultBackground","isDarkBackground"],
  },{
    path: 'dc/viewmodel/CreateTaskModal/steps',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_steps,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/steps',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_steps,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/steps',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_steps,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-steps-index',
    index: true,
    id: 'dc/viewmodel/CreateTaskModal/steps',
    exact: true,
    exports: ["ConfigStep","CycleStep","TypeStep"],
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
    path: 'dc/contexts/CultivationProvider/storage',
    async lazy() {
      ;
      return {
        ...dc_contexts_CultivationProvider_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/CultivationProvider/storage',
          isLayout: false,
          routeExports: dc_contexts_CultivationProvider_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/CultivationProvider/storage',
          requestContext,
          renderMode,
          module: dc_contexts_CultivationProvider_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-cultivationprovider-storage',
    index: undefined,
    id: 'dc/contexts/CultivationProvider/storage',
    exact: true,
    exports: ["clearCultivationData","exportCultivationData","importCultivationData","loadCultivationData","loadCultivationHistory","saveCultivationData","saveCultivationHistory"],
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
    exports: ["calculateDays","formatDate","formatDays","getDaysDisplayText","getNextDateFormat","getShortDaysText","getStructuredDaysData","isFuture","isPast","isToday"],
  },{
    path: 'dc/viewmodel/AllSidelineTasksList',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_AllSidelineTasksList,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/AllSidelineTasksList',
          isLayout: false,
          routeExports: dc_viewmodel_AllSidelineTasksList,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/AllSidelineTasksList',
          requestContext,
          renderMode,
          module: dc_viewmodel_AllSidelineTasksList,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-allsidelinetaskslist-index',
    index: true,
    id: 'dc/viewmodel/AllSidelineTasksList',
    exact: true,
    exports: ["AllSidelineTasksList","AllSidelineTasksPopup","default"],
  },{
    path: 'dc/components/QuickActionButtons',
    async lazy() {
      ;
      return {
        ...dc_components_QuickActionButtons,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/QuickActionButtons',
          isLayout: false,
          routeExports: dc_components_QuickActionButtons,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/QuickActionButtons',
          requestContext,
          renderMode,
          module: dc_components_QuickActionButtons,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-quickactionbuttons-index',
    index: true,
    id: 'dc/components/QuickActionButtons',
    exact: true,
    exports: ["DEFAULT_TIMES_QUICK_ACTIONS","DEFAULT_WATER_QUICK_ACTIONS","QuickActionButtons","default"],
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
    path: 'dc/contexts/SceneProvider/cacheManager',
    async lazy() {
      ;
      return {
        ...dc_contexts_SceneProvider_cacheManager,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/SceneProvider/cacheManager',
          isLayout: false,
          routeExports: dc_contexts_SceneProvider_cacheManager,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/SceneProvider/cacheManager',
          requestContext,
          renderMode,
          module: dc_contexts_SceneProvider_cacheManager,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-sceneprovider-cachemanager',
    index: undefined,
    id: 'dc/contexts/SceneProvider/cacheManager',
    exact: true,
    exports: ["CacheManager","globalCacheManager"],
  },{
    path: 'dc/contexts/SceneProvider/indexBuilder',
    async lazy() {
      ;
      return {
        ...dc_contexts_SceneProvider_indexBuilder,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/SceneProvider/indexBuilder',
          isLayout: false,
          routeExports: dc_contexts_SceneProvider_indexBuilder,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/SceneProvider/indexBuilder',
          requestContext,
          renderMode,
          module: dc_contexts_SceneProvider_indexBuilder,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-sceneprovider-indexbuilder',
    index: undefined,
    id: 'dc/contexts/SceneProvider/indexBuilder',
    exact: true,
    exports: ["addToIndex","buildIndex","removeFromIndex","updateInIndex"],
  },{
    path: 'dc/panels/cultivation/SecondFloorPanel',
    async lazy() {
      ;
      return {
        ...dc_panels_cultivation_SecondFloorPanel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/cultivation/SecondFloorPanel',
          isLayout: false,
          routeExports: dc_panels_cultivation_SecondFloorPanel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/cultivation/SecondFloorPanel',
          requestContext,
          renderMode,
          module: dc_panels_cultivation_SecondFloorPanel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-cultivation-secondfloorpanel',
    index: undefined,
    id: 'dc/panels/cultivation/SecondFloorPanel',
    exact: true,
    exports: ["SecondFloorPanel","default"],
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
    path: 'dc/viewmodel/CreateTaskModal/constants',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_constants,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/constants',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_constants,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/constants',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_constants,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-constants',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/constants',
    exact: true,
    exports: ["CHECK_IN_TYPE_OPTIONS","CYCLE_LENGTH_OPTIONS","DIRECTION_OPTIONS","TASK_TYPE_OPTIONS","TOTAL_DURATION_OPTIONS"],
  },{
    path: 'dc/viewmodel/MainlineTaskSection',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_MainlineTaskSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/MainlineTaskSection',
          isLayout: false,
          routeExports: dc_viewmodel_MainlineTaskSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/MainlineTaskSection',
          requestContext,
          renderMode,
          module: dc_viewmodel_MainlineTaskSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-mainlinetasksection-index',
    index: true,
    id: 'dc/viewmodel/MainlineTaskSection',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/SidelineTaskSection',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_SidelineTaskSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/SidelineTaskSection',
          isLayout: false,
          routeExports: dc_viewmodel_SidelineTaskSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/SidelineTaskSection',
          requestContext,
          renderMode,
          module: dc_viewmodel_SidelineTaskSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-sidelinetasksection-index',
    index: true,
    id: 'dc/viewmodel/SidelineTaskSection',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/DuckWaterProgress',
    async lazy() {
      ;
      return {
        ...dc_components_DuckWaterProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/DuckWaterProgress',
          isLayout: false,
          routeExports: dc_components_DuckWaterProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/DuckWaterProgress',
          requestContext,
          renderMode,
          module: dc_components_DuckWaterProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-duckwaterprogress-index',
    index: true,
    id: 'dc/components/DuckWaterProgress',
    exact: true,
    exports: ["DuckSilhouette","DuckWaterProgress","WaterWave","default"],
  },{
    path: 'dc/contexts/CultivationProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_CultivationProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/CultivationProvider',
          isLayout: false,
          routeExports: dc_contexts_CultivationProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/CultivationProvider',
          requestContext,
          renderMode,
          module: dc_contexts_CultivationProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-cultivationprovider-index',
    index: true,
    id: 'dc/contexts/CultivationProvider',
    exact: true,
    exports: ["CultivationProvider","default","useCultivation"],
  },{
    path: 'dc/contexts/CultivationProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_CultivationProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/CultivationProvider/types',
          isLayout: false,
          routeExports: dc_contexts_CultivationProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/CultivationProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_CultivationProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-cultivationprovider-types',
    index: undefined,
    id: 'dc/contexts/CultivationProvider/types',
    exact: true,
    exports: [],
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
    path: 'dc/panels/settings/hooks/usePageStack',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_hooks_usePageStack,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/hooks/usePageStack',
          isLayout: false,
          routeExports: dc_panels_settings_hooks_usePageStack,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/hooks/usePageStack',
          requestContext,
          renderMode,
          module: dc_panels_settings_hooks_usePageStack,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-hooks-usepagestack',
    index: undefined,
    id: 'dc/panels/settings/hooks/usePageStack',
    exact: true,
    exports: ["default","usePageStack"],
  },{
    path: 'dc/panels/settings/hooks/useSwipeBack',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_hooks_useSwipeBack,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/hooks/useSwipeBack',
          isLayout: false,
          routeExports: dc_panels_settings_hooks_useSwipeBack,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/hooks/useSwipeBack',
          requestContext,
          renderMode,
          module: dc_panels_settings_hooks_useSwipeBack,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-hooks-useswipeback',
    index: undefined,
    id: 'dc/panels/settings/hooks/useSwipeBack',
    exact: true,
    exports: ["default","useSwipeBack"],
  },{
    path: 'dc/viewmodel/CultivationSection',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CultivationSection,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CultivationSection',
          isLayout: false,
          routeExports: dc_viewmodel_CultivationSection,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CultivationSection',
          requestContext,
          renderMode,
          module: dc_viewmodel_CultivationSection,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-cultivationsection-index',
    index: true,
    id: 'dc/viewmodel/CultivationSection',
    exact: true,
    exports: ["CultivationSection","default"],
  },{
    path: 'dc/components/CultivationEntry',
    async lazy() {
      ;
      return {
        ...dc_components_CultivationEntry,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/CultivationEntry',
          isLayout: false,
          routeExports: dc_components_CultivationEntry,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/CultivationEntry',
          requestContext,
          renderMode,
          module: dc_components_CultivationEntry,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-cultivationentry-index',
    index: true,
    id: 'dc/components/CultivationEntry',
    exact: true,
    exports: ["CultivationEntry","default"],
  },{
    path: 'dc/components/GroupDetailPopup',
    async lazy() {
      ;
      return {
        ...dc_components_GroupDetailPopup,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/GroupDetailPopup',
          isLayout: false,
          routeExports: dc_components_GroupDetailPopup,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/GroupDetailPopup',
          requestContext,
          renderMode,
          module: dc_components_GroupDetailPopup,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-groupdetailpopup-index',
    index: true,
    id: 'dc/components/GroupDetailPopup',
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
    path: 'dc/panels/settings/TagSettings',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_TagSettings,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/TagSettings',
          isLayout: false,
          routeExports: dc_panels_settings_TagSettings,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/TagSettings',
          requestContext,
          renderMode,
          module: dc_panels_settings_TagSettings,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-tagsettings-index',
    index: true,
    id: 'dc/panels/settings/TagSettings',
    exact: true,
    exports: ["default"],
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
    path: 'dc/panels/settings/components',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_components,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/components',
          isLayout: false,
          routeExports: dc_panels_settings_components,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/components',
          requestContext,
          renderMode,
          module: dc_panels_settings_components,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-components-index',
    index: true,
    id: 'dc/panels/settings/components',
    exact: true,
    exports: ["BottomFixedButton","SettingsListItem","SettingsSection","SubPageLayout"],
  },{
    path: 'dc/viewmodel/RandomTaskPicker',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_RandomTaskPicker,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/RandomTaskPicker',
          isLayout: false,
          routeExports: dc_viewmodel_RandomTaskPicker,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/RandomTaskPicker',
          requestContext,
          renderMode,
          module: dc_viewmodel_RandomTaskPicker,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-randomtaskpicker-index',
    index: true,
    id: 'dc/viewmodel/RandomTaskPicker',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/SidelineTaskGrid',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_SidelineTaskGrid,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/SidelineTaskGrid',
          isLayout: false,
          routeExports: dc_viewmodel_SidelineTaskGrid,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/SidelineTaskGrid',
          requestContext,
          renderMode,
          module: dc_viewmodel_SidelineTaskGrid,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-sidelinetaskgrid-index',
    index: true,
    id: 'dc/viewmodel/SidelineTaskGrid',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/LocationFilter',
    async lazy() {
      ;
      return {
        ...dc_components_LocationFilter,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/LocationFilter',
          isLayout: false,
          routeExports: dc_components_LocationFilter,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/LocationFilter',
          requestContext,
          renderMode,
          module: dc_components_LocationFilter,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-locationfilter-index',
    index: true,
    id: 'dc/components/LocationFilter',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/MigrationModal',
    async lazy() {
      ;
      return {
        ...dc_components_MigrationModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/MigrationModal',
          isLayout: false,
          routeExports: dc_components_MigrationModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/MigrationModal',
          requestContext,
          renderMode,
          module: dc_components_MigrationModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-migrationmodal-index',
    index: true,
    id: 'dc/components/MigrationModal',
    exact: true,
    exports: ["default"],
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
    path: 'dc/viewmodel/CreateTaskModal',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-index',
    index: true,
    id: 'dc/viewmodel/CreateTaskModal',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/CreateTaskModal/types',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_CreateTaskModal_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/CreateTaskModal/types',
          isLayout: false,
          routeExports: dc_viewmodel_CreateTaskModal_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/CreateTaskModal/types',
          requestContext,
          renderMode,
          module: dc_viewmodel_CreateTaskModal_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-createtaskmodal-types',
    index: undefined,
    id: 'dc/viewmodel/CreateTaskModal/types',
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
    path: 'dc/components/PullIndicator',
    async lazy() {
      ;
      return {
        ...dc_components_PullIndicator,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/PullIndicator',
          isLayout: false,
          routeExports: dc_components_PullIndicator,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/PullIndicator',
          requestContext,
          renderMode,
          module: dc_components_PullIndicator,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-pullindicator-index',
    index: true,
    id: 'dc/components/PullIndicator',
    exact: true,
    exports: ["PullIndicator","default"],
  },{
    path: 'dc/contexts/SceneProvider/storage',
    async lazy() {
      ;
      return {
        ...dc_contexts_SceneProvider_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/SceneProvider/storage',
          isLayout: false,
          routeExports: dc_contexts_SceneProvider_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/SceneProvider/storage',
          requestContext,
          renderMode,
          module: dc_contexts_SceneProvider_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-sceneprovider-storage',
    index: undefined,
    id: 'dc/contexts/SceneProvider/storage',
    exact: true,
    exports: ["clearSceneData","loadSceneData","markMigrationComplete","migrateFromLegacyStorage","needsMigration","performMigration","saveSceneData"],
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
    exports: ["ActivityRecordPanel","CalendarViewPanel","CheckInCyclePanel","CheckInHistoryPanel","CheckInModal","CheckInRecordPanel","ChecklistCyclePanel","CoffeeCupProgress","CycleInfo","DetailHeader","DuckWaterProgress","GoalHeader","HistoryCyclePanel","HistoryRecordPanel","NumericCyclePanel","ProgressSection","RecordDataModal","SecondaryNav","TabBar","TodayProgressBar","WaterCupProgress","showCycleSummaryDialog"],
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
    path: 'dc/utils/todayMustCompleteStorage',
    async lazy() {
      ;
      return {
        ...dc_utils_todayMustCompleteStorage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/todayMustCompleteStorage',
          isLayout: false,
          routeExports: dc_utils_todayMustCompleteStorage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/todayMustCompleteStorage',
          requestContext,
          renderMode,
          module: dc_utils_todayMustCompleteStorage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-todaymustcompletestorage',
    index: undefined,
    id: 'dc/utils/todayMustCompleteStorage',
    exact: true,
    exports: ["canOpenModalForEdit","canOpenModalForView","createTodayState","getTodayDateString","getTodayMustCompleteTaskIds","hasTodayBeenSet","hasTodaySetTasks","isTaskTodayMustComplete","loadTodayMustCompleteState","markModalShown","removeFromTodayMustComplete","saveTodayMustCompleteState","setTodayMustCompleteTasks","shouldShowTodayMustCompleteModal","skipTodayMustComplete"],
  },{
    path: 'dc/viewmodel/DailyViewPopup',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_DailyViewPopup,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/DailyViewPopup',
          isLayout: false,
          routeExports: dc_viewmodel_DailyViewPopup,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/DailyViewPopup',
          requestContext,
          renderMode,
          module: dc_viewmodel_DailyViewPopup,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-dailyviewpopup-index',
    index: true,
    id: 'dc/viewmodel/DailyViewPopup',
    exact: true,
    exports: ["default"],
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
    path: 'dc/contexts/UserProvider/storage',
    async lazy() {
      ;
      return {
        ...dc_contexts_UserProvider_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UserProvider/storage',
          isLayout: false,
          routeExports: dc_contexts_UserProvider_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UserProvider/storage',
          requestContext,
          renderMode,
          module: dc_contexts_UserProvider_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-userprovider-storage',
    index: undefined,
    id: 'dc/contexts/UserProvider/storage',
    exact: true,
    exports: ["clearUserData","getTodayDateString","isToday","isYesterday","loadUserData","saveUserData"],
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
    path: 'dc/viewmodel/GroupModeGrid',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_GroupModeGrid,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/GroupModeGrid',
          isLayout: false,
          routeExports: dc_viewmodel_GroupModeGrid,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/GroupModeGrid',
          requestContext,
          renderMode,
          module: dc_viewmodel_GroupModeGrid,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-groupmodegrid-index',
    index: true,
    id: 'dc/viewmodel/GroupModeGrid',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/TodayProgress',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_TodayProgress,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/TodayProgress',
          isLayout: false,
          routeExports: dc_viewmodel_TodayProgress,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/TodayProgress',
          requestContext,
          renderMode,
          module: dc_viewmodel_TodayProgress,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-todayprogress-index',
    index: true,
    id: 'dc/viewmodel/TodayProgress',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/components/TagSelector',
    async lazy() {
      ;
      return {
        ...dc_components_TagSelector,
        Component: () => WrapRouteComponent({
          routeId: 'dc/components/TagSelector',
          isLayout: false,
          routeExports: dc_components_TagSelector,
        }),
        loader: createRouteLoader({
          routeId: 'dc/components/TagSelector',
          requestContext,
          renderMode,
          module: dc_components_TagSelector,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-components-tagselector-index',
    index: true,
    id: 'dc/components/TagSelector',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/contexts/AppProvider/storage',
    async lazy() {
      ;
      return {
        ...dc_contexts_AppProvider_storage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/AppProvider/storage',
          isLayout: false,
          routeExports: dc_contexts_AppProvider_storage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/AppProvider/storage',
          requestContext,
          renderMode,
          module: dc_contexts_AppProvider_storage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-appprovider-storage',
    index: undefined,
    id: 'dc/contexts/AppProvider/storage',
    exact: true,
    exports: ["applyThemeCSSVariables","clearAppConfig","loadAppConfig","saveAppConfig"],
  },{
    path: 'dc/contexts/SceneProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_SceneProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/SceneProvider',
          isLayout: false,
          routeExports: dc_contexts_SceneProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/SceneProvider',
          requestContext,
          renderMode,
          module: dc_contexts_SceneProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-sceneprovider-index',
    index: true,
    id: 'dc/contexts/SceneProvider',
    exact: true,
    exports: ["SceneProvider","useScene"],
  },{
    path: 'dc/contexts/SceneProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_SceneProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/SceneProvider/types',
          isLayout: false,
          routeExports: dc_contexts_SceneProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/SceneProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_SceneProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-sceneprovider-types',
    index: undefined,
    id: 'dc/contexts/SceneProvider/types',
    exact: true,
    exports: ["createEmptyIndex","createEmptySceneData"],
  },{
    path: 'dc/contexts/WorldProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_WorldProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/WorldProvider',
          isLayout: false,
          routeExports: dc_contexts_WorldProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/WorldProvider',
          requestContext,
          renderMode,
          module: dc_contexts_WorldProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-worldprovider-index',
    index: true,
    id: 'dc/contexts/WorldProvider',
    exact: true,
    exports: ["WorldProvider","useWorld"],
  },{
    path: 'dc/contexts/WorldProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_WorldProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/WorldProvider/types',
          isLayout: false,
          routeExports: dc_contexts_WorldProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/WorldProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_WorldProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-worldprovider-types',
    index: undefined,
    id: 'dc/contexts/WorldProvider/types',
    exact: true,
    exports: ["defaultWorldData"],
  },{
    path: 'dc/contexts/TaskProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_TaskProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/TaskProvider',
          isLayout: false,
          routeExports: dc_contexts_TaskProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/TaskProvider',
          requestContext,
          renderMode,
          module: dc_contexts_TaskProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-taskprovider-index',
    index: true,
    id: 'dc/contexts/TaskProvider',
    exact: true,
    exports: ["TaskProvider","useTaskContext"],
  },{
    path: 'dc/contexts/TaskProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_TaskProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/TaskProvider/types',
          isLayout: false,
          routeExports: dc_contexts_TaskProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/TaskProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_TaskProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-taskprovider-types',
    index: undefined,
    id: 'dc/contexts/TaskProvider/types',
    exact: true,
    exports: [],
  },{
    path: 'dc/contexts/UserProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_UserProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UserProvider',
          isLayout: false,
          routeExports: dc_contexts_UserProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UserProvider',
          requestContext,
          renderMode,
          module: dc_contexts_UserProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-userprovider-index',
    index: true,
    id: 'dc/contexts/UserProvider',
    exact: true,
    exports: ["UserProvider","useUser"],
  },{
    path: 'dc/contexts/UserProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_UserProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UserProvider/types',
          isLayout: false,
          routeExports: dc_contexts_UserProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UserProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_UserProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-userprovider-types',
    index: undefined,
    id: 'dc/contexts/UserProvider/types',
    exact: true,
    exports: ["LEVEL_CONFIG","defaultUserData"],
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
    path: 'dc/panels/settings/hooks',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/hooks',
          isLayout: false,
          routeExports: dc_panels_settings_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/hooks',
          requestContext,
          renderMode,
          module: dc_panels_settings_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-hooks-index',
    index: true,
    id: 'dc/panels/settings/hooks',
    exact: true,
    exports: ["usePageStack","useSwipeBack"],
  },{
    path: 'dc/panels/settings/pages',
    async lazy() {
      ;
      return {
        ...dc_panels_settings_pages,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/settings/pages',
          isLayout: false,
          routeExports: dc_panels_settings_pages,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/settings/pages',
          requestContext,
          renderMode,
          module: dc_panels_settings_pages,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-settings-pages-index',
    index: true,
    id: 'dc/panels/settings/pages',
    exact: true,
    exports: ["DataManagementPage","DateTestPage","SettingsMainPage","TagSettingsPage","ThemeSettingsPage","TodayMustCompletePage"],
  },{
    path: 'dc/contexts/AppProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_AppProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/AppProvider',
          isLayout: false,
          routeExports: dc_contexts_AppProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/AppProvider',
          requestContext,
          renderMode,
          module: dc_contexts_AppProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-appprovider-index',
    index: true,
    id: 'dc/contexts/AppProvider',
    exact: true,
    exports: ["AppProvider","DATE_CHANGE_EVENT","themePresets","useApp","useTheme"],
  },{
    path: 'dc/contexts/AppProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_AppProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/AppProvider/types',
          isLayout: false,
          routeExports: dc_contexts_AppProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/AppProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_AppProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-appprovider-types',
    index: undefined,
    id: 'dc/contexts/AppProvider/types',
    exact: true,
    exports: ["defaultAppConfig","themePresets"],
  },{
    path: 'dc/hooks/usePullToSecondFloor',
    async lazy() {
      ;
      return {
        ...dc_hooks_usePullToSecondFloor,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/usePullToSecondFloor',
          isLayout: false,
          routeExports: dc_hooks_usePullToSecondFloor,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/usePullToSecondFloor',
          requestContext,
          renderMode,
          module: dc_hooks_usePullToSecondFloor,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-usepulltosecondfloor',
    index: undefined,
    id: 'dc/hooks/usePullToSecondFloor',
    exact: true,
    exports: ["default","usePullToSecondFloor"],
  },{
    path: 'dc/hooks/useTodayMustComplete',
    async lazy() {
      ;
      return {
        ...dc_hooks_useTodayMustComplete,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/useTodayMustComplete',
          isLayout: false,
          routeExports: dc_hooks_useTodayMustComplete,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/useTodayMustComplete',
          requestContext,
          renderMode,
          module: dc_hooks_useTodayMustComplete,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-usetodaymustcomplete',
    index: undefined,
    id: 'dc/hooks/useTodayMustComplete',
    exact: true,
    exports: ["default","useTodayMustComplete"],
  },{
    path: 'dc/contexts/UIProvider/hooks',
    async lazy() {
      ;
      return {
        ...dc_contexts_UIProvider_hooks,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UIProvider/hooks',
          isLayout: false,
          routeExports: dc_contexts_UIProvider_hooks,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UIProvider/hooks',
          requestContext,
          renderMode,
          module: dc_contexts_UIProvider_hooks,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-uiprovider-hooks',
    index: undefined,
    id: 'dc/contexts/UIProvider/hooks',
    exact: true,
    exports: ["useActiveTab","useAddTrigger","useArchiveModal","useModal","useScrollPosition","useSettingsModal","useTodayMustCompleteModal","useUIState","useViewMode"],
  },{
    path: 'dc/contexts/UIProvider',
    async lazy() {
      ;
      return {
        ...dc_contexts_UIProvider,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UIProvider',
          isLayout: false,
          routeExports: dc_contexts_UIProvider,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UIProvider',
          requestContext,
          renderMode,
          module: dc_contexts_UIProvider,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-uiprovider-index',
    index: true,
    id: 'dc/contexts/UIProvider',
    exact: true,
    exports: ["UIProvider","UI_KEYS","useUI"],
  },{
    path: 'dc/contexts/UIProvider/types',
    async lazy() {
      ;
      return {
        ...dc_contexts_UIProvider_types,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UIProvider/types',
          isLayout: false,
          routeExports: dc_contexts_UIProvider_types,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UIProvider/types',
          requestContext,
          renderMode,
          module: dc_contexts_UIProvider_types,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-uiprovider-types',
    index: undefined,
    id: 'dc/contexts/UIProvider/types',
    exact: true,
    exports: [],
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
    exports: ["DEBT_COLOR_SCHEMES","formatLocalDate","getCurrentCycle","getRandomColorScheme","getSimulatedToday","getSimulatedTodayDate","getTodayCheckInStatusForTask"],
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
    path: 'dc/viewmodel/GroupCard',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_GroupCard,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/GroupCard',
          isLayout: false,
          routeExports: dc_viewmodel_GroupCard,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/GroupCard',
          requestContext,
          renderMode,
          module: dc_viewmodel_GroupCard,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-groupcard-index',
    index: true,
    id: 'dc/viewmodel/GroupCard',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/viewmodel/MoonPhase',
    async lazy() {
      ;
      return {
        ...dc_viewmodel_MoonPhase,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel/MoonPhase',
          isLayout: false,
          routeExports: dc_viewmodel_MoonPhase,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel/MoonPhase',
          requestContext,
          renderMode,
          module: dc_viewmodel_MoonPhase,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-moonphase-index',
    index: true,
    id: 'dc/viewmodel/MoonPhase',
    exact: true,
    exports: ["default"],
  },{
    path: 'dc/contexts/UIProvider/keys',
    async lazy() {
      ;
      return {
        ...dc_contexts_UIProvider_keys,
        Component: () => WrapRouteComponent({
          routeId: 'dc/contexts/UIProvider/keys',
          isLayout: false,
          routeExports: dc_contexts_UIProvider_keys,
        }),
        loader: createRouteLoader({
          routeId: 'dc/contexts/UIProvider/keys',
          requestContext,
          renderMode,
          module: dc_contexts_UIProvider_keys,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-contexts-uiprovider-keys',
    index: undefined,
    id: 'dc/contexts/UIProvider/keys',
    exact: true,
    exports: ["UI_KEYS"],
  },{
    path: 'dc/panels/cultivation',
    async lazy() {
      ;
      return {
        ...dc_panels_cultivation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/panels/cultivation',
          isLayout: false,
          routeExports: dc_panels_cultivation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/panels/cultivation',
          requestContext,
          renderMode,
          module: dc_panels_cultivation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-panels-cultivation-index',
    index: true,
    id: 'dc/panels/cultivation',
    exact: true,
    exports: ["default"],
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
    exports: ["DEADLINE_COLORS","calculateCheckInProgress","calculateChecklistProgress","calculateCurrentCycleNumber","calculateNumericProgress","calculateRemainingDays","formatNumber","getDeadlineColor","getDeadlineText","isTodayCheckedIn","updateMainlineTaskProgress"],
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
    exports: ["ProgressCalculator","calculateCheckInProgress","calculateChecklistProgress","calculateNumericProgress","default","formatDisplayNumber","formatLargeNumber","formatNumber","getEffectiveCategory","getEffectiveMainlineType"],
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
    path: 'dc/utils/dataExportImport',
    async lazy() {
      ;
      return {
        ...dc_utils_dataExportImport,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/dataExportImport',
          isLayout: false,
          routeExports: dc_utils_dataExportImport,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/dataExportImport',
          requestContext,
          renderMode,
          module: dc_utils_dataExportImport,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-dataexportimport',
    index: undefined,
    id: 'dc/utils/dataExportImport',
    exact: true,
    exports: ["DATA_TYPE_CONFIG","clearData","exportData","exportToClipboard","getDataStats","importData","migrateToNewFormat","repairTaskProgressData"],
  },{
    path: 'dc/utils/developerStorage',
    async lazy() {
      ;
      return {
        ...dc_utils_developerStorage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/developerStorage',
          isLayout: false,
          routeExports: dc_utils_developerStorage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/developerStorage',
          requestContext,
          renderMode,
          module: dc_utils_developerStorage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-developerstorage',
    index: undefined,
    id: 'dc/utils/developerStorage',
    exact: true,
    exports: ["copyToClipboard","exportAllTasks","exportSingleTask","getDeveloperMode","getSavedLocationFilter","importAllTasks","importSingleTask","saveLocationFilter","setDeveloperMode"],
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
    path: 'dc/constants/cultivation',
    async lazy() {
      ;
      return {
        ...dc_constants_cultivation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/constants/cultivation',
          isLayout: false,
          routeExports: dc_constants_cultivation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/constants/cultivation',
          requestContext,
          renderMode,
          module: dc_constants_cultivation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-constants-cultivation',
    index: undefined,
    id: 'dc/constants/cultivation',
    exact: true,
    exports: ["BASE_CULTIVATION","CYCLE_REWARD_CONFIG","LIANQI_GROWTH_RATE","LIANQI_LAYER_NAMES","PENALTY_CONFIG","REALM_CONFIG","REALM_GROWTH_RATE","REALM_ORDER","SECLUSION_CONFIG","STAGE_CONFIG","STAGE_GROWTH_RATE","STAGE_ORDER","TASK_EXP_CONFIG","getAllLevelExpCaps","getExpCap","getLianqiExpCap"],
  },{
    path: 'dc/hooks/usePullToReveal',
    async lazy() {
      ;
      return {
        ...dc_hooks_usePullToReveal,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/usePullToReveal',
          isLayout: false,
          routeExports: dc_hooks_usePullToReveal,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/usePullToReveal',
          requestContext,
          renderMode,
          module: dc_hooks_usePullToReveal,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-usepulltoreveal',
    index: undefined,
    id: 'dc/hooks/usePullToReveal',
    exact: true,
    exports: ["default","usePullToReveal"],
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
    path: 'dc/utils/dailyViewFilter',
    async lazy() {
      ;
      return {
        ...dc_utils_dailyViewFilter,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/dailyViewFilter',
          isLayout: false,
          routeExports: dc_utils_dailyViewFilter,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/dailyViewFilter',
          requestContext,
          renderMode,
          module: dc_utils_dailyViewFilter,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-dailyviewfilter',
    index: undefined,
    id: 'dc/utils/dailyViewFilter',
    exact: true,
    exports: ["calculateFlexibleTaskLimit","filterDailyViewTasks","filterDailyViewTasksEnhanced","hasDailyTargetTask","isNearDeadline","selectFlexibleTasks"],
  },{
    path: 'dc/constants/animations',
    async lazy() {
      ;
      return {
        ...dc_constants_animations,
        Component: () => WrapRouteComponent({
          routeId: 'dc/constants/animations',
          isLayout: false,
          routeExports: dc_constants_animations,
        }),
        loader: createRouteLoader({
          routeId: 'dc/constants/animations',
          requestContext,
          renderMode,
          module: dc_constants_animations,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-constants-animations',
    index: undefined,
    id: 'dc/constants/animations',
    exact: true,
    exports: ["ANIMATION_ENABLED","RESPECT_REDUCED_MOTION","cardVariants","drawerLeftVariants","drawerRightVariants","fadeVariants","gridItemVariants","listContainerVariants","listItemVariants","modalVariants","optionVariants","overlayVariants","quickTransition","scaleVariants","smoothTransition","springTransition","stepVariants"],
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
    path: 'dc/utils/archiveStorage',
    async lazy() {
      ;
      return {
        ...dc_utils_archiveStorage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/archiveStorage',
          isLayout: false,
          routeExports: dc_utils_archiveStorage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/archiveStorage',
          requestContext,
          renderMode,
          module: dc_utils_archiveStorage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-archivestorage',
    index: undefined,
    id: 'dc/utils/archiveStorage',
    exact: true,
    exports: ["archiveTask","clearAllArchivedTasks","deleteArchivedTask","getArchiveStats","getArchivedTasks","migrateOldArchivedTasks","restoreFromArchive","saveArchivedTasks"],
  },{
    path: 'dc/utils/dailyDataReset',
    async lazy() {
      ;
      return {
        ...dc_utils_dailyDataReset,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/dailyDataReset',
          isLayout: false,
          routeExports: dc_utils_dailyDataReset,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/dailyDataReset',
          requestContext,
          renderMode,
          module: dc_utils_dailyDataReset,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-dailydatareset',
    index: undefined,
    id: 'dc/utils/dailyDataReset',
    exact: true,
    exports: ["advanceTaskCycle","calculateNewCycle","needsProgressReset","performDailyReset","resetTodayProgress","shouldAdvanceCycle"],
  },{
    path: 'dc/utils/dailyViewCache',
    async lazy() {
      ;
      return {
        ...dc_utils_dailyViewCache,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/dailyViewCache',
          isLayout: false,
          routeExports: dc_utils_dailyViewCache,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/dailyViewCache',
          requestContext,
          renderMode,
          module: dc_utils_dailyViewCache,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-dailyviewcache',
    index: undefined,
    id: 'dc/utils/dailyViewCache',
    exact: true,
    exports: ["clearDailyViewCache","getCachedDailyTaskIds","saveDailyTaskIdsCache"],
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
    exports: ["default"],
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
    path: 'dc/hooks/useConfetti',
    async lazy() {
      ;
      return {
        ...dc_hooks_useConfetti,
        Component: () => WrapRouteComponent({
          routeId: 'dc/hooks/useConfetti',
          isLayout: false,
          routeExports: dc_hooks_useConfetti,
        }),
        loader: createRouteLoader({
          routeId: 'dc/hooks/useConfetti',
          requestContext,
          renderMode,
          module: dc_hooks_useConfetti,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-hooks-useconfetti',
    index: undefined,
    id: 'dc/hooks/useConfetti',
    exact: true,
    exports: ["useConfetti"],
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
    path: 'dc/types/cultivation',
    async lazy() {
      ;
      return {
        ...dc_types_cultivation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/types/cultivation',
          isLayout: false,
          routeExports: dc_types_cultivation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/types/cultivation',
          requestContext,
          renderMode,
          module: dc_types_cultivation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-types-cultivation',
    index: undefined,
    id: 'dc/types/cultivation',
    exact: true,
    exports: ["INITIAL_CULTIVATION_DATA"],
  },{
    path: 'dc/utils/cultivation',
    async lazy() {
      ;
      return {
        ...dc_utils_cultivation,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/cultivation',
          isLayout: false,
          routeExports: dc_utils_cultivation,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/cultivation',
          requestContext,
          renderMode,
          module: dc_utils_cultivation,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-cultivation',
    index: undefined,
    id: 'dc/utils/cultivation',
    exact: true,
    exports: ["compareLevels","formatExp","generateCultivationId","getCurrentExpCap","getCurrentLevelInfo","getLevelDisplayName","getLevelIndex","getNextLevel","getPreviousLevel","getRealmIconPath","getSeclusionInfo","getWeekKey","isCrossRealmDemotion"],
  },{
    path: 'dc/utils/dateTracker',
    async lazy() {
      ;
      return {
        ...dc_utils_dateTracker,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/dateTracker',
          isLayout: false,
          routeExports: dc_utils_dateTracker,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/dateTracker',
          requestContext,
          renderMode,
          module: dc_utils_dateTracker,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-datetracker',
    index: undefined,
    id: 'dc/utils/dateTracker',
    exact: true,
    exports: ["checkDateChange","clearTestDate","forceCheckDateChange","getCurrentDate","getLastVisitedDate","getRealSystemDate","getTestDate","hasTestDate","setLastVisitedDate","setTestDate"],
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
    exports: ["CircleProgress","CreateGoalModal","CreateMainlineTaskModal","CultivationEntry","DailyProgress","DuckWaterProgress","LocationFilter","MainlineTaskCard","MigrationModal","ProgressBar","PullIndicator","QuickActionButtons","SecondFloorIndicator","SidelineTaskCard","StatCard","StatCardGrid","ThemedButton"],
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
    exports: ["COLOR_PAIRS","DEBT_COLOR_SCHEMES","SIDELINE_THEME_COLORS","getColorPair","getNextThemeColor","getRandomDebtColorScheme"],
  },{
    path: 'dc/riv/CoffeeCupSvg',
    async lazy() {
      ;
      return {
        ...dc_riv_CoffeeCupSvg,
        Component: () => WrapRouteComponent({
          routeId: 'dc/riv/CoffeeCupSvg',
          isLayout: false,
          routeExports: dc_riv_CoffeeCupSvg,
        }),
        loader: createRouteLoader({
          routeId: 'dc/riv/CoffeeCupSvg',
          requestContext,
          renderMode,
          module: dc_riv_CoffeeCupSvg,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-riv-coffeecupsvg',
    index: undefined,
    id: 'dc/riv/CoffeeCupSvg',
    exact: true,
    exports: ["CoffeeCupSvg","default"],
  },{
    path: 'dc/riv/RiveWatering',
    async lazy() {
      ;
      return {
        ...dc_riv_RiveWatering,
        Component: () => WrapRouteComponent({
          routeId: 'dc/riv/RiveWatering',
          isLayout: false,
          routeExports: dc_riv_RiveWatering,
        }),
        loader: createRouteLoader({
          routeId: 'dc/riv/RiveWatering',
          requestContext,
          renderMode,
          module: dc_riv_RiveWatering,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-riv-rivewatering',
    index: undefined,
    id: 'dc/riv/RiveWatering',
    exact: true,
    exports: ["RiveWatering","default"],
  },{
    path: 'dc/utils/responsive',
    async lazy() {
      ;
      return {
        ...dc_utils_responsive,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/responsive',
          isLayout: false,
          routeExports: dc_utils_responsive,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/responsive',
          requestContext,
          renderMode,
          module: dc_utils_responsive,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-responsive',
    index: undefined,
    id: 'dc/utils/responsive',
    exact: true,
    exports: ["LAYOUT_CONSTANTS","calculateGridColumns","calculateModalMaxHeight","calculateVisibleSidelineTasks","getSafeAreaInsets","getScreenSize","isMobileDevice","isSmallScreen","prefersReducedMotion"],
  },{
    path: 'dc/utils/tagStorage',
    async lazy() {
      ;
      return {
        ...dc_utils_tagStorage,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/tagStorage',
          isLayout: false,
          routeExports: dc_utils_tagStorage,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/tagStorage',
          requestContext,
          renderMode,
          module: dc_utils_tagStorage,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-tagstorage',
    index: undefined,
    id: 'dc/utils/tagStorage',
    exact: true,
    exports: ["LOCATION_ICONS","MOOD_ICONS","NORMAL_ICONS","TAG_COLORS","cleanupTaskTagReferences","createTag","deleteTag","getAllTags","getDefaultIconForType","getIconsForType","getNextTagColor","getTagById","getTagsByType","getTaskNormalTagId","getTaskTags","getUsedLocationTags","loadTagsFromStorage","migrateAllTaskTags","migrateTaskTags","saveTagsToStorage","updateTag","updateTaskTags"],
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
    exports: ["ANIMATION_ENABLED","DEBT_COLOR_SCHEMES","EMPTY_STATE_IMAGE","MEMORIAL_SPRITE_IMAGES","RESPECT_REDUCED_MOTION","SIDELINE_THEME_COLORS","SPRITE_IMAGES","TRIP_SPRITE_IMAGES","VACATION_SPRITE_IMAGES","cardVariants","drawerLeftVariants","drawerRightVariants","fadeVariants","getCurrentTimeSlot","getNextThemeColor","getRandomDebtColorScheme","gridItemVariants","listContainerVariants","listItemVariants","modalVariants","optionVariants","overlayVariants","quickTransition","scaleVariants","smoothTransition","springTransition","stepVariants"],
  },{
    path: 'dc/riv/RiveCuteing',
    async lazy() {
      ;
      return {
        ...dc_riv_RiveCuteing,
        Component: () => WrapRouteComponent({
          routeId: 'dc/riv/RiveCuteing',
          isLayout: false,
          routeExports: dc_riv_RiveCuteing,
        }),
        loader: createRouteLoader({
          routeId: 'dc/riv/RiveCuteing',
          requestContext,
          renderMode,
          module: dc_riv_RiveCuteing,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-riv-rivecuteing',
    index: undefined,
    id: 'dc/riv/RiveCuteing',
    exact: true,
    exports: ["RiveCuteing","default"],
  },{
    path: 'dc/utils/migration',
    async lazy() {
      ;
      return {
        ...dc_utils_migration,
        Component: () => WrapRouteComponent({
          routeId: 'dc/utils/migration',
          isLayout: false,
          routeExports: dc_utils_migration,
        }),
        loader: createRouteLoader({
          routeId: 'dc/utils/migration',
          requestContext,
          renderMode,
          module: dc_utils_migration,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-utils-migration',
    index: undefined,
    id: 'dc/utils/migration',
    exact: true,
    exports: ["TaskMigration","createTask","default"],
  },{
    path: 'dc/viewmodel',
    async lazy() {
      ;
      return {
        ...dc_viewmodel,
        Component: () => WrapRouteComponent({
          routeId: 'dc/viewmodel',
          isLayout: false,
          routeExports: dc_viewmodel,
        }),
        loader: createRouteLoader({
          routeId: 'dc/viewmodel',
          requestContext,
          renderMode,
          module: dc_viewmodel,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-viewmodel-index',
    index: true,
    id: 'dc/viewmodel',
    exact: true,
    exports: ["AllSidelineTasksList","AllSidelineTasksPopup","CreateTaskModal","DailyViewPopup","GroupCard","GroupModeGrid","MainlineTaskSection","MoonPhase","RandomTaskPicker","SidelineTaskGrid","SidelineTaskSection","TodayMustCompleteModal","TodayProgress"],
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
    exports: ["AppProvider","CultivationProvider","SceneProvider","TaskProvider","ThemeProvider","UIProvider","UI_KEYS","UserProvider","WorldProvider","themePresets","themePresetsLegacy","useActiveTab","useAddTrigger","useApp","useArchiveModal","useCultivation","useModal","useScene","useScrollPosition","useSettingsModal","useTaskContext","useTheme","useTodayMustCompleteModal","useUI","useUIState","useUIStateLegacy","useUser","useViewMode","useWorld"],
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
    exports: ["ArchiveList","CultivationPanel","GoalDetailModal","HappyPanel","MemorialPanel","NormalPanel","UnifiedSettingsPanel"],
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
    exports: ["useConfetti","usePlanEndStatus","useProgress","usePullToReveal","usePullToSecondFloor","useSpriteImage","useTaskSort","useTodayCheckInStatus","useTodayMustComplete"],
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
    exports: ["CycleCalculator","DATA_TYPE_CONFIG","LAYOUT_CONSTANTS","MigrationTool","ProgressCalculator","TAG_COLORS","TaskMigration","advanceTaskCycle","archiveTask","calculateCheckInProgress","calculateCheckInProgressV2","calculateChecklistProgress","calculateChecklistProgressV2","calculateCurrentCycleNumber","calculateFlexibleTaskLimit","calculateGridColumns","calculateModalMaxHeight","calculateNewCycle","calculateNumericProgress","calculateNumericProgressV2","calculateRemainingDays","calculateVisibleSidelineTasks","canOpenModalForEdit","canOpenModalForView","checkDateChange","clearAllArchivedTasks","clearDailyViewCache","clearData","clearTestDate","compareLevels","copyToClipboard","createTag","createTask","createTodayState","deleteArchivedTask","deleteTag","exportAllTasks","exportData","exportSingleTask","exportToClipboard","filterDailyViewTasks","filterDailyViewTasksEnhanced","forceCheckDateChange","formatDisplayNumber","formatExp","formatLargeNumber","formatNumber","generateCultivationId","getAllTags","getArchiveStats","getArchivedTasks","getCachedDailyTaskIds","getCurrentDate","getCurrentExpCap","getCurrentLevelInfo","getDataStats","getDeveloperMode","getEffectiveCategory","getEffectiveMainlineType","getLastVisitedDate","getLevelDisplayName","getLevelIndex","getNextLevel","getNextTagColor","getPreviousLevel","getRealSystemDate","getRealmIconPath","getSafeAreaInsets","getSavedLocationFilter","getScreenSize","getSeclusionInfo","getTagById","getTestDate","getTodayDateString","getTodayMustCompleteTaskIds","getWeekKey","hasDailyTargetTask","hasTestDate","hasTodayBeenSet","hasTodaySetTasks","importAllTasks","importData","importSingleTask","isCrossRealmDemotion","isMobileDevice","isNearDeadline","isSmallScreen","isTaskTodayMustComplete","isTodayCheckedIn","loadTagsFromStorage","loadTodayMustCompleteState","markModalShown","migrateOldArchivedTasks","migrateToNewFormat","needsProgressReset","performDailyReset","prefersReducedMotion","removeFromTodayMustComplete","repairTaskProgressData","resetTodayProgress","restoreFromArchive","saveArchivedTasks","saveDailyTaskIdsCache","saveLocationFilter","saveTagsToStorage","saveTodayMustCompleteState","selectFlexibleTasks","setDeveloperMode","setLastVisitedDate","setTestDate","setTodayMustCompleteTasks","shouldAdvanceCycle","shouldShowTodayMustCompleteModal","skipTodayMustComplete","updateMainlineTaskProgress","updateTag"],
  },{
    path: 'dc/riv/DieCat',
    async lazy() {
      ;
      return {
        ...dc_riv_DieCat,
        Component: () => WrapRouteComponent({
          routeId: 'dc/riv/DieCat',
          isLayout: false,
          routeExports: dc_riv_DieCat,
        }),
        loader: createRouteLoader({
          routeId: 'dc/riv/DieCat',
          requestContext,
          renderMode,
          module: dc_riv_DieCat,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-riv-diecat',
    index: undefined,
    id: 'dc/riv/DieCat',
    exact: true,
    exports: ["DieCat","default"],
  },{
    path: 'dc/riv',
    async lazy() {
      ;
      return {
        ...dc_riv,
        Component: () => WrapRouteComponent({
          routeId: 'dc/riv',
          isLayout: false,
          routeExports: dc_riv,
        }),
        loader: createRouteLoader({
          routeId: 'dc/riv',
          requestContext,
          renderMode,
          module: dc_riv,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'dc-riv-index',
    index: true,
    id: 'dc/riv',
    exact: true,
    exports: ["CoffeeCupSvg","DieCat","RiveCuteing","RiveWatering"],
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
    path: 'quant',
    async lazy() {
      ;
      return {
        ...quant,
        Component: () => WrapRouteComponent({
          routeId: 'quant',
          isLayout: false,
          routeExports: quant,
        }),
        loader: createRouteLoader({
          routeId: 'quant',
          requestContext,
          renderMode,
          module: quant,
        }),
      };
    },
    errorElement: <RouteErrorComponent />,
    componentName: 'quant',
    index: undefined,
    id: 'quant',
    exact: true,
    exports: ["default"],
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
