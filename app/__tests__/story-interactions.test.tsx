import { act, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import { SlideProgressContext } from "../presentation/scroll";
import { ChallengeExplorer } from "../components/story/ChallengeExplorer";
import { OpportunityExplorer } from "../components/story/OpportunityExplorer";
import { PlatformBlocks } from "../components/story/PlatformBlocks";

type HarnessStatics = { progress: ReturnType<typeof useMotionValue> };

function ChallengeExplorerWithContext() {
  const progress = useMotionValue(0.35);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(ChallengeExplorerWithContext as unknown as HarnessStatics, { progress });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <ChallengeExplorer />
      </SlideProgressContext.Provider>
    </div>
  );
}

function OpportunityExplorerWithContext() {
  const progress = useMotionValue(1 / 3);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(OpportunityExplorerWithContext as unknown as HarnessStatics, { progress });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <OpportunityExplorer />
      </SlideProgressContext.Provider>
    </div>
  );
}

function PlatformBlocksWithContext() {
  const progress = useMotionValue(1 / 3);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(PlatformBlocksWithContext as unknown as HarnessStatics, { progress });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <PlatformBlocks />
      </SlideProgressContext.Provider>
    </div>
  );
}

describe("story explorers", () => {
  it("explains a selected forecasting challenge", async () => {
    const user = userEvent.setup();
    render(<ChallengeExplorerWithContext />);

    expect(screen.getByText(/distributed across systems, owners, and formats/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "true");

    const progress = (ChallengeExplorerWithContext as unknown as HarnessStatics).progress;
    vi.spyOn(window, "scrollTo").mockImplementation(() => {
      act(() => progress.set(0.45));
    });

    await user.click(screen.getByRole("button", { name: "Inconsistent data quality and data types" }));

    expect(screen.getByText(/missing values or errors/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inconsistent data quality and data types" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "false");
  });

  it("explains a selected holistic AI use case", async () => {
    const user = userEvent.setup();
    render(<OpportunityExplorerWithContext />);

    // Clockwise display order is research, understand, forecast, explain —
    // "Research" is the first use case, selected by default at the start of its band.
    const liveExplanation = screen.getByText(/discover relevant signals/i);
    expect(liveExplanation.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Research" })).toHaveAttribute("aria-pressed", "true");

    const progress = (OpportunityExplorerWithContext as unknown as HarnessStatics).progress;
    vi.spyOn(window, "scrollTo").mockImplementation(() => {
      act(() => progress.set(2 / 3 - 0.001));
    });

    await user.click(screen.getByRole("button", { name: "Explain" }));

    expect(screen.getByText(/technical and business stakeholders/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Research" })).toHaveAttribute("aria-pressed", "false");
  });
});

describe("story platform", () => {
  it("defaults to the feature-building platform block", () => {
    render(<PlatformBlocksWithContext />);

    expect(
      screen.getByText(/useful internal and external/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("reveals the selected platform block in its ordered workflow", async () => {
    const user = userEvent.setup();
    render(<PlatformBlocksWithContext />);

    const progress = (PlatformBlocksWithContext as unknown as HarnessStatics).progress;
    vi.spyOn(window, "scrollTo").mockImplementation(() => {
      act(() => progress.set(0.5));
    });

    await user.click(screen.getByRole("button", { name: "Model and evaluate" }));

    expect(
      screen.getByText(/with a few clicks/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/backtest, compare, rank/i)).toBeInTheDocument();
    expect(screen.getByRole("list")).toContainElement(
      screen.getByText(/backtest, compare, rank/i),
    );
    expect(
      screen.getByRole("button", { name: "Model and evaluate" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
