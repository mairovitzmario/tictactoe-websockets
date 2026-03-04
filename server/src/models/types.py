from typing import TypedDict
from fastapi import WebSocket

 
class ConnectionEntry(TypedDict):
    pair: str
    socket: WebSocket