import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  Element.prototype.scrollIntoView = vi.fn();
});

describe("presentation site shell", () => {
  it("composes the complete eight-slide presentation with controls and identities", () => {
    render(<Page />);

    expect(
      screen.getByRole("navigation", { name: "Presentation chapters" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous presentation step" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next presentation step" }),
    ).toBeEnabled();
    const basfMarks = screen.getAllByAltText(/BASF/);
    expect(basfMarks).toHaveLength(2);
    for (const basfMark of basfMarks) {
      expect(basfMark).toHaveAttribute("src", "/assets/basf-logo.png");
      expect(basfMark.closest("[data-reveal]")).toBeNull();
    }
    expect(
      screen.getByAltText("Karlsruhe Institute of Technology (KIT)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Scan me to explore the mockup")).toBeInTheDocument();
    expect(
      screen.getByText("Interactive forecasting platform"),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(/slide-/)).toHaveLength(8);
  });

  it("keeps chapter hashes while navigating through presentation state", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const platformLink = screen.getByRole("link", { name: "Platform" });
    expect(platformLink).toHaveAttribute("href", "#platform");

    await user.click(platformLink);

    expect(screen.getByTestId("slide-platform")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("protects the complete forecasting showcase from global navigation", () => {
    render(<Page />);

    expect(screen.getByTestId("forecasting-showcase-wrapper")).toHaveAttribute(
      "data-presentation-interactive",
      "true",
    );
    expect(
      screen.getAllByRole("tab", {
        name: /data ingestion|external data|model selection|training|results|explainability|export and registry/i,
      }),
    ).toHaveLength(7);
  });
});
