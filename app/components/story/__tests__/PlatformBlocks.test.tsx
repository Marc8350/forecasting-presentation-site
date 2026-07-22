import { act, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { PlatformBlocks } from "../PlatformBlocks";

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  (Harness as unknown as { progress: typeof progress }).progress = progress;
  return (
    <SlideProgressContext.Provider
      value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
    >
      <PlatformBlocks />
    </SlideProgressContext.Provider>
  );
}

describe("PlatformBlocks", () => {
  it("selects the first block at the band start", () => {
    render(<Harness initialProgress={1 / 3} />);
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("selects the last block near the band end", () => {
    render(<Harness initialProgress={1 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(2 / 3 - 0.01));

    expect(
      screen.getByRole("button", { name: "Explain and operationalize" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
