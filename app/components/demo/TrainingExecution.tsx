import type { Dispatch } from "react";
import { pipelineNodes } from "../../demo/fixtures";
import type { DemoAction, DemoState } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function TrainingExecution({ state, dispatch }: Props) {
  const statusText = { idle: "Ready", running: "Pipeline running", cancelled: "Simulation cancelled", complete: "Complete" }[state.trainingStatus];
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 4 · Execution</p><h3>Training and execution</h3><p>Follow every handoff from Bronze ingestion to model metrics.</p></div><span className={`stage-status ${state.trainingStatus === "complete" ? "success" : "info"}`}>{statusText}</span></div>
      <div className="training-summary product-card">
        <div className="progress-header"><div><strong>Pipeline progress</strong><span>{state.trainingProgress}%</span></div><div className="progress-track"><i style={{ width: `${state.trainingProgress}%` }} /></div></div>
        <div className="pipeline-nodes">
          {pipelineNodes.map((node, index) => {
            const threshold = (index + 1) * 30;
            const complete = state.trainingProgress >= threshold;
            const running = state.trainingStatus === "running" && !complete && state.trainingProgress >= index * 30;
            return <article key={node.id} className={complete ? "complete" : running ? "running" : "waiting"}><span className="node-state" aria-hidden="true">{complete ? "✓" : running ? "●" : index + 1}</span><div><strong>{node.name}</strong><small>{complete ? "Completed" : running ? "Running" : "Waiting"}</small></div><dl><div><dt>Input</dt><dd>{node.input}</dd></div><div><dt>Output</dt><dd>{node.output}</dd></div></dl></article>;
          })}
        </div>
        <div className="training-actions">
          <button className="product-button primary" type="button" onClick={() => dispatch({ type: "start-training" })}>Start illustrative training</button>
          <button className="product-button secondary" type="button" disabled={state.trainingStatus !== "running"} onClick={() => dispatch({ type: "finish-training" })}>Complete simulation</button>
          <button className="product-button danger" type="button" disabled={state.trainingStatus !== "running"} onClick={() => dispatch({ type: "cancel-training" })}>Cancel simulation</button>
        </div>
      </div>
      <div className="log-console" aria-label="Illustrative pipeline log"><span>10:24:01</span> Pipeline configuration validated<br/><span>10:24:03</span> Bronze source mounted in showcase mode<br/><span>10:24:07</span> External features aligned to weekly grain<br/><span>10:24:12</span> Model portfolio queued for rolling backtest</div>
    </div>
  );
}
