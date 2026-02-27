import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import App from "./App";

describe("App Integration", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it("renders the game board", () => {
    render(<App />);
    expect(screen.getByText("Tic")).toBeInTheDocument();
    expect(screen.getByText("X to move")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(9);
  });

  it("can play a full game and show winner", () => {
    render(<App />);
    const cells = screen.getAllByRole("button").slice(0, 9);

    fireEvent.click(cells[0]);
    expect(cells[0]).toHaveTextContent("X");
    expect(screen.getByText("O to move")).toBeInTheDocument();

    fireEvent.click(cells[1]);
    expect(cells[1]).toHaveTextContent("O");

    fireEvent.click(cells[4]);

    fireEvent.click(cells[2]);

    fireEvent.click(cells[8]);

    expect(screen.getByText("X won!")).toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    const playAgainBtn = screen.getByRole("button", {
      name: /play again/i,
      hidden: true,
    });
    fireEvent.click(playAgainBtn);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

    expect(cells[0]).not.toHaveTextContent("X");
  });
});
