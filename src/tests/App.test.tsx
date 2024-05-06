import App from "@/app";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("App Component", () => {
  it("renders App component with Header and AppRouter", () => {
    render(<App />);
    expect(screen.getByText(/Money Exchange/i)).toBeInTheDocument();
    // expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
