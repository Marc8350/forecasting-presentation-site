import { render, screen } from "@testing-library/react";
import { HighlightedText } from "../../ui/highlighted-text";

describe("HighlightedText", () => {
  it("wraps each matched phrase in a highlight span and preserves the full text", () => {
    const { container } = render(
      <HighlightedText
        text="Data might contain missing values or errors before being cleaned and validated."
        phrases={["missing values or errors", "cleaned and validated"]}
      />,
    );

    const highlighted = container.querySelectorAll("span.relative");
    expect(highlighted).toHaveLength(2);
    expect(highlighted[0]).toHaveTextContent("missing values or errors");
    expect(highlighted[1]).toHaveTextContent("cleaned and validated");
    expect(container.textContent).toBe(
      "Data might contain missing values or errors before being cleaned and validated.",
    );
  });

  it("renders plain text when no phrase matches", () => {
    const { container } = render(
      <HighlightedText text="Nothing to mark here." phrases={["absent phrase"]} />,
    );
    expect(container.querySelectorAll("span.relative")).toHaveLength(0);
    expect(screen.getByText("Nothing to mark here.")).toBeInTheDocument();
  });
});
