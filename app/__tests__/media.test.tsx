import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EvidenceGallery } from "../components/EvidenceGallery";
import { VideoGallery } from "../components/VideoGallery";

describe("presentation media", () => {
  it("renders three honest video states without video elements", () => {
    const { container } = render(<VideoGallery />);
    expect(screen.getAllByText("Video coming soon")).toHaveLength(3);
    expect(container.querySelector("video")).toBeNull();
  });

  it("expands technical evidence", async () => {
    const user = userEvent.setup();
    render(<EvidenceGallery />);
    await user.click(
      screen.getByRole("button", { name: "Open Field crop seed drivers" }),
    );
    expect(
      screen.getByRole("dialog", { name: "Field crop seed drivers" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close evidence" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
