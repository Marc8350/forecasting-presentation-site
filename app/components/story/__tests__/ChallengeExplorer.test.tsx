import { act, fireEvent, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef, useEffect, type RefObject } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { ChallengeExplorer } from "../ChallengeExplorer";

type HarnessStatics = { progress: ReturnType<typeof useMotionValue>; slideRef: RefObject<HTMLDivElement | null> };

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  useEffect(() => {
    Object.assign(Harness as unknown as HarnessStatics, { progress, slideRef });
  }, [progress, slideRef]);
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

describe("ChallengeExplorer", () => {
  it("shows the first challenge's explanation at the start of its band", () => {
    render(<Harness initialProgress={0.35} />);
    expect(
      screen.getByRole("button", { name: "Siloed data infrastructure" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches active challenge as scroll progress advances through the band", () => {
    render(<Harness initialProgress={0.35} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(0.6));

    expect(
      screen.getByRole("button", { name: "Time-intensive model research" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("scrolls to a clicked card's stop instead of only setting local state", () => {
    render(<Harness initialProgress={0.35} />);
    const container = (Harness as unknown as HarnessStatics).slideRef.current!;
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 2000,
      left: 0,
      right: 0,
      width: 0,
      height: 2000,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    Object.defineProperty(container, "offsetHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    window.scrollTo = vi.fn();

    fireEvent.click(
      screen.getByRole("button", { name: "Missing domain knowledge" }),
    );

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });
});
