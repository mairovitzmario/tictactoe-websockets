import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function useServerCommunication(username: string) {
  //   const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const socketUrl = `ws://localhost:8000/ws/${username}`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      //   setMessageHistory((prev) => prev.concat(lastMessage));
      console.log(lastMessage);
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return { handleClickSendMessage };
}
