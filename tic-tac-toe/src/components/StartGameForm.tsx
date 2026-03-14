import type { Dispatch, SetStateAction } from "react";
import styles from "./StartGameForm.module.css";
import TextInput from "./TextInput";
import useGameInit from "../hooks/useGameInit";

export default function StartGameModal({
  setFinalUsername,
  serverError,
}: {
  finalUsername: string;
  setFinalUsername: Dispatch<SetStateAction<string>>;
  serverError?: string;
}) {
  const {
    roomChoice,
    username,
    friend,
    usernameError,
    friendError,
    onCreateRoomClick,
    onInputChange,
    onJoinRoomClick,
    setUsername,
    setFriend,
  } = useGameInit(setFinalUsername);

  return (
    <form
      className={styles["start-game-form"]}
      onSubmit={(e) => e.preventDefault()}
    >
      <TextInput
        label="Enter your username"
        value={username}
        onChange={(e) => onInputChange(e, setUsername)}
        name="username"
        id="username"
        disabled={roomChoice === "join"}
        error={usernameError || serverError}
      />
      {roomChoice === "join" ? (
        <TextInput
          label="Enter your friend's username"
          value={friend}
          onChange={(e) => onInputChange(e, setFriend)}
          name="friend"
          id="friend"
          error={friendError}
        />
      ) : (
        <button onClick={onCreateRoomClick}>Create a Room</button>
      )}

      <button
        onClick={onJoinRoomClick}
      >{`Join ${roomChoice === "create" ? "a Room" : friend}`}</button>
    </form>
  );
}
