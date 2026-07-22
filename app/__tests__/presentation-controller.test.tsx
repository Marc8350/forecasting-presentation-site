import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { PresentationControls } from "../components/presentation/PresentationControls";
import { PresentationDeck } from "../components/presentation/PresentationDeck";
import { PresentationSlide } from "../components/presentation/PresentationSlide";
import { Reveal } from "../components/presentation/Reveal";

const slides = [
  { id: "opening", revealCount: 1 },
  { id: "challenge", revealCount: 0 },
] as const;

function TestDeck() {
  return (
    <PresentationDeck slides={slides}>
      <PresentationSlide id="opening">
        <Reveal at={1} data-testid="opening-reveal-1">Opening reveal</Reveal>
        <button type="button">Interactive test control</button>
        <div
          data-presentation-interactive="true"
          data-testid="interactive-scroll-region"
        >
          Interactive scroll region
        </div>
      </PresentationSlide>
      <PresentationSlide id="challenge">Challenge</PresentationSlide>
      <PresentationControls />
    </PresentationDeck>
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function dispatchWheel(target: EventTarget, deltaY: number) {
  const event = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    deltaY,
  });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

describe("presentation controller", () => {
  it("renders safely when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    expect(() => renderToStaticMarkup(<TestDeck />)).not.toThrow();
  });

  it("advances reveals before slides, never hides revealed content, and protects focused controls", () => {
    render(<TestDeck />);

    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");

    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");

    const interactiveControl = screen.getByRole("button", { name: "Interactive test control" });
    interactiveControl.focus();
    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");

    interactiveControl.blur();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    // Going back never hides already-revealed content.
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("slide-challenge")).toHaveAttribute("data-active", "true");

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");
  });

  it("supports Home and End and syncs the active slide hash", () => {
    render(<TestDeck />);

    fireEvent.keyDown(window, { key: "End" });
    expect(screen.getByTestId("slide-challenge")).toHaveAttribute("data-active", "true");
    expect(window.location.hash).toBe("#challenge");

    fireEvent.keyDown(window, { key: "Home" });
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
    expect(window.location.hash).toBe("#opening");
  });

  it("navigates to known slides after a hash change", () => {
    render(<TestDeck />);

    window.location.hash = "#challenge";
    fireEvent(window, new Event("hashchange"));

    expect(screen.getByTestId("slide-challenge")).toHaveAttribute("data-active", "true");
  });

  it("sequences one step per wheel gesture, ignoring input during the cooldown, without native scrolling", () => {
    vi.useFakeTimers();
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<TestDeck />);

    const firstSmallDelta = dispatchWheel(window, 20);
    expect(firstSmallDelta.defaultPrevented).toBe(true);
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");

    const thresholdDelta = dispatchWheel(window, 25);
    expect(thresholdDelta.defaultPrevented).toBe(true);
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");

    dispatchWheel(window, 80);
    dispatchWheel(window, 80);
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");

    // Sustained momentum keeps firing wheel events well past the old 120ms
    // settle window; the deck must still advance on a fixed per-step cooldown
    // rather than staying locked for the whole gesture.
    act(() => vi.advanceTimersByTime(300));
    dispatchWheel(window, 80);
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");

    act(() => vi.advanceTimersByTime(400));
    dispatchWheel(window, 45);
    expect(screen.getByTestId("slide-challenge")).toHaveAttribute("data-active", "true");

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: false },
    );
  });

  it("leaves wheel events over interactive regions unprevented", () => {
    render(<TestDeck />);

    const wheelEvent = dispatchWheel(
      screen.getByTestId("interactive-scroll-region"),
      80,
    );

    expect(wheelEvent.defaultPrevented).toBe(false);
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");
  });

  it("sequences background wheel input while an interactive control has focus", () => {
    vi.useFakeTimers();
    render(<TestDeck />);
    const interactiveControl = screen.getByRole("button", {
      name: "Interactive test control",
    });
    const deck = document.querySelector("[data-presentation-deck]");
    expect(deck).not.toBeNull();
    interactiveControl.focus();

    const wheelEvent = dispatchWheel(deck!, 45);
    dispatchWheel(deck!, 80);

    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");
    expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
  });

  it("clears the wheel cooldown timer when the deck unmounts", () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<TestDeck />);

    dispatchWheel(window, 45);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("requires a swipe threshold before navigating", () => {
    render(<TestDeck />);

    fireEvent.touchStart(window, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientY: 146 }] });
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");

    fireEvent.touchStart(window, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientY: 145 }] });
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");
  });

  it("clears a touch gesture when it ends on an interactive target", () => {
    render(<TestDeck />);
    const interactiveControl = screen.getByRole("button", { name: "Interactive test control" });

    fireEvent.touchStart(window, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(interactiveControl, { changedTouches: [{ clientY: 120 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientY: 120 }] });

    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");
  });

  it("exposes accessible presentation controls", () => {
    render(<TestDeck />);

    const previous = screen.getByRole("button", { name: "Previous presentation step" });
    expect(previous.closest("[data-presentation-controls]")).toBeInTheDocument();
    expect(previous).toBeDisabled();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: "Next presentation step" });
    fireEvent.click(next);
    // Still on the first slide after revealing its single step.
    expect(previous).toBeDisabled();
    fireEvent.click(next);
    expect(screen.getByRole("button", { name: "Previous presentation step" })).toBeEnabled();
  });

  it("hydrates with stable reduced-motion markup before updating after mount", async () => {
    const addEventListener = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener,
        removeEventListener: vi.fn(),
      }),
    );

    const serverMarkup = renderToString(<TestDeck />);
    expect(serverMarkup).toContain('data-reduced-motion="false"');

    const container = document.createElement("div");
    container.innerHTML = serverMarkup;
    document.body.appendChild(container);
    expect(container.querySelector("[data-presentation-deck]")).toHaveAttribute(
      "data-reduced-motion",
      "false",
    );

    render(<TestDeck />, { container, hydrate: true });

    await waitFor(() =>
      expect(container.querySelector("[data-presentation-deck]")).toHaveAttribute(
        "data-reduced-motion",
        "true",
      ),
    );
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    expect(scrollIntoView).toHaveBeenCalled();
    expect(scrollIntoView.mock.calls[0]?.[0]).toMatchObject({ behavior: "auto" });
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("tracks reduced-motion preference changes and unsubscribes on unmount", () => {
    let changeListener: (() => void) | undefined;
    const removeEventListener = vi.fn();
    const mediaQuery = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn((_type: string, listener: () => void) => {
        changeListener = listener;
      }),
      removeEventListener,
    };
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQuery));

    const { unmount } = render(<TestDeck />);
    const deck = document.querySelector("[data-presentation-deck]");
    expect(deck).toHaveAttribute("data-reduced-motion", "false");

    act(() => {
      mediaQuery.matches = true;
      changeListener?.();
    });
    expect(deck).toHaveAttribute("data-reduced-motion", "true");

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith("change", changeListener);
  });
});
