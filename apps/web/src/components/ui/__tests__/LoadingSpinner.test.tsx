import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render with default props", () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin", "text-yellow-400", "w-8", "h-8");
  });

  it("should render with text", () => {
    render(<LoadingSpinner text="Loading data..." />);

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
    expect(screen.getByText("Loading data...")).toHaveClass("text-gray-400");
  });

  it("should render with different sizes", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = document.querySelector("svg");
    expect(spinner).toHaveClass("w-4", "h-4");

    rerender(<LoadingSpinner size="md" />);
    spinner = document.querySelector("svg");
    expect(spinner).toHaveClass("w-8", "h-8");

    rerender(<LoadingSpinner size="lg" />);
    spinner = document.querySelector("svg");
    expect(spinner).toHaveClass("w-12", "h-12");

    rerender(<LoadingSpinner size="xl" />);
    spinner = document.querySelector("svg");
    expect(spinner).toHaveClass("w-16", "h-16");
  });

  it("should accept custom className", () => {
    render(<LoadingSpinner className="custom-class" />);

    const container = document.querySelector("svg")?.parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("should render without text when text prop is not provided", () => {
    render(<LoadingSpinner />);

    expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();
  });

  it("should have correct SVG structure", () => {
    render(<LoadingSpinner />);

    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");

    // Check for circle element
    const circle = svg?.querySelector("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveClass("opacity-25");

    // Check for path element
    const path = svg?.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveClass("opacity-75");
  });
});
