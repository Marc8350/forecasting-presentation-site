import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("presentation site shell", () => {
  it("exposes the approved narrative chapters", () => {
    render(<Page />);
    expect(
      screen.getByRole("heading", {
        name: /forecasting, from fragmented data/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /presentation chapters/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: /interactive forecasting platform/i,
      }),
    ).toBeInTheDocument();
  });
});
