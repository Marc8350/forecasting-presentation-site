import { act, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { OpportunityExplorer } from "../OpportunityExplorer";

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  (Harness as unknown as { progress: typeof progress }).progress = progress;
  return (
    <SlideProgressContext.Provider
      value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
    >
      <OpportunityExplorer />
    </SlideProgressContext.Provider>
  );
}

describe("OpportunityExplorer", () => {
  it("marks the content-array's first use case selected at the band start", () => {
    render(<Harness initialProgress={1 / 3} />);
    // Content order is understand, research, forecast, explain — index 0 is "Understand".
    expect(screen.getByRole("button", { name: "Understand" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("advances to later use cases as progress moves through the band", () => {
    render(<Harness initialProgress={1 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(2 / 3 - 0.01));

    expect(screen.getByRole("button", { name: "Explain" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
