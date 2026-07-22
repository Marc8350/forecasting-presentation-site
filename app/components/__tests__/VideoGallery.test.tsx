import { act, fireEvent, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef, type RefObject } from "react";
import { SlideProgressContext } from "../../presentation/scroll";
import { VideoGallery } from "../VideoGallery";

type HarnessStatics = { progress: ReturnType<typeof useMotionValue>; slideRef: RefObject<HTMLDivElement | null> };

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(Harness as unknown as HarnessStatics, { progress, slideRef });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <VideoGallery />
      </SlideProgressContext.Provider>
    </div>
  );
}

describe("VideoGallery", () => {
  it("shows the first demonstration at the band start and disables Previous", () => {
    render(<Harness initialProgress={2 / 3} />);
    expect(screen.getByText("01 / 02")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous demonstration" })).toBeDisabled();
  });

  it("advances to the second demonstration near the end of progress", () => {
    render(<Harness initialProgress={2 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(0.99));

    expect(screen.getByText("02 / 02")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeDisabled();
  });

  it("clicking Previous requests a scroll rather than only flipping local state", () => {
    render(<Harness initialProgress={0.99} />);
    const container = (Harness as unknown as HarnessStatics).slideRef.current!;
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 900,
      left: 0,
      right: 0,
      width: 0,
      height: 900,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    Object.defineProperty(container, "offsetHeight", { value: 900, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    window.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("button", { name: "Previous demonstration" }));

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });
});
