import "./App.css";

import { useState, useEffect, useRef } from "react";
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
  const [serverError, setServerError] = useState<string>("");

  const pointerPosition = usePointerPosition();
  const pointerPositionRef = useRef(pointerPosition);

  // Keep ref updated without triggering other effects
  useEffect(() => {
    pointerPositionRef.current = pointerPosition;
  }, [pointerPosition]);

  const { sendClientRequest, latestMessage, connectionStatus } =
    useServerCommunication(username);

  useEffect(() => {
    if (username && connectionStatus === "Open" && !isSearching && !opponent) {
      setIsSearching(true);
      sendClientRequest({ action: "start-game" });
    }
  }, [username, connectionStatus, isSearching, opponent]);

  useEffect(() => {
    if (!latestMessage) return;

    if (latestMessage.action === "connect" && !latestMessage.status) {
      setServerError(latestMessage.message || "Connection failed");
      setUsername("");
    } else if (latestMessage.action === "start-game") {
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
    if (!opponent || !mySymbol) return;

    // Send the latest pointer position at a fixed interval to prevent flooding
    const interval = setInterval(() => {
      sendClientRequest({
        action: "pointer-position",
        x: pointerPositionRef.current.x,
        y: pointerPositionRef.current.y,
      });
    }, 50); // e.g., 20 times a second

    return () => clearInterval(interval);
  }, [opponent, mySymbol, sendClientRequest]);

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
                    <div key={i} style={{ display: "contents" }}>
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
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <StartGameForm
            finalUsername={username}
            setFinalUsername={(val) => {
              setServerError("");
              setUsername(val);
            }}
            serverError={serverError}
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
