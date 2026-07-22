import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChallengeExplorer } from "../components/story/ChallengeExplorer";
import { OpportunityExplorer } from "../components/story/OpportunityExplorer";
import { PlatformBlocks } from "../components/story/PlatformBlocks";

describe("story explorers", () => {
  it("explains a selected forecasting challenge", async () => {
    const user = userEvent.setup();
    render(<ChallengeExplorer />);

    expect(screen.getByText(/distributed across systems, owners, and formats/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Inconsistent data quality and data types" }));

    expect(screen.getByText(/missing values or errors/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inconsistent data quality and data types" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Siloed data infrastructure" })).toHaveAttribute("aria-pressed", "false");
  });

  it("explains a selected holistic AI use case", async () => {
    const user = userEvent.setup();
    render(<OpportunityExplorer />);

    const liveExplanation = screen.getByText(/discover relevant signals/i);
    expect(liveExplanation).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Research" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Explain" }));

    expect(screen.getByText(/technical and business stakeholders/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Research" })).toHaveAttribute("aria-pressed", "false");
  });
});

describe("story platform", () => {
  it("defaults to the feature-building platform block", () => {
    render(<PlatformBlocks />);

    expect(
      screen.getByText("Explore useful internal and external data sources."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("reveals the selected platform block in its ordered workflow", async () => {
    const user = userEvent.setup();
    render(<PlatformBlocks />);

    await user.click(screen.getByRole("button", { name: "Model and evaluate" }));

    expect(
      screen.getByText(/foundation models with a few clicks/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/backtest, compare, rank/i)).toBeInTheDocument();
    expect(screen.getByRole("list")).toContainElement(
      screen.getByText(/backtest, compare, rank/i),
    );
    expect(
      screen.getByRole("button", { name: "Model and evaluate" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
