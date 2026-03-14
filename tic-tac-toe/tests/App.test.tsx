import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import App from "../src/App";
import * as useServerCommunicationModule from "../src/hooks/useServerCommunication";
import type { ServerMessage } from "../src/hooks/useServerCommunication";
import type { ClientRequest } from "../src/hooks/useServerCommunication";

describe("App Integration", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupMockConnection = () => {
    let _latestMessage: ServerMessage | null = null;
    let _sendClientRequest: (req: ClientRequest) => void = vi.fn();
    const useServerCommunicationSpy = vi
      .spyOn(useServerCommunicationModule, "default")
      .mockImplementation(() => {
        return {
          sendClientRequest: _sendClientRequest,
          latestMessage: _latestMessage,
          connectionStatus: "Open",
        };
      });

    return {
      simulateServerMessage: (msg: ServerMessage) => {
        _latestMessage = msg;
        useServerCommunicationSpy.mockImplementation(() => ({
          sendClientRequest: _sendClientRequest,
          latestMessage: _latestMessage,
          connectionStatus: "Open",
        }));
      },
      mockSendClientRequest: _sendClientRequest,
      useServerCommunicationSpy,
    };
  };

  it("renders the game board and can play a full game", () => {
    const { simulateServerMessage, mockSendClientRequest } =
      setupMockConnection();
    const { rerender } = render(<App />);

    // First it renders StartGameForm
    const input = screen.getByLabelText(/Enter your username/i);
    fireEvent.change(input, { target: { value: "Player1" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a Room/i }));

    // Rerender the component to reflect state changes based on the mocked useServerCommunication returning the new updated state
    // Wait for the app to go into searching state
    rerender(<App />);
    expect(screen.getByText("Searching for opponent...")).toBeInTheDocument();

    // Simulate opponent found
    simulateServerMessage({
      action: "start-game",
      opponent: "Player2",
      symbol: "X",
    });
    rerender(<App />);

    expect(screen.getByText("X to move (You)")).toBeInTheDocument();

    const cells = screen.getAllByRole("button").slice(0, 9);

    // Player 1 (X) clicks cell 0
    fireEvent.click(cells[0]);
    rerender(<App />);
    expect(cells[0]).toHaveTextContent("X");
    expect(mockSendClientRequest).toHaveBeenCalledWith({
      action: "make-move",
      x: 0,
      y: 0,
      symbol: "X",
    });

    // Simulate Player 2 (O) move
    simulateServerMessage({
      action: "make-move",
      x: 0,
      y: 1,
      symbol: "O",
    });
    rerender(<App />);
    expect(cells[1]).toHaveTextContent("O");

    // Player 1 (X) clicks cell 3 (row 1, col 0)
    fireEvent.click(cells[3]);
    rerender(<App />);

    // Simulate Player 2 (O) move
    simulateServerMessage({
      action: "make-move",
      x: 0,
      y: 2,
      symbol: "O",
    });
    rerender(<App />);

    // Player 1 (X) clicks cell 6 (row 2, col 0) - winning move
    fireEvent.click(cells[6]);
    rerender(<App />);

    expect(screen.getByText("X won!")).toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    const playAgainBtn = screen.getByRole("button", {
      name: /play again/i,
      hidden: true,
    });
    fireEvent.click(playAgainBtn);
    rerender(<App />);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it("handles server connection errors gracefully", () => {
    const { simulateServerMessage } = setupMockConnection();
    const { rerender } = render(<App />);

    const input = screen.getByLabelText(/Enter your username/i);
    fireEvent.change(input, { target: { value: "Player1" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a Room/i }));
    rerender(<App />);

    simulateServerMessage({
      action: "connect",
      status: false,
      message: "Username already taken",
    });
    rerender(<App />);

    expect(screen.getByText("Username already taken")).toBeInTheDocument();
  });

  it("renders opponent pointer when connected", () => {
    const { simulateServerMessage } = setupMockConnection();
    const { rerender, container } = render(<App />);

    // Join game
    const input = screen.getByLabelText(/Enter your username/i);
    fireEvent.change(input, { target: { value: "Player1" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a Room/i }));
    rerender(<App />);

    // Simulate game started
    simulateServerMessage({
      action: "start-game",
      opponent: "Player2",
      symbol: "X",
    });
    rerender(<App />);

    // Simulate pointer move
    simulateServerMessage({
      action: "pointer-position",
      x: 100,
      y: 200,
    });
    rerender(<App />);

    const pointer = container.querySelector('[data-label="Player2"]');
    expect(pointer).toBeInTheDocument();
  });
});
