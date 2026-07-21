import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChallengeExplorer } from "../components/story/ChallengeExplorer";
import { OpportunityExplorer } from "../components/story/OpportunityExplorer";

describe("story explorers", () => {
  it("explains a selected forecasting challenge", async () => {
    const user = userEvent.setup();
    render(<ChallengeExplorer />);

    expect(screen.getByText(/distributed across systems, owners, and formats/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Limited historical data availability" }));

    expect(screen.getByText(/short or incomplete histories/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limited historical data availability" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "false");
  });

  it("explains a selected holistic AI use case", async () => {
    const user = userEvent.setup();
    render(<OpportunityExplorer />);

    const liveExplanation = screen.getByText(/profiles unfamiliar datasets/i);
    expect(liveExplanation).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Understand" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Explain" }));

    expect(screen.getByText(/technical and business stakeholders/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Understand" })).toHaveAttribute("aria-pressed", "false");
  });
});
