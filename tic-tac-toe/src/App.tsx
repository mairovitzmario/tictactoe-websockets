import "./App.css";

import { useState } from "react";
import GameOverModal from "./components/GameOverModal";
import MouseIndicator from "./components/MouseIndicator";
import usePointerPosition from "./hooks/usePointerPosition";
import useTicTacToe from "./hooks/useTicTactoe";
import StartGameForm from "./components/StartGameForm";

function App() {
  const {
    makeMove,
    ticTacToe,
    modalRef: gameOverModalRef,
    nextMove,
    winner,
    restartGame,
  } = useTicTacToe();
  const [username, setUsername] = useState<string>("");
  const pointerPosition = usePointerPosition();

  return (
    <>
      {/* <MouseIndicator pointerPosition={pointerPosition} label="Mario" /> */}
      <main>
        <h1 className="title">
          <span className="tic">Tic</span>
          <span className="tac">Tac</span>
          <span className="toe">Toe</span>
        </h1>

        {username ? (
          <div className="game-wrapper">
            <h2 style={{ textAlign: nextMove == "X" ? "start" : "end" }}>
              {nextMove} to move
            </h2>
            <div className="tic-tac-toe">
              {ticTacToe.map((row, i) => (
                <>
                  {row.map((cell, j) => (
                    <button
                      className={`cell ${cell == 0 && "empty"}`}
                      key={i * j + j}
                      onClick={
                        cell == 0
                          ? () => makeMove({ cell_i: i, cell_j: j })
                          : () => {}
                      }
                    >
                      {cell != 0 && cell}
                    </button>
                  ))}
                </>
              ))}
            </div>
          </div>
        ) : (
          <StartGameForm
            finalUsername={username}
            setFinalUsername={setUsername}
          />
        )}
        <GameOverModal
          winner={winner}
          modalRef={gameOverModalRef}
          onPlayAgain={restartGame}
        />
      </main>
    </>
  );
}

export default App;
