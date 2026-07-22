import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  PresentationDeck,
  usePresentation,
} from "../components/presentation/PresentationDeck";

function stubSlide(id: string, absoluteTop: number, height: number, stopFractions?: string) {
  const el = document.getElementById(id) as HTMLDivElement;
  vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
    const top = absoluteTop - window.scrollY;
    return {
      top,
      bottom: top + height,
      left: 0,
      right: 0,
      width: 0,
      height,
      x: 0,
      y: top,
      toJSON: () => {},
    };
  });
  Object.defineProperty(el, "offsetHeight", { value: height, configurable: true });
  if (stopFractions !== undefined) el.dataset.stopFractions = stopFractions;
}

function Counter() {
  const { currentSlideIndex, totalSlides, atStart, atEnd } = usePresentation();
  return (
    <output data-testid="counter">
      {currentSlideIndex}/{totalSlides}/{String(atStart)}/{String(atEnd)}
    </output>
  );
}

function TestDeck() {
  return (
    <PresentationDeck>
      <Counter />
      <div id="opening" data-presentation-slide data-slide-mode="pinned" />
      <div id="challenge" data-presentation-slide data-slide-mode="pinned" />
      <button type="button">Interactive control</button>
    </PresentationDeck>
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.stubGlobal(
    "innerHeight",
    Object.getOwnPropertyDescriptor(window, "innerHeight")?.value ?? 800,
  );
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  window.scrollTo = vi.fn((options) => {
    if (typeof options === "object" && options && "top" in options) {
      Object.defineProperty(window, "scrollY", {
        value: options.top,
        configurable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    }
  }) as typeof window.scrollTo;
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PresentationDeck", () => {
  it("renders safely when window is unavailable", () => {
    vi.stubGlobal("window", undefined);
    expect(() => renderToStaticMarkup(<TestDeck />)).not.toThrow();
  });

  it("advances one stop at a time within a slide before crossing to the next", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.25,0.5,0.75,1");
    stubSlide("challenge", 2400, 1600, "0.5");

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 400 }));

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 800 }));

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    // Now at the last stop of "opening" (fraction 1 => top 1600).
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 1600 }));

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    // Crosses into "challenge"'s single stop.
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 2800 }));
  });

  it("ignores navigation keys while an interactive control is focused", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.5");
    stubSlide("challenge", 2400, 1600, "0.5");
    const control = screen.getByRole("button", { name: "Interactive control" });
    control.focus();

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("supports Home and End", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.25,0.75");
    stubSlide("challenge", 2400, 1600, "0.5");

    act(() => fireEvent.keyDown(window, { key: "End" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 2800 }));

    act(() => fireEvent.keyDown(window, { key: "Home" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 400 }));
  });

  it("exposes reduced-motion state and uses instant scrolling", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.5");
    stubSlide("challenge", 2400, 1600, "0.5");

    expect(document.querySelector("[data-presentation-deck]")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ behavior: "auto" }),
    );
  });
});
