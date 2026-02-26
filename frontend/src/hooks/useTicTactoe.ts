import type { CellType } from "../utils/types";
import { useState, useEffect, useRef } from "react";

export default function useTicTacToe() {
  const startGrid: CellType[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [ticTacToe, setTicTacToe] = useState<CellType[][]>(startGrid);
  const [nextMove, setNextMove] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<CellType>(0);
  const modalRef = useRef<HTMLDialogElement>(null);

  function getWinner(arr: CellType[][]) {
    // row + col
    for (let i = 0; i < 3; i++) {
      const possibleWinnerRow = arr[i][0];
      const possibleWinnerCol = arr[0][i];
      let [okRow, okCol] = [true, true];

      for (let j = 1; j < 3; j++) {
        if (arr[i][j] != possibleWinnerRow) okRow = false;
        if (arr[j][i] != possibleWinnerCol) okCol = false;
      }

      if (okRow === true && possibleWinnerRow !== 0) return possibleWinnerRow;
      if (okCol === true && possibleWinnerCol !== 0) return possibleWinnerCol;
    }

    // diag
    if (arr[0][0] === arr[1][1] && arr[1][1] === arr[2][2] && arr[0][0] !== 0)
      return arr[0][0];
    if (arr[0][2] === arr[1][1] && arr[1][1] === arr[2][0] && arr[0][2] !== 0)
      return arr[0][2];
    return 0;
  }

  function handleCellClick({
    cell_i,
    cell_j,
  }: {
    cell_i: number;
    cell_j: number;
  }) {
    setTicTacToe(
      ticTacToe.map((row, i) => {
        if (i == cell_i) {
          return row.map((cell, j) => {
            if (j == cell_j) return nextMove;
            else return cell;
          });
        } else return row;
      }),
    );

    if (nextMove == "O") setNextMove("X");
    else setNextMove("O");
  }

  function restartGame() {
    modalRef.current?.close();
    setTicTacToe(startGrid);
  }

  // Check if game has ended
  useEffect(() => {
    const roundWinner = getWinner(ticTacToe);
    console.log(roundWinner);
    if (roundWinner || !ticTacToe.flat().includes(0)) {
      setWinner(roundWinner);
      modalRef.current?.showModal();
    }
  }, [ticTacToe]);

  return {
    handleCellClick,
    ticTacToe,
    nextMove,
    modalRef,
    winner,
    restartGame,
  };
}
