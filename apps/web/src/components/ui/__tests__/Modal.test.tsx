import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Modal from "../Modal";

// Mock body style
Object.defineProperty(document.body, "style", {
  value: {
    overflow: "unset",
  },
  writable: true,
});

describe("Modal", () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<Modal {...defaultProps} isOpen={true} />);

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should render with title", () => {
    render(<Modal {...defaultProps} isOpen={true} title="Test Modal" />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("should render without title", () => {
    render(<Modal {...defaultProps} isOpen={true} />);

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /close/i }),
    ).not.toBeInTheDocument();
  });

  it("should render with different sizes", () => {
    const { rerender } = render(
      <Modal {...defaultProps} isOpen={true} size="sm" />,
    );
    expect(screen.getByRole("dialog")).toHaveClass("max-w-md");

    rerender(<Modal {...defaultProps} isOpen={true} size="md" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-lg");

    rerender(<Modal {...defaultProps} isOpen={true} size="lg" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");

    rerender(<Modal {...defaultProps} isOpen={true} size="xl" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-4xl");
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        title="Test Modal"
        onClose={onClose}
      />,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);

    const overlay = screen.getByRole("dialog").parentElement;
    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when overlay is clicked if closeOnOverlayClick is false", () => {
    const onClose = vi.fn();
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        onClose={onClose}
        closeOnOverlayClick={false}
      />,
    );

    const overlay = screen.getByRole("dialog").parentElement;
    fireEvent.click(overlay!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should not call onClose when modal content is clicked", () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);

    const modalContent = screen.getByText("Modal Content");
    fireEvent.click(modalContent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should set body overflow to hidden when modal opens", () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("unset");

    rerender(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("unset");
  });

  it("should restore body overflow when component unmounts", () => {
    const { unmount } = render(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});
