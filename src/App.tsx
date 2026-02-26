import "./App.css";

import GameOverModal from "./components/GameOverModal";
import useTicTacToe from "./hooks/useTicTactoe";

function App() {
  const { handleCellClick, ticTacToe, modalRef, nextMove } = useTicTacToe();

  return (
    <main>
      <h1 className="title">
        <span className="tic">Tic</span>
        <span className="tac">Tac</span>
        <span className="toe">Toe</span>
      </h1>

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
                      ? () => handleCellClick({ cell_i: i, cell_j: j })
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
      <GameOverModal winner={0} modalRef={modalRef} />
    </main>
  );
}

export default App;
