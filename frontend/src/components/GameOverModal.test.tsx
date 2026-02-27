import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import GameOverModal from "./GameOverModal";

describe("GameOverModal", () => {
  it("renders winner correctly", () => {
    const mockOnPlayAgain = vi.fn();
    const modalRef = React.createRef<HTMLDialogElement>();

    render(
      <GameOverModal
        winner="X"
        modalRef={modalRef}
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("X won!")).toBeInTheDocument();
  });

  it("renders tie correctly", () => {
    const mockOnPlayAgain = vi.fn();
    const modalRef = React.createRef<HTMLDialogElement>();

    render(
      <GameOverModal
        winner={0}
        modalRef={modalRef}
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Tie!")).toBeInTheDocument();
  });

  it("calls onPlayAgain when button is clicked", () => {
    const mockOnPlayAgain = vi.fn();
    const modalRef = React.createRef<HTMLDialogElement>();

    render(
      <GameOverModal
        winner="O"
        modalRef={modalRef}
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /play again/i, hidden: true }),
    );
    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });
});
