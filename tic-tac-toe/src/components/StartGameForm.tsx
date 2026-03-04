import { useState, type ChangeEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import styles from "./StartGameForm.module.css";
import useServerCommunication from "../hooks/useServerCommunication";

type RoomChoiceType = "create" | "join";
const MAX_INPUT_CHARS = 20;

export default function StartGameModal() {
  const [roomChoice, setRoomChoice] = useState<RoomChoiceType>("create");
  const [username, setUsername] = useState<string>("");
  const [friend, setFriend] = useState<string>("");

  const { handleClickSendMessage } = useServerCommunication("mario");

  function onJoinRoomClick() {
    if (roomChoice == "create") {
      setRoomChoice("join");
    } else {
      //...
    }
  }

  function onInputChange(
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    setState: Dispatch<SetStateAction<string>>,
  ) {
    if (e.target.value.length < MAX_INPUT_CHARS) {
      setState(e.target.value);
    }
  }

  return (
    <form
      className={styles["start-game-form"]}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles["input-wrapper"]}>
        <label htmlFor="username">Enter your username</label>
        <input
          value={username}
          onChange={(e) => onInputChange(e, setUsername)}
          name="username"
          id="username"
        />
      </div>
      {roomChoice === "join" ? (
        <div className={styles["input-wrapper"]}>
          <label htmlFor="friend">Enter your friend's username</label>
          <input
            value={friend}
            onChange={(e) => onInputChange(e, setFriend)}
            name="friend"
            id="friend"
          />
        </div>
      ) : (
        <button onClick={handleClickSendMessage}>Create a Room</button>
      )}

      <button
        onClick={onJoinRoomClick}
      >{`Join ${roomChoice === "create" ? "a Room" : friend}`}</button>
    </form>
  );
}
