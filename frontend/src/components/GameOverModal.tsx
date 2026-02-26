import type { CellType } from "../utils/types";
import type { RefObject } from "react";

import "./GameOverModal.module.css";

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    "command-for"?: string;
    command?: string;
  }
}

type GameOverModalProps = {
  winner: CellType;
  modalRef: RefObject<HTMLDialogElement | null>;
  onPlayAgain: () => void;
};

export default function GameOverModal({
  winner,
  modalRef,
  onPlayAgain,
}: GameOverModalProps) {
  return (
    <dialog id="game-over" ref={modalRef}>
      <div>
        <h2>{winner != 0 ? `${winner} won!` : "Tie!"}</h2>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </dialog>
  );
}
