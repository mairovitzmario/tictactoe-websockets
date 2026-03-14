import "./App.css";

import { useState, useEffect } from "react";
import GameOverModal from "./components/GameOverModal";
import MouseIndicator from "./components/MouseIndicator";
import usePointerPosition from "./hooks/usePointerPosition";
import useTicTacToe from "./hooks/useTicTactoe";
import StartGameForm from "./components/StartGameForm";
import useServerCommunication from "./hooks/useServerCommunication";

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
  const [opponent, setOpponent] = useState<string>("");
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);
  const [opponentPointer, setOpponentPointer] = useState({ x: -100, y: -100 });
  const [isSearching, setIsSearching] = useState(false);

  const pointerPosition = usePointerPosition();
  const { sendClientRequest, latestMessage, connectionStatus } =
    useServerCommunication(username || "guest");

  useEffect(() => {
    if (username && connectionStatus === "Open" && !isSearching && !opponent) {
      setIsSearching(true);
      sendClientRequest({ action: "start-game" });
    }
  }, [username, connectionStatus, isSearching, opponent]);

  useEffect(() => {
    if (!latestMessage) return;

    if (latestMessage.action === "start-game") {
      setOpponent(latestMessage.opponent);
      setMySymbol(latestMessage.symbol);
      setIsSearching(false);
      restartGame();
    } else if (latestMessage.action === "make-move") {
      makeMove({ cell_i: latestMessage.x, cell_j: latestMessage.y });
    } else if (latestMessage.action === "pointer-position") {
      setOpponentPointer({ x: latestMessage.x, y: latestMessage.y });
    }
  }, [latestMessage]);

  useEffect(() => {
    if (opponent && mySymbol) {
      sendClientRequest({
        action: "pointer-position",
        x: pointerPosition.x,
        y: pointerPosition.y,
      });
    }
  }, [pointerPosition.x, pointerPosition.y, opponent, mySymbol]);

  const handleCellClick = (i: number, j: number) => {
    if (nextMove === mySymbol && !winner) {
      makeMove({ cell_i: i, cell_j: j });
      sendClientRequest({ action: "make-move", x: i, y: j, symbol: mySymbol });
    }
  };

  return (
    <>
      {opponent && (
        <MouseIndicator pointerPosition={opponentPointer} label={opponent} />
      )}
      <main>
        <h1 className="title">
          <span className="tic">Tic</span>
          <span className="tac">Tac</span>
          <span className="toe">Toe</span>
        </h1>

        {username ? (
          <div className="game-wrapper">
            {!opponent ? (
              <h2>Searching for opponent...</h2>
            ) : (
              <>
                <h2 style={{ textAlign: nextMove == "X" ? "start" : "end" }}>
                  {nextMove} to move{" "}
                  {mySymbol === nextMove ? "(You)" : `(${opponent})`}
                </h2>
                <div className="tic-tac-toe">
                  {ticTacToe.map((row, i) => (
                    <>
                      {row.map((cell, j) => (
                        <button
                          className={`cell ${cell == 0 && "empty"}`}
                          key={i * j + j}
                          onClick={
                            cell == 0 ? () => handleCellClick(i, j) : () => {}
                          }
                        >
                          {cell != 0 && cell}
                        </button>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}
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
          onPlayAgain={() => {
            setOpponent("");
          }}
        />
      </main>
    </>
  );
}

export default App;
