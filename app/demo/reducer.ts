import { initialDemoState, sourcePresets } from "./fixtures";
import type { DemoAction, DemoState } from "./types";

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "set-stage":
      return { ...state, activeStage: action.stage };
    case "load-sample":
      return { ...state, sampleLoaded: true };
    case "apply-preset":
      return {
        ...state,
        sourcePreset: action.preset,
        selectedSources: [...sourcePresets[action.preset]],
      };
    case "toggle-source": {
      const selectedSources = state.selectedSources.includes(action.id)
        ? state.selectedSources.filter((id) => id !== action.id)
        : [...state.selectedSources, action.id];
      return { ...state, sourcePreset: "custom", selectedSources };
    }
    case "toggle-model": {
      if (state.selectedModels.includes(action.id)) {
        if (state.selectedModels.length === 1) return state;
        return {
          ...state,
          selectedModels: state.selectedModels.filter((id) => id !== action.id),
          visibleModels: state.visibleModels.filter((id) => id !== action.id),
        };
      }
      return { ...state, selectedModels: [...state.selectedModels, action.id] };
    }
    case "set-horizon":
      return { ...state, horizonWeeks: action.weeks };
    case "set-backtest":
      return { ...state, backtestWeeks: action.weeks };
    case "set-metric":
      return { ...state, metric: action.metric };
    case "set-frequency":
      return { ...state, frequency: action.frequency };
    case "start-training":
      return { ...state, trainingStatus: "running", trainingProgress: 18 };
    case "set-training-progress":
      return {
        ...state,
        trainingProgress: Math.min(100, Math.max(0, action.value)),
      };
    case "cancel-training":
      return { ...state, trainingStatus: "cancelled" };
    case "finish-training":
      return {
        ...state,
        activeStage: "results",
        trainingStatus: "complete",
        trainingProgress: 100,
      };
    case "set-product":
      return { ...state, selectedProduct: action.product };
    case "toggle-visible-model": {
      const visibleModels = state.visibleModels.includes(action.id)
        ? state.visibleModels.filter((id) => id !== action.id)
        : [...state.visibleModels, action.id];
      return { ...state, visibleModels };
    }
    case "set-export-format":
      return { ...state, exportFormat: action.format, exportComplete: false };
    case "complete-export":
      return { ...state, exportComplete: true };
    case "reset":
      return initialDemoState;
  }
}

export const selectedModelCount = (state: DemoState): number => state.selectedModels.length;
export const runtimeEstimateMinutes = (state: DemoState): number =>
  Math.max(4, state.selectedModels.length * 4);
export const selectedFeatureCount = (state: DemoState): number =>
  state.selectedSources.length;
