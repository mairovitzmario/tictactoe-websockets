import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type {
  StartGameReq,
  PairUserReq,
  MakeMoveReq,
  PointerPositionReq,
  StartGameRes,
  WebSocketConnectRes,
} from "../shared/models";

export type ClientRequest =
  | StartGameReq
  | PairUserReq
  | MakeMoveReq
  | PointerPositionReq;

export type ServerMessage =
  | StartGameRes
  | WebSocketConnectRes
  | MakeMoveReq
  | PointerPositionReq;

export default function useServerCommunication(username: string) {
  const [latestMessage, setLatestMessage] = useState<ServerMessage | null>(
    null,
  );
  const socketUrl = username ? `ws://localhost:8000/ws/${username}` : null;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const response: ServerMessage = JSON.parse(lastMessage.data);
        console.log("Parsed server message:", response);
        setLatestMessage(response);
      } catch (err) {
        console.error("Failed to parse message", err);
      }
    }
  }, [lastMessage]);

  const sendClientRequest = useCallback(
    (request: ClientRequest) => {
      sendMessage(JSON.stringify(request));
    },
    [sendMessage],
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return { sendClientRequest, latestMessage, connectionStatus };
}
