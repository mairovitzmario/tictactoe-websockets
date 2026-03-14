/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface MakeMoveReq {
  action?: "make-move";
  x: number;
  y: number;
  symbol: "O" | "X";
}
export interface PairUserReq {
  action?: "pair";
  opponent: string;
}
export interface PointerPositionReq {
  action?: "pointer-position";
  x: number;
  y: number;
}
export interface StartGameReq {
  action?: "start-game";
}
export interface StartGameRes {
  action?: "start-game";
  opponent: string;
  symbol: "O" | "X";
}
export interface WebSocketConnectRes {
  action?: "connect";
  status: boolean;
  message: string | null;
}
