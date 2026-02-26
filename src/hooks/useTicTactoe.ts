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
  const modalRef = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    if (!ticTacToe.flat().includes(0)) {
      console.log(ticTacToe);
      modalRef.current?.showModal();
      setTicTacToe(startGrid);
    }
  }, [ticTacToe]);

  return { handleCellClick, ticTacToe, nextMove, modalRef };
}
