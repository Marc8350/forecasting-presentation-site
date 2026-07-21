import { initialDemoState } from "../demo/fixtures";
import {
  demoReducer,
  runtimeEstimateMinutes,
  selectedFeatureCount,
} from "../demo/reducer";

describe("forecast demo reducer", () => {
  it("keeps at least one model selected", () => {
    const oneModel = { ...initialDemoState, selectedModels: ["auto-ets"] };
    expect(
      demoReducer(oneModel, { type: "toggle-model", id: "auto-ets" }),
    ).toEqual(oneModel);
  });

  it("derives runtime from selected models", () => {
    const state = demoReducer(initialDemoState, {
      type: "toggle-model",
      id: "moirai",
    });
    expect(runtimeEstimateMinutes(state)).toBe(
      Math.max(4, state.selectedModels.length * 4),
    );
  });

  it("updates external feature counts from presets", () => {
    const state = demoReducer(initialDemoState, {
      type: "apply-preset",
      preset: "minimal",
    });
    expect(selectedFeatureCount(state)).toBe(0);
  });

  it("progresses training deterministically and enables results", () => {
    const running = demoReducer(initialDemoState, { type: "start-training" });
    const complete = demoReducer(running, { type: "finish-training" });
    expect(complete.trainingStatus).toBe("complete");
    expect(complete.activeStage).toBe("results");
  });

  it("resets every interaction", () => {
    const changed = demoReducer(initialDemoState, {
      type: "set-horizon",
      weeks: 26,
    });
    expect(demoReducer(changed, { type: "reset" })).toEqual(initialDemoState);
  });
});
