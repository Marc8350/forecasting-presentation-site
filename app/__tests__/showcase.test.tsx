import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForecastShowcase } from "../components/ForecastShowcase";

describe("interactive forecasting showcase", () => {
  it("walks from ingestion to an illustrative export", async () => {
    const user = userEvent.setup();
    render(<ForecastShowcase />);

    await user.click(screen.getByRole("button", { name: "Load sample dataset" }));
    expect(screen.getByText("Validation passed")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "External data" }));
    await user.click(screen.getByRole("button", { name: "Minimal — sales only" }));
    expect(screen.getByText("0 external features selected")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Model selection" }));
    expect(screen.getByText(/4 models selected/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Training" }));
    await user.click(screen.getByRole("button", { name: "Start illustrative training" }));
    await user.click(screen.getByRole("button", { name: "Complete simulation" }));
    expect(
      screen.getByRole("heading", { name: "Forecast results and metrics" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Export and registry" }));
    await user.click(screen.getByRole("radio", { name: "Excel" }));
    await user.click(
      screen.getByRole("button", { name: "Simulate export and registration" }),
    );
    expect(screen.getByText("Illustrative export completed")).toBeInTheDocument();
  });

  it("resets the complete experience", async () => {
    const user = userEvent.setup();
    render(<ForecastShowcase />);
    await user.click(screen.getByRole("button", { name: "Load sample dataset" }));
    await user.click(screen.getByRole("button", { name: "Reset showcase" }));
    expect(screen.getByText("No sample loaded")).toBeInTheDocument();
  });
});
