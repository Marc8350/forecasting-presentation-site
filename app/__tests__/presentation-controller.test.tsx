import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
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
  vi.unstubAllGlobals();
});

describe("presentation controller", () => {
  it("renders safely when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    expect(() => renderToStaticMarkup(<TestDeck />)).not.toThrow();
  });

  it("advances reveals before slides, reverses them, and protects focused controls", () => {
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
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");
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

  it("requires a wheel threshold and locks a gesture after navigation", () => {
    vi.useFakeTimers();
    render(<TestDeck />);

    fireEvent.wheel(window, { deltaY: 44 });
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");

    fireEvent.wheel(window, { deltaY: 45 });
    fireEvent.wheel(window, { deltaY: 45 });
    expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");

    vi.advanceTimersByTime(600);
    fireEvent.wheel(window, { deltaY: 45 });
    expect(screen.getByTestId("slide-challenge")).toHaveAttribute("data-active", "true");
    vi.useRealTimers();
  });

  it("clears the wheel lock timer when the deck unmounts", () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<TestDeck />);

    fireEvent.wheel(window, { deltaY: 45 });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    vi.useRealTimers();
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

    expect(screen.getByRole("button", { name: "Previous presentation step" })).toBeDisabled();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next presentation step" }));
    expect(screen.getByRole("button", { name: "Previous presentation step" })).toBeEnabled();
  });
});
