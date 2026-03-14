import { useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import z from "zod";

type RoomChoiceType = "create" | "join";
const MAX_INPUT_CHARS = 20;
const MIN_INPUT_CHARS = 3;

const UsernameSchema = z
  .string()
  .max(MAX_INPUT_CHARS, {
    message: `Username must have at most ${MAX_INPUT_CHARS} letters.`,
  })
  .min(MIN_INPUT_CHARS, {
    message: `Username must have at least ${MIN_INPUT_CHARS} letters.`,
  });

export default function useGameInit(
  setFinalUsername?: (username: string) => void,
) {
  const [roomChoice, setRoomChoice] = useState<RoomChoiceType>("create");
  const [username, setUsername] = useState<string>("");
  const [friend, setFriend] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [friendError, setFriendError] = useState<string>("");

  function validateUsername(
    value: string,
    errorSetter: Dispatch<SetStateAction<string>>,
  ) {
    const usernameResult = UsernameSchema.safeParse(value);
    const tempError = usernameResult.success
      ? ""
      : JSON.parse(usernameResult.error.message)[0]["message"].toString();
    errorSetter(tempError);

    return usernameResult.success;
  }

  function onJoinRoomClick() {
    if (roomChoice == "create") {
      const isUsernameValid = validateUsername(username, setUsernameError);
      if (isUsernameValid) {
        setRoomChoice("join");
      }
    } else {
      const isFriendsUsernameValid = validateUsername(friend, setFriendError);

      if (isFriendsUsernameValid) {
        setFinalUsername?.(username || friend);
      }
    }
  }

  function onCreateRoomClick() {
    const isUsernameValid = validateUsername(username, setUsernameError);
    if (isUsernameValid) {
      setFinalUsername?.(username);
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

  return {
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
  };
}
