import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useTicTacToe from "./useTicTactoe";

describe("useTicTacToe", () => {
  it("initializes correctly", () => {
    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.ticTacToe).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    expect(result.current.nextMove).toBe("X");
    expect(result.current.winner).toBe(0);
  });

  it("handles cell click correctly", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 0 });
    });

    expect(result.current.ticTacToe[0][0]).toBe("X");
    expect(result.current.nextMove).toBe("O");
  });

  it("detects a row winner", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 0 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 1, cell_j: 0 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 1, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 2 });
    });

    expect(result.current.winner).toBe("X");
  });

  it("detects a col winner", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 0 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 1, cell_j: 0 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 1, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 2, cell_j: 0 });
    });

    expect(result.current.winner).toBe("X");
  });

  it("detects a diagonal winner", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 0 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 1, cell_j: 1 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 2 });
    });
    act(() => {
      result.current.makeMove({ cell_i: 2, cell_j: 2 });
    });

    expect(result.current.winner).toBe("X");
  });

  it("handles restart game correctly", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove({ cell_i: 0, cell_j: 0 });
    });

    expect(result.current.ticTacToe[0][0]).toBe("X");

    act(() => {
      result.current.restartGame();
    });

    expect(result.current.ticTacToe).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });
});
