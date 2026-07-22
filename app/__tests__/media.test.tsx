import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EvidenceGallery } from "../components/EvidenceGallery";
import { VideoGallery } from "../components/VideoGallery";

describe("presentation media", () => {
  it("embeds the first demonstration video with bounded controls", () => {
    const { container } = render(<VideoGallery />);

    expect(
      screen.getByText("Exploring the features already in the system"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A data scientist walks through the features already available in the platform before building anything new on top of them.",
      ),
    ).toBeInTheDocument();
    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/3SmZsfm7_mw");
    expect(screen.getByRole("button", { name: "Previous demonstration" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Show demonstration 1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector("[data-presentation-interactive='true']")).toBeInTheDocument();
  });

  it("clicks through the demonstration videos without leaving their bounds", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoGallery />);

    await user.click(screen.getByRole("button", { name: "Next demonstration" }));
    expect(
      screen.getByText("Contributing a new feature"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A biologist first reviews the existing data, then discovers new open-source soil data and ingests it into the architecture automatically.",
      ),
    ).toBeInTheDocument();
    expect(container.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/hBWWQyUH2-U",
    );
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous demonstration" }));
    expect(
      screen.getByText("Exploring the features already in the system"),
    ).toBeInTheDocument();
  });

  it("navigates technical evidence and restores the launch control on close", async () => {
    const user = userEvent.setup();
    render(<EvidenceGallery />);
    const launchButton = screen.getByRole("button", {
      name: "Open Cross-category feature importance heatmap",
    });

    await user.click(launchButton);
    expect(
      screen.getByRole("dialog", { name: "Cross-category feature importance heatmap" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next evidence item" }));
    expect(
      screen.getByRole("dialog", { name: "Top features by product group (LightGBM)" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous evidence item" }));
    expect(
      screen.getByRole("dialog", { name: "Cross-category feature importance heatmap" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close evidence" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(launchButton).toHaveFocus();
  });
});
