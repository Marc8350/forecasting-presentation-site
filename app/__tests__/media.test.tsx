import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EvidenceGallery } from "../components/EvidenceGallery";
import { VideoGallery } from "../components/VideoGallery";

describe("presentation media", () => {
  it("shows the initial honest video placeholder with bounded controls", () => {
    const { container } = render(<VideoGallery />);

    expect(
      screen.getByText("From data to a forecast-ready foundation"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "See how sales history and external signals become a validated forecasting dataset.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Video coming soon")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Previous demonstration" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Show demonstration 1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector("[data-presentation-interactive='true']")).toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
  });

  it("clicks through the three video placeholders without leaving their bounds", async () => {
    const user = userEvent.setup();
    render(<VideoGallery />);

    await user.click(screen.getByRole("button", { name: "Next demonstration" }));
    expect(
      screen.getByText("Selecting and training the right model portfolio"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Compare statistical, machine-learning, and foundation-model strategies in one workflow.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show demonstration 3" }));
    expect(
      screen.getByText("Explaining, exporting, and operationalizing results"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show demonstration 3" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous demonstration" }));
    expect(
      screen.getByText("Selecting and training the right model portfolio"),
    ).toBeInTheDocument();
  });

  it("navigates technical evidence and restores the launch control on close", async () => {
    const user = userEvent.setup();
    render(<EvidenceGallery />);
    const launchButton = screen.getByRole("button", {
      name: "Open Field crop seed drivers",
    });

    await user.click(launchButton);
    expect(
      screen.getByRole("dialog", { name: "Field crop seed drivers" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next evidence item" }));
    expect(screen.getByRole("dialog", { name: "Herbicide drivers" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous evidence item" }));
    expect(
      screen.getByRole("dialog", { name: "Field crop seed drivers" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close evidence" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(launchButton).toHaveFocus();
  });
});
